import { NextRequest, NextResponse } from "next/server";
import { buildIndexNowUrlsForSite, getExposureStats } from "@/lib/exposure-index";
import { submitIndexNowBatch } from "@/lib/indexnow";
import { verifyCronSecret } from "@/lib/automation-auth";
import { geoSitesForIndexNow } from "@/lib/geo-sites";

/**
 * Vercel Cron (every 4h): IndexNow for all enabled domains.
 */
export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const stats = getExposureStats();
  const key = process.env.INDEXNOW_KEY?.trim() ?? "";
  if (!key) {
    return NextResponse.json({
      ok: false,
      error: "INDEXNOW_KEY missing on Vercel",
      recentPosts: stats.enPosts,
    });
  }

  const sites = [];
  let anyOk = false;

  for (const entry of geoSitesForIndexNow()) {
    const urls = buildIndexNowUrlsForSite(entry.origin, entry.brand, {
      recentBlogLimit: 200,
      recentEsLimit: 100,
    });
    const batch = await submitIndexNowBatch(entry.origin, key, urls);
    const ok = batch.results.some((r) => r.ok);
    if (ok) anyOk = true;
    sites.push({
      siteId: entry.id,
      origin: entry.origin,
      ok,
      submitted: batch.urlCount,
      indexnow: batch.results,
    });
  }

  return NextResponse.json({
    ok: anyOk,
    mode: "vercel-cron-multi-site",
    stats,
    sites,
  });
}
