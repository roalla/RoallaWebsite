import Script from "next/script";
import type { Metadata } from "next";
import CompanionWorkshopExperience from "@/components/workshops/CompanionWorkshopExperience";
import { buildPageMetadata } from "@/lib/page-metadata";
import { workshopPageJsonLd } from "@/lib/structured-data";
import { companionWorkshopCopy } from "@/lib/workshops/companion-workshops-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = companionWorkshopCopy("workload-conversation", locale);
  return buildPageMetadata({ locale, path: copy.path, title: copy.metaTitle, description: copy.metaDescription });
}

export default async function WorkloadConversationPage({ params }: Props) {
  const { locale } = await params;
  const copy = companionWorkshopCopy("workload-conversation", locale);
  const jsonLd = workshopPageJsonLd(locale, copy);
  return <div className="page-shell"><Script id="workload-conversation-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden /><div className="container mx-auto px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28"><CompanionWorkshopExperience copy={copy} /></div></div>;
}
