import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, phone, state, timing, injuries } = await req.json();

    if (!firstName || !phone || !state || !timing) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const e164Phone = cleanPhone.startsWith("1") ? `+${cleanPhone}` : `+1${cleanPhone}`;
    const fullName = `${firstName} ${lastName || ""}`.trim();

    const results = await Promise.allSettled([
      // 1. Twilio SMS
      twilioClient.messages.create({
        body: `Hi ${firstName}! We received your injury case request. An attorney's team is calling you right now. Questions? Reply anytime.`,
        from: process.env.TWILIO_PHONE_NUMBER!,
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
          from_number: process.env.TWILIO_PHONE_NUMBER!,
          to_number: e164Phone,
          agent_id: process.env.RETELL_AGENT_ID!,
          retell_llm_dynamic_variables: {
            lead_name: firstName,
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
          phone: e164Phone,
          state,
          accident_timing: timing,
          injury_types: injuries?.join(", ") || "Not specified",
          source: "InjuredHelp.ai",
          timestamp: new Date().toISOString(),
        }),
      }),
    ]);

    // Log any failures server-side
    const [smsResult, retellResult, ghlResult] = results;
    const errors: string[] = [];

    if (smsResult.status === "rejected") {
      console.error("Twilio SMS failed:", smsResult.reason);
      errors.push("sms");
    }
    if (retellResult.status === "rejected") {
      console.error("Retell call failed:", retellResult.reason);
      errors.push("call");
    }
    if (ghlResult.status === "rejected") {
      console.error("GHL webhook failed:", ghlResult.reason);
      errors.push("ghl");
    }

    // Still return success to user — we don't want to scare them off
    // but log which services failed for debugging
    return NextResponse.json({
      success: true,
      ...(errors.length > 0 && { warnings: errors })
    });
  } catch (err) {
    console.error("Submit handler error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
