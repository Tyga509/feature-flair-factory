import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const langs = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ht", label: "Kreyòl", flag: "🇭🇹" },
  { code: "en", label: "English", flag: "🇬🇧" },
] as const;

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = langs.find((l) => l.code === i18n.language) ?? langs[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const change = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="fixed top-4 right-4 z-[60]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-md border border-border shadow-soft px-3 py-2 text-sm font-medium hover:bg-secondary transition-colors"
        aria-label={t("lang.label")}
      >
        <Globe className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline">{current.flag}</span>
        <span className="uppercase tracking-wide text-xs">{current.code}</span>
      </button>
      {open && (
        <div className="absolute top-12 right-0 w-44 rounded-xl bg-background border border-border shadow-elegant overflow-hidden animate-fade-in">
          {langs.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => change(l.code)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-secondary transition-colors ${
                l.code === i18n.language ? "text-primary font-semibold bg-secondary/40" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </span>
              {l.code === i18n.language && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
