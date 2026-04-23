import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/bouquets";
import { ThankYouModal } from "@/components/ThankYouModal";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Panier — SAMAYOO FLOWERS" },
      { name: "description", content: "Récapitulatif de votre commande Samayoo Flowers." },
      { property: "og:title", content: "Panier — SAMAYOO FLOWERS" },
      { property: "og:description", content: "Finalisez votre commande de bouquets." },
    ],
  }),
  component: PanierPage,
});

function PanierPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const [showThanks, setShowThanks] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const { t } = useTranslation();

  const handleCheckout = () => {
    const num = `SAM-${Date.now().toString().slice(-6)}`;
    setOrderNumber(num);
    setOrderTotal(formatPrice(totalPrice));
    setShowThanks(true);
  };

  const handleClose = () => {
    setShowThanks(false);
    clearCart();
  };

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 animate-fade-in">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">{t("common.sectionYourCart")}</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">{t("cart.title")}</h1>
        </header>

        {items.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-soft">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40" />
            <h2 className="font-display text-2xl mt-4 text-foreground">{t("cart.empty")}</h2>
            <p className="text-muted-foreground mt-2">{t("cart.emptyDesc")}</p>
            <Button asChild className="rounded-full mt-6 px-8" size="lg">
              <Link to="/boutique">{t("common.viewBoutique")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-2xl p-4 flex gap-4 shadow-soft animate-fade-in"
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg text-foreground">{item.name}</h3>
                        <p className="text-sm text-primary font-medium">{formatPrice(item.price)}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={t("cart.remove")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-3">
                      <div className="inline-flex items-center gap-1 border border-border rounded-full p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7 rounded-full hover:bg-secondary flex items-center justify-center"
                          aria-label={t("cart.less")}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 rounded-full hover:bg-secondary flex items-center justify-center"
                          aria-label={t("cart.more")}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-semibold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-gradient-romantic border border-accent/30 rounded-3xl p-6 h-fit shadow-elegant sticky top-28">
              <h2 className="font-display text-2xl text-foreground">{t("cart.summary")}</h2>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">{t("cart.items")}</dt><dd>{totalItems}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">{t("cart.subtotal")}</dt><dd>{formatPrice(totalPrice)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">{t("cart.delivery")}</dt><dd className="text-accent font-medium">{t("cart.deliveryTbd")}</dd></div>
              </dl>
              <div className="border-t border-border my-4" />
              <div className="flex justify-between items-baseline">
                <span className="font-display text-lg">{t("cart.total")}</span>
                <span className="font-display text-2xl text-primary font-semibold">{formatPrice(totalPrice)}</span>
              </div>
              <Button onClick={handleCheckout} size="lg" className="w-full rounded-full mt-6">
                {t("cart.checkout")}
              </Button>
              <Button asChild variant="ghost" size="sm" className="w-full mt-2">
                <Link to="/boutique">{t("common.continueShopping")}</Link>
              </Button>
            </aside>
          </div>
        )}

        <ThankYouModal
          open={showThanks}
          onClose={handleClose}
          orderNumber={orderNumber}
          total={orderTotal}
        />
      </div>
    </div>
  );
}
