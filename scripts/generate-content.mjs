#!/usr/bin/env node
/**
 * LLM content pipeline for WreckMatch geo pages and blog posts.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-content.mjs blog "Title here"
 *   OPENAI_API_KEY=sk-... node scripts/generate-content.mjs geo "Chicago" "Illinois"
 *
 * Outputs markdown to content/blog/ or content/geo-drafts/ for review before commit.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const apiKey = process.env.OPENAI_API_KEY?.trim();
if (!apiKey) {
  console.error("Set OPENAI_API_KEY to generate content.");
  process.exit(1);
}

const [, , mode, ...args] = process.argv;
if (!mode || !["blog", "geo"].includes(mode)) {
  console.error("Usage: node scripts/generate-content.mjs blog|geo <args...>");
  process.exit(1);
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function chat(prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write SEO content for WreckMatch. Use this disclaimer: WreckMatch connects accident victims with experienced personal injury attorneys in their state at no upfront cost. We are a legal referral service operated by WreckMatch LLC — not a law firm — and we do not provide legal advice. Include CTA to (978) 515-6063 and /#form. No guaranteed outcomes.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

if (mode === "blog") {
  const title = args.join(" ") || "Car Accident Legal Help Update";
  const slug = slugify(title);
  const prompt = `Write a markdown blog post with YAML frontmatter (title, description, date: ${new Date().toISOString().slice(0, 10)}, category, excerpt). Title: ${title}. 800-1200 words. End with CTA.`;
  const body = await chat(prompt);
  const outDir = path.join(ROOT, "content/blog");
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${slug}.md`);
  fs.writeFileSync(file, body.trim() + "\n");
  console.log(`Wrote ${file}`);
} else {
  const [city, state] = args;
  if (!city || !state) {
    console.error("Usage: node scripts/generate-content.mjs geo <City> <State>");
    process.exit(1);
  }
  const prompt = `Write a unique geo landing page draft (markdown sections only) for car accident help in ${city}, ${state}. Include: local crash types, statute of limitations note, settlement range disclaimer, hospitals/courts generic note, 5 FAQs, keywords: ${city} car accident lawyer.`;
  const body = await chat(prompt);
  const outDir = path.join(ROOT, "content/geo-drafts");
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${slugify(city)}-${slugify(state)}.md`);
  fs.writeFileSync(file, body.trim() + "\n");
  console.log(`Wrote ${file} — merge into lib/geo-content or GeoHubContent after review.`);
}
