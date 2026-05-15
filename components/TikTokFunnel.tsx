"use client";

import { useEffect } from "react";
import { trackTikTokViewContent } from "@/lib/tiktok-attribution";

/** Fires ViewContent once per session on the homepage. */
export function TikTokHomeFunnel() {
  useEffect(() => {
    trackTikTokViewContent({ content_name: "injuredhelp_home" });
  }, []);
  return null;
}

/** Thank-you ViewContent (CompleteRegistration fires on form submit success). */
export function TikTokThankYouFunnel() {
  useEffect(() => {
    trackTikTokViewContent({
      content_name: "thank_you_confirmation",
      sessionKey: "wm_tiktok_viewcontent_thankyou",
    });
  }, []);
  return null;
}
