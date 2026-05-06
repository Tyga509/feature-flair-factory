import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { BouquetCard } from "@/components/BouquetCard";
import type { BouquetCategory, Bouquet } from "@/data/bouquets";
import { supabase } from "@/integrations/supabase/client";
import { resolveProductImage } from "@/data/productImages";
import { toast } from "sonner";

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
});

const categories: ("Tous" | BouquetCategory)[] = [
  "Tous", "Saint-Valentin", "Anniversaire", "Mariage", "Fête des Mères", "Événement", "Pack Célébration", "Artisanat",
];

const smartMap: { keywords: RegExp; category: BouquetCategory }[] = [
  { keywords: /\b(maman|m[èe]re|mama|fete des m[èe]res|cadeau maman)\b/i, category: "Fête des Mères" },
  { keywords: /\b(saint[- ]?valentin|amour|amoureux|valentin)\b/i, category: "Saint-Valentin" },
  { keywords: /\b(anniversaire|birthday)\b/i, category: "Anniversaire" },
  { keywords: /\b(mariage|wedding|noce|mari[ée])\b/i, category: "Mariage" },
  { keywords: /\b(pack|c[ée]l[ée]bration|musique|music)\b/i, category: "Pack Célébration" },
  { keywords: /\b(artisanat|mug|pochette|tableau|porte[- ]?cl[ée]s)\b/i, category: "Artisanat" },
];

function BoutiquePage() {
  const [activeCat, setActiveCat] = useState<"Tous" | BouquetCategory>("Tous");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Bouquet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [{ data: products, error: e1 }, { data: artisanat, error: e2 }] = await Promise.all([
        supabase.from("products" as any).select("*").eq("is_active", true).order("created_at", { ascending: false }),
        supabase.from("artisanat" as any).select("*").eq("is_active", true).order("created_at", { ascending: false }),
      ]);
      if (!mounted) return;
      if (e1 || e2) toast.error("Erreur de chargement du catalogue");
      const mapProducts: Bouquet[] = ((products as any[]) ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description ?? "",
        price: Number(r.price ?? 0),
        image: resolveProductImage(r.image_url),
        alt: r.name,
        category: r.category as BouquetCategory | undefined,
      }));
      const mapArtisanat: Bouquet[] = ((artisanat as any[]) ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description ?? "",
        price: Number(r.price ?? 0),
        image: resolveProductImage(r.image_url),
        alt: r.name,
        category: "Artisanat",
      }));
      setItems([...mapProducts, ...mapArtisanat]);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const q = search.trim();
    if (!q) return;
    for (const { keywords, category } of smartMap) {
      if (keywords.test(q)) { setActiveCat(category); return; }
    }
  }, [search]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter((b) => {
      if (activeCat !== "Tous" && b.category !== activeCat) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        (b.category ?? "").toLowerCase().includes(q)
      );
    });
  }, [activeCat, search, items]);

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

        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un bouquet… (ex : Cadeau maman)"
              className="w-full pl-12 pr-4 py-3 rounded-full border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent transition"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCat === cat
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-secondary/60 text-foreground/80 hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-12 italic">Chargement du catalogue…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 italic">Aucun produit ne correspond à votre recherche.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b) => (
              <BouquetCard key={b.id} bouquet={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
