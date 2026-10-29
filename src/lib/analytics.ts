export type AnalyticsEventName =
  | "visibility_assessment_click"
  | "visibility_service_inquiry"
  | "visibility_snapshot_started"
  | "visibility_snapshot_completed"
  | "visibility_snapshot_cta"
  | "social_snapshot_started"
  | "social_snapshot_completed"
  | "social_snapshot_cta"
  | "social_profile_checklist_toggle"
  | "social_profile_checklist_score"
  | "social_profile_checklist_cta"
  | "digital_snapshot_started"
  | "digital_snapshot_fresh"
  | "digital_snapshot_completed"
  | "digital_snapshot_compared"
  | "digital_snapshot_cta"
  | "digital_blueprint_completed"
  | "business_value_calculated"
  | "monitoring_preview_opened"
  | "business_blueprint_saved"
  | "advisory_value_calculated"
  | "technology_brief_completed"
  | "technology_brief_step"
  | "technology_brief_pdf"
  | "technology_brief_contact"
  | "technology_advisor_flow_step"
  | "technology_advisor_flow_completed"
  | "technology_category_selected"
  | "technology_journey_cta_click"
  | "communications_value_brief_completed"
  | "communications_value_brief_step"
  | "communications_value_brief_pdf"
  | "communications_value_brief_contact"
  | "communications_value_brief_started"
  | "workshop_finder_completed"
  | "workshop_impact_saved"
  | "visibility_review_started"
  | "visibility_review_submitted"
  | "visibility_campaign_started"
  | "landing_page_cta_click"
  | "campaign_review_cta"
  | "service_framework_click"
  | "consultation_request_submitted"
  | "executive_guide_cta_click"
  | "executive_guide_request"
  | "executive_guide_download"
  | "executive_conversation_click"
  | "executive_insights_nav_click"
  | "executive_insights_home_click"
  | "solutions_menu_open"
  | "solutions_pathway_click"
  | "solutions_assessment_click"
  | "solutions_tool_click"
  | "outcome_page_view"
  | "outcome_selection"
  | "outcome_cta_click"
  | "partners_hero_cta"
  | "partners_start_here"
  | "partners_directory_filter"
  | "partners_directory_search"
  | "partners_directory_external"
  | "partners_directory_compare"
  | "partners_directory_brief"
  | "partners_matrix_jump"
  | "partners_soft_prompt"
  | "partners_evaluation_toggle"
  | "partners_evaluation_brief"
  | "partners_section_nav"
  | "partners_sticky_cta"
  | "partners_closing_cta";

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
