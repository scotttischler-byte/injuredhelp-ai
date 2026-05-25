import { buildAiTxt } from "@/lib/ai-txt-content";
import { serverSiteOrigin } from "@/lib/site";

export const revalidate = 86400;

export async function GET() {
  const body = buildAiTxt(serverSiteOrigin());

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
