import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success(t("contact.success"));
    }, 800);
  };

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-14 animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">{t("common.sectionContact")}</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">{t("contact.title")}</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="bg-gradient-romantic rounded-3xl p-8 shadow-soft">
            <h2 className="font-display text-2xl text-foreground mb-6">{t("contact.coordinates")}</h2>
            <ul className="space-y-4 text-foreground/85">
              <li className="flex items-start gap-3"><Phone className="h-5 w-5 text-primary mt-0.5" /> <a href="https://wa.me/50955017732?text=Salut%20Samayoo%20Flowers%2C%20Je%20voudrais%20avoir%20plus%20d%27informations%20sur%20vos%20produits%20svp..." target="_blank" rel="noopener noreferrer" className="story-link">+509 55 01 77 32</a></li>
              <li className="flex items-start gap-3"><Mail className="h-5 w-5 text-primary mt-0.5" /> <a href="mailto:samaraben10icloud.com" className="story-link">samaraben10icloud.com</a></li>
              <li className="flex items-start gap-3"><MapPin className="h-5 w-5 text-primary mt-0.5" /> Port-au-Prince, Haïti</li>
              <li className="flex items-start gap-3"><Facebook className="h-5 w-5 text-primary mt-0.5" /> <a href="https://www.facebook.com/profile.php?id=61571305557097" target="_blank" rel="noopener noreferrer" className="story-link">Samayoo Flowers</a></li>
              <li className="flex items-start gap-3"><Music2 className="h-5 w-5 text-primary mt-0.5" /> <a href="https://www.tiktok.com/@samayoo01?_r=1&_t=ZS-95kygrqkeeH" target="_blank" rel="noopener noreferrer" className="story-link">TikTok : @Samayoo01</a></li>
            </ul>
            <div className="mt-8 p-4 bg-card/70 rounded-xl border border-border">
              <p className="font-display text-lg text-primary">{t("contact.hours")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("contact.hoursWeek")}</p>
              <p className="text-sm text-muted-foreground">{t("contact.hoursSunday")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 shadow-soft space-y-4">
            <h2 className="font-display text-2xl text-foreground mb-2">{t("contact.sendMessage")}</h2>
            <Input name="nom" placeholder={t("contact.name")} required autoComplete="name" />
            <Input name="email" type="email" placeholder={t("contact.email")} required autoComplete="email" />
            <Input name="event" placeholder={t("contact.eventType")} />
            <Textarea name="message" placeholder={t("contact.message")} required rows={6} />
            <Button type="submit" disabled={submitting} size="lg" className="w-full rounded-full">
              {submitting ? t("contact.sending") : t("contact.send")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
