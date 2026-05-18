import Link from "next/link";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

/** Required TCPA consent + policy links — above submit on main intake form. */
export function FormConsentSection({ checked, onChange, error }: Props) {
  return (
    <div className="consent-section my-4 space-y-2.5 text-sm leading-relaxed text-gray-700">
      <label className="flex cursor-pointer items-start gap-2">
        <input
          type="checkbox"
          name="tcpaConsent"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-[18px] w-[18px] shrink-0 rounded border-gray-300 text-[#cc0000] focus:ring-[#cc0000]"
          aria-required="true"
        />
        <span>
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
      <p className="text-[0.85rem] text-gray-600">
        By submitting, you agree to our{" "}
        <Link
          href="/privacy"
          className="font-medium text-[#cc0000] underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          href="/terms"
          className="font-medium text-[#cc0000] underline-offset-2 hover:underline"
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
