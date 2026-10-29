import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import OutcomeServiceLanding from "@/components/services/OutcomeServiceLanding";
import { buildPageMetadata } from "@/lib/page-metadata";
import { securityServiceContent } from "@/lib/security-service-content";
import { breadcrumbJsonLd, servicePageJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };
const path = "/services/security-risk-compliance";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = securityServiceContent[locale === "fr" ? "fr" : "en"];
  return buildPageMetadata({ locale, path, title: content.metadataTitle, description: content.metadataDescription });
}

export default async function SecurityRiskCompliancePage({ params }: Props) {
  const { locale } = await params;
  const language = locale === "fr" ? "fr" : "en";
  const content = securityServiceContent[language];

  return (
    <div className="page-shell">
      <JsonLd data={[
        webPageJsonLd(language, path, content.title, content.metadataDescription),
        ...servicePageJsonLd({
          locale: language,
          path,
          name: content.title,
          description: content.metadataDescription,
          serviceType: language === "fr" ? "Conseil en sécurité, risque et conformité" : "Security, Risk and Compliance Advisory",
          offers: content.packages.map((offer) => ({ name: offer.name, description: offer.description })),
          faqs: content.faqs.map(([question, answer]) => ({ question, answer })),
        }),
        breadcrumbJsonLd(language, [
          { name: language === "fr" ? "Accueil" : "Home", path: "" },
          { name: language === "fr" ? "Résultats d’affaires" : "Business outcomes", path: "/solutions" },
          { name: language === "fr" ? "Sécurité, risque et conformité" : "Security, Risk & Compliance" },
        ]),
      ]} />
      <OutcomeServiceLanding locale={language} content={content} />
    </div>
  );
}
