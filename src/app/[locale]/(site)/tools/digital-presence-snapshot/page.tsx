import React from "react";
import type { Metadata } from "next";
import { CheckCircle2, SearchCheck } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import DigitalPresenceSnapshot from "@/components/visibility/DigitalPresenceSnapshot";
import { buildPageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ url?: string | string[] }>;
};

const content = {
  en: {
    metadataTitle: "Free Digital Presence Snapshot | ROALLA",
    metadataDescription: "Check technical website visibility and social-presence setup together, then receive three prioritized next actions.",
    eyebrow: "Free Digital Presence Snapshot",
    title: "One website. Two useful lenses. A clearer next move.",
    subtitle: "Run mobile and desktop technical checks alongside a social-presence setup review. See separate scores, the three largest automated gaps, and what still requires human judgment.",
    includesTitle: "Included in one snapshot",
    includes: ["Mobile and desktop technical visibility", "Performance, accessibility, best practices, and technical SEO", "Social-profile discovery and structured identity", "Open Graph and social-card sharing readiness", "Three prioritized automated actions"],
    honestTitle: "Designed to inform—not manufacture certainty",
    honest: ["Technical and social scores remain separate", "No promises about rankings, reach, or engagement", "No social-account credentials or email required", "Strategy, content quality, audience fit, and conversion receive explicit human-review treatment", "Detailed tools remain available for deeper inspection"],
    privacy: "ROALLA sends the public page URL to Google PageSpeed Insights for technical checks and downloads the same public HTTPS page for the social-setup review. Query parameters are removed, results are cached briefly, and no email address is required or stored.",
  },
  fr: {
    metadataTitle: "Aperçu gratuit de présence numérique | ROALLA",
    metadataDescription: "Vérifiez ensemble la visibilité technique du site et la configuration de la présence sociale, puis obtenez trois prochaines actions priorisées.",
    eyebrow: "Aperçu gratuit de présence numérique",
    title: "Un site. Deux angles utiles. Une prochaine étape plus claire.",
    subtitle: "Lancez les vérifications techniques mobile et ordinateur avec un examen de la configuration sociale. Voyez des scores séparés, les trois plus grands écarts automatisés et ce qui exige encore un jugement humain.",
    includesTitle: "Inclus dans un seul aperçu",
    includes: ["Visibilité technique mobile et ordinateur", "Performance, accessibilité, bonnes pratiques et SEO technique", "Découverte des profils et identité structurée", "Préparation Open Graph et cartes sociales", "Trois actions automatisées priorisées"],
    honestTitle: "Conçu pour informer—pas pour fabriquer une certitude",
    honest: ["Les scores techniques et sociaux restent séparés", "Aucune promesse de classement, de portée ou d’engagement", "Aucun identifiant social ni courriel requis", "La stratégie, le contenu, l’audience et la conversion sont explicitement réservés à un examen humain", "Les outils détaillés restent disponibles pour approfondir"],
    privacy: "ROALLA transmet l’URL publique à Google PageSpeed Insights pour les vérifications techniques et télécharge la même page HTTPS publique pour l’examen social. Les paramètres de requête sont retirés, les résultats sont brièvement mis en cache et aucune adresse courriel n’est requise ou conservée.",
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
    path: "/tools/digital-presence-snapshot",
    title: page.metadataTitle,
    description: page.metadataDescription,
  });
}

export default async function DigitalPresenceSnapshotPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = searchParams ? await searchParams : undefined;
  const rawUrl = typeof query?.url === "string" ? query.url : "";
  const initialUrl = rawUrl.length <= 2048 ? rawUrl : "";
  const page = contentFor(locale);
  const path = "/tools/digital-presence-snapshot";

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
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-10 text-white shadow-xl sm:px-10 lg:py-14 print:bg-white print:text-slate-950 print:shadow-none">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl print:hidden" aria-hidden />
          <div className="relative max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light print:text-primary-dark">{page.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-serif font-bold leading-tight text-white md:text-5xl print:text-slate-950">{page.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300 print:text-slate-700">{page.subtitle}</p>
          </div>
        </header>

        <section className="relative z-10 mx-auto -mt-5 max-w-6xl px-2 sm:px-5 print:mt-8">
          <DigitalPresenceSnapshot locale={locale} initialUrl={initialUrl} />
        </section>

        <section className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-2 print:hidden">
          {[
            [page.includesTitle, page.includes, "bg-primary/[0.04] border-primary/20"],
            [page.honestTitle, page.honest, "bg-slate-50 border-slate-200"],
          ].map(([title, items, tone]) => (
            <article key={String(title)} className={`rounded-2xl border p-6 sm:p-8 ${tone}`}>
              <SearchCheck className="h-7 w-7 text-primary-dark" aria-hidden />
              <h2 className="mt-4 text-2xl font-serif font-bold text-slate-950">{title}</h2>
              <ul className="mt-5 space-y-3">
                {(items as readonly string[]).map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
        <p className="mx-auto mt-8 max-w-4xl text-center text-xs leading-5 text-slate-500 print:hidden">{page.privacy}</p>
      </main>
    </div>
  );
}
