
-- CLIENTS
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  accept_marketing BOOLEAN NOT NULL DEFAULT false,
  is_banned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Anyone insert clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update clients" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Anyone delete clients" ON public.clients FOR DELETE USING (true);
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  payment_method TEXT,
  payment_proof_url TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  dedicace BOOLEAN NOT NULL DEFAULT false,
  livraison BOOLEAN NOT NULL DEFAULT false,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'en_attente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Anyone insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Anyone delete orders" ON public.orders FOR DELETE USING (true);
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- COULISSES VIDEOS
CREATE TABLE IF NOT EXISTS public.coulisses_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'preparation',
  video_url TEXT NOT NULL,
  poster_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coulisses_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read coulisses" ON public.coulisses_videos FOR SELECT USING (true);
CREATE POLICY "Anyone insert coulisses" ON public.coulisses_videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update coulisses" ON public.coulisses_videos FOR UPDATE USING (true);
CREATE POLICY "Anyone delete coulisses" ON public.coulisses_videos FOR DELETE USING (true);
CREATE TRIGGER trg_coulisses_updated BEFORE UPDATE ON public.coulisses_videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
