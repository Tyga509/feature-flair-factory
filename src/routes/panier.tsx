import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Upload, Check, Gift, Truck, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/bouquets";
import { ThankYouModal } from "@/components/ThankYouModal";
import { supabase } from "@/integrations/supabase/client";
import { buildOrderPdf, fileToDataUrl } from "@/lib/orderPdf";
import { sendOrderEmail } from "@/server/orders.functions";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Panier — SAMAYOO FLOWERS" },
      { name: "description", content: "Finalisez votre commande sur Samayoo Flowers." },
    ],
  }),
  component: PanierPage,
});

function PanierPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice: cartSubtotal, totalItems } = useCart();
  const [showThanks, setShowThanks] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const { t } = useTranslation();

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "MonCash",
    paymentProof: null as File | null,
    acceptMarketing: false,
    wantsDedicace: false,
    wantsLivraison: false
  });

  const finalTotal = useMemo(() => {
    let total = cartSubtotal;
    if (customerInfo.wantsDedicace) total += 1000;
    if (customerInfo.wantsLivraison) total += 1000;
    return total;
  }, [cartSubtotal, customerInfo.wantsDedicace, customerInfo.wantsLivraison]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert("Fichier trop lourd (max 10 MB)");
        return;
      }
      setCustomerInfo({ ...customerInfo, paymentProof: file });
    }
  };

  const handleCheckout = async () => {
    const num = `SAM-${Date.now().toString().slice(-6)}`;
    try {
      // 1. Upload payment proof (if any)
      let proofUrl: string | undefined;
      let proofDataUrl: string | undefined;
      if (customerInfo.paymentProof) {
        const file = customerInfo.paymentProof;
        proofDataUrl = await fileToDataUrl(file);
        const path = `proofs/${num}-${Date.now()}.${file.name.split(".").pop() || "jpg"}`;
        const { error: upErr } = await supabase.storage.from("flower-storage").upload(path, file, { upsert: false });
        if (!upErr) {
          proofUrl = supabase.storage.from("flower-storage").getPublicUrl(path).data.publicUrl;
        }
      }

      // 2. Save / upsert client
      const { data: clientRow } = await supabase
        .from("clients" as any)
        .insert({
          full_name: customerInfo.fullName,
          email: customerInfo.email || null,
          phone: customerInfo.phone,
          address: customerInfo.address || null,
          accept_marketing: customerInfo.acceptMarketing,
        })
        .select("id")
        .single();

      // 3. Build PDF
      const itemsArr = items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price }));
      const { blob: pdfBlob, base64: pdfBase64 } = buildOrderPdf({
        orderNumber: num,
        fullName: customerInfo.fullName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        paymentMethod: customerInfo.paymentMethod,
        items: itemsArr,
        subtotal: cartSubtotal,
        dedicace: customerInfo.wantsDedicace,
        livraison: customerInfo.wantsLivraison,
        total: finalTotal,
        paymentProofDataUrl: proofDataUrl,
      });

      // 4. Upload PDF
      const pdfPath = `orders/${num}.pdf`;
      let pdfUrl: string | undefined;
      const { error: pdfErr } = await supabase.storage.from("flower-storage").upload(pdfPath, pdfBlob, {
        contentType: "application/pdf",
        upsert: true,
      });
      if (!pdfErr) {
        pdfUrl = supabase.storage.from("flower-storage").getPublicUrl(pdfPath).data.publicUrl;
      }

      // 5. Save order
      await supabase.from("orders" as any).insert({
        order_number: num,
        client_id: (clientRow as any)?.id ?? null,
        full_name: customerInfo.fullName,
        email: customerInfo.email || null,
        phone: customerInfo.phone,
        address: customerInfo.address || null,
        payment_method: customerInfo.paymentMethod,
        payment_proof_url: proofUrl ?? null,
        items: itemsArr,
        subtotal: cartSubtotal,
        dedicace: customerInfo.wantsDedicace,
        livraison: customerInfo.wantsLivraison,
        total: finalTotal,
        status: "en_attente",
        pdf_url: pdfUrl ?? null,
      });

      // 6. Send email
      const html = `
        <h2 style="color:#4A0404">Nouvelle commande ${num}</h2>
        <p><b>Client :</b> ${customerInfo.fullName}<br/>
        <b>Téléphone :</b> ${customerInfo.phone}<br/>
        <b>Email :</b> ${customerInfo.email || "—"}<br/>
        <b>Adresse :</b> ${customerInfo.address || "—"}<br/>
        <b>Paiement :</b> ${customerInfo.paymentMethod}</p>
        <h3>Articles</h3>
        <ul>${itemsArr.map((i) => `<li>${i.name} × ${i.quantity} — ${formatPrice(i.price * i.quantity)}</li>`).join("")}</ul>
        <p><b>Total : ${formatPrice(finalTotal)}</b></p>
        ${pdfUrl ? `<p><a href="${pdfUrl}">Télécharger la fiche PDF</a></p>` : ""}
        ${proofUrl ? `<p><a href="${proofUrl}">Voir la preuve de paiement</a></p>` : ""}
      `;
      try {
        const r = await sendOrderEmail({
          data: {
            to: "samarabendieunicavictor@gmail.com",
            subject: `Commande ${num} — ${customerInfo.fullName}`,
            html,
            pdfBase64,
            pdfFilename: `commande-${num}.pdf`,
            proofBase64: proofDataUrl ? proofDataUrl.split(",")[1] : undefined,
            proofFilename: proofDataUrl ? `preuve-${num}.${proofDataUrl.includes("png") ? "png" : "jpg"}` : undefined,
          },
        });
        if (!r.ok) {
          toast.message("Commande enregistrée. Email automatique non configuré — fiche PDF disponible.");
        } else {
          toast.success("Commande envoyée par email avec succès");
        }
      } catch {
        toast.message("Commande enregistrée. Envoi email indisponible.");
      }

      // 7. Local download for the customer
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url; a.download = `commande-${num}.pdf`; a.click();
      URL.revokeObjectURL(url);

      setOrderNumber(num);
      setOrderTotal(formatPrice(finalTotal));
      setShowThanks(true);
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur lors de la validation : " + (e?.message ?? "inconnue"));
    }
  };

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 animate-fade-in text-center md:text-left">
          <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase">{t("common.sectionYourCart")}</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 text-primary">{t("cart.title")}</h1>
        </header>

        {items.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-soft">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40" />
            <h2 className="font-display text-2xl mt-4 text-foreground">{t("cart.empty")}</h2>
            <Button asChild className="rounded-full mt-6 px-8" size="lg">
              <Link to="/boutique">{t("common.viewBoutique")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4 shadow-soft">
                  <img src={item.image} alt={item.alt} className="h-24 w-24 sm:h-32 sm:w-32 rounded-xl object-cover" />
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <h3 className="font-display text-lg">{item.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive p-1">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 bg-secondary/50 rounded-full p-1 border border-border">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 rounded-full bg-background text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm" disabled={item.quantity <= 1}>
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-bold text-sm w-4 text-center text-foreground">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 rounded-full bg-background text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{formatPrice(item.price)} / unité</p>
                        <p className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-gradient-romantic border border-accent/30 rounded-3xl p-6 h-fit shadow-elegant sticky top-28">
              <h2 className="font-display text-2xl mb-6">{t("cart.summary")}</h2>
              
              <div className="space-y-4 mb-6">
                <input type="text" placeholder="Nom complet" className="w-full p-3 rounded-xl border border-border bg-background/70 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary" value={customerInfo.fullName} onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})} />
                <input type="email" placeholder="Email" className="w-full p-3 rounded-xl border border-border bg-background/70 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary" value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} />
                <input type="tel" placeholder="WhatsApp" className="w-full p-3 rounded-xl border border-border bg-background/70 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                <textarea placeholder="Adresse de livraison" className="w-full p-3 rounded-xl border border-border bg-background/70 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary" rows={2} value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} />

                <div className="grid grid-cols-1 gap-2 pt-2">
                  <label className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${customerInfo.wantsDedicace ? 'border-primary bg-primary/5' : 'border-border bg-background/40'}`}>
                    <div className="flex items-center gap-3">
                      <Gift size={18} className={customerInfo.wantsDedicace ? 'text-primary' : 'text-muted-foreground'} />
                      <span className="text-xs font-medium text-foreground">Dédicace (+1,000 GDES)</span>
                    </div>
                    <input type="checkbox" className="hidden" checked={customerInfo.wantsDedicace} onChange={(e) => setCustomerInfo({...customerInfo, wantsDedicace: e.target.checked})} />
                    {customerInfo.wantsDedicace && <Check size={16} className="text-primary" />}
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${customerInfo.wantsLivraison ? 'border-primary bg-primary/5' : 'border-border bg-background/40'}`}>
                    <div className="flex items-center gap-3">
                      <Truck size={18} className={customerInfo.wantsLivraison ? 'text-primary' : 'text-muted-foreground'} />
                      <span className="text-xs font-medium text-foreground">Livraison (+1,000 GDES)</span>
                    </div>
                    <input type="checkbox" className="hidden" checked={customerInfo.wantsLivraison} onChange={(e) => setCustomerInfo({...customerInfo, wantsLivraison: e.target.checked})} />
                    {customerInfo.wantsLivraison && <Check size={16} className="text-primary" />}
                  </label>
                </div>

                <select className="w-full p-3 rounded-xl border border-border bg-background/70 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary" value={customerInfo.paymentMethod} onChange={(e) => setCustomerInfo({...customerInfo, paymentMethod: e.target.value})}>
                  <option value="MonCash">MonCash</option>
                  <option value="Natcash">Natcash</option>
                  <option value="Unibank Online">Unibank Online</option>
                </select>

                {/* MESSAGE SUR LES FRAIS DE RETRAIT (DYNAMIQUE) */}
                {(customerInfo.paymentMethod === "MonCash" || customerInfo.paymentMethod === "Natcash") && (
                  <div className="flex gap-2 p-3 bg-accent/10 border border-accent/40 rounded-xl animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5 text-accent shrink-0" />
                    <p className="text-[11px] text-foreground leading-tight">
                      <strong>Note :</strong> Les frais de retrait sont à la charge du client. Veuillez inclure le montant des frais lors de votre transfert.
                    </p>
                  </div>
                )}

                <div className="relative border-2 border-dashed border-border rounded-xl p-4 text-center bg-background/40">
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                  <Upload size={18} className="mx-auto text-muted-foreground mb-1" />
                  <span className="text-[10px] text-muted-foreground block">{customerInfo.paymentProof ? customerInfo.paymentProof.name : "Cliquez pour uploader votre preuve"}</span>
                </div>
              </div>

              <dl className="space-y-2 text-xs border-t pt-4">
                <div className="flex justify-between"><dt className="text-muted-foreground">Sous-total</dt><dd>{formatPrice(cartSubtotal)}</dd></div>
                {customerInfo.wantsDedicace && <div className="flex justify-between text-primary font-medium"><dt>Service Dédicace</dt><dd>+ 1,000 GDES</dd></div>}
                {customerInfo.wantsLivraison && <div className="flex justify-between text-primary font-medium"><dt>Frais de Livraison</dt><dd>+ 1,000 GDES</dd></div>}
              </dl>
              
              <div className="flex justify-between font-display text-2xl text-primary font-bold mt-4">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>

              <Button onClick={handleCheckout} className="w-full rounded-full mt-6 shadow-lg h-12" disabled={!customerInfo.fullName || !customerInfo.phone || !customerInfo.address || !customerInfo.paymentProof}>
                Confirmer ma commande
              </Button>
            </aside>
          </div>
        )}

        <ThankYouModal open={showThanks} onClose={() => { setShowThanks(false); clearCart(); }} orderNumber={orderNumber} total={orderTotal} />
      </div>
    </div>
  );
}