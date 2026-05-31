/** Trigger GitHub Actions blog autopilot (failsafe when scheduled workflows stall). */

export type DispatchBlogAutopilotInput = {
  batch?: string;
  catchup?: string;
  site?: string;
};

export async function dispatchBlogAutopilotWorkflow(
  input: DispatchBlogAutopilotInput = {},
): Promise<{ ok: boolean; status: number; detail: string }> {
  const token = process.env.GITHUB_AUTOPILOT_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim();
  const owner = process.env.GITHUB_AUTOPILOT_OWNER?.trim() || "scotttischler-byte";
  const repo = process.env.GITHUB_AUTOPILOT_REPO?.trim() || "injuredhelp-ai";
  const workflow =
    process.env.GITHUB_AUTOPILOT_WORKFLOW?.trim() || "daily-blog-mandatory.yml";
  const ref = process.env.GITHUB_AUTOPILOT_REF?.trim() || "main";

  if (!token) {
    return {
      ok: false,
      status: 0,
      detail:
        "GITHUB_AUTOPILOT_TOKEN not set on Vercel — add a fine-grained PAT with actions:write to dispatch workflows",
    };
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref,
      inputs: {
        batch: input.batch ?? "6",
        catchup: input.catchup ?? "0",
        site: input.site ?? "wreckmatch",
        skip_remote_cron: "false",
      },
    }),
  });

  if (res.status === 204) {
    return { ok: true, status: 204, detail: `dispatched ${workflow} on ${owner}/${repo}@${ref}` };
  }
  const text = await res.text();
  return { ok: false, status: res.status, detail: text.slice(0, 500) };
}
