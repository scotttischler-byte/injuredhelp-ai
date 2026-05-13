import { NextRequest, NextResponse } from "next/server";
import { insertLead } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mirrors lead capture for the admin dashboard (does not replace GHL / Twilio / Retell). */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
      state?: string;
      timing?: string;
      injuries?: string[];
      source?: string;
    };

    const emailTrimmed = body.email?.trim() ?? "";
    if (!body.firstName || !body.phone || !body.state || !emailTrimmed || !EMAIL_RE.test(emailTrimmed)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await insertLead({
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      email: emailTrimmed,
      state: body.state,
      timing: body.timing,
      injuries: body.injuries,
      source: body.source,
      // GHL sync is tracked separately; successful /api/submit implies handoff attempted.
      ghlSynced: true,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Lead log error:", e);
    return NextResponse.json({ error: "Unable to store lead" }, { status: 500 });
  }
}
