import Link from "next/link";

/** Shown above form submit — links use ad-review-friendly paths. */
export function FormPolicyAgreement({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-gray-600 ${className}`}>
      By submitting, you agree to our{" "}
      <Link href="/privacy-policy" className="font-medium text-[#cc0000] underline-offset-2 hover:underline">
        Privacy Policy
      </Link>{" "}
      and{" "}
      <Link href="/terms-of-service" className="font-medium text-[#cc0000] underline-offset-2 hover:underline">
        Terms of Service
      </Link>
      .
    </p>
  );
}
