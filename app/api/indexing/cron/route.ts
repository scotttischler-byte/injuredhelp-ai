import { NextRequest, NextResponse } from "next/server";
import { buildIndexNowUrls, getExposureStats } from "@/lib/exposure-index";
import { submitIndexNowBatch } from "@/lib/indexnow";
import { verifyCronSecret } from "@/lib/automation-auth";
import { WRECKMATCH_URL } from "@/lib/site";

const SITE = WRECKMATCH_URL.replace(/\/$/, "");

/**
 * Vercel Cron: IndexNow for priority pages + recent EN/ES blog (legacy path).
 * Prefer /api/exposure/cron for full 10x batch; this stays for backward compatibility.
 */
export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const stats = getExposureStats();
  const urls = buildIndexNowUrls({ recentBlogLimit: 200, recentEsLimit: 100 });

  const key = process.env.INDEXNOW_KEY?.trim() ?? "";
  if (!key) {
    return NextResponse.json({
      ok: false,
      error: "INDEXNOW_KEY missing on Vercel",
      recentPosts: stats.enPosts,
    });
  }

  const batch = await submitIndexNowBatch(SITE, key, urls);

  const ok = batch.results.some((r) => r.ok);

  return NextResponse.json({
    ok,
    mode: "vercel-cron",
    stats,
    submitted: batch.urlCount,
    keyFile: batch.keyFile,
    indexnow: batch.results,
  });
}
