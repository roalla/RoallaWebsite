export type AnalyticsEventName =
  | "visibility_assessment_click"
  | "visibility_service_inquiry"
  | "service_framework_click"
  | "consultation_request_submitted";

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  parameters: Record<string, string | number | boolean | undefined> = {},
) {
  if (typeof window === "undefined") return;
  const gtag = (
    window as typeof window & {
      gtag?: (
        command: "event",
        name: string,
        params: Record<string, unknown>,
      ) => void;
    }
  ).gtag;
  gtag?.("event", eventName, parameters);
}
