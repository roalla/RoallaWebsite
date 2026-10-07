import { NextRequest, NextResponse } from "next/server";
import { createExecutiveGuideDownload } from "@/lib/executive-guide-files.server";
import { findExecutiveGuide } from "@/lib/executive-guides";
import { inquiryEmailButton, inquiryEmailParagraph, inquiryEmailPlainFooter, renderInquiryEmail, INQUIRY_EMAIL_CUSTOMER_NOTE, INQUIRY_EMAIL_INTERNAL_NOTE } from "@/lib/inquiry-email";
import { hubMailConfigured, sendHubMail } from "@/lib/roalla-auth/hub-mail";
import { CONTACT } from "@/lib/site";

export const runtime = "nodejs";

type RequestBody = {
  guide?: string; firstName?: string; lastName?: string; email?: string; company?: string;
  role?: string; priority?: string; updates?: boolean; locale?: string; sourcePage?: string; website?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max = 240) => typeof value === "string" ? value.trim().slice(0, max) : "";
const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestBody;
    if (clean(body.website)) return NextResponse.json({ success: true });

    const guide = findExecutiveGuide(clean(body.guide, 100));
    const firstName = clean(body.firstName, 80);
    const lastName = clean(body.lastName, 80);
    const email = clean(body.email, 180).toLowerCase();
    const company = clean(body.company, 160);
    const role = clean(body.role, 160);
    const priority = clean(body.priority, 1000);
    const locale = body.locale === "fr" ? "fr" : "en";
    const sourcePage = clean(body.sourcePage, 500);
    const updates = body.updates === true;

    if (!guide || !firstName || !lastName || !emailPattern.test(email) || !company || !role) {
      return NextResponse.json({ error: locale === "fr" ? "Veuillez remplir tous les champs obligatoires." : "Please complete all required fields." }, { status: 400 });
    }

    const origin = request.nextUrl.origin;
    const downloadUrl = createExecutiveGuideDownload(guide.slug, origin);
    const title = guide[locale].title;
    const fullName = `${firstName} ${lastName}`;
    const reference = `EG-${Date.now()}`;
    const submittedAt = new Date().toLocaleString("en-CA", { timeZone: "America/Toronto", dateStyle: "medium", timeStyle: "short" });

    if (hubMailConfigured()) {
      const internalText = [
        "New ROALLA Executive Guide request", "", `Guide: ${guide.en.title}`, `Name: ${fullName}`, `Email: ${email}`,
        `Company: ${company}`, `Role: ${role}`, `Priority: ${priority || "Not provided"}`,
        `Ongoing insights consent: ${updates ? "Yes" : "No"}`, `Source page: ${sourcePage || "Not provided"}`,
        `Submitted: ${submittedAt}`, `Reference: ${reference}`,
        inquiryEmailPlainFooter(INQUIRY_EMAIL_INTERNAL_NOTE),
      ].join("\n");
      const internalHtml = renderInquiryEmail({
        title: `Executive guide request — ${guide.en.title}`,
        preheader: `${fullName} requested a ROALLA executive guide.`,
        eyebrow: "Executive Insights lead",
        headline: `New guide request: ${guide.en.title}`,
        bodyHtml: `${inquiryEmailParagraph(`<strong>${escape(fullName)}</strong> from <strong>${escape(company)}</strong> requested the guide.`)}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-collapse:collapse;">
            ${[["Email", email], ["Role", role], ["Priority", priority || "Not provided"], ["Ongoing insights consent", updates ? "Yes" : "No"], ["Source page", sourcePage || "Not provided"], ["Reference", reference]].map(([label, value]) => `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:bold;">${escape(label)}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${escape(value)}</td></tr>`).join("")}
          </table>`,
        footerNote: INQUIRY_EMAIL_INTERNAL_NOTE,
      });
      const internalResult = await sendHubMail({ to: CONTACT.email, replyTo: email, subject: `Executive guide request — ${guide.en.title}`, text: internalText, html: internalHtml });
      if (!internalResult.ok) throw new Error(internalResult.error);

      const french = locale === "fr";
      const userBody = french
        ? `${inquiryEmailParagraph(`Bonjour ${escape(firstName)},`)}${inquiryEmailParagraph(`Merci de votre intérêt pour <strong>${escape(title)}</strong>. Le guide PDF complet est actuellement offert en anglais.`)}${inquiryEmailButton(downloadUrl, "Télécharger le guide")}${inquiryEmailParagraph("Ce lien sécurisé expire dans 48 heures. Répondez à ce courriel si vous souhaitez discuter de votre contexte avec ROALLA.")}`
        : `${inquiryEmailParagraph(`Dear ${escape(firstName)},`)}${inquiryEmailParagraph(`Thank you for your interest in <strong>${escape(title)}</strong>.`)}${inquiryEmailButton(downloadUrl, "Download the executive guide")}${inquiryEmailParagraph("This secure link expires in 48 hours. Reply to this email if you would like to discuss your organization’s context with ROALLA.")}`;
      const userResult = await sendHubMail({
        to: email, replyTo: CONTACT.email,
        subject: french ? `Votre guide ROALLA : ${title}` : `Your ROALLA executive guide: ${title}`,
        text: french ? `Bonjour ${firstName},\n\nTéléchargez votre guide : ${downloadUrl}\n\nCe lien expire dans 48 heures.${inquiryEmailPlainFooter(INQUIRY_EMAIL_CUSTOMER_NOTE)}` : `Dear ${firstName},\n\nDownload your guide: ${downloadUrl}\n\nThis link expires in 48 hours.${inquiryEmailPlainFooter(INQUIRY_EMAIL_CUSTOMER_NOTE)}`,
        html: renderInquiryEmail({ title, preheader: french ? "Votre guide ROALLA est prêt." : "Your ROALLA executive guide is ready.", eyebrow: "ROALLA Executive Insights", headline: french ? "Votre guide est prêt" : "Your guide is ready", bodyHtml: userBody, footerNote: INQUIRY_EMAIL_CUSTOMER_NOTE }),
      });
      if (!userResult.ok) throw new Error(userResult.error);
    } else {
      console.info("Executive guide request received with mail disabled", { guide: guide.slug, company, role, updates, reference });
    }

    return NextResponse.json({ success: true, downloadUrl, reference });
  } catch (error) {
    console.error("Executive guide request failed", error);
    return NextResponse.json({ error: "Unable to prepare the guide right now. Please email sales@roalla.com." }, { status: 503 });
  }
}

