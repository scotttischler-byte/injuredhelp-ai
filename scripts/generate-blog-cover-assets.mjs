#!/usr/bin/env node
/**
 * Generate unique local SVG cover art for every blog slug (no remote images).
 * Output: public/blog/covers/generated/{slug}.svg
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BLOG_DIR = path.join(ROOT, "content/blog");
const OUT_DIR = path.join(ROOT, "public/blog/covers/generated");

const TOPIC_RULES = [
  { test: /(18-wheeler|semi-truck|tractor-trailer|fmcsa|jackknife|truck-accident)/i, label: "Truck accident guide" },
  { test: /(wrongful-death|fatal|family-guide)/i, label: "Wrongful death guide" },
  { test: /(spinal|paralysis|paraplegic|quadriplegic|herniated)/i, label: "Spinal injury guide" },
  { test: /(traumatic-brain|brain-injury|tbi|concussion|head-injury)/i, label: "Brain injury guide" },
  { test: /(whiplash|neck-injury|back-injury|soft-tissue)/i, label: "Whiplash & soft tissue" },
  { test: /(catastrophic|severe-injury|critical-injury)/i, label: "Severe injury guide" },
  { test: /(rideshare|uber|lyft)/i, label: "Rideshare accident guide" },
  { test: /(motorcycle|motorbike|biker)/i, label: "Motorcycle crash guide" },
  { test: /(pedestrian|crosswalk|hit-by-car)/i, label: "Pedestrian accident guide" },
  { test: /(insurance|adjuster|claim|denied|recorded-statement)/i, label: "Insurance claim guide" },
  { test: /(statute-of-limitations|deadline|time-limit|filing-window)/i, label: "Legal deadlines guide" },
  { test: /(what-to-do|first-steps|after-a-crash|after-a-car|on-scene)/i, label: "After a crash — first steps" },
  { test: /(recovery|medical|treatment|hospital|physical-therapy)/i, label: "Medical recovery guide" },
];

function topicLabel(slug) {
  for (const rule of TOPIC_RULES) {
    if (rule.test.test(slug)) return rule.label;
  }
  return "Car accident victim guide";
}

function hue(slug) {
  const n = parseInt(crypto.createHash("md5").update(slug).digest("hex").slice(0, 6), 16);
  return n % 360;
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function svgForSlug(slug, label) {
  const h1 = hue(slug);
  const h2 = (h1 + 42) % 360;
  const title = escapeXml(label);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(${h1},42%,32%)"/>
      <stop offset="100%" stop-color="hsl(${h2},48%,16%)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="56" y="88" fill="#fecaca" font-family="system-ui,sans-serif" font-size="22" font-weight="700" letter-spacing="0.08em">WRECKMATCH</text>
  <text x="56" y="300" fill="#ffffff" font-family="system-ui,sans-serif" font-size="40" font-weight="800">${title}</text>
  <text x="56" y="360" fill="#d1fae5" font-family="system-ui,sans-serif" font-size="20">Educational guide — not legal advice</text>
</svg>
`;
}

function slugsFromBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort();
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const slugs = slugsFromBlogDir();
let written = 0;
for (const slug of slugs) {
  const out = path.join(OUT_DIR, `${slug}.svg`);
  fs.writeFileSync(out, svgForSlug(slug, topicLabel(slug)), "utf8");
  written++;
}
console.log(`Wrote ${written} covers to ${OUT_DIR}`);
