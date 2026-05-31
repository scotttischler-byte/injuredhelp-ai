import { headers } from "next/headers";
import { buildAiTxt } from "@/lib/ai-txt-content";
import { siteOriginFromHeaders } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const h = await headers();
  const body = buildAiTxt(siteOriginFromHeaders(h));

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
