import type { NextRequest } from "next/server";
import twilio from "twilio";
import {
  readTwilioFormBody,
  teamIvrCallbackUrl,
  twimlResponse,
  validateTwilioWebhook,
} from "@/lib/twilio-voice";

export const runtime = "nodejs";

function qp(req: NextRequest, key: string): string {
  return req.nextUrl.searchParams.get(key)?.trim() ?? "";
}

export async function POST(req: NextRequest) {
  const lead = qp(req, "lead");
  const name = qp(req, "name") || "the lead";
  const state = qp(req, "state") || "unknown state";
  const geo = qp(req, "geo");

  const form = await readTwilioFormBody(req);
  if (!validateTwilioWebhook(req, form)) {
    return new Response("Forbidden", { status: 403 });
  }

  const vr = new twilio.twiml.VoiceResponse();
  const gather = vr.gather({
    numDigits: 1,
    action: teamIvrCallbackUrl({ lead, name, state, geo }, req.nextUrl.origin),
    method: "POST",
    timeout: 12,
  });

  const geoLine = geo ? ` Geo tag ${geo}.` : "";
  gather.say(
    { voice: "alice" },
    `New Wreck Match lead. ${name} from ${state}.${geoLine} Press 1 now to connect to their phone. Press 2 to hear their number again.`,
  );

  vr.say({ voice: "alice" }, "No selection received. Goodbye.");
  return twimlResponse(vr);
}

/** Twilio may probe with GET during console setup. */
export async function GET(req: NextRequest) {
  return POST(req);
}
