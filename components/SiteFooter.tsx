import Link from "next/link";
import { headers } from "next/headers";
import { TexasMetroLinks } from "@/components/TexasMetroLinks";
import { FOOTER_DISCLAIMER, OPERATOR_LEGAL_NAME } from "@/lib/compliance";
import { WreckMatchPhone } from "@/components/WreckMatchPhone";
import { siteOriginFromHeaders } from "@/lib/site";

const FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/advertising-legal-notice", label: "Advertising & Legal Notice" },
  { href: "/sms-terms", label: "SMS Terms" },
] as const;

export async function SiteFooter() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);

  return (
    <footer className="mt-auto border-t border-gray-800 bg-gray-950 px-4 py-10 text-gray-400">
      <div className="mx-auto max-w-5xl">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-gray-300"
          aria-label="Legal and policies"
        >
          {FOOTER_LINKS.map((link, i) => (
            <span key={link.href} className="contents">
              {i > 0 ? <span className="hidden text-gray-600 sm:inline" aria-hidden>|</span> : null}
              <Link href={link.href} className="underline-offset-4 hover:text-white hover:underline">
                {link.label}
              </Link>
            </span>
          ))}
          <span className="hidden text-gray-600 sm:inline" aria-hidden>|</span>
          <Link href="/resources" className="underline-offset-4 hover:text-white hover:underline">
            Resources
          </Link>
          <span className="hidden text-gray-600 sm:inline" aria-hidden>|</span>
          <Link href="/ai-accident-help" className="underline-offset-4 hover:text-white hover:underline">
            AI help hub
          </Link>
          <span className="hidden text-gray-600 sm:inline" aria-hidden>|</span>
          <Link href="/llms.txt" className="text-gray-500 underline-offset-4 hover:text-gray-300 hover:underline">
            llms.txt
          </Link>
        </nav>
        <TexasMetroLinks variant="footer" />
        <p className="mt-6 text-center text-xs leading-relaxed text-gray-500">{FOOTER_DISCLAIMER}</p>
        <p className="mt-3 text-center text-xs font-medium text-gray-500">
          © {new Date().getFullYear()} {OPERATOR_LEGAL_NAME} — Legal Referral Service (Not a Law Firm)
        </p>
        <p className="mt-1 text-center text-xs text-gray-600">
          <a href={origin} className="text-gray-400 hover:text-white">
            {origin.replace(/^https:\/\//, "")}
          </a>
          {" · "}
          <WreckMatchPhone variant="light" asLink className="inline-flex" />
        </p>
      </div>
    </footer>
  );
}
