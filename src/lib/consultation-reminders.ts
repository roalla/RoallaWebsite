import { dbConfigured, dbQuery } from "@/lib/db";
import type { ConsultationIntent } from "@/lib/consultation-request";
import { resolveDiscoveryUrl } from "@/lib/discovery-funnel";
import {
  buildConsultationReminderHtml,
  buildConsultationReminderText,
} from "@/lib/consultation-request";
import { hubMailConfigured, sendHubMail } from "@/lib/roalla-auth/hub-mail";

const REMINDER_DELAY_MS = 2 * 24 * 60 * 60 * 1000; // T+2 days

export const CONSULTATION_REMINDER_LABELS: Record<string, string> = {
  reminderSubject: "Optional next step — your digital brief",
  reminderBody:
    "Just a gentle nudge: when you're ready, you can start a short digital brief so we can prepare clearer recommendations for our follow-up. It's optional — we'll still reach out within one business day either way.",
  reminderCta: "Start your digital brief",
  reminderFooter:
    "If you've already started or spoken with us, you can ignore this message.",
  userSignoff: "Best regards,\nThe ROALLA Team",
};

export type EnqueueConsultationReminderInput = {
  submissionId: string;
  intent: ConsultationIntent;
  name: string;
  email: string;
  company?: string;
  locale?: string;
  discoveryUrl: string;
};

/** Schedule a soft T+2d reminder when Postgres is available. No-op otherwise. */
export async function enqueueConsultationReminder(
  input: EnqueueConsultationReminderInput,
): Promise<{ queued: boolean; reason?: string }> {
  if (!dbConfigured()) {
    return { queued: false, reason: "database_not_configured" };
  }

  const remindAt = new Date(Date.now() + REMINDER_DELAY_MS);
  try {
    await dbQuery(
      `INSERT INTO consultation_leads (
         submission_id, intent, name, email, company, locale,
         discovery_url, remind_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (submission_id) DO NOTHING`,
      [
        input.submissionId,
        input.intent,
        input.name,
        input.email,
        input.company ?? "",
        input.locale ?? "",
        input.discoveryUrl,
        remindAt.toISOString(),
      ],
    );
    return { queued: true };
  } catch (err) {
    console.error("Failed to enqueue consultation reminder:", err);
    return { queued: false, reason: "enqueue_failed" };
  }
}

export type DueReminderRow = {
  id: string;
  submission_id: string;
  intent: string;
  name: string;
  email: string;
  company: string;
  locale: string;
  discovery_url: string;
};

export async function listDueConsultationReminders(
  limit = 50,
): Promise<DueReminderRow[]> {
  if (!dbConfigured()) return [];
  const result = await dbQuery(
    `SELECT id, submission_id, intent, name, email, company, locale, discovery_url
     FROM consultation_leads
     WHERE reminder_sent_at IS NULL
       AND cancelled_at IS NULL
       AND remind_at <= NOW()
     ORDER BY remind_at ASC
     LIMIT $1`,
    [limit],
  );
  return (result.rows ?? []) as DueReminderRow[];
}

export async function markConsultationReminderSent(
  id: string,
): Promise<void> {
  await dbQuery(
    `UPDATE consultation_leads
     SET reminder_sent_at = NOW(), updated_at = NOW()
     WHERE id = $1`,
    [id],
  );
}

/**
 * Process due soft reminders via Hub Mail.
 * Returns counts for cron logging / ops.
 */
export async function processDueConsultationReminders(options?: {
  limit?: number;
}): Promise<{
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
  mailConfigured: boolean;
  databaseConfigured: boolean;
}> {
  const databaseConfigured = dbConfigured();
  const mailConfigured = hubMailConfigured();
  if (!databaseConfigured) {
    return {
      processed: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
      mailConfigured,
      databaseConfigured,
    };
  }
  if (!mailConfigured) {
    return {
      processed: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
      mailConfigured,
      databaseConfigured,
    };
  }

  const due = await listDueConsultationReminders(options?.limit ?? 50);
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of due) {
    const discoveryUrl =
      row.discovery_url ||
      resolveDiscoveryUrl(row.intent as ConsultationIntent, {
        name: row.name,
        email: row.email,
        company: row.company,
        sourceRef: row.submission_id,
        locale: row.locale,
      });

    if (!discoveryUrl) {
      skipped += 1;
      await markConsultationReminderSent(row.id);
      continue;
    }

    const result = await sendHubMail({
      to: row.email,
      subject: CONSULTATION_REMINDER_LABELS.reminderSubject,
      text: buildConsultationReminderText(
        row.name,
        discoveryUrl,
        CONSULTATION_REMINDER_LABELS,
      ),
      html: buildConsultationReminderHtml(
        row.name,
        discoveryUrl,
        CONSULTATION_REMINDER_LABELS,
      ),
    });

    if (result.ok) {
      await markConsultationReminderSent(row.id);
      sent += 1;
    } else {
      console.error("Consultation reminder send failed:", result.error);
      failed += 1;
    }
  }

  return {
    processed: due.length,
    sent,
    failed,
    skipped,
    mailConfigured,
    databaseConfigured,
  };
}

/** Authorize cron / ops callers (Railway cron, manual curl). */
export function consultationCronAuthorized(
  request: Request,
): boolean {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const mailSecret = process.env.AUTH_MAIL_SECRET?.trim();
  const header =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ||
    request.headers.get("x-cron-secret")?.trim() ||
    "";

  if (!header) return false;
  if (cronSecret && header === cronSecret) return true;
  if (mailSecret && header === mailSecret) return true;
  return false;
}
