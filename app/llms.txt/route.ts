import { headers } from "next/headers";
import { buildLlmsTxt } from "@/lib/llms-content";
import { siteOriginFromHeaders } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const h = await headers();
  const body = buildLlmsTxt(siteOriginFromHeaders(h));

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
