import type { Metadata } from "next";
import { OPERATOR_LEGAL_NAME } from "@/lib/compliance";
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
    legalName: OPERATOR_LEGAL_NAME,
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
      `Free attorney matching for car accident victims. WreckMatch connects you with experienced PI attorneys at no upfront cost. Operated by ${OPERATOR_LEGAL_NAME}, not a law firm.`,
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

export type FaqItem = { question: string; answer: string };

export function faqPageJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function mergeJsonLdGraph(...graphs: Record<string, unknown>[]) {
  const entities = graphs.flatMap((g) => {
    if (Array.isArray(g["@graph"])) return g["@graph"] as Record<string, unknown>[];
    return [g];
  });
  return { "@context": "https://schema.org", "@graph": entities };
}
