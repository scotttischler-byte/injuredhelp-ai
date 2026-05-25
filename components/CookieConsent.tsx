"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signalAnalyticsLoad } from "@/components/DeferredAnalytics";

const STORAGE_KEY = "wreckmatch_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* ignore */
    }

    const show = () => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
      } catch {
        setVisible(true);
      }
    };

    const timer = window.setTimeout(show, 5000);
    window.addEventListener("scroll", show, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", show);
    };
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* ignore */
    }
    signalAnalyticsLoad();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[70] border-t border-gray-700 bg-gray-950 px-4 py-3 shadow-2xl md:py-4"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-gray-300">
          We use cookies to improve your experience and track conversions. By continuing, you agree to our{" "}
          <Link href="/privacy" className="text-red-400 underline hover:text-red-300">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex w-full shrink-0 gap-2 md:w-auto">
          <button
            type="button"
            onClick={accept}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-500 md:flex-none"
          >
            Accept
          </button>
          <Link
            href="/privacy"
            className="flex-1 rounded-lg border border-gray-600 px-4 py-2 text-center text-sm font-medium text-white transition-all duration-200 hover:bg-gray-800 md:flex-none"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
