import { createFileRoute } from "@tanstack/react-router";
import { artisanats } from "@/data/artisanat";
import { formatPrice } from "@/data/bouquets";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/artisanat")({
  head: () => ({
    meta: [
      { title: "Artisanat Local — SAMAYOO FLOWERS" },
      {
        name: "description",
        content:
          "Découvrez nos articles d'artisanat haïtien : mugs, pochettes, tableaux et porte-clés aux couleurs d'Haïti.",
      },
      { property: "og:title", content: "Artisanat Local — SAMAYOO FLOWERS" },
      {
        property: "og:description",
        content: "Articles locaux et souvenirs haïtiens signés Samayoo Flowers.",
      },
    ],
  }),
  component: ArtisanatPage,
});

function ArtisanatPage() {
  const { addItem } = useCart();

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-14 animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">
            Made in Haïti
          </p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">
            Artisanat Local
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Au-delà des fleurs, Samayoo célèbre la richesse de l'artisanat haïtien.
            Mugs, pochettes, tableaux et porte-clés — chaque pièce est un fragment
            de notre culture à offrir ou à s'offrir.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artisanats.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-card shadow-soft hover-lift flex flex-col"
            >
              <div className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                  <h2 className="font-display text-xl text-primary">{item.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="font-semibold text-primary">
                    {formatPrice(item.price)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() =>
                      addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    }
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
