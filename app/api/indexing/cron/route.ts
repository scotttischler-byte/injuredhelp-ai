import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { submitIndexNowBatch } from "@/lib/indexnow";
import { WHAT_TO_DO_PATHS } from "@/lib/what-to-do-guides";
import { verifyCronSecret } from "@/lib/automation-auth";

const SITE = (process.env.WRECKMATCH_SITE ?? "https://www.wreckmatch.com").replace(/\/$/, "");

const PRIORITY_PATHS = [
  "/",
  "/blog",
  "/car-accident-help",
  "/truck-accident-help",
  "/car-accident-help-houston",
  "/car-accident-help-dallas",
  "/car-accident-help-miami",
  "/car-accident-help-los-angeles",
  "/checklist-after-car-accident",
  "/ai-accident-help",
  ...WHAT_TO_DO_PATHS,
];

/**
 * Vercel Cron: auto-submit latest blog URLs + priority pages to IndexNow.
 * Auth: Authorization: Bearer CRON_SECRET (set automatically on Vercel crons).
 */
export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const recentSlugs = getAllPosts()
    .slice(0, 120)
    .map((p) => p.slug);

  const urls = [
    ...PRIORITY_PATHS.map((p) => `${SITE}${p}`),
    ...recentSlugs.map((s) => `${SITE}/blog/${s}`),
  ];

  const key = process.env.INDEXNOW_KEY?.trim() ?? "";
  if (!key) {
    return NextResponse.json({
      ok: false,
      error: "INDEXNOW_KEY missing on Vercel",
      recentPosts: recentSlugs.length,
    });
  }

  const batch = await submitIndexNowBatch(SITE, key, urls);

  const ok = batch.results.some((r) => r.ok);

  return NextResponse.json({
    ok,
    mode: "vercel-cron",
    recentPosts: recentSlugs.length,
    submitted: batch.urlCount,
    keyFile: batch.keyFile,
    indexnow: batch.results,
  });
}
