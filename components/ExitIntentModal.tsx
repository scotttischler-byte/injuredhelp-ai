"use client";

import { useCallback, useEffect, useState } from "react";
import { LeadForm } from "@/components/LeadForm";
import { WRECKMATCH_PHONE_ACTIVATION_NOTE } from "@/lib/phones";

const STORAGE_KEY = "wm-exit-intent-shown";

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const onLeave = (e: MouseEvent) => {
      // Only when pointer actually leaves the page upward (not random mouseout bubbles)
      if (e.clientY > 0) return;
      const to = e.relatedTarget as Node | null;
      if (to !== null) return;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
      document.body.style.overflow = "hidden";
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.documentElement.addEventListener("mouseout", onLeave);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.removeEventListener("mouseout", onLeave);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      onClick={close}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-emerald-500/40 bg-slate-950 p-4 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
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
