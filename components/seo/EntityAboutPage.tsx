import Link from "next/link";
import { AuthorityPageShell } from "@/components/seo/AuthorityPageShell";
import { CTASection } from "@/components/seo/CTASection";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  crumbs: { label: string; href?: string }[];
  source: string;
};

export function EntityAboutPage({ title, subtitle, children, crumbs, source }: Props) {
  return (
    <AuthorityPageShell crumbs={crumbs}>
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>
      <p className="mt-3 text-lg text-emerald-400">{subtitle}</p>
      <ReferralDisclaimer variant="primary" className="mt-6 border-slate-700 text-slate-400" />
      <div className="mt-8 space-y-4 text-base leading-relaxed text-slate-300">{children}</div>
      <p className="mt-8 text-sm text-slate-500">
        <Link href="/about-wreckmatch" className="text-emerald-400 hover:underline">
          About WreckMatch
        </Link>
        {" · "}
        <Link href="/about-accident-survival-guide" className="text-emerald-400 hover:underline">
          Accident Survival Guide
        </Link>
        {" · "}
        <Link href="/ai-accident-help" className="text-emerald-400 hover:underline">
          AI resource center
        </Link>
      </p>
      <div className="mt-10">
        <CTASection source={source} showForm={false} />
      </div>
    </AuthorityPageShell>
  );
}
