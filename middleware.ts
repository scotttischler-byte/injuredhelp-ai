import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, expectedAdminCookieValue } from "@/lib/admin-session";
import { brandFromHost } from "@/lib/site";
import { BRAND_HEADER } from "@/lib/request-brand";

/** Vercel/CDN often set x-forwarded-host; prefer it over host for multi-domain routing. */
function requestHost(req: NextRequest): string | undefined {
  const raw =
    req.headers.get("x-forwarded-host")?.split(",")[0] ??
    req.headers.get("host") ??
    "";
  return raw.split(":")[0]?.toLowerCase() || undefined;
}

function rewriteWithBrand(req: NextRequest, url: URL): NextResponse {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(BRAND_HEADER, brandFromHost(requestHost(req)));
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const whatToDoMatch = pathname.match(/^\/what-to-do-after-a-car-accident-in-([a-z0-9-]+)\/?$/i);
  if (whatToDoMatch) {
    const url = req.nextUrl.clone();
    url.pathname = `/what-to-do-after-a-car-accident-in/${whatToDoMatch[1]}`;
    return rewriteWithBrand(req, url);
  }

  const geoVariantMatch = pathname.match(
    /^\/car-accident-help-([a-z0-9-]+)\/(truck|rideshare|motorcycle)\/?$/i,
  );
  if (geoVariantMatch) {
    const url = req.nextUrl.clone();
    url.pathname = `/car-accident-help/${geoVariantMatch[1]}/${geoVariantMatch[2]}`;
    return rewriteWithBrand(req, url);
  }

  const geoMatch = pathname.match(/^\/car-accident-help-([a-z0-9-]+)\/?$/i);
  if (geoMatch) {
    const url = req.nextUrl.clone();
    url.pathname = `/car-accident-help/${geoMatch[1]}`;
    return rewriteWithBrand(req, url);
  }

  const host = requestHost(req);
  if (host === "wreckmatch.com") {
    const url = req.nextUrl.clone();
    url.hostname = "www.wreckmatch.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }
  if (host === "semitruckmatch.com") {
    const url = req.nextUrl.clone();
    url.hostname = "www.semitruckmatch.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(BRAND_HEADER, brandFromHost(requestHost(req)));
  const passThrough = () =>
    NextResponse.next({
      request: { headers: requestHeaders },
    });

  if (!pathname.startsWith("/admin")) return passThrough();
  if (pathname.startsWith("/admin/login")) return passThrough();

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

  return passThrough();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|xml|webmanifest|pptx)$).*)",
  ],
};
