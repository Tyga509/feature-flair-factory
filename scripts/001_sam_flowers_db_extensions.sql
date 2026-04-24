-- ============================================================
-- Sam_Flowers-BD : extensions du schéma
-- Ajoute les tables Artisanat, Galerie et le bucket storage
-- ============================================================

-- ===== ARTISANAT ITEMS =====
CREATE TABLE IF NOT EXISTS public.artisanat_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  currency TEXT NOT NULL DEFAULT 'GDES',
  image_url TEXT,
  alt_text TEXT,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_artisanat_active ON public.artisanat_items(is_active);

ALTER TABLE public.artisanat_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Artisanat public read" ON public.artisanat_items;
CREATE POLICY "Artisanat public read"
  ON public.artisanat_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Artisanat admin manage" ON public.artisanat_items;
CREATE POLICY "Artisanat admin manage"
  ON public.artisanat_items FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS trg_artisanat_updated ON public.artisanat_items;
CREATE TRIGGER trg_artisanat_updated
  BEFORE UPDATE ON public.artisanat_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== GALLERY IMAGES =====
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_published ON public.gallery_images(is_published);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery_images(category);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gallery public read" ON public.gallery_images;
CREATE POLICY "Gallery public read"
  ON public.gallery_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gallery admin manage" ON public.gallery_images;
CREATE POLICY "Gallery admin manage"
  ON public.gallery_images FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS trg_gallery_updated ON public.gallery_images;
CREATE TRIGGER trg_gallery_updated
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== STORAGE BUCKET : gallery =====
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public read pour le bucket "gallery"
DROP POLICY IF EXISTS "Gallery bucket public read" ON storage.objects;
CREATE POLICY "Gallery bucket public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

-- Les uploads, updates et deletes passent par le service_role (server functions)
-- côté admin, donc pas de policy pour les clients anonymes : RLS bloque par défaut.
