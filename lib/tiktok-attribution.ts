/** Client-side TikTok Pixel helpers (browser). */

import { brandFromWindowHost, tiktokContentNameFromWindow } from "@/lib/brand-client";
import { isTikTokPixelProductionEnabled } from "@/lib/tiktok-pixel";

type Ttq = {
  track: (event: string, props?: Record<string, unknown>) => void;
  identify?: (props: Record<string, unknown>) => void;
  page?: () => void;
};

function getTtq(): Ttq | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as Window & { ttq?: Ttq }).ttq;
}

/** Production + WreckMatch host only (matches layout pixel gating). */
export function isTikTokBrowserTrackingEnabled(): boolean {
  if (!isTikTokPixelProductionEnabled()) return false;
  return brandFromWindowHost() === "wreckmatch";
}

/** E.164 for TikTok Advanced Matching (US leads). */
export function phoneToTikTokE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

function trackBrowser(event: string, props?: Record<string, unknown>): void {
  if (!isTikTokBrowserTrackingEnabled()) return;
  try {
    getTtq()?.track?.(event, props);
  } catch {
    /* ignore */
  }
}

function oncePerSession(key: string): boolean {
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, "1");
    return true;
  } catch {
    return true;
  }
}

/** TikTok click / cookie values for Events API match keys. */
export function getTikTokAttribution(): { ttclid?: string; ttp?: string } {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("ttclid");
  if (fromUrl) {
    try {
      sessionStorage.setItem("wreckmatch_ttclid", fromUrl);
    } catch {
      /* ignore */
    }
  }

  let ttclid: string | undefined;
  try {
    ttclid = fromUrl ?? sessionStorage.getItem("wreckmatch_ttclid") ?? undefined;
  } catch {
    ttclid = fromUrl ?? undefined;
  }

  const ttpMatch = document.cookie.match(/(?:^|;\s*)_ttp=([^;]+)/);
  const ttp = ttpMatch?.[1];

  return { ...(ttclid ? { ttclid } : {}), ...(ttp ? { ttp } : {}) };
}

export function newTikTokEventId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `lead_${crypto.randomUUID()}`;
  }
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Advanced Matching: plain email + E.164 phone (TikTok hashes client-side).
 * Must run before ttq.track('Lead').
 */
export function identifyTikTokUser(email: string, phone: string): void {
  if (!isTikTokBrowserTrackingEnabled()) return;
  const ttq = getTtq();
  if (!ttq?.identify) return;

  const emailNorm = email.trim().toLowerCase();
  const phone_number = phoneToTikTokE164(phone);
  if (!emailNorm && !phone_number) return;

  try {
    ttq.identify({
      ...(emailNorm ? { email: emailNorm } : {}),
      ...(phone_number ? { phone_number } : {}),
    });
  } catch {
    /* ignore */
  }
}

/**
 * On successful lead submit: identify → SubmitForm → Lead (browser pixel).
 */
export function trackTikTokLeadConversion(params: {
  eventId: string;
  email: string;
  phone: string;
  contentName?: string;
}): void {
  if (!isTikTokBrowserTrackingEnabled()) return;

  const content_name = params.contentName ?? tiktokContentNameFromWindow();

  identifyTikTokUser(params.email, params.phone);

  trackBrowser("SubmitForm", {
    event_id: params.eventId,
    content_type: "lead_form",
    content_name,
  });

  trackBrowser("Lead", {
    event_id: `${params.eventId}_lead`,
    content_type: "lead_form",
    content_name,
  });
}

/** Top-of-funnel: landing / form page viewed (once per session key). */
export function trackTikTokViewContent(props?: {
  content_name?: string;
  sessionKey?: string;
}): void {
  const sessionKey = props?.sessionKey ?? "wm_tiktok_viewcontent";
  if (!oncePerSession(sessionKey)) return;
  trackBrowser("ViewContent", {
    content_type: "lead_form",
    content_name: props?.content_name ?? tiktokContentNameFromWindow(),
  });
}

export type TikTokLeadSessionPayload = {
  tiktokEventId: string;
  email: string;
  phone: string;
  ttclid?: string;
  ttp?: string;
};

export function saveTikTokLeadSession(payload: TikTokLeadSessionPayload): void {
  try {
    sessionStorage.setItem("wm_tiktok_lead", JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function loadTikTokLeadSession(): TikTokLeadSessionPayload | null {
  try {
    const raw = sessionStorage.getItem("wm_tiktok_lead");
    if (!raw) return null;
    return JSON.parse(raw) as TikTokLeadSessionPayload;
  } catch {
    return null;
  }
}

/** Mid-funnel: primary CTA clicked. */
export function trackTikTokClickButton(buttonName: string): void {
  trackBrowser("ClickButton", {
    content_name: buttonName,
  });
}

/** @deprecated Use trackTikTokLeadConversion after successful submit. */
export function trackTikTokSubmitForm(eventId: string): void {
  trackBrowser("SubmitForm", {
    event_id: eventId,
    content_type: "lead_form",
    content_name: "injury_case_request",
  });
}

/** @deprecated Use trackTikTokLeadConversion after successful submit. */
export function trackTikTokLeadBrowser(eventId: string): void {
  trackBrowser("Lead", {
    event_id: `${eventId}_lead`,
    content_type: "lead_form",
    content_name: "injury_case_request",
  });
}

/** Post-conversion: thank-you page (once per event id). */
export function trackTikTokCompleteRegistration(eventId: string): void {
  const key = `wm_tiktok_complete_${eventId}`;
  if (!oncePerSession(key)) return;
  trackBrowser("CompleteRegistration", {
    event_id: `${eventId}_complete`,
    content_type: "lead_form",
    content_name: "thank_you",
  });
}
