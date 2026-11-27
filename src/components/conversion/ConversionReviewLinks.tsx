"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  CONVERSION_INTENT,
  CONVERSION_OFFER,
  CONVERSION_PATH,
  conversionEntry,
  conversionEntryPath,
  conversionReviewCopy,
  type ConversionEntry,
  type ConversionPlacement,
} from "@/lib/customer-conversion";

export function ConversionEntryLink({ entry, className, children }: {
  entry: ConversionEntry;
  className: string;
  children: ReactNode;
}) {
  const locale = useLocale();
  return (
    <Link
      href={{ pathname: CONVERSION_PATH, query: { entry } }}
      className={className}
      onClick={() => trackAnalyticsEvent("conversion_review_entry_click", { offer: CONVERSION_OFFER, entry, locale })}
    >
      {children}
    </Link>
  );
}

export function ConversionReviewCta({ placement, className }: {
  placement: ConversionPlacement;
  className?: string;
}) {
  const locale = useLocale();
  const copy = conversionReviewCopy[locale === "fr" ? "fr" : "en"];
  const [entry, setEntry] = useState<ReturnType<typeof conversionEntry>>("direct");
  useEffect(() => {
    setEntry(conversionEntry(new URLSearchParams(window.location.search).get("entry")));
  }, []);

  const query = {
    intent: CONVERSION_INTENT,
    need: "both",
    offer: CONVERSION_OFFER,
    from_page: `/${locale}${CONVERSION_PATH}`,
    entry_page: conversionEntryPath(entry),
    conversion_source: placement,
    entry,
  };
  const analytics = { offer: CONVERSION_OFFER, entry, placement, locale };

  if (placement === "mobile") {
    return <StickyMobileCTA label={copy.request} contactQuery={query} analyticsEvent="conversion_review_cta_click" analyticsParams={analytics} />;
  }

  return (
    <Link
      href={{ pathname: "/contact", query }}
      className={className}
      onClick={() => trackAnalyticsEvent("conversion_review_cta_click", analytics)}
    >
      {copy.request}
    </Link>
  );
}
