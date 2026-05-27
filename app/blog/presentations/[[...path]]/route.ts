import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const PRESENTATIONS_DIR = path.join(process.cwd(), "public/blog/presentations");

type Props = { params: Promise<{ path?: string[] }> };

export async function GET(_req: Request, { params }: Props) {
  const segments = (await params).path ?? [];
  if (!segments.length || segments.some((s) => s.includes(".."))) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = segments.join("/");
  if (!file.endsWith(".pptx")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const diskPath = path.join(PRESENTATIONS_DIR, file);
  if (!fs.existsSync(diskPath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buf = fs.readFileSync(diskPath);
  const filename = segments[segments.length - 1]!;
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
