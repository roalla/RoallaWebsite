export type ServiceLandingCopy = {
  title: string;
  eyebrow: string;
  description: string;
  outcome: string;
  capabilities: readonly (readonly [string, string])[];
  process: readonly (readonly [string, string])[];
  cta: string;
  metadataTitle: string;
  metadataDescription: string;
};
