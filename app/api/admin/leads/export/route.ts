import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCookie } from "@/lib/admin-api-auth";
import { listLeads } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminCookie(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const leads = await listLeads(2000);
  const header = ["id", "first_name", "last_name", "phone", "state", "timing", "injuries", "source", "ghl_synced", "created_at"];
  const lines = leads.map((l) =>
    [
      l.id,
      csv(l.first_name),
      csv(l.last_name ?? ""),
      csv(l.phone),
      csv(l.state),
      csv(l.timing ?? ""),
      csv(l.injuries ?? ""),
      csv(l.source ?? ""),
      l.ghl_synced ? "true" : "false",
      csv(l.created_at),
    ].join(","),
  );
  const csvBody = [header.join(","), ...lines].join("\n");
  return new NextResponse(csvBody, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="wreckmatch-leads.csv"`,
    },
  });
}

function csv(v: string) {
  if (v.includes(",") || v.includes("\"") || v.includes("\n")) {
    return `"${v.replaceAll("\"", "\"\"")}"`;
  }
  return v;
}
