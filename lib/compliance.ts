import {
  WRECKMATCH_PHONE_ACTIVATION_NOTE,
  WRECKMATCH_PHONE_DISPLAY,
  WRECKMATCH_PHONE_MARKETING,
  WRECKMATCH_PHONE_TEL,
} from "@/lib/phones";

export { WRECKMATCH_PHONE_ACTIVATION_NOTE, WRECKMATCH_PHONE_DISPLAY, WRECKMATCH_PHONE_MARKETING, WRECKMATCH_PHONE_TEL };

export const OPERATOR_LEGAL_NAME = "WreckMatch LLC";

/** Primary — hero, geo intros, general CTAs. */
export const PRIMARY_DISCLAIMER =
  "WreckMatch connects accident victims with experienced personal injury attorneys in their state at no upfront cost. We are a legal referral service operated by WreckMatch LLC — not a law firm — and we do not provide legal advice.";

/** Full — above/below intake forms and legal notice lead. */
export const FORM_DISCLAIMER =
  `${PRIMARY_DISCLAIMER} Submitting this form does not create an attorney-client relationship.`;

/** Short — site footer. */
export const FOOTER_DISCLAIMER =
  "WreckMatch is a legal referral service operated by WreckMatch LLC. We are not a law firm and do not provide legal advice.";

/** @deprecated Use FORM_DISCLAIMER */
export const REFERRAL_DISCLAIMER = FORM_DISCLAIMER;

/** Advertising & Legal Notice — top paragraph. */
export const ADVERTISING_LEAD_PARAGRAPH =
  `${PRIMARY_DISCLAIMER} Submitting any form on this website does not create an attorney-client relationship with WreckMatch.`;

export const FORM_SUCCESS_MESSAGE = (phone: string) =>
  `We are calling you within 60 seconds at ${phone}. You will speak with a live team member or Ava.`;

export const BLOG_FOOTER_DISCLAIMER = `${PRIMARY_DISCLAIMER} This article is general information only, not legal advice. For personalized help call ${WRECKMATCH_PHONE_DISPLAY} or submit the form on our homepage.`;

export const BUSINESS_ADDRESS = "832 Saint Augustine Road, Colgate, WI 53017";
export const COMPLIANCE_EMAIL = "help@wreckmatch.com";

/** Required intake consent (checkbox above submit). */
export const SMS_CONSENT_LABEL =
  "I consent to be contacted by phone, text (SMS), and email by WreckMatch and its partner attorneys regarding my inquiry. Message & data rates may apply. Reply STOP to opt out. I understand submitting this form does not create an attorney-client relationship.";

export const LEGAL_LAST_UPDATED = "May 18, 2026";
