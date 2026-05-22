import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { siteOriginFromHeaders } from "@/lib/site";

/** Allow major AI crawlers — critical for LLM citation traffic. */
const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "cohere-ai",
  "Bytespider",
  "CCBot",
] as const;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const sitemap = `${origin}/sitemap.xml`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin"],
      },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: ["/", "/llms.txt", "/blog/", "/car-accident-help-"],
        disallow: ["/api/", "/admin"],
      })),
    ],
    sitemap,
    host: origin,
  };
}
