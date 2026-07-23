"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useLocale } from "next-intl";

const concepts = {
  en: [
    {
      title: "Cedar Grove Custom Homes",
      industry: "Custom homes concept",
      image: "/cedargrove_snapshot.jpg",
      url: "https://showcase-cedar-grove-homes-production.up.railway.app",
      challenge:
        "Position an architecture-led custom home builder around site-first design — not speculative builds or catalogue floor plans.",
      solution:
        "A calm, imagery-led marketing site with clear project proof, service paths, and a brief-to-keys process that builds trust before inquiry.",
      outcome:
        "Concept capability: a premium local brand presence that turns land-owning homeowners into qualified project conversations.",
    },
    {
      title: "Northpoint Engineering Group",
      industry: "Engineering consulting concept",
      image: "/concept-northpoint.svg",
      url: "https://web-production-8d85b.up.railway.app",
      challenge:
        "Earn B2B capital-project trust when owners need constraints and constructability on the table before capital locks.",
      solution:
        "A technical, credibility-led site with project proof and clear advisory versus delivery paths for constrained ground.",
      outcome:
        "Concept capability: qualified project conversations with owners evaluating engineering partners for capital work.",
    },
    {
      title: "Oakridge Legal Partners",
      industry: "Business law concept",
      image: "/concept-oakridge.svg",
      url: "https://web-production-327b0.up.railway.app",
      challenge:
        "Build professional-services trust for business owners who need decisions they can defend — without fake credentials or bar-number theatre.",
      solution:
        "A charcoal-and-forest professional site with plain-language counsel framing, clear corporate versus disputes paths, and honest consultation conversion.",
      outcome:
        "Concept capability: a trustworthy firm presence that turns high-consideration visitors into consultation requests.",
    },
    {
      title: "Maple Health Medical Centre",
      industry: "Multidisciplinary clinic concept",
      image: "/concept-maple-health.svg",
      url: "https://web-production-81d7f.up.railway.app",
      challenge:
        "Help families find the next care step without medical claims presented as fact or opaque service navigation.",
      solution:
        "An accessible, soft-teal clinic site with readable pathways, family medicine versus physiotherapy choice, and appointment conversion.",
      outcome:
        "Concept capability: clearer local discovery and a calmer path from need to appointment request.",
    },
    {
      title: "Summit Industrial Systems",
      industry: "Manufacturing and automation concept",
      image: "/concept-summit.svg",
      url: "https://web-production-240db8.up.railway.app",
      challenge:
        "Give plant and operations leaders capability clarity without fake certifications, throughput claims, or brochure vagueness.",
      solution:
        "A deep-slate industrial site with automation versus production-equipment paths, illustrative work proof, and challenge-led inquiry.",
      outcome:
        "Concept capability: qualified production conversations with leaders evaluating systems partners.",
    },
    {
      title: "Skyline Commercial Realty",
      industry: "Commercial real estate concept",
      image: "/concept-skyline.svg",
      url: "https://web-production-252f4.up.railway.app",
      challenge:
        "Present commercial space for occupiers and investors without fake MLS inventory, ROI claims, or an endless unverified feed.",
      solution:
        "A graphite-and-glass CRE site with leasing versus investment-sales paths, illustrative property briefings, and light filtering.",
      outcome:
        "Concept capability: briefing requests from visitors who need clarity before they commit.",
    },
    {
      title: "Harbour Community Care",
      industry: "Healthcare concept",
      image: "/concept-community-care.svg",
      challenge:
        "Make services, eligibility, accessibility, and booking understandable without overwhelming visitors.",
      solution:
        "A calm, bilingual-ready service architecture with direct booking and accessibility paths.",
      outcome:
        "Concept capability: a trustworthy customer journey that can reduce booking friction and support local discovery.",
    },
    {
      title: "Northline Field Services",
      industry: "Industrial services concept",
      image: "/concept-field-services.svg",
      challenge:
        "Help urgent and planned-service buyers confirm capability, service area, safety, and availability quickly.",
      solution:
        "A high-contrast mobile-first site with dispatch status, service-area clarity, proof, and quote routing.",
      outcome:
        "Concept capability: faster qualification and a clearer path from urgent need to service request.",
    },
  ],
  fr: [
    {
      title: "Cedar Grove Custom Homes",
      industry: "Concept de maisons sur mesure",
      image: "/cedargrove_snapshot.jpg",
      url: "https://showcase-cedar-grove-homes-production.up.railway.app",
      challenge:
        "Positionner un constructeur de maisons sur mesure axé sur l’architecture autour d’une conception d’abord liée au terrain — pas de constructions spéculatives ni de plans catalogue.",
      solution:
        "Un site marketing calme, porté par l’image, avec preuves de projets, parcours de services et un processus du brief aux clés qui inspire confiance avant la demande.",
      outcome:
        "Capacité conceptuelle : une présence de marque locale premium qui transforme les propriétaires de terrain en conversations de projet qualifiées.",
    },
    {
      title: "Northpoint Engineering Group",
      industry: "Concept de génie-conseil",
      image: "/concept-northpoint.svg",
      url: "https://web-production-8d85b.up.railway.app",
      challenge:
        "Gagner la confiance B2B sur des projets d’immobilisation lorsque les propriétaires doivent voir contraintes et constructibilité avant que le capital se verrouille.",
      solution:
        "Un site technique axé sur la crédibilité, avec preuves de projets et parcours clairs entre conseil et réalisation pour des terrains contraignants.",
      outcome:
        "Capacité conceptuelle : des conversations de projet qualifiées avec des propriétaires qui évaluent des partenaires en génie.",
    },
    {
      title: "Oakridge Legal Partners",
      industry: "Concept de droit des affaires",
      image: "/concept-oakridge.svg",
      url: "https://web-production-327b0.up.railway.app",
      challenge:
        "Bâtir la confiance des services professionnels pour des dirigeants qui ont besoin de décisions défendables — sans fausses certifications ni théâtralisation des numéros de barreau.",
      solution:
        "Un site professionnel charbon et vert forêt, avec un cadrage en langage clair, des parcours corporatif versus litiges, et une conversion honnête vers la consultation.",
      outcome:
        "Capacité conceptuelle : une présence de cabinet crédible qui transforme les visiteurs à forte considération en demandes de consultation.",
    },
    {
      title: "Maple Health Medical Centre",
      industry: "Concept de clinique multidisciplinaire",
      image: "/concept-maple-health.svg",
      url: "https://web-production-81d7f.up.railway.app",
      challenge:
        "Aider les familles à trouver la prochaine étape de soins sans présenter d’affirmations médicales comme des faits ni une navigation opaque.",
      solution:
        "Un site clinique accessible, en sarcelle douce, avec parcours lisibles, choix médecine familiale versus physiothérapie, et conversion vers le rendez-vous.",
      outcome:
        "Capacité conceptuelle : une découverte locale plus claire et un parcours plus calme du besoin à la demande de rendez-vous.",
    },
    {
      title: "Summit Industrial Systems",
      industry: "Concept de fabrication et d’automatisation",
      image: "/concept-summit.svg",
      url: "https://web-production-240db8.up.railway.app",
      challenge:
        "Offrir aux dirigeants d’usine une clarté sur les capacités sans fausses certifications, sans allégations de débit ni brochures vagues.",
      solution:
        "Un site industriel ardoise profond, avec parcours automatisation versus équipements de production, preuves illustratives et demande menée par le défi.",
      outcome:
        "Capacité conceptuelle : des conversations de production qualifiées avec des dirigeants qui évaluent des partenaires systèmes.",
    },
    {
      title: "Skyline Commercial Realty",
      industry: "Concept d’immobilier commercial",
      image: "/concept-skyline.svg",
      url: "https://web-production-252f4.up.railway.app",
      challenge:
        "Présenter l’espace commercial aux occupants et investisseurs sans inventaire MLS fictif, sans allégations de ROI ni flux non vérifié.",
      solution:
        "Un site CRE graphite et bleu verre, avec parcours location-conseil versus ventes d’investissement, briefings illustratifs et filtrage léger.",
      outcome:
        "Capacité conceptuelle : des demandes de briefing de la part de visiteurs qui ont besoin de clarté avant de s’engager.",
    },
    {
      title: "Harbour Community Care",
      industry: "Concept de soins de santé",
      image: "/concept-community-care.svg",
      challenge:
        "Rendre les services, l’admissibilité, l’accessibilité et la réservation compréhensibles sans surcharger les visiteurs.",
      solution:
        "Une architecture calme, prête pour le bilingue, avec parcours directs de réservation et d’accessibilité.",
      outcome:
        "Capacité conceptuelle : un parcours client fiable qui réduit la friction et soutient la découverte locale.",
    },
    {
      title: "Northline Field Services",
      industry: "Concept de services industriels",
      image: "/concept-field-services.svg",
      challenge:
        "Aider les acheteurs urgents et planifiés à confirmer rapidement capacité, territoire, sécurité et disponibilité.",
      solution:
        "Un site mobile à fort contraste avec état de répartition, territoire clair, preuves et demandes de devis.",
      outcome:
        "Capacité conceptuelle : qualification plus rapide et parcours clair du besoin urgent à la demande.",
    },
  ],
} as const;

export default function PortfolioConcepts() {
  const locale = useLocale() === "fr" ? "fr" : "en";
  return (
    <section
      id="concept-work"
      className="mt-16 border-t border-slate-200 pt-14"
    >
      <p className="text-xs font-semibold uppercase tracking-[.16em] text-primary-dark">
        {locale === "fr"
          ? "Exploration transparente"
          : "Transparent exploration"}
      </p>
      <h2 className="mt-2 text-3xl font-serif font-bold text-slate-900">
        {locale === "fr" ? "Sites Web conceptuels" : "Concept websites"}
      </h2>
      <p className="mt-3 max-w-3xl text-slate-600">
        {locale === "fr"
          ? "Ces concepts ne sont pas des mandats clients ni des sites en production. Ils démontrent comment ROALLA pourrait relier positionnement, visibilité et conversion dans différents secteurs."
          : "These concepts are not client engagements or production sites. They demonstrate how ROALLA could connect positioning, visibility, and conversion in different industries."}
      </p>
      <div className="mt-8 grid lg:grid-cols-2 gap-7">
        {concepts[locale].map((concept) => {
          const liveUrl = "url" in concept ? concept.url : undefined;
          return (
            <article
              key={concept.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
            >
              <div className="relative aspect-video bg-slate-100">
                {liveUrl ? (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 block"
                    aria-label={
                      locale === "fr"
                        ? `Ouvrir ${concept.title}`
                        : `Open ${concept.title}`
                    }
                  >
                    <Image
                      src={concept.image}
                      alt={`${concept.title} ${locale === "fr" ? "maquette conceptuelle" : "concept website mockup"}`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </a>
                ) : (
                  <Image
                    src={concept.image}
                    alt={`${concept.title} ${locale === "fr" ? "maquette conceptuelle" : "concept website mockup"}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
              </div>
              <div className="p-6">
                <span className="inline-flex rounded-md bg-amber-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-900">
                  {locale === "fr" ? "Site conceptuel" : "Concept website"}
                </span>
                <h3 className="mt-3 text-xl font-serif font-bold text-slate-900">
                  {concept.title}
                </h3>
                <p className="text-sm font-medium text-primary-dark">
                  {concept.industry}
                </p>
                <dl className="mt-5 space-y-3 text-sm">
                  <div>
                    <dt className="font-bold text-slate-900">
                      {locale === "fr" ? "Défi" : "Challenge"}
                    </dt>
                    <dd className="mt-1 text-slate-600">{concept.challenge}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-slate-900">
                      {locale === "fr" ? "Approche" : "Approach"}
                    </dt>
                    <dd className="mt-1 text-slate-600">{concept.solution}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-slate-900">
                      {locale === "fr" ? "Résultat visé" : "Intended outcome"}
                    </dt>
                    <dd className="mt-1 text-slate-600">{concept.outcome}</dd>
                  </div>
                </dl>
                {liveUrl ? (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
                  >
                    {locale === "fr" ? "Voir le site conceptuel" : "View live concept"}
                    <ExternalLink className="ml-1.5 w-3.5 h-3.5" aria-hidden />
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
