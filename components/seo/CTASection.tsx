import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import { WreckMatchPhone } from "@/components/WreckMatchPhone";
import { WRECKMATCH_PHONE_ACTIVATION_NOTE } from "@/lib/phones";

type Props = {
  headline?: string;
  source: string;
  preselectedState?: string;
  showForm?: boolean;
};

export function CTASection({
  headline = "Free attorney matching in 60 seconds",
  source,
  preselectedState,
  showForm = true,
}: Props) {
  return (
    <section className="rounded-2xl border border-emerald-500/40 bg-slate-900 p-4 sm:p-6">
      <h2 className="text-center text-xl font-bold text-white sm:text-2xl">{headline}</h2>
      <div className="mt-4 flex justify-center">
        <WreckMatchPhone variant="dark" asLink />
      </div>
      <p className="mt-2 text-center text-xs text-slate-500">{WRECKMATCH_PHONE_ACTIVATION_NOTE}</p>
      <ReferralDisclaimer variant="primary" className="mt-4 border-slate-700 bg-slate-950/60 text-slate-400" />
      {showForm ? (
        <div className="mt-6" id="form">
          <LeadForm source={source} preselectedState={preselectedState} variant="conversion" />
        </div>
      ) : (
        <div className="mt-6 text-center">
          <Link
            href="/#form"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-emerald-500 px-8 py-3 text-base font-bold text-slate-950 touch-manipulation hover:bg-emerald-400"
          >
            Get matched free →
          </Link>
        </div>
      )}
    </section>
  );
}
