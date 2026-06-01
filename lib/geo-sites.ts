import geoSitesJson from "@/config/geo-sites.json";
import type { SiteBrand } from "@/lib/site";
import { SEMITRUCKMATCH_URL, WRECKMATCH_URL, INJUREDHELP_URL } from "@/lib/site";

export type GeoSiteEntry = {
  id: string;
  origin: string;
  brand: SiteBrand;
  indexNow: boolean;
  pendingPath?: string;
  note?: string;
};

export const GEO_SITES: GeoSiteEntry[] = geoSitesJson.sites as GeoSiteEntry[];

export function geoSiteByOrigin(origin: string): GeoSiteEntry | undefined {
  const norm = origin.replace(/\/$/, "");
  return GEO_SITES.find((s) => s.origin.replace(/\/$/, "") === norm);
}

export function geoSitesForIndexNow(): GeoSiteEntry[] {
  return GEO_SITES.filter((s) => s.indexNow);
}

/** Priority paths pinged per brand (IndexNow + sitemap weight). */
export function exposurePriorityPaths(brand: SiteBrand): string[] {
  const common = [
    "/",
    "/blog",
    "/es/blog",
    "/states",
    "/resources",
    "/media-kit",
    "/llms.txt",
    "/llms-full.txt",
    "/ai.txt",
    "/press",
    "/for-attorneys",
    "/privacy",
    "/terms",
  ];

  if (brand === "semitruckmatch") {
    return [
      ...common,
      "/truck-accident-help",
      "/checklist-after-car-accident",
      "/ai-accident-help",
    ];
  }

  if (brand === "injuredhelp") {
    return [
      ...common,
      "/ai-accident-help",
      "/car-accident-help",
      "/truck-accident-help",
    ];
  }

  return [
    ...common,
    "/what-to-do-after-a-car-accident",
    "/what-to-do-after-a-car-accident-in-texas",
    "/what-to-do-after-a-car-accident-in-california",
    "/what-to-do-after-a-car-accident-in-florida",
    "/what-to-do-after-a-car-accident-in-new-york",
    "/what-to-do-after-a-car-accident-in-colorado",
    "/car-accident-help",
    "/truck-accident-help",
    "/car-accident-help-texas",
    "/car-accident-help-colorado",
    "/car-accident-help-houston",
    "/car-accident-help-dallas",
    "/car-accident-help-denver",
    "/car-accident-help-miami",
    "/car-accident-help-los-angeles",
    "/checklist-after-car-accident",
    "/ai-accident-help",
    "/about-accident-survival-guide",
  ];
}

export const GEO_ORIGIN_BY_BRAND: Record<SiteBrand, string> = {
  wreckmatch: WRECKMATCH_URL,
  semitruckmatch: SEMITRUCKMATCH_URL,
  injuredhelp: INJUREDHELP_URL,
};
