import { NextRequest, NextResponse } from "next/server";
import { brandFromHost } from "@/lib/site";

export async function GET(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const brand = brandFromHost(host);
  return NextResponse.json({
    status: "ok",
    brand,
    host,
    timestamp: new Date().toISOString(),
  });
}
