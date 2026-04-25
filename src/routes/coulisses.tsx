import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Play, Truck, Sparkles, Heart } from "lucide-react";

export const Route = createFileRoute("/coulisses")({
  head: () => ({
    meta: [
      { title: "Coulisses — SAMAYOO FLOWERS" },
      {
        name: "description",
        content:
          "Plongez dans les coulisses de Samayoo Flowers : préparation des bouquets, livraisons et instants partagés avec nos clients.",
      },
      { property: "og:title", content: "Coulisses — SAMAYOO FLOWERS" },
      {
        property: "og:description",
        content:
          "Vidéos exclusives : préparation, livraisons et savoir-faire Samayoo Flowers.",
      },
    ],
  }),
  component: CoulissesPage,
});

type Category = "all" | "preparation" | "livraison" | "moments";

type VideoItem = {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, "all">;
  src?: string;
  poster?: string;
};

// Placeholder video list — admin will populate with real Samayoo videos.
const videos: VideoItem[] = [];

const categoryMeta: Record<
  Exclude<Category, "all">,
  { label: string; icon: typeof Truck; tint: string }
> = {
  preparation: { label: "Préparation", icon: Sparkles, tint: "bg-accent/20 text-accent" },
  livraison: { label: "Livraisons", icon: Truck, tint: "bg-primary/15 text-primary" },
  moments: { label: "Moments", icon: Heart, tint: "bg-secondary text-foreground/80" },
};

function CoulissesPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Category>("all");

  const filtered = filter === "all" ? videos : videos.filter((v) => v.category === filter);

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-10 animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">
            {t("common.sectionInspirations")}
          </p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">
            Coulisses Samayoo
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Derrière chaque bouquet, une histoire. Découvrez nos livraisons,
            la préparation de vos commandes et les instants qui font vivre
            Samayoo Flowers.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {(["all", "preparation", "livraison", "moments"] as Category[]).map((key) => {
            const active = key === filter;
            const label =
              key === "all" ? "Toutes les vidéos" : categoryMeta[key].label;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-secondary/60 text-foreground/80 hover:bg-secondary"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-secondary/60 flex items-center justify-center mb-4">
              <Play className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-display text-2xl text-primary mb-2">
              Bientôt en ligne
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Nos premières vidéos arrivent très bientôt — préparation de
              bouquets, livraisons surprises et coulisses de l'atelier
              Samayoo Flowers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((v) => {
              const meta = categoryMeta[v.category];
              const Icon = meta.icon;
              return (
                <article
                  key={v.id}
                  className="group rounded-2xl overflow-hidden bg-card shadow-soft hover-lift border border-border/60"
                >
                  <div className="relative aspect-video bg-secondary">
                    {v.src ? (
                      <video
                        src={v.src}
                        poster={v.poster}
                        controls
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Play className="h-10 w-10 text-primary/60" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${meta.tint}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {meta.label}
                    </span>
                    <h3 className="mt-3 font-display text-lg text-primary">
                      {v.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {v.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
