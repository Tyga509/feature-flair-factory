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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground shadow-elegant px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors"
        aria-label={t("lang.label")}
      >
        <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden xs:inline">{mounted ? current.flag : "🌐"}</span>
        <span className="uppercase tracking-wide text-[10px] sm:text-xs">{mounted ? current.code : "fr"}</span>
      </button>
      {open && (
        <div className="absolute top-11 right-0 w-44 rounded-xl bg-background border border-border shadow-elegant overflow-hidden animate-fade-in z-50">
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
