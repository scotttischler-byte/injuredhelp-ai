/**
 * IndexNow protocol helpers (https://www.indexnow.org/documentation)
 * Option 1: key file at https://{host}/{key}.txt containing the key only.
 */

const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
] as const;

/** 8–128 chars: a-z, A-Z, 0-9, hyphen (per IndexNow docs). */
export function isValidIndexNowKey(key: string): boolean {
  if (key.length < 8 || key.length > 128) return false;
  return /^[a-zA-Z0-9-]+$/.test(key);
}

export function indexNowKeyFileUrl(site: string, key: string): string {
  return `${site.replace(/\/$/, "")}/${key}.txt`;
}

export function indexNowHostFromSite(site: string): string {
  return site.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** RFC-3986 — only submit normal https page URLs (not sitemap.xml, etc.). */
export function filterIndexNowUrls(urls: string[], host: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls) {
    try {
      const u = new URL(raw);
      if (u.protocol !== "https:" && u.protocol !== "http:") continue;
      if (u.hostname !== host && u.hostname !== `www.${host}` && `www.${u.hostname}` !== host) continue;
      const path = u.pathname.toLowerCase();
      if (path.endsWith(".xml") || path.endsWith(".txt") || path.endsWith(".json")) continue;
      const norm = u.toString();
      if (!seen.has(norm)) {
        seen.add(norm);
        out.push(norm);
      }
    } catch {
      continue;
    }
  }
  return out.slice(0, 10_000);
}

export type IndexNowResult = {
  endpoint: string;
  status: number;
  ok: boolean;
  body?: string;
};

/** POST batch — Option 1 (root key file, no keyLocation). */
export async function submitIndexNowBatch(
  site: string,
  key: string,
  urlList: string[],
): Promise<{ host: string; keyFile: string; urlCount: number; results: IndexNowResult[] }> {
  const host = indexNowHostFromSite(site);
  const filtered = filterIndexNowUrls(urlList, host);
  const payload = { host, key, urlList: filtered };

  const results: IndexNowResult[] = [];
  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const body = res.ok ? undefined : (await res.text()).slice(0, 300);
      results.push({
        endpoint,
        status: res.status,
        ok: res.status === 200 || res.status === 202,
        body,
      });
    } catch (e) {
      results.push({
        endpoint,
        status: 0,
        ok: false,
        body: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return {
    host,
    keyFile: indexNowKeyFileUrl(site, key),
    urlCount: filtered.length,
    results,
  };
}

/** GET single URL — for quick tests after publish. */
export async function submitIndexNowSingle(
  site: string,
  key: string,
  pageUrl: string,
): Promise<IndexNowResult[]> {
  const encodedUrl = encodeURIComponent(pageUrl);
  const results: IndexNowResult[] = [];
  for (const base of INDEXNOW_ENDPOINTS) {
    const url = `${base}?url=${encodedUrl}&key=${encodeURIComponent(key)}`;
    try {
      const res = await fetch(url, { method: "GET" });
      const body = res.ok ? undefined : (await res.text()).slice(0, 300);
      results.push({
        endpoint: base,
        status: res.status,
        ok: res.status === 200 || res.status === 202,
        body,
      });
    } catch (e) {
      results.push({
        endpoint: base,
        status: 0,
        ok: false,
        body: e instanceof Error ? e.message : String(e),
      });
    }
  }
  return results;
}
