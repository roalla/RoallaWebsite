import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, servicePageJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };
const path = "/services/customer-conversion-systems";

const copy = {
  en: {
    title: "Customer Conversion Systems",
    metadataTitle: "Customer Conversion Systems | ROALLA",
    metadataDescription:
      "Turn scattered contacts, conversations, and follow-ups into a measurable customer conversion system.",
    eyebrow: "Digital Enablement · Customer Conversion",
    heroTitle: "Turn scattered contacts into a measurable customer conversion system.",
    heroBody:
      "ROALLA helps you capture every opportunity, organize contacts, follow up consistently, and understand what turns interest into revenue.",
    primaryCta: "Start with a Customer Conversion Review",
    secondaryCta: "View Digital Enablement",
    frameworkEyebrow: "A practical operating model",
    frameworkTitle: "Connect the parts that make follow-up work.",
    frameworkBody:
      "Start with the systems and habits you already have. We connect the right pieces, add automation where it helps, and keep human conversation at the points that matter.",
    stages: [
      ["01", "Contact sources", "Website forms, referrals, calls, email, social media, events, and existing lists."],
      ["02", "Simple CRM", "One dependable place for contact details, consent, status, notes, and next steps."],
      ["03", "Campaign follow-up", "Helpful, timely messages that reflect where each contact is in the conversation."],
      ["04", "Measure", "See response, meetings, pipeline movement, and the sources that create real opportunities."],
      ["05", "Human conversation", "Keep people involved when judgment, trust, or a buying decision is required."],
    ],
    dependenciesEyebrow: "What we need to begin",
    dependencies: ["Contact data", "Consent and permissions", "Approved content", "CRM and booking access", "Reporting access"],
    offerEyebrow: "Recommended first step",
    offerTitle: "Customer Conversion Review",
    offerBody:
      "A focused review of how contacts enter your business, how they are tracked, and where follow-up is being lost. You receive a practical starting point for CRM, campaigns, measurement, and next actions.",
    offerItems: ["Current journey and contact-source map", "CRM and pipeline recommendation", "Follow-up and campaign pilot plan", "Measurement plan for response and conversion"],
    timeline: "Typical timeline: 1–2 weeks",
    packagesEyebrow: "Ways to engage",
    packages: [
      ["Review", "Find the gaps", "Map your current customer journey and identify the first measurable improvements."],
      ["CRM foundation", "Create one source of truth", "Set up practical contact fields, stages, ownership, notes, and next actions."],
      ["Campaign pilot", "Follow up consistently", "Launch a small, permission-based campaign and measure the response."],
      ["Conversion system", "Improve over time", "Connect the workflow, reporting, and human process so the system keeps getting better."],
    ],
    finalTitle: "Make every conversation easier to continue.",
    finalBody:
      "Bring the tools you already use. ROALLA helps you decide what to keep, what to connect, and what to improve first.",
    contactCta: "Talk to ROALLA",
  },
  fr: {
    title: "Systèmes de conversion client",
    metadataTitle: "Systèmes de conversion client | ROALLA",
    metadataDescription:
      "Transformez les contacts, conversations et suivis dispersés en système de conversion mesurable.",
    eyebrow: "Accompagnement numérique · Conversion client",
    heroTitle: "Transformez vos contacts dispersés en système de conversion mesurable.",
    heroBody:
      "ROALLA vous aide à capter chaque occasion, organiser vos contacts, assurer les suivis et comprendre ce qui transforme l’intérêt en revenus.",
    primaryCta: "Commencer par une revue de conversion",
    secondaryCta: "Voir l’accompagnement numérique",
    frameworkEyebrow: "Un modèle de fonctionnement pratique",
    frameworkTitle: "Reliez les éléments qui rendent le suivi efficace.",
    frameworkBody:
      "Commencez avec les outils et habitudes déjà en place. Nous relions les bons éléments, automatisons ce qui aide et gardons l’échange humain aux moments importants.",
    stages: [
      ["01", "Sources de contacts", "Formulaires, recommandations, appels, courriels, médias sociaux, événements et listes existantes."],
      ["02", "CRM simple", "Un endroit fiable pour les coordonnées, consentements, statuts, notes et prochaines étapes."],
      ["03", "Suivi de campagne", "Des messages utiles et opportuns selon l’étape de chaque contact."],
      ["04", "Mesurer", "Suivez les réponses, les rencontres, les occasions et les sources qui créent des résultats."],
      ["05", "Conversation humaine", "Gardez les personnes impliquées lorsque le jugement, la confiance ou la décision comptent."],
    ],
    dependenciesEyebrow: "Ce qu’il faut pour commencer",
    dependencies: ["Données de contacts", "Consentements et permissions", "Contenu approuvé", "Accès CRM et réservation", "Accès aux rapports"],
    offerEyebrow: "Première étape recommandée",
    offerTitle: "Revue de conversion client",
    offerBody:
      "Une revue ciblée de l’arrivée des contacts, de leur suivi et des points où les occasions se perdent. Vous recevez un point de départ concret pour le CRM, les campagnes, les mesures et les prochaines actions.",
    offerItems: ["Carte du parcours et des sources de contacts", "Recommandation CRM et pipeline", "Plan pilote de suivi et de campagne", "Plan de mesure des réponses et conversions"],
    timeline: "Délai habituel : 1 à 2 semaines",
    packagesEyebrow: "Façons de travailler ensemble",
    packages: [
      ["Revue", "Trouver les écarts", "Cartographier le parcours actuel et cibler les premières améliorations mesurables."],
      ["Fondation CRM", "Créer une source fiable", "Configurer les champs, étapes, responsables, notes et prochaines actions."],
      ["Pilote de campagne", "Assurer le suivi", "Lancer une petite campagne avec permission et mesurer la réponse."],
      ["Système de conversion", "Améliorer dans le temps", "Relier le processus, les rapports et le travail humain pour progresser durablement."],
    ],
    finalTitle: "Facilitez la continuité de chaque conversation.",
    finalBody:
      "Apportez les outils que vous utilisez déjà. ROALLA vous aide à décider quoi garder, relier et améliorer en premier.",
    contactCta: "Parler à ROALLA",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = copy[locale === "fr" ? "fr" : "en"];
  return buildPageMetadata({ locale, path, title: c.metadataTitle, description: c.metadataDescription });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const c = copy[locale === "fr" ? "fr" : "en"];
  const homeLabel = locale === "fr" ? "Accueil" : "Home";
  const digitalLabel = locale === "fr" ? "Accompagnement numérique" : "Digital Enablement";
  return (
    <div className="page-shell">
      <JsonLd
        data={[
          webPageJsonLd(locale, path, c.title, c.metadataDescription),
          ...servicePageJsonLd({
            locale,
            path,
            name: c.title,
            description: c.metadataDescription,
            serviceType: "Customer Conversion Systems",
            offers: c.packages.map(([name, , description]) => ({ name, description })),
            faqs: [],
          }),
          breadcrumbJsonLd(locale, [
            { name: homeLabel, path: "" },
            { name: digitalLabel, path: "/services/digital" },
            { name: c.title },
          ]),
        ]}
      />

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(20,184,166,0.22),transparent_34%),radial-gradient(circle_at_10%_90%,rgba(245,183,77,0.14),transparent_30%)]" aria-hidden />
          <div className="relative mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">{c.eyebrow}</p>
            <div className="mt-5 max-w-4xl">
              <h1 className="text-4xl font-serif font-bold leading-tight sm:text-5xl lg:text-6xl">{c.heroTitle}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{c.heroBody}</p>
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">{c.primaryCta}</Link>
              <Link href="/services/digital" className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:border-white">{c.secondaryCta}</Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{c.frameworkEyebrow}</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-serif font-bold text-slate-950 sm:text-4xl">{c.frameworkTitle}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{c.frameworkBody}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {c.stages.map(([number, title, description]) => (
              <article key={number} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="text-xs font-bold text-primary-dark">{number}</span>
                <h3 className="mt-3 text-lg font-serif font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-12 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{c.dependenciesEyebrow}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {c.dependencies.map((dependency) => <span key={dependency} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">{dependency}</span>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
          <div className="grid gap-8 rounded-3xl border border-primary/20 bg-primary/[0.05] p-7 lg:grid-cols-[1fr_0.8fr] lg:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{c.offerEyebrow}</p>
              <h2 className="mt-3 text-3xl font-serif font-bold text-slate-950">{c.offerTitle}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-700">{c.offerBody}</p>
              <p className="mt-5 text-sm font-bold text-primary-dark">{c.timeline}</p>
            </div>
            <ul className="space-y-3 self-center">
              {c.offerItems.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />{item}</li>)}
            </ul>
          </div>
        </section>

        <section className="bg-slate-950 px-6 py-16 text-white sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{c.packagesEyebrow}</p>
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {c.packages.map(([name, title, description]) => <article key={name} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">{name}</p><h3 className="mt-3 text-xl font-serif font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 text-center sm:px-10 lg:px-16">
          <h2 className="text-3xl font-serif font-bold text-slate-950 sm:text-4xl">{c.finalTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">{c.finalBody}</p>
          <Link href="/contact" className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">{c.contactCta}</Link>
        </section>
      </main>
    </div>
  );
}
