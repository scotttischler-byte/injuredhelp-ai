import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { LeadForm } from "@/components/LeadForm";
import { serverSiteBrand, serverSiteOrigin } from "@/lib/site";

const origin = serverSiteOrigin();
const brand = serverSiteBrand();

export const metadata: Metadata = {
  title: "Truck Accident Help — Free Attorney Matching",
  description:
    "What to do after a semi-truck or 18-wheeler crash. Free matching with truck accident attorneys in all 50 states. FMCSA evidence, black box, and insurer tactics explained.",
  alternates: { canonical: `${origin}/truck-accident-help` },
};

export default function TruckAccidentHelpPage() {
  const isTruck = brand === "semitruckmatch";

  return (
    <div className={isTruck ? "min-h-screen bg-[#070b14] text-slate-100" : "min-h-screen bg-slate-950 text-slate-100"}>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <p className={`text-xs font-bold uppercase tracking-widest ${isTruck ? "text-amber-500" : "text-emerald-500"}`}>
          Victim resources
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          Truck accident help — what to do first
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          After a collision with a semi, 18-wheeler, or commercial truck, your next steps affect medical care,
          evidence, and any future claim. SemiTruckMatch connects you with experienced truck accident counsel at
          no upfront cost.
        </p>

        <ol className="mt-10 space-y-6 text-slate-300">
          {[
            {
              title: "1. Get medical care and document injuries",
              body: "Even if you feel fine, internal injuries and concussions can appear later. Keep ER and follow-up records.",
            },
            {
              title: "2. Do not give recorded statements to insurers",
              body: "The motor carrier and their insurer may contact you quickly. Speak with an attorney before signing anything.",
            },
            {
              title: "3. Preserve truck evidence immediately",
              body: "ELD logs, dash cameras, maintenance records, and black-box data can be lost or overwritten within days.",
            },
            {
              title: "4. Get matched with truck-case attorneys",
              body: "Our network includes firms that handle FMCSA violations, underride crashes, and catastrophic highway injuries.",
            },
          ].map((step) => (
            <li key={step.title} className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-6">
              <h2 className="text-lg font-bold text-white">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/blog"
            className={`rounded-xl px-6 py-3 text-sm font-bold ${isTruck ? "bg-amber-500 text-slate-950" : "bg-emerald-500 text-slate-950"}`}
          >
            Read truck accident guides
          </Link>
          <Link
            href="/states"
            className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 hover:bg-slate-900"
          >
            Find your state
          </Link>
        </div>

        <div id="form" className="mt-14 scroll-mt-24">
          <LeadForm
            source="truck-accident-help"
            variant="conversion"
            defaultAccidentType="Truck Accident"
          />
        </div>
      </main>
    </div>
  );
}
