"use client";

import { useEffect } from "react";
import {
  loadTikTokLeadSession,
  trackTikTokCompleteRegistration,
  trackTikTokViewContent,
} from "@/lib/tiktok-attribution";

/** Fires ViewContent once per session on the homepage. */
export function TikTokHomeFunnel() {
  useEffect(() => {
    trackTikTokViewContent({ content_name: "injuredhelp_home" });
  }, []);
  return null;
}

/** Fires CompleteRegistration + thank-you ViewContent after a successful submit. */
export function TikTokThankYouFunnel({ eventId }: { eventId?: string }) {
  useEffect(() => {
    if (!eventId) return;

    trackTikTokCompleteRegistration(eventId);
    trackTikTokViewContent({
      content_name: "thank_you_confirmation",
      sessionKey: "wm_tiktok_viewcontent_thankyou",
    });

    const session = loadTikTokLeadSession();
    if (session?.tiktokEventId === eventId) {
      void fetch("/api/tiktok/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tiktokEventId: session.tiktokEventId,
          email: session.email,
          phone: session.phone,
          ttclid: session.ttclid,
          ttp: session.ttp,
          pageUrl: window.location.href,
        }),
      }).catch(() => undefined);
    }
  }, [eventId]);
  return null;
}
