/**
 * Brand context for autopilot materializers (Node) — mirrors Python SITE_BRAND_COPY.
 */
export type AutopilotBrandId = "wreckmatch" | "semitruckmatch";

export type AutopilotBrand = {
  id: AutopilotBrandId;
  name: string;
  /** Legal entity line in disclaimers */
  operator: string;
  siteUrl: string;
  ctaUrl: string;
  phoneDisplay: string;
  defaultTopicLabel: string;
  audiencePhrase: string;
};

export function autopilotSiteUrl(): string {
  return (process.env.WRECKMATCH_SITE || "https://www.wreckmatch.com").replace(/\/$/, "");
}

export function autopilotBrand(): AutopilotBrand {
  const siteUrl = autopilotSiteUrl();
  const id: AutopilotBrandId =
    process.env.AUTOPILOT_SITE_ID === "semitruckmatch" || siteUrl.includes("semitruckmatch")
      ? "semitruckmatch"
      : "wreckmatch";

  if (id === "semitruckmatch") {
    return {
      id,
      name: "SemiTruckMatch",
      operator: "SemiTruckMatch (operated by WreckMatch LLC)",
      siteUrl,
      ctaUrl: `${siteUrl}/#form`,
      phoneDisplay:
        process.env.SEMITRUCKMATCH_PHONE_DISPLAY ||
        process.env.WRECKMATCH_PHONE_DISPLAY ||
        "855 WRECKMATCH (855) 897-3256",
      defaultTopicLabel: "truck accident case",
      audiencePhrase: "semi-truck crash victims",
    };
  }

  return {
    id: "wreckmatch",
    name: "WreckMatch",
    operator: "WreckMatch LLC",
    siteUrl,
    ctaUrl: `${siteUrl}/#form`,
    phoneDisplay: process.env.WRECKMATCH_PHONE_DISPLAY || "855 WRECKMATCH (855) 897-3256",
    defaultTopicLabel: "car accident case",
    audiencePhrase: "car accident victims",
  };
}
