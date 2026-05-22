/** WreckMatch intake phone — set WRECKMATCH_PHONE in env when vanity routing is live. */
export const WRECKMATCH_PHONE_E164 = process.env.WRECKMATCH_PHONE?.trim() || "+18558973256";

/** Marketing line (large type) */
export const WRECKMATCH_PHONE_VANITY = "855 WRECKMATCH";

/** Dialable digits (small type under vanity) */
export const WRECKMATCH_PHONE_DIGITS = "(855) 897-3256";

/** Plain text for metadata / SMS */
export const WRECKMATCH_PHONE_DISPLAY = `${WRECKMATCH_PHONE_VANITY} · ${WRECKMATCH_PHONE_DIGITS}`;

export const WRECKMATCH_PHONE_MARKETING = WRECKMATCH_PHONE_VANITY;
export const WRECKMATCH_PHONE_TEL = `tel:${WRECKMATCH_PHONE_E164.replace(/[^\d+]/g, "")}`;

export const WRECKMATCH_PHONE_ACTIVATION_NOTE =
  "Vanity line 855 WRECKMATCH may take 24–48 hours to fully activate — dial the digits below now.";
