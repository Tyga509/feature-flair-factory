import romance from "@/assets/bouquet-romance.jpg";
import douceur from "@/assets/bouquet-douceur.jpg";
import elegance from "@/assets/bouquet-elegance.jpg";
import bouteille from "@/assets/bouquet-bouteille.jpg";
import amesoeur from "@/assets/bouquet-amesoeur.jpg";
import eternel from "@/assets/bouquet-eternel.jpg";

export type Bouquet = {
  id: string;
  name: string;
  description: string;
  price: number; // in GDES
  image: string;
  alt: string;
};

export const bouquets: Bouquet[] = [
  {
    id: "romance-rouge",
    name: "Romance Rouge",
    description: "Bouquet de roses intenses, idéal pour déclarations et occasions romantiques.",
    price: 12000,
    image: romance,
    alt: "Bouquet Romance Rouge - roses rouges et roses",
  },
  {
    id: "douceur-samayoo",
    name: "Douceur Samayoo",
    description: "Arrangement tendre et lumineux, parfait pour anniversaires et félicitations.",
    price: 19000,
    image: douceur,
    alt: "Bouquet Douceur Samayoo - roses pastel",
  },
  {
    id: "elegance",
    name: "Élégance",
    description: "Composition de bouquets argentés, pour anniversaires et cadeaux premium.",
    price: 33000,
    image: elegance,
    alt: "Bouquet Élégance - composition argentée",
  },
  {
    id: "ma-bouteille",
    name: "Ma Bouteille",
    description: "Bouteilles de vins emballées avec élégance pour offrir à un être cher.",
    price: 7000,
    image: bouteille,
    alt: "Bouteille de vin emballée avec fleurs",
  },
  {
    id: "ame-soeur",
    name: "Âme Sœur",
    description: "Bracelet de couple pour transmettre joie et soutien.",
    price: 17000,
    image: amesoeur,
    alt: "Bracelets de couple Âme Sœur",
  },
  {
    id: "amour-eternel",
    name: "Amour Éternel",
    description: "Bouquet romantique et sophistiqué pour un message fort et sincère.",
    price: 19000,
    image: eternel,
    alt: "Bouquet Amour Éternel - roses rouges et roses",
  },
];

export const formatPrice = (gdes: number) =>
  `${gdes.toLocaleString("fr-FR")} GDES`;
