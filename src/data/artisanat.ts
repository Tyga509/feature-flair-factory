import pochette from "@/assets/artisanat-pochette-haiti.jpg";
import mugDrapeau from "@/assets/artisanat-mug-drapeau.jpg";
import tableauCascade from "@/assets/artisanat-tableau-cascade.jpg";
import mugCascade from "@/assets/artisanat-mug-cascade.jpg";
import mugCitadelle from "@/assets/artisanat-mug-citadelle.jpg";
import porteCles from "@/assets/artisanat-porte-cles.jpg";

export type Artisanat = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  alt: string;
};

export const artisanats: Artisanat[] = [
  {
    id: "pochette-haiti",
    name: "Pochette « HAITI »",
    description:
      "Pochette à bandoulière au design coloré illustrant la culture haïtienne — accessoire chic et patriotique pour sortir avec style.",
    price: 4500,
    image: pochette,
    alt: "Pochette à bandoulière motif Haïti coloré",
  },
  {
    id: "mug-drapeau",
    name: "Mug Drapeau d'Haïti",
    description:
      "Mug en céramique aux couleurs du drapeau haïtien avec armoiries — pour savourer son café avec fierté.",
    price: 1500,
    image: mugDrapeau,
    alt: "Mug en céramique drapeau d'Haïti",
  },
  {
    id: "tableau-cascade",
    name: "Tableau « Cadeau d'Évasion »",
    description:
      "Grand tableau décoratif représentant une cascade dorée d'Haïti — une œuvre apaisante pour sublimer votre intérieur.",
    price: 12000,
    image: tableauCascade,
    alt: "Grand tableau décoratif cascade Cadeau d'évasion",
  },
  {
    id: "mug-cascade",
    name: "Mug Cascade Tropicale",
    description:
      "Mug en céramique imprimé d'une cascade turquoise haïtienne — un voyage matinal à chaque gorgée.",
    price: 1500,
    image: mugCascade,
    alt: "Mug céramique cascade turquoise tropicale",
  },
  {
    id: "mug-citadelle",
    name: "Mug Citadelle Laferrière",
    description:
      "Mug en céramique à l'effigie de la majestueuse Citadelle Laferrière — patrimoine et fierté nationale.",
    price: 1800,
    image: mugCitadelle,
    alt: "Mug céramique Citadelle Laferrière Haïti",
  },
  {
    id: "porte-cles-haiti",
    name: "Porte-clés Armoiries d'Haïti",
    description:
      "Porte-clés émaillé aux armoiries d'Haïti avec breloques voilier et palmier — un souvenir authentique à emporter partout.",
    price: 1200,
    image: porteCles,
    alt: "Porte-clés émaillé armoiries d'Haïti avec breloques",
  },
];
