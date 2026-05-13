import { NextRequest, NextResponse } from "next/server";
import { incrementEmailEngagement } from "@/lib/db";

type ResendEvent = {
  type?: string;
  data?: {
    email_id?: string;
    to?: string[];
    click?: { link?: string };
  };
};

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  if (secret) {
    const sig = req.headers.get("svix-signature");
    if (!sig) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  const payload = (await req.json().catch(() => null)) as ResendEvent | null;
  const type = payload?.type ?? "";
  const email = payload?.data?.to?.[0];
  if (!email) return NextResponse.json({ ok: true, ignored: true });

  if (type.includes("email.opened") || type.includes("open")) {
    await incrementEmailEngagement(email, "open");
  }
  if (type.includes("email.clicked") || type.includes("click")) {
    await incrementEmailEngagement(email, "click");
  }

  return NextResponse.json({ ok: true });
}
