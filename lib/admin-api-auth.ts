import { NextRequest } from "next/server";
import { ADMIN_COOKIE, expectedAdminCookieValue } from "@/lib/admin-session";

export async function verifyAdminCookie(req: NextRequest): Promise<boolean> {
  const expected = await expectedAdminCookieValue();
  if (!expected) return false;
  return req.cookies.get(ADMIN_COOKIE)?.value === expected;
}
