"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Briefcase,
  Globe,
  GraduationCap,
  Layers,
  Workflow,
  Flag,
  SearchCheck,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { usePathname as useNextPathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import ScheduleButton from "./ScheduleButton";

/** Canadian flag: red bands, white centre, red maple leaf (simplified) */
function CanadianFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" className={className} aria-hidden>
      <rect width="24" height="12" fill="#fff" />
      <rect width="6" height="12" fill="#D52B1E" />
      <rect x="18" width="6" height="12" fill="#D52B1E" />
      <path
        fill="#D52B1E"
        d="M12 10.2L10.2 6.8 11.2 3.8 12 1.8 12.8 3.8 13.8 6.8 12 10.2z"
      />
    </svg>
  );
}

/** Quebec flag (Fleurdelisé): blue #002395, white cross, four white fleurs-de-lis (dots at small size) */
function QuebecFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden>
      <rect width="24" height="16" fill="#002395" />
      <rect x="9" y="0" width="6" height="16" fill="#fff" />
      <rect x="0" y="5" width="24" height="6" fill="#fff" />
      <circle cx="4" cy="3" r="1.2" fill="#fff" />
      <circle cx="20" cy="3" r="1.2" fill="#fff" />
      <circle cx="4" cy="13" r="1.2" fill="#fff" />
      <circle cx="20" cy="13" r="1.2" fill="#fff" />
    </svg>
  );
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusables(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  );
}

/** Viewport band used to decide whether the fixed header sits over dark content */
const HEADER_TONE_BAND_PX = 88;

function getHeaderOverDark(): boolean {
  if (typeof document === "undefined") return false;
  const targets = document.querySelectorAll('[data-header-tone="dark"]');
  if (targets.length === 0) return false;
  for (let i = 0; i < targets.length; i++) {
    const rect = targets[i].getBoundingClientRect();
    if (rect.top < HEADER_TONE_BAND_PX && rect.bottom > 0) return true;
  }
  return false;
}

const Header = () => {
  const pathname = usePathname() ?? "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [overDark, setOverDark] = useState(pathname === "/");
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const localeDropdownDesktopRef = useRef<HTMLDivElement>(null);
  const localeDropdownMobileRef = useRef<HTMLDivElement>(null);
  const digitalDropdownDesktopRef = useRef<HTMLDivElement>(null);
  const programsDropdownDesktopRef = useRef<HTMLDivElement>(null);
  const previousMenuOpen = useRef(false);
  const [localeDropdownOpen, setLocaleDropdownOpen] = useState(false);
  const [digitalDropdownOpen, setDigitalDropdownOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [digitalMobileExpanded, setDigitalMobileExpanded] = useState(false);
  const [programsMobileExpanded, setProgramsMobileExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mounted]);

  useEffect(() => {
    let frame: number | null = null;

    const syncChrome = () => {
      setIsScrolled(window.scrollY > 10);
      setOverDark(getHeaderOverDark());
    };

    const onScrollOrResize = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        syncChrome();
      });
    };

    syncChrome();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && previousMenuOpen.current === false) {
      const focusables = getFocusables(mobileMenuRef.current);
      const first = focusables[0];
      if (first) {
        requestAnimationFrame(() => first.focus());
      }
    }
    if (!isMenuOpen && previousMenuOpen.current === true) {
      menuButtonRef.current?.focus();
    }
    previousMenuOpen.current = isMenuOpen;
  }, [isMenuOpen]);

  useEffect(() => {
    if (!localeDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const inDesktop = localeDropdownDesktopRef.current?.contains(target);
      const inMobile = localeDropdownMobileRef.current?.contains(target);
      if (!inDesktop && !inMobile) setLocaleDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [localeDropdownOpen]);

  useEffect(() => {
    if (!digitalDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!digitalDropdownDesktopRef.current?.contains(target)) {
        setDigitalDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDigitalDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [digitalDropdownOpen]);

  useEffect(() => {
    if (!programsDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!programsDropdownDesktopRef.current?.contains(target)) {
        setProgramsDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProgramsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [programsDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((open) => !open);
  };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setDigitalMobileExpanded(false);
    setProgramsMobileExpanded(false);
  }, []);

  const fullPathname = useNextPathname() ?? "";
  const isLocaleRoute =
    fullPathname.startsWith("/en") || fullPathname.startsWith("/fr");
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const headerCtaLabel =
    pathname === "/programs/workshops"
      ? tCommon("scheduleConsultationWorkshops")
      : pathname === "/services/digital-events"
        ? tCommon("scheduleConsultationDigitalEvents")
        : pathname === "/programs/business-enablement"
          ? tCommon("scheduleConsultationConsulting")
          : tCommon("scheduleConsultationDigital");
  const headerCtaSubtext = tCommon("ctaSubtext");

  const handleLocaleSelect = useCallback(
    (newLocale: "en" | "fr") => {
      setLocaleDropdownOpen(false);
      // Full page navigation for both EN and FR so locale and content update in one click; avoids double /fr/fr or /en/en
      const segment =
        pathname === "/"
          ? ""
          : pathname.startsWith("/")
            ? pathname
            : `/${pathname}`;
      window.location.href = `/${newLocale}${segment}`;
    },
    [pathname],
  );

  const handleMobileNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      closeMenu();
      if (pathname === "/" && href === "/") {
        e.preventDefault();
        requestAnimationFrame(() =>
          window.scrollTo({ top: 0, behavior: "smooth" }),
        );
      }
    },
    [closeMenu, pathname],
  );

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeMenu();
      return;
    }
    if (e.key !== "Tab" || !mobileMenuRef.current) return;
    const focusables = getFocusables(mobileMenuRef.current);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const handleNavButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeMenu();
  };

  const isActive = useCallback(
    (href: string | { pathname: string; hash?: string }) => {
      const path = typeof href === "string" ? href : href.pathname;
      if (path === "/") return pathname === "/";
      return pathname === path || pathname.startsWith(path + "/");
    },
    [pathname],
  );

  type DigitalNavHref =
    | "/services/digital"
    | "/website-design"
    | "/website-package"
    | "/services/digital-events"
    | "/services/digital-visibility-optimization"
    | "/services/digital-products"
    | "/services/automation"
    | "/services/managed-optimization"
    | { pathname: "/services/digital"; hash: "ai-support" };

  type ProgramNavHref = "/programs/business-enablement" | "/programs/workshops";

  const digitalLinks: {
    nameKey:
      | "digitalOverview"
      | "digitalWebsites"
      | "digitalWebsitePackage"
      | "digitalPlatforms"
      | "digitalAutomation"
      | "digitalAiSupport"
      | "digitalVisibility"
      | "digitalManagedOptimization"
      | "digitalEvents";
    descKey:
      | "digitalOverviewDesc"
      | "digitalWebsitesDesc"
      | "digitalWebsitePackageDesc"
      | "digitalPlatformsDesc"
      | "digitalAutomationDesc"
      | "digitalAiSupportDesc"
      | "digitalVisibilityDesc"
      | "digitalManagedOptimizationDesc"
      | "digitalEventsDesc";
    href: DigitalNavHref;
    icon: typeof Globe;
  }[] = [
    {
      nameKey: "digitalOverview",
      descKey: "digitalOverviewDesc",
      href: "/services/digital",
      icon: Globe,
    },
    {
      nameKey: "digitalWebsites",
      descKey: "digitalWebsitesDesc",
      href: "/website-design",
      icon: Globe,
    },
    {
      nameKey: "digitalPlatforms",
      descKey: "digitalPlatformsDesc",
      href: "/services/digital-products",
      icon: Layers,
    },
    {
      nameKey: "digitalVisibility",
      descKey: "digitalVisibilityDesc",
      href: "/services/digital-visibility-optimization",
      icon: SearchCheck,
    },
    {
      nameKey: "digitalAutomation",
      descKey: "digitalAutomationDesc",
      href: "/services/automation",
      icon: Workflow,
    },
    {
      nameKey: "digitalManagedOptimization",
      descKey: "digitalManagedOptimizationDesc",
      href: "/services/managed-optimization",
      icon: RefreshCw,
    },
  ];

  const programLinks: {
    nameKey: "businessEnablement" | "workshops";
    descKey: "businessEnablementDesc" | "workshopsDesc";
    href: ProgramNavHref;
    icon: typeof Briefcase;
  }[] = [
    {
      nameKey: "businessEnablement",
      descKey: "businessEnablementDesc",
      href: "/programs/business-enablement",
      icon: Briefcase,
    },
    {
      nameKey: "workshops",
      descKey: "workshopsDesc",
      href: "/programs/workshops",
      icon: GraduationCap,
    },
  ];

  const isDigitalActive =
    pathname === "/services/digital" ||
    pathname === "/website-design" ||
    pathname === "/services/digital-visibility-optimization" ||
    pathname === "/services/digital-events" ||
    pathname === "/services/portfolio";

  const isProgramsActive = pathname.startsWith("/programs");

  const showFoundingPromo =
    pathname === "/services/digital" ||
    pathname === "/website-design" ||
    pathname === "/services/digital-events" ||
    pathname === "/services/portfolio";

  const foundingPromoLinkClass = overDark
    ? "group flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
    : "group flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white";

  const foundingPromoLink = showFoundingPromo ? (
    <Link
      href="/website-package"
      className={foundingPromoLinkClass}
      aria-label={t("foundingPromoLabel")}
      title={t("foundingPromoLabel")}
      onClick={closeMenu}
    >
      <Flag className="h-4 w-4 shrink-0" aria-hidden />
      <span className="hidden 2xl:inline whitespace-nowrap">
        {t("foundingPromoShort")}
      </span>
    </Link>
  ) : null;

  const dropdownPanelClass = (open: boolean) =>
    `dropdown-panel ${open ? "dropdown-panel-open" : "dropdown-panel-closed"}`;

  const digitalDropdownItemClass =
    "group flex gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40";
  const digitalDropdownIconClass =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-colors group-hover:bg-primary/10 group-hover:text-primary group-focus-visible:bg-primary/10 group-focus-visible:text-primary";
  const programDropdownItemClass =
    "group flex gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40";
  const programDropdownIconClass =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary group-focus-visible:bg-primary/10 group-focus-visible:text-primary";
  const mobileDropdownItemClass =
    "flex gap-3 pl-5 pr-3 py-3 min-h-[44px] rounded-md transition-colors duration-200 text-gray-300 hover:text-primary hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40";

  const headerShellClass = overDark
    ? isScrolled
      ? "bg-black/80 backdrop-blur-md shadow-lg shadow-black/40 border-white/15"
      : "bg-black/65 backdrop-blur-lg shadow-md shadow-black/20 border-white/15"
    : isScrolled
      ? "bg-white/80 backdrop-blur-md shadow-md shadow-slate-900/8 border-slate-200/80"
      : "bg-white/55 backdrop-blur-xl shadow-sm shadow-slate-900/5 border-slate-200/50";

  const brandTextClass = overDark
    ? "text-white group-hover:text-primary"
    : "text-slate-900 group-hover:text-primary";

  const navIdleClass = overDark
    ? "text-gray-300 hover:text-primary"
    : "text-slate-600 hover:text-primary";
  const navOpenBgClass = overDark ? "bg-white/5" : "bg-slate-900/5";

  const localeBtnClass = overDark
    ? "flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
    : "flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-900/5 hover:bg-slate-900/10 border border-slate-300/70 rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors";

  const mobileToggleClass = overDark
    ? "mobile-nav-toggle p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black min-h-[44px] min-w-[44px] flex items-center justify-center"
    : "mobile-nav-toggle p-2 rounded-lg bg-slate-900/5 hover:bg-slate-900/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white min-h-[44px] min-w-[44px] flex items-center justify-center";

  const mobileToggleIconClass = overDark
    ? "w-6 h-6 text-white"
    : "w-6 h-6 text-slate-800";

  return (
    <header
      role="banner"
      data-header-over-dark={overDark ? "true" : "false"}
      className={`fixed top-0 left-0 right-0 z-40 pt-[env(safe-area-inset-top)] border-b transition-[background-color,box-shadow,backdrop-filter,border-color] duration-300 ${headerShellClass}`}
    >
      {/* Skip to main content - visible on focus for keyboard/screen reader users */}
      <a href="#main-content" className="skip-link">
        {tCommon("skipToContent")}
      </a>

      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between gap-6 h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 min-w-0 max-w-[140px] sm:max-w-[200px]">
            <Link
              href="/"
              className="flex items-center space-x-2 sm:space-x-3 group min-w-0"
              onClick={closeMenu}
              aria-label="Go to homepage"
            >
              <div className="flex-shrink-0">
                <Image
                  src="/logo.svg"
                  alt="Roalla Business Enablement Group Logo"
                  width={40}
                  height={40}
                  className={`w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-200 ${!prefersReducedMotion ? "group-hover:scale-110" : ""}`}
                  priority
                />
              </div>
              <div className="min-w-0">
                <span
                  className={`text-base sm:text-xl font-bold ${brandTextClass} transition-colors duration-200 truncate`}
                >
                  {tCommon("companyName")}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center min-w-0 flex-1 px-2 xl:px-4">
            <div className="flex items-center justify-center gap-5 xl:gap-8">
              <div className="relative" ref={digitalDropdownDesktopRef}>
                <button
                  type="button"
                  onClick={() => setDigitalDropdownOpen((o) => !o)}
                  aria-expanded={digitalDropdownOpen}
                  aria-haspopup="menu"
                  id="digital-dropdown-desktop"
                  className={`text-sm xl:text-base font-medium transition-colors duration-200 relative group whitespace-nowrap flex items-center gap-1 py-2 rounded-md px-1 -mx-1 ${
                    isDigitalActive || digitalDropdownOpen
                      ? "text-primary"
                      : navIdleClass
                  } ${digitalDropdownOpen ? navOpenBgClass : ""}`}
                >
                  {t("digitalEnablement")}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${digitalDropdownOpen ? "rotate-180" : ""}`}
                  />
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      isDigitalActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
                <div
                  role="menu"
                  aria-labelledby="digital-dropdown-desktop"
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[min(100vw-2rem,360px)] overflow-hidden rounded-xl bg-zinc-950 border border-white/10 shadow-2xl shadow-black/60 z-50 ${dropdownPanelClass(digitalDropdownOpen)}`}
                >
                  <div className="px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {t("digitalEnablementMenuLabel")}
                    </p>
                  </div>
                  <div className="p-1.5">
                    {digitalLinks.map((item) => {
                      const Icon = item.icon;
                      const linkKey =
                        typeof item.href === "string"
                          ? item.href
                          : `${item.href.pathname}#${item.href.hash}`;
                      return (
                        <Link
                          key={linkKey}
                          href={item.href}
                          role="menuitem"
                          onClick={() => {
                            setDigitalDropdownOpen(false);
                            closeMenu();
                          }}
                          className={digitalDropdownItemClass}
                        >
                          <div className={digitalDropdownIconClass}>
                            <Icon className="h-4 w-4" aria-hidden />
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="text-sm font-semibold leading-snug text-white group-hover:text-primary transition-colors">
                              {t(item.nameKey)}
                            </p>
                            <p className="mt-0.5 text-xs leading-snug text-slate-400 group-hover:text-slate-300">
                              {t(item.descKey)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href="/services/portfolio"
                  aria-current={
                    isActive("/services/portfolio") ? "page" : undefined
                  }
                  className={`text-sm xl:text-base font-medium transition-colors duration-200 relative group whitespace-nowrap block py-2 ${
                    isActive("/services/portfolio")
                      ? "text-primary"
                      : navIdleClass
                  }`}
                  onClick={closeMenu}
                >
                  {t("digitalPortfolio")}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      isActive("/services/portfolio")
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </div>

              <div className="relative" ref={programsDropdownDesktopRef}>
                <button
                  type="button"
                  onClick={() => setProgramsDropdownOpen((o) => !o)}
                  aria-expanded={programsDropdownOpen}
                  aria-haspopup="menu"
                  id="programs-dropdown-desktop"
                  className={`text-sm xl:text-base font-medium transition-colors duration-200 relative group whitespace-nowrap flex items-center gap-1 py-2 rounded-md px-1 -mx-1 ${
                    isProgramsActive || programsDropdownOpen
                      ? "text-primary"
                      : navIdleClass
                  } ${programsDropdownOpen ? navOpenBgClass : ""}`}
                >
                  {t("programs")}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${programsDropdownOpen ? "rotate-180" : ""}`}
                  />
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      isProgramsActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
                <div
                  role="menu"
                  aria-labelledby="programs-dropdown-desktop"
                  className={`absolute right-0 top-full mt-2 w-[min(100vw-2rem,320px)] overflow-hidden rounded-xl bg-zinc-950 border border-white/10 shadow-2xl shadow-black/60 z-50 ${dropdownPanelClass(programsDropdownOpen)}`}
                >
                  <div className="px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      {t("programsMenuLabel")}
                    </p>
                  </div>
                  <div className="p-1.5">
                    {programLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => {
                            setProgramsDropdownOpen(false);
                            closeMenu();
                          }}
                          className={programDropdownItemClass}
                        >
                          <div className={programDropdownIconClass}>
                            <Icon className="h-4 w-4" aria-hidden />
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="text-sm font-semibold leading-snug text-gray-200 group-hover:text-primary transition-colors">
                              {t(item.nameKey)}
                            </p>
                            <p className="mt-0.5 text-xs leading-snug text-slate-500 group-hover:text-slate-400">
                              {t(item.descKey)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center justify-end gap-2 xl:gap-3 flex-shrink-0">
            {foundingPromoLink}
            {isLocaleRoute && (
              <div
                className="relative flex items-center"
                ref={localeDropdownDesktopRef}
              >
                <button
                  type="button"
                  onClick={() => setLocaleDropdownOpen((o) => !o)}
                  className={localeBtnClass}
                  aria-expanded={localeDropdownOpen}
                  aria-haspopup="listbox"
                  aria-label={tCommon("selectLanguage")}
                  id="locale-dropdown-desktop"
                >
                  {locale === "en" ? (
                    <CanadianFlagIcon className="w-5 h-[10px] flex-shrink-0" />
                  ) : (
                    <QuebecFlagIcon className="w-5 h-[10px] flex-shrink-0" />
                  )}
                  <span>{locale === "en" ? "EN" : "FR"}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${localeDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  role="listbox"
                  aria-labelledby="locale-dropdown-desktop"
                  aria-hidden={!localeDropdownOpen}
                  className={`absolute right-0 top-full mt-2 py-1 min-w-[120px] bg-zinc-950 rounded-lg shadow-2xl shadow-black/60 border border-white/10 z-50 ${dropdownPanelClass(localeDropdownOpen)}`}
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={locale === "en"}
                    onClick={() => handleLocaleSelect("en")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-medium text-white hover:bg-white/10 first:rounded-t-lg"
                  >
                    <CanadianFlagIcon className="w-5 h-[10px] flex-shrink-0" />
                    <span>EN</span>
                  </button>
                  <button
                    type="button"
                    role="option"
                    aria-selected={locale === "fr"}
                    onClick={() => handleLocaleSelect("fr")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-medium text-white hover:bg-white/10 last:rounded-b-lg"
                  >
                    <QuebecFlagIcon className="w-5 h-[10px] flex-shrink-0" />
                    <span>FR</span>
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center">
              <ScheduleButton
                variant="primary"
                size="sm"
                icon
                className="!py-2.5 !px-5 !text-sm"
                hoverHint={headerCtaSubtext}
              >
                {headerCtaLabel}
              </ScheduleButton>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {showFoundingPromo && (
              <Link
                href="/website-package"
                className={`${foundingPromoLinkClass} min-h-[44px] min-w-[44px] justify-center px-2.5`}
                aria-label={t("foundingPromoLabel")}
                title={t("foundingPromoLabel")}
                onClick={closeMenu}
              >
                <Flag className="h-5 w-5 shrink-0" aria-hidden />
              </Link>
            )}
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              onKeyDown={handleNavButtonKeyDown}
              className={mobileToggleClass}
              aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className={mobileToggleIconClass} aria-hidden />
              ) : (
                <Menu className={mobileToggleIconClass} aria-hidden />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - focus trap container */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            onKeyDown={handleMenuKeyDown}
            className="lg:hidden overflow-hidden fixed left-0 right-0 z-50 shadow-lg top-[calc(4rem+env(safe-area-inset-top,0px))] flex flex-col mobile-menu-panel mobile-menu-panel-open"
            style={{
              maxHeight: "calc(100vh - 4rem - env(safe-area-inset-top, 0px))",
            }}
          >
            <div className="flex-1 overflow-y-auto px-2 pt-2 pb-3 space-y-1 bg-black border-t border-white/10">
              {showFoundingPromo && (
                <Link
                  href="/website-package"
                  className="mb-2 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-3 py-3 min-h-[44px] text-primary transition-colors hover:bg-primary/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={(e) => handleMobileNavClick(e, "/website-package")}
                >
                  <Flag className="h-5 w-5 shrink-0" aria-hidden />
                  <span>
                    <span className="block text-base font-semibold">
                      {t("foundingPromoShort")}
                    </span>
                    <span className="block text-xs text-primary/80 mt-0.5">
                      {t("foundingPromoMenuDesc")}
                    </span>
                  </span>
                </Link>
              )}

              <div>
                <button
                  type="button"
                  onClick={() => setDigitalMobileExpanded((o) => !o)}
                  aria-expanded={digitalMobileExpanded}
                  className={`w-full flex items-center justify-between px-3 py-3 min-h-[44px] rounded-md text-base font-medium transition-colors duration-200 ${
                    isDigitalActive
                      ? "text-primary bg-primary/10"
                      : "text-gray-300 hover:text-primary hover:bg-white/5"
                  }`}
                >
                  {t("digitalEnablement")}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${digitalMobileExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`collapse-grid ${digitalMobileExpanded ? "collapse-grid-open" : "collapse-grid-closed"}`}
                >
                  <div className="overflow-hidden min-h-0">
                    {digitalLinks.map((item) => {
                      const Icon = item.icon;
                      const linkKey =
                        typeof item.href === "string"
                          ? item.href
                          : `${item.href.pathname}#${item.href.hash}`;
                      const mobilePath =
                        typeof item.href === "string"
                          ? item.href
                          : item.href.pathname;
                      return (
                        <Link
                          key={linkKey}
                          href={item.href}
                          className={mobileDropdownItemClass}
                          onClick={(e) => handleMobileNavClick(e, mobilePath)}
                        >
                          <Icon
                            className="h-4 w-4 shrink-0 mt-0.5 opacity-70"
                            aria-hidden
                          />
                          <span>
                            <span className="block text-base font-medium">
                              {t(item.nameKey)}
                            </span>
                            <span className="block text-xs text-slate-500 mt-0.5">
                              {t(item.descKey)}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href="/services/portfolio"
                  aria-current={
                    isActive("/services/portfolio") ? "page" : undefined
                  }
                  className={`block px-3 py-3 min-h-[44px] flex items-center rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive("/services/portfolio")
                      ? "text-primary bg-primary/10"
                      : "text-gray-300 hover:text-primary hover:bg-white/5"
                  }`}
                  onClick={(e) =>
                    handleMobileNavClick(e, "/services/portfolio")
                  }
                >
                  {t("digitalPortfolio")}
                </Link>
              </div>

              <div className="border-t border-white/10 pt-1">
                <button
                  type="button"
                  onClick={() => setProgramsMobileExpanded((o) => !o)}
                  aria-expanded={programsMobileExpanded}
                  className={`w-full flex items-center justify-between px-3 py-3 min-h-[44px] rounded-md text-base font-medium transition-colors duration-200 ${
                    isProgramsActive
                      ? "text-gray-200 bg-white/5"
                      : "text-slate-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
                >
                  {t("programs")}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${programsMobileExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`collapse-grid ${programsMobileExpanded ? "collapse-grid-open" : "collapse-grid-closed"}`}
                >
                  <div className="overflow-hidden min-h-0">
                    {programLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={mobileDropdownItemClass}
                          onClick={(e) => handleMobileNavClick(e, item.href)}
                        >
                          <Icon
                            className="h-4 w-4 shrink-0 mt-0.5 opacity-70"
                            aria-hidden
                          />
                          <span>
                            <span className="block text-base font-medium">
                              {t(item.nameKey)}
                            </span>
                            <span className="block text-xs text-slate-500 mt-0.5">
                              {t(item.descKey)}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {isLocaleRoute && (
                <div
                  className="px-3 py-3 border-t border-white/10 relative"
                  ref={localeDropdownMobileRef}
                >
                  <span className="block text-xs font-medium text-gray-400 mb-1.5">
                    {tCommon("languageLabel")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLocaleDropdownOpen((o) => !o)}
                    className="w-full flex items-center gap-2 text-base font-medium text-white bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-expanded={localeDropdownOpen}
                    aria-haspopup="listbox"
                    aria-label={tCommon("selectLanguage")}
                    id="locale-dropdown-mobile"
                  >
                    {locale === "en" ? (
                      <CanadianFlagIcon className="w-6 h-4 flex-shrink-0" />
                    ) : (
                      <QuebecFlagIcon className="w-6 h-4 flex-shrink-0" />
                    )}
                    <span>{locale === "en" ? "EN" : "FR"}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${localeDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    role="listbox"
                    aria-labelledby="locale-dropdown-mobile"
                    aria-hidden={!localeDropdownOpen}
                    className={`absolute left-3 right-3 top-full mt-1 py-1 bg-zinc-950 rounded-lg shadow-2xl shadow-black/60 border border-white/10 z-50 ${dropdownPanelClass(localeDropdownOpen)}`}
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={locale === "en"}
                      onClick={() => handleLocaleSelect("en")}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-base font-medium text-white hover:bg-white/10 first:rounded-t-lg"
                    >
                      <CanadianFlagIcon className="w-6 h-4 flex-shrink-0" />
                      <span>EN</span>
                    </button>
                    <button
                      type="button"
                      role="option"
                      aria-selected={locale === "fr"}
                      onClick={() => handleLocaleSelect("fr")}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-base font-medium text-white hover:bg-white/10 last:rounded-b-lg"
                    >
                      <QuebecFlagIcon className="w-6 h-4 flex-shrink-0" />
                      <span>FR</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Sticky CTA at bottom of mobile menu */}
            <div className="flex-shrink-0 p-3 bg-black border-t border-white/10">
              <ScheduleButton
                variant="primary"
                size="md"
                icon
                block
                className="justify-center"
                hoverHint={headerCtaSubtext}
              >
                {headerCtaLabel}
              </ScheduleButton>
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop - cursor-pointer to show it's clickable */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden cursor-pointer transition-opacity duration-200"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Header;
