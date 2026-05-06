
-- Create artisanat table
CREATE TABLE IF NOT EXISTS public.artisanat (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.artisanat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read artisanat" ON public.artisanat FOR SELECT USING (true);
CREATE POLICY "Anyone can insert artisanat" ON public.artisanat FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update artisanat" ON public.artisanat FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete artisanat" ON public.artisanat FOR DELETE USING (true);

CREATE TRIGGER update_artisanat_updated_at
BEFORE UPDATE ON public.artisanat
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate hardcoded bouquets into products
INSERT INTO public.products (name, description, price, category, image_url, stock) VALUES
('Romance Rouge','Bouquet de roses rouges intenses avec gypsophile, idéal pour déclarations et demandes en mariage.',12000,'Saint-Valentin','/src/assets/bouquet-romance.jpg',10),
('Douceur Samayoo','Bouquet d''anniversaire emballage lavande avec ballon Happy Birthday, parfait pour célébrer un être cher.',19000,'Anniversaire','/src/assets/bouquet-douceur.jpg',10),
('Élégance','Box ronde « Just for you » garnie de roses rouges et chocolats Ferrero — un cadeau premium inoubliable.',33000,'Saint-Valentin','/src/assets/bouquet-elegance.jpg',10),
('Ma Bouteille','Coffret bouteille de vin accompagnée de roses rouges et d''un médaillon doré, pour offrir avec amour.',7000,'Événement','/src/assets/bouquet-bouteille.jpg',10),
('Âme Sœur','Bracelets de couple yin & yang en perles, symbole d''union et de complicité.',17000,'Saint-Valentin','/src/assets/bouquet-amesoeur.jpg',10),
('Amour Éternel','Box transparente en forme de cœur, roses rouges et tiroir de Ferrero Rocher — l''expression ultime de l''amour.',19000,'Mariage','/src/assets/bouquet-eternel.jpg',10),
('Soleil Tropical','Bouquet vibrant tournesol, roses et alstroemerias dans un emballage rouge « Love » — éclat garanti.',15000,'Fête des Mères','/src/assets/bouquet-tournesol.jpg',10),
('Édition Luxe','Bouquet enveloppé d''un wrapping luxe monogramme noir et nœud signature, pour les grandes occasions.',25000,'Mariage','/src/assets/bouquet-luxe.jpg',10),
('Pack Célébration Argent','Composition originale en billets pliés en pétales façon dahlia, ornée d''un papillon doré.',28000,'Pack Célébration','/src/assets/bouquet-billets.jpg',10);

-- Migrate hardcoded artisanats
INSERT INTO public.artisanat (name, description, price, category, image_url, stock) VALUES
('Pochette « HAITI »','Pochette à bandoulière au design coloré illustrant la culture haïtienne — accessoire chic et patriotique.',4500,'Accessoire','/src/assets/artisanat-pochette-haiti.jpg',5),
('Mug Drapeau d''Haïti','Mug en céramique aux couleurs du drapeau haïtien avec armoiries — pour savourer son café avec fierté.',1500,'Mug','/src/assets/artisanat-mug-drapeau.jpg',10),
('Tableau « Cadeau d''Évasion »','Grand tableau décoratif représentant une cascade dorée d''Haïti.',12000,'Décoration','/src/assets/artisanat-tableau-cascade.jpg',3),
('Mug Cascade Tropicale','Mug en céramique imprimé d''une cascade turquoise haïtienne.',1500,'Mug','/src/assets/artisanat-mug-cascade.jpg',10),
('Mug Citadelle Laferrière','Mug en céramique à l''effigie de la majestueuse Citadelle Laferrière.',1800,'Mug','/src/assets/artisanat-mug-citadelle.jpg',10),
('Porte-clés Armoiries d''Haïti','Porte-clés émaillé aux armoiries d''Haïti avec breloques voilier et palmier.',1200,'Souvenir','/src/assets/artisanat-porte-cles.jpg',20);

-- Storage bucket for product/artisanat photos
INSERT INTO storage.buckets (id, name, public) VALUES ('flower-storage','flower-storage', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read flower-storage" ON storage.objects FOR SELECT USING (bucket_id = 'flower-storage');
CREATE POLICY "Public upload flower-storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'flower-storage');
CREATE POLICY "Public update flower-storage" ON storage.objects FOR UPDATE USING (bucket_id = 'flower-storage');
CREATE POLICY "Public delete flower-storage" ON storage.objects FOR DELETE USING (bucket_id = 'flower-storage');
