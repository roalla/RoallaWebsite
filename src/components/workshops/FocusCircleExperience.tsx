"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ScheduleButton from "@/components/ScheduleButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import Reveal from "@/components/motion/Reveal";
import FocusCirclePresentation from "@/components/workshops/FocusCirclePresentation";
import {
  focusCircleCopy,
  formatFocusTemplate,
  type FocusCircleCopy,
  type FocusPractice,
} from "@/lib/workshops/focus-circle-content";
import {
  focusCirclePageUrl,
  focusCirclePdfFiles,
  focusCirclePdfHref,
  focusCircleQrHref,
} from "@/lib/workshops/hosted-workshops";

const PLAN_PREFIX = "roalla-focus-circle-plan";

export default function FocusCircleExperience() {
  const locale = useLocale();
  const copy = focusCircleCopy(locale);
  const [plan, setPlan] = useState(["", "", ""]);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const pageUrl = focusCirclePageUrl(locale);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(`${PLAN_PREFIX}-${locale}`) ?? "null");
      if (Array.isArray(stored) && stored.length === 3) {
        setPlan(stored.map(String));
      } else {
        setPlan(["", "", ""]);
      }
    } catch {
      setPlan(["", "", ""]);
    }
    setReady(true);
  }, [locale]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(`${PLAN_PREFIX}-${locale}`, JSON.stringify(plan));
      setSaved(true);
      const timer = window.setTimeout(() => setSaved(false), 1400);
      return () => window.clearTimeout(timer);
    } catch {
      return undefined;
    }
  }, [locale, plan, ready]);

  function updatePlan(itemIndex: number, value: string) {
    setPlan((current) => current.map((item, index) => (index === itemIndex ? value : item)));
  }

  return (
    <div id="workshop-content">
      <PrintSheet copy={copy} plan={plan} pageUrl={pageUrl} />
      <Breadcrumb
        items={[
          { label: copy.breadcrumbWorkshops, href: "/programs/workshops" },
          { label: copy.title },
        ]}
      />

      <header className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mb-10 shadow-xl">
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="relative px-6 py-10 lg:px-12 lg:py-14 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">{copy.eyebrow}</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-serif font-bold text-white leading-tight">{copy.title}</h1>
          <p className="mt-5 text-xl text-slate-200 leading-relaxed">{copy.promise}</p>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">{copy.intro}</p>
          <div className="mt-8">
            <ScheduleButton variant="primary" size="lg" icon intent="workshop" need="focus-circle">
              {copy.hostCta}
            </ScheduleButton>
          </div>
        </div>
      </header>

      <FocusCirclePresentation copy={copy} />

      <Reveal as="section" className="mt-16 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{copy.storyEyebrow}</p>
          <h2 className="mt-3 text-3xl font-serif font-bold text-slate-900">{copy.storyTitle}</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">{copy.storyBody}</p>
        </div>
        <aside className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-700 leading-relaxed border-l-2 border-primary pl-4">{copy.storyAside}</p>
        </aside>
      </Reveal>

      <section className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{copy.welcomeEyebrow}</p>
        <h2 className="mt-3 text-3xl font-serif font-bold text-slate-900">{copy.welcomeTitle}</h2>
        <p className="mt-4 max-w-3xl text-slate-600 leading-relaxed">{copy.welcomeBody}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {copy.audiences.map((audience) => (
            <li key={audience} className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700">
              {audience}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{copy.pillarsEyebrow}</p>
        <h2 className="mt-3 text-3xl font-serif font-bold text-slate-900">{copy.pillarsTitle}</h2>
        <ol className="mt-8 grid md:grid-cols-2 gap-5">
          {copy.pillars.map((pillar, index) => (
            <li key={pillar.name} className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-serif text-xl font-bold text-slate-900">{pillar.name}</h3>
              <p className="mt-1 text-sm font-medium text-slate-800">{pillar.title}</p>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{pillar.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <Practice copy={copy} />

      <section className="mt-16 grid lg:grid-cols-[auto_1fr] gap-8 items-center">
        <Image
          src="/images/team/steven-robin.webp"
          alt={copy.facilitatorPhotoAlt}
          width={280}
          height={340}
          className="w-full max-w-xs rounded-2xl object-cover border border-slate-200"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{copy.facilitatorEyebrow}</p>
          <h2 className="mt-3 text-3xl font-serif font-bold text-slate-900">{copy.facilitatorTitle}</h2>
          <p className="mt-4 font-semibold text-slate-900">{copy.facilitatorName}</p>
          <p className="text-sm text-slate-500">{copy.facilitatorRole}</p>
          <p className="mt-4 text-slate-600 leading-relaxed max-w-2xl">{copy.facilitatorBody}</p>
        </div>
      </section>

      <section className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{copy.guidesEyebrow}</p>
        <h2 className="mt-3 text-3xl font-serif font-bold text-slate-900">{copy.guidesTitle}</h2>
        <ol className="mt-8 grid md:grid-cols-2 gap-5">
          {copy.guides.map((guide, index) => (
            <li key={guide.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold text-primary-dark">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-serif text-lg font-bold text-slate-900">{guide.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{guide.body}</p>
              <ul className="mt-3 space-y-1.5">
                {guide.points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 rounded-2xl border border-slate-300 bg-slate-50 p-6 lg:p-8" aria-labelledby="focus-plan-title">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{copy.planEyebrow}</p>
        <h2 id="focus-plan-title" className="mt-3 text-3xl font-serif font-bold text-slate-900">
          {copy.planTitle}
        </h2>
        <p className="mt-3 text-slate-600">{copy.planIntro}</p>
        <p className="mt-2 text-sm text-slate-500">{copy.planStay}</p>
        <div className="mt-6 grid gap-5">
          {copy.planFields.map((field, index) => (
            <label key={field.label} className="block">
              <span className="text-sm font-semibold text-slate-900">{field.label}</span>
              <span className="block text-sm text-slate-500 mb-2">{field.hint}</span>
              <textarea
                value={plan[index]}
                onChange={(event) => updatePlan(index, event.target.value)}
                rows={3}
                placeholder={copy.planPlaceholder}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center rounded-lg bg-primary-dark px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-darker"
          >
            {copy.planPrint}
          </button>
          <button
            type="button"
            onClick={() => setPlan(["", "", ""])}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:border-primary"
          >
            {copy.planClear}
          </button>
          {saved ? (
            <p className="text-sm text-slate-500" role="status">
              {copy.planSaved}
            </p>
          ) : null}
        </div>
      </section>

      <section id="workshop-downloads" className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{copy.downloadsEyebrow}</p>
        <h2 className="mt-3 text-3xl font-serif font-bold text-slate-900">{copy.downloadsTitle}</h2>
        <p className="mt-3 max-w-2xl text-slate-600">{copy.downloadsIntro}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {copy.planPrint}
          </button>
          {copy.downloads.map((item) => {
            const file = focusCirclePdfFiles.find((entry) => entry.id === item.id);
            if (!file) return null;
            return (
              <a
                key={item.id}
                href={focusCirclePdfHref(file.file, locale)}
                download
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:border-primary"
              >
                {item.label}
              </a>
            );
          })}
        </div>
        <div className="mt-6">
          <ScheduleButton variant="primary" size="lg" icon intent="workshop" need="focus-circle">
            {copy.hostCta}
          </ScheduleButton>
        </div>
      </section>

      <section className="mt-16 grid lg:grid-cols-[160px_1fr] gap-6 items-center rounded-2xl border border-slate-200 p-6">
        <img src={focusCircleQrHref(locale)} alt={copy.qrAlt} width={160} height={160} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{copy.qrLabel}</p>
          <h2 className="mt-2 text-2xl font-serif font-bold text-slate-900">{copy.qrTitle}</h2>
          <p className="mt-3 text-slate-600 leading-relaxed">{copy.qrBody}</p>
          <p className="mt-3 text-sm font-semibold text-slate-900 break-all">{pageUrl.replace("https://www.", "")}</p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-serif font-bold text-slate-900">{copy.faqTitle}</h2>
        <div className="mt-6 divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white">
          {copy.faqs.map((item) => (
            <details key={item.q} className="px-5 py-4">
              <summary className="cursor-pointer font-semibold text-slate-900">{item.q}</summary>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-slate-900 px-6 py-10 text-white">
        <h2 className="text-3xl font-serif font-bold">{copy.hostCta}</h2>
        <p className="mt-3 max-w-2xl text-slate-300">{copy.intro}</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <ScheduleButton
            variant="secondary"
            size="lg"
            icon
            intent="workshop"
            need="focus-circle"
            className="bg-white text-slate-900 hover:bg-slate-100 border-0"
          >
            {copy.hostCta}
          </ScheduleButton>
          <Link href="/programs/workshops" className="inline-flex items-center text-sm font-medium text-primary-light hover:text-white">
            {copy.breadcrumbWorkshops}
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
        </div>
      </section>

      <StickyMobileCTA label={copy.hostCta} intent="workshop" need="focus-circle" />
    </div>
  );
}

function Practice({ copy }: { copy: FocusCircleCopy }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const scenario: FocusPractice | undefined = copy.practice[index];

  useEffect(() => {
    setIndex(0);
    setChoice(null);
    setScore(0);
    setDone(false);
  }, [copy.practice]);

  if (!scenario) return null;

  function choose(next: number) {
    if (choice !== null || !scenario) return;
    setChoice(next);
    if (next === scenario.correct) setScore((current) => current + 1);
  }

  return (
    <section className="mt-16 rounded-2xl border border-slate-300 bg-white p-6 lg:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{copy.practiceEyebrow}</p>
      <h2 className="mt-3 text-3xl font-serif font-bold text-slate-900">{copy.practiceTitle}</h2>
      <p className="mt-3 max-w-2xl text-slate-600">{copy.practiceIntro}</p>
      {done ? (
        <div className="mt-8">
          <p className="text-lg font-semibold text-slate-900">
            {formatFocusTemplate(copy.practiceScore, { score, total: copy.practice.length })}
          </p>
          <button
            type="button"
            onClick={() => {
              setIndex(0);
              setChoice(null);
              setScore(0);
              setDone(false);
            }}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
          >
            {copy.practiceRestart}
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <p className="text-sm text-slate-500">
            {formatFocusTemplate(copy.practiceOf, { current: index + 1, total: copy.practice.length })}
          </p>
          <h3 className="mt-2 text-xl font-serif font-bold text-slate-900">{scenario.title}</h3>
          <p className="mt-3 text-slate-700">{scenario.prompt}</p>
          <p className="mt-4 text-sm font-semibold text-slate-900">{copy.practiceQuestion}</p>
          <div className="mt-3 grid gap-2">
            {scenario.choices.map((option, optionIndex) => {
              const selected = choice === optionIndex;
              const revealed = choice !== null;
              const correct = optionIndex === scenario.correct;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => choose(optionIndex)}
                  disabled={revealed}
                  className={`text-left rounded-lg border px-4 py-3 text-sm ${
                    revealed && correct
                      ? "border-primary bg-primary/10"
                      : selected
                        ? "border-slate-400 bg-slate-50"
                        : "border-slate-200 hover:border-primary"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {choice !== null ? (
            <div className="mt-5 rounded-lg bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.practiceRealLife}</p>
              <p className="mt-2 text-sm text-slate-700">{scenario.response}</p>
              <button
                type="button"
                onClick={() => {
                  if (index === copy.practice.length - 1) {
                    setDone(true);
                    return;
                  }
                  setIndex((current) => current + 1);
                  setChoice(null);
                }}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                {copy.practiceNext}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

function PrintSheet({
  copy,
  plan,
  pageUrl,
}: {
  copy: FocusCircleCopy;
  plan: string[];
  pageUrl: string;
}) {
  return (
    <>
      <style>{`
        #focus-circle-print { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); }
        @media print {
          body * { visibility: hidden; }
          #focus-circle-print, #focus-circle-print * { visibility: visible; }
          #focus-circle-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            overflow: visible;
            clip: auto;
            background: white;
            color: #07111f;
            padding: 24px;
          }
        }
      `}</style>
      <article id="focus-circle-print" aria-hidden="true">
        <p>ROALLA</p>
        <h1>{copy.title}</h1>
        <p>{copy.promise}</p>
        {copy.planFields.map((field, index) => (
          <section key={field.label}>
            <h2>{field.label}</h2>
            <p>{plan[index] || " "}</p>
          </section>
        ))}
        <p>{pageUrl}</p>
      </article>
    </>
  );
}
