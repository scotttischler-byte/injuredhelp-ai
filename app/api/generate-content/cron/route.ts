import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/automation-auth";
import { addContentQueueItem, getSql, logAutomation } from "@/lib/db";
import { callClaude } from "@/lib/anthropic";
import { CRON_TOPIC_QUEUE } from "@/lib/cron-topics";

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const sql = getSql();
  if (!sql) {
    await logAutomation("generate-content", "cron", "skipped", { reason: "no_database" });
    return NextResponse.json({ ok: true, skipped: true, reason: "DATABASE_URL missing" });
  }

  let pending = (await sql`
    SELECT id, topic FROM content_queue
    WHERE status = 'pending'
    ORDER BY id ASC
    LIMIT 2
  `) as { id: number; topic: string }[];

  if (pending.length === 0) {
    for (const topic of CRON_TOPIC_QUEUE.slice(0, 2)) {
      await addContentQueueItem({ topic, type: "blog" });
    }
    pending = (await sql`
      SELECT id, topic FROM content_queue
      WHERE status = 'pending'
      ORDER BY id ASC
      LIMIT 2
    `) as { id: number; topic: string }[];
  }

  const results: { id: number; topic: string; status: string }[] = [];

  for (const row of pending) {
    try {
      await sql`
        UPDATE content_queue SET status = 'generating' WHERE id = ${row.id}
      `;

      const md = await callClaude({
        system:
          "Return valid MDX with YAML frontmatter (title, description, date, category, slug). WreckMatch disclaimer required.",
        messages: [{ role: "user", content: `Write a blog post about: ${row.topic}` }],
        maxTokens: 1800,
      });

      await sql`
        UPDATE content_queue
        SET status = 'published', generated_content = ${md}, generated_at = NOW()
        WHERE id = ${row.id}
      `;

      results.push({ id: row.id, topic: row.topic, status: "published" });
    } catch (e) {
      await sql`
        UPDATE content_queue SET status = 'failed' WHERE id = ${row.id}
      `;
      results.push({ id: row.id, topic: row.topic, status: "error" });
      await logAutomation("generate-content", "cron_item", "error", { id: row.id, message: String(e) });
    }
  }

  await logAutomation("generate-content", "cron", "success", { results });
  return NextResponse.json({ ok: true, results });
}
