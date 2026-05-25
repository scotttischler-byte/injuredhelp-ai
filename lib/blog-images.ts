/**
 * Cover images for blog posts.
 *
 * Goal: every post gets a UNIQUE image (no photo used more than once).
 *
 * Strategy:
 *  1) A curated pool of topic-matched Unsplash photos is claimed first —
 *     each photo is used at most ONCE, assigned to the first slug whose
 *     topic matches in alphabetical order.
 *  2) Any post that did not claim a topic photo falls back to Picsum
 *     with seed = slug, which guarantees a unique deterministic image
 *     per slug across rebuilds.
 *
 * The assignment is memoized at module load so it's stable across renders.
 */

import { getAllSlugs } from "@/lib/posts";

export type BlogCover = { src: string; alt: string };

function unsplash(id: string, alt: string): BlogCover {
  return {
    src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=420&q=75`,
    alt,
  };
}

/** Curated topic-matched Unsplash photos. Each is claimed at most once. */
const TOPIC_POOL: Record<string, BlogCover[]> = {
  truck: [
    unsplash("1568438350562-2cae6d394ad0", "Semi truck on highway — commercial vehicle accident guide"),
    unsplash("1449965408869-eaa3f722e40d", "Highway at dusk with commercial trucks"),
  ],
  wrongfulDeath: [
    unsplash("1581094288338-2314dddb7ece", "Solemn memorial — wrongful death legal guide"),
  ],
  spinal: [
    unsplash("1576091160550-2173dba999ef", "MRI medical imaging for spinal injury"),
  ],
  brain: [
    unsplash("1559757175-5700dde675bc", "Medical professional reviewing brain scan after TBI"),
  ],
  whiplash: [
    unsplash("1519074069444-1ba4fff66d16", "Person holding neck — whiplash and soft-tissue injury"),
  ],
  catastrophic: [
    unsplash("1551601651-2a8555f1a136", "Ambulance and emergency response after a serious crash"),
    unsplash("1612531386530-97286d97c2d2", "Emergency responders after a severe accident"),
  ],
  rideshare: [
    unsplash("1535378917042-10a22c95931a", "Rideshare app on smartphone — Uber and Lyft accident help"),
    unsplash("1488521787991-ed7bbaae773c", "Smartphone with transportation app"),
  ],
  motorcycle: [
    unsplash("1558981806-ec527fa84c39", "Motorcycle on road — motorcycle accident victim guide"),
    unsplash("1568430328012-21ed450453ea", "Motorcyclist on highway"),
  ],
  pedestrian: [
    unsplash("1556761175-5973dc0f32e7", "Crosswalk pedestrian crossing — pedestrian accident guide"),
  ],
  insurance: [
    unsplash("1450101499163-c8848c66ca85", "Insurance paperwork and handshake — claims and adjusters"),
  ],
  legal: [
    unsplash("1505664194779-8beaceb93744", "Courthouse — statute of limitations and legal deadlines"),
  ],
  scene: [
    unsplash("1582719471384-894fbb16e074", "Accident scene — first steps after a crash"),
  ],
  recovery: [
    unsplash("1604357209793-fca5dca89f97", "Medical recovery after a serious injury"),
  ],
  car: [
    unsplash("1583121274602-3e2820c69888", "Damaged car after an accident — victim guide"),
    unsplash("1545459720-aac8509eb02c", "Car accident victim help"),
  ],
};

const TOPIC_RULES: Array<{ test: RegExp; topic: keyof typeof TOPIC_POOL }> = [
  { test: /(18-wheeler|semi-truck|tractor-trailer|fmcsa|jackknife|underride|override|black-box|truck-accident|truck crash)/i, topic: "truck" },
  { test: /(wrongful-death|family-guide|fatal)/i, topic: "wrongfulDeath" },
  { test: /(spinal|paralysis|paraplegic|quadriplegic|herniated)/i, topic: "spinal" },
  { test: /(traumatic-brain|brain-injury|tbi|concussion|head-injury)/i, topic: "brain" },
  { test: /(whiplash|neck-injury|back-injury|soft-tissue|chiropractor)/i, topic: "whiplash" },
  { test: /(catastrophic|severe-injury|critical-injury|life-altering)/i, topic: "catastrophic" },
  { test: /(rideshare|uber|lyft|gig-driver)/i, topic: "rideshare" },
  { test: /(motorcycle|motorbike|biker|helmet)/i, topic: "motorcycle" },
  { test: /(pedestrian|crosswalk|hit-by-car|walking)/i, topic: "pedestrian" },
  { test: /(insurance|adjuster|claim|denied|low-ball|recorded-statement|settlement-offer)/i, topic: "insurance" },
  { test: /(statute-of-limitations|deadline|time-limit|filing-window|how-long)/i, topic: "legal" },
  { test: /(what-to-do|first-steps|after-a-crash|after-a-car|immediate|on-scene|police-report|documentation)/i, topic: "scene" },
  { test: /(recovery|medical|treatment|hospital|er-visit|physical-therapy)/i, topic: "recovery" },
];

function topicForSlug(slug: string): keyof typeof TOPIC_POOL {
  const s = (slug || "").toLowerCase();
  for (const rule of TOPIC_RULES) {
    if (rule.test.test(s)) return rule.topic;
  }
  return "car";
}

function pretty(slug: string): string {
  return slug.replace(/-/g, " ");
}

function picsum(slug: string): BlogCover {
  return {
    src: `https://picsum.photos/seed/${encodeURIComponent(slug)}/1200/630`,
    alt: `Editorial cover image for ${pretty(slug)} — WreckMatch guide`,
  };
}

/** Module-cached map: slug → unique cover. */
let _assignment: Map<string, BlogCover> | null = null;

function buildAssignment(): Map<string, BlogCover> {
  const slugs = getAllSlugs().slice().sort(); // deterministic ordering
  const claimed = new Map<keyof typeof TOPIC_POOL, number>();
  const map = new Map<string, BlogCover>();

  for (const slug of slugs) {
    const topic = topicForSlug(slug);
    const pool = TOPIC_POOL[topic] ?? TOPIC_POOL.car;
    const idx = claimed.get(topic) ?? 0;
    if (idx < pool.length) {
      map.set(slug, pool[idx]);
      claimed.set(topic, idx + 1);
    } else {
      map.set(slug, picsum(slug));
    }
  }

  return map;
}

function assignment(): Map<string, BlogCover> {
  if (_assignment) return _assignment;
  try {
    _assignment = buildAssignment();
  } catch {
    _assignment = new Map();
  }
  return _assignment;
}

export function blogCoverForSlug(slug: string, _vertical?: string): BlogCover {
  const map = assignment();
  const cached = map.get(slug);
  if (cached) return cached;
  // Slug not in known set (e.g. preview / not-yet-published). Fall back to Picsum.
  return picsum(slug || "wreckmatch-blog");
}

export function blogCoverFromTopic(topic: {
  angle?: string;
  vertical?: string;
  slug?: string;
}): BlogCover {
  const slug = topic.slug ?? topic.angle ?? "";
  return blogCoverForSlug(slug, topic.vertical);
}
