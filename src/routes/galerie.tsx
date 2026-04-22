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
import art11 from "@/assets/gal-art-11.jpg";
import art12 from "@/assets/gal-art-12.jpg";
import art13 from "@/assets/gal-art-13.jpg";
import art14 from "@/assets/gal-art-14.jpg";
import art15 from "@/assets/gal-art-15.jpg";
import art16 from "@/assets/gal-art-16.jpg";
import art17 from "@/assets/gal-art-17.jpg";
import art18 from "@/assets/gal-art-18.jpg";
import art19 from "@/assets/gal-art-19.jpg";
import art20 from "@/assets/gal-art-20.jpg";
import art21 from "@/assets/gal-art-21.jpg";
import art22 from "@/assets/gal-art-22.jpg";
import art23 from "@/assets/gal-art-23.jpg";
import art24 from "@/assets/gal-art-24.jpg";
import art25 from "@/assets/gal-art-25.jpg";
import art26 from "@/assets/gal-art-26.jpg";
import art27 from "@/assets/gal-art-27.jpg";
import art28 from "@/assets/gal-art-28.jpg";
import art29 from "@/assets/gal-art-29.jpg";

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
import nat11 from "@/assets/gal-nat-11.jpg";
import nat12 from "@/assets/gal-nat-12.jpg";
import nat13 from "@/assets/gal-nat-13.jpg";
import nat14 from "@/assets/gal-nat-14.jpg";
import nat15 from "@/assets/gal-nat-15.jpg";
import nat16 from "@/assets/gal-nat-16.jpg";
import nat17 from "@/assets/gal-nat-17.jpg";
import nat18 from "@/assets/gal-nat-18.jpg";
import nat19 from "@/assets/gal-nat-19.jpg";
import nat20 from "@/assets/gal-nat-20.jpg";
import nat21 from "@/assets/gal-nat-21.jpg";
import nat22 from "@/assets/gal-nat-22.jpg";
import nat23 from "@/assets/gal-nat-23.jpg";
import nat24 from "@/assets/gal-nat-24.jpg";
import nat25 from "@/assets/gal-nat-25.jpg";
import nat26 from "@/assets/gal-nat-26.jpg";
import nat27 from "@/assets/gal-nat-27.jpg";
import nat28 from "@/assets/gal-nat-28.jpg";
import nat29 from "@/assets/gal-nat-29.jpg";

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
import mon11 from "@/assets/gal-mon-11.jpg";
import mon12 from "@/assets/gal-mon-12.jpg";
import mon13 from "@/assets/gal-mon-13.jpg";
import mon14 from "@/assets/gal-mon-14.jpg";
import mon15 from "@/assets/gal-mon-15.jpg";
import mon16 from "@/assets/gal-mon-16.jpg";
import mon17 from "@/assets/gal-mon-17.jpg";
import mon18 from "@/assets/gal-mon-18.jpg";
import mon19 from "@/assets/gal-mon-19.jpg";
import mon20 from "@/assets/gal-mon-20.jpg";
import mon21 from "@/assets/gal-mon-21.jpg";
import mon22 from "@/assets/gal-mon-22.jpg";
import mon23 from "@/assets/gal-mon-23.jpg";
import mon24 from "@/assets/gal-mon-24.jpg";
import mon25 from "@/assets/gal-mon-25.jpg";
import mon26 from "@/assets/gal-mon-26.jpg";
import mon27 from "@/assets/gal-mon-27.jpg";
import mon28 from "@/assets/gal-mon-28.jpg";
import mon29 from "@/assets/gal-mon-29.jpg";

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
          "Créations Samayoo : artificielles, naturelles et bouquets en billets.",
      },
    ],
  }),
  component: GaleriePage,
});

const collections = {
  artificielles: {
    label: "Fleurs Artificielles",
    desc: "Compositions en soie et fleurs éternelles, durables et toujours impeccables.",
    images: [
      art1, art2, art3, art4, art5, art6, art7, art8, art9, art10,
      art11, art12, art13, art14, art15, art16, art17, art18, art19, art20,
      art21, art22, art23, art24, art25, art26, art27, art28, art29,
    ],
  },
  naturelles: {
    label: "Fleurs Naturelles",
    desc: "Bouquets romantiques de fleurs fraîches, parfums et couleurs authentiques.",
    images: [
      nat1, nat2, nat3, nat4, nat5, nat6, nat7, nat8, nat9, nat10,
      nat11, nat12, nat13, nat14, nat15, nat16, nat17, nat18, nat19, nat20,
      nat21, nat22, nat23, nat24, nat25, nat26, nat27, nat28, nat29,
    ],
  },
  money: {
    label: "Bouquets Argent",
    desc: "Créations uniques en billets — gourdes haïtiennes et dollars américains.",
    images: [
      mon1, mon2, mon3, mon4, mon5, mon6, mon7, mon8, mon9, mon10,
      mon11, mon12, mon13, mon14, mon15, mon16, mon17, mon18, mon19, mon20,
      mon21, mon22, mon23, mon24, mon25, mon26, mon27, mon28, mon29,
    ],
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
