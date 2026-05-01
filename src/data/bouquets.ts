import romance from "@/assets/bouquet-romance.jpg";
import douceur from "@/assets/bouquet-douceur.jpg";
import elegance from "@/assets/bouquet-elegance.jpg";
import bouteille from "@/assets/bouquet-bouteille.jpg";
import amesoeur from "@/assets/bouquet-amesoeur.jpg";
import eternel from "@/assets/bouquet-eternel.jpg";
import tournesol from "@/assets/bouquet-tournesol.jpg";
import luxe from "@/assets/bouquet-luxe.jpg";
import billets from "@/assets/bouquet-billets.jpg";

export type BouquetCategory =
  | "Saint-Valentin"
  | "Anniversaire"
  | "Mariage"
  | "Fête des Mères"
  | "Événement"
  | "Pack Célébration";

export type Bouquet = {
  id: string;
  name: string;
  description: string;
  price: number; // in GDES
  image: string;
  alt: string;
  category: BouquetCategory;
};

export const bouquets: Bouquet[] = [
  {
    id: "romance-rouge",
    name: "Romance Rouge",
    description: "Bouquet de roses rouges intenses avec gypsophile, idéal pour déclarations et demandes en mariage.",
    price: 12000,
    image: romance,
    alt: "Bouquet Romance Rouge - roses rouges et gypsophile avec écrin",
    category: "Saint-Valentin",
  },
  {
    id: "douceur-samayoo",
    name: "Douceur Samayoo",
    description: "Bouquet d'anniversaire emballage lavande avec ballon Happy Birthday, parfait pour célébrer un être cher.",
    price: 19000,
    image: douceur,
    alt: "Bouquet Douceur - emballage violet avec ballon Happy Birthday",
    category: "Anniversaire",
  },
  {
    id: "elegance",
    name: "Élégance",
    description: "Box ronde « Just for you » garnie de roses rouges et chocolats Ferrero — un cadeau premium inoubliable.",
    price: 33000,
    image: elegance,
    alt: "Box Élégance - roses rouges et Ferrero Rocher",
    category: "Saint-Valentin",
  },
  {
    id: "ma-bouteille",
    name: "Ma Bouteille",
    description: "Coffret bouteille de vin accompagnée de roses rouges et d'un médaillon doré, pour offrir avec amour.",
    price: 7000,
    image: bouteille,
    alt: "Coffret Ma Bouteille - vin, roses rouges et chocolats",
    category: "Événement",
  },
  {
    id: "ame-soeur",
    name: "Âme Sœur",
    description: "Bracelets de couple yin & yang en perles, symbole d'union et de complicité.",
    price: 17000,
    image: amesoeur,
    alt: "Bracelets de couple Âme Sœur - perles yin yang",
    category: "Saint-Valentin",
  },
  {
    id: "amour-eternel",
    name: "Amour Éternel",
    description: "Box transparente en forme de cœur, roses rouges et tiroir de Ferrero Rocher — l'expression ultime de l'amour.",
    price: 19000,
    image: eternel,
    alt: "Box Amour Éternel - cœur de roses rouges et Ferrero",
    category: "Mariage",
  },
  {
    id: "soleil-tropical",
    name: "Soleil Tropical",
    description: "Bouquet vibrant tournesol, roses et alstroemerias dans un emballage rouge « Love » — éclat garanti.",
    price: 15000,
    image: tournesol,
    alt: "Bouquet Soleil Tropical - tournesol et roses colorées",
    category: "Fête des Mères",
  },
  {
    id: "edition-luxe",
    name: "Édition Luxe",
    description: "Bouquet enveloppé d'un wrapping luxe monogramme noir et nœud signature, pour les grandes occasions.",
    price: 25000,
    image: luxe,
    alt: "Bouquet Édition Luxe - emballage monogramme noir",
    category: "Mariage",
  },
  {
    id: "money-bouquet",
    name: "Pack Célébration Argent",
    description: "Composition originale en billets pliés en pétales façon dahlia, ornée d'un papillon doré — un Pack Célébration musical aussi chic que surprenant.",
    price: 28000,
    image: billets,
    alt: "Pack Célébration - billets pliés en pétales avec papillon doré",
    category: "Pack Célébration",
  },
];

export const formatPrice = (gdes: number) =>
  `${gdes.toLocaleString("fr-FR")} GDES`;
