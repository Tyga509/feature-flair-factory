import { ShoppingBag, Music } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice, type Bouquet } from "@/data/bouquets";

export function BouquetCard({ bouquet }: { bouquet: Bouquet }) {
  const { addItem } = useCart();
  const { t } = useTranslation();

  // Traduction dynamique : on tente la clé i18n par id, sinon on garde la valeur d'origine.
  // Cela couvre aussi bien les bouquets statiques que ceux issus de la BDD (fallback gracieux).
  const localizedName = t(`bouquets.${bouquet.id}.name`, { defaultValue: bouquet.name });
  const localizedDescription = t(`bouquets.${bouquet.id}.description`, { defaultValue: bouquet.description });
  const localizedCategory = bouquet.category
    ? t(`categories.${bouquet.category}`, { defaultValue: bouquet.category })
    : null;

  const handleAdd = () => {
    addItem(bouquet);
    toast.success(t("common.addedToCart", { name: localizedName }));
  };

  const isPack = bouquet.category === "Pack Célébration";

  return (
    <article className="group bg-card rounded-2xl overflow-hidden shadow-soft hover-lift border border-border/60 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-secondary/40">
        <img
          src={bouquet.image}
          alt={bouquet.alt}
          loading="lazy"
          decoding="async"
          width={1024}
          height={1024}
          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
        />
        {isPack && (
          <div className="absolute top-3 right-3 bg-accent text-accent-foreground rounded-full p-2.5 shadow-elegant ring-2 ring-background animate-scale-in">
            <Music className="h-4 w-4" />
          </div>
        )}
        {localizedCategory && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-background/90 text-primary backdrop-blur-sm">
              {localizedCategory}
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-display text-xl text-foreground">{localizedName}</h3>
        <p className="text-sm text-muted-foreground flex-1">{localizedDescription}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-display text-lg text-primary font-semibold">
            {formatPrice(bouquet.price)}
          </span>
          <Button onClick={handleAdd} size="sm" className="gap-1.5 rounded-full">
            <ShoppingBag className="h-4 w-4" />
            {t("common.add")}
          </Button>
        </div>
      </div>
    </article>
  );
}
