import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const out = new URL("../dist/", import.meta.url);
const sourceAssets = new URL("../src/assets/", import.meta.url);
const configuredUrl = process.env.SITE_URL || "https://www.roallainsights.com";
const siteUrl = configuredUrl.replace(/\/$/, "");
const updated = "2026-11-11";

const languages = {
  en: {
    label: "English",
    alternate: "FR",
    alternateHref: "/fr/",
    skip: "Skip to main content",
    operated: "Operated by ROALLA Business Enablement Group",
    navReview: "The review",
    navProcess: "How it works",
    navCompany: "Visit ROALLA.com",
    privacy: "Privacy",
    preferences: "Communication preferences",
    unsubscribe: "Unsubscribe",
    rights: "ROALLA Business Enablement Group. All rights reserved.",
    homeTitle: "Website & AI Visibility Review | ROALLA Insights",
    homeDescription: "See how clearly your website communicates to customers, search engines and AI assistants with a practical Website & AI Visibility Review from ROALLA.",
    heroEyebrow: "Website & AI Visibility Review",
    heroTitle: "Be easier to find. Easier to trust. Easier to choose.",
    heroCopy: "A focused review of how your website presents your business to people, search engines and AI assistants—followed by a prioritized path to improve what matters.",
    primaryCta: "Request your review",
    secondaryCta: "See what we examine",
    signalBig: "4 lenses",
    signalSmall: "One practical view of your digital presence",
    introEyebrow: "Clarity before complexity",
    introTitle: "Your website is being interpreted in more places than one.",
    introCopy: "Prospects still visit pages and search results. Increasingly, they also ask AI tools to summarize, compare and recommend. The review looks at the signals that help every audience understand who you serve, what you do and why the next step is worth taking.",
    pillars: [
      ["Discoverability", "How clearly search engines can crawl, interpret and surface the page."],
      ["AI readiness", "Whether assistants can identify your offer, authority, location and next step."],
      ["Trust & performance", "The technical, accessibility and credibility signals that reduce friction."],
      ["Conversion path", "How confidently a qualified visitor can move from interest to conversation."]
    ],
    outputEyebrow: "The useful output",
    outputTitle: "Evidence you can act on—not another dashboard.",
    outputCopy: "You receive a concise, plain-language review designed for business decisions. It distinguishes urgent fixes from worthwhile improvements and ideas that can wait.",
    deliverables: [
      ["Executive snapshot", "A direct view of the strongest signals, material gaps and likely business impact."],
      ["Prioritized action plan", "Recommended next steps sequenced by value, effort and dependency."],
      ["Visibility observations", "Findings across page language, metadata, structured data and assistant-readable cues."],
      ["Technical evidence", "Selected mobile, desktop, accessibility, security and contact-path checks."],
      ["Working session", "A practical conversation with Steven Robin to interpret the findings and decide what comes next."],
      ["No ranking promises", "A grounded review of controllable signals—never a guarantee of search rankings or AI citations."]
    ],
    processEyebrow: "A focused engagement",
    processTitle: "From public signals to a practical decision.",
    process: [
      ["Share the starting point", "Send the website address and the business outcome you want the site to support."],
      ["ROALLA reviews the evidence", "We examine the selected public pages and relevant technical signals through a customer, search and AI lens."],
      ["Choose the next move", "Review the findings with Steven and decide what to fix, test or leave alone." ]
    ],
    ctaTitle: "Ready to see what your website is really communicating?",
    contactTitle: "Talk with Steven Robin",
    contactRole: "Founder & Principal Consultant",
    contactPlace: "Burlington, Ontario, Canada",
    contactEmail: "Email sales@roalla.com",
    contactPhone: "Call +1 289 838 5868",
    footerAbout: "ROALLA Insights is operated by ROALLA Business Enablement Group, a Canadian business enablement and digital advisory firm.",
    footerExplore: "Explore",
    footerContact: "Contact"
  },
  fr: {
    label: "Français",
    alternate: "EN",
    alternateHref: "/en/",
    skip: "Passer au contenu principal",
    operated: "Exploité par ROALLA Business Enablement Group",
    navReview: "L'évaluation",
    navProcess: "La démarche",
    navCompany: "Visiter ROALLA.com",
    privacy: "Confidentialité",
    preferences: "Préférences de communication",
    unsubscribe: "Se désabonner",
    rights: "ROALLA Business Enablement Group. Tous droits réservés.",
    homeTitle: "Évaluation de la visibilité Web et IA | ROALLA Insights",
    homeDescription: "Découvrez comment votre site communique avec les clients, les moteurs de recherche et les assistants IA grâce à l'évaluation pratique de ROALLA.",
    heroEyebrow: "Évaluation de la visibilité Web et IA",
    heroTitle: "Plus facile à trouver. À croire. À choisir.",
    heroCopy: "Une évaluation ciblée de la façon dont votre site présente votre entreprise aux personnes, aux moteurs de recherche et aux assistants IA, suivie d'une voie d'amélioration priorisée.",
    primaryCta: "Demander votre évaluation",
    secondaryCta: "Voir ce que nous examinons",
    signalBig: "4 angles",
    signalSmall: "Une vue pratique de votre présence numérique",
    introEyebrow: "La clarté avant la complexité",
    introTitle: "Votre site est interprété à plus d'un endroit.",
    introCopy: "Les clients potentiels consultent encore les pages et les résultats de recherche. De plus en plus, ils demandent aussi aux outils d'IA de résumer, comparer et recommander. L'évaluation examine les signaux qui aident chaque public à comprendre qui vous servez, ce que vous faites et pourquoi la prochaine étape en vaut la peine.",
    pillars: [
      ["Découvrabilité", "La facilité avec laquelle les moteurs peuvent explorer, interpréter et présenter la page."],
      ["Préparation à l'IA", "La capacité des assistants à cerner votre offre, votre crédibilité, votre emplacement et la prochaine étape."],
      ["Confiance et performance", "Les signaux techniques, d'accessibilité et de crédibilité qui réduisent les frictions."],
      ["Parcours de conversion", "La facilité avec laquelle une personne qualifiée passe de l'intérêt à la conversation."]
    ],
    outputEyebrow: "Un résultat utile",
    outputTitle: "Des preuves exploitables, pas un autre tableau de bord.",
    outputCopy: "Vous recevez une évaluation concise et claire, conçue pour soutenir les décisions d'affaires. Elle distingue les correctifs urgents, les améliorations utiles et les idées qui peuvent attendre.",
    deliverables: [
      ["Portrait exécutif", "Une vue directe des meilleurs signaux, des écarts importants et de leur incidence probable."],
      ["Plan d'action priorisé", "Les prochaines étapes recommandées, classées selon la valeur, l'effort et les dépendances."],
      ["Observations de visibilité", "Les constats liés au langage, aux métadonnées, aux données structurées et aux indices lisibles par l'IA."],
      ["Preuves techniques", "Des vérifications ciblées sur mobile, ordinateur, accessibilité, sécurité et prise de contact."],
      ["Séance de travail", "Une conversation pratique avec Steven Robin pour interpréter les constats et choisir la suite."],
      ["Aucune promesse de classement", "Une évaluation rigoureuse des signaux contrôlables, jamais une garantie de classement ou de citation par l'IA."]
    ],
    processEyebrow: "Un mandat ciblé",
    processTitle: "Des signaux publics à une décision pratique.",
    process: [
      ["Partager le point de départ", "Envoyez l'adresse du site et le résultat d'affaires que celui-ci doit soutenir."],
      ["ROALLA examine les preuves", "Nous examinons les pages publiques choisies et les signaux techniques pertinents sous l'angle du client, de la recherche et de l'IA."],
      ["Choisir la prochaine étape", "Passez les constats en revue avec Steven et décidez quoi corriger, tester ou laisser tel quel."]
    ],
    ctaTitle: "Prêt à voir ce que votre site communique vraiment?",
    contactTitle: "Parler avec Steven Robin",
    contactRole: "Fondateur et conseiller principal",
    contactPlace: "Burlington (Ontario), Canada",
    contactEmail: "Écrire à sales@roalla.com",
    contactPhone: "Appeler le +1 289 838 5868",
    footerAbout: "ROALLA Insights est exploité par ROALLA Business Enablement Group, une firme canadienne de conseil en accompagnement d'entreprise et en numérique.",
    footerExplore: "Explorer",
    footerContact: "Contact"
  }
};

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function paths(lang) {
  return lang === "fr"
    ? { home: "/fr/", privacy: "/fr/confidentialite/", preferences: "/fr/preferences/", unsubscribe: "/fr/desabonnement/", corporate: "https://www.roalla.com/fr", contact: "https://www.roalla.com/fr/contact" }
    : { home: "/en/", privacy: "/en/privacy/", preferences: "/en/preferences/", unsubscribe: "/en/unsubscribe/", corporate: "https://www.roalla.com/en", contact: "https://www.roalla.com/en/contact" };
}

function header(lang, active = "") {
  const t = languages[lang];
  const p = paths(lang);
  return `<a class="skip" href="#main">${t.skip}</a>
  <header class="site-header">
    <nav class="nav wrap" aria-label="${lang === "fr" ? "Navigation principale" : "Main navigation"}">
      <a class="brand" href="${p.home}" aria-label="ROALLA Insights — ${lang === "fr" ? "Accueil" : "Home"}"><img class="brand-logo" src="/assets/roalla-logo.svg" alt="" width="40" height="40"><span>ROALLA <small>INSIGHTS</small></span></a>
      <div class="nav-links">
        <a href="${p.home}#review">${t.navReview}</a>
        <a href="${p.home}#process">${t.navProcess}</a>
        <a href="${p.corporate}" data-attribution>${t.navCompany}</a>
        <a class="language" href="${t.alternateHref}" lang="${lang === "fr" ? "en" : "fr"}">${t.alternate}</a>
      </div>
    </nav>
  </header>`;
}

function footer(lang) {
  const t = languages[lang];
  const p = paths(lang);
  return `<footer class="site-footer"><div class="wrap">
    <div class="footer-grid">
      <div><a class="brand" href="${p.home}" aria-label="ROALLA Insights"><img class="brand-logo" src="/assets/roalla-logo.svg" alt="" width="40" height="40"><span>ROALLA <small>INSIGHTS</small></span></a><p>${t.footerAbout}</p></div>
      <div><h2>${t.footerExplore}</h2><div class="footer-links"><a href="${p.corporate}" data-attribution>www.roalla.com</a><a href="${p.privacy}">${t.privacy}</a><a href="${p.preferences}">${t.preferences}</a><a href="${p.unsubscribe}">${t.unsubscribe}</a></div></div>
      <div><h2>${t.footerContact}</h2><div class="footer-links"><span>Steven Robin</span><a href="mailto:sales@roalla.com">sales@roalla.com</a><a href="tel:+12898385868">+1 289 838 5868</a><a href="https://www.linkedin.com/in/stevenrobin/" rel="noopener noreferrer">LinkedIn</a></div></div>
    </div>
    <div class="footer-bottom">© <span data-year>${new Date().getFullYear()}</span> ${t.rights}<br>${t.operated}</div>
  </div></footer>`;
}

function layout({ lang, title, description, route, alternateRoute, content, structuredData }) {
  const canonical = `${siteUrl}${route}`;
  const alternate = `${siteUrl}${alternateRoute}`;
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
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="application/ld+json">${escapeJson(structuredData)}</script>
  <script src="/assets/app.js" defer></script>
</head>
<body>${header(lang)}${content}${footer(lang)}</body>
</html>`;
}

function organizationSchema(lang) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "ROALLA Insights",
    url: `${siteUrl}/${lang}/`,
    description: languages[lang].homeDescription,
    telephone: "+1-289-838-5868",
    email: "sales@roalla.com",
    areaServed: "CA",
    parentOrganization: {
      "@type": "Organization",
      name: "ROALLA Business Enablement Group",
      url: "https://www.roalla.com",
      founder: { "@type": "Person", name: "Steven Robin", jobTitle: "Founder & Principal Consultant", sameAs: "https://www.linkedin.com/in/stevenrobin/" }
    },
    makesOffer: { "@type": "Offer", itemOffered: { "@type": "Service", name: lang === "fr" ? "Évaluation de la visibilité Web et IA" : "Website & AI Visibility Review" } }
  };
}

function home(lang) {
  const t = languages[lang];
  const p = paths(lang);
  const content = `<main id="main">
    <section class="hero"><div class="hero-grid wrap"><div><p class="eyebrow">${t.heroEyebrow}</p><h1>${t.heroTitle}</h1><p class="hero-copy">${t.heroCopy}</p><div class="actions"><a class="button" href="${p.contact}?intent=website-ai-visibility-review" data-attribution>${t.primaryCta}</a><a class="button secondary" href="#review">${t.secondaryCta}</a></div></div><div class="signal" aria-hidden="true"><div class="signal-card"><strong>${t.signalBig}</strong><span>${t.signalSmall}</span></div></div></div></section>
    <section class="section" id="review"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${t.introEyebrow}</p><h2>${t.introTitle}</h2></div><p class="lead">${t.introCopy}</p></div><div class="grid-4">${t.pillars.map((item, i) => `<article class="pillar"><span class="number">0${i + 1}</span><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join("")}</div></div></section>
    <section class="section dark"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${t.outputEyebrow}</p><h2>${t.outputTitle}</h2></div><p class="lead">${t.outputCopy}</p></div><div class="deliverables">${t.deliverables.map((item) => `<div class="deliverable"><strong>${item[0]}</strong><p>${item[1]}</p></div>`).join("")}</div></div></section>
    <section class="section" id="process"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${t.processEyebrow}</p><h2>${t.processTitle}</h2></div></div><div class="process">${t.process.map((item) => `<article class="step"><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join("")}</div></div></section>
    <section class="section"><div class="wrap"><div class="cta-band"><h2>${t.ctaTitle}</h2><div class="contact-card"><h3>${t.contactTitle}</h3><p>Steven Robin<br>${t.contactRole}<br>${t.contactPlace}</p><div class="footer-links"><a href="mailto:sales@roalla.com?subject=${encodeURIComponent(t.heroEyebrow)}">${t.contactEmail}</a><a href="tel:+12898385868">${t.contactPhone}</a><a class="button gold" href="${p.contact}?intent=website-ai-visibility-review" data-attribution>${t.primaryCta}</a></div></div></div></div></section>
  </main>`;
  return layout({ lang, title: t.homeTitle, description: t.homeDescription, route: p.home, alternateRoute: paths(lang === "fr" ? "en" : "fr").home, content, structuredData: organizationSchema(lang) });
}

const legalCopy = {
  en: {
    privacy: {
      title: "Privacy notice",
      description: "How ROALLA Insights handles personal information, campaign attribution and communication choices.",
      lede: "ROALLA Insights is operated by ROALLA Business Enablement Group (“ROALLA”), a Canadian business based in Burlington, Ontario.",
      sections: [
        ["What this site collects", "This site can receive campaign parameters in the address you visit, including UTM values and advertising click identifiers. Those values are stored in your browser so they can be carried to ROALLA links and help us understand which communication led to an inquiry. The site does not set advertising cookies or create a server-side profile."],
        ["When you contact us", "If you email, call or follow a link to submit an inquiry on www.roalla.com, ROALLA uses the information you provide to respond, discuss the Website & AI Visibility Review and maintain appropriate business records. The privacy notice on www.roalla.com applies to information submitted there."],
        ["Communication choices", "Marketing communication is optional. You may update your preferences or unsubscribe at any time using the links on this site or in a ROALLA message. Service or relationship messages about an inquiry or active engagement may still be sent where permitted by law."],
        ["Your choices and contact", "You may clear campaign attribution by removing this site's local browser data. For access, correction, deletion, consent withdrawal or privacy questions, contact sales@roalla.com or +1 289 838 5868. We may need to verify identity before completing a request."],
        ["Other websites", "Links to www.roalla.com, LinkedIn and other services lead to separate websites with their own privacy practices. Review the notice at the destination before providing personal information."]
      ],
      updated: "Last updated: November 3, 2026"
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
        ["Lorsque vous nous contactez", "Si vous écrivez, appelez ou suivez un lien pour soumettre une demande sur www.roalla.com, ROALLA utilise les renseignements fournis pour répondre, discuter de l'évaluation de la visibilité Web et IA et conserver les dossiers d'affaires appropriés. L'avis de confidentialité de www.roalla.com s'applique aux renseignements qui y sont soumis."],
        ["Choix de communication", "Les communications marketing sont facultatives. Vous pouvez modifier vos préférences ou vous désabonner en tout temps au moyen des liens sur ce site ou dans un message ROALLA. Les messages de service ou de relation liés à une demande ou à un mandat actif peuvent tout de même être envoyés lorsque la loi le permet."],
        ["Vos choix et nos coordonnées", "Vous pouvez effacer l'attribution de campagne en supprimant les données locales de ce site dans votre navigateur. Pour une demande d'accès, de correction, de suppression ou de retrait du consentement, ou pour toute question, écrivez à sales@roalla.com ou composez le +1 289 838 5868. Nous pourrions devoir vérifier votre identité."],
        ["Autres sites", "Les liens vers www.roalla.com, LinkedIn et d'autres services mènent à des sites distincts ayant leurs propres pratiques. Consultez l'avis du site de destination avant de fournir des renseignements personnels."]
      ],
      updated: "Dernière mise à jour : 3 novembre 2026"
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

await emit("en/index.html", home("en"));
await emit("fr/index.html", home("fr"));
await emit("en/privacy/index.html", simplePage("en", "privacy"));
await emit("fr/confidentialite/index.html", simplePage("fr", "privacy"));
await emit("en/preferences/index.html", simplePage("en", "preferences"));
await emit("fr/preferences/index.html", simplePage("fr", "preferences"));
await emit("en/unsubscribe/index.html", simplePage("en", "unsubscribe"));
await emit("fr/desabonnement/index.html", simplePage("fr", "unsubscribe"));
await emit("en/404.html", notFound("en"));
await emit("fr/404.html", notFound("fr"));

const routes = ["/en/", "/fr/", "/en/privacy/", "/fr/confidentialite/", "/en/preferences/", "/fr/preferences/", "/en/unsubscribe/", "/fr/desabonnement/"];
await emit("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
await emit("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${siteUrl}${route}</loc><lastmod>${updated}</lastmod></url>`).join("\n")}\n</urlset>\n`);

console.log(`Built ${routes.length} indexed pages for ${siteUrl}`);
