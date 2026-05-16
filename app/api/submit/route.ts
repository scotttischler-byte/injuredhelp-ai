import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import twilio from "twilio";
import { insertLead } from "@/lib/db";
import { absoluteUrl, brandFromHost, BRAND_CONFIG, siteOriginFromHeaders } from "@/lib/site";
import {
  trackTikTokCompleteRegistration,
  trackTikTokLead,
  trackTikTokSubmitForm,
} from "@/lib/tiktok-events";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function geoRoute(state: string, city?: string, zip?: string) {
  const stateUpper = (state ?? "").toUpperCase();
  const cityLower = (city ?? "").toLowerCase();
  const zipNum = parseInt(zip ?? "0", 10);

  const rgvCities = [
    "mcallen",
    "edinburg",
    "mission",
    "harlingen",
    "brownsville",
    "pharr",
    "weslaco",
    "mercedes",
    "rio grande",
    "rgv",
  ];

  const isRGVCity = rgvCities.some((c) => cityLower.includes(c));
  const isRGVZip = zipNum >= 78500 && zipNum <= 78599;

  if (stateUpper === "TX" && (isRGVCity || isRGVZip)) {
    return {
      geoTag: "RGV",
      attorneyAssigned: "Bobby Garcia",
      locationLabel: "Rio Grande Valley, TX",
    };
  }
  if (stateUpper === "TX") {
    return {
      geoTag: "TX-Other",
      attorneyAssigned: "Texas General Network",
      locationLabel: "Texas",
    };
  }
  return {
    geoTag: "National",
    attorneyAssigned: "National Network",
    locationLabel: state,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      phone,
      email,
      state,
      city,
      zip,
      timing,
      injuries,
      source,
      language,
      ttclid,
      ttp,
      tiktokEventId,
      pageUrl,
    } = body;

    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
    const brand = brandFromHost(host);
    const cfg = BRAND_CONFIG[brand];
    const siteOrigin = siteOriginFromHeaders(req.headers);

    if (!firstName || !phone || !state || !timing) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailTrimmed = typeof email === "string" ? email.trim() : "";
    if (!emailTrimmed || !EMAIL_RE.test(emailTrimmed)) {
      return NextResponse.json({ error: "Missing or invalid email" }, { status: 400 });
    }

    const geo = geoRoute(state ?? "", city, zip);
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
        <h1 style="color:white;margin:0;font-size:24px;">NEW ${cfg.name.toUpperCase()} LEAD</h1>
      </div>
      <div style="background:#f9f9f9;padding:24px;border:1px solid #e0e0e0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;width:140px;">Name</td><td style="padding:8px 0;color:#1C1C1E;">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">Phone</td><td style="padding:8px 0;color:#1C1C1E;"><a href="tel:${phone}" style="color:#C41230;">${phone}</a></td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">State</td><td style="padding:8px 0;color:#1C1C1E;">${state}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">Geo</td><td style="padding:8px 0;color:#1C1C1E;">${geo.geoTag} — ${geo.attorneyAssigned} (${geo.locationLabel})</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">Injury Type</td><td style="padding:8px 0;color:#1C1C1E;">${injuryRows.join(", ")}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">Accident Timing</td><td style="padding:8px 0;color:#1C1C1E;">${timing}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">Source</td><td style="padding:8px 0;color:#1C1C1E;">${source || cfg.ghlSource}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">Language</td><td style="padding:8px 0;color:#1C1C1E;">${language || "English"}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#444;">Submitted</td><td style="padding:8px 0;color:#1C1C1E;">${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}</td></tr>
        </table>
        <div style="margin-top:20px;text-align:center;">
          <a href="tel:${phone}" style="background:#C41230;color:white;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:16px;display:inline-block;">📞 Call ${firstName} Now</a>
        </div>
      </div>
      <div style="background:#0D1B2A;padding:16px;text-align:center;">
        <p style="color:#888;font-size:12px;margin:0;">${cfg.name} — ${cfg.phone} — ${siteOrigin}</p>
      </div>
    </div>
  `;

    const teamSmsBody = `🚨 NEW ${cfg.name.toUpperCase()} LEAD\n👤 ${firstName} ${lastName}\n📞 ${phone}\n📍 ${state} (${geo.geoTag})\n⚖️ ${geo.attorneyAssigned}\n🤕 ${injuryRows.join(", ")}\n⏱ ${timing}\n🌐 Source: ${source || cfg.ghlSource}\n\nCall them now → tap: ${phone}`;

    const twimlSay = `<Response><Say voice="alice">New ${cfg.name} lead. ${firstName} from ${state}. Geo ${geo.geoTag}. Injury type: ${injuryRows.join(" and ")}. Their number is ${phone.split("").join(" ")}. Calling them now.</Say></Response>`;

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip")?.trim() ||
      null;
    const userAgent = req.headers.get("user-agent");

    const tiktokBase = {
      email: emailTrimmed,
      phoneE164: e164Phone,
      pageUrl: typeof pageUrl === "string" ? pageUrl : absoluteUrl("/", siteOrigin),
      ip: clientIp,
      userAgent,
      ttclid: typeof ttclid === "string" ? ttclid : null,
      ttp: typeof ttp === "string" ? ttp : null,
      eventId: typeof tiktokEventId === "string" ? tiktokEventId : undefined,
      state,
      contentName: cfg.tiktokContentName,
      brand,
    };

    const retellAgentId = cfg.retellAgentId?.trim() || process.env.RETELL_AGENT_ID?.trim() || "";

    const settledLabels = [
      "twilio_lead_sms",
      "retell",
      "ghl",
      "tiktok_submit_form",
      "tiktok_lead",
      "tiktok_complete_registration",
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
      twilioClient.messages.create({
        body: `Hi ${firstName}! We received your injury case request (${emailTrimmed}). An attorney's team is calling you right now. Questions? Reply anytime.`,
        from: twilioFrom,
        to: e164Phone,
      }),

      retellAgentId
        ? fetch("https://api.retellai.com/v2/create-phone-call", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.RETELL_API_KEY!}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from_number: twilioFrom,
              to_number: e164Phone,
              agent_id: retellAgentId,
              retell_llm_dynamic_variables: {
                lead_name: firstName,
                lead_email: emailTrimmed,
                lead_state: state,
                accident_timing: timing,
                injury_types: injuries?.join(", ") || "Not specified",
                geo_tag: geo.geoTag,
                attorney_assigned: geo.attorneyAssigned,
              },
            }),
          })
        : Promise.reject(new Error("RETELL_AGENT_ID not configured for brand")),

      process.env.GHL_WEBHOOK_URL
        ? fetch(process.env.GHL_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: fullName,
              email: emailTrimmed,
              phone: e164Phone,
              state,
              city: city ?? "",
              zip: zip ?? "",
              accident_timing: timing,
              injury_types: injuries?.join(", ") || "Not specified",
              source: cfg.ghlSource,
              tags: [geo.geoTag, cfg.ghlSource, "MVA"],
              geo_tag: geo.geoTag,
              attorney_assigned: geo.attorneyAssigned,
              timestamp: new Date().toISOString(),
            }),
          })
        : Promise.reject(new Error("GHL_WEBHOOK_URL not configured")),

      Promise.all([
        trackTikTokSubmitForm(tiktokBase),
        trackTikTokLead(tiktokBase),
        trackTikTokCompleteRegistration(tiktokBase),
      ]),

      resendClient
        ? resendClient.emails.send({
            from: process.env.RESEND_FROM!,
            to: "scott.tischler@gmail.com",
            subject: `🚨 New ${cfg.name} Lead — ${firstName} ${lastName} — ${state} (${geo.geoTag})`,
            html: leadNotificationHtml,
          })
        : Promise.reject(new Error("RESEND_API_KEY not configured")),

      resendClient
        ? resendClient.emails.send({
            from: process.env.RESEND_FROM!,
            to: "cathycarr88@gmail.com",
            subject: `🚨 New ${cfg.name} Lead — ${firstName} ${lastName} — ${state} (${geo.geoTag})`,
            html: leadNotificationHtml,
          })
        : Promise.reject(new Error("RESEND_API_KEY not configured")),

      twilioClient.calls.create({
        to: "+18156080449",
        from: twilioFrom,
        twiml: twimlSay,
      }),

      twilioClient.calls.create({
        to: "+14142027718",
        from: twilioFrom,
        twiml: twimlSay,
      }),

      twilioClient.calls.create({
        to: "+14148655518",
        from: twilioFrom,
        twiml: twimlSay,
      }),

      twilioClient.messages.create({
        to: "+18156080449",
        from: twilioFrom,
        body: teamSmsBody,
      }),

      twilioClient.messages.create({
        to: "+14142027718",
        from: twilioFrom,
        body: teamSmsBody,
      }),

      twilioClient.messages.create({
        to: "+14148655518",
        from: twilioFrom,
        body: teamSmsBody,
      }),
    ]);

    try {
      if (process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID) {
        await fetch("https://services.leadconnectorhq.com/contacts/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GHL_API_KEY}`,
            Version: "2021-07-28",
          },
          body: JSON.stringify({
            firstName,
            lastName: lastName ?? "",
            phone,
            email: emailTrimmed,
            locationId: process.env.GHL_LOCATION_ID,
            tags: [geo.geoTag, cfg.ghlSource, "MVA"],
            source: cfg.ghlSource,
            customFields: [
              { key: "geo_tag", field_value: geo.geoTag },
              { key: "attorney_assigned", field_value: geo.attorneyAssigned },
              { key: "injuries", field_value: (body.injuries ?? []).join(", ") },
              { key: "timing", field_value: body.timing ?? "" },
            ],
          }),
        });
      }
    } catch (e) {
      console.error("GHL v2 upsert error (non-fatal):", e);
    }

    try {
      await insertLead({
        firstName,
        lastName,
        phone,
        email: emailTrimmed,
        state,
        timing,
        injuries: injuryRows,
        source: source || cfg.ghlSource,
        ghlSynced: true,
        geo_tag: geo.geoTag,
        attorney_assigned: geo.attorneyAssigned,
        city: typeof city === "string" ? city : undefined,
        zip: typeof zip === "string" ? zip : undefined,
      });
    } catch (e) {
      console.error("insertLead error (non-fatal):", e);
    }

    const errors: string[] = [];

    results.forEach((r, i) => {
      const label = settledLabels[i] ?? `task_${i}`;
      if (r.status === "rejected") {
        console.error(`${label} failed:`, r.reason);
        errors.push(label);
      }
    });

    return NextResponse.json({
      success: true,
      ...(errors.length > 0 && { warnings: errors }),
    });
  } catch (err) {
    console.error("Submit handler error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
