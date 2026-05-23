import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/automation-auth";
import { getAllPosts } from "@/lib/posts";
import { isValidIndexNowKey } from "@/lib/indexnow";

/** Daily automation health snapshot (Vercel cron or manual with CRON_SECRET). */
export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const indexNowKey = process.env.INDEXNOW_KEY?.trim() ?? "";
  const posts = getAllPosts();

  const checks = {
    cronSecret: Boolean(process.env.CRON_SECRET?.trim()),
    indexNowKey: Boolean(indexNowKey) && isValidIndexNowKey(indexNowKey),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
    database: Boolean(process.env.DATABASE_URL?.trim()),
    blogPostCount: posts.length,
    latestPostDate: posts[0]?.date ?? null,
    site: process.env.WRECKMATCH_SITE ?? "https://www.wreckmatch.com",
  };

  const ok = checks.cronSecret && checks.indexNowKey && checks.blogPostCount > 0;

  return NextResponse.json({
    ok,
    at: new Date().toISOString(),
    checks,
    note: "Google indexing still requires Search Console over time; this verifies the automation stack only.",
  });
}
