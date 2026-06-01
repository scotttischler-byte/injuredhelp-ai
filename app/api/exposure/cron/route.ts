import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/automation-auth";
import { getExposureStats, submitIndexNowAllSites } from "@/lib/exposure-index";
import { submitIndexNowBatch } from "@/lib/indexnow";

/**
 * 10x exposure cron: IndexNow for every property in config/geo-sites.json.
 * Perplexity → Bing bridge: pings hit Bing in ~2–6 hours per domain.
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
      stats,
    });
  }

  const sites = await submitIndexNowAllSites(async (siteOrigin, urls) => {
    const batch = await submitIndexNowBatch(siteOrigin, key, urls);
    return {
      ok: batch.results.some((r) => r.ok),
      urlCount: batch.urlCount,
      results: batch.results,
    };
  });

  const ok = sites.some((s) => s.ok);

  return NextResponse.json({
    ok,
    mode: "exposure-cron-multi-site",
    stats,
    sites,
    note: "llms.txt is dynamic per host. See docs/CURSOR_SECRET_SAUCE.md for 24h tactics.",
  });
}
