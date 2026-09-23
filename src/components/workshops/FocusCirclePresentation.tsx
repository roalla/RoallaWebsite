"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import {
  formatFocusTemplate,
  type FocusChapter,
  type FocusCircleCopy,
  type FocusSlide,
} from "@/lib/workshops/focus-circle-content";

const SLIDE_KEY = "roalla-focus-circle-slide";
const MODE_KEY = "roalla-focus-circle-view-mode";

export default function FocusCirclePresentation({
  copy,
}: {
  copy: FocusCircleCopy;
}) {
  const slides = copy.slides;
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
    <div ref={shellRef} className="rounded-2xl border border-slate-300 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-5 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{copy.viewerLabel}</p>
          <h2 className="sr-only">{copy.viewerLabel}</h2>
        </div>
        <p className="text-sm text-slate-500" aria-live="polite">
          {formatFocusTemplate(copy.slideOf, { current: index + 1, total: slides.length })}
        </p>
      </div>
      <p className="px-5 sm:px-6 mt-2 text-sm text-slate-500">{copy.viewerHelp}</p>
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
        className="mt-4 flex gap-2 overflow-x-auto px-5 sm:px-6 pb-2"
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
        className={`mx-5 sm:mx-6 mt-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          presenting
            ? "bg-slate-950 text-white min-h-[28rem]"
            : "bg-slate-50 text-slate-900 border border-slate-200 min-h-[22rem]"
        } ${fullscreen && !document.fullscreenElement ? "fixed inset-4 z-50 shadow-2xl" : ""}`}
      >
        <SlideBody slide={slide} presenting={presenting} index={index} total={slides.length} />
        <div className={`flex flex-wrap items-center gap-3 px-4 py-4 sm:px-6 ${presenting ? "border-t border-white/10" : "border-t border-slate-200"}`}>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className={controlClass(presenting)}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden />
            {copy.previous}
          </button>
          <p className={`text-sm ${presenting ? "text-slate-300" : "text-slate-500"}`}>
            {index + 1} / {slides.length}
            <span className="hidden sm:inline"> · {copy.orSwipe}</span>
          </p>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === slides.length - 1}
            className={controlClass(presenting)}
          >
            {copy.next}
            <ChevronRight className="w-4 h-4" aria-hidden />
          </button>
          <button type="button" onClick={() => void toggleFullscreen()} className={`${controlClass(presenting)} sm:ml-auto`}>
            {fullscreen ? <Minimize2 className="w-4 h-4" aria-hidden /> : <Maximize2 className="w-4 h-4" aria-hidden />}
            {fullscreen ? copy.exitFullscreen : copy.fullscreen}
          </button>
        </div>
      </div>
      {fullscreenBlocked ? (
        <p className="px-5 sm:px-6 mt-3 text-sm text-slate-600" role="status">
          {copy.fullscreenUnavailable}
        </p>
      ) : null}

      <div className="px-5 sm:px-6 py-5 space-y-3">
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
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-700 border-slate-300 hover:border-primary"
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
          ? "bg-primary/10 text-primary-darker border-primary/40"
          : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
      }`}
    >
      {chapter.label}
    </button>
  );
}

function SlideBody({
  slide,
  presenting,
  index,
  total,
}: {
  slide: FocusSlide;
  presenting: boolean;
  index: number;
  total: number;
}) {
  return (
    <div className="px-5 py-8 sm:px-10 sm:py-12 min-h-[18rem] flex flex-col">
      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${presenting ? "text-primary-light" : "text-primary-dark"}`}>
        {slide.kicker}
      </p>
      <h3 className={`mt-3 font-serif font-bold leading-tight ${presenting ? "text-4xl sm:text-5xl text-white" : "text-3xl text-slate-900"}`}>
        {slide.title}
      </h3>
      <p className={`mt-4 max-w-2xl text-base sm:text-lg leading-relaxed ${presenting ? "text-slate-200" : "text-slate-600"}`}>
        {slide.body}
      </p>
      {slide.points && slide.points.length > 0 ? (
        <ul className="mt-6 space-y-2 max-w-xl">
          {slide.points.map((point) => (
            <li key={point} className={`text-sm sm:text-base ${presenting ? "text-slate-100" : "text-slate-700"}`}>
              <span className={`mr-2 ${presenting ? "text-brand-gold" : "text-primary"}`} aria-hidden>
                —
              </span>
              {point}
            </li>
          ))}
        </ul>
      ) : null}
      {slide.statement ? (
        <p className={`mt-6 max-w-2xl font-serif text-xl leading-snug ${presenting ? "text-brand-gold-light" : "text-slate-900"}`}>
          {slide.statement}
        </p>
      ) : null}
      <p className={`mt-auto pt-8 text-xs tracking-[0.14em] uppercase ${presenting ? "text-slate-400" : "text-slate-400"}`}>
        Roalla · {index + 1} / {total}
      </p>
    </div>
  );
}

function controlClass(presenting: boolean) {
  return `inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium disabled:opacity-40 ${
    presenting
      ? "bg-white/10 text-white hover:bg-white/15"
      : "bg-white border border-slate-300 text-slate-800 hover:border-primary"
  }`;
}
