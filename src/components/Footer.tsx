import { Link } from "@tanstack/react-router";
import { Facebook, Phone, Mail, MapPin, Music2, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-24 border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl text-primary tracking-[0.15em]">
            SAMAYOO FLOWERS
          </h3>
          <p className="mt-3 text-sm text-muted-foreground italic">
            {t("footer.tagline")}
          </p>
        </div>

        <div>
          <h4 className="font-display text-base mb-3 text-foreground">{t("footer.contact")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> <a href="https://wa.me/50955017732" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+509 55 01 77 32</a></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> <a href="mailto:samaraben10icloud.com" className="hover:text-primary transition-colors">samaraben10icloud.com</a></li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> Port-au-Prince, Haïti</li>
            <li className="flex items-center gap-2"><Facebook className="h-4 w-4 text-accent" /> <a href="https://www.facebook.com/profile.php?id=61571305557097" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Samayoo Flowers</a></li>
            <li className="flex items-center gap-2"><Music2 className="h-4 w-4 text-accent" /> <a href="https://www.tiktok.com/@samayoo01" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">TikTok : @Samayoo01</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base mb-3 text-foreground">{t("footer.navigation")}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/boutique" className="story-link text-muted-foreground hover:text-primary">{t("nav.boutique")}</Link></li>
            <li><Link to="/composez" className="story-link text-muted-foreground hover:text-primary">Composez</Link></li>
            <li><Link to="/abonnements" className="story-link text-muted-foreground hover:text-primary">Abonnements</Link></li>
            <li><Link to="/grands-projets" className="story-link text-muted-foreground hover:text-primary">Grands Projets</Link></li>
            <li><Link to="/galerie" className="story-link text-muted-foreground hover:text-primary">{t("nav.galerie")}</Link></li>
            <li><Link to="/a-propos" className="story-link text-muted-foreground hover:text-primary">{t("nav.about")}</Link></li>
            <li><Link to="/contact" className="story-link text-muted-foreground hover:text-primary">{t("nav.contact")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground flex items-center justify-center gap-3">
        <span>{t("footer.rights", { year: new Date().getFullYear() })}</span>
        <Link
          to="/admin"
          aria-label="Accès administration"
          title="Administration"
          className="text-accent/60 hover:text-accent transition-colors"
        >
          <Lock className="h-3.5 w-3.5" />
        </Link>
      </div>
    </footer>
  );
}
