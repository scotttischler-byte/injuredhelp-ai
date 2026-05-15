"use client";

import { FormEvent, useState } from "react";
import {
  getTikTokAttribution,
  newTikTokEventId,
  trackTikTokLeadBrowser,
} from "@/lib/tiktok-attribution";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function WebinarRegisterForm({ slug }: { slug: string }) {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      const tiktokEventId = newTikTokEventId();
      const { ttclid, ttp } = getTikTokAttribution();
      trackTikTokLeadBrowser(tiktokEventId);

      const submitBody = {
        firstName,
        lastName: "-",
        phone,
        email,
        state,
        timing: "Within the last 30 days",
        injuries: ["❓ Not Sure"],
        source: "webinar-registration",
        ttclid,
        ttp,
        tiktokEventId,
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      };

      const submitRes = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitBody),
      });
      if (!submitRes.ok) throw new Error("submit");

      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName: "-",
          phone,
          email,
          state,
          timing: submitBody.timing,
          injuries: submitBody.injuries,
          source: "webinar-registration",
        }),
      }).catch(() => undefined);

      const reg = await fetch("/api/webinars/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webinar_slug: slug, first_name: firstName, email, phone, state }),
      });
      if (!reg.ok) throw new Error("register");

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "webinar_registered" });

      setStatus("done");
      setMessage("You're registered! Check your email for the join link.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "done") {
    return <p className="text-sm text-green-400">{message}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-400">First name</label>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-400">State</label>
          <input
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-400">Phone</label>
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-400">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
        />
      </div>
      {message && status === "error" ? <p className="text-sm text-red-400">{message}</p> : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-500 disabled:opacity-60"
      >
        {status === "loading" ? "Registering…" : "Register free"}
      </button>
      <p className="text-xs text-gray-500">
        By registering you agree to be contacted by phone/SMS/email. WreckMatch is a referral service, not a law firm.
      </p>
    </form>
  );
}
