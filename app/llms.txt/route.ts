import { buildLlmsTxt } from "@/lib/llms-content";
import { serverSiteOrigin } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const body = buildLlmsTxt(serverSiteOrigin());

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
