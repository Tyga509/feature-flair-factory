import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import about from "@/assets/about-samayoo.jpg";

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
  const { t } = useTranslation();
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2 items-center">
        <div className="animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">{t("common.sectionAbout")}</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">{t("about.title")}</h1>

          <div className="space-y-5 mt-6 text-foreground/85 leading-relaxed">
            <p>{t("about.p1")}</p>

            <div>
              <h3 className="font-display text-2xl text-foreground mb-2">{t("about.visionTitle")}</h3>
              <p>{t("about.visionText")}</p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-foreground mb-2">{t("about.whyTitle")}</h3>
              <ul className="space-y-3">
                <li><strong className="text-primary">{t("about.why1Strong")} </strong>{t("about.why1")}</li>
                <li><strong className="text-primary">{t("about.why2Strong")} </strong>{t("about.why2")}</li>
                <li><strong className="text-primary">{t("about.why3Strong")} </strong>{t("about.why3")}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-2xl text-foreground mb-2">{t("about.commitTitle")}</h3>
              <p>{t("about.commitText")}</p>
            </div>
          </div>

          <Button asChild size="lg" className="rounded-full px-8 mt-8">
            <Link to="/boutique">{t("common.discoverCreations")}</Link>
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
            <p className="font-display italic text-foreground">{t("about.badge")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
