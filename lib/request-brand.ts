import { headers } from "next/headers";
import {
  brandFromHeaders,
  brandFromHost,
  serverSiteBrand,
  siteOriginFromHost,
  type SiteBrand,
} from "@/lib/site";

const BRAND_HEADER = "x-site-brand";

/** Brand for this request: middleware host header → env fallback. */
export async function requestSiteBrand(): Promise<SiteBrand> {
  const h = await headers();
  const fromMiddleware = h.get(BRAND_HEADER)?.trim().toLowerCase();
  if (fromMiddleware === "semitruckmatch" || fromMiddleware === "wreckmatch" || fromMiddleware === "injuredhelp") {
    return fromMiddleware;
  }
  return brandFromHeaders(h);
}

export async function requestSiteOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) return siteOriginFromHost(host);
  const brand = await requestSiteBrand();
  if (brand === "semitruckmatch") return "https://www.semitruckmatch.com";
  return siteOriginFromHost(null);
}

export { BRAND_HEADER };
