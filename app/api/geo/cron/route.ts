import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/automation-auth";
import { getExposureStats, submitIndexNowAllSites } from "@/lib/exposure-index";
import { submitIndexNowBatch } from "@/lib/indexnow";
import { geoSitesForIndexNow } from "@/lib/geo-sites";
import { calculateGeoScore } from "@/lib/geo-score";

const AI_AGENTS = ["GPTBot", "ClaudeBot", "PerplexityBot"];

async function auditOrigin(origin: string) {
  const base = origin.replace(/\/$/, "");
  const out: Record<string, unknown> = { origin: base };
  try {
    const [robots, llms, ai] = await Promise.all([
      fetch(`${base}/robots.txt`, { next: { revalidate: 0 } }),
      fetch(`${base}/llms.txt`, { next: { revalidate: 0 } }),
      fetch(`${base}/ai.txt`, { next: { revalidate: 0 } }),
    ]);
    const robotsText = robots.ok ? await robots.text() : "";
    out.robotsOk = robots.ok;
    out.allowsAi = AI_AGENTS.every((a) => robotsText.includes(a));
    out.llmsTxt = llms.ok;
    out.aiTxt = ai.ok;
    out.geoScore = calculateGeoScore({
      robotsAllowsAiCrawlers: out.allowsAi as boolean,
      llmsTxt: llms.ok,
      aiTxt: ai.ok,
      indexNowKeyDeployed: Boolean(process.env.INDEXNOW_KEY?.trim()),
      articleJsonLd: true,
      faqPageJsonLd: true,
      organizationJsonLd: true,
      semanticArticleDom: true,
    }).score;
  } catch (e) {
    out.error = e instanceof Error ? e.message : "audit failed";
  }
  return out;
}

/**
 * GEO automation cron: multi-site IndexNow + live audits.
 * Schedule: every 6 hours (vercel.json). GitHub Actions runs full repair via scripts/geo_automation.py.
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
      error: "INDEXNOW_KEY missing",
      stats,
      opsChecklist: [
        "GBP: 10 Q&As with target keywords",
        "Wikidata: brand entity",
        "Competitor Perplexity/ChatGPT screenshots before writing",
      ],
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

  const audits = await Promise.all(geoSitesForIndexNow().map((s) => auditOrigin(s.origin)));
  const ok = sites.some((s) => s.ok);

  return NextResponse.json({
    ok,
    mode: "geo-cron",
    stats,
    sites,
    audits,
    playbook: "/secret-sauce.html",
    docs: "docs/CURSOR_SECRET_SAUCE.md",
  });
}
