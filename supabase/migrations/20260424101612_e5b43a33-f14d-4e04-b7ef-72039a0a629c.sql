
-- ===== ENUMS =====
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');
CREATE TYPE public.order_status AS ENUM ('en_attente', 'payee', 'en_preparation', 'expediee', 'livree', 'annulee');
CREATE TYPE public.transaction_status AS ENUM ('initiee', 'reussie', 'echouee', 'remboursee');
CREATE TYPE public.payment_provider AS ENUM ('moncash', 'natcash', 'cash', 'autre');

-- ===== UPDATED_AT TRIGGER FUNCTION =====
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ===== USER ROLES =====
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===== CATEGORIES =====
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== PRODUCTS =====
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  currency TEXT NOT NULL DEFAULT 'GDES',
  image_url TEXT,
  alt_text TEXT,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(is_active);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== PROFILES =====
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles select own or admin" ON public.profiles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Profiles insert own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Profiles update own or admin" ON public.profiles FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Profiles delete own or admin" ON public.profiles FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile + customer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== ADDRESSES =====
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  department TEXT,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'Haïti',
  instructions TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_addresses_user ON public.addresses(user_id);
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Addresses select own or admin" ON public.addresses FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Addresses insert own" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Addresses update own" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Addresses delete own" ON public.addresses FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_addresses_updated BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== ORDERS =====
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE DEFAULT ('SAM-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 8)),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status order_status NOT NULL DEFAULT 'en_attente',
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'GDES',
  shipping_address JSONB,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders select own or admin" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Orders insert own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Orders update admin only" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Orders delete admin only" ON public.orders FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== ORDER ITEMS =====
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order items select via order" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Order items insert via order" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Order items admin manage" ON public.order_items FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Order items admin delete" ON public.order_items FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- ===== TRANSACTIONS =====
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider payment_provider NOT NULL,
  provider_reference TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GDES',
  status transaction_status NOT NULL DEFAULT 'initiee',
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_transactions_order ON public.transactions(order_id);
CREATE INDEX idx_transactions_user ON public.transactions(user_id);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Transactions select own or admin" ON public.transactions FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Transactions insert own" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Transactions update admin" ON public.transactions FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Transactions delete admin" ON public.transactions FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_transactions_updated BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== SEED DATA =====
INSERT INTO public.categories (slug, name, description, display_order) VALUES
  ('saint-valentin', 'Saint-Valentin', 'Bouquets romantiques pour célébrer l''amour', 1),
  ('mariage', 'Mariage', 'Compositions élégantes pour le plus beau jour', 2),
  ('anniversaire', 'Anniversaire', 'Bouquets festifs pour souhaiter un joyeux anniversaire', 3),
  ('deuil', 'Deuil & Sympathie', 'Compositions sobres pour exprimer vos condoléances', 4),
  ('luxe', 'Édition Luxe', 'Bouquets premium et cadeaux exclusifs', 5);

INSERT INTO public.products (slug, name, description, price, image_url, alt_text, stock, category_id, is_active)
SELECT 'romance-rouge', 'Romance Rouge', 'Bouquet de roses rouges intenses avec gypsophile, idéal pour déclarations et demandes en mariage.', 12000, '/src/assets/bouquet-romance.jpg', 'Bouquet Romance Rouge', 25, id, true FROM public.categories WHERE slug='saint-valentin'
UNION ALL SELECT 'douceur-samayoo', 'Douceur Samayoo', 'Bouquet d''anniversaire emballage lavande avec ballon Happy Birthday.', 19000, '/src/assets/bouquet-douceur.jpg', 'Bouquet Douceur', 15, id, true FROM public.categories WHERE slug='anniversaire'
UNION ALL SELECT 'elegance', 'Élégance', 'Box ronde « Just for you » garnie de roses rouges et chocolats Ferrero.', 33000, '/src/assets/bouquet-elegance.jpg', 'Box Élégance', 10, id, true FROM public.categories WHERE slug='luxe'
UNION ALL SELECT 'ma-bouteille', 'Ma Bouteille', 'Coffret bouteille de vin accompagnée de roses rouges et d''un médaillon doré.', 7000, '/src/assets/bouquet-bouteille.jpg', 'Coffret Ma Bouteille', 20, id, true FROM public.categories WHERE slug='saint-valentin'
UNION ALL SELECT 'ame-soeur', 'Âme Sœur', 'Bracelets de couple yin & yang en perles, symbole d''union et de complicité.', 17000, '/src/assets/bouquet-amesoeur.jpg', 'Bracelets Âme Sœur', 30, id, true FROM public.categories WHERE slug='saint-valentin'
UNION ALL SELECT 'amour-eternel', 'Amour Éternel', 'Box transparente en forme de cœur, roses rouges et tiroir de Ferrero Rocher.', 19000, '/src/assets/bouquet-eternel.jpg', 'Box Amour Éternel', 12, id, true FROM public.categories WHERE slug='mariage'
UNION ALL SELECT 'soleil-tropical', 'Soleil Tropical', 'Bouquet vibrant tournesol, roses et alstroemerias dans un emballage rouge « Love ».', 15000, '/src/assets/bouquet-tournesol.jpg', 'Bouquet Soleil Tropical', 18, id, true FROM public.categories WHERE slug='anniversaire'
UNION ALL SELECT 'edition-luxe', 'Édition Luxe', 'Bouquet enveloppé d''un wrapping luxe monogramme noir et nœud signature.', 25000, '/src/assets/bouquet-luxe.jpg', 'Bouquet Édition Luxe', 8, id, true FROM public.categories WHERE slug='luxe'
UNION ALL SELECT 'money-bouquet', 'Bouquets Argent', 'Composition originale en billets pliés en pétales façon dahlia, ornée d''un papillon doré.', 28000, '/src/assets/bouquet-billets.jpg', 'Bouquets Argent', 5, id, true FROM public.categories WHERE slug='luxe';
