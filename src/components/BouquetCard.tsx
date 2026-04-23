import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice, type Bouquet } from "@/data/bouquets";

export function BouquetCard({ bouquet }: { bouquet: Bouquet }) {
  const { addItem } = useCart();
  const { t } = useTranslation();

  const handleAdd = () => {
    addItem(bouquet);
    toast.success(t("common.addedToCart", { name: bouquet.name }));
  };

  return (
    <article className="group bg-card rounded-2xl overflow-hidden shadow-soft hover-lift border border-border/60 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-secondary/40">
        <img
          src={bouquet.image}
          alt={bouquet.alt}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-display text-xl text-foreground">{bouquet.name}</h3>
        <p className="text-sm text-muted-foreground flex-1">{bouquet.description}</p>
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
