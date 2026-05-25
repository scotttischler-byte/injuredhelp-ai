/** Curated SEO titles & descriptions for priority money pages (≤60 char titles, ≤160 char metas). */
export type PrioritySeo = { title: string; description: string; keywords?: string[] };

export const PRIORITY_PAGE_SEO: Record<string, PrioritySeo> = {
  "/": {
    title: "Car Accident Lawyer Matching — Free, 60-Sec Callback",
    description:
      "Hurt in a crash? Free attorney matching in 60 seconds. Licensed lawyers in all 50 states. Español available. WreckMatch is a referral service — not a law firm.",
    keywords: ["car accident lawyer", "free attorney matching", "personal injury referral"],
  },
  "/car-accident-help/texas": {
    title: "Texas Car Accident Lawyer — Free Referral | WreckMatch",
    description:
      "Texas crash? 2-year deadline, 51% fault rule, free lawyer matching in 60 seconds. Houston, Dallas, Austin & statewide. Not a law firm — call 855-WRECKMATCH.",
    keywords: ["Texas car accident lawyer", "Houston accident attorney", "Texas statute of limitations"],
  },
  "/car-accident-help/florida": {
    title: "Florida Car Accident Lawyer — Free Help | WreckMatch",
    description:
      "Florida crash victim? PIP rules, 4-year deadline, free attorney matching in 60 seconds. Miami, Tampa, Orlando & statewide. Referral service — not a law firm.",
    keywords: ["Florida car accident lawyer", "Miami accident attorney", "Florida PIP claim"],
  },
  "/car-accident-help/california": {
    title: "California Car Accident Lawyer — Free Match | WreckMatch",
    description:
      "California crash? 2-year injury deadline, comparative fault, free lawyer matching in 60 seconds. LA, SF, San Diego & statewide. WreckMatch — not a law firm.",
    keywords: ["California car accident lawyer", "Los Angeles injury attorney"],
  },
  "/car-accident-help/houston": {
    title: "Houston Car Accident Help — Free Lawyer Match",
    description:
      "Hurt in a Houston crash? Texas deadlines, insurance tips & free attorney matching in 60 seconds. WreckMatch LLC is a referral service — not a law firm.",
    keywords: ["Houston car accident lawyer", "Texas crash help"],
  },
  "/car-accident-help/miami": {
    title: "Miami Car Accident Help — Free Attorney Match",
    description:
      "Miami crash victim? Florida PIP basics, evidence steps & free lawyer matching in 60 seconds. WreckMatch is a referral service — not a law firm.",
    keywords: ["Miami car accident lawyer", "Florida crash help"],
  },
  "/truck-accident-help": {
    title: "Truck Accident Lawyer Help — Free 60-Sec Match",
    description:
      "Semi-truck crash? FMCSA evidence, multiple defendants & free attorney matching in 60 seconds. Educational guide — WreckMatch is not a law firm.",
    keywords: ["truck accident lawyer", "18 wheeler crash attorney", "FMCSA violation claim"],
  },
  "/what-to-do-after-a-car-accident": {
    title: "What to Do After a Car Accident (2026 Guide)",
    description:
      "Step-by-step after a crash: 911, photos, medical care, insurance & free attorney matching. National guide — educational only, not legal advice.",
    keywords: ["what to do after car accident", "after crash checklist"],
  },
  "/what-to-do-after-a-car-accident-in/texas": {
    title: "What to Do After a Texas Car Accident (2026)",
    description:
      "Texas crash steps: 911, CR-3 report, 2-year deadline, 51% fault rule & free lawyer matching. WreckMatch referral service — not legal advice.",
    keywords: ["what to do after car accident Texas", "Texas crash report"],
  },
  "/what-to-do-after-a-car-accident-in/florida": {
    title: "What to Do After a Florida Car Accident (2026)",
    description:
      "Florida crash steps: PIP coverage, 4-year deadline, evidence & free attorney matching in 60 seconds. Referral service — not legal advice.",
    keywords: ["what to do after car accident Florida", "Florida PIP after crash"],
  },
  "/what-to-do-after-a-car-accident-in/california": {
    title: "What to Do After a California Car Accident (2026)",
    description:
      "California crash steps: CHP report, 2-year deadline, comparative fault & free lawyer matching. WreckMatch — referral service, not a law firm.",
    keywords: ["what to do after car accident California", "California crash report"],
  },
  "/blog": {
    title: "Car Accident Legal Guides & Blog | WreckMatch",
    description:
      "200+ car, truck & injury guides by the WreckMatch team. Free educational articles — referral service, not a law firm. Get matched in 60 seconds.",
    keywords: ["car accident blog", "truck crash legal guide"],
  },
};

export const PRIORITY_BLOG_SEO: Record<string, PrioritySeo> = {
  "semi-truck-accident-in-houston-texas-what-to-do-2026": {
    title: "Houston Semi-Truck Accident: What to Do (2026)",
    description:
      "Houston 18-wheeler crash steps, Texas deadlines & free truck accident lawyer matching. Educational — WreckMatch is a referral service, not a law firm.",
  },
  "fmcsa-violations-after-a-truck-crash-in-dallas-texas": {
    title: "FMCSA Violations After a Dallas Truck Crash",
    description:
      "How FMCSA violations affect Dallas truck injury claims, evidence to preserve & free attorney matching. Not legal advice — WreckMatch referral service.",
  },
};

/** Public SEO paths use hyphens; internal app paths use slashes for some routes. */
export function prioritySeoForPath(path: string): PrioritySeo | undefined {
  let normalized = path.replace(/^\/car-accident-help-([a-z0-9-]+)/, "/car-accident-help/$1");
  const whatToDo = normalized.match(/^\/what-to-do-after-a-car-accident-in-([a-z0-9-]+)/);
  if (whatToDo) {
    normalized = `/what-to-do-after-a-car-accident-in/${whatToDo[1]}`;
  }
  return PRIORITY_PAGE_SEO[normalized] ?? PRIORITY_PAGE_SEO[path];
}

export function prioritySeoForPublicGeoPath(place: string): PrioritySeo | undefined {
  return prioritySeoForPath(`/car-accident-help/${place}`);
}
