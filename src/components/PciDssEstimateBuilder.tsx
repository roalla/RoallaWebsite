'use client'

import { useMemo, useState } from 'react'
import { CheckCircle, CreditCard, Info, ShieldCheck, Sparkles } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import EstimateCommercialNotes from '@/components/estimates/EstimateCommercialNotes'
import EstimateConsiderations from '@/components/estimates/EstimateConsiderations'
import EstimateFormBody from '@/components/estimates/EstimateFormBody'
import EstimateMarketContextFields from '@/components/estimates/EstimateMarketContextFields'
import EstimateShell from '@/components/estimates/EstimateShell'
import { EstimateModeToggle } from '@/components/estimates/EstimateWizard'
import { useEstimateMarketRegion } from '@/hooks/useEstimateMarketRegion'
import { useEstimateWizardMode } from '@/hooks/useEstimateWizardMode'
import { ESTIMATE_PRICING_VERSION } from '@/lib/estimate-commercial'
import {
  calculatePciDssEstimate,
  type PciCardDataHandling,
  type PciEntityType,
  type PciEnvironmentSize,
  type PciEvidenceReadiness,
  type PciIntegration,
  type PciPaymentChannel,
  type PciSupportLevel,
} from '@/lib/pci-dss-estimate'

function formatCad(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-CA' : 'en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(amount).replace(/[\u00a0\u202f\u2009]/g, ' ')
}

const copy = {
  en: {
    eyebrow: 'PCI DSS readiness estimator',
    title: 'Build a practical PCI DSS readiness estimate.',
    intro: 'Answer a few questions about how you accept card payments. You will get a preliminary price band for mapping scope, provider responsibilities, evidence, and priority readiness gaps.',
    jump: 'View estimate',
    chips: ['Payment-flow map', 'Responsibility register', 'Prioritized action plan'],
    organization: 'Your PCI role and environment',
    organizationLead: 'Choose the closest answer. Uncertainty is expected and can be resolved during scoping.',
    entity: 'Which role best describes you?',
    merchant: 'Merchant', merchantHelp: 'We accept card payments for our own products or services.',
    provider: 'Service provider', providerHelp: 'We store, process, transmit, secure, or manage payment-related services for other organizations.',
    unsure: 'Not sure', unsureHelp: 'We need help confirming whether service-provider obligations apply.',
    environment: 'How many sites, environments, or operating locations are in scope?',
    single: 'One', singleHelp: 'One business, site or payment environment.',
    multiple: 'Multiple', multipleHelp: 'Several sites, environments, brands or locations.',
    channels: 'Payment channels',
    channelsLead: 'Select every way your organization accepts card payments.',
    ecommerce: 'E-commerce checkout', moto: 'Phone or mail order', terminal: 'In-person terminals', paymentLink: 'Payment links or invoices',
    integration: 'Online payment integration',
    integrationLead: 'Choose the closest description of how an online payment starts.',
    hosted: 'Hosted redirect', hostedHelp: 'The customer leaves our site for a provider-hosted payment page.',
    embedded: 'Embedded payment form', embeddedHelp: 'The payment form appears inside our page or app.',
    script: 'Provider script or widget', scriptHelp: 'A provider script, iframe, button, or widget runs on our page.',
    custom: 'Custom or API integration', customHelp: 'Our application or server participates directly in payment processing.',
    unknown: 'Not sure', unknownHelp: 'We need the integration and page elements reviewed.',
    data: 'Card data handling',
    dataLead: 'Does your organization store, process, transmit, record, or receive card numbers?',
    no: 'No', noHelp: 'Our payment provider handles card data.',
    uncertain: 'Uncertain', uncertainHelp: 'We need to verify logs, calls, forms, recordings, or system behavior.',
    yes: 'Yes', yesHelp: 'Card data enters or passes through systems we operate.',
    readiness: 'Evidence and support',
    evidence: 'How ready is your evidence?',
    organized: 'Organized', organizedHelp: 'Current agreements, attestations, diagrams, scans, policies, and owners are available.',
    partial: 'Partial', partialHelp: 'Some evidence exists, but it is spread across providers and teams.',
    limited: 'Limited', limitedHelp: 'We need to identify the evidence, owners, and requests from the beginning.',
    support: 'What support do you want?',
    readinessOnly: 'Readiness review', readinessOnlyHelp: 'Map scope, responsibilities, evidence, and priority gaps.',
    remediation: 'Review plus remediation plan', remediationHelp: 'Add a sequenced plan with owners and decision points.',
    implementation: 'Implementation support', implementationHelp: 'Help carrying out technical or process changes after the review.',
    summary: 'Your preliminary PCI DSS estimate',
    focused: 'Focused merchant review', multi: 'Multi-channel readiness review', customTier: 'Custom scope required',
    subtotal: 'Professional services before tax', total: 'Estimated total', from: 'From', range: 'Estimated range',
    taxPrompt: 'Select a province or state to estimate applicable tax.',
    included: 'Included in the readiness review',
    deliverables: ['Payment-flow and scope map', 'Provider responsibility and evidence register', 'Prioritized readiness action plan', 'Review call with next-step decisions'],
    excluded: 'Scoped separately when required',
    exclusions: ['QSA assessment, ROC, AOC, or certification', 'ASV scanning or penetration testing', 'Remediation and implementation unless selected'],
    cta: 'Request scope confirmation',
    regionRequired: 'Select your province or state to continue.',
    disclaimer: 'This estimate supports readiness planning only. ROALLA does not certify PCI DSS compliance, issue an AOC or ROC, perform a QSA assessment, or provide an ASV scan. Your acquirer or payment brand confirms the required validation path.',
    taxDisclaimer: 'Taxes are estimated from the selected region and confirmed in the written scope. Third-party assessor, scanner, platform, travel, and remediation costs are not included unless stated.',
    mobileLabel: 'PCI DSS estimate',
  },
  fr: {
    eyebrow: 'Estimateur de préparation PCI DSS',
    title: 'Préparez une estimation pratique de préparation PCI DSS.',
    intro: 'Répondez à quelques questions sur l’acceptation des cartes. Vous obtiendrez une fourchette préliminaire pour cartographier la portée, les responsabilités des fournisseurs, les preuves et les écarts prioritaires.',
    jump: 'Voir l’estimation',
    chips: ['Carte des flux de paiement', 'Registre des responsabilités', 'Plan d’action priorisé'],
    organization: 'Votre rôle PCI et votre environnement',
    organizationLead: 'Choisissez la réponse la plus proche. Les incertitudes seront clarifiées pendant le cadrage.',
    entity: 'Quel rôle vous décrit le mieux?',
    merchant: 'Commerçant', merchantHelp: 'Nous acceptons des cartes pour nos propres produits ou services.',
    provider: 'Fournisseur de services', providerHelp: 'Nous stockons, traitons, transmettons, sécurisons ou gérons des services de paiement pour d’autres organisations.',
    unsure: 'Pas sûr', unsureHelp: 'Nous devons confirmer si des obligations de fournisseur de services s’appliquent.',
    environment: 'Combien de sites, environnements ou lieux d’exploitation sont concernés?',
    single: 'Un', singleHelp: 'Une entreprise, un site ou un environnement de paiement.',
    multiple: 'Plusieurs', multipleHelp: 'Plusieurs sites, environnements, marques ou emplacements.',
    channels: 'Canaux de paiement',
    channelsLead: 'Sélectionnez toutes les façons dont votre organisation accepte les cartes.',
    ecommerce: 'Paiement en ligne', moto: 'Téléphone ou courrier', terminal: 'Terminaux en personne', paymentLink: 'Liens de paiement ou factures',
    integration: 'Intégration du paiement en ligne',
    integrationLead: 'Choisissez la description la plus proche du début d’un paiement en ligne.',
    hosted: 'Redirection hébergée', hostedHelp: 'Le client quitte notre site pour une page de paiement hébergée par le fournisseur.',
    embedded: 'Formulaire intégré', embeddedHelp: 'Le formulaire de paiement apparaît dans notre page ou application.',
    script: 'Script ou module du fournisseur', scriptHelp: 'Un script, iframe, bouton ou module du fournisseur s’exécute sur notre page.',
    custom: 'Intégration personnalisée ou API', customHelp: 'Notre application ou serveur participe directement au traitement.',
    unknown: 'Pas sûr', unknownHelp: 'L’intégration et les éléments de page doivent être examinés.',
    data: 'Traitement des données de carte',
    dataLead: 'Votre organisation stocke-t-elle, traite-t-elle, transmet-elle, enregistre-t-elle ou reçoit-elle des numéros de carte?',
    no: 'Non', noHelp: 'Notre fournisseur de paiement gère les données de carte.',
    uncertain: 'Incertain', uncertainHelp: 'Nous devons vérifier les journaux, appels, formulaires, enregistrements ou systèmes.',
    yes: 'Oui', yesHelp: 'Les données de carte entrent dans des systèmes que nous exploitons ou les traversent.',
    readiness: 'Preuves et soutien',
    evidence: 'Dans quel état sont vos preuves?',
    organized: 'Organisées', organizedHelp: 'Les ententes, attestations, diagrammes, analyses, politiques et responsables sont disponibles.',
    partial: 'Partielles', partialHelp: 'Certaines preuves existent, mais elles sont réparties entre fournisseurs et équipes.',
    limited: 'Limitées', limitedHelp: 'Les preuves, responsables et demandes doivent être identifiés dès le départ.',
    support: 'Quel soutien souhaitez-vous?',
    readinessOnly: 'Revue de préparation', readinessOnlyHelp: 'Cartographier la portée, les responsabilités, les preuves et les écarts.',
    remediation: 'Revue et plan de correction', remediationHelp: 'Ajouter un plan séquencé avec responsables et décisions.',
    implementation: 'Soutien à la mise en œuvre', implementationHelp: 'Aide pour réaliser les changements techniques ou de processus après la revue.',
    summary: 'Votre estimation préliminaire PCI DSS',
    focused: 'Revue ciblée pour commerçant', multi: 'Revue de préparation multicanal', customTier: 'Cadrage personnalisé requis',
    subtotal: 'Services professionnels avant taxes', total: 'Total estimé', from: 'À partir de', range: 'Fourchette estimée',
    taxPrompt: 'Choisissez votre province ou État pour estimer la taxe applicable.',
    included: 'Inclus dans la revue de préparation',
    deliverables: ['Carte des flux de paiement et de la portée', 'Registre des responsabilités et des preuves', 'Plan d’action de préparation priorisé', 'Appel de revue et décisions sur les prochaines étapes'],
    excluded: 'Cadré séparément au besoin',
    exclusions: ['Évaluation QSA, ROC, AOC ou certification', 'Analyse ASV ou test d’intrusion', 'Correction et mise en œuvre sauf si sélectionnées'],
    cta: 'Demander la confirmation de portée',
    regionRequired: 'Choisissez votre province ou État pour continuer.',
    disclaimer: 'Cette estimation sert uniquement à planifier la préparation. ROALLA ne certifie pas la conformité PCI DSS, n’émet pas d’AOC ou de ROC, ne réalise pas d’évaluation QSA et ne fournit pas d’analyse ASV. Votre acquéreur ou marque de paiement confirme la voie de validation requise.',
    taxDisclaimer: 'Les taxes sont estimées selon la région choisie et confirmées dans la portée écrite. Les coûts d’évaluateur, d’analyse, de plateforme, de déplacement et de correction ne sont pas inclus sauf indication.',
    mobileLabel: 'Estimation PCI DSS',
  },
} as const

type Option<T extends string> = { value: T; label: string; help: string }

function ChoiceGrid<T extends string>({ value, options, onChange }: { value: T; options: Option<T>[]; onChange: (value: T) => void }) {
  return <div className="mt-4 grid gap-3 sm:grid-cols-2">{options.map((option) => <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)} className={`rounded-2xl p-4 text-left transition ${value === option.value ? 'border-2 border-primary bg-primary/10 ring-2 ring-primary/10' : 'border-2 border-slate-200 bg-white hover:border-primary/50'}`}><span className="flex items-center gap-2 font-bold text-slate-950">{value === option.value ? <CheckCircle className="h-4 w-4 text-primary" aria-hidden /> : null}{option.label}</span><span className="mt-2 block text-sm leading-6 text-slate-600">{option.help}</span></button>)}</div>
}

function Section({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return <section><h2 className="font-serif text-xl font-bold text-slate-950">{title}</h2>{lead ? <p className="mt-2 text-sm leading-6 text-slate-600">{lead}</p> : null}{children}</section>
}

export default function PciDssEstimateBuilder() {
  const locale = useLocale()
  const french = locale === 'fr'
  const t = french ? copy.fr : copy.en
  const { mode, toggleMode } = useEstimateWizardMode('pci-dss')
  const { marketId, setMarketId, regionId, setRegionId, regionReady, considerations, contextSummary, attributionQuery } = useEstimateMarketRegion(locale, 'pci-dss')
  const [entityType, setEntityType] = useState<PciEntityType>('merchant')
  const [environmentSize, setEnvironmentSize] = useState<PciEnvironmentSize>('single')
  const [channels, setChannels] = useState<PciPaymentChannel[]>(['ecommerce'])
  const [integration, setIntegration] = useState<PciIntegration>('hosted-redirect')
  const [cardDataHandling, setCardDataHandling] = useState<PciCardDataHandling>('no')
  const [evidenceReadiness, setEvidenceReadiness] = useState<PciEvidenceReadiness>('partial')
  const [supportLevel, setSupportLevel] = useState<PciSupportLevel>('readiness')

  const estimate = useMemo(() => calculatePciDssEstimate({ entityType, environmentSize, channels, integration, cardDataHandling, evidenceReadiness, supportLevel, regionId }), [entityType, environmentSize, channels, integration, cardDataHandling, evidenceReadiness, supportLevel, regionId])
  const money = (amount: number) => formatCad(amount, locale)
  const range = estimate.totalLow === estimate.totalHigh ? money(estimate.totalLow) : `${money(estimate.totalLow)}–${money(estimate.totalHigh)}`
  const totalLabel = estimate.tier === 'custom' ? `${t.from} ${money(estimate.totalLow)}` : range
  const tierLabel = estimate.tier === 'focused' ? t.focused : estimate.tier === 'multi-channel' ? t.multi : t.customTier
  const channelLabels: Record<PciPaymentChannel, string> = { ecommerce: t.ecommerce, moto: t.moto, terminal: t.terminal, 'payment-link': t.paymentLink }
  const summary = `${tierLabel}; ${channels.map((channel) => channelLabels[channel]).join(', ')}; ${contextSummary}`
  const contactQuery = { intent: 'security', offer: 'PCI DSS Readiness Review', from_page: '/pci-dss-readiness-estimate', goal: `${t.summary}: ${totalLabel}. ${summary}`, estimate_total: totalLabel, estimate_summary: summary, estimate_tool: 'pci-dss', estimate_pricing_version: ESTIMATE_PRICING_VERSION, estimate_region: regionId, ...(marketId ? { estimate_market: marketId } : {}), ...attributionQuery }
  const toggleChannel = (channel: PciPaymentChannel) => setChannels((current) => current.includes(channel) ? (current.length === 1 ? current : current.filter((item) => item !== channel)) : [...current, channel])
  const cta = regionReady ? <Link href={{ pathname: '/contact', query: contactQuery }} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-center font-bold text-white transition hover:bg-primary-dark">{t.cta}</Link> : <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-950">{t.regionRequired}</p>
  const mobileCta = regionReady ? <Link href={{ pathname: '/contact', query: contactQuery }} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-primary-dark">{t.cta}</Link> : <span className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-slate-300 px-4 text-sm font-bold text-slate-600">{t.cta}</span>

  return <EstimateShell eyebrow={t.eyebrow} title={t.title} intro={t.intro} jumpToEstimate={t.jump} mobileSummaryLabel={t.mobileLabel} mobileTotalLabel={totalLabel} mobileCta={mobileCta} modeToggle={<EstimateModeToggle locale={french ? 'fr' : 'en'} mode={mode} onToggle={toggleMode} />} headerExtra={<div className="mt-6 flex flex-wrap gap-2">{t.chips.map((chip) => <span key={chip} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"><CheckCircle className="h-3.5 w-3.5 text-primary-light" aria-hidden />{chip}</span>)}</div>} form={<EstimateFormBody locale={locale} mode={mode} sections={[
    { id: 'market', title: french ? 'Marché et région' : 'Market and region', content: <EstimateMarketContextFields locale={locale} marketId={marketId} regionId={regionId} onMarketChange={setMarketId} onRegionChange={setRegionId} /> },
    { id: 'organization', title: t.organization, content: <div className="space-y-8"><Section title={t.organization} lead={t.organizationLead}><h3 className="mt-5 font-bold text-slate-900">{t.entity}</h3><ChoiceGrid value={entityType} onChange={setEntityType} options={[{ value: 'merchant', label: t.merchant, help: t.merchantHelp }, { value: 'service-provider', label: t.provider, help: t.providerHelp }, { value: 'unsure', label: t.unsure, help: t.unsureHelp }]} /><h3 className="mt-7 font-bold text-slate-900">{t.environment}</h3><ChoiceGrid value={environmentSize} onChange={setEnvironmentSize} options={[{ value: 'single', label: t.single, help: t.singleHelp }, { value: 'multiple', label: t.multiple, help: t.multipleHelp }]} /></Section></div> },
    { id: 'channels', title: t.channels, content: <Section title={t.channels} lead={t.channelsLead}><div className="mt-4 grid gap-3 sm:grid-cols-2">{([['ecommerce', t.ecommerce], ['moto', t.moto], ['terminal', t.terminal], ['payment-link', t.paymentLink]] as [PciPaymentChannel, string][]).map(([value, label]) => <button key={value} type="button" aria-pressed={channels.includes(value)} onClick={() => toggleChannel(value)} className={`flex min-h-14 items-center gap-3 rounded-2xl p-4 text-left font-bold transition ${channels.includes(value) ? 'border-2 border-primary bg-primary/10 ring-2 ring-primary/10 text-slate-950' : 'border-2 border-slate-200 bg-white text-slate-800 hover:border-primary/50'}`}><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${channels.includes(value) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}><CreditCard className="h-4 w-4" aria-hidden /></span>{label}</button>)}</div></Section> },
    { id: 'integration', title: t.integration, content: <Section title={t.integration} lead={t.integrationLead}><ChoiceGrid value={integration} onChange={setIntegration} options={[{ value: 'hosted-redirect', label: t.hosted, help: t.hostedHelp }, { value: 'embedded', label: t.embedded, help: t.embeddedHelp }, { value: 'provider-script', label: t.script, help: t.scriptHelp }, { value: 'custom', label: t.custom, help: t.customHelp }, { value: 'unknown', label: t.unknown, help: t.unknownHelp }]} /></Section> },
    { id: 'data', title: t.data, content: <Section title={t.data} lead={t.dataLead}><ChoiceGrid value={cardDataHandling} onChange={setCardDataHandling} options={[{ value: 'no', label: t.no, help: t.noHelp }, { value: 'uncertain', label: t.uncertain, help: t.uncertainHelp }, { value: 'yes', label: t.yes, help: t.yesHelp }]} /></Section> },
    { id: 'readiness', title: t.readiness, content: <div className="space-y-8"><Section title={t.evidence}><ChoiceGrid value={evidenceReadiness} onChange={setEvidenceReadiness} options={[{ value: 'organized', label: t.organized, help: t.organizedHelp }, { value: 'partial', label: t.partial, help: t.partialHelp }, { value: 'limited', label: t.limited, help: t.limitedHelp }]} /></Section><Section title={t.support}><ChoiceGrid value={supportLevel} onChange={setSupportLevel} options={[{ value: 'readiness', label: t.readinessOnly, help: t.readinessOnlyHelp }, { value: 'remediation-plan', label: t.remediation, help: t.remediationHelp }, { value: 'implementation-support', label: t.implementation, help: t.implementationHelp }]} /></Section></div> },
  ]} />} summary={<><div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" aria-hidden /><h2 className="text-xl font-serif font-bold text-slate-950">{t.summary}</h2></div><span className="mt-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-dark">{tierLabel}</span><div className="mt-6 space-y-3 border-t border-slate-300 pt-5"><div className="flex justify-between gap-4 text-sm"><span className="text-slate-700">{estimate.tier === 'multi-channel' ? t.range : t.subtotal}</span><span className="font-semibold tabular-nums text-slate-900">{estimate.subtotalLow === estimate.subtotalHigh ? money(estimate.subtotalLow) : `${money(estimate.subtotalLow)}–${money(estimate.subtotalHigh)}`}</span></div>{estimate.taxReady ? estimate.taxLinesLow.map((line, index) => <div key={line.id} className="flex justify-between gap-4 text-sm"><span className="text-slate-700">{french ? line.label.fr : line.label.en}</span><span className="font-semibold tabular-nums text-slate-900">{estimate.taxLinesLow[index].amount === estimate.taxLinesHigh[index].amount ? money(line.amount) : `${money(line.amount)}–${money(estimate.taxLinesHigh[index].amount)}`}</span></div>) : <p className="text-sm font-medium text-amber-900">{t.taxPrompt}</p>}<div className="flex items-end justify-between gap-4 border-t border-slate-300 pt-4"><span className="font-bold text-slate-950">{t.total}</span><span className="text-right text-2xl font-serif font-bold tabular-nums text-primary-dark">{totalLabel}</span></div></div><div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-emerald-900"><ShieldCheck className="h-4 w-4" aria-hidden />{t.included}</p><ul className="mt-3 space-y-2">{t.deliverables.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700"><CheckCircle className="mt-1 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />{item}</li>)}</ul></div><div className="mt-4 rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-700">{t.excluded}</p><ul className="mt-3 space-y-2">{t.exclusions.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600"><Info className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}</ul></div><EstimateConsiderations locale={locale} items={considerations} /><EstimateCommercialNotes locale={locale} disclaimer={t.disclaimer} taxDisclaimer={t.taxDisclaimer} />{cta}</>} />
}
