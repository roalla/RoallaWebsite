"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { useLocale } from "next-intl";
import {
  formatFocusTemplate,
  type FocusChapter,
  type FocusCircleCopy,
  type FocusSlide,
} from "@/lib/workshops/focus-circle-content";
import { focusCircleQrHref } from "@/lib/workshops/hosted-workshops";
import FocusCircleVisual from "@/components/workshops/FocusCircleVisual";

const SLIDE_KEY = "roalla-focus-circle-slide";
const MODE_KEY = "roalla-focus-circle-view-mode";

export default function FocusCirclePresentation({ copy }: { copy: FocusCircleCopy }) {
  const slides = copy.slides;
  const locale = useLocale();
  const qrSrc = focusCircleQrHref(locale);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<"read" | "present">("read");
  const [modeReady, setModeReady] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenBlocked, setFullscreenBlocked] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const chaptersRef = useRef<HTMLElement>(null);
  const touchStart = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      const bounded = Math.max(0, Math.min(slides.length - 1, next));
      if (bounded === index) return;
      setIndex(bounded);
      try {
        window.localStorage.setItem(SLIDE_KEY, String(bounded));
        const url = `${window.location.pathname}${window.location.search}#slide-${bounded + 1}`;
        window.history.replaceState(null, "", url);
      } catch {
        // Navigation still works when storage is blocked.
      }
    },
    [index, slides.length],
  );

  useEffect(() => {
    try {
      const hashSlide = Number(window.location.hash.replace("#slide-", "")) - 1;
      const storedSlide = Number(window.localStorage.getItem(SLIDE_KEY));
      const resumeAt = Number.isInteger(hashSlide) && hashSlide >= 0 ? hashSlide : storedSlide;
      if (Number.isInteger(resumeAt) && resumeAt >= 0 && resumeAt < slides.length) setIndex(resumeAt);
      const storedMode = window.localStorage.getItem(MODE_KEY);
      if (storedMode === "read" || storedMode === "present") setMode(storedMode);
    } catch {
      // Private browsing can decline storage.
    } finally {
      setModeReady(true);
    }
  }, [slides.length]);

  useEffect(() => {
    if (!modeReady) return;
    try {
      window.localStorage.setItem(MODE_KEY, mode);
    } catch {
      // View mode still works when storage is blocked.
    }
  }, [mode, modeReady]);

  useEffect(() => {
    const onFullscreen = () => {
      const active = document.fullscreenElement === viewerRef.current;
      setFullscreen(active);
      if (active) setMode("present");
    };
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  useEffect(() => {
    const nav = chaptersRef.current;
    const current = nav?.querySelector<HTMLElement>("[data-current='true']");
    if (!nav || !current) return;
    const navBox = nav.getBoundingClientRect();
    const buttonBox = current.getBoundingClientRect();
    nav.scrollBy({ left: buttonBox.left - navBox.left - (navBox.width - buttonBox.width) / 2, behavior: "smooth" });
  }, [index]);

  async function toggleFullscreen() {
    setFullscreenBlocked(false);
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      setMode("present");
      if (viewerRef.current?.requestFullscreen) {
        await viewerRef.current.requestFullscreen();
        viewerRef.current.focus();
        return;
      }
      setFullscreen(true);
    } catch {
      setMode("present");
      setFullscreen(true);
      setFullscreenBlocked(true);
    }
  }

  function finishSwipe(x: number) {
    if (touchStart.current === null) return;
    const distance = x - touchStart.current;
    if (Math.abs(distance) > 48) goTo(index + (distance < 0 ? 1 : -1));
    touchStart.current = null;
  }

  const slide = slides[index];
  const presenting = mode === "present" || fullscreen;
  const currentChapter = [...copy.chapters].reverse().find((chapter) => index >= chapter.slide);
  const stageLabels = copy.deckFooter.split("→").map((stage) => stage.trim());

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#07111f] pb-5 text-white shadow-xl">
        <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-light">{copy.viewerLabel}</p>
          <h2 className="sr-only">{copy.viewerLabel}</h2>
          <p className="text-sm text-slate-400" aria-live="polite">
            {formatFocusTemplate(copy.slideOf, { current: index + 1, total: slides.length })}
          </p>
        </div>
        <p className="mt-2 px-5 text-sm text-slate-400 sm:px-6">{copy.viewerHelp}</p>
        <div className="mt-4 flex flex-wrap gap-2 px-5 sm:px-6" role="group" aria-label={copy.viewModeAria}>
          <ModeButton active={mode === "read"} onClick={() => setMode("read")}>{copy.readMode}</ModeButton>
          <ModeButton active={mode === "present"} onClick={() => setMode("present")}>{copy.presentMode}</ModeButton>
        </div>
        <nav
          ref={chaptersRef}
          aria-label={copy.chaptersLabel}
          className="mt-4 flex gap-2 overflow-x-auto px-5 pb-1 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {copy.chapters.map((chapter) => (
            <ChapterChip key={chapter.id} chapter={chapter} current={currentChapter?.id === chapter.id} onClick={() => goTo(chapter.slide)} />
          ))}
        </nav>

        <div
          ref={viewerRef}
          tabIndex={0}
          onTouchStart={(event) => { touchStart.current = event.changedTouches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}
          className={`mx-4 mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#07111f] outline-none focus-visible:ring-2 focus-visible:ring-brand-gold sm:mx-6 ${fullscreen && !document.fullscreenElement ? "fixed inset-4 z-50 shadow-2xl" : ""}`}
        >
          <SlideBody slide={slide} presenting={presenting} index={index} total={slides.length} stageLabels={stageLabels} qrSrc={qrSrc} qrAlt={copy.qrAlt} />
          <div className="flex flex-wrap items-center gap-3 border-t border-white/10 bg-[#07111f] px-4 py-4 sm:px-6">
            <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} className={controlClass()}>
              <ChevronLeft className="h-4 w-4" aria-hidden /> {copy.previous}
            </button>
            <p className="text-sm text-slate-300">{index + 1} / {slides.length}<span className="hidden sm:inline"> · {copy.orSwipe}</span></p>
            <button type="button" onClick={() => goTo(index + 1)} disabled={index === slides.length - 1} className={controlClass()}>
              {copy.next} <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
            <button type="button" onClick={() => void toggleFullscreen()} className={`${controlClass()} sm:ml-auto`}>
              {fullscreen ? <Minimize2 className="h-4 w-4" aria-hidden /> : <Maximize2 className="h-4 w-4" aria-hidden />}
              {fullscreen ? copy.exitFullscreen : copy.fullscreen}
            </button>
          </div>
        </div>
        {fullscreenBlocked ? <p className="px-5 pb-4 text-sm text-slate-300 sm:px-6" role="status">{copy.fullscreenUnavailable}</p> : null}
      </div>

      <div className="mt-4 space-y-3">
        <details className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900">{copy.discussionLabel}</summary>
          <p className="mt-2 text-sm text-slate-700">{copy.discussionQuestion}</p>
        </details>
        <details className="rounded-lg border border-slate-200 px-4 py-3">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900">{copy.notesLabel}</summary>
          <p className="mt-2 text-sm text-slate-600">{slide.notes}</p>
        </details>
      </div>
    </div>
  );
}

function SlideBody({ slide, presenting, index, total, stageLabels, qrSrc, qrAlt }: {
  slide: FocusSlide;
  presenting: boolean;
  index: number;
  total: number;
  stageLabels: string[];
  qrSrc: string;
  qrAlt: string;
}) {
  const isPhotoLead = slide.visual === "photo";
  const isClose = slide.visual === "close";

  return (
    <article className={`relative flex min-h-[30rem] flex-col overflow-hidden bg-[#07111f] text-white ${presenting ? "md:min-h-[min(76vh,52rem)]" : "md:min-h-[34rem]"}`} aria-roledescription="slide" aria-label={`${index + 1}: ${slide.title}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,180,197,0.18),transparent_52%)]" aria-hidden />
      {isPhotoLead && slide.imageSrc ? (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.imageSrc})` }} aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07111f] via-[#07111f]/88 to-[#07111f]/20" aria-hidden />
          {slide.imageAlt ? <span className="sr-only">{slide.imageAlt}</span> : null}
        </>
      ) : null}

      <div className="relative flex items-center justify-between gap-4 px-5 pt-5 sm:px-8">
        <p className="text-[11px] font-semibold tracking-[0.32em] text-white">ROALLA</p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-light">{slide.kicker}</p>
      </div>

      <div className={`relative grid flex-1 items-center gap-7 px-5 py-7 sm:px-8 md:grid-cols-[minmax(0,0.92fr)_minmax(18rem,1.08fr)] md:py-9 ${isPhotoLead ? "md:grid-cols-[minmax(0,0.8fr)_minmax(18rem,1.2fr)]" : ""}`}>
        <div className="relative z-10 min-w-0">
          <div className="mb-4 h-0.5 w-12 bg-brand-gold" aria-hidden />
          <h3 className={`${presenting ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-5xl"} max-w-3xl font-serif font-bold leading-[1.03] tracking-tight text-white`}>{slide.title}</h3>
          <p className={`${presenting ? "text-lg sm:text-xl" : "text-base sm:text-lg"} mt-4 max-w-2xl leading-relaxed text-slate-200`}>{slide.body}</p>
          {slide.statement ? <p className="mt-5 max-w-2xl border-l-2 border-brand-gold pl-4 font-serif text-xl leading-snug text-white sm:text-2xl">{slide.statement}</p> : null}
          {!presenting && slide.points?.length ? (
            <ul className="mt-5 grid max-w-2xl gap-2 sm:grid-cols-2">
              {slide.points.slice(0, 4).map((point) => {
                const [label, ...detail] = point.split("|");
                return <li key={point} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300"><span className="font-semibold text-white">{label}</span>{detail.length ? ` — ${detail.join("|")}` : ""}</li>;
              })}
            </ul>
          ) : null}
        </div>

        <div className={`relative min-h-[14rem] ${isPhotoLead ? "hidden md:block" : ""}`}>
          {isClose ? (
            <div className="flex h-full items-center justify-center">
              <div className="rounded-2xl border border-white/15 bg-white p-3 shadow-2xl shadow-black/40">
                <img src={qrSrc} alt={qrAlt} width={190} height={190} className="h-36 w-36 sm:h-44 sm:w-44" />
              </div>
            </div>
          ) : <FocusCircleVisual slide={slide} presenting={presenting} />}
        </div>
      </div>

      <StageMotif labels={stageLabels} active={slide.stage} />
      <div className="relative h-0.5 bg-white/10" aria-hidden><div className="h-full bg-brand-gold transition-[width] duration-300" style={{ width: `${((index + 1) / total) * 100}%` }} /></div>
      <div className="relative flex items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Focus Circle</p>
        <p className="text-sm font-semibold tabular-nums text-brand-gold">{String(index + 1).padStart(2, "0")}</p>
      </div>
    </article>
  );
}

function StageMotif({ labels, active }: { labels: string[]; active: FocusSlide["stage"] }) {
  const ids: FocusSlide["stage"][] = ["prepare", "transform", "emerge", "soar"];
  return (
    <ol className="relative mx-5 mb-4 grid grid-cols-4 gap-2 sm:mx-8" aria-label={labels.join(", ")}>
      <div className="absolute left-[8%] right-[8%] top-2 h-px bg-white/15" aria-hidden />
      {ids.map((id, position) => {
        const current = active === id;
        const passed = active !== "overwhelm" && ids.indexOf(active) >= position;
        return (
          <li key={id} className="relative flex flex-col items-center gap-1 text-center">
            <span className={`z-10 h-4 w-4 rounded-full border-2 ${current ? "border-brand-gold bg-brand-gold shadow-[0_0_0_5px_rgba(245,185,66,0.12)]" : passed ? "border-primary-light bg-primary-light" : "border-slate-500 bg-[#07111f]"}`} aria-hidden />
            <span className={`text-[9px] font-semibold uppercase tracking-[0.12em] sm:text-[10px] ${current ? "text-brand-gold" : "text-slate-400"}`}>{labels[position] ?? id}</span>
          </li>
        );
      })}
    </ol>
  );
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${active ? "border-white bg-white text-slate-950" : "border-white/20 bg-transparent text-slate-300 hover:border-white/50"}`}>{children}</button>;
}

function ChapterChip({ chapter, current, onClick }: { chapter: FocusChapter; current: boolean; onClick: () => void }) {
  return (
    <button type="button" data-current={current ? "true" : "false"} aria-current={current ? "true" : undefined} onClick={onClick} className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${current ? "border-brand-gold bg-brand-gold text-slate-950" : "border-white/15 bg-transparent text-slate-300 hover:border-white/40"}`}>{chapter.label}</button>
  );
}

function controlClass() {
  return "inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold disabled:opacity-40";
}
