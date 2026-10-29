import type { Metadata } from "next";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Gauge,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import VisibilityReviewEntry from "@/components/visibility/VisibilityReviewEntry";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, servicePageJsonLd, webPageJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };

const pages = {
  en: {
    metadataTitle: "Website & AI Visibility Review | ROALLA",
    metadataDescription: "Get a free website and AI visibility snapshot, then request a practical expert review of what to improve first.",
    eyebrow: "Website & AI Visibility Review",
    title: "Can customers—and AI assistants—find, understand, and trust your business?",
    subtitle: "Start with a free automated snapshot of your website experience, search readiness, AI visibility, social sharing, security signals, and domain health. Then decide whether you want ROALLA to interpret the results with you.",
    label: "Enter your website address",
    placeholder: "yourbusiness.ca",
    button: "Start my free review",
    note: "No email or account required for the automated snapshot. We review one public landing page and do not change your website.",
    previewEyebrow: "Your review at a glance",
    previewTitle: "One clear view of what deserves attention",
    previewItems: [
      ["Website experience", "82", "Mobile and desktop"],
      ["Search readiness", "91", "Technical signals"],
      ["AI readiness", "68", "Content assistants can use"],
    ],
    differenceEyebrow: "Automation plus senior judgment",
    differenceTitle: "A score is useful. Knowing what to do next is more valuable.",
    automatedTitle: "Free automated snapshot",
    automated: ["Website performance and accessibility", "Search and AI-readiness signals", "Social sharing and contact exposure", "Public security, domain, and email-health signals", "Prioritized technical actions"],
    personalTitle: "Optional personal review",
    personal: ["What the results mean for your actual business", "Which fixes are likely to create the most value", "Where your message or offer is unclear", "A practical sequence based on effort and impact", "A senior ROALLA lead—not a handoff to junior staff"],
    personalCta: "Request my prioritized action plan",
    personalGoal: "I want a prioritized website and AI visibility action plan.",
    commonEyebrow: "Common business problems",
    commonTitle: "The review connects technical signals to customer trust and qualified inquiries.",
    commonFindings: [["Customers cannot quickly tell why they should choose you", "The offer, audience, proof, or next step is unclear on the page that receives campaign traffic."], ["Search engines and AI assistants get an incomplete picture", "Important services, locations, expertise, or trust signals are difficult for machines to find and explain."], ["Technical trust gaps interrupt the journey", "Performance, accessibility, security, email, or contact-path issues create friction before a visitor inquires."]],
    processEyebrow: "How it works",
    processTitle: "From website address to an informed next step",
    steps: [
      ["1", "Run the snapshot", "Enter your public website address and let the assessment check the landing page."],
      ["2", "Review your priorities", "See separate results, plain-language explanations, and recommended actions."],
      ["3", "Choose what happens next", "Use the report yourself or request a focused discussion with ROALLA."],
    ],
    proof: [["30+", "years across technology and transformation"], ["500+", "engagements and initiatives influenced"], ["1", "senior lead accountable from review to action"]],
    fitTitle: "Designed for organizations that need clarity before another project",
    fit: ["Your website exists, but you are unsure whether it supports sales", "You want to know how AI assistants may interpret your business", "You need priorities before approving redesign or SEO work", "You prefer a remote, evidence-led conversation instead of a sales visit"],
    limitsTitle: "Clear scope and privacy",
    limitsBody: "The automated review checks public signals from the landing page you submit. It is not a penetration test, legal audit, full-site crawl, or guarantee of rankings. Your contact information is requested only if you choose to ask for a personal review.",
    privacyLink: "Read ROALLA's privacy policy",
    faqTitle: "Questions before you begin",
    faqs: [
      ["Is the automated review really free?", "Yes. You can see and save the automated results without entering an email address."],
      ["Does ROALLA need access to my website?", "No. The first review uses information already available publicly from the website address you enter."],
      ["Will this tell me whether I need a new website?", "It provides evidence, not a predetermined sales answer. Often targeted improvements are more appropriate than replacing the whole site."],
      ["What happens if I request a personal review?", "ROALLA will use your results and business context to recommend priorities. You choose whether to proceed with any further work."],
    ],
    finalTitle: "Start with evidence, not a sales pitch.",
    finalBody: "Run the snapshot now. Keep the report, compare progress later, and involve ROALLA only when the results justify a conversation.",
    finalButton: "Review my website",
  },
  fr: {
    metadataTitle: "Évaluation de la visibilité Web et IA | ROALLA",
    metadataDescription: "Obtenez un aperçu gratuit de la visibilité Web et IA, puis demandez une analyse pratique des améliorations prioritaires.",
    eyebrow: "Évaluation de la visibilité Web et IA",
    title: "Les clients et les assistants IA peuvent-ils trouver, comprendre et juger votre entreprise fiable?",
    subtitle: "Commencez par un aperçu automatisé gratuit de l’expérience Web, de la recherche, de la visibilité IA, du partage social, de la sécurité et de la santé du domaine. Demandez ensuite à ROALLA d’interpréter les résultats avec vous, si vous le souhaitez.",
    label: "Entrez l’adresse de votre site Web",
    placeholder: "votreentreprise.ca",
    button: "Commencer l’évaluation gratuite",
    note: "Aucun courriel ni compte requis. Nous examinons une page d’arrivée publique et ne modifions pas votre site.",
    previewEyebrow: "Votre évaluation en bref",
    previewTitle: "Une vue claire de ce qui mérite votre attention",
    previewItems: [["Expérience Web", "82", "Mobile et ordinateur"], ["Préparation à la recherche", "91", "Signaux techniques"], ["Préparation à l’IA", "68", "Contenu utilisable par les assistants"]],
    differenceEyebrow: "Automatisation et jugement expérimenté",
    differenceTitle: "Un score est utile. Savoir quoi faire ensuite a plus de valeur.",
    automatedTitle: "Aperçu automatisé gratuit",
    automated: ["Performance et accessibilité", "Signaux de recherche et de préparation à l’IA", "Partage social et exposition des coordonnées", "Signaux publics de sécurité, de domaine et de courriel", "Actions techniques prioritaires"],
    personalTitle: "Analyse personnelle facultative",
    personal: ["Ce que les résultats signifient pour votre entreprise", "Les correctifs susceptibles de créer le plus de valeur", "Les points où votre message ou votre offre manque de clarté", "Une séquence pratique selon l’effort et l’impact", "Un responsable ROALLA expérimenté, sans transfert à du personnel junior"],
    personalCta: "Demander mon plan d’action priorisé",
    personalGoal: "Je veux un plan d’action priorisé pour la visibilité Web et IA.",
    commonEyebrow: "Problèmes d’affaires courants",
    commonTitle: "L’évaluation relie les signaux techniques à la confiance des clients et aux demandes qualifiées.",
    commonFindings: [["Les clients ne comprennent pas rapidement pourquoi vous choisir", "L’offre, le public, les preuves ou la prochaine étape manquent de clarté sur la page qui reçoit le trafic de campagne."], ["Les moteurs de recherche et assistants IA obtiennent une image incomplète", "Les services, régions, expertises ou signaux de confiance importants sont difficiles à trouver et à expliquer."], ["Des lacunes techniques interrompent le parcours", "La performance, l’accessibilité, la sécurité, le courriel ou le parcours de contact créent de la friction avant la demande."]],
    processEyebrow: "Fonctionnement",
    processTitle: "De l’adresse Web à une prochaine étape éclairée",
    steps: [["1", "Lancez l’aperçu", "Entrez l’adresse publique et laissez l’évaluation vérifier la page d’arrivée."], ["2", "Examinez les priorités", "Consultez les résultats distincts, les explications simples et les actions recommandées."], ["3", "Choisissez la suite", "Utilisez le rapport vous-même ou demandez une discussion ciblée avec ROALLA."]],
    proof: [["30+", "ans en technologie et transformation"], ["500+", "mandats et initiatives influencés"], ["1", "responsable expérimenté du diagnostic à l’action"]],
    fitTitle: "Pour les organisations qui veulent de la clarté avant un autre projet",
    fit: ["Votre site existe, mais vous ignorez s’il soutient les ventes", "Vous voulez savoir comment les assistants IA interprètent votre entreprise", "Vous avez besoin de priorités avant d’approuver une refonte ou du référencement", "Vous préférez une discussion à distance fondée sur des preuves"],
    limitsTitle: "Portée et confidentialité claires",
    limitsBody: "L’évaluation automatisée vérifie les signaux publics de la page d’arrivée soumise. Il ne s’agit pas d’un test d’intrusion, d’un audit juridique, d’une exploration complète du site ni d’une garantie de classement. Vos coordonnées ne sont demandées que si vous sollicitez une analyse personnelle.",
    privacyLink: "Lire la politique de confidentialité de ROALLA",
    faqTitle: "Questions avant de commencer",
    faqs: [["L’évaluation automatisée est-elle vraiment gratuite?", "Oui. Vous pouvez voir et enregistrer les résultats sans fournir d’adresse courriel."], ["ROALLA doit-elle accéder à mon site?", "Non. La première évaluation utilise uniquement l’information publique de l’adresse saisie."], ["Cela indiquera-t-il si j’ai besoin d’un nouveau site?", "L’outil fournit des preuves, pas une réponse commerciale prédéterminée. Des améliorations ciblées conviennent souvent mieux qu’un remplacement complet."], ["Que se passe-t-il si je demande une analyse personnelle?", "ROALLA utilisera les résultats et votre contexte d’affaires pour recommander des priorités. Vous décidez de la suite."]],
    finalTitle: "Commencez par des preuves, pas par un argumentaire de vente.",
    finalBody: "Lancez l’aperçu maintenant. Conservez le rapport, comparez les progrès et impliquez ROALLA seulement si les résultats justifient une discussion.",
    finalButton: "Évaluer mon site",
  },
} as const;

function pageFor(locale: string) {
  return pages[locale === "fr" ? "fr" : "en"];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = pageFor(locale);
  return buildPageMetadata({ locale, path: "/website-ai-visibility-review", title: page.metadataTitle, description: page.metadataDescription });
}

export default async function WebsiteAiVisibilityReviewPage({ params }: Props) {
  const { locale } = await params;
  const page = pageFor(locale);
  const path = "/website-ai-visibility-review";
  const faqs = page.faqs.map(([question, answer]) => ({ question, answer }));
  const personalReviewParams = new URLSearchParams({
    intent: "visibility",
    from_page: path,
    goal: page.personalGoal,
    campaign: "website-ai-visibility-review",
    offer: page.personalTitle,
    icp: page.fitTitle,
    conversion_source: "campaign_page",
  });
  const personalReviewHref = `/contact?${personalReviewParams.toString()}`;

  return (
    <div className="page-shell bg-white">
      <JsonLd data={[
        breadcrumbJsonLd(locale, [{ name: locale === "fr" ? "Accueil" : "Home", path: "" }, { name: page.eyebrow }]),
        webPageJsonLd(locale, path, page.metadataTitle, page.metadataDescription),
        ...servicePageJsonLd({ locale, path, name: page.eyebrow, description: page.metadataDescription, serviceType: "Website and AI visibility assessment", offers: [{ name: page.automatedTitle, description: page.automated.join(" ") }, { name: page.personalTitle, description: page.personal.join(" ") }], faqs }),
      ]} />

      <main>
        <section id="top" className="relative scroll-mt-24 overflow-hidden bg-slate-950 pb-20 pt-28 text-white lg:pb-28 lg:pt-36">
          <div className="absolute inset-0 opacity-50" aria-hidden>
            <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-brand-gold/15 blur-3xl" />
          </div>
          <div className="container relative mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-light">{page.eyebrow}</p>
              <h1 className="mt-5 max-w-4xl font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">{page.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{page.subtitle}</p>
              <div className="mt-8 max-w-3xl"><VisibilityReviewEntry locale={locale} label={page.label} placeholder={page.placeholder} button={page.button} note={page.note} /></div>
            </div>

            <aside className="rounded-3xl border border-white/15 bg-white/[0.08] p-6 shadow-2xl backdrop-blur sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">{page.previewEyebrow}</p>
              <h2 className="mt-3 font-serif text-2xl font-bold text-white">{page.previewTitle}</h2>
              <div className="mt-6 space-y-4">
                {page.previewItems.map(([name, score, detail], index) => (
                  <div key={name} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between gap-4"><span className="font-semibold text-white">{name}</span><span className={`text-2xl font-bold ${index === 2 ? "text-amber-300" : "text-emerald-300"}`}>{score}</span></div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${index === 2 ? "w-[68%] bg-amber-300" : index === 1 ? "w-[91%] bg-emerald-300" : "w-[82%] bg-emerald-300"}`} /></div>
                    <p className="mt-2 text-xs text-slate-400">{detail}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{page.differenceEyebrow}</p>
            <h2 className="mt-4 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{page.differenceTitle}</h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-2">
            {[
              [SearchCheck, page.automatedTitle, page.automated, "border-primary/20 bg-primary/[0.04]"],
              [Sparkles, page.personalTitle, page.personal, "border-brand-gold/50 bg-brand-gold/10"],
            ].map(([Icon, title, items, tone]) => {
              const TileIcon = Icon as typeof SearchCheck;
              return <article key={String(title)} className={`rounded-2xl border p-7 sm:p-9 ${tone}`}><TileIcon className="h-8 w-8 text-primary-dark" aria-hidden /><h3 className="mt-5 font-serif text-2xl font-bold text-slate-950">{String(title)}</h3><ul className="mt-6 space-y-3">{(items as readonly string[]).map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}</ul>{String(title) === page.personalTitle ? <a href={`/${locale}${personalReviewHref}`} className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark">{page.personalCta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></a> : null}</article>;
            })}
          </div>
          <div className="mx-auto mt-16 max-w-6xl">
            <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{page.commonEyebrow}</p><h2 className="mt-4 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{page.commonTitle}</h2></div>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">{page.commonFindings.map(([title, body]) => <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><h3 className="font-serif text-xl font-bold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{body}</p></article>)}</div>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{page.processEyebrow}</p><h2 className="mt-4 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{page.processTitle}</h2></div>
            <ol className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3">{page.steps.map(([number, title, body]) => <li key={number} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">{number}</span><h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{body}</p></li>)}</ol>
            <dl className="mx-auto mt-12 grid max-w-5xl gap-px overflow-hidden rounded-2xl bg-slate-200 sm:grid-cols-3">{page.proof.map(([number, label]) => <div key={number} className="bg-slate-950 p-7 text-center text-white"><dt className="text-4xl font-bold text-brand-gold">{number}</dt><dd className="mt-2 text-sm leading-5 text-slate-300">{label}</dd></div>)}</dl>
          </div>
        </section>

        <section className="container mx-auto grid gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <article className="rounded-2xl border border-slate-200 p-7 sm:p-9"><Gauge className="h-8 w-8 text-primary-dark" aria-hidden /><h2 className="mt-4 font-serif text-3xl font-bold text-slate-950">{page.fitTitle}</h2><ul className="mt-6 grid gap-4 sm:grid-cols-2">{page.fit.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}</ul></article>
          <aside className="rounded-2xl bg-slate-950 p-7 text-white sm:p-9"><ShieldCheck className="h-8 w-8 text-primary-light" aria-hidden /><h2 className="mt-4 font-serif text-2xl font-bold text-white">{page.limitsTitle}</h2><p className="mt-4 text-sm leading-6 text-slate-300">{page.limitsBody}</p><Link href="/privacy" className="mt-5 inline-flex items-center font-semibold text-brand-gold underline underline-offset-4">{page.privacyLink}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link></aside>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><div className="text-center"><Bot className="mx-auto h-9 w-9 text-primary-dark" aria-hidden /><h2 className="mt-4 font-serif text-3xl font-bold text-slate-950">{page.faqTitle}</h2></div><div className="mt-10 space-y-3">{page.faqs.map(([question, answer]) => <details key={question} className="group rounded-xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer list-none font-semibold text-slate-950">{question}</summary><p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p></details>)}</div></div>
        </section>

        <section id="start-review" className="bg-primary py-16 text-white">
          <div className="container mx-auto flex max-w-6xl flex-col gap-7 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><div><h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">{page.finalTitle}</h2><p className="mt-3 max-w-3xl text-primary-lighter">{page.finalBody}</p></div><a href="#top" className="inline-flex min-h-[50px] shrink-0 items-center justify-center rounded-xl bg-brand-gold px-7 py-3 font-bold text-slate-950 hover:bg-brand-gold-light">{page.finalButton}<ArrowRight className="ml-2 h-5 w-5" aria-hidden /></a></div>
        </section>
      </main>
    </div>
  );
}
