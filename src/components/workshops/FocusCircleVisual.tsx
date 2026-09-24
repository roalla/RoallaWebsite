import Image from "next/image";
import {
  CalendarDays,
  Check,
  CircleDot,
  Clock3,
  Eye,
  HandHeart,
  MessageCircle,
  MoveRight,
  RotateCcw,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import type { FocusSlide } from "@/lib/workshops/focus-circle-content";

type Point = { label: string; detail: string };

export default function FocusCircleVisual({ slide, presenting }: { slide: FocusSlide; presenting: boolean }) {
  const points = (slide.points ?? []).map(splitPoint);

  switch (slide.visual) {
    case "overwhelm":
      return <Overwhelm points={points} />;
    case "before-after":
      return <BeforeAfter points={points} />;
    case "circle":
      return <CircleSystem points={points} />;
    case "journey":
      return <Journey points={points} />;
    case "priority":
      return <Priority points={points} />;
    case "kanban":
      return <Kanban points={points} />;
    case "protect":
      return <Protect points={points} />;
    case "support":
      return <SupportPhoto slide={slide} points={points} />;
    case "support-compare":
      return <SupportCompare points={points} />;
    case "rhythm":
      return <Rhythm slide={slide} points={points} />;
    case "discussion":
      return <Discussion />;
    case "practice":
      return <Practice points={points} />;
    case "commitments":
      return <Commitments points={points} />;
    case "facilitator":
      return <Facilitator slide={slide} points={presenting ? points.slice(0, 2) : points} />;
    default:
      return <Priority points={points} />;
  }
}

function splitPoint(point: string): Point {
  const [label, ...detail] = point.split("|");
  return { label, detail: detail.join("|") };
}

const darkTile = "workshop-tile workshop-tile-dark";

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`workshop-tile workshop-tile-dark rounded-2xl border border-white/15 bg-white/[0.06] p-4 shadow-xl shadow-black/15 backdrop-blur-sm ${className}`}>{children}</div>;
}

function Overwhelm({ points }: { points: Point[] }) {
  const rotations = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1", "rotate-2", "-rotate-3", "rotate-1"];
  return (
    <div className="grid grid-cols-3 gap-2 p-3" aria-label={points.map((point) => point.label).join(", ")}>
      {points.map((point, index) => (
        <div key={`${point.label}-${index}`} className={`${darkTile} ${rotations[index]} flex min-h-16 items-center justify-center rounded-md border border-amber-200/40 bg-amber-100 px-2 py-3 text-center text-sm font-semibold text-slate-900 shadow-lg`}>
          {point.label}
        </div>
      ))}
    </div>
  );
}

function BeforeAfter({ points }: { points: Point[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <Panel>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">{points[0]?.label}</p>
        <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden>
          {Array.from({ length: 9 }).map((_, index) => <span key={index} className="h-10 rounded bg-amber-100/90 shadow-sm" />)}
        </div>
        <p className="sr-only">{points[0]?.detail}</p>
      </Panel>
      <MoveRight className="mx-auto h-8 w-8 rotate-90 text-brand-gold sm:rotate-0" aria-hidden />
      <Panel className="border-primary-light/35 bg-primary/10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-light">{points[1]?.label}</p>
        <div className="mt-3 flex items-end justify-center gap-4" aria-hidden>
          <span className="flex h-24 w-20 items-center justify-center rounded-lg border-2 border-brand-gold bg-amber-100 text-2xl font-bold text-slate-900 shadow-[0_0_30px_rgba(245,185,66,0.18)]">1</span>
          <span className="relative mb-1 h-12 w-16 rounded bg-slate-600"><span className="absolute -left-1 -top-1 h-12 w-16 rounded border border-white/20 bg-slate-500" /></span>
        </div>
        <p className="sr-only">{points[1]?.detail}</p>
      </Panel>
    </div>
  );
}

function CircleSystem({ points }: { points: Point[] }) {
  const icons = [CircleDot, Eye, HandHeart];
  return (
    <div className="relative mx-auto aspect-square max-w-[21rem]" aria-label={points.map((point) => `${point.label}: ${point.detail}`).join(". ")}>
      <div className="absolute inset-[27%] flex items-center justify-center rounded-full border border-brand-gold/60 bg-brand-gold/10 text-center font-serif text-xl font-bold text-white shadow-[0_0_45px_rgba(245,185,66,0.16)]">Focus<br />Circle</div>
      {points.slice(0, 3).map((point, index) => {
        const Icon = icons[index];
        const positions = ["left-1/2 top-0 -translate-x-1/2", "bottom-2 left-0", "bottom-2 right-0"];
        return (
          <div key={point.label} className={`${darkTile} absolute ${positions[index]} w-[42%] rounded-xl border border-white/15 bg-[#0b1b2d] p-3 text-center shadow-lg`}>
            <Icon className="mx-auto h-6 w-6 text-primary-light" aria-hidden />
            <p className="mt-1 text-sm font-semibold text-white">{point.label}</p>
            <p className="mt-1 text-xs leading-snug text-slate-300">{point.detail}</p>
          </div>
        );
      })}
    </div>
  );
}

function Journey({ points }: { points: Point[] }) {
  return (
    <ol className="relative grid gap-2 sm:grid-cols-4">
      <div className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-gradient-to-r from-primary-light via-violet-400 to-brand-gold sm:block" aria-hidden />
      {points.map((point, index) => (
        <li key={point.label} className={`${darkTile} relative rounded-xl border border-white/15 bg-[#0b1b2d]/95 p-3 sm:pt-12`}>
          <span className="absolute right-3 top-2 text-xs font-semibold text-brand-gold">0{index + 1}</span>
          <p className="text-sm font-bold text-white">{point.label}</p>
          <p className="mt-1 text-xs leading-snug text-slate-300">{point.detail}</p>
        </li>
      ))}
    </ol>
  );
}

function Priority({ points }: { points: Point[] }) {
  return (
    <div className="grid gap-3">
      <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-primary-light/40 bg-primary/10 shadow-[0_0_0_18px_rgba(0,180,197,0.05),0_0_0_36px_rgba(0,180,197,0.03)]">
        <CircleDot className="h-14 w-14 text-brand-gold" aria-hidden />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {points.map((point) => <Panel key={point.label} className="p-3 text-center"><p className="text-sm font-semibold text-white">{point.label}</p><p className="mt-1 text-xs text-slate-300">{point.detail}</p></Panel>)}
      </div>
    </div>
  );
}

function Kanban({ points }: { points: Point[] }) {
  const counts = [1, 2, 3];
  return (
    <div className="grid grid-cols-3 gap-2" aria-label={points.map((point) => `${point.label}: ${point.detail}`).join(". ")}>
      {points.map((point, column) => (
        <div key={point.label} className={`${darkTile} rounded-xl border p-2 sm:p-3 ${column === 0 ? "border-brand-gold/70 bg-brand-gold/10" : "border-white/15 bg-white/[0.04]"}`}>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-white">{point.label}</p>
          <p className="mt-1 hidden text-xs text-slate-400 sm:block">{point.detail}</p>
          <div className="mt-3 space-y-2" aria-hidden>
            {Array.from({ length: counts[column] }).map((_, index) => <div key={index} className={`h-12 rounded-md border ${column === 0 ? "border-amber-200/50 bg-amber-100" : "border-white/10 bg-slate-700"}`} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function Protect({ points }: { points: Point[] }) {
  const icons = [CalendarDays, MessageCircle, ShieldCheck];
  return (
    <ol className="space-y-3">
      {points.map((point, index) => {
        const Icon = icons[index];
        return (
          <li key={point.label} className={`${darkTile} flex gap-3 rounded-xl border border-white/15 bg-white/[0.05] p-3`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-light"><Icon className="h-5 w-5" aria-hidden /></span>
            <div><p className="font-semibold text-white">{point.label}</p><p className="mt-0.5 text-sm leading-snug text-slate-300">{point.detail}</p></div>
          </li>
        );
      })}
    </ol>
  );
}

function SupportPhoto({ slide, points }: { slide: FocusSlide; points: Point[] }) {
  if (!slide.imageSrc) return null;
  return (
    <div className="relative min-h-[18rem] overflow-hidden rounded-2xl border border-white/15">
      <Image src={slide.imageSrc} alt={slide.imageAlt ?? ""} fill unoptimized sizes="(max-width: 768px) 100vw, 520px" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-transparent to-transparent" aria-hidden />
      <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2">
        {points.map((point) => <span key={point.label} className="rounded-full border border-white/20 bg-[#07111f]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">{point.label}</span>)}
      </div>
    </div>
  );
}

function SupportCompare({ points }: { points: Point[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {points.map((point, index) => (
        <div key={point.label} className={`${darkTile} rounded-2xl border p-4 ${index === 0 ? "border-emerald-300/35 bg-emerald-400/10" : "border-rose-300/30 bg-rose-400/10"}`}>
          <div className="flex items-center gap-2">
            {index === 0 ? <HandHeart className="h-5 w-5 text-emerald-300" aria-hidden /> : <ShieldCheck className="h-5 w-5 text-rose-300" aria-hidden />}
            <p className="font-semibold text-white">{point.label}</p>
          </div>
          <ul className="mt-3 space-y-2">
            {point.detail.split(".").filter(Boolean).map((item) => <li key={item} className="flex gap-2 text-sm text-slate-200"><span className={index === 0 ? "text-emerald-300" : "text-rose-300"}>{index === 0 ? "✓" : "×"}</span>{item.trim()}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Rhythm({ slide, points }: { slide: FocusSlide; points: Point[] }) {
  const icons = [CircleDot, Clock3, HandHeart, RotateCcw];
  return (
    <div className="relative min-h-[19rem] overflow-hidden rounded-2xl border border-white/15">
      {slide.imageSrc ? <Image src={slide.imageSrc} alt={slide.imageAlt ?? ""} fill unoptimized sizes="(max-width: 768px) 100vw, 520px" className="object-cover opacity-45" /> : null}
      <div className="absolute inset-0 bg-[#07111f]/55" aria-hidden />
      <ol className="relative z-10 grid grid-cols-2 gap-2 p-4">
        {points.map((point, index) => {
          const Icon = icons[index];
          return <li key={point.label} className={`${darkTile} rounded-xl border border-white/15 bg-[#07111f]/80 p-3 backdrop-blur-sm`}><Icon className="h-5 w-5 text-brand-gold" aria-hidden /><p className="mt-2 text-sm font-semibold text-white">{point.label}</p><p className="mt-1 text-xs text-slate-300">{point.detail}</p></li>;
        })}
      </ol>
    </div>
  );
}

function Discussion() {
  return (
    <div className="flex min-h-[18rem] items-center justify-center" aria-hidden>
      <div className="flex h-44 w-44 items-center justify-center rounded-full border border-primary-light/40 bg-primary/10 font-serif text-8xl font-bold text-brand-gold shadow-[0_0_60px_rgba(0,180,197,0.16)]">?</div>
    </div>
  );
}

function Practice({ points }: { points: Point[] }) {
  return (
    <ol className="space-y-2">
      {points.map((point, index) => <li key={point.label} className={`${darkTile} flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.05] p-3`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary-light/40 text-sm font-bold text-primary-light">{index + 1}</span><div><p className="font-semibold text-white">{point.label}</p><p className="text-sm text-slate-300">{point.detail}</p></div></li>)}
    </ol>
  );
}

function Commitments({ points }: { points: Point[] }) {
  return (
    <ol className="grid gap-3">
      {points.map((point, index) => <li key={point.label} className={`${darkTile} flex gap-3 rounded-xl border border-white/15 bg-white/[0.05] p-3`}><span className="font-serif text-3xl font-bold text-brand-gold">0{index + 1}</span><div><p className="font-semibold text-white">{point.label}</p><p className="mt-1 text-sm text-slate-300">{point.detail}</p></div><Check className="ml-auto h-5 w-5 shrink-0 text-primary-light" aria-hidden /></li>)}
    </ol>
  );
}

function Facilitator({ slide, points }: { slide: FocusSlide; points: Point[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[8rem_1fr] sm:items-center">
      {slide.imageSrc ? <div className="relative mx-auto aspect-[4/5] w-28 overflow-hidden rounded-2xl border border-white/15 sm:w-full"><Image src={slide.imageSrc} alt={slide.imageAlt ?? ""} fill unoptimized sizes="160px" className="object-cover" /></div> : null}
      <div className="space-y-2">
        {points.map((point, index) => <div key={point.label} className={`${darkTile} flex gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-2.5`}>{index === 0 ? <UserRoundCheck className="h-5 w-5 shrink-0 text-primary-light" aria-hidden /> : index === 1 ? <ShieldCheck className="h-5 w-5 shrink-0 text-primary-light" aria-hidden /> : <Eye className="h-5 w-5 shrink-0 text-primary-light" aria-hidden />}<div><p className="text-sm font-semibold text-white">{point.label}</p><p className="text-xs text-slate-300">{point.detail}</p></div></div>)}
      </div>
    </div>
  );
}
