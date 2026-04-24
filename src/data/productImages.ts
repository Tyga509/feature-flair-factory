import romance from "@/assets/bouquet-romance.jpg";
import douceur from "@/assets/bouquet-douceur.jpg";
import elegance from "@/assets/bouquet-elegance.jpg";
import bouteille from "@/assets/bouquet-bouteille.jpg";
import amesoeur from "@/assets/bouquet-amesoeur.jpg";
import eternel from "@/assets/bouquet-eternel.jpg";
import tournesol from "@/assets/bouquet-tournesol.jpg";
import luxe from "@/assets/bouquet-luxe.jpg";
import billets from "@/assets/bouquet-billets.jpg";

// Map product slugs to bundled images so seed rows with /src/assets/* paths still render.
export const productImageBySlug: Record<string, string> = {
  "romance-rouge": romance,
  "douceur-samayoo": douceur,
  elegance: elegance,
  "ma-bouteille": bouteille,
  "ame-soeur": amesoeur,
  "amour-eternel": eternel,
  "soleil-tropical": tournesol,
  "edition-luxe": luxe,
  "money-bouquet": billets,
};

export function resolveProductImage(slug: string, imageUrl: string | null): string {
  if (imageUrl && /^https?:\/\//.test(imageUrl)) return imageUrl;
  return productImageBySlug[slug] ?? imageUrl ?? "";
}
