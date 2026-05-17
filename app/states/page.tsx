import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { SiteHeader } from "@/components/SiteHeader";
import { stateHubSlug } from "@/lib/geo-routes";
import { OPERATOR_LEGAL_NAME } from "@/lib/compliance";
import { buildPageMetadata } from "@/lib/seo";
import { ALL_STATES } from "@/lib/states";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  return buildPageMetadata({
    title: "Car Accident Help by State | WreckMatch",
    description:
      "Free attorney matching in all 50 states after a car accident. WreckMatch LLC is a legal referral service — not a law firm.",
    path: "/states",
    headers: h,
  });
}

export default function StatesIndexPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-extrabold text-gray-950 sm:text-4xl">Car accident help by state</h1>
        <p className="mt-4 max-w-2xl text-gray-600">
          Select your state for local information and free attorney matching. WreckMatch connects accident
          victims with experienced personal injury attorneys at no upfront cost — a referral service operated by{" "}
          {OPERATOR_LEGAL_NAME}, not a law firm.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {ALL_STATES.map((s) => (
            <Link
              key={s.slug}
              href={`/${stateHubSlug(s.state)}`}
              className="rounded-lg border border-gray-200 bg-white py-3 text-center text-sm font-semibold text-gray-800 hover:border-[#cc0000] hover:text-[#cc0000]"
            >
              {s.abbreviation}
            </Link>
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link href="/#form" className="font-bold text-[#cc0000] hover:underline">
            Get free help now →
          </Link>
        </p>
      </main>
    </div>
  );
}
