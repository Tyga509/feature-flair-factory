import jsPDF from "jspdf";

export type OrderPdfPayload = {
  orderNumber: string;
  fullName: string;
  email?: string;
  phone: string;
  address?: string;
  paymentMethod?: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  dedicace: boolean;
  livraison: boolean;
  total: number;
  paymentProofDataUrl?: string;
};

const fmt = (n: number) => `${n.toLocaleString("fr-FR")} HTG`;

export function buildOrderPdf(p: OrderPdfPayload): { blob: Blob; base64: string } {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  let y = 50;

  doc.setFillColor(74, 4, 4);
  doc.rect(0, 0, W, 80, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("SAMAYOO FLOWERS", 40, 40);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Fiche de commande", 40, 60);

  y = 110;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`Commande ${p.orderNumber}`, 40, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Date : ${new Date().toLocaleString("fr-FR")}`, 40, y + 16);

  y += 50;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Client", 40, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y += 16;
  doc.text(`Nom : ${p.fullName}`, 40, y); y += 14;
  doc.text(`Téléphone : ${p.phone}`, 40, y); y += 14;
  if (p.email) { doc.text(`Email : ${p.email}`, 40, y); y += 14; }
  if (p.address) {
    const lines = doc.splitTextToSize(`Adresse : ${p.address}`, W - 80);
    doc.text(lines, 40, y); y += 14 * lines.length;
  }
  if (p.paymentMethod) { doc.text(`Paiement : ${p.paymentMethod}`, 40, y); y += 14; }

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Articles", 40, y);
  y += 8;
  doc.setDrawColor(212, 175, 55);
  doc.line(40, y, W - 40, y);
  y += 16;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Article", 40, y);
  doc.text("Qté", W - 220, y);
  doc.text("PU", W - 160, y);
  doc.text("Total", W - 80, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  for (const it of p.items) {
    if (y > 720) { doc.addPage(); y = 50; }
    const nameLines = doc.splitTextToSize(it.name, W - 320);
    doc.text(nameLines, 40, y);
    doc.text(String(it.quantity), W - 220, y);
    doc.text(fmt(it.price), W - 160, y);
    doc.text(fmt(it.price * it.quantity), W - 80, y);
    y += 14 * nameLines.length;
  }

  y += 10;
  doc.line(40, y, W - 40, y);
  y += 18;
  const right = (label: string, val: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, W - 220, y);
    doc.text(val, W - 80, y);
    y += 16;
  };
  right("Sous-total", fmt(p.subtotal));
  if (p.dedicace) right("Dédicace", "+ 1 000 HTG");
  if (p.livraison) right("Livraison", "+ 1 000 HTG");
  doc.setTextColor(74, 4, 4);
  right("TOTAL", fmt(p.total), true);
  doc.setTextColor(0, 0, 0);

  if (p.paymentProofDataUrl) {
    if (y > 500) { doc.addPage(); y = 50; }
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Preuve de paiement", 40, y);
    y += 14;
    try {
      const fmtImg = p.paymentProofDataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
      doc.addImage(p.paymentProofDataUrl, fmtImg, 40, y, 240, 240, undefined, "FAST");
    } catch { /* ignore */ }
  }

  const blob = doc.output("blob");
  const base64 = doc.output("datauristring").split(",")[1] ?? "";
  return { blob, base64 };
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
