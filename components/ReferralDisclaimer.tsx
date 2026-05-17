import { FORM_DISCLAIMER, PRIMARY_DISCLAIMER } from "@/lib/compliance";

type Props = {
  className?: string;
  /** `primary` for hero/CTAs; `full` (default) for forms. */
  variant?: "primary" | "full";
};

/** Required above every intake form and primary CTA. */
export function ReferralDisclaimer({ className = "", variant = "full" }: Props) {
  const text = variant === "primary" ? PRIMARY_DISCLAIMER : FORM_DISCLAIMER;

  return (
    <p
      className={`rounded-lg border border-gray-700/60 bg-gray-900/50 px-4 py-3 text-xs leading-relaxed text-gray-400 sm:text-sm ${className}`}
      role="note"
    >
      {text}
    </p>
  );
}
