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
    <div className="min-h-screen bg-gray-100">
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

        <p className="mt-12 text-center">
          <Link href="/#form" className="font-bold text-[#cc0000] hover:underline">
            Get free help now →
          </Link>
        </p>
      </main>
    </div>
  );
}
