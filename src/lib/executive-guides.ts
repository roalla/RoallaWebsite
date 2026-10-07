export const EXECUTIVE_GUIDE_CATEGORIES = [
  "all",
  "ai",
  "growth",
  "technology",
  "risk",
  "operations",
  "value",
] as const;

export type ExecutiveGuideCategory = Exclude<(typeof EXECUTIVE_GUIDE_CATEGORIES)[number], "all">;

export type ExecutiveGuide = {
  slug: string;
  number: string;
  category: ExecutiveGuideCategory;
  image: string;
  featured?: boolean;
  en: { title: string; summary: string; categoryLabel: string };
  fr: { title: string; summary: string; categoryLabel: string };
};

export const EXECUTIVE_GUIDES: readonly ExecutiveGuide[] = [
  {
    slug: "ai-readiness-governance",
    number: "EI—01",
    category: "ai",
    image: "/images/executive-insights/ai-manufacturing.png",
    featured: true,
    en: { title: "AI Readiness & Governance", summary: "Evaluate whether strategy, data, architecture, operating controls and leadership alignment are ready to support responsible AI at scale.", categoryLabel: "AI & automation" },
    fr: { title: "Préparation et gouvernance de l’IA", summary: "Évaluez si la stratégie, les données, l’architecture, les contrôles et l’alignement de la direction peuvent soutenir une IA responsable à grande échelle.", categoryLabel: "IA et automatisation" },
  },
  {
    slug: "acquisition-readiness-value-creation",
    number: "EI—02",
    category: "value",
    image: "/images/executive-insights/acquisition-readiness.png",
    en: { title: "Acquisition Readiness & Value Creation", summary: "Prepare the business, technology and operating evidence that increases buyer confidence and protects enterprise value.", categoryLabel: "Enterprise value" },
    fr: { title: "Préparation à l’acquisition et création de valeur", summary: "Préparez les preuves commerciales, technologiques et opérationnelles qui renforcent la confiance d’un acheteur et protègent la valeur.", categoryLabel: "Valeur d’entreprise" },
  },
  {
    slug: "saas-soc-2-readiness",
    number: "EI—03",
    category: "risk",
    image: "/images/executive-insights/saas-soc2-readiness.png",
    en: { title: "SaaS SOC 2 Readiness & Business Value", summary: "Turn compliance preparation into stronger controls, enterprise credibility and sales enablement.", categoryLabel: "Risk & resilience" },
    fr: { title: "Préparation SOC 2 pour SaaS et valeur d’affaires", summary: "Transformez la préparation à la conformité en contrôles plus solides, en crédibilité d’entreprise et en soutien aux ventes.", categoryLabel: "Risque et résilience" },
  },
  {
    slug: "digital-experience-modernization",
    number: "EI—04",
    category: "technology",
    image: "/images/executive-insights/digital-experience.png",
    en: { title: "Digital Experience Modernization", summary: "Improve adoption, accessibility and discoverability across UI/UX, SEO, AEO and agentic experiences.", categoryLabel: "Technology" },
    fr: { title: "Modernisation de l’expérience numérique", summary: "Améliorez l’adoption, l’accessibilité et la découvrabilité à travers l’UX, le référencement et les expériences agentiques.", categoryLabel: "Technologie" },
  },
  {
    slug: "smart-manufacturing-warehouse-modernization",
    number: "EI—05",
    category: "operations",
    image: "/images/executive-insights/smart-manufacturing.png",
    en: { title: "Smart Manufacturing & Warehouse Modernization", summary: "Prioritize automation and connected operations without creating fragmented technology or stranded investment.", categoryLabel: "Operations" },
    fr: { title: "Modernisation de la fabrication et des entrepôts", summary: "Priorisez l’automatisation et les opérations connectées sans fragmenter la technologie ni immobiliser les investissements.", categoryLabel: "Opérations" },
  },
  {
    slug: "sales-organization-growth-evolution",
    number: "EI—06",
    category: "growth",
    image: "/images/executive-insights/sales-growth.png",
    en: { title: "Sales Organization Growth & Evolution", summary: "Align roles, coverage, process, leadership and measurement to support the next stage of growth.", categoryLabel: "Growth & revenue" },
    fr: { title: "Croissance et évolution de l’organisation des ventes", summary: "Alignez les rôles, la couverture, les processus, le leadership et la mesure pour soutenir la prochaine étape de croissance.", categoryLabel: "Croissance et revenus" },
  },
  {
    slug: "cybersecurity-digital-resilience",
    number: "EI—07",
    category: "risk",
    image: "/images/executive-insights/cybersecurity.png",
    en: { title: "Cybersecurity & Digital Resilience", summary: "Connect cyber investment to operational continuity, customer trust and enterprise risk.", categoryLabel: "Risk & resilience" },
    fr: { title: "Cybersécurité et résilience numérique", summary: "Reliez les investissements cybernétiques à la continuité, à la confiance des clients et au risque d’entreprise.", categoryLabel: "Risque et résilience" },
  },
  {
    slug: "voice-unified-communications-modernization",
    number: "EI—08",
    category: "technology",
    image: "/images/executive-insights/voice-modernization.png",
    en: { title: "Voice & Unified Communications Modernization", summary: "Move from legacy voice and fragmented licensing to a modern, integrated communications strategy.", categoryLabel: "Technology" },
    fr: { title: "Modernisation de la voix et des communications unifiées", summary: "Passez de la téléphonie existante et des licences fragmentées à une stratégie de communication moderne et intégrée.", categoryLabel: "Technologie" },
  },
  {
    slug: "ai-manufacturing-warehouse-operations",
    number: "EI—09",
    category: "ai",
    image: "/images/executive-insights/ai-manufacturing.png",
    en: { title: "AI for Manufacturing & Warehouse Operations", summary: "Identify practical AI applications across planning, quality, maintenance, labour and throughput.", categoryLabel: "AI & automation" },
    fr: { title: "IA pour la fabrication et les opérations d’entrepôt", summary: "Repérez des applications concrètes de l’IA pour la planification, la qualité, l’entretien, la main-d’œuvre et le débit.", categoryLabel: "IA et automatisation" },
  },
  {
    slug: "technology-due-diligence",
    number: "EI—10",
    category: "value",
    image: "/images/executive-insights/strategic-value.png",
    en: { title: "Technology Due Diligence", summary: "Evaluate architecture, technical debt, security, IP, scalability and team dependency before a transaction.", categoryLabel: "Enterprise value" },
    fr: { title: "Diligence raisonnable technologique", summary: "Évaluez l’architecture, la dette technique, la sécurité, la propriété intellectuelle, l’évolutivité et la dépendance à l’équipe avant une transaction.", categoryLabel: "Valeur d’entreprise" },
  },
  {
    slug: "canadian-innovation-funding-qualification",
    number: "EI—11",
    category: "value",
    image: "/images/executive-insights/funding.png",
    en: { title: "Canadian Innovation Funding Qualification", summary: "Align qualified projects, evidence and spending plans to the Canadian innovation support landscape.", categoryLabel: "Funding" },
    fr: { title: "Qualification au financement canadien de l’innovation", summary: "Alignez les projets, les preuves et les dépenses admissibles sur l’écosystème canadien de soutien à l’innovation.", categoryLabel: "Financement" },
  },
  {
    slug: "revenue-operations-forecast-confidence",
    number: "EI—12",
    category: "growth",
    image: "/images/executive-insights/revops.png",
    en: { title: "Revenue Operations & Forecast Confidence", summary: "Create shared commercial truth across marketing, sales, customer success, data and forecasting.", categoryLabel: "Growth & revenue" },
    fr: { title: "Opérations de revenus et fiabilité des prévisions", summary: "Créez une vérité commerciale commune entre le marketing, les ventes, la réussite client, les données et les prévisions.", categoryLabel: "Croissance et revenus" },
  },
  {
    slug: "supply-chain-visibility-resilience",
    number: "EI—13",
    category: "operations",
    image: "/images/executive-insights/supply-chain.png",
    en: { title: "Supply Chain Visibility & Resilience", summary: "Improve decision velocity by connecting operational signals, ownership and response across the network.", categoryLabel: "Operations" },
    fr: { title: "Visibilité et résilience de la chaîne d’approvisionnement", summary: "Accélérez les décisions en reliant les signaux opérationnels, la responsabilité et la réponse dans l’ensemble du réseau.", categoryLabel: "Opérations" },
  },
] as const;

export function findExecutiveGuide(slug: string) {
  return EXECUTIVE_GUIDES.find((guide) => guide.slug === slug);
}

