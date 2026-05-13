import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, expectedAdminCookieValue } from "@/lib/admin-session";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password?.trim() ?? "";
  const expected = await expectedAdminCookieValue();
  if (!expected) {
    return NextResponse.json({ ok: false, error: "Admin password is not configured" }, { status: 501 });
  }
  if (!password || password !== process.env.ADMIN_PASSWORD?.trim()) {
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: expected,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
