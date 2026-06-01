/**
 * URLs and stats for 10x search + AI exposure automation (IndexNow, llms.txt, crons).
 */
import fs from "fs";
import path from "path";
import {
  countEnBlogMd,
  countEsBlogMd,
  listEnSlugsForBrand,
  listEsSlugsForBrand,
  listEnSlugsMerged,
} from "@/lib/blog-count";
import { pressPathsForSitemap } from "@/lib/press-index";
import { WHAT_TO_DO_PATHS } from "@/lib/what-to-do-guides";
import { exposurePriorityPaths } from "@/lib/geo-sites";
import type { SiteBrand } from "@/lib/site";
import { WRECKMATCH_URL } from "@/lib/site";

const DEFAULT_PENDING = path.join(process.cwd(), "content/autopilot/indexnow_pending.json");

export type ExposureStats = {
  enPosts: number;
  esPosts: number;
  platinumEn: number;
  lastUpdated: string;
};

export function pendingPathForBrand(brand: SiteBrand): string {
  if (brand === "semitruckmatch") {
    return path.join(process.cwd(), "sites/semitruckmatch/content/autopilot/indexnow_pending.json");
  }
  return DEFAULT_PENDING;
}

export function loadPendingIndexSlugs(brand: SiteBrand = "wreckmatch"): string[] {
  const pendingPath = pendingPathForBrand(brand);
  try {
    const raw = fs.readFileSync(pendingPath, "utf8");
    const data = JSON.parse(raw) as { slugs?: string[] };
    return Array.isArray(data.slugs) ? data.slugs : [];
  } catch {
    return [];
  }
}

export function appendPendingIndexSlug(slug: string, brand: SiteBrand = "wreckmatch"): void {
  const pendingPath = pendingPathForBrand(brand);
  const slugs = new Set(loadPendingIndexSlugs(brand));
  slugs.add(slug);
  fs.mkdirSync(path.dirname(pendingPath), { recursive: true });
  fs.writeFileSync(
    pendingPath,
    JSON.stringify({ slugs: [...slugs], updatedAt: new Date().toISOString() }, null, 2),
    "utf8",
  );
}

export function clearPendingIndexSlugs(brand: SiteBrand = "wreckmatch"): void {
  const pendingPath = pendingPathForBrand(brand);
  fs.mkdirSync(path.dirname(pendingPath), { recursive: true });
  fs.writeFileSync(pendingPath, JSON.stringify({ slugs: [], updatedAt: new Date().toISOString() }), "utf8");
}

export function getExposureStats(): ExposureStats {
  const enCount = countEnBlogMd();
  const esCount = countEsBlogMd();
  let platinumEn = 0;
  const counted = new Set<string>();
  for (const root of ["content/blog", "sites/semitruckmatch/content/blog"]) {
    const blogDir = path.join(process.cwd(), root);
    if (!fs.existsSync(blogDir)) continue;
    for (const slug of listEnSlugsMerged()) {
      if (counted.has(slug)) continue;
      try {
        const raw = fs.readFileSync(path.join(blogDir, `${slug}.md`), "utf8");
        if (raw.includes("qualityTier: platinum") || raw.includes('qualityTier: "platinum"')) {
          platinumEn += 1;
          counted.add(slug);
        }
      } catch {
        /* skip */
      }
    }
  }
  return {
    enPosts: enCount,
    esPosts: esCount,
    platinumEn,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}

/** Recent posts for llms.txt citation lines (truck/severe first). */
export function getRecentCitationPosts(limit = 28) {
  const score = (slug: string) => {
    let s = 0;
    if (/truck|semi|18-wheeler|fmcsa|tractor/i.test(slug)) s += 3;
    if (/wrongful-death|catastrophic|severe|brain|spinal/i.test(slug)) s += 2;
    if (/2026/.test(slug)) s += 1;
    return s;
  };
  return [...listEnSlugsMerged()]
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit)
    .map((slug) => ({ slug, title: slug.replace(/-/g, " "), date: "" }));
}

/** All URLs to ping IndexNow for a specific production host (cap 10k). */
export function buildIndexNowUrlsForSite(
  siteOrigin: string,
  brand: SiteBrand,
  options?: {
    recentBlogLimit?: number;
    recentEsLimit?: number;
    extraSlugs?: string[];
  },
): string[] {
  const site = siteOrigin.replace(/\/$/, "");
  const recentBlogLimit = options?.recentBlogLimit ?? 280;
  const recentEsLimit = options?.recentEsLimit ?? 120;
  const seen = new Set<string>();
  const out: string[] = [];

  const add = (u: string) => {
    if (!seen.has(u)) {
      seen.add(u);
      out.push(u);
    }
  };

  const priority = exposurePriorityPaths(brand);
  for (const p of priority) {
    add(`${site}${p}`);
  }

  if (brand === "wreckmatch") {
    for (const p of WHAT_TO_DO_PATHS) add(`${site}${p}`);
    for (const p of pressPathsForSitemap()) add(`${site}${p}`);
  }

  const pending = loadPendingIndexSlugs(brand);
  for (const slug of [...(options?.extraSlugs ?? []), ...pending]) {
    add(`${site}/blog/${slug}`);
    add(`${site}/es/blog/${slug}`);
  }

  for (const slug of listEnSlugsForBrand(brand, recentBlogLimit)) {
    add(`${site}/blog/${slug}`);
  }

  for (const slug of listEsSlugsForBrand(brand, recentEsLimit)) {
    add(`${site}/es/blog/${slug}`);
  }

  return out.slice(0, 10_000);
}

/** @deprecated Use buildIndexNowUrlsForSite — defaults to WreckMatch for backward compatibility. */
export function buildIndexNowUrls(options?: {
  recentBlogLimit?: number;
  recentEsLimit?: number;
  extraSlugs?: string[];
}): string[] {
  return buildIndexNowUrlsForSite(WRECKMATCH_URL, "wreckmatch", options);
}

/** Submit IndexNow for every enabled property in config/geo-sites.json. */
export async function submitIndexNowAllSites(
  submit: (siteOrigin: string, urls: string[]) => Promise<{ ok: boolean; urlCount: number; results: unknown[] }>,
): Promise<
  {
    siteId: string;
    origin: string;
    ok: boolean;
    submitted: number;
    results: unknown[];
  }[]
> {
  const { geoSitesForIndexNow } = await import("@/lib/geo-sites");
  const out: Awaited<ReturnType<typeof submitIndexNowAllSites>> = [];

  for (const entry of geoSitesForIndexNow()) {
    const urls = buildIndexNowUrlsForSite(entry.origin, entry.brand, {
      recentBlogLimit: 320,
      recentEsLimit: 320,
      extraSlugs: loadPendingIndexSlugs(entry.brand),
    });
    const batch = await submit(entry.origin, urls);
    if (batch.ok) clearPendingIndexSlugs(entry.brand);
    out.push({
      siteId: entry.id,
      origin: entry.origin,
      ok: batch.ok,
      submitted: batch.urlCount,
      results: batch.results,
    });
  }
  return out;
}
