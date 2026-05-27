import twilio from "twilio";
import type { NextRequest } from "next/server";
import { absoluteUrl, serverSiteOrigin } from "@/lib/site";

export function twimlResponse(vr: twilio.twiml.VoiceResponse): Response {
  return new Response(vr.toString(), {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

export function validateTwilioWebhook(req: NextRequest, params: Record<string, string>): boolean {
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  if (!token) return false;
  const signature = req.headers.get("x-twilio-signature");
  if (!signature) return false;
  const url = req.nextUrl.toString();
  return twilio.validateRequest(token, signature, url, params);
}

export async function readTwilioFormBody(req: NextRequest): Promise<Record<string, string>> {
  const text = await req.text();
  const params: Record<string, string> = {};
  new URLSearchParams(text).forEach((v, k) => {
    params[k] = v;
  });
  return params;
}

export function teamIvrCallbackUrl(
  query: { lead: string; name: string; state: string; geo?: string },
  origin?: string,
): string {
  const base = origin ?? serverSiteOrigin();
  const q = new URLSearchParams({
    lead: query.lead,
    name: query.name,
    state: query.state,
    ...(query.geo ? { geo: query.geo } : {}),
  });
  return absoluteUrl(`/api/twilio/connect?${q.toString()}`, base);
}

export function teamIvrVoiceUrl(
  query: { lead: string; name: string; state: string; geo?: string },
  origin?: string,
): string {
  const base = origin ?? serverSiteOrigin();
  const q = new URLSearchParams({
    lead: query.lead,
    name: query.name,
    state: query.state,
    ...(query.geo ? { geo: query.geo } : {}),
  });
  return absoluteUrl(`/api/twilio/team-ivr?${q.toString()}`, base);
}
