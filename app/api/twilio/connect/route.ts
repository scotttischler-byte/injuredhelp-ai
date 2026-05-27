import type { NextRequest } from "next/server";
import twilio from "twilio";
import {
  readTwilioFormBody,
  twimlResponse,
  validateTwilioWebhook,
} from "@/lib/twilio-voice";

export const runtime = "nodejs";

function qp(req: NextRequest, key: string): string {
  return req.nextUrl.searchParams.get(key)?.trim() ?? "";
}

function spokenPhone(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  return digits.split("").join(" ");
}

export async function POST(req: NextRequest) {
  const lead = qp(req, "lead");
  const name = qp(req, "name") || "the lead";
  const state = qp(req, "state") || "";

  const form = await readTwilioFormBody(req);
  if (!validateTwilioWebhook(req, form)) {
    return new Response("Forbidden", { status: 403 });
  }

  const digit = form.Digits ?? "";
  const vr = new twilio.twiml.VoiceResponse();
  const from = process.env.TWILIO_PHONE_NUMBER?.trim();

  if (digit === "1" && lead) {
    vr.say({ voice: "alice" }, `Connecting you to ${name} now.`);
    const dial = vr.dial({
      callerId: from,
      answerOnBridge: true,
      timeout: 30,
    });
    dial.number(lead);
    return twimlResponse(vr);
  }

  if (digit === "2" && lead) {
    vr.say(
      { voice: "alice" },
      `The lead number is ${spokenPhone(lead)}. Press 1 to connect, or hang up to call back manually.`,
    );
    const gather = vr.gather({
      numDigits: 1,
      action: req.nextUrl.toString(),
      method: "POST",
      timeout: 10,
    });
    gather.say({ voice: "alice" }, "Press 1 to connect now.");
    return twimlResponse(vr);
  }

  vr.say(
    { voice: "alice" },
    `Invalid selection. ${name} in ${state}. Number ${spokenPhone(lead)}. Goodbye.`,
  );
  return twimlResponse(vr);
}

export async function GET(req: NextRequest) {
  return POST(req);
}
