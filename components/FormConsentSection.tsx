type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  inputId?: string;
};

/** FORCE VISIBLE TCPA CHECKBOX — directly in form JSX, above submit. */
export function FormConsentSection({
  checked,
  onChange,
  error,
  inputId = "tcpa-consent",
}: Props) {
  return (
    <>
      {/* FORCE VISIBLE TCPA CHECKBOX - Put this directly in the form JSX / HTML */}
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
        }}
      >
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
            required
            value="yes"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-required="true"
            style={{
              width: 22,
              height: 22,
              marginTop: 4,
              accentColor: "#0066ff",
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
    </>
  );
}
