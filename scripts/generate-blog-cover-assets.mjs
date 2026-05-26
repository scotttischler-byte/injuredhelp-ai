#!/usr/bin/env node
/**
 * One UNIQUE photo per blog slug — distinct stock photo + light overlay.
 * Uses curated Wikimedia pool (618 images) + WreckMatch originals. No 5-photo rotation.
 * Output: public/blog/covers/generated/{slug}.webp
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const BLOG_DIR = path.join(ROOT, "content/blog");
const OUT_DIR = path.join(ROOT, "public/blog/covers/generated");
const CACHE_DIR = path.join(ROOT, "public/blog/covers/source-cache");
const POOL_FILE = path.join(ROOT, "data/blog-cover-photo-pool.json");
const MANIFEST_FILE = path.join(ROOT, "data/blog-cover-assignments.json");
const COVER_VERSION = "v3";

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
  return label.length > 40 ? `${label.slice(0, 37)}…` : label;
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function overlaySvg(slug, buf) {
  const headline = escapeXml(headlineForSlug(slug));
  const sub = escapeXml(topicMeta(slug).label);
  const accentHue = pick(buf, 4, 360);
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="40%" stop-color="rgba(0,0,0,0.5)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.85)"/>
    </linearGradient>
  </defs>
  <rect x="0" y="400" width="1200" height="230" fill="url(#bar)"/>
  <rect x="48" y="488" width="280" height="4" fill="hsl(${accentHue},75%,52%)" rx="2"/>
  <text x="56" y="48" fill="#fecaca" font-family="system-ui,sans-serif" font-size="15" font-weight="700" letter-spacing="0.12em">WRECKMATCH</text>
  <text x="56" y="548" fill="#ffffff" font-family="system-ui,sans-serif" font-size="40" font-weight="800">${headline}</text>
  <text x="56" y="590" fill="#d1fae5" font-family="system-ui,sans-serif" font-size="18" font-weight="600">${sub}</text>
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

function ensurePool() {
  if (fs.existsSync(POOL_FILE)) return JSON.parse(fs.readFileSync(POOL_FILE, "utf8"));
  console.log("Building photo pool…");
  const r = spawnSync("node", ["scripts/build-cover-photo-pool.mjs"], { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
  return JSON.parse(fs.readFileSync(POOL_FILE, "utf8"));
}

function sourceKey(entry) {
  return entry.type === "local" ? `local:${entry.path}` : `remote:${entry.url}`;
}

function assignSources(slugs, pool) {
  const used = new Set();
  if (pool.length < slugs.length) {
    console.error(`Need ${slugs.length} photos, pool has ${pool.length}`);
    process.exit(1);
  }
  const assignments = {};
  for (const slug of slugs) {
    const buf = digest(slug);
    const start = pick(buf, 0, pool.length);
    let chosen = null;
    for (let i = 0; i < pool.length; i++) {
      const entry = pool[(start + i) % pool.length];
      const key = sourceKey(entry);
      if (used.has(key)) continue;
      chosen = { slug, source: entry, sourceKey: key };
      used.add(key);
      break;
    }
    if (!chosen) {
      console.error(`Ran out of unique photos at ${slug}`);
      process.exit(1);
    }
    assignments[slug] = chosen;
  }
  return assignments;
}

async function loadSourceBuffer(entry) {
  if (entry.type === "local") {
    return fs.readFileSync(entry.file ?? path.join(ROOT, "public", entry.path.replace(/^\//, "")));
  }
  const hash = crypto.createHash("sha256").update(entry.url).digest("hex").slice(0, 16);
  const cachePath = path.join(CACHE_DIR, `${hash}.jpg`);
  if (fs.existsSync(cachePath)) return fs.readFileSync(cachePath);
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const res = await fetch(entry.url, {
    headers: { "User-Agent": "WreckMatchCoverBot/1.0 (https://www.wreckmatch.com)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(cachePath, buf);
  return buf;
}

async function renderCover(slug, sourceEntry) {
  const buf = digest(slug);
  const sourceBuf = await loadSourceBuffer(sourceEntry);
  const brightness = 0.92 + pick(buf, 16, 24) / 100;
  const saturation = 0.75 + pick(buf, 20, 50) / 100;
  const hue = pick(buf, 24, 121) - 60;
  const flip = pick(buf, 48, 2) === 1;
  const positions = ["north", "south", "east", "west", "center", "attention", "entropy"];
  const position = positions[pick(buf, 52, positions.length)];

  let pipeline = sharp(sourceBuf).rotate().resize(1200, 630, { fit: "cover", position });
  if (flip) pipeline = pipeline.flop();
  const photo = await pipeline.modulate({ brightness, saturation, hue }).toBuffer();
  await sharp(photo)
    .composite([{ input: overlaySvg(slug, buf), blend: "over" }])
    .webp({ quality: 86, effort: 4 })
    .toFile(path.join(OUT_DIR, `${slug}.webp`));
}

async function runPool(limit, items, fn) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: limit }, () => worker()));
  return results;
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

console.log(`Generating ${slugs.length} unique covers → ${OUT_DIR}`);
const poolData = ensurePool();
const assignments = assignSources(slugs, poolData.pool);

await runPool(12, slugs, async (slug) => {
  await renderCover(slug, assignments[slug].source);
});

console.log(`Wrote ${slugs.length} covers`);

const keys = Object.values(assignments).map((a) => a.sourceKey);
if (new Set(keys).size !== keys.length) {
  console.error("Duplicate sources!");
  process.exit(1);
}

fs.writeFileSync(
  MANIFEST_FILE,
  JSON.stringify(
    { generatedAt: new Date().toISOString(), version: COVER_VERSION, slugCount: slugs.length, assignments: Object.fromEntries(slugs.map((s) => [s, { sourceKey: assignments[s].sourceKey }])) },
    null,
    2,
  ),
);
