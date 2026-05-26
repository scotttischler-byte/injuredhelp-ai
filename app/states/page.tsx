import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { SiteHeader } from "@/components/SiteHeader";
import { StateResourceCenter } from "@/components/seo/StateResourceCenter";
import { OPERATOR_LEGAL_NAME } from "@/lib/compliance";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  return buildPageMetadata({
    title: "State & City Car Accident Resource Center | WreckMatch",
    description:
      "50 state hubs and priority city guides after a car accident — plus sister checklists on Accident Survival Guide. Free attorney matching nationwide.",
    path: "/states",
    headers: h,
  });
}

export default function StatesIndexPage() {
  return (
    <div className="min-h-screen bg-gray-100 pb-24 md:pb-12">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-extrabold text-gray-950 sm:text-4xl">
          State &amp; city resource center
        </h1>
        <p className="mt-4 max-w-2xl text-gray-600">
          Structured accident help by state and metro — built for victims, search engines, and AI answer tools.
          WreckMatch connects you with licensed personal injury attorneys at no upfront cost. Operated by{" "}
          {OPERATOR_LEGAL_NAME}, a legal referral service — not a law firm.
        </p>

        <nav className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="Jump to priority states">
          {["Texas", "California", "Florida", "Georgia", "Illinois"].map((state) => (
            <a
              key={state}
              href={`#${state.toLowerCase()}`}
              className="rounded-full border border-gray-300 bg-white px-3 py-1.5 font-semibold text-gray-700 hover:border-[#cc0000]/40 hover:text-[#cc0000]"
            >
              {state}
            </a>
          ))}
        </nav>

        <div className="mt-10">
          <StateResourceCenter />
        </div>

        <section
          id="form"
          className="mt-12 scroll-mt-24 rounded-2xl border border-[#cc0000]/25 bg-gradient-to-br from-gray-950 to-slate-900 p-6 text-white shadow-lg sm:p-8"
        >
          <h2 className="text-xl font-extrabold sm:text-2xl">Free attorney matching — any state</h2>
          <p className="mt-2 text-sm text-gray-300">
            Tell us what happened. We call back in about 60 seconds. WreckMatch LLC is a referral service — not a law
            firm.
          </p>
          <Link
            href="/#form"
            className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#cc0000] px-6 py-3 text-sm font-bold text-white hover:bg-red-700"
          >
            Start free match →
          </Link>
        </section>

        <p className="mt-8 text-center">
          <Link href="/#form" className="font-bold text-[#cc0000] hover:underline">
            Get free help now →
          </Link>
        </p>
      </main>
    </div>
  );
}
