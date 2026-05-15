/** Client-side TikTok click / cookie values for Events API match keys. */
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

/** Browser pixel Lead (optional dedup with same event_id as server). */
export function trackTikTokLeadBrowser(eventId: string): void {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    ttq?: { track: (event: string, props?: Record<string, unknown>) => void };
  };
  try {
    w.ttq?.track?.("Lead", { event_id: eventId });
  } catch {
    /* ignore */
  }
}
