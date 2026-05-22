import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getAllGeoHubSlugs } from "@/lib/geo-routes";
import { getAllPosts } from "@/lib/posts";
import { TEXAS_METRO_LINKS } from "@/lib/texas-metro-links";
import { siteOriginFromHeaders } from "@/lib/site";

const TEXAS_PLACE_SLUGS = new Set(TEXAS_METRO_LINKS.map((m) => m.placeSlug));

function geoPagePriority(slug: string): number {
  const place = slug.replace(/^car-accident-help-/, "");
  if (TEXAS_PLACE_SLUGS.has(place)) return 0.92;
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
    { url: `${origin}/states`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${origin}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${origin}/ai-visibility-accelerator`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${origin}/advertising-legal-notice`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${origin}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${origin}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${origin}/sms-terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${origin}/press`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${origin}/webinars`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
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

  return [...staticPages, ...blogPosts, ...geoPages];
}
