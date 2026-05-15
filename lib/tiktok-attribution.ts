/** Client-side TikTok Pixel helpers (browser). */

type Ttq = {
  track: (event: string, props?: Record<string, unknown>) => void;
  identify?: (props: Record<string, unknown>) => void;
};

function getTtq(): Ttq | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as Window & { ttq?: Ttq }).ttq;
}

function trackBrowser(event: string, props?: Record<string, unknown>): void {
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

/** Top-of-funnel: landing / form page viewed (once per session key). */
export function trackTikTokViewContent(props?: {
  content_name?: string;
  sessionKey?: string;
}): void {
  const sessionKey = props?.sessionKey ?? "wm_tiktok_viewcontent";
  if (!oncePerSession(sessionKey)) return;
  trackBrowser("ViewContent", {
    content_type: "lead_form",
    content_name: props?.content_name ?? "injuredhelp_home",
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

/** Bottom-of-funnel: form submitted (pair with server SubmitForm + same event_id). */
export function trackTikTokSubmitForm(eventId: string): void {
  trackBrowser("SubmitForm", {
    event_id: eventId,
    content_type: "lead_form",
    content_name: "injury_case_request",
  });
}

/** Lead objective (many campaigns optimize on Lead). */
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
