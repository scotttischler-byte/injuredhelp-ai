import { BRAND_CONFIG, type SiteBrand } from "@/lib/site";

/** TikTok Events Manager pixel for WreckMatch (www.wreckmatch.com). */
export const WRECKMATCH_TIKTOK_PIXEL_ID = "D83MMQ3C77U9FQKB73JG";

export function normalizeTikTokPixelId(raw: string | undefined | null): string {
  const id = (raw ?? "").trim();
  return /^[A-Z0-9]+$/i.test(id) ? id.toUpperCase() : "";
}

/** Browser + server pixel ID for the active brand. */
export function tiktokPixelIdForBrand(brand: SiteBrand): string {
  const fromBrand = normalizeTikTokPixelId(BRAND_CONFIG[brand].tiktokPixelId);
  if (fromBrand) return fromBrand;
  return normalizeTikTokPixelId(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID);
}

/** Load pixel base code in production builds only (excludes `next dev`). */
export function isTikTokPixelProductionEnabled(): boolean {
  return process.env.NODE_ENV === "production";
}

export function shouldLoadTikTokPixel(brand: SiteBrand): boolean {
  return isTikTokPixelProductionEnabled() && Boolean(tiktokPixelIdForBrand(brand));
}

export function tiktokPixelInlineScript(pixelId: string): string {
  return `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('${pixelId}');
  ttq.page();
}(window, document, 'ttq');
`.trim();
}
