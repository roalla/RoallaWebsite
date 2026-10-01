import type { Metadata } from "next";
import CommunicationsValueBrief from "@/components/tools/CommunicationsValueBrief";
import { buildPageMetadata } from "@/lib/page-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/tools/communications-value-brief",
    title:
      locale === "fr"
        ? "Fiche de valeur communications | ROALLA"
        : "Communications Value Brief | ROALLA",
    description:
      locale === "fr"
        ? "Évaluez le coût du téléphone traditionnel ou la valeur de vos outils actuels, puis obtenez une direction d’engagement sans pitch fournisseur."
        : "Estimate the cost of legacy phone systems or the value of your current stack, then get an engagement path without a vendor pitch.",
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
            {fr ? "Outil de planification gratuit" : "Free planning tool"}
          </p>
          <h1 className="mt-4 text-4xl font-serif font-bold text-slate-950 md:text-5xl">
            {fr
              ? "Voyez la valeur de moderniser vos appels et votre contact client."
              : "See the value of modernizing calling and customer contact."}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {fr
              ? "Six étapes guidées. Vous obtiendrez une occasion indicative en dollars, des priorités de décision et un PDF de marque—sans nommer de fournisseurs."
              : "Six guided steps. You will get an indicative dollar opportunity, decision priorities, and a branded PDF—without naming providers."}
          </p>
        </header>
        <main className="mx-auto mt-10 max-w-6xl">
          <CommunicationsValueBrief locale={locale} />
        </main>
      </div>
    </div>
  );
}
