export type AnalyticsEventName =
  | "visibility_assessment_click"
  | "visibility_service_inquiry"
  | "visibility_snapshot_started"
  | "visibility_snapshot_completed"
  | "visibility_snapshot_cta"
  | "social_snapshot_started"
  | "social_snapshot_completed"
  | "social_snapshot_cta"
  | "digital_snapshot_started"
  | "digital_snapshot_fresh"
  | "digital_snapshot_completed"
  | "digital_snapshot_compared"
  | "digital_snapshot_cta"
  | "visibility_review_started"
  | "visibility_review_submitted"
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
