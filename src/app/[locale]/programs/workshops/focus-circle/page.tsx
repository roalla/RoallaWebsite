import React from "react";
import Script from "next/script";
import type { Metadata } from "next";
import FocusCircleExperience from "@/components/workshops/FocusCircleExperience";
import { buildPageMetadata } from "@/lib/page-metadata";
import { workshopPageJsonLd } from "@/lib/structured-data";
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
  const jsonLd = workshopPageJsonLd(locale, {
    title: copy.title,
    metaDescription: copy.metaDescription,
    path: focusCirclePath,
    audienceLine: copy.audienceLine,
    promise: copy.promise,
    faqs: copy.faqs,
  });

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
