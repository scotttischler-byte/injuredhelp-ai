#!/usr/bin/env node
/**
 * One UNIQUE photo per blog slug — no shared base pool, no rotation.
 * Each slug gets its own stock photo (Wikimedia / WreckMatch originals) + overlay.
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

const STATE_SLUGS =
  "texas|florida|california|ohio|georgia|illinois|pennsylvania|north-carolina|tennessee|arizona|nevada|colorado|michigan|new-york|new-jersey|massachusetts|virginia|washington|oregon|minnesota|wisconsin|indiana|missouri|alabama|louisiana|kentucky|oklahoma|connecticut|utah|iowa|arkansas|mississippi|kansas|nebraska|idaho|hawaii|maine|new-hampshire|rhode-island|montana|delaware|south-carolina|south-dakota|north-dakota|west-virginia|alaska|vermont|wyoming|district-of-columbia";

const TOPIC_RULES = [
  { test: /(18-wheeler|semi-truck|tractor-trailer|fmcsa|jackknife|truck-accident)/i, label: "Truck accident guide", query: "truck accident" },
  { test: /(wrongful-death|fatal|family-guide)/i, label: "Wrongful death guide", query: "memorial flowers" },
  { test: /(spinal|paralysis|herniated)/i, label: "Spinal injury guide", query: "spinal injury" },
  { test: /(traumatic-brain|brain-injury|tbi|concussion|head-injury)/i, label: "Brain injury guide", query: "brain scan" },
  { test: /(whiplash|neck-injury|back-injury|soft-tissue)/i, label: "Whiplash guide", query: "neck brace" },
  { test: /(catastrophic|severe-injury|critical-injury)/i, label: "Severe injury guide", query: "trauma center" },
  { test: /(rideshare|uber|lyft)/i, label: "Rideshare accident guide", query: "rideshare car" },
  { test: /(motorcycle|motorbike|biker)/i, label: "Motorcycle crash guide", query: "motorcycle accident" },
  { test: /(pedestrian|crosswalk|hit-by-car)/i, label: "Pedestrian accident guide", query: "pedestrian crosswalk" },
  { test: /(insurance|adjuster|claim|denied|recorded-statement)/i, label: "Insurance claim guide", query: "insurance document" },
  { test: /(statute-of-limitations|deadline|time-limit|filing-window)/i, label: "Legal deadlines", query: "calendar deadline" },
  { test: /(what-to-do|first-steps|after-a-crash|after-a-car|on-scene)/i, label: "After a crash", query: "accident scene" },
  { test: /(lawyer|attorney|legal|rights|hire-a-lawyer)/i, label: "Legal help guide", query: "attorney consultation" },
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
  return { label: "Car accident victim guide", query: "car accident" };
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
  const barW = 480 + pick(buf, 8, 420);
  const slugHash = crypto.createHash("md5").update(slug).digest("hex").slice(0, 8);
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0.10)"/>
      <stop offset="50%" stop-color="rgba(0,0,0,0.30)"/>
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
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort();
}

function ensurePool() {
  if (fs.existsSync(POOL_FILE)) return JSON.parse(fs.readFileSync(POOL_FILE, "utf8"));
  console.log("Building photo pool (first run)…");
  const r = spawnSync("node", ["scripts/build-cover-photo-pool.mjs"], { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
  return JSON.parse(fs.readFileSync(POOL_FILE, "utf8"));
}

function sourceKey(entry) {
  return entry.type === "local" ? `local:${entry.path}` : `remote:${entry.url}`;
}

function loadUsedSources() {
  const used = new Set();
  if (!fs.existsSync(MANIFEST_FILE)) return used;
  try {
    const prior = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
    for (const meta of Object.values(prior.assignments ?? {})) {
      if (meta?.sourceKey) used.add(meta.sourceKey);
    }
  } catch {
    /* ignore corrupt manifest */
  }
  return used;
}

function assignSources(slugs, pool) {
  const used = loadUsedSources();
  if (pool.length < used.size + slugs.length) {
    console.error(
      `ERROR: need ${used.size + slugs.length} unique photos but pool only has ${pool.length}. Run build-cover-photo-pool.mjs`,
    );
    process.exit(1);
  }

  const assignments = {};

  for (const slug of slugs) {
    const buf = digest(slug);
    const meta = topicMeta(slug);
    const start = pick(buf, 0, pool.length);
    let chosen = null;
    for (let i = 0; i < pool.length; i++) {
      const entry = pool[(start + i) % pool.length];
      const key = sourceKey(entry);
      if (used.has(key)) continue;
      chosen = { slug, source: entry, sourceKey: key, topic: meta.query };
      used.add(key);
      break;
    }
    if (!chosen) {
      console.error(`ERROR: ran out of unique photos at slug ${slug}`);
      process.exit(1);
    }
    assignments[slug] = chosen;
  }
  return assignments;
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function loadSourceBuffer(entry, attempt = 1) {
  if (entry.type === "local") {
    return fs.readFileSync(entry.file ?? path.join(ROOT, "public", entry.path.replace(/^\//, "")));
  }

  const hash = crypto.createHash("sha256").update(entry.url).digest("hex").slice(0, 16);
  const cachePath = path.join(CACHE_DIR, `${hash}.jpg`);
  if (fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath);
  }

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const res = await fetch(entry.url, {
    headers: { "User-Agent": "WreckMatchCoverBot/1.0 (https://www.wreckmatch.com)" },
    redirect: "follow",
  });

  if (res.status === 429 && attempt <= 6) {
    await sleep(500 * attempt);
    return loadSourceBuffer(entry, attempt + 1);
  }
  if (!res.ok) {
    throw new Error(`Failed to download ${entry.url}: ${res.status}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(cachePath, buf);
  await sleep(180);
  return buf;
}

async function renderCover(slug, sourceEntry) {
  const buf = digest(slug);
  const sourceBuf = await loadSourceBuffer(sourceEntry);
  const brightness = 0.88 + pick(buf, 16, 20) / 100;
  const saturation = 0.92 + pick(buf, 20, 24) / 100;
  const hue = pick(buf, 24, 31) - 15;

  const photo = await sharp(sourceBuf)
    .rotate()
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .modulate({ brightness, saturation, hue })
    .toBuffer();

  await sharp(photo)
    .composite([{ input: overlaySvg(slug, buf), blend: "over" }])
    .webp({ quality: 82, effort: 4 })
    .toFile(path.join(OUT_DIR, `${slug}.webp`));
}

async function dHash(filePath) {
  const raw = await sharp(filePath).greyscale().resize(9, 8, { fit: "fill" }).raw().toBuffer();
  let bits = "";
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      bits += raw[y * 9 + x] < raw[y * 9 + x + 1] ? "1" : "0";
    }
  }
  return bits;
}

function hamming(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

async function verifyUniqueCovers(slugs) {
  const hashes = new Map();
  let tooSimilar = 0;
  for (const slug of slugs) {
    const file = path.join(OUT_DIR, `${slug}.webp`);
    const h = await dHash(file);
    for (const [other, oh] of hashes) {
      const dist = hamming(h, oh);
      if (dist < 8) {
        tooSimilar++;
        if (tooSimilar <= 5) console.warn(`  Similar covers (${dist} bits): ${slug} ↔ ${other}`);
      }
    }
    hashes.set(slug, h);
  }
  if (tooSimilar > 0) {
    console.warn(`WARNING: ${tooSimilar} cover pairs visually similar (dHash distance < 8)`);
  } else {
    console.log("Visual uniqueness check passed (no near-duplicate covers).");
  }
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const f of fs.readdirSync(OUT_DIR)) {
  if (/\.(svg|jpe?g|png)$/i.test(f)) {
    try {
      fs.unlinkSync(path.join(OUT_DIR, f));
    } catch {
      /* ignore */
    }
  }
}

const missingOnly = process.argv.includes("--missing-only");
const allSlugs = slugsFromBlogDir();
const slugs = missingOnly
  ? allSlugs.filter((slug) => !fs.existsSync(path.join(OUT_DIR, `${slug}.webp`)))
  : allSlugs;
if (slugs.length === 0) {
  console.log(missingOnly ? "All blog covers already exist." : "No blog posts found.");
  process.exit(0);
}
if (missingOnly) console.log(`Generating ${slugs.length} missing covers (of ${allSlugs.length} posts)…`);
const poolData = ensurePool();
const assignments = assignSources(slugs, poolData.pool);

fs.mkdirSync(path.dirname(MANIFEST_FILE), { recursive: true });
fs.writeFileSync(
  MANIFEST_FILE,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      slugCount: slugs.length,
      poolSize: poolData.pool.length,
      assignments: Object.fromEntries(
        Object.entries(assignments).map(([slug, a]) => [slug, { sourceKey: a.sourceKey, topic: a.topic }]),
      ),
    },
    null,
    2,
  ),
);

let written = 0;
const failed = [];
for (const slug of slugs) {
  try {
    await renderCover(slug, assignments[slug].source);
    written++;
    if (written % 20 === 0) console.log(`  ${written}/${slugs.length}…`);
  } catch (err) {
    failed.push({ slug, err: String(err) });
    console.warn(`  Skip ${slug}: ${err.message ?? err}`);
  }
}

if (failed.length) {
  console.log(`Retrying ${failed.length} failed covers with alternate sources…`);
  const retryUsed = new Set(Object.values(assignments).map((a) => a.sourceKey));
  for (const { slug } of failed) {
    const buf = digest(slug);
    let rendered = false;
    for (let i = 0; i < poolData.pool.length; i++) {
      const entry = poolData.pool[(pick(buf, 2, poolData.pool.length) + i) % poolData.pool.length];
      const key = sourceKey(entry);
      if (retryUsed.has(key)) continue;
      try {
        await renderCover(slug, entry);
        assignments[slug] = { slug, source: entry, sourceKey: key, topic: topicMeta(slug).query };
        retryUsed.add(key);
        written++;
        rendered = true;
        console.log(`  Recovered ${slug}`);
        break;
      } catch {
        /* try next */
      }
    }
    if (!rendered) {
      console.error(`ERROR: could not render cover for ${slug}`);
      process.exit(1);
    }
  }
}

console.log(`Wrote ${written} unique-photo WebP covers to ${OUT_DIR}`);

const sourceKeys = Object.values(assignments).map((a) => a.sourceKey);
if (new Set(sourceKeys).size !== sourceKeys.length) {
  console.error("ERROR: duplicate source photos assigned");
  process.exit(1);
}
console.log(`Source photo uniqueness verified: ${sourceKeys.length} slugs → ${sourceKeys.length} unique sources`);

await verifyUniqueCovers(slugs);

const paths = slugs.map((s) => `/blog/covers/generated/${s}.webp`);
if (new Set(paths).size !== paths.length) {
  console.error("ERROR: duplicate cover paths");
  process.exit(1);
}
