import { createServerFn } from "@tanstack/react-start";

type Lang = "fr" | "ht" | "en";

interface ChatInput {
  message: string;
  lang?: Lang;
}

/**
 * ============================================================
 *  SAMAYOO CONCIERGE BOT
 * ------------------------------------------------------------
 *  - Personnalité : concierge de luxe (Bordeaux & Or)
 *  - Trilingue : FR / HT (Kreyòl) / EN
 *  - Recherche web : DuckDuckGo Instant Answer (gratuit, no key)
 *  - Préparé pour clé API personnalisée (SerpAPI / Brave / Google CSE)
 *
 *  >>> POUR ACTIVER UNE RECHERCHE PREMIUM DEPUIS VS CODE <<<
 *  Renseigne dans ton .env (ou via les Secrets Lovable) :
 *      SEARCH_API_KEY=ta_cle_ici
 *      SEARCH_PROVIDER=serpapi   // ou "brave" | "google"
 *  Le bot basculera automatiquement sur ce provider.
 * ============================================================
 */

const SEARCH_API_KEY = process.env.SEARCH_API_KEY ?? "";
const SEARCH_PROVIDER = (process.env.SEARCH_PROVIDER ?? "duckduckgo") as
  | "duckduckgo"
  | "serpapi"
  | "brave"
  | "google";

// ---------- TARIFS & SERVICES (source de vérité concierge) ----------
const PRICING = {
  bouquets: { min: 25, max: 199, currency: "USD" },
  delivery: { zone: "Port-au-Prince", time: "2–4h", freeFrom: 50 },
  subscriptions: [
    { name: "Bronze", price: 49, period: "mois" },
    { name: "Or", price: 89, period: "mois" },
    { name: "Diamant", price: 199, period: "semaine" },
  ],
  hours: "Lun–Sam, 8h–18h",
};

// ---------- RÉPONSES CURÉES MULTILINGUES ----------
const CURATED: Record<string, Record<Lang, string>> = {
  livraison: {
    fr: `🌹 **Livraison Samayoo** — Nous livrons dans tout **Port-au-Prince** en **${PRICING.delivery.time}**. Livraison offerte dès **${PRICING.delivery.freeFrom} USD** d'achat. Souhaitez-vous que je prépare votre commande ?`,
    ht: `🌹 **Livrezon Samayoo** — Nou livre nan tout **Pòtoprens** nan **${PRICING.delivery.time}**. Livrezon gratis depi **${PRICING.delivery.freeFrom} USD** acha. Èske w vle m prepare kòmand ou ?`,
    en: `🌹 **Samayoo Delivery** — We deliver across **Port-au-Prince** within **${PRICING.delivery.time}**. Complimentary delivery from **$${PRICING.delivery.freeFrom}**. Shall I arrange your order?`,
  },
  prix: {
    fr: `💐 Nos compositions s'échelonnent de **${PRICING.bouquets.min} USD** (attention délicate) à **${PRICING.bouquets.max} USD** (édition prestige). Souhaitez-vous une recommandation sur-mesure ?`,
    ht: `💐 Konpozisyon nou yo soti **${PRICING.bouquets.min} USD** rive **${PRICING.bouquets.max} USD** (edisyon prestij). Èske w ta renmen yon rekòmandasyon sou mezi ?`,
    en: `💐 Our arrangements range from **$${PRICING.bouquets.min}** (delicate gesture) to **$${PRICING.bouquets.max}** (prestige edition). Would you like a tailored recommendation?`,
  },
  abonnement: {
    fr: `✨ **Trois formules d'abonnement floral** :\n• **Bronze** — ${PRICING.subscriptions[0].price} USD/mois\n• **Or** — ${PRICING.subscriptions[1].price} USD/mois\n• **Diamant** — ${PRICING.subscriptions[2].price} USD/semaine\n\nLaquelle puis-je activer pour vous ?`,
    ht: `✨ **Twa fòmil abònman florèl** :\n• **Bwonz** — ${PRICING.subscriptions[0].price} USD/mwa\n• **Lò** — ${PRICING.subscriptions[1].price} USD/mwa\n• **Dyaman** — ${PRICING.subscriptions[2].price} USD/semèn\n\nKilès pou m aktive pou ou ?`,
    en: `✨ **Three floral subscription tiers**:\n• **Bronze** — $${PRICING.subscriptions[0].price}/month\n• **Gold** — $${PRICING.subscriptions[1].price}/month\n• **Diamond** — $${PRICING.subscriptions[2].price}/week\n\nWhich shall I activate for you?`,
  },
  mariage: {
    fr: `💒 Pour vos noces, notre service **Grands Projets** orchestre une scénographie florale complète : arche, chemin de table, bouquet de mariée. Devis personnalisé sous 24h.`,
    ht: `💒 Pou maryaj ou, sèvis **Gwo Pwojè** nou òganize yon dekorasyon florèl konplè : ach, chimen tab, bouke marye. Devi pèsonalize an 24h.`,
    en: `💒 For your wedding, our **Grand Projects** service orchestrates full floral scenography: archways, table runners, bridal bouquet. Custom quote within 24h.`,
  },
  contact: {
    fr: `📞 Joignez-moi via la page **Contact** ou WhatsApp. Réponse sous **1h** en journée.`,
    ht: `📞 Kontakte m sou paj **Kontak** la oswa WhatsApp. Repons nan **1h** nan jounen.`,
    en: `📞 Reach us via the **Contact** page or WhatsApp. Reply within **1h** during the day.`,
  },
  horaires: {
    fr: `🕒 Boutique ouverte **${PRICING.hours}**.`,
    ht: `🕒 Boutik la louvri **Lendi–Samdi, 8h–18h**.`,
    en: `🕒 Boutique open **Mon–Sat, 8am–6pm**.`,
  },
};

// Mots-clés multilingues → catégorie curée
const KEYWORDS: Array<{ key: keyof typeof CURATED; words: string[] }> = [
  { key: "livraison", words: ["livraison", "livre", "livrezon", "delivery", "ship"] },
  { key: "prix", words: ["prix", "tarif", "cost", "price", "pri", "konbyen", "how much"] },
  { key: "abonnement", words: ["abonnement", "abònman", "subscription", "abonne"] },
  { key: "mariage", words: ["mariage", "maryaj", "wedding", "noces", "bride"] },
  { key: "contact", words: ["contact", "kontak", "joindre", "reach", "whatsapp"] },
  { key: "horaires", words: ["horaire", "ouvert", "open", "hours", "lè", "ore"] },
];

const GREETINGS: Record<Lang, string> = {
  fr: "Mes hommages 🌹 — pour mieux vous servir, pourriez-vous préciser votre demande (bouquet, livraison, événement, conseils d'entretien) ?",
  ht: "Bonjou 🌹 — pou m sèvi w pi byen, èske w ka presize sa w bezwen (bouke, livrezon, evènman, konsèy antretyen) ?",
  en: "My compliments 🌹 — to assist you best, could you share more details (bouquet, delivery, event, care tips)?",
};

const FALLBACK: Record<Lang, string> = {
  fr: "Je n'ai pas trouvé de réponse précise sur le web 🌿. Permettez-moi de vous orienter — souhaitez-vous des informations sur nos **bouquets**, **abonnements**, **livraisons** ou **conseils d'entretien floral** ?",
  ht: "M pa jwenn yon repons egzak sou entènèt la 🌿. Kite m oryante w — èske w vle enfòmasyon sou **bouke**, **abònman**, **livrezon** oswa **konsèy antretyen flè** ?",
  en: "I couldn't find a precise web answer 🌿. Allow me to guide you — would you like details on our **bouquets**, **subscriptions**, **delivery**, or **floral care tips**?",
};

const SEARCH_LABEL: Record<Lang, string> = {
  fr: "D'après mes recherches",
  ht: "Selon rechèch mwen",
  en: "Based on my research",
};

// ---------- PROVIDERS DE RECHERCHE ----------
async function searchDuckDuckGo(q: string) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`;
  const r = await fetch(url, { headers: { "User-Agent": "SamayooConcierge/2.0" } });
  if (!r.ok) throw new Error(`DDG ${r.status}`);
  const j: any = await r.json();
  const abstract = j.AbstractText || j.Answer || "";
  const heading = j.Heading || "";
  const related = (j.RelatedTopics || [])
    .filter((t: any) => t.Text)
    .slice(0, 3)
    .map((t: any) => `• ${t.Text}`)
    .join("\n");
  const text = abstract ? (heading ? `**${heading}**\n\n${abstract}` : abstract) : related;
  const citations: string[] = [];
  if (j.AbstractURL) citations.push(j.AbstractURL);
  return { text, citations };
}

async function searchSerpAPI(q: string) {
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(q)}&api_key=${SEARCH_API_KEY}`;
  const r = await fetch(url);
  const j: any = await r.json();
  const top = j.organic_results?.[0];
  return {
    text: top ? `**${top.title}**\n\n${top.snippet || ""}` : "",
    citations: top?.link ? [top.link] : [],
  };
}

async function searchBrave(q: string) {
  const r = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}`, {
    headers: { "X-Subscription-Token": SEARCH_API_KEY, Accept: "application/json" },
  });
  const j: any = await r.json();
  const top = j.web?.results?.[0];
  return {
    text: top ? `**${top.title}**\n\n${top.description || ""}` : "",
    citations: top?.url ? [top.url] : [],
  };
}

async function performSearch(q: string) {
  if (SEARCH_API_KEY && SEARCH_PROVIDER === "serpapi") return searchSerpAPI(q);
  if (SEARCH_API_KEY && SEARCH_PROVIDER === "brave") return searchBrave(q);
  return searchDuckDuckGo(q);
}

// ---------- HANDLER ----------
export const askSamayooBot = createServerFn({ method: "POST" })
  .inputValidator((d: ChatInput) => {
    if (!d?.message || typeof d.message !== "string") throw new Error("message required");
    if (d.message.length > 500) throw new Error("message too long");
    const lang: Lang = d.lang === "ht" || d.lang === "en" ? d.lang : "fr";
    return { message: d.message.trim(), lang };
  })
  .handler(async ({ data }) => {
    const { message, lang } = data;
    const lower = message.toLowerCase();

    // Salutations
    if (/^(bonjour|bonsoir|salut|hello|hi|bonjou|alo)\b/i.test(lower)) {
      return { source: "samayoo" as const, answer: GREETINGS[lang], citations: [] };
    }

    // 1) Réponses curées (priorité concierge)
    for (const { key, words } of KEYWORDS) {
      if (words.some((w) => lower.includes(w))) {
        return { source: "samayoo" as const, answer: CURATED[key][lang], citations: [] };
      }
    }

    // 2) Recherche web (saisons, entretien, variétés…)
    try {
      const { text, citations } = await performSearch(`${message} fleurs`);
      const answer = text
        ? `${SEARCH_LABEL[lang]} 🔍 :\n\n${text}`
        : FALLBACK[lang];
      return { source: "duckduckgo" as const, answer, citations };
    } catch {
      return { source: "error" as const, answer: FALLBACK[lang], citations: [] };
    }
  });
