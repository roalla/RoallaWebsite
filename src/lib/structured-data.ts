import { CONTACT, OG_IMAGE, SITE_URL, SOCIAL_LINKS } from "@/lib/site";
import { pageUrl } from "@/lib/page-metadata";

export function breadcrumbJsonLd(
  locale: string,
  items: { name: string; path?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path != null ? { item: pageUrl(locale, item.path) } : {}),
    })),
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: "Roalla Business Enablement Group",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  image: `${SITE_URL}/og-image.jpg`,
  description:
    "ROALLA helps organizations assess, build, optimize, and evolve digital assets that drive visibility, revenue, operational efficiency, and customer value.",
  areaServed: "Global",
  foundingDate: "1994",
  knowsAbout: [
    "website development",
    "digital product development",
    "client portal development",
    "workflow automation",
    "system integration",
    "AI workflow support",
    "digital events",
    "business workshops",
    "bilingual websites",
    "e-commerce websites",
    "digital transformation",
    "business enablement",
    "digital visibility optimization",
    "technical SEO",
    "structured data",
    "accessibility optimization",
    "conversion optimization",
  ],
  sameAs: [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.youtube],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: CONTACT.phone,
    contactType: "sales",
    email: CONTACT.email,
    areaServed: "Global",
    availableLanguage: ["English", "French"],
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Burlington",
    addressRegion: "ON",
    addressCountry: "CA",
  },
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Roalla Business Enablement Group",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: ["en-CA", "fr-CA"],
};

export function homeServiceCatalogJsonLd(locale: string) {
  const french = locale === "fr";
  const services = french
    ? [
        [
          "Sites Web et présence numérique",
          "Des parcours numériques conçus pour attirer, informer et convertir.",
        ],
        [
          "Applications et produits numériques",
          "Des portails, plateformes et services numériques qui créent des revenus, de la valeur client ou une capacité opérationnelle.",
        ],
        [
          "Automatisation et intégration",
          "Des flux connectés qui réduisent le travail manuel et améliorent les opérations.",
        ],
        [
          "Optimisation de la visibilité numérique",
          "Des améliorations techniques, de contenu et de confiance qui soutiennent la découvrabilité.",
        ],
      ]
    : [
        [
          "Websites and Digital Presence",
          "Digital journeys designed to attract, educate, and convert.",
        ],
        [
          "Applications and Digital Products",
          "Portals, platforms, and digital services that create revenue, customer value, or operational capability.",
        ],
        [
          "Automation and Integration",
          "Connected workflows that reduce manual work and improve operations.",
        ],
        [
          "Digital Visibility Optimization",
          "Technical, content, and trust improvements that support discoverability.",
        ],
      ];

  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: french ? "Services numériques ROALLA" : "ROALLA digital services",
    url: pageUrl(locale, ""),
    itemListElement: services.map(([name, description]) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name,
        description,
        provider: { "@id": `${SITE_URL}/#organization` },
      },
    })),
  };
}

export function webPageJsonLd(
  locale: string,
  path: string,
  name: string,
  description: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: pageUrl(locale, path),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: locale === "fr" ? "fr-CA" : "en-CA",
  };
}

export function servicePageJsonLd({
  locale,
  path,
  name,
  description,
  serviceType,
  offers,
  faqs,
}: {
  locale: string;
  path: string;
  name: string;
  description: string;
  serviceType: string;
  offers: readonly { name: string; description: string }[];
  faqs: readonly { question: string; answer: string }[];
}) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name,
      serviceType,
      description,
      url: pageUrl(locale, path),
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: "Global",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name,
        itemListElement: offers.map((offer) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", ...offer },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ];
}

export function contactPageJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Roalla Business Enablement Group",
    url: pageUrl(locale, "/contact"),
    mainEntity: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

const SERVICE_INQUIRY_TYPES_EN = [
  "Website — new, redesign, conversion, booking, bilingual EN/FR, e-commerce, or ongoing support",
  "App or platform — internal tools, customer apps, client portals, marketplaces, IoT dashboards",
  "Integrations and automation — connect CRM, email, forms, and internal systems",
  "AI support — lead scoring, content workflows, custom models",
  "Digital events — booth kits, microsites, event apps, activations",
  "Programs and advisory — strategy, operations, team, data, innovation",
  "Workshops — branding, sales, productivity, ideation",
] as const;

const SERVICE_INQUIRY_TYPES_FR = [
  "Site Web — nouveau, refonte, conversion, réservation, bilingue EN/FR, commerce en ligne ou soutien continu",
  "Application ou plateforme — outils internes, apps client, portails, places de marché, tableaux de bord IoT",
  "Intégrations et automatisation — CRM, courriel, formulaires et systèmes internes",
  "Soutien IA — notation de leads, flux de contenu, modèles sur mesure",
  "Événements numériques — kits kiosque, microsites, apps événementielles, activations",
  "Programmes et conseil — stratégie, opérations, équipe, données, innovation",
  "Ateliers — image de marque, ventes, productivité, idéation",
] as const;

export function serviceInquiryPageJsonLd(
  locale: string,
  name: string,
  description: string,
) {
  const inquiryTypes =
    locale === "fr" ? SERVICE_INQUIRY_TYPES_FR : SERVICE_INQUIRY_TYPES_EN;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: pageUrl(locale, "/schedule"),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: locale === "fr" ? "fr-CA" : "en-CA",
    potentialAction: {
      "@type": "CommunicateAction",
      name:
        locale === "fr"
          ? "Soumettre une demande de service"
          : "Submit a service inquiry",
      target: pageUrl(locale, "/schedule"),
    },
    mainEntity: {
      "@type": "ItemList",
      name:
        locale === "fr"
          ? "Types de demande de service"
          : "Service inquiry types",
      itemListElement: inquiryTypes.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item,
      })),
    },
  };
}

export function aboutPageJsonLd(locale: string, description: string) {
  const french = locale === "fr";

  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: french
      ? "À propos de Roalla Business Enablement Group"
      : "About Roalla Business Enablement Group",
    description,
    url: pageUrl(locale, "/about"),
    mainEntity: { "@id": `${SITE_URL}/#organization` },
    about: [
      { "@id": `${SITE_URL}/#organization` },
      { "@id": `${SITE_URL}/#steven-robin` },
    ],
    inLanguage: french ? "fr-CA" : "en-CA",
  };
}

export function founderPersonJsonLd(locale: string, description: string) {
  const french = locale === "fr";

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#steven-robin`,
    name: "Steven Robin",
    jobTitle: french ? "Fondateur et conseiller principal" : "Founder & Principal Consultant",
    description,
    image: `${SITE_URL}/images/team/steven-robin.webp`,
    url: pageUrl(locale, "/about"),
    sameAs: ["https://www.linkedin.com/in/stevenrobin/"],
    worksFor: { "@id": `${SITE_URL}/#organization` },
    knowsLanguage: ["English", "French"],
    knowsAbout: [
      "business transformation",
      "digital strategy",
      "technology strategy",
      "product development",
      "operations",
      "service management",
      "customer experience",
      "solution architecture",
      "workflow automation",
    ],
    award: [
      "Bell Bravo Award",
      "Bell Business Markets President's Club",
      "Bell Unity Award",
      "Bell Excellence and Innovation Awards",
    ],
  };
}

export function articleJsonLd({
  locale,
  slug,
  title,
  description,
  datePublished,
  dateModified,
  image,
}: {
  locale: string;
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  const articleUrl = pageUrl(locale, `/insights/${slug}`);
  const imagePath = image ?? OG_IMAGE;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    image: imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath}`,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    inLanguage: locale === "fr" ? "fr-CA" : "en-CA",
  };
}

export function creativeWorkJsonLd({
  locale,
  slug,
  name,
  description,
  imageUrl,
  projectUrl,
}: {
  locale: string;
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  projectUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url: projectUrl,
    image: imageUrl ? `${SITE_URL}${imageUrl}` : undefined,
    creator: { "@id": `${SITE_URL}/#organization` },
    isPartOf: {
      "@type": "WebPage",
      url: pageUrl(locale, `/services/portfolio/${slug}`),
    },
  };
}
