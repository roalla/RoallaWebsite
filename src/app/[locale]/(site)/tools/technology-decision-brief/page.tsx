import type { Metadata } from "next";
import TechnologyDecisionBrief from "@/components/tools/TechnologyDecisionBrief";
import { buildPageMetadata } from "@/lib/page-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/tools/technology-decision-brief",
    title: locale === "fr" ? "Fiche de décision technologique | ROALLA" : "Technology Decision Brief | ROALLA",
    description:
      locale === "fr"
        ? "Clarifiez les exigences, les risques et les priorités avant de choisir une solution technologique."
        : "Clarify requirements, risks, and priorities before selecting a technology solution.",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const fr = locale === "fr";
  return (
    <div className="page-shell">
      <div className="container mx-auto px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-dark">
            {fr ? "Fiche gratuite" : "Free decision brief"}
          </p>
          <h1 className="mt-4 text-4xl font-serif font-bold text-slate-950 md:text-5xl">
            {fr
              ? "Prenez une décision technologique fondée sur vos besoins."
              : "Make a technology decision based on your needs."}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {fr
              ? "Choisissez votre contexte. Vous obtiendrez des priorités de décision, un processus adapté et un PDF de marque—avant de parler aux fournisseurs."
              : "Choose your context. You will get decision priorities, a tailored process, and a branded PDF—before you speak with providers."}
          </p>
        </header>
        <main className="mx-auto mt-10 max-w-6xl">
          <TechnologyDecisionBrief locale={locale} />
        </main>
      </div>
    </div>
  );
}
