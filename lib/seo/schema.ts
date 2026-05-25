import { ACCIDENT_SURVIVAL_GUIDE, KATHY_CARR, SCOTT_TISCHLER, WRECKMATCH_ORG } from "@/lib/entities";
import { WRECKMATCH_PHONE_E164 } from "@/lib/phones";
import type { SiteBrand } from "@/lib/site";
import { BRAND_CONFIG } from "@/lib/site";

export type FaqItem = { question: string; answer: string };

const ORG_ID = `${WRECKMATCH_ORG.url}/#organization`;
const WEBSITE_ID = `${WRECKMATCH_ORG.url}/#website`;

export function organizationJsonLd(origin: string, brand: SiteBrand = "wreckmatch") {
  const cfg = BRAND_CONFIG[brand];
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: cfg.name,
    legalName: WRECKMATCH_ORG.legalName,
    url: origin,
    logo: WRECKMATCH_ORG.logo,
    telephone: WRECKMATCH_PHONE_E164,
    email: cfg.email,
    description: WRECKMATCH_ORG.description,
    areaServed: { "@type": "Country", name: "United States" },
    sameAs: WRECKMATCH_ORG.sameAs,
    founder: [
      { "@id": `${origin}/#person-${KATHY_CARR.id}` },
      { "@id": `${origin}/#person-${SCOTT_TISCHLER.id}` },
    ],
    subOrganization: {
      "@type": "WebSite",
      name: ACCIDENT_SURVIVAL_GUIDE.name,
      url: ACCIDENT_SURVIVAL_GUIDE.url,
      description: ACCIDENT_SURVIVAL_GUIDE.description,
    },
  };
}

export function webSiteJsonLd(origin: string) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: origin,
    name: "WreckMatch",
    description: WRECKMATCH_ORG.description,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: `${origin}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function personJsonLd(
  origin: string,
  person: {
    readonly id: string;
    readonly name: string;
    readonly jobTitle: string;
    readonly description: string;
    readonly knowsAbout: readonly string[];
  },
  path: string,
) {
  return {
    "@type": "Person",
    "@id": `${origin}/#person-${person.id}`,
    name: person.name,
    jobTitle: person.jobTitle,
    worksFor: { "@id": ORG_ID },
    url: `${origin}${path}`,
    description: person.description,
    knowsAbout: person.knowsAbout,
  };
}

export function serviceJsonLd(origin: string, brand: SiteBrand = "wreckmatch") {
  const cfg = BRAND_CONFIG[brand];
  return {
    "@type": "Service",
    name: "Free Car Accident Attorney Matching",
    serviceType: "Legal Referral Service",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "United States" },
    description:
      `Free matching with licensed personal injury attorneys after car, truck, motorcycle, or rideshare accidents. Operated by ${WRECKMATCH_ORG.legalName} — not a law firm.`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free referral — attorneys typically contingency fee",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: WRECKMATCH_PHONE_E164,
      serviceUrl: `${origin}/#form`,
    },
  };
}

export function faqPageJsonLd(faqs: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function howToJsonLd(name: string, description: string, steps: { name: string; text: string }[]) {
  return {
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function articleJsonLd(opts: {
  origin: string;
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: `${opts.origin}${opts.path}`,
  };
}

export function webPageJsonLd(opts: {
  origin: string;
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@type": "WebPage",
    "@id": `${opts.origin}${opts.path}#webpage`,
    url: `${opts.origin}${opts.path}`,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  };
}

export function breadcrumbJsonLd(origin: string, items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${origin}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export function localBusinessJsonLd(origin: string, city: string, brand: SiteBrand = "wreckmatch") {
  const cfg = BRAND_CONFIG[brand];
  return {
    "@type": "LocalBusiness",
    name: `${cfg.name} — ${city}`,
    description: "Legal referral service for accident victims. Not a law firm.",
    url: origin,
    telephone: WRECKMATCH_PHONE_E164,
    areaServed: { "@type": "City", name: city },
  };
}

export function siteJsonLdGraph(origin: string, brand: SiteBrand = "wreckmatch") {
  return mergeJsonLdGraph(
    organizationJsonLd(origin, brand),
    webSiteJsonLd(origin),
    serviceJsonLd(origin, brand),
  );
}

export function entityHubGraph(origin: string) {
  return mergeJsonLdGraph(
    organizationJsonLd(origin),
    webSiteJsonLd(origin),
    personJsonLd(origin, SCOTT_TISCHLER, "/about-scott-tischler"),
    personJsonLd(origin, KATHY_CARR, "/about-kathy-carr"),
    serviceJsonLd(origin),
  );
}

export function mergeJsonLdGraph(...entities: Record<string, unknown>[]) {
  const flat = entities.flatMap((e) => {
    if (Array.isArray(e["@graph"])) return e["@graph"] as Record<string, unknown>[];
    return [e];
  });
  return { "@context": "https://schema.org", "@graph": flat };
}
