import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Sparkles, Heart, Palette, Gift, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/composez")({
  head: () => ({
    meta: [
      { title: "Composez votre bonheur — SAMAYOO FLOWERS" },
      { name: "description", content: "Créez votre bouquet sur mesure en 6 étapes simples avec Samayoo Flowers." },
      { property: "og:title", content: "Composez votre bonheur — SAMAYOO FLOWERS" },
      { property: "og:description", content: "Stepper de création florale personnalisée." },
    ],
  }),
  component: ComposezPage,
});

type StepData = {
  bouquet_type: string;
  support: string;
  colors: string;
  accessories: string;
  dedication: string;
  full_name: string;
  phone: string;
  email: string;
};

const initial: StepData = {
  bouquet_type: "",
  support: "",
  colors: "",
  accessories: "",
  dedication: "",
  full_name: "",
  phone: "",
  email: "",
};

const steps = [
  { id: 1, label: "Type", icon: Sparkles, key: "bouquet_type" as const, options: ["Naturel", "Artificiel", "Éternel", "Money Bouquet", "Autre/Personnalisé"] },
  { id: 2, label: "Support", icon: Heart, key: "support" as const, options: ["Bouquet à la main", "Box ronde", "Box cœur", "Coffret bouteille", "Panier", "Autre/Personnalisé"] },
  { id: 3, label: "Couleurs", icon: Palette, key: "colors" as const, options: ["Rouge passion", "Pastel romantique", "Blanc pur", "Rose poudré", "Multicolore", "Autre/Personnalisé"] },
  { id: 4, label: "Accessoires", icon: Gift, key: "accessories" as const, options: ["Chocolats Ferrero", "Ballons", "Bougies", "Carte personnalisée", "Aucun", "Autre/Personnalisé"] },
  { id: 5, label: "Dédicace", icon: MessageSquare, key: "dedication" as const, options: [] },
  { id: 6, label: "Contact", icon: User, key: "full_name" as const, options: [] },
];

function ComposezPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>(initial);
  const [customMode, setCustomMode] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const current = steps[step - 1];

  const setField = (key: keyof StepData, value: string) =>
    setData((d) => ({ ...d, [key]: value }));

  const handleSubmit = async () => {
    if (!data.full_name || !data.phone) {
      toast.error("Nom et téléphone requis");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("custom_requests").insert({
      bouquet_type: data.bouquet_type || "Non précisé",
      support: data.support || "Non précisé",
      colors: data.colors || "Non précisé",
      accessories: data.accessories,
      dedication: data.dedication,
      full_name: data.full_name,
      phone: data.phone,
      email: data.email || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Erreur lors de l'envoi : " + error.message);
      return;
    }
    toast.success("🌸 Votre demande a été envoyée — nous vous contactons rapidement !");
    setData(initial);
    setStep(1);
  };

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <header className="text-center mb-10">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Sur Mesure</p>
          <h1 className="font-display text-4xl md:text-5xl mt-2 text-primary">Composez votre bonheur</h1>
          <p className="mt-3 text-muted-foreground">Six étapes pour créer votre bouquet idéal.</p>
        </header>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 overflow-x-auto pb-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center flex-shrink-0">
                <div className={`flex flex-col items-center ${active ? "text-primary" : done ? "text-accent" : "text-muted-foreground"}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    active ? "bg-primary text-primary-foreground border-primary scale-110" :
                    done ? "bg-accent text-accent-foreground border-accent" :
                    "border-border bg-card"
                  }`}>
                    {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className="text-[10px] mt-1 font-medium hidden sm:block">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-[2px] w-6 sm:w-12 mx-1 ${done ? "bg-accent" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-soft">
          <h2 className="font-display text-2xl text-primary mb-6 flex items-center gap-2">
            <current.icon className="h-6 w-6 text-accent" />
            Étape {step} : {current.label}
          </h2>

          {step <= 4 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.options.map((opt) => {
                  const isCustom = opt === "Autre/Personnalisé";
                  const selected = data[current.key] === opt || (isCustom && customMode[current.key]);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        if (isCustom) {
                          setCustomMode((m) => ({ ...m, [current.key]: true }));
                          setField(current.key, "");
                        } else {
                          setCustomMode((m) => ({ ...m, [current.key]: false }));
                          setField(current.key, opt);
                        }
                      }}
                      className={`p-4 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                        selected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-accent hover:bg-accent/5"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {customMode[current.key] && (
                <input
                  type="text"
                  value={data[current.key]}
                  onChange={(e) => setField(current.key, e.target.value)}
                  placeholder="Précisez votre choix..."
                  className="w-full p-3 rounded-xl border border-border bg-background mt-3"
                />
              )}
            </div>
          )}

          {step === 5 && (
            <textarea
              value={data.dedication}
              onChange={(e) => setField("dedication", e.target.value)}
              rows={5}
              placeholder="Le message à inscrire sur votre carte (ou laissez vide)..."
              className="w-full p-4 rounded-xl border border-border bg-background"
            />
          )}

          {step === 6 && (
            <div className="space-y-3">
              <input
                value={data.full_name}
                onChange={(e) => setField("full_name", e.target.value)}
                placeholder="Nom complet *"
                className="w-full p-3 rounded-xl border border-border bg-background"
              />
              <input
                value={data.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="Téléphone WhatsApp *"
                className="w-full p-3 rounded-xl border border-border bg-background"
              />
              <input
                value={data.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="Email (optionnel)"
                type="email"
                className="w-full p-3 rounded-xl border border-border bg-background"
              />
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4" /> Précédent
            </Button>
            {step < 6 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)}>
                Suivant <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Envoi..." : "Envoyer ma demande 🌸"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
