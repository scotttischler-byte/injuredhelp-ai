#!/usr/bin/env node
/**
 * One UNIQUE photograph per blog slug — no shared pool, no rotation, no color wash.
 * Each slug downloads its own image (seeded URL). Output: public/blog/covers/generated/{slug}.webp
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const BLOG_DIR = path.join(ROOT, "content/blog");
const OUT_DIR = path.join(ROOT, "public/blog/covers/generated");
const CACHE_DIR = path.join(ROOT, "public/blog/covers/unique-cache");
const MANIFEST_FILE = path.join(ROOT, "data/blog-cover-assignments.json");

const FLICKR_TAGS = [
  "car", "accident", "crash", "truck", "highway", "police", "ambulance", "hospital",
  "lawyer", "court", "insurance", "injury", "emergency", "traffic", "collision",
  "motorcycle", "pedestrian", "firefighter", "rescue", "damaged", "windshield",
  "intersection", "freeway", "night", "rain", "winter", "construction", "semi",
  "trailer", "highway", "safety", "seatbelt", "medical", "xray", "therapy",
  "gavel", "document", "phone", "witness", "tow", "guardrail", "skid", "flares",
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
  { test: /(lawyer|attorney|legal|rights|hire-a-lawyer)/i, label: "Legal help guide" },
];

function digest(slug) {
  return crypto.createHash("sha256").update(slug).digest();
}

function pick(buf, offset, mod) {
  return buf[offset % buf.length] % mod;
}

function topicMeta(slug) {
  for (const rule of TOPIC_RULES) {
    if (rule.test.test(slug)) return rule;
  }
  return { label: "Car accident victim guide" };
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
  const label = topicMeta(slug).label;
  return label.length > 36 ? `${label.slice(0, 33)}…` : label;
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Thin bottom strip — photo stays fully visible */
function overlaySvg(slug, buf) {
  const headline = escapeXml(headlineForSlug(slug));
  const accentHue = pick(buf, 4, 360);
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="540" width="1200" height="90" fill="rgba(0,0,0,0.72)"/>
  <rect x="48" y="548" width="200" height="3" fill="hsl(${accentHue},70%,50%)" rx="1"/>
  <text x="56" y="42" fill="#fecaca" font-family="system-ui,sans-serif" font-size="14" font-weight="700" letter-spacing="0.1em">WRECKMATCH</text>
  <text x="56" y="598" fill="#ffffff" font-family="system-ui,sans-serif" font-size="32" font-weight="800">${headline}</text>
</svg>`);
}

function slugsFromBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort();
}

function picsumUrl(slug, attempt = 0) {
  const seed = crypto
    .createHash("sha256")
    .update(`wreckmatch-cover-${slug}-v5-${attempt}`)
    .digest("hex")
    .slice(0, 32);
  return `https://picsum.photos/seed/${seed}/1200/630`;
}

function loremflickrUrl(slug, attempt = 0) {
  const buf = digest(`${slug}:${attempt}`);
  const tags = new Set();
  let i = 0;
  while (tags.size < 3 && i < 40) {
    tags.add(FLICKR_TAGS[pick(buf, i * 5, FLICKR_TAGS.length)]);
    i++;
  }
  const lock = buf.toString("hex").slice(0, 16);
  return `https://loremflickr.com/1200/630/${[...tags].join(",")}?random=${lock}`;
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function downloadPhoto(slug, url, attempt = 1) {
  const cacheKey = crypto.createHash("sha256").update(`${slug}:${url}`).digest("hex").slice(0, 20);
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.jpg`);
  if (fs.existsSync(cachePath)) return { buf: fs.readFileSync(cachePath), url, cached: true };

  const res = await fetch(url, { redirect: "follow" });
  if ((res.status === 429 || res.status >= 500) && attempt <= 4) {
    await sleep(400 * attempt);
    return downloadPhoto(slug, url, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("image")) throw new Error(`Not an image: ${ct}`);

  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath, buf);
  await sleep(80);
  return { buf, url, cached: false };
}

async function loadUniquePhoto(slug, attempt = 0) {
  const urls = [picsumUrl(slug, attempt), loremflickrUrl(slug, attempt)];
  let lastErr;
  for (const url of urls) {
    try {
      return await downloadPhoto(slug, url);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("No photo source");
}

async function renderCover(slug, attempt = 0) {
  const buf = digest(`${slug}:${attempt}`);
  const { buf: sourceBuf, url } = await loadUniquePhoto(slug, attempt);
  const cropPositions = ["attention", "entropy", "center", "north", "south", "east", "west"];
  const position = cropPositions[pick(buf, 8, cropPositions.length)];

  const photo = await sharp(sourceBuf)
    .rotate()
    .resize(1200, 630, { fit: "cover", position })
    .toBuffer();

  await sharp(photo)
    .composite([{ input: overlaySvg(slug, buf), blend: "over" }])
    .webp({ quality: 88, effort: 4 })
    .toFile(path.join(OUT_DIR, `${slug}.webp`));

  return url;
}

async function fileHash(filePath) {
  const raw = await sharp(filePath).resize(16, 16).raw().toBuffer();
  return crypto.createHash("md5").update(raw).digest("hex");
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const forceAll = process.argv.includes("--force");
const missingOnly = process.argv.includes("--missing-only") && !forceAll;
const allSlugs = slugsFromBlogDir();
const slugs = missingOnly
  ? allSlugs.filter((slug) => !fs.existsSync(path.join(OUT_DIR, `${slug}.webp`)))
  : allSlugs;

if (!slugs.length) {
  console.log("No covers to generate.");
  process.exit(0);
}

console.log(`Generating ${slugs.length} unique photos (one per slug, no pool)…`);

const assignments = {};
const seenHashes = new Map();
let dupes = 0;

async function runPool(limit, items, fn) {
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: limit }, () => worker()));
}

let done = 0;
await runPool(12, slugs, async (slug) => {
  let url = "";
  for (let attempt = 0; attempt < 6; attempt++) {
    url = await renderCover(slug, attempt);
    const h = await fileHash(path.join(OUT_DIR, `${slug}.webp`));
    if (!seenHashes.has(h)) {
      seenHashes.set(h, slug);
      assignments[slug] = { sourceUrl: url, attempt };
      break;
    }
    dupes++;
    console.warn(`  Retry ${attempt + 1} for ${slug} (matched ${seenHashes.get(h)})`);
  }
  done++;
  if (done % 25 === 0) console.log(`  ${done}/${slugs.length}…`);
});

if (dupes > slugs.length * 0.02) {
  console.error(`ERROR: too many duplicate-looking covers (${dupes} retries)`);
  process.exit(1);
}

console.log(`Wrote ${slugs.length} unique covers to ${OUT_DIR}`);

fs.writeFileSync(
  MANIFEST_FILE,
  JSON.stringify({ generatedAt: new Date().toISOString(), engine: "unique-seed-per-slug", slugCount: slugs.length, assignments }, null, 2),
);
