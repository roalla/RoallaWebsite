export type GrowthVisibilitySituationId = 'findability' | 'conversion' | 'ai-clarity'

export type GrowthVisibilityCopy = {
  resultEyebrow: string
  resultTitle: string
  resultBody: string
  situationPrompt: string
  situations: readonly {
    id: GrowthVisibilitySituationId
    label: string
    hint: string
  }[]
  domainLabel: string
  domainPlaceholder: string
  domainCta: string
  domainNote: string
  ladderEyebrow: string
  ladderTitle: string
  ladderSteps: readonly { title: string; body: string }[]
  vignetteEyebrow: string
  vignetteLabel: string
  vignetteHeadline: string
  vignetteBody: string
  vignetteSteps: readonly string[]
  contactCta: string
  qualifierEyebrow: string
  qualifierTitle: string
  qualifierBody: string
  channelLabel: string
  channels: readonly { id: string; label: string }[]
  priorityLabel: string
  priorities: readonly { id: string; label: string }[]
  qualifierCta: string
  qualifierNote: string
  pathwayLinkLabel: string
  highlightLabel: string
}

export const growthVisibilityCopy: Record<'en' | 'fr', GrowthVisibilityCopy> = {
  en: {
    resultEyebrow: 'What better looks like',
    resultTitle: 'Qualified buyers find you—and understand why to act.',
    resultBody:
      'A clearer public presence: search and AI can describe the business accurately, the landing page earns trust, and the next step is obvious. Start with evidence on your live site, then decide the improvement path.',
    situationPrompt: 'Which outcome pressure is closest?',
    situations: [
      {
        id: 'findability',
        label: 'Buyers can’t find us',
        hint: 'Discovery and search visibility are the bottleneck.',
      },
      {
        id: 'conversion',
        label: 'Traffic doesn’t convert',
        hint: 'People arrive, but the path to action is unclear.',
      },
      {
        id: 'ai-clarity',
        label: 'Search or AI misunderstands us',
        hint: 'The business is hard to describe from the public page.',
      },
    ],
    domainLabel: 'Your website address',
    domainPlaceholder: 'yourbusiness.ca',
    domainCta: 'Check my website',
    domainNote: 'Free Digital Presence Snapshot. No email required. Public landing page only.',
    ladderEyebrow: 'How commitment grows',
    ladderTitle: 'Evidence first. Interpretation second. Improvement third.',
    ladderSteps: [
      {
        title: 'See',
        body: 'Run the free snapshot on your public landing page—performance, readability, social setup, and priority actions.',
      },
      {
        title: 'Interpret',
        body: 'Optional personal review of what matters most for your buyers and where to act first.',
      },
      {
        title: 'Improve',
        body: 'Digital Visibility Optimization: prioritized changes tied to discovery, trust, and conversion outcomes.',
      },
    ],
    vignetteEyebrow: 'Illustrative path',
    vignetteLabel: 'Anonymized example',
    vignetteHeadline: 'The page looked fine. The snapshot showed why buyers still hesitated.',
    vignetteBody:
      'A mid-market service firm had traffic but weak inquiries. The snapshot separated lab performance, search readability, and conversion friction—then ROALLA sequenced fixes against the outcome: more qualified conversations.',
    vignetteSteps: [
      'Snapshot surfaced weak mobile usability and unclear offer hierarchy.',
      'Search/AI readability gaps made the business hard to summarize accurately.',
      'A short review turned findings into a sequenced improvement plan—not a rebuild.',
    ],
    contactCta: 'Talk through this outcome',
    qualifierEyebrow: 'Prefer a human reply first?',
    qualifierTitle: 'Two quick answers. Fit reply in one business day.',
    qualifierBody: 'If you are not ready to run the tool, tell us the channel and the priority. We’ll reply with a practical next step.',
    channelLabel: 'Main channel',
    channels: [
      { id: 'website', label: 'Website' },
      { id: 'local', label: 'Local / maps' },
      { id: 'both', label: 'Both' },
    ],
    priorityLabel: 'Priority',
    priorities: [
      { id: 'findability', label: 'Findability' },
      { id: 'trust', label: 'Trust' },
      { id: 'conversion', label: 'Conversion' },
    ],
    qualifierCta: 'Get a fit reply',
    qualifierNote: '~3 min · No obligation · Reply in 1 business day',
    pathwayLinkLabel: 'Full visibility pathway details',
    highlightLabel: 'You chose findability—start with evidence',
  },
  fr: {
    resultEyebrow: 'À quoi ressemble une meilleure situation',
    resultTitle: 'Les bons acheteurs vous trouvent—et comprennent pourquoi agir.',
    resultBody:
      'Une présence publique plus claire : la recherche et l’IA décrivent l’entreprise avec justesse, la page d’arrivée inspire confiance, et la prochaine étape est évidente. Commencez par des preuves sur votre site en ligne, puis choisissez le parcours d’amélioration.',
    situationPrompt: 'Quelle pression de résultat est la plus proche?',
    situations: [
      {
        id: 'findability',
        label: 'Les acheteurs ne nous trouvent pas',
        hint: 'La découverte et la visibilité dans la recherche sont le frein.',
      },
      {
        id: 'conversion',
        label: 'Le trafic ne convertit pas',
        hint: 'Les gens arrivent, mais le chemin vers l’action est flou.',
      },
      {
        id: 'ai-clarity',
        label: 'La recherche ou l’IA nous mal comprend',
        hint: 'L’entreprise est difficile à décrire à partir de la page publique.',
      },
    ],
    domainLabel: 'Adresse de votre site Web',
    domainPlaceholder: 'votreentreprise.ca',
    domainCta: 'Vérifier mon site',
    domainNote: 'Aperçu gratuit de présence numérique. Aucun courriel requis. Page d’arrivée publique seulement.',
    ladderEyebrow: 'Comment l’engagement progresse',
    ladderTitle: 'Les preuves d’abord. L’interprétation ensuite. L’amélioration en troisième.',
    ladderSteps: [
      {
        title: 'Voir',
        body: 'Lancez l’aperçu gratuit sur votre page d’arrivée—performance, lisibilité, partage social et actions prioritaires.',
      },
      {
        title: 'Interpréter',
        body: 'Revue personnelle optionnelle de ce qui compte pour vos acheteurs et par où commencer.',
      },
      {
        title: 'Améliorer',
        body: 'Optimisation de la visibilité numérique : changements priorisés liés à la découverte, à la confiance et à la conversion.',
      },
    ],
    vignetteEyebrow: 'Parcours illustratif',
    vignetteLabel: 'Exemple anonymisé',
    vignetteHeadline: 'La page semblait correcte. L’aperçu a montré pourquoi les acheteurs hésitaient encore.',
    vignetteBody:
      'Une entreprise de services du marché intermédiaire avait du trafic mais peu de demandes. L’aperçu a séparé performance de laboratoire, lisibilité pour la recherche et friction de conversion—puis ROALLA a séquencé les correctifs selon le résultat : plus de conversations qualifiées.',
    vignetteSteps: [
      'L’aperçu a révélé une faible convivialité mobile et une hiérarchie d’offre peu claire.',
      'Des lacunes de lisibilité recherche/IA rendaient l’entreprise difficile à résumer correctement.',
      'Une courte revue a transformé les constats en plan d’amélioration séquencé—pas une refonte.',
    ],
    contactCta: 'Discuter de ce résultat',
    qualifierEyebrow: 'Vous préférez d’abord une réponse humaine?',
    qualifierTitle: 'Deux réponses rapides. Réponse d’adéquation en un jour ouvrable.',
    qualifierBody:
      'Si vous n’êtes pas prêt à lancer l’outil, indiquez le canal et la priorité. Nous répondrons avec une prochaine étape pratique.',
    channelLabel: 'Canal principal',
    channels: [
      { id: 'website', label: 'Site Web' },
      { id: 'local', label: 'Local / cartes' },
      { id: 'both', label: 'Les deux' },
    ],
    priorityLabel: 'Priorité',
    priorities: [
      { id: 'findability', label: 'Visibilité' },
      { id: 'trust', label: 'Confiance' },
      { id: 'conversion', label: 'Conversion' },
    ],
    qualifierCta: 'Obtenir une réponse d’adéquation',
    qualifierNote: '~3 min · Sans obligation · Réponse en 1 jour ouvrable',
    pathwayLinkLabel: 'Détails complets du parcours visibilité',
    highlightLabel: 'Vous avez choisi la visibilité—commencez par des preuves',
  },
}
