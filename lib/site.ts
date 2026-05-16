/** Default origin when Host is missing (cron, local dev, some API fallbacks). */
export const SITE_URL = "https://injuredhelp.ai";

const IH = "injuredhelp.ai";
const WM = "wreckmatch.com";

/**
 * Public site origin for SEO, metadata, and absolute links.
 * Same deployment serves injuredhelp.ai and www.wreckmatch.com.
 */
export function siteOriginFromHost(host: string | null | undefined): string {
  const raw = (host ?? "").toLowerCase().split(":")[0]?.trim() || "";
  if (raw === WM || raw === `www.${WM}`) return "https://www.wreckmatch.com";
  if (raw === IH || raw === `www.${IH}`) return "https://injuredhelp.ai";
  if (raw.endsWith(".vercel.app")) return `https://${raw}`;
  return SITE_URL;
}

export function siteOriginFromHeaders(headersList: Headers): string {
  return siteOriginFromHost(headersList.get("x-forwarded-host") ?? headersList.get("host"));
}

export function absoluteUrl(path: string, origin: string = SITE_URL): string {
  if (!path.startsWith("/")) return `${origin}/${path}`;
  return `${origin}${path}`;
}
