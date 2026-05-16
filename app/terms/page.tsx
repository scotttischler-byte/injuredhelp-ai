import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { LegalPageShell } from "@/components/LegalPageShell";
import { brandFromHeaders, BRAND_CONFIG, siteOriginFromHeaders } from "@/lib/site";

const LAST_UPDATED = "May 16, 2026";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const brand = brandFromHeaders(h);
  const cfg = BRAND_CONFIG[brand];
  return {
    title: `Terms of Use | ${cfg.name}`,
    description: `Terms governing ${cfg.name} website, chat, and customer care communications.`,
  };
}

export default async function TermsPage() {
  const h = await headers();
  const brand = brandFromHeaders(h);
  const cfg = BRAND_CONFIG[brand];
  const origin = siteOriginFromHeaders(h);

  return (
    <LegalPageShell brand={brand} title="Terms of Use">
      <p className="mt-2 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
      <p className="mt-6 text-sm leading-relaxed text-gray-300">
        These Terms of Use govern your access to {cfg.name} at{" "}
        <Link href="/" className="text-red-400 hover:text-red-300">
          {origin.replace(/^https:\/\//, "")}
        </Link>{" "}
        and related services. {cfg.name} is operated by Tophundred Global Ventures LLC as a legal referral service. We
        are <strong className="text-white">not a law firm</strong> and do not provide legal advice.
      </p>
      <section className="mt-10 space-y-3 text-sm leading-relaxed text-gray-300">
        <h2 className="text-xl font-bold text-white">1. Agreement</h2>
        <p>
          By using our website, chat widget, phone, or SMS programs, you agree to these Terms and our{" "}
          <Link href="/privacy" className="text-red-400 underline">
            Privacy Policy
          </Link>
          .
        </p>
        <h2 className="pt-4 text-xl font-bold text-white">2. Eligibility</h2>
        <p>You must be at least 18 years old and able to consent to be contacted about your inquiry.</p>
        <h2 className="pt-4 text-xl font-bold text-white">3. No attorney-client relationship</h2>
        <p>
          Submitting a form or speaking with our team does not create an attorney-client relationship. An attorney may
          contact you separately if you choose to proceed.
        </p>
        <h2 className="pt-4 text-xl font-bold text-white">4. Communications</h2>
        <p>
          We may contact you by phone, email, or SMS regarding your request. See our{" "}
          <Link href="/sms-terms" className="text-red-400 underline">
            SMS Terms
          </Link>{" "}
          for text messaging details.
        </p>
        <h2 className="pt-4 text-xl font-bold text-white">5. Contact</h2>
        <p>
          Questions:{" "}
          <a href={`mailto:${cfg.email}`} className="text-red-400 underline">
            {cfg.email}
          </a>{" "}
          ·{" "}
          <a href={`tel:${cfg.phone.replace(/\D/g, "")}`} className="text-red-400 underline">
            {cfg.phone}
          </a>
        </p>
      </section>
    </LegalPageShell>
  );
}
