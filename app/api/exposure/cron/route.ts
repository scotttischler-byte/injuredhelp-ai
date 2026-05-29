import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/automation-auth";
import {
  buildIndexNowUrls,
  clearPendingIndexSlugs,
  getExposureStats,
  loadPendingIndexSlugs,
} from "@/lib/exposure-index";
import { submitIndexNowBatch } from "@/lib/indexnow";
import { WRECKMATCH_URL } from "@/lib/site";

const SITE = WRECKMATCH_URL.replace(/\/$/, "");

/**
 * 10x exposure cron: IndexNow batch (all recent EN/ES + pillars) + stats snapshot.
 * Auth: Bearer CRON_SECRET (Vercel cron).
 */
export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const stats = getExposureStats();
  const pending = loadPendingIndexSlugs();
  const urls = buildIndexNowUrls({ recentBlogLimit: 320, recentEsLimit: 320, extraSlugs: pending });
  const key = process.env.INDEXNOW_KEY?.trim() ?? "";

  if (!key) {
    return NextResponse.json({
      ok: false,
      error: "INDEXNOW_KEY missing on Vercel",
      stats,
      pendingSlugs: pending.length,
      urlCandidates: urls.length,
    });
  }

  const batch = await submitIndexNowBatch(SITE, key, urls);
  const indexOk = batch.results.some((r) => r.ok);
  if (indexOk) {
    clearPendingIndexSlugs();
  }

  return NextResponse.json({
    ok: indexOk,
    mode: "exposure-cron",
    stats,
    pendingCleared: indexOk,
    pendingWas: pending.length,
    submitted: batch.urlCount,
    keyFile: batch.keyFile,
    indexnow: batch.results,
    note: "llms.txt is dynamic on each request. Run monitor:ai-citations via GitHub Actions daily.",
  });
}
