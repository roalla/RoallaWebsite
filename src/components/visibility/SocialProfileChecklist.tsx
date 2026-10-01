"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ClipboardCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";

type Item = { id: string; label: string };
type Section = { id: string; title: string; intro?: string; items: Item[] };

const copy = {
  en: {
    sharedTitle: "Shared across YouTube, LinkedIn, and Instagram",
    youtubeTitle: "YouTube",
    youtubeIntro: "Strongest platform for keyword testing. Use search autocomplete and Studio analytics—not vanity subscriber counts.",
    linkedinTitle: "LinkedIn",
    linkedinIntro: "Best for B2B trust and on-platform search. Optimize headline and About for phrases buyers actually type.",
    instagramTitle: "Instagram",
    instagramIntro: "Useful for discovery and trust. Classic SEO is weak here—name, bio, captions, and alt text matter most.",
    scoreTitle: "Simple human score (1–5)",
    scoreIntro: "Rate each dimension. Anything at 3 or below on offer or CTA should be fixed before publishing more content.",
    dimensions: [
      { id: "offer", label: "Clarity of offer" },
      { id: "keywords", label: "Keyword fit to buyer language" },
      { id: "a11y", label: "Accessibility (captions / alt / readability)" },
      { id: "cta", label: "CTA strength" },
      { id: "proof", label: "Proof / trust" },
    ],
    doneLabel: "items checked",
    noteTitle: "Content strategy still drives conversion",
    noteBody:
      "These checks improve discoverability and accessibility. They do not replace a clear offer, message, and proof that help visitors convert and adopt what you sell. This is human work—not an AI score.",
    pairTitle: "Pair with your website destination",
    pairBody: "Social profiles should send people to a page you can measure. Run the digital presence snapshot on that page, then use this checklist on the profiles that create demand.",
    websiteCta: "Digital presence snapshot",
    socialCta: "Social setup check (from your website)",
    contactCta: "Ask ROALLA to review my profiles",
    contactBody: "A specialist can prioritize keywords, captions, accessibility, and CTAs for the channels you actually use.",
    sections: {
      shared: [
        { id: "s1", label: "One primary offer in the first line people see (who you help + outcome)" },
        { id: "s2", label: "One clear CTA (book, portal, site, or lead magnet)—same destination as the website" },
        { id: "s3", label: "Keywords buyers actually use (service + audience + place if local)—not jargon" },
        { id: "s4", label: "Proof nearby (clients, results, how it works, or a short case)" },
        { id: "s5", label: "Consistent name / brand across YouTube, LinkedIn, Instagram, and the site" },
        { id: "s6", label: "Contact path that works on mobile (link in bio / Featured / About)" },
        { id: "s7", label: "Accessibility: readable text, captions on video, meaningful alt text on images" },
      ],
      youtube: [
        { id: "y1", label: "Channel name + handle match the brand people search" },
        { id: "y2", label: "Channel description opens with offer + primary keywords + website" },
        { id: "y3", label: "Trailer / featured video states the offer in the first 15 seconds" },
        { id: "y4", label: "Video titles use search phrasing (problem/outcome), not only clever lines" },
        { id: "y5", label: "Descriptions: first 2 lines = offer + CTA; then keywords, chapters, links" },
        { id: "y6", label: "Accurate captions/subtitles (accessibility + discovery)" },
        { id: "y7", label: "Chapters / timestamps on longer videos" },
        { id: "y8", label: "Playlists grouped by buyer journey (awareness → consideration → proof)" },
        { id: "y9", label: "End screens / cards point to one next step" },
        { id: "y10", label: "Review Studio: impressions → CTR → average view duration" },
      ],
      linkedin: [
        { id: "l1", label: "Headline = role + who you help + outcome (keywords, not only job title)" },
        { id: "l2", label: "About: problem → approach → proof → CTA (scannable short paragraphs)" },
        { id: "l3", label: "Featured: best post, case, or booking/site link" },
        { id: "l4", label: "Experience bullets use buyer language, not internal titles only" },
        { id: "l5", label: "Company tagline + About use the same primary keywords as the website" },
        { id: "l6", label: "Company button CTA matches the real next step" },
        { id: "l7", label: "Banner/visual does not rely on tiny text" },
        { id: "l8", label: "Image alt text where available; avoid key claims only inside images" },
      ],
      instagram: [
        { id: "i1", label: "Name field includes a searchable phrase (not only a brand nickname)" },
        { id: "i2", label: "Bio: who / for whom / CTA link" },
        { id: "i3", label: "Link in bio = one primary destination (or a simple hub)" },
        { id: "i4", label: "Highlights labeled for buyers (Services, Proof, Start here)" },
        { id: "i5", label: "Captions: offer + context + CTA; hashtags secondary, not the strategy" },
        { id: "i6", label: "Alt text on posts (accessibility + slight discovery help)" },
        { id: "i7", label: "Reels: on-screen text + captions / spoken clarity" },
        { id: "i8", label: "Profile grid readable as a story of the offer, not only aesthetics" },
      ],
    },
  },
  fr: {
    sharedTitle: "Commun à YouTube, LinkedIn et Instagram",
    youtubeTitle: "YouTube",
    youtubeIntro: "La meilleure plateforme pour tester des mots-clés. Utilisez l’autocomplétion de recherche et Studio—pas seulement le nombre d’abonnés.",
    linkedinTitle: "LinkedIn",
    linkedinIntro: "Idéal pour la confiance B2B et la recherche sur la plateforme. Optimisez le titre et la section À propos avec les expressions que vos clients tapent vraiment.",
    instagramTitle: "Instagram",
    instagramIntro: "Utile pour la découverte et la confiance. Le SEO classique y est faible—le nom, la bio, les légendes et le texte alternatif comptent le plus.",
    scoreTitle: "Score humain simple (1–5)",
    scoreIntro: "Notez chaque dimension. Tout résultat de 3 ou moins pour l’offre ou l’appel à l’action doit être corrigé avant de publier plus de contenu.",
    dimensions: [
      { id: "offer", label: "Clarté de l’offre" },
      { id: "keywords", label: "Adéquation des mots-clés au langage client" },
      { id: "a11y", label: "Accessibilité (sous-titres / alt / lisibilité)" },
      { id: "cta", label: "Force de l’appel à l’action" },
      { id: "proof", label: "Preuves / confiance" },
    ],
    doneLabel: "éléments cochés",
    noteTitle: "La stratégie de contenu demeure essentielle à la conversion",
    noteBody:
      "Ces vérifications améliorent la découvrabilité et l’accessibilité. Elles ne remplacent pas une offre, un message et des preuves clairs qui aident les visiteurs à convertir et à adopter ce que vous vendez. C’est un travail humain—pas un score IA.",
    pairTitle: "Associez-le à la destination de votre site",
    pairBody: "Les profils sociaux devraient diriger les gens vers une page que vous pouvez mesurer. Lancez l’aperçu de présence numérique sur cette page, puis utilisez cette liste sur les profils qui créent la demande.",
    websiteCta: "Aperçu de présence numérique",
    socialCta: "Vérification sociale (depuis votre site)",
    contactCta: "Demander à ROALLA de revoir mes profils",
    contactBody: "Un spécialiste peut prioriser les mots-clés, les sous-titres, l’accessibilité et les appels à l’action pour les canaux que vous utilisez vraiment.",
    sections: {
      shared: [
        { id: "s1", label: "Une offre principale dès la première ligne (qui vous aidez + résultat)" },
        { id: "s2", label: "Un appel à l’action clair (réservation, portail, site)—même destination que le site" },
        { id: "s3", label: "Des mots-clés que vos clients utilisent vraiment (service + public + lieu si local)" },
        { id: "s4", label: "Des preuves à proximité (clients, résultats, fonctionnement, court cas)" },
        { id: "s5", label: "Nom / marque cohérents sur YouTube, LinkedIn, Instagram et le site" },
        { id: "s6", label: "Parcours de contact utilisable sur mobile (lien bio / En vedette / À propos)" },
        { id: "s7", label: "Accessibilité : texte lisible, sous-titres sur la vidéo, texte alternatif utile" },
      ],
      youtube: [
        { id: "y1", label: "Nom de chaîne + identifiant alignés sur la marque recherchée" },
        { id: "y2", label: "Description de chaîne : offre + mots-clés principaux + site" },
        { id: "y3", label: "Bande-annonce / vidéo en vedette : offre dans les 15 premières secondes" },
        { id: "y4", label: "Titres de vidéos en langage de recherche (problème/résultat)" },
        { id: "y5", label: "Descriptions : 2 premières lignes = offre + CTA; puis mots-clés, chapitres, liens" },
        { id: "y6", label: "Sous-titres exacts (accessibilité + découverte)" },
        { id: "y7", label: "Chapitres / horodatage sur les vidéos longues" },
        { id: "y8", label: "Listes de lecture selon le parcours d’achat" },
        { id: "y9", label: "Écrans de fin / cartes vers une seule prochaine étape" },
        { id: "y10", label: "Studio : impressions → CTR → durée de visionnement moyenne" },
      ],
      linkedin: [
        { id: "l1", label: "Titre = rôle + qui vous aidez + résultat" },
        { id: "l2", label: "À propos : problème → approche → preuves → CTA" },
        { id: "l3", label: "En vedette : meilleure publication, cas ou lien de prise de contact" },
        { id: "l4", label: "Expérience rédigée dans le langage des clients" },
        { id: "l5", label: "Page entreprise : slogan + À propos alignés sur les mots-clés du site" },
        { id: "l6", label: "Bouton CTA de la page entreprise = vraie prochaine étape" },
        { id: "l7", label: "Bannière sans texte trop petit" },
        { id: "l8", label: "Texte alternatif des images; éviter les messages clés seulement dans les images" },
      ],
      instagram: [
        { id: "i1", label: "Champ Nom avec une expression recherchable" },
        { id: "i2", label: "Bio : qui / pour qui / lien CTA" },
        { id: "i3", label: "Lien en bio = une destination principale" },
        { id: "i4", label: "Stories à la une étiquetées pour les clients (Services, Preuves, Commencer)" },
        { id: "i5", label: "Légendes : offre + contexte + CTA; hashtags secondaires" },
        { id: "i6", label: "Texte alternatif sur les publications" },
        { id: "i7", label: "Reels : texte à l’écran + sous-titres / clarté orale" },
        { id: "i8", label: "Grille lisible comme l’histoire de l’offre, pas seulement l’esthétique" },
      ],
    },
  },
} as const;

export default function SocialProfileChecklist({ locale }: { locale: string }) {
  const language = locale === "fr" ? "fr" : "en";
  const t = copy[language];
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [scores, setScores] = useState<Record<string, number>>({});

  const sections: Section[] = useMemo(
    () => [
      { id: "shared", title: t.sharedTitle, items: [...t.sections.shared] },
      { id: "youtube", title: t.youtubeTitle, intro: t.youtubeIntro, items: [...t.sections.youtube] },
      { id: "linkedin", title: t.linkedinTitle, intro: t.linkedinIntro, items: [...t.sections.linkedin] },
      { id: "instagram", title: t.instagramTitle, intro: t.instagramIntro, items: [...t.sections.instagram] },
    ],
    [t],
  );

  const totalItems = sections.reduce((sum, section) => sum + section.items.length, 0);
  const doneCount = Object.values(checked).filter(Boolean).length;

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      trackAnalyticsEvent("social_profile_checklist_toggle", { item: id, checked: !prev[id] });
      return next;
    });
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-7 w-7 text-primary-dark" aria-hidden />
            <p className="text-sm font-semibold text-slate-900">
              {doneCount} / {totalItems} {t.doneLabel}
            </p>
          </div>
          <div className="h-2 min-w-[10rem] flex-1 overflow-hidden rounded-full bg-slate-100 sm:max-w-xs" aria-hidden>
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${totalItems ? Math.round((doneCount / totalItems) * 100) : 0}%` }}
            />
          </div>
        </div>
      </div>

      {sections.map((section) => (
        <section key={section.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-serif font-bold text-slate-950">{section.title}</h2>
          {section.intro ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{section.intro}</p> : null}
          <ul className="mt-6 space-y-3">
            {section.items.map((item) => {
              const isOn = Boolean(checked[item.id]);
              return (
                <li key={item.id}>
                  <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${isOn ? "border-primary/30 bg-primary/[0.04]" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => toggle(item.id)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm leading-6 text-slate-800">{item.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-serif font-bold text-slate-950">{t.scoreTitle}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{t.scoreIntro}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.dimensions.map((dimension) => (
            <label key={dimension.id} className="rounded-xl border border-slate-200 p-4">
              <span className="text-sm font-semibold text-slate-900">{dimension.label}</span>
              <select
                className="mt-3 min-h-[44px] w-full rounded-lg border border-slate-300 px-3 text-slate-950"
                value={scores[dimension.id] ?? ""}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setScores((prev) => ({ ...prev, [dimension.id]: value }));
                  trackAnalyticsEvent("social_profile_checklist_score", { dimension: dimension.id, value });
                }}
              >
                <option value="">—</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </section>

      <aside className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-6 sm:p-8">
        <h2 className="text-2xl font-serif font-bold text-slate-950">{t.noteTitle}</h2>
        <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-800">{t.noteBody}</p>
      </aside>

      <aside className="rounded-2xl bg-slate-950 p-7 text-white sm:p-9">
        <CheckCircle2 className="h-8 w-8 text-primary-light" aria-hidden />
        <h2 className="mt-4 text-2xl font-serif font-bold text-white">{t.pairTitle}</h2>
        <p className="mt-3 max-w-3xl text-slate-300">{t.pairBody}</p>
        <p className="mt-4 max-w-3xl text-sm text-slate-400">{t.contactBody}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/tools/digital-presence-snapshot"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            {t.websiteCta}
          </Link>
          <Link
            href="/tools/social-presence-snapshot"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            {t.socialCta}
          </Link>
          <Link
            href={{
              pathname: "/contact",
              query: {
                intent: "visibility",
                from_page: "/tools/social-profile-checklist",
                goal: language === "fr" ? "Revue des profils sociaux (mots-clés, accessibilité, CTA)." : "Social profile review (keywords, accessibility, CTAs).",
              },
            }}
            onClick={() => trackAnalyticsEvent("social_profile_checklist_cta", { destination: "contact" })}
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-semibold text-slate-950 hover:bg-brand-gold-light"
          >
            {t.contactCta}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </div>
      </aside>
    </div>
  );
}
