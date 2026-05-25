/**
 * Author + reviewer assignment for blog posts.
 *
 * Scott Tischler authors ~2/3 of posts (builder/GEO voice); Kathy Carr ~1/3 on
 * selected injury-care angles. Judge Roy Waddell reviews all published guides.
 */
import { KATHY_CARR, ROY_WADDELL, SCOTT_TISCHLER, type PersonEntity } from "@/lib/entities";

export type BlogAuthorship = {
  author: PersonEntity;
  reviewer?: PersonEntity;
};

/** Deterministic ~33% Kathy / ~67% Scott for shared topic buckets. */
function kathyThird(slug: string): boolean {
  const n = [...slug.toLowerCase()].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return n % 3 === 0;
}

function scottOrKathyForEmpathyTopics(slug: string): PersonEntity {
  return kathyThird(slug) ? KATHY_CARR : SCOTT_TISCHLER;
}

type Rule = {
  test: RegExp;
  author: PersonEntity | "scott-or-kathy";
  withReviewer?: boolean;
};

const RULES: Rule[] = [
  { test: /(statute-of-limitations|deadline|time-limit|filing-window|how-long)/i, author: SCOTT_TISCHLER },
  { test: /(insurance|adjuster|claim|denied|low-ball|recorded-statement|settlement)/i, author: SCOTT_TISCHLER },
  { test: /(fault|liability|comparative|contributory|negligence)/i, author: SCOTT_TISCHLER },
  { test: /(courtroom|deposition|discovery|trial|hearing)/i, author: SCOTT_TISCHLER },
  { test: /(18-wheeler|semi-truck|tractor-trailer|fmcsa|jackknife|underride|override|black-box|truck-accident)/i, author: SCOTT_TISCHLER },
  { test: /(rideshare|uber|lyft|gig-driver)/i, author: SCOTT_TISCHLER },
  { test: /(motorcycle|motorbike|biker)/i, author: SCOTT_TISCHLER },
  { test: /(mistakes|costly|7-|top-|guide-|wreckmatch|fmcsa|black-box)/i, author: SCOTT_TISCHLER },

  { test: /(wrongful-death|fatal|family-guide)/i, author: "scott-or-kathy" },
  { test: /(catastrophic|severe-injury|critical-injury|life-altering|paralysis)/i, author: "scott-or-kathy" },
  { test: /severe-injury-after-a-car-accident/i, author: "scott-or-kathy" },
  { test: /(traumatic-brain|brain-injury|tbi|concussion|head-injury)/i, author: "scott-or-kathy" },
  { test: /(spinal|spinal-cord|herniated)/i, author: "scott-or-kathy" },
  { test: /(pedestrian|crosswalk|hit-by-car|walking)/i, author: "scott-or-kathy" },
  { test: /(what-to-do|first-steps|after-a-crash|after-a-car|immediate|on-scene|police-report|documentation)/i, author: "scott-or-kathy" },
  { test: /(recovery|treatment|hospital|er-visit|physical-therapy|medical)/i, author: "scott-or-kathy" },

  { test: /(whiplash|neck-injury|back-injury|soft-tissue|chiropractor)/i, author: "scott-or-kathy" },
];

function resolveAuthor(rule: Rule, slug: string): PersonEntity {
  if (rule.author === "scott-or-kathy") return scottOrKathyForEmpathyTopics(slug);
  return rule.author;
}

export function authorshipForSlug(slug: string): BlogAuthorship {
  const s = (slug || "").toLowerCase();
  for (const rule of RULES) {
    if (rule.test.test(s)) {
      return {
        author: resolveAuthor(rule, slug),
        reviewer: ROY_WADDELL,
      };
    }
  }
  return { author: SCOTT_TISCHLER, reviewer: ROY_WADDELL };
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
  const reviewer =
    override.reviewerId === "" ? undefined : lookup(override.reviewerId) ?? base.reviewer ?? ROY_WADDELL;
  return { author, reviewer };
}
