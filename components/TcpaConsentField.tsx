/** Server-rendered TCPA consent — plain HTML checkbox in initial response for crawlers/reviewers. */
export function TcpaConsentField() {
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
          htmlFor="tcpa-consent"
          style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}
        >
          <input
            id="tcpa-consent"
            type="checkbox"
            name="tcpaConsent"
            required
            value="yes"
            aria-required="true"
            style={{ width: 22, height: 22, marginTop: 3, accentColor: "#0d6efd" }}
          />
          <span>
            I consent to be contacted by phone, text (SMS), and email by WreckMatch and its partner attorneys about my
            inquiry. Message and data rates may apply. Reply STOP to opt out.{" "}
            <strong>Submitting this form does not create an attorney-client relationship.</strong>
          </span>
        </label>
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
