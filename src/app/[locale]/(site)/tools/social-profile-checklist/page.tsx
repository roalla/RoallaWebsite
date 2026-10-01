import React from "react";
import type { Metadata } from "next";
import { CheckCircle2, Share2 } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import SocialProfileChecklist from "@/components/visibility/SocialProfileChecklist";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };

const content = {
  en: {
    metadataTitle: "Social Profile Checklist (YouTube, LinkedIn, Instagram) | ROALLA",
    metadataDescription:
      "A practical checklist for keywords, captions, accessibility, and CTAs on YouTube, LinkedIn, and Instagram—paired with human content strategy for conversion.",
    eyebrow: "Free Social Profile Checklist",
    title: "Check YouTube, LinkedIn, and Instagram for keywords, accessibility, and conversion.",
    subtitle:
      "No account login required. Work through the checklist for the channels you use, score what still needs work, then pair it with a website destination people can trust.",
    whatTitle: "What this checklist covers",
    what: [
      "Offer clarity and buyer-language keywords",
      "Captions, alt text, and readable profile copy",
      "CTAs that match your website destination",
      "Platform-specific checks for YouTube, LinkedIn, and Instagram",
      "A simple 1–5 human score—not an AI ranking promise",
    ],
    limitsTitle: "What this checklist does not do",
    limits: [
      "It does not sign in to your social accounts",
      "It does not crawl private or login-walled profile data",
      "It does not replace PageSpeed or website technical scoring",
      "It does not replace content strategy for sales conversion and adoption",
    ],
  },
  fr: {
    metadataTitle: "Liste de vérification des profils sociaux | ROALLA",
    metadataDescription:
      "Une liste pratique pour les mots-clés, sous-titres, accessibilité et appels à l’action sur YouTube, LinkedIn et Instagram—avec une stratégie de contenu humaine pour la conversion.",
    eyebrow: "Liste gratuite de profils sociaux",
    title: "Vérifiez YouTube, LinkedIn et Instagram pour les mots-clés, l’accessibilité et la conversion.",
    subtitle:
      "Aucune connexion de compte requise. Parcourez la liste pour les canaux que vous utilisez, notez ce qui reste à améliorer, puis associez-la à une destination Web digne de confiance.",
    whatTitle: "Ce que couvre cette liste",
    what: [
      "Clarté de l’offre et mots-clés du langage client",
      "Sous-titres, texte alternatif et textes de profil lisibles",
      "Appels à l’action alignés sur la destination de votre site",
      "Vérifications spécifiques à YouTube, LinkedIn et Instagram",
      "Un score humain simple de 1 à 5—pas une promesse de classement IA",
    ],
    limitsTitle: "Ce que cette liste ne fait pas",
    limits: [
      "Elle ne se connecte pas à vos comptes sociaux",
      "Elle n’analyse pas les données privées ou derrière connexion",
      "Elle ne remplace pas PageSpeed ni le score technique du site",
      "Elle ne remplace pas la stratégie de contenu pour la conversion et l’adoption",
    ],
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
    path: "/tools/social-profile-checklist",
    title: page.metadataTitle,
    description: page.metadataDescription,
  });
}

export default async function SocialProfileChecklistPage({ params }: Props) {
  const { locale } = await params;
  const page = contentFor(locale);
  const path = "/tools/social-profile-checklist";

  return (
    <div className="page-shell">
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: locale === "fr" ? "Accueil" : "Home", path: "" },
            { name: page.eyebrow },
          ]),
          webPageJsonLd(locale, path, page.metadataTitle, page.metadataDescription),
        ]}
      />
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
          <SocialProfileChecklist locale={locale} />
        </section>

        <section className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-2">
          {[
            [page.whatTitle, page.what, "bg-primary/[0.04] border-primary/20"],
            [page.limitsTitle, page.limits, "bg-slate-50 border-slate-200"],
          ].map(([title, items, tone]) => (
            <article key={String(title)} className={`rounded-2xl border p-6 sm:p-8 ${tone}`}>
              <Share2 className="h-7 w-7 text-primary-dark" aria-hidden />
              <h2 className="mt-4 text-2xl font-serif font-bold text-slate-950">{title}</h2>
              <ul className="mt-5 space-y-3">
                {(items as readonly string[]).map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <aside className="mx-auto mt-10 max-w-4xl rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 text-center sm:p-8">
          <h2 className="text-2xl font-serif font-bold text-slate-950">
            {locale === "fr" ? "Commencez aussi par la configuration sur votre site." : "Also start with the setup on your website."}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-700">
            {locale === "fr"
              ? "Vérifiez si vos profils et aperçus de partage sont déjà liés depuis votre site, puis utilisez cette liste sur chaque canal."
              : "Check whether profiles and sharing previews are already linked from your website, then use this checklist on each channel."}
          </p>
          <Link
            href="/tools/social-presence-snapshot"
            className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
          >
            {locale === "fr" ? "Vérifier la présence sociale" : "Check social presence"}
          </Link>
        </aside>
      </main>
    </div>
  );
}
