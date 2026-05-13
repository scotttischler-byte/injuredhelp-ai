/**
 * Fires Google Ads lead conversion when `gtag` is available (browser only).
 * Requires `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` (e.g. `AW-…/LABEL`).
 */
export function trackLeadConversion(): void {
  const sendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?.trim();
  if (!sendTo) return;
  if (typeof window === "undefined") return;

  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "undefined") return;

  w.gtag("event", "conversion", {
    send_to: sendTo,
    value: 1.0,
    currency: "USD",
  });
}
