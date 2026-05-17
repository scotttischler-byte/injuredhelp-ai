import type { Metadata } from "next";
import { TikTokThankYouFunnel } from "@/components/TikTokFunnel";
import { FOOTER_DISCLAIMER as WM_FOOTER } from "@/lib/compliance";

export const metadata: Metadata = {
  title: "You're Matched – WreckMatch",
  description:
    "Your request was received. An attorney team member will contact you within 60 seconds.",
  robots: "noindex, nofollow",
};

const FOOTER_DISCLAIMER = `${WM_FOOTER} Available in all 50 states. Attorney availability varies by state and case type. Results vary based on individual circumstances.`;

type Props = {
  searchParams: Promise<{ firstName?: string | string[] }>;
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export default async function ThankYouPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = firstParam(sp.firstName).trim();
  const displayName = raw ? safeDecode(raw) : "";

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
      <TikTokThankYouFunnel />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <ThankYouCard displayName={displayName} />
      </main>

      <footer className="border-t border-gray-800 px-4 py-8">
        <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-gray-500">
          {FOOTER_DISCLAIMER}
        </p>
      </footer>
    </div>
  );
}

function ThankYouCard({ displayName }: { displayName: string }) {
  return (
    <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900/80 p-8 shadow-2xl ring-1 ring-gray-800 sm:p-10">
      <p className="mb-6 text-center text-5xl text-green-500" aria-hidden>
        ✅
      </p>
      <h1 className="text-center text-2xl font-bold text-white sm:text-3xl">
        {displayName ? `You're All Set, ${displayName}!` : "You're All Set!"}
      </h1>
      <p className="mt-4 text-center text-base leading-relaxed text-gray-300">
        An attorney team member will call and text{" "}
        <a
          href="tel:+19785156063"
          className="font-semibold text-white underline decoration-red-500 underline-offset-2 hover:text-red-300"
        >
          (978) 515-6063
        </a>{" "}
        within the next 60 seconds. Keep your phone close.
      </p>
      <p className="mt-6 text-center text-sm leading-relaxed text-gray-400">
        Our team is already reviewing your case details. Most clients hear from an attorney within
        minutes — not days.
      </p>

      <ul className="mt-8 space-y-3 text-sm text-gray-300">
        <li className="flex gap-2">
          <span aria-hidden>✅</span>
          <span>No fees unless you win</span>
        </li>
        <li className="flex gap-2">
          <span aria-hidden>✅</span>
          <span>100% confidential</span>
        </li>
        <li className="flex gap-2">
          <span aria-hidden>✅</span>
          <span>Licensed attorney in your state</span>
        </li>
      </ul>

      <div className="mt-10 rounded-xl border border-gray-800 bg-gray-950/60 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">What happens next?</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-gray-300">
          <li>Our team calls you at the number you provided</li>
          <li>We review your accident details together</li>
          <li>You get matched to the best attorney for your case</li>
        </ol>
      </div>
    </div>
  );
}
