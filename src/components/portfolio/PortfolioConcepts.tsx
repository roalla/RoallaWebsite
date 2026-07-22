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
      url: "https://cedargroves.up.railway.app/",
      challenge:
        "Position an architecture-led custom home builder around site-first design — not speculative builds or catalogue floor plans.",
      solution:
        "A calm, imagery-led marketing site with clear project proof, service paths, and a brief-to-keys process that builds trust before inquiry.",
      outcome:
        "Concept capability: a premium local brand presence that turns land-owning homeowners into qualified project conversations.",
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
      url: "https://cedargroves.up.railway.app/",
      challenge:
        "Positionner un constructeur de maisons sur mesure axé sur l’architecture autour d’une conception d’abord liée au terrain — pas de constructions spéculatives ni de plans catalogue.",
      solution:
        "Un site marketing calme, porté par l’image, avec preuves de projets, parcours de services et un processus du brief aux clés qui inspire confiance avant la demande.",
      outcome:
        "Capacité conceptuelle : une présence de marque locale premium qui transforme les propriétaires de terrain en conversations de projet qualifiées.",
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
