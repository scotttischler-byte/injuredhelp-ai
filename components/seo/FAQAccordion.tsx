"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/seo/schema";

type Props = {
  faqs: FaqItem[];
  className?: string;
};

export function FAQAccordion({ faqs, className = "" }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <dl className={`space-y-3 ${className}`}>
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.question} className="rounded-xl border border-slate-700 bg-slate-900">
            <dt>
              <button
                type="button"
                className="flex w-full min-h-[48px] items-center justify-between gap-3 px-4 py-4 text-left text-base font-semibold text-white touch-manipulation"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{faq.question}</span>
                <span className="text-emerald-400 shrink-0" aria-hidden>
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </dt>
            {isOpen ? (
              <dd className="border-t border-slate-700 px-4 pb-4 pt-2 text-sm leading-relaxed text-slate-400">
                {faq.answer}
              </dd>
            ) : null}
          </div>
        );
      })}
    </dl>
  );
}
