import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice, type Bouquet } from "@/data/bouquets";

export function BouquetCard({ bouquet }: { bouquet: Bouquet }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(bouquet);
    toast.success(`${bouquet.name} ajouté au panier 🌸`);
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
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
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
            Ajouter
          </Button>
        </div>
      </div>
    </article>
  );
}
