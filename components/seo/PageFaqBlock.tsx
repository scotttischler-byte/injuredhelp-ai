import { faqPageJsonLd, type FaqItem } from "@/lib/seo/schema";

type Props = {
  heading?: string;
  faqs: FaqItem[];
  className?: string;
  dark?: boolean;
};

/** FAQ section + FAQPage JSON-LD for pillar/landing pages (GEO week-1 impact). */
export function PageFaqBlock({ heading = "Frequently asked questions", faqs, className = "", dark = false }: Props) {
  const ld = {
    "@context": "https://schema.org",
    ...faqPageJsonLd(faqs),
  };

  const summaryCls = dark
    ? "cursor-pointer list-none font-bold text-white"
    : "cursor-pointer list-none font-bold text-gray-900";
  const answerCls = dark ? "mt-3 text-sm leading-relaxed text-slate-300" : "mt-3 text-sm leading-relaxed text-gray-700";
  const cardCls = dark
    ? "group rounded-xl border border-slate-700 bg-slate-900/60 p-5 open:border-amber-500/50"
    : "group rounded-xl border border-gray-200 bg-white p-5 shadow-sm open:border-emerald-300";
  const headingCls = dark ? "text-2xl font-extrabold text-white" : "text-2xl font-extrabold text-gray-950";

  return (
    <section className={className} aria-labelledby="page-faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h2 id="page-faq-heading" className={headingCls}>
        {heading}
      </h2>
      <div className="mt-6 space-y-4">
        {faqs.map((f) => (
          <details key={f.question} className={cardCls} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <summary className={summaryCls} itemProp="name">
              {f.question}
            </summary>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className={answerCls} itemProp="text">
                {f.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
