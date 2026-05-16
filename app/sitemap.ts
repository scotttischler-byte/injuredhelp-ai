import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { siteOriginFromHeaders } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const now = new Date();

  return [
    { url: `${origin}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${origin}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${origin}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${origin}/sms-terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
