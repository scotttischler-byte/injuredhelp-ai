import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { callClaude } from "@/lib/anthropic";
import { verifyCronSecret } from "@/lib/automation-auth";
import { bumpSubscriberSequence, listSubscribersDueForEmail, logAutomation } from "@/lib/db";
import { wreckmatchEmailHtml } from "@/lib/email-template";
import { SITE_URL } from "@/lib/site";

const MAIN_SEQUENCE = [
  { day: 0, subject: "You're connected — here's what happens next" },
  { day: 1, subject: "Did you see a doctor yet? (really important)" },
  { day: 2, subject: "⚠️ Don't say this to your insurance company" },
  { day: 3, subject: "How much is your case worth? (honest answer)" },
  { day: 4, subject: "The #1 mistake accident victims make" },
  { day: 5, subject: "Your state's deadline — check this now" },
  { day: 7, subject: "Last email — one thing I want you to know" },
] as const;

function hoursSince(iso: string | null) {
  if (!iso) return 999;
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60);
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    await logAutomation("email", "cron", "skipped", { reason: "no_resend" });
    return NextResponse.json({ ok: true, skipped: true });
  }

  const resend = new Resend(key);
  const from = process.env.RESEND_FROM?.trim() ?? "WreckMatch <onboarding@resend.dev>";

  const subs = await listSubscribersDueForEmail(40);
  let sent = 0;

  for (const s of subs) {
    if ((s.sequence_name ?? "main") !== "main") continue;
    const day = s.sequence_day ?? 0;
    const step = MAIN_SEQUENCE.find((x) => x.day === day);
    if (!step) continue;
    if (hoursSince(s.last_email_sent) < 20) continue;

    const body = await callClaude({
      system: "Write HTML email body only (no <html>), friendly Sarah voice.",
      messages: [
        {
          role: "user",
          content: `Write email day ${step.day} of a 7-day nurture sequence for WreckMatch.\nRecipient first name: ${s.first_name ?? "there"}\nSubject: ${step.subject}\n150-250 words. Soft CTA call/text (978) 515-6063 and WreckMatch.com. Sign: — Sarah & the WreckMatch Team`,
        },
      ],
      maxTokens: 900,
    });

    const html = wreckmatchEmailHtml({
      title: step.subject,
      bodyHtml: body,
      ctaHref: `${SITE_URL}/#form`,
      ctaLabel: "Get free help",
    });

    await resend.emails.send({
      from,
      to: s.email,
      subject: step.subject,
      html,
    });

    const nextDay = day >= 7 ? 8 : day === 5 ? 7 : day + 1;
    await bumpSubscriberSequence(s.id, nextDay);
    sent += 1;
    if (sent >= 25) break;
  }

  await logAutomation("email", "cron", "success", { sent });
  return NextResponse.json({ ok: true, sent });
}
