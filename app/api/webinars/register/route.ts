import { NextRequest, NextResponse } from "next/server";
import { insertSubscriber, insertWebinarRegistration } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      webinar_slug?: string;
      first_name?: string;
      email?: string;
      phone?: string;
      state?: string;
    };
    if (!body.webinar_slug || !body.first_name || !body.email || !body.phone || !body.state) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await insertWebinarRegistration({
      webinar_slug: body.webinar_slug,
      first_name: body.first_name,
      email: body.email,
      phone: body.phone,
      state: body.state,
    });

    await insertSubscriber({
      email: body.email,
      first_name: body.first_name,
      phone: body.phone,
      state: body.state,
      source: "webinar",
      sequence_name: "webinar",
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to register" }, { status: 500 });
  }
}
