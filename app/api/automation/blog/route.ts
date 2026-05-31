import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/automation-auth";
import { dispatchBlogAutopilotWorkflow } from "@/lib/github-autopilot";
import { getAllPosts } from "@/lib/posts";
import fs from "fs";
import path from "path";

/** Vercel cron failsafe: dispatch GitHub blog autopilot + record intent (does not run Python on Vercel). */
export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const batch = url.searchParams.get("batch") ?? "10";
  const catchup = url.searchParams.get("catchup") ?? "0";
  const site = url.searchParams.get("site") ?? "wreckmatch";

  const posts = await getAllPosts();
  const heartbeatPath = path.join(process.cwd(), "content/autopilot/heartbeat.json");
  let heartbeat: Record<string, unknown> = {};
  if (fs.existsSync(heartbeatPath)) {
    try {
      heartbeat = JSON.parse(fs.readFileSync(heartbeatPath, "utf8"));
    } catch {
      heartbeat = {};
    }
  }

  const dispatch = await dispatchBlogAutopilotWorkflow({ batch, catchup, site });

  let dailySla: Record<string, unknown> = { note: "Run daily-blog-mandatory.yml on GitHub for SLA" };
  try {
    const { spawnSync } = await import("node:child_process");
    const r = spawnSync(
      "python3",
      ["scripts/autopilot_daily_guard.py", "--record-only", "--site", site],
      { cwd: process.cwd(), encoding: "utf-8", timeout: 120_000 },
    );
    if (r.stdout) dailySla = JSON.parse(r.stdout.trim() || "{}");
  } catch {
    /* python guard optional on Vercel */
  }

  return NextResponse.json({
    ok: dispatch.ok,
    at: new Date().toISOString(),
    blogPostCount: posts.length,
    latestPostDate: posts[0]?.date ?? null,
    dispatch,
    heartbeat,
    dailySla,
    note: "Publishing runs on GitHub Actions. Permanent: fifty-states-daily.yml — top city in 50 states every UTC day.",
  });
}
