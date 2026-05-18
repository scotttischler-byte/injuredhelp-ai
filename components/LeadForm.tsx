"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import { DEFAULT_LEAD_FORM_COPY, type Lang, type LeadFormCopy } from "@/lib/homeTranslations";
import { ALL_STATES } from "@/lib/states";
import { FormConsentSection } from "@/components/FormConsentSection";
import { FORM_SUCCESS_MESSAGE } from "@/lib/compliance";
import { tiktokContentNameFromWindow } from "@/lib/brand-client";
import {
  getTikTokAttribution,
  newTikTokEventId,
  saveTikTokLeadSession,
  trackTikTokCompleteRegistration,
  trackTikTokLeadConversion,
} from "@/lib/tiktok-attribution";
import { trackLeadConversion } from "@/lib/trackConversion";
import { TIMING_OPTIONS, US_STATES } from "@/lib/usStates";

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
  variant?: "default" | "minimal" | "guide";
  language?: Lang;
  formCopy?: LeadFormCopy;
  afterSubmit?: (payload: {
    firstName: string;
    lastName: string;
    phone: string;
    state: string;
    email?: string;
  }) => Promise<void>;
  thankYouPath?: (ctx: { firstName: string; source?: string }) => string;
}

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  state: string;
  accidentDescription: string;
  smsOptIn: boolean;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

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

function emailFromPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `lead+${digits || "unknown"}@intake.wreckmatch.com`;
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
  const isSimple = variant === "default";
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState<FormState>(() => ({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    state: resolvePreselectedState(preselectedState),
    accidentDescription: "",
    smsOptIn: false,
  }));

  useEffect(() => {
    if (preselectedState) {
      setForm((f) => ({ ...f, state: resolvePreselectedState(preselectedState) }));
    }
  }, [preselectedState]);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [successPhone, setSuccessPhone] = useState("");

  const validate = (): boolean => {
    const errs: FieldErrors = {};
    if (!form.firstName.trim()) errs.firstName = c.errFirstName;
    const digits = form.phone.replace(/\D/g, "");
    if (!digits) errs.phone = c.errPhone;
    else if (digits.length < 10) errs.phone = c.errPhoneDigits;
    if (!form.state) errs.state = c.errState;
    if (!form.smsOptIn) errs.smsOptIn = c.errSmsConsent;
    if (!isSimple && variant !== "minimal" && variant !== "guide") {
      if (!form.lastName.trim()) errs.lastName = c.errLastName;
    }
    if (!isSimple && form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Enter a valid email.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");

    const lastName = isSimple ? "-" : form.lastName.trim() || "-";
    const emailTrimmed = isSimple ? emailFromPhone(form.phone) : form.email.trim() || emailFromPhone(form.phone);
    const timing = TIMING_OPTIONS[0];
    const injuries = form.accidentDescription.trim()
      ? [`Accident notes: ${form.accidentDescription.trim().slice(0, 500)}`]
      : ["❓ Not Sure"];

    const tiktokEventId = newTikTokEventId();
    const { ttclid, ttp } = getTikTokAttribution();

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
      accidentDescription: form.accidentDescription.trim() || undefined,
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

      setSuccessPhone(form.phone);
      setStatus("success");

      window.setTimeout(() => {
        const dest =
          thankYouPath?.({ firstName: form.firstName.trim(), source }) ??
          `/thank-you?firstName=${encodeURIComponent(form.firstName.trim())}&source=${encodeURIComponent(source)}&tiktokEventId=${encodeURIComponent(tiktokEventId)}`;
        router.push(dest);
      }, 4000);
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none ring-[#cc0000]/25 transition-all duration-200 placeholder:text-gray-400 focus:border-[#cc0000] focus:ring-2";
  const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-600";

  if (status === "success") {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        id="form"
        className="mx-auto w-full max-w-[560px] rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-lg"
        role="status"
      >
        <p className="text-3xl" aria-hidden>
          ✓
        </p>
        <h2 className="mt-4 text-xl font-bold text-gray-900">You&apos;re all set</h2>
        <p className="mt-3 text-base leading-relaxed text-gray-700">{FORM_SUCCESS_MESSAGE(successPhone)}</p>
        <p className="mt-4 text-sm text-gray-500">Keep your phone nearby — we&apos;re calling now.</p>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id="form"
      className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] ring-1 ring-gray-200/80 sm:p-8"
    >
      <ReferralDisclaimer className="mb-5 border-gray-200 bg-gray-50 text-gray-600" />
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
      {isSimple ? (
        <p className="mb-5 text-center text-sm font-medium text-gray-600">{c.formSubhead}</p>
      ) : null}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" aria-live="polite">
        <div>
          <label htmlFor="wm-firstName" className={labelClass}>
            {c.firstName}
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

        {isSimple ? (
          <div>
            <label htmlFor="wm-accident" className={labelClass}>
              {c.accidentDescriptionLabel}
            </label>
            <textarea
              id="wm-accident"
              name="accidentDescription"
              rows={4}
              placeholder={c.accidentDescriptionPlaceholder}
              className={inputClass}
              value={form.accidentDescription}
              onChange={(e) => setForm({ ...form, accidentDescription: e.target.value })}
            />
          </div>
        ) : null}

        {isSimple ? (
          <FormConsentSection
            checked={form.smsOptIn}
            onChange={(checked) => setForm({ ...form, smsOptIn: checked })}
            error={fieldErrors.smsOptIn}
            inputId={source === "homepage" ? "tcpa-consent" : "tcpa-consent-geo"}
          />
        ) : (
          <>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-[#cc0000] focus:ring-[#cc0000]"
                checked={form.smsOptIn}
                onChange={(e) => setForm({ ...form, smsOptIn: e.target.checked })}
                aria-required="true"
              />
              <span>{c.smsOptIn}</span>
            </label>
            {fieldErrors.smsOptIn ? (
              <p className="-mt-3 text-sm text-red-700" role="alert">
                {fieldErrors.smsOptIn}
              </p>
            ) : null}
          </>
        )}

        {status === "error" && (
          <p className="text-center text-sm text-red-700" role="alert">
            Something went wrong. Please try again or call (978) 515-6063.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || (isSimple && !form.smsOptIn)}
          className="w-full rounded-xl bg-[#cc0000] py-4 text-lg font-bold text-white shadow-md transition-opacity duration-200 hover:bg-[#b30000] disabled:cursor-not-allowed disabled:opacity-70"
          aria-disabled={isSimple && !form.smsOptIn}
        >
          {status === "loading" ? c.submitting : submitLabel ?? c.submitBtn}
        </button>
      </form>
      <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
        <span aria-hidden>🔒</span>
        <span>{c.secureNote}</span>
      </p>
      <ReferralDisclaimer className="mt-4 border-gray-200 bg-gray-50 text-gray-600" />
    </div>
  );
});
