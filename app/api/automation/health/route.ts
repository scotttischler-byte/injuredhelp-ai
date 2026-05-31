import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/automation-auth";
import { getAllPosts } from "@/lib/posts";
import { isValidIndexNowKey } from "@/lib/indexnow";
import fs from "fs";
import path from "path";

/** Daily automation health snapshot (Vercel cron or manual with CRON_SECRET). */
export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const indexNowKey = process.env.INDEXNOW_KEY?.trim() ?? "";
  const posts = await getAllPosts();

  const heartbeatPath = path.join(process.cwd(), "content/autopilot/heartbeat.json");
  let heartbeat: Record<string, unknown> | null = null;
  if (fs.existsSync(heartbeatPath)) {
    try {
      heartbeat = JSON.parse(fs.readFileSync(heartbeatPath, "utf8")) as Record<string, unknown>;
    } catch {
      heartbeat = null;
    }
  }

  const checks = {
    cronSecret: Boolean(process.env.CRON_SECRET?.trim()),
    indexNowKey: Boolean(indexNowKey) && isValidIndexNowKey(indexNowKey),
    githubAutopilotToken: Boolean(
      process.env.GITHUB_AUTOPILOT_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim(),
    ),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
    database: Boolean(process.env.DATABASE_URL?.trim()),
    blogPostCount: posts.length,
    latestPostDate: posts[0]?.date ?? null,
    site: process.env.WRECKMATCH_SITE ?? "https://www.wreckmatch.com",
    heartbeat,
  };

  const ok = checks.cronSecret && checks.indexNowKey && checks.blogPostCount > 0;

  return NextResponse.json({
    ok,
    at: new Date().toISOString(),
    checks,
    note: "Google indexing still requires Search Console over time; this verifies the automation stack only.",
  });
}
