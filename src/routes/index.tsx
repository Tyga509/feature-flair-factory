import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/HeroCarousel";
import { BouquetCard } from "@/components/BouquetCard";
import { bouquets } from "@/data/bouquets";
import { Flower, Heart, Truck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAMAYOO FLOWERS — Accueil" },
      {
        name: "description",
        content:
          "Bouquets personnalisés, événements et livraison locale. Découvrez l'élégance florale Samayoo Flowers à Port-au-Prince.",
      },
      { property: "og:title", content: "SAMAYOO FLOWERS — Accueil" },
      { property: "og:description", content: "Si les mots ne sortent pas, dites-les avec des fleurs." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation();
  const featured = bouquets.slice(0, 3);
  const services = [
    { icon: Flower, key: "bouquets" },
    { icon: Heart, key: "events" },
    { icon: Truck, key: "delivery" },
    { icon: Sparkles, key: "unique" },
  ] as const;

  return (
    <>
      <HeroCarousel>
        <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-wide text-white drop-shadow-lg">
          SAMAYOO FLOWERS
        </h1>
        <p className="mt-4 font-display italic text-xl md:text-2xl text-white/95">
          {t("home.tagline")}
        </p>
        <p className="mt-4 max-w-xl mx-auto text-white/85 text-base md:text-lg">
          {t("home.intro")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg" className="rounded-full px-8 shadow-elegant">
            <Link to="/boutique">{t("common.viewBoutique")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8 bg-white/10 backdrop-blur border-white/40 text-white hover:bg-white hover:text-primary">
            <Link to="/contact">{t("common.orderNow")}</Link>
          </Button>
        </div>
      </HeroCarousel>

      <section className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">{t("common.sectionOurServices")}</p>
            <h2 className="font-display text-4xl md:text-5xl mt-2 text-foreground">{t("home.servicesTitle")}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.key} className="bg-card border border-border/60 rounded-2xl p-6 text-center hover-lift">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-romantic mb-4">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{t(`home.services.${s.key}.title`)}</h3>
                <p className="text-sm text-muted-foreground">{t(`home.services.${s.key}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-romantic">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">{t("common.sectionSelection")}</p>
            <h2 className="font-display text-4xl md:text-5xl mt-2 text-foreground">{t("home.featuredTitle")}</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">{t("home.featuredDesc")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((b) => (
              <BouquetCard key={b.id} bouquet={b} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/boutique">{t("common.viewAllBouquets")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl text-foreground">{t("home.ctaTitle")}</h2>
          <p className="mt-4 text-muted-foreground">{t("home.ctaDesc")}</p>
          <Button asChild size="lg" className="rounded-full px-8 mt-6">
            <Link to="/contact">{t("common.contactUs")}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
