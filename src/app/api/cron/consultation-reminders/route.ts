import { NextRequest, NextResponse } from "next/server";
import {
  consultationCronAuthorized,
  processDueConsultationReminders,
} from "@/lib/consultation-reminders";

/**
 * Soft T+2d discovery reminder runner.
 * Call from Railway cron / external scheduler:
 *   Authorization: Bearer $CRON_SECRET  (or AUTH_MAIL_SECRET)
 *   POST /api/cron/consultation-reminders
 *
 * When DATABASE_URL is unset, digital leads are not queued — sales email
 * still includes the discovery URL + T+2 nudge tip for manual follow-up.
 */
export async function POST(request: NextRequest) {
  if (!consultationCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processDueConsultationReminders();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Consultation reminder cron failed:", error);
    return NextResponse.json(
      { error: "Failed to process reminders" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
