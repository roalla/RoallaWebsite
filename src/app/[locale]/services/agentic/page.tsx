import type { Metadata } from "next";
import AgenticLanding from "@/components/AgenticLanding";
import JsonLd from "@/components/JsonLd";
import { agenticServiceContent } from "@/lib/agentic-service-content";
import { buildPageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, servicePageJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };
const path = "/services/agentic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = agenticServiceContent[locale === "fr" ? "fr" : "en"];
  return buildPageMetadata({ locale, path, title: content.metadataTitle, description: content.metadataDescription });
}

export default async function AgenticPage({ params }: Props) {
  const { locale } = await params;
  const content = agenticServiceContent[locale === "fr" ? "fr" : "en"];
  return (
    <div className="page-shell">
      <JsonLd data={[
        webPageJsonLd(locale, path, content.eyebrow, content.metadataDescription),
        ...servicePageJsonLd({
          locale,
          path,
          name: "ROALLA Agentic",
          description: content.metadataDescription,
          serviceType: locale === "fr" ? "Conseil en IA agentique et développement d’agents IA" : "Agentic AI Consulting and AI Agent Development",
          offers: content.capabilities.map(({ title: name, description }) => ({ name, description })),
          faqs: content.faqs,
        }),
        breadcrumbJsonLd(locale, [
          { name: locale === "fr" ? "Accueil" : "Home", path: "" },
          { name: locale === "fr" ? "Solutions technologiques" : "Technology Solutions", path: "/services/digital" },
          { name: "ROALLA Agentic" },
        ]),
      ]} />
      <AgenticLanding locale={locale} content={content} />
    </div>
  );
}
