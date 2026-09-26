import { NextRequest, NextResponse } from "next/server";
import { hubMailConfigured, sendHubMail } from "@/lib/roalla-auth/hub-mail";
import {
  buildConsultationEmailSubject,
  buildConsultationSalesEmailHtml,
  buildConsultationSalesEmailText,
  buildConsultationUserConfirmationHtml,
  buildConsultationUserConfirmationText,
  LIGHT_MODE_DEFAULT_GOAL,
  parseConsultationIntent,
  validateConsultationRequest,
  type ConsultationRequestPayload,
} from "@/lib/consultation-request";
import { resolveDiscoveryUrl } from "@/lib/discovery-funnel";
import { enqueueConsultationReminder } from "@/lib/consultation-reminders";
import { CONTACT } from "@/lib/site";

const EMAIL_LABELS: Record<string, string> = {
  emailHeading: "New Service Inquiry",
  emailEyebrow: "Sales desk",
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
  formPath: "Form path",
  formPathLight: "Slim digital request (marketing)",
  consultingFocus: "Consulting focus",
  focus_strategy: "Strategic planning",
  focus_operations: "Process optimization",
  focus_team: "Team development",
  focus_data: "Data & analytics",
  focus_innovation: "Innovation consulting",
  focus_technology: "Technology advisory & solution sourcing",
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
  "workshopTopic_focus-circle": "Focus Circle",
  "workshopTopic_workload-conversation": "The Workload Conversation",
  "workshopTopic_digital-calm": "Digital Calm",
  "workshopTopic_decision-hour": "The Decision Hour",
  "workshopTopic_offer-page": "The Offer on One Page",
  workshopTopic_branding: "Branding & positioning",
  workshopTopic_sales: "Sales & growth",
  workshopTopic_productivity: "Productivity & systems",
  workshopTopic_ideation: "The Shortlist",
  "workshopTopic_first-offer": "The First Offer",
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
  submissionId: "Reference",
  discoveryUrl: "Suggested discovery URL",
  discoveryCta: "Open the brief",
  discoveryHeading: "Suggested discovery link",
  discoverySalesHint:
    "Share this Digital Enablement brief with the prospect (not Digital Discovery — that is a technical access questionnaire for engaged website work).",
  reminderSalesHint:
    "Soft reminder: if they have not started the brief in ~2 days, nudge them with this same link. Automated T+2 reminders run when DATABASE_URL + CRON_SECRET (or AUTH_MAIL_SECRET) are configured via POST /api/cron/consultation-reminders.",
  userSubject: "We received your service inquiry",
  userPreheader:
    "Your inquiry is with the Roalla team. We reply within one business day.",
  userEyebrow: "Service inquiry",
  userHtmlHeading: "We received your inquiry",
  userGreeting: "Thank you for contacting Roalla Business Enablement Group.",
  userBody:
    "A member of our team will review your request and reply within one business day with a recommended next step.",
  userSummaryHeading: "Your inquiry",
  userNextHeading: "What happens next",
  userNext1: "A personal review by the Roalla team.",
  userNext2: "A recommended entry point and clear next steps.",
  userNext3: "A reply within one business day.",
  userUrgent:
    "If you would like to speak with us sooner, call (289) 838-5868 or reply to this email.",
  userSignoff: "Best regards,\nThe ROALLA Team",
  userDiscoveryEyebrow: "Optional next step",
  userDiscoveryBody:
    "When you're ready, you can start a short digital brief so we can prepare clearer recommendations. Completely optional — we'll still follow up either way.",
  userDiscoveryCta: "Start your digital brief",
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ConsultationRequestPayload>;
    const validationError = validateConsultationRequest(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const intent = parseConsultationIntent(body.intent)!;
    const lightMode = Boolean(body.lightMode);
    const goal =
      body.goal?.trim() ||
      (lightMode ? LIGHT_MODE_DEFAULT_GOAL : body.goal!.trim());
    const timeline =
      body.timeline?.trim() || (lightMode ? "exploring" : body.timeline!.trim());

    const payload: ConsultationRequestPayload = {
      intent,
      goal,
      timeline,
      lightMode: lightMode || undefined,
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

    const submissionId = `CR-${Date.now()}`;
    const discoveryUrl = resolveDiscoveryUrl(payload.intent, {
      name: payload.name,
      email: payload.email,
      company: payload.company,
      sourceRef: submissionId,
      locale: payload.locale,
    });

    const submittedAt = new Date().toLocaleString("en-CA", {
      timeZone: "America/Toronto",
      dateStyle: "medium",
      timeStyle: "short",
    });
    const origin = request.headers.get("origin") || "Unknown";
    const subject = buildConsultationEmailSubject(payload.name, payload.intent);
    const emailOptions = { discoveryUrl, submissionId };
    const text = buildConsultationSalesEmailText(
      payload,
      EMAIL_LABELS,
      submittedAt,
      origin,
      emailOptions,
    );
    const html = buildConsultationSalesEmailHtml(
      payload,
      EMAIL_LABELS,
      submittedAt,
      origin,
      emailOptions,
    );

    if (hubMailConfigured()) {
      try {
        const salesResult = await sendHubMail({
          to: CONTACT.email,
          replyTo: payload.email,
          subject,
          text,
          html,
        });
        if (!salesResult.ok) throw new Error(salesResult.error);

        const userResult = await sendHubMail({
          to: payload.email,
          replyTo: CONTACT.email,
          subject: EMAIL_LABELS.userSubject,
          text: buildConsultationUserConfirmationText(payload, EMAIL_LABELS, {
            discoveryUrl,
            submissionId,
          }),
          html: buildConsultationUserConfirmationHtml(payload, EMAIL_LABELS, {
            discoveryUrl,
            submissionId,
          }),
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

    if (discoveryUrl) {
      const enqueue = await enqueueConsultationReminder({
        submissionId,
        intent: payload.intent,
        name: payload.name,
        email: payload.email,
        company: payload.company,
        locale: payload.locale,
        discoveryUrl,
      });
      if (!enqueue.queued && enqueue.reason !== "database_not_configured") {
        console.warn("Consultation reminder not queued:", enqueue.reason);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you. Our team will respond within one business day.",
      submissionId,
      discoveryUrl: discoveryUrl ?? undefined,
    });
  } catch (error) {
    console.error("Consultation request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
