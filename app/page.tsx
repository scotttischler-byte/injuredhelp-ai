"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
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

const ACTIVITY_MESSAGES = [
  { line: '"Michael from Dallas just got matched"', ago: "2 min ago" },
  { line: '"Jennifer from Miami just got matched"', ago: "5 min ago" },
  { line: '"Robert from Chicago just got matched"', ago: "8 min ago" },
  { line: '"Ashley from Atlanta just got matched"', ago: "11 min ago" },
  { line: '"David from Houston just got matched"', ago: "14 min ago" },
] as const;

const FAQ_ITEMS = [
  {
    q: "Is this really free?",
    a: "Yes. WreckMatch is 100% free for accident victims. We are paid by our partner law firms, not by you. You never pay anything out of pocket.",
  },
  {
    q: "What if I'm not sure who was at fault?",
    a: "That's exactly why you need an attorney. Fault determination is complex. Our partner attorneys evaluate your case for free and advise you on your options.",
  },
  {
    q: "How fast will I hear back?",
    a: "Our team calls and texts you within 60 seconds of submitting. Most clients are speaking with an attorney team member in under 2 minutes.",
  },
  {
    q: "What types of accidents do you cover?",
    a: "Car accidents, truck accidents, rideshare accidents (Uber/Lyft), motorcycle accidents, pedestrian accidents, and more. If you were injured by someone else's negligence, we can help.",
  },
  {
    q: "Do I have to go to court?",
    a: "Most personal injury cases settle without going to court. Your attorney will advise you on the best path for your specific case.",
  },
  {
    q: "What is the statute of limitations?",
    a: "Every state has a deadline to file a personal injury claim — typically 2-3 years but it varies. Don't wait. The sooner you act, the stronger your case.",
  },
] as const;

const EXIT_MODAL_KEY = "wreckmatch_exit_modal_shown";

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

const TRUST_ITEMS = [
  "🏆 Over $1 billion · 99.9% partner network",
  "🔒 Secure & Confidential",
  "🇺🇸 Licensed Attorneys in All 50 States",
  "⚖️ No Win, No Fee",
  "📞 Available 24/7",
] as const;

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

  const [slotsRemaining, setSlotsRemaining] = useState<number | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastIndex, setToastIndex] = useState(0);
  const [toastDismissed, setToastDismissed] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [formInView, setFormInView] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [statPct, setStatPct] = useState(0);
  const [statStates, setStatStates] = useState(0);
  const [statSecs, setStatSecs] = useState(0);
  const [stepsVisible, setStepsVisible] = useState(false);

  const statsSectionRef = useRef<HTMLElement>(null);
  const stepsSectionRef = useRef<HTMLElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const lastActivityRef = useRef(0);
  const statsAnimatedRef = useRef(false);

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

  /* Urgency slots: UI-only random 3–7 on client mount (not a live inventory system). */
  useEffect(() => {
    queueMicrotask(() => {
      setSlotsRemaining(Math.floor(Math.random() * 5) + 3);
    });
  }, []);

  /* Social proof toast: first show after 8s, then cycle every 12s */
  useEffect(() => {
    if (toastDismissed) return;
    const t1 = setTimeout(() => setToastVisible(true), 8000);
    return () => clearTimeout(t1);
  }, [toastDismissed]);

  useEffect(() => {
    if (toastDismissed || !toastVisible) return;
    const id = setInterval(() => {
      setToastIndex((i) => (i + 1) % ACTIVITY_MESSAGES.length);
    }, 12000);
    return () => clearInterval(id);
  }, [toastDismissed, toastVisible]);

  /* Stats: count-up when section enters viewport */
  useEffect(() => {
    const el = statsSectionRef.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || statsAnimatedRef.current) return;
        statsAnimatedRef.current = true;
        setStatsVisible(true);
        const start = performance.now();
        const duration = 1800;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          setStatPct(99.9 * p);
          setStatStates(Math.round(50 * p));
          setStatSecs(Math.round(60 * p));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  /* How it works: fade-in when section visible */
  useEffect(() => {
    const el = stepsSectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStepsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Form in view → hide floating mobile CTA */
  useEffect(() => {
    const el = formCardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setFormInView(e.isIntersecting),
      { rootMargin: "-8% 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tryShowExitModal = useCallback(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(EXIT_MODAL_KEY)) return;
    sessionStorage.setItem(EXIT_MODAL_KEY, "1");
    setExitModalOpen(true);
  }, []);

  /* Desktop exit intent */
  useEffect(() => {
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 24) return;
      tryShowExitModal();
    };
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => document.documentElement.removeEventListener("mouseleave", onLeave);
  }, [tryShowExitModal]);

  /* Mobile: 45s inactivity */
  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (!isCoarse) return;

    const bump = () => {
      lastActivityRef.current = Date.now();
    };
    bump();
    const events = ["touchstart", "scroll", "keydown", "click"] as const;
    events.forEach((ev) => window.addEventListener(ev, bump, { passive: true }));

    const tick = () => {
      if (Date.now() - lastActivityRef.current >= 45000) {
        tryShowExitModal();
        clearInterval(iv);
      }
    };
    const iv = setInterval(tick, 1000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, bump));
      clearInterval(iv);
    };
  }, [tryShowExitModal]);

  const scrollToForm = useCallback(() => {
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none ring-red-500/30 transition-all duration-200 placeholder:text-gray-400 focus:border-red-500 focus:ring-2";

  const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-600";

  return (
    <div
      className={`min-h-screen bg-gray-100 text-gray-900 md:pb-0 ${!formInView ? "pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]" : ""}`}
    >
      {/* SECTION A — TOP NAV */}
      <header className="sticky top-0 z-50 h-14 w-full border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-1 px-4 sm:flex-row sm:justify-between sm:gap-0">
          <div className="text-center sm:text-left">
            <span className="text-base font-bold tracking-tight text-white transition-all duration-200">
              WreckMatch<span className="text-red-500">™</span>
            </span>
          </div>
          <a
            href="tel:19785156063"
            className="text-sm font-medium text-white transition-all duration-200 hover:text-red-400 sm:text-base"
          >
            📞 (978) 515-6063
          </a>
        </div>
      </header>

      {/* SECTION B — HERO */}
      <section className="relative isolate overflow-hidden bg-gray-950 px-4 py-14 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 hero-radial-pulse"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(220,38,38,0.22) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(59,130,246,0.08) 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="animate-urgency-in mb-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-400 sm:text-sm">
            🚨 If You Were in an Accident — Read This
          </p>
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
            <span className="text-sm font-medium text-green-400 transition-all duration-200">
              Attorney team available now
            </span>
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            You Were in an Accident.
            <br />
            <span className="text-white">You Deserve the Right Attorney.</span>
          </h1>
          <div className="mx-auto mt-6 h-1 w-24 max-w-full rounded-full bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-90" />
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg md:text-xl">
            WreckMatch connects injured accident victims with licensed personal injury attorneys in their
            state — for free, in under 60 seconds. No fees unless you win. The law firms in our network have
            secured <strong className="font-semibold text-gray-200">over $1 billion</strong> for clients and
            maintain a <strong className="font-semibold text-gray-200">99.9% success rate</strong>
            <sup className="text-red-400">*</sup>.
          </p>
          {slotsRemaining !== null && (
            <p className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-950/40 px-4 py-2 text-sm font-semibold text-red-300">
              <span aria-hidden>⏱</span>
              <span>
                Free consultations available today — <span className="text-white">{slotsRemaining}</span>{" "}
                slots remaining
              </span>
            </p>
          )}
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-white sm:text-base">
            <span className="transition-opacity duration-200">✅ Over $1 billion partner recoveries</span>
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
              className="font-medium text-red-400 underline decoration-red-400/50 underline-offset-2 transition-all duration-200 hover:text-red-300"
            >
              Read full disclaimer
            </a>
            .
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <a
              href="tel:19785156063"
              className="inline-flex w-full max-w-md items-center justify-center rounded-xl bg-red-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-red-900/30 transition-all duration-200 hover:scale-[1.02] hover:bg-red-500 sm:text-xl"
            >
              📞 Call or Text Now: (978) 515-6063
            </a>
            <p className="text-sm text-gray-500">Or fill out the form below — we&apos;ll call YOU within 60 seconds</p>
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
          ref={formCardRef}
          id="form"
          className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] ring-1 ring-gray-200/80 sm:p-8"
        >
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-1 bg-red-600" aria-hidden />
          <p
            id="lead-form-heading"
            className="mb-2 text-center text-sm font-bold uppercase tracking-wider text-red-600"
          >
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
                className={`h-1.5 rounded-full bg-red-500 transition-transform duration-300 ${
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
                inputMode="tel"
                autoComplete="tel"
                placeholder="(978) 515-6063"
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
                autoComplete="address-level1"
                className={inputClass}
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              >
                <option value="">Select your state...</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
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
                autoComplete="off"
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
              {fieldErrors.timing && <p className="mt-1 text-sm text-red-600">{fieldErrors.timing}</p>}
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
                      className={`rounded-full border px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "border-red-600 bg-red-50 text-red-800 ring-2 ring-red-200"
                          : "border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:opacity-90"
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
              <p className="text-center text-sm text-red-600">Something went wrong. Please try again.</p>
            )}

            <div className="relative">
              <span
                className="pointer-events-none absolute inset-0 rounded-xl bg-red-500/35 opacity-60 animate-pulse"
                aria-hidden
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="relative w-full rounded-xl bg-red-600 py-4 text-lg font-bold text-white shadow-md transition-all duration-200 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? "Submitting…" : "GET FREE HELP NOW →"}
              </button>
            </div>
          </form>
          <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
            <span className="text-base" aria-hidden>
              🔒
            </span>
            <span>Secure &amp; Encrypted</span>
          </p>
          <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
            By submitting you agree to be contacted by phone and SMS regarding your case. No spam. No fees
            unless you win. WreckMatch is a legal referral service, not a law firm.
          </p>
        </div>
      </section>

      {/* SECTION D — STATS */}
      <section ref={statsSectionRef} className="bg-gray-950 px-4 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-y divide-gray-800 text-center md:grid-cols-4 md:divide-x md:divide-y-0 md:divide-gray-800">
          <div className={`px-2 py-6 md:py-8 ${statsVisible ? "stat-reveal" : "opacity-0"}`}>
            <p className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">$1 Billion+</p>
            <p className="mt-1 text-sm text-gray-400">Total recoveries — partner law firms</p>
          </div>
          <div
            className={`px-2 py-6 md:py-8 ${statsVisible ? "stat-reveal" : "opacity-0"}`}
            style={{ animationDelay: "0.08s" }}
          >
            <p className="text-2xl font-bold text-white sm:text-3xl">{statPct.toFixed(1)}%</p>
            <p className="mt-1 text-sm text-gray-400">Success rate — our network</p>
          </div>
          <div
            className={`px-2 py-6 md:py-8 ${statsVisible ? "stat-reveal" : "opacity-0"}`}
            style={{ animationDelay: "0.16s" }}
          >
            <p className="text-2xl font-bold text-white sm:text-3xl">{statStates}</p>
            <p className="mt-1 text-sm text-gray-400">States covered nationwide</p>
          </div>
          <div
            className={`px-2 py-6 md:py-8 ${statsVisible ? "stat-reveal" : "opacity-0"}`}
            style={{ animationDelay: "0.24s" }}
          >
            <p className="text-2xl font-bold text-white sm:text-3xl">&lt;{statSecs}s</p>
            <p className="mt-1 text-sm text-gray-400">To reach attorney team</p>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-gray-500">
          <sup className="font-semibold text-red-400">*</sup> Totals and percentages are aggregate,
          self-reported figures from independent partner law firms in the WreckMatch network over time, not
          averages per client or per case. &quot;Success rate&quot; reflects each firm&apos;s internal
          methodology (definitions vary) and is not independently audited by WreckMatch. Past results do not
          guarantee future outcomes.{" "}
          <a
            href="#advertising-legal-notice"
            className="text-red-400 underline transition-all duration-200 hover:text-red-300"
          >
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
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-md shadow-gray-900/5 transition-all duration-200 will-change-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="mb-3 text-yellow-400" aria-label="5 out of 5 stars">
                ★★★★★
              </p>
              <p className="text-gray-700">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm text-gray-500">— {t.who}</footer>
              <p className="mt-2 text-xs font-semibold text-green-600">✓ Verified Client</p>
            </blockquote>
          ))}
        </div>
      </section>

      {/* SECTION F — HOW IT WORKS */}
      <section ref={stepsSectionRef} className="bg-white px-4 py-14 sm:py-16">
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
                n: "01",
                emoji: "📋",
                title: "Tell Us What Happened",
                body: "30 seconds. Name, phone, state, when it happened.",
              },
              {
                n: "02",
                emoji: "📞",
                title: "We Reach You Instantly",
                body: "Our team calls and texts you within 60 seconds.",
              },
              {
                n: "03",
                emoji: "⚖️",
                title: "Get Matched to an Attorney",
                body: "Licensed PI lawyers from a network with over $1 billion recovered and a 99.9% track record.",
              },
              {
                n: "04",
                emoji: "💰",
                title: "Get the Compensation You Deserve",
                body: "You pay nothing unless you win.",
              },
            ].map((step, i) => (
              <li
                key={step.title}
                className={`step-reveal relative flex flex-col gap-2 overflow-hidden bg-white px-2 py-8 text-center md:px-4 md:pt-10 ${
                  stepsVisible ? "step-reveal-visible" : ""
                }`}
                style={{ transitionDelay: `${120 + i * 90}ms` }}
              >
                <span
                  className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 select-none text-7xl font-black leading-none text-gray-200/25 sm:text-8xl md:top-6"
                  aria-hidden
                >
                  {step.n}
                </span>
                <span className="relative z-10 text-3xl" aria-hidden>
                  {step.emoji}
                </span>
                <p className="relative z-10 font-bold text-gray-900">{step.title}</p>
                <p className="relative z-10 text-sm leading-relaxed text-gray-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SECTION G — TRUST BAR */}
      <section className="bg-gray-950 py-5 md:py-6">
        <div className="hidden flex-wrap items-center justify-center gap-x-2 gap-y-2 px-4 text-center text-sm text-white md:flex md:text-base">
          {TRUST_ITEMS.map((t, i) => (
            <span key={t} className="contents">
              {i > 0 && <span className="text-gray-600">&nbsp;|&nbsp;</span>}
              <span>{t}</span>
            </span>
          ))}
        </div>
        <div className="md:hidden">
          <div className="overflow-hidden">
            <div className="trust-marquee-track flex w-max gap-16 px-4 text-sm text-white">
              {[...TRUST_ITEMS, ...TRUST_ITEMS].map((t, i) => (
                <span key={`${t}-${i}`} className="shrink-0 whitespace-nowrap">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
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
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-red-600 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-gray-100"
        >
          Get Free Help Right Now →
        </Link>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-200 bg-gray-100 px-4 py-14 sm:py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const open = faqOpen === i;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50"
                  onClick={() => setFaqOpen(open ? null : i)}
                  aria-expanded={open}
                >
                  {item.q}
                  <span className="shrink-0 text-xl text-red-600 transition-transform duration-200">
                    {open ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="border-t border-gray-100 px-5 pb-4 pt-2 text-sm leading-relaxed text-gray-600">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ADVERTISING & LEGAL NOTICE */}
      <section
        id="advertising-legal-notice"
        className="scroll-mt-20 border-t border-gray-800 bg-gray-900 px-4 py-12"
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
            <a
              href="#advertising-legal-notice"
              className="text-gray-400 underline transition-all duration-200 hover:text-gray-300"
            >
              Advertising &amp; legal notice
            </a>{" "}
            above; they are not promises or predictions for your case.
          </p>
        </div>
      </footer>

      {/* Exit intent modal */}
      {exitModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-modal-title"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200">
            <button
              type="button"
              className="absolute right-3 top-3 rounded-lg px-2 py-1 text-sm text-gray-500 transition-all duration-200 hover:bg-gray-100"
              onClick={() => setExitModalOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <p className="text-center text-xs font-bold uppercase tracking-wider text-red-600">WreckMatch</p>
            <h2 id="exit-modal-title" className="mt-2 text-center text-xl font-bold text-gray-900 sm:text-2xl">
              Wait — Don&apos;t Leave Without Getting Help
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600">
              You may be owed significant compensation. It takes 30 seconds and costs nothing.
            </p>
            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-red-600 py-3 text-base font-bold text-white transition-all duration-200 hover:bg-red-500"
              onClick={() => {
                setExitModalOpen(false);
                scrollToForm();
              }}
            >
              Get My Free Case Review →
            </button>
            <button
              type="button"
              className="mt-3 w-full text-center text-xs text-gray-500 transition-all duration-200 hover:text-gray-700"
              onClick={() => setExitModalOpen(false)}
            >
              No thanks, I&apos;ll handle it myself
            </button>
          </div>
        </div>
      )}

      {/* Activity toast */}
      {toastVisible && !toastDismissed && (
        <div
          className={`fixed left-4 z-[55] max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-lg transition-all duration-300 ease-out will-change-transform ${
            formInView ? "bottom-6" : "bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))]"
          } md:bottom-6`}
          style={{ transform: toastVisible ? "translateY(0)" : "translateY(12px)", opacity: 1 }}
        >
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-400 transition-all duration-200 hover:text-gray-700"
            onClick={() => {
              setToastDismissed(true);
              setToastVisible(false);
            }}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
          <p className="pr-6 text-xs font-bold uppercase tracking-wide text-gray-500">Recent activity:</p>
          <div className="mt-2 flex items-start gap-2">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" aria-hidden />
            <div>
              <p className="text-sm text-gray-800">
                <span className="font-bold text-gray-900">{ACTIVITY_MESSAGES[toastIndex].line}</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">{ACTIVITY_MESSAGES[toastIndex].ago}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating mobile CTA */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex h-14 items-stretch gap-0 border-t border-gray-800 bg-gray-950 pb-[env(safe-area-inset-bottom,0px)] transition-transform duration-300 ease-out md:hidden ${
          formInView ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <a
          href="tel:19785156063"
          className="flex flex-1 items-center justify-center bg-gray-900 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-800"
        >
          📞 Call Now
        </a>
        <button
          type="button"
          className="flex flex-1 items-center justify-center bg-red-600 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-500"
          onClick={scrollToForm}
        >
          Get Free Help →
        </button>
      </div>
    </div>
  );
}
