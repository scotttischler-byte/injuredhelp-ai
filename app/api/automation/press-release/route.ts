import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { verifyCronSecret } from "@/lib/automation-auth";
import { countGuideDownloads, insertPressReleaseDb, logAutomation } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const force = url.searchParams.get("force") === "1";

  const downloads = await countGuideDownloads();
  const isFirstOfMonth = new Date().getUTCDate() === 1;

  const milestone = downloads > 0 && downloads % 500 === 0;
  if (!force && !isFirstOfMonth && !milestone) {
    await logAutomation("press", "cron", "skipped", { downloads });
    return NextResponse.json({ ok: true, skipped: true, downloads });
  }

  const trigger =
    downloads % 500 === 0 && downloads > 0
      ? `Milestone: ${downloads} guide downloads`
      : isFirstOfMonth
        ? "Monthly press cycle"
        : "Manual trigger";

  const pr = await callClaude({
    system: "Return Markdown only (no JSON). AP-style press release.",
    messages: [
      {
        role: "user",
        content: `Write a professional press release for WreckMatch.\nDateline: Monroe, WI.\nPhone (978) 515-6063.\nAngle: ${trigger}\nInclude one phrase naturally: car accident legal help OR accident survival guide OR personal injury attorney matching.`,
      },
    ],
    maxTokens: 1400,
  });

  const slug = `press-${Date.now()}`;
  const dir = path.join(process.cwd(), "content", "press");
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.md`);
  await fs.writeFile(
    filePath,
    `---\ntitle: "WreckMatch expands free car accident legal help nationwide"\ndate: "${new Date().toISOString().slice(0, 10)}"\ndescription: "Press release"\nslug: "${slug}"\n---\n\n${pr}\n`,
    "utf8",
  );

  await insertPressReleaseDb({
    title: "WreckMatch press release",
    content: pr,
    trigger_event: trigger,
    distributed: false,
    distribution_urls: { prweb: Boolean(process.env.PRWEB_API_KEY), ein: Boolean(process.env.EIN_PRESSWIRE_API_KEY) },
  });

  await logAutomation("press", "cron", "success", { slug });
  return NextResponse.json({ ok: true, slug });
}
