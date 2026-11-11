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
    navReview: "Products",
    navProcess: "Find your fit",
    navCompany: "Visit ROALLA.com",
    privacy: "Privacy",
    preferences: "Communication preferences",
    unsubscribe: "Unsubscribe",
    rights: "ROALLA Business Enablement Group. All rights reserved.",
    homeTitle: "Business, Technology & Digital Products | ROALLA Insights",
    homeDescription: "Explore focused ROALLA products for strategy, operations, technology, security, websites, AI, automation, digital experiences and team capability.",
    heroEyebrow: "Focused products. Practical next moves.",
    heroTitle: "Move the right part of your business forward.",
    heroCopy: "Explore focused advisory, digital and enablement products designed to turn a clear business need into evidence, decisions and accountable action.",
    primaryCta: "Find the right product",
    secondaryCta: "Explore every product",
    signalBig: "11 products",
    signalSmall: "One clear starting point for what needs to change",
    introEyebrow: "Start with the outcome",
    introTitle: "You do not need to diagnose the solution first.",
    introCopy: "Choose the pressure you recognize. ROALLA will help connect it to a focused product, a sensible first step and the evidence needed to decide what comes next.",
    pillars: [
      ["Decide", "Clarify priorities, risks, investment choices and the operating decisions that matter now.", "advisory"],
      ["Build", "Create or improve websites, products, integrations, automation and AI-enabled experiences.", "digital"],
      ["Protect", "Strengthen technology governance, security, resilience, compliance and responsible adoption.", "advisory"],
      ["Enable", "Build team capability through practical workshops, facilitated decisions and guided execution.", "enablement"]
    ],
    outputEyebrow: "The product portfolio",
    outputTitle: "A focused offer for each kind of progress.",
    outputCopy: "Each product has a clear purpose and next step. Explore the fit here, then follow through to the detailed ROALLA service page or start a conversation.",
    groups: {
      advisory: { label: "Advise", description: "Make better decisions about direction, technology and risk." },
      digital: { label: "Build", description: "Turn opportunities into useful, maintainable digital experiences." },
      enablement: { label: "Enable", description: "Help people adopt, improve and sustain the change." }
    },
    products: [
      { group: "advisory", title: "Business advisory", description: "Align strategy, operations, leadership and data around the outcomes that matter.", fit: "When growth or execution needs a clearer operating path.", href: "/en/services/business-advisory", focus: "business-advisory" },
      { group: "advisory", title: "Technology advisory", description: "Make technology choices with stronger governance, economics and implementation confidence.", fit: "When platforms, vendors or roadmaps need an independent view.", href: "/en/services/technology-advisory", focus: "technology-advisory" },
      { group: "advisory", title: "Security, risk & compliance", description: "Improve practical safeguards, readiness and accountability without losing business context.", fit: "When risk expectations are rising faster than internal capacity.", href: "/en/services/security-risk-compliance", focus: "security-risk-compliance" },
      { group: "digital", title: "Website design", description: "Create a credible, accessible website built to communicate clearly and convert qualified interest.", fit: "When the current website no longer reflects the business or supports growth.", href: "/en/services/digital#website-design", focus: "website-design" },
      { group: "digital", title: "Search & AI visibility", description: "Improve the signals that help customers, search engines and AI assistants understand the business.", fit: "When discoverability, trust or conversion needs evidence-led improvement.", href: "/en/services/search-ai-visibility", focus: "search-ai-visibility", featured: true },
      { group: "digital", title: "Digital products", description: "Validate and build portals, applications and tools around a useful end-to-end customer journey.", fit: "When an idea needs to become a maintainable production product.", href: "/en/services/digital-products", focus: "digital-products" },
      { group: "digital", title: "Automation & integration", description: "Connect systems, reduce repetitive work and design ownership for the exceptions.", fit: "When handoffs and duplicate effort are slowing the organization down.", href: "/en/services/automation", focus: "automation" },
      { group: "digital", title: "AI agents", description: "Apply goal-directed AI to bounded workflows with useful controls, escalation and human oversight.", fit: "When AI needs to perform real work rather than remain a demonstration.", href: "/en/services/ai-agents", focus: "ai-agents" },
      { group: "digital", title: "Digital events", description: "Create event pages, QR journeys, booth experiences and opening-day-ready digital tools.", fit: "When an event needs a connected digital experience before, during and after.", href: "/en/services/digital-events", focus: "digital-events" },
      { group: "enablement", title: "Managed optimization", description: "Keep digital assets healthy, measurable and improving after launch.", fit: "When ongoing performance needs an accountable operating rhythm.", href: "/en/services/managed-optimization", focus: "managed-optimization" },
      { group: "enablement", title: "Team workshops", description: "Turn a shared challenge into a facilitated decision, practiced capability and owned next steps.", fit: "When a team needs alignment and movement—not another meeting.", href: "/en/programs/workshops", focus: "workshops" }
    ],
    processEyebrow: "Find your fit",
    processTitle: "From business pressure to a useful first step.",
    process: [
      ["Name what must change", "Start with the outcome, friction or risk you recognize—not a predetermined solution."],
      ["Compare the focused products", "Use the fit statements to narrow the portfolio and explore the detailed evidence on ROALLA.com."],
      ["Choose a low-risk next move", "Talk with Steven about scope, readiness and the smallest engagement that can produce a useful decision." ]
    ],
    ctaTitle: "Not sure which product fits? Start with the business outcome.",
    contactTitle: "Talk with Steven Robin",
    contactRole: "Founder & Principal Consultant",
    contactPlace: "Burlington, Ontario, Canada",
    contactEmail: "Email sales@roalla.com",
    contactPhone: "Call +1 289 838 5868",
    fitLabel: "Best when",
    exploreLabel: "Explore product",
    discussLabel: "Discuss this product",
    featuredLabel: "Focused entry offer",
    footerAbout: "ROALLA Insights is the focused product discovery site of ROALLA Business Enablement Group, a Canadian business enablement and digital advisory firm.",
    footerExplore: "Explore",
    footerContact: "Contact"
  },
  fr: {
    label: "Français",
    alternate: "EN",
    alternateHref: "/en/",
    skip: "Passer au contenu principal",
    operated: "Exploité par ROALLA Business Enablement Group",
    navReview: "Produits",
    navProcess: "Trouver la bonne option",
    navCompany: "Visiter ROALLA.com",
    privacy: "Confidentialité",
    preferences: "Préférences de communication",
    unsubscribe: "Se désabonner",
    rights: "ROALLA Business Enablement Group. Tous droits réservés.",
    homeTitle: "Produits d'affaires, technologiques et numériques | ROALLA Insights",
    homeDescription: "Explorez les produits ciblés de ROALLA en stratégie, opérations, technologie, sécurité, sites Web, IA, automatisation, expériences numériques et capacités d'équipe.",
    heroEyebrow: "Des produits ciblés. Des prochaines étapes pratiques.",
    heroTitle: "Faites avancer la bonne partie de votre entreprise.",
    heroCopy: "Explorez des produits de conseil, numériques et d'habilitation conçus pour transformer un besoin d'affaires clair en preuves, décisions et actions responsables.",
    primaryCta: "Trouver le bon produit",
    secondaryCta: "Explorer tous les produits",
    signalBig: "11 produits",
    signalSmall: "Un point de départ clair pour ce qui doit changer",
    introEyebrow: "Commencer par le résultat",
    introTitle: "Vous n'avez pas à diagnostiquer la solution d'abord.",
    introCopy: "Choisissez la pression que vous reconnaissez. ROALLA vous aide à la relier à un produit ciblé, à une première étape raisonnable et aux preuves nécessaires pour décider de la suite.",
    pillars: [
      ["Décider", "Clarifier les priorités, les risques, les investissements et les décisions d'exploitation importantes.", "advisory"],
      ["Construire", "Créer ou améliorer des sites, produits, intégrations, automatisations et expériences propulsées par l'IA.", "digital"],
      ["Protéger", "Renforcer la gouvernance technologique, la sécurité, la résilience, la conformité et l'adoption responsable.", "advisory"],
      ["Habiliter", "Développer les capacités de l'équipe grâce à des ateliers pratiques, des décisions facilitées et une exécution guidée.", "enablement"]
    ],
    outputEyebrow: "Le portefeuille de produits",
    outputTitle: "Une offre ciblée pour chaque type de progrès.",
    outputCopy: "Chaque produit a un objectif et une prochaine étape clairs. Évaluez la correspondance ici, puis consultez la page détaillée de ROALLA ou amorcez une conversation.",
    groups: {
      advisory: { label: "Conseiller", description: "Prendre de meilleures décisions sur l'orientation, la technologie et le risque." },
      digital: { label: "Construire", description: "Transformer les possibilités en expériences numériques utiles et durables." },
      enablement: { label: "Habiliter", description: "Aider les personnes à adopter, améliorer et soutenir le changement." }
    },
    products: [
      { group: "advisory", title: "Conseil d'affaires", description: "Aligner stratégie, opérations, leadership et données sur les résultats importants.", fit: "Lorsque la croissance ou l'exécution exige une voie plus claire.", href: "/fr/services/business-advisory", focus: "business-advisory" },
      { group: "advisory", title: "Conseil technologique", description: "Faire des choix technologiques avec plus de gouvernance, de rigueur économique et de confiance.", fit: "Lorsque plateformes, fournisseurs ou feuilles de route exigent un regard indépendant.", href: "/fr/services/technology-advisory", focus: "technology-advisory" },
      { group: "advisory", title: "Sécurité, risques et conformité", description: "Améliorer les protections, la préparation et la responsabilisation sans perdre le contexte d'affaires.", fit: "Lorsque les attentes de risque dépassent la capacité interne.", href: "/fr/services/security-risk-compliance", focus: "security-risk-compliance" },
      { group: "digital", title: "Conception de sites Web", description: "Créer un site crédible et accessible qui communique clairement et convertit l'intérêt qualifié.", fit: "Lorsque le site ne reflète plus l'entreprise ou ne soutient plus la croissance.", href: "/fr/services/digital#website-design", focus: "website-design" },
      { group: "digital", title: "Visibilité dans la recherche et l'IA", description: "Améliorer les signaux qui aident clients, moteurs et assistants IA à comprendre l'entreprise.", fit: "Lorsque découvrabilité, confiance ou conversion exigent une amélioration fondée sur les preuves.", href: "/fr/services/search-ai-visibility", focus: "search-ai-visibility", featured: true },
      { group: "digital", title: "Produits numériques", description: "Valider et construire portails, applications et outils autour d'un parcours client utile.", fit: "Lorsqu'une idée doit devenir un produit de production durable.", href: "/fr/services/digital-products", focus: "digital-products" },
      { group: "digital", title: "Automatisation et intégration", description: "Relier les systèmes, réduire le travail répétitif et concevoir la responsabilité des exceptions.", fit: "Lorsque les transferts et le double travail ralentissent l'organisation.", href: "/fr/services/automation", focus: "automation" },
      { group: "digital", title: "Agents d'IA", description: "Appliquer l'IA orientée objectifs à des flux délimités avec contrôles, escalade et supervision humaine.", fit: "Lorsque l'IA doit accomplir un vrai travail plutôt que rester une démonstration.", href: "/fr/services/ai-agents", focus: "ai-agents" },
      { group: "digital", title: "Événements numériques", description: "Créer pages d'événements, parcours QR, expériences de kiosque et outils prêts pour l'ouverture.", fit: "Lorsqu'un événement exige une expérience numérique connectée avant, pendant et après.", href: "/fr/services/digital-events", focus: "digital-events" },
      { group: "enablement", title: "Optimisation gérée", description: "Garder les actifs numériques sains, mesurables et en amélioration après le lancement.", fit: "Lorsque la performance continue exige un rythme d'exploitation responsable.", href: "/fr/services/managed-optimization", focus: "managed-optimization" },
      { group: "enablement", title: "Ateliers d'équipe", description: "Transformer un défi commun en décision facilitée, capacité pratiquée et prochaines étapes attribuées.", fit: "Lorsqu'une équipe a besoin d'alignement et de mouvement, pas d'une autre réunion.", href: "/fr/programs/workshops", focus: "workshops" }
    ],
    processEyebrow: "Trouver la bonne option",
    processTitle: "De la pression d'affaires à une première étape utile.",
    process: [
      ["Nommer ce qui doit changer", "Commencez par le résultat, la friction ou le risque reconnu, pas par une solution prédéterminée."],
      ["Comparer les produits ciblés", "Utilisez les critères de correspondance et les preuves détaillées sur ROALLA.com pour réduire les options."],
      ["Choisir une prochaine étape à faible risque", "Discutez avec Steven de la portée, de la préparation et du plus petit mandat qui permettra une décision utile."]
    ],
    ctaTitle: "Vous ne savez pas quel produit convient? Commencez par le résultat d'affaires.",
    contactTitle: "Parler avec Steven Robin",
    contactRole: "Fondateur et conseiller principal",
    contactPlace: "Burlington (Ontario), Canada",
    contactEmail: "Écrire à sales@roalla.com",
    contactPhone: "Appeler le +1 289 838 5868",
    fitLabel: "Idéal lorsque",
    exploreLabel: "Explorer le produit",
    discussLabel: "Discuter de ce produit",
    featuredLabel: "Offre de départ ciblée",
    footerAbout: "ROALLA Insights est le site de découverte de produits de ROALLA Business Enablement Group, une firme canadienne de conseil en accompagnement d'entreprise et en numérique.",
    footerExplore: "Explorer",
    footerContact: "Contact"
  }
};

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
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
        <a href="${p.home}#products">${t.navReview}</a>
        <a href="${p.home}#fit">${t.navProcess}</a>
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
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="theme-color" content="#06151d">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="${lang}" href="${canonical}">
  <link rel="alternate" hreflang="${lang === "fr" ? "en" : "fr"}" href="${alternate}">
  <link rel="alternate" hreflang="x-default" href="${siteUrl}/en/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ROALLA Insights">
  <meta property="og:locale" content="${lang === "fr" ? "fr_CA" : "en_CA"}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
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
    makesOffer: languages[lang].products.map((product) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: product.title, description: product.description }
    }))
  };
}

function home(lang) {
  const t = languages[lang];
  const p = paths(lang);
  const productGroups = Object.entries(t.groups).map(([key, group]) => {
    const products = t.products.filter((product) => product.group === key);
    return `<section class="product-group" aria-labelledby="group-${key}">
      <div class="group-heading"><div><p class="group-kicker">${escapeHtml(group.label)}</p><h3 id="group-${key}">${escapeHtml(group.description)}</h3></div><span>${String(products.length).padStart(2, "0")}</span></div>
      <div class="product-grid">${products.map((product) => `<article class="product-card${product.featured ? " is-featured" : ""}">
        ${product.featured ? `<p class="product-badge">${escapeHtml(t.featuredLabel)}</p>` : ""}
        <h4>${escapeHtml(product.title)}</h4><p class="product-description">${escapeHtml(product.description)}</p>
        <p class="product-fit"><strong>${escapeHtml(t.fitLabel)}</strong>${escapeHtml(product.fit)}</p>
        <div class="product-actions"><a href="https://www.roalla.com${product.href}" data-attribution>${escapeHtml(t.exploreLabel)}<span aria-hidden="true">↗</span></a><a href="${p.contact}?intent=product-discovery&amp;focus=${product.focus}" data-attribution>${escapeHtml(t.discussLabel)}<span aria-hidden="true">→</span></a></div>
      </article>`).join("")}</div>
    </section>`;
  }).join("");
  const content = `<main id="main">
    <section class="hero"><div class="hero-grid wrap"><div><p class="eyebrow">${t.heroEyebrow}</p><h1>${t.heroTitle}</h1><p class="hero-copy">${t.heroCopy}</p><div class="actions"><a class="button" href="#fit">${t.primaryCta}</a><a class="button secondary" href="#products">${t.secondaryCta}</a></div></div><div class="signal" aria-hidden="true"><div class="signal-orbit orbit-one"></div><div class="signal-orbit orbit-two"></div><div class="signal-card"><strong>${t.signalBig}</strong><span>${t.signalSmall}</span></div></div></div></section>
    <section class="section" id="fit"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${t.introEyebrow}</p><h2>${t.introTitle}</h2></div><p class="lead">${t.introCopy}</p></div><div class="grid-4">${t.pillars.map((item, i) => `<a class="pillar" href="#group-${item[2]}"><span class="number">0${i + 1}</span><h3>${item[0]}</h3><p>${item[1]}</p><span class="pillar-arrow" aria-hidden="true">↓</span></a>`).join("")}</div></div></section>
    <section class="section dark product-section" id="products"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${t.outputEyebrow}</p><h2>${t.outputTitle}</h2></div><p class="lead">${t.outputCopy}</p></div>${productGroups}</div></section>
    <section class="section" id="process"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${t.processEyebrow}</p><h2>${t.processTitle}</h2></div></div><div class="process">${t.process.map((item) => `<article class="step"><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join("")}</div></div></section>
    <section class="section cta-section"><div class="wrap"><div class="cta-band"><h2>${t.ctaTitle}</h2><div class="contact-card"><h3>${t.contactTitle}</h3><p>Steven Robin<br>${t.contactRole}<br>${t.contactPlace}</p><div class="footer-links"><a href="mailto:sales@roalla.com?subject=${encodeURIComponent(t.heroEyebrow)}">${t.contactEmail}</a><a href="tel:+12898385868">${t.contactPhone}</a><a class="button gold" href="${p.contact}?intent=product-discovery" data-attribution>${t.primaryCta}</a></div></div></div></div></section>
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
        ["When you contact us", "If you email, call or follow a link to submit an inquiry on www.roalla.com, ROALLA uses the information you provide to respond, discuss the product or business need you selected and maintain appropriate business records. The privacy notice on www.roalla.com applies to information submitted there."],
        ["Communication choices", "Marketing communication is optional. You may update your preferences or unsubscribe at any time using the links on this site or in a ROALLA message. Service or relationship messages about an inquiry or active engagement may still be sent where permitted by law."],
        ["Your choices and contact", "You may clear campaign attribution by removing this site's local browser data. For access, correction, deletion, consent withdrawal or privacy questions, contact sales@roalla.com or +1 289 838 5868. We may need to verify identity before completing a request."],
        ["Other websites", "Links to www.roalla.com, LinkedIn and other services lead to separate websites with their own privacy practices. Review the notice at the destination before providing personal information."]
      ],
      updated: "Last updated: November 11, 2026"
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
        ["Lorsque vous nous contactez", "Si vous écrivez, appelez ou suivez un lien pour soumettre une demande sur www.roalla.com, ROALLA utilise les renseignements fournis pour répondre, discuter du produit ou du besoin d'affaires choisi et conserver les dossiers d'affaires appropriés. L'avis de confidentialité de www.roalla.com s'applique aux renseignements qui y sont soumis."],
        ["Choix de communication", "Les communications marketing sont facultatives. Vous pouvez modifier vos préférences ou vous désabonner en tout temps au moyen des liens sur ce site ou dans un message ROALLA. Les messages de service ou de relation liés à une demande ou à un mandat actif peuvent tout de même être envoyés lorsque la loi le permet."],
        ["Vos choix et nos coordonnées", "Vous pouvez effacer l'attribution de campagne en supprimant les données locales de ce site dans votre navigateur. Pour une demande d'accès, de correction, de suppression ou de retrait du consentement, ou pour toute question, écrivez à sales@roalla.com ou composez le +1 289 838 5868. Nous pourrions devoir vérifier votre identité."],
        ["Autres sites", "Les liens vers www.roalla.com, LinkedIn et d'autres services mènent à des sites distincts ayant leurs propres pratiques. Consultez l'avis du site de destination avant de fournir des renseignements personnels."]
      ],
      updated: "Dernière mise à jour : 11 novembre 2026"
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
