import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

export function Header() {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { to: "/", label: t("nav.home", { defaultValue: "Accueil" }) },
    { to: "/boutique", label: t("nav.boutique", { defaultValue: "Boutique" }) },
    { to: "/composez", label: t("nav.composez", { defaultValue: "Composez" }) },
    { to: "/abonnements", label: t("nav.abonnements", { defaultValue: "Abonnements" }) },
    { to: "/grands-projets", label: t("nav.grandsProjets", { defaultValue: "Grands Projets" }) },
    { to: "/galerie", label: t("nav.galerie", { defaultValue: "Galerie" }) },
    { to: "/coulisses", label: t("nav.coulisses", { defaultValue: "Coulisses" }) },
    { to: "/a-propos", label: t("nav.about", { defaultValue: "À propos" }) },
    { to: "/contact", label: t("nav.contact", { defaultValue: "Contact" }) },
  ] as const;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/85 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-4 h-24">
        {/* Logo (taille réduite pour ne plus chevaucher) */}
        <Link
          to="/"
          className="flex items-center gap-3 group shrink-0"
          onClick={() => setOpen(false)}
        >
          <img
            src={logo}
            alt="Logo Samayoo Flowers"
            width={64}
            height={64}
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform group-hover:scale-110"
          />
          <span className="font-display text-base xl:text-lg tracking-[0.18em] text-primary font-semibold hidden sm:inline whitespace-nowrap">
            SAMAYOO FLOWERS
          </span>
        </Link>

        {/* Nav desktop : visible seulement à partir de xl pour éviter la saturation */}
        <nav className="hidden xl:flex items-center gap-5 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="story-link whitespace-nowrap text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300"
              activeProps={{
                className:
                  "story-link whitespace-nowrap text-sm font-medium tracking-wide text-primary px-3 py-1.5 rounded-full bg-secondary/60 ring-1 ring-accent/60",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions à droite — espacées du nav par ml-8 */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 xl:ml-8">
          <Link
            to="/panier"
            className="relative p-2.5 rounded-full hover:bg-secondary transition-colors group"
            aria-label={t("nav.cart")}
          >
            <ShoppingBag className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center animate-scale-in">
                {totalItems}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <LanguageSwitcher />
          {/* Burger : visible jusqu'à xl (couvre mobile + tablette + laptop standard) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden p-2.5 rounded-full text-accent hover:bg-secondary border border-accent/40"
            aria-label={t("nav.menu")}
            style={{ color: "#D4AF37" }}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu burger (mobile + tablette + laptop) */}
      {open && (
        <nav className="xl:hidden border-t border-accent/30 bg-background animate-fade-in">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-secondary"
                activeProps={{
                  className:
                    "px-3 py-2.5 rounded-md text-sm font-semibold text-primary bg-secondary/80 ring-1 ring-accent/60",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
