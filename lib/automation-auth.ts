import { NextRequest } from "next/server";

export function verifyCronSecret(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

export function verifyContentApiKey(req: NextRequest): boolean {
  const key = process.env.CONTENT_API_KEY?.trim();
  if (!key) return false;
  return (req.headers.get("x-api-key") ?? "") === key;
}
