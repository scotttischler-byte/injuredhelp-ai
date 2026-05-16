import { NextRequest, NextResponse } from "next/server";
import { trackTikTokCompleteRegistration } from "@/lib/tiktok-events";
import { absoluteUrl, siteOriginFromHeaders } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Server-side CompleteRegistration after thank-you (pairs with browser pixel). */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      tiktokEventId?: string;
      email?: string;
      phone?: string;
      ttclid?: string;
      ttp?: string;
      pageUrl?: string;
    };

    const emailTrimmed = body.email?.trim() ?? "";
    if (!body.tiktokEventId || !emailTrimmed || !body.phone || !EMAIL_RE.test(emailTrimmed)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const cleanPhone = body.phone.replace(/\D/g, "");
    const e164Phone = cleanPhone.startsWith("1") ? `+${cleanPhone}` : `+1${cleanPhone}`;

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip")?.trim() ||
      null;

    const origin = siteOriginFromHeaders(req.headers);
    const result = await trackTikTokCompleteRegistration({
      email: emailTrimmed,
      phoneE164: e164Phone,
      eventId: body.tiktokEventId,
      pageUrl: body.pageUrl ?? absoluteUrl("/thank-you", origin),
      ip: clientIp,
      userAgent: req.headers.get("user-agent"),
      ttclid: body.ttclid ?? null,
      ttp: body.ttp ?? null,
    });

    return NextResponse.json({ ok: result.ok });
  } catch (err) {
    console.error("tiktok complete route error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
