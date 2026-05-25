#!/usr/bin/env node
/** Quick production audit for wreckmatch.com — no secrets. */
import { execSync } from "node:child_process";

const BASE = process.env.SITE || "https://www.wreckmatch.com";
const PATHS = [
  "/",
  "/blog",
  "/blog/page/19",
  "/blog/wrongful-death-car-accident-in-columbus-ohio-family-guide",
  "/what-to-do-after-a-car-accident",
  "/car-accident-help-texas",
  "/car-accident-help-houston",
  "/#form",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/leadership",
];

function curl(path) {
  const url = `${BASE}${path}`;
  try {
    const out = execSync(
      `curl -sS -o /dev/null -w "%{http_code} %{time_total} %{size_download}" --max-time 45 "${url}"`,
      { encoding: "utf8" },
    ).trim();
    const [code, time, size] = out.split(" ");
    return { url, ok: code === "200" || code === "308", code, time: Number(time), size: Number(size) };
  } catch (e) {
    return { url, ok: false, code: "ERR", time: 99, size: 0, err: String(e.message || e) };
  }
}

const results = PATHS.map(curl);
const fails = results.filter((r) => !r.ok || r.time > 10);
const slow = results.filter((r) => r.ok && r.time > 2);
const avg = results.filter((r) => r.ok).reduce((s, r) => s + r.time, 0) / Math.max(1, results.filter((r) => r.ok).length);

let score = 100;
if (fails.length) score -= fails.length * 15;
if (slow.length) score -= slow.length * 5;
score = Math.max(0, Math.min(100, score));

console.log(JSON.stringify({ base: BASE, results, fails: fails.length, slow: slow.length, avgSec: avg.toFixed(2), score }, null, 2));
