import { createFileRoute } from "@tanstack/react-router";
import { bouquets } from "@/data/bouquets";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie — SAMAYOO FLOWERS" },
      { name: "description", content: "Portfolio des créations florales Samayoo Flowers." },
      { property: "og:title", content: "Galerie — SAMAYOO FLOWERS" },
      { property: "og:description", content: "Découvrez nos plus belles créations en images." },
    ],
  }),
  component: GaleriePage,
});

function GaleriePage() {
  // duplicate to make a richer mosaic
  const images = [...bouquets, ...bouquets].map((b, i) => ({ ...b, key: `${b.id}-${i}` }));

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-14 animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Portfolio</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">Nos Créations</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Une sélection de nos plus belles compositions florales.
          </p>
        </header>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <div
              key={img.key}
              className="break-inside-avoid overflow-hidden rounded-2xl shadow-soft hover-lift"
            >
              <img
                src={img.image}
                alt={img.alt}
                loading="lazy"
                width={1024}
                height={1024}
                className={`w-full object-cover transition-transform duration-700 hover:scale-105 ${
                  i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
