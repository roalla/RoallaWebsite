export const CONVERSION_PATH = "/services/customer-conversion-systems";
export const CONVERSION_OFFER = "customer-conversion-review";
export const CONVERSION_INTENT = "automation";
export const CONVERSION_GOAL_HANDOFF_KEY = "roalla:conversion-review-goal";
export const LOCALE_SWITCH_EVENT = "roalla:locale-switch";

const entryPaths = {
  "digital-enablement": "/services/digital",
  "growth-pathway": "/solutions/need/growth-visibility",
} as const;

export type ConversionEntry = keyof typeof entryPaths;
export type ConversionPlacement = "hero" | "review" | "closing" | "mobile";

export function conversionEntry(value: string | null): ConversionEntry | "direct" {
  return value === "digital-enablement" || value === "growth-pathway" ? value : "direct";
}

export function conversionPlacement(value: string | null): ConversionPlacement | undefined {
  return value === "hero" || value === "review" || value === "closing" || value === "mobile"
    ? value
    : undefined;
}

export function conversionEntryPath(entry: ReturnType<typeof conversionEntry>) {
  return entry === "direct" ? CONVERSION_PATH : entryPaths[entry];
}

export const conversionReviewCopy = {
  en: {
    title: "Customer Conversion Review",
    request: "Request a Customer Conversion Review",
    submit: "Send my review request",
    goal: "I’d like a Customer Conversion Review to see where we miss inquiries or lose track of follow-up.",
    goalLabel: "What would you like to improve?",
    formTitle: "Tell us about your follow-up",
    submittedGoalLabel: "Your review goal",
    formHint: "Tell us where inquiries come from and where follow-up tends to stall.",
    next: "ROALLA will review your request and follow up within one business day to discuss your customer journey and confirm scope and timing.",
    received: "Customer Conversion Review request received",
    confirmation: "We’ve received your request and will use the details you shared to prepare for the conversation.",
    benefits: ["Identify where inquiries are lost", "Clarify follow-up ownership and next steps", "Choose what to measure in a first pilot"],
  },
  fr: {
    title: "Revue de conversion client",
    request: "Demander une revue de conversion client",
    submit: "Envoyer ma demande de revue",
    goal: "J’aimerais une revue de conversion client pour repérer les demandes qui nous échappent et les suivis qui se perdent.",
    goalLabel: "Que souhaitez-vous améliorer?",
    formTitle: "Parlez-nous de votre processus de suivi",
    submittedGoalLabel: "Votre objectif pour la revue",
    formHint: "Indiquez d’où viennent vos demandes et à quel moment le suivi ralentit.",
    next: "ROALLA examinera votre demande et vous répondra dans un délai d’un jour ouvrable pour discuter de votre parcours client et confirmer la portée et les délais.",
    received: "Demande de revue de conversion client reçue",
    confirmation: "Nous avons reçu votre demande. Vos renseignements nous aideront à préparer la conversation.",
    benefits: ["Repérer où les demandes se perdent", "Clarifier les responsabilités et les prochaines étapes du suivi", "Choisir quoi mesurer lors d’un premier projet pilote"],
  },
} as const;
