import type { MetadataRoute } from "next";
import { getAllPress } from "@/lib/press";
import { WEBINARS } from "@/lib/webinars";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://injuredhelp.ai";
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/thank-you`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/webinars`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/press`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  const webinars = WEBINARS.map((w) => ({
    url: `${base}/webinars/${w.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const press = getAllPress().map((p) => ({
    url: `${base}/press/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...core, ...webinars, ...press];
}
