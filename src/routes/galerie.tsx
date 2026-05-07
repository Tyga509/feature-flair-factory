import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie — SAMAYOO FLOWERS" },
      { name: "description", content: "Découvrez nos bouquets : fleurs artificielles, fleurs naturelles et money bouquets." },
    ],
  }),
  component: GaleriePage,
});

const TABS = [
  { key: "Fleurs Artificielles", label: "Fleurs Artificielles" },
  { key: "Fleurs Naturelles", label: "Fleurs Naturelles" },
  { key: "Bouquets Argent", label: "Bouquets Argent" },
  { key: "Fleurs Éternelles", label: "Fleurs Éternelles" },
] as const;

type Item = { id: string; title: string; image_url: string; category: string };

function GaleriePage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<string>(TABS[0].key);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let m = true;
    (async () => {
      const { data } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false });
      if (!m) return;
      setItems((data ?? []) as any);
      setLoading(false);
    })();
    return () => { m = false; };
  }, []);

  const current = items.filter((i) => i.category === tab);

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-10 animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">{t("common.sectionInspirations")}</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">Galerie</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Nos plus belles créations.</p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map(({ key, label }) => {
            const active = key === tab;
            return (
              <button key={key} type="button" onClick={() => setTab(key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  active ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary/60 text-foreground/80 hover:bg-secondary"
                }`}>
                {label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground italic py-12">Chargement…</p>
        ) : current.length === 0 ? (
          <p className="text-center text-muted-foreground italic py-12">Aucune image dans cette catégorie pour le moment.</p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {current.map((it) => (
              <div key={it.id} className="break-inside-avoid overflow-hidden rounded-2xl shadow-soft hover-lift">
                <img src={it.image_url} alt={it.title} loading="lazy" className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
