import React from "react";
import type { Metadata } from "next";
import { CheckCircle2, SearchCheck } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import WebsiteVisibilitySnapshot from "@/components/visibility/WebsiteVisibilitySnapshot";
import { buildPageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };

const content = {
  en: {
    metadataTitle: "Free Website Visibility Snapshot | ROALLA",
    metadataDescription: "Check a public website page for performance, accessibility, best-practice, and technical SEO signals—then see what the score does not explain.",
    eyebrow: "Free Website Visibility Snapshot",
    title: "See the technical signals shaping your website experience.",
    subtitle: "Get an immediate mobile or desktop snapshot using Google PageSpeed Insights data. No email gate. No ranking promises. Just a useful starting point.",
    whatTitle: "What this snapshot checks",
    what: ["Performance and Core Web Vitals signals", "Automated accessibility checks", "Browser best-practice checks", "Technical SEO foundations", "Prioritized performance opportunities"],
    limitsTitle: "What still needs human judgment",
    limits: ["Whether your offer and content match customer intent", "Local discovery and competitive position", "Entity clarity and AI-answer readability", "Trust, messaging, navigation, and conversion quality", "A practical roadmap tied to business value"],
    privacy: "ROALLA sends the public page URL to Google PageSpeed Insights to run the snapshot. Query parameters are removed, results are cached briefly, and this tool does not ask for or store your email address.",
  },
  fr: {
    metadataTitle: "Aperçu gratuit de visibilité Web | ROALLA",
    metadataDescription: "Vérifiez la performance, l’accessibilité, les bonnes pratiques et les signaux SEO techniques d’une page Web publique—puis découvrez ce que le score n’explique pas.",
    eyebrow: "Aperçu gratuit de visibilité Web",
    title: "Voyez les signaux techniques qui façonnent l’expérience de votre site.",
    subtitle: "Obtenez un aperçu mobile ou ordinateur immédiat à partir des données de Google PageSpeed Insights. Aucun courriel requis. Aucune promesse de classement. Un point de départ utile.",
    whatTitle: "Ce que cet aperçu vérifie",
    what: ["Signaux de performance et Core Web Vitals", "Vérifications automatisées d’accessibilité", "Bonnes pratiques du navigateur", "Fondations du SEO technique", "Possibilités de performance priorisées"],
    limitsTitle: "Ce qui exige encore un jugement humain",
    limits: ["L’adéquation de votre offre et de votre contenu à l’intention client", "La découverte locale et la position concurrentielle", "La clarté de l’entité et la lisibilité dans les réponses IA", "La confiance, le message, la navigation et la conversion", "Une feuille de route pratique liée à la valeur d’affaires"],
    privacy: "ROALLA transmet l’URL de la page publique à Google PageSpeed Insights pour produire l’aperçu. Les paramètres de requête sont retirés, les résultats sont brièvement mis en cache et cet outil ne demande ni ne conserve votre adresse courriel.",
  },
} as const;

function contentFor(locale: string) {
  return content[locale === "fr" ? "fr" : "en"];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = contentFor(locale);
  return buildPageMetadata({
    locale,
    path: "/tools/website-visibility-snapshot",
    title: page.metadataTitle,
    description: page.metadataDescription,
  });
}

export default async function WebsiteVisibilitySnapshotPage({ params }: Props) {
  const { locale } = await params;
  const page = contentFor(locale);
  const path = "/tools/website-visibility-snapshot";

  return (
    <div className="page-shell">
      <JsonLd data={[
        breadcrumbJsonLd(locale, [
          { name: locale === "fr" ? "Accueil" : "Home", path: "" },
          { name: page.eyebrow },
        ]),
        webPageJsonLd(locale, path, page.metadataTitle, page.metadataDescription),
      ]} />
      <main className="container mx-auto px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-10 text-white shadow-xl sm:px-10 lg:py-14">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden />
          <div className="relative max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">{page.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-serif font-bold leading-tight md:text-5xl">{page.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{page.subtitle}</p>
          </div>
        </header>

        <section className="relative z-10 mx-auto -mt-5 max-w-6xl px-2 sm:px-5">
          <WebsiteVisibilitySnapshot locale={locale} />
        </section>

        <section className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-2">
          {[
            [page.whatTitle, page.what, "bg-primary/[0.04] border-primary/20"],
            [page.limitsTitle, page.limits, "bg-slate-50 border-slate-200"],
          ].map(([title, items, tone]) => (
            <article key={String(title)} className={`rounded-2xl border p-6 sm:p-8 ${tone}`}>
              <SearchCheck className="h-7 w-7 text-primary-dark" aria-hidden />
              <h2 className="mt-4 text-2xl font-serif font-bold text-slate-950">{title}</h2>
              <ul className="mt-5 space-y-3">
                {(items as readonly string[]).map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
        <p className="mx-auto mt-8 max-w-4xl text-center text-xs leading-5 text-slate-500">{page.privacy}</p>
      </main>
    </div>
  );
}
