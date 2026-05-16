"use client";

import { forwardRef, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LEAD_FORM_COPY, type Lang, type LeadFormCopy } from "@/lib/homeTranslations";
import { ALL_STATES } from "@/lib/states";
import { tiktokContentNameFromWindow } from "@/lib/brand-client";
import {
  getTikTokAttribution,
  newTikTokEventId,
  saveTikTokLeadSession,
  trackTikTokCompleteRegistration,
  trackTikTokLeadConversion,
} from "@/lib/tiktok-attribution";
import { trackLeadConversion } from "@/lib/trackConversion";
import { INJURY_OPTIONS, TIMING_OPTIONS, US_STATES } from "@/lib/usStates";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export interface LeadFormProps {
  source?: string;
  preselectedState?: string;
  headline?: string;
  subheadline?: string;
  submitLabel?: string;
  /** Full intake (default), minimal for calculator CTA, or guide funnel fields */
  variant?: "default" | "minimal" | "guide";
  /** BCP-47 style language sent with lead (homepage bilingual toggle). */
  language?: Lang;
  /** When set (e.g. homepage), overrides default English form strings. */
  formCopy?: LeadFormCopy;
  /** Called after successful /api/submit (e.g. survival guide email chain) */
  afterSubmit?: (payload: {
    firstName: string;
    lastName: string;
    phone: string;
    state: string;
    email?: string;
  }) => Promise<void>;
  /** Custom thank-you path; default `/thank-you?firstName=...&source=...` */
  thankYouPath?: (ctx: { firstName: string; source?: string }) => string;
}

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  state: string;
  timing: string;
  injuries: string[];
  smsOptIn: boolean;
};

type FieldErrors = Partial<Record<keyof FormState | "injuries", string>>;

function formatPhone(val: string) {
  const v = val.replace(/\D/g, "").slice(0, 10);
  if (v.length >= 6) return `(${v.slice(0, 3)}) ${v.slice(3, 6)}-${v.slice(6)}`;
  if (v.length >= 3) return `(${v.slice(0, 3)}) ${v.slice(3)}`;
  return v;
}

function resolvePreselectedState(ps?: string): string {
  if (!ps) return "";
  const t = ps.trim();
  if (t.length === 2) {
    const m = ALL_STATES.find((s) => s.abbreviation.toUpperCase() === t.toUpperCase());
    return m?.state ?? "";
  }
  return t;
}

function pushLeadSubmitted() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "lead_submitted" });
}

export const LeadForm = forwardRef<HTMLDivElement, LeadFormProps>(function LeadForm(
  {
    source = "website",
    preselectedState,
    headline,
    subheadline,
    submitLabel,
    variant = "default",
    language = "en",
    formCopy,
    afterSubmit,
    thankYouPath,
  },
  ref,
) {
  const router = useRouter();
  const c = formCopy ?? DEFAULT_LEAD_FORM_COPY;

  const [form, setForm] = useState<FormState>(() => ({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    state: resolvePreselectedState(preselectedState),
    timing: "",
    injuries: [],
    smsOptIn: true,
  }));

  useEffect(() => {
    if (preselectedState) {
      setForm((f) => ({ ...f, state: resolvePreselectedState(preselectedState) }));
    }
  }, [preselectedState]);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [submitStep, setSubmitStep] = useState<1 | 2>(1);

  const timingPairs = useMemo(
    () =>
      TIMING_OPTIONS.map((value, i) => ({
        value,
        label: c.timingOptionsDisplay[i] ?? value,
      })),
    [c.timingOptionsDisplay],
  );

  const toggleInjury = (injury: string) => {
    setForm((f) => ({
      ...f,
      injuries: f.injuries.includes(injury)
        ? f.injuries.filter((i) => i !== injury)
        : [...f.injuries, injury],
    }));
  };

  const validate = (): boolean => {
    const errs: FieldErrors = {};
    if (!form.firstName.trim()) errs.firstName = c.errFirstName;
    if (variant === "default" && !form.lastName.trim()) errs.lastName = c.errLastName;
    const digits = form.phone.replace(/\D/g, "");
    if (!digits) errs.phone = c.errPhone;
    else if (digits.length < 10) errs.phone = c.errPhoneDigits;
    if (!form.state) errs.state = c.errState;
    if (variant === "default") {
      if (!form.timing) errs.timing = c.errTiming;
      if (form.injuries.length === 0) errs.injuries = c.errInjuries;
    }
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Enter a valid email.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitStep(2);
    setStatus("loading");
    const timing =
      variant === "default" ? form.timing : variant === "minimal" ? TIMING_OPTIONS[0] : TIMING_OPTIONS[0];
    const injuries = variant === "default" ? form.injuries : ["❓ Not Sure"];
    const lastName = variant === "default" ? form.lastName.trim() : form.lastName.trim() || "-";

    const tiktokEventId = newTikTokEventId();
    const { ttclid, ttp } = getTikTokAttribution();
    const emailTrimmed = form.email.trim();

    const body = {
      firstName: form.firstName.trim(),
      lastName,
      phone: form.phone,
      state: form.state,
      timing,
      injuries,
      source,
      email: emailTrimmed,
      smsOptIn: form.smsOptIn,
      language,
      ttclid,
      ttp,
      tiktokEventId,
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");

      trackTikTokLeadConversion({
        eventId: tiktokEventId,
        email: emailTrimmed,
        phone: form.phone,
        contentName: tiktokContentNameFromWindow(),
      });
      saveTikTokLeadSession({
        tiktokEventId,
        email: emailTrimmed,
        phone: form.phone,
        ttclid,
        ttp,
      });
      trackTikTokCompleteRegistration(tiktokEventId);
      pushLeadSubmitted();
      trackLeadConversion();
      void fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          email: body.email,
          state: body.state,
          timing: body.timing,
          injuries: body.injuries,
          source: body.source,
        }),
      }).catch(() => undefined);
      if (afterSubmit) {
        await afterSubmit({
          firstName: form.firstName.trim(),
          lastName,
          phone: form.phone,
          state: form.state,
          email: emailTrimmed,
        });
      }
      const dest =
        thankYouPath?.({ firstName: form.firstName.trim(), source }) ??
        `/thank-you?firstName=${encodeURIComponent(form.firstName.trim())}&source=${encodeURIComponent(source)}&tiktokEventId=${encodeURIComponent(tiktokEventId)}`;
      router.push(dest);
    } catch {
      setSubmitStep(1);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none ring-[#cc0000]/25 transition-all duration-200 placeholder:text-gray-400 focus:border-[#cc0000] focus:ring-2";

  const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-600";

  const showFull = variant === "default";
  const showGuideExtras = variant === "guide";
  const showMinimal = variant === "minimal";

  const progressPct = submitStep === 1 ? 50 : 100;

  return (
    <div
      ref={(node) => {
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      id="form"
      className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] ring-1 ring-gray-200/80 sm:p-8"
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-1 bg-[#cc0000]" aria-hidden />
      {headline ? (
        <div className="mb-4 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-[#cc0000]">{headline}</p>
          {subheadline ? <p className="mt-2 text-sm text-gray-600">{subheadline}</p> : null}
        </div>
      ) : (
        <p className="mb-2 text-center text-sm font-bold uppercase tracking-wider text-[#cc0000]">
          {c.formHeadline}
        </p>
      )}
      <div className="mb-6">
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>{submitStep === 1 ? c.formStep1 : c.formStepSubmitting}</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-1.5 origin-left rounded-full bg-[#cc0000] transition-transform duration-300 ease-out"
            style={{ transform: `scaleX(${progressPct / 100})` }}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-live="polite">
        <div className={`grid gap-4 ${showGuideExtras || showMinimal ? "" : "sm:grid-cols-2"}`}>
            <div>
              <label htmlFor="wm-firstName" className={labelClass}>
                {showMinimal ? "Name" : c.firstName}
              </label>
              <input
                id="wm-firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                aria-required="true"
                className={inputClass}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              {fieldErrors.firstName && <p className="mt-1 text-sm text-red-700">{fieldErrors.firstName}</p>}
            </div>
            {!showGuideExtras && !showMinimal ? (
              <div>
                <label htmlFor="wm-lastName" className={labelClass}>
                  {c.lastName}
                </label>
                <input
                  id="wm-lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  aria-required="true"
                  className={inputClass}
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
                {fieldErrors.lastName && <p className="mt-1 text-sm text-red-700">{fieldErrors.lastName}</p>}
              </div>
            ) : null}
          </div>

          <div>
            <label htmlFor="wm-phone" className={labelClass}>
              {c.phone}
            </label>
            <input
              id="wm-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Your phone number"
              aria-required="true"
              className={`${inputClass} py-4 text-lg`}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
            />
            {fieldErrors.phone && <p className="mt-1 text-sm text-red-700">{fieldErrors.phone}</p>}
          </div>

          <div>
            <label htmlFor="wm-email" className={labelClass}>
              EMAIL ADDRESS
            </label>
            <input
              id="wm-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Your email address"
              aria-required="true"
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {fieldErrors.email && <p className="mt-1 text-sm text-red-700">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="wm-state" className={labelClass}>
              {c.state}
            </label>
            <select
              id="wm-state"
              name="state"
              autoComplete="address-level1"
              aria-required="true"
              className={inputClass}
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            >
              <option value="">{c.statePlaceholder}</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {fieldErrors.state && <p className="mt-1 text-sm text-red-700">{fieldErrors.state}</p>}
          </div>

          {showFull ? (
            <>
              <div>
                <label htmlFor="wm-timing" className={labelClass}>
                  {c.timing}
                </label>
                <select
                  id="wm-timing"
                  name="timing"
                  autoComplete="off"
                  aria-required="true"
                  className={inputClass}
                  value={form.timing}
                  onChange={(e) => setForm({ ...form, timing: e.target.value })}
                >
                  <option value="" disabled>
                    {c.timingPrompt}
                  </option>
                  {timingPairs.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {fieldErrors.timing && <p className="mt-1 text-sm text-red-700">{fieldErrors.timing}</p>}
              </div>

              <fieldset>
                <legend className={`${labelClass} mb-2`}>{c.injuryLabel}</legend>
                <div className="flex flex-wrap gap-2">
                  {INJURY_OPTIONS.map((inj) => {
                    const active = form.injuries.includes(inj);
                    return (
                      <button
                        key={inj}
                        type="button"
                        aria-pressed={active}
                        aria-label={`${active ? "Deselect" : "Select"} injury type ${inj}`}
                        onClick={() => toggleInjury(inj)}
                        className={`rounded-full border px-3 py-2 text-sm font-medium transition-opacity duration-200 ${
                          active
                            ? "border-[#cc0000] bg-red-50 text-red-900 ring-2 ring-red-200"
                            : "border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:opacity-90"
                        }`}
                      >
                        {inj}
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.injuries && <p className="mt-1 text-sm text-red-700">{fieldErrors.injuries}</p>}
              </fieldset>
            </>
          ) : null}

        <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#cc0000] focus:ring-[#cc0000]"
            checked={form.smsOptIn}
            onChange={(e) => setForm({ ...form, smsOptIn: e.target.checked })}
          />
          <span>{c.smsOptIn}</span>
        </label>

        {status === "error" && (
          <p className="text-center text-sm text-red-700" role="status">
            Something went wrong. Please try again.
          </p>
        )}

        <div className="relative">
          <span
            className="pointer-events-none absolute inset-0 rounded-xl bg-[#cc0000]/25 opacity-60 animate-pulse"
            aria-hidden
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="relative w-full rounded-xl bg-[#cc0000] py-4 text-lg font-bold text-white shadow-md transition-opacity duration-200 hover:bg-[#b30000] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? c.submitting : submitLabel ?? c.submitBtn}
          </button>
        </div>
      </form>
      <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
        <span className="text-base" aria-hidden>
          🔒
        </span>
        <span>{c.secureNote}</span>
      </p>
      <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">{c.disclaimer}</p>
    </div>
  );
});
