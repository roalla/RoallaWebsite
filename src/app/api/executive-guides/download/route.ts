import { readFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { executiveGuideDownloadName, executiveGuidePath, verifyExecutiveGuideDownload } from "@/lib/executive-guide-files.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("guide") || "";
  const expires = Number(request.nextUrl.searchParams.get("expires"));
  const token = request.nextUrl.searchParams.get("token") || "";
  if (!verifyExecutiveGuideDownload(slug, expires, token)) {
    return NextResponse.json({ error: "This download link is invalid or has expired." }, { status: 403 });
  }
  try {
    const file = await readFile(executiveGuidePath(slug));
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${executiveGuideDownloadName(slug)}"`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  } catch (error) {
    console.error("Executive guide download failed", error);
    return NextResponse.json({ error: "The guide could not be downloaded." }, { status: 500 });
  }
}

