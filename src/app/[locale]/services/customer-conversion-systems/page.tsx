import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import JsonLd from "@/components/JsonLd";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import Reveal from "@/components/motion/Reveal";
import { BRAND_PILLARS, PILLAR_TITLE_KEYS } from "@/lib/brand-journey";
import { buildPageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, servicePageJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };
const path = "/services/customer-conversion-systems";
const offer = "customer-conversion-review";
const inquiryIntent = "automation";
const reviewButton = "inline-flex items-center justify-center rounded-lg bg-cyan-300 px-5 py-3 text-center font-semibold text-slate-950 transition-colors hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-500";

const copy = {
  en: {
    title: "Customer Conversion Systems",
    metadataTitle: "Customer Conversion Systems | ROALLA",
    metadataDescription:
      "Turn scattered contacts, conversations, and follow-ups into a measurable customer conversion system.",
    heroTitle: "Turn more inquiries into customer conversations.",
    heroBody:
      "Connect your website, referrals, and events to one follow-up process. Give every qualified inquiry an owner and a next step, and see which sources lead to opportunities.",
    primaryCta: "Request a Customer Conversion Review",
    secondaryCta: "See what the review includes",
    strategyTitle: "Build around the customer journey you want to improve.",
    strategyBody: "ROALLA’s Digital Enablement strategy starts with a business outcome. Choose one journey, connect the tools that support it, and use real results to decide what to improve next.",
    strategySteps: [
      "Choose the customer action that matters and map where inquiries go unanswered.",
      "Connect contact sources to your CRM and assign an owner and next action.",
      "Pilot permission-based follow-up and have your team take over when someone replies.",
      "Review reply rates, booked meetings, and pipeline movement to decide what to keep or change.",
    ],
    exampleLabel: "Example: trade-show follow-up",
    exampleTitle: "What happens after someone scans your QR code?",
    exampleBody: "A prospect scans your booth code and asks for a demo. Their request lands in the CRM with the event source and permission recorded. The right person gets a follow-up task. After the event, you can see how many requests turned into booked demos.",
    inquiryGoal: "I’d like a Customer Conversion Review to see where we miss inquiries or lose track of follow-up.",
    mobileCta: "See the conversion review",
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
  },
  fr: {
    title: "Systèmes de conversion client",
    metadataTitle: "Systèmes de conversion client | ROALLA",
    metadataDescription:
      "Transformez les contacts, conversations et suivis dispersés en système de conversion mesurable.",
    heroTitle: "Transformez plus de demandes en conversations avec vos clients.",
    heroBody:
      "Reliez votre site Web, vos recommandations et vos événements à un même processus de suivi. Attribuez chaque demande qualifiée à un responsable, définissez la prochaine étape et repérez les sources qui génèrent des occasions.",
    primaryCta: "Demander une revue de conversion client",
    secondaryCta: "Voir ce que comprend la revue",
    strategyTitle: "Partez du parcours client que vous voulez améliorer.",
    strategyBody: "La stratégie d’accompagnement numérique de ROALLA part d’un résultat d’affaires. Choisissez un parcours, reliez les outils qui le soutiennent et servez-vous des résultats pour décider quoi améliorer ensuite.",
    strategySteps: [
      "Choisissez l’action client qui compte et repérez où les demandes restent sans réponse.",
      "Reliez les sources de contacts au CRM et définissez la personne responsable et la prochaine action.",
      "Testez un suivi fondé sur le consentement et laissez votre équipe prendre le relais lorsqu’une personne répond.",
      "Examinez les taux de réponse, les rendez-vous pris et la progression des occasions pour décider quoi conserver ou modifier.",
    ],
    exampleLabel: "Exemple : suivi après un salon professionnel",
    exampleTitle: "Que se passe-t-il après la lecture de votre code QR?",
    exampleBody: "Une personne balaie le code de votre kiosque et demande une démonstration. Le CRM enregistre la demande, sa provenance et le consentement. La personne responsable reçoit une tâche de suivi. Après le salon, vous pouvez voir combien de demandes ont mené à une démonstration réservée.",
    inquiryGoal: "J’aimerais une revue de conversion client pour repérer les demandes qui nous échappent et les suivis qui se perdent.",
    mobileCta: "Voir la revue de conversion",
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
  const tJourney = await getTranslations({ locale, namespace: "brandJourney" });
  const inquiryHref = {
    pathname: "/contact",
    query: {
      intent: inquiryIntent,
      need: "both",
      offer,
      from_page: `/${locale}${path}`,
      goal: c.inquiryGoal,
    },
  } as const;
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
            serviceType: c.title,
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

        <section className="relative overflow-hidden bg-slate-950 px-6 pb-16 pt-28 sm:px-10 lg:px-16 lg:pb-24 lg:pt-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(20,184,166,0.22),transparent_34%),radial-gradient(circle_at_10%_90%,rgba(245,183,77,0.14),transparent_30%)]" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
            <Reveal when="mount">
              <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-slate-200">
                <Link href="/services/digital" className="text-cyan-300 underline-offset-4 hover:underline">{digitalLabel}</Link>
                <span aria-hidden>·</span>
                <span>{c.title}</span>
              </p>
              <h1 className="mt-5 text-4xl font-serif font-bold leading-tight text-white sm:text-5xl lg:text-6xl">{c.heroTitle}</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-200">{c.heroBody}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4">
                <Link href={inquiryHref} className={reviewButton}>{c.primaryCta}</Link>
                <a href="#conversion-review" className="font-semibold text-white underline decoration-white/60 underline-offset-4 hover:decoration-white">{c.secondaryCta}</a>
              </div>
            </Reveal>
            <Reveal when="mount" delayMs={120} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 bg-slate-800">
              <Image
                src="/images/insights/library/sales-pipeline-or-list-of-contacts.opt.webp"
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </Reveal>
          </div>
        </section>

        <Reveal as="section" className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
          <h2 className="max-w-3xl text-3xl font-serif font-bold text-slate-950 sm:text-4xl">{c.strategyTitle}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">{c.strategyBody}</p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BRAND_PILLARS.map((phase, index) => (
              <Reveal key={phase} as="li" delayMs={index * 75} className="border-t-4 border-primary bg-slate-50 p-5">
                <h3 className="text-xl font-serif font-bold text-slate-950">{tJourney(PILLAR_TITLE_KEYS[phase])}</h3>
                <p className="mt-2 leading-7 text-slate-700">{c.strategySteps[index]}</p>
              </Reveal>
            ))}
          </ol>
        </Reveal>

        <Reveal as="section" className="mx-auto grid max-w-6xl items-center gap-8 px-6 pb-16 sm:px-10 lg:grid-cols-2 lg:px-16">
          <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src="/images/insights/library/trade-show-leads-after-qr-scan.opt.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-dark">{c.exampleLabel}</p>
            <h2 className="mt-2 text-3xl font-serif font-bold text-slate-950">{c.exampleTitle}</h2>
            <p className="mt-4 leading-7 text-slate-700">{c.exampleBody}</p>
          </div>
        </Reveal>

        <Reveal as="section" className="mx-auto max-w-6xl border-t border-slate-200 px-6 py-16 sm:px-10 lg:px-16">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{c.frameworkEyebrow}</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-serif font-bold text-slate-950 sm:text-4xl">{c.frameworkTitle}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{c.frameworkBody}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {c.stages.map(([, title, description]) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-serif font-bold text-slate-950">{title}</h3>
                <p className="mt-2 leading-7 text-slate-700">{description}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <section className="bg-slate-50 px-6 py-12 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{c.dependenciesEyebrow}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {c.dependencies.map((dependency) => <span key={dependency} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">{dependency}</span>)}
            </div>
          </div>
        </section>

        <Reveal as="section" id="conversion-review" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 sm:px-10 lg:px-16">
          <div className="grid gap-8 rounded-3xl border border-primary/20 bg-primary/[0.05] p-7 lg:grid-cols-[1fr_0.8fr] lg:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{c.offerEyebrow}</p>
              <h2 className="mt-3 text-3xl font-serif font-bold text-slate-950">{c.offerTitle}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-700">{c.offerBody}</p>
              <p className="mt-5 text-sm font-bold text-primary-dark">{c.timeline}</p>
              <Link href={inquiryHref} className={`mt-5 ${reviewButton}`}>{c.primaryCta}</Link>
            </div>
            <ul className="space-y-3 self-center">
              {c.offerItems.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />{item}</li>)}
            </ul>
          </div>
        </Reveal>

        <section className="bg-slate-950 px-6 py-16 text-white sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{c.packagesEyebrow}</p>
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {c.packages.map(([name, title, description]) => (
                <article key={name} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
                  <p className="text-sm font-semibold text-cyan-300">{name}</p>
                  <h3 className="mt-3 text-xl font-serif font-bold text-white">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-200">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 text-center sm:px-10 lg:px-16">
          <h2 className="text-3xl font-serif font-bold text-slate-950 sm:text-4xl">{c.finalTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">{c.finalBody}</p>
          <Link href={inquiryHref} className={`mt-7 ${reviewButton}`}>{c.primaryCta}</Link>
        </section>
      <StickyMobileCTA label={c.mobileCta} anchorHref="#conversion-review" />
    </div>
  );
}
