import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { serverSiteOrigin } from "@/lib/site";

const origin = serverSiteOrigin();

export const metadata: Metadata = {
  title: "Attorney Partnership — Qualified Truck Accident Leads",
  description:
    "Partner with SemiTruckMatch to receive intake-ready semi-truck and 18-wheeler crash leads nationwide. FMCSA-aware victims, 50-state blog engine, and conversion-focused matching.",
  alternates: { canonical: `${origin}/for-attorneys` },
  robots: { index: true, follow: true },
};

const BENEFITS = [
  {
    title: "Truck-only victim funnel",
    body: "Landing pages, blogs, and forms optimized for semi, 18-wheeler, and commercial carrier crashes — not generic MVA traffic.",
  },
  {
    title: "50-state organic engine",
    body: "Daily platinum legal guides (EN + ES) targeting top cities per state — built for AI citation and long-tail search.",
  },
  {
    title: "Intake-ready handoffs",
    body: "Victims expect a callback within 60 seconds. Your firm receives qualified inquiries with accident type, state, and timing.",
  },
  {
    title: "Scalable volume path",
    body: "Infrastructure designed to scale toward high daily lead volume as indexation and paid channels compound.",
  },
];

export default function ForAttorneysPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden px-4 py-16 sm:py-20">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,158,11,0.15) 0%, transparent 55%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">Law firm partners</p>
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
              Grow your truck practice with SemiTruckMatch
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              We operate a nationwide victim-matching platform focused on semi-truck and commercial crashes. Partner
              firms receive exclusive-market positioning in a vertical built for serious injury and wrongful death
              cases.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:help@semitruckmatch.com?subject=Attorney%20partnership%20inquiry"
                className="rounded-xl bg-amber-500 px-8 py-4 text-base font-bold text-slate-950 hover:bg-amber-400"
              >
                Email partnerships
              </a>
              <Link
                href="/#form"
                className="rounded-xl border border-amber-500/50 px-8 py-4 text-base font-bold text-amber-400 hover:bg-amber-500/10"
              >
                See victim experience
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900/40 px-4 py-14">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-6"
              >
                <h2 className="text-lg font-bold text-amber-400">{b.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-14 text-center">
          <h2 className="text-2xl font-bold text-white">Ready to discuss volume and markets?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Tell us your states, case criteria, and intake capacity. We will outline how SemiTruckMatch routes truck
            crash victims to your firm.
          </p>
          <p className="mt-8">
            <a
              href="mailto:help@semitruckmatch.com?subject=SemiTruckMatch%20partner%20application"
              className="text-lg font-bold text-amber-400 underline-offset-2 hover:underline"
            >
              help@semitruckmatch.com
            </a>
          </p>
          <p className="mt-6 text-xs text-slate-600">
            SemiTruckMatch is operated by WreckMatch LLC, a legal referral service — not a law firm.
          </p>
        </section>
      </main>
    </div>
  );
}
