import { createFileRoute, Link } from "@tanstack/react-router";
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

const services = [
  { icon: Flower, title: "Bouquets personnalisés", text: "Naturels, artificiels ou en argent — adaptés à votre message et budget." },
  { icon: Heart, title: "Événements", text: "Décoration pour mariages, anniversaires, cérémonies et réceptions." },
  { icon: Truck, title: "Livraison locale", text: "Livraison rapide et soignée à Port-au-Prince pour surprendre vos proches." },
  { icon: Sparkles, title: "Créations uniques", text: "Chaque arrangement est conçu sur mesure pour refléter vos émotions." },
];

function HomePage() {
  const featured = bouquets.slice(0, 3);

  return (
    <>
      <HeroCarousel>
        <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-wide text-white drop-shadow-lg">
          SAMAYOO FLOWERS
        </h1>
        <p className="mt-4 font-display italic text-xl md:text-2xl text-white/95">
          Si les mots ne sortent pas, dites-les avec des fleurs.
        </p>
        <p className="mt-4 max-w-xl mx-auto text-white/85 text-base md:text-lg">
          Nous transformons vos émotions en compositions florales élégantes pour chaque moment important.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg" className="rounded-full px-8 shadow-elegant">
            <Link to="/boutique">Voir la boutique</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8 bg-white/10 backdrop-blur border-white/40 text-white hover:bg-white hover:text-primary">
            <Link to="/contact">Commander maintenant</Link>
          </Button>
        </div>
      </HeroCarousel>

      {/* Services */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Nos services</p>
            <h2 className="font-display text-4xl md:text-5xl mt-2 text-foreground">L'art floral à votre image</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.title} className="bg-card border border-border/60 rounded-2xl p-6 text-center hover-lift">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-romantic mb-4">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 px-4 bg-gradient-romantic">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Sélection</p>
            <h2 className="font-display text-4xl md:text-5xl mt-2 text-foreground">Bouquets vedettes</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Quelques-unes de nos créations préférées, prêtes à raconter votre histoire.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((b) => (
              <BouquetCard key={b.id} bouquet={b} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/boutique">Voir tous les bouquets</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Une occasion spéciale ?</h2>
          <p className="mt-4 text-muted-foreground">
            Contactez-nous pour une création sur-mesure adaptée à votre événement.
          </p>
          <Button asChild size="lg" className="rounded-full px-8 mt-6">
            <Link to="/contact">Nous contacter</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
