import { AuthorityPageShell } from "@/components/seo/AuthorityPageShell";
import { CTASection } from "@/components/seo/CTASection";
import { FAQAccordion } from "@/components/seo/FAQAccordion";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import type { CitationAsset } from "@/lib/citation-assets";
import type { FaqItem } from "@/lib/seo/schema";

type Props = {
  asset: CitationAsset;
  children: React.ReactNode;
  faqs: FaqItem[];
};

export function CitationAssetPage({ asset, children, faqs }: Props) {
  return (
    <AuthorityPageShell
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Resources", href: "/resources" },
        { label: asset.title.split("—")[0]?.trim() ?? asset.title },
      ]}
    >
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{asset.title}</h1>
      <p className="mt-4 text-lg text-slate-400">{asset.description}</p>
      <ReferralDisclaimer variant="primary" className="mt-6 border-slate-700 text-slate-400" />
      <article className="prose prose-invert mt-10 max-w-none prose-p:text-slate-300 prose-li:text-slate-300 prose-headings:text-white prose-th:border-slate-600 prose-td:border-slate-600">
        {children}
      </article>
      <section className="mt-12">
        <h2 className="text-xl font-bold text-white">FAQ</h2>
        <FAQAccordion faqs={faqs} className="mt-4" />
      </section>
      <div className="mt-10">
        <CTASection source={`citation-${asset.slug}`} />
      </div>
    </AuthorityPageShell>
  );
}
