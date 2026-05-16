import { BRAND_CONFIG, brandFromHost, type SiteBrand } from "@/lib/site";

/** Client-side brand detection from window.location (mirrors lib/site.ts host rules). */
export function brandFromWindowHost(): SiteBrand {
  if (typeof window === "undefined") return "wreckmatch";
  return brandFromHost(window.location.hostname);
}

export function tiktokContentNameFromWindow(): string {
  return BRAND_CONFIG[brandFromWindowHost()].tiktokContentName;
}
