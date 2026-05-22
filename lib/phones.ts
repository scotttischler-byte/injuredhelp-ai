/** WreckMatch intake phone — update env WRECKMATCH_PHONE when vanity line is live. */
export const WRECKMATCH_PHONE_E164 = process.env.WRECKMATCH_PHONE?.trim() || "+18558973256";

export const WRECKMATCH_PHONE_DISPLAY = "(855) 897-3256";
export const WRECKMATCH_PHONE_MARKETING = "(855) 8-WRECKMATCH";
export const WRECKMATCH_PHONE_TEL = `tel:${WRECKMATCH_PHONE_E164.replace(/[^\d+]/g, "")}`;

/** Shown near CTAs while vanity number provisions */
export const WRECKMATCH_PHONE_ACTIVATION_NOTE =
  `${WRECKMATCH_PHONE_MARKETING} is activating within 24–48 hours. Call ${WRECKMATCH_PHONE_DISPLAY} now for immediate help.`;
