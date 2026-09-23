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

const SLIDE_KEY = "roalla-focus-circle-slide";
const MODE_KEY = "roalla-focus-circle-view-mode";

export default function FocusCirclePresentation({
  copy,
}: {
  copy: FocusCircleCopy;
}) {
  const slides = copy.slides;
  const locale = useLocale();
  const qrSrc = focusCircleQrHref(locale);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<"read" | "present">("read");
  const [modeReady, setModeReady] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenBlocked, setFullscreenBlocked] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
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
      const resumeAt =
        Number.isInteger(hashSlide) && hashSlide >= 0 ? hashSlide : storedSlide;
      if (Number.isInteger(resumeAt) && resumeAt >= 0 && resumeAt < slides.length) {
        setIndex(resumeAt);
      }
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
    const offset = buttonBox.left - navBox.left - (navBox.width - buttonBox.width) / 2;
    nav.scrollBy({ left: offset, behavior: "smooth" });
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

  return (
    <div ref={shellRef}>
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#07111f] pb-5 text-white shadow-xl">
      <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-5 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-light">{copy.viewerLabel}</p>
          <h2 className="sr-only">{copy.viewerLabel}</h2>
        </div>
        <p className="text-sm text-slate-400" aria-live="polite">
          {formatFocusTemplate(copy.slideOf, { current: index + 1, total: slides.length })}
        </p>
      </div>
      <p className="px-5 sm:px-6 mt-2 text-sm text-slate-400">{copy.viewerHelp}</p>
      <div className="px-5 sm:px-6 mt-4 flex flex-wrap gap-2" role="group" aria-label={copy.viewModeAria}>
        <ModeButton active={mode === "read"} onClick={() => setMode("read")}>
          {copy.readMode}
        </ModeButton>
        <ModeButton active={mode === "present"} onClick={() => setMode("present")}>
          {copy.presentMode}
        </ModeButton>
      </div>
      <nav
        ref={chaptersRef}
        aria-label={copy.chaptersLabel}
        className="mt-4 flex gap-2 overflow-x-auto px-5 pb-1 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {copy.chapters.map((chapter) => (
          <ChapterChip
            key={chapter.id}
            chapter={chapter}
            current={currentChapter?.id === chapter.id}
            onClick={() => goTo(chapter.slide)}
          />
        ))}
      </nav>

      <div
        ref={viewerRef}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(index - 1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(index + 1);
          }
        }}
        onTouchStart={(event) => {
          touchStart.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}
        className={`mx-4 sm:mx-6 mt-4 overflow-hidden rounded-xl border border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
          presenting ? "min-h-[32rem]" : "min-h-[26rem]"
        } ${fullscreen && !document.fullscreenElement ? "fixed inset-4 z-50 shadow-2xl" : ""}`}
      >
        <SlideBody
          slide={slide}
          presenting={presenting}
          index={index}
          total={slides.length}
          footer={copy.deckFooter}
          qrSrc={qrSrc}
          qrAlt={copy.qrAlt}
        />
        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className={controlClass()}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden />
            {copy.previous}
          </button>
          <p className="text-sm text-slate-300">
            {index + 1} / {slides.length}
            <span className="hidden sm:inline"> · {copy.orSwipe}</span>
          </p>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === slides.length - 1}
            className={controlClass()}
          >
            {copy.next}
            <ChevronRight className="w-4 h-4" aria-hidden />
          </button>
          <button type="button" onClick={() => void toggleFullscreen()} className={`${controlClass()} sm:ml-auto`}>
            {fullscreen ? <Minimize2 className="w-4 h-4" aria-hidden /> : <Maximize2 className="w-4 h-4" aria-hidden />}
            {fullscreen ? copy.exitFullscreen : copy.fullscreen}
          </button>
        </div>
      </div>
      {fullscreenBlocked ? (
        <p className="px-5 sm:px-6 pb-4 text-sm text-slate-300" role="status">
          {copy.fullscreenUnavailable}
        </p>
      ) : null}
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

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-medium border transition-colors ${
        active
          ? "bg-white text-slate-950 border-white"
          : "bg-transparent text-slate-300 border-white/20 hover:border-white/50"
      }`}
    >
      {children}
    </button>
  );
}

function ChapterChip({
  chapter,
  current,
  onClick,
}: {
  chapter: FocusChapter;
  current: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-current={current ? "true" : "false"}
      aria-current={current ? "true" : undefined}
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
        current
          ? "bg-brand-gold text-slate-950 border-brand-gold"
          : "bg-transparent text-slate-300 border-white/15 hover:border-white/40"
      }`}
    >
      {chapter.label}
    </button>
  );
}

function splitPoint(point: string) {
  const [label, ...rest] = point.split("|");
  return { label, detail: rest.join("|") };
}

function SlideBody({
  slide,
  presenting,
  index,
  total,
  footer,
  qrSrc,
  qrAlt,
}: {
  slide: FocusSlide;
  presenting: boolean;
  index: number;
  total: number;
  footer: string;
  qrSrc: string;
  qrAlt: string;
}) {
  const points = (slide.points ?? []).map(splitPoint);
  const columns = slide.layout === "columns";
  const titleClass = presenting
    ? "text-4xl sm:text-5xl"
    : "text-3xl sm:text-4xl";

  return (
    <article
      className="relative flex min-h-[22rem] flex-col bg-[#07111f] text-white"
      aria-roledescription="slide"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,180,197,0.16),transparent_52%)]"
        aria-hidden
      />
      <div className="relative flex items-center justify-between gap-4 px-5 pt-5 sm:px-8">
        <p className="text-[11px] font-semibold tracking-[0.32em] text-white">ROALLA</p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-light">{slide.kicker}</p>
      </div>
      <div className="relative mx-5 mt-3 h-0.5 w-12 bg-brand-gold sm:mx-8" aria-hidden />
      <div className={`relative flex flex-1 flex-col px-5 py-5 sm:px-8 sm:py-6 ${slide.layout === "close" ? "sm:flex-row sm:items-end sm:gap-8" : ""}`}>
        <div className="min-w-0 flex-1">
          <h3 className={`font-serif font-bold leading-[1.08] tracking-tight text-white ${titleClass}`}>
            {slide.title}
          </h3>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">{slide.body}</p>
          {points.length > 0 ? (
            <ul className={`mt-5 grid gap-3 ${columns ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {points.map((point, pointIndex) => (
                <li
                  key={point.label}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-brand-gold">
                    {String(pointIndex + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 font-serif text-lg leading-snug text-white">{point.label}</p>
                  {point.detail ? <p className="mt-1 text-sm leading-relaxed text-slate-300">{point.detail}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {slide.statement ? (
            <p className="mt-5 max-w-3xl border-l-2 border-brand-gold pl-4 font-serif text-xl leading-snug text-white sm:text-2xl">
              {slide.statement}
            </p>
          ) : null}
        </div>
        {slide.layout === "close" ? (
          <div className="mt-5 flex shrink-0 flex-col items-center gap-2 sm:mt-0">
            <img src={qrSrc} alt={qrAlt} width={132} height={132} className="rounded-md bg-white p-1.5" />
          </div>
        ) : null}
      </div>
      <div className="relative h-0.5 bg-white/10" aria-hidden>
        <div className="h-full bg-brand-gold" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <div className="relative flex items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{footer}</p>
        <p className="text-sm font-semibold tabular-nums text-brand-gold">{String(index + 1).padStart(2, "0")}</p>
      </div>
    </article>
  );
}

function controlClass() {
  return "inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-40";
}
