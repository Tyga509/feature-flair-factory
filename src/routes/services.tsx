import { createFileRoute } from "@tanstack/react-router";
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
  {
    icon: Gift,
    title: "Cadeau Surprise",
    desc: "Un coffret unique pensé pour émouvoir : nous composons une surprise sur mesure selon la personne, l'occasion et votre budget.",
  },
  {
    icon: Mail,
    title: "Cartes (Invitation / Mariage / Visite)",
    desc: "Création et impression de cartes élégantes pour vos invitations, mariages, événements et cartes de visite professionnelles.",
  },
  {
    icon: Heart,
    title: "Chambre Romantique",
    desc: "Mise en scène florale de votre chambre pour un anniversaire, une demande ou une nuit spéciale : pétales, bougies, ballons et fleurs.",
  },
  {
    icon: Flower2,
    title: "Confections Fleurs (Artificielle / Éternelle / Naturelle)",
    desc: "Bouquets et compositions florales sur mesure en fleurs naturelles fraîches, éternelles préservées ou artificielles haut de gamme.",
  },
  {
    icon: PenLine,
    title: "Dédicace",
    desc: "Messages personnalisés calligraphiés sur cartes, rubans ou supports décoratifs pour rendre chaque cadeau inoubliable.",
  },
  {
    icon: Sparkles,
    title: "Décoration",
    desc: "Décoration événementielle complète : mariages, anniversaires, baby showers, fiançailles. Mise en place et démontage inclus.",
  },
  {
    icon: FileText,
    title: "Flyers",
    desc: "Conception graphique et impression de flyers pour vos événements, promotions ou activités professionnelles.",
  },
  {
    icon: Banknote,
    title: "Gâteau d'Argent",
    desc: "Pièces uniques en forme de gâteau composées de vrais billets (gourdes ou dollars) — un cadeau original pour mariages et anniversaires.",
  },
  {
    icon: ImageIcon,
    title: "Tableau PVC",
    desc: "Tableaux décoratifs personnalisés sur PVC : photos, citations, paysages d'Haïti — finition durable et élégante.",
  },
  {
    icon: Coffee,
    title: "Tasse Personnalisée",
    desc: "Mugs en céramique imprimés avec votre photo, votre logo ou un message — un cadeau pratique et chaleureux.",
  },
  {
    icon: Briefcase,
    title: "Valise Personnalisée",
    desc: "Personnalisation de valises avec motifs, prénoms ou visuels uniques pour voyager avec style.",
  },
];

function ServicesPage() {
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-14 animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">
            Ce que nous offrons
          </p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">
            Nos Services
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            De la fleur fraîche au money bouquet, en passant par la décoration
            événementielle — Samayoo Flowers vous accompagne pour chaque moment
            précieux.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover-lift transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary/70 ring-1 ring-accent/40 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <h2 className="font-display text-xl text-primary mb-2">
                  {s.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
