/**
 * URLs and stats for 10x search + AI exposure automation (IndexNow, llms.txt, crons).
 */
import fs from "fs";
import path from "path";
import { getAllPosts, getAllPostsEs } from "@/lib/posts";
import { pressPathsForSitemap } from "@/lib/press-index";
import { WHAT_TO_DO_PATHS } from "@/lib/what-to-do-guides";
import { WRECKMATCH_URL } from "@/lib/site";

const SITE = WRECKMATCH_URL.replace(/\/$/, "");
const PENDING_PATH = path.join(process.cwd(), "content/autopilot/indexnow_pending.json");

export const EXPOSURE_PRIORITY_PATHS = [
  "/",
  "/blog",
  "/es/blog",
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
  "/resources",
  "/states",
  "/media-kit",
  "/llms.txt",
  "/llms-full.txt",
  "/ai.txt",
  "/press",
  ...WHAT_TO_DO_PATHS,
  ...pressPathsForSitemap(),
];

export type ExposureStats = {
  enPosts: number;
  esPosts: number;
  platinumEn: number;
  lastUpdated: string;
};

export function getExposureStats(): ExposureStats {
  const en = getAllPosts();
  const es = getAllPostsEs();
  let platinumEn = 0;
  const blogDir = path.join(process.cwd(), "content/blog");
  for (const p of en) {
    try {
      const raw = fs.readFileSync(path.join(blogDir, `${p.slug}.md`), "utf8");
      if (raw.includes("qualityTier: platinum") || raw.includes('qualityTier: "platinum"')) {
        platinumEn += 1;
      }
    } catch {
      /* skip */
    }
  }
  return {
    enPosts: en.length,
    esPosts: es.length,
    platinumEn,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}

/** Recent posts for llms.txt citation lines (truck/severe first). */
export function getRecentCitationPosts(limit = 28) {
  const posts = getAllPosts();
  const score = (slug: string, category: string) => {
    let s = 0;
    if (/truck|semi|18-wheeler|fmcsa|tractor/i.test(slug)) s += 3;
    if (/wrongful-death|catastrophic|severe|brain|spinal/i.test(slug)) s += 2;
    if (category === "Truck Accidents") s += 2;
    if (/2026/.test(slug)) s += 1;
    return s;
  };
  return [...posts]
    .sort((a, b) => {
      const d = score(b.slug, b.category) - score(a.slug, a.category);
      if (d !== 0) return d;
      return a.date < b.date ? -1 : 1;
    })
    .slice(0, limit);
}

export function loadPendingIndexSlugs(): string[] {
  try {
    const raw = fs.readFileSync(PENDING_PATH, "utf8");
    const data = JSON.parse(raw) as { slugs?: string[] };
    return Array.isArray(data.slugs) ? data.slugs : [];
  } catch {
    return [];
  }
}

export function appendPendingIndexSlug(slug: string): void {
  const slugs = new Set(loadPendingIndexSlugs());
  slugs.add(slug);
  fs.mkdirSync(path.dirname(PENDING_PATH), { recursive: true });
  fs.writeFileSync(
    PENDING_PATH,
    JSON.stringify({ slugs: [...slugs], updatedAt: new Date().toISOString() }, null, 2),
    "utf8",
  );
}

export function clearPendingIndexSlugs(): void {
  fs.mkdirSync(path.dirname(PENDING_PATH), { recursive: true });
  fs.writeFileSync(PENDING_PATH, JSON.stringify({ slugs: [], updatedAt: new Date().toISOString() }), "utf8");
}

/** All URLs to ping IndexNow (cap 10k). */
export function buildIndexNowUrls(options?: {
  recentBlogLimit?: number;
  recentEsLimit?: number;
  extraSlugs?: string[];
}): string[] {
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

  for (const p of EXPOSURE_PRIORITY_PATHS) {
    add(`${SITE}${p}`);
  }

  for (const slug of options?.extraSlugs ?? []) {
    add(`${SITE}/blog/${slug}`);
    add(`${SITE}/es/blog/${slug}`);
  }

  for (const slug of loadPendingIndexSlugs()) {
    add(`${SITE}/blog/${slug}`);
    add(`${SITE}/es/blog/${slug}`);
  }

  const en = getAllPosts().slice(0, recentBlogLimit);
  for (const p of en) {
    add(`${SITE}/blog/${p.slug}`);
  }

  const es = getAllPostsEs().slice(0, recentEsLimit);
  for (const p of es) {
    add(`${SITE}/es/blog/${p.slug}`);
  }

  return out.slice(0, 10_000);
}
