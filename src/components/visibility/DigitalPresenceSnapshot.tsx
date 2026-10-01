"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Download,
  Gauge,
  LoaderCircle,
  Mail,
  RefreshCw,
  SearchCheck,
  Share2,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import DigitalPresenceActionPlanPrintSheet, {
  type PresencePrintModel,
} from "@/components/visibility/DigitalPresenceActionPlanPrintSheet";
import { AgenticScoreTile, PresenceScoreTiles } from "@/components/visibility/PresenceScoreTiles";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { buildDigitalPresenceActions, type DigitalPresenceAction } from "@/lib/digital-presence/actions";
import type { DomainHealthSnapshot } from "@/lib/domain-health/evaluate";
import { buildSnapshotNarrative } from "@/lib/digital-presence/narrative";
import type { ContactExposure } from "@/lib/contact-exposure/analyze";
import type { SocialPresenceSnapshot } from "@/lib/social-presence/analyzer";
import type {
  ScoreName,
  WebsiteVisibilitySnapshot,
} from "@/lib/website-visibility/pagespeed";
import { isSamePublicPage } from "@/lib/website-visibility/page-url";

type TechnicalReport = {
  snapshot?: WebsiteVisibilitySnapshot;
  cached?: boolean;
  error?: string;
};

type TechnicalResponse = {
  mobile?: TechnicalReport;
  desktop?: TechnicalReport;
  error?: string;
};

type SnapshotHistory = {
  checkedAt: string;
  mobilePerformance: number | null;
  desktopPerformance: number | null;
  socialScore: number | null;
  agenticScore?: number | null;
  agenticMobile?: number | null;
  agenticDesktop?: number | null;
};

type CompetitorResult = {
  url: string;
  technical: TechnicalResponse | null;
  social: SocialPresenceSnapshot | null;
};

const HISTORY_PREFIX = "roalla-digital-snapshot:";

function storageKey(value: string) {
  try {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const parsed = new URL(candidate);
    parsed.search = "";
    parsed.hash = "";
    return `${HISTORY_PREFIX}${parsed.toString()}`;
  } catch {
    return `${HISTORY_PREFIX}${value.trim().toLowerCase()}`;
  }
}

function readHistory(value: string): SnapshotHistory | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(storageKey(value));
    return stored ? (JSON.parse(stored) as SnapshotHistory) : null;
  } catch {
    return null;
  }
}

function saveHistory(
  value: string,
  technical: TechnicalResponse | null,
  social: SocialPresenceSnapshot | null,
) {
  if (typeof window === "undefined") return;
  const history: SnapshotHistory = {
    checkedAt: new Date().toISOString(),
    mobilePerformance: technical?.mobile?.snapshot?.scores.performance ?? null,
    desktopPerformance: technical?.desktop?.snapshot?.scores.performance ?? null,
    socialScore: social?.score ?? null,
    agenticMobile: technical?.mobile?.snapshot?.agentic?.score ?? null,
    agenticDesktop: technical?.desktop?.snapshot?.agentic?.score ?? null,
    agenticScore: technical?.mobile?.snapshot?.agentic?.score ?? technical?.desktop?.snapshot?.agentic?.score ?? social?.agentic?.score ?? null,
  };
  try {
    window.localStorage.setItem(storageKey(value), JSON.stringify(history));
  } catch {
    // The report still works when private browsing blocks local storage.
  }
}

function scoreDelta(current: number | null | undefined, previous: number | null | undefined) {
  if (current == null || previous == null) return null;
  return current - previous;
}

const scoreOrder: ScoreName[] = [
  "performance",
  "accessibility",
  "bestPractices",
  "seo",
];

const copy = {
  en: {
    urlLabel: "Your website address",
    placeholder: "https://example.com",
    submit: "Check my website",
    workingTitle: "Checking your website",
    workingButton: "Checking…",
    workingNote: "This usually takes a minute. Results appear when every check is finished.",
    summaryTitle: "Where to look first",
    summaryIntro: "Green is in good shape. Orange can improve. Red needs attention first.",
    summaryStatus: { strong: "In good shape", improve: "Can improve", attention: "Needs attention" },
    summaryMissing: "Could not check",
    summaryScores: {
      performance: "Page speed",
      accessibility: "Accessibility",
      bestPractices: "Reliability",
      seo: "Search readiness",
    },
    summaryContactMailbox: "Mailbox in the page source",
    summaryContactPhone: "Phone number in the page source",
    summaryContactScrambled: "Mailbox is scrambled",
    summaryContactClear: "No mailbox in the page source",
    starting: "Starting your website check…",
    both: "Checking your website, social sharing, and contact details…",
    technicalOnly: "Your social sharing results are ready. Finishing the website check…",
    socialOnly: "Your website results are ready. Finishing the social sharing and contact check…",
    resultsTitle: "Your website results",
    resultsIntro: "This report checks the landing page a visitor reaches. It is not a check of every page on the website. PageSpeed scores that page on a phone and on a computer. Social sharing, assistant readiness, and the contact check read that same page. Domain and email health reads the public records for the domain name. Each area is shown separately so you can see what needs attention.",
    technicalTitle: "Website experience",
    technicalDescription: "How your website performs on phones and computers",
    socialTitle: "Social sharing setup",
    socialDescription: "How well your website connects to your social profiles and creates sharing previews",
    contactTitle: "Contact details a bot can copy",
    contactDescription: "Whether this page’s source includes a mailbox or phone number, and whether it offers a form instead.",
    contactMailboxExposed: "A mailbox address is in the page source. A bot can copy it without filling in a form.",
    contactMailboxObfuscated: "A mailbox is scrambled in the page. Simple scrapers often miss it. A determined one can still recover it.",
    contactMailboxClear: "No mailbox address was found in this page’s source.",
    contactPhoneExposed: "A phone number is in the page source. A bot can copy it.",
    contactPhoneClear: "No phone number was found in this page’s source.",
    contactFormOnly: "This page offers a form and does not publish a mailbox in the source. That keeps scraped mail off the address.",
    contactFormAndMailbox: "This page has a form, and it also publishes a mailbox in the source. The form does not hide that address.",
    contactFormMissing: "No contact form was found on this page.",
    contactFormMissingLink: "No contact form was found on this page. This page links to a contact page. That page was not opened.",
    contactEmailOff: "The page marks the address so it stays readable instead of being scrambled.",
    contactLimit: "This check reads the public HTML of the landing page only. It does not run scripts, open other pages, or show the address or phone number. A form that exists only on another address, such as a contact page, is not part of this result. A hidden form field can reduce junk form posts. It does not stop a bot from copying an address already in the page.",
    contactYes: "Yes",
    contactNo: "No",
    contactScrambled: "Scrambled",
    contactCompareMailbox: "Mailbox in the page source",
    contactCompareForm: "Contact form",
    contactSignal: {
      plainEmail: "Mailbox written in the page",
      mailto: "Email link",
      schemaEmail: "Mailbox in the page data",
      plainPhone: "Phone number written in the page",
      telLink: "Phone link",
      schemaPhone: "Phone number in the page data",
      cloudflareObfuscation: "Scrambled mailbox",
      emailLeftReadable: "Address left readable on purpose",
      contactForm: "Contact form",
      contactPageLink: "Link to a contact page",
    },
    mobile: "Mobile",
    desktop: "Desktop",
    detailedSocial: "See profiles and the sharing preview",
    notScored: "Not scored",
    fresh: "Fresh Google test",
    cached: "Result cached for up to 15 minutes",
    tested: "Tested",
    finalUrl: "Final page tested",
    redirectNote: "You entered {requested}. That address redirects, so these scores are for the landing page, matching the page Google PageSpeed reports.",
    lighthouse: "Lighthouse version",
    compareGoogle: "Compare this run with Google PageSpeed",
    fieldTitle: "Real visitor experience",
    fieldIntro: "Public Chrome visitor data from the previous 28 days",
    fieldPage: "This page",
    fieldOrigin: "Whole website",
    fieldPageDetail: "These numbers are for this landing page.",
    fieldOriginDetail: "These numbers cover the whole site address. This page does not have enough visits of its own.",
    noFieldData: "Google does not have enough public visitor data for this page yet.",
    labTitle: "Page speed details",
    opportunitiesTitle: "Ways to improve page speed",
    freshTest: "Run a fresh Google test",
    freshHelp: "Performance can change between tests because traffic, hosting, and page content change. A fresh test bypasses ROALLA’s 15-minute cache.",
    previousTitle: "Change since your previous check",
    previousIntro: "Stored only in this browser. This comparison is not shared with ROALLA.",
    previousChecked: "Previous check",
    improved: "improved",
    declined: "lower",
    unchanged: "no change",
    competitorTitle: "Compare with another public website",
    competitorIntro: "Enter a competitor or peer website to compare the same public setup checks. This does not compare business quality, revenue, or market position.",
    competitorLabel: "Website to compare",
    competitorButton: "Compare websites",
    competitorLoading: "Checking the comparison website…",
    competitorError: "We could not complete the comparison. Check the website address and try again.",
    yourWebsite: "Your website",
    comparisonWebsite: "Comparison website",
    mobilePerformance: "Mobile lab performance",
    desktopPerformance: "Desktop lab performance",
    socialScore: "Social sharing setup",
    agenticTitle: "Agentic (AI) readiness",
    agenticDescription: "The Agentic Browsing score from the same Google PageSpeed test, for the phone page and the computer page.",
    agenticSignal: {
      readable: {
        label: "Text an assistant can read",
        result: {
          20: "Enough visible text is on the page for an assistant to describe it.",
          10: "Some visible text is on the page, but not enough for a clear description.",
          0: "Very little text is available for an assistant to read.",
        },
      },
      answer: {
        label: "A passage it can quote",
        result: {
          20: "A heading and a paragraph give an assistant a passage to quote.",
          0: "The page is missing a clear heading paired with a paragraph an assistant can quote.",
        },
      },
      facts: {
        label: "Business facts it can trust",
        result: {
          20: "The page names the business and includes a description or an address.",
          8: "The page marks a business, without a description or an address next to the name.",
          0: "The page does not publish business facts an assistant can use.",
        },
      },
      liftable: {
        label: "An offer it can lift",
        result: {
          15: "A service, product, offer, or FAQ is available in the page data.",
          0: "The page data does not include a service, product, offer, or FAQ.",
        },
      },
      guide: {
        label: "A guide written for assistants",
        result: {
          15: "An llms.txt guide is published for assistants.",
          8: "The page links to an assistant guide. The guide file is missing or too short.",
          0: "No assistant guide is published.",
        },
      },
      retrieval: {
        label: "Permission to retrieve the page",
        result: {
          10: "Common answer engines are allowed to retrieve the page.",
          6: "No robots file was found, so retrieval permission is only partly confirmed.",
          4: "At least one common answer engine is blocked from the site.",
          0: "The site blocks retrieval of the page.",
        },
      },
    },
    agenticAudit: {
      "agent-accessibility-tree": {
        label: "Accessibility tree",
        pass: "The structure an agent uses to read the page is well formed.",
        fail: "The structure an agent uses to read the page has gaps.",
      },
      "cumulative-layout-shift": {
        label: "Layout stability",
        pass: "The page stays still enough for an agent to use what it sees.",
        fail: "The page moves while it loads, which makes it harder for an agent to use.",
      },
      "llms-txt": {
        label: "Assistant guide",
        pass: "The /llms.txt guide meets the PageSpeed check.",
        fail: "The /llms.txt guide does not meet the PageSpeed check.",
      },
      "ard-schema": {
        label: "Agent catalog",
        pass: "The agent catalog file is valid.",
        fail: "The agent catalog file does not match the expected format.",
      },
      "webmcp-schema-validity": {
        label: "Agent tool schema",
        pass: "The tools published for agents have a valid schema.",
        fail: "The tools published for agents have a schema problem.",
      },
      "webmcp-registered-tools": {
        label: "Agent tools",
        pass: "The page registers tools an agent can call.",
        fail: "The page does not register tools an agent can call.",
      },
      "webmcp-form-coverage": {
        label: "Forms an agent can use",
        pass: "The forms on the page are marked for an agent.",
        fail: "Some forms on the page are not marked for an agent.",
      },
    },
    impact: "Likely impact",
    effort: "Typical effort",
    high: "High",
    medium: "Medium",
    low: "Low",
    actionsTitle: "What to improve first",
    actionsIntro: "Start with these areas. They are likely to make the greatest difference based on this check.",
    fixNow: "Fix now",
    planNext: "Plan next",
    automatedStrong: "Your results are strong. The next step is to make sure the message, content, and customer journey are helping visitors take action.",
    humanTitle: "What the scores cannot tell you",
    human: [
      "Whether visitors quickly understand what you offer",
      "Which social channels are right for your customers",
      "Whether your content builds trust and encourages inquiries",
    ],
    domainTitle: "Domain and email health",
    domainDescription: "Public records for this domain. They tell other mail systems whether a message really comes from this business.",
    domainWhyTitle: "Why this matters",
    domainWhy: "When these records are missing or loose, mail you send is more likely to be filed as junk or flagged as phishing. Someone else can also more easily send a message that looks like it came from you.",
    domainChecked: "Checked on",
    domainStatus: { pass: "In place", review: "Needs a review", gap: "Missing" },
    domainError: "We could not read the domain records.",
    domainLoading: "Reading the domain records…",
    domainCheck: {
      mx: {
        title: "Mail delivery",
        short: "Delivery",
        pass: "Mail for this domain has a destination.",
        review: "The mail destination needs a closer look.",
        gap: "This domain has no place for mail to arrive.",
        why: "Customers who reply need a destination. Without one, their message never arrives, and mail you send is easier for providers to treat as junk.",
        action: "Give this domain a mail destination so replies arrive, and so messages you send are less likely to be treated as junk.",
      },
      spf: {
        title: "Who may send mail (SPF)",
        short: "SPF",
        pass: "A list names the services allowed to send mail for this domain.",
        review: "The sender list is present, but it does not clearly reject unlisted mail.",
        gap: "There is no usable list of who may send mail for this domain.",
        why: "Mailbox providers use this list to decide whether a quote, invoice, or reply really came from you. A missing list, or a list that allows anyone, makes that mail more likely to land in junk or to be flagged as phishing.",
        action: "Publish one sender list that names every service allowed to send for this domain, and reject mail from everyone else.",
      },
      dkim: {
        title: "Signed mail (DKIM)",
        short: "DKIM",
        pass: "A common sending service signs mail for this domain.",
        review: "A signature was found, and it still needs a closer look.",
        gap: "No signature was found on the common sending services.",
        why: "A signature shows the message was not changed on the way. Without one, providers have less reason to trust the message and are more likely to file it as junk or phishing. A custom selector can still exist even when the common ones are absent.",
        action: "Turn on signing for each service that sends mail for this domain.",
      },
      dmarc: {
        title: "Forged-mail policy (DMARC)",
        short: "DMARC",
        pass: "Providers are told to quarantine or reject mail that fails the checks.",
        review: "The policy only watches. It does not yet stop forged mail.",
        gap: "There is no policy for mail that fails the sender checks.",
        why: "This policy tells providers what to do when a message fails the sender checks, including mail that only pretends to be from you. Without it, phishing that uses your name is easier, and your own mail is easier to discard.",
        action: "Publish a policy that tells providers to quarantine or reject mail that fails the sender checks, after confirming legitimate mail still passes.",
      },
      names: {
        title: "Bare name and www",
        short: "www",
        pass: "The bare name and www reach the same place.",
        review: "The bare name and www resolve to different addresses.",
        gap: "One of the names does not resolve.",
        why: "People type either name, and links in email use one of them. If they do not reach the same website, a customer can miss the page, and mail that names one address can fail checks that expect the other.",
        action: "Point the bare name and www at the same website so links and mail land in one place.",
      },
    },
    methodology: "How we calculate the results",
    methodologyBody:
      "This report checks one landing page. It is not a review of every page on the website. The address you enter is followed through redirects to the page a visitor lands on, and that page is what the scores measure. Website category scores come from a Lighthouse lab test of that page, run by Google PageSpeed Insights, once as a phone and once as a computer. Real visitor information, when available, comes from aggregated Chrome data over the previous 28 days. When that page does not have enough visits, those visitor numbers cover the whole site address. Social sharing results come from the public HTML of that landing page. Assistant readiness uses that same page, plus the site’s robots.txt and llms.txt files. The contact check reads that page’s HTML and reports whether a mailbox, a phone number, or a form is present. It does not run scripts, open other pages, or display or store the address or number. Domain and email health reads the public mail and name records: where mail is delivered, which services may send it, whether messages are signed, and whether the bare name and www reach the same place. These results stay separate because they measure different parts of your online presence.",
    print: "Save my branded action plan",
    reportLabel: "ROALLA Digital Presence Action Plan",
    reportPrepared: "Prepared",
    executiveTitle: "Executive summary",
    recommendedTitle: "Recommended ROALLA starting point",
    recommendationVisibility: "Visibility Improvement Sprint",
    recommendationVisibilityBody: "Improve the search, social, and technical signals that help people and digital systems find and understand the business.",
    recommendationConversion: "Website Conversion Refresh",
    recommendationConversionBody: "Address experience and customer-journey barriers before deciding whether a complete rebuild is necessary.",
    recommendationManaged: "Digital Baseline and Managed Optimization",
    recommendationManagedBody: "Protect the current foundation, monitor change, and improve the next highest-value opportunity over time.",
    blueprintLink: "Build my 90-day value blueprint",
    calculatorsLink: "Estimate potential business value",
    monitoringLink: "Preview ongoing monitoring",
    ctaTitle: "Get a free 15-minute review of your results",
    ctaBody: "A ROALLA specialist will explain your biggest opportunity, answer your questions, and recommend a practical next step.",
    ctaSteps: ["We review your results", "You receive one clear priority", "You decide whether to continue"],
    ctaProof: "30+ years of business and technology experience across 500+ engagements.",
    ctaReassurance: "Free review. No obligation. Personal reply within one business day.",
    cta: "Request my free results review",
    sprintEyebrow: "Optional paid next step",
    sprintTitle: "Digital Presence Improvement Sprint",
    sprintTimeline: "Focused delivery, usually 1 to 2 weeks after scope is confirmed",
    sprintBody: "Turn the findings into a practical improvement plan with clear priorities, implementation guidance, and a follow-up check.",
    sprintItems: ["Priority action plan", "Effort and implementation guidance", "Follow-up measurement"],
    sprintPrice: "Scope and pricing are confirmed after your free results review.",
    sprintCta: "Discuss the improvement sprint",
    partialTitle: "We could not complete every part of the check",
    technicalError: "We could not measure the website experience.",
    socialError: "We could not measure the social sharing setup.",
    actionTechnical: {
      performance: "Help the page load and respond faster",
      accessibility: "Make the page easier for everyone to use",
      bestPractices: "Improve website reliability and security",
      seo: "Help search engines understand the page",
    },
    actionSocial: {
      profileLinks: "Make your main social profiles easy to find",
      structuredProfiles: "Help search engines connect your website to your social profiles",
      openGraph: "Improve how your page looks when it is shared",
      socialCards: "Add a clear image and message for social sharing",
      organizationSchema: "Help search engines recognize your business name and logo",
      pageIdentity: "Add a clear page title, description, and preferred address",
    },
    actionCost: {
      performance: "On {strategies}, people leave a slow page before they see the offer. Current score: {score}/100.",
      accessibility: "On {strategies}, missed labels, contrast, or controls can stop a ready visitor from sending an inquiry. Current score: {score}/100.",
      bestPractices: "On {strategies}, errors and trust gaps interrupt the visit before it becomes a conversation. Current score: {score}/100.",
      seo: "On {strategies}, an unclear page is harder for the right customers to find. Current score: {score}/100.",
      profileLinks: "People cannot easily reach your main social profiles from this page. Current result: {score}%.",
      structuredProfiles: "Search systems cannot reliably connect this website to your social profiles. Current result: {score}%.",
      openGraph: "A shared link can arrive without a clear title, description, or image. Current result: {score}%.",
      socialCards: "A social preview can arrive without a clear image and message. Current result: {score}%.",
      organizationSchema: "Search systems may not recognize the business name and logo. Current result: {score}%.",
      pageIdentity: "Without a clear title, description, or preferred address, the page is harder to choose. Current result: {score}%.",
      agentic: "Search readiness does not measure this. An assistant needs text it can quote, facts it can trust, and permission to retrieve the page. Current score: {score}/100.",
    },
    phoneGap: "Your phone result averages {mobile} and your computer result averages {desktop}. Most visitors will feel the phone result.",
    agenticGap: "Search readiness averages {seo}. Agentic (AI) readiness is {agentic}. A page can be easy to find in search and still be hard for an assistant to quote or describe.",
    agenticGapDevices: "Search readiness averages {seo}. Agentic (AI) readiness is {mobile} on a phone and {desktop} on a computer. A page can be easy to find in search and still be hard for an assistant to quote or describe.",
    actionAgentic: "Make the page easier for an assistant to describe",
    findingTitle: "One finding from this check",
    findingDevice: { mobile: "a phone", desktop: "a computer" },
    findingOpportunity: "On {strategy}, the largest measured slowdown is “{title}”.{detail}",
    findingDelay: "That delay is what people feel before they see the offer.",
    findingSocial: {
      profileLinks: "The clearest sharing gap is the path to your social profiles. People cannot easily reach them from this page.",
      structuredProfiles: "The clearest sharing gap is the connection between this website and your social profiles.",
      openGraph: "The clearest sharing gap is the link preview. A shared link can arrive without a clear title, description, or image.",
      socialCards: "The clearest sharing gap is the social card. A preview can arrive without a clear image and message.",
      organizationSchema: "The clearest sharing gap is business identity. Search systems may not recognize the name and logo.",
      pageIdentity: "The clearest sharing gap is the page identity. Without a clear title, description, or preferred address, the page is harder to choose.",
    },
    lead: {
      seo: "Search readiness averages {score}. The useful starting point is making this page easier for the right customers to find.",
      social: "Social sharing setup is {score} out of 100. A shared link is not yet carrying a clear message.",
      performance: "Lab performance averages {score}. Visitors are waiting before they can see the offer.",
      accessibility: "Accessibility averages {score}. Missed details on this page are where inquiries slip.",
      strong: "The measured scores are in a strong range. The useful next step is protecting that foundation and improving the next detail that can still grow inquiries.",
    },
    genericError: "The snapshot could not be completed. Please try again.",
    note: "Digital presence snapshot",
  },
  fr: {
    urlLabel: "Adresse de votre site Web",
    placeholder: "https://exemple.ca",
    submit: "Vérifier mon site",
    workingTitle: "Vérification de votre site",
    workingButton: "Vérification…",
    workingNote: "Cela prend habituellement une minute. Les résultats apparaissent lorsque chaque vérification est terminée.",
    summaryTitle: "Où regarder en premier",
    summaryIntro: "Le vert est en bon état. L’orange peut s’améliorer. Le rouge demande l’attention en premier.",
    summaryStatus: { strong: "En bon état", improve: "Peut s’améliorer", attention: "Demande l’attention" },
    summaryMissing: "Vérification impossible",
    summaryScores: {
      performance: "Vitesse",
      accessibility: "Accessibilité",
      bestPractices: "Fiabilité",
      seo: "Recherche",
    },
    summaryContactMailbox: "Adresse dans le code de la page",
    summaryContactPhone: "Numéro dans le code de la page",
    summaryContactScrambled: "Adresse brouillée",
    summaryContactClear: "Aucune adresse dans le code de la page",
    starting: "Démarrage de la vérification…",
    both: "Vérification de votre site, du partage social et des coordonnées…",
    technicalOnly: "Les résultats du partage social sont prêts. La vérification du site se termine…",
    socialOnly: "Les résultats du site sont prêts. La vérification du partage social et des coordonnées se termine…",
    resultsTitle: "Les résultats de votre site",
    resultsIntro: "Ce rapport vérifie la page d’arrivée qu’un visiteur atteint. Il ne vérifie pas chaque page du site. PageSpeed évalue cette page sur un téléphone et sur un ordinateur. Le partage social, la préparation pour un assistant et la vérification des coordonnées lisent cette même page. La santé du domaine et du courriel lit les enregistrements publics du nom de domaine. Chaque aspect est présenté séparément pour faciliter la lecture.",
    technicalTitle: "Expérience du site Web",
    technicalDescription: "Le fonctionnement de votre site sur téléphone et ordinateur",
    socialTitle: "Partage sur les réseaux sociaux",
    socialDescription: "La façon dont votre site présente vos profils et crée des aperçus de partage",
    contactTitle: "Coordonnées qu’un robot peut copier",
    contactDescription: "Si le code de cette page contient une adresse courriel ou un numéro de téléphone, et si la page offre un formulaire à la place.",
    contactMailboxExposed: "Une adresse courriel est dans le code de la page. Un robot peut la copier sans remplir de formulaire.",
    contactMailboxObfuscated: "Une adresse courriel est brouillée dans la page. Les robots simples la manquent souvent. Un robot déterminé peut encore la reconstituer.",
    contactMailboxClear: "Aucune adresse courriel n’a été trouvée dans le code de cette page.",
    contactPhoneExposed: "Un numéro de téléphone est dans le code de la page. Un robot peut le copier.",
    contactPhoneClear: "Aucun numéro de téléphone n’a été trouvé dans le code de cette page.",
    contactFormOnly: "Cette page offre un formulaire et ne publie pas d’adresse courriel dans le code. C’est ce qui garde le courriel indésirable loin de l’adresse.",
    contactFormAndMailbox: "Cette page a un formulaire, et elle publie aussi une adresse courriel dans le code. Le formulaire ne cache pas cette adresse.",
    contactFormMissing: "Aucun formulaire de contact n’a été trouvé sur cette page.",
    contactFormMissingLink: "Aucun formulaire de contact n’a été trouvé sur cette page. Cette page contient un lien vers une page de contact. Cette page n’a pas été ouverte.",
    contactEmailOff: "La page marque l’adresse pour qu’elle reste lisible au lieu d’être brouillée.",
    contactLimit: "Cette vérification lit uniquement le HTML public de la page d’arrivée. Elle n’exécute pas les scripts, n’ouvre pas d’autres pages et n’affiche ni l’adresse ni le numéro. Un formulaire qui se trouve seulement sur une autre adresse, comme une page de contact, ne fait pas partie de ce résultat. Un champ de formulaire caché peut réduire les envois indésirables. Il n’empêche pas un robot de copier une adresse déjà dans la page.",
    contactYes: "Oui",
    contactNo: "Non",
    contactScrambled: "Brouillée",
    contactCompareMailbox: "Adresse dans le code de la page",
    contactCompareForm: "Formulaire de contact",
    contactSignal: {
      plainEmail: "Adresse écrite dans la page",
      mailto: "Lien courriel",
      schemaEmail: "Adresse dans les données de la page",
      plainPhone: "Numéro écrit dans la page",
      telLink: "Lien téléphonique",
      schemaPhone: "Numéro dans les données de la page",
      cloudflareObfuscation: "Adresse brouillée",
      emailLeftReadable: "Adresse laissée lisible volontairement",
      contactForm: "Formulaire de contact",
      contactPageLink: "Lien vers une page de contact",
    },
    mobile: "Mobile",
    desktop: "Ordinateur",
    detailedSocial: "Voir les profils et l’aperçu de partage",
    notScored: "Non évalué",
    fresh: "Nouveau test Google",
    cached: "Résultat conservé pendant un maximum de 15 minutes",
    tested: "Vérifié",
    finalUrl: "Page finale vérifiée",
    redirectNote: "Vous avez entré {requested}. Cette adresse redirige les visiteurs, donc ces scores portent sur la page d’arrivée, la même page que Google PageSpeed évalue.",
    lighthouse: "Version de Lighthouse",
    compareGoogle: "Comparer ce test dans Google PageSpeed",
    fieldTitle: "Expérience des visiteurs réels",
    fieldIntro: "Données publiques des visiteurs Chrome des 28 derniers jours",
    fieldPage: "Cette page",
    fieldOrigin: "Tout le site",
    fieldPageDetail: "Ces chiffres portent sur cette page d’arrivée.",
    fieldOriginDetail: "Ces chiffres couvrent l’adresse du site entier. Cette page n’a pas assez de visites à elle seule.",
    noFieldData: "Google ne dispose pas encore de suffisamment de données publiques sur les visiteurs de cette page.",
    labTitle: "Détails sur la vitesse de la page",
    opportunitiesTitle: "Façons d’améliorer la vitesse de la page",
    freshTest: "Lancer un nouveau test Google",
    freshHelp: "La performance peut changer entre les tests selon le trafic, l’hébergement et le contenu. Un nouveau test contourne la mise en cache de 15 minutes de ROALLA.",
    previousTitle: "Changement depuis votre vérification précédente",
    previousIntro: "Ces données sont conservées uniquement dans ce navigateur et ne sont pas transmises à ROALLA.",
    previousChecked: "Vérification précédente",
    improved: "amélioration",
    declined: "baisse",
    unchanged: "aucun changement",
    competitorTitle: "Comparer avec un autre site public",
    competitorIntro: "Entrez le site d’un concurrent ou d’une entreprise comparable pour appliquer les mêmes vérifications publiques. Cette comparaison ne mesure pas la qualité de l’entreprise, ses revenus ni sa position sur le marché.",
    competitorLabel: "Site à comparer",
    competitorButton: "Comparer les sites",
    competitorLoading: "Vérification du site de comparaison…",
    competitorError: "Nous n’avons pas pu terminer la comparaison. Vérifiez l’adresse du site et réessayez.",
    yourWebsite: "Votre site",
    comparisonWebsite: "Site de comparaison",
    mobilePerformance: "Performance mobile en laboratoire",
    desktopPerformance: "Performance ordinateur en laboratoire",
    socialScore: "Configuration du partage social",
    agenticTitle: "Préparation agentique (IA)",
    agenticDescription: "Le score de navigation agentique du même test Google PageSpeed, pour la page téléphone et la page ordinateur.",
    agenticSignal: {
      readable: {
        label: "Texte qu’un assistant peut lire",
        result: {
          20: "La page contient assez de texte visible pour qu’un assistant la décrive.",
          10: "La page contient un peu de texte visible, mais pas assez pour une description claire.",
          0: "Très peu de texte est disponible pour un assistant.",
        },
      },
      answer: {
        label: "Un passage à citer",
        result: {
          20: "Un titre et un paragraphe donnent à un assistant un passage à citer.",
          0: "La page n’offre pas un titre clair accompagné d’un paragraphe qu’un assistant peut citer.",
        },
      },
      facts: {
        label: "Faits d’entreprise fiables",
        result: {
          20: "La page nomme l’entreprise et comprend une description ou une adresse.",
          8: "La page indique une entreprise, sans description ni adresse à côté du nom.",
          0: "La page ne publie pas de faits d’entreprise qu’un assistant peut utiliser.",
        },
      },
      liftable: {
        label: "Une offre à extraire",
        result: {
          15: "Un service, un produit, une offre ou une FAQ figure dans les données de la page.",
          0: "Les données de la page ne comprennent pas de service, de produit, d’offre ou de FAQ.",
        },
      },
      guide: {
        label: "Un guide écrit pour les assistants",
        result: {
          15: "Un guide llms.txt est publié pour les assistants.",
          8: "La page renvoie vers un guide pour assistants. Le fichier du guide est absent ou trop court.",
          0: "Aucun guide pour assistants n’est publié.",
        },
      },
      retrieval: {
        label: "Autorisation de récupérer la page",
        result: {
          10: "Les moteurs de réponse courants peuvent récupérer la page.",
          6: "Aucun fichier robots n’a été trouvé, donc l’autorisation de récupération n’est que partielle.",
          4: "Au moins un moteur de réponse courant est bloqué.",
          0: "Le site bloque la récupération de la page.",
        },
      },
    },
    agenticAudit: {
      "agent-accessibility-tree": {
        label: "Arbre d’accessibilité",
        pass: "La structure qu’un agent utilise pour lire la page est bien formée.",
        fail: "La structure qu’un agent utilise pour lire la page comporte des lacunes.",
      },
      "cumulative-layout-shift": {
        label: "Stabilité de la mise en page",
        pass: "La page reste assez stable pour qu’un agent utilise ce qu’il voit.",
        fail: "La page bouge pendant le chargement, ce qui la rend plus difficile à utiliser pour un agent.",
      },
      "llms-txt": {
        label: "Guide pour assistants",
        pass: "Le guide /llms.txt respecte la vérification PageSpeed.",
        fail: "Le guide /llms.txt ne respecte pas la vérification PageSpeed.",
      },
      "ard-schema": {
        label: "Catalogue pour agents",
        pass: "Le fichier de catalogue pour agents est valide.",
        fail: "Le fichier de catalogue pour agents ne correspond pas au format attendu.",
      },
      "webmcp-schema-validity": {
        label: "Schéma des outils pour agents",
        pass: "Les outils publiés pour les agents ont un schéma valide.",
        fail: "Les outils publiés pour les agents ont un problème de schéma.",
      },
      "webmcp-registered-tools": {
        label: "Outils pour agents",
        pass: "La page enregistre des outils qu’un agent peut appeler.",
        fail: "La page n’enregistre pas d’outils qu’un agent peut appeler.",
      },
      "webmcp-form-coverage": {
        label: "Formulaires utilisables par un agent",
        pass: "Les formulaires de la page sont marqués pour un agent.",
        fail: "Certains formulaires de la page ne sont pas marqués pour un agent.",
      },
    },
    impact: "Impact probable",
    effort: "Effort habituel",
    high: "Élevé",
    medium: "Moyen",
    low: "Faible",
    actionsTitle: "Les améliorations à faire en premier",
    actionsIntro: "Commencez par ces aspects. Selon cette vérification, ce sont ceux qui pourraient faire la plus grande différence.",
    fixNow: "Corriger maintenant",
    planNext: "Planifier ensuite",
    automatedStrong: "Vos résultats sont solides. La prochaine étape consiste à vérifier si le message, le contenu et le parcours client encouragent les visiteurs à agir.",
    humanTitle: "Ce que les scores ne peuvent pas évaluer",
    human: [
      "La rapidité avec laquelle les visiteurs comprennent votre offre",
      "Les réseaux sociaux les plus pertinents pour votre clientèle",
      "La capacité du contenu à inspirer confiance et à générer des demandes",
    ],
    domainTitle: "Santé du domaine et du courriel",
    domainDescription: "Les enregistrements publics de ce domaine. Ils indiquent aux autres systèmes de messagerie si un message vient vraiment de cette entreprise.",
    domainWhyTitle: "Pourquoi c’est important",
    domainWhy: "Quand ces enregistrements manquent ou restent trop ouverts, le courriel que vous envoyez a plus de chances d’être classé comme indésirable ou signalé comme hameçonnage. Quelqu’un d’autre peut aussi plus facilement envoyer un message qui semble venir de vous.",
    domainChecked: "Vérifié sur",
    domainStatus: { pass: "En place", review: "À revoir", gap: "Manquant" },
    domainError: "Nous n’avons pas pu lire les enregistrements du domaine.",
    domainLoading: "Lecture des enregistrements du domaine…",
    domainCheck: {
      mx: {
        title: "Livraison du courriel",
        short: "Livraison",
        pass: "Le courriel de ce domaine a une destination.",
        review: "La destination du courriel mérite un examen plus attentif.",
        gap: "Ce domaine n’a pas d’endroit où le courriel peut arriver.",
        why: "Les clients qui répondent ont besoin d’une destination. Sans elle, leur message n’arrive pas, et le courriel que vous envoyez est plus facile à traiter comme indésirable.",
        action: "Donner à ce domaine une destination de courriel pour que les réponses arrivent, et pour que vos messages soient moins traités comme indésirables.",
      },
      spf: {
        title: "Qui peut envoyer (SPF)",
        short: "SPF",
        pass: "Une liste nomme les services autorisés à envoyer pour ce domaine.",
        review: "La liste des expéditeurs existe, mais elle ne refuse pas clairement le courriel non listé.",
        gap: "Il n’y a pas de liste utilisable de qui peut envoyer pour ce domaine.",
        why: "Les fournisseurs de messagerie utilisent cette liste pour décider si une soumission, une facture ou une réponse vient vraiment de vous. Une liste absente, ou une liste qui autorise tout le monde, rend ce courriel plus susceptible d’arriver dans les indésirables ou d’être signalé comme hameçonnage.",
        action: "Publier une seule liste qui nomme chaque service autorisé à envoyer pour ce domaine, et refuser le courriel de tous les autres.",
      },
      dkim: {
        title: "Courriel signé (DKIM)",
        short: "DKIM",
        pass: "Un service d’envoi courant signe le courriel de ce domaine.",
        review: "Une signature a été trouvée, et elle mérite encore un examen.",
        gap: "Aucune signature n’a été trouvée sur les services d’envoi courants.",
        why: "Une signature montre que le message n’a pas été modifié en route. Sans elle, les fournisseurs ont moins de raisons de faire confiance au message et sont plus susceptibles de le classer comme indésirable ou comme hameçonnage. Un sélecteur personnalisé peut encore exister même si les sélecteurs courants sont absents.",
        action: "Activer la signature pour chaque service qui envoie du courriel pour ce domaine.",
      },
      dmarc: {
        title: "Politique contre l’usurpation (DMARC)",
        short: "DMARC",
        pass: "Les fournisseurs doivent mettre en quarantaine ou refuser le courriel qui échoue aux vérifications.",
        review: "La politique observe seulement. Elle n’arrête pas encore le courriel usurpé.",
        gap: "Il n’y a pas de politique pour le courriel qui échoue aux vérifications d’expéditeur.",
        why: "Cette politique dit aux fournisseurs quoi faire quand un message échoue aux vérifications, y compris un message qui prétend seulement venir de vous. Sans elle, l’hameçonnage qui utilise votre nom est plus facile, et votre propre courriel est plus facile à écarter.",
        action: "Publier une politique qui demande aux fournisseurs de mettre en quarantaine ou de refuser le courriel qui échoue aux vérifications, après avoir confirmé que le courriel légitime passe encore.",
      },
      names: {
        title: "Nom nu et www",
        short: "www",
        pass: "Le nom nu et www mènent au même endroit.",
        review: "Le nom nu et www pointent vers des adresses différentes.",
        gap: "L’un des noms ne se résout pas.",
        why: "Les gens saisissent l’un ou l’autre, et les liens dans le courriel en utilisent un. S’ils n’ouvrent pas le même site, un client peut manquer la page, et un courriel qui nomme une adresse peut échouer à des vérifications qui attendent l’autre.",
        action: "Pointer le nom nu et www vers le même site pour que les liens et le courriel arrivent au même endroit.",
      },
    },
    methodology: "Comment les résultats sont calculés",
    methodologyBody:
      "Ce rapport vérifie une seule page d’arrivée. Il ne passe pas en revue chaque page du site. L’adresse entrée est suivie à travers les redirections jusqu’à la page où un visiteur arrive, et c’est cette page que les scores mesurent. Les scores proviennent d’un test de laboratoire Lighthouse de cette page, exécuté par Google PageSpeed Insights, une fois comme téléphone et une fois comme ordinateur. Les renseignements sur les visiteurs réels, lorsqu’ils sont disponibles, proviennent de données Chrome regroupées sur les 28 derniers jours. Lorsque cette page n’a pas assez de visites, ces chiffres de visiteurs couvrent l’adresse du site entier. Les résultats du partage social proviennent du HTML public de cette page d’arrivée. La préparation pour un assistant utilise cette même page, ainsi que les fichiers robots.txt et llms.txt du site. La vérification des coordonnées lit le HTML de cette page et indique si une adresse courriel, un numéro de téléphone ou un formulaire s’y trouve. Elle n’exécute pas les scripts, n’ouvre pas d’autres pages et n’affiche ni ne conserve l’adresse ou le numéro. La santé du domaine et du courriel lit les enregistrements publics de courriel et de nom : où le courriel est livré, quels services peuvent l’envoyer, si les messages sont signés, et si le nom nu et www mènent au même endroit. Ces résultats restent séparés puisqu’ils évaluent différentes parties de votre présence en ligne.",
    print: "Enregistrer mon plan d’action ROALLA",
    reportLabel: "Plan d’action de présence numérique ROALLA",
    reportPrepared: "Préparé le",
    executiveTitle: "Sommaire exécutif",
    recommendedTitle: "Point de départ ROALLA recommandé",
    recommendationVisibility: "Sprint d’amélioration de la visibilité",
    recommendationVisibilityBody: "Améliorez les signaux de recherche, de partage social et de santé technique qui aident les personnes et les systèmes numériques à comprendre l’entreprise.",
    recommendationConversion: "Rafraîchissement de conversion du site",
    recommendationConversionBody: "Corrigez les obstacles de l’expérience et du parcours client avant de décider si une reconstruction complète est nécessaire.",
    recommendationManaged: "Référence numérique et optimisation gérée",
    recommendationManagedBody: "Protégez la fondation actuelle, suivez les changements et améliorez progressivement la prochaine possibilité de grande valeur.",
    blueprintLink: "Créer mon plan de valeur sur 90 jours",
    calculatorsLink: "Estimer la valeur d’affaires possible",
    monitoringLink: "Prévisualiser le suivi continu",
    ctaTitle: "Obtenez un examen gratuit de 15 minutes de vos résultats",
    ctaBody: "Un spécialiste de ROALLA expliquera votre principale possibilité d’amélioration, répondra à vos questions et recommandera une prochaine étape pratique.",
    ctaSteps: ["Nous examinons vos résultats", "Vous recevez une priorité claire", "Vous décidez si vous souhaitez poursuivre"],
    ctaProof: "Plus de 30 ans d’expérience en affaires et en technologie dans plus de 500 mandats.",
    ctaReassurance: "Examen gratuit. Sans obligation. Réponse personnelle dans un délai d’un jour ouvrable.",
    cta: "Demander mon examen gratuit",
    sprintEyebrow: "Prochaine étape payante optionnelle",
    sprintTitle: "Sprint d’amélioration de la présence numérique",
    sprintTimeline: "Livraison ciblée, généralement de 1 à 2 semaines après la confirmation de la portée",
    sprintBody: "Transformez les constats en plan pratique avec des priorités claires, des conseils de mise en œuvre et une vérification de suivi.",
    sprintItems: ["Plan d’action priorisé", "Effort et conseils de mise en œuvre", "Mesure de suivi"],
    sprintPrice: "La portée et le prix sont confirmés après votre examen gratuit des résultats.",
    sprintCta: "Discuter du sprint d’amélioration",
    partialTitle: "Nous n’avons pas pu terminer toutes les vérifications",
    technicalError: "Nous n’avons pas pu mesurer l’expérience du site.",
    socialError: "Nous n’avons pas pu mesurer le partage social.",
    actionTechnical: {
      performance: "Accélérer le chargement et la réaction de la page",
      accessibility: "Rendre la page plus facile à utiliser pour tous",
      bestPractices: "Améliorer la fiabilité et la sécurité du site",
      seo: "Aider les moteurs de recherche à comprendre la page",
    },
    actionSocial: {
      profileLinks: "Rendre vos principaux profils sociaux faciles à trouver",
      structuredProfiles: "Aider les moteurs de recherche à relier votre site à vos profils sociaux",
      openGraph: "Améliorer l’apparence de votre page lorsqu’elle est partagée",
      socialCards: "Ajouter une image et un message clairs pour le partage social",
      organizationSchema: "Aider les moteurs de recherche à reconnaître votre entreprise et son logo",
      pageIdentity: "Ajouter un titre, une description et une adresse de page clairs",
    },
    actionCost: {
      performance: "Sur {strategies}, les gens quittent une page lente avant de voir l’offre. Score actuel : {score}/100.",
      accessibility: "Sur {strategies}, des libellés, un contraste ou des commandes manqués peuvent empêcher un visiteur prêt d’envoyer une demande. Score actuel : {score}/100.",
      bestPractices: "Sur {strategies}, des erreurs et des doutes interrompent la visite avant qu’elle devienne une conversation. Score actuel : {score}/100.",
      seo: "Sur {strategies}, une page peu claire est plus difficile à trouver pour les bons clients. Score actuel : {score}/100.",
      profileLinks: "Les gens ne peuvent pas facilement atteindre vos principaux profils sociaux depuis cette page. Résultat actuel : {score} %.",
      structuredProfiles: "Les moteurs de recherche ne peuvent pas relier de façon fiable ce site à vos profils sociaux. Résultat actuel : {score} %.",
      openGraph: "Un lien partagé peut arriver sans titre, description ou image clairs. Résultat actuel : {score} %.",
      socialCards: "Un aperçu social peut arriver sans image ni message clairs. Résultat actuel : {score} %.",
      organizationSchema: "Les moteurs de recherche peuvent ne pas reconnaître le nom et le logo de l’entreprise. Résultat actuel : {score} %.",
      pageIdentity: "Sans titre, description ou adresse de page clairs, la page est plus difficile à choisir. Résultat actuel : {score} %.",
      agentic: "La préparation à la recherche ne mesure pas cela. Un assistant a besoin d’un texte à citer, de faits fiables et de l’autorisation de récupérer la page. Score actuel : {score}/100.",
    },
    phoneGap: "Le résultat sur téléphone est de {mobile} en moyenne et le résultat sur ordinateur est de {desktop}. La plupart des visiteurs ressentiront le résultat du téléphone.",
    agenticGap: "La préparation à la recherche est de {seo} en moyenne. La préparation agentique (IA) est de {agentic}. Une page peut être facile à trouver en recherche et rester difficile à citer ou à décrire pour un assistant.",
    agenticGapDevices: "La préparation à la recherche est de {seo} en moyenne. La préparation agentique (IA) est de {mobile} sur téléphone et de {desktop} sur ordinateur. Une page peut être facile à trouver en recherche et rester difficile à citer ou à décrire pour un assistant.",
    actionAgentic: "Rendre la page plus facile à décrire pour un assistant",
    findingTitle: "Un constat de cette vérification",
    findingDevice: { mobile: "téléphone", desktop: "ordinateur" },
    findingOpportunity: "Sur {strategy}, le plus grand ralentissement mesuré est « {title} ».{detail}",
    findingDelay: "C’est ce délai que les gens ressentent avant de voir l’offre.",
    findingSocial: {
      profileLinks: "L’écart de partage le plus clair est le chemin vers vos profils sociaux. Les gens ne peuvent pas les atteindre facilement depuis cette page.",
      structuredProfiles: "L’écart de partage le plus clair est le lien entre ce site et vos profils sociaux.",
      openGraph: "L’écart de partage le plus clair est l’aperçu du lien. Un lien partagé peut arriver sans titre, description ou image clairs.",
      socialCards: "L’écart de partage le plus clair est la carte sociale. Un aperçu peut arriver sans image ni message clairs.",
      organizationSchema: "L’écart de partage le plus clair est l’identité de l’entreprise. Les moteurs de recherche peuvent ne pas reconnaître le nom et le logo.",
      pageIdentity: "L’écart de partage le plus clair est l’identité de la page. Sans titre, description ou adresse clairs, la page est plus difficile à choisir.",
    },
    lead: {
      seo: "La préparation à la recherche est de {score} en moyenne. Le point de départ utile est de rendre cette page plus facile à trouver pour les bons clients.",
      social: "Le partage social est à {score} sur 100. Un lien partagé ne porte pas encore un message clair.",
      performance: "La performance de laboratoire est de {score} en moyenne. Les visiteurs attendent avant de voir l’offre.",
      accessibility: "L’accessibilité est de {score} en moyenne. Les détails manqués sur cette page sont là où les demandes se perdent.",
      strong: "Les scores mesurés sont dans une bonne zone. La prochaine étape utile est de protéger cette base et d’améliorer le prochain détail qui peut encore faire croître les demandes.",
    },
    genericError: "L’aperçu n’a pas pu être produit. Veuillez réessayer.",
    note: "Aperçu de présence numérique",
  },
} as const;

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

function agenticSignalResult(results: object, points: number) {
  const table = results as Record<number, string | undefined>;
  return table[points] ?? table[0] ?? "";
}

function presentAction(
  action: DigitalPresenceAction,
  labels: (typeof copy)["en"] | (typeof copy)["fr"],
  language: "en" | "fr",
) {
  if (action.source === "domain") {
    const check = labels.domainCheck[action.key];
    return { title: check.title, why: check.action };
  }
  if (action.source === "agentic") {
    return {
      title: labels.actionAgentic,
      why: fill(labels.actionCost.agentic, { score: String(action.score) }),
    };
  }
  const strategies = action.source === "technical"
    ? action.strategies.map((strategy) => strategy === "mobile" ? labels.mobile : labels.desktop).join(` ${language === "fr" ? "et" : "and"} `)
    : "";
  if (action.source === "technical") {
    return {
      title: labels.actionTechnical[action.key],
      why: fill(labels.actionCost[action.key], { score: String(action.score), strategies }),
    };
  }
  return {
    title: labels.actionSocial[action.key],
    why: fill(labels.actionCost[action.key], { score: String(action.score), strategies }),
  };
}

function describeAgenticSignal(
  signal: { id: string; points: number; label?: string },
  copy: { agenticAudit: object; agenticSignal: object },
) {
  const audits = copy.agenticAudit as Record<string, { label: string; pass: string; fail: string } | undefined>;
  const signals = copy.agenticSignal as Record<string, { label: string; result: object } | undefined>;
  const audit = audits[signal.id];
  if (audit) return { label: audit.label, note: signal.points >= 90 ? audit.pass : audit.fail };
  const signalCopy = signals[signal.id];
  if (signalCopy) return { label: signalCopy.label, note: agenticSignalResult(signalCopy.result, signal.points) };
  return { label: signal.label ?? signal.id, note: "" };
}

function contactLines(exposure: ContactExposure | undefined, labels: {
  contactMailboxExposed: string;
  contactMailboxObfuscated: string;
  contactMailboxClear: string;
  contactPhoneExposed: string;
  contactPhoneClear: string;
  contactFormOnly: string;
  contactFormAndMailbox: string;
  contactFormMissing: string;
  contactFormMissingLink: string;
  contactEmailOff: string;
}) {
  if (!exposure) return [];
  const lines = [
    exposure.mailboxInSource
      ? labels.contactMailboxExposed
      : exposure.cloudflareObfuscated
        ? labels.contactMailboxObfuscated
        : labels.contactMailboxClear,
    exposure.phoneInSource ? labels.contactPhoneExposed : labels.contactPhoneClear,
    exposure.contactForm && !exposure.mailboxInSource
      ? labels.contactFormOnly
      : exposure.contactForm
        ? labels.contactFormAndMailbox
        : exposure.contactPageLink
          ? labels.contactFormMissingLink
          : labels.contactFormMissing,
  ];
  if (exposure.emailLeftReadable) lines.push(labels.contactEmailOff);
  return lines;
}

function contactCompareValue(
  exposure: ContactExposure | undefined,
  labels: { contactYes: string; contactNo: string; contactScrambled: string },
  kind: "mailbox" | "form",
) {
  if (!exposure) return null;
  if (kind === "form") return exposure.contactForm ? labels.contactYes : labels.contactNo;
  if (exposure.mailboxInSource) return labels.contactYes;
  if (exposure.cloudflareObfuscated) return labels.contactScrambled;
  return labels.contactNo;
}

type SummaryTone = "strong" | "improve" | "attention";

type SummaryItem = {
  id: string;
  title: string;
  detail: string;
  tone: SummaryTone;
};

const summaryToneClass: Record<SummaryTone, string> = {
  strong: "text-emerald-600",
  improve: "text-amber-500",
  attention: "text-rose-600",
};

function toneFromScore(score: number): SummaryTone {
  if (score >= 90) return "strong";
  if (score >= 50) return "improve";
  return "attention";
}

function weakestCategory(snapshots: WebsiteVisibilitySnapshot[]) {
  let weakest: { key: ScoreName; score: number } | null = null;
  for (const snapshot of snapshots) {
    for (const key of scoreOrder) {
      const score = snapshot.scores[key];
      if (score == null) continue;
      if (!weakest || score < weakest.score) weakest = { key, score };
    }
  }
  return weakest;
}

function scoreTone(score: number | null) {
  if (score == null) return "text-slate-500";
  if (score >= 90) return "text-emerald-700";
  if (score >= 50) return "text-amber-700";
  return "text-rose-700";
}

export default function DigitalPresenceSnapshot({
  locale,
  initialUrl = "",
}: {
  locale: string;
  initialUrl?: string;
}) {
  const language = locale === "fr" ? "fr" : "en";
  const t = copy[language];
  const [url, setUrl] = useState(initialUrl);
  const [technical, setTechnical] = useState<TechnicalResponse | null>(null);
  const [social, setSocial] = useState<SocialPresenceSnapshot | null>(null);
  const [technicalError, setTechnicalError] = useState("");
  const [socialError, setSocialError] = useState("");
  const [technicalLoading, setTechnicalLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [domain, setDomain] = useState<DomainHealthSnapshot | null>(null);
  const [domainError, setDomainError] = useState("");
  const [domainLoading, setDomainLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [previous, setPrevious] = useState<SnapshotHistory | null>(null);
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [competitor, setCompetitor] = useState<CompetitorResult | null>(null);
  const [competitorLoading, setCompetitorLoading] = useState(false);
  const [competitorError, setCompetitorError] = useState("");
  const [printMounted, setPrintMounted] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);
  const workingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrintMounted(true);
  }, []);

  const technicalSnapshots = useMemo(
    () => [technical?.mobile?.snapshot, technical?.desktop?.snapshot].filter(
      (snapshot): snapshot is WebsiteVisibilitySnapshot => Boolean(snapshot),
    ),
    [technical],
  );
  const actions = useMemo(
    () => buildDigitalPresenceActions(technicalSnapshots, social ?? undefined, domain ?? undefined),
    [technicalSnapshots, social, domain],
  );
  const narrative = useMemo(
    () => buildSnapshotNarrative(technicalSnapshots, social ?? undefined),
    [technicalSnapshots, social],
  );

  useEffect(() => {
    if (started && !technicalLoading && !socialLoading && !domainLoading && (technical || social || domain)) {
      resultsRef.current?.focus();
    }
  }, [started, technicalLoading, socialLoading, domainLoading, technical, social, domain]);

  async function runSnapshot(forceFresh = false, honeypot: FormDataEntryValue | null = "") {
    const body = JSON.stringify({ url, website: honeypot, fresh: forceFresh });
    const previousResult = readHistory(url);
    setPrevious(previousResult);
    setStarted(true);
    setTechnical(null);
    setSocial(null);
    setDomain(null);
    setTechnicalError("");
    setSocialError("");
    setDomainError("");
    setTechnicalLoading(true);
    setSocialLoading(true);
    setDomainLoading(true);
    trackAnalyticsEvent(forceFresh ? "digital_snapshot_fresh" : "digital_snapshot_started");

    let completedTechnical: TechnicalResponse | null = null;
    let completedSocial: SocialPresenceSnapshot | null = null;

    const technicalRequest = fetch("/api/website-visibility-snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as TechnicalResponse;
        if (!payload.mobile?.snapshot && !payload.desktop?.snapshot) {
          throw new Error(payload.error || t.technicalError);
        }
        completedTechnical = payload;
        setTechnical(payload);
      })
      .catch((error) => setTechnicalError(error instanceof Error ? error.message : t.technicalError))
      .finally(() => setTechnicalLoading(false));

    const socialRequest = fetch("/api/social-presence-snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as {
          snapshot?: SocialPresenceSnapshot;
          error?: string;
        };
        if (!response.ok || !payload.snapshot) throw new Error(payload.error || t.socialError);
        completedSocial = payload.snapshot;
        setSocial(payload.snapshot);
      })
      .catch((error) => setSocialError(error instanceof Error ? error.message : t.socialError))
      .finally(() => setSocialLoading(false));

    const domainRequest = fetch("/api/domain-health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as {
          snapshot?: DomainHealthSnapshot;
          error?: string;
        };
        if (!response.ok || !payload.snapshot) throw new Error(payload.error || t.domainError);
        setDomain(payload.snapshot);
      })
      .catch((error) => setDomainError(error instanceof Error ? error.message : t.domainError))
      .finally(() => setDomainLoading(false));

    await Promise.allSettled([technicalRequest, socialRequest, domainRequest]);
    if (completedTechnical || completedSocial) {
      saveHistory(url, completedTechnical, completedSocial);
    }
    trackAnalyticsEvent("digital_snapshot_completed");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await runSnapshot(false, form.get("website"));
  }

  async function compareWebsite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCompetitorLoading(true);
    setCompetitorError("");
    setCompetitor(null);
    try {
      const body = JSON.stringify({ url: competitorUrl });
      const needsAgenticRefresh = (snapshot?: { agentic?: { source?: string } }) => {
        const source = snapshot?.agentic?.source;
        return source !== "lighthouse" && source !== "page";
      };
      const ownNeedsAgentic = needsAgenticRefresh(technical?.mobile?.snapshot) || needsAgenticRefresh(technical?.desktop?.snapshot);
      const [technicalResponse, socialResponse, ownResponse] = await Promise.all([
        fetch("/api/website-visibility-snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }),
        fetch("/api/social-presence-snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }),
        ownNeedsAgentic
          ? fetch("/api/website-visibility-snapshot", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url }),
            })
          : Promise.resolve(null),
      ]);
      const technicalPayload = (await technicalResponse.json().catch(() => ({}))) as TechnicalResponse;
      const socialPayload = (await socialResponse.json().catch(() => ({}))) as {
        snapshot?: SocialPresenceSnapshot;
      };
      if (ownResponse) {
        const ownPayload = (await ownResponse.json().catch(() => ({}))) as TechnicalResponse;
        if (ownPayload.mobile?.snapshot?.agentic?.source === "lighthouse" || ownPayload.desktop?.snapshot?.agentic?.source === "lighthouse") {
          setTechnical(ownPayload);
        }
      }
      if (!technicalPayload.mobile?.snapshot && !technicalPayload.desktop?.snapshot && !socialPayload.snapshot) {
        throw new Error(t.competitorError);
      }
      setCompetitor({
        url: competitorUrl,
        technical: technicalPayload,
        social: socialPayload.snapshot ?? null,
      });
      trackAnalyticsEvent("digital_snapshot_compared");
    } catch {
      setCompetitorError(t.competitorError);
    } finally {
      setCompetitorLoading(false);
    }
  }

  const loadingMessage = technicalLoading && socialLoading
    ? t.both
    : technicalLoading
      ? t.technicalOnly
      : socialLoading
        ? t.socialOnly
        : domainLoading
          ? t.domainLoading
          : t.starting;
  const resultUrl = social?.finalUrl || technicalSnapshots[0]?.finalUrl || url;
  const detailQuery = { url: resultUrl };
  const note = `${t.note}: ${resultUrl}. ${technicalSnapshots
    .map((snapshot) => `${snapshot.strategy} ${scoreOrder.map((name) => `${name} ${snapshot.scores[name] ?? t.notScored}`).join(", ")}`)
    .join(". ")}${social ? `. social ${social.score}/100` : ""}`.slice(0, 420);
  const dateFormatter = new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const currentMobilePerformance = technical?.mobile?.snapshot?.scores.performance ?? null;
  const currentDesktopPerformance = technical?.desktop?.snapshot?.scores.performance ?? null;
  const lead = narrative.offer.kind === "strong"
    ? t.lead.strong
    : fill(t.lead[narrative.offer.kind], { score: String(narrative.offer.score) });
  const recommendation = narrative.offer.kind === "seo" || narrative.offer.kind === "social"
    ? { title: t.recommendationVisibility, body: t.recommendationVisibilityBody, intent: "visibility" }
    : narrative.offer.kind === "performance" || narrative.offer.kind === "accessibility"
      ? { title: t.recommendationConversion, body: t.recommendationConversionBody, intent: "website" }
      : { title: t.recommendationManaged, body: t.recommendationManagedBody, intent: "website" };
  const seoScores = technicalSnapshots.map((snapshot) => snapshot.scores.seo).filter((score): score is number => score != null);
  const averageSeo = seoScores.length ? Math.round(seoScores.reduce((sum, score) => sum + score, 0) / seoScores.length) : null;
  const mobileAgentic = technical?.mobile?.snapshot?.agentic ?? null;
  const desktopAgentic = technical?.desktop?.snapshot?.agentic ?? null;
  const agenticViews = [
    ...(mobileAgentic ? [{ label: t.mobile, agentic: mobileAgentic }] : []),
    ...(desktopAgentic ? [{ label: t.desktop, agentic: desktopAgentic }] : []),
  ];
  const agenticScore = agenticViews.length
    ? Math.min(...agenticViews.map((view) => view.agentic.score))
    : social?.agentic?.score ?? null;
  const agenticGap = averageSeo != null && mobileAgentic && desktopAgentic && mobileAgentic.score !== desktopAgentic.score && averageSeo - Math.min(mobileAgentic.score, desktopAgentic.score) >= 15
    ? fill(t.agenticGapDevices, { seo: String(averageSeo), mobile: String(mobileAgentic.score), desktop: String(desktopAgentic.score) })
    : averageSeo != null && agenticScore != null && averageSeo - agenticScore >= 15
      ? fill(t.agenticGap, { seo: String(averageSeo), agentic: String(agenticScore) })
      : "";
  const reviewGoal = `${note} ${lead} ${recommendation.title}`.slice(0, 700);
  const finding = narrative.finding;
  const findingText = finding?.kind === "opportunity"
    ? `${fill(t.findingOpportunity, {
        strategy: t.findingDevice[finding.strategy],
        title: finding.title,
        detail: finding.detail ? ` ${finding.detail}${/[.!?]$/.test(finding.detail) ? "" : "."}` : "",
      })} ${t.findingDelay}`
    : finding?.kind === "social"
      ? t.findingSocial[finding.key]
      : "";
  const comparisonRows = [
    {
      label: t.mobilePerformance,
      primary: currentMobilePerformance,
      comparison: competitor?.technical?.mobile?.snapshot?.scores.performance ?? null,
    },
    {
      label: t.desktopPerformance,
      primary: currentDesktopPerformance,
      comparison: competitor?.technical?.desktop?.snapshot?.scores.performance ?? null,
    },
    {
      label: t.socialScore,
      primary: social?.score ?? null,
      comparison: competitor?.social?.score ?? null,
    },
    {
      label: `${t.agenticTitle} · ${t.mobile}`,
      primary: mobileAgentic?.score ?? null,
      comparison: competitor?.technical?.mobile?.snapshot?.agentic?.score ?? null,
    },
    {
      label: `${t.agenticTitle} · ${t.desktop}`,
      primary: desktopAgentic?.score ?? null,
      comparison: competitor?.technical?.desktop?.snapshot?.agentic?.score ?? null,
    },
    {
      label: t.contactCompareMailbox,
      primary: contactCompareValue(social?.contactExposure, t, "mailbox"),
      comparison: contactCompareValue(competitor?.social?.contactExposure, t, "mailbox"),
    },
    {
      label: t.contactCompareForm,
      primary: contactCompareValue(social?.contactExposure, t, "form"),
      comparison: contactCompareValue(competitor?.social?.contactExposure, t, "form"),
    },
  ];
  const historyRows = previous
    ? [
        { label: t.mobilePerformance, current: currentMobilePerformance, old: previous.mobilePerformance },
        { label: t.desktopPerformance, current: currentDesktopPerformance, old: previous.desktopPerformance },
        { label: t.socialScore, current: social?.score ?? null, old: previous.socialScore },
        { label: `${t.agenticTitle} · ${t.mobile}`, current: mobileAgentic?.score ?? null, old: previous.agenticMobile ?? null },
        { label: `${t.agenticTitle} · ${t.desktop}`, current: desktopAgentic?.score ?? null, old: previous.agenticDesktop ?? null },
      ]
    : [];
  const redirectNote = technicalSnapshots.some((item) => !isSamePublicPage(item.requestedUrl, item.finalUrl))
    ? fill(t.redirectNote, { requested: technicalSnapshots.find((item) => !isSamePublicPage(item.requestedUrl, item.finalUrl))?.requestedUrl ?? "" })
    : "";
  const sharedLighthouse = technicalSnapshots[0]?.lighthouseVersion
    && technicalSnapshots.every((item) => item.lighthouseVersion === technicalSnapshots[0].lighthouseVersion)
    ? `${t.lighthouse} ${technicalSnapshots[0].lighthouseVersion}`
    : undefined;
  const printModel: PresencePrintModel = {
    website: resultUrl,
    lead,
    recommendationTitle: recommendation.title,
    recommendationBody: recommendation.body,
    errors: [technicalError, socialError, domainError].filter(Boolean),
    redirectNote,
    phoneGap: narrative.phoneGap
      ? fill(t.phoneGap, { mobile: String(narrative.phoneGap.mobile), desktop: String(narrative.phoneGap.desktop) })
      : "",
    agenticGap,
    findingTitle: t.findingTitle,
    findingText,
    lighthouse: sharedLighthouse,
    devices: technicalSnapshots.map((snapshot) => {
      const report = snapshot.strategy === "mobile" ? technical?.mobile : technical?.desktop;
      return {
        label: snapshot.strategy === "mobile" ? t.mobile : t.desktop,
        freshness: report?.cached ? t.cached : t.fresh,
        tested: dateFormatter.format(new Date(snapshot.analyzedAt)),
        finalUrl: snapshot.finalUrl,
        scores: snapshot.scores,
        fieldScope: snapshot.fieldMetrics.length
          ? snapshot.fieldScope === "page" ? t.fieldPageDetail : t.fieldOriginDetail
          : undefined,
        fieldMetrics: snapshot.fieldMetrics.map((metric) => ({
          label: `${metric.label} · ${snapshot.fieldScope === "page" ? t.fieldPage : t.fieldOrigin}`,
          value: metric.displayValue,
        })),
        labMetrics: snapshot.labMetrics.map((metric) => ({ label: metric.label, value: metric.displayValue })),
        opportunities: snapshot.opportunities.map((opportunity) => ({
          title: opportunity.title,
          detail: opportunity.displayValue,
        })),
      };
    }),
    socialScore: social?.score ?? null,
    socialChecks: social?.checks.map((check) => ({
      label: t.actionSocial[check.id],
      value: `${check.points}/${check.maxPoints}`,
    })) ?? [],
    contactUrl: social?.finalUrl ?? "",
    contactLines: contactLines(social?.contactExposure, t),
    agenticScore: agenticViews.length ? null : social?.agentic?.score ?? null,
    agenticDevices: agenticViews.map((view) => ({ label: view.label, score: view.agentic.score })),
    agenticSignals: (agenticViews.length ? agenticViews.reduce((weakest, view) => view.agentic.score < weakest.agentic.score ? view : weakest).agentic : social?.agentic)?.signals?.map((signal) => {
      const described = describeAgenticSignal(signal, t);
      return {
        label: described.label,
        value: `${signal.points}/${signal.maxPoints}`,
        note: described.note,
      };
    }) ?? [],
    domainChecks: domain?.checks.map((check) => {
      const item = t.domainCheck[check.id];
      return {
        label: item.title,
        short: item.short,
        value: check.evidence.join(" · "),
        status: t.domainStatus[check.status],
        tone: check.status,
        result: item[check.status],
        why: item.why,
      };
    }) ?? [],
    domainName: domain?.domain ?? "",
    actions: actions.map((action) => {
      const presented = presentAction(action, t, language);
      return {
        priority: action.priority === "fixNow" ? t.fixNow : t.planNext,
        tone: action.priority === "fixNow" ? "now" as const : "next" as const,
        title: presented.title,
        why: presented.why,
        meta: `${t.impact}: ${t[action.impact]} · ${t.effort}: ${t[action.effort]}`,
      };
    }),
    actionsEmpty: t.automatedStrong,
    humanItems: [...t.human],
    historyChecked: previous ? `${t.previousChecked}: ${dateFormatter.format(new Date(previous.checkedAt))}` : "",
    history: historyRows.flatMap((row) => {
      const delta = scoreDelta(row.current, row.old);
      if (delta == null) return [];
      const change = delta > 0 ? t.improved : delta < 0 ? t.declined : t.unchanged;
      return [{ label: row.label, value: `${delta > 0 ? "+" : ""}${delta} ${change}` }];
    }),
    comparison: competitor
      ? {
          url: competitor.url,
          rows: comparisonRows.map((row) => ({
            label: row.label,
            yours: row.primary == null ? t.notScored : String(row.primary),
            theirs: row.comparison == null ? t.notScored : String(row.comparison),
          })),
        }
      : null,
    labels: {
      executiveTitle: t.executiveTitle,
      recommendedTitle: t.recommendedTitle,
      technicalTitle: t.technicalTitle,
      technicalDescription: t.technicalDescription,
      fieldTitle: t.fieldTitle,
      fieldIntro: t.fieldIntro,
      labTitle: t.labTitle,
      opportunitiesTitle: t.opportunitiesTitle,
      tested: t.tested,
      finalUrl: t.finalUrl,
      socialTitle: t.socialTitle,
      socialDescription: t.socialDescription,
      socialScore: t.socialScore,
      contactTitle: t.contactTitle,
      contactDescription: t.contactDescription,
      agenticTitle: t.agenticTitle,
      agenticDescription: t.agenticDescription,
      domainTitle: t.domainTitle,
      domainWhy: t.domainWhy,
      domainChecked: t.domainChecked,
      actionsTitle: t.actionsTitle,
      actionsIntro: t.actionsIntro,
      humanTitle: t.humanTitle,
      previousTitle: t.previousTitle,
      previousIntro: t.previousIntro,
      competitorTitle: t.competitorTitle,
      yourWebsite: t.yourWebsite,
      comparisonWebsite: t.comparisonWebsite,
      methodology: t.methodology,
      methodologyBody: t.methodologyBody,
      notScored: t.notScored,
    },
  };
  const snapshotBusy = technicalLoading || socialLoading || domainLoading;
  const resultsReady = started && !snapshotBusy && Boolean(technical || social || domain || technicalError || socialError || domainError);
  const showPrintPlan = printMounted && resultsReady;
  const summaryItems: SummaryItem[] = [];
  if (resultsReady) {
    const weakest = weakestCategory(technicalSnapshots);
    summaryItems.push(weakest
      ? {
          id: "presence-technical",
          title: t.technicalTitle,
          detail: `${t.summaryStatus[toneFromScore(weakest.score)]} · ${t.summaryScores[weakest.key]} ${weakest.score}/100`,
          tone: toneFromScore(weakest.score),
        }
      : { id: "presence-technical", title: t.technicalTitle, detail: t.summaryMissing, tone: "attention" });
    summaryItems.push(social
      ? {
          id: "presence-social",
          title: t.socialTitle,
          detail: `${t.summaryStatus[toneFromScore(social.score)]} · ${social.score}/100`,
          tone: toneFromScore(social.score),
        }
      : { id: "presence-social", title: t.socialTitle, detail: t.summaryMissing, tone: "attention" });
    if (social?.contactExposure) {
      const exposure = social.contactExposure;
      const contactTone: SummaryTone = exposure.mailboxInSource ? "attention" : exposure.phoneInSource || exposure.cloudflareObfuscated ? "improve" : "strong";
      const contactDetail = exposure.mailboxInSource
        ? t.summaryContactMailbox
        : exposure.phoneInSource
          ? t.summaryContactPhone
          : exposure.cloudflareObfuscated
            ? t.summaryContactScrambled
            : t.summaryContactClear;
      summaryItems.push({
        id: "presence-contact",
        title: t.contactTitle,
        detail: `${t.summaryStatus[contactTone]} · ${contactDetail}`,
        tone: contactTone,
      });
    }
    if (agenticScore != null) {
      summaryItems.push({
        id: "presence-agentic",
        title: t.agenticTitle,
        detail: `${t.summaryStatus[toneFromScore(agenticScore)]} · ${agenticScore}/100`,
        tone: toneFromScore(agenticScore),
      });
    }
    if (domain) {
      const worst = domain.checks.find((check) => check.status === "gap")
        ?? domain.checks.find((check) => check.status === "review");
      const domainTone: SummaryTone = worst?.status === "gap" ? "attention" : worst ? "improve" : "strong";
      summaryItems.push({
        id: "presence-domain",
        title: t.domainTitle,
        detail: worst ? `${t.summaryStatus[domainTone]} · ${t.domainCheck[worst.id].title}` : t.summaryStatus.strong,
        tone: domainTone,
      });
    } else {
      summaryItems.push({ id: "presence-domain", title: t.domainTitle, detail: t.summaryMissing, tone: "attention" });
    }
  }

  useEffect(() => {
    if (!snapshotBusy) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    workingRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [snapshotBusy]);

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-7 print:hidden">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">{t.urlLabel}</span>
            <input type="text" inputMode="url" autoComplete="url" required maxLength={2048} value={url} onChange={(event) => setUrl(event.target.value)} placeholder={t.placeholder} className="mt-2 min-h-[48px] w-full rounded-lg border border-slate-300 px-4 text-slate-950 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>
          <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <button type="submit" disabled={snapshotBusy} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-wait disabled:opacity-70">
            {snapshotBusy ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <SearchCheck className="h-5 w-5" aria-hidden />}
            {snapshotBusy ? t.workingButton : t.submit}
          </button>
        </div>
      </form>

      {resultsReady ? (
        <section ref={resultsRef} tabIndex={-1} className="space-y-7 outline-none" aria-live="polite">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-950">{t.resultsTitle}</h2>
                <p className="mt-2 max-w-3xl text-slate-700">{t.resultsIntro}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 print:hidden">
                <button type="button" disabled={snapshotBusy} onClick={() => runSnapshot(true)} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-primary-dark hover:border-primary disabled:opacity-60">
                  <RefreshCw className={`h-4 w-4 ${snapshotBusy ? "animate-spin" : ""}`} aria-hidden />{t.freshTest}
                </button>
                <button type="button" disabled={snapshotBusy} onClick={() => window.print()} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary-dark disabled:opacity-60">
                  <Download className="h-4 w-4" aria-hidden />{t.print}
                </button>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500 print:hidden">{t.freshHelp}</p>
          </div>

          <nav aria-label={t.summaryTitle} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-serif font-bold text-slate-950">{t.summaryTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t.summaryIntro}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {summaryItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 hover:border-primary">
                    <CheckCircle2 className={`mt-0.5 h-6 w-6 shrink-0 ${summaryToneClass[item.tone]}`} aria-hidden />
                    <span>
                      <span className="block font-semibold text-slate-950">{item.title}</span>
                      <span className="mt-1 block text-sm leading-5 text-slate-600">{item.detail}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t.executiveTitle}</p>
            <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-950">{t.recommendedTitle}</h2>
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-950">{lead}</p>
                <h3 className="mt-3 text-lg font-bold text-primary-dark">{recommendation.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">{recommendation.body}</p>
              </div>
              <Link href={{ pathname: "/contact", query: { intent: recommendation.intent, website: resultUrl, from_page: "/tools/digital-presence-snapshot", goal: reviewGoal } }} className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark print:hidden">
                {t.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-primary/15 pt-5 text-sm font-semibold print:hidden">
              <a href={`/${locale}/tools/digital-value-blueprint`} className="text-primary-dark underline underline-offset-4">{t.blueprintLink}</a>
              <a href={`/${locale}/tools/business-value-calculators`} className="text-primary-dark underline underline-offset-4">{t.calculatorsLink}</a>
              <a href={`/${locale}/tools/digital-monitoring-dashboard`} className="text-primary-dark underline underline-offset-4">{t.monitoringLink}</a>
            </div>
          </article>

          {(technicalError || socialError) ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-semibold text-amber-900">{t.partialTitle}</h2>
              {technicalError ? <p className="mt-2 text-sm text-amber-800">{technicalError}</p> : null}
              {socialError ? <p className="mt-2 text-sm text-amber-800">{socialError}</p> : null}
            </div>
          ) : null}

          <div className="space-y-6">
            <article id="presence-technical" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-3">
                <Gauge className="mt-1 h-7 w-7 text-primary-dark" aria-hidden />
                <div><h2 className="text-2xl font-serif font-bold text-slate-950">{t.technicalTitle}</h2><p className="mt-1 text-sm text-slate-600">{t.technicalDescription}</p></div>
              </div>
              {technicalSnapshots.length ? (
                <div className="mt-6 space-y-5">
                  {technicalSnapshots.every((item) => item.finalUrl === technicalSnapshots[0].finalUrl) ? (
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{t.finalUrl}: </span>
                      <span className="mt-1 block overflow-x-auto whitespace-nowrap font-mono text-[13px] text-slate-800">{technicalSnapshots[0].finalUrl}</span>
                    </p>
                  ) : null}
                  <div className="space-y-1">
                  {technicalSnapshots.every((item) => item.analyzedAt === technicalSnapshots[0].analyzedAt) ? (
                    <p className="text-xs text-slate-600"><span className="font-semibold text-slate-700">{t.tested}: </span>{dateFormatter.format(new Date(technicalSnapshots[0].analyzedAt))}</p>
                  ) : null}
                  {technicalSnapshots[0].lighthouseVersion && technicalSnapshots.every((item) => item.lighthouseVersion === technicalSnapshots[0].lighthouseVersion) ? (
                    <p className="text-xs text-slate-600"><span className="font-semibold text-slate-700">{t.lighthouse}: </span>{technicalSnapshots[0].lighthouseVersion}</p>
                  ) : null}
                  </div>
                  {technicalSnapshots.some((item) => !isSamePublicPage(item.requestedUrl, item.finalUrl)) ? (
                    <p className="text-xs leading-5 text-slate-600">{fill(t.redirectNote, { requested: technicalSnapshots.find((item) => !isSamePublicPage(item.requestedUrl, item.finalUrl))?.requestedUrl ?? "" })}</p>
                  ) : null}
                  <div className="grid gap-4 lg:grid-cols-2">
                  {technicalSnapshots.map((snapshot) => {
                    const report = snapshot.strategy === "mobile" ? technical?.mobile : technical?.desktop;
                    const googleUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(snapshot.finalUrl)}&form_factor=${snapshot.strategy}`;
                    const urlShared = technicalSnapshots.every((item) => item.finalUrl === snapshot.finalUrl);
                    const testedShared = technicalSnapshots.every((item) => item.analyzedAt === snapshot.analyzedAt);
                    return (
                    <div key={snapshot.strategy} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-950">{snapshot.strategy === "mobile" ? t.mobile : t.desktop}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${report?.cached ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}>
                          {report?.cached ? t.cached : t.fresh}
                        </span>
                      </div>
                      <PresenceScoreTiles scores={snapshot.scores} language={language} />
                      {!urlShared || !testedShared ? (
                        <dl className="mt-4 grid gap-2 text-xs text-slate-600">
                          {!testedShared ? <div><dt className="inline font-semibold text-slate-700">{t.tested}: </dt><dd className="inline">{dateFormatter.format(new Date(snapshot.analyzedAt))}</dd></div> : null}
                          {!urlShared ? <div><dt className="inline font-semibold text-slate-700">{t.finalUrl}: </dt><dd className="mt-1 block overflow-x-auto whitespace-nowrap font-mono text-[13px] text-slate-800">{snapshot.finalUrl}</dd></div> : null}
                        </dl>
                      ) : null}
                      <div className="mt-4 rounded-lg bg-slate-50 p-3">
                        <h4 className="text-sm font-semibold text-slate-900">{t.fieldTitle}</h4>
                        <p className="mt-1 text-xs text-slate-500">{snapshot.fieldMetrics.length ? (snapshot.fieldScope === "page" ? t.fieldPageDetail : t.fieldOriginDetail) : t.fieldIntro}</p>
                        {snapshot.fieldMetrics.length ? (
                          <dl className="mt-3 grid gap-2 sm:grid-cols-3">
                            {snapshot.fieldMetrics.map((metric) => (
                              <div key={metric.key}>
                                <dt className="text-[11px] text-slate-500">{metric.label}</dt>
                                <dd className="font-semibold text-slate-900">
                                  {metric.displayValue}
                                  <span className="mt-0.5 block text-[11px] font-semibold text-slate-500">{snapshot.fieldScope === "page" ? t.fieldPage : t.fieldOrigin}</span>
                                </dd>
                              </div>
                            ))}
                          </dl>
                        ) : <p className="mt-3 text-xs text-slate-600">{t.noFieldData}</p>}
                      </div>
                      {snapshot.labMetrics.length ? (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-slate-900">{t.labTitle}</h4>
                          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                            {snapshot.labMetrics.map((metric) => (
                              <div key={metric.key} className="rounded-lg bg-slate-50 p-3">
                                <dt className="text-[11px] text-slate-500">{metric.label}</dt>
                                <dd className="font-semibold text-slate-900">{metric.displayValue}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ) : null}
                      {snapshot.opportunities.length ? (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-slate-900">{t.opportunitiesTitle}</h4>
                          <ol className="mt-2 space-y-2">
                            {snapshot.opportunities.map((opportunity, index) => (
                              <li key={opportunity.id} className="flex gap-3 text-sm text-slate-700">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary-dark">{index + 1}</span>
                                <span>
                                  <span className="block font-semibold text-slate-900">{opportunity.title}</span>
                                  {opportunity.displayValue ? <span className="mt-0.5 block text-slate-600">{opportunity.displayValue}</span> : null}
                                </span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      ) : null}
                      <a href={googleUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-primary-dark underline underline-offset-4 print:hidden">{t.compareGoogle}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></a>
                    </div>
                    );
                  })}
                  </div>
                  {narrative.phoneGap ? <p className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950">{fill(t.phoneGap, { mobile: String(narrative.phoneGap.mobile), desktop: String(narrative.phoneGap.desktop) })}</p> : null}
                </div>
              ) : technicalLoading ? <p className="mt-6 text-sm text-slate-600">{loadingMessage}</p> : <p className="mt-6 text-sm text-slate-600">{t.technicalError}</p>}
            </article>

            <article id="presence-social" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-3">
                <Share2 className="mt-1 h-7 w-7 text-primary-dark" aria-hidden />
                <div><h2 className="text-2xl font-serif font-bold text-slate-950">{t.socialTitle}</h2><p className="mt-1 text-sm text-slate-600">{t.socialDescription}</p></div>
              </div>
              {social ? (
                <div className="mt-6">
                  <div className="max-w-xs rounded-lg bg-slate-50 p-4">
                    <p className="text-[11px] font-semibold leading-4 text-slate-500">{t.socialScore}</p>
                    <p className={`mt-1 text-4xl font-bold ${scoreTone(social.score)}`}>{social.score}<span className="text-lg font-semibold text-slate-500">/100</span></p>
                  </div>
                  <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {social.checks.map((check) => (
                      <div key={check.id} className="rounded-lg bg-slate-50 p-3">
                        <dt className="text-[11px] font-semibold text-slate-500">{t.actionSocial[check.id]}</dt>
                        <dd className="mt-1 font-bold text-slate-900">{check.points}/{check.maxPoints}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link href={{ pathname: "/tools/social-presence-snapshot", query: detailQuery }} className="mt-5 inline-flex font-semibold text-primary-dark underline underline-offset-4 print:hidden">{t.detailedSocial}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
                </div>
              ) : socialLoading ? <p className="mt-6 text-sm text-slate-600">{loadingMessage}</p> : <p className="mt-6 text-sm text-slate-600">{t.socialError}</p>}
            </article>

            {social?.contactExposure || socialLoading ? (
              <article id="presence-contact" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-7 w-7 text-primary-dark" aria-hidden />
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-slate-950">{t.contactTitle}</h2>
                    <p className="mt-1 text-sm text-slate-600">{t.contactDescription}</p>
                  </div>
                </div>
                {social?.contactExposure ? (
                  <div className="mt-6">
                    {social.finalUrl ? (
                      <p className="mb-4 text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">{t.finalUrl}: </span>
                        <span className="mt-1 block overflow-x-auto whitespace-nowrap font-mono text-[13px] text-slate-800">{social.finalUrl}</span>
                      </p>
                    ) : null}
                    <ul className="space-y-3">
                      {contactLines(social.contactExposure, t).map((line) => (
                        <li key={line} className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-800">{line}</li>
                      ))}
                    </ul>
                    {social.contactExposure.signals.length ? (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {social.contactExposure.signals.map((signal) => (
                          <li key={signal} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{t.contactSignal[signal]}</li>
                        ))}
                      </ul>
                    ) : null}
                    <p className="mt-4 text-xs leading-5 text-slate-500">{t.contactLimit}</p>
                  </div>
                ) : <p className="mt-6 text-sm text-slate-600">{loadingMessage}</p>}
              </article>
            ) : null}

            {agenticViews.length || social?.agentic ? (
              <article id="presence-agentic" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-3">
                  <Bot className="mt-1 h-7 w-7 text-primary-dark" aria-hidden />
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-slate-950">{t.agenticTitle}</h2>
                    <p className="mt-1 text-sm text-slate-600">{t.agenticDescription}</p>
                  </div>
                </div>
                {agenticViews.length ? (
                  <div className={`mt-6 grid gap-6 ${agenticViews.length > 1 ? "lg:grid-cols-2" : "max-w-xl"}`}>
                    {agenticViews.map((view) => (
                      <div key={view.label}>
                        <h3 className="text-sm font-semibold text-slate-950">{view.label}</h3>
                        <div className="mt-3 max-w-xs">
                          <AgenticScoreTile score={view.agentic.score} language={language} />
                        </div>
                        {view.agentic.signals?.length ? (
                          <dl className="mt-4 grid gap-3">
                            {view.agentic.signals.map((signal) => {
                              const described = describeAgenticSignal(signal, t);
                              const complete = signal.points >= signal.maxPoints;
                              return (
                                <div key={signal.id} className="rounded-lg bg-slate-50 p-4">
                                  <dt className="text-[11px] font-semibold text-slate-500">{described.label}</dt>
                                  <dd className={`mt-1 text-lg font-bold ${complete ? "text-emerald-700" : signal.points > 0 ? "text-amber-700" : "text-rose-700"}`}>{signal.points}/{signal.maxPoints}</dd>
                                  {described.note ? <p className="mt-1 text-sm leading-6 text-slate-700">{described.note}</p> : null}
                                </div>
                              );
                            })}
                          </dl>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : social?.agentic ? (
                  <div className="mt-6 max-w-xs">
                    <AgenticScoreTile score={social.agentic.score} language={language} />
                  </div>
                ) : null}
                {agenticGap ? <p className="mt-4 max-w-3xl rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">{agenticGap}</p> : null}
                {!agenticViews.length && social?.agentic?.signals?.length ? (
                  <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                    {social.agentic.signals.map((signal) => {
                      const described = describeAgenticSignal(signal, t);
                      const complete = signal.points >= signal.maxPoints;
                      return (
                        <div key={signal.id} className="rounded-lg bg-slate-50 p-4">
                          <dt className="text-[11px] font-semibold text-slate-500">{described.label}</dt>
                          <dd className={`mt-1 text-lg font-bold ${complete ? "text-emerald-700" : signal.points > 0 ? "text-amber-700" : "text-rose-700"}`}>{signal.points}/{signal.maxPoints}</dd>
                          {described.note ? <p className="mt-1 text-sm leading-6 text-slate-700">{described.note}</p> : null}
                        </div>
                      );
                    })}
                  </dl>
                ) : null}
              </article>
            ) : null}
          </div>

          <article id="presence-domain" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-7 w-7 text-primary-dark" aria-hidden />
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-950">{t.domainTitle}</h2>
                <p className="mt-1 text-sm text-slate-600">{t.domainDescription}</p>
              </div>
            </div>
            {domain ? (
              <div className="mt-6">
                <p className="text-sm text-slate-500">{t.domainChecked} {domain.domain}</p>
                <div className="mt-4 rounded-lg bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">{t.domainWhyTitle}</p>
                  <p className="mt-1 text-sm leading-6 text-amber-950">{t.domainWhy}</p>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={t.domainTitle}>
                  {domain.checks.map((check) => {
                    const item = t.domainCheck[check.id];
                    const pill = check.status === "pass"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : check.status === "review"
                        ? "border-amber-200 bg-amber-50 text-amber-800"
                        : "border-rose-200 bg-rose-50 text-rose-800";
                    const dot = check.status === "pass" ? "bg-emerald-500" : check.status === "review" ? "bg-amber-500" : "bg-rose-500";
                    return (
                      <li key={check.id}>
                        <a href={`#domain-${check.id}`} className={`inline-flex min-h-[32px] items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${pill}`}>
                          <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden />
                          {item.short}
                          <span className="font-medium">{t.domainStatus[check.status]}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <dl className="mt-5 grid gap-3">
                  {domain.checks.map((check) => {
                    const item = t.domainCheck[check.id];
                    const tone = check.status === "pass" ? "text-emerald-700" : check.status === "review" ? "text-amber-700" : "text-rose-700";
                    return (
                      <div id={`domain-${check.id}`} key={check.id} className="scroll-mt-28 rounded-lg bg-slate-50 p-4">
                        <dt className="text-[11px] font-semibold text-slate-500">{item.title}</dt>
                        <dd className={`mt-1 text-lg font-bold ${tone}`}>{t.domainStatus[check.status]}</dd>
                        <p className="mt-1 text-sm leading-6 text-slate-800">{item[check.status]}</p>
                        {check.evidence.length ? <p className="mt-1 break-all text-xs leading-5 text-slate-500">{check.evidence.join(" · ")}</p> : null}
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.why}</p>
                      </div>
                    );
                  })}
                </dl>
              </div>
            ) : domainLoading ? <p className="mt-6 text-sm text-slate-600">{t.domainLoading}</p> : <p className="mt-6 text-sm text-slate-600">{domainError || t.domainError}</p>}
          </article>

          {historyRows.some((row) => row.current != null && row.old != null) ? (
            <article className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 sm:p-8">
              <h2 className="text-2xl font-serif font-bold text-slate-950">{t.previousTitle}</h2>
              <p className="mt-2 text-sm text-slate-600">{t.previousIntro}</p>
              <p className="mt-1 text-xs text-slate-500">{t.previousChecked}: {dateFormatter.format(new Date(previous!.checkedAt))}</p>
              <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                {historyRows.map((row) => {
                  const delta = scoreDelta(row.current, row.old);
                  if (delta == null) return null;
                  const label = delta > 0 ? t.improved : delta < 0 ? t.declined : t.unchanged;
                  return <div key={row.label} className="rounded-xl bg-white p-4"><dt className="text-xs font-semibold text-slate-600">{row.label}</dt><dd className={`mt-1 text-xl font-bold ${delta > 0 ? "text-emerald-700" : delta < 0 ? "text-rose-700" : "text-slate-700"}`}>{delta > 0 ? "+" : ""}{delta} <span className="text-xs font-semibold">{label}</span></dd></div>;
                })}
              </dl>
            </article>
          ) : null}

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 print:hidden">
            <h2 className="text-2xl font-serif font-bold text-slate-950">{t.competitorTitle}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t.competitorIntro}</p>
            <form onSubmit={compareWebsite} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="min-w-0 flex-1"><span className="text-sm font-semibold text-slate-900">{t.competitorLabel}</span><input type="text" inputMode="url" autoComplete="url" required maxLength={2048} value={competitorUrl} onChange={(event) => setCompetitorUrl(event.target.value)} placeholder={t.placeholder} className="mt-2 min-h-[48px] w-full rounded-lg border border-slate-300 px-4 text-slate-950 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
              <button type="submit" disabled={competitorLoading} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-60">{competitorLoading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> : null}{competitorLoading ? t.competitorLoading : t.competitorButton}</button>
            </form>
            {competitorError ? <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800" role="alert">{competitorError}</p> : null}
            {competitor ? (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                  <thead><tr className="border-b border-slate-200"><th className="px-3 py-3 text-slate-600"> </th><th className="px-3 py-3 text-slate-900">{t.yourWebsite}</th><th className="px-3 py-3 text-slate-900">{t.comparisonWebsite}</th></tr></thead>
                  <tbody>{comparisonRows.map((row) => <tr key={row.label} className="border-b border-slate-100"><th className="px-3 py-3 font-medium text-slate-700">{row.label}</th><td className="px-3 py-3 text-xl font-bold text-slate-950">{row.primary ?? t.notScored}</td><td className="px-3 py-3 text-xl font-bold text-slate-950">{row.comparison ?? t.notScored}</td></tr>)}</tbody>
                </table>
                <p className="mt-3 break-all text-xs text-slate-500">{competitor.url}</p>
              </div>
            ) : null}
          </article>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-serif font-bold text-slate-950">{t.actionsTitle}</h2>
              <p className="mt-2 text-sm text-slate-600">{t.actionsIntro}</p>
              {findingText ? <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700"><span className="font-semibold text-slate-950">{t.findingTitle}. </span>{findingText}</p> : null}
              {actions.length ? (
                <ol className="mt-5 space-y-3">
                  {actions.map((action, index) => {
                    const presented = presentAction(action, t, language);
                    const title = presented.title;
                    const why = presented.why;
                    return (
                      <li key={`${action.source}-${action.key}`} className="flex gap-4 rounded-xl border border-slate-200 p-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary-dark">{index + 1}</span>
                        <div><span className={`text-xs font-bold uppercase tracking-wide ${action.priority === "fixNow" ? "text-rose-700" : "text-amber-700"}`}>{action.priority === "fixNow" ? t.fixNow : t.planNext}</span><h3 className="mt-1 font-semibold text-slate-950">{title}</h3><p className="mt-1 text-sm text-slate-600">{why}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-primary/[0.08] px-2.5 py-1 text-[11px] font-semibold text-primary-dark">{t.impact}: {t[action.impact]}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{t.effort}: {t[action.effort]}</span></div></div>
                      </li>
                    );
                  })}
                </ol>
              ) : <p className="mt-5 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">{t.automatedStrong}</p>}
            </article>

            <article className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-6 sm:p-8">
              <h2 className="text-2xl font-serif font-bold text-slate-950">{t.humanTitle}</h2>
              <ul className="mt-5 space-y-3">
                {t.human.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}
              </ul>
            </article>
          </div>

          <details className="rounded-xl border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer font-semibold text-slate-950">{t.methodology}</summary>
            <p className="mt-3 text-sm leading-6 text-slate-700">{t.methodologyBody}</p>
          </details>

          <aside className="rounded-2xl border border-brand-gold/50 bg-brand-gold/10 p-7 sm:p-9 print:hidden">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-700">{t.sprintEyebrow}</p>
            <h2 className="mt-3 text-2xl font-serif font-bold text-slate-950">{t.sprintTitle}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-700">{t.sprintTimeline}</p>
            <p className="mt-3 max-w-3xl text-slate-700">{t.sprintBody}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">{t.sprintItems.map((item) => <li key={item} className="flex gap-2 rounded-lg bg-white/70 p-3 text-sm text-slate-800"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}</ul>
            <p className="mt-4 text-sm text-slate-600">{t.sprintPrice}</p>
            <Link href={{ pathname: "/contact", query: { intent: "visibility", review: "results", website: resultUrl, from_page: "/tools/digital-presence-snapshot", goal: `${note} ${t.sprintTitle}` } }} className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">{t.sprintCta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
          </aside>

          <aside className="rounded-2xl bg-slate-950 p-7 text-white sm:p-9 print:hidden">
            <SearchCheck className="h-8 w-8 text-primary-light" aria-hidden />
            <h2 className="mt-4 text-2xl font-serif font-bold text-white">{t.ctaTitle}</h2>
            <p className="mt-3 max-w-3xl text-slate-300">{t.ctaBody}</p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-3">
              {t.ctaSteps.map((step, index) => <li key={step} className="rounded-lg border border-white/15 bg-white/[0.04] p-3 text-sm text-slate-200"><span className="mr-2 font-bold text-brand-gold">{index + 1}.</span>{step}</li>)}
            </ol>
            <p className="mt-5 text-sm font-semibold text-white">{t.ctaProof}</p>
            <Link href={{ pathname: "/contact", query: { intent: "visibility", review: "results", website: resultUrl, from_page: "/tools/digital-presence-snapshot", goal: reviewGoal } }} onClick={() => trackAnalyticsEvent("digital_snapshot_cta")} className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-semibold text-slate-950 hover:bg-brand-gold-light">{t.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
            <p className="mt-3 text-xs text-slate-400">{t.ctaReassurance}</p>
          </aside>
        </section>
      ) : null}
      {printMounted && snapshotBusy ? createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4 print:hidden">
          <div
            ref={workingRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="snapshot-working-title"
            aria-describedby="snapshot-working-status"
            tabIndex={-1}
            className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl outline-none"
          >
            <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-primary" aria-hidden />
            <h2 id="snapshot-working-title" className="mt-5 font-serif text-2xl font-bold text-slate-950">{t.workingTitle}</h2>
            <p id="snapshot-working-status" className="mt-3 text-sm leading-6 text-slate-700" role="status">{loadingMessage}</p>
            <p className="mt-4 text-xs leading-5 text-slate-500">{t.workingNote}</p>
          </div>
        </div>,
        document.body,
      ) : null}
      {showPrintPlan ? createPortal(
        <DigitalPresenceActionPlanPrintSheet locale={language} model={printModel} />,
        document.body,
      ) : null}
    </div>
  );
}
