import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Facebook, Music2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SAMAYOO FLOWERS" },
      { name: "description", content: "Contactez Samayoo Flowers pour vos commandes et événements à Port-au-Prince." },
      { property: "og:title", content: "Contact — SAMAYOO FLOWERS" },
      { property: "og:description", content: "Téléphone, email et formulaire de commande sur mesure." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Message envoyé ! Nous vous répondrons rapidement 🌸");
    }, 800);
  };

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-14 animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Contact</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">Contactez-nous</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Une commande, un événement, une question ? Écrivez-nous, nous vous répondons avec le sourire.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="bg-gradient-romantic rounded-3xl p-8 shadow-soft">
            <h2 className="font-display text-2xl text-foreground mb-6">Nos coordonnées</h2>
            <ul className="space-y-4 text-foreground/85">
              <li className="flex items-start gap-3"><Phone className="h-5 w-5 text-primary mt-0.5" /> <a href="https://wa.me/50955017732" target="_blank" rel="noopener noreferrer" className="story-link">+509 55 01 77 32</a></li>
              <li className="flex items-start gap-3"><Mail className="h-5 w-5 text-primary mt-0.5" /> <a href="mailto:samaraben10icloud.com" className="story-link">samaraben10icloud.com</a></li>
              <li className="flex items-start gap-3"><MapPin className="h-5 w-5 text-primary mt-0.5" /> Port-au-Prince, Haïti</li>
              <li className="flex items-start gap-3"><Facebook className="h-5 w-5 text-primary mt-0.5" /> <a href="https://www.facebook.com/profile.php?id=61571305557097" target="_blank" rel="noopener noreferrer" className="story-link">Samayoo Flowers</a></li>
              <li className="flex items-start gap-3"><Music2 className="h-5 w-5 text-primary mt-0.5" /> <a href="https://www.tiktok.com/@samayoo01?_r=1&_t=ZS-95kygrqkeeH" target="_blank" rel="noopener noreferrer" className="story-link">TikTok : @Samayoo01</a></li>
            </ul>
            <div className="mt-8 p-4 bg-card/70 rounded-xl border border-border">
              <p className="font-display text-lg text-primary">Horaires</p>
              <p className="text-sm text-muted-foreground mt-1">Lun – Sam : 9h – 18h</p>
              <p className="text-sm text-muted-foreground">Dimanche : sur rendez-vous</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 shadow-soft space-y-4">
            <h2 className="font-display text-2xl text-foreground mb-2">Envoyer un message</h2>
            <Input name="nom" placeholder="Votre nom" required autoComplete="name" />
            <Input name="email" type="email" placeholder="Votre email" required autoComplete="email" />
            <Input name="event" placeholder="Type d'événement (mariage, anniversaire…)" />
            <Textarea name="message" placeholder="Détails de votre commande ou message" required rows={6} />
            <Button type="submit" disabled={submitting} size="lg" className="w-full rounded-full">
              {submitting ? "Envoi en cours…" : "Envoyer le message"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
