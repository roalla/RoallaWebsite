"use client";

import React from "react";
import { ArrowRight, CheckCircle2, Share2 } from "lucide-react";
import { buildDigitalPresenceActions } from "@/lib/digital-presence/actions";
import { buildSnapshotNarrative } from "@/lib/digital-presence/narrative";
import type { SocialPresenceCheckId, SocialPresenceSnapshot } from "@/lib/social-presence/analyzer";
import type { ScoreName, WebsiteVisibilitySnapshot } from "@/lib/website-visibility/pagespeed";

const copy = {
  en: {
    socialTitle: "Social sharing setup",
    socialDescription: "How well your website connects to your social profiles and creates sharing previews",
    socialLoading: "Checking the social sharing setup…",
    socialError: "We could not measure the social sharing setup.",
    phoneGap: "Your phone result averages {mobile} and your computer result averages {desktop}. Most visitors will feel the phone result.",
    actionsTitle: "What to improve first",
    actionsIntro: "Start with these areas. They are likely to make the greatest difference based on this check.",
    fixNow: "Fix now",
    planNext: "Plan next",
    automatedStrong: "Your results are strong. The next step is to make sure the message, content, and customer journey are helping visitors take action.",
    impact: "Likely impact",
    effort: "Typical effort",
    high: "High",
    medium: "Medium",
    low: "Low",
    findingTitle: "One finding from this check",
    findingDevice: { mobile: "a phone", desktop: "a computer" },
    findingOpportunity: "On {strategy}, the largest measured slowdown is “{title}”.{detail}",
    findingDelay: "That delay is what people feel before they see the offer.",
    findingSocial: {
      profileLinks: "The clearest sharing gap is the path to your social profiles. People cannot easily reach them from this page.",
      structuredProfiles: "The clearest sharing gap is the connection between this website and your social profiles.",
      openGraph: "The clearest sharing gap is the link preview. A shared link can arrive without a clear title, description, or image.",
      socialCards: "The clearest sharing gap is the social card. A preview can arrive without a clear image and message.",
      organizationSchema: "The clearest sharing gap is business identity. Search systems may not recognize the name and logo.",
      pageIdentity: "The clearest sharing gap is the page identity. Without a clear title, description, or preferred address, the page is harder to choose.",
    },
    humanTitle: "What the scores cannot tell you",
    human: [
      "Whether visitors quickly understand what you offer",
      "Which social channels are right for your customers",
      "Whether your content builds trust and encourages inquiries",
    ],
    recommendedTitle: "Recommended ROALLA starting point",
    recommendationVisibility: "Visibility Improvement Sprint",
    recommendationVisibilityBody: "Improve the search, social, and technical signals that help people and digital systems find and understand the business.",
    recommendationConversion: "Website Conversion Refresh",
    recommendationConversionBody: "Address experience and customer-journey barriers before deciding whether a complete rebuild is necessary.",
    recommendationManaged: "Digital Baseline and Managed Optimization",
    recommendationManagedBody: "Protect the current foundation, monitor change, and improve the next highest-value opportunity over time.",
    blueprintLink: "Build my 90-day value blueprint",
    calculatorsLink: "Estimate potential business value",
    monitoringLink: "Preview ongoing monitoring",
    mobile: "Mobile",
    desktop: "Desktop",
    actionTechnical: {
      performance: "Help the page load and respond faster",
      accessibility: "Make the page easier for everyone to use",
      bestPractices: "Improve website reliability and security",
      seo: "Help search engines understand the page",
    },
    actionSocial: {
      profileLinks: "Make your main social profiles easy to find",
      structuredProfiles: "Help search engines connect your website to your social profiles",
      openGraph: "Improve how your page looks when it is shared",
      socialCards: "Add a clear image and message for social sharing",
      organizationSchema: "Help search engines recognize your business name and logo",
      pageIdentity: "Add a clear page title, description, and preferred address",
    },
    actionCost: {
      performance: "On {strategies}, people leave a slow page before they see the offer. Current score: {score}/100.",
      accessibility: "On {strategies}, missed labels, contrast, or controls can stop a ready visitor from sending an inquiry. Current score: {score}/100.",
      bestPractices: "On {strategies}, errors and trust gaps interrupt the visit before it becomes a conversation. Current score: {score}/100.",
      seo: "On {strategies}, an unclear page is harder for the right customers to find. Current score: {score}/100.",
      profileLinks: "People cannot easily reach your main social profiles from this page. Current result: {score}%.",
      structuredProfiles: "Search systems cannot reliably connect this website to your social profiles. Current result: {score}%.",
      openGraph: "A shared link can arrive without a clear title, description, or image. Current result: {score}%.",
      socialCards: "A social preview can arrive without a clear image and message. Current result: {score}%.",
      organizationSchema: "Search systems may not recognize the business name and logo. Current result: {score}%.",
      pageIdentity: "Without a clear title, description, or preferred address, the page is harder to choose. Current result: {score}%.",
    },
    lead: {
      seo: "Search readiness averages {score}. The useful starting point is making this page easier for the right customers to find.",
      social: "Social sharing setup is {score} out of 100. A shared link is not yet carrying a clear message.",
      performance: "Lab performance averages {score}. Visitors are waiting before they can see the offer.",
      accessibility: "Accessibility averages {score}. Missed details on this page are where inquiries slip.",
      strong: "The measured scores are in a strong range. The useful next step is protecting that foundation and improving the next detail that can still grow inquiries.",
    },
  },
  fr: {
    socialTitle: "Partage sur les réseaux sociaux",
    socialDescription: "La façon dont votre site présente vos profils et crée des aperçus de partage",
    socialLoading: "Vérification du partage social…",
    socialError: "Nous n’avons pas pu mesurer le partage social.",
    phoneGap: "Le résultat sur téléphone est de {mobile} en moyenne et le résultat sur ordinateur est de {desktop}. La plupart des visiteurs ressentiront le résultat du téléphone.",
    actionsTitle: "Les améliorations à faire en premier",
    actionsIntro: "Commencez par ces aspects. Selon cette vérification, ce sont ceux qui pourraient faire la plus grande différence.",
    fixNow: "Corriger maintenant",
    planNext: "Planifier ensuite",
    automatedStrong: "Vos résultats sont solides. La prochaine étape consiste à vérifier si le message, le contenu et le parcours client encouragent les visiteurs à agir.",
    impact: "Impact probable",
    effort: "Effort habituel",
    high: "Élevé",
    medium: "Moyen",
    low: "Faible",
    findingTitle: "Un constat de cette vérification",
    findingDevice: { mobile: "téléphone", desktop: "ordinateur" },
    findingOpportunity: "Sur {strategy}, le plus grand ralentissement mesuré est « {title} ».{detail}",
    findingDelay: "C’est ce délai que les gens ressentent avant de voir l’offre.",
    findingSocial: {
      profileLinks: "L’écart de partage le plus clair est le chemin vers vos profils sociaux. Les gens ne peuvent pas les atteindre facilement depuis cette page.",
      structuredProfiles: "L’écart de partage le plus clair est le lien entre ce site et vos profils sociaux.",
      openGraph: "L’écart de partage le plus clair est l’aperçu du lien. Un lien partagé peut arriver sans titre, description ou image clairs.",
      socialCards: "L’écart de partage le plus clair est la carte sociale. Un aperçu peut arriver sans image ni message clairs.",
      organizationSchema: "L’écart de partage le plus clair est l’identité de l’entreprise. Les moteurs de recherche peuvent ne pas reconnaître le nom et le logo.",
      pageIdentity: "L’écart de partage le plus clair est l’identité de la page. Sans titre, description ou adresse clairs, la page est plus difficile à choisir.",
    },
    humanTitle: "Ce que les scores ne peuvent pas évaluer",
    human: [
      "La rapidité avec laquelle les visiteurs comprennent votre offre",
      "Les réseaux sociaux les plus pertinents pour votre clientèle",
      "La capacité du contenu à inspirer confiance et à générer des demandes",
    ],
    recommendedTitle: "Point de départ ROALLA recommandé",
    recommendationVisibility: "Sprint d’amélioration de la visibilité",
    recommendationVisibilityBody: "Améliorez les signaux de recherche, de partage social et de santé technique qui aident les personnes et les systèmes numériques à comprendre l’entreprise.",
    recommendationConversion: "Rafraîchissement de conversion du site",
    recommendationConversionBody: "Corrigez les obstacles de l’expérience et du parcours client avant de décider si une reconstruction complète est nécessaire.",
    recommendationManaged: "Référence numérique et optimisation gérée",
    recommendationManagedBody: "Protégez la fondation actuelle, suivez les changements et améliorez progressivement la prochaine possibilité de grande valeur.",
    blueprintLink: "Créer mon plan de valeur sur 90 jours",
    calculatorsLink: "Estimer la valeur d’affaires possible",
    monitoringLink: "Prévisualiser le suivi continu",
    mobile: "Mobile",
    desktop: "Ordinateur",
    actionTechnical: {
      performance: "Accélérer le chargement et la réaction de la page",
      accessibility: "Rendre la page plus facile à utiliser pour tous",
      bestPractices: "Améliorer la fiabilité et la sécurité du site",
      seo: "Aider les moteurs de recherche à comprendre la page",
    },
    actionSocial: {
      profileLinks: "Rendre vos principaux profils sociaux faciles à trouver",
      structuredProfiles: "Aider les moteurs de recherche à relier votre site à vos profils sociaux",
      openGraph: "Améliorer l’apparence de votre page lorsqu’elle est partagée",
      socialCards: "Ajouter une image et un message clairs pour le partage social",
      organizationSchema: "Aider les moteurs de recherche à reconnaître votre entreprise et son logo",
      pageIdentity: "Ajouter un titre, une description et une adresse de page clairs",
    },
    actionCost: {
      performance: "Sur {strategies}, les gens quittent une page lente avant de voir l’offre. Score actuel : {score}/100.",
      accessibility: "Sur {strategies}, des libellés, un contraste ou des commandes manqués peuvent empêcher un visiteur prêt d’envoyer une demande. Score actuel : {score}/100.",
      bestPractices: "Sur {strategies}, des erreurs et des doutes interrompent la visite avant qu’elle devienne une conversation. Score actuel : {score}/100.",
      seo: "Sur {strategies}, une page peu claire est plus difficile à trouver pour les bons clients. Score actuel : {score}/100.",
      profileLinks: "Les gens ne peuvent pas facilement atteindre vos principaux profils sociaux depuis cette page. Résultat actuel : {score} %.",
      structuredProfiles: "Les moteurs de recherche ne peuvent pas relier de façon fiable ce site à vos profils sociaux. Résultat actuel : {score} %.",
      openGraph: "Un lien partagé peut arriver sans titre, description ou image clairs. Résultat actuel : {score} %.",
      socialCards: "Un aperçu social peut arriver sans image ni message clairs. Résultat actuel : {score} %.",
      organizationSchema: "Les moteurs de recherche peuvent ne pas reconnaître le nom et le logo de l’entreprise. Résultat actuel : {score} %.",
      pageIdentity: "Sans titre, description ou adresse de page clairs, la page est plus difficile à choisir. Résultat actuel : {score} %.",
    },
    lead: {
      seo: "La préparation à la recherche est de {score} en moyenne. Le point de départ utile est de rendre cette page plus facile à trouver pour les bons clients.",
      social: "Le partage social est à {score} sur 100. Un lien partagé ne porte pas encore un message clair.",
      performance: "La performance de laboratoire est de {score} en moyenne. Les visiteurs attendent avant de voir l’offre.",
      accessibility: "L’accessibilité est de {score} en moyenne. Les détails manqués sur cette page sont là où les demandes se perdent.",
      strong: "Les scores mesurés sont dans une bonne zone. La prochaine étape utile est de protéger cette base et d’améliorer le prochain détail qui peut encore faire croître les demandes.",
    },
  },
} as const;

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

function scoreTone(score: number | null) {
  if (score == null) return "text-slate-500";
  if (score >= 90) return "text-emerald-700";
  if (score >= 50) return "text-amber-700";
  return "text-rose-700";
}

export function PresenceReportDetails({
  locale,
  technical,
  social,
  socialError,
  socialLoading,
}: {
  locale: string;
  technical: WebsiteVisibilitySnapshot[];
  social: SocialPresenceSnapshot | null;
  socialError: string;
  socialLoading: boolean;
}) {
  const language = locale === "fr" ? "fr" : "en";
  const t = copy[language];
  const narrative = buildSnapshotNarrative(technical, social ?? undefined);
  const actions = buildDigitalPresenceActions(technical, social ?? undefined);
  const offer = narrative.offer;
  const lead = offer.kind === "strong" ? t.lead.strong : fill(t.lead[offer.kind], { score: String(offer.score) });
  const recommendation = offer.kind === "seo" || offer.kind === "social"
    ? { title: t.recommendationVisibility, body: t.recommendationVisibilityBody }
    : offer.kind === "performance" || offer.kind === "accessibility"
      ? { title: t.recommendationConversion, body: t.recommendationConversionBody }
      : { title: t.recommendationManaged, body: t.recommendationManagedBody };
  const finding = narrative.finding;
  const findingText = finding?.kind === "opportunity"
    ? `${fill(t.findingOpportunity, {
        strategy: t.findingDevice[finding.strategy],
        title: finding.title,
        detail: finding.detail ? ` ${finding.detail}${/[.!?]$/.test(finding.detail) ? "" : "."}` : "",
      })} ${t.findingDelay}`
    : finding?.kind === "social"
      ? t.findingSocial[finding.key]
      : "";

  return (
    <div className="space-y-7">
      {narrative.phoneGap ? (
        <p className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950">{fill(t.phoneGap, { mobile: String(narrative.phoneGap.mobile), desktop: String(narrative.phoneGap.desktop) })}</p>
      ) : null}

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          <Share2 className="mt-1 h-7 w-7 text-primary-dark" aria-hidden />
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-950">{t.socialTitle}</h2>
            <p className="mt-1 text-sm text-slate-600">{t.socialDescription}</p>
          </div>
        </div>
        {social ? (
          <div className="mt-6">
            <p className={`text-5xl font-bold ${scoreTone(social.score)}`}>{social.score}<span className="text-lg text-slate-500">/100</span></p>
            <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {social.checks.map((check) => (
                <div key={check.id} className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-[11px] font-semibold text-slate-500">{t.actionSocial[check.id]}</dt>
                  <dd className="mt-1 font-bold text-slate-900">{check.points}/{check.maxPoints}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : socialLoading ? <p className="mt-6 text-sm text-slate-600">{t.socialLoading}</p> : <p className="mt-6 text-sm text-amber-800">{socialError || t.socialError}</p>}
      </article>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-serif font-bold text-slate-950">{t.actionsTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{t.actionsIntro}</p>
          {findingText ? <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700"><span className="font-semibold text-slate-950">{t.findingTitle}. </span>{findingText}</p> : null}
          {actions.length ? (
            <ol className="mt-5 space-y-3">
              {actions.map((action, index) => {
                const title = action.source === "technical" ? t.actionTechnical[action.key] : t.actionSocial[action.key as SocialPresenceCheckId];
                const strategies = action.source === "technical"
                  ? action.strategies.map((strategy) => strategy === "mobile" ? t.mobile : t.desktop).join(` ${language === "fr" ? "et" : "and"} `)
                  : "";
                const why = fill(t.actionCost[action.key as ScoreName | SocialPresenceCheckId], { score: String(action.score), strategies });
                return (
                  <li key={`${action.source}-${action.key}`} className="flex gap-4 rounded-xl border border-slate-200 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary-dark">{index + 1}</span>
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wide ${action.priority === "fixNow" ? "text-rose-700" : "text-amber-700"}`}>{action.priority === "fixNow" ? t.fixNow : t.planNext}</span>
                      <h3 className="mt-1 font-semibold text-slate-950">{title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{why}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-primary/[0.08] px-2.5 py-1 text-[11px] font-semibold text-primary-dark">{t.impact}: {t[action.impact]}</span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{t.effort}: {t[action.effort]}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : <p className="mt-5 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">{t.automatedStrong}</p>}
        </article>
        <article className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-6 sm:p-8">
          <h2 className="text-2xl font-serif font-bold text-slate-950">{t.humanTitle}</h2>
          <ul className="mt-5 space-y-3">
            {t.human.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}
          </ul>
        </article>
      </div>

      <article className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 sm:p-8">
        <h2 className="text-2xl font-serif font-bold text-slate-950">{t.recommendedTitle}</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-950">{lead}</p>
        <h3 className="mt-3 text-lg font-bold text-primary-dark">{recommendation.title}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">{recommendation.body}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-primary/15 pt-5 text-sm font-semibold">
          <a href={`/${locale}/tools/digital-value-blueprint`} className="inline-flex items-center text-primary-dark underline underline-offset-4">{t.blueprintLink}<ArrowRight className="ml-1 h-4 w-4" aria-hidden /></a>
          <a href={`/${locale}/tools/business-value-calculators`} className="inline-flex items-center text-primary-dark underline underline-offset-4">{t.calculatorsLink}<ArrowRight className="ml-1 h-4 w-4" aria-hidden /></a>
          <a href={`/${locale}/tools/digital-monitoring-dashboard`} className="inline-flex items-center text-primary-dark underline underline-offset-4">{t.monitoringLink}<ArrowRight className="ml-1 h-4 w-4" aria-hidden /></a>
        </div>
      </article>
    </div>
  );
}
