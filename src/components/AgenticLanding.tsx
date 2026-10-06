import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  DatabaseZap,
  GitBranch,
  Library,
  LockKeyhole,
  Network,
  ShieldCheck,
  UserCheck,
  Workflow,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AgenticServiceCopy } from "@/lib/agentic-service-content";

const capabilityIcons = [Bot, Workflow, Network, UserCheck] as const;
const layerIcons = [GitBranch, BrainCircuit, Library] as const;

export default function AgenticLanding({
  locale,
  content,
}: {
  locale: string;
  content: AgenticServiceCopy;
}) {
  return (
    <div className="container mx-auto px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      <header
        className="relative overflow-hidden rounded-3xl bg-slate-950 px-7 py-12 text-white shadow-xl lg:px-12 lg:py-16"
        data-header-tone="dark"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,169,184,.2),transparent_34%),radial-gradient(circle_at_10%_90%,rgba(218,165,32,.12),transparent_34%)]" aria-hidden />
        <div className="relative max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">{content.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-serif font-bold leading-tight text-white md:text-6xl">{content.title}</h1>
          <p className="mt-6 max-w-3xl text-xl font-medium leading-8 text-white">{content.lead}</p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{content.description}</p>
          <p className="mt-5 max-w-3xl border-l-2 border-brand-gold pl-4 text-sm font-semibold leading-6 text-brand-gold">{content.outcome}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={{ pathname: "/contact", query: { goal: "ROALLA Agentic" } }} className="inline-flex min-h-12 items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
              {content.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
            <Link href="/services/automation" className="inline-flex min-h-12 items-center rounded-lg border border-white/25 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
              {content.secondaryCta}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl">
        <nav aria-label={content.journeyLabel} className="relative z-10 -mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-5">
          <ol className="grid gap-2 md:grid-cols-5">
            {content.journey.map((stage, index) => {
              const current = stage.href === "/services/agentic";
              return (
                <li key={`${stage.label}-${index}`} className="relative">
                  <Link href={stage.href as "/services/agentic"} aria-current={current ? "page" : undefined} className={`block h-full rounded-xl border p-3 transition-colors ${current ? "border-primary bg-primary/10" : "border-transparent hover:border-primary/30 hover:bg-slate-50"}`}>
                    <span className="text-[10px] font-bold tracking-widest text-primary-dark">{String(index + 1).padStart(2, "0")}</span>
                    <span className="mt-1 block font-serif font-bold text-slate-950">{stage.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-600">{stage.description}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <section className="py-16">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-dark">{content.capabilitiesEyebrow}</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-serif font-bold text-slate-950 md:text-4xl">{content.capabilitiesTitle}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-7 text-slate-600">{content.capabilitiesDescription}</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {content.capabilities.map((capability, index) => {
              const Icon = capabilityIcons[index];
              return (
                <article key={capability.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10"><Icon className="h-5 w-5 text-primary-dark" aria-hidden /></span>
                  <h3 className="mt-4 text-xl font-serif font-bold text-slate-950">{capability.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{capability.description}</p>
                  <ul className="mt-4 space-y-2">
                    {capability.points.map((point) => <li key={point} className="flex gap-2 text-sm text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{point}</li>)}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">{content.useCasesEyebrow}</p>
          <h2 className="mt-3 text-3xl font-serif font-bold text-white md:text-4xl">{content.useCasesTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {content.useCases.map((useCase, index) => (
              <article key={useCase.title} className="rounded-2xl border border-white/10 bg-white/[.06] p-5">
                <span className="text-xs font-bold text-brand-gold">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-lg font-serif font-bold text-white">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{useCase.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-dark">{content.methodEyebrow}</p>
          <h2 className="mt-3 text-3xl font-serif font-bold text-slate-950 md:text-4xl">{content.methodTitle}</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {content.method.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{index + 1}</span>
                <h3 className="mt-4 font-serif text-lg font-bold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-8 rounded-3xl border border-primary/20 bg-primary/[.04] p-7 sm:p-9 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm"><ShieldCheck className="h-6 w-6 text-primary-dark" aria-hidden /></span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-primary-dark">{content.governanceEyebrow}</p>
            <h2 className="mt-3 text-3xl font-serif font-bold text-slate-950">{content.governanceTitle}</h2>
            <p className="mt-4 leading-7 text-slate-700">{content.governanceDescription}</p>
            <Link href="/ai-policy" className="mt-5 inline-flex items-center text-sm font-bold text-primary-dark hover:underline">{locale === "fr" ? "Lire notre politique d’IA" : "Read our AI policy"}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {content.governance.map((item) => <li key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}
          </ul>
        </section>

        <section className="py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-dark">{content.platformEyebrow}</p>
            <h2 className="mt-3 text-3xl font-serif font-bold text-slate-950 md:text-4xl">{content.platformTitle}</h2>
            <p className="mt-4 text-base leading-7 text-slate-700">{content.platformDescription}</p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {content.platformLayers.map((layer, index) => {
              const Icon = layerIcons[index];
              return <article key={layer.title} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><DatabaseZap className="absolute right-5 top-5 h-4 w-4 text-slate-300" aria-hidden /><Icon className="h-6 w-6 text-primary-dark" aria-hidden /><h3 className="mt-4 text-xl font-serif font-bold text-slate-950">{layer.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{layer.description}</p></article>;
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-brand-gold/50 bg-brand-gold/10 p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-700">{content.starterEyebrow}</p>
          <div className="mt-3 grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-950">{content.starterTitle}</h2>
              <p className="mt-4 leading-7 text-slate-700">{content.starterDescription}</p>
              <p className="mt-4 text-sm font-semibold text-slate-800">{content.starterFit}</p>
            </div>
            <div>
              <ul className="space-y-3">{content.starterIncludes.map((item) => <li key={item} className="flex gap-2 rounded-xl bg-white/80 p-3 text-sm text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}</ul>
              <Link href={{ pathname: "/contact", query: { goal: content.starterTitle } }} className="mt-5 inline-flex min-h-12 items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">{content.starterCta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-serif font-bold text-slate-950">{content.faqTitle}</h2>
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {content.faqs.map(({ question, answer }) => <details key={question} className="py-4"><summary className="cursor-pointer font-semibold text-slate-950">{question}</summary><p className="mt-3 max-w-4xl text-sm leading-6 text-slate-700">{answer}</p></details>)}
          </div>
        </section>

        <section className="rounded-3xl bg-slate-950 p-8 text-white sm:p-10" data-header-tone="dark">
          <h2 className="max-w-3xl text-3xl font-serif font-bold text-white">{content.finalTitle}</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">{content.finalDescription}</p>
          <Link href={{ pathname: "/contact", query: { goal: "ROALLA Agentic" } }} className="mt-7 inline-flex min-h-12 items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">{content.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
        </section>
      </main>
    </div>
  );
}
