import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Search } from "lucide-react";
import { askSamayooBot } from "@/server/chatbot.functions";

interface Msg {
  role: "user" | "bot";
  content: string;
  citations?: string[];
  source?: "samayoo" | "duckduckgo" | "error";
}

export function SamayooBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      content:
        "Bonjour 🌹 Je suis l'assistant **Samayoo Flowers**. Posez-moi vos questions (livraisons, prix, abonnements) — je peux aussi chercher sur le web !",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, searching]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setLoading(true);

    // Indicateur "Recherche web" si la requête n'est pas un mot-clé Samayoo
    const curated = ["livraison", "prix", "abonnement", "mariage", "contact", "horaires"];
    const willSearch = !curated.some((k) => text.toLowerCase().includes(k));
    if (willSearch) setSearching(true);

    try {
      const res = await askSamayooBot({ data: { message: text } });
      setMsgs((m) => [
        ...m,
        { role: "bot", content: res.answer, citations: res.citations, source: res.source },
      ]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "bot", content: "Erreur de connexion. Réessayez dans un instant 🌿", source: "error" },
      ]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Ouvrir le chat Samayoo"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-elegant transition-transform hover:scale-105"
        style={{ backgroundColor: "#4A0404", color: "#D4AF37" }}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Fenêtre de chat */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl shadow-elegant animate-scale-in"
          style={{ backgroundColor: "#FAF7F2", border: "1px solid #D4AF37", height: "min(70vh, 560px)" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: "#4A0404", color: "#D4AF37" }}
          >
            <div>
              <div className="font-display text-base font-semibold">Samayoo Flowers</div>
              <div className="text-[11px] opacity-80">Assistant intelligent · en ligne</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap"
                  style={
                    m.role === "user"
                      ? { backgroundColor: "#4A0404", color: "#FAF7F2" }
                      : { backgroundColor: "#FFFFFF", color: "#4A0404", border: "1px solid #E8DCC4" }
                  }
                  dangerouslySetInnerHTML={{
                    __html: m.content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
                  }}
                />
              </div>
            ))}

            {searching && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs italic"
                  style={{ backgroundColor: "#FFFFFF", color: "#4A0404", border: "1px dashed #D4AF37" }}
                >
                  <Search className="h-3.5 w-3.5 animate-pulse" style={{ color: "#D4AF37" }} />
                  Recherche sur le web…
                </div>
              </div>
            )}

            {loading && !searching && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl px-3.5 py-2 text-sm"
                  style={{ backgroundColor: "#FFFFFF", color: "#4A0404", border: "1px solid #E8DCC4" }}
                >
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: "#4A0404" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:120ms]" style={{ backgroundColor: "#4A0404" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:240ms]" style={{ backgroundColor: "#4A0404" }} />
                  </span>
                </div>
              </div>
            )}

            {/* Citations */}
            {msgs.map(
              (m, i) =>
                m.citations && m.citations.length > 0 && (
                  <div key={`c-${i}`} className="text-[10px] pl-2" style={{ color: "#7A4A4A" }}>
                    Source :{" "}
                    {m.citations.map((c, j) => (
                      <a key={j} href={c} target="_blank" rel="noreferrer" className="underline" style={{ color: "#4A0404" }}>
                        {new URL(c).hostname}
                      </a>
                    ))}
                  </div>
                )
            )}
          </div>

          {/* Input */}
          <div className="border-t px-3 py-2.5 flex gap-2" style={{ borderColor: "#E8DCC4", backgroundColor: "#FFFFFF" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Écrivez votre question…"
              disabled={loading}
              className="flex-1 rounded-full px-4 py-2 text-sm outline-none"
              style={{
                backgroundColor: "#FAF7F2",
                color: "#4A0404",
                border: "1px solid #E8DCC4",
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Envoyer"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity disabled:opacity-40"
              style={{ backgroundColor: "#4A0404", color: "#D4AF37" }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
