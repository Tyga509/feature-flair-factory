import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Gift,
  Mail,
  Heart,
  Flower2,
  PenLine,
  Sparkles,
  FileText,
  Banknote,
  Image as ImageIcon,
  Coffee,
  Briefcase,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — SAMAYOO FLOWERS" },
      {
        name: "description",
        content:
          "Découvrez tous les services de Samayoo Flowers : cadeaux, cartes, décoration, money bouquets, tasses personnalisées et plus.",
      },
      { property: "og:title", content: "Services — SAMAYOO FLOWERS" },
      {
        property: "og:description",
        content:
          "Cadeau Surprise, Décoration, Money Bouquet, Cartes, Flyers et bien plus chez Samayoo Flowers.",
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Gift, key: "surprise" },
  { icon: Mail, key: "cards" },
  { icon: Heart, key: "room" },
  { icon: Flower2, key: "flowers" },
  { icon: PenLine, key: "dedication" },
  { icon: Sparkles, key: "decoration" },
  { icon: FileText, key: "flyers" },
  { icon: Banknote, key: "moneyCake" },
  { icon: ImageIcon, key: "pvc" },
  { icon: Coffee, key: "mug" },
  { icon: Briefcase, key: "luggage" },
] as const;

function ServicesPage() {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-14 animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">
            {t("common.sectionWhatWeOffer")}
          </p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">
            {t("services.title")}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.key}
                className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover-lift transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary/70 ring-1 ring-accent/40 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <h2 className="font-display text-xl text-primary mb-2">
                  {t(`services.items.${s.key}.title`)}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`services.items.${s.key}.desc`)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
