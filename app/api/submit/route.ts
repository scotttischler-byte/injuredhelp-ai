import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import twilio from "twilio";
import { trackTikTokLead } from "@/lib/tiktok-events";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      state,
      timing,
      injuries,
      source,
      language,
      ttclid,
      ttp,
      tiktokEventId,
      pageUrl,
    } = await req.json();

    if (!firstName || !phone || !state || !timing) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailTrimmed = typeof email === "string" ? email.trim() : "";
    if (!emailTrimmed || !EMAIL_RE.test(emailTrimmed)) {
      return NextResponse.json({ error: "Missing or invalid email" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const e164Phone = cleanPhone.startsWith("1") ? `+${cleanPhone}` : `+1${cleanPhone}`;
    const fullName = `${firstName} ${lastName || ""}`.trim();
    const injuryRows = Array.isArray(injuries) ? injuries : [];
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER!;
    const resendKey = process.env.RESEND_API_KEY?.trim();
    const resendClient = resendKey ? new Resend(resendKey) : null;

    const leadNotificationHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#C41230;padding:20px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">NEW WRECKMATCH LEAD</h1>
      </div>
      <div style="background:#f9f9f9;padding:24px;border:1px solid #e0e0e0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;width:140px;">Name</td><td style="padding:8px 0;color:#1C1C1E;">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">Phone</td><td style="padding:8px 0;color:#1C1C1E;"><a href="tel:${phone}" style="color:#C41230;">${phone}</a></td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">State</td><td style="padding:8px 0;color:#1C1C1E;">${state}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">Injury Type</td><td style="padding:8px 0;color:#1C1C1E;">${injuryRows.join(", ")}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">Accident Timing</td><td style="padding:8px 0;color:#1C1C1E;">${timing}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">Source</td><td style="padding:8px 0;color:#1C1C1E;">${source || "website"}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">Language</td><td style="padding:8px 0;color:#1C1C1E;">${language || "English"}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">Submitted</td><td style="padding:8px 0;color:#1C1C1E;">${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}</td></tr>
        </table>
        <div style="margin-top:20px;text-align:center;">
          <a href="tel:${phone}" style="background:#C41230;color:white;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:16px;display:inline-block;">📞 Call ${firstName} Now</a>
        </div>
      </div>
      <div style="background:#0D1B2A;padding:16px;text-align:center;">
        <p style="color:#888;font-size:12px;margin:0;">WreckMatch / InjuredHelp.ai — (978) 515-6063 — wreckmatch.com</p>
      </div>
    </div>
  `;

    const teamSmsBody = `🚨 NEW WRECKMATCH LEAD\n👤 ${firstName} ${lastName}\n📞 ${phone}\n📍 ${state}\n🤕 ${injuryRows.join(", ")}\n⏱ ${timing}\n🌐 Source: ${source || "website"}\n\nCall them now → tap: ${phone}`;

    const twimlSay = `<Response><Say voice="alice">New WreckMatch lead. ${firstName} from ${state}. Injury type: ${injuryRows.join(" and ")}. Their number is ${phone.split("").join(" ")}. Calling them now.</Say></Response>`;

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip")?.trim() ||
      null;
    const userAgent = req.headers.get("user-agent");

    const settledLabels = [
      "twilio_lead_sms",
      "retell",
      "ghl",
      "tiktok_lead",
      "email_scott",
      "email_cathy",
      "call_scott",
      "call_kathy_1",
      "call_kathy_2",
      "sms_scott",
      "sms_kathy_1",
      "sms_kathy_2",
    ] as const;

    const results = await Promise.allSettled([
      // 1. Twilio SMS
      twilioClient.messages.create({
        body: `Hi ${firstName}! We received your injury case request (${emailTrimmed}). An attorney's team is calling you right now. Questions? Reply anytime.`,
        from: twilioFrom,
        to: e164Phone,
      }),

      // 2. Retell AI outbound call
      fetch("https://api.retellai.com/v2/create-phone-call", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RETELL_API_KEY!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_number: twilioFrom,
          to_number: e164Phone,
          agent_id: process.env.RETELL_AGENT_ID!,
          retell_llm_dynamic_variables: {
            lead_name: firstName,
            lead_email: emailTrimmed,
            lead_state: state,
            accident_timing: timing,
            injury_types: injuries?.join(", ") || "Not specified",
          },
        }),
      }),

      // 3. GHL Webhook
      fetch(process.env.GHL_WEBHOOK_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: emailTrimmed,
          phone: e164Phone,
          state,
          accident_timing: timing,
          injury_types: injuries?.join(", ") || "Not specified",
          source: "InjuredHelp.ai",
          timestamp: new Date().toISOString(),
        }),
      }),

      // TikTok Events API — Lead (server-side)
      trackTikTokLead({
        email: emailTrimmed,
        phoneE164: e164Phone,
        pageUrl: typeof pageUrl === "string" ? pageUrl : "https://www.injuredhelp.ai/",
        ip: clientIp,
        userAgent,
        ttclid: typeof ttclid === "string" ? ttclid : null,
        ttp: typeof ttp === "string" ? ttp : null,
        eventId: typeof tiktokEventId === "string" ? tiktokEventId : undefined,
        state,
      }),

      // Email to Scott
      resendClient
        ? resendClient.emails.send({
            from: process.env.RESEND_FROM!,
            to: "scott.tischler@gmail.com",
            subject: `🚨 New WreckMatch Lead — ${firstName} ${lastName} — ${state}`,
            html: leadNotificationHtml,
          })
        : Promise.reject(new Error("RESEND_API_KEY not configured")),

      // Email to Cathy
      resendClient
        ? resendClient.emails.send({
            from: process.env.RESEND_FROM!,
            to: "cathycarr88@gmail.com",
            subject: `🚨 New WreckMatch Lead — ${firstName} ${lastName} — ${state}`,
            html: leadNotificationHtml,
          })
        : Promise.reject(new Error("RESEND_API_KEY not configured")),

      // Call Scott simultaneously
      twilioClient.calls.create({
        to: "+18156080449",
        from: twilioFrom,
        twiml: twimlSay,
      }),

      // Call Kathy line 1 simultaneously
      twilioClient.calls.create({
        to: "+14142027718",
        from: twilioFrom,
        twiml: twimlSay,
      }),

      // Call Kathy line 2 simultaneously
      twilioClient.calls.create({
        to: "+14148655518",
        from: twilioFrom,
        twiml: twimlSay,
      }),

      // SMS to Scott
      twilioClient.messages.create({
        to: "+18156080449",
        from: twilioFrom,
        body: teamSmsBody,
      }),

      // SMS to Kathy line 1
      twilioClient.messages.create({
        to: "+14142027718",
        from: twilioFrom,
        body: teamSmsBody,
      }),

      // SMS to Kathy line 2
      twilioClient.messages.create({
        to: "+14148655518",
        from: twilioFrom,
        body: teamSmsBody,
      }),
    ]);

    // Log any failures server-side
    const errors: string[] = [];

    results.forEach((r, i) => {
      const label = settledLabels[i] ?? `task_${i}`;
      if (r.status === "rejected") {
        console.error(`${label} failed:`, r.reason);
        errors.push(label);
      }
    });

    // Still return success to user — we don't want to scare them off
    // but log which services failed for debugging
    return NextResponse.json({
      success: true,
      ...(errors.length > 0 && { warnings: errors }),
    });
  } catch (err) {
    console.error("Submit handler error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
