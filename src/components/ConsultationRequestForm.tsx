"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import toast from "react-hot-toast";
import {
  Briefcase,
  Globe,
  Layers,
  Workflow,
  Sparkles,
  CalendarDays,
  SearchCheck,
  HelpCircle,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  automationGoalFromNeedParam,
  hasIntentSubSelection,
  intentFromNeedParam,
  intentFromServiceParam,
  isDigitalIntent,
  parseAiGoal,
  parseAutomationGoal,
  parseConsultationIntent,
  parseConsultingFocus,
  parseEventGoal,
  parsePlatformType,
  parseWebsiteGoal,
  parseWorkshopTopic,
  resolveSkippedStep2Defaults,
  websiteGoalRequiresExistingSite,
  type AiGoal,
  type AutomationGoal,
  type ConsultationIntent,
  type ConsultingFocus,
  type EventGoal,
  type PlatformType,
  type WebsiteGoal,
  type WorkshopTopic,
} from "@/lib/consultation-request";
import { shouldUseDigitalDiscoveryFunnel } from "@/lib/discovery-funnel";
import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  getPortfolioItem,
  isValidPortfolioReference,
  type PortfolioItemId,
} from "@/lib/digitalPortfolio";

type FormState = {
  intent: ConsultationIntent | "";
  goal: string;
  timeline: string;
  consultingFocus: string;
  websiteGoal: string;
  hasExistingSite: string;
  platformType: string;
  automationGoal: string;
  aiGoal: string;
  eventGoal: string;
  workshopTopic: string;
  currentSiteUrl: string;
  industry: string;
  primaryOutcome: string;
  systemsToConnect: string;
  userScale: string;
  budgetBand: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  website: string;
};

const initialState: FormState = {
  intent: "",
  goal: "",
  timeline: "",
  consultingFocus: "",
  websiteGoal: "",
  hasExistingSite: "",
  platformType: "",
  automationGoal: "",
  aiGoal: "",
  eventGoal: "",
  workshopTopic: "",
  currentSiteUrl: "",
  industry: "",
  primaryOutcome: "",
  systemsToConnect: "",
  userScale: "",
  budgetBand: "",
  name: "",
  email: "",
  company: "",
  phone: "",
  website: "",
};

type ConsultationRequestFormProps = {
  initialIntent?: ConsultationIntent | null;
  initialFocus?: ConsultingFocus | null;
  initialGoal?: string | null;
  initialReference?: string | null;
  initialReferenceLabel?: string | null;
  initialReferenceImage?: string | null;
  initialWebsiteGoal?: WebsiteGoal | null;
  initialPlatformType?: PlatformType | null;
  initialAutomationGoal?: AutomationGoal | null;
  initialAiGoal?: AiGoal | null;
  initialEventGoal?: EventGoal | null;
  initialWorkshopTopic?: WorkshopTopic | null;
  initialSourcePage?: string | null;
  fromAssessment?: boolean;
  fromFoundingOffer?: boolean;
};

const intentOptions: {
  value: ConsultationIntent;
  icon: typeof Briefcase;
  titleKey:
    | "intentWebsite"
    | "intentPlatform"
    | "intentAutomation"
    | "intentAiSupport"
    | "intentDigitalEvents"
    | "intentVisibility"
    | "intentWorkshop"
    | "intentConsulting"
    | "intentUnsure";
  descKey:
    | "intentWebsiteDesc"
    | "intentPlatformDesc"
    | "intentAutomationDesc"
    | "intentAiSupportDesc"
    | "intentDigitalEventsDesc"
    | "intentVisibilityDesc"
    | "intentWorkshopDesc"
    | "intentConsultingDesc"
    | "intentUnsureDesc";
}[] = [
  {
    value: "website",
    icon: Globe,
    titleKey: "intentWebsite",
    descKey: "intentWebsiteDesc",
  },
  {
    value: "platform",
    icon: Layers,
    titleKey: "intentPlatform",
    descKey: "intentPlatformDesc",
  },
  {
    value: "automation",
    icon: Workflow,
    titleKey: "intentAutomation",
    descKey: "intentAutomationDesc",
  },
  {
    value: "ai-support",
    icon: Sparkles,
    titleKey: "intentAiSupport",
    descKey: "intentAiSupportDesc",
  },
  {
    value: "digital-events",
    icon: CalendarDays,
    titleKey: "intentDigitalEvents",
    descKey: "intentDigitalEventsDesc",
  },
  {
    value: "visibility",
    icon: SearchCheck,
    titleKey: "intentVisibility",
    descKey: "intentVisibilityDesc",
  },
  {
    value: "consulting",
    icon: Briefcase,
    titleKey: "intentConsulting",
    descKey: "intentConsultingDesc",
  },
  {
    value: "workshop",
    icon: GraduationCap,
    titleKey: "intentWorkshop",
    descKey: "intentWorkshopDesc",
  },
  {
    value: "unsure",
    icon: HelpCircle,
    titleKey: "intentUnsure",
    descKey: "intentUnsureDesc",
  },
];

function goalPlaceholderKey(intent: ConsultationIntent | ""): string {
  switch (intent) {
    case "website":
      return "goalPlaceholderWebsite";
    case "platform":
      return "goalPlaceholderPlatform";
    case "automation":
      return "goalPlaceholderAutomation";
    case "ai-support":
      return "goalPlaceholderAi";
    case "digital-events":
      return "goalPlaceholderEvents";
    case "workshop":
      return "goalPlaceholderWorkshop";
    default:
      return "goalPlaceholder";
  }
}

function goalExampleKey(intent: ConsultationIntent | ""): string {
  switch (intent) {
    case "website":
      return "goalExampleWebsite";
    case "platform":
      return "goalExamplePlatform";
    case "automation":
      return "goalExampleAutomation";
    case "ai-support":
      return "goalExampleAi";
    case "digital-events":
      return "goalExampleEvents";
    case "workshop":
      return "goalExampleWorkshop";
    default:
      return "goalExample";
  }
}

function computeInitialStep(
  initialIntent: ConsultationIntent | null,
  initialFocus: ConsultingFocus | null,
  initialGoal: string | null,
  subFields: {
    websiteGoal: string;
    platformType: string;
    automationGoal: string;
    aiGoal: string;
    eventGoal: string;
    workshopTopic: string;
    consultingFocus: string;
  },
): number {
  if (!initialIntent) return 1;
  if (initialIntent === "consulting" && !initialFocus) return 2;
  const hasSub = hasIntentSubSelection(initialIntent, {
    consultingFocus: subFields.consultingFocus || initialFocus || undefined,
    websiteGoal: subFields.websiteGoal || undefined,
    platformType: subFields.platformType || undefined,
    automationGoal: subFields.automationGoal || undefined,
    aiGoal: subFields.aiGoal || undefined,
    eventGoal: subFields.eventGoal || undefined,
    workshopTopic: subFields.workshopTopic || undefined,
  });
  if (initialGoal && initialGoal.trim().length >= 5 && hasSub) return 3;
  return 2;
}

export default function ConsultationRequestForm({
  initialIntent = null,
  initialFocus = null,
  initialGoal = null,
  initialReference = null,
  initialReferenceLabel = null,
  initialReferenceImage = null,
  initialWebsiteGoal = null,
  initialPlatformType = null,
  initialAutomationGoal = null,
  initialAiGoal = null,
  initialEventGoal = null,
  initialWorkshopTopic = null,
  initialSourcePage = null,
  fromAssessment = false,
  fromFoundingOffer = false,
}: ConsultationRequestFormProps) {
  const t = useTranslations("consultationRequest");
  const locale = useLocale();
  const [submittedIntent, setSubmittedIntent] = useState<
    ConsultationIntent | ""
  >("");
  const [discoveryUrl, setDiscoveryUrl] = useState<string | null>(null);
  const [sourcePage, setSourcePage] = useState(initialSourcePage ?? "");

  const initialSubFields = {
    websiteGoal: initialWebsiteGoal ?? "",
    platformType: initialPlatformType ?? "",
    automationGoal: initialAutomationGoal ?? "",
    aiGoal: initialAiGoal ?? "",
    eventGoal: initialEventGoal ?? "",
    workshopTopic: initialWorkshopTopic ?? "",
    consultingFocus: initialFocus ?? "",
  };

  const startInDigitalLight =
    shouldUseDigitalDiscoveryFunnel(initialIntent) &&
    !fromAssessment &&
    !fromFoundingOffer &&
    !initialReference;

  const initialStep = startInDigitalLight
    ? 1
    : computeInitialStep(
        initialIntent,
        initialFocus,
        initialGoal,
        initialSubFields,
      );
  const skippedStep2Defaults =
    !startInDigitalLight && initialStep === 3
      ? resolveSkippedStep2Defaults(
          initialIntent,
          {
            timeline: "",
            websiteGoal: initialSubFields.websiteGoal,
            hasExistingSite: "",
          },
          { foundingOffer: fromFoundingOffer },
        )
      : {};

  const [step, setStep] = useState(() => initialStep);
  const [quickMode, setQuickMode] = useState(false);
  const [digitalLightMode, setDigitalLightMode] = useState(startInDigitalLight);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    ...initialState,
    intent: initialIntent ?? "",
    consultingFocus: initialFocus ?? "",
    goal: initialGoal ?? "",
    websiteGoal: initialWebsiteGoal ?? "",
    platformType: initialPlatformType ?? "",
    automationGoal: initialAutomationGoal ?? "",
    aiGoal: initialAiGoal ?? "",
    eventGoal: initialEventGoal ?? "",
    workshopTopic: initialWorkshopTopic ?? "",
    ...skippedStep2Defaults,
  });

  useEffect(() => {
    if (initialSourcePage) return;
    if (typeof document !== "undefined" && document.referrer) {
      try {
        const ref = new URL(document.referrer);
        if (ref.origin !== window.location.origin) return;
        setSourcePage(`${ref.pathname}${ref.search}`);
      } catch {
        // ignore invalid referrer
      }
    }
  }, [initialSourcePage]);

  const update = (patch: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const stepTimeHint =
    step === 1
      ? t("stepTimeHint1")
      : step === 2
        ? t("stepTimeHint2")
        : t("stepTimeHint3");

  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setAttempted(false);
  }, [step, quickMode, digitalLightMode]);

  const missingFields = useMemo(() => {
    const email = form.email.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const contactGaps = (): MissingField[] => {
      const gaps: MissingField[] = [];
      if (!form.name.trim()) gaps.push({ id: "field-name", label: t("gapName") });
      if (!email) gaps.push({ id: "field-email", label: t("gapEmail") });
      else if (!emailValid)
        gaps.push({ id: "field-email", label: t("gapEmailInvalid") });
      return gaps;
    };

    if (digitalLightMode) {
      const gaps: MissingField[] = [];
      if (!form.intent)
        gaps.push({ id: "field-intent", label: t("gapServiceType") });
      gaps.push(...contactGaps());
      if (form.goal.trim() && form.goal.trim().length < 3) {
        gaps.push({ id: "field-goal", label: t("gapLightNote") });
      }
      return gaps;
    }

    if (quickMode) {
      const gaps: MissingField[] = [];
      if (form.goal.trim().length < 5) {
        gaps.push({ id: "field-goal", label: t("gapQuickMessage") });
      }
      gaps.push(...contactGaps());
      return gaps;
    }

    if (step === 1) {
      return form.intent
        ? []
        : [{ id: "field-intent", label: t("gapIntent") }];
    }

    if (step === 2) {
      const gaps: MissingField[] = [];
      if (form.intent === "consulting" && !form.consultingFocus) {
        gaps.push({ id: "field-consulting-focus", label: t("gapConsultingFocus") });
      }
      if (form.intent === "website" && !form.websiteGoal) {
        gaps.push({ id: "field-website-goal", label: t("gapWebsiteGoal") });
      }
      if (
        form.intent === "website" &&
        form.websiteGoal &&
        websiteGoalRequiresExistingSite(form.websiteGoal) &&
        !form.hasExistingSite
      ) {
        gaps.push({ id: "field-existing-site", label: t("gapExistingSite") });
      }
      if (form.intent === "platform" && !form.platformType) {
        gaps.push({ id: "field-platform", label: t("gapPlatform") });
      }
      if (form.intent === "automation" && !form.automationGoal) {
        gaps.push({ id: "field-automation", label: t("gapAutomation") });
      }
      if (form.intent === "ai-support" && !form.aiGoal) {
        gaps.push({ id: "field-ai", label: t("gapAi") });
      }
      if (form.intent === "digital-events" && !form.eventGoal) {
        gaps.push({ id: "field-event", label: t("gapEvent") });
      }
      if (form.intent === "workshop" && !form.workshopTopic) {
        gaps.push({ id: "field-workshop", label: t("gapWorkshop") });
      }
      if (form.goal.trim().length < 5) {
        gaps.push({ id: "field-goal", label: t("gapGoal") });
      }
      if (!form.timeline) {
        gaps.push({ id: "field-timeline", label: t("gapTimeline") });
      }
      return gaps;
    }

    return contactGaps();
  }, [digitalLightMode, form, quickMode, step, t]);

  const missingIds = useMemo(
    () => new Set(missingFields.map((field) => field.id)),
    [missingFields],
  );
  const fieldInvalid = (id: string) => attempted && missingIds.has(id);
  const controlClass = (id: string, extra = "") =>
    `${fieldInvalid(id) ? invalidInputClass : inputClass}${extra ? ` ${extra}` : ""}`;

  const canContinueStep1 = step !== 1 || missingFields.length === 0;
  const canContinueStep2 = step !== 2 || missingFields.length === 0;
  const canSubmit = missingFields.length === 0;
  const useLightSubmit = digitalLightMode || quickMode;

  const revealMissing = () => {
    setAttempted(true);
    const first = missingFields[0];
    if (!first) return;
    window.setTimeout(() => focusInquiryField(first.id), 0);
  };

  const showMissingNotice =
    missingFields.length > 0 &&
    (attempted || digitalLightMode || quickMode || step > 1);
  const missingLead =
    digitalLightMode || quickMode || step === 3
      ? t("missingBeforeSendLead")
      : t("missingBeforeContinueLead");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!digitalLightMode && !quickMode && step < 3) {
      const ready = step === 1 ? canContinueStep1 : canContinueStep2;
      if (ready) {
        setAttempted(false);
        setStep((current) => current + 1);
      } else {
        revealMissing();
      }
      return;
    }
    if (!canSubmit) {
      revealMissing();
      return;
    }

    const submitIntent: ConsultationIntent = quickMode
      ? form.intent && shouldUseDigitalDiscoveryFunnel(form.intent)
        ? (form.intent as ConsultationIntent)
        : "unsure"
      : (form.intent as ConsultationIntent);
    if (!quickMode && !form.intent) return;
    if (digitalLightMode && !form.intent) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/consultation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: submitIntent,
          goal: form.goal,
          timeline: useLightSubmit ? "exploring" : form.timeline,
          lightMode: useLightSubmit || undefined,
          consultingFocus: useLightSubmit
            ? undefined
            : form.consultingFocus || undefined,
          websiteGoal: useLightSubmit
            ? undefined
            : form.websiteGoal || undefined,
          hasExistingSite: useLightSubmit
            ? undefined
            : form.hasExistingSite || undefined,
          platformType: useLightSubmit
            ? undefined
            : form.platformType || undefined,
          automationGoal: useLightSubmit
            ? undefined
            : form.automationGoal || undefined,
          aiGoal: useLightSubmit ? undefined : form.aiGoal || undefined,
          eventGoal: useLightSubmit ? undefined : form.eventGoal || undefined,
          workshopTopic: useLightSubmit
            ? undefined
            : form.workshopTopic || undefined,
          currentSiteUrl: useLightSubmit
            ? undefined
            : form.currentSiteUrl || undefined,
          industry: useLightSubmit ? undefined : form.industry || undefined,
          primaryOutcome: useLightSubmit
            ? undefined
            : form.primaryOutcome || undefined,
          systemsToConnect: useLightSubmit
            ? undefined
            : form.systemsToConnect || undefined,
          userScale: useLightSubmit ? undefined : form.userScale || undefined,
          budgetBand: useLightSubmit ? undefined : form.budgetBand || undefined,
          portfolioReference: initialReference || undefined,
          sourcePage: sourcePage || undefined,
          name: form.name,
          email: form.email,
          company: form.company || undefined,
          phone: form.phone || undefined,
          locale,
          website: form.website,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || t("errorMessage"));
        return;
      }

      setSubmittedIntent(submitIntent);
      setDiscoveryUrl(
        typeof data.discoveryUrl === "string" ? data.discoveryUrl : null,
      );
      setSubmitted(true);
      trackAnalyticsEvent("consultation_request_submitted", {
        intent: submitIntent,
      });
      toast.success(t("successMessage"));
    } catch {
      toast.error(t("errorMessage"));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const exploreHref =
      submittedIntent === "workshop"
        ? "/programs/workshops"
        : isDigitalIntent(submittedIntent) || submittedIntent === "unsure"
          ? "/services/digital"
          : "/programs/business-enablement";
    const exploreLabel =
      submittedIntent === "workshop"
        ? t("successExploreWorkshops")
        : isDigitalIntent(submittedIntent) || submittedIntent === "unsure"
          ? t("successExploreDigital")
          : t("successExplore");

    return (
      <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-8 lg:p-12 text-center shadow-card">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-dark/10">
          <CheckCircle className="h-7 w-7 text-primary-dark" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900">
          {t("successTitle")}
        </h2>
        <p className="mt-3 text-slate-600 max-w-md mx-auto">
          {t("successMessage")}
        </p>
        <p className="mt-4 text-sm text-slate-500 max-w-md mx-auto">
          {t("successNextSteps")}
        </p>
        {discoveryUrl && (
          <p className="mt-5 text-sm text-slate-600 max-w-md mx-auto">
            <a
              href={discoveryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              {t("successStartBrief")}
            </a>
            <span className="text-slate-500"> — {t("successStartBriefHint")}</span>
          </p>
        )}
        <p className="mt-4 text-sm text-slate-500 max-w-md mx-auto">
          {t("successPhone")}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="tel:+12898385868"
            className="inline-flex items-center justify-center rounded-lg bg-primary-dark hover:bg-primary-darker text-white font-semibold px-6 py-3 text-sm shadow-md transition-colors"
          >
            {t("successCallCta")}
          </a>
          <Link href={exploreHref} className="link-action font-semibold">
            {exploreLabel}
            <ArrowRight className="ml-2 h-4 w-4 inline" />
          </Link>
          <Link
            href="/"
            className="text-slate-600 font-medium hover:text-primary-dark transition-colors"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        {!quickMode && !digitalLightMode && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-500">
                {t("stepLabel", { current: step, total: 3 })}
              </p>
              <p className="text-xs text-slate-400">{stepTimeHint}</p>
            </div>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${n <= step ? "bg-primary-dark" : "bg-slate-200"}`}
                />
              ))}
            </div>
          </>
        )}
        {digitalLightMode && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-500">
              {t("digitalLightEyebrow")}
            </p>
            <p className="text-xs text-slate-400">{t("digitalLightTimeHint")}</p>
          </div>
        )}
      </div>

      <form noValidate onSubmit={handleSubmit} className="p-6 lg:p-8">
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(e) => update({ website: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        {digitalLightMode ? (
          <div key="digital-light" className="animate-fade-in space-y-5">
            <h2 className="text-xl font-serif font-bold text-slate-900">
              {t("digitalLightTitle")}
            </h2>
            <p className="text-sm text-slate-600">{t("digitalLightHint")}</p>

            <Field label={t("serviceTypeLabel")} required fieldId="field-intent">
              <select
                id="field-intent"
                aria-invalid={fieldInvalid("field-intent") || undefined}
                value={form.intent}
                onChange={(e) => {
                  const next = e.target.value as ConsultationIntent | "";
                  if (next === "consulting" || next === "workshop") {
                    update({ intent: next });
                    setDigitalLightMode(false);
                    setQuickMode(false);
                    setStep(2);
                    return;
                  }
                  update({ intent: next });
                }}
                className={controlClass("field-intent")}
                required
              >
                <option value="">{t("selectPlaceholder")}</option>
                <option value="website">{t("intentWebsite")}</option>
                <option value="platform">{t("intentPlatform")}</option>
                <option value="visibility">{t("intentVisibility")}</option>
                <option value="automation">{t("intentAutomation")}</option>
                <option value="ai-support">{t("intentAiSupport")}</option>
                <option value="digital-events">{t("intentDigitalEvents")}</option>
                <option value="unsure">{t("intentUnsure")}</option>
              </select>
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={t("nameLabel")} required fieldId="field-name">
                <input
                  id="field-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update({ name: e.target.value })}
                  className={controlClass("field-name")}
                  autoComplete="name"
                  aria-invalid={fieldInvalid("field-name") || undefined}
                  required
                />
              </Field>
              <Field label={t("emailLabel")} required hint={t("emailHint")} fieldId="field-email">
                <input
                  id="field-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update({ email: e.target.value })}
                  className={controlClass("field-email")}
                  autoComplete="email"
                  aria-invalid={fieldInvalid("field-email") || undefined}
                  required
                />
              </Field>
              <Field label={t("companyLabel")}>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => update({ company: e.target.value })}
                  className={inputClass}
                  autoComplete="organization"
                />
              </Field>
            </div>

            <Field label={t("digitalLightNoteLabel")} fieldId="field-goal">
              <textarea
                id="field-goal"
                value={form.goal}
                onChange={(e) => update({ goal: e.target.value })}
                rows={2}
                placeholder={t("digitalLightNotePlaceholder")}
                className={controlClass("field-goal", "resize-y min-h-[72px]")}
                aria-invalid={fieldInvalid("field-goal") || undefined}
                maxLength={280}
              />
              <p className="mt-1.5 text-xs text-slate-500">
                {t("digitalLightNoteHint")}
              </p>
            </Field>

            <p className="text-xs text-slate-500">{t("privacyNote")}</p>
            <button
              type="button"
              onClick={() => {
                setDigitalLightMode(false);
                setQuickMode(false);
                setStep(form.intent ? 2 : 1);
              }}
              className="text-sm text-primary font-medium hover:underline"
            >
              {t("digitalLightMoreDetail")}
            </button>
          </div>
        ) : quickMode ? (
          <div key="quick" className="animate-fade-in space-y-5">
            <h2 className="text-xl font-serif font-bold text-slate-900">
              {t("step3Title")}
            </h2>
            <p className="text-sm text-slate-600">{t("quickInquiryHint")}</p>
            <Field label={t("quickInquiryMessageLabel")} required fieldId="field-goal">
              <textarea
                id="field-goal"
                value={form.goal}
                onChange={(e) => update({ goal: e.target.value })}
                rows={4}
                placeholder={t("quickInquiryMessagePlaceholder")}
                className={controlClass("field-goal", "resize-y min-h-[112px]")}
                aria-invalid={fieldInvalid("field-goal") || undefined}
                required
                minLength={5}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={t("nameLabel")} required fieldId="field-name">
                <input
                  id="field-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update({ name: e.target.value })}
                  className={controlClass("field-name")}
                  autoComplete="name"
                  aria-invalid={fieldInvalid("field-name") || undefined}
                  required
                />
              </Field>
              <Field label={t("emailLabel")} required hint={t("emailHint")} fieldId="field-email">
                <input
                  id="field-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update({ email: e.target.value })}
                  className={controlClass("field-email")}
                  autoComplete="email"
                  aria-invalid={fieldInvalid("field-email") || undefined}
                  required
                />
              </Field>
            </div>
            <p className="text-xs text-slate-500">{t("privacyNote")}</p>
            <button
              type="button"
              onClick={() => setQuickMode(false)}
              className="text-sm text-primary font-medium hover:underline"
            >
              {t("back")}
            </button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div key="step1" className="animate-fade-in">
                <h2 className="text-xl font-serif font-bold text-slate-900">
                  {t("step1Title")}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{t("step1Hint")}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {t("step1TimeEstimate")}
                </p>
                <div className="mt-4 mb-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setQuickMode(true);
                      setDigitalLightMode(false);
                    }}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    {t("quickInquiryToggle")}
                  </button>
                </div>
                <div
                  id="field-intent"
                  data-inquiry-field="field-intent"
                  className={`mt-4 grid scroll-mt-28 sm:grid-cols-2 gap-3 ${
                    fieldInvalid("field-intent")
                      ? "rounded-xl ring-2 ring-red-400 ring-offset-2"
                      : ""
                  }`}
                >
                  {intentOptions.map((option) => {
                    const Icon = option.icon;
                    const selected = form.intent === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          update({
                            intent: option.value,
                            consultingFocus:
                              option.value === "consulting"
                                ? form.consultingFocus
                                : "",
                            websiteGoal:
                              option.value === "website"
                                ? form.websiteGoal
                                : "",
                            platformType:
                              option.value === "platform"
                                ? form.platformType
                                : "",
                            automationGoal:
                              option.value === "automation"
                                ? form.automationGoal
                                : "",
                            aiGoal:
                              option.value === "ai-support" ? form.aiGoal : "",
                            eventGoal:
                              option.value === "digital-events"
                                ? form.eventGoal
                                : "",
                            workshopTopic:
                              option.value === "workshop"
                                ? form.workshopTopic
                                : "",
                            hasExistingSite:
                              option.value === "website"
                                ? form.hasExistingSite
                                : "",
                          });
                          if (shouldUseDigitalDiscoveryFunnel(option.value)) {
                            setDigitalLightMode(true);
                            setQuickMode(false);
                            setStep(1);
                          } else {
                            setDigitalLightMode(false);
                            setStep(2);
                          }
                        }}
                        className={`text-left rounded-xl border p-4 transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 hover:ring-2 hover:ring-primary/35 hover:border-primary/50 hover:bg-white ${
                          selected
                            ? "border-primary-dark bg-primary-dark/5 shadow-md shadow-primary/20 ring-2 ring-primary-dark/25"
                            : "border-slate-200 bg-white shadow-sm"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                              selected
                                ? "bg-primary-dark/15 text-primary-dark"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {t(option.titleKey)}
                            </p>
                            <p className="mt-0.5 text-sm text-slate-600">
                              {t(option.descKey)}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div key="step2" className="animate-fade-in space-y-5">
                <h2 className="text-xl font-serif font-bold text-slate-900">
                  {t("step2Title")}
                </h2>
                {fromAssessment && (
                  <p className="rounded-lg border border-primary/20 bg-primary/[0.04] px-4 py-3 text-sm text-slate-700">
                    {t("assessmentPrefillNote")}
                  </p>
                )}
                {initialReference && initialReferenceLabel && (
                  <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/[0.04] px-4 py-3">
                    {initialReferenceImage && (
                      <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded border border-slate-200 bg-white">
                        <Image
                          src={initialReferenceImage}
                          alt=""
                          fill
                          className="object-cover object-top"
                          sizes="64px"
                        />
                      </div>
                    )}
                    <div className="text-sm text-slate-700">
                      <p className="font-medium text-slate-900">
                        {t("portfolioReferenceChip", {
                          project: initialReferenceLabel,
                        })}
                      </p>
                      {!fromAssessment && (
                        <p className="mt-0.5">{t("portfolioReferenceNote")}</p>
                      )}
                    </div>
                  </div>
                )}

                {form.intent === "consulting" && (
                  <Field label={t("consultingFocusLabel")} required fieldId="field-consulting-focus">
                    <select
                      id="field-consulting-focus"
                      aria-invalid={fieldInvalid("field-consulting-focus") || undefined}
                      value={form.consultingFocus}
                      onChange={(e) =>
                        update({ consultingFocus: e.target.value })
                      }
                      className={controlClass("field-consulting-focus")}
                      required
                    >
                      <option value="">{t("selectPlaceholder")}</option>
                      <option value="strategy">{t("focusStrategy")}</option>
                      <option value="operations">{t("focusOperations")}</option>
                      <option value="team">{t("focusTeam")}</option>
                      <option value="data">{t("focusData")}</option>
                      <option value="innovation">{t("focusInnovation")}</option>
                      <option value="technology">{t("focusTechnology")}</option>
                      <option value="other">{t("focusOther")}</option>
                    </select>
                  </Field>
                )}

                {form.intent === "website" && (
                  <>
                    <Field label={t("websiteGoalLabel")} required fieldId="field-website-goal">
                      <select
                        id="field-website-goal"
                        aria-invalid={fieldInvalid("field-website-goal") || undefined}
                        value={form.websiteGoal}
                        onChange={(e) => {
                          const websiteGoal = e.target.value;
                          update({
                            websiteGoal,
                            ...(websiteGoalRequiresExistingSite(websiteGoal)
                              ? {}
                              : { hasExistingSite: "", currentSiteUrl: "" }),
                          });
                        }}
                        className={controlClass("field-website-goal")}
                        required
                      >
                        <option value="">{t("selectPlaceholder")}</option>
                        <option value="new">{t("websiteGoalNew")}</option>
                        <option value="redesign">
                          {t("websiteGoalRedesign")}
                        </option>
                        <option value="conversion">
                          {t("websiteGoalConversion")}
                        </option>
                        <option value="landing-booking">
                          {t("websiteGoalLandingBooking")}
                        </option>
                        <option value="maintain">
                          {t("websiteGoalMaintain")}
                        </option>
                        <option value="bilingual">
                          {t("websiteGoalBilingual")}
                        </option>
                        <option value="ecommerce">
                          {t("websiteGoalEcommerce")}
                        </option>
                      </select>
                    </Field>
                    {websiteGoalRequiresExistingSite(form.websiteGoal) && (
                      <>
                        <div
                          id="field-existing-site"
                          data-inquiry-field="field-existing-site"
                          className={`scroll-mt-28 rounded-lg ${
                            fieldInvalid("field-existing-site")
                              ? "ring-2 ring-red-400 ring-offset-2"
                              : ""
                          }`}
                        >
                          <p
                            id="existing-site-label"
                            className="block text-sm font-medium text-slate-700 mb-1.5"
                          >
                            {t("hasExistingSiteLabel")}
                            <span className="text-primary ml-0.5">*</span>
                          </p>
                          <div
                            className="flex gap-3"
                            role="group"
                            aria-labelledby="existing-site-label"
                            aria-invalid={fieldInvalid("field-existing-site") || undefined}
                          >
                            {(["yes", "no"] as const).map((value) => {
                              const selected = form.hasExistingSite === value;
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  aria-pressed={selected}
                                  onClick={() =>
                                    update({
                                      hasExistingSite: value,
                                      ...(value === "no"
                                        ? { currentSiteUrl: "" }
                                        : {}),
                                    })
                                  }
                                  className={`flex-1 rounded-lg border px-4 py-3 text-center text-sm font-medium transition-colors ${
                                    selected
                                      ? "border-primary bg-primary/5 text-primary"
                                      : "border-slate-200 text-slate-700 hover:border-primary/30"
                                  }`}
                                >
                                  {t(value === "yes" ? "yes" : "no")}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        {form.hasExistingSite === "yes" && (
                          <Field label={t("currentSiteUrlLabel")}>
                            <input
                              type="url"
                              value={form.currentSiteUrl}
                              onChange={(e) =>
                                update({ currentSiteUrl: e.target.value })
                              }
                              placeholder={t("currentSiteUrlPlaceholder")}
                              className={inputClass}
                            />
                          </Field>
                        )}
                      </>
                    )}
                  </>
                )}

                {form.intent === "platform" && (
                  <Field label={t("platformTypeLabel")} required fieldId="field-platform">
                    <select
                      id="field-platform"
                      aria-invalid={fieldInvalid("field-platform") || undefined}
                      value={form.platformType}
                      onChange={(e) => update({ platformType: e.target.value })}
                      className={controlClass("field-platform")}
                      required
                    >
                      <option value="">{t("selectPlaceholder")}</option>
                      <option value="internal">{t("platformInternal")}</option>
                      <option value="customer">{t("platformCustomer")}</option>
                      <option value="client-portal">
                        {t("platformClientPortal")}
                      </option>
                      <option value="marketplace">
                        {t("platformMarketplace")}
                      </option>
                      <option value="iot-dashboard">
                        {t("platformIotDashboard")}
                      </option>
                      <option value="ecommerce">
                        {t("platformEcommerce")}
                      </option>
                      <option value="other">{t("platformOther")}</option>
                    </select>
                  </Field>
                )}

                {form.intent === "automation" && (
                  <Field label={t("automationGoalLabel")} required fieldId="field-automation">
                    <select
                      id="field-automation"
                      aria-invalid={fieldInvalid("field-automation") || undefined}
                      value={form.automationGoal}
                      onChange={(e) =>
                        update({ automationGoal: e.target.value })
                      }
                      className={controlClass("field-automation")}
                      required
                    >
                      <option value="">{t("selectPlaceholder")}</option>
                      <option value="workflow">
                        {t("automationGoalWorkflow")}
                      </option>
                      <option value="integration">
                        {t("automationGoalIntegration")}
                      </option>
                      <option value="both">{t("automationGoalBoth")}</option>
                    </select>
                  </Field>
                )}

                {form.intent === "ai-support" && (
                  <Field label={t("aiGoalLabel")} required fieldId="field-ai">
                    <select
                      id="field-ai"
                      aria-invalid={fieldInvalid("field-ai") || undefined}
                      value={form.aiGoal}
                      onChange={(e) => update({ aiGoal: e.target.value })}
                      className={controlClass("field-ai")}
                      required
                    >
                      <option value="">{t("selectPlaceholder")}</option>
                      <option value="scoring">{t("aiGoalScoring")}</option>
                      <option value="content-workflow">
                        {t("aiGoalContentWorkflow")}
                      </option>
                      <option value="custom-model">
                        {t("aiGoalCustomModel")}
                      </option>
                      <option value="exploring">{t("aiGoalExploring")}</option>
                    </select>
                  </Field>
                )}

                {form.intent === "digital-events" && (
                  <Field label={t("eventGoalLabel")} required fieldId="field-event">
                    <select
                      id="field-event"
                      aria-invalid={fieldInvalid("field-event") || undefined}
                      value={form.eventGoal}
                      onChange={(e) => update({ eventGoal: e.target.value })}
                      className={controlClass("field-event")}
                      required
                    >
                      <option value="">{t("selectPlaceholder")}</option>
                      <option value="booth">{t("eventGoalBooth")}</option>
                      <option value="microsite">
                        {t("eventGoalMicrosite")}
                      </option>
                      <option value="event-app">
                        {t("eventGoalEventApp")}
                      </option>
                      <option value="activation">
                        {t("eventGoalActivation")}
                      </option>
                    </select>
                  </Field>
                )}

                {form.intent === "workshop" && (
                  <Field label={t("workshopTopicLabel")} required fieldId="field-workshop">
                    <select
                      id="field-workshop"
                      aria-invalid={fieldInvalid("field-workshop") || undefined}
                      value={form.workshopTopic}
                      onChange={(e) =>
                        update({ workshopTopic: e.target.value })
                      }
                      className={controlClass("field-workshop")}
                      required
                    >
                      <option value="">{t("selectPlaceholder")}</option>
                      <option value="focus-circle">
                        {t("workshopTopicFocusCircle")}
                      </option>
                      <option value="workload-conversation">
                        {t("workshopTopicWorkloadConversation")}
                      </option>
                      <option value="digital-calm">
                        {t("workshopTopicDigitalCalm")}
                      </option>
                      <option value="decision-hour">
                        {t("workshopTopicDecisionHour")}
                      </option>
                      <option value="offer-page">
                        {t("workshopTopicOfferPage")}
                      </option>
                      <option value="first-offer">
                        {t("workshopTopicFirstOffer")}
                      </option>
                      <option value="branding">
                        {t("workshopTopicBranding")}
                      </option>
                      <option value="sales">{t("workshopTopicSales")}</option>
                      <option value="productivity">
                        {t("workshopTopicProductivity")}
                      </option>
                      <option value="ideation">
                        {t("workshopTopicIdeation")}
                      </option>
                      <option value="other">{t("workshopTopicOther")}</option>
                    </select>
                  </Field>
                )}

                {isDigitalIntent(form.intent) && (
                  <>
                    <Field label={t("industryLabel")}>
                      <select
                        value={form.industry}
                        onChange={(e) => update({ industry: e.target.value })}
                        className={inputClass}
                      >
                        <option value="">{t("selectPlaceholder")}</option>
                        <option value="fleet-logistics">
                          {t("industryFleet")}
                        </option>
                        <option value="sports-recreation">
                          {t("industrySports")}
                        </option>
                        <option value="events-trade-shows">
                          {t("industryEvents")}
                        </option>
                        <option value="education-training">
                          {t("industryEducation")}
                        </option>
                        <option value="professional-services">
                          {t("industryProfessional")}
                        </option>
                        <option value="business-platforms">
                          {t("industryPlatforms")}
                        </option>
                        <option value="other">{t("industryOther")}</option>
                      </select>
                    </Field>
                    <Field label={t("primaryOutcomeLabel")}>
                      <select
                        value={form.primaryOutcome}
                        onChange={(e) =>
                          update({ primaryOutcome: e.target.value })
                        }
                        className={inputClass}
                      >
                        <option value="">{t("selectPlaceholder")}</option>
                        <option value="leads">{t("outcomeLeads")}</option>
                        <option value="bookings">{t("outcomeBookings")}</option>
                        <option value="self-serve">
                          {t("outcomeSelfServe")}
                        </option>
                        <option value="operations">
                          {t("outcomeOperations")}
                        </option>
                        <option value="other">{t("outcomeOther")}</option>
                      </select>
                    </Field>
                  </>
                )}

                {(form.intent === "platform" ||
                  form.intent === "automation") && (
                  <Field label={t("systemsToConnectLabel")}>
                    <input
                      type="text"
                      value={form.systemsToConnect}
                      onChange={(e) =>
                        update({ systemsToConnect: e.target.value })
                      }
                      placeholder={t("systemsToConnectPlaceholder")}
                      className={inputClass}
                    />
                  </Field>
                )}

                {form.intent === "platform" && (
                  <Field label={t("userScaleLabel")}>
                    <select
                      value={form.userScale}
                      onChange={(e) => update({ userScale: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">{t("selectPlaceholder")}</option>
                      <option value="under-50">{t("userScaleUnder50")}</option>
                      <option value="50-500">{t("userScale50to500")}</option>
                      <option value="500-plus">{t("userScale500Plus")}</option>
                      <option value="not-sure">{t("userScaleNotSure")}</option>
                    </select>
                  </Field>
                )}

                {isDigitalIntent(form.intent) && (
                  <Field label={t("budgetBandLabel")}>
                    <select
                      value={form.budgetBand}
                      onChange={(e) => update({ budgetBand: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">{t("selectPlaceholder")}</option>
                      <option value="under-15k">{t("budgetUnder15k")}</option>
                      <option value="15-50k">{t("budget15to50k")}</option>
                      <option value="50k-plus">{t("budget50kPlus")}</option>
                      <option value="not-sure">{t("budgetNotSure")}</option>
                    </select>
                  </Field>
                )}

                <Field label={t("goalLabel")} required fieldId="field-goal">
                  <textarea
                    id="field-goal"
                    value={form.goal}
                    onChange={(e) => update({ goal: e.target.value })}
                    rows={4}
                    placeholder={t(goalPlaceholderKey(form.intent))}
                    className={controlClass("field-goal", "resize-y min-h-[112px]")}
                    aria-invalid={fieldInvalid("field-goal") || undefined}
                    required
                    minLength={5}
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    {t(goalExampleKey(form.intent))}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {t("goalMinHint")}
                  </p>
                </Field>

                <Field label={t("timelineLabel")} required fieldId="field-timeline">
                  <select
                    id="field-timeline"
                    aria-invalid={fieldInvalid("field-timeline") || undefined}
                    value={form.timeline}
                    onChange={(e) => update({ timeline: e.target.value })}
                    className={controlClass("field-timeline")}
                    required
                  >
                    <option value="">{t("selectPlaceholder")}</option>
                    <option value="asap">{t("timelineAsap")}</option>
                    <option value="1to3">{t("timeline1to3")}</option>
                    <option value="3to6">{t("timeline3to6")}</option>
                    <option value="exploring">{t("timelineExploring")}</option>
                  </select>
                </Field>
              </div>
            )}

            {step === 3 && (
              <div key="step3" className="animate-fade-in space-y-5">
                <h2 className="text-xl font-serif font-bold text-slate-900">
                  {t("step3Title")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label={t("nameLabel")} required fieldId="field-name">
                    <input
                      id="field-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => update({ name: e.target.value })}
                      className={controlClass("field-name")}
                      autoComplete="name"
                      aria-invalid={fieldInvalid("field-name") || undefined}
                      required
                    />
                  </Field>
                  <Field label={t("emailLabel")} required hint={t("emailHint")} fieldId="field-email">
                    <input
                      id="field-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update({ email: e.target.value })}
                      className={controlClass("field-email")}
                      autoComplete="email"
                      aria-invalid={fieldInvalid("field-email") || undefined}
                      required
                    />
                  </Field>
                  <Field label={t("companyLabel")}>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => update({ company: e.target.value })}
                      className={inputClass}
                      autoComplete="organization"
                    />
                  </Field>
                  <Field label={t("phoneLabel")}>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update({ phone: e.target.value })}
                      className={inputClass}
                      autoComplete="tel"
                    />
                  </Field>
                </div>
                <p className="text-xs text-slate-500">{t("privacyNote")}</p>
              </div>
            )}
          </>
        )}

        {showMissingNotice && (
          <p
            id="missing-fields"
            className={`mt-6 text-sm ${attempted ? "text-red-700" : "text-slate-600"}`}
            role={attempted ? "alert" : "status"}
          >
            {missingLead}{" "}
            {missingFields.map((field, index) => (
              <React.Fragment key={field.id}>
                {index > 0 && " · "}
                <button
                  type="button"
                  className="font-medium underline underline-offset-2"
                  onClick={() => {
                    setAttempted(true);
                    focusInquiryField(field.id);
                  }}
                >
                  {field.label}
                </button>
              </React.Fragment>
            ))}
          </p>
        )}

        <div
          className={`${
            showMissingNotice ? "mt-4" : "mt-8"
          } flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3`}
        >
          {!quickMode && !digitalLightMode && step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center justify-center text-slate-600 font-medium hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back")}
            </button>
          ) : (
            <span />
          )}

          {digitalLightMode || quickMode ? (
            <button
              type="submit"
              disabled={submitting}
              aria-describedby={showMissingNotice ? "missing-fields" : undefined}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:ml-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </button>
          ) : step < 3 ? (
            <button
              type="button"
              aria-describedby={showMissingNotice ? "missing-fields" : undefined}
              onClick={() => {
                if ((step === 1 && !canContinueStep1) || (step === 2 && !canContinueStep2)) {
                  revealMissing();
                  return;
                }
                setAttempted(false);
                setStep((s) => s + 1);
              }}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t("continue")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              aria-describedby={showMissingNotice ? "missing-fields" : undefined}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
  fieldId,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  fieldId?: string;
}) {
  return (
    <div
      data-inquiry-field={fieldId}
      className={fieldId ? "scroll-mt-28" : undefined}
    >
      <label className="block">
        <span className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
          {required && <span className="text-primary ml-0.5">*</span>}
        </span>
        {hint && (
          <span className="block text-xs text-slate-500 mb-1.5">{hint}</span>
        )}
        {children}
      </label>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

const invalidInputClass =
  "w-full rounded-lg border border-red-400 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-colors";

type MissingField = { id: string; label: string };

function focusInquiryField(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const block = el.closest("[data-inquiry-field]") ?? el;
  block.scrollIntoView({ behavior: "smooth", block: "center" });
  const focusable =
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLButtonElement
      ? el
      : el.querySelector("input, select, textarea, button");
  if (focusable instanceof HTMLElement) {
    focusable.focus({ preventScroll: true });
  }
}

export function resolveInitialIntent(
  intentParam: string | null,
  serviceParam: string | null,
  needParam?: string | null,
): ConsultationIntent | null {
  return (
    parseConsultationIntent(intentParam) ??
    intentFromServiceParam(serviceParam) ??
    intentFromNeedParam(needParam ?? null)
  );
}

export function resolveInitialFocus(
  focusParam: string | null,
): ConsultingFocus | null {
  return parseConsultingFocus(focusParam);
}

export function resolveInitialWebsiteGoal(
  needParam: string | null,
): WebsiteGoal | null {
  return parseWebsiteGoal(needParam);
}

export function resolveInitialPlatformType(
  needParam: string | null,
): PlatformType | null {
  if (needParam === "custom-platform") return null;
  return parsePlatformType(needParam);
}

export function resolveInitialAutomationGoal(
  needParam: string | null,
): AutomationGoal | null {
  return automationGoalFromNeedParam(needParam);
}

export function resolveInitialAiGoal(needParam: string | null): AiGoal | null {
  if (needParam === "ai-support") return null;
  return parseAiGoal(needParam);
}

export function resolveInitialEventGoal(
  needParam: string | null,
): EventGoal | null {
  return parseEventGoal(needParam);
}

export function resolveInitialWorkshopTopic(
  needParam: string | null,
  topicParam: string | null,
): WorkshopTopic | null {
  return parseWorkshopTopic(topicParam) ?? parseWorkshopTopic(needParam);
}
