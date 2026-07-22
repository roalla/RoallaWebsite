import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import OutcomeServiceLanding from "@/components/services/OutcomeServiceLanding";
import { buildPageMetadata } from "@/lib/page-metadata";
import { serviceLandingContent } from "@/lib/service-landing-content";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };
const path = "/services/automation";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = serviceLandingContent[locale === "fr" ? "fr" : "en"].automation;
  return buildPageMetadata({
    locale,
    path,
    title: c.metadataTitle,
    description: c.metadataDescription,
  });
}
export default async function Page({ params }: Props) {
  const { locale } = await params;
  const c = serviceLandingContent[locale === "fr" ? "fr" : "en"].automation;
  return (
    <div className="page-shell">
      <JsonLd
        data={[
          webPageJsonLd(locale, path, c.title, c.metadataDescription),
          breadcrumbJsonLd(locale, [
            { name: locale === "fr" ? "Accueil" : "Home", path: "" },
            {
              name:
                locale === "fr"
                  ? "Accompagnement numérique"
                  : "Digital Enablement",
              path: "/services/digital",
            },
            { name: c.title },
          ]),
        ]}
      />
      <OutcomeServiceLanding locale={locale} content={c} />
    </div>
  );
}
