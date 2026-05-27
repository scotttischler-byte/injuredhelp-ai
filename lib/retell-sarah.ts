/**
 * Outbound "Sarah" voice calls via Retell (create-phone-call).
 * from_number must be a Retell-provisioned number, not the generic Twilio SMS line.
 */

export type SarahCallPayload = {
  toE164: string;
  firstName: string;
  lastName?: string;
  email?: string;
  state: string;
  city?: string;
  zip?: string;
  timing?: string;
  injuries?: string;
  source?: string;
  language?: string;
  geoTag?: string;
  attorneyAssigned?: string;
  brand?: string;
  leadId?: string;
};

export type SarahCallResult =
  | { ok: true; callId?: string }
  | { ok: false; reason: string; status?: number; detail?: string };

function str(v: unknown): string {
  if (v == null) return "";
  return String(v).trim();
}

/** Retell dynamic variables must be string values only. */
export function sarahDynamicVariables(p: SarahCallPayload): Record<string, string> {
  return {
    lead_name: str(p.firstName) || "there",
    lead_first_name: str(p.firstName),
    lead_last_name: str(p.lastName),
    lead_email: str(p.email),
    lead_state: str(p.state),
    lead_city: str(p.city),
    lead_zip: str(p.zip),
    accident_timing: str(p.timing) || "Not specified",
    injury_types: str(p.injuries) || "Not specified",
    geo_tag: str(p.geoTag),
    attorney_assigned: str(p.attorneyAssigned),
    lead_source: str(p.source) || "website",
    language: str(p.language) || "English",
    brand: str(p.brand) || "WreckMatch",
    agent_name: "Sarah",
    call_purpose: "post_form_conversion",
  };
}

export function retellSarahAgentId(brandAgentId?: string): string {
  return (
    process.env.RETELL_VOICE_AGENT_ID?.trim() ||
    brandAgentId?.trim() ||
    process.env.RETELL_AGENT_ID?.trim() ||
    ""
  );
}

/** E.164 number registered in Retell for outbound caller ID (Sarah line). */
export function retellSarahFromNumber(fallbackTwilio?: string): string {
  const from =
    process.env.RETELL_PHONE_NUMBER?.trim() ||
    process.env.RETELL_FROM_NUMBER?.trim() ||
    process.env.WRECKMATCH_PHONE?.trim() ||
    fallbackTwilio?.trim() ||
    "";
  if (!from) return "";
  if (from.startsWith("+")) return from;
  const digits = from.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return from;
}

/** Fire Sarah outbound call to a new lead. */
export async function createSarahOutboundCall(
  payload: SarahCallPayload,
  options?: { brandAgentId?: string },
): Promise<SarahCallResult> {
  const apiKey = process.env.RETELL_API_KEY?.trim();
  const agentId = retellSarahAgentId(options?.brandAgentId);
  const fromNumber = retellSarahFromNumber(process.env.TWILIO_PHONE_NUMBER);

  if (!apiKey) return { ok: false, reason: "RETELL_API_KEY not configured" };
  if (!agentId) return { ok: false, reason: "RETELL_VOICE_AGENT_ID / RETELL_AGENT_ID not configured" };
  if (!fromNumber) return { ok: false, reason: "RETELL_PHONE_NUMBER not configured" };
  if (!payload.toE164?.startsWith("+")) return { ok: false, reason: "invalid toE164" };

  const body = {
    from_number: fromNumber,
    to_number: payload.toE164,
    override_agent_id: agentId,
    metadata: {
      source: payload.source ?? "website",
      geo_tag: payload.geoTag ?? "",
      brand: payload.brand ?? "WreckMatch",
      sarah_outbound: "true",
      lead_id: payload.leadId ?? "",
    },
    retell_llm_dynamic_variables: sarahDynamicVariables(payload),
  };

  const res = await fetch("https://api.retellai.com/v2/create-phone-call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    return {
      ok: false,
      reason: "retell_api_error",
      status: res.status,
      detail: text.slice(0, 500),
    };
  }

  try {
    const data = JSON.parse(text) as { call_id?: string };
    return { ok: true, callId: data.call_id };
  } catch {
    return { ok: true };
  }
}
