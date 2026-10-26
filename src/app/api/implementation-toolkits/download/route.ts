import { readFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import {
  implementationToolkitDownloadName,
  implementationToolkitPath,
  verifyImplementationToolkitDownload,
} from "@/lib/implementation-toolkit-files.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const item = request.nextUrl.searchParams.get("item") || "";
  const expires = Number(request.nextUrl.searchParams.get("expires"));
  const token = request.nextUrl.searchParams.get("token") || "";

  if (!verifyImplementationToolkitDownload(item, expires, token)) {
    return NextResponse.json({ error: "This toolkit link is invalid or has expired." }, { status: 403 });
  }

  try {
    const file = await readFile(implementationToolkitPath(item));
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${implementationToolkitDownloadName(item)}"`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  } catch (error) {
    console.error("Implementation toolkit download failed", error);
    return NextResponse.json({ error: "The toolkit file could not be downloaded." }, { status: 500 });
  }
}
