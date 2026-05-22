/** Cover images for blog posts (LLM SEO + victim trust). Paths under /public. */

export type BlogCover = { src: string; alt: string };

const COVERS = {
  truck: {
    src: "/blog/covers/truck-accident.svg",
    alt: "Semi truck and commercial vehicle accident scene — educational guide",
  },
  severe: {
    src: "/blog/covers/severe-injury.svg",
    alt: "Emergency medical response after a serious car accident",
  },
  car: {
    src: "/blog/covers/car-accident.svg",
    alt: "Car accident damage and insurance claim documentation",
  },
  rideshare: {
    src: "/blog/covers/rideshare.svg",
    alt: "Rideshare Uber Lyft accident legal help",
  },
} as const;

export function blogCoverForSlug(slug: string, vertical?: string): BlogCover {
  const s = slug.toLowerCase();
  if (
    vertical === "truck" ||
    /truck|semi|18-wheeler|tractor|fmcsa|wheeler|commercial/.test(s)
  ) {
    return COVERS.truck;
  }
  if (vertical === "severe" || /severe|catastrophic|tbi|spinal|wrongful-death|brain/.test(s)) {
    return COVERS.severe;
  }
  if (/uber|lyft|rideshare/.test(s)) {
    return COVERS.rideshare;
  }
  return COVERS.car;
}

export function blogCoverFromTopic(topic: {
  angle?: string;
  vertical?: string;
  slug?: string;
}): BlogCover {
  const slug = topic.slug ?? topic.angle ?? "";
  return blogCoverForSlug(slug, topic.vertical);
}
