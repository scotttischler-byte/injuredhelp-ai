export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedAdminCookieValue(): Promise<string | null> {
  const pass = process.env.ADMIN_PASSWORD?.trim();
  if (!pass) return null;
  return sha256Hex(`wm-admin-v1|${pass}`);
}

export const ADMIN_COOKIE = "wm_admin";
