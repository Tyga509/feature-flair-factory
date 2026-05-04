import { createServerFn } from "@tanstack/react-start";

interface ChatInput {
  message: string;
}

/**
 * Bot Samayoo — recherche DuckDuckGo Instant Answer + réponses contextuelles fleurs.
 * DuckDuckGo Instant Answer API : pas de clé requise, gratuite, mais résultats parfois vides.
 */
export const askSamayooBot = createServerFn({ method: "POST" })
  .inputValidator((d: ChatInput) => {
    if (!d?.message || typeof d.message !== "string") throw new Error("message required");
    if (d.message.length > 500) throw new Error("message too long");
    return { message: d.message.trim() };
  })
  .handler(async ({ data }) => {
    const q = data.message;
    const lower = q.toLowerCase();

    // 1) Réponses curées Samayoo (priorité, instantanées)
    const curated: Record<string, string> = {
      livraison: "🌸 **Livraison Samayoo Flowers** : nous livrons dans tout Port-au-Prince en 2 à 4 heures. Livraison gratuite dès 50 USD d'achat.",
      prix: "💐 Nos bouquets vont de **25 USD** (petite attention) à **199 USD** (composition prestige). Nos abonnements démarrent à 49 USD/mois.",
      abonnement: "✨ Trois formules : **Bronze** (49 USD/mois), **Or** (89 USD), **Diamant** (199 USD/semaine). Visitez la page Abonnements.",
      mariage: "💒 Pour les mariages, rendez-vous sur **Grands Projets** : devis sur-mesure, scénographie florale complète.",
      contact: "📞 Contactez-nous via la page Contact ou par WhatsApp. Réponse sous 1h en journée.",
      horaires: "🕒 Boutique ouverte du lundi au samedi, 8h–18h.",
    };

    for (const key of Object.keys(curated)) {
      if (lower.includes(key)) {
        return { source: "samayoo" as const, answer: curated[key], citations: [] as string[] };
      }
    }

    // 2) Sinon → DuckDuckGo Instant Answer
    try {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`;
      const res = await fetch(url, { headers: { "User-Agent": "SamayooBot/1.0" } });
      if (!res.ok) throw new Error(`DDG ${res.status}`);
      const j: any = await res.json();

      const abstract = j.AbstractText || j.Answer || "";
      const heading = j.Heading || "";
      const related = (j.RelatedTopics || [])
        .filter((t: any) => t.Text)
        .slice(0, 3)
        .map((t: any) => `• ${t.Text}`)
        .join("\n");

      let answer = "";
      if (abstract) answer = `**${heading}**\n\n${abstract}`;
      else if (related) answer = `Voici ce que j'ai trouvé :\n\n${related}`;
      else
        answer =
          "Je n'ai pas trouvé de réponse précise sur le web 🌿. Essayez de reformuler, ou demandez-moi sur **livraison**, **prix**, **abonnement**, **mariage**…";

      const citations: string[] = [];
      if (j.AbstractURL) citations.push(j.AbstractURL);

      return { source: "duckduckgo" as const, answer, citations };
    } catch (e) {
      return {
        source: "error" as const,
        answer: "Désolé, la recherche web est momentanément indisponible. Posez-moi une question sur nos bouquets, abonnements ou livraisons 🌷",
        citations: [],
      };
    }
  });
