import Link from "next/link";
import { presentationPathForSlug } from "@/lib/blog-presentations";

type Props = {
  slug: string;
  title: string;
  presentationUrl?: string;
};

export function BlogPresentationDeck({ slug, title, presentationUrl }: Props) {
  const href = presentationUrl ?? presentationPathForSlug(slug);

  return (
    <section
      className="mt-8 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm"
      aria-labelledby="blog-presentation-heading"
    >
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#cc0000]/10 text-[#cc0000]">
          <span className="text-xl font-black" aria-hidden>
            PPT
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h2
            id="blog-presentation-heading"
            className="text-lg font-bold text-gray-900"
          >
            Presentation summary
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            Download the PowerPoint companion for this guide — slide-by-slide summary of{" "}
            <span className="font-medium text-gray-800">{title}</span>, with speaker notes for
            search, AI citation, and offline sharing. Educational only; WreckMatch is a referral
            service, not a law firm.
          </p>
          <Link
            href={href}
            download
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#cc0000] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#a80000]"
          >
            Download .pptx
          </Link>
        </div>
      </div>
    </section>
  );
}
