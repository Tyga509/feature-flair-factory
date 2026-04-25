import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { fr } from "./locales/fr";
import { ht } from "./locales/ht";
import { en } from "./locales/en";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      fr: { translation: fr },
      ht: { translation: ht },
      en: { translation: en },
    },
    lng: "fr",
    fallbackLng: "fr",
    supportedLngs: ["fr", "ht", "en"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

// Apply persisted language only on the client, after hydration
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("samayoo-lang");
  if (stored && ["fr", "ht", "en"].includes(stored) && stored !== i18n.language) {
    // Defer to next tick to avoid hydration mismatch
    setTimeout(() => i18n.changeLanguage(stored), 0);
  }
}

export default i18n;

