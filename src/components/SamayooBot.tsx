import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Search, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { askSamayooBot } from "@/lib/chatbot.functions";

interface Msg {
  role: "user" | "bot";
  content: string;
  citations?: string[];
  source?: "samayoo" | "duckduckgo" | "error";
}

const UI = {
  fr: {
    title: "Concierge Samayoo",
    status: "À votre service · en ligne",
    welcome:
      "Mes hommages 🌹 — je suis le **Concierge Samayoo Flowers**. Tarifs, livraisons, abonnements, fleurs de saison ou conseils d'entretien : posez-moi votre question.",
    placeholder: "Votre demande, je vous prie…",
    searching: "Consultation des sources florales…",
    error: "Une indisponibilité passagère 🌿. Réessayez dans un instant.",
    source: "Source",
  },
  ht: {
    title: "Konsyèj Samayoo",
    status: "Nan sèvis ou · anliy",
    welcome:
      "Bonjou 🌹 — mwen se **Konsyèj Samayoo Flowers** la. Pri, livrezon, abònman, flè sezon oswa konsèy antretyen : poze m kesyon w.",
    placeholder: "Mande m sa w bezwen…",
    searching: "M ap konsilte sous florèl yo…",
    error: "Yon ti pwoblèm pasaje 🌿. Eseye ankò nan yon ti moman.",
    source: "Sous",
  },
  en: {
    title: "Samayoo Concierge",
    status: "At your service · online",
    welcome:
      "My compliments 🌹 — I am the **Samayoo Flowers Concierge**. Pricing, delivery, subscriptions, seasonal blooms or care advice: please ask.",
    placeholder: "How may I assist you…",
    searching: "Consulting floral sources…",
    error: "A brief unavailability 🌿. Please try again in a moment.",
    source: "Source",
  },
};

const BORDEAUX = "#4A0404";
const GOLD = "#D4AF37";
const IVORY = "#FAF7F2";
const GOLD_SOFT = "#E8DCC4";

export function SamayooBot() {
  const { i18n } = useTranslation();
  const lang = (["fr", "ht", "en"].includes(i18n.language) ? i18n.language : "fr") as
    | "fr"
    | "ht"
    | "en";
  const t = UI[lang];

  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset welcome on language change
  useEffect(() => {
    setMsgs([{ role: "bot", content: t.welcome }]);
  }, [lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, searching]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setLoading(true);

    const curated = ["livraison", "livrezon", "delivery", "prix", "tarif", "price", "pri", "abonnement", "abònman", "subscription", "mariage", "maryaj", "wedding", "contact", "kontak", "horaire", "hours", "lè"];
    const willSearch = !curated.some((k) => text.toLowerCase().includes(k));
    if (willSearch) setSearching(true);

    try {
      const res = await askSamayooBot({ data: { message: text, lang } });
      setMsgs((m) => [
        ...m,
        { role: "bot", content: res.answer, citations: res.citations, source: res.source },
      ]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", content: t.error, source: "error" }]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.title}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-elegant transition-transform hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${BORDEAUX} 0%, #6B0808 100%)`,
          color: GOLD,
          border: `2px solid ${GOLD}`,
        }}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl shadow-elegant animate-scale-in"
          style={{
            backgroundColor: IVORY,
            border: `1px solid ${GOLD}`,
            height: "min(72vh, 580px)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{
              background: `linear-gradient(135deg, ${BORDEAUX} 0%, #6B0808 100%)`,
              color: GOLD,
              borderBottom: `1px solid ${GOLD}`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-5 w-5" />
              <div>
                <div className="font-display text-base font-semibold tracking-wide">
                  {t.title}
                </div>
                <div className="text-[11px] opacity-85">{t.status}</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {msgs.map((m, i) => (
              <div key={i}>
                <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap"
                    style={
                      m.role === "user"
                        ? { backgroundColor: BORDEAUX, color: IVORY }
                        : {
                            backgroundColor: "#FFFFFF",
                            color: BORDEAUX,
                            border: `1px solid ${GOLD_SOFT}`,
                          }
                    }
                    dangerouslySetInnerHTML={{
                      __html: m.content.replace(/\*\*(.+?)\*\*/g, '<strong style="color:' + GOLD + ';background:' + BORDEAUX + ';padding:0 4px;border-radius:3px">$1</strong>').replace(/\n/g, "<br/>"),
                    }}
                  />
                </div>
                {m.citations && m.citations.length > 0 && (
                  <div className="text-[10px] pl-2 mt-1" style={{ color: "#7A4A4A" }}>
                    {t.source} :{" "}
                    {m.citations.map((c, j) => {
                      try {
                        return (
                          <a
                            key={j}
                            href={c}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                            style={{ color: BORDEAUX }}
                          >
                            {new URL(c).hostname}
                          </a>
                        );
                      } catch {
                        return null;
                      }
                    })}
                  </div>
                )}
              </div>
            ))}

            {searching && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs italic"
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: BORDEAUX,
                    border: `1px dashed ${GOLD}`,
                  }}
                >
                  <Search className="h-3.5 w-3.5 animate-pulse" style={{ color: GOLD }} />
                  🔍 {t.searching}
                </div>
              </div>
            )}

            {loading && !searching && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl px-3.5 py-2 text-sm"
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: BORDEAUX,
                    border: `1px solid ${GOLD_SOFT}`,
                  }}
                >
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: BORDEAUX }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:120ms]" style={{ backgroundColor: BORDEAUX }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:240ms]" style={{ backgroundColor: BORDEAUX }} />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            className="border-t px-3 py-2.5 flex gap-2"
            style={{ borderColor: GOLD_SOFT, backgroundColor: "#FFFFFF" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t.placeholder}
              disabled={loading}
              className="flex-1 rounded-full px-4 py-2 text-sm outline-none focus:ring-2"
              style={{
                backgroundColor: IVORY,
                color: BORDEAUX,
                border: `1px solid ${GOLD_SOFT}`,
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity disabled:opacity-40 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${BORDEAUX} 0%, #6B0808 100%)`,
                color: GOLD,
                border: `1px solid ${GOLD}`,
              }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
