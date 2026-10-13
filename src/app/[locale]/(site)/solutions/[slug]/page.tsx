import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import OutcomeLandingPage from "@/components/solutions/OutcomeLandingPage";
import { buildPageMetadata } from "@/lib/page-metadata";
import {
  outcomeEvidence,
  outcomePageCopy,
  outcomeVisuals,
  relatedOutcomeIds,
  isSolutionPathId,
  supplierContextOutcomeIds,
} from "@/lib/solution-outcome-pages";
import {
  SOLUTION_PATH_IDS,
  solutionsByNeedContent,
  type SolutionPathway,
  type SolutionsByNeedContent,
} from "@/lib/solutions-by-need";
import {
  breadcrumbJsonLd,
  servicePageJsonLd,
  webPageJsonLd,
} from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string; slug: string }> };
type OutcomePage = {
  language: "en" | "fr";
  content: SolutionsByNeedContent;
  pathway: SolutionPathway;
};

export function generateStaticParams() {
  return SOLUTION_PATH_IDS.flatMap((slug) => [
    { locale: "en", slug },
    { locale: "fr", slug },
  ]);
}

function getPage(locale: string, slug: string): OutcomePage | null {
  if (!isSolutionPathId(slug)) return null;
  const language: "en" | "fr" = locale === "fr" ? "fr" : "en";
  const content = solutionsByNeedContent[language];
  const pathway = content.pathways.find((item) => item.id === slug);
  if (!pathway) return null;
  return { language, content, pathway };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getPage(locale, slug);
  if (!page) return {};

  return buildPageMetadata({
    locale: page.language,
    path: `/solutions/${slug}`,
    title: `${page.pathway.shortTitle} | ROALLA`,
    description: page.pathway.result,
    ogImage: outcomeVisuals[page.pathway.id].src,
    ogImageAlt: outcomeVisuals[page.pathway.id].alt[page.language],
  });
}

export default async function SolutionOutcomePage({ params }: Props) {
  const { locale, slug } = await params;
  const page = getPage(locale, slug);
  if (!page) notFound();

  const { language, content, pathway } = page;
  const copy = outcomePageCopy[language];
  const related = relatedOutcomeIds[pathway.id]
    .map((id) => content.pathways.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const faqs = [
    { question: copy.faqOutcomeQuestion, answer: pathway.result },
    { question: copy.faqFitQuestion, answer: pathway.signals.join("; ") },
    { question: copy.faqScopeQuestion, answer: pathway.examples.join("; ") },
  ];
  const path = `/solutions/${pathway.id}`;

  const visual = outcomeVisuals[pathway.id];

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd(language, path, pathway.title, pathway.result),
          breadcrumbJsonLd(language, [
            { name: language === "fr" ? "Accueil" : "Home", path: "" },
            { name: copy.breadcrumb, path: "/solutions" },
            { name: pathway.shortTitle },
          ]),
          ...servicePageJsonLd({
            locale: language,
            path,
            name: pathway.title,
            description: pathway.description,
            serviceType: pathway.serviceLabel,
            offers: pathway.examples.map((name) => ({ name, description: pathway.result })),
            faqs,
          }),
        ]}
      />
      <OutcomeLandingPage
        locale={language}
        pathway={pathway}
        related={related}
        evidence={outcomeEvidence[pathway.id] ?? []}
        visual={visual}
        showSupplierContext={supplierContextOutcomeIds.has(pathway.id)}
        copy={copy}
      />
    </>
  );
}
