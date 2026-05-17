import { SITE_URL } from "@/lib/site";

export function wreckmatchEmailHtml(params: {
  title: string;
  bodyHtml: string;
  ctaHref?: string;
  ctaLabel?: string;
  /** Privacy / unsubscribe links (defaults to SITE_URL for cron emails). */
  siteUrl?: string;
}) {
  const siteUrl = (params.siteUrl ?? SITE_URL).replace(/\/$/, "");
  const cta =
    params.ctaHref && params.ctaLabel
      ? `<p style="margin:24px 0;"><a href="${params.ctaHref}" style="display:inline-block;background:#f97316;color:#0b1220;font-weight:800;padding:12px 18px;border-radius:10px;text-decoration:none;">${params.ctaLabel}</a></p>`
      : "";
  return `<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;background:#0b1220;color:#e5e7eb;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b1220;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#111827;border:1px solid #1f2937;border-radius:14px;overflow:hidden;">
        <tr><td style="padding:18px 20px;background:#0f172a;border-bottom:1px solid #1f2937;">
          <div style="font-weight:900;letter-spacing:0.02em;color:#fff;">WRECK<span style="color:#ef4444;">MATCH</span></div>
          <div style="margin-top:6px;font-size:12px;color:#9ca3af;">Free attorney matching for accident victims</div>
        </td></tr>
        <tr><td style="padding:22px 20px;">
          <div style="font-size:18px;font-weight:800;color:#fff;margin-bottom:10px;">${params.title}</div>
          <div style="font-size:15px;line-height:1.65;color:#d1d5db;">${params.bodyHtml}</div>
          ${cta}
          <p style="margin-top:18px;font-size:14px;line-height:1.6;color:#e5e7eb;">
            Questions? Call or text <strong>(978) 515-6063</strong> anytime.
          </p>
        </td></tr>
        <tr><td style="padding:16px 20px;background:#0b1220;border-top:1px solid #1f2937;font-size:11px;line-height:1.5;color:#9ca3af;">
          WreckMatch connects accident victims with experienced personal injury attorneys at no upfront cost. We are a legal referral service operated by WreckMatch LLC — not a law firm. This email is informational only.
          <div style="margin-top:10px;">
            <a href="${siteUrl}/privacy" style="color:#fca5a5;">Privacy</a>
            ·
            <a href="${siteUrl}/unsubscribe" style="color:#fca5a5;">Unsubscribe</a>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
