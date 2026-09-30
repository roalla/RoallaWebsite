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
    metadataTitle: "Free Social Media Setup Check | ROALLA",
    metadataDescription: "See whether visitors can find your social profiles and whether your website looks professional when shared on social media.",
    eyebrow: "Free Social Presence Snapshot",
    title: "Make a stronger first impression on social media.",
    subtitle: "See whether people can find your social profiles and whether your website creates a clear, professional preview when someone shares it. No account connection or email address is required.",
    checksTitle: "What we check",
    checks: ["Links to your social profiles", "Connections between your website and social accounts", "The image and message shown when your page is shared", "Your business name and logo information", "Your page title, description, and preferred address"],
    notTitle: "What deserves a personal review",
    not: ["Whether your profiles reflect your brand", "The quality and consistency of your posts", "Whether you are reaching the right people", "How well your team responds to customers", "Which social channels are most valuable for your business"],
    privacy: "We check only the public website page you enter. We do not sign in to social platforms, request account passwords, or store an email address.",
  },
  fr: {
    metadataTitle: "Vérification gratuite des réseaux sociaux | ROALLA",
    metadataDescription: "Voyez si les visiteurs trouvent vos profils sociaux et si votre site paraît professionnel lorsqu’il est partagé sur les réseaux sociaux.",
    eyebrow: "Aperçu gratuit de présence sociale",
    title: "Faites une meilleure première impression sur les réseaux sociaux.",
    subtitle: "Voyez si les gens peuvent trouver vos profils et si votre site crée un aperçu clair et professionnel lorsqu’il est partagé. Aucun compte à connecter ni aucune adresse courriel requise.",
    checksTitle: "Ce que nous vérifions",
    checks: ["Les liens vers vos profils sociaux", "Les liens entre votre site et vos comptes sociaux", "L’image et le message affichés lors du partage", "Le nom et le logo de votre entreprise", "Le titre, la description et l’adresse principale de votre page"],
    notTitle: "Ce qui mérite un examen personnalisé",
    not: ["La qualité de vos profils et leur cohérence avec votre marque", "La qualité et la régularité de vos publications", "Votre capacité à joindre les bonnes personnes", "La façon dont votre équipe répond aux clients", "Les réseaux sociaux les plus utiles pour votre entreprise"],
    privacy: "Nous vérifions uniquement la page publique que vous entrez. Nous ne nous connectons pas aux plateformes sociales, ne demandons aucun mot de passe et ne conservons aucune adresse courriel.",
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
