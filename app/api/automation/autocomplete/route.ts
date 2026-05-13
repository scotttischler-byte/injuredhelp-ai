import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/automation-auth";
import { insertAutocompleteRow, logAutomation } from "@/lib/db";

const PHRASES = [
  "wreckmatch",
  "wreck match attorney",
  "car accident attorney match",
  "injured help",
  "accident survival guide",
  "car accident survival guide",
  "car accident legal help free",
  "free car accident attorney",
  "car accident lawyer free match",
  "injured in car accident help",
] as const;

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const targets = ["wreckmatch", "injuredhelp", "accidentsurvivalguide"];

  for (const phrase of PHRASES) {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(phrase)}`;
    const res = await fetch(url, { headers: { "user-agent": "WreckMatchAutocomplete/1.0" } });
    const text = await res.text();
    const cleaned = text.replace(/^\)\]\}',/, "");
    let suggestions: string[] = [];
    try {
      const json = JSON.parse(cleaned) as [string, string[]];
      suggestions = json[1] ?? [];
    } catch {
      suggestions = [];
    }
    const appearing = suggestions.some((s) =>
      targets.some((t) => s.toLowerCase().includes(t)),
    );
    await insertAutocompleteRow({
      phrase,
      appearing,
      position: appearing ? suggestions.findIndex((s) => targets.some((t) => s.toLowerCase().includes(t))) : null,
      suggestions,
    });
  }

  await logAutomation("autocomplete", "cron", "success", { phrases: PHRASES.length });
  return NextResponse.json({ ok: true, phrases: PHRASES.length });
}
