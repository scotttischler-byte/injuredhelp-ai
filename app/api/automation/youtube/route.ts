import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { verifyCronSecret } from "@/lib/automation-auth";
import { addContentQueueItem, getSql, logAutomation } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const sql = getSql();
  if (!sql) {
    await logAutomation("youtube", "cron", "skipped", { reason: "no_database" });
    return NextResponse.json({ ok: true, skipped: true });
  }

  const rows = (await sql`
    SELECT topic, generated_content FROM content_queue
    WHERE status = 'published' AND generated_content IS NOT NULL
    ORDER BY id DESC
    LIMIT 1
  `) as { topic: string; generated_content: string | null }[];

  const row = rows[0];
  if (!row) {
    await logAutomation("youtube", "cron", "skipped", { reason: "no_published_content" });
    return NextResponse.json({ ok: true, skipped: true });
  }

  const script = await callClaude({
    system: "Return plain text script only.",
    messages: [
      {
        role: "user",
        content: `Convert this WreckMatch blog content into a 3-5 minute YouTube script.\nTopic: ${row.topic}\nContent excerpt:\n${(row.generated_content ?? "").slice(0, 4000)}`,
      },
    ],
    maxTokens: 1400,
  });

  await addContentQueueItem({ topic: `YouTube script — ${row.topic}`, type: "youtube-script" });
  const idRows = (await sql`SELECT id FROM content_queue ORDER BY id DESC LIMIT 1`) as { id: number }[];
  const id = idRows[0]?.id;
  if (id) {
    await sql`
      UPDATE content_queue
      SET status = 'published', generated_content = ${script}, generated_at = NOW()
      WHERE id = ${id}
    `;
  }

  await logAutomation("youtube", "cron", "success", { id });
  return NextResponse.json({ ok: true, id });
}
