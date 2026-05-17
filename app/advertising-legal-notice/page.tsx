import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { LegalPageShell } from "@/components/LegalPageShell";
import { OPERATOR_LEGAL_NAME } from "@/lib/compliance";
import { HOME_TRANSLATIONS } from "@/lib/homeTranslations";
import { buildPageMetadata } from "@/lib/seo";
import { brandFromHeaders } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  return buildPageMetadata({
    title: "Advertising & Legal Notice | WreckMatch",
    description:
      `Full advertising disclaimer for WreckMatch, a legal referral service operated by ${OPERATOR_LEGAL_NAME}. Not a law firm.`,
    path: "/advertising-legal-notice",
    headers: h,
  });
}

export default async function AdvertisingLegalNoticePage() {
  const h = await headers();
  const brand = brandFromHeaders(h);
  const t = HOME_TRANSLATIONS.en;

  return (
    <LegalPageShell brand={brand} title={t.advertisingHeading}>
      <div className="space-y-4 text-sm leading-relaxed text-gray-300">
        <p className="rounded-lg border border-gray-700 bg-gray-900/50 p-4 text-gray-200">
          WreckMatch is a legal referral service operated by <strong>{OPERATOR_LEGAL_NAME}</strong>.
          We are <strong>not a law firm</strong> and do not provide legal advice. Submitting any form on this
          website does not create an attorney-client relationship with WreckMatch.
        </p>
        {t.advertisingBlocks.map((block) => (
          <p key={block.slice(0, 48)}>{block}</p>
        ))}
        <p>{t.footerP1}</p>
        <p>{t.footerP2}</p>
      </div>
      <p className="mt-8 text-sm">
        <Link href="/" className="text-red-400 hover:underline">
          ← Return to homepage
        </Link>
        {" · "}
        <Link href="/privacy" className="text-red-400 hover:underline">
          Privacy Policy
        </Link>
      </p>
    </LegalPageShell>
  );
}
