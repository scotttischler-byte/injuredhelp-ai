/** Canonical origins */
export const WRECKMATCH_URL = "https://www.wreckmatch.com";
export const INJUREDHELP_URL = "https://injuredhelp.ai";

/** Default origin (used in cron jobs, API calls with no host header) */
export const SITE_URL = WRECKMATCH_URL;

const IH = "injuredhelp.ai";
const WM = "wreckmatch.com";

export type SiteBrand = "wreckmatch" | "injuredhelp";

export function brandFromHost(host: string | null | undefined): SiteBrand {
  const raw = (host ?? "").toLowerCase().split(":")[0]?.trim() || "";
  if (raw === WM || raw === `www.${WM}`) return "wreckmatch";
  if (raw === IH || raw === `www.${IH}`) return "injuredhelp";
  return "wreckmatch";
}

export function siteOriginFromHost(host: string | null | undefined): string {
  const raw = (host ?? "").toLowerCase().split(":")[0]?.trim() || "";
  if (raw === WM || raw === `www.${WM}`) return WRECKMATCH_URL;
  if (raw === IH || raw === `www.${IH}`) return INJUREDHELP_URL;
  if (raw.endsWith(".vercel.app")) return `https://${raw}`;
  return SITE_URL;
}

export function siteOriginFromHeaders(headersList: Headers): string {
  return siteOriginFromHost(headersList.get("x-forwarded-host") ?? headersList.get("host"));
}

export function brandFromHeaders(headersList: Headers): SiteBrand {
  return brandFromHost(headersList.get("x-forwarded-host") ?? headersList.get("host"));
}

export function serverSiteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return WRECKMATCH_URL;
}

export function serverSiteBrand(): SiteBrand {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_BRAND?.trim()?.toLowerCase();
  return fromEnv === "injuredhelp" ? "injuredhelp" : "wreckmatch";
}

export function absoluteUrl(path: string, origin: string = SITE_URL): string {
  if (!path.startsWith("/")) return `${origin}/${path}`;
  return `${origin}${path}`;
}

/** Per-brand display config */
export const BRAND_CONFIG = {
  wreckmatch: {
    name: "WreckMatch",
    tagline: "Free Legal Help After Your Car Accident",
    phone: process.env.WRECKMATCH_PHONE?.trim() || "+18558973256",
    email: "help@wreckmatch.com",
    ghlSource: "WreckMatch",
    tiktokContentName: "wreckmatch_home",
    tiktokPixelId: "D83MMQ3C77U9FQKB73JG",
    retellAgentId: process.env.RETELL_AGENT_ID ?? "",
  },
  injuredhelp: {
    name: "InjuredHelp.ai",
    tagline: "AI-Powered Help for Accident Victims",
    phone: process.env.INJUREDHELP_PHONE ?? "+19785156063",
    email: "help@injuredhelp.ai",
    ghlSource: "InjuredHelp.ai",
    tiktokContentName: "injuredhelp_home",
    tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID_IH?.trim() ?? "",
    retellAgentId: process.env.RETELL_AGENT_ID_IH ?? process.env.RETELL_AGENT_ID ?? "",
  },
} as const;
