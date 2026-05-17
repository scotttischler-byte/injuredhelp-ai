import type { Metadata } from "next";
import { BRAND_CONFIG, siteOriginFromHeaders, type SiteBrand } from "@/lib/site";

export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  headers: Headers;
  brand?: SiteBrand;
}): Metadata {
  const origin = siteOriginFromHeaders(opts.headers);
  const brand = opts.brand ?? "wreckmatch";
  const cfg = BRAND_CONFIG[brand];
  const desc = opts.description.slice(0, 160);
  const canonical = `${origin}${opts.path.startsWith("/") ? opts.path : `/${opts.path}`}`;

  return {
    title: opts.title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: opts.title,
      description: desc,
      url: canonical,
      siteName: cfg.name,
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export function organizationJsonLd(origin: string, brand: SiteBrand) {
  const cfg = BRAND_CONFIG[brand];
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: cfg.name,
    url: origin,
    telephone: cfg.phone,
    email: cfg.email,
    description:
      "Legal referral service connecting car accident victims with licensed personal injury attorneys. Not a law firm.",
    areaServed: { "@type": "Country", name: "United States" },
  };
}

export function legalReferralServiceJsonLd(origin: string, brand: SiteBrand) {
  const cfg = BRAND_CONFIG[brand];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${cfg.name} — Legal Referral Service`,
    serviceType: "Legal Referral Service",
    provider: {
      "@type": "Organization",
      name: cfg.name,
      url: origin,
    },
    areaServed: "US",
    description:
      "Free attorney matching for car accident injury victims. WreckMatch is a referral service, not a law firm.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free consultation referral — contingency attorneys only",
    },
  };
}
