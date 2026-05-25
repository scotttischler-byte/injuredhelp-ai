/**
 * Cover images for blog posts — self-hosted SVG under /blog/covers/generated/.
 *
 * Run `npm run generate:blog-covers` after adding new markdown posts.
 */

import { getAllSlugs } from "@/lib/posts";

export type BlogCover = { src: string; alt: string };

const GENERATED_PREFIX = "/blog/covers/generated/";

const TOPIC_RULES: Array<{ test: RegExp; alt: string }> = [
  { test: /(18-wheeler|semi-truck|tractor-trailer|fmcsa|jackknife|truck-accident)/i, alt: "Truck accident legal guide cover" },
  { test: /(wrongful-death|fatal|family-guide)/i, alt: "Wrongful death legal guide cover" },
  { test: /(spinal|paralysis|paraplegic|quadriplegic|herniated)/i, alt: "Spinal injury legal guide cover" },
  { test: /(traumatic-brain|brain-injury|tbi|concussion|head-injury)/i, alt: "Brain injury legal guide cover" },
  { test: /(whiplash|neck-injury|back-injury|soft-tissue)/i, alt: "Whiplash injury legal guide cover" },
  { test: /(catastrophic|severe-injury|critical-injury)/i, alt: "Severe injury legal guide cover" },
  { test: /(rideshare|uber|lyft)/i, alt: "Rideshare accident legal guide cover" },
  { test: /(motorcycle|motorbike|biker)/i, alt: "Motorcycle accident legal guide cover" },
  { test: /(pedestrian|crosswalk|hit-by-car)/i, alt: "Pedestrian accident legal guide cover" },
  { test: /(insurance|adjuster|claim|denied|recorded-statement)/i, alt: "Insurance claim legal guide cover" },
  { test: /(statute-of-limitations|deadline|time-limit|filing-window)/i, alt: "Legal deadlines guide cover" },
  { test: /(what-to-do|first-steps|after-a-crash|after-a-car|on-scene)/i, alt: "After a car crash guide cover" },
  { test: /(recovery|medical|treatment|hospital|physical-therapy)/i, alt: "Medical recovery after crash guide cover" },
];

function altForSlug(slug: string): string {
  const s = (slug || "").toLowerCase();
  for (const rule of TOPIC_RULES) {
    if (rule.test.test(s)) return `${rule.alt} — WreckMatch`;
  }
  return `Car accident victim guide cover — WreckMatch`;
}

function pretty(slug: string): string {
  return slug.replace(/-/g, " ");
}

export function blogCoverPathForSlug(slug: string): string {
  const safe = (slug || "wreckmatch-blog").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  return `${GENERATED_PREFIX}${safe}.svg`;
}

export function blogCoverForSlug(slug: string, _vertical?: string): BlogCover {
  return {
    src: blogCoverPathForSlug(slug),
    alt: altForSlug(slug) || `Editorial cover for ${pretty(slug)}`,
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

/** Slugs that should have a generated asset (build-time / script). */
export function allBlogCoverSlugs(): string[] {
  try {
    return getAllSlugs();
  } catch {
    return [];
  }
}
