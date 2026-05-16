import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { LegalPageShell } from "@/components/LegalPageShell";
import { brandFromHeaders, BRAND_CONFIG } from "@/lib/site";

const LAST_UPDATED = "May 16, 2026";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const brand = brandFromHeaders(h);
  const cfg = BRAND_CONFIG[brand];
  return {
    title: `SMS Terms | ${cfg.name}`,
    description: `SMS and MMS program terms for ${cfg.name} customer care and case intake support.`,
  };
}

export default async function SmsTermsPage() {
  const h = await headers();
  const brand = brandFromHeaders(h);
  const cfg = BRAND_CONFIG[brand];

  return (
    <LegalPageShell brand={brand} title="SMS Terms">
      <p className="mt-2 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
      <p className="mt-6 text-sm leading-relaxed text-gray-300">
        This page describes how {cfg.name} uses text messaging for customer care and service related to your car
        accident inquiry.
      </p>
      <section className="mt-10 space-y-4 text-sm leading-relaxed text-gray-300">
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <h2 className="text-lg font-bold text-white">Program</h2>
          <p className="mt-2">
            When you provide your mobile number and opt in through our website form, chat widget, or another legally
            sufficient method, you consent to receive service-related texts from or on behalf of {cfg.name} regarding
            your inquiry.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-white">Frequency:</strong> Message frequency varies based on your case status.
            </li>
            <li>
              <strong className="text-white">Rates:</strong> Message and data rates may apply.
            </li>
            <li>
              <strong className="text-white">Opt-out:</strong> Reply <strong className="text-white">STOP</strong> to
              unsubscribe from SMS. Reply <strong className="text-white">HELP</strong> for help.
            </li>
            <li>
              <strong className="text-white">Consent:</strong> Consent to SMS is not a condition of purchasing any goods
              or services.
            </li>
          </ul>
        </div>
        <p>
          For privacy practices, see our{" "}
          <Link href="/privacy" className="text-red-400 underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-red-400 underline">
            Terms of Use
          </Link>
          .
        </p>
        <p>
          Support:{" "}
          <a href={`mailto:${cfg.email}`} className="text-red-400 underline">
            {cfg.email}
          </a>{" "}
          · {cfg.phone}
        </p>
      </section>
    </LegalPageShell>
  );
}
