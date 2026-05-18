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
  border: "1px solid #ddd",
  fontSize: "0.92rem",
};

const labelStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  cursor: "pointer",
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
};

const linkStyle: CSSProperties = {
  textDecoration: "underline",
};

/** Client fallback TCPA consent (geo / non-homepage forms). */
export function FormConsentSection({ checked, onChange, error }: Props) {
  return (
    <div className="consent-section" style={boxStyle} data-compliance="tcpa-consent-checkbox">
      <label htmlFor="tcpa-consent-geo" style={labelStyle}>
        <input
          id="tcpa-consent-geo"
          type="checkbox"
          name="tcpaConsent"
          required
          value="yes"
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
