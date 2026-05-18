type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

/** Client fallback TCPA consent (geo / non-homepage forms). */
export function FormConsentSection({ checked, onChange, error }: Props) {
  return (
    <>
      {/* TCPA REQUIRED CONSENT CHECKBOX - THIS MUST BE CHECKED */}
      <div
        className="consent-section"
        data-compliance="tcpa-consent-checkbox"
        style={{
          margin: "25px 0 18px",
          padding: 18,
          backgroundColor: "#f8f9fa",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          fontSize: "0.93rem",
        }}
      >
        <label
          htmlFor="tcpa-consent-geo"
          style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}
        >
          <input
            id="tcpa-consent-geo"
            type="checkbox"
            name="tcpaConsent"
            required
            value="yes"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-required="true"
            style={{ width: 22, height: 22, marginTop: 3, accentColor: "#0d6efd" }}
          />
          <span>
            I consent to be contacted by phone, text (SMS), and email by WreckMatch and its partner attorneys about my
            inquiry. Message and data rates may apply. Reply STOP to opt out.{" "}
            <strong>Submitting this form does not create an attorney-client relationship.</strong>
          </span>
        </label>
        {error ? (
          <p style={{ marginTop: 8, fontSize: "0.85rem", color: "#b91c1c" }} role="alert">
            {error}
          </p>
        ) : null}
        <p style={{ marginTop: 14, fontSize: "0.9rem", color: "#444" }}>
          By submitting, you agree to our{" "}
          <a href="/privacy" target="_blank" rel="noopener">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/terms" target="_blank" rel="noopener">
            Terms of Service
          </a>
          .
        </p>
      </div>
    </>
  );
}
