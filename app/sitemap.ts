import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getAllGeoHubSlugs } from "@/lib/geo-routes";
import { getAllPosts } from "@/lib/posts";
import { TEXAS_METRO_LINKS } from "@/lib/texas-metro-links";
import { ACCIDENT_VARIANT_CITIES, PRIORITY_PLACE_BY_SLUG } from "@/lib/priority-places/registry";
import { CITATION_ASSETS } from "@/lib/citation-assets";
import { WHAT_TO_DO_PATHS } from "@/lib/what-to-do-guides";
import { TOPIC_HUBS } from "@/lib/topic-hubs";
import { siteOriginFromHeaders } from "@/lib/site";

const SEO_STATIC = [
  "/car-accident-help",
  "/truck-accident-help",
  "/motorcycle-accident-help",
  "/rideshare-accident-help",
  "/pedestrian-accident-help",
  "/uninsured-driver-accident-help",
  "/ai-accident-help",
  "/resources",
  "/media-kit",
  "/about-wreckmatch",
  "/about-accident-survival-guide",
  "/about-scott-tischler",
  "/about-kathy-carr",
  ...CITATION_ASSETS.map((a) => a.path),
  ...WHAT_TO_DO_PATHS,
];

const TEXAS_PLACE_SLUGS = new Set(TEXAS_METRO_LINKS.map((m) => m.placeSlug));
const PRIORITY_PLACE_SLUGS = new Set(PRIORITY_PLACE_BY_SLUG.keys());
const VARIANTS = ["truck", "rideshare", "motorcycle"] as const;

function geoPagePriority(slug: string): number {
  const place = slug.replace(/^car-accident-help-/, "");
  if (TEXAS_PLACE_SLUGS.has(place) || PRIORITY_PLACE_SLUGS.has(place)) return 0.92;
  if (slug === "car-accident-help-texas") return 0.9;
  if (slug.startsWith("car-accident-help-")) return 0.75;
  return 0.6;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${origin}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${origin}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${origin}/blog/rss.xml`, lastModified: now, changeFrequency: "hourly", priority: 0.7 },
    { url: `${origin}/states`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${origin}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${origin}/ai-visibility-accelerator`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${origin}/advertising-legal-notice`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${origin}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${origin}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${origin}/sms-terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${origin}/press`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${origin}/webinars`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${origin}/ai.txt`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...SEO_STATIC.map((path) => ({
      url: `${origin}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path.includes("what-to-do-after")
        ? 0.98
        : path.includes("truck")
          ? 0.95
          : path.includes("ai-accident")
            ? 0.9
            : 0.82,
    })),
    ...TOPIC_HUBS.filter((t) => !SEO_STATIC.includes(t.path)).map((t) => ({
      url: `${origin}${t.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];

  const blogPosts = getAllPosts().map((p) => ({
    url: `${origin}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: p.slug.includes("texas") ? 0.88 : 0.7,
  }));

  const geoPages = getAllGeoHubSlugs().map((slug) => ({
    url: `${origin}/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: geoPagePriority(slug),
  }));

  const variantPages = ACCIDENT_VARIANT_CITIES.flatMap((c) =>
    VARIANTS.map((variant) => ({
      url: `${origin}/car-accident-help-${c.placeSlug}/${variant}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.88,
    })),
  );

  return [...staticPages, ...blogPosts, ...geoPages, ...variantPages];
}
