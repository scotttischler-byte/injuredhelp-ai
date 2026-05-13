"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const STATES_BY_REGION = [
  {
    region: "Southeast",
    states: [
      "Alabama",
      "Florida",
      "Georgia",
      "Kentucky",
      "Mississippi",
      "North Carolina",
      "South Carolina",
      "Tennessee",
      "Virginia",
      "West Virginia",
    ],
  },
  {
    region: "Northeast",
    states: [
      "Connecticut",
      "Delaware",
      "Maine",
      "Maryland",
      "Massachusetts",
      "New Hampshire",
      "New Jersey",
      "New York",
      "Pennsylvania",
      "Rhode Island",
      "Vermont",
    ],
  },
  {
    region: "Midwest",
    states: [
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Michigan",
      "Minnesota",
      "Missouri",
      "Nebraska",
      "North Dakota",
      "Ohio",
      "South Dakota",
      "Wisconsin",
    ],
  },
  {
    region: "Southwest",
    states: ["Arkansas", "Louisiana", "Oklahoma", "Texas"],
  },
  {
    region: "Mountain",
    states: [
      "Arizona",
      "Colorado",
      "Idaho",
      "Montana",
      "Nevada",
      "New Mexico",
      "Utah",
      "Wyoming",
    ],
  },
  {
    region: "West",
    states: ["Alaska", "California", "Hawaii", "Oregon", "Washington"],
  },
] as const;

const TIMING_OPTIONS = [
  "Within the last 30 days",
  "1–3 months ago",
  "3–6 months ago",
  "6–12 months ago",
  "Over a year ago",
] as const;

const INJURY_OPTIONS = [
  "🦴 Back/Neck",
  "🧠 Head/Brain",
  "🦾 Broken Bones",
  "💊 Soft Tissue",
  "😟 Emotional",
  "❓ Not Sure",
] as const;

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  state: string;
  timing: string;
  injuries: string[];
};

type FieldErrors = Partial<Record<keyof FormState | "injuries", string>>;

function formatPhone(val: string) {
  const v = val.replace(/\D/g, "").slice(0, 10);
  if (v.length >= 6) return `(${v.slice(0, 3)}) ${v.slice(3, 6)}-${v.slice(6)}`;
  if (v.length >= 3) return `(${v.slice(0, 3)}) ${v.slice(3)}`;
  return v;
}

function pushLeadSubmitted() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "lead_submitted" });
}

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    phone: "",
    state: "",
    timing: "",
    injuries: [],
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [submitStep, setSubmitStep] = useState<1 | 2>(1);

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
    if (!form.firstName.trim()) errs.firstName = "First name is required.";
    if (!form.lastName.trim()) errs.lastName = "Last name is required.";
    const digits = form.phone.replace(/\D/g, "");
    if (!digits) errs.phone = "Phone number is required.";
    else if (digits.length < 10) errs.phone = "Enter a valid 10-digit phone number.";
    if (!form.state) errs.state = "Please select your state.";
    if (!form.timing) errs.timing = "Please select when the accident happened.";
    if (form.injuries.length === 0) errs.injuries = "Select at least one injury type.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitStep(2);
    setStatus("loading");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      pushLeadSubmitted();
      const q = encodeURIComponent(form.firstName.trim());
      router.push(`/thank-you?firstName=${q}`);
    } catch {
      setSubmitStep(1);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none ring-red-500/30 transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2";

  const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-600";

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* SECTION A — TOP NAV */}
      <header className="sticky top-0 z-50 h-14 w-full border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-1 px-4 sm:flex-row sm:justify-between sm:gap-0">
          <div className="text-center sm:text-left">
            <span className="text-base font-bold tracking-tight text-white">
              WreckMatch<span className="text-red-500">™</span>
            </span>
          </div>
          <a
            href="tel:18000000000"
            className="text-sm font-medium text-white hover:text-red-400 sm:text-base"
          >
            📞 (800) 000-0000
          </a>
        </div>
      </header>

      {/* SECTION B — HERO */}
      <section className="bg-gray-950 px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-400 sm:text-sm">
            🚨 If You Were in an Accident — Read This
          </p>
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
            <span className="text-sm font-medium text-green-400">Attorney team available now</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            You Were in an Accident.
            <br />
            <span className="text-white">You Deserve the Right Attorney.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
            WreckMatch connects injured accident victims with licensed personal injury attorneys in their
            state — for free, in under 60 seconds. No fees unless you win. The law firms in our network have
            secured <strong className="font-semibold text-gray-200">over $1 billion</strong> for clients and
            maintain a <strong className="font-semibold text-gray-200">99.9% success rate</strong>
            <sup className="text-red-400">*</sup>.
          </p>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-white sm:text-base">
            <span>✅ Over $1 billion partner recoveries</span>
            <span className="hidden text-gray-600 sm:inline">|</span>
            <span>✅ 99.9% network success rate</span>
            <span className="hidden text-gray-600 sm:inline">|</span>
            <span>✅ Zero upfront cost</span>
            <span className="hidden text-gray-600 sm:inline">|</span>
            <span>✅ Contingency only</span>
            <span className="hidden text-gray-600 sm:inline">|</span>
            <span>✅ All 50 states</span>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-gray-500">
            <sup className="font-semibold text-red-400">*</sup>
            <strong className="text-gray-400"> Legal notice:</strong> Dollar and success-rate figures describe
            cumulative, historical results self-reported by independent partner law firms in our referral
            network—not WreckMatch, which is not a law firm.{" "}
            <a
              href="#advertising-legal-notice"
              className="font-medium text-red-400 underline decoration-red-400/50 underline-offset-2 hover:text-red-300"
            >
              Read full disclaimer
            </a>
            .
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <a
              href="tel:18000000000"
              className="inline-flex w-full max-w-md items-center justify-center rounded-xl bg-red-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-500 sm:text-xl"
            >
              📞 Call or Text Now: (800) 000-0000
            </a>
            <p className="text-sm text-gray-500">
              Or fill out the form below — we&apos;ll call YOU within 60 seconds
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-4 border-t border-gray-200 bg-gray-100 py-4 text-sm text-gray-400">
        <span>🔒 256-bit Encrypted</span>
        <span>⚖️ Licensed Attorneys Only</span>
        <span>🇺🇸 All 50 States</span>
        <span>📋 HIPAA Compliant Intake</span>
        <span>⭐ 4.9/5 Client Rating</span>
        <span>🏆 Over $1 billion · 99.9% partner network</span>
      </div>

      {/* SECTION C — LEAD FORM */}
      <section className="px-4 py-12 sm:py-16" aria-labelledby="lead-form-heading">
        <div
          id="form"
          className="mx-auto w-full max-w-[560px] rounded-2xl bg-white p-6 shadow-xl shadow-gray-900/10 ring-1 ring-gray-200 sm:p-8"
        >
          <p id="lead-form-heading" className="mb-2 text-center text-sm font-bold uppercase tracking-wider text-red-600">
            GET FREE HELP NOW
          </p>
          <div className="mb-6">
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>
                {submitStep === 1 ? "Step 1 of 2 — Your Info" : "Step 2 of 2 — Submitting..."}
              </span>
              <span>{submitStep === 1 ? "50%" : "100%"}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200">
              <div
                className={`h-1.5 rounded-full bg-red-500 transition-all duration-300 ${
                  submitStep === 1 ? "w-1/2" : "w-full"
                }`}
              />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      className={inputClass}
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClass}>
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      className={inputClass}
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="(555) 000-0000"
                    className={`${inputClass} py-4 text-lg`}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                  />
                  {fieldErrors.phone && <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="state" className={labelClass}>
                    State
                  </label>
                  <select
                    id="state"
                    name="state"
                    className={inputClass}
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  >
                    <option value="" disabled>
                      Select your state
                    </option>
                    {STATES_BY_REGION.map((r) => (
                      <optgroup key={r.region} label={`— ${r.region}`}>
                        {r.states.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {fieldErrors.state && <p className="mt-1 text-sm text-red-600">{fieldErrors.state}</p>}
                </div>

                <div>
                  <label htmlFor="timing" className={labelClass}>
                    When did your accident happen?
                  </label>
                  <select
                    id="timing"
                    name="timing"
                    className={inputClass}
                    value={form.timing}
                    onChange={(e) => setForm({ ...form, timing: e.target.value })}
                  >
                    <option value="" disabled>
                      Select timeframe
                    </option>
                    {TIMING_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.timing && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.timing}</p>
                  )}
                </div>

                <fieldset>
                  <legend className={`${labelClass} mb-2`}>Injury type (select all that apply)</legend>
                  <div className="flex flex-wrap gap-2">
                    {INJURY_OPTIONS.map((inj) => {
                      const active = form.injuries.includes(inj);
                      return (
                        <button
                          key={inj}
                          type="button"
                          onClick={() => toggleInjury(inj)}
                          className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                            active
                              ? "border-red-600 bg-red-50 text-red-800 ring-2 ring-red-200"
                              : "border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {inj}
                        </button>
                      );
                    })}
                  </div>
                  {fieldErrors.injuries && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.injuries}</p>
                  )}
                </fieldset>

                {status === "error" && (
                  <p className="text-center text-sm text-red-600">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-xl bg-red-600 py-4 text-lg font-bold text-white shadow-md transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading" ? "Submitting…" : "GET FREE HELP NOW →"}
                </button>
          </form>
          <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
            By submitting you agree to be contacted by phone and SMS regarding your case. No spam. No fees
            unless you win. WreckMatch is a legal referral service, not a law firm.
          </p>
        </div>
      </section>

      {/* SECTION D — STATS */}
      <section className="bg-gray-950 px-4 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center md:grid-cols-4 md:gap-4">
          <div>
            <p className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">$1 Billion+</p>
            <p className="mt-1 text-sm text-gray-400">Total recoveries — partner law firms</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white sm:text-3xl">99.9%</p>
            <p className="mt-1 text-sm text-gray-400">Success rate — our network</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white sm:text-3xl">50</p>
            <p className="mt-1 text-sm text-gray-400">States covered nationwide</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white sm:text-3xl">&lt;60s</p>
            <p className="mt-1 text-sm text-gray-400">To reach attorney team</p>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-gray-500">
          <sup className="font-semibold text-red-400">*</sup> Totals and percentages are aggregate,
          self-reported figures from independent partner law firms in the WreckMatch network over time, not
          averages per client or per case. &quot;Success rate&quot; reflects each firm&apos;s internal
          methodology (definitions vary) and is not independently audited by WreckMatch. Past results do not
          guarantee future outcomes.{" "}
          <a href="#advertising-legal-notice" className="text-red-400 underline hover:text-red-300">
            Full disclaimer
          </a>
        </p>
      </section>

      {/* SECTION E — TESTIMONIALS */}
      <section className="bg-gray-200 px-4 py-14 sm:py-16">
        <h2 className="mb-3 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Real People. Real Results.
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-gray-600 sm:text-base">
          You&apos;re joining clients matched to firms that have delivered{" "}
          <strong className="text-gray-800">over $1 billion</strong> in results with a{" "}
          <strong className="text-gray-800">99.9%</strong> success rate across our attorney network
          <sup className="font-semibold text-red-600">*</sup>.
        </p>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            {
              quote:
                "I was rear-ended and had no idea what to do. WreckMatch connected me to an attorney within minutes. Couldn't be easier.",
              who: "Maria T., Atlanta, GA",
            },
            {
              quote:
                "Fast, professional, and completely free. My attorney got me a settlement I never expected.",
              who: "James R., Chicago, IL",
            },
            {
              quote:
                "The whole process took less than 2 minutes. I had an attorney calling me before I put my phone down.",
              who: "Sandra K., Houston, TX",
            },
          ].map((t) => (
            <blockquote
              key={t.who}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-md shadow-gray-900/5"
            >
              <p className="mb-3 text-yellow-400" aria-label="5 out of 5 stars">
                ★★★★★
              </p>
              <p className="text-gray-700">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm text-gray-500">— {t.who}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* SECTION F — HOW IT WORKS */}
      <section className="bg-white px-4 py-14 sm:py-16">
        <h2 className="mb-12 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          How WreckMatch Works
        </h2>
        <div className="relative mx-auto max-w-5xl">
          <div
            className="pointer-events-none absolute left-6 right-6 top-7 hidden h-px bg-gray-200 md:block"
            aria-hidden
          />
          <ol className="relative grid gap-0 divide-y divide-gray-200 md:grid-cols-4 md:divide-x md:divide-y-0">
            {[
              {
                emoji: "📋",
                title: "Tell Us What Happened",
                body: "30 seconds. Name, phone, state, when it happened.",
              },
              {
                emoji: "📞",
                title: "We Reach You Instantly",
                body: "Our team calls and texts you within 60 seconds.",
              },
              {
                emoji: "⚖️",
                title: "Get Matched to an Attorney",
                body: "Licensed PI lawyers from a network with over $1 billion recovered and a 99.9% track record.",
              },
              {
                emoji: "💰",
                title: "Get the Compensation You Deserve",
                body: "You pay nothing unless you win.",
              },
            ].map((step) => (
              <li
                key={step.title}
                className="flex flex-col gap-2 bg-white px-2 py-8 text-center md:px-4 md:pt-10"
              >
                <span className="text-3xl" aria-hidden>
                  {step.emoji}
                </span>
                <p className="font-bold text-gray-900">{step.title}</p>
                <p className="text-sm leading-relaxed text-gray-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SECTION G — TRUST BAR */}
      <section className="bg-gray-950 px-4 py-6">
        <p className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-2 gap-y-2 text-center text-sm text-white sm:text-base">
          <span>🏆 Over $1 billion · 99.9% partner network</span>
          <span className="hidden sm:inline">&nbsp;|&nbsp;</span>
          <span>🔒 Secure & Confidential</span>
          <span className="hidden sm:inline">&nbsp;|&nbsp;</span>
          <span>🇺🇸 Licensed Attorneys in All 50 States</span>
          <span className="hidden sm:inline">&nbsp;|&nbsp;</span>
          <span>⚖️ No Win, No Fee</span>
          <span className="hidden sm:inline">&nbsp;|&nbsp;</span>
          <span>📞 Available 24/7</span>
        </p>
      </section>

      {/* SECTION H — SECOND CTA */}
      <section className="bg-red-600 px-4 py-14 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Don&apos;t Wait — Deadlines Apply to Accident Claims
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-red-100">
          Every state has a statute of limitations on personal injury claims. The sooner you act, the
          stronger your case.
        </p>
        <Link
          href="#form"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-red-600 shadow-lg transition hover:bg-gray-100"
        >
          Get Free Help Right Now →
        </Link>
      </section>

      {/* ADVERTISING & LEGAL NOTICE */}
      <section
        id="advertising-legal-notice"
        className="border-t border-gray-800 bg-gray-900 px-4 py-12 scroll-mt-20"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-wider text-gray-400">
            Advertising &amp; legal notice
          </h2>
          <div className="space-y-4 text-xs leading-relaxed text-gray-500 sm:text-sm">
            <p>
              <strong className="text-gray-400">WreckMatch is not a law firm</strong> and does not provide
              legal advice or legal services. We operate a legal matching and referral service. Any dollar
              amounts, recovery totals, success rates, percentages, or similar performance statements on this
              page describe <strong className="text-gray-400">cumulative, historical, aggregate figures</strong>{" "}
              self-reported by <strong className="text-gray-400">independent partner law firms</strong> in
              our network over time. They are <strong className="text-gray-400">not</strong> a representation
              of what any one client received, what you will receive, or average outcomes.
            </p>
            <p>
              <strong className="text-gray-400">&quot;Success rate&quot;</strong> (including references such
              as 99.9%) reflects metrics and definitions used internally by partner firms; methodologies and
              inclusion criteria vary by firm and matter type. WreckMatch does{" "}
              <strong className="text-gray-400">not</strong> independently verify every underlying case file
              or outcome. Figures are provided for general informational purposes and may be updated from
              time to time.
            </p>
            <p>
              <strong className="text-gray-400">No guarantee:</strong> Past results, statistics, or
              testimonials do not guarantee, warrant, or predict future results. Every case is different.
              Attorney availability, fee arrangements, and results depend on the facts, jurisdiction, and
              the lawyer you hire—not WreckMatch.
            </p>
            <p>
              Submitting a form does not create an attorney-client relationship with WreckMatch. By
              submitting, you consent to be contacted by phone and SMS regarding your inquiry.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION I — FOOTER */}
      <footer className="bg-gray-950 px-4 py-10">
        <div className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-gray-500">
          <p className="mb-2 text-gray-400">© 2026 WreckMatch — All rights reserved.</p>
          <p className="mb-3">
            WreckMatch is a legal matching and referral service, not a law firm and does not provide legal
            advice. Submitting this form does not create an attorney-client relationship. Available in all
            50 states. Attorney availability varies by state and case type. Results vary based on individual
            circumstances. By submitting you consent to be contacted by phone and SMS.
          </p>
          <p>
            <sup className="text-gray-600">*</sup> References to aggregate recoveries (over $1 billion) and
            success rates (e.g. 99.9%) reflect partner-firm-reported network data as described in the{" "}
            <a href="#advertising-legal-notice" className="text-gray-400 underline hover:text-gray-300">
              Advertising &amp; legal notice
            </a>{" "}
            above; they are not promises or predictions for your case.
          </p>
        </div>
      </footer>
    </div>
  );
}
