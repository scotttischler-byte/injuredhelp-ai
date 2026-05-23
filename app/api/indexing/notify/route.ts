import { NextRequest, NextResponse } from "next/server";
import { WHAT_TO_DO_PATHS } from "@/lib/what-to-do-guides";

const SITE = (process.env.WRECKMATCH_SITE ?? "https://www.wreckmatch.com").replace(/\/$/, "");
const HOST = SITE.replace(/^https?:\/\//, "");

const PRIORITY_PATHS = [
  "/",
  "/blog",
  "/sitemap.xml",
  "/car-accident-help",
  "/truck-accident-help",
  ...WHAT_TO_DO_PATHS,
  "/car-accident-help-houston",
  "/car-accident-help-dallas",
  "/car-accident-help-miami",
  "/car-accident-help-los-angeles",
];

async function submitIndexNow(urls: string[]): Promise<{ ok: boolean; detail: unknown }> {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    return { ok: false, detail: "INDEXNOW_KEY not set on Vercel" };
  }

  const payload = {
    host: HOST,
    key,
    keyLocation: `${SITE}/${key}.txt`,
    urlList: urls.slice(0, 10_000),
  };

  const endpoints = ["https://api.indexnow.org/indexnow", "https://www.bing.com/indexnow"];
  const results: { endpoint: string; status: number }[] = [];

  for (const endpoint of endpoints) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    results.push({ endpoint, status: res.status });
  }

  const ok = results.some((r) => r.status === 200 || r.status === 202);
  return { ok, detail: { urlCount: urls.length, results } };
}

function authorize(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/** POST { "slugs": ["blog-slug", ...] } — IndexNow ping after publish. Secured by CRON_SECRET. */
export async function POST(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let slugs: string[] = [];
  try {
    const body = (await req.json()) as { slugs?: string[] };
    slugs = Array.isArray(body.slugs) ? body.slugs : [];
  } catch {
    slugs = [];
  }

  const urls = [
    ...PRIORITY_PATHS.map((p) => `${SITE}${p}`),
    ...slugs.map((s) => `${SITE}/blog/${s.replace(/^\//, "")}`),
  ];

  const seen = new Set<string>();
  const unique = urls.filter((u) => {
    if (seen.has(u)) return false;
    seen.add(u);
    return true;
  });

  const indexnow = await submitIndexNow(unique);

  return NextResponse.json({
    ok: indexnow.ok,
    submitted: unique.length,
    indexnow: indexnow.detail,
    note:
      "Google has no API for general Request indexing. Use GSC manually for critical URLs; IndexNow helps Bing/Yandex and crawl discovery.",
  });
}

export async function GET(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const indexnow = await submitIndexNow(PRIORITY_PATHS.map((p) => `${SITE}${p}`));
  return NextResponse.json({ ok: indexnow.ok, indexnow: indexnow.detail });
}
