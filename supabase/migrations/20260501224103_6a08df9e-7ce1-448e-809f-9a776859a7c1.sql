
-- Custom requests (Composez votre bonheur)
CREATE TABLE public.custom_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bouquet_type TEXT NOT NULL,
  support TEXT NOT NULL,
  colors TEXT NOT NULL,
  accessories TEXT,
  dedication TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit custom requests"
ON public.custom_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read custom requests"
ON public.custom_requests FOR SELECT
USING (true);

CREATE POLICY "Anyone can update custom requests"
ON public.custom_requests FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete custom requests"
ON public.custom_requests FOR DELETE
USING (true);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  formula TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  frequency TEXT NOT NULL DEFAULT 'monthly',
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON public.subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read subscriptions" ON public.subscriptions FOR SELECT USING (true);
CREATE POLICY "Anyone can update subscriptions" ON public.subscriptions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete subscriptions" ON public.subscriptions FOR DELETE USING (true);

-- Contracts (Grands Projets)
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE,
  budget NUMERIC(12,2),
  phone TEXT NOT NULL,
  email TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'quote_pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contracts" ON public.contracts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read contracts" ON public.contracts FOR SELECT USING (true);
CREATE POLICY "Anyone can update contracts" ON public.contracts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete contracts" ON public.contracts FOR DELETE USING (true);

-- Gallery items
CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gallery" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert gallery" ON public.gallery_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update gallery" ON public.gallery_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete gallery" ON public.gallery_items FOR DELETE USING (true);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_custom_requests_updated BEFORE UPDATE ON public.custom_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_subscriptions_updated BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_contracts_updated BEFORE UPDATE ON public.contracts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_gallery_items_updated BEFORE UPDATE ON public.gallery_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
