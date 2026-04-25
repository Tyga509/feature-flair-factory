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
    { to: "/", label: t("nav.home") },
    { to: "/boutique", label: t("nav.boutique") },
    { to: "/artisanat", label: t("nav.artisanat") },
    { to: "/services", label: t("nav.services") },
    { to: "/galerie", label: t("nav.galerie") },
    { to: "/coulisses", label: t("nav.coulisses") },
    { to: "/a-propos", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/85 border-b border-border">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-24">
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Logo Samayoo Flowers"
            width={80}
            height={80}
            className="h-16 w-16 sm:h-20 sm:w-20 object-contain transition-transform group-hover:scale-110"
          />
          <span className="font-display text-xl tracking-[0.18em] text-primary font-semibold hidden sm:inline">
            SAMAYOO FLOWERS
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
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

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
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
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2.5 rounded-full hover:bg-secondary"
            aria-label={t("nav.menu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm font-medium hover:bg-secondary"
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
