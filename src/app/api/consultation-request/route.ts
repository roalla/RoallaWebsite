import { NextRequest, NextResponse } from "next/server";
import { hubMailConfigured, sendHubMail } from "@/lib/roalla-auth/hub-mail";
import {
  buildConsultationEmailSubject,
  buildConsultationSalesEmailHtml,
  buildConsultationSalesEmailText,
  parseConsultationIntent,
  validateConsultationRequest,
  type ConsultationRequestPayload,
} from "@/lib/consultation-request";

const EMAIL_LABELS: Record<string, string> = {
  emailHeading: "New Service Inquiry",
  emailIntro:
    "A prospective client submitted a service inquiry through the ROALLA website.",
  intent: "Request type",
  intent_consulting: "Programs / advisory",
  intent_website: "Website project",
  intent_platform: "Custom platform",
  intent_automation: "Integrations & automation",
  "intent_ai-support": "AI support",
  "intent_digital-events": "Digital events",
  intent_visibility: "Digital visibility optimization",
  intent_workshop: "Workshops & skill building",
  intent_unsure: "Not sure yet",
  goal: "Goal / challenge",
  timeline: "Timeline",
  timeline_asap: "As soon as possible",
  timeline_1to3: "1–3 months",
  timeline_3to6: "3–6 months",
  timeline_exploring: "Just exploring",
  consultingFocus: "Consulting focus",
  focus_strategy: "Strategic planning",
  focus_operations: "Process optimization",
  focus_team: "Team development",
  focus_data: "Data & analytics",
  focus_innovation: "Innovation consulting",
  focus_other: "Other / multiple areas",
  websiteGoal: "Website need",
  websiteGoal_new: "New website",
  websiteGoal_redesign: "Redesign existing site",
  websiteGoal_conversion: "Improve conversion & performance",
  "websiteGoal_landing-booking": "Landing page or booking flow",
  websiteGoal_maintain: "Ongoing support & updates",
  websiteGoal_bilingual: "Bilingual EN/FR site",
  websiteGoal_ecommerce: "Online store / e-commerce",
  hasExistingSite: "Existing website",
  currentSiteUrl: "Current site URL",
  yesNo_yes: "Yes",
  yesNo_no: "No",
  platformType: "Platform type",
  platform_internal: "Internal tool / workflow",
  platform_customer: "Customer-facing application",
  "platform_client-portal": "Client / partner portal",
  platform_marketplace: "Marketplace / multi-sided platform",
  "platform_iot-dashboard": "Data / IoT dashboard",
  platform_ecommerce: "E-commerce platform",
  platform_other: "Other / not sure",
  automationGoal: "Automation focus",
  automationGoal_workflow: "Workflow automation",
  automationGoal_integration: "System integration",
  automationGoal_both: "Both workflow and integration",
  aiGoal: "AI focus",
  aiGoal_scoring: "Lead scoring / routing",
  "aiGoal_content-workflow": "Content or workflow assist",
  "aiGoal_custom-model": "Custom model integration",
  aiGoal_exploring: "Exploring options",
  eventGoal: "Event deliverable",
  eventGoal_booth: "Booth kit / QR experience",
  eventGoal_microsite: "Event microsite",
  "eventGoal_event-app": "Event app",
  eventGoal_activation: "On-site activation",
  workshopTopic: "Workshop topic",
  workshopTopic_branding: "Branding & positioning",
  workshopTopic_sales: "Sales & growth",
  workshopTopic_productivity: "Productivity & systems",
  workshopTopic_ideation: "Ideation & innovation",
  workshopTopic_other: "Other / custom topic",
  industry: "Industry",
  "industry_fleet-logistics": "Fleet & logistics",
  "industry_sports-recreation": "Sports & recreation",
  "industry_events-trade-shows": "Events & trade shows",
  "industry_education-training": "Education & training",
  "industry_professional-services": "Professional services",
  "industry_business-platforms": "Business platforms",
  industry_other: "Other",
  primaryOutcome: "Primary outcome",
  outcome_leads: "More leads",
  outcome_bookings: "More bookings",
  "outcome_self-serve": "Self-serve for customers",
  outcome_operations: "Operations efficiency",
  outcome_other: "Other",
  systemsToConnect: "Systems to connect",
  userScale: "Expected users",
  "userScale_under-50": "Under 50",
  "userScale_50-500": "50–500",
  "userScale_500-plus": "500+",
  "userScale_not-sure": "Not sure",
  budgetBand: "Budget range",
  "budgetBand_under-15k": "Under $15k CAD",
  "budgetBand_15-50k": "$15k–$50k CAD",
  "budgetBand_50k-plus": "$50k+ CAD",
  "budgetBand_not-sure": "Not sure yet",
  portfolioReference: "Portfolio inspiration",
  sourcePage: "Referrer page",
  name: "Name",
  email: "Email",
  company: "Company",
  phone: "Phone",
  notProvided: "Not provided",
  submittedAt: "Submitted",
  source: "Website",
  locale: "Language",
  userSubject: "We received your service inquiry",
  userGreeting: "Thank you for reaching out to ROALLA.",
  userBody:
    "Our team has received your request and will review the details. You can expect a response within one business day.",
  userSignoff: "Best regards,\nThe ROALLA Team",
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ConsultationRequestPayload>;
    const validationError = validateConsultationRequest(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const intent = parseConsultationIntent(body.intent)!;
    const payload: ConsultationRequestPayload = {
      intent,
      goal: body.goal!.trim(),
      timeline: body.timeline!.trim(),
      consultingFocus: body.consultingFocus?.trim(),
      websiteGoal: body.websiteGoal?.trim(),
      hasExistingSite: body.hasExistingSite?.trim(),
      platformType: body.platformType?.trim(),
      automationGoal: body.automationGoal?.trim(),
      aiGoal: body.aiGoal?.trim(),
      eventGoal: body.eventGoal?.trim(),
      workshopTopic: body.workshopTopic?.trim(),
      currentSiteUrl: body.currentSiteUrl?.trim(),
      industry: body.industry?.trim(),
      primaryOutcome: body.primaryOutcome?.trim(),
      systemsToConnect: body.systemsToConnect?.trim(),
      userScale: body.userScale?.trim(),
      budgetBand: body.budgetBand?.trim(),
      portfolioReference: body.portfolioReference?.trim(),
      sourcePage: body.sourcePage?.trim(),
      name: body.name!.trim(),
      email: body.email!.trim(),
      company: body.company?.trim(),
      phone: body.phone?.trim(),
      locale: body.locale?.trim(),
    };

    const submittedAt = new Date().toLocaleString("en-CA", {
      timeZone: "America/Toronto",
      dateStyle: "medium",
      timeStyle: "short",
    });
    const origin = request.headers.get("origin") || "Unknown";
    const subject = buildConsultationEmailSubject(payload.name, payload.intent);
    const text = buildConsultationSalesEmailText(
      payload,
      EMAIL_LABELS,
      submittedAt,
      origin,
    );
    const html = buildConsultationSalesEmailHtml(
      payload,
      EMAIL_LABELS,
      submittedAt,
      origin,
    );

    if (hubMailConfigured()) {
      try {
        const salesResult = await sendHubMail({
          to: "sales@roalla.com",
          replyTo: payload.email,
          subject,
          text,
          html,
        });
        if (!salesResult.ok) throw new Error(salesResult.error);

        const userResult = await sendHubMail({
          to: payload.email,
          subject: EMAIL_LABELS.userSubject,
          text: `${EMAIL_LABELS.userGreeting}\n\n${EMAIL_LABELS.userBody}\n\n${EMAIL_LABELS.userSignoff}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
              <div style="background:linear-gradient(135deg,#00b4c5,#0099a8);padding:28px 24px;border-radius:12px 12px 0 0;color:#fff;text-align:center;">
                <h1 style="margin:0;font-size:24px;">Request Received</h1>
              </div>
              <div style="padding:28px 24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
                <p style="color:#0f172a;">Dear ${payload.name},</p>
                <p style="color:#475569;line-height:1.6;">${EMAIL_LABELS.userGreeting} ${EMAIL_LABELS.userBody}</p>
                <p style="color:#475569;line-height:1.6;">If your matter is urgent, call us at <strong>(289) 838-5868</strong> or reply to this email.</p>
                <p style="color:#0f172a;margin-top:24px;">Best regards,<br><strong>The ROALLA Team</strong></p>
                <hr style="margin:28px 0;border:none;border-top:1px solid #e2e8f0;">
                <p style="color:#64748b;font-size:13px;margin:0;">ROALLA Business Enablement Group · sales@roalla.com · (289) 838-5868</p>
              </div>
            </div>
          `,
        });
        if (!userResult.ok) throw new Error(userResult.error);
      } catch (emailError) {
        console.error("Consultation request email failed:", emailError);
        return NextResponse.json(
          {
            error:
              "Unable to send your request right now. Please email sales@roalla.com directly.",
          },
          { status: 502 },
        );
      }
    } else {
      console.log(
        "AUTH_MAIL_SECRET not configured. Consultation request:",
        payload,
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you. Our team will respond within one business day.",
      submissionId: `CR-${Date.now()}`,
    });
  } catch (error) {
    console.error("Consultation request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
