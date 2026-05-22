import type { Metadata } from "next";
import { siteOriginFromHeaders } from "@/lib/site";

export type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  headers: Headers;
  keywords?: string[];
  ogType?: "website" | "article";
  noIndex?: boolean;
};

/** Reusable AI-friendly metadata — titles ≤60 chars ideal, descriptions ≤160. */
export function buildPageMetadata(input: PageMetaInput): Metadata {
  const origin = siteOriginFromHeaders(input.headers);
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const canonical = `${origin}${path}`;
  const description = input.description.trim().slice(0, 160);
  const title = input.title.trim();

  return {
    title,
    description,
    keywords: input.keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "WreckMatch",
      type: input.ogType ?? "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    other: {
      "ai-content-declaration": "educational-legal-referral-not-legal-advice",
    },
  };
}

export const DEFAULT_KEYWORDS = [
  "car accident lawyer",
  "personal injury attorney",
  "truck accident lawyer",
  "free attorney matching",
  "car accident help",
];
