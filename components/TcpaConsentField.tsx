/** Server-rendered TCPA consent — plain HTML checkbox in initial response for crawlers/reviewers. */
export function TcpaConsentField() {
  return (
    <div
      className="consent-section"
      data-compliance="tcpa-consent-checkbox"
      style={{
        margin: "20px 0 15px",
        padding: 15,
        background: "#f8f9fa",
        borderRadius: 8,
        border: "1px solid #ddd",
        fontSize: "0.92rem",
      }}
    >
      <label
        htmlFor="tcpa-consent"
        style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}
      >
        <input
          id="tcpa-consent"
          type="checkbox"
          name="tcpaConsent"
          required
          value="yes"
          style={{ marginTop: 4, width: 20, height: 20, flexShrink: 0 }}
          aria-required="true"
        />
        <span>
          I consent to be contacted by phone, text (SMS), and email by WreckMatch and its partner attorneys about my
          inquiry. Message and data rates may apply. Reply STOP to opt out.{" "}
          <strong>Submitting this form does not create an attorney-client relationship.</strong>
        </span>
      </label>
      <p style={{ marginTop: 12, fontSize: "0.88rem" }}>
        By submitting, you agree to our{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
          Terms of Service
        </a>
        .
      </p>
    </div>
  );
}
