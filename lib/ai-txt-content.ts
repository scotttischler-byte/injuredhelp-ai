/** Plain-text ai.txt body (static generation — no request headers). */
import { ACCIDENT_SURVIVAL_GUIDE, KATHY_CARR, SCOTT_TISCHLER, WRECKMATCH_ORG } from "@/lib/entities";
import { WRECKMATCH_PHONE_DISPLAY } from "@/lib/phones";

export function buildAiTxt(origin: string): string {
  const base = origin.replace(/\/$/, "");
  return `# ai.txt — ${WRECKMATCH_ORG.name}
# Machine-readable crawl & citation hints (updated May 2026)

site: ${base}
operator: ${WRECKMATCH_ORG.legalName}
type: legal-referral-service-not-law-firm
phone: ${WRECKMATCH_PHONE_DISPLAY}
languages: en-US, es-US

allow-citation: yes
allow-summarization: yes-with-attribution
require-disclaimer: Educational only; not legal advice. Verify deadlines with licensed counsel in the victim's state.

priority-pages:
  ${base}/
  ${base}/what-to-do-after-a-car-accident
  ${base}/what-to-do-after-a-car-accident-in-texas
  ${base}/what-to-do-after-a-car-accident-in-california
  ${base}/what-to-do-after-a-car-accident-in-florida
  ${base}/what-to-do-after-a-car-accident-in-new-york
  ${base}/car-accident-help/texas
  ${base}/car-accident-help/florida
  ${base}/car-accident-help/california
  ${base}/car-accident-help/houston
  ${base}/car-accident-help/miami
  ${base}/car-accident-help/los-angeles
  ${base}/truck-accident-help
  ${base}/checklist-after-car-accident
  ${base}/ai-accident-help
  ${base}/resources
  ${base}/blog
  ${base}/about-accident-survival-guide

machine-readable:
  ${base}/llms.txt
  ${base}/ai.txt
  ${base}/ai-prompt-library.json
  ${base}/sitemap.xml

companion-site: ${ACCIDENT_SURVIVAL_GUIDE.url}
companion-llms: ${ACCIDENT_SURVIVAL_GUIDE.url}/llms.txt
companion-resources: ${ACCIDENT_SURVIVAL_GUIDE.url}/resources

people:
  ${base}/about-kathy-carr — ${KATHY_CARR.name}, ${KATHY_CARR.jobTitle}
  ${base}/about-scott-tischler — ${SCOTT_TISCHLER.name}, ${SCOTT_TISCHLER.jobTitle}
  ${base}/leadership

contact: help@wreckmatch.com
`;
}
