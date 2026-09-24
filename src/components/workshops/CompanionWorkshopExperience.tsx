"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BellOff,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Layers3,
  Maximize2,
  Minimize2,
  MoveRight,
  ShieldCheck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ScheduleButton from "@/components/ScheduleButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import Reveal from "@/components/motion/Reveal";
import type {
  CompanionWorkshopCopy,
  WorkshopPractice,
  WorkshopSlide,
  WorkshopStage,
} from "@/lib/workshops/companion-workshops-content";

const PLAN_PREFIX = "roalla-companion-workshop-plan";

export default function CompanionWorkshopExperience({ copy }: { copy: CompanionWorkshopCopy }) {
  const [plan, setPlan] = useState(["", "", ""]);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(`${PLAN_PREFIX}-${copy.id}`) ?? "null");
      setPlan(Array.isArray(stored) && stored.length === 3 ? stored.map(String) : ["", "", ""]);
    } catch {
      setPlan(["", "", ""]);
    }
    setReady(true);
  }, [copy.id]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(`${PLAN_PREFIX}-${copy.id}`, JSON.stringify(plan));
      setSaved(true);
      const timer = window.setTimeout(() => setSaved(false), 1200);
      return () => window.clearTimeout(timer);
    } catch {
      return undefined;
    }
  }, [copy.id, plan, ready]);

  return (
    <div id="workshop-content">
      <PrintSheet copy={copy} plan={plan} />
      <style jsx global>{`
        .companion-workshop-print { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); }
        @media print {
          body * { visibility: hidden !important; }
          .companion-workshop-print, .companion-workshop-print * { visibility: visible !important; }
          .companion-workshop-print { position: static; width: auto; height: auto; overflow: visible; clip: auto; padding: 2rem; color: #0f172a; }
          .companion-workshop-print h1 { font-size: 28pt; margin-bottom: 0.5rem; }
          .companion-workshop-print h2 { font-size: 14pt; margin-top: 1.5rem; }
          .companion-workshop-print p { white-space: pre-wrap; }
        }
      `}</style>
      <Breadcrumb items={[{ label: copy.workshopsLabel, href: "/programs/workshops" }, { label: copy.title }]} />

      <header className="relative mb-10 min-h-[31rem] overflow-hidden rounded-2xl border border-slate-700 bg-[#07111f] shadow-xl">
        <Image src={copy.heroImage} alt={copy.heroAlt} fill priority unoptimized sizes="(max-width: 768px) 100vw, 800px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07111f] via-[#07111f]/90 to-[#07111f]/15" aria-hidden />
        <div className="relative flex min-h-[31rem] max-w-3xl flex-col justify-center px-6 py-12 lg:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">{copy.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-serif font-bold leading-tight text-white md:text-6xl">{copy.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-slate-100">{copy.promise}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">{copy.intro}</p>
          <div className="mt-8"><ScheduleButton variant="primary" size="lg" icon intent="workshop" need={copy.id}>{copy.hostCta}</ScheduleButton></div>
        </div>
      </header>

      <WorkshopPresentation copy={copy} />

      <Reveal as="section" className="mt-16 grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Eyebrow>{copy.storyEyebrow}</Eyebrow>
          <h2 className="mt-3 text-3xl font-serif font-bold text-slate-900">{copy.storyTitle}</h2>
          <p className="mt-4 leading-relaxed text-slate-600">{copy.storyBody}</p>
        </div>
        <aside className="rounded-xl border border-slate-200 bg-slate-50 p-6"><p className="border-l-2 border-primary pl-4 font-serif text-xl leading-snug text-slate-800">{copy.storyAside}</p></aside>
      </Reveal>

      <section className="mt-16">
        <Eyebrow>{copy.frameworkEyebrow}</Eyebrow>
        <h2 className="mt-3 text-3xl font-serif font-bold text-slate-900">{copy.frameworkTitle}</h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-2">
          {copy.framework.map((item, index) => (
            <li key={item.name} className="workshop-tile rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">0{index + 1} · {item.name}</p>
              <h3 className="mt-2 font-serif text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <Practice copy={copy} />

      <section className="mt-16 grid items-center gap-8 lg:grid-cols-[12rem_1fr]">
        <Image src="/images/team/steven-robin.webp" alt="Steven Robin" width={176} height={220} sizes="176px" quality={55} className="mx-auto aspect-[4/5] w-44 rounded-2xl border border-slate-200 object-cover" />
        <div><Eyebrow>{copy.facilitatorEyebrow}</Eyebrow><h2 className="mt-3 text-3xl font-serif font-bold text-slate-900">{copy.facilitatorTitle}</h2><p className="mt-4 max-w-3xl leading-relaxed text-slate-600">{copy.facilitatorBody}</p></div>
      </section>

      <section className="mt-16">
        <Eyebrow>{copy.toolsEyebrow}</Eyebrow>
        <h2 className="mt-3 text-3xl font-serif font-bold text-slate-900">{copy.toolsTitle}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {copy.tools.map((tool) => (
            <article key={tool.title} className="workshop-tile rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-serif text-xl font-bold text-slate-900">{tool.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{tool.body}</p>
              <ul className="mt-4 space-y-2">{tool.points.map((point) => <li key={point} className="flex gap-2 text-sm text-slate-700"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{point}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-slate-300 bg-slate-50 p-6 lg:p-8" aria-labelledby={`${copy.id}-plan-title`}>
        <Eyebrow>{copy.planEyebrow}</Eyebrow>
        <h2 id={`${copy.id}-plan-title`} className="mt-3 text-3xl font-serif font-bold text-slate-900">{copy.planTitle}</h2>
        <p className="mt-3 text-slate-600">{copy.planIntro}</p>
        <div className="mt-6 grid gap-5">
          {copy.planFields.map((field, index) => (
            <label key={field.label} className="block">
              <span className="text-sm font-semibold text-slate-900">{field.label}</span>
              <span className="mb-2 block text-sm text-slate-500">{field.hint}</span>
              <textarea value={plan[index]} onChange={(event) => setPlan((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} rows={3} placeholder={copy.planPlaceholder} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary" />
            </label>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => window.print()} className="rounded-lg bg-primary-dark px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-darker">{copy.planPrint}</button>
          <button type="button" onClick={() => setPlan(["", "", ""])} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:border-primary">{copy.planClear}</button>
          {saved ? <p className="text-sm text-slate-500" role="status">{copy.planSaved}</p> : null}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-serif font-bold text-slate-900">{copy.faqTitle}</h2>
        <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">{copy.faqs.map((item) => <details key={item.q} className="px-5 py-4"><summary className="cursor-pointer font-semibold text-slate-900">{item.q}</summary><p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p></details>)}</div>
      </section>

      <section className="mt-16 rounded-2xl bg-slate-900 px-6 py-10 text-white">
        <h2 className="text-3xl font-serif font-bold">{copy.hostCta}</h2>
        <p className="mt-3 max-w-2xl text-slate-300">{copy.intro}</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <ScheduleButton variant="secondary" size="lg" icon intent="workshop" need={copy.id} className="border-0 bg-white text-slate-900 hover:bg-slate-100">{copy.hostCta}</ScheduleButton>
          <Link href="/programs/workshops" className="inline-flex items-center text-sm font-medium text-primary-light hover:text-white">{copy.workshopsLabel}<ArrowRight className="ml-1.5 h-4 w-4" /></Link>
        </div>
      </section>
      <StickyMobileCTA label={copy.hostCta} intent="workshop" need={copy.id} />
    </div>
  );
}

function WorkshopPresentation({ copy }: { copy: CompanionWorkshopCopy }) {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<"read" | "present">("read");
  const [fullscreen, setFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);

  const goTo = useCallback((next: number) => setIndex(Math.max(0, Math.min(copy.slides.length - 1, next))), [copy.slides.length]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement | null)?.closest("input, textarea, select")) return;
      if (event.key === "ArrowLeft") goTo(index - 1);
      if (event.key === "ArrowRight") goTo(index + 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  useEffect(() => {
    const onFullscreen = () => setFullscreen(document.fullscreenElement === viewerRef.current);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (viewerRef.current?.requestFullscreen) { setMode("present"); await viewerRef.current.requestFullscreen(); }
  }

  const slide = copy.slides[index];
  const presenting = mode === "present" || fullscreen;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#07111f] pb-5 text-white shadow-xl">
      <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-5 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-light">{copy.viewerLabel}</p><p className="text-sm text-slate-400">{copy.slideOf.replace("{current}", String(index + 1)).replace("{total}", String(copy.slides.length))}</p></div>
      <p className="mt-2 px-5 text-sm text-slate-400 sm:px-6">{copy.viewerHelp}</p>
      <div className="mt-4 flex flex-wrap gap-2 px-5 sm:px-6" role="group" aria-label={copy.viewerLabel}>
        <ModeButton active={mode === "read"} onClick={() => setMode("read")}>{copy.readMode}</ModeButton>
        <ModeButton active={mode === "present"} onClick={() => setMode("present")}>{copy.presentMode}</ModeButton>
      </div>
      <nav className="mt-4 flex gap-2 overflow-x-auto px-5 pb-1 sm:px-6" aria-label={copy.viewerLabel}>{copy.slides.map((item, itemIndex) => <button key={`${item.kicker}-${itemIndex}`} type="button" onClick={() => goTo(itemIndex)} aria-current={itemIndex === index ? "step" : undefined} className={`h-2.5 w-8 shrink-0 rounded-full ${itemIndex === index ? "bg-brand-gold" : "bg-white/15 hover:bg-white/30"}`}><span className="sr-only">{itemIndex + 1}: {item.title}</span></button>)}</nav>

      <div ref={viewerRef} tabIndex={0} onTouchStart={(event) => { touchStart.current = event.changedTouches[0]?.clientX ?? null; }} onTouchEnd={(event) => { if (touchStart.current !== null && Math.abs(event.changedTouches[0].clientX - touchStart.current) > 48) goTo(index + (event.changedTouches[0].clientX < touchStart.current ? 1 : -1)); touchStart.current = null; }} className="mx-4 mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#07111f] outline-none focus-visible:ring-2 focus-visible:ring-brand-gold sm:mx-6">
        <Slide slide={slide} copy={copy} presenting={presenting} index={index} />
        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-4 py-4 sm:px-6">
          <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} className={controlClass()}><ChevronLeft className="h-4 w-4" />{copy.previous}</button>
          <p className="text-sm text-slate-300">{index + 1} / {copy.slides.length}</p>
          <button type="button" onClick={() => goTo(index + 1)} disabled={index === copy.slides.length - 1} className={controlClass()}>{copy.next}<ChevronRight className="h-4 w-4" /></button>
          <button type="button" onClick={() => void toggleFullscreen()} className={`${controlClass()} sm:ml-auto`}>{fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}{fullscreen ? copy.exitFullscreen : copy.fullscreen}</button>
        </div>
      </div>
      <details className="mx-4 mt-4 rounded-lg border border-white/10 px-4 py-3 sm:mx-6"><summary className="cursor-pointer text-sm font-semibold text-white">{copy.notesLabel}</summary><p className="mt-2 text-sm text-slate-300">{slide.notes}</p></details>
    </div>
  );
}

function Slide({ slide, copy, presenting, index }: { slide: WorkshopSlide; copy: CompanionWorkshopCopy; presenting: boolean; index: number }) {
  const points = (slide.points ?? []).map((point) => { const [label, ...detail] = point.split("|"); return { label, detail: detail.join("|") }; });
  const photo = slide.visual === "photo";
  return (
    <article className={`relative flex min-h-[31rem] flex-col overflow-hidden ${presenting ? "md:min-h-[min(76vh,52rem)]" : "md:min-h-[34rem]"}`} aria-roledescription="slide" aria-label={`${index + 1}: ${slide.title}`}>
      {photo ? <><Image src={copy.heroImage} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 640px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-[#07111f] via-[#07111f]/90 to-[#07111f]/20" /></> : <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,180,197,0.18),transparent_50%)]" />}
      <div className="relative flex items-center justify-between px-5 pt-5 sm:px-8"><p className="text-[11px] font-semibold tracking-[0.32em]">ROALLA</p><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-light">{slide.kicker}</p></div>
      <div className={`relative grid flex-1 items-center gap-8 px-5 py-8 sm:px-8 md:grid-cols-[0.9fr_1.1fr] ${photo ? "md:grid-cols-[0.75fr_1.25fr]" : ""}`}>
        <div className="z-10"><div className="mb-4 h-0.5 w-12 bg-brand-gold" /><h3 className={`${presenting ? "text-4xl sm:text-6xl" : "text-3xl sm:text-5xl"} max-w-3xl font-serif font-bold leading-[1.04] text-white`}>{slide.title}</h3><p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">{slide.body}</p>{slide.statement ? <p className="mt-5 border-l-2 border-brand-gold pl-4 font-serif text-xl text-white sm:text-2xl">{slide.statement}</p> : null}{!presenting && points.length ? <ul className="mt-5 grid gap-2 sm:grid-cols-2">{points.map((point) => <li key={point.label} className="rounded-lg border border-white/10 bg-black/20 p-2.5 text-sm text-slate-300"><strong className="text-white">{point.label}</strong>{point.detail ? ` — ${point.detail}` : ""}</li>)}</ul> : null}</div>
        <div className={photo ? "hidden md:block" : "min-h-[15rem]"}><SlideVisual visual={slide.visual} points={points} /></div>
      </div>
      <StageMotif labels={copy.stages} active={slide.stage} />
      <div className="relative flex items-center justify-between border-t border-white/10 px-5 py-3 text-xs text-slate-400 sm:px-8"><span>{copy.title}</span><span className="font-semibold text-brand-gold">{String(index + 1).padStart(2, "0")}</span></div>
    </article>
  );
}

function SlideVisual({ visual, points }: { visual: WorkshopSlide["visual"]; points: { label: string; detail: string }[] }) {
  const tile = "workshop-tile workshop-tile-dark";
  if (visual === "load") return <div className="relative mx-auto flex max-w-sm flex-col gap-2">{points.map((point, index) => <div key={point.label} className={`${tile} rounded-xl border border-white/15 bg-white/[0.06] p-3 shadow-lg`} style={{ marginLeft: `${index * 1.25}rem` }}><p className="font-semibold text-white">{point.label}</p><p className="text-sm text-slate-300">{point.detail}</p></div>)}</div>;
  if (visual === "path") return <ol className="grid gap-2 sm:grid-cols-4">{points.map((point, index) => <li key={point.label} className={`${tile} relative rounded-xl border border-white/15 bg-white/[0.05] p-3 pt-10`}><span className="absolute right-3 top-2 text-xs font-bold text-brand-gold">0{index + 1}</span><p className="font-semibold">{point.label}</p><p className="mt-1 text-xs text-slate-300">{point.detail}</p></li>)}</ol>;
  if (visual === "choices" || visual === "map" || visual === "separate") return <div className="grid gap-2 sm:grid-cols-2">{points.map((point, index) => <div key={point.label} className={`${tile} rounded-xl border p-3 ${index === 0 ? "border-brand-gold/50 bg-brand-gold/10" : "border-white/15 bg-white/[0.05]"}`}><p className="font-semibold text-white">{point.label}</p><p className="mt-1 text-sm text-slate-300">{point.detail}</p></div>)}</div>;
  if (visual === "script") return <div className="space-y-2">{points.map((point, index) => <div key={point.label} className={`${tile} flex gap-3 rounded-xl border border-white/15 bg-white/[0.05] p-3`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary-light">{index + 1}</span><div><p className="font-semibold text-white">{point.label}</p><p className="text-sm text-slate-300">{point.detail}</p></div></div>)}</div>;
  if (visual === "rhythm") return <div className="relative grid grid-cols-2 gap-3">{points.map((point, index) => <div key={point.label} className={`${tile} rounded-2xl border border-white/15 bg-white/[0.05] p-4`}>{index % 2 === 0 ? <Clock3 className="h-5 w-5 text-brand-gold" /> : <ShieldCheck className="h-5 w-5 text-primary-light" />}<p className="mt-2 font-semibold">{point.label}</p><p className="mt-1 text-sm text-slate-300">{point.detail}</p></div>)}</div>;
  if (visual === "practice" || visual === "plan" || visual === "tools") return <div className="space-y-2">{points.map((point, index) => <div key={point.label} className={`${tile} flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.05] p-3`}><span className="font-serif text-2xl font-bold text-brand-gold">0{index + 1}</span><div><p className="font-semibold">{point.label}</p><p className="text-sm text-slate-300">{point.detail}</p></div>{visual === "plan" ? <Check className="ml-auto h-5 w-5 text-primary-light" /> : null}</div>)}</div>;
  if (visual === "close") return <div className="flex min-h-[15rem] items-center justify-center"><div className="flex h-40 w-40 items-center justify-center rounded-full border border-brand-gold/50 bg-brand-gold/10 shadow-[0_0_60px_rgba(245,185,66,0.15)]">{points.length ? <Layers3 className="h-16 w-16 text-brand-gold" /> : <BellOff className="h-16 w-16 text-brand-gold" />}</div></div>;
  return null;
}

function StageMotif({ labels, active }: { labels: string[]; active: WorkshopStage }) {
  const stages: WorkshopStage[] = ["prepare", "transform", "emerge", "soar"];
  return <ol className="relative mx-5 mb-4 grid grid-cols-4 gap-2 sm:mx-8"><div className="absolute left-[8%] right-[8%] top-2 h-px bg-white/15" />{stages.map((stage, index) => <li key={stage} className="relative flex flex-col items-center gap-1 text-center"><span className={`z-10 h-4 w-4 rounded-full border-2 ${stage === active ? "border-brand-gold bg-brand-gold" : stages.indexOf(active) > index ? "border-primary-light bg-primary-light" : "border-slate-500 bg-[#07111f]"}`} /><span className={`text-[9px] font-semibold uppercase tracking-[0.1em] sm:text-[10px] ${stage === active ? "text-brand-gold" : "text-slate-400"}`}>{labels[index]}</span></li>)}</ol>;
}

function Practice({ copy }: { copy: CompanionWorkshopCopy }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const scenario: WorkshopPractice = copy.practice[index];
  function choose(next: number) { if (choice !== null) return; setChoice(next); if (next === scenario.correct) setScore((current) => current + 1); }
  return <section className="mt-16 rounded-2xl border border-slate-300 bg-white p-6 lg:p-8"><Eyebrow>{copy.practiceEyebrow}</Eyebrow><h2 className="mt-3 text-3xl font-serif font-bold text-slate-900">{copy.practiceTitle}</h2><p className="mt-3 max-w-3xl text-slate-600">{copy.practiceIntro}</p>{done ? <div className="mt-8"><p className="text-lg font-semibold text-slate-900">{copy.practiceScore.replace("{score}", String(score)).replace("{total}", String(copy.practice.length))}</p><button type="button" onClick={() => { setIndex(0); setChoice(null); setScore(0); setDone(false); }} className="mt-4 rounded-lg bg-primary-dark px-4 py-2.5 text-sm font-semibold text-white">{copy.practiceRestart}</button></div> : <div className="mt-8"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-dark">{index + 1} / {copy.practice.length}</p><h3 className="mt-2 font-serif text-2xl font-bold text-slate-900">{scenario.title}</h3><p className="mt-2 text-slate-700">{scenario.prompt}</p><p className="mt-5 text-sm font-semibold text-slate-900">{copy.practiceQuestion}</p><div className="mt-3 grid gap-2">{scenario.choices.map((item, itemIndex) => <button key={item} type="button" onClick={() => choose(itemIndex)} disabled={choice !== null} className={`rounded-lg border px-4 py-3 text-left text-sm ${choice === itemIndex ? itemIndex === scenario.correct ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-rose-400 bg-rose-50 text-rose-900" : "border-slate-300 bg-white text-slate-800 hover:border-primary"}`}>{item}</button>)}</div>{choice !== null ? <div className="mt-4 rounded-lg bg-slate-50 p-4"><p className="text-sm text-slate-700">{scenario.response}</p><button type="button" onClick={() => { if (index === copy.practice.length - 1) setDone(true); else { setIndex((current) => current + 1); setChoice(null); } }} className="mt-3 rounded-lg bg-primary-dark px-4 py-2 text-sm font-semibold text-white">{copy.practiceNext}</button></div> : null}</div>}</section>;
}

function PrintSheet({ copy, plan }: { copy: CompanionWorkshopCopy; plan: string[] }) {
  return <article id={`${copy.id}-print`} aria-hidden="true" className="companion-workshop-print"><h1>{copy.title}</h1><p>{copy.promise}</p>{copy.planFields.map((field, index) => <section key={field.label}><h2>{field.label}</h2><p>{plan[index] || "________________________________________"}</p></section>)}</article>;
}

function Eyebrow({ children }: { children: React.ReactNode }) { return <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{children}</p>; }
function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" aria-pressed={active} onClick={onClick} className={`rounded-full border px-3 py-1.5 text-sm font-medium ${active ? "border-white bg-white text-slate-950" : "border-white/20 text-slate-300"}`}>{children}</button>; }
function controlClass() { return "inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold disabled:opacity-40"; }
