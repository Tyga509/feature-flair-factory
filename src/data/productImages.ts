import romance from "@/assets/bouquet-romance.jpg";
import douceur from "@/assets/bouquet-douceur.jpg";
import elegance from "@/assets/bouquet-elegance.jpg";
import bouteille from "@/assets/bouquet-bouteille.jpg";
import amesoeur from "@/assets/bouquet-amesoeur.jpg";
import eternel from "@/assets/bouquet-eternel.jpg";
import tournesol from "@/assets/bouquet-tournesol.jpg";
import luxe from "@/assets/bouquet-luxe.jpg";
import billets from "@/assets/bouquet-billets.jpg";
import artPochette from "@/assets/artisanat-pochette-haiti.jpg";
import artMugDrapeau from "@/assets/artisanat-mug-drapeau.jpg";
import artTableau from "@/assets/artisanat-tableau-cascade.jpg";
import artMugCascade from "@/assets/artisanat-mug-cascade.jpg";
import artMugCitadelle from "@/assets/artisanat-mug-citadelle.jpg";
import artPorteCles from "@/assets/artisanat-porte-cles.jpg";

// Map by basename of /src/assets/* paths used in DB seed.
const imageByBasename: Record<string, string> = {
  "bouquet-romance.jpg": romance,
  "bouquet-douceur.jpg": douceur,
  "bouquet-elegance.jpg": elegance,
  "bouquet-bouteille.jpg": bouteille,
  "bouquet-amesoeur.jpg": amesoeur,
  "bouquet-eternel.jpg": eternel,
  "bouquet-tournesol.jpg": tournesol,
  "bouquet-luxe.jpg": luxe,
  "bouquet-billets.jpg": billets,
  "artisanat-pochette-haiti.jpg": artPochette,
  "artisanat-mug-drapeau.jpg": artMugDrapeau,
  "artisanat-tableau-cascade.jpg": artTableau,
  "artisanat-mug-cascade.jpg": artMugCascade,
  "artisanat-mug-citadelle.jpg": artMugCitadelle,
  "artisanat-porte-cles.jpg": artPorteCles,
};

export function resolveProductImage(imageUrl: string | null | undefined): string {
  if (!imageUrl) return "";
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  const base = imageUrl.split("/").pop() ?? "";
  return imageByBasename[base] ?? imageUrl;
}
