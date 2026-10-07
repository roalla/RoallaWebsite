import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import ExecutiveInsightsLibrary from "@/components/executive-insights/ExecutiveInsightsLibrary";
import { EXECUTIVE_GUIDES } from "@/lib/executive-guides";
import { buildPageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };

const copy = {
  en: {
    title: "Executive Insights",
    description: "Practical executive decision guides from ROALLA for growth, transformation, resilience and enterprise value.",
    breadcrumb: "Executive Insights",
  },
  fr: {
    title: "Perspectives pour dirigeants",
    description: "Des guides décisionnels pratiques de ROALLA sur la croissance, la transformation, la résilience et la valeur d’entreprise.",
    breadcrumb: "Perspectives pour dirigeants",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const language = locale === "fr" ? "fr" : "en";
  return buildPageMetadata({
    locale: language,
    path: "/executive-insights",
    title: `${copy[language].title} | ROALLA`,
    description: copy[language].description,
  });
}

export default async function ExecutiveInsightsPage({ params }: Props) {
  const { locale } = await params;
  const language = locale === "fr" ? "fr" : "en";
  const tBc = await getTranslations({ locale: language, namespace: "breadcrumb" });

  return (
    <div className="page-shell bg-[#f4f3ef]">
      <JsonLd
        data={[
          breadcrumbJsonLd(language, [
            { name: tBc("home"), path: "" },
            { name: copy[language].breadcrumb },
          ]),
          webPageJsonLd(language, "/executive-insights", copy[language].title, copy[language].description),
        ]}
      />
      <div className="sr-only">
        <Breadcrumb items={[{ label: tBc("home"), href: "/" }, { label: copy[language].breadcrumb }]} />
      </div>
      <ExecutiveInsightsLibrary locale={language} guides={EXECUTIVE_GUIDES} />
    </div>
  );
}

