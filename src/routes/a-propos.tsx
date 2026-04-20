import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import about from "@/assets/bouquet-eternel.jpg";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — SAMAYOO FLOWERS" },
      { name: "description", content: "Découvrez Samayoo Flowers : vision, engagement et savoir-faire floral." },
      { property: "og:title", content: "À propos — SAMAYOO FLOWERS" },
      { property: "og:description", content: "Notre histoire, notre vision et notre engagement floral." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2 items-center">
        <div className="animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">À propos</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">SAMAYOO FLOWERS</h1>

          <div className="space-y-5 mt-6 text-foreground/85 leading-relaxed">
            <p>
              Chez Samayoo Flowers, nous croyons que chaque fleur raconte une histoire et que chaque bouquet est une émotion que l'on offre. Née d'une passion pour l'élégance végétale et le design floral, notre boutique transforme vos moments précieux en souvenirs inoubliables.
            </p>

            <div>
              <h3 className="font-display text-2xl text-foreground mb-2">Notre vision</h3>
              <p>
                Nous ne nous contentons pas de composer des bouquets ; nous créons des ambiances. Que ce soit pour célébrer un amour, marquer un événement ou apporter une touche de fraîcheur à votre quotidien, chaque tige est sélectionnée avec une attention méticuleuse.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-foreground mb-2">Pourquoi nous choisir ?</h3>
              <ul className="space-y-3">
                <li><strong className="text-primary">Créations uniques —</strong> chaque arrangement reflète votre personnalité.</li>
                <li><strong className="text-primary">Engagement qualité —</strong> fleurs fraîches et rigoureusement sélectionnées.</li>
                <li><strong className="text-primary">Service attentionné —</strong> de la conception à la livraison.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-2xl text-foreground mb-2">Notre engagement</h3>
              <p>
                Samayoo Flowers, c'est avant tout une aventure humaine. Nous sommes fiers de participer à vos célébrations et de mettre notre savoir-faire au service de votre bonheur.
              </p>
            </div>
          </div>

          <Button asChild size="lg" className="rounded-full px-8 mt-8">
            <Link to="/boutique">Découvrir nos créations</Link>
          </Button>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-elegant">
            <img
              src={about}
              alt="Composition signature Samayoo Flowers"
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-gradient-gold rounded-full px-6 py-3 shadow-soft">
            <p className="font-display italic text-foreground">L'art d'offrir des émotions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
