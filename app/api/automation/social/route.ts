import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { verifyCronSecret } from "@/lib/automation-auth";
import { getLatestQueuedContent, insertSocialPost, logAutomation } from "@/lib/db";
import { readLatestSyndication } from "@/lib/syndication-latest";

const PLATFORMS = ["twitter", "facebook", "pinterest", "linkedin"] as const;

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const summary: Record<string, string> = {};
  if (!process.env.DATABASE_URL?.trim()) {
    summary.db = "skipped_no_database";
  }
  const syndication = readLatestSyndication();

  const items = await getLatestQueuedContent(2);
  const topic = syndication?.title ?? items[0]?.topic ?? "Car accident legal help";
  const excerpt =
    syndication?.reddit_body?.slice(0, 400) ??
    (items[0]?.generated_content ?? items[0]?.topic ?? topic).slice(0, 400);
  const blogUrl = syndication?.url ?? "https://www.wreckmatch.com/blog";
  const vertical = syndication?.vertical ?? "auto";

  if (items.length === 0 && !syndication) {
    summary.note = "no_content";
    await logAutomation("social", "cron", "skipped", summary);
    return NextResponse.json({ ok: true, summary });
  }

  const prewritten: Partial<Record<(typeof PLATFORMS)[number], string>> = {
    twitter: syndication?.twitter,
    facebook: syndication?.facebook,
    linkedin: syndication?.linkedin,
  };

  for (const platform of PLATFORMS) {
    let text = prewritten[platform] ?? "";

    if (!text) {
      let prompt = "";
      const focus =
        vertical === "truck"
          ? "semi truck / 18-wheeler / commercial vehicle crash"
          : vertical === "severe"
            ? "severe or catastrophic car accident injury"
            : "car accident";

      if (platform === "twitter") {
        prompt = `Write a tweet (max 270 chars) about ${focus}.\nTopic: ${topic}\nLink: ${blogUrl}\nMention 800+ attorney network. Phone (978) 515-6063. WreckMatch.com`;
      } else if (platform === "facebook") {
        prompt = `Write a Facebook post (150-300 words) about ${focus}.\nTopic: ${topic}\nExcerpt: ${excerpt}\nInclude phone, WreckMatch.com/#form, empathetic tone.`;
      } else if (platform === "pinterest") {
        prompt = `Write a Pinterest pin description (100-150 words), SEO for ${focus}.\nTopic: ${topic}\nLink WreckMatch.com`;
      } else {
        prompt = `Write a LinkedIn post about ${focus} for legal/insurance audience.\nTopic: ${topic}\nWreckMatch matches victims with 800+ participating law firms. Not a law firm.`;
      }

      try {
        text = await callClaude({
          system: "Write the final post text only. Educational, not legal advice.",
          messages: [{ role: "user", content: prompt }],
          maxTokens: 700,
        });
      } catch {
        text = "";
      }
    }

    await insertSocialPost({
      platform,
      content: text || "(generation failed)",
      source_slug: syndication?.slug ?? String(items[0]?.id ?? "syndication"),
      status: "skipped_no_credentials",
      post_url: null,
    });
  }

  summary.note = syndication ? "syndication_file" : "generated_and_logged";
  summary.vertical = vertical;
  await logAutomation("social", "cron", "success", summary);
  return NextResponse.json({ ok: true, summary, syndication: !!syndication });
}
