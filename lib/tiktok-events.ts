import { createHash, randomUUID } from "crypto";

const TIKTOK_TRACK_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** TikTok Advanced Matching: lowercase + trim before SHA-256. */
export function hashEmailForTikTok(email: string): string {
  return sha256(email.trim().toLowerCase());
}

/** TikTok Advanced Matching: E.164 with leading + before SHA-256. */
export function hashPhoneForTikTok(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  return sha256(`+${digits}`);
}

export type TikTokServerEventInput = {
  event: string;
  email: string;
  phoneE164: string;
  pageUrl?: string;
  ip?: string | null;
  userAgent?: string | null;
  ttclid?: string | null;
  ttp?: string | null;
  eventId?: string;
  state?: string;
  contentName?: string;
};

function getTikTokConfig() {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN?.trim();
  const pixelId = (
    process.env.TIKTOK_PIXEL_ID?.trim() ||
    process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim() ||
    "D83MMQ3C77U9FQKB73JG"
  ).toUpperCase();
  return { accessToken, pixelId };
}

export async function trackTikTokServerEvent(
  input: TikTokServerEventInput,
): Promise<{ ok: boolean; error?: string }> {
  const { accessToken, pixelId } = getTikTokConfig();

  if (!accessToken) {
    console.error(`tiktok_${input.event}: TIKTOK_ACCESS_TOKEN not configured`);
    return { ok: false, error: "not_configured" };
  }

  const eventId = input.eventId ?? `${input.event.toLowerCase()}_${randomUUID()}`;
  const eventTime = Math.floor(Date.now() / 1000);

  const contextUser: Record<string, string> = {
    email: hashEmailForTikTok(input.email),
    phone_number: hashPhoneForTikTok(input.phoneE164),
  };
  if (input.ttclid?.trim()) contextUser.ttclid = input.ttclid.trim();
  if (input.ttp?.trim()) contextUser.ttp = input.ttp.trim();

  const eventData: Record<string, unknown> = {
    event: input.event,
    event_id: eventId,
    event_time: eventTime,
    context: {
      page: {
        url: input.pageUrl ?? "https://www.injuredhelp.ai/",
      },
      user: contextUser,
    },
    properties: {
      content_type: "lead_form",
      content_name: input.contentName ?? input.state ?? "injury_case_request",
    },
  };

  if (input.ip) {
    (eventData.context as Record<string, unknown>).ip = input.ip;
  }
  if (input.userAgent) {
    (eventData.context as Record<string, unknown>).user_agent = input.userAgent;
  }

  try {
    const res = await fetch(TIKTOK_TRACK_URL, {
      method: "POST",
      headers: {
        "Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_source: "web",
        event_source_id: pixelId,
        data: [eventData],
      }),
    });

    const payload = (await res.json().catch(() => null)) as {
      code?: number;
      message?: string;
    } | null;

    if (!res.ok) {
      console.error(`tiktok_${input.event}: HTTP error`, res.status, payload);
      return { ok: false, error: `http_${res.status}` };
    }

    if (payload?.code !== undefined && payload.code !== 0) {
      console.error(`tiktok_${input.event}: API error`, payload);
      return { ok: false, error: `api_${payload.code}` };
    }

    return { ok: true };
  } catch (err) {
    console.error(`tiktok_${input.event}: request failed`, err);
    return { ok: false, error: "fetch_failed" };
  }
}

export type TikTokLeadInput = Omit<TikTokServerEventInput, "event">;

function baseEventFields(input: TikTokLeadInput) {
  return {
    email: input.email,
    phoneE164: input.phoneE164,
    pageUrl: input.pageUrl,
    ip: input.ip,
    userAgent: input.userAgent,
    ttclid: input.ttclid,
    ttp: input.ttp,
    state: input.state,
    contentName: input.contentName,
  };
}

export async function trackTikTokSubmitForm(input: TikTokLeadInput) {
  return trackTikTokServerEvent({
    event: "SubmitForm",
    eventId: input.eventId,
    ...baseEventFields(input),
  });
}

export async function trackTikTokLead(input: TikTokLeadInput) {
  return trackTikTokServerEvent({
    event: "Lead",
    eventId: input.eventId ? `${input.eventId}_lead` : undefined,
    ...baseEventFields(input),
  });
}

export async function trackTikTokCompleteRegistration(input: TikTokLeadInput) {
  return trackTikTokServerEvent({
    event: "CompleteRegistration",
    eventId: input.eventId ? `${input.eventId}_complete` : undefined,
    ...baseEventFields({ ...input, contentName: input.contentName ?? "thank_you" }),
  });
}
