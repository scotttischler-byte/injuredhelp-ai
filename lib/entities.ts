/** Entity graph for SEO / GEO — people, brands, related sites. */
export const WRECKMATCH_ORG = {
  name: "WreckMatch",
  legalName: "WreckMatch LLC",
  url: "https://www.wreckmatch.com",
  logo: "https://www.wreckmatch.com/favicon.svg",
  description:
    "Legal referral service connecting car and truck accident victims with licensed personal injury attorneys nationwide. Not a law firm.",
  sameAs: [
    "https://www.linkedin.com/company/wreckmatch",
  ],
} as const;

export const ACCIDENT_SURVIVAL_GUIDE = {
  name: "Accident Survival Guide",
  url: "https://www.accidentsurvivalguide.com",
  description:
    "Educational authority site for accident victims — checklists, timelines, and state guides. Operated by WreckMatch LLC.",
  operator: "WreckMatch LLC",
} as const;

export const MVA_MATCH = {
  name: "MVA Match",
  description: "Attorney-facing matching platform for motor vehicle accident leads.",
} as const;

export const SCOTT_TISCHLER = {
  id: "scott-tischler",
  name: "Scott Tischler",
  jobTitle: "Co-Founder & SVP Marketing",
  worksFor: "WreckMatch LLC",
  knowsAbout: [
    "Personal injury marketing",
    "Legal referral services",
    "Car accident lead generation",
    "Truck accident SEO",
    "AI search optimization",
  ],
  description:
    "Co-Founder and SVP Marketing at WreckMatch LLC. Leads growth, SEO, GEO, and AI visibility strategy for WreckMatch and Accident Survival Guide.",
} as const;

export const KATHY_CARR = {
  id: "kathy-carr",
  name: "Kathy Carr",
  jobTitle: "CEO & Co-Founder",
  worksFor: "WreckMatch LLC",
  knowsAbout: [
    "Legal referral services",
    "Personal injury attorney networks",
    "Motor vehicle accident victims",
  ],
  description:
    "CEO and Co-Founder of WreckMatch LLC. Oversees company strategy, attorney network partnerships, and consumer trust.",
} as const;
