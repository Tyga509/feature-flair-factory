import { createFileRoute } from "@tanstack/react-router";
import { BouquetCard } from "@/components/BouquetCard";
import { bouquets } from "@/data/bouquets";

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

function BoutiquePage() {
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-14 animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Catalogue</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">Notre Boutique</h1>
          <p className="mt-4 text-muted-foreground italic max-w-xl mx-auto">
            Si les mots ne sortent pas, dites-les plutôt avec des fleurs.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bouquets.map((b) => (
            <BouquetCard key={b.id} bouquet={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
