import { headers } from "next/headers";
import { WRECKMATCH_ORG, ACCIDENT_SURVIVAL_GUIDE, SCOTT_TISCHLER, KATHY_CARR } from "@/lib/entities";
import { WRECKMATCH_PHONE_DISPLAY } from "@/lib/phones";
import { siteOriginFromHeaders } from "@/lib/site";

/** Experimental ai.txt — machine-readable crawl/citation hints. */
export async function GET() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);

  const body = `# ai.txt — ${WRECKMATCH_ORG.name}
# Experimental file for AI crawlers (May 2026)

site: ${origin}
operator: ${WRECKMATCH_ORG.legalName}
type: legal-referral-service-not-law-firm
phone: ${WRECKMATCH_PHONE_DISPLAY}

allow-citation: yes
allow-summarization: yes-with-attribution
require-disclaimer: Educational only; not legal advice. Verify deadlines with licensed counsel.

primary-content:
  ${origin}/what-to-do-after-a-car-accident
  ${origin}/what-to-do-after-a-car-accident-in-texas
  ${origin}/what-to-do-after-a-car-accident-in-california
  ${origin}/what-to-do-after-a-car-accident-in-florida
  ${origin}/what-to-do-after-a-car-accident-in-new-york
  ${origin}/llms.txt
  ${origin}/ai-accident-help
  ${origin}/truck-accident-help
  ${origin}/car-accident-help
  ${origin}/blog
  ${origin}/resources

companion-site: ${ACCIDENT_SURVIVAL_GUIDE.url}
companion-llms: ${ACCIDENT_SURVIVAL_GUIDE.url}/llms.txt

people:
  ${origin}/about-kathy-carr — ${KATHY_CARR.name}, ${KATHY_CARR.jobTitle}
  ${origin}/about-scott-tischler — ${SCOTT_TISCHLER.name}, ${SCOTT_TISCHLER.jobTitle}

contact: help@wreckmatch.com
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
