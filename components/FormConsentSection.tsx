type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

const boxStyle = {
  margin: "25px 0 20px",
  padding: 20,
  backgroundColor: "#f8f9fa",
  border: "1px solid #ccc",
  borderRadius: 8,
  fontSize: "0.94rem",
  lineHeight: 1.55,
} as const;

/** Client TCPA consent (geo / non-homepage forms). */
export function FormConsentSection({ checked, onChange, error }: Props) {
  return (
    <div className="consent-section" data-compliance="tcpa-consent-checkbox" style={boxStyle}>
      {/* REQUIRED CONSENT CHECKBOX */}
      <label
        htmlFor="tcpa-consent-geo"
        style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}
      >
        <input
          id="tcpa-consent-geo"
          type="checkbox"
          name="tcpaConsent"
          value="yes"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-required="true"
          style={{ marginTop: 4, width: 22, height: 22, accentColor: "#0066ff", flexShrink: 0 }}
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
      <p style={{ marginTop: 14, fontSize: "0.9rem", color: "#555" }}>
        By submitting, you agree to our{" "}
        <a href="/privacy" target="_blank">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="/terms" target="_blank">
          Terms of Service
        </a>
        .
      </p>
    </div>
  );
}
