import { createServerFn } from "@tanstack/react-start";

type Payload = {
  to: string;
  subject: string;
  html: string;
  pdfBase64: string;
  pdfFilename: string;
  proofBase64?: string;
  proofFilename?: string;
};

export const sendOrderEmail = createServerFn({ method: "POST" })
  .inputValidator((d: Payload) => d)
  .handler(async ({ data }) => {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;

    if (!RESEND_API_KEY) {
      // Email backend not configured — return ok=false so client can fall back gracefully.
      return { ok: false, reason: "no_resend_key" as const };
    }

    const attachments: any[] = [
      { filename: data.pdfFilename, content: data.pdfBase64 },
    ];
    if (data.proofBase64 && data.proofFilename) {
      attachments.push({ filename: data.proofFilename, content: data.proofBase64 });
    }

    const body = {
      from: "Samayoo Flowers <onboarding@resend.dev>",
      to: [data.to],
      subject: data.subject,
      html: data.html,
      attachments,
    };

    const url = LOVABLE_API_KEY
      ? "https://connector-gateway.lovable.dev/resend/emails"
      : "https://api.resend.com/emails";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY ?? RESEND_API_KEY}`,
    };
    if (LOVABLE_API_KEY) headers["X-Connection-Api-Key"] = RESEND_API_KEY;

    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    if (!res.ok) {
      const txt = await res.text();
      console.error("[sendOrderEmail] failed", res.status, txt);
      return { ok: false, reason: "send_failed" as const, status: res.status };
    }
    return { ok: true as const };
  });
