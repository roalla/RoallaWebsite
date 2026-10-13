"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type { SolutionPathId } from "@/lib/solutions-by-need";

export default function OutcomePageAnalytics({ outcome }: { outcome: SolutionPathId }) {
  useEffect(() => {
    trackAnalyticsEvent("outcome_page_view", { outcome });

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const selection = target?.closest<HTMLElement>("[data-outcome-selection]");
      if (selection?.dataset.outcomeSelection) {
        trackAnalyticsEvent("outcome_selection", {
          outcome: selection.dataset.outcomeSelection,
          source_outcome: outcome,
          location: "related_outcomes",
        });
        return;
      }

      const tracked = target?.closest<HTMLElement>("[data-outcome-track]");
      const value = tracked?.dataset.outcomeTrack;
      if (!value) return;
      const separator = value.indexOf("|");
      const location = separator >= 0 ? value.slice(0, separator) : value;
      const destination = separator >= 0 ? value.slice(separator + 1) : "unknown";
      trackAnalyticsEvent("outcome_cta_click", { outcome, location, destination });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [outcome]);

  return null;
}
