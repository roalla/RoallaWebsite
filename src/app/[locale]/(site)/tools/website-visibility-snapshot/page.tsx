import React from "react";
import type { Metadata } from "next";
import { CheckCircle2, SearchCheck } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import WebsiteVisibilitySnapshot from "@/components/visibility/WebsiteVisibilitySnapshot";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ url?: string | string[] }>;
};

const content = {
  en: {
    metadataTitle: "Free Website Visibility Snapshot | ROALLA",
    metadataDescription: "See how your website performs on phones and computers, and learn which improvements could create a better visitor experience.",
    eyebrow: "Free Website Visibility Snapshot",
    title: "See how well your website works for your visitors.",
    subtitle: "Check your website on phones and computers. You will see clear scores, useful explanations, and the improvements worth reviewing first. No email address is required.",
    whatTitle: "What we check",
    what: ["Page speed and responsiveness", "Ease of use for people with different needs", "Website reliability and security", "How well search engines can understand the page", "The most useful performance improvements"],
    contentTitle: "A good score is only part of a successful website",
    contentBody:
      "A fast, accessible website creates a strong foundation. Your offer, message, proof, and calls to action also need to help visitors understand your value and feel confident contacting you.",
    limitsTitle: "What deserves a personal review",
    limits: [
      "Whether visitors quickly understand your offer",
      "Whether the content answers the right customer questions",
      "How your business compares with local competitors",
      "Whether your expertise is clear to search and answer tools",
      "How well the site builds trust and encourages inquiries",
      "Which improvements will create the most business value",
    ],
    privacy: "ROALLA sends the public page URL to Google PageSpeed Insights to run the snapshot. Query parameters are removed, results are cached briefly, and this tool does not ask for or store your email address.",
  },
  fr: {
    metadataTitle: "Aperçu gratuit de visibilité Web | ROALLA",
    metadataDescription: "Voyez comment votre site fonctionne sur téléphone et ordinateur, puis découvrez les améliorations qui pourraient bonifier l’expérience des visiteurs.",
    eyebrow: "Aperçu gratuit de visibilité Web",
    title: "Voyez si votre site répond bien aux besoins de vos visiteurs.",
    subtitle: "Vérifiez votre site sur téléphone et ordinateur. Vous obtiendrez des scores clairs, des explications utiles et les améliorations à examiner en premier. Aucune adresse courriel requise.",
    whatTitle: "Ce que nous vérifions",
    what: ["La vitesse et la réactivité de la page", "La facilité d’utilisation pour les personnes ayant différents besoins", "La fiabilité et la sécurité du site", "La capacité des moteurs de recherche à comprendre la page", "Les améliorations de rendement les plus utiles"],
    contentTitle: "Un bon score ne suffit pas pour assurer le succès d’un site",
    contentBody:
      "Un site rapide et accessible constitue une excellente base. Votre offre, votre message, vos preuves et vos appels à l’action doivent aussi aider les visiteurs à comprendre votre valeur et à communiquer avec vous en toute confiance.",
    limitsTitle: "Ce qui mérite un examen personnalisé",
    limits: [
      "La rapidité avec laquelle les visiteurs comprennent votre offre",
      "La capacité du contenu à répondre aux bonnes questions",
      "La position de votre entreprise face aux concurrents locaux",
      "La clarté de votre expertise pour les outils de recherche et de réponse",
      "La capacité du site à inspirer confiance et à générer des demandes",
      "Les améliorations qui créeront le plus de valeur pour votre entreprise",
    ],
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

export default async function WebsiteVisibilitySnapshotPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = searchParams ? await searchParams : undefined;
  const rawUrl = typeof query?.url === "string" ? query.url : "";
  const initialUrl = rawUrl.length <= 2048 ? rawUrl : "";
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
            <h1 className="mt-4 text-4xl font-serif font-bold leading-tight text-white md:text-5xl">{page.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{page.subtitle}</p>
          </div>
        </header>

        <section className="relative z-10 mx-auto -mt-5 max-w-6xl px-2 sm:px-5">
          <WebsiteVisibilitySnapshot locale={locale} initialUrl={initialUrl} />
        </section>

        <aside className="mx-auto mt-12 max-w-6xl rounded-2xl border border-white/10 bg-slate-950 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
            {locale === "fr" ? "Le score ne dit pas tout" : "The score is only part of the story"}
          </p>
          <h2 className="mt-3 text-2xl font-serif font-bold text-white">{page.contentTitle}</h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-200">{page.contentBody}</p>
        </aside>

        <section className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-2">
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
        <aside className="mx-auto mt-10 max-w-4xl rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 text-center sm:p-8">
          <h2 className="text-2xl font-serif font-bold text-slate-950">
            {locale === "fr" ? "Complétez le portrait avec votre présence sociale." : "Complete the picture with your social presence."}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-700">
            {locale === "fr"
              ? "Vérifiez si vos profils, vos aperçus de partage et vos signaux de marque sont faciles à découvrir depuis votre site."
              : "Check whether your profiles, sharing previews, and brand signals are easy to discover from your website."}
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/tools/social-presence-snapshot" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">
              {locale === "fr" ? "Vérifier la présence sociale" : "Check social presence"}
            </Link>
            <Link href="/tools/social-profile-checklist" className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-primary/30 bg-white px-6 py-3 font-semibold text-primary-dark hover:bg-primary/[0.06]">
              {locale === "fr" ? "Liste de profils sociaux" : "Social profile checklist"}
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}
