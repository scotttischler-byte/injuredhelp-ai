import Link from "next/link";
import { headers } from "next/headers";
import { OPERATOR_LEGAL_NAME, REFERRAL_DISCLAIMER } from "@/lib/compliance";
import { siteOriginFromHeaders } from "@/lib/site";

const FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/sms-terms", label: "SMS Terms" },
  { href: "/advertising-legal-notice", label: "Full Advertising & Legal Notice" },
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
        </nav>
        <p className="mt-6 text-center text-xs leading-relaxed text-gray-500">{REFERRAL_DISCLAIMER}</p>
        <p className="mt-3 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} {OPERATOR_LEGAL_NAME} d/b/a WreckMatch —{" "}
          <a href={origin} className="text-gray-400 hover:text-white">
            {origin.replace(/^https:\/\//, "")}
          </a>
        </p>
      </div>
    </footer>
  );
}
