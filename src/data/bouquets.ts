export type BouquetCategory =
  | "Saint-Valentin"
  | "Anniversaire"
  | "Mariage"
  | "Fête des Mères"
  | "Événement"
  | "Pack Célébration"
  | "Artisanat";

export type Bouquet = {
  id: string;
  name: string;
  description: string;
  price: number; // in GDES
  image: string;
  alt: string;
  category?: BouquetCategory;
};

export const formatPrice = (gdes: number) =>
  `${gdes.toLocaleString("fr-FR")} GDES`;
