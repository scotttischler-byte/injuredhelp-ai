#!/usr/bin/env node
/**
 * Sanity-check TwiML for press-1 team connect (no live call placed).
 * Run: node scripts/test-team-ivr-twiml.mjs
 */
import twilio from "twilio";

const lead = "+15551234567";
const name = "Test";
const state = "TX";
const base = "https://www.wreckmatch.com";

function teamIvrCallbackUrl() {
  const q = new URLSearchParams({ lead, name, state, geo: "National" });
  return `${base}/api/twilio/connect?${q.toString()}`;
}

const vr = new twilio.twiml.VoiceResponse();
const gather = vr.gather({
  numDigits: 1,
  action: teamIvrCallbackUrl(),
  method: "POST",
  timeout: 12,
});
gather.say(
  { voice: "alice" },
  `New Wreck Match lead. ${name} from ${state}. Press 1 now to connect to their phone.`,
);

const xml = vr.toString();
if (!xml.includes("<Gather") || !xml.includes("Press 1")) {
  console.error("FAIL: team-ivr TwiML missing Gather or Press 1");
  process.exit(1);
}

const connect = new twilio.twiml.VoiceResponse();
connect.say({ voice: "alice" }, "Connecting you now.");
const dial = connect.dial({ answerOnBridge: true, timeout: 30 });
dial.number(lead);
const connectXml = connect.toString();
if (!connectXml.includes("<Dial") || !connectXml.includes(lead)) {
  console.error("FAIL: connect TwiML missing Dial or lead number");
  process.exit(1);
}

console.log("OK team-ivr TwiML structure");
console.log("OK connect TwiML structure");
console.log("\nDeploy checklist:");
console.log("1. Set SITE_URL / VERCEL_URL so Twilio webhooks hit https://www.wreckmatch.com");
console.log("2. In GHL workflow, DISABLE separate outbound calls to team (Twilio handles press-1)");
console.log("3. TEAM_NOTIFICATION_PHONES=+1... (one number gets the IVR; others get SMS only)");
