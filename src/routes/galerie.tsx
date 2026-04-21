import { createFileRoute } from "@tanstack/react-router";
import ambiance1 from "@/assets/hero-1.jpg";
import ambiance2 from "@/assets/hero-2.jpg";
import ambiance3 from "@/assets/hero-3.jpg";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie — SAMAYOO FLOWERS" },
      { name: "description", content: "Ambiances et inspirations Samayoo Flowers." },
      { property: "og:title", content: "Galerie — SAMAYOO FLOWERS" },
      { property: "og:description", content: "Inspirations et ambiances signées Samayoo Flowers." },
    ],
  }),
  component: GaleriePage,
});

function GaleriePage() {
  const images = [
    { key: "a1", image: ambiance1, alt: "Ambiance florale Samayoo 1" },
    { key: "a2", image: ambiance2, alt: "Ambiance florale Samayoo 2" },
    { key: "a3", image: ambiance3, alt: "Ambiance florale Samayoo 3" },
  ];

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-14 animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Inspirations</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">Nos Ambiances</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Les créations signées Samayoo en situation. Pour découvrir le catalogue, rendez-vous sur la Boutique.
          </p>
        </header>

        <div className="columns-1 md:columns-2 gap-4 space-y-4">
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
