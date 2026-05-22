"use client";

import { useEffect, useState } from "react";
import { LeadForm } from "@/components/LeadForm";
import { WRECKMATCH_PHONE_ACTIVATION_NOTE } from "@/lib/phones";

const STORAGE_KEY = "wm-exit-intent-shown";

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 12) return;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
    };

    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-emerald-500/40 bg-slate-950 p-4 shadow-2xl sm:p-6">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 rounded-lg px-2 py-1 text-2xl leading-none text-slate-400 hover:bg-slate-800 hover:text-white"
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="exit-intent-title" className="pr-8 text-xl font-bold text-white">
          Wait — free attorney matching in 60 seconds
        </h2>
        <p className="mt-2 text-sm text-slate-400">{WRECKMATCH_PHONE_ACTIVATION_NOTE}</p>
        <div className="mt-4">
          <LeadForm source="exit-intent" variant="conversion" />
        </div>
      </div>
    </div>
  );
}
