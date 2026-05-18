/** Server-rendered TCPA consent — literal HTML for crawlers and ad-platform reviewers. */
const TCPA_CONSENT_HTML = `<!-- REQUIRED TCPA CONSENT CHECKBOX - MUST BE CHECKED TO SUBMIT -->
<div class="consent-section" data-compliance="tcpa-consent-checkbox" style="margin: 25px 0 20px; padding: 20px; background: #f8f9fa; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.94rem; line-height: 1.55;">
  <label for="tcpa-consent" style="display: flex; align-items: flex-start; gap: 12px; cursor: pointer; font-weight: 400;">
    <input
      id="tcpa-consent"
      type="checkbox"
      name="tcpaConsent"
      value="yes"
      required
      aria-required="true"
      style="width: 22px; height: 22px; margin-top: 4px; accent-color: #0066ff; flex-shrink: 0;"
    />
    <span>
      I consent to be contacted by phone, text (SMS), and email by WreckMatch and its partner attorneys about my inquiry.
      Message and data rates may apply. Reply STOP to opt out.
      <strong>Submitting this form does not create an attorney-client relationship.</strong>
    </span>
  </label>
  <p style="margin-top: 14px; font-size: 0.9rem; color: #555;">
    By submitting, you agree to our
    <a href="/privacy" target="_blank">Privacy Policy</a> and
    <a href="/terms" target="_blank">Terms of Service</a>.
  </p>
</div>`;

export function TcpaConsentField() {
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: TCPA_CONSENT_HTML }} />;
}
