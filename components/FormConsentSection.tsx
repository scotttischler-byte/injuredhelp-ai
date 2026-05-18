type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  inputId?: string;
};

/** Required TCPA consent — real JSX checkbox (SSR + client), above submit button. */
export function FormConsentSection({
  checked,
  onChange,
  error,
  inputId = "tcpa-consent",
}: Props) {
  return (
    <div
      className="consent-section"
      data-compliance="tcpa-consent-checkbox"
      style={{
        margin: "25px 0 20px",
        padding: 20,
        background: "#f8f9fa",
        border: "1px solid #d1d5db",
        borderRadius: 8,
        fontSize: "0.94rem",
        lineHeight: 1.55,
      }}
    >
      {/* REQUIRED TCPA CONSENT CHECKBOX - USERS MUST CHECK THIS */}
      <p
        style={{
          margin: "0 0 10px",
          fontSize: "0.8rem",
          fontWeight: 700,
          color: "#333",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        Required: check the box below to submit
      </p>
      <label
        htmlFor={inputId}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          cursor: "pointer",
          fontWeight: 400,
        }}
      >
        <input
          id={inputId}
          type="checkbox"
          name="tcpaConsent"
          value="yes"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-required="true"
          style={{
            width: 22,
            height: 22,
            marginTop: 4,
            accentColor: "#0066ff",
            flexShrink: 0,
          }}
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
