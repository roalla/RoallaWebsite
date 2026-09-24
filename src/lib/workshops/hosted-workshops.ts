export const focusCirclePath = "/programs/workshops/focus-circle" as const;
export const workloadConversationPath = "/programs/workshops/workload-conversation" as const;
export const digitalCalmPath = "/programs/workshops/digital-calm" as const;
export const decisionHourPath = "/programs/workshops/decision-hour" as const;
export const offerPagePath = "/programs/workshops/offer-page" as const;

export const focusCirclePdfFiles = [
  { id: "checklist", file: "weekly-focus-checklist" },
  { id: "kanban", file: "kanban-starter" },
  { id: "support", file: "support-circle-card" },
  { id: "actionPlan", file: "action-plan" },
  { id: "toolkit", file: "toolkit" },
] as const;

export type FocusCirclePdfId = (typeof focusCirclePdfFiles)[number]["id"];

export function focusCirclePdfHref(file: string, locale: string) {
  const lang = locale === "fr" ? "fr" : "en";
  return `/workshops/focus-circle/${file}-${lang}.pdf`;
}

export function focusCircleQrHref(locale: string) {
  const lang = locale === "fr" ? "fr" : "en";
  return `/workshops/focus-circle/qr-${lang}.svg`;
}

export function focusCirclePageUrl(locale: string) {
  const lang = locale === "fr" ? "fr" : "en";
  return `https://www.roalla.com/${lang}/programs/workshops/focus-circle`;
}

export const hostedWorkshops = [
  {
    id: "focus-circle",
    path: focusCirclePath,
    featured: true,
  },
  {
    id: "workload-conversation",
    path: workloadConversationPath,
    featured: true,
  },
  {
    id: "digital-calm",
    path: digitalCalmPath,
    featured: true,
  },
  {
    id: "decision-hour",
    path: decisionHourPath,
    featured: true,
  },
  {
    id: "offer-page",
    path: offerPagePath,
    featured: true,
  },
] as const;

export type HostedWorkshop = (typeof hostedWorkshops)[number];

export function featuredHostedWorkshops() {
  return hostedWorkshops.filter((workshop) => workshop.featured);
}
