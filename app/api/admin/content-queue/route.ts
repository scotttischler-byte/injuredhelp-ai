import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCookie } from "@/lib/admin-api-auth";
import { addContentQueueItem } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!(await verifyAdminCookie(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as
    | { topic?: string; type?: string; target_keyword?: string; state?: string; city?: string }
    | null;
  if (!body?.topic || !body?.type) {
    return NextResponse.json({ error: "topic and type are required" }, { status: 400 });
  }
  try {
    await addContentQueueItem({
      topic: body.topic,
      type: body.type,
      target_keyword: body.target_keyword,
      state: body.state,
      city: body.city,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
