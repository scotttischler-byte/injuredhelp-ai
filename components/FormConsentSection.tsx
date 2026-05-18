import type { CSSProperties } from "react";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

const boxStyle: CSSProperties = {
  margin: "20px 0 15px",
  padding: 15,
  background: "#f8f9fa",
  borderRadius: 8,
  fontSize: "0.9rem",
  lineHeight: 1.5,
  border: "1px solid #ddd",
};

const labelStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  cursor: "pointer",
  fontWeight: "normal",
};

const checkboxStyle: CSSProperties = {
  marginTop: 4,
  width: 20,
  height: 20,
  flexShrink: 0,
};

const policyStyle: CSSProperties = {
  marginTop: 12,
  fontSize: "0.88rem",
  color: "#444",
};

const linkStyle: CSSProperties = {
  textDecoration: "underline",
};

/** Required TCPA consent + policy links — above submit on main intake form. */
export function FormConsentSection({ checked, onChange, error }: Props) {
  return (
    <div
      className="consent-section"
      style={boxStyle}
      role="group"
      aria-labelledby="tcpa-consent-heading"
      data-compliance="tcpa-consent-checkbox"
    >
      <p
        id="tcpa-consent-heading"
        style={{ margin: "0 0 10px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#555" }}
      >
        Required: check the box to continue
      </p>
      <label htmlFor="tcpa-consent" style={labelStyle}>
        <input
          id="tcpa-consent"
          type="checkbox"
          name="tcpaConsent"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={checkboxStyle}
          aria-required="true"
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
      <p style={policyStyle}>
        By submitting, you agree to our{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="/terms" target="_blank" rel="noopener noreferrer" style={linkStyle}>
          Terms of Service
        </a>
        .
      </p>
    </div>
  );
}
