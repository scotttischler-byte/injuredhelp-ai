import { REFERRAL_DISCLAIMER } from "@/lib/compliance";

type Props = {
  className?: string;
};

/** Required above every intake form and primary CTA. */
export function ReferralDisclaimer({ className = "" }: Props) {
  return (
    <p
      className={`rounded-lg border border-gray-700/60 bg-gray-900/50 px-4 py-3 text-xs leading-relaxed text-gray-400 sm:text-sm ${className}`}
      role="note"
    >
      {REFERRAL_DISCLAIMER}
    </p>
  );
}
