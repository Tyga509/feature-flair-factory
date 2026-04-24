import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BouquetCard } from "@/components/BouquetCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { resolveProductImage } from "@/data/productImages";
import type { Bouquet } from "@/data/bouquets";

export const Route = createFileRoute("/boutique")({
  head: () => ({
    meta: [
      { title: "Boutique — SAMAYOO FLOWERS" },
      { name: "description", content: "Découvrez notre catalogue de bouquets, compositions et cadeaux floraux." },
      { property: "og:title", content: "Boutique — SAMAYOO FLOWERS" },
      { property: "og:description", content: "Catalogue complet des bouquets et créations Samayoo Flowers." },
    ],
  }),
  component: BoutiquePage,
  errorComponent: ({ error }) => (
    <div className="px-4 py-16 text-center">
      <p className="text-destructive">Erreur de chargement : {error.message}</p>
    </div>
  ),
  notFoundComponent: () => <div className="px-4 py-16 text-center">Page introuvable.</div>,
});

type Category = { id: string; slug: string; name: string; display_order: number };
type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  alt_text: string | null;
  category_id: string | null;
  is_active: boolean;
};

function toBouquet(p: ProductRow): Bouquet {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    price: Number(p.price),
    image: resolveProductImage(p.slug, p.image_url),
    alt: p.alt_text ?? p.name,
  };
}

function BoutiquePage() {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const router = useRouter();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, slug, name, display_order")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });

  const productsQuery = useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      let q = supabase
        .from("products")
        .select("id, slug, name, description, price, image_url, alt_text, category_id, is_active")
        .eq("is_active", true)
        .order("price", { ascending: true });
      if (categoryId) q = q.eq("category_id", categoryId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as ProductRow[];
    },
  });

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-10 animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Catalogue</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">Notre Boutique</h1>
          <p className="mt-4 text-muted-foreground italic max-w-xl mx-auto">
            Si les mots ne sortent pas, dites-les plutôt avec des fleurs.
          </p>
        </header>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Button
            size="sm"
            variant={categoryId === null ? "default" : "outline"}
            onClick={() => setCategoryId(null)}
            className="rounded-full"
          >
            Tous
          </Button>
          {categoriesQuery.data?.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={categoryId === c.id ? "default" : "outline"}
              onClick={() => setCategoryId(c.id)}
              className="rounded-full"
            >
              {c.name}
            </Button>
          ))}
        </div>

        {productsQuery.isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[420px] rounded-2xl" />
            ))}
          </div>
        ) : productsQuery.error ? (
          <div className="text-center py-16">
            <p className="text-destructive mb-4">
              Impossible de charger les produits : {(productsQuery.error as Error).message}
            </p>
            <Button onClick={() => router.invalidate()}>Réessayer</Button>
          </div>
        ) : (productsQuery.data?.length ?? 0) === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            Aucun produit disponible dans cette catégorie pour le moment.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productsQuery.data!.map((p) => (
              <BouquetCard key={p.id} bouquet={toBouquet(p)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
