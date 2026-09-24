import Script from "next/script";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CompanionWorkshopExperience from "@/components/workshops/CompanionWorkshopExperience";
import { buildPageMetadata } from "@/lib/page-metadata";
import { companionWorkshopCopy } from "@/lib/workshops/companion-workshops-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = companionWorkshopCopy("offer-page", locale);
  return buildPageMetadata({ locale, path: copy.path, title: copy.metaTitle, description: copy.metaDescription });
}

export default async function OfferPageWorkshop({ params }: Props) {
  const { locale } = await params;
  const copy = companionWorkshopCopy("offer-page", locale);
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const jsonLd = { "@context": "https://schema.org", "@graph": [{ "@type": "Course", name: copy.title, description: copy.metaDescription, provider: { "@type": "Organization", name: tCommon("companyName"), url: "https://www.roalla.com" }, url: `https://www.roalla.com/${locale}${copy.path}` }, { "@type": "FAQPage", mainEntity: copy.faqs.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) }] };
  return <div className="page-shell"><Script id="offer-page-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden /><div className="container mx-auto px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28"><CompanionWorkshopExperience copy={copy} /></div></div>;
}
