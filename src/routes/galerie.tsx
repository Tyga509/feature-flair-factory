import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import art1 from "@/assets/gal-art-1.jpg";
import art2 from "@/assets/gal-art-2.jpg";
import art3 from "@/assets/gal-art-3.jpg";
import art4 from "@/assets/gal-art-4.jpg";
import art5 from "@/assets/gal-art-5.jpg";
import art6 from "@/assets/gal-art-6.jpg";
import art7 from "@/assets/gal-art-7.jpg";
import art8 from "@/assets/gal-art-8.jpg";
import art9 from "@/assets/gal-art-9.jpg";
import art10 from "@/assets/gal-art-10.jpg";

import nat1 from "@/assets/gal-nat-1.jpg";
import nat2 from "@/assets/gal-nat-2.jpg";
import nat3 from "@/assets/gal-nat-3.jpg";
import nat4 from "@/assets/gal-nat-4.jpg";
import nat5 from "@/assets/gal-nat-5.jpg";
import nat6 from "@/assets/gal-nat-6.jpg";
import nat7 from "@/assets/gal-nat-7.jpg";
import nat8 from "@/assets/gal-nat-8.jpg";
import nat9 from "@/assets/gal-nat-9.jpg";
import nat10 from "@/assets/gal-nat-10.jpg";

import mon1 from "@/assets/gal-mon-1.jpg";
import mon2 from "@/assets/gal-mon-2.jpg";
import mon3 from "@/assets/gal-mon-3.jpg";
import mon4 from "@/assets/gal-mon-4.jpg";
import mon5 from "@/assets/gal-mon-5.jpg";
import mon6 from "@/assets/gal-mon-6.jpg";
import mon7 from "@/assets/gal-mon-7.jpg";
import mon8 from "@/assets/gal-mon-8.jpg";
import mon9 from "@/assets/gal-mon-9.jpg";
import mon10 from "@/assets/gal-mon-10.jpg";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie — SAMAYOO FLOWERS" },
      {
        name: "description",
        content:
          "Découvrez nos bouquets : fleurs artificielles, fleurs naturelles et money bouquets en gourdes et dollars.",
      },
      { property: "og:title", content: "Galerie — SAMAYOO FLOWERS" },
      {
        property: "og:description",
        content:
          "30 créations Samayoo : artificielles, naturelles et bouquets en billets.",
      },
    ],
  }),
  component: GaleriePage,
});

const collections = {
  artificielles: {
    label: "Fleurs Artificielles",
    desc: "Compositions en soie et fleurs éternelles, durables et toujours impeccables.",
    images: [art1, art2, art3, art4, art5, art6, art7, art8, art9, art10],
  },
  naturelles: {
    label: "Fleurs Naturelles",
    desc: "Bouquets de fleurs fraîches du jour, parfums et couleurs authentiques.",
    images: [nat1, nat2, nat3, nat4, nat5, nat6, nat7, nat8, nat9, nat10],
  },
  money: {
    label: "Money Bouquets",
    desc: "Créations uniques en billets — gourdes haïtiennes et dollars américains.",
    images: [mon1, mon2, mon3, mon4, mon5, mon6, mon7, mon8, mon9, mon10],
  },
} as const;

type Tab = keyof typeof collections;

function GaleriePage() {
  const [tab, setTab] = useState<Tab>("artificielles");
  const current = collections[tab];

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-10 animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">
            Inspirations
          </p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">
            Notre Galerie
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Trois univers signés Samayoo Flowers — explorez nos créations.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {(Object.keys(collections) as Tab[]).map((key) => {
            const active = key === tab;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-secondary/60 text-foreground/80 hover:bg-secondary"
                }`}
              >
                {collections[key].label}
              </button>
            );
          })}
        </div>
        <p className="text-center text-sm text-muted-foreground mb-10">
          {current.desc}
        </p>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {current.images.map((src, i) => (
            <div
              key={`${tab}-${i}`}
              className="break-inside-avoid overflow-hidden rounded-2xl shadow-soft hover-lift"
            >
              <img
                src={src}
                alt={`${current.label} ${i + 1}`}
                loading="lazy"
                width={768}
                height={1024}
                className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
