"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";

export default function VisibilityCtas({
  primaryLabel,
  assessmentLabel,
  source,
}: {
  primaryLabel: string;
  assessmentLabel: string;
  source: "hero" | "final";
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Link
        href={{
          pathname: "/schedule",
          query: { intent: "visibility", source: `visibility-${source}` },
        }}
        onClick={() =>
          trackAnalyticsEvent("visibility_service_inquiry", {
            placement: source,
          })
        }
        className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
      >
        {primaryLabel}
        <ArrowRight className="ml-2 w-4 h-4" aria-hidden />
      </Link>
      <Link
        href="/assessment"
        onClick={() =>
          trackAnalyticsEvent("visibility_assessment_click", {
            placement: source,
          })
        }
        className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-primary hover:text-primary-dark transition-colors"
      >
        {assessmentLabel}
      </Link>
    </div>
  );
}
