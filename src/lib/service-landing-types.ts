export type ServiceLandingCopy = {
  title: string;
  eyebrow: string;
  description: string;
  outcome: string;
  capabilities: readonly (readonly [string, string])[];
  process: readonly (readonly [string, string])[];
  deliverablesTitle: string;
  deliverables: readonly string[];
  starter: {
    eyebrow: string;
    name: string;
    description: string;
    timeline: string;
    investment: string;
    includes: readonly string[];
    fit: string;
    exclusion: string;
    cta: string;
  };
  packagesTitle: string;
  packages: readonly {
    name: string;
    description: string;
    cadence: string;
  }[];
  proof: {
    eyebrow: string;
    title: string;
    description: string;
    label: string;
    href: string;
    typeLabel: string;
  };
  measuresTitle: string;
  measures: readonly string[];
  faqTitle: string;
  faqs: readonly (readonly [string, string])[];
  finalTitle: string;
  finalBody: string;
  cta: string;
  metadataTitle: string;
  metadataDescription: string;
};
