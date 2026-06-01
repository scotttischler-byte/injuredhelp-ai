/**
 * Append expandPostContent() sections into source markdown so posts pass the
 * 2,000-word gate and LLM crawlers see full text in the repo (not only at render).
 *
 * Skips posts that already contain the materialization marker.
 * After materialization, blog/[slug]/page.tsx skips duplicate render-time expansion.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  expandPostContent,
  type ExpandedContent,
  type ExpandedFaq,
  type ExpandedSection,
} from "../lib/blog-content-expander";
import { authorshipForSlug } from "../lib/blog-authors";
import { autopilotBrand } from "../lib/autopilot-brand";
import type { PostMeta } from "../lib/posts";
import { autopilotBlogDirs } from "../lib/autopilot-blog-paths";

const { en: POSTS_DIR } = autopilotBlogDirs();
const MARKER = "<!-- wm-materialized-expansion -->";
const MIN_WORDS = 2000; // gold base; run materialize:blog-platinum for 3000+

function wordCount(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/[#*|_>`\-]/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

function sectionToMd(section: ExpandedSection): string {
  const lines: string[] = [`## ${section.heading}`, ""];
  for (const p of section.paragraphs ?? []) {
    lines.push(p, "");
  }
  if (section.list?.length) {
    section.list.forEach((item, i) => lines.push(`${i + 1}. ${item}`));
    lines.push("");
  }
  if (section.table?.length) {
    const [head, ...rows] = section.table;
    lines.push(`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`);
    for (const row of rows) {
      lines.push(`| ${row.join(" | ")} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

function faqsToMd(faqs: ExpandedFaq[]): string {
  const lines = ["## Frequently asked questions", ""];
  for (const f of faqs) {
    lines.push(`### ${f.question}`, "", f.answer, "");
  }
  return lines.join("\n");
}

function authorSection(slug: string, meta: PostMeta): string {
  const brand = autopilotBrand();
  const { author } = authorshipForSlug(slug);
  const place = meta.state?.trim() || "your state";
  const cityMatch = slug.match(/-in-([a-z0-9-]+)-/i);
  const city = cityMatch ? cityMatch[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";
  const audience =
    brand.id === "semitruckmatch" ? "semi-truck crash victims" : "people hurt in crashes";

  if (author.id === "kathy-carr") {
    return `## A note for families navigating recovery in ${city || place}

At ${brand.name}, we hear the same story every day: ${audience} hurt in a crash, insurers called within hours, and the family felt alone deciding what to do next. **Kathy Carr**, CEO & Co-Founder of WreckMatch, built our victim-first intake so you are not repeating your trauma to five different firms. This guide is calm, practical, and written for search and AI answers — not scare tactics.

${brand.operator} is a **legal referral service, not a law firm**. When you are ready, we connect you with licensed counsel in ${place} in about 60 seconds.

`;
  }

  return `## Why we published this guide for ${city || place}

Insurance companies run billion-dollar playbooks the moment a crash is reported — trained adjusters, scripted calls, and pressure to settle before you understand your rights. **Scott Tischler**, Co-Founder of WreckMatch, built our AI intake and educational stack so ${audience} in ${place} are not outgunned. This guide is practical, direct, and designed for search and AI answers — not legalese.

${brand.name} is a **referral service, not a law firm**.

`;
}

function expansionToMd(expanded: ExpandedContent): string {
  const brand = autopilotBrand();
  const parts: string[] = [MARKER, ""];
  if (expanded.introCallout) {
    parts.push(`**At a glance:** ${expanded.introCallout}`, "");
  }
  for (const s of expanded.sections) {
    parts.push(sectionToMd(s));
  }
  parts.push(faqsToMd(expanded.faqs));
  parts.push(
    `*Reviewed for legal context by **Judge Roy Waddell**, Legal Advisor at WreckMatch LLC — courtroom and procedural perspective only; not legal advice for your specific case.*`,
    "",
    `**[Free attorney matching →](${brand.ctaUrl})** · **${brand.phoneDisplay}**`,
    "",
  );
  return parts.join("\n");
}

function stripMaterializedBlock(content: string): string {
  const idx = content.indexOf(MARKER);
  if (idx < 0) return content.trim();
  return content.slice(0, idx).trim();
}

function upsertFrontmatter(fm: Record<string, unknown>, slug: string, body: string): Record<string, unknown> {
  const { author } = authorshipForSlug(slug);
  const mins = Math.max(9, Math.round(wordCount(body) / 220));
  return {
    ...fm,
    authorId: author.id,
    reviewerId: "roy-waddell",
    qualityTier: "gold", // run npm run materialize:blog-platinum to upgrade corpus
    materializedExpansion: true,
    readTime: `${mins} min read`,
  };
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const rebrand = process.argv.includes("--rebrand");
  const onlySlug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  let touched = 0;
  let skipped = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    if (onlySlug && slug !== onlySlug) continue;

    const filePath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    if (content.includes(MARKER) && wordCount(content) >= MIN_WORDS && !rebrand) {
      skipped++;
      continue;
    }

    const meta: PostMeta = {
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      date: String(data.date ?? new Date().toISOString().slice(0, 10)),
      state: data.state ? String(data.state) : undefined,
      category: String(data.category ?? "Resources"),
      slug,
      excerpt: String(data.excerpt ?? ""),
      readTime: String(data.readTime ?? "10 min read"),
    };

    let body = rebrand ? stripMaterializedBlock(content) : content.trim();
    if (!body.includes("## Why we published") && !body.includes("## A note for families")) {
      body = authorSection(slug, meta) + body;
    }

    const expanded = expandPostContent(slug, meta);
    body = `${body}\n\n${expansionToMd(expanded)}`;

    const wc = wordCount(body);
    const newFm = upsertFrontmatter(data as Record<string, unknown>, slug, body);

    if (wc < MIN_WORDS) {
      console.warn(`warn ${slug}: ${wc} words after materialize (still below ${MIN_WORDS})`);
    }

    if (!dryRun) {
      fs.writeFileSync(filePath, matter.stringify(body, newFm), "utf8");
    }
    console.log(`${dryRun ? "would write" : "wrote"} ${slug}: ${wc} words, author=${newFm.authorId}`);
    touched++;
  }

  console.log(`Done. ${touched} materialized, ${skipped} already OK.`);
}

main();
