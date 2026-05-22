import type { EnrichedCityContent } from "@/lib/priority-places/types";
import { hubSlugForPlace } from "@/lib/priority-places/registry";
import { ALL_STATES } from "@/lib/states";

function stateProfileForName(stateName: string) {
  return ALL_STATES.find((s) => s.state === stateName);
}
import { hubSlugFromName } from "@/lib/geo-routes";

export function enrichedCityToMarkdown(content: EnrichedCityContent): string {
  const state = stateProfileForName(content.state);
  const stateSlug = hubSlugFromName(content.state);
  const path = `/${hubSlugForPlace(content.slug)}`;

  const lines: string[] = [
    "---",
    `title: "What to Do After a Car Accident in ${content.city}, ${content.state} (2026 Guide)"`,
    `description: "Step-by-step ${content.city} car accident guide with ${content.state} deadlines, insurance tactics, and free attorney matching. Not legal advice."`,
    `slug: ${hubSlugForPlace(content.slug)}`,
    `city: "${content.city}"`,
    `state: "${content.state}"`,
    `date: May 2026`,
    "---",
    "",
    `# What to Do After a Car Accident in ${content.city}, ${content.state} (2026 Guide)`,
    "",
    "> **Disclaimer:** WreckMatch LLC is a legal referral service — not a law firm. Not legal advice. Last updated May 2026.",
    "",
    "**Call 855 WRECKMATCH — (855) 897-3256** · [Free matching form](https://www.wreckmatch.com/#form)",
    "",
    "## Immediate steps",
    "",
    ...content.immediateSteps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "## Local statistics",
    "",
    "| Metric | Value |",
    "|--------|-------|",
    ...content.stats.map((s) => `| ${s.label} | ${s.value} |`),
    "",
    `**Local note:** ${content.localNote}`,
    "",
    "## Statute of limitations & fault",
    "",
    `| Item | Detail |`,
    `|------|--------|`,
    `| SOL | ${state?.statuteOfLimitationsYears ?? 2} years (typical) |`,
    `| Fault | ${state?.comparativeFault ?? "Varies"} |`,
    `| Settlement range (info only) | ${state?.avgSettlementRange ?? "Varies"} |`,
    "",
    "## Critical claim steps",
    "",
    ...content.criticalSteps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "## Common mistakes",
    "",
    "| Mistake | Consequence |",
    "|---------|-------------|",
    ...content.mistakes.map((m) => `| ${m.mistake} | ${m.consequence} |`),
    "",
    "## Insurance tactics",
    "",
    ...content.insuranceTactics.map((t, i) => `${i + 1}. ${t}`),
    "",
    "## Highways & hospitals",
    "",
    `- **Corridors:** ${content.highways}`,
    `- **Care:** ${content.hospitals}`,
    "",
    "## Internal links",
    "",
    `- [${content.state} state hub](https://www.wreckmatch.com/${stateSlug})`,
    `- [Homepage form](https://www.wreckmatch.com/#form)`,
    `- Live URL: https://www.wreckmatch.com${path}`,
    "",
  ];

  return lines.join("\n");
}
