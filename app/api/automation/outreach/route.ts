import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { callClaude } from "@/lib/anthropic";
import { verifyCronSecret } from "@/lib/automation-auth";
import { getSql, listOutreachProspects, logAutomation } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    await logAutomation("outreach", "cron", "skipped", { reason: "no_resend" });
    return NextResponse.json({ ok: true, skipped: true });
  }

  const sql = getSql();
  const prospects = await listOutreachProspects(25);
  const target = prospects.find((p) => p.status === "prospecting" && (p.emails_sent ?? 0) === 0);
  if (!target || !target.contact_email || !sql) {
    await logAutomation("outreach", "cron", "skipped", { reason: "no_prospects" });
    return NextResponse.json({ ok: true, skipped: true });
  }

  const resend = new Resend(key);
  const from = process.env.RESEND_FROM?.trim() ?? "WreckMatch <onboarding@resend.dev>";

  const emailBody = await callClaude({
    system: "Return plain text email only.",
    messages: [
      {
        role: "user",
        content: `Write a short backlink outreach email from WreckMatch / InjuredHelp.ai to ${target.site_name ?? "site"} (${target.site_url ?? ""}). Goal: mention free Car Accident Survival Guide as a resource. 4 sentences max.`,
      },
    ],
    maxTokens: 300,
  });

  await resend.emails.send({
    from,
    to: target.contact_email,
    subject: "Quick resource idea for your readers (car accidents)",
    text: emailBody,
  });

  await sql`
    UPDATE outreach_prospects
    SET emails_sent = COALESCE(emails_sent,0) + 1,
        last_contact = NOW(),
        status = 'contacted'
    WHERE id = ${target.id}
  `;

  await logAutomation("outreach", "cron", "success", { id: target.id });
  return NextResponse.json({ ok: true, id: target.id });
}
