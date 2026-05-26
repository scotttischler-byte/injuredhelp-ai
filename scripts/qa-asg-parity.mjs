#!/usr/bin/env node
/** QA + grade for ASG-parity / E-E-A-T rollout */
import { execSync } from "node:child_process";

const base = process.argv[2] || "https://www.wreckmatch.com";
const label = process.argv[3] || "production";

function fetch(path, opts = {}) {
  const url = `${base}${path}`;
  try {
    const body = opts.bodyOnly
      ? execSync(`curl -sS --max-time 45 "${url}"`, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 })
      : null;
    const meta = execSync(
      `curl -sS -o ${opts.bodyOnly ? "/dev/null" : "/tmp/qa-body"} -w "%{http_code}|%{time_total}|%{size_download}" --max-time 45 "${url}"`,
      { encoding: "utf8" },
    ).trim();
    const [code, time, size] = meta.split("|");
    const html = opts.bodyOnly ? body : execSync(`cat /tmp/qa-body`, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
    return { url, code, time: Number(time), size: Number(size), html, ok: code === "200" };
  } catch (e) {
    return { url, code: "ERR", time: 99, size: 0, html: "", ok: false, err: String(e.message || e) };
  }
}

function fetchText(path) {
  const r = fetch(path, { bodyOnly: true });
  return { ...r, text: r.html || "" };
}

const checks = [];

function add(id, name, points, pass, detail) {
  checks.push({ id, name, points, pass, detail, lost: pass ? 0 : points });
}

// --- HTTP health ---
const httpPaths = [
  "/",
  "/blog",
  "/blog/wrongful-death-car-accident-in-columbus-ohio-family-guide",
  "/states",
  "/resources",
  "/leadership",
  "/about-scott-tischler",
  "/about-kathy-carr",
  "/about-roy-waddell",
  "/llms.txt",
  "/llms-full.txt",
  "/ai.txt",
  "/about-scott-tischler/profile.txt",
  "/about-roy-waddell/profile.txt",
  "/car-accident-help-texas",
  "/car-accident-help-houston",
  "/what-to-do-after-a-car-accident",
  "/sitemap.xml",
];

const httpResults = httpPaths.map((p) => fetch(p));
const httpFail = httpResults.filter((r) => !r.ok);
const avgTime =
  httpResults.filter((r) => r.ok).reduce((s, r) => s + r.time, 0) /
  Math.max(1, httpResults.filter((r) => r.ok).length);

add(
  "http-core",
  "Core pages HTTP 200",
  12,
  httpFail.filter((r) => !["/llms-full.txt", "/about-scott-tischler/profile.txt", "/about-roy-waddell/profile.txt"].includes(r.url.replace(base, ""))).length === 0,
  httpFail.length ? `Failed: ${httpFail.map((r) => r.url.replace(base, "") + "=" + r.code).join(", ")}` : `All core OK, avg ${avgTime.toFixed(2)}s`,
);

add(
  "http-llms-full",
  "llms-full.txt live",
  6,
  httpResults.find((r) => r.url.endsWith("/llms-full.txt"))?.ok,
  httpResults.find((r) => r.url.endsWith("/llms-full.txt"))?.code || "missing",
);

add(
  "http-profile",
  "profile.txt routes live",
  6,
  httpResults.find((r) => r.url.includes("/about-scott-tischler/profile.txt"))?.ok &&
    httpResults.find((r) => r.url.includes("/about-roy-waddell/profile.txt"))?.ok,
  "Scott + Roy profile.txt",
);

add("perf", "No page >3s (sample)", 8, httpResults.every((r) => r.ok && r.time < 3), `max ${Math.max(...httpResults.map((r) => r.time)).toFixed(2)}s`);

// --- Feature markers ---
const states = httpResults.find((r) => r.url.endsWith("/states"));
add(
  "states-rc",
  "State→city resource center UI",
  14,
  states?.html?.includes("State &amp; city resource center") || states?.html?.includes("State & city resource center"),
  states?.html?.includes("Car accident help by state") ? "OLD flat states page" : "NEW resource center",
);

const resources = httpResults.find((r) => r.url.endsWith("/resources"));
add(
  "resources-link",
  "Resources links to /states",
  4,
  resources?.html?.includes('href="/states"'),
  resources?.html?.includes("/states") ? "linked" : "missing",
);

const blog = httpResults.find((r) => r.url.endsWith("/blog"));
const blogHasAuthorImg =
  blog?.html?.includes("/team/scott-tischler") ||
  blog?.html?.includes("/team/kathy-carr") ||
  blog?.html?.includes("rounded-full object-cover");
add("blog-card-photo", "Blog index author photos", 10, !!blogHasAuthorImg, blogHasAuthorImg ? "team images on cards" : "text-only bylines");

const post = fetch("/blog/wrongful-death-car-accident-in-columbus-ohio-family-guide");
add(
  "post-byline",
  "Article AuthorByline + Roy",
  8,
  post.html?.includes("Reviewed for legal context") && post.html?.includes("roy-waddell"),
  post.html?.includes("Author") ? "byline present" : "missing",
);

const aiTxt = fetchText("/ai.txt");
add(
  "ai-roy",
  "Roy in ai.txt people block",
  6,
  aiTxt.text.includes("roy-waddell") && (aiTxt.text.includes("profile.txt") || aiTxt.text.includes("llms-full")),
  aiTxt.text.includes("roy-waddell") ? "Roy listed" : "Roy missing",
);

const llms = fetchText("/llms.txt");
add(
  "llms-eeat",
  "llms.txt E-E-A-T + /states",
  6,
  llms.text.includes("about-roy-waddell") && llms.text.includes("/states"),
  llms.text.includes("profile.txt") ? "profile links" : "no profile.txt in llms",
);

const llmsFull = fetchText("/llms-full.txt");
add(
  "llms-full-content",
  "llms-full geo index",
  6,
  llmsFull.ok && llmsFull.text.includes("Complete geo hub index"),
  llmsFull.ok ? `${(llmsFull.text.match(/car-accident-help/g) || []).length} hub refs` : "404",
);

const scottProfile = fetchText("/about-scott-tischler/profile.txt");
add(
  "profile-scott",
  "Scott profile.txt substance",
  5,
  scottProfile.ok && scottProfile.text.includes("Scott Tischler") && scottProfile.text.includes("WreckMatch"),
  scottProfile.code,
);

const sitemap = fetchText("/sitemap.xml");
add(
  "sitemap-people",
  "Sitemap: leadership + Roy + states",
  5,
  sitemap.text.includes("/leadership") &&
    sitemap.text.includes("/about-roy-waddell") &&
    sitemap.text.includes("/states"),
  [
    sitemap.text.includes("/leadership") ? "leadership" : "no leadership",
    sitemap.text.includes("/about-roy-waddell") ? "roy" : "no roy",
    sitemap.text.includes("/states") ? "states" : "no states",
  ].join(", "),
);

// Blog covers unique sample
const blogHtml = blog?.html || "";
const coverMatches = [...blogHtml.matchAll(/\/blog\/covers\/generated\/([a-z0-9-]+)\.webp/g)].map((m) => m[1]);
const uniqueCovers = new Set(coverMatches);
add(
  "blog-covers",
  "Blog index unique WebP covers (sample page)",
  4,
  coverMatches.length >= 3 && uniqueCovers.size === coverMatches.length,
  `${coverMatches.length} covers, ${uniqueCovers.size} unique on page 1`,
);

const totalPoints = checks.reduce((s, c) => s + c.points, 0);
const lost = checks.reduce((s, c) => s + c.lost, 0);
const score = Math.round(100 * (1 - lost / totalPoints));

const report = {
  label,
  base,
  score,
  totalPoints,
  lost,
  avgSec: avgTime.toFixed(2),
  checks: checks.map(({ id, name, points, pass, detail, lost }) => ({ id, name, points, pass, detail, lost })),
};

console.log(JSON.stringify(report, null, 2));
