import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getAllGeoHubSlugs } from "@/lib/geo-routes";
import { getAllPosts } from "@/lib/posts";
import { siteOriginFromHeaders } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${origin}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${origin}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${origin}/states`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
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
    priority: 0.7,
  }));

  const geoPages = getAllGeoHubSlugs().map((slug) => ({
    url: `${origin}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: slug.includes("car-accident-help-") && !slug.includes("-lawyer-") ? 0.75 : 0.6,
  }));

  return [...staticPages, ...blogPosts, ...geoPages];
}
