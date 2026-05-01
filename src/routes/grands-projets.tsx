import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import g1 from "@/assets/gal-art-1.jpg";
import g2 from "@/assets/gal-art-5.jpg";
import g3 from "@/assets/gal-art-10.jpg";
import g4 from "@/assets/gal-nat-3.jpg";
import g5 from "@/assets/gal-nat-8.jpg";
import g6 from "@/assets/gal-nat-15.jpg";

export const Route = createFileRoute("/grands-projets")({
  head: () => ({
    meta: [
      { title: "Grands Projets — SAMAYOO FLOWERS" },
      { name: "description", content: "Mariages, événements corporatifs, scénographies florales d'exception par Samayoo Flowers." },
      { property: "og:title", content: "Grands Projets — SAMAYOO FLOWERS" },
      { property: "og:description", content: "Décoration florale pour mariages et événements professionnels." },
    ],
  }),
  component: GrandsProjetsPage,
});

const gallery = [g1, g2, g3, g4, g5, g6];

function GrandsProjetsPage() {
  const [client, setClient] = useState("");
  const [eventType, setEventType] = useState("Mariage");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !phone) return toast.error("Nom et téléphone requis");
    setSubmitting(true);
    const { error } = await supabase.from("contracts").insert({
      client_name: client,
      event_type: eventType,
      event_date: date || null,
      budget: budget ? Number(budget) : null,
      phone,
      email: email || null,
      description,
    });
    setSubmitting(false);
    if (error) return toast.error("Erreur : " + error.message);
    toast.success("🌸 Demande de devis envoyée — un conseiller vous contacte sous 24h.");
    setClient(""); setDate(""); setBudget(""); setPhone(""); setEmail(""); setDescription("");
  };

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-12">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Événementiel</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">Grands Projets</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Mariages, galas, événements corporatifs : nous transformons vos lieux en scénographies florales d'exception.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {gallery.map((src, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-soft hover-lift">
              <img src={src} alt={`Réalisation ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-card border border-border rounded-3xl p-7 shadow-soft">
            <Sparkles className="h-8 w-8 text-accent mb-3" />
            <h2 className="font-display text-2xl text-primary mb-3">Notre approche</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              De la première rencontre au démontage, nous orchestrons chaque détail floral.
              Chefs de produit dédiés, équipe de pose, transport sécurisé, et installation
              le jour J — laissez-nous magnifier votre événement.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Building2 className="h-4 w-4 text-accent" /> Mariages haut de gamme</li>
              <li className="flex items-center gap-2"><Building2 className="h-4 w-4 text-accent" /> Conférences & galas corporatifs</li>
              <li className="flex items-center gap-2"><Building2 className="h-4 w-4 text-accent" /> Anniversaires de prestige</li>
              <li className="flex items-center gap-2"><Building2 className="h-4 w-4 text-accent" /> Inaugurations & lancements</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-7 shadow-soft">
            <h2 className="font-display text-2xl text-primary mb-5">Demander un devis</h2>
            <div className="space-y-3">
              <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Nom / Société *" className="w-full p-3 rounded-xl border border-border bg-background" />
              <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full p-3 rounded-xl border border-border bg-background">
                <option>Mariage</option>
                <option>Gala corporatif</option>
                <option>Anniversaire prestige</option>
                <option>Inauguration</option>
                <option>Autre</option>
              </select>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 rounded-xl border border-border bg-background" />
              <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget estimé (HTG)" className="w-full p-3 rounded-xl border border-border bg-background" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone *" className="w-full p-3 rounded-xl border border-border bg-background" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full p-3 rounded-xl border border-border bg-background" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez votre projet, lieu, ambiance..." rows={4} className="w-full p-3 rounded-xl border border-border bg-background" />
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Envoi..." : "Recevoir mon devis 🌸"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
