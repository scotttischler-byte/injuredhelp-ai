/**
 * Author + reviewer assignment for blog posts.
 * Slug-pattern routing keeps E-E-A-T tight without manual tagging.
 *
 * SAFETY MODEL:
 *  - "Author"  = Scott or Kathy (operations / education).
 *  - "Reviewed by" = Judge Roy Waddell (legal context — NOT legal advice).
 *  - WreckMatch is a legal referral service, not a law firm.
 */

import { KATHY_CARR, ROY_WADDELL, SCOTT_TISCHLER, type PersonEntity } from "@/lib/entities";

export type BlogAuthorship = {
  author: PersonEntity;
  reviewer?: PersonEntity;
};

type Rule = {
  test: RegExp;
  author: PersonEntity;
  /** Set to false to skip the reviewer line. */
  withReviewer?: boolean;
};

const RULES: Rule[] = [
  // Heavy-legal procedural topics: Scott authored, Roy reviewed.
  { test: /(statute-of-limitations|deadline|time-limit|filing-window|how-long)/i, author: SCOTT_TISCHLER, withReviewer: true },
  { test: /(insurance|adjuster|claim|denied|low-ball|recorded-statement|settlement)/i, author: SCOTT_TISCHLER, withReviewer: true },
  { test: /(fault|liability|comparative|contributory|negligence)/i, author: SCOTT_TISCHLER, withReviewer: true },
  { test: /(courtroom|deposition|discovery|trial|hearing)/i, author: SCOTT_TISCHLER, withReviewer: true },

  // Trucking / commercial-vehicle: Scott authored, Roy reviewed (FMCSA + interstate complexity).
  { test: /(18-wheeler|semi-truck|tractor-trailer|fmcsa|jackknife|underride|override|black-box|truck-accident)/i, author: SCOTT_TISCHLER, withReviewer: true },

  // Catastrophic + wrongful death: Kathy authored (healthcare/empathy lens), Roy reviewed.
  { test: /(wrongful-death|fatal|family-guide)/i, author: KATHY_CARR, withReviewer: true },
  { test: /(catastrophic|severe-injury|critical-injury|life-altering|paralysis)/i, author: KATHY_CARR, withReviewer: true },

  // Medical / injury / recovery: Kathy authored.
  { test: /(whiplash|neck-injury|back-injury|soft-tissue|chiropractor)/i, author: KATHY_CARR, withReviewer: false },
  { test: /(traumatic-brain|brain-injury|tbi|concussion|head-injury)/i, author: KATHY_CARR, withReviewer: true },
  { test: /(spinal|spinal-cord|herniated)/i, author: KATHY_CARR, withReviewer: true },
  { test: /(recovery|treatment|hospital|er-visit|physical-therapy|medical)/i, author: KATHY_CARR, withReviewer: false },

  // Rideshare / motorcycle / pedestrian: Scott authored.
  { test: /(rideshare|uber|lyft|gig-driver)/i, author: SCOTT_TISCHLER, withReviewer: true },
  { test: /(motorcycle|motorbike|biker)/i, author: SCOTT_TISCHLER, withReviewer: true },
  { test: /(pedestrian|crosswalk|hit-by-car|walking)/i, author: KATHY_CARR, withReviewer: true },

  // First steps / documentation / scene: Kathy authored.
  { test: /(what-to-do|first-steps|after-a-crash|after-a-car|immediate|on-scene|police-report|documentation)/i, author: KATHY_CARR, withReviewer: false },

  // Mistakes / cost / education: Scott authored.
  { test: /(mistakes|costly|7-|top-|guide-)/i, author: SCOTT_TISCHLER, withReviewer: false },
];

export function authorshipForSlug(slug: string): BlogAuthorship {
  const s = (slug || "").toLowerCase();
  for (const rule of RULES) {
    if (rule.test.test(s)) {
      return {
        author: rule.author,
        reviewer: rule.withReviewer === false ? undefined : ROY_WADDELL,
      };
    }
  }
  // Default: Scott authored, Roy not implied
  return { author: SCOTT_TISCHLER };
}

export function authorshipForSlugWithOverride(
  slug: string,
  override?: { authorId?: string; reviewerId?: string },
): BlogAuthorship {
  const base = authorshipForSlug(slug);
  if (!override) return base;

  const lookup = (id?: string): PersonEntity | undefined => {
    if (!id) return undefined;
    if (id === KATHY_CARR.id) return KATHY_CARR;
    if (id === SCOTT_TISCHLER.id) return SCOTT_TISCHLER;
    if (id === ROY_WADDELL.id) return ROY_WADDELL;
    return undefined;
  };

  const author = lookup(override.authorId) ?? base.author;
  const reviewer = override.reviewerId === "" ? undefined : lookup(override.reviewerId) ?? base.reviewer;
  return { author, reviewer };
}
