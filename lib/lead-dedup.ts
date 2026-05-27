import { getSql } from "@/lib/db";

const DEFAULT_WINDOW_SEC = 180;

/** True if this phone had a lead intake within the dedup window (skip duplicate outbound calls). */
export async function isDuplicateLeadCall(phoneE164: string, windowSec = DEFAULT_WINDOW_SEC): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  const digits = phoneE164.replace(/\D/g, "").slice(-10);
  if (digits.length < 10) return false;

  try {
    const rows = await sql`
      SELECT id FROM leads
      WHERE RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 10) = ${digits}
        AND created_at > NOW() - (${windowSec}::int * INTERVAL '1 second')
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return Array.isArray(rows) && rows.length >= 1;
  } catch (e) {
    console.error("lead dedup check failed (non-fatal):", e);
    return false;
  }
}
