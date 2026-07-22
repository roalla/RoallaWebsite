import { Suspense } from "react";
import type { Metadata } from "next";
import DigitalCreations from "@/components/DigitalCreations";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };
const path = "/services/portfolio/digital-products";

const copy = {
  en: {
    title: "Digital Product Portfolio | ROALLA",
    description:
      "Explore verified live digital products and operational platforms built by ROALLA.",
    label: "Digital Product Portfolio",
  },
  fr: {
    title: "Portfolio de produits numériques | ROALLA",
    description:
      "Explorez des produits numériques et plateformes opérationnelles en ligne construits par ROALLA.",
    label: "Portfolio de produits numériques",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = copy[locale === "fr" ? "fr" : "en"];
  return buildPageMetadata({
    locale,
    path,
    title: content.title,
    description: content.description,
  });
}

export default async function DigitalProductPortfolioPage({ params }: Props) {
  const { locale } = await params;
  const content = copy[locale === "fr" ? "fr" : "en"];
  return (
    <div className="page-shell">
      <JsonLd
        data={[
          webPageJsonLd(locale, path, content.title, content.description),
          breadcrumbJsonLd(locale, [
            { name: locale === "fr" ? "Accueil" : "Home", path: "" },
            { name: "Portfolio", path: "/services/portfolio" },
            { name: content.label },
          ]),
        ]}
      />
      <div
        className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
        aria-hidden
      />
      <div className="container mx-auto px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <Suspense fallback={null}>
          <DigitalCreations initialCategory="platform" />
        </Suspense>
      </div>
    </div>
  );
}
