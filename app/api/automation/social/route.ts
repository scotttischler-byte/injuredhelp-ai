import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { verifyCronSecret } from "@/lib/automation-auth";
import { getLatestQueuedContent, insertSocialPost, logAutomation } from "@/lib/db";

const PLATFORMS = ["twitter", "facebook", "pinterest", "linkedin"] as const;

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const summary: Record<string, string> = {};

  const items = await getLatestQueuedContent(2);
  if (items.length === 0) {
    summary.note = "no_content";
    await logAutomation("social", "cron", "skipped", summary);
    return NextResponse.json({ ok: true, summary });
  }

  for (const item of items) {
    const excerpt = (item.generated_content ?? item.topic).slice(0, 200);
    for (const platform of PLATFORMS) {
      let prompt = "";
      if (platform === "twitter") {
        prompt = `Write a tweet (max 280 chars) about this car accident topic.\nTopic: ${item.topic}\nExcerpt: ${excerpt}\nEnd with WreckMatch.com or (978) 515-6063`;
      } else if (platform === "facebook") {
        prompt = `Write a Facebook post (150-300 words) about this car accident topic.\nTopic: ${item.topic}\nExcerpt: ${excerpt}\nInclude phone (978) 515-6063 and WreckMatch.com and a question.`;
      } else if (platform === "pinterest") {
        prompt = `Write a Pinterest pin description (100-150 words), SEO-focused.\nTopic: ${item.topic}\nInclude AccidentSurvivalGuide.com and WreckMatch.com.`;
      } else {
        prompt = `Write a professional LinkedIn post about this car accident legal topic for legal/insurance professionals.\nTopic: ${item.topic}\nMention WreckMatch as attorney matching.`;
      }

      let text = "";
      try {
        text = await callClaude({
          system: "Write the final post text only.",
          messages: [{ role: "user", content: prompt }],
          maxTokens: 700,
        });
      } catch {
        text = "";
      }

      await insertSocialPost({
        platform,
        content: text || "(generation failed)",
        source_slug: String(item.id),
        status: "skipped_no_credentials",
        post_url: null,
      });
    }
  }

  summary.note = "generated_and_logged";
  await logAutomation("social", "cron", "success", summary);
  return NextResponse.json({ ok: true, summary });
}
