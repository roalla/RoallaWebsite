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
    metadataDescription: "See how your website performs for visitors, search engines, and social sharing, with clear suggestions on what to improve first.",
    eyebrow: "Free Digital Presence Snapshot",
    title: "See what may be holding your website back.",
    subtitle: "Enter your website address to see how it performs on phones and computers, how well it supports social sharing, and where improvements could make the biggest difference.",
    includesTitle: "What you will learn",
    includes: ["Lighthouse lab results and available real-visitor data for the landing page", "How easy that page is for people to use", "How well search engines can understand that page", "Whether social profiles and sharing previews are set up correctly on that page", "How ready the page is for an assistant to describe the business", "Whether a mailbox or phone number is in that page’s source, and whether a form is offered instead", "The public host, platform, analytics tags, and protection service visible for that page", "Priority actions, a competitor comparison, and a plan you can save"],
    honestTitle: "A clear and useful starting point",
    honest: ["Your website and social results are shown separately", "You can use the tool without connecting a social account", "No email address is required to see your results", "We explain what each score means in plain language", "You can save the report or ask ROALLA for personal guidance"],
    privacy: "We check the public landing page for the address you enter. This is not a review of every page on the website. Google PageSpeed Insights measures that page on a phone and on a computer, and we review the same page for social sharing and for whether a mailbox, phone number, or form appears in the HTML. The contact check does not display or store that address or number. The setup check does not display or store analytics tracking IDs. Previous results used for before-and-after comparisons stay in your browser. No email address or social media password is requested or stored unless you choose to request a personal review.",
  },
  fr: {
    metadataTitle: "Aperçu gratuit de présence numérique | ROALLA",
    metadataDescription: "Voyez comment votre site fonctionne pour les visiteurs, les moteurs de recherche et le partage social, avec des conseils clairs sur les priorités.",
    eyebrow: "Aperçu gratuit de présence numérique",
    title: "Découvrez ce qui peut freiner votre site Web.",
    subtitle: "Entrez l’adresse de votre site pour voir son fonctionnement sur téléphone et ordinateur, sa préparation au partage social et les améliorations qui pourraient faire la plus grande différence.",
    includesTitle: "Ce que vous découvrirez",
    includes: ["Les résultats de laboratoire Lighthouse et les données disponibles sur les visiteurs réels pour la page d’arrivée", "La facilité d’utilisation de cette page", "La capacité des moteurs de recherche à comprendre cette page", "La qualité des profils et des aperçus de partage sur cette page", "La préparation de la page pour qu’un assistant décrive l’entreprise", "Si une adresse courriel ou un numéro de téléphone est dans le code de cette page, et si un formulaire est offert à la place", "L’hébergeur public, la plateforme, les balises d’analytique et le service de protection visibles pour cette page", "Les actions prioritaires, une comparaison et un plan à enregistrer"],
    honestTitle: "Un point de départ clair et utile",
    honest: ["Les résultats du site et des réseaux sociaux sont présentés séparément", "Aucun compte social ne doit être connecté", "Aucune adresse courriel n’est requise pour voir les résultats", "Chaque score est expliqué dans un langage simple", "Vous pouvez enregistrer le rapport ou demander des conseils personnalisés à ROALLA"],
    privacy: "Nous vérifions la page d’arrivée publique de l’adresse que vous entrez. Il ne s’agit pas d’une revue de chaque page du site. Google PageSpeed Insights mesure cette page sur un téléphone et sur un ordinateur, et nous examinons la même page pour le partage social et pour savoir si une adresse courriel, un numéro de téléphone ou un formulaire apparaît dans le HTML. La vérification des coordonnées n’affiche ni ne conserve cette adresse ou ce numéro. La vérification de l’organisation n’affiche ni ne conserve les identifiants de suivi analytique. Les résultats précédents utilisés pour les comparaisons restent dans votre navigateur. Aucune adresse courriel ni aucun mot de passe de réseau social n’est demandé ou conservé, sauf si vous choisissez de demander un examen personnalisé.",
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
