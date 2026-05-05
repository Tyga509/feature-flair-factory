
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products"
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Anyone can insert products"
  ON public.products FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON public.products FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete products"
  ON public.products FOR DELETE USING (true);

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_name ON public.products(name);
