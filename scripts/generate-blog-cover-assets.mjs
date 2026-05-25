#!/usr/bin/env node
/**
 * One unique WebP cover per blog slug (no repeats). Photography + per-slug crop/grade/overlay.
 * Output: public/blog/covers/generated/{slug}.webp
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const BLOG_DIR = path.join(ROOT, "content/blog");
const OUT_DIR = path.join(ROOT, "public/blog/covers/generated");
const BASE_DIR = path.join(ROOT, "public/blog/covers");

const BASE_PHOTOS = [
  "car-accident-scene-1.png",
  "car-accident-scene-2.png",
  "car-accident-scene-3.png",
  "attorney-consultation-1.png",
  "attorney-consultation-2.png",
];

const STATE_SLUGS =
  "texas|florida|california|ohio|georgia|illinois|pennsylvania|north-carolina|tennessee|arizona|nevada|colorado|michigan|new-york|new-jersey|massachusetts|virginia|washington|oregon|minnesota|wisconsin|indiana|missouri|alabama|louisiana|kentucky|oklahoma|connecticut|utah|iowa|arkansas|mississippi|kansas|nebraska|idaho|hawaii|maine|new-hampshire|rhode-island|montana|delaware|south-carolina|south-dakota|north-dakota|west-virginia|alaska|vermont|wyoming|district-of-columbia";

const TOPIC_RULES = [
  { test: /(18-wheeler|semi-truck|tractor-trailer|fmcsa|jackknife|truck-accident)/i, label: "Truck accident guide" },
  { test: /(wrongful-death|fatal|family-guide)/i, label: "Wrongful death guide" },
  { test: /(spinal|paralysis|herniated)/i, label: "Spinal injury guide" },
  { test: /(traumatic-brain|brain-injury|tbi|concussion|head-injury)/i, label: "Brain injury guide" },
  { test: /(whiplash|neck-injury|back-injury|soft-tissue)/i, label: "Whiplash guide" },
  { test: /(catastrophic|severe-injury|critical-injury)/i, label: "Severe injury guide" },
  { test: /(rideshare|uber|lyft)/i, label: "Rideshare accident guide" },
  { test: /(motorcycle|motorbike|biker)/i, label: "Motorcycle crash guide" },
  { test: /(pedestrian|crosswalk|hit-by-car)/i, label: "Pedestrian accident guide" },
  { test: /(insurance|adjuster|claim|denied|recorded-statement)/i, label: "Insurance claim guide" },
  { test: /(statute-of-limitations|deadline|time-limit|filing-window)/i, label: "Legal deadlines" },
  { test: /(what-to-do|first-steps|after-a-crash|after-a-car|on-scene)/i, label: "After a crash" },
];

const POSITIONS = ["north", "south", "east", "west", "center", "northeast", "northwest", "southeast", "southwest", "entropy", "attention"];

function digest(slug) {
  return crypto.createHash("sha256").update(slug).digest();
}

function pick(buf, offset, mod) {
  return buf[offset % buf.length] % mod;
}

function topicLabel(slug) {
  for (const rule of TOPIC_RULES) {
    if (rule.test.test(slug)) return rule.label;
  }
  return "Car accident victim guide";
}

function slugCityState(slug) {
  const re = new RegExp(`-in-([a-z0-9-]+)-(${STATE_SLUGS})(?:-|$)`, "i");
  const m = slug.match(re);
  if (!m) return { city: "", state: "" };
  const city = m[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const state = m[2].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { city, state };
}

function headlineForSlug(slug) {
  const { city, state } = slugCityState(slug);
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  const label = topicLabel(slug);
  return label.length > 40 ? `${label.slice(0, 37)}…` : label;
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function overlaySvg(slug, buf) {
  const headline = escapeXml(headlineForSlug(slug));
  const sub = escapeXml(topicLabel(slug));
  const accentHue = pick(buf, 4, 360);
  const barW = 520 + pick(buf, 8, 380);
  const slugHash = crypto.createHash("md5").update(slug).digest("hex").slice(0, 8);
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0.05)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.78)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <rect x="48" y="418" width="${barW}" height="5" fill="hsl(${accentHue},72%,48%)" rx="2"/>
  <text x="56" y="82" fill="#fecaca" font-family="system-ui,sans-serif" font-size="18" font-weight="700" letter-spacing="0.14em">WRECKMATCH</text>
  <text x="56" y="488" fill="#ffffff" font-family="system-ui,sans-serif" font-size="46" font-weight="800">${headline}</text>
  <text x="56" y="538" fill="#d1fae5" font-family="system-ui,sans-serif" font-size="21" font-weight="600">${sub}</text>
  <text x="56" y="578" fill="#9ca3af" font-family="system-ui,sans-serif" font-size="14">Educational only · ${slugHash}</text>
</svg>`);
}

function slugsFromBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")).sort();
}

async function renderCover(slug) {
  const buf = digest(slug);
  const baseFile = BASE_PHOTOS[pick(buf, 0, BASE_PHOTOS.length)];
  const basePath = path.join(BASE_DIR, baseFile);
  const position = POSITIONS[pick(buf, 12, POSITIONS.length)];
  const brightness = 0.78 + pick(buf, 16, 30) / 100;
  const saturation = 0.85 + pick(buf, 20, 28) / 100;
  const hue = pick(buf, 24, 41) - 20;

  const meta = await sharp(basePath).metadata();
  const w = meta.width ?? 1600;
  const h = meta.height ?? 900;
  const cropW = Math.max(900, Math.floor(w * (0.52 + pick(buf, 28, 38) / 100)));
  const cropH = Math.max(500, Math.floor(h * (0.52 + pick(buf, 32, 38) / 100)));
  const left = Math.min(w - cropW, Math.floor((pick(buf, 36, 100) / 100) * (w - cropW)));
  const top = Math.min(h - cropH, Math.floor((pick(buf, 40, 100) / 100) * (h - cropH)));

  const photo = await sharp(basePath)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(1200, 630, { fit: "cover", position })
    .modulate({ brightness, saturation, hue })
    .toBuffer();

  await sharp(photo)
    .composite([{ input: overlaySvg(slug, buf), blend: "over" }])
    .webp({ quality: 76, effort: 4 })
    .toFile(path.join(OUT_DIR, `${slug}.webp`));
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const slugs = slugsFromBlogDir();

for (const f of fs.readdirSync(OUT_DIR)) {
  if (/\.(svg|jpe?g|png)$/i.test(f)) {
    try {
      fs.unlinkSync(path.join(OUT_DIR, f));
    } catch {
      /* ignore */
    }
  }
}

let written = 0;
for (const slug of slugs) {
  await renderCover(slug);
  written++;
  if (written % 25 === 0) console.log(`  ${written}/${slugs.length}…`);
}
console.log(`Wrote ${written} unique WebP covers to ${OUT_DIR}`);

const paths = slugs.map((s) => `/blog/covers/generated/${s}.webp`);
if (new Set(paths).size !== paths.length) {
  console.error("ERROR: duplicate cover paths");
  process.exit(1);
}
