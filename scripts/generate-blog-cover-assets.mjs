#!/usr/bin/env node
/**
 * One visually unique WebP cover per blog slug — procedural art only (no shared photo bases).
 * Output: public/blog/covers/generated/{slug}.webp
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const BLOG_DIR = path.join(ROOT, "content/blog");
const OUT_DIR = path.join(ROOT, "public/blog/covers/generated");

const STATE_SLUGS =
  "texas|florida|california|ohio|georgia|illinois|pennsylvania|north-carolina|tennessee|arizona|nevada|colorado|michigan|new-york|new-jersey|massachusetts|virginia|washington|oregon|minnesota|wisconsin|indiana|missouri|alabama|louisiana|kentucky|oklahoma|connecticut|utah|iowa|arkansas|mississippi|kansas|nebraska|idaho|hawaii|maine|new-hampshire|rhode-island|montana|delaware|south-carolina|south-dakota|north-dakota|west-virginia|alaska|vermont|wyoming|district-of-columbia";

const TOPIC_RULES = [
  { test: /(18-wheeler|semi-truck|tractor-trailer|fmcsa|jackknife|truck-accident)/i, label: "Truck accident guide", icon: "🚛" },
  { test: /(wrongful-death|fatal|family-guide)/i, label: "Wrongful death guide", icon: "🕊" },
  { test: /(spinal|paralysis|herniated)/i, label: "Spinal injury guide", icon: "🦴" },
  { test: /(traumatic-brain|brain-injury|tbi|concussion|head-injury)/i, label: "Brain injury guide", icon: "🧠" },
  { test: /(whiplash|neck-injury|back-injury|soft-tissue)/i, label: "Whiplash guide", icon: "💢" },
  { test: /(catastrophic|severe-injury|critical-injury)/i, label: "Severe injury guide", icon: "⚠" },
  { test: /(rideshare|uber|lyft)/i, label: "Rideshare accident guide", icon: "🚗" },
  { test: /(motorcycle|motorbike|biker)/i, label: "Motorcycle crash guide", icon: "🏍" },
  { test: /(pedestrian|crosswalk|hit-by-car)/i, label: "Pedestrian accident guide", icon: "🚶" },
  { test: /(insurance|adjuster|claim|denied|recorded-statement)/i, label: "Insurance claim guide", icon: "📋" },
  { test: /(statute-of-limitations|deadline|time-limit|filing-window)/i, label: "Legal deadlines", icon: "⏱" },
  { test: /(what-to-do|first-steps|after-a-crash|after-a-car|on-scene)/i, label: "After a crash", icon: "✓" },
];

const PATTERN_TYPES = ["circles", "diagonal", "grid", "waves", "hex", "stripes", "dots", "arcs"];

function digest(slug) {
  return crypto.createHash("sha256").update(slug).digest();
}

function pick(buf, offset, mod) {
  return buf[offset % buf.length] % mod;
}

function pickF(buf, offset, min, max) {
  return min + (pick(buf, offset, 1000) / 1000) * (max - min);
}

function topicForSlug(slug) {
  for (const rule of TOPIC_RULES) {
    if (rule.test.test(slug)) return rule;
  }
  return { label: "Car accident victim guide", icon: "🛡" };
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
  const label = topicForSlug(slug).label;
  return label.length > 42 ? `${label.slice(0, 39)}…` : label;
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function patternSvg(buf, w, h) {
  const type = PATTERN_TYPES[pick(buf, 12, PATTERN_TYPES.length)];
  const stroke = `hsla(${pick(buf, 14, 360)},70%,72%,${pickF(buf, 15, 0.08, 0.22).toFixed(2)})`;
  const fill = `hsla(${pick(buf, 16, 360)},65%,58%,${pickF(buf, 17, 0.06, 0.18).toFixed(2)})`;
  const parts = [];

  if (type === "circles") {
    const n = 12 + pick(buf, 18, 18);
    for (let i = 0; i < n; i++) {
      const cx = pick(buf, 20 + i * 3, w);
      const cy = pick(buf, 21 + i * 3, h);
      const r = 8 + pick(buf, 22 + i * 3, 90);
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`);
    }
  } else if (type === "diagonal") {
    const n = 8 + pick(buf, 18, 12);
    for (let i = 0; i < n; i++) {
      const x = -200 + i * (w / n);
      parts.push(`<line x1="${x}" y1="0" x2="${x + h}" y2="${h}" stroke="${stroke}" stroke-width="${2 + pick(buf, 30 + i, 6)}"/>`);
    }
  } else if (type === "grid") {
    const step = 40 + pick(buf, 18, 50);
    for (let x = 0; x < w; x += step) {
      parts.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${stroke}" stroke-width="1"/>`);
    }
    for (let y = 0; y < h; y += step) {
      parts.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${stroke}" stroke-width="1"/>`);
    }
  } else if (type === "waves") {
    const y0 = 80 + pick(buf, 18, 400);
    const amp = 20 + pick(buf, 19, 60);
    let d = `M 0 ${y0}`;
    for (let x = 0; x <= w; x += 40) {
      d += ` Q ${x + 20} ${y0 + (x % 80 ? amp : -amp)} ${x + 40} ${y0}`;
    }
    parts.push(`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="3"/>`);
    parts.push(`<path d="${d} L ${w} ${h} L 0 ${h} Z" fill="${fill}"/>`);
  } else if (type === "hex") {
    const size = 28 + pick(buf, 18, 24);
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 14; col++) {
        const cx = col * size * 1.5 + (row % 2 ? size * 0.75 : 0);
        const cy = row * size * 0.86;
        parts.push(`<circle cx="${cx}" cy="${cy}" r="${size * 0.35}" fill="${fill}"/>`);
      }
    }
  } else if (type === "stripes") {
    const n = 10 + pick(buf, 18, 16);
    for (let i = 0; i < n; i++) {
      const y = (i * h) / n;
      parts.push(`<rect x="0" y="${y}" width="${w}" height="${h / n - 2}" fill="${i % 2 ? fill : "none"}" opacity="0.5"/>`);
    }
  } else if (type === "dots") {
    const step = 24 + pick(buf, 18, 20);
    for (let y = step; y < h; y += step) {
      for (let x = step; x < w; x += step) {
        if (pick(buf, x + y, 3) === 0) {
          parts.push(`<circle cx="${x}" cy="${y}" r="${2 + pick(buf, x, 4)}" fill="${stroke}"/>`);
        }
      }
    }
  } else {
    const n = 6 + pick(buf, 18, 8);
    for (let i = 0; i < n; i++) {
      const cx = pick(buf, 20 + i * 2, w);
      const cy = pick(buf, 21 + i * 2, h);
      const rx = 40 + pick(buf, 22 + i * 2, 180);
      parts.push(`<path d="M ${cx - rx} ${cy} A ${rx} ${rx} 0 0 1 ${cx + rx} ${cy}" fill="none" stroke="${stroke}" stroke-width="2"/>`);
    }
  }

  return parts.join("\n");
}

function coverSvg(slug, buf) {
  const topic = topicForSlug(slug);
  const headline = escapeXml(headlineForSlug(slug));
  const sub = escapeXml(topic.label);
  const icon = topic.icon;
  const h1 = pick(buf, 0, 360);
  const h2 = (h1 + 35 + pick(buf, 1, 120)) % 360;
  const h3 = (h2 + 45 + pick(buf, 2, 100)) % 360;
  const angle = 100 + pick(buf, 3, 160);
  const barW = 420 + pick(buf, 4, 480);
  const barY = 400 + pick(buf, 5, 80);
  const titleSize = 38 + pick(buf, 6, 14);
  const slugHash = crypto.createHash("md5").update(slug).digest("hex").slice(0, 10);
  const badgeX = 900 + pick(buf, 7, 200);

  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(${h1},58%,${14 + pick(buf, 8, 12)}%)"/>
      <stop offset="55%" stop-color="hsl(${h2},52%,${10 + pick(buf, 9, 10)}%)"/>
      <stop offset="100%" stop-color="hsl(${h3},48%,${8 + pick(buf, 10, 8)}%)"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.06)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.55)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g transform="rotate(${angle - 130} 600 315)">${patternSvg(buf, 1200, 630)}</g>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <text x="56" y="72" fill="#fca5a5" font-family="system-ui,sans-serif" font-size="17" font-weight="800" letter-spacing="0.16em">WRECKMATCH</text>
  <text x="${badgeX}" y="72" font-size="42" font-family="system-ui">${icon}</text>
  <rect x="48" y="${barY}" width="${barW}" height="6" fill="hsl(${h2},78%,52%)" rx="3"/>
  <text x="56" y="${barY + 58}" fill="#ffffff" font-family="system-ui,sans-serif" font-size="${titleSize}" font-weight="800">${headline}</text>
  <text x="56" y="${barY + 98}" fill="#a7f3d0" font-family="system-ui,sans-serif" font-size="22" font-weight="600">${sub}</text>
  <text x="56" y="598" fill="#6b7280" font-family="ui-monospace,monospace" font-size="13">${slugHash}</text>
  <text x="900" y="598" fill="#6b7280" font-family="system-ui,sans-serif" font-size="13" text-anchor="end">Educational only</text>
</svg>`);
}

function slugsFromBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")).sort();
}

async function renderCover(slug) {
  const buf = digest(slug);
  const svg = coverSvg(slug, buf);
  await sharp(svg).webp({ quality: 82, effort: 4 }).toFile(path.join(OUT_DIR, `${slug}.webp`));
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

const slugs = slugsFromBlogDir();
let written = 0;
for (const slug of slugs) {
  await renderCover(slug);
  written++;
  if (written % 25 === 0) console.log(`  ${written}/${slugs.length}…`);
}
console.log(`Wrote ${written} procedural unique WebP covers to ${OUT_DIR}`);

const paths = slugs.map((s) => `/blog/covers/generated/${s}.webp`);
if (new Set(paths).size !== paths.length) {
  console.error("ERROR: duplicate cover paths");
  process.exit(1);
}

// Visual uniqueness check: reject if any two covers share identical file hash
const hashes = new Map();
for (const slug of slugs) {
  const data = fs.readFileSync(path.join(OUT_DIR, `${slug}.webp`));
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  if (hashes.has(hash)) {
    console.error(`ERROR: identical cover bytes for ${slug} and ${hashes.get(hash)}`);
    process.exit(1);
  }
  hashes.set(hash, slug);
}
console.log(`Verified ${hashes.size} unique cover images (byte-level)`);
