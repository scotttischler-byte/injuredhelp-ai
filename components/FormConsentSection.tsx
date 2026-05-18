import Link from "next/link";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

/** Required TCPA consent + policy links — above submit on main intake form. */
export function FormConsentSection({ checked, onChange, error }: Props) {
  return (
    <div
      className="consent-section my-5 space-y-3 rounded-lg border border-gray-200 bg-[#f8f9fa] p-4 text-[0.9rem] leading-relaxed text-gray-700"
      role="group"
      aria-labelledby="tcpa-consent-heading"
    >
      <p id="tcpa-consent-heading" className="text-xs font-bold uppercase tracking-wide text-gray-600">
        Required consent (check box to continue)
      </p>
      <label htmlFor="tcpa-consent" className="flex cursor-pointer items-start gap-2.5">
        <input
          id="tcpa-consent"
          type="checkbox"
          name="tcpaConsent"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 rounded border-gray-300 text-[#cc0000] focus:ring-[#cc0000]"
          aria-required="true"
          aria-describedby="tcpa-consent-text"
        />
        <span id="tcpa-consent-text">
          I consent to be contacted by phone, text (SMS), and email by WreckMatch and its partner attorneys about
          my inquiry. Message and data rates may apply. Reply STOP to opt out.{" "}
          <strong>Submitting this form does not create an attorney-client relationship.</strong>
        </span>
      </label>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <p className="text-[0.88rem] text-gray-600">
        By submitting, you agree to our{" "}
        <Link
          href="/privacy"
          className="font-medium text-[#cc0000] underline underline-offset-2 hover:text-[#b30000]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          href="/terms"
          className="font-medium text-[#cc0000] underline underline-offset-2 hover:text-[#b30000]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Service
        </Link>
        .
      </p>
    </div>
  );
}
