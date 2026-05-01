import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Crown, Gem, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/abonnements")({
  head: () => ({
    meta: [
      { title: "Abonnements Floraux — SAMAYOO FLOWERS" },
      { name: "description", content: "Bronze, Or, Diamant — recevez régulièrement des compositions florales Samayoo." },
      { property: "og:title", content: "Abonnements — SAMAYOO FLOWERS" },
      { property: "og:description", content: "Trois formules d'abonnement pour fleurir votre quotidien." },
    ],
  }),
  component: AbonnementsPage,
});

const formulas = [
  {
    id: "bronze",
    name: "Bronze",
    icon: Award,
    price: "8 000 HTG / mois",
    color: "text-amber-700",
    border: "border-amber-700/30",
    perks: ["1 bouquet par mois", "Composition saisonnière", "Livraison incluse à Port-au-Prince", "Carte personnalisée"],
  },
  {
    id: "or",
    name: "Or",
    icon: Crown,
    price: "18 000 HTG / mois",
    color: "text-accent",
    border: "border-accent",
    featured: true,
    perks: ["2 bouquets par mois", "Compositions premium", "Livraison express", "Cartes calligraphiées", "Surprise mensuelle"],
  },
  {
    id: "diamant",
    name: "Diamant",
    icon: Gem,
    price: "35 000 HTG / mois",
    color: "text-primary",
    border: "border-primary",
    perks: ["4 bouquets par mois", "Créations sur-mesure", "Livraison nationale", "Coffret luxe", "Accès prioritaire événements", "Conseiller dédié"],
  },
];

function AbonnementsPage() {
  const [selected, setSelected] = useState("or");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return toast.error("Nom et téléphone requis");
    setSubmitting(true);
    const { error } = await supabase.from("subscriptions").insert({
      formula: selected,
      full_name: name,
      phone,
      email: email || null,
      address: address || null,
    });
    setSubmitting(false);
    if (error) return toast.error("Erreur : " + error.message);
    toast.success(`🌸 Souscription ${selected.toUpperCase()} confirmée !`);
    setName(""); setPhone(""); setEmail(""); setAddress("");
  };

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-12">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Prestige</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">Abonnements Floraux</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Recevez régulièrement la signature Samayoo. Trois formules pour célébrer la beauté toute l'année.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {formulas.map((f) => {
            const Icon = f.icon;
            const isSel = selected === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelected(f.id)}
                className={`relative text-left bg-card rounded-3xl p-7 border-2 transition-all hover-lift ${
                  isSel ? `${f.border} shadow-elegant scale-[1.02]` : "border-border"
                }`}
              >
                {f.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                    POPULAIRE
                  </span>
                )}
                <Icon className={`h-10 w-10 ${f.color} mb-4`} />
                <h3 className="font-display text-2xl text-foreground mb-1">{f.name}</h3>
                <p className={`font-semibold mb-5 ${f.color}`}>{f.price}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {f.perks.map((p) => (
                    <li key={p} className="flex gap-2">
                      <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 max-w-2xl mx-auto shadow-soft">
          <h2 className="font-display text-2xl text-primary mb-6">
            Souscrire à la formule {formulas.find((f) => f.id === selected)?.name}
          </h2>
          <div className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet *" className="w-full p-3 rounded-xl border border-border bg-background" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone WhatsApp *" className="w-full p-3 rounded-xl border border-border bg-background" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full p-3 rounded-xl border border-border bg-background" />
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Adresse de livraison" rows={3} className="w-full p-3 rounded-xl border border-border bg-background" />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Envoi..." : "Confirmer ma souscription 🌸"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
