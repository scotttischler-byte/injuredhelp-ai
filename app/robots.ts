import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { siteOriginFromHeaders } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
