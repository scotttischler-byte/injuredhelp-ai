import { isValidIndexNowKey } from "@/lib/indexnow";

/**
 * IndexNow Option 1: https://www.wreckmatch.com/{INDEXNOW_KEY}.txt
 * Body must be ONLY the key (UTF-8). Rewritten from /{key}.txt in next.config.ts
 */
export async function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key || !isValidIndexNowKey(key)) {
    return new Response("IndexNow key not configured", { status: 404 });
  }
  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
