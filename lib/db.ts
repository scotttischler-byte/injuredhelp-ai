import { neon } from "@neondatabase/serverless";

// Neon serverless typings vary by version; treat the client as `any` at the boundary to keep builds stable.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sqlSingleton: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSql(): any {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (!sqlSingleton) sqlSingleton = neon(url);
  return sqlSingleton;
}

export async function logAutomation(
  channel: string,
  action: string,
  status: "success" | "error" | "skipped",
  details?: Record<string, unknown>,
) {
  const sql = getSql();
  if (!sql) return;
  await sql`
    INSERT INTO automation_logs (channel, action, status, details)
    VALUES (${channel}, ${action}, ${status}, ${JSON.stringify(details ?? {})}::jsonb)
  `;
}

export type LeadRow = {
  id: number;
  first_name: string;
  last_name: string | null;
  phone: string;
  email: string | null;
  state: string;
  timing: string | null;
  injuries: string | null;
  source: string | null;
  ghl_synced: boolean | null;
  geo_tag: string | null;
  attorney_assigned: string | null;
  city: string | null;
  zip: string | null;
  created_at: string;
};

export async function insertLead(input: {
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string | null;
  state: string;
  timing?: string;
  injuries?: string[];
  source?: string;
  ghlSynced?: boolean;
  geo_tag?: string;
  attorney_assigned?: string;
  city?: string;
  zip?: string;
}) {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  const injuries = input.injuries?.length ? input.injuries.join(", ") : null;
  const email = input.email?.trim() || null;
  await sql`
    INSERT INTO leads (
      first_name, last_name, phone, email, state, timing, injuries, source, ghl_synced,
      geo_tag, attorney_assigned, city, zip
    )
    VALUES (
      ${input.firstName},
      ${input.lastName ?? null},
      ${input.phone},
      ${email},
      ${input.state},
      ${input.timing ?? null},
      ${injuries},
      ${input.source ?? null},
      ${input.ghlSynced ?? false},
      ${input.geo_tag ?? null},
      ${input.attorney_assigned ?? null},
      ${input.city ?? null},
      ${input.zip ?? null}
    )
  `;
}

export async function listLeads(limit = 400): Promise<LeadRow[]> {
  const sql = getSql();
  if (!sql) return [];
  return (await sql`
    SELECT * FROM leads
    ORDER BY created_at DESC
    LIMIT ${Math.min(Math.max(limit, 1), 800)}
  `) as LeadRow[];
}

export async function leadStats() {
  const sql = getSql();
  if (!sql) {
    return { total: 0, today: 0, guideDownloads: 0 };
  }
  const totalRows = (await sql`SELECT COUNT(*)::text as count FROM leads`) as { count: string }[];
  const todayRows = (await sql`
    SELECT COUNT(*)::text as count FROM leads
    WHERE created_at >= date_trunc('day', NOW())
  `) as { count: string }[];
  const guideRows = (await sql`
    SELECT COUNT(*)::text as count FROM leads
    WHERE COALESCE(source,'') ILIKE '%guide%'
  `) as { count: string }[];
  return {
    total: Number(totalRows[0]?.count ?? 0),
    today: Number(todayRows[0]?.count ?? 0),
    guideDownloads: Number(guideRows[0]?.count ?? 0),
  };
}

export async function contentStats() {
  const sql = getSql();
  if (!sql) return { published: 0, pending: 0 };
  const pub = (await sql`
    SELECT COUNT(*)::text as count FROM content_queue WHERE status = 'published'
  `) as { count: string }[];
  const pend = (await sql`
    SELECT COUNT(*)::text as count FROM content_queue WHERE status IN ('pending','generating')
  `) as { count: string }[];
  return { published: Number(pub[0]?.count ?? 0), pending: Number(pend[0]?.count ?? 0) };
}

export async function subscriberStats() {
  const sql = getSql();
  if (!sql) return { active: 0 };
  const rows = (await sql`
    SELECT COUNT(*)::text as count FROM email_subscribers WHERE unsubscribed = FALSE
  `) as { count: string }[];
  return { active: Number(rows[0]?.count ?? 0) };
}

export async function signalStatsToday() {
  const sql = getSql();
  if (!sql) return 0;
  const rows = (await sql`
    SELECT COUNT(*)::text as count FROM automation_logs
    WHERE created_at >= date_trunc('day', NOW())
      AND channel IN ('reddit','social','press','email','autocomplete','outreach','youtube')
  `) as { count: string }[];
  return Number(rows[0]?.count ?? 0);
}

export type AutomationLogRow = {
  id: number;
  channel: string;
  action: string;
  status: string;
  details: unknown;
  created_at: string;
};

export async function recentAutomationLogs(limit = 20): Promise<AutomationLogRow[]> {
  const sql = getSql();
  if (!sql) return [];
  return (await sql`
    SELECT id, channel, action, status, details, created_at
    FROM automation_logs
    ORDER BY created_at DESC
    LIMIT ${limit}
  `) as AutomationLogRow[];
}

export type ContentQueueRow = {
  id: number;
  topic: string;
  type: string;
  target_keyword: string | null;
  state: string | null;
  city: string | null;
  status: string;
  generated_content: string | null;
  file_path: string | null;
  created_at: string;
  generated_at: string | null;
};

export async function listContentQueue(limit = 200): Promise<ContentQueueRow[]> {
  const sql = getSql();
  if (!sql) return [];
  return (await sql`
    SELECT * FROM content_queue ORDER BY id DESC LIMIT ${limit}
  `) as ContentQueueRow[];
}

export async function addContentQueueItem(input: {
  topic: string;
  type: string;
  target_keyword?: string;
  state?: string;
  city?: string;
}) {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  await sql`
    INSERT INTO content_queue (topic, type, target_keyword, state, city)
    VALUES (
      ${input.topic},
      ${input.type},
      ${input.target_keyword ?? null},
      ${input.state ?? null},
      ${input.city ?? null}
    )
  `;
}

export async function updateContentQueueStatus(
  id: number,
  status: string,
  patch?: { generated_content?: string | null; file_path?: string | null },
) {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  const generated = patch?.generated_content ?? null;
  const filePath = patch?.file_path ?? null;
  await sql`
    UPDATE content_queue
    SET status = ${status},
        generated_content = COALESCE(${generated}, generated_content),
        file_path = COALESCE(${filePath}, file_path),
        generated_at = CASE WHEN ${status} = 'published' THEN NOW() ELSE generated_at END
    WHERE id = ${id}
  `;
}

export async function getAutomationSettings(): Promise<
  { channel: string; enabled: boolean; rate_limit_per_day: number }[]
> {
  const sql = getSql();
  if (!sql) return [];
  return (await sql`
    SELECT channel, enabled, rate_limit_per_day FROM automation_settings ORDER BY channel ASC
  `) as { channel: string; enabled: boolean; rate_limit_per_day: number }[];
}

export async function upsertAutomationSetting(
  channel: string,
  enabled: boolean,
  rateLimitPerDay?: number,
) {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  const limit = rateLimitPerDay ?? 10;
  await sql`
    INSERT INTO automation_settings (channel, enabled, rate_limit_per_day)
    VALUES (${channel}, ${enabled}, ${limit})
    ON CONFLICT (channel)
    DO UPDATE SET enabled = EXCLUDED.enabled,
      rate_limit_per_day = EXCLUDED.rate_limit_per_day,
      updated_at = NOW()
  `;
}

export async function insertAutocompleteRow(input: {
  phrase: string;
  appearing: boolean;
  position: number | null;
  suggestions: unknown;
}) {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  await sql`
    INSERT INTO autocomplete_tracking (phrase, appearing, position, suggestions)
    VALUES (
      ${input.phrase},
      ${input.appearing},
      ${input.position},
      ${JSON.stringify(input.suggestions ?? [])}::jsonb
    )
  `;
}

export async function insertRedditPost(input: {
  subreddit: string;
  post_title: string;
  post_url: string;
  our_comment: string;
  reddit_comment_id?: string | null;
  status?: string;
}) {
  const sql = getSql();
  if (!sql) return;
  await sql`
    INSERT INTO reddit_posts (subreddit, post_title, post_url, our_comment, reddit_comment_id, status)
    VALUES (
      ${input.subreddit},
      ${input.post_title},
      ${input.post_url},
      ${input.our_comment},
      ${input.reddit_comment_id ?? null},
      ${input.status ?? "posted"}
    )
  `;
}

export async function redditPostExists(postUrl: string) {
  const sql = getSql();
  if (!sql) return false;
  const rows = (await sql`
    SELECT COUNT(*)::text as count FROM reddit_posts WHERE post_url = ${postUrl}
  `) as { count: string }[];
  return Number(rows[0]?.count ?? 0) > 0;
}

export async function countRedditPostsSince(sinceIso: string) {
  const sql = getSql();
  if (!sql) return 0;
  const rows = (await sql`
    SELECT COUNT(*)::text as count FROM reddit_posts WHERE created_at >= ${sinceIso}::timestamp
  `) as { count: string }[];
  return Number(rows[0]?.count ?? 0);
}

export async function lastRedditPostTime() {
  const sql = getSql();
  if (!sql) return null;
  const rows = (await sql`
    SELECT created_at FROM reddit_posts ORDER BY created_at DESC LIMIT 1
  `) as { created_at: string }[];
  return rows[0]?.created_at ?? null;
}

export async function insertSocialPost(input: {
  platform: string;
  content: string;
  source_slug?: string | null;
  status?: string;
  post_url?: string | null;
}) {
  const sql = getSql();
  if (!sql) return;
  await sql`
    INSERT INTO social_posts (platform, content, source_slug, status, post_url)
    VALUES (
      ${input.platform},
      ${input.content},
      ${input.source_slug ?? null},
      ${input.status ?? "pending"},
      ${input.post_url ?? null}
    )
  `;
}

export async function countSocialPostsToday(platform: string) {
  const sql = getSql();
  if (!sql) return 0;
  const rows = (await sql`
    SELECT COUNT(*)::text as count FROM social_posts
    WHERE platform = ${platform}
      AND created_at >= date_trunc('day', NOW())
  `) as { count: string }[];
  return Number(rows[0]?.count ?? 0);
}

export async function getLatestQueuedContent(limit = 2): Promise<ContentQueueRow[]> {
  const sql = getSql();
  if (!sql) return [];
  return (await sql`
    SELECT * FROM content_queue
    WHERE status IN ('pending','generating','published')
    ORDER BY id DESC
    LIMIT ${limit}
  `) as ContentQueueRow[];
}

export async function insertPressReleaseDb(input: {
  title: string;
  content: string;
  trigger_event?: string;
  distributed?: boolean;
  distribution_urls?: unknown;
}) {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  await sql`
    INSERT INTO press_releases (title, content, trigger_event, distributed, distribution_urls)
    VALUES (
      ${input.title},
      ${input.content},
      ${input.trigger_event ?? null},
      ${input.distributed ?? false},
      ${JSON.stringify(input.distribution_urls ?? {})}::jsonb
    )
  `;
}

export async function countGuideDownloads() {
  const sql = getSql();
  if (!sql) return 0;
  const rows = (await sql`
    SELECT COUNT(*)::text as count FROM email_subscribers
    WHERE COALESCE(source,'') ILIKE '%guide%'
  `) as { count: string }[];
  return Number(rows[0]?.count ?? 0);
}

export type SubscriberRow = {
  id: number;
  email: string;
  first_name: string | null;
  sequence_name: string | null;
  sequence_day: number | null;
  last_email_sent: string | null;
  created_at: string;
};

export async function listSubscribersDueForEmail(limit = 50): Promise<SubscriberRow[]> {
  const sql = getSql();
  if (!sql) return [];
  return (await sql`
    SELECT id, email, first_name, sequence_name, sequence_day, last_email_sent, created_at
    FROM email_subscribers
    WHERE unsubscribed = FALSE
    ORDER BY id ASC
    LIMIT ${limit}
  `) as SubscriberRow[];
}

export async function bumpSubscriberSequence(id: number, nextDay: number) {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  await sql`
    UPDATE email_subscribers
    SET sequence_day = ${nextDay},
        last_email_sent = NOW()
    WHERE id = ${id}
  `;
}

export async function insertSubscriber(input: {
  email: string;
  first_name?: string;
  phone?: string;
  state?: string;
  source?: string;
  sequence_name?: string;
}) {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  await sql`
    INSERT INTO email_subscribers (email, first_name, phone, state, source, sequence_name)
    VALUES (
      ${input.email},
      ${input.first_name ?? null},
      ${input.phone ?? null},
      ${input.state ?? null},
      ${input.source ?? null},
      ${input.sequence_name ?? "main"}
    )
    ON CONFLICT (email) DO UPDATE SET
      first_name = COALESCE(EXCLUDED.first_name, email_subscribers.first_name),
      phone = COALESCE(EXCLUDED.phone, email_subscribers.phone),
      state = COALESCE(EXCLUDED.state, email_subscribers.state),
      source = COALESCE(EXCLUDED.source, email_subscribers.source)
  `;
}

export async function incrementEmailEngagement(email: string, field: "open" | "click") {
  const sql = getSql();
  if (!sql) return;
  if (field === "open") {
    await sql`
      UPDATE email_subscribers SET open_count = open_count + 1 WHERE email = ${email}
    `;
  } else {
    await sql`
      UPDATE email_subscribers SET click_count = click_count + 1 WHERE email = ${email}
    `;
  }
}

export type OutreachProspectRow = {
  id: number;
  site_name: string | null;
  site_url: string | null;
  contact_email: string | null;
  status: string | null;
  emails_sent: number | null;
  last_contact: string | null;
};

export async function listOutreachProspects(limit = 50): Promise<OutreachProspectRow[]> {
  const sql = getSql();
  if (!sql) return [];
  return (await sql`
    SELECT id, site_name, site_url, contact_email, status, emails_sent, last_contact
    FROM outreach_prospects
    ORDER BY id ASC
    LIMIT ${limit}
  `) as OutreachProspectRow[];
}

export async function updateOutreachProspect(
  id: number,
  patch: { status?: string; emails_sent?: number; last_contact?: string | null },
) {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  const status = patch.status;
  const emailsSent = patch.emails_sent;
  const lastContact = patch.last_contact;
  await sql`
    UPDATE outreach_prospects
    SET status = COALESCE(${status ?? null}, status),
        emails_sent = COALESCE(${emailsSent ?? null}, emails_sent),
        last_contact = COALESCE(${lastContact ?? null}::timestamp, last_contact)
    WHERE id = ${id}
  `;
}

export async function insertWebinarRegistration(input: {
  webinar_slug: string;
  first_name: string;
  email: string;
  phone: string;
  state: string;
}) {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  await sql`
    INSERT INTO webinar_registrations (webinar_slug, first_name, email, phone, state)
    VALUES (
      ${input.webinar_slug},
      ${input.first_name},
      ${input.email},
      ${input.phone},
      ${input.state}
    )
  `;
}
