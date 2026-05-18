import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import {
  BUSINESS_ADDRESS,
  COMPLIANCE_EMAIL,
  FORM_DISCLAIMER,
  LEGAL_LAST_UPDATED,
  OPERATOR_LEGAL_NAME,
  WRECKMATCH_PHONE_DISPLAY,
  WRECKMATCH_PHONE_TEL,
} from "@/lib/compliance";
import { brandFromHeaders, BRAND_CONFIG, siteOriginFromHeaders } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const brand = brandFromHeaders(h);
  const cfg = BRAND_CONFIG[brand];
  return {
    title: `Privacy Policy | ${cfg.name}`,
    description: `How ${cfg.name} collects, uses, and protects your personal information.`,
  };
}

const LAST_UPDATED = LEGAL_LAST_UPDATED;

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-300">{children}</div>;
}

export default async function PrivacyPage() {
  const h = await headers();
  const siteOrigin = siteOriginFromHeaders(h);
  const brand = brandFromHeaders(h);
  const cfg = BRAND_CONFIG[brand];
  const siteHost = siteOrigin.replace(/^https:\/\//, "");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-sm font-semibold text-red-400 hover:text-red-300">
            ← Back to {cfg.name}
          </Link>
          <a href="tel:+19785156063" className="text-sm text-gray-400 hover:text-white">
            (978) 515-6063
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-14 pb-20">
        <p className="text-xs font-bold uppercase tracking-widest text-red-500">Legal</p>
        <h1 className="mt-3 text-4xl font-black">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>

        <p className="mt-6 text-sm leading-relaxed text-gray-300">
          {OPERATOR_LEGAL_NAME} (&quot;WreckMatch,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates{" "}
          <Link href="/" className="text-red-400 hover:text-red-300">
            {siteHost}
          </Link>
          . This Privacy Policy explains how we collect, use, disclose, and protect your information when you visit
          our website or submit a form.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-gray-300">
          <strong className="text-white">We are a legal referral service — not a law firm.</strong> Submitting a
          form does not create an attorney-client relationship. See our{" "}
          <Link href="/advertising-legal-notice" className="text-red-400 hover:underline">
            Advertising &amp; Legal Notice
          </Link>
          .
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">1. Information we collect</h2>
          <Prose>
            <p>
              <strong className="text-white">Information you provide.</strong> When you submit a form, register
              for a webinar, download a guide, or contact us, we may collect your name, phone number, email
              address, state, accident timing, injury details, language preference, and other information you
              choose to provide.
            </p>
            <p>
              <strong className="text-white">Communications.</strong> If you call or text us, or we contact you
              by phone or SMS, we may retain records of those communications as permitted by law.
            </p>
            <p>
              <strong className="text-white">Automatic data.</strong> We and our analytics partners may collect
              device and usage information (such as IP address, browser type, pages viewed, referring URL, and
              approximate location) through cookies, pixels, and similar technologies.
            </p>
          </Prose>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">2. How we use your information</h2>
          <Prose>
            <p>We use the information we collect to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Connect you with licensed personal injury attorneys or their teams in your state;</li>
              <li>Respond to your requests and provide customer support;</li>
              <li>Send transactional messages about your submission;</li>
              <li>
                Send marketing or educational emails or texts where you have consented or where permitted by
                law;
              </li>
              <li>Operate, secure, and improve the Services;</li>
              <li>Measure advertising performance and website usage;</li>
              <li>Comply with legal obligations and enforce our terms.</li>
            </ul>
          </Prose>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">3. Phone and SMS</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            By submitting your phone number on our forms, you consent to receive calls and text messages from
            WreckMatch, partner law firms, and service providers regarding your inquiry. Message and data rates
            may apply. Message frequency varies. Reply <strong className="text-white">STOP</strong> to opt out
            of marketing texts where supported, or contact us below. Reply <strong className="text-white">HELP</strong>{" "}
            for help. Consent is not a condition of purchasing any goods or services.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">4. How we share information</h2>
          <Prose>
            <p>We may share your information with:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Partner attorneys and law firms</strong> so they can evaluate and
                respond to your case inquiry;
              </li>
              <li>
                <strong className="text-white">Service providers</strong> that help us operate the Services (for
                example, hosting, CRM, email delivery, SMS and voice providers, analytics, and call routing),
                subject to contractual obligations to protect your data;
              </li>
              <li>
                <strong className="text-white">Legal and safety</strong> when required by law, subpoena, or to
                protect rights, safety, and security;
              </li>
              <li>
                <strong className="text-white">Business transfers</strong> in connection with a merger, sale, or
                reorganization, with notice where required by law.
              </li>
            </ul>
            <p>
              <strong className="text-white">Do Not Sell My Personal Information</strong> — We do not sell your
              personal information.
            </p>
          </Prose>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">5. Health information</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            We are <strong className="text-white">not</strong> a medical provider or covered health care entity. We
            use secure intake practices (256-bit encryption, secure forms) but we do not provide medical services or
            store detailed protected health information ourselves. Medical details you share are handled directly by
            the matched attorneys.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">6. Cookies and analytics</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            We use cookies and similar technologies to remember preferences, understand how visitors use the
            site, and measure marketing campaigns. You can control cookies through your browser settings. Our
            cookie banner lets you accept or learn more about this policy. Some analytics or advertising tools
            (such as Google Tag Manager or Google Ads, when enabled) may collect information about your visit
            according to their own policies.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">7. Data retention</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            We retain personal information for as long as needed to fulfill the purposes described in this
            policy, including maintaining business records, resolving disputes, and meeting legal requirements.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">8. Security</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            We use 256-bit SSL encryption and industry-standard security measures designed to protect personal
            information. No method of transmission over the Internet is completely secure, and we cannot guarantee
            absolute security.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">9. Your choices and rights (CCPA / GDPR where applicable)</h2>
          <Prose>
            <p>
              Depending on where you live, you may have rights to access, correct, delete, or restrict certain
              uses of your personal information, or to opt out of certain sharing for targeted advertising.
              California residents may have additional rights under the CCPA/CPRA. To exercise these rights,
              contact us below. We may need to verify your identity before responding.
            </p>
            <p>
              You may unsubscribe from marketing emails using the link in those messages. For SMS, follow the
              opt-out instructions in the message or contact us directly.
            </p>
          </Prose>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">10. Children</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            The Services are not directed to children under 13 (or under 16 where applicable), and we do not
            knowingly collect personal information from children. If you believe a child has provided us
            information, please contact us so we can delete it.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">11. Third-party links</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            The Services may link to third-party websites or services. We are not responsible for their privacy
            practices. We encourage you to review their policies before providing personal information.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">12. Changes to this policy</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            We may update this Privacy Policy from time to time. The “Last updated” date at the top reflects the
            latest version. Material changes may be posted on this page or otherwise communicated as required
            by law.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">13. Contact us</h2>
          <Prose>
            <p>For privacy questions or requests, contact {OPERATOR_LEGAL_NAME}:</p>
            <ul className="list-none space-y-1">
              <li>{BUSINESS_ADDRESS}</li>
              <li>
                Phone:{" "}
                <a href={WRECKMATCH_PHONE_TEL} className="text-red-400 hover:text-red-300">
                  {WRECKMATCH_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                Email:{" "}
                <a href={`mailto:${COMPLIANCE_EMAIL}`} className="text-red-400 hover:text-red-300">
                  {COMPLIANCE_EMAIL}
                </a>
              </li>
            </ul>
          </Prose>
        </section>

        <div className="mt-12 rounded-2xl border border-gray-800 bg-gray-900/30 p-6 text-xs leading-relaxed text-gray-500">
          {FORM_DISCLAIMER.replace(
            "Submitting this form",
            "Submitting information through this site",
          ).replace(
            "an attorney-client relationship.",
            "an attorney-client relationship with WreckMatch.",
          )}{" "}
          Attorney availability varies by state and case type.
        </div>
      </main>
    </div>
  );
}
