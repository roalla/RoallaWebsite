import { NextRequest, NextResponse } from "next/server";
import { dbConfigured, dbQuery } from "@/lib/db";
import { requireHubSession } from "@/lib/hub/auth-session";
import { canManageCustomers } from "@/lib/hub/permissions";
import { createImplementationToolkitDownloads } from "@/lib/implementation-toolkit-files.server";
import {
  inquiryEmailButton,
  inquiryEmailParagraph,
  inquiryEmailPlainFooter,
  renderInquiryEmail,
} from "@/lib/inquiry-email";
import { hubMailConfigured, sendHubMail } from "@/lib/roalla-auth/hub-mail";
import { CONTACT } from "@/lib/site";

type RouteContext = { params: Promise<{ id: string }> };
type Customer = { name: string; primary_contact: string; primary_email: string };

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] || character);
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireHubSession();
    if (!canManageCustomers(user.role)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    if (!dbConfigured()) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }
    if (!hubMailConfigured()) {
      return NextResponse.json({ error: "Outbound email is not configured." }, { status: 503 });
    }

    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as { toolkit?: string; locale?: string };
    if (body.toolkit !== "ei48") {
      return NextResponse.json({ error: "Unknown toolkit." }, { status: 400 });
    }

    const customerResult = await dbQuery(
      `SELECT name, primary_contact, primary_email FROM customers WHERE id = $1`,
      [id],
    );
    if (!customerResult.rowCount) {
      return NextResponse.json({ error: "Customer not found." }, { status: 404 });
    }

    const customer = customerResult.rows[0] as Customer;
    const email = customer.primary_email.trim();
    if (!email) {
      return NextResponse.json({ error: "Add a primary client email before releasing the toolkit." }, { status: 400 });
    }

    const french = body.locale === "fr";
    const { downloads, expiresAt } = createImplementationToolkitDownloads(request.nextUrl.origin);
    const greetingName = customer.primary_contact.trim() || customer.name.trim();
    const greetingText = french ? `Bonjour ${greetingName},` : `Hello ${greetingName},`;
    const greeting = french ? `Bonjour ${escapeHtml(greetingName)},` : `Hello ${escapeHtml(greetingName)},`;
    const intro = french
      ? "Merci pour votre conversation avec ROALLA. Votre trousse de mise en œuvre EI—48 est maintenant prête."
      : "Thank you for your conversation with ROALLA. Your EI—48 implementation toolkit is now ready.";
    const expiry = french
      ? "Ces liens sécurisés expirent dans 14 jours. Veuillez télécharger et conserver les documents conformément aux politiques de votre organisation."
      : "These secure links expire in 14 days. Please download and retain the documents in accordance with your organization’s policies.";
    const footerNote = french
      ? "Vous recevez ce courriel parce que ROALLA a remis des ressources de mise en œuvre à la suite d’une consultation client."
      : "You are receiving this email because ROALLA released implementation resources following a client consultation.";

    const htmlButtons = downloads.map((download) => inquiryEmailButton(download.url, download.label)).join("");
    const html = renderInquiryEmail({
      title: french ? "Votre trousse ROALLA EI—48" : "Your ROALLA EI—48 toolkit",
      preheader: french ? "Vos ressources de mise en œuvre sont prêtes." : "Your implementation resources are ready.",
      eyebrow: "ROALLA Executive Insights",
      headline: french ? "Votre trousse est prête" : "Your toolkit is ready",
      bodyHtml: `${inquiryEmailParagraph(greeting)}${inquiryEmailParagraph(intro)}${htmlButtons}${inquiryEmailParagraph(expiry)}${inquiryEmailParagraph(french ? "Répondez à ce courriel si vous souhaitez adapter les ressources à votre organisation." : "Reply to this email if you would like help tailoring the resources to your organization.")}`,
      footerNote,
    });
    const text = [
      greetingText,
      "",
      intro,
      "",
      ...downloads.flatMap((download) => [`${download.label}:`, download.url, ""]),
      expiry,
      "",
      french ? "Répondez à ce courriel si vous souhaitez adapter les ressources à votre organisation." : "Reply to this email if you would like help tailoring the resources to your organization.",
      "",
      inquiryEmailPlainFooter(footerNote),
    ].join("\n");

    const mail = await sendHubMail({
      to: email,
      replyTo: CONTACT.email,
      subject: french ? "Votre trousse ROALLA EI—48 est prête" : "Your ROALLA EI—48 toolkit is ready",
      html,
      text,
    });
    if (!mail.ok) {
      return NextResponse.json({ error: mail.error || "The toolkit email could not be sent." }, { status: 502 });
    }

    const summary = `EI—48 implementation toolkit released to ${email}; secure links expire ${expiresAt.toISOString()}`;
    const activityResult = await dbQuery(
      `INSERT INTO customer_activities (customer_id, user_id, activity_type, summary)
       VALUES ($1, $2, 'delivery', $3) RETURNING *`,
      [id, user.id, summary],
    );
    await dbQuery(`UPDATE customers SET updated_at = NOW() WHERE id = $1`, [id]);

    return NextResponse.json({
      success: true,
      email,
      expiresAt: expiresAt.toISOString(),
      activity: activityResult.rows[0],
    });
  } catch (error) {
    console.error("Toolkit release failed", error);
    return NextResponse.json({ error: "The toolkit could not be released." }, { status: 500 });
  }
}
