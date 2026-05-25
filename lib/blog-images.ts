/**
 * Cover images for blog posts — exactly one unique asset per slug (no repeats).
 *
 * Run `npm run generate:blog-covers` after adding new markdown posts.
 */

import { getAllSlugs } from "@/lib/posts";

export type BlogCover = { src: string; alt: string };

const GENERATED_PREFIX = "/blog/covers/generated/";

const TOPIC_RULES: Array<{ test: RegExp; alt: string }> = [
  { test: /(18-wheeler|semi-truck|tractor-trailer|fmcsa|jackknife|truck-accident)/i, alt: "Truck accident legal guide" },
  { test: /(wrongful-death|fatal|family-guide)/i, alt: "Wrongful death legal guide" },
  { test: /(spinal|paralysis|paraplegic|quadriplegic|herniated)/i, alt: "Spinal injury legal guide" },
  { test: /(traumatic-brain|brain-injury|tbi|concussion|head-injury)/i, alt: "Brain injury legal guide" },
  { test: /(whiplash|neck-injury|back-injury|soft-tissue)/i, alt: "Whiplash injury legal guide" },
  { test: /(catastrophic|severe-injury|critical-injury)/i, alt: "Severe injury legal guide" },
  { test: /(rideshare|uber|lyft)/i, alt: "Rideshare accident legal guide" },
  { test: /(motorcycle|motorbike|biker)/i, alt: "Motorcycle accident legal guide" },
  { test: /(pedestrian|crosswalk|hit-by-car)/i, alt: "Pedestrian accident legal guide" },
  { test: /(insurance|adjuster|claim|denied|recorded-statement)/i, alt: "Insurance claim legal guide" },
  { test: /(statute-of-limitations|deadline|time-limit|filing-window)/i, alt: "Legal deadlines guide" },
  { test: /(what-to-do|first-steps|after-a-crash|after-a-car|on-scene)/i, alt: "After a car crash guide" },
  { test: /(recovery|medical|treatment|hospital|physical-therapy)/i, alt: "Medical recovery after crash guide" },
];

function altForSlug(slug: string): string {
  const s = (slug || "").toLowerCase();
  for (const rule of TOPIC_RULES) {
    if (rule.test.test(s)) return `${rule.alt} — WreckMatch`;
  }
  return "Car accident victim guide — WreckMatch";
}

function safeSlug(slug: string): string {
  return (slug || "wreckmatch-blog").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

/** Unique cover path for this slug only. */
export function blogCoverPathForSlug(slug: string): string {
  return `${GENERATED_PREFIX}${safeSlug(slug)}.jpg`;
}

export function blogCoverForSlug(slug: string, _vertical?: string): BlogCover {
  return {
    src: blogCoverPathForSlug(slug),
    alt: altForSlug(slug),
  };
}

export function blogCoverFromTopic(topic: {
  angle?: string;
  vertical?: string;
  slug?: string;
}): BlogCover {
  const slug = topic.slug ?? topic.angle ?? "";
  return blogCoverForSlug(slug, topic.vertical);
}

/** True unless frontmatter already points at this slug's unique generated JPG. */
export function shouldUseGeneratedCover(slug: string, src: string | undefined): boolean {
  if (!src) return true;
  const expected = blogCoverPathForSlug(slug);
  if (src === expected) return false;
  return true;
}

export function allBlogCoverSlugs(): string[] {
  try {
    return getAllSlugs();
  } catch {
    return [];
  }
}
