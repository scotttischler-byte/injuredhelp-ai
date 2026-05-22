/**
 * Export enriched priority geo pages to content/geo-pages/*.md for review.
 * Run: npx tsx scripts/export-priority-geo-markdown.ts
 */
import fs from "fs";
import path from "path";
import { buildEnrichedCityMap } from "../lib/priority-places/content-builder";
import { enrichedCityToMarkdown } from "../lib/priority-places/markdown-export";
import { hubSlugForPlace } from "../lib/priority-places/registry";
import { PRIORITY_STATE_NAMES } from "../lib/priority-places/types";
import { hubSlugFromName } from "../lib/geo-routes";

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "content/geo-pages");

function stateHubMarkdown(state: string): string {
  const slug = hubSlugFromName(state);
  return [
    "---",
    `title: "Car Accident Lawyer ${state} — Statewide Help (2026)"`,
    `slug: ${slug}`,
    `state: "${state}"`,
    `date: May 2026`,
    "---",
    "",
    `# Car Accident Lawyer ${state} — What to Do After a Crash`,
    "",
    "> WreckMatch LLC is a legal referral service — not a law firm. Not legal advice.",
    "",
    `Links to all priority ${state} city guides. Live hub: https://www.wreckmatch.com/${slug}`,
    "",
  ].join("\n");
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(path.join(OUT, "state-hubs"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "accident-variants"), { recursive: true });

  const map = buildEnrichedCityMap();
  let count = 0;
  for (const [placeSlug, content] of Object.entries(map)) {
    const file = path.join(OUT, `${placeSlug}.md`);
    fs.writeFileSync(file, enrichedCityToMarkdown(content));
    count++;
  }

  for (const state of PRIORITY_STATE_NAMES) {
    const file = path.join(OUT, "state-hubs", `${state.toLowerCase().replace(/\s+/g, "-")}.md`);
    fs.writeFileSync(file, stateHubMarkdown(state));
    count++;
  }

  const variantReadme = [
    "# Accident-type variant pages (live on site)",
    "",
    "Routes: `/car-accident-help-{city}/{truck|rideshare|motorcycle}`",
    "",
    "Cities: Houston, Dallas, Austin, Los Angeles, Chicago, Atlanta, Miami, Nashville",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(OUT, "accident-variants", "README.md"), variantReadme);

  console.log(`Exported ${count} markdown files to ${OUT}`);
  console.log(`Example live URL: /${hubSlugForPlace("houston")}`);
}

main();
