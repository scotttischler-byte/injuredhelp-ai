/**
 * Upgrade gold materialized posts to platinum (3,000+ words, extra sections).
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  PLATINUM_MARKER,
  expandPostContentPlatinum,
} from "../lib/blog-content-expander-platinum";
import type { PostMeta } from "../lib/posts";
import type { ExpandedFaq, ExpandedSection } from "../lib/blog-content-expander";
import { autopilotBlogDirs, autopilotSiteUrl } from "../lib/autopilot-blog-paths";

const { en: POSTS_DIR } = autopilotBlogDirs();
const SITE_URL = autopilotSiteUrl();
const GOLD_MARKER = "<!-- wm-materialized-expansion -->";
const MIN_WORDS = 3000;

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
  for (const p of section.paragraphs ?? []) lines.push(p, "");
  if (section.list?.length) {
    section.list.forEach((item, i) => lines.push(`${i + 1}. ${item}`));
    lines.push("");
  }
  if (section.table?.length) {
    const [head, ...rows] = section.table;
    lines.push(`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`);
    for (const row of rows) lines.push(`| ${row.join(" | ")} |`);
    lines.push("");
  }
  return lines.join("\n");
}

function faqsToMd(faqs: ExpandedFaq[]): string {
  if (!faqs.length) return "";
  const lines = ["## Frequently asked questions (extended)", ""];
  for (const f of faqs) {
    lines.push(`### ${f.question}`, "", f.answer, "");
  }
  return lines.join("\n");
}

function platinumToMd(expanded: ReturnType<typeof expandPostContentPlatinum>): string {
  const parts: string[] = [PLATINUM_MARKER, ""];
  for (const s of expanded.sections) parts.push(sectionToMd(s));
  parts.push(faqsToMd(expanded.faqs));
  parts.push(
    "*Platinum-tier guide — expanded for AI citation and victim education. Reviewed for legal context by **Judge Roy Waddell**.*",
    "",
    `**[Free attorney matching →](${SITE_URL}/#form)** · **855 WRECKMATCH (855) 897-3256**`,
    "",
  );
  return parts.join("\n");
}

function main() {
  const onlySlug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const force = process.argv.includes("--force");
  let touched = 0;

  for (const file of fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"))) {
    const slug = file.replace(/\.md$/, "");
    if (onlySlug && slug !== onlySlug) continue;

    const filePath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const wc = wordCount(content);

    if (!force && content.includes(PLATINUM_MARKER) && wc >= MIN_WORDS) continue;

    const meta: PostMeta = {
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      date: String(data.date ?? new Date().toISOString().slice(0, 10)),
      state: data.state ? String(data.state) : undefined,
      category: String(data.category ?? "Resources"),
      slug,
      excerpt: String(data.excerpt ?? ""),
      readTime: String(data.readTime ?? "12 min read"),
    };

    let body = content.trim();
    if (!body.includes(GOLD_MARKER) && !body.includes(PLATINUM_MARKER)) {
      console.warn(`skip ${slug}: not gold-materialized yet`);
      continue;
    }
    if (!body.includes(PLATINUM_MARKER)) {
      body = `${body}\n\n${platinumToMd(expandPostContentPlatinum(slug, meta))}`;
    }

    const finalWc = wordCount(body);
    const fm = {
      ...data,
      qualityTier: "platinum",
      materializedExpansion: true,
      platinumExpansion: true,
      readTime: `${Math.max(12, Math.round(finalWc / 220))} min read`,
      date: data.date ?? new Date().toISOString().slice(0, 10),
    };

    fs.writeFileSync(filePath, matter.stringify(body, fm), "utf8");
    console.log(`platinum ${slug}: ${finalWc} words`);
    touched++;
  }
  console.log(`Done. ${touched} posts upgraded to platinum.`);
}

main();
