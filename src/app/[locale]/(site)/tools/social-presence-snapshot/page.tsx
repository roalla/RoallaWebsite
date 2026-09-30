import React from "react";
import type { Metadata } from "next";
import { CheckCircle2, Share2 } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import SocialPresenceSnapshot from "@/components/visibility/SocialPresenceSnapshot";
import { buildPageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ url?: string | string[] }>;
};

const content = {
  en: {
    metadataTitle: "Free Social Presence Setup Snapshot | ROALLA",
    metadataDescription: "Check whether your website makes social profiles, brand identity, and sharing previews easy to discover and trust.",
    eyebrow: "Free Social Presence Snapshot",
    title: "See whether your website is ready to support a credible social presence.",
    subtitle: "Check profile discovery, sharing previews, organization schema, and identity signals in seconds. No account connection. No follower-count theatre. No email gate.",
    checksTitle: "What this public snapshot checks",
    checks: ["Social profiles linked from the website", "Organization sameAs structured data", "Open Graph and sharing-card metadata", "Organization name and logo schema", "Page identity and canonical signals"],
    notTitle: "What requires connected accounts and human judgment",
    not: ["Profile ownership and administrative access", "Publishing quality and brand voice", "Audience fit, reach, and engagement", "Response practices and community management", "Channel strategy, measurement, and conversion"],
    privacy: "ROALLA downloads only the submitted public HTTPS page. The tool does not sign into or scrape social platforms, does not ask for account credentials, and does not store an email address.",
  },
  fr: {
    metadataTitle: "Aperçu gratuit de configuration sociale | ROALLA",
    metadataDescription: "Vérifiez si votre site rend vos profils sociaux, votre identité de marque et vos aperçus de partage faciles à découvrir et à reconnaître.",
    eyebrow: "Aperçu gratuit de présence sociale",
    title: "Voyez si votre site est prêt à soutenir une présence sociale crédible.",
    subtitle: "Vérifiez la découverte des profils, les aperçus de partage, le schéma de l’organisation et les signaux d’identité en quelques secondes. Aucun compte à connecter. Aucun courriel requis.",
    checksTitle: "Ce que cet aperçu public vérifie",
    checks: ["Profils sociaux liés depuis le site", "Données structurées sameAs de l’organisation", "Métadonnées Open Graph et cartes sociales", "Nom et logo de l’organisation dans le schéma", "Identité de la page et signaux canoniques"],
    notTitle: "Ce qui exige des comptes connectés et un jugement humain",
    not: ["Propriété des profils et accès administratif", "Qualité éditoriale et voix de marque", "Adéquation de l’audience, portée et engagement", "Pratiques de réponse et gestion de communauté", "Stratégie des canaux, mesure et conversion"],
    privacy: "ROALLA télécharge uniquement la page HTTPS publique soumise. L’outil ne se connecte pas aux plateformes sociales, ne les extrait pas, ne demande aucun identifiant et ne conserve aucune adresse courriel.",
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
    path: "/tools/social-presence-snapshot",
    title: page.metadataTitle,
    description: page.metadataDescription,
  });
}

export default async function SocialPresenceSnapshotPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = searchParams ? await searchParams : undefined;
  const rawUrl = typeof query?.url === "string" ? query.url : "";
  const initialUrl = rawUrl.length <= 2048 ? rawUrl : "";
  const page = contentFor(locale);
  const path = "/tools/social-presence-snapshot";
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
            <h1 className="mt-4 text-4xl font-serif font-bold leading-tight text-white md:text-5xl">{page.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{page.subtitle}</p>
          </div>
        </header>

        <section className="relative z-10 mx-auto -mt-5 max-w-6xl px-2 sm:px-5">
          <SocialPresenceSnapshot locale={locale} initialUrl={initialUrl} />
        </section>

        <section className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-2">
          {[
            [page.checksTitle, page.checks, "bg-primary/[0.04] border-primary/20"],
            [page.notTitle, page.not, "bg-slate-50 border-slate-200"],
          ].map(([title, items, tone]) => (
            <article key={String(title)} className={`rounded-2xl border p-6 sm:p-8 ${tone}`}>
              <Share2 className="h-7 w-7 text-primary-dark" aria-hidden />
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
