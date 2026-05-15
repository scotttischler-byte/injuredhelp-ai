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

export type TikTokLeadInput = {
  email: string;
  phoneE164: string;
  pageUrl?: string;
  ip?: string | null;
  userAgent?: string | null;
  ttclid?: string | null;
  ttp?: string | null;
  eventId?: string;
  state?: string;
};

export async function trackTikTokLead(
  input: TikTokLeadInput,
): Promise<{ ok: boolean; error?: string }> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN?.trim();
  const pixelId = (
    process.env.TIKTOK_PIXEL_ID?.trim() ||
    process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim() ||
    "D83MMQ3C77U9FQKB73JG"
  ).toUpperCase();

  if (!accessToken) {
    console.error("tiktok_lead: TIKTOK_ACCESS_TOKEN not configured");
    return { ok: false, error: "not_configured" };
  }

  const eventId = input.eventId ?? `lead_${randomUUID()}`;
  const eventTime = Math.floor(Date.now() / 1000);

  const contextUser: Record<string, string> = {
    email: hashEmailForTikTok(input.email),
    phone_number: hashPhoneForTikTok(input.phoneE164),
  };
  if (input.ttclid?.trim()) contextUser.ttclid = input.ttclid.trim();
  if (input.ttp?.trim()) contextUser.ttp = input.ttp.trim();

  const eventData: Record<string, unknown> = {
    event: "Lead",
    event_id: eventId,
    event_time: eventTime,
    context: {
      page: {
        url: input.pageUrl ?? "https://www.injuredhelp.ai/",
      },
      user: contextUser,
    },
  };

  if (input.ip) {
    (eventData.context as Record<string, unknown>).ip = input.ip;
  }
  if (input.userAgent) {
    (eventData.context as Record<string, unknown>).user_agent = input.userAgent;
  }
  if (input.state) {
    eventData.properties = { content_name: input.state };
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
      console.error("tiktok_lead: HTTP error", res.status, payload);
      return { ok: false, error: `http_${res.status}` };
    }

    if (payload?.code !== undefined && payload.code !== 0) {
      console.error("tiktok_lead: API error", payload);
      return { ok: false, error: `api_${payload.code}` };
    }

    return { ok: true };
  } catch (err) {
    console.error("tiktok_lead: request failed", err);
    return { ok: false, error: "fetch_failed" };
  }
}
