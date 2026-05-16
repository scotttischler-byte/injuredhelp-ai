import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => null);
    if (!payload) return NextResponse.json({ ok: true });

    const tags: string[] = payload?.tags ?? [];
    const contact = payload?.contact ?? payload;
    const name = contact?.firstName ?? contact?.name ?? "Unknown";
    const phone = contact?.phone ?? "";
    const source = contact?.source ?? "unknown";

    console.log(`[GHL Webhook] ${name} | ${phone} | source: ${source} | tags: ${tags.join(", ")}`);

    if (tags.includes("Qualified")) {
      console.log(`[GHL] QUALIFIED: ${name} ${phone}`);
    }
    if (tags.includes("Booked")) {
      console.log(`[GHL] BOOKED: ${name} ${phone}`);
    }
    if (tags.includes("RGV")) {
      console.log(`[GHL] RGV → Bobby Garcia: ${name} ${phone}`);
    }
    if (tags.includes("TX-Other")) {
      console.log(`[GHL] TX-Other → Texas General: ${name} ${phone}`);
    }
  } catch (err) {
    console.error("[GHL Webhook] parse error:", err);
  }

  return NextResponse.json({ ok: true });
}
