import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/automation-auth";
import { isValidIndexNowKey } from "@/lib/indexnow";
import fs from "fs";
import path from "path";

function countEnBlogPosts(): number {
  let n = 0;
  for (const root of ["content/blog", "sites/semitruckmatch/content/blog"]) {
    const dir = path.join(process.cwd(), root);
    if (!fs.existsSync(dir)) continue;
    n += fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx")).length;
  }
  return n;
}

/** Daily automation health snapshot (Vercel cron or manual with CRON_SECRET). */
export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const indexNowKey = process.env.INDEXNOW_KEY?.trim() ?? "";
  const blogPostCount = countEnBlogPosts();

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
    blogPostCount,
    latestPostDate: null,
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
