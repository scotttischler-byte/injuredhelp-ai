import type { Metadata } from "next";
import { BRAND_CONFIG, siteOriginFromHeaders, type SiteBrand } from "@/lib/site";

const ORG_ID = "https://www.wreckmatch.com/#organization";

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
    "@type": "Organization",
    "@id": ORG_ID,
    name: cfg.name,
    legalName: "Tophundred Global Ventures LLC",
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
    "@type": "Service",
    name: "Legal Referral Service",
    serviceType: "Legal Referral Service",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "United States" },
    description:
      "Free attorney matching for car accident injury victims. WreckMatch is a referral service operated by Tophundred Global Ventures LLC, not a law firm.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free consultation referral — contingency fee attorneys only",
    },
  };
}

export function siteJsonLdGraph(origin: string, brand: SiteBrand) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(origin, brand), legalReferralServiceJsonLd(origin, brand)],
  };
}
