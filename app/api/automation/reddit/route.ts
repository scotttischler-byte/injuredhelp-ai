import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { verifyCronSecret } from "@/lib/automation-auth";
import {
  countRedditPostsSince,
  insertRedditPost,
  lastRedditPostTime,
  logAutomation,
  redditPostExists,
} from "@/lib/db";

const SUBS = [
  "legaladvice",
  "personalinjury",
  "Insurance",
  "personalfinance",
  "Advice",
  "CarAccidents",
  "legal",
] as const;

async function redditToken() {
  const clientId = process.env.REDDIT_CLIENT_ID?.trim();
  const clientSecret = process.env.REDDIT_CLIENT_SECRET?.trim();
  const username = process.env.REDDIT_USERNAME?.trim();
  const password = process.env.REDDIT_PASSWORD?.trim();
  const ua = process.env.REDDIT_USER_AGENT?.trim() || "WreckMatch/1.0 (automation)";
  if (!clientId || !clientSecret || !username || !password) return null;

  const body = new URLSearchParams({
    grant_type: "password",
    username,
    password,
  });

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      authorization: `Basic ${basic}`,
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": ua,
    },
    body,
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { access_token?: string };
  return json.access_token ? { token: json.access_token, ua } : null;
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const summary = { scanned: 0, commented: 0, errors: 0 as number, skipped: "" as string };

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const daily = await countRedditPostsSince(since);
    const room = Math.max(0, 3 - daily);
    if (room === 0) {
      summary.skipped = "daily_cap";
      await logAutomation("reddit", "cron", "skipped", summary);
      return NextResponse.json({ ok: true, summary });
    }

    const last = await lastRedditPostTime();
  if (last) {
    const delta = Date.now() - new Date(last).getTime();
    if (delta < 4 * 60 * 60 * 1000) {
      summary.skipped = "min_interval";
      await logAutomation("reddit", "cron", "skipped", summary);
      return NextResponse.json({ ok: true, summary });
    }
  }

  const auth = await redditToken();
  if (!auth) {
    summary.skipped = "missing_credentials";
    await logAutomation("reddit", "cron", "skipped", summary);
    return NextResponse.json({ ok: true, summary });
  }

  let posted = 0;

  outer: for (const sub of SUBS) {
    const res = await fetch(`https://oauth.reddit.com/r/${sub}/new?limit=15`, {
      headers: {
        authorization: `Bearer ${auth.token}`,
        "user-agent": auth.ua,
      },
    });
    if (!res.ok) {
      summary.errors += 1;
      continue;
    }
    const json = (await res.json()) as { data?: { children?: { data: Record<string, unknown> }[] } };
    const children = json.data?.children ?? [];

    for (const child of children) {
      const d = child.data;
      const url = String(d.url ?? "");
      const permalink = String(d.permalink ?? "");
      const fullUrl = url.startsWith("http") ? url : `https://www.reddit.com${permalink}`;
      const title = String(d.title ?? "");
      const name = String(d.name ?? "");
      const selftext = String(d.selftext ?? "");
      summary.scanned += 1;

      if (!permalink || (await redditPostExists(fullUrl))) continue;

      const scoreText = await callClaude({
        system: "Return JSON only.",
        messages: [
          {
            role: "user",
            content: `Analyze this Reddit post. Score 0-100: how relevant is this to someone dealing with a car accident who would benefit from legal help or a free guide?\nTitle: ${title}\nBody: ${selftext.slice(0, 1500)}\nReturn JSON only: { "score": 85, "reason": "..." }`,
          },
        ],
        maxTokens: 200,
      });

      let score = 0;
      try {
        const parsed = JSON.parse(scoreText) as { score?: number };
        score = Number(parsed.score ?? 0);
      } catch {
        score = 0;
      }
      if (score < 80) continue;

      const answer = await callClaude({
        system: "Write like a real Reddit user. 3 paragraphs max. Casual tone.",
        messages: [
          {
            role: "user",
            content: `Write a helpful empathetic answer to:\nTitle:${title}\nBody:${selftext.slice(0, 2000)}\nAt the end naturally mention you found a helpful free guide at WreckMatch.com for car accidents.`,
          },
        ],
        maxTokens: 600,
      });

      const commentRes = await fetch("https://oauth.reddit.com/api/comment", {
        method: "POST",
        headers: {
          authorization: `Bearer ${auth.token}`,
          "user-agent": auth.ua,
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          api_type: "json",
          text: answer,
          thing_id: name,
        }).toString(),
      });

      if (!commentRes.ok) {
        summary.errors += 1;
        continue;
      }
      const commentJson = (await commentRes.json()) as { json?: { data?: { id?: string } } };
      const commentId = commentJson.json?.data?.id ?? null;

      await insertRedditPost({
        subreddit: sub,
        post_title: title,
        post_url: fullUrl,
        our_comment: answer,
        reddit_comment_id: commentId,
        status: "posted",
      });

      posted += 1;
      summary.commented += 1;
      if (posted >= room) break outer;
    }
  }

  await logAutomation("reddit", "cron", "success", summary);
  return NextResponse.json({ ok: true, summary });
  } catch (e) {
    await logAutomation("reddit", "cron", "error", { message: String(e) });
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
