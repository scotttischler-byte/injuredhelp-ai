#!/usr/bin/env node
/**
 * Quick GEO audit for a live URL (fetch HTML, heuristic score).
 * Usage: node scripts/geo-audit-url.mjs https://www.wreckmatch.com/blog/some-slug
 */
const url = process.argv[2];
if (!url) {
  console.error("Usage: node scripts/geo-audit-url.mjs <url>");
  process.exit(1);
}

const res = await fetch(url, { headers: { "User-Agent": "WreckMatch-GEO-Audit/1.0" } });
const html = await res.text();

const checks = {
  robotsAllowsAiCrawlers: true,
  llmsTxt: false,
  aiTxt: false,
  articleJsonLd: /"@type"\s*:\s*"Article"/i.test(html) || /itemtype="https:\/\/schema.org\/Article"/i.test(html),
  faqPageJsonLd: /"@type"\s*:\s*"FAQPage"/i.test(html),
  semanticArticleDom: /<article[\s>]/i.test(html),
  faqDetailsOrHeadings: /<details[\s>]/i.test(html) || /Frequently asked questions/i.test(html),
  hasComparisonTable: /<table[\s>]/i.test(html),
  authorByline: /itemprop="author"|About the author|AuthorByline/i.test(html),
  contentDateRecent: /2026/.test(html),
  wordCount: html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length,
};

try {
  const origin = new URL(url).origin;
  const [llms, ai, robots] = await Promise.all([
    fetch(`${origin}/llms.txt`).then((r) => r.ok),
    fetch(`${origin}/ai.txt`).then((r) => r.ok),
    fetch(`${origin}/robots.txt`).then((r) => r.text()),
  ]);
  checks.llmsTxt = llms;
  checks.aiTxt = ai;
  checks.robotsAllowsAiCrawlers = /GPTBot|PerplexityBot|ClaudeBot/i.test(robots) && !/Disallow:\s*\/\s*$/m.test(robots);
} catch {
  /* ignore */
}

let score = 0;
const max = 100;
const parts = [];
if (checks.robotsAllowsAiCrawlers) { score += 12; parts.push("robots +12"); }
if (checks.llmsTxt) { score += 8; parts.push("llms +8"); }
if (checks.articleJsonLd) { score += 12; parts.push("article LD +12"); }
if (checks.faqPageJsonLd) { score += 10; parts.push("faq LD +10"); }
if (checks.semanticArticleDom) { score += 10; parts.push("article DOM +10"); }
if (checks.faqDetailsOrHeadings) { score += 8; parts.push("faq UI +8"); }
if (checks.hasComparisonTable) { score += 7; parts.push("table +7"); }
if (checks.authorByline) { score += 6; parts.push("author +6"); }
if (checks.contentDateRecent) { score += 6; parts.push("2026 date +6"); }
if (checks.wordCount >= 3000) { score += 10; parts.push("words +10"); }
else if (checks.wordCount >= 2000) { score += 8; parts.push("words +8"); }
else if (checks.wordCount >= 1200) { score += 5; parts.push("words +5"); }

const grade = score >= 90 ? "A" : score >= 78 ? "B" : score >= 65 ? "C" : score >= 50 ? "D" : "F";
console.log(JSON.stringify({ url, score, grade, wordCount: checks.wordCount, breakdown: parts, checks }, null, 2));
