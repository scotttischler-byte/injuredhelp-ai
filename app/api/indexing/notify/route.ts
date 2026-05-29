import { NextRequest, NextResponse } from "next/server";
import {
  isValidIndexNowKey,
  indexNowKeyFileUrl,
  submitIndexNowBatch,
  submitIndexNowSingle,
} from "@/lib/indexnow";
import { buildIndexNowUrls } from "@/lib/exposure-index";
import { WRECKMATCH_URL } from "@/lib/site";

const SITE = WRECKMATCH_URL.replace(/\/$/, "");

function authorize(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

function getKey(): { key: string } | { error: string; status: number } {
  const key = process.env.INDEXNOW_KEY?.trim() ?? "";
  if (!key) return { error: "INDEXNOW_KEY not set on Vercel", status: 503 };
  if (!isValidIndexNowKey(key)) {
    return {
      error: "INDEXNOW_KEY invalid (8–128 chars: a-z, A-Z, 0-9, hyphen). Use: openssl rand -hex 16",
      status: 503,
    };
  }
  return { key };
}

/** POST { "slugs": ["..."], "url": "optional single URL" } */
export async function POST(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyResult = getKey();
  if ("error" in keyResult) {
    return NextResponse.json({ error: keyResult.error }, { status: keyResult.status });
  }

  let slugs: string[] = [];
  let singleUrl: string | undefined;
  try {
    const body = (await req.json()) as { slugs?: string[]; url?: string };
    slugs = Array.isArray(body.slugs) ? body.slugs : [];
    singleUrl = typeof body.url === "string" ? body.url : undefined;
  } catch {
    slugs = [];
  }

  if (singleUrl) {
    const results = await submitIndexNowSingle(SITE, keyResult.key, singleUrl);
    const ok = results.some((r) => r.ok);
    return NextResponse.json({
      ok,
      mode: "single-get",
      url: singleUrl,
      keyFile: indexNowKeyFileUrl(SITE, keyResult.key),
      results,
    });
  }

  const urls = [
    ...PRIORITY_PATHS.map((p) => `${SITE}${p}`),
    ...slugs.map((s) => `${SITE}/blog/${s.replace(/^\//, "")}`),
  ];

  const batch = await submitIndexNowBatch(SITE, keyResult.key, urls);
  const ok = batch.results.some((r) => r.ok);

  return NextResponse.json({
    ok,
    mode: "batch-post",
    submitted: batch.urlCount,
    keyFile: batch.keyFile,
    indexnow: batch.results,
    note: "200/202 = received. Does not guarantee Google indexing. IndexNow shares with participating engines.",
  });
}

export async function GET(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyResult = getKey();
  if ("error" in keyResult) {
    return NextResponse.json({ error: keyResult.error }, { status: keyResult.status });
  }

  const batch = await submitIndexNowBatch(
    SITE,
    keyResult.key,
    PRIORITY_PATHS.map((p) => `${SITE}${p}`),
  );

  return NextResponse.json({
    ok: batch.results.some((r) => r.ok),
    keyFile: batch.keyFile,
    indexnow: batch.results,
  });
}
