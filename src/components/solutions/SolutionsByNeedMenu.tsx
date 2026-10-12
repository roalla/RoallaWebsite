"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bot, CalendarRange, ChevronDown, Compass, Gauge, MonitorSmartphone, SearchCheck, Sparkles, UsersRound } from "lucide-react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { solutionsByNeedContent, type SolutionPathId } from "@/lib/solutions-by-need";

const PATHWAY_ICONS = {
  strategy: Compass,
  technology: Gauge,
  "digital-experience": MonitorSmartphone,
  "automation-ai": Bot,
  visibility: SearchCheck,
  "team-execution": UsersRound,
  events: CalendarRange,
  optimization: Sparkles,
} satisfies Record<SolutionPathId, typeof Compass>;

type SharedProps = { onNavigate?: () => void };

export function SolutionsByNeedDesktopMenu({ navIdleClass, navOpenBgClass, onNavigate }: SharedProps & { navIdleClass: string; navOpenBgClass: string }) {
  const locale = useLocale() === "fr" ? "fr" : "en";
  const content = solutionsByNeedContent[locale];
  const pathname = usePathname() ?? "/";
  const active = pathname === "/solutions";
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        id="solutions-by-need-desktop"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          setOpen((wasOpen) => {
            if (!wasOpen) trackAnalyticsEvent("solutions_menu_open", { location: "desktop_header" });
            return !wasOpen;
          });
        }}
        className={`text-sm font-medium transition-colors duration-200 relative group whitespace-nowrap flex items-center gap-1 py-2 rounded-md px-1 -mx-1 ${active || open ? "text-primary" : navIdleClass} ${open ? navOpenBgClass : ""}`}
      >
        {content.navLabel}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} aria-hidden />
      </button>

      <div
        role="menu"
        aria-labelledby="solutions-by-need-desktop"
        className={`fixed left-1/2 top-[4.75rem] z-50 w-[min(62rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60 dropdown-panel ${open ? "dropdown-panel-open" : "dropdown-panel-closed"}`}
      >
        <div className="flex items-start justify-between gap-6 border-b border-white/10 bg-white/[0.03] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{content.menuEyebrow}</p>
            <p className="mt-1 max-w-2xl text-sm text-slate-300">{content.menuDescription}</p>
          </div>
          <Link
            href="/solutions"
            role="menuitem"
            aria-current={active ? "page" : undefined}
            onClick={() => {
              trackAnalyticsEvent("solutions_pathway_click", { location: "desktop_header", pathway: "all" });
              close();
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {content.viewAll}<ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-1 p-2">
          {content.pathways.map((pathway) => {
            const Icon = PATHWAY_ICONS[pathway.id];
            return (
              <Link
                key={pathway.id}
                href={{ pathname: "/solutions", hash: pathway.id }}
                role="menuitem"
                onClick={() => {
                  trackAnalyticsEvent("solutions_pathway_click", { location: "desktop_header", pathway: pathway.id });
                  close();
                }}
                className="group flex gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-sm font-semibold leading-snug text-white transition-colors group-hover:text-primary">{pathway.shortTitle}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-slate-400">{pathway.serviceLabel}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <Link
          href="/assessment"
          role="menuitem"
          onClick={() => {
            trackAnalyticsEvent("solutions_assessment_click", { location: "desktop_header" });
            close();
          }}
          className="flex items-center justify-between gap-4 border-t border-white/10 bg-primary/[0.08] px-5 py-3 text-sm transition hover:bg-primary/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        >
          <span><span className="font-semibold text-white">{content.assessmentLabel}</span>{" "}<span className="text-slate-400">{content.assessmentDescription}</span></span>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

export function SolutionsByNeedMobileMenu({ onNavigate }: SharedProps) {
  const locale = useLocale() === "fr" ? "fr" : "en";
  const content = solutionsByNeedContent[locale];
  const pathname = usePathname() ?? "/";
  const active = pathname === "/solutions";
  const [expanded, setExpanded] = useState(active);

  const navigate = (pathway: string) => {
    trackAnalyticsEvent("solutions_pathway_click", { location: "mobile_header", pathway });
    onNavigate?.();
  };

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="solutions-by-need-mobile-panel"
        onClick={() => {
          setExpanded((wasExpanded) => {
            if (!wasExpanded) trackAnalyticsEvent("solutions_menu_open", { location: "mobile_header" });
            return !wasExpanded;
          });
        }}
        className={`w-full flex items-center justify-between px-3 py-3 min-h-[44px] rounded-md text-base font-medium transition-colors duration-200 ${active ? "text-primary bg-primary/10" : "text-gray-300 hover:text-primary hover:bg-white/5"}`}
      >
        {content.navLabel}
        <ChevronDown className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
      </button>
      <div id="solutions-by-need-mobile-panel" className={`collapse-grid ${expanded ? "collapse-grid-open" : "collapse-grid-closed"}`}>
        <div className="min-h-0 overflow-hidden pb-2">
          <p className="px-5 pb-1 pt-2 text-xs leading-5 text-slate-500">{content.menuDescription}</p>
          <Link href="/solutions" aria-current={active ? "page" : undefined} onClick={() => navigate("all")} className="mx-3 my-2 flex min-h-[44px] items-center justify-between rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary">
            {content.viewAll}<ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          {content.pathways.map((pathway) => {
            const Icon = PATHWAY_ICONS[pathway.id];
            return (
              <Link key={pathway.id} href={{ pathname: "/solutions", hash: pathway.id }} onClick={() => navigate(pathway.id)} className="flex min-h-[44px] gap-3 rounded-md py-3 pl-5 pr-3 text-gray-300 transition-colors hover:bg-white/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 opacity-70" aria-hidden />
                <span><span className="block text-base font-medium">{pathway.shortTitle}</span><span className="mt-0.5 block text-xs text-slate-500">{pathway.serviceLabel}</span></span>
              </Link>
            );
          })}
          <Link
            href="/assessment"
            onClick={() => {
              trackAnalyticsEvent("solutions_assessment_click", { location: "mobile_header" });
              onNavigate?.();
            }}
            className="mx-3 mt-2 block rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300"
          >
            <span className="block font-semibold text-white">{content.assessmentLabel}</span>
            <span className="mt-1 block text-xs text-slate-500">{content.assessmentDescription}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
