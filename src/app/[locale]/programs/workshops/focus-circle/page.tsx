import React from "react";
import Script from "next/script";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import FocusCircleExperience from "@/components/workshops/FocusCircleExperience";
import { buildPageMetadata } from "@/lib/page-metadata";
import { focusCircleCopy } from "@/lib/workshops/focus-circle-content";
import { focusCirclePath } from "@/lib/workshops/hosted-workshops";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = focusCircleCopy(locale);
  return buildPageMetadata({
    locale,
    path: focusCirclePath,
    title: copy.metaTitle,
    description: copy.metaDescription,
  });
}

export default async function FocusCirclePage({ params }: Props) {
  const { locale } = await params;
  const copy = focusCircleCopy(locale);
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const pageUrl = `https://www.roalla.com/${locale}${focusCirclePath}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        name: copy.title,
        description: copy.metaDescription,
        provider: {
          "@type": "Organization",
          name: tCommon("companyName"),
          url: "https://www.roalla.com",
        },
        url: pageUrl,
      },
      {
        "@type": "FAQPage",
        mainEntity: copy.faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <div className="page-shell">
      <Script
        id="focus-circle-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <FocusCircleExperience />
      </div>
    </div>
  );
}
