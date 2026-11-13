import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const out = new URL("../dist/", import.meta.url);
const sourceAssets = new URL("../src/assets/", import.meta.url);
const configuredUrl = process.env.SITE_URL || "https://www.roallainsights.com";
const siteUrl = configuredUrl.replace(/\/$/, "");
const updated = "2026-11-12";
const assetVersion = "20261112m";
const campaignImages = {
  visibility: `/assets/campaigns/visibility-hero.webp?v=${assetVersion}`,
  aiEmployee: `/assets/campaigns/ai-employee-hero.webp?v=${assetVersion}`
};

const shell = {
  en: {
    alternate: "FR",
    skip: "Skip to main content",
    operated: "Operated by ROALLA Business Enablement Group",
    navCampaigns: "Campaigns",
    navAllCampaigns: "All campaigns",
    navReview: "What we examine",
    navProcess: "How it works",
    navCompany: "Visit ROALLA.com",
    talkSecondary: "Talk with Steven",
    scenariosHeading: "Sounds familiar?",
    scenariosLead: "These are the pressures this campaign is built to address.",
    pressureHint: "Free check on ROALLA.com",
    estimateToolsHeading: "Plan the investment",
    estimateToolsLead: "When you are ready to scope work, build a first-year CAD estimate—free checks stay available above.",
    estimateToolsHint: "Estimate on ROALLA.com",
    privacy: "Privacy",
    preferences: "Communication preferences",
    unsubscribe: "Unsubscribe",
    rights: "ROALLA Business Enablement Group. All rights reserved.",
    contactTitle: "Talk with Steven Robin",
    contactRole: "Founder & Principal Consultant",
    contactPlace: "Burlington, Ontario, Canada",
    contactEmail: "Email sales@roalla.com",
    contactPhone: "Call +1 289 838 5868",
    footerAbout: "ROALLA Insights is operated by ROALLA Business Enablement Group, a Canadian business enablement and digital advisory firm.",
    footerExplore: "Explore",
    footerContact: "Contact",
    reassurance: "You don’t need to be technical—we translate the findings into decisions.",
    examplesEyebrow: "Sounds familiar?",
    examplesTitle: "Here’s what this looks like in a real business.",
    trendsEyebrow: "Looking to 2027",
    trendsTitle: "What to prepare for next",
    trendsCopy: "Short signals for business decisions—not a technology lecture.",
    ladderEyebrow: "Evidence first",
    ladderTitle: "See. Improve. Interpret.",
    ladderLead: "Prove the pressure, scope the investment, then talk with ROALLA.",
    ladderPrev: "Back",
    ladderNext: "Next",
    closingEyebrow: "Start with ROALLA"
  },
  fr: {
    alternate: "EN",
    skip: "Passer au contenu principal",
    operated: "Exploité par ROALLA Business Enablement Group",
    navCampaigns: "Campagnes",
    navAllCampaigns: "Toutes les campagnes",
    navReview: "Ce que nous examinons",
    navProcess: "La démarche",
    navCompany: "Visiter ROALLA.com",
    talkSecondary: "Parler avec Steven",
    scenariosHeading: "Ça vous dit quelque chose?",
    scenariosLead: "Voici les pressions que cette campagne est conçue pour traiter.",
    pressureHint: "Vérification gratuite sur ROALLA.com",
    estimateToolsHeading: "Planifier l’investissement",
    estimateToolsLead: "Quand vous êtes prêt à cadrer le travail, construisez une estimation de première année en $ CA—les vérifications gratuites restent disponibles plus haut.",
    estimateToolsHint: "Estimation sur ROALLA.com",
    privacy: "Confidentialité",
    preferences: "Préférences de communication",
    unsubscribe: "Se désabonner",
    rights: "ROALLA Business Enablement Group. Tous droits réservés.",
    contactTitle: "Parler avec Steven Robin",
    contactRole: "Fondateur et conseiller principal",
    contactPlace: "Burlington (Ontario), Canada",
    contactEmail: "Écrire à sales@roalla.com",
    contactPhone: "Appeler le +1 289 838 5868",
    footerAbout: "ROALLA Insights est exploité par ROALLA Business Enablement Group, une firme canadienne de conseil en accompagnement d’entreprise et en numérique.",
    footerExplore: "Explorer",
    footerContact: "Contact",
    reassurance: "Vous n’avez pas besoin d’être technique—nous traduisons les constats en décisions.",
    examplesEyebrow: "Ça vous dit quelque chose?",
    examplesTitle: "Voici à quoi ça ressemble dans une vraie entreprise.",
    trendsEyebrow: "Vers 2027",
    trendsTitle: "Ce qu’il faut préparer ensuite",
    trendsCopy: "Des signaux courts pour décider—pas un cours de technologie.",
    ladderEyebrow: "La preuve d’abord",
    ladderTitle: "Voir. Améliorer. Interpréter.",
    ladderLead: "Prouvez la pression, cadrez l’investissement, puis parlez avec ROALLA.",
    ladderPrev: "Précédent",
    ladderNext: "Suivant",
    closingEyebrow: "Commencer avec ROALLA"
  }
};

const hub = {
  en: {
    title: "ROALLA Insights | Outcome-focused sales campaigns",
    description: "Choose a focused ROALLA campaign—improve how customers find you online and in AI chats, or use AI Employees to cut missed calls and lost opportunities.",
    eyebrow: "ROALLA Insights",
    heroTitle: "Clear outcomes. Fast decisions.",
    heroCopy: "Choose the result you want. Each campaign helps you decide quickly.",
    tiles: [
      {
        slug: "visibility-review",
        title: "Improve how customers find you online or from AI chats",
        blurb: "A plain-language path to clearer search, maps, and AI recommendations.",
        cta: "Open visibility campaign",
        servicePill: "Website & AI Visibility",
        image: campaignImages.visibility,
        imageAlt: "Customer finding a business through search, maps, and AI chat",
        scenarios: [
          { label: "Customers can’t find us in search or on maps", cta: "Free website check", pathKey: "snapshot", extra: { offer: "free-automated-visibility-snapshot", selected_problem: "website-and-ai-visibility" } },
          { label: "ChatGPT and AI tools don’t recommend our business", cta: "Free website check", pathKey: "snapshot", extra: { offer: "free-automated-visibility-snapshot", selected_problem: "website-and-ai-visibility" } },
          { label: "Our website doesn’t make it clear what we do—or how to contact us", cta: "Free website check", pathKey: "snapshot", extra: { offer: "free-automated-visibility-snapshot", selected_problem: "website-and-ai-visibility" } },
          { label: "Important emails land in junk or get flagged as phishing", cta: "Check email reach", pathKey: "emailBrief", extra: { selected_problem: "email-deliverability" } }
        ]
      },
      {
        slug: "ai-employee-readiness",
        title: "Improve customer experience with AI employees",
        blurb: "Cut missed calls and lost opportunities—with people still in control.",
        cta: "Open AI employees campaign",
        servicePill: "AI Employees",
        image: campaignImages.aiEmployee,
        imageAlt: "Business team supervising an automated workflow with a human approval step",
        scenarios: [
          { label: "Calls go unanswered after hours and at peak times", cta: "Check AI Employee fit", pathKey: "contact", extra: { selected_problem: "after-hours-calls" } },
          { label: "The same questions keep tying up the team every day", cta: "Check AI Employee fit", pathKey: "contact", extra: { selected_problem: "repetitive-questions" } },
          { label: "Callers hang up before anyone can help—lost opportunities", cta: "Check AI Employee fit", pathKey: "contact", extra: { selected_problem: "abandoned-calls" } },
          { label: "New hires take too long to ramp up, and good people leave", cta: "Check AI Employee fit", pathKey: "contact", extra: { selected_problem: "ramp-and-churn" } }
        ]
      }
    ]
  },
  fr: {
    title: "ROALLA Insights | Campagnes axées sur les résultats",
    description: "Choisissez une campagne ROALLA ciblée—être plus facile à trouver en ligne, ou automatiser le travail répétitif avec un contrôle humain clair.",
    eyebrow: "ROALLA Insights",
    heroTitle: "Des résultats clairs. Des décisions rapides.",
    heroCopy: "Choisissez le résultat voulu. Chaque campagne vous aide à décider vite.",
    tiles: [
      {
        slug: "visibility-review",
        title: "Améliorez la façon dont les clients vous trouvent en ligne ou via les clavardages IA",
        blurb: "Une voie claire pour la recherche, les cartes et les recommandations IA.",
        cta: "Ouvrir la campagne visibilité",
        servicePill: "Visibilité Web et IA",
        image: campaignImages.visibility,
        imageAlt: "Client qui trouve une entreprise via la recherche, les cartes et un clavardage IA",
        scenarios: [
          { label: "Les clients ne nous trouvent pas dans la recherche ou sur les cartes", cta: "Vérification gratuite du site", pathKey: "snapshot", extra: { offer: "free-automated-visibility-snapshot", selected_problem: "website-and-ai-visibility" } },
          { label: "ChatGPT et les outils d’IA ne recommandent pas notre entreprise", cta: "Vérification gratuite du site", pathKey: "snapshot", extra: { offer: "free-automated-visibility-snapshot", selected_problem: "website-and-ai-visibility" } },
          { label: "Notre site n’explique pas clairement ce que nous faisons—ni comment nous joindre", cta: "Vérification gratuite du site", pathKey: "snapshot", extra: { offer: "free-automated-visibility-snapshot", selected_problem: "website-and-ai-visibility" } },
          { label: "Des courriels importants vont aux indésirables ou sont signalés comme hameçonnage", cta: "Vérifier la portée du courriel", pathKey: "emailBrief", extra: { selected_problem: "email-deliverability" } }
        ]
      },
      {
        slug: "ai-employee-readiness",
        title: "Améliorez l’expérience client avec des employés IA",
        blurb: "Réduisez les appels manqués et les occasions perdues—avec des personnes aux commandes.",
        cta: "Ouvrir la campagne employés IA",
        servicePill: "Employés IA",
        image: campaignImages.aiEmployee,
        imageAlt: "Équipe d’affaires qui supervise un flux automatisé avec une étape d’approbation humaine",
        scenarios: [
          { label: "Des appels restent sans réponse après les heures et en période de pointe", cta: "Vérifier l’adéquation Employé IA", pathKey: "contact", extra: { selected_problem: "after-hours-calls" } },
          { label: "Les mêmes questions monopolisent l’équipe chaque jour", cta: "Vérifier l’adéquation Employé IA", pathKey: "contact", extra: { selected_problem: "repetitive-questions" } },
          { label: "Les appelants raccrochent avant d’obtenir de l’aide—occasions perdues", cta: "Vérifier l’adéquation Employé IA", pathKey: "contact", extra: { selected_problem: "abandoned-calls" } },
          { label: "Les nouvelles recrues mettent trop longtemps à se former, et les bons partent", cta: "Vérifier l’adéquation Employé IA", pathKey: "contact", extra: { selected_problem: "ramp-and-churn" } }
        ]
      }
    ]
  }
};

const campaigns = {
  "visibility-review": {
    intent: "visibility",
    proofPathKey: "snapshot",
    proofExtra: { offer: "free-automated-visibility-snapshot", selected_problem: "website-and-ai-visibility" },
    pathwayPathKey: "needGrowth",
    image: campaignImages.visibility,
    en: {
      offerName: "Website & AI Visibility Review",
      title: "Website & AI Visibility Review | ROALLA Insights",
      description: "A practical review of how clearly your website presents your business to customers, search, and AI tools—plus a prioritized path to improve what matters.",
      heroEyebrow: "Website & AI Visibility Review",
      heroTitle: "Be easier to find. Easier to trust. Easier to choose.",
      heroCopy: "A plain-language review of how customers, search, and AI tools see your business—and what to fix first.",
      primaryCta: "Check my website",
      secondaryCta: "Request your review",
      primaryPathKey: "snapshot",
      secondaryPathKey: "contact",
      primaryExtra: { offer: "free-automated-visibility-snapshot", selected_problem: "website-and-ai-visibility" },
      homework: "To start, send your website address and the result you want the site to support.",
      pathwayLink: "Explore the growth and visibility pathway on ROALLA.com",
      ladder: [
        {
          title: "See",
          body: "Free website check or email reach check—no sales pitch required.",
          ctas: [
            { cta: "Free website check", pathKey: "snapshot", extra: { offer: "free-automated-visibility-snapshot", selected_problem: "website-and-ai-visibility" }, primary: true },
            { cta: "Check email reach", pathKey: "emailBrief", extra: { selected_problem: "email-deliverability" } }
          ]
        },
        {
          title: "Improve",
          body: "Scope first-year CAD for site, maps, and AI visibility—or inbox reach.",
          ctas: [
            { cta: "Estimate visibility work", pathKey: "visibilityEstimate", extra: { selected_problem: "website-and-ai-visibility" }, primary: true },
            { cta: "Estimate email reach work", pathKey: "emailEstimate", extra: { selected_problem: "email-deliverability" } }
          ],
          softLink: { label: "Or build a website estimate", pathKey: "websiteEstimate", extra: { selected_problem: "website-and-ai-visibility" } }
        },
        {
          title: "Interpret",
          body: "Request a ROALLA working review after you have evidence and a rough quote.",
          ctas: [{ cta: "Request your review", pathKey: "contact", primary: true }]
        }
      ],
      estimateTools: [],
      introEyebrow: "Clarity before complexity",
      introTitle: "Customers judge you in more places than one.",
      introCopy: "This review checks search and maps, AI answers, whether your site makes the offer and contact path clear, and whether important email reaches the inbox. Start with a free website check—then plan the investment and talk with ROALLA.",
      pillars: [
        ["Findable in search & maps", "Whether customers can discover you where they look first."],
        ["Named by AI tools", "Whether assistants can recommend your business with clear facts."],
        ["Clear site & contact path", "Whether visitors know what you do and how to start a conversation."],
        ["Email that arrives", "Whether important messages reach inboxes instead of junk or phishing flags."]
      ],
      trends: [],
      outputEyebrow: "What you receive",
      outputTitle: "A short written view you can act on.",
      outputCopy: "You get a concise, plain-language review made for business decisions.",
      deliverables: [
        ["Short snapshot", "The strongest signals, the real gaps, and what that likely means for the business."],
        ["Prioritized next steps", "What to do first, sequenced by value and effort."],
        ["Working call with ROALLA", "A practical conversation to interpret the findings and decide what comes next."]
      ],
      processEyebrow: "A focused engagement",
      processTitle: "From your public site to a practical decision.",
      process: [],
      ctaTitle: "Ready to see what your website is really communicating?"
    },
    fr: {
      offerName: "Évaluation de la visibilité Web et IA",
      title: "Évaluation de la visibilité Web et IA | ROALLA Insights",
      description: "Une évaluation pratique de la façon dont votre site présente clairement votre entreprise aux clients, à la recherche et aux outils d’IA—avec une voie d’amélioration priorisée.",
      heroEyebrow: "Évaluation de la visibilité Web et IA",
      heroTitle: "Plus facile à trouver. À croire. À choisir.",
      heroCopy: "Une évaluation en langage simple de la façon dont clients, recherche et outils d’IA voient votre entreprise—et quoi corriger en premier.",
      primaryCta: "Vérifier mon site",
      secondaryCta: "Demander votre évaluation",
      primaryPathKey: "snapshot",
      secondaryPathKey: "contact",
      primaryExtra: { offer: "free-automated-visibility-snapshot", selected_problem: "website-and-ai-visibility" },
      homework: "Pour commencer, envoyez l’adresse du site et le résultat que celui-ci doit soutenir.",
      pathwayLink: "Explorer le parcours croissance et visibilité sur ROALLA.com",
      ladder: [
        {
          title: "Voir",
          body: "Vérification gratuite du site ou de la portée courriel—sans discours de vente.",
          ctas: [
            { cta: "Vérification gratuite du site", pathKey: "snapshot", extra: { offer: "free-automated-visibility-snapshot", selected_problem: "website-and-ai-visibility" }, primary: true },
            { cta: "Vérifier la portée du courriel", pathKey: "emailBrief", extra: { selected_problem: "email-deliverability" } }
          ]
        },
        {
          title: "Améliorer",
          body: "Cadrez une estimation de première année en $ CA pour la visibilité—ou la boîte de réception.",
          ctas: [
            { cta: "Estimer le travail de visibilité", pathKey: "visibilityEstimate", extra: { selected_problem: "website-and-ai-visibility" }, primary: true },
            { cta: "Estimer le travail de portée courriel", pathKey: "emailEstimate", extra: { selected_problem: "email-deliverability" } }
          ],
          softLink: { label: "Ou construire une estimation Web", pathKey: "websiteEstimate", extra: { selected_problem: "website-and-ai-visibility" } }
        },
        {
          title: "Interpréter",
          body: "Demandez une revue ROALLA après avoir des preuves et une estimation approximative.",
          ctas: [{ cta: "Demander votre évaluation", pathKey: "contact", primary: true }]
        }
      ],
      estimateTools: [],
      introEyebrow: "La clarté avant la complexité",
      introTitle: "Les clients vous jugent à plus d’un endroit.",
      introCopy: "Cette évaluation vérifie la recherche et les cartes, les réponses IA, si votre site clarifie l’offre et le chemin de contact, et si les courriels importants atteignent la boîte de réception. Commencez par une vérification gratuite—puis planifiez l’investissement et parlez avec ROALLA.",
      pillars: [
        ["Trouvable dans la recherche et les cartes", "Les clients peuvent-ils vous découvrir là où ils cherchent d’abord."],
        ["Nommé par les outils d’IA", "Les assistants peuvent-ils recommander votre entreprise avec des faits clairs."],
        ["Site clair et chemin de contact", "Les visiteurs savent-ils ce que vous faites et comment démarrer une conversation."],
        ["Courriel qui arrive", "Les messages importants atteignent-ils la boîte de réception plutôt que les indésirables ou les alertes d’hameçonnage."]
      ],
      trends: [],
      outputEyebrow: "Ce que vous recevez",
      outputTitle: "Une vue écrite courte et actionnable.",
      outputCopy: "Vous obtenez une évaluation concise, en langage simple, conçue pour les décisions d’affaires.",
      deliverables: [
        ["Court portrait", "Les meilleurs signaux, les vrais écarts et ce que cela signifie probablement pour l’entreprise."],
        ["Prochaines étapes priorisées", "Quoi faire d’abord, selon la valeur et l’effort."],
        ["Appel de travail avec ROALLA", "Une conversation pratique pour interpréter les constats et choisir la suite."]
      ],
      processEyebrow: "Un mandat ciblé",
      processTitle: "De votre site public à une décision pratique.",
      process: [],
      ctaTitle: "Prêt à voir ce que votre site communique vraiment?"
    }
  },
  "ai-employee-readiness": {
    intent: "ai-support",
    proofPathKey: "aiEmployeePage",
    proofExtra: {},
    pathwayPathKey: "needAutomation",
    image: campaignImages.aiEmployee,
    en: {
      offerName: "AI Employees",
      title: "Improve customer experience with AI employees | ROALLA Insights",
      description: "See whether an AI Employee fits a busy process—with clear approvals, human handoffs, and costs planned before you build.",
      heroEyebrow: "AI Employees",
      heroTitle: "Improve customer experience with AI employees.",
      heroCopy: "Cut missed calls and lost opportunities—with clear approvals and a person for exceptions.",
      primaryCta: "Check AI Employee fit",
      secondaryCta: "See AI Employee",
      primaryPathKey: "contact",
      secondaryPathKey: "aiEmployeePage",
      homework: "To start, describe the busy work and who handles exceptions today.",
      pathwayLink: "Explore the automation and AI pathway on ROALLA.com",
      ladder: [
        {
          title: "See",
          body: "Review how an AI Employee covers frontline requests with people still in control.",
          ctas: [{ cta: "See AI Employee", pathKey: "aiEmployeePage", primary: true }]
        },
        {
          title: "Improve",
          body: "Scope the first workload with ROALLA—approvals, handoffs, and a practical pilot size.",
          ctas: [{ cta: "Check AI Employee fit", pathKey: "contact", primary: true }]
        },
        {
          title: "Interpret",
          body: "Decide go, pause, or reshape after a short fit conversation.",
          ctas: [{ cta: "Check AI Employee fit", pathKey: "contact", primary: true }]
        }
      ],
      introEyebrow: "Control before complexity",
      introTitle: "AI helps when the work is clear—and people stay accountable.",
      introCopy: "Unanswered peak and after-hours calls, the same questions every day, callers who hang up, and long ramp with churn. Start with one process, clear approvals, and a person for exceptions—then decide fit with ROALLA.",
      pillars: [
        ["Cover the unanswered calls", "After hours and peaks without leaving customers hanging—with rules for when a person must take over."],
        ["Offload the repetitive questions", "One busy, measurable workload—not a vague “do everything” bot—with costs you can plan before a pilot."],
        ["Catch callers before they hang up", "Fast, reliable first response and trusted handoffs when something is sensitive or stuck."],
        ["Reduce ramp and churn pressure", "Clear playbooks so new people succeed faster and good people stay."]
      ],
      trends: [],
      outputEyebrow: "What you receive",
      outputTitle: "A clear fit view—not a science project.",
      outputCopy: "You get a plain-language view: where AI can help, where people must stay in control, and what to decide before any build.",
      deliverables: [
        ["Fit snapshot", "Whether an AI Employee makes sense for the workload you named—and what would block success."],
        ["Control checklist", "Approvals, handoffs, and exception owners stated in everyday language."],
        ["Working call with ROALLA", "A conversation to interpret fit and choose go, pause, or reshape."]
      ],
      processEyebrow: "A focused engagement",
      processTitle: "From busy work to a go / no-go decision.",
      process: [],
      ctaTitle: "Ready to improve customer experience with an AI Employee?"
    },
    fr: {
      offerName: "Employés IA",
      title: "Améliorez l’expérience client avec des employés IA | ROALLA Insights",
      description: "Vérifiez si un employé IA convient à un processus chargé—avec des approbations claires, des transferts humains et des coûts prévus avant de construire.",
      heroEyebrow: "Employés IA",
      heroTitle: "Améliorez l’expérience client avec des employés IA.",
      heroCopy: "Réduisez les appels manqués et les occasions perdues—avec des approbations claires et une personne pour les exceptions.",
      primaryCta: "Vérifier l’adéquation Employé IA",
      secondaryCta: "Voir l’employé IA",
      primaryPathKey: "contact",
      secondaryPathKey: "aiEmployeePage",
      homework: "Pour commencer, décrivez le travail répétitif et qui gère les exceptions aujourd’hui.",
      pathwayLink: "Explorer le parcours automation et IA sur ROALLA.com",
      ladder: [
        {
          title: "Voir",
          body: "Voyez comment un employé IA couvre les demandes en première ligne avec des personnes aux commandes.",
          ctas: [{ cta: "Voir l’employé IA", pathKey: "aiEmployeePage", primary: true }]
        },
        {
          title: "Améliorer",
          body: "Cadrez la première charge avec ROALLA—approbations, transferts et taille de pilote.",
          ctas: [{ cta: "Vérifier l’adéquation Employé IA", pathKey: "contact", primary: true }]
        },
        {
          title: "Interpréter",
          body: "Décidez d’avancer, de pauser ou de recentrer après une courte conversation d’adéquation.",
          ctas: [{ cta: "Vérifier l’adéquation Employé IA", pathKey: "contact", primary: true }]
        }
      ],
      introEyebrow: "Le contrôle avant la complexité",
      introTitle: "L’IA aide quand le travail est clair—et que les gens restent responsables.",
      introCopy: "Appels sans réponse en pointe et après les heures, les mêmes questions chaque jour, des appelants qui raccrochent, et une longue montée en compétence. Commencez par un processus, des approbations claires et une personne pour les exceptions—puis décidez avec ROALLA.",
      pillars: [
        ["Couvrir les appels sans réponse", "Après les heures et en pointe sans laisser les clients en attente—avec des règles pour quand une personne doit prendre le relais."],
        ["Délester les questions répétitives", "Une charge mesurable et ciblée—pas un robot vague « qui fait tout »—avec des coûts prévus avant un pilote."],
        ["Rattraper les appelants avant qu’ils raccrochent", "Une première réponse rapide et fiable, et des transferts sûrs quand c’est sensible ou bloqué."],
        ["Réduire la pression de formation et de roulement", "Des guides clairs pour que les nouvelles recrues réussissent plus vite et que les bons restent."]
      ],
      trends: [],
      outputEyebrow: "Ce que vous recevez",
      outputTitle: "Une vue d’adéquation claire—pas un projet scientifique.",
      outputCopy: "Vous obtenez une vue en langage simple : où l’IA peut aider, où les gens doivent rester aux commandes, et quoi décider avant toute construction.",
      deliverables: [
        ["Portrait d’adéquation", "Si un employé IA a du sens pour la charge nommée—et ce qui bloquerait le succès."],
        ["Liste de contrôle", "Approbations, transferts et responsables d’exceptions en langage courant."],
        ["Appel de travail avec ROALLA", "Une conversation pour interpréter l’adéquation et choisir d’avancer, de recentrer ou d’attendre."]
      ],
      processEyebrow: "Un mandat ciblé",
      processTitle: "Du travail répétitif à une décision d’aller / pas aller.",
      process: [],
      ctaTitle: "Prêt à améliorer l’expérience client avec un employé IA?"
    }
  }
};

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function paths(lang) {
  const locale = lang === "fr" ? "fr" : "en";
  const corporate = `https://www.roalla.com/${locale}`;
  const base = lang === "fr"
    ? { home: "/fr/", privacy: "/fr/confidentialite/", preferences: "/fr/preferences/", unsubscribe: "/fr/desabonnement/", corporate, contact: `${corporate}/contact` }
    : { home: "/en/", privacy: "/en/privacy/", preferences: "/en/preferences/", unsubscribe: "/en/unsubscribe/", corporate, contact: `${corporate}/contact` };
  return {
    ...base,
    visibility: `${base.home}campaigns/visibility-review/`,
    aiEmployee: `${base.home}campaigns/ai-employee-readiness/`,
    snapshot: `${corporate}/tools/digital-presence-snapshot`,
    visibilityReview: `${corporate}/website-ai-visibility-review`,
    emailBrief: `${corporate}/tools/email-reach-brief`,
    visibilityEstimate: `${corporate}/visibility-improvement-estimate`,
    websiteEstimate: `${corporate}/website-estimate`,
    emailEstimate: `${corporate}/email-reach-estimate`,
    needGrowth: `${corporate}/solutions/need/growth-visibility`,
    visibilityService: `${corporate}/services/search-ai-visibility`,
    aiEmployeePage: `${corporate}/ai-employee`,
    aiReadiness: `${corporate}/ai-agent-readiness-review`,
    automationReview: `${corporate}/automation-opportunity-review`,
    needAutomation: `${corporate}/solutions/need/automation-ai`,
    campaign(slug) {
      return `${base.home}campaigns/${slug}/`;
    }
  };
}

function attributedUrl(baseUrl, { lang, slug, intent, extra = {} }) {
  const target = new URL(baseUrl);
  const entry = paths(lang).campaign(slug);
  target.searchParams.set("campaign", `insights-${slug}`);
  target.searchParams.set("entry_page", entry);
  target.searchParams.set("conversion_source", "insights_campaign");
  target.searchParams.set("ref", "roalla-insights");
  target.searchParams.set("signal", slug);
  if (intent) target.searchParams.set("intent", intent);
  for (const [key, value] of Object.entries(extra)) {
    if (value != null && value !== "") target.searchParams.set(key, String(value));
  }
  return target.toString();
}

function resolveProofHref(lang, slug, pathKey, intent, extra = {}) {
  const p = paths(lang);
  if (pathKey === "contact") {
    return attributedUrl(p.contact, { lang, slug, intent, extra });
  }
  const base = p[pathKey];
  if (!base) return attributedUrl(p.contact, { lang, slug, intent, extra });
  return attributedUrl(base, { lang, slug, extra });
}

function header(lang, { mode = "hub", campaignHref = "", alternateHref = "" } = {}) {
  const t = shell[lang];
  const p = paths(lang);
  const other = lang === "fr" ? "en" : "fr";
  const languageHref = alternateHref || paths(other).home;
  const reviewHref = mode === "campaign" ? `${campaignHref}#review` : `${p.visibility}#review`;
  const processHref = mode === "campaign" ? `${campaignHref}#process` : `${p.visibility}#process`;
  return `<a class="skip" href="#main">${t.skip}</a>
  <header class="site-header">
    <nav class="nav wrap" aria-label="${lang === "fr" ? "Navigation principale" : "Main navigation"}">
      <a class="brand" href="${p.home}" aria-label="ROALLA Insights — ${lang === "fr" ? "Accueil" : "Home"}"><img class="brand-logo" src="/assets/roalla-logo.svg" alt="" width="40" height="40"><span>ROALLA <small>INSIGHTS</small></span></a>
      <div class="nav-links">
        <a href="${p.home}">${t.navCampaigns}</a>
        ${mode === "campaign" ? `<a href="${reviewHref}">${t.navReview}</a><a href="${processHref}">${t.navProcess}</a>` : ""}
        <a href="${p.corporate}" data-attribution>${t.navCompany}</a>
        <a class="language" href="${languageHref}" lang="${other}">${t.alternate}</a>
      </div>
    </nav>
  </header>`;
}

function footer(lang) {
  const t = shell[lang];
  const p = paths(lang);
  return `<footer class="site-footer"><div class="wrap">
    <div class="footer-grid">
      <div><a class="brand" href="${p.home}" aria-label="ROALLA Insights"><img class="brand-logo" src="/assets/roalla-logo.svg" alt="" width="40" height="40"><span>ROALLA <small>INSIGHTS</small></span></a><p>${t.footerAbout}</p></div>
      <div><h2>${t.footerExplore}</h2><div class="footer-links"><a href="${p.home}">${t.navCampaigns}</a><a href="${p.corporate}" data-attribution>www.roalla.com</a><a href="${p.privacy}">${t.privacy}</a><a href="${p.preferences}">${t.preferences}</a><a href="${p.unsubscribe}">${t.unsubscribe}</a></div></div>
      <div><h2>${t.footerContact}</h2><div class="footer-links"><span>Steven Robin</span><a href="mailto:sales@roalla.com">sales@roalla.com</a><a href="tel:+12898385868">+1 289 838 5868</a><a href="https://www.linkedin.com/in/stevenrobin/" rel="noopener noreferrer">LinkedIn</a></div></div>
    </div>
    <div class="footer-bottom">© <span data-year>${new Date().getFullYear()}</span> ${t.rights}<br>${t.operated}</div>
  </div></footer>`;
}

function layout({ lang, title, description, route, alternateRoute, content, structuredData, headerMode = "hub", campaignHref = "", ogImage = "" }) {
  const canonical = `${siteUrl}${route}`;
  const alternate = `${siteUrl}${alternateRoute}`;
  const headerHtml = header(lang, { mode: headerMode, campaignHref, alternateHref: alternateRoute });
  const ogImageTag = ogImage ? `\n  <meta property="og:image" content="${siteUrl}${ogImage}">` : "";
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="theme-color" content="#06151d">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="${lang}" href="${canonical}">
  <link rel="alternate" hreflang="${lang === "fr" ? "en" : "fr"}" href="${alternate}">
  <link rel="alternate" hreflang="x-default" href="${siteUrl}/en/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ROALLA Insights">
  <meta property="og:locale" content="${lang === "fr" ? "fr_CA" : "en_CA"}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">${ogImageTag}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <link rel="stylesheet" href="/assets/styles.css?v=${assetVersion}">
  <script type="application/ld+json">${escapeJson(structuredData)}</script>
  <script src="/assets/app.js?v=${assetVersion}" defer></script>
</head>
<body>${headerHtml}${content}${footer(lang)}</body>
</html>`;
}

function organizationSchema(lang) {
  const h = hub[lang];
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "ROALLA Insights",
    url: `${siteUrl}/${lang}/`,
    description: h.description,
    telephone: "+1-289-838-5868",
    email: "sales@roalla.com",
    areaServed: "CA",
    parentOrganization: {
      "@type": "Organization",
      name: "ROALLA Business Enablement Group",
      url: "https://www.roalla.com",
      founder: { "@type": "Person", name: "Steven Robin", jobTitle: "Founder & Principal Consultant", sameAs: "https://www.linkedin.com/in/stevenrobin/" }
    }
  };
}

function campaignSchema(lang, slug) {
  const campaign = campaigns[slug];
  const copy = campaign[lang];
  const p = paths(lang);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: copy.offerName,
    url: `${siteUrl}${p.campaign(slug)}`,
    description: copy.description,
    isPartOf: { "@type": "WebSite", name: "ROALLA Insights", url: siteUrl },
    about: {
      "@type": "Service",
      name: copy.offerName,
      provider: { "@type": "Organization", name: "ROALLA Business Enablement Group", url: "https://www.roalla.com" }
    }
  };
}

function hubPage(lang) {
  const h = hub[lang];
  const p = paths(lang);
  const tiles = h.tiles.map((tile) => {
    const href = p.campaign(tile.slug);
    const intent = campaigns[tile.slug]?.intent;
    const scenarios = (tile.scenarios || []).map((item) => {
      if (typeof item === "string") return `<li>${item}</li>`;
      if (item.pathKey) {
        const deep = resolveProofHref(lang, tile.slug, item.pathKey, intent, item.extra || {});
        return `<li><a class="campaign-tile-scenario-link" href="${deep}" data-attribution>${item.label}</a></li>`;
      }
      return `<li>${item.label}</li>`;
    }).join("");
    return `<article class="campaign-tile home-tile reveal">
      <a class="campaign-tile-main" href="${href}">
        <span class="campaign-tile-media"><img src="${tile.image}" alt="${tile.imageAlt}" width="640" height="400" loading="eager" decoding="async"><span class="campaign-tile-scrim" aria-hidden="true"></span><span class="campaign-tile-pill">${tile.servicePill}</span></span>
        <span class="campaign-tile-body">
          <h2>${tile.title}</h2>
          <p class="campaign-tile-blurb">${tile.blurb}</p>
          <span class="campaign-tile-cta">${tile.cta}<span class="campaign-tile-cta-arrow" aria-hidden="true">→</span></span>
        </span>
      </a>
      <ul class="campaign-tile-scenarios">${scenarios}</ul>
    </article>`;
  }).join("");
  const content = `<main id="main">
    <section class="hub-hero">
      <div class="wrap hub-hero-inner reveal">
        <p class="eyebrow">${h.eyebrow}</p>
        <h1>${h.heroTitle}</h1>
        <p class="hero-copy">${h.heroCopy}</p>
      </div>
    </section>
    <section class="section hub-tiles-section" id="campaigns">
      <div class="wrap">
        <div class="campaign-tiles">${tiles}</div>
      </div>
    </section>
  </main>`;
  return layout({
    lang,
    title: h.title,
    description: h.description,
    route: p.home,
    alternateRoute: paths(lang === "fr" ? "en" : "fr").home,
    content,
    structuredData: organizationSchema(lang),
    headerMode: "hub",
    ogImage: campaignImages.visibility
  });
}

function campaignPage(lang, slug) {
  const t = shell[lang];
  const campaign = campaigns[slug];
  const copy = campaign[lang];
  const tile = hub[lang].tiles.find((item) => item.slug === slug);
  const p = paths(lang);
  const other = paths(lang === "fr" ? "en" : "fr");
  const route = p.campaign(slug);
  const contactHref = attributedUrl(p.contact, { lang, slug, intent: campaign.intent });
  const primaryPathKey = copy.primaryPathKey || "contact";
  const secondaryPathKey = copy.secondaryPathKey || campaign.proofPathKey;
  const heroPrimaryHref = resolveProofHref(lang, slug, primaryPathKey, campaign.intent, copy.primaryExtra || (primaryPathKey === campaign.proofPathKey ? campaign.proofExtra || {} : {}));
  const heroSecondaryHref = resolveProofHref(lang, slug, secondaryPathKey, campaign.intent, copy.secondaryExtra || (secondaryPathKey === campaign.proofPathKey ? campaign.proofExtra || {} : {}));
  const closerPrimaryHref = primaryPathKey === "contact" ? heroPrimaryHref : contactHref;
  const closerSecondaryHref = primaryPathKey === "contact" ? heroSecondaryHref : heroPrimaryHref;
  const closerPrimaryLabel = primaryPathKey === "contact" ? copy.primaryCta : copy.secondaryCta;
  const closerSecondaryLabel = primaryPathKey === "contact" ? copy.secondaryCta : copy.primaryCta;
  const pathwayHref = resolveProofHref(lang, slug, campaign.pathwayPathKey, campaign.intent);
  const servicePill = tile?.servicePill || copy.heroEyebrow;
  const scenarios = (tile?.scenarios || []).map((item) => {
    if (typeof item === "string") {
      return `<li class="pressure-tile"><p class="pressure-label">${item}</p></li>`;
    }
    const href = resolveProofHref(lang, slug, item.pathKey, campaign.intent, item.extra || {});
    const gold = item.pathKey === "snapshot" || item.pathKey === "emailBrief" || item.pathKey === "contact";
    return `<li class="pressure-tile"><p class="pressure-label">${item.label}</p><a class="button${gold ? " gold" : ""} pressure-cta" href="${href}" data-attribution>${item.cta}<span aria-hidden="true"> →</span></a><p class="pressure-hint">${t.pressureHint}</p></li>`;
  }).join("");
  const ladderSteps = copy.ladder || [];
  const ladderTabs = ladderSteps.map((step, index) => `<li role="presentation"><button type="button" class="ladder-tab" role="tab" id="ladder-tab-${index}" aria-controls="ladder-panel-${index}" aria-selected="${index === 0 ? "true" : "false"}" tabindex="${index === 0 ? "0" : "-1"}" data-ladder-index="${index}"><span class="ladder-tab-index">0${index + 1}</span><span class="ladder-tab-label">${step.title}</span></button></li>`).join("");
  const ladderPanels = ladderSteps.map((step, index) => {
    const ctas = Array.isArray(step.ctas) && step.ctas.length
      ? step.ctas
      : [{ cta: step.cta, pathKey: step.pathKey, extra: step.extra || {}, primary: true }];
    const ctaHtml = ctas.map((item) => {
      const href = resolveProofHref(lang, slug, item.pathKey, campaign.intent, item.extra || {});
      const cls = item.primary ? "button gold ladder-cta" : "button ladder-cta";
      return `<a class="${cls}" href="${href}" data-attribution>${item.cta}<span aria-hidden="true"> →</span></a>`;
    }).join("");
    const soft = step.softLink
      ? `<p class="ladder-soft"><a href="${resolveProofHref(lang, slug, step.softLink.pathKey, campaign.intent, step.softLink.extra || {})}" data-attribution>${step.softLink.label}<span aria-hidden="true"> →</span></a></p>`
      : "";
    return `<div class="ladder-panel${index === 0 ? " is-active" : ""}" role="tabpanel" id="ladder-panel-${index}" aria-labelledby="ladder-tab-${index}"${index === 0 ? "" : " hidden"}><h3>${step.title}</h3><p>${step.body}</p><div class="ladder-cta-row">${ctaHtml}</div>${soft}</div>`;
  }).join("");
  const deliverables = (copy.deliverables || []).slice(0, 3);
  const firstDeliverable = deliverables[0] || ["", ""];
  const deliverableButtons = deliverables.map((item, index) => `<button type="button" class="deliverable${index === 0 ? " is-active" : ""}" role="listitem" data-deliverable-index="${index}" aria-current="${index === 0 ? "true" : "false"}"><strong>${item[0]}</strong><p>${item[1]}</p></button>`).join("");
  const pillars = copy.pillars.map((item, i) => `<article class="pillar reveal-on-scroll" style="--reveal-delay: ${i * 80}ms"><span class="number">0${i + 1}</span><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join("");
  const content = `<main id="main" class="campaign-need">
    <section class="pathway-hero">
      <div class="pathway-hero-glow" aria-hidden="true"></div>
      <div class="wrap pathway-hero-inner reveal">
        <a class="pathway-back" href="${p.home}">${t.navAllCampaigns}</a>
        <p class="pathway-eyebrow">${servicePill}</p>
        <h1>${copy.heroTitle}</h1>
        <p class="pathway-lead">${copy.heroCopy}</p>
        <div class="pathway-actions">
          <a class="button gold pathway-primary" href="${heroPrimaryHref}" data-attribution>${copy.primaryCta}<span aria-hidden="true"> →</span></a>
          <a class="button pathway-secondary" href="${heroSecondaryHref}" data-attribution>${copy.secondaryCta}</a>
        </div>
      </div>
    </section>
    <section class="section scenarios-band" id="scenarios">
      <div class="wrap">
        <div class="section-head reveal-on-scroll">
          <div><p class="eyebrow">${t.scenariosHeading}</p><h2>${t.examplesTitle}</h2></div>
          <p class="lead">${t.scenariosLead}</p>
        </div>
        <ul class="pressure-list">${scenarios}</ul>
        <p class="examples-cta"><a class="button pressure-sales" href="${contactHref}" data-attribution>${closerPrimaryLabel}<span aria-hidden="true"> →</span></a></p>
      </div>
    </section>
    <section class="section ladder-band" id="ladder">
      <div class="wrap">
        <div class="section-head reveal-on-scroll">
          <div><p class="eyebrow">${t.ladderEyebrow}</p><h2>${t.ladderTitle}</h2></div>
          <p class="lead">${t.ladderLead}</p>
        </div>
        <div class="ladder-stepper" data-ladder-stepper>
          <div class="ladder-nav-wrap">
            <ol class="ladder-nav" role="tablist" aria-label="${t.ladderTitle}">${ladderTabs}</ol>
            <div class="ladder-progress" aria-hidden="true"><span class="ladder-progress-fill"></span></div>
          </div>
          <div class="ladder-panels">${ladderPanels}</div>
          <div class="ladder-controls">
            <button type="button" class="button ladder-prev" data-ladder-prev disabled>${t.ladderPrev}</button>
            <button type="button" class="button ladder-next" data-ladder-next>${t.ladderNext}</button>
          </div>
        </div>
      </div>
    </section>
    <section class="section" id="review">
      <div class="wrap">
        <div class="section-head reveal-on-scroll">
          <div><p class="eyebrow">${copy.introEyebrow}</p><h2>${copy.introTitle}</h2></div>
          <p class="lead">${copy.introCopy}</p>
        </div>
        <div class="grid-4 pillars-modern">${pillars}</div>
      </div>
    </section>
    <section class="section dark deliverables-band" id="output">
      <div class="wrap">
        <div class="section-head reveal-on-scroll">
          <div><p class="eyebrow">${copy.outputEyebrow}</p><h2>${copy.outputTitle}</h2></div>
          <p class="lead">${copy.outputCopy}</p>
        </div>
        <div class="deliverables-spotlight" data-deliverables-spotlight>
          <div class="deliverable-stage" aria-live="polite">
            <strong class="deliverable-stage-title">${firstDeliverable[0]}</strong>
            <p class="deliverable-stage-body">${firstDeliverable[1]}</p>
          </div>
          <div class="deliverables" role="list">${deliverableButtons}</div>
        </div>
      </div>
    </section>
    <section class="section pathway-footer-cta">
      <div class="wrap">
        <div class="cta-closer reveal-on-scroll">
          <p class="eyebrow">${t.closingEyebrow}</p>
          <h2>${copy.ctaTitle}</h2>
          <p class="cta-reassure">${t.reassurance}</p>
          <p class="cta-homework">${copy.homework}</p>
          <div class="cta-closer-actions">
            <a class="button gold" href="${closerPrimaryHref}" data-attribution>${closerPrimaryLabel}<span aria-hidden="true"> →</span></a>
            <a class="button cta-proof" href="${closerSecondaryHref}" data-attribution>${closerSecondaryLabel}</a>
          </div>
          <p class="pathway-soft"><a href="${pathwayHref}" data-attribution>${copy.pathwayLink}<span aria-hidden="true"> →</span></a></p>
        </div>
      </div>
    </section>
  </main>`;
  return layout({
    lang,
    title: copy.title,
    description: copy.description,
    route,
    alternateRoute: other.campaign(slug),
    content,
    structuredData: campaignSchema(lang, slug),
    headerMode: "campaign",
    campaignHref: route,
    ogImage: campaign.image
  });
}

const legalCopy = {
  en: {
    privacy: {
      title: "Privacy notice",
      description: "How ROALLA Insights handles personal information, campaign attribution and communication choices.",
      lede: "ROALLA Insights is operated by ROALLA Business Enablement Group (“ROALLA”), a Canadian business based in Burlington, Ontario.",
      sections: [
        ["What this site collects", "This site can receive campaign parameters in the address you visit, including UTM values and advertising click identifiers. Those values are stored in your browser so they can be carried to ROALLA links and help us understand which communication led to an inquiry. The site does not set advertising cookies or create a server-side profile."],
        ["When you contact us", "If you email, call or follow a link to submit an inquiry on www.roalla.com, ROALLA uses the information you provide to respond, discuss a campaign offer and maintain appropriate business records. The privacy notice on www.roalla.com applies to information submitted there."],
        ["Communication choices", "Marketing communication is optional. You may update your preferences or unsubscribe at any time using the links on this site or in a ROALLA message. Service or relationship messages about an inquiry or active engagement may still be sent where permitted by law."],
        ["Your choices and contact", "You may clear campaign attribution by removing this site's local browser data. For access, correction, deletion, consent withdrawal or privacy questions, contact sales@roalla.com or +1 289 838 5868. We may need to verify identity before completing a request."],
        ["Other websites", "Links to www.roalla.com, LinkedIn and other services lead to separate websites with their own privacy practices. Review the notice at the destination before providing personal information."]
      ],
      updated: "Last updated: November 12, 2026"
    },
    preferences: { title: "Communication preferences", description: "Choose how often you want to receive optional ROALLA communications.", lede: "Tell us what you would like to receive. Submitting opens your email application with a prepared request so you can confirm it from the address concerned.", email: "Email address", frequency: "Preference", options: [["insights", "Occasional ROALLA insights"], ["essential", "Only messages related to my inquiries or work with ROALLA"], ["unsubscribe", "No marketing communications"]], button: "Prepare preference request", status: "Your email application should open. Send the prepared message to complete the request.", note: "ROALLA will use this request only to record and honour your communication choice." },
    unsubscribe: { title: "Unsubscribe", description: "Stop optional marketing messages from ROALLA.", lede: "Enter the address that receives ROALLA messages. Submitting opens your email application with a prepared unsubscribe request.", email: "Email address", button: "Prepare unsubscribe request", status: "Your email application should open. Send the prepared message to complete your unsubscribe request.", note: "We will honour your request as soon as practical. Messages about an inquiry you initiated or an active engagement may continue where permitted by law." },
    notFound: { title: "Page not found", description: "The requested ROALLA Insights page could not be found.", lede: "That address does not point to a page here.", button: "Return to ROALLA Insights" }
  },
  fr: {
    privacy: {
      title: "Avis de confidentialité",
      description: "Comment ROALLA Insights traite les renseignements personnels, l'attribution de campagne et les choix de communication.",
      lede: "ROALLA Insights est exploité par ROALLA Business Enablement Group (« ROALLA »), une entreprise canadienne située à Burlington, en Ontario.",
      sections: [
        ["Ce que ce site recueille", "Ce site peut recevoir les paramètres de campagne contenus dans l'adresse visitée, notamment les valeurs UTM et les identifiants de clic publicitaire. Ces valeurs sont conservées dans votre navigateur afin d'être transmises aux liens ROALLA et de nous aider à comprendre quelle communication a mené à une demande. Le site n'installe pas de témoins publicitaires et ne crée pas de profil côté serveur."],
        ["Lorsque vous nous contactez", "Si vous écrivez, appelez ou suivez un lien pour soumettre une demande sur www.roalla.com, ROALLA utilise les renseignements fournis pour répondre, discuter d'une offre de campagne et conserver les dossiers d'affaires appropriés. L'avis de confidentialité de www.roalla.com s'applique aux renseignements qui y sont soumis."],
        ["Choix de communication", "Les communications marketing sont facultatives. Vous pouvez modifier vos préférences ou vous désabonner en tout temps au moyen des liens sur ce site ou dans un message ROALLA. Les messages de service ou de relation liés à une demande ou à un mandat actif peuvent tout de même être envoyés lorsque la loi le permet."],
        ["Vos choix et nos coordonnées", "Vous pouvez effacer l'attribution de campagne en supprimant les données locales de ce site dans votre navigateur. Pour une demande d'accès, de correction, de suppression ou de retrait du consentement, ou pour toute question, écrivez à sales@roalla.com ou composez le +1 289 838 5868. Nous pourrions devoir vérifier votre identité."],
        ["Autres sites", "Les liens vers www.roalla.com, LinkedIn et d'autres services mènent à des sites distincts ayant leurs propres pratiques. Consultez l'avis du site de destination avant de fournir des renseignements personnels."]
      ],
      updated: "Dernière mise à jour : 12 novembre 2026"
    },
    preferences: { title: "Préférences de communication", description: "Choisissez la fréquence des communications facultatives de ROALLA.", lede: "Dites-nous ce que vous souhaitez recevoir. L'envoi ouvre votre application de courriel avec une demande préparée afin que vous puissiez la confirmer depuis l'adresse concernée.", email: "Adresse courriel", frequency: "Préférence", options: [["insights", "Des nouvelles occasionnelles de ROALLA"], ["essential", "Seulement les messages liés à mes demandes ou à mon travail avec ROALLA"], ["unsubscribe", "Aucune communication marketing"]], button: "Préparer la demande", status: "Votre application de courriel devrait s'ouvrir. Envoyez le message préparé pour compléter la demande.", note: "ROALLA utilisera cette demande uniquement pour consigner et respecter votre choix de communication." },
    unsubscribe: { title: "Se désabonner", description: "Cesser de recevoir les messages marketing facultatifs de ROALLA.", lede: "Entrez l'adresse qui reçoit les messages ROALLA. L'envoi ouvre votre application de courriel avec une demande de désabonnement préparée.", email: "Adresse courriel", button: "Préparer le désabonnement", status: "Votre application de courriel devrait s'ouvrir. Envoyez le message préparé pour compléter votre désabonnement.", note: "Nous respecterons votre demande dès que possible. Les messages liés à une demande que vous avez faite ou à un mandat actif peuvent continuer lorsque la loi le permet." },
    notFound: { title: "Page introuvable", description: "La page ROALLA Insights demandée est introuvable.", lede: "Cette adresse ne correspond à aucune page ici.", button: "Retourner à ROALLA Insights" }
  }
};

function simplePage(lang, kind) {
  const copy = legalCopy[lang][kind];
  const p = paths(lang);
  const other = paths(lang === "fr" ? "en" : "fr");
  const route = kind === "privacy" ? p.privacy : kind === "preferences" ? p.preferences : p.unsubscribe;
  const alternateRoute = kind === "privacy" ? other.privacy : kind === "preferences" ? other.preferences : other.unsubscribe;
  let body;
  if (kind === "privacy") {
    body = `<p class="notice">${copy.updated}</p>${copy.sections.map(([heading, text]) => `<section><h2>${heading}</h2><p>${text}</p></section>`).join("")}`;
  } else {
    const isPreferences = kind === "preferences";
    body = `<form class="preferences" data-preferences-form data-action="${isPreferences ? "preferences" : "unsubscribe"}"><label>${copy.email}<input name="email" type="email" autocomplete="email" required></label>${isPreferences ? `<label>${copy.frequency}<select name="frequency">${copy.options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}</select></label>` : ""}<button class="button" type="submit">${copy.button}</button><p class="status" role="status" hidden>${copy.status}</p><p>${copy.note}</p></form>`;
  }
  const content = `<main id="main"><article class="legal wrap"><p class="eyebrow">ROALLA Insights</p><h1>${copy.title}</h1><p class="lede">${copy.lede}</p>${body}</article></main>`;
  return layout({ lang, title: `${copy.title} | ROALLA Insights`, description: copy.description, route, alternateRoute, content, structuredData: { "@context": "https://schema.org", "@type": "WebPage", name: copy.title, url: `${siteUrl}${route}`, isPartOf: { "@type": "WebSite", name: "ROALLA Insights", url: siteUrl } } });
}

function notFound(lang) {
  const copy = legalCopy[lang].notFound;
  const p = paths(lang);
  return layout({ lang, title: `${copy.title} | ROALLA Insights`, description: copy.description, route: `${p.home}404.html`, alternateRoute: `${paths(lang === "fr" ? "en" : "fr").home}404.html`, content: `<main id="main"><div class="legal wrap"><p class="eyebrow">404</p><h1>${copy.title}</h1><p class="lede">${copy.lede}</p><a class="button" href="${p.home}">${copy.button}</a></div></main>`, structuredData: { "@context": "https://schema.org", "@type": "WebPage", name: copy.title } });
}

async function emit(relative, contents) {
  const target = new URL(relative, out);
  await mkdir(new URL("./", target), { recursive: true });
  await writeFile(target, contents, "utf8");
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(sourceAssets, new URL("assets/", out), { recursive: true });

await emit("en/index.html", hubPage("en"));
await emit("fr/index.html", hubPage("fr"));
for (const slug of Object.keys(campaigns)) {
  await emit(`en/campaigns/${slug}/index.html`, campaignPage("en", slug));
  await emit(`fr/campaigns/${slug}/index.html`, campaignPage("fr", slug));
}
await emit("en/privacy/index.html", simplePage("en", "privacy"));
await emit("fr/confidentialite/index.html", simplePage("fr", "privacy"));
await emit("en/preferences/index.html", simplePage("en", "preferences"));
await emit("fr/preferences/index.html", simplePage("fr", "preferences"));
await emit("en/unsubscribe/index.html", simplePage("en", "unsubscribe"));
await emit("fr/desabonnement/index.html", simplePage("fr", "unsubscribe"));
await emit("en/404.html", notFound("en"));
await emit("fr/404.html", notFound("fr"));

const routes = [
  "/en/",
  "/fr/",
  "/en/campaigns/visibility-review/",
  "/fr/campaigns/visibility-review/",
  "/en/campaigns/ai-employee-readiness/",
  "/fr/campaigns/ai-employee-readiness/",
  "/en/privacy/",
  "/fr/confidentialite/",
  "/en/preferences/",
  "/fr/preferences/",
  "/en/unsubscribe/",
  "/fr/desabonnement/"
];
await emit("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
await emit("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${siteUrl}${route}</loc><lastmod>${updated}</lastmod></url>`).join("\n")}\n</urlset>\n`);

console.log(`Built ${routes.length} indexed pages for ${siteUrl}`);
