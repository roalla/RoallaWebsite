import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const out = new URL("../dist/", import.meta.url);
const sourceAssets = new URL("../src/assets/", import.meta.url);
const configuredUrl = process.env.SITE_URL || "https://www.roallainsights.com";
const siteUrl = configuredUrl.replace(/\/$/, "");
const updated = "2026-11-12";
const assetVersion = "20261112b";

const shell = {
  en: {
    alternate: "FR",
    skip: "Skip to main content",
    operated: "Operated by ROALLA Business Enablement Group",
    navCampaigns: "Campaigns",
    navReview: "What we examine",
    navProcess: "How it works",
    navCompany: "Visit ROALLA.com",
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
    trendsCopy: "Short signals for business decisions—not a technology lecture."
  },
  fr: {
    alternate: "EN",
    skip: "Passer au contenu principal",
    operated: "Exploité par ROALLA Business Enablement Group",
    navCampaigns: "Campagnes",
    navReview: "Ce que nous examinons",
    navProcess: "La démarche",
    navCompany: "Visiter ROALLA.com",
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
    trendsCopy: "Des signaux courts pour décider—pas un cours de technologie."
  }
};

const hub = {
  en: {
    title: "ROALLA Insights | Outcome-focused sales campaigns",
    description: "Choose a focused ROALLA campaign—be easier to find online, or automate busy work with clear human control.",
    eyebrow: "ROALLA Insights",
    heroTitle: "Clear outcomes. Fast decisions.",
    heroCopy: "Choose the result you want. Each campaign helps you decide quickly.",
    tiles: [
      {
        slug: "visibility-review",
        title: "Be easier to find",
        blurb: "A plain-language review of how customers, search, and AI tools see your business.",
        cta: "Open visibility campaign",
        image: "/assets/campaigns/visibility-hero.webp",
        imageAlt: "Business visibility across search and digital channels"
      },
      {
        slug: "ai-employee-readiness",
        title: "Automate with control",
        blurb: "See if an AI Employee fits one busy process—with people still in charge.",
        cta: "Open AI readiness campaign",
        image: "/assets/campaigns/ai-employee-hero.webp",
        imageAlt: "Frontline AI support with clear human handoff"
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
        title: "Être plus facile à trouver",
        blurb: "Une évaluation en langage simple de la façon dont clients, recherche et outils d’IA voient votre entreprise.",
        cta: "Ouvrir la campagne visibilité",
        image: "/assets/campaigns/visibility-hero.webp",
        imageAlt: "Visibilité d’entreprise dans la recherche et les canaux numériques"
      },
      {
        slug: "ai-employee-readiness",
        title: "Automatiser avec contrôle",
        blurb: "Vérifiez si un employé IA convient à un processus chargé—avec des personnes aux commandes.",
        cta: "Ouvrir la campagne préparation IA",
        image: "/assets/campaigns/ai-employee-hero.webp",
        imageAlt: "Soutien IA en première ligne avec transfert humain clair"
      }
    ]
  }
};

const campaigns = {
  "visibility-review": {
    intent: "website-ai-visibility-review",
    image: "/assets/campaigns/visibility-hero.webp",
    en: {
      offerName: "Website & AI Visibility Review",
      title: "Website & AI Visibility Review | ROALLA Insights",
      description: "A practical review of how clearly your website presents your business to customers, search, and AI tools—plus a prioritized path to improve what matters.",
      heroEyebrow: "Website & AI Visibility Review",
      heroTitle: "Be easier to find. Easier to trust. Easier to choose.",
      heroCopy: "A plain-language review of how customers, search, and AI tools see your business—and what to fix first.",
      primaryCta: "Request your review",
      secondaryCta: "See what we examine",
      homework: "To start, send your website address and the result you want the site to support.",
      examples: [
        "A customer asks ChatGPT who to call near them—and your business isn’t named.",
        "Your Google listing says one thing, your website says another, and people stop trusting both.",
        "The site looks fine to you, but visitors can’t tell what you do or how to contact you on their phone."
      ],
      introEyebrow: "Clarity before complexity",
      introTitle: "Customers judge you in more places than one.",
      introCopy: "People visit pages, search results, and AI answers. This review checks whether they can tell who you serve, what you do, and what to do next.",
      pillars: [
        ["Easier to find", "Whether search can understand and show your pages to the right people."],
        ["Clear to AI tools", "Whether assistants can name your offer, location, credibility, and next step."],
        ["Trust & ease", "Whether the site feels credible and works smoothly on phone and desktop."],
        ["Path to contact", "Whether a serious visitor can start a conversation without friction."]
      ],
      trends: [
        ["AI tools recommend clearer businesses", "Chat tools and search summaries prefer firms that plainly say who they help, what they do, and where they work."],
        ["Your public facts must match", "When your name, services, and pages disagree, customers and machines get confused—and you lose trust."],
        ["Being found is bigger than rankings", "Maps, search, and AI answers need one clear story about your business—not ranking tricks alone."]
      ],
      outputEyebrow: "What you receive",
      outputTitle: "A short written view you can act on.",
      outputCopy: "You get a concise, plain-language review made for business decisions. It separates urgent fixes from useful improvements and ideas that can wait.",
      deliverables: [
        ["Short snapshot", "The strongest signals, the real gaps, and what that likely means for the business."],
        ["Prioritized next steps", "What to do first, sequenced by value and effort."],
        ["Visibility findings", "How clearly your pages, facts, and AI-readable cues tell your story."],
        ["Selected checks", "Practical looks at mobile, desktop, accessibility, security basics, and the contact path."],
        ["Working call with Steven", "A practical conversation to interpret the findings and decide what comes next."],
        ["No ranking promises", "A grounded review of what you can control—never a guarantee of rankings or AI citations."]
      ],
      processEyebrow: "A focused engagement",
      processTitle: "From your public site to a practical decision.",
      process: [
        ["Share the starting point", "Send the website address and the result you want the site to support."],
        ["ROALLA reviews the evidence", "We examine selected public pages through a customer, search, and AI lens—and explain findings in plain language."],
        ["Choose the next move", "Review the findings with Steven and decide what to fix, test, or leave alone."]
      ],
      ctaTitle: "Ready to see what your website is really communicating?"
    },
    fr: {
      offerName: "Évaluation de la visibilité Web et IA",
      title: "Évaluation de la visibilité Web et IA | ROALLA Insights",
      description: "Une évaluation pratique de la façon dont votre site présente clairement votre entreprise aux clients, à la recherche et aux outils d’IA—avec une voie d’amélioration priorisée.",
      heroEyebrow: "Évaluation de la visibilité Web et IA",
      heroTitle: "Plus facile à trouver. À croire. À choisir.",
      heroCopy: "Une évaluation en langage simple de la façon dont clients, recherche et outils d’IA voient votre entreprise—et quoi corriger en premier.",
      primaryCta: "Demander votre évaluation",
      secondaryCta: "Voir ce que nous examinons",
      homework: "Pour commencer, envoyez l’adresse du site et le résultat que celui-ci doit soutenir.",
      examples: [
        "Un client demande à ChatGPT qui appeler près de chez lui—et votre entreprise n’est pas nommée.",
        "Votre fiche Google dit une chose, votre site en dit une autre, et la confiance baisse.",
        "Le site vous semble bien, mais sur téléphone on ne voit pas clairement ce que vous faites ni comment vous joindre."
      ],
      introEyebrow: "La clarté avant la complexité",
      introTitle: "Les clients vous jugent à plus d’un endroit.",
      introCopy: "Les gens consultent pages, résultats de recherche et réponses IA. Cette évaluation vérifie s’ils comprennent qui vous servez, ce que vous faites et quoi faire ensuite.",
      pillars: [
        ["Plus facile à trouver", "La recherche peut-elle comprendre et montrer vos pages aux bonnes personnes."],
        ["Clair pour les outils d’IA", "Les assistants peuvent-ils nommer votre offre, votre lieu, votre crédibilité et la prochaine étape."],
        ["Confiance et aisance", "Le site inspire-t-il confiance et fonctionne-t-il bien sur téléphone et ordinateur."],
        ["Chemin vers le contact", "Un visiteur sérieux peut-il démarrer une conversation sans friction."]
      ],
      trends: [
        ["Les outils d’IA recommandent les entreprises plus claires", "Les clavardages et résumés de recherche préfèrent les firmes qui disent simplement qui elles aident, ce qu’elles font et où elles travaillent."],
        ["Vos faits publics doivent concorder", "Quand le nom, les services et les pages se contredisent, clients et machines se perdent—et la confiance baisse."],
        ["Être trouvé dépasse le classement", "Cartes, recherche et réponses IA ont besoin d’une histoire claire—pas seulement d’astuces de classement."]
      ],
      outputEyebrow: "Ce que vous recevez",
      outputTitle: "Une vue écrite courte et actionnable.",
      outputCopy: "Vous obtenez une évaluation concise, en langage simple, conçue pour les décisions d’affaires. Elle sépare les correctifs urgents, les améliorations utiles et les idées qui peuvent attendre.",
      deliverables: [
        ["Court portrait", "Les meilleurs signaux, les vrais écarts et ce que cela signifie probablement pour l’entreprise."],
        ["Prochaines étapes priorisées", "Quoi faire d’abord, selon la valeur et l’effort."],
        ["Constats de visibilité", "À quel point vos pages, faits et indices lisibles par l’IA racontent votre histoire."],
        ["Vérifications ciblées", "Regards pratiques sur mobile, ordinateur, accessibilité, bases de sécurité et chemin de contact."],
        ["Appel de travail avec Steven", "Une conversation pratique pour interpréter les constats et choisir la suite."],
        ["Aucune promesse de classement", "Une évaluation des éléments contrôlables—jamais une garantie de classement ou de citation par l’IA."]
      ],
      processEyebrow: "Un mandat ciblé",
      processTitle: "De votre site public à une décision pratique.",
      process: [
        ["Partager le point de départ", "Envoyez l’adresse du site et le résultat que celui-ci doit soutenir."],
        ["ROALLA examine les preuves", "Nous examinons des pages publiques choisies sous l’angle client, recherche et IA—et expliquons les constats en langage simple."],
        ["Choisir la prochaine étape", "Passez les constats en revue avec Steven et décidez quoi corriger, tester ou laisser tel quel."]
      ],
      ctaTitle: "Prêt à voir ce que votre site communique vraiment?"
    }
  },
  "ai-employee-readiness": {
    intent: "ai-support",
    image: "/assets/campaigns/ai-employee-hero.webp",
    en: {
      offerName: "AI Employee & Agent Readiness",
      title: "AI Employee & Agent Readiness | ROALLA Insights",
      description: "See whether an AI Employee fits a busy process—with clear approvals, human handoffs, and costs planned before you build.",
      heroEyebrow: "AI Employee & Agent Readiness",
      heroTitle: "Automate the busy work. Keep control.",
      heroCopy: "See if an AI Employee fits one busy process—with clear approvals and a person for exceptions.",
      primaryCta: "See if an AI Employee fits",
      secondaryCta: "See what we examine",
      homework: "To start, describe the busy work and who handles exceptions today.",
      examples: [
        "The same scheduling, quote, or “are you open?” questions land every day while the team is with customers.",
        "You’re afraid a chatbot will invent answers or change something it shouldn’t—so nothing gets automated.",
        "You tried a generic chat widget; it didn’t follow your rules and staff stopped using it."
      ],
      introEyebrow: "Control before complexity",
      introTitle: "AI helps when the work is clear—and people stay accountable.",
      introCopy: "Fewer missed calls and less repetitive follow-up—without an unsupervised tool inventing answers or changing records. Readiness means one process, clear approvals, and a person for exceptions.",
      pillars: [
        ["The right workload", "One busy, measurable process—not a vague “do everything” chatbot."],
        ["Approvals that protect you", "Clear rules for when AI can act and when a person must decide."],
        ["Handoffs people trust", "When something is sensitive or stuck, the right person gets full context."],
        ["Cost you can plan", "Ongoing AI help has real costs—plan them before a pilot looks “cheap.”"]
      ],
      trends: [
        ["AI help has real ongoing costs", "Cheap pilots get expensive when every question and handoff isn’t planned as a budget line."],
        ["AI should ask before it changes important records", "Without clear approvals, mistakes and compliance issues pile up faster than time savings."],
        ["Start with one busy process—not a general chatbot", "The pattern that works is a narrow workload with a person for exceptions—not novelty for its own sake."]
      ],
      outputEyebrow: "What you receive",
      outputTitle: "A clear fit view—not a science project.",
      outputCopy: "You get a plain-language readiness view: where AI can help, where people must stay in control, and what to decide before any build.",
      deliverables: [
        ["Fit snapshot", "Whether an AI Employee makes sense for the workload you named—and what would block success."],
        ["Control checklist", "Approvals, handoffs, and exception owners stated in everyday language."],
        ["Cost & effort cues", "What tends to drive ongoing cost so you are not surprised after a pilot."],
        ["First process recommendation", "One practical starting workload if you move ahead."],
        ["Working call with Steven", "A conversation to interpret fit and choose go, pause, or reshape."],
        ["No magic promises", "A grounded view of controllable fit—never a guarantee of savings or unsupervised autonomy."]
      ],
      processEyebrow: "A focused engagement",
      processTitle: "From busy work to a go / no-go decision.",
      process: [
        ["Share the busy work", "Tell us the process, volume, and who handles exceptions today."],
        ["ROALLA reviews fit and control", "We map where AI can help and where people must stay accountable—in plain language."],
        ["Choose the next move", "Decide with Steven whether to proceed, reshape the scope, or wait."]
      ],
      ctaTitle: "Ready to see if an AI Employee fits—with control?"
    },
    fr: {
      offerName: "Préparation employé IA et agents",
      title: "Préparation employé IA et agents | ROALLA Insights",
      description: "Vérifiez si un employé IA convient à un processus chargé—avec des approbations claires, des transferts humains et des coûts prévus avant de construire.",
      heroEyebrow: "Préparation employé IA et agents",
      heroTitle: "Automatisez le travail répétitif. Gardez le contrôle.",
      heroCopy: "Vérifiez si un employé IA convient à un processus chargé—avec des approbations claires et une personne pour les exceptions.",
      primaryCta: "Voir si un employé IA convient",
      secondaryCta: "Voir ce que nous examinons",
      homework: "Pour commencer, décrivez le travail répétitif et qui gère les exceptions aujourd’hui.",
      examples: [
        "Les mêmes questions d’horaire, de soumission ou « êtes-vous ouverts? » arrivent chaque jour pendant que l’équipe sert les clients.",
        "Vous craignez qu’un clavardage invente des réponses ou change quelque chose—alors rien n’est automatisé.",
        "Vous avez essayé un clavardage générique; il n’a pas suivi vos règles et l’équipe a arrêté de l’utiliser."
      ],
      introEyebrow: "Le contrôle avant la complexité",
      introTitle: "L’IA aide quand le travail est clair—et que les gens restent responsables.",
      introCopy: "Moins d’appels manqués et moins de suivis répétitifs—sans outil sans supervision qui invente des réponses ou modifie des dossiers. La préparation, c’est un processus, des approbations claires et une personne pour les exceptions.",
      pillars: [
        ["La bonne charge de travail", "Un processus mesurable et chargé—pas un clavardage vague « qui fait tout »."],
        ["Des approbations qui protègent", "Des règles claires pour quand l’IA peut agir et quand une personne doit décider."],
        ["Des transferts fiables", "Quand c’est sensible ou bloqué, la bonne personne reçoit le contexte complet."],
        ["Un coût planifiable", "L’aide IA a des coûts réels—prévoyez-les avant qu’un pilote paraisse « peu cher »."]
      ],
      trends: [
        ["L’aide IA a des coûts continus réels", "Les pilotes bon marché coûtent cher quand chaque question et transfert n’est pas prévu au budget."],
        ["L’IA devrait demander avant de modifier des dossiers importants", "Sans approbations claires, erreurs et enjeux de conformité s’accumulent plus vite que les gains de temps."],
        ["Commencez par un processus chargé—pas un clavardage général", "Le modèle qui fonctionne est une charge étroite avec une personne pour les exceptions—pas la nouveauté pour elle-même."]
      ],
      outputEyebrow: "Ce que vous recevez",
      outputTitle: "Une vue d’adéquation claire—pas un projet scientifique.",
      outputCopy: "Vous obtenez une vue de préparation en langage simple : où l’IA peut aider, où les gens doivent rester aux commandes, et quoi décider avant toute construction.",
      deliverables: [
        ["Portrait d’adéquation", "Si un employé IA a du sens pour la charge nommée—et ce qui bloquerait le succès."],
        ["Liste de contrôle", "Approbations, transferts et responsables d’exceptions en langage courant."],
        ["Repères de coût et d’effort", "Ce qui tend à faire monter le coût continu pour éviter les surprises après un pilote."],
        ["Première recommandation de processus", "Une charge de départ pratique si vous avancez."],
        ["Appel de travail avec Steven", "Une conversation pour interpréter l’adéquation et choisir d’avancer, de recentrer ou d’attendre."],
        ["Aucune promesse magique", "Une vue réaliste de l’adéquation contrôlable—jamais une garantie d’économies ou d’autonomie sans supervision."]
      ],
      processEyebrow: "Un mandat ciblé",
      processTitle: "Du travail répétitif à une décision d’aller / pas aller.",
      process: [
        ["Partager le travail répétitif", "Décrivez le processus, le volume et qui gère les exceptions aujourd’hui."],
        ["ROALLA examine l’adéquation et le contrôle", "Nous cartographions où l’IA peut aider et où les gens restent responsables—en langage simple."],
        ["Choisir la prochaine étape", "Décidez avec Steven d’avancer, de recentrer la portée, ou d’attendre."]
      ],
      ctaTitle: "Prêt à voir si un employé IA convient—avec contrôle?"
    }
  }
};

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function paths(lang) {
  const base = lang === "fr"
    ? { home: "/fr/", privacy: "/fr/confidentialite/", preferences: "/fr/preferences/", unsubscribe: "/fr/desabonnement/", corporate: "https://www.roalla.com/fr", contact: "https://www.roalla.com/fr/contact" }
    : { home: "/en/", privacy: "/en/privacy/", preferences: "/en/preferences/", unsubscribe: "/en/unsubscribe/", corporate: "https://www.roalla.com/en", contact: "https://www.roalla.com/en/contact" };
  return {
    ...base,
    visibility: `${base.home}campaigns/visibility-review/`,
    aiEmployee: `${base.home}campaigns/ai-employee-readiness/`,
    campaign(slug) {
      return `${base.home}campaigns/${slug}/`;
    }
  };
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
    return `<article class="campaign-tile reveal">
      <div class="campaign-tile-media"><img src="${tile.image}" alt="${tile.imageAlt}" width="640" height="360" loading="eager" decoding="async"></div>
      <div class="campaign-tile-body">
        <h2>${tile.title}</h2>
        <p class="campaign-tile-blurb">${tile.blurb}</p>
        <a class="campaign-tile-link" href="${href}">${tile.cta}</a>
      </div>
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
    ogImage: "/assets/campaigns/visibility-hero.webp"
  });
}

function campaignPage(lang, slug) {
  const t = shell[lang];
  const campaign = campaigns[slug];
  const copy = campaign[lang];
  const p = paths(lang);
  const other = paths(lang === "fr" ? "en" : "fr");
  const route = p.campaign(slug);
  const contactHref = `${p.contact}?intent=${encodeURIComponent(campaign.intent)}`;
  const examples = (copy.examples || []).map((item) => `<li>${item}</li>`).join("");
  const content = `<main id="main">
    <section class="hero hero-media">
      <div class="hero-media-bg" aria-hidden="true"><img src="${campaign.image}" alt="" width="1600" height="900" loading="eager" decoding="async"></div>
      <div class="hero-media-scrim" aria-hidden="true"></div>
      <div class="hero-grid wrap">
        <div class="reveal">
          <p class="eyebrow">${copy.heroEyebrow}</p>
          <h1>${copy.heroTitle}</h1>
          <p class="hero-copy">${copy.heroCopy}</p>
          <div class="actions">
            <a class="button" href="${contactHref}" data-attribution>${copy.primaryCta}</a>
            <a class="text-link hero-secondary" href="#examples">${copy.secondaryCta}</a>
          </div>
        </div>
      </div>
    </section>
    <section class="section examples" id="examples">
      <div class="wrap">
        <div class="section-head reveal-on-scroll">
          <div><p class="eyebrow">${t.examplesEyebrow}</p><h2>${t.examplesTitle}</h2></div>
        </div>
        <ol class="example-list">${examples}</ol>
        <p class="examples-cta"><a class="button" href="${contactHref}" data-attribution>${copy.primaryCta}</a></p>
      </div>
    </section>
    <section class="section" id="review">
      <div class="wrap">
        <div class="section-head reveal-on-scroll">
          <div><p class="eyebrow">${copy.introEyebrow}</p><h2>${copy.introTitle}</h2></div>
          <p class="lead">${copy.introCopy}</p>
        </div>
        <div class="grid-4">${copy.pillars.map((item, i) => `<article class="pillar"><span class="number">0${i + 1}</span><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join("")}</div>
      </div>
    </section>
    <section class="section trends" id="trends-2027">
      <div class="wrap">
        <div class="section-head reveal-on-scroll">
          <div><p class="eyebrow">${t.trendsEyebrow}</p><h2>${t.trendsTitle}</h2></div>
          <p class="lead">${t.trendsCopy}</p>
        </div>
        <div class="trends-grid">${copy.trends.map((item) => `<article class="trend-signal"><p class="trend-label">${lang === "fr" ? "Signal 2027" : "2027 signal"}</p><h3>${item[0]}</h3><p>${item[1]}</p><a class="trend-cta" href="${contactHref}" data-attribution>${copy.primaryCta}</a></article>`).join("")}</div>
      </div>
    </section>
    <section class="section dark">
      <div class="wrap">
        <div class="section-head reveal-on-scroll">
          <div><p class="eyebrow">${copy.outputEyebrow}</p><h2>${copy.outputTitle}</h2></div>
          <p class="lead">${copy.outputCopy}</p>
        </div>
        <div class="deliverables">${copy.deliverables.map((item) => `<div class="deliverable"><strong>${item[0]}</strong><p>${item[1]}</p></div>`).join("")}</div>
      </div>
    </section>
    <section class="section" id="process">
      <div class="wrap">
        <div class="section-head"><div><p class="eyebrow">${copy.processEyebrow}</p><h2>${copy.processTitle}</h2></div></div>
        <div class="process">${copy.process.map((item) => `<article class="step"><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join("")}</div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="cta-band">
          <div>
            <h2>${copy.ctaTitle}</h2>
            <p class="cta-reassure">${t.reassurance}</p>
            <p class="cta-homework">${copy.homework}</p>
          </div>
          <div class="contact-card">
            <h3>${t.contactTitle}</h3>
            <p>Steven Robin<br>${t.contactRole}<br>${t.contactPlace}</p>
            <div class="footer-links">
              <a href="mailto:sales@roalla.com?subject=${encodeURIComponent(copy.heroEyebrow)}">${t.contactEmail}</a>
              <a href="tel:+12898385868">${t.contactPhone}</a>
              <a class="button gold" href="${contactHref}" data-attribution>${copy.primaryCta}</a>
            </div>
          </div>
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
