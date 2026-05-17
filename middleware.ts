import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, expectedAdminCookieValue } from "@/lib/admin-session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public SEO URLs: /car-accident-help-wisconsin → internal /car-accident-help/wisconsin
  const geoMatch = pathname.match(/^\/car-accident-help-([a-z0-9-]+)\/?$/i);
  if (geoMatch) {
    const url = req.nextUrl.clone();
    url.pathname = `/car-accident-help/${geoMatch[1]}`;
    return NextResponse.rewrite(url);
  }

  const host = req.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (host === "wreckmatch.com") {
    const url = req.nextUrl.clone();
    url.hostname = "www.wreckmatch.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const expected = await expectedAdminCookieValue();
  if (!expected) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("reason", "not_configured");
    return NextResponse.redirect(url);
  }

  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (cookie !== expected) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|xml|webmanifest)$).*)",
  ],
};
