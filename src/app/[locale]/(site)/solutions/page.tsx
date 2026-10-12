import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SolutionsByNeedPage from "@/components/solutions/SolutionsByNeedPage";
import { buildPageMetadata, pageUrl } from "@/lib/page-metadata";
import { solutionsByNeedContent } from "@/lib/solutions-by-need";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };
const path = "/solutions";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = solutionsByNeedContent[locale === "fr" ? "fr" : "en"];
  return buildPageMetadata({ locale, path, title: content.metadataTitle, description: content.metadataDescription });
}

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  const language = locale === "fr" ? "fr" : "en";
  const content = solutionsByNeedContent[language];
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: content.pathwaysTitle,
    numberOfItems: content.pathways.length,
    itemListElement: content.pathways.map((pathway, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: pathway.shortTitle,
      description: pathway.description,
      url: `${pageUrl(language, path)}#${pathway.id}`,
    })),
  };

  return (
    <>
      <JsonLd data={[
        webPageJsonLd(language, path, content.title, content.metadataDescription),
        breadcrumbJsonLd(language, [
          { name: language === "fr" ? "Accueil" : "Home", path: "" },
          { name: content.navLabel },
        ]),
        itemList,
      ]} />
      <SolutionsByNeedPage content={content} />
    </>
  );
}
