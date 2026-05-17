import { NextRequest, NextResponse } from "next/server";
import { verifyContentApiKey } from "@/lib/automation-auth";
import { callClaude } from "@/lib/anthropic";
import { INJUREDHELP_URL, WRECKMATCH_URL } from "@/lib/site";

export async function POST(req: NextRequest) {
  if (!verifyContentApiKey(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | { type?: string; variables?: Record<string, string> }
    | null;

  const type = body?.type ?? "blog";
  const vars = body?.variables ?? {};

  const text = await callClaude({
    system:
      `You are a legal content writer for WreckMatch. Return MDX with YAML frontmatter only. No guarantees. Include phone (978) 515-6063 and CTAs to ${WRECKMATCH_URL} and ${INJUREDHELP_URL}. Disclaimer: WreckMatch connects accident victims with experienced personal injury attorneys in their state at no upfront cost. We are a legal referral service operated by WreckMatch LLC — not a law firm — and we do not provide legal advice.`,
    messages: [
      {
        role: "user",
        content: `Write MDX for type=${type}. Variables: ${JSON.stringify(vars)}`,
      },
    ],
    maxTokens: 2000,
  });

  return NextResponse.json({ ok: true, content: text });
}
