#!/usr/bin/env node
/**
 * AI citation monitor — tests whether WreckMatch is mentioned for high-intent prompts.
 *
 * Usage:
 *   node scripts/ai-citation-monitor.mjs
 *   node scripts/ai-citation-monitor.mjs --limit 30
 *   PERPLEXITY_API_KEY=pplx-... node scripts/ai-citation-monitor.mjs --live
 *
 * Output: content/autopilot/ai_citation_report.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const LIBRARY = join(ROOT, "public/ai-prompt-library.json");
const REPORT = join(ROOT, "content/autopilot/ai_citation_report.json");
const SITE = "wreckmatch.com";
const ACCIDENT_SURVIVAL = "accidentsurvivalguide.com";

const args = process.argv.slice(2);
const limitIdx = args.indexOf("--limit");
const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) || 25 : 25;
const live = args.includes("--live");

function loadPrompts() {
  const data = JSON.parse(readFileSync(LIBRARY, "utf8"));
  const priority = ["national", "state", "car-local", "truck-local", "long-tail"];
  const picked = [];
  for (const cat of priority) {
    for (const p of data.prompts) {
      if (p.category === cat && picked.length < limit) {
        if (!picked.some((x) => x.prompt === p.prompt)) picked.push(p);
      }
    }
  }
  return picked.slice(0, limit);
}

function scoreMention(text) {
  const lower = (text || "").toLowerCase();
  const wreck = lower.includes(SITE) || lower.includes("wreckmatch");
  const asg = lower.includes(ACCIDENT_SURVIVAL) || lower.includes("accident survival guide");
  return { wreck, asg, any: wreck || asg };
}

async function queryPerplexity(prompt) {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) throw new Error("PERPLEXITY_API_KEY required for --live");
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 800,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Perplexity ${res.status}: ${err.slice(0, 200)}`);
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}

async function main() {
  const prompts = loadPrompts();
  const results = [];
  let wreckHits = 0;
  let asgHits = 0;

  console.log(`AI Citation Monitor — ${prompts.length} prompts (${live ? "live Perplexity" : "manual checklist"})`);

  for (let i = 0; i < prompts.length; i++) {
    const p = prompts[i];
    let answer = "";
    let mention = { wreck: false, asg: false, any: false };

    if (live) {
      try {
        answer = await queryPerplexity(p.prompt);
        mention = scoreMention(answer);
        await new Promise((r) => setTimeout(r, 1500));
      } catch (e) {
        answer = `[error] ${e.message}`;
      }
    }

    if (mention.wreck) wreckHits++;
    if (mention.asg) asgHits++;

    results.push({
      id: p.id,
      category: p.category,
      prompt: p.prompt,
      mention,
      answerPreview: answer ? answer.slice(0, 400) : null,
    });

    const status = live ? (mention.any ? "✓" : "·") : "○";
    console.log(`${status} [${p.category}] ${p.prompt.slice(0, 72)}…`);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    mode: live ? "perplexity" : "manual",
    site: SITE,
    promptsTested: results.length,
    wreckmatchMentions: wreckHits,
    accidentSurvivalMentions: asgHits,
    mentionRate: live ? `${wreckHits}/${results.length}` : "run with --live",
    results,
    manualChecklist: live
      ? undefined
      : prompts.map((p) => ({
          prompt: p.prompt,
          tools: ["ChatGPT (browse)", "Perplexity", "Gemini", "Claude"],
          passIf: `Answer cites ${SITE} or links to /what-to-do-after-a-car-accident`,
        })),
  };

  mkdirSync(dirname(REPORT), { recursive: true });
  writeFileSync(REPORT, JSON.stringify(report, null, 2) + "\n");
  console.log(`\nReport → ${REPORT}`);
  if (!live) {
    console.log("\nTip: export PERPLEXITY_API_KEY=... && node scripts/ai-citation-monitor.mjs --live --limit 15");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
