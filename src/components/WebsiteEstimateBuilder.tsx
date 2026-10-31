'use client'

import React, { useMemo, useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp, Globe2, Info, Mail, PenLine, SearchCheck, Server, Share2, Sparkles, Table2, Tag } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  calculateWebsiteEstimate,
  DOMAIN_PRICES,
  WEBSITE_ESTIMATE_CORE_PRICE,
  WEBSITE_ESTIMATE_PRICES,
  type DomainSource,
  type DomainTerm,
  type EmailChoice,
  type HostingChoice,
  type SocialSetup,
} from '@/lib/website-estimate'

/** Keep server/client currency text identical (ICU may emit NBSP / narrow NBSP). */
function formatCad(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-CA' : 'en-CA', {
    style: 'currency',
    currency: 'CAD',
  })
    .format(amount)
    .replace(/[\u00a0\u202f\u2009]/g, ' ')
}

const copy = {
  en: {
    eyebrow: 'Website package estimator',
    title: 'Build a clear first-year website estimate.',
    intro:
      'Start with the required launch foundation and website address. Optional add-ons stay separate—choose email, social media profiles, or hosting only if you want them.',
    outcomeClarity: 'Explain your value clearly',
    outcomeDiscovery: 'Help customers find you',
    outcomeAction: 'Make the next step easy',
    referralNote: 'Have a referral code? Enter it at the bottom of this form to apply the community discount.',
    referralNoteLink: 'Go to referral code',
    requiredSection: 'Required',
    optionalSection: 'Optional add-ons',
    optionalSectionIntro: 'These are not required to request a scope confirmation.',
    nextStep: 'Next step',
    coreTitle: 'Core Website Launch',
    required: 'Required',
    included: 'Included',
    whatItIs: 'What it is',
    whyItMatters: 'Why it matters',
    website: 'Website creation',
    websiteWhat: 'Design and development of a professional, mobile-friendly website.',
    websiteWhy: 'Creates a credible home for the business and a clear path to contact or book.',
    copyBooking: 'Copywriting and booking integration',
    copyBookingWhat: 'Client-friendly service messaging connected to the selected booking path.',
    copyBookingWhy: 'Helps visitors understand the offer and move from interest to an inquiry with less friction.',
    visibility: 'Help search and AI find and describe your business',
    visibilityWhat: 'Clear public signals so search tools and AI assistants can understand what you offer.',
    visibilityWhy:
      'Helps the right customers discover and understand the business when configured properly (SEO, AEO, agentic AI). Rankings are not guaranteed.',
    domainTitle: 'Website address',
    domainIntro:
      'Do you already have a website address (domain), or do you need ROALLA to register one for you?',
    domainExisting: 'I already have a website address',
    domainExistingValue:
      'No registration cost in this estimate. You will provide access during development so the site can go live on your address.',
    domainNew: 'I need a new website address',
    domainNewValue: 'Choose a registration term. The address will be owned by you.',
    domainTermTitle: 'Choose how long to register it',
    oneYear: '1 year',
    twoYears: '2 years',
    threeYears: '3 years',
    bestValue: 'Best value',
    selected: 'Selected',
    emailTitle: 'Do you need professional email?',
    emailNeedIntro: 'Professional email is optional. Choose No to keep it out of this estimate, or Yes to compare secure business platforms.',
    emailYes: 'Yes, I need professional email',
    emailYesValue: 'Show provider choices, productivity features and per-user pricing.',
    emailProviderTitle: 'Choose the platform that fits how you work',
    emailPopular: 'Security-first setup included',
    emailIntro: 'Match your email to your website address, then choose the tools and working style that fit the business.',
    emailSetupValue: '$150 one-time ROALLA setup for one domain',
    emailSetupIncludes: 'Setup includes domain connection, one initial mailbox, multi-factor authentication, administrator recovery, and core SPF, DKIM and DMARC anti-spoofing records. Additional migration or complex compliance work is scoped separately.',
    emailPrivacyTitle: 'Canadian privacy and security matter',
    emailPrivacyNote: 'A provider does not make a business compliant by itself. Canadian organizations remain accountable for personal information handled by cloud providers. Consider data location, access controls, retention, contracts and breach procedures based on the sensitivity of the information you handle.',
    emailSensitiveDataNote: 'Health, financial, legal and other sensitive information may also be subject to provincial or sector-specific requirements. Confirm those obligations before using email for sensitive client information.',
    emailPrivacyLink: 'Read the Canadian privacy guidance',
    emailPriceNote: 'Published provider prices checked October 2026. Prices are per user, before tax, on annual commitments, and are paid directly to the provider. Providers may change pricing or features.',
    emailUsersLabel: 'How many people need their own mailbox?',
    emailNone: 'No professional email right now',
    emailNoneValue: 'Continue without email setup. You can add a domain-matched mailbox later.',
    emailNoneBestFor: 'Best when you are not ready to choose a provider',
    microsoftBasic: 'Microsoft 365 Business Basic',
    microsoftBasicValue: 'Business Outlook email with Microsoft’s web and mobile productivity tools.',
    microsoftBasicBestFor: 'Best overall fit for many professional service businesses',
    microsoftBasicFeature1: 'Web and mobile Word, Excel, PowerPoint and Outlook',
    microsoftBasicFeature2: '1 TB cloud storage, Teams and Microsoft Bookings',
    microsoftBasicFeature3: 'Familiar business identity with spam and malware filtering',
    microsoftStandard: 'Microsoft 365 Business Standard',
    microsoftStandardValue: 'Everything in Business Basic, plus installed desktop Office applications.',
    microsoftStandardBestFor: 'Best when you need full desktop Word, Excel and PowerPoint',
    microsoftStandardFeature1: 'Installed desktop, web and mobile Office applications',
    microsoftStandardFeature2: 'Professional email, 1 TB storage, Teams and Bookings',
    microsoftStandardFeature3: 'Better fit for offline work and advanced document editing',
    googleStarter: 'Google Workspace Business Starter',
    googleStarterValue: 'Business Gmail with Google’s browser-first collaboration suite.',
    googleStarterBestFor: 'Best when you prefer Gmail, Drive and real-time collaboration',
    googleStarterFeature1: 'Gmail, Drive, Docs, Sheets, Slides and Meet',
    googleStarterFeature2: '30 GB pooled storage per user',
    googleStarterFeature3: 'Security and administration controls with a familiar Gmail experience',
    otherEmail: 'Another provider or email-only plan',
    otherEmailValue: 'Use an existing provider or a lower-cost compatible service such as Zoho Mail.',
    otherEmailBestFor: 'Best when price or an existing platform matters most',
    otherEmailFeature1: 'ROALLA confirms compatibility before configuration',
    otherEmailFeature2: 'Features, data location and support vary by provider',
    otherEmailFeature3: 'Provider subscription is quoted or purchased separately',
    emailRecommended: 'Recommended',
    emailProviderFeesSeparate: 'Provider fees separate',
    emailPerUserYear: '/user/year',
    socialTitle: 'Do you need social media profile setup?',
    socialNeedIntro: 'Social setup is optional and separate from hosting. Choose Yes only if you want ROALLA to configure profiles.',
    socialYes: 'Yes, I want social media profile setup',
    socialYesValue: 'Show platform choices and the starter content library.',
    socialNone: 'No social media setup right now',
    socialNoneValue: 'Continue without social profile setup. You can add it later.',
    socialChooseTitle: 'Choose the profiles to set up',
    socialValue:
      'Professional profile configuration with consistent names, bios, images, links, contact details and security settings. Includes a 30-day starter plan of key messages and post-ready content you can leverage—you publish the posts; we provide the library to help you get started.',
    instagram: 'Instagram',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    bundle: 'Instagram + YouTube + LinkedIn',
    bundleSavings: 'Bundle savings',
    hostingTitle: 'Do you need hosting or care options?',
    hostingNeedIntro: 'Hosting is optional and separate from social setup. Choose No to use your own provider, or Yes to compare ROALLA hosting and care.',
    hostingYes: 'Yes, show hosting and care options',
    hostingYesValue: 'Compare your own provider with ROALLA Launch Hosting and care plans.',
    hostingNone: 'No—I will use my own hosting provider',
    hostingNoneValue: 'ROALLA can still configure the finished website on a compatible provider you manage.',
    hostingChooseTitle: 'Choose your hosting path',
    hostingIntro:
      'Choose how much of the technical upkeep you want to manage yourself. Your website and website address remain yours with every option.',
    hostingDetailHint: 'Tap More detail on any option if you want the full explanation.',
    hostingMoreDetail: 'More detail',
    hostingHideDetail: 'Hide detail',
    hostingCompare: 'Compare hosting options',
    hostingCompareHide: 'Hide comparison',
    hostingMatrixCaption: 'Hosting path comparison',
    hostingMatrixFeature: 'What’s included',
    hostingMatrixHosting: 'Hosting environment',
    hostingMatrixBilling: 'Account, billing and renewals',
    hostingMatrixLaunch: 'Launch configuration on the live site',
    hostingMatrixCare: 'Ongoing technical care',
    hostingMatrixUpdates: 'Content updates and improvements',
    hostingMatrixBestFor: 'Best for',
    hostingMatrixPrice: 'Listed price in this estimate',
    hostingMatrixOwnHosting: 'Your provider',
    hostingMatrixRoallaHosting: 'Included with ROALLA',
    hostingMatrixYouManage: 'You manage',
    hostingMatrixRoallaManages: 'ROALLA manages',
    hostingMatrixConfigured: 'Configured by ROALLA',
    hostingMatrixNotIncluded: 'Not included',
    hostingMatrixOccasional: 'Occasional help',
    hostingMatrixRegular: 'Regular support',
    hostingMatrixMinor: 'Minor requests',
    hostingMatrixActive: 'Higher cadence',
    hostingMatrixOwnPrice: 'Provider fees separate',
    ownHosting: 'My own hosting provider',
    ownHostingValue: 'Use a compatible provider you already trust; ROALLA will configure the website there.',
    ownHostingBestFor: 'Best when you already manage hosting',
    ownHostingDetail: 'You choose and pay the provider directly, and you remain responsible for its account, billing, renewals and support. ROALLA confirms compatibility and configures the completed website on that platform. Provider fees are separate.',
    launchHosting: 'ROALLA Launch Hosting',
    launchHostingValue: 'A simple, professionally managed home for your new website without another platform to configure.',
    launchHostingBestFor: 'Simple, low-maintenance launch',
    launchHostingDetail: 'Includes the hosting environment, launch configuration and secure website connection needed to put the site online. It is designed for clients who want reliable hosting but do not need ongoing content changes or a monthly care plan.',
    careLite: 'Care Lite',
    careLiteValue: 'Hosting plus ongoing technical care for a site that needs occasional help after launch.',
    careLiteBestFor: 'Best balance for most small businesses',
    careLiteDetail: 'Adds an ongoing support path for routine website maintenance and minor requests, so you are not left to solve technical issues alone. Final response times, request limits and included work are confirmed in your written scope.',
    care: 'ROALLA Care',
    careValue: 'More hands-on website care for a business that expects regular updates and continued improvement.',
    careBestFor: 'For active, evolving websites',
    careDetail: 'Adds a higher level of ongoing support for website updates, health checks and improvement needs. It is the strongest fit when the site will change regularly. Final service levels, request limits and included work are confirmed in your written scope.',
    recommended: 'Popular choice',
    perYear: '/year',
    perMonth: '/month',
    codeTitle: 'Have a referral code?',
    codePlaceholder: 'Enter referral code',
    apply: 'Apply code',
    applying: 'Checking…',
    codeApplied: 'Community referral discount applied: 30% off core professional services.',
    invalidCode: 'That referral code is not valid. Check the spelling or continue at standard pricing.',
    codeError: 'We could not check the code. Please try again.',
    remove: 'Remove discount',
    summaryTitle: 'Your preliminary estimate',
    coreServices: 'Core professional services',
    referralDiscount: 'Community referral discount',
    domain: 'Website address registration',
    emailSetup: 'Professional email setup',
    emailAnnual: 'Email licenses — first year',
    socialSetup: 'Social media profile setup',
    domainTermOne: '1-year website address',
    domainTermTwo: '2-year website address',
    domainTermThree: '3-year website address',
    domainExistingSummary: 'Existing website address (no registration cost)',
    hostingFirstYear: 'Hosting and care — projected first year',
    ownHostingNote: 'Client-selected hosting provider fees are not included.',
    subtotal: 'First-year estimate before HST',
    hst: 'HST (13%)',
    total: 'Projected first-year total',
    mobileSummaryLabel: 'Estimated first-year total',
    disclaimer:
      'This is a preliminary, non-binding estimate based on your selections. ROALLA confirms scope, compatibility, timing and final pricing in writing before work begins.',
    cta: 'Request scope confirmation',
    crossLinkVisibility: 'Already have a site? Estimate search and AI visibility improvements',
    crossLinkEmail: 'Emails not reaching clients? Estimate email reach and setup',
  },
  fr: {
    eyebrow: 'Estimateur de forfait Web',
    title: 'Préparez une estimation claire pour la première année.',
    intro:
      'Commencez par la base de lancement et l’adresse du site. Les options restent séparées—choisissez le courriel, les profils de médias sociaux ou l’hébergement seulement si vous les voulez.',
    outcomeClarity: 'Expliquer clairement votre valeur',
    outcomeDiscovery: 'Aider les clients à vous trouver',
    outcomeAction: 'Faciliter la prochaine étape',
    referralNote: 'Vous avez un code de recommandation? Entrez-le au bas de ce formulaire pour appliquer le rabais communautaire.',
    referralNoteLink: 'Aller au code de recommandation',
    requiredSection: 'Requis',
    optionalSection: 'Options facultatives',
    optionalSectionIntro: 'Ces éléments ne sont pas requis pour demander une confirmation de portée.',
    nextStep: 'Étape suivante',
    coreTitle: 'Lancement Web de base',
    required: 'Requis',
    included: 'Inclus',
    whatItIs: 'De quoi il s’agit',
    whyItMatters: 'Pourquoi c’est important',
    website: 'Création du site Web',
    websiteWhat: 'Conception et développement d’un site professionnel adapté aux appareils mobiles.',
    websiteWhy: 'Crée une présence crédible et un parcours clair pour communiquer ou réserver.',
    copyBooking: 'Rédaction et intégration de la réservation',
    copyBookingWhat: 'Des messages clairs sur les services, reliés au parcours de réservation choisi.',
    copyBookingWhy: 'Aide les visiteurs à comprendre l’offre et à passer plus facilement de l’intérêt à une demande.',
    visibility: 'Aider la recherche et l’IA à trouver et décrire votre entreprise',
    visibilityWhat: 'Des signaux publics clairs pour que les outils de recherche et les assistants IA comprennent votre offre.',
    visibilityWhy:
      'Aide les bons clients à découvrir et comprendre l’entreprise lorsque la configuration est adéquate (SEO, AEO, IA agentique). Aucun classement n’est garanti.',
    domainTitle: 'Adresse du site',
    domainIntro:
      'Avez-vous déjà une adresse de site (domaine), ou ROALLA doit-elle en enregistrer une pour vous?',
    domainExisting: 'J’ai déjà une adresse de site',
    domainExistingValue:
      'Aucun coût d’enregistrement dans cette estimation. Vous fournirez l’accès pendant le développement pour mettre le site en ligne sur votre adresse.',
    domainNew: 'J’ai besoin d’une nouvelle adresse de site',
    domainNewValue: 'Choisissez une durée d’enregistrement. L’adresse vous appartiendra.',
    domainTermTitle: 'Choisissez la durée d’enregistrement',
    oneYear: '1 an',
    twoYears: '2 ans',
    threeYears: '3 ans',
    bestValue: 'Meilleure valeur',
    selected: 'Sélectionné',
    emailTitle: 'Avez-vous besoin d’un courriel professionnel?',
    emailNeedIntro: 'Le courriel professionnel est facultatif. Choisissez Non pour l’exclure de l’estimation, ou Oui pour comparer les plateformes d’affaires sécurisées.',
    emailYes: 'Oui, j’ai besoin d’un courriel professionnel',
    emailYesValue: 'Afficher les fournisseurs, les outils de productivité et les prix par utilisateur.',
    emailProviderTitle: 'Choisissez la plateforme adaptée à votre façon de travailler',
    emailPopular: 'Configuration axée sur la sécurité incluse',
    emailIntro: 'Faites correspondre votre courriel à l’adresse du site, puis choisissez les outils et la façon de travailler qui conviennent à l’entreprise.',
    emailSetupValue: 'Configuration ROALLA unique de 150 $ pour un domaine',
    emailSetupIncludes: 'La configuration comprend la connexion du domaine, une première boîte, l’authentification multifacteur, la récupération administrateur et les enregistrements anti-usurpation SPF, DKIM et DMARC. Toute migration ou exigence de conformité complexe est définie séparément.',
    emailPrivacyTitle: 'La protection des renseignements et la sécurité au Canada comptent',
    emailPrivacyNote: 'Un fournisseur ne rend pas une entreprise conforme à lui seul. Les organisations canadiennes demeurent responsables des renseignements personnels confiés aux fournisseurs infonuagiques. Évaluez l’emplacement des données, les accès, la conservation, les contrats et les procédures d’incident selon la sensibilité des renseignements traités.',
    emailSensitiveDataNote: 'Les renseignements sur la santé, financiers, juridiques ou autrement sensibles peuvent aussi être soumis à des exigences provinciales ou sectorielles. Confirmez ces obligations avant d’utiliser le courriel pour des renseignements clients sensibles.',
    emailPrivacyLink: 'Lire les conseils canadiens sur la vie privée',
    emailPriceNote: 'Prix publiés vérifiés en octobre 2026. Les prix sont par utilisateur, avant taxes, avec engagement annuel et payés directement au fournisseur. Les fournisseurs peuvent modifier leurs prix ou fonctions.',
    emailUsersLabel: 'Combien de personnes ont besoin de leur propre boîte?',
    emailNone: 'Aucun courriel professionnel pour l’instant',
    emailNoneValue: 'Continuez sans configuration de courriel. Vous pourrez ajouter une boîte liée au domaine plus tard.',
    emailNoneBestFor: 'Idéal si vous n’êtes pas prêt à choisir un fournisseur',
    microsoftBasic: 'Microsoft 365 Business Basic',
    microsoftBasicValue: 'Courriel Outlook professionnel avec les outils Microsoft Web et mobiles.',
    microsoftBasicBestFor: 'Meilleur choix global pour plusieurs entreprises de services professionnels',
    microsoftBasicFeature1: 'Word, Excel, PowerPoint et Outlook sur le Web et mobile',
    microsoftBasicFeature2: '1 To de stockage, Teams et Microsoft Bookings',
    microsoftBasicFeature3: 'Identité professionnelle familière avec filtrage antipourriel et antimaliciel',
    microsoftStandard: 'Microsoft 365 Business Standard',
    microsoftStandardValue: 'Tout le forfait Business Basic, avec les applications Office installées.',
    microsoftStandardBestFor: 'Idéal si vous avez besoin de Word, Excel et PowerPoint sur ordinateur',
    microsoftStandardFeature1: 'Applications Office installées, Web et mobiles',
    microsoftStandardFeature2: 'Courriel professionnel, 1 To, Teams et Bookings',
    microsoftStandardFeature3: 'Mieux adapté au travail hors ligne et aux documents avancés',
    googleStarter: 'Google Workspace Business Starter',
    googleStarterValue: 'Gmail professionnel avec la suite collaborative de Google dans le navigateur.',
    googleStarterBestFor: 'Idéal si vous préférez Gmail, Drive et la collaboration en temps réel',
    googleStarterFeature1: 'Gmail, Drive, Docs, Sheets, Slides et Meet',
    googleStarterFeature2: '30 Go de stockage partagé par utilisateur',
    googleStarterFeature3: 'Contrôles de sécurité et d’administration avec l’expérience Gmail familière',
    otherEmail: 'Autre fournisseur ou forfait courriel seulement',
    otherEmailValue: 'Utilisez un fournisseur existant ou un service compatible moins coûteux comme Zoho Mail.',
    otherEmailBestFor: 'Idéal lorsque le prix ou une plateforme existante est prioritaire',
    otherEmailFeature1: 'ROALLA confirme la compatibilité avant la configuration',
    otherEmailFeature2: 'Les fonctions, l’emplacement des données et le soutien varient',
    otherEmailFeature3: 'L’abonnement du fournisseur est acheté ou chiffré séparément',
    emailRecommended: 'Recommandé',
    emailProviderFeesSeparate: 'Frais du fournisseur séparés',
    emailPerUserYear: '/utilisateur/an',
    socialTitle: 'Avez-vous besoin de la configuration des profils de médias sociaux?',
    socialNeedIntro:
      'La configuration sociale est facultative et séparée de l’hébergement. Choisissez Oui seulement si vous voulez que ROALLA configure les profils.',
    socialYes: 'Oui, je veux la configuration des profils de médias sociaux',
    socialYesValue: 'Afficher les choix de plateformes et la bibliothèque de démarrage.',
    socialNone: 'Pas de configuration sociale pour le moment',
    socialNoneValue: 'Continuer sans configuration de profils. Vous pourrez l’ajouter plus tard.',
    socialChooseTitle: 'Choisissez les profils à configurer',
    socialValue:
      'Configuration professionnelle et cohérente des noms, biographies, images, liens, coordonnées et paramètres de sécurité. Comprend un plan de démarrage de 30 jours avec messages clés et contenu prêt à publier—vous publiez les publications; nous fournissons la bibliothèque pour vous aider à démarrer.',
    instagram: 'Instagram',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    bundle: 'Instagram + YouTube + LinkedIn',
    bundleSavings: 'Économie groupée',
    hostingTitle: 'Avez-vous besoin d’options d’hébergement ou d’entretien?',
    hostingNeedIntro:
      'L’hébergement est facultatif et séparé de la configuration sociale. Choisissez Non pour votre propre fournisseur, ou Oui pour comparer l’hébergement et l’entretien ROALLA.',
    hostingYes: 'Oui, montrer les options d’hébergement et d’entretien',
    hostingYesValue: 'Comparer votre propre fournisseur avec l’hébergement Lancement ROALLA et les forfaits d’entretien.',
    hostingNone: 'Non—j’utiliserai mon propre fournisseur',
    hostingNoneValue: 'ROALLA peut quand même configurer le site terminé sur un fournisseur compatible que vous gérez.',
    hostingChooseTitle: 'Choisissez votre hébergement',
    hostingIntro:
      'Choisissez la part de l’entretien technique que vous souhaitez gérer. Votre site et son adresse restent à vous avec chaque option.',
    hostingDetailHint: 'Touchez Plus de détails sur une option pour voir l’explication complète.',
    hostingMoreDetail: 'Plus de détails',
    hostingHideDetail: 'Masquer les détails',
    hostingCompare: 'Comparer les options d’hébergement',
    hostingCompareHide: 'Masquer la comparaison',
    hostingMatrixCaption: 'Comparaison des parcours d’hébergement',
    hostingMatrixFeature: 'Ce qui est inclus',
    hostingMatrixHosting: 'Environnement d’hébergement',
    hostingMatrixBilling: 'Compte, facturation et renouvellements',
    hostingMatrixLaunch: 'Configuration de lancement sur le site en ligne',
    hostingMatrixCare: 'Entretien technique continu',
    hostingMatrixUpdates: 'Mises à jour de contenu et améliorations',
    hostingMatrixBestFor: 'Idéal pour',
    hostingMatrixPrice: 'Prix indiqué dans cette estimation',
    hostingMatrixOwnHosting: 'Votre fournisseur',
    hostingMatrixRoallaHosting: 'Inclus avec ROALLA',
    hostingMatrixYouManage: 'Vous gérez',
    hostingMatrixRoallaManages: 'ROALLA gère',
    hostingMatrixConfigured: 'Configuré par ROALLA',
    hostingMatrixNotIncluded: 'Non inclus',
    hostingMatrixOccasional: 'Aide occasionnelle',
    hostingMatrixRegular: 'Soutien régulier',
    hostingMatrixMinor: 'Petites demandes',
    hostingMatrixActive: 'Rythme plus élevé',
    hostingMatrixOwnPrice: 'Frais du fournisseur séparés',
    ownHosting: 'Mon propre fournisseur',
    ownHostingValue: 'Utilisez un fournisseur compatible que vous connaissez déjà; ROALLA y configurera le site.',
    ownHostingBestFor: 'Idéal si vous gérez déjà l’hébergement',
    ownHostingDetail: 'Vous choisissez et payez directement le fournisseur, et vous gérez son compte, la facturation, les renouvellements et le soutien. ROALLA confirme la compatibilité et configure le site terminé sur cette plateforme. Les frais du fournisseur sont séparés.',
    launchHosting: 'Hébergement Lancement ROALLA',
    launchHostingValue: 'Un domicile simple et géré professionnellement pour votre nouveau site, sans autre plateforme à configurer.',
    launchHostingBestFor: 'Lancement simple et peu exigeant',
    launchHostingDetail: 'Comprend l’environnement d’hébergement, la configuration de lancement et la connexion sécurisée nécessaires pour mettre le site en ligne. Cette option convient aux clients qui veulent un hébergement fiable sans modifications continues ni forfait mensuel d’entretien.',
    careLite: 'Soins légers',
    careLiteValue: 'L’hébergement avec un entretien technique continu pour un site qui a parfois besoin d’aide après le lancement.',
    careLiteBestFor: 'Le meilleur équilibre pour la plupart des PME',
    careLiteDetail: 'Ajoute un parcours de soutien continu pour l’entretien courant et les petites demandes, afin que vous ne soyez pas seul devant les problèmes techniques. Les délais, limites de demandes et travaux inclus seront confirmés dans la portée écrite.',
    care: 'Soins ROALLA',
    careValue: 'Un entretien plus actif pour une entreprise qui prévoit des mises à jour régulières et une amélioration continue.',
    careBestFor: 'Pour les sites actifs et évolutifs',
    careDetail: 'Ajoute un niveau supérieur de soutien continu pour les mises à jour, les vérifications de santé et les besoins d’amélioration du site. C’est le meilleur choix lorsque le site changera régulièrement. Les niveaux de service, limites de demandes et travaux inclus seront confirmés dans la portée écrite.',
    recommended: 'Choix populaire',
    perYear: '/an',
    perMonth: '/mois',
    codeTitle: 'Avez-vous un code de recommandation?',
    codePlaceholder: 'Entrez le code',
    apply: 'Appliquer',
    applying: 'Vérification…',
    codeApplied: 'Rabais communautaire appliqué : 30 % sur les services professionnels de base.',
    invalidCode: 'Ce code n’est pas valide. Vérifiez-le ou continuez au tarif standard.',
    codeError: 'Impossible de vérifier le code. Veuillez réessayer.',
    remove: 'Retirer le rabais',
    summaryTitle: 'Votre estimation préliminaire',
    coreServices: 'Services professionnels de base',
    referralDiscount: 'Rabais de recommandation communautaire',
    domain: 'Enregistrement de l’adresse du site',
    emailSetup: 'Configuration du courriel professionnel',
    emailAnnual: 'Licences de courriel — première année',
    socialSetup: 'Configuration des profils de médias sociaux',
    domainTermOne: 'Adresse de site — 1 an',
    domainTermTwo: 'Adresse de site — 2 ans',
    domainTermThree: 'Adresse de site — 3 ans',
    domainExistingSummary: 'Adresse de site existante (aucun coût d’enregistrement)',
    hostingFirstYear: 'Hébergement et entretien — première année projetée',
    ownHostingNote: 'Les frais de votre propre fournisseur d’hébergement ne sont pas inclus.',
    subtotal: 'Estimation de la première année avant TVH',
    hst: 'TVH (13 %)',
    total: 'Total projeté de la première année',
    mobileSummaryLabel: 'Total estimé de la première année',
    disclaimer:
      'Cette estimation préliminaire est non contraignante. ROALLA confirmera la portée, la compatibilité, l’échéancier et le prix final par écrit avant le début des travaux.',
    cta: 'Demander la confirmation de la portée',
    crossLinkVisibility: 'Vous avez déjà un site? Estimez les améliorations de visibilité recherche et IA',
    crossLinkEmail: 'Les courriels n’atteignent pas les clients? Estimez la portée et la configuration',
  },
} as const

const socialOptions: Array<{ value: Exclude<SocialSetup, 'none'>; label: keyof typeof copy.en }> = [
  { value: 'instagram', label: 'instagram' },
  { value: 'youtube', label: 'youtube' },
  { value: 'linkedin', label: 'linkedin' },
  { value: 'bundle', label: 'bundle' },
]

const emailOptions: Array<{
  value: EmailChoice
  label: keyof typeof copy.en
  description: keyof typeof copy.en
  bestFor: keyof typeof copy.en
  features: readonly [keyof typeof copy.en, keyof typeof copy.en, keyof typeof copy.en] | readonly []
  annual: number | null
  recommended?: boolean
}> = [
  {
    value: 'microsoft-basic',
    label: 'microsoftBasic',
    description: 'microsoftBasicValue',
    bestFor: 'microsoftBasicBestFor',
    features: ['microsoftBasicFeature1', 'microsoftBasicFeature2', 'microsoftBasicFeature3'],
    annual: WEBSITE_ESTIMATE_PRICES.emailAnnual,
    recommended: true,
  },
  {
    value: 'microsoft-standard',
    label: 'microsoftStandard',
    description: 'microsoftStandardValue',
    bestFor: 'microsoftStandardBestFor',
    features: ['microsoftStandardFeature1', 'microsoftStandardFeature2', 'microsoftStandardFeature3'],
    annual: WEBSITE_ESTIMATE_PRICES.microsoftStandardAnnual,
  },
  {
    value: 'google-starter',
    label: 'googleStarter',
    description: 'googleStarterValue',
    bestFor: 'googleStarterBestFor',
    features: ['googleStarterFeature1', 'googleStarterFeature2', 'googleStarterFeature3'],
    annual: WEBSITE_ESTIMATE_PRICES.googleWorkspaceStarterAnnual,
  },
  {
    value: 'other',
    label: 'otherEmail',
    description: 'otherEmailValue',
    bestFor: 'otherEmailBestFor',
    features: ['otherEmailFeature1', 'otherEmailFeature2', 'otherEmailFeature3'],
    annual: null,
  },
]

const hostingOptions: Array<{
  value: HostingChoice
  label: keyof typeof copy.en
  description: keyof typeof copy.en
  bestFor: keyof typeof copy.en
  detail: keyof typeof copy.en
  price: string
  recommended?: boolean
}> = [
  { value: 'own', label: 'ownHosting', description: 'ownHostingValue', bestFor: 'ownHostingBestFor', detail: 'ownHostingDetail', price: '$0' },
  { value: 'launch', label: 'launchHosting', description: 'launchHostingValue', bestFor: 'launchHostingBestFor', detail: 'launchHostingDetail', price: `$${WEBSITE_ESTIMATE_PRICES.launchHostingAnnual}/year` },
  { value: 'care-lite', label: 'careLite', description: 'careLiteValue', bestFor: 'careLiteBestFor', detail: 'careLiteDetail', price: `$${WEBSITE_ESTIMATE_PRICES.careLiteMonthly}/month`, recommended: true },
  { value: 'care', label: 'care', description: 'careValue', bestFor: 'careBestFor', detail: 'careDetail', price: `$${WEBSITE_ESTIMATE_PRICES.careMonthly}/month` },
]

const tileMotion =
  'transition-all duration-200 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.015] motion-safe:hover:shadow-lg motion-safe:hover:shadow-primary/25'
const tileSelected =
  `${tileMotion} border-2 border-primary bg-primary/20 ring-2 ring-primary/55 shadow-md shadow-primary/25`
const tileIdle =
  `${tileMotion} border-2 border-slate-300 bg-white hover:border-primary/45 hover:bg-primary/5`
const choicePanel =
  'mt-5 rounded-2xl border-2 border-l-4 border-primary/40 border-l-primary bg-white p-4 shadow-[0_12px_28px_-14px_rgba(0,180,197,0.45)] ring-1 ring-primary/15 sm:p-5'

export default function WebsiteEstimateBuilder() {
  const locale = useLocale()
  const french = locale === 'fr'
  const t = copy[french ? 'fr' : 'en']
  const money = useMemo(() => (amount: number) => formatCad(amount, french ? 'fr' : 'en'), [french])
  const [domainSource, setDomainSource] = useState<DomainSource>('new')
  const [domainTerm, setDomainTerm] = useState<DomainTerm>('three')
  const [needsEmail, setNeedsEmail] = useState(false)
  const [email, setEmail] = useState<EmailChoice>('none')
  const [emailUsers, setEmailUsers] = useState(1)
  const [needsSocial, setNeedsSocial] = useState(false)
  const [social, setSocial] = useState<SocialSetup>('none')
  const [needsHosting, setNeedsHosting] = useState(false)
  const [hosting, setHosting] = useState<HostingChoice>('own')
  const [expandedHosting, setExpandedHosting] = useState<HostingChoice | null>(null)
  const [showHostingMatrix, setShowHostingMatrix] = useState(false)
  const [code, setCode] = useState('')
  const [appliedReferralCode, setAppliedReferralCode] = useState('')
  const [referralApplied, setReferralApplied] = useState(false)
  const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'invalid' | 'error'>('idle')

  const activeSocial = needsSocial ? social : 'none'
  const activeHosting = needsHosting ? hosting : 'own'
  const estimate = calculateWebsiteEstimate({
    domainSource,
    domainTerm,
    email,
    emailUsers,
    social: activeSocial,
    hosting: activeHosting,
    referralDiscount: referralApplied,
  })

  const chooseSocialNeed = (needed: boolean) => {
    setNeedsSocial(needed)
    if (needed) {
      setSocial((current) => (current === 'none' ? 'instagram' : current))
    } else {
      setSocial('none')
    }
  }

  const chooseHostingNeed = (needed: boolean) => {
    setNeedsHosting(needed)
    if (needed) {
      setHosting((current) => (current === 'own' ? 'care-lite' : current))
      setExpandedHosting(null)
    } else {
      setHosting('own')
      setExpandedHosting(null)
      setShowHostingMatrix(false)
    }
  }

  const chooseEmailNeed = (needed: boolean) => {
    setNeedsEmail(needed)
    if (needed) {
      setEmail((current) => current === 'none' ? 'microsoft-basic' : current)
    } else {
      setEmail('none')
      setEmailUsers(1)
    }
  }

  const socialSummaryLabel =
    activeSocial === 'none'
      ? null
      : activeSocial === 'bundle'
        ? t.bundle
        : t[activeSocial]
  const hostingSummaryLabel =
    activeHosting === 'own'
      ? null
      : activeHosting === 'launch'
        ? t.launchHosting
        : activeHosting === 'care-lite'
          ? t.careLite
          : t.care
  const domainSummaryLabel =
    domainSource === 'existing'
      ? t.domainExistingSummary
      : domainTerm === 'one'
        ? t.domainTermOne
        : domainTerm === 'two'
          ? t.domainTermTwo
          : t.domainTermThree
  const selectedEmailOption = emailOptions.find((option) => option.value === email)
  const emailSummaryLabel =
    email === 'none' || !selectedEmailOption
      ? null
      : `${t[selectedEmailOption.label]} × ${emailUsers}`

  const referralSummaryLabel =
    referralApplied && appliedReferralCode
      ? `${t.referralDiscount} (${appliedReferralCode})`
      : referralApplied
        ? t.referralDiscount
        : null

  const selectionLines = [
    t.coreServices,
    domainSummaryLabel,
    emailSummaryLabel,
    socialSummaryLabel,
    hostingSummaryLabel ?? t.ownHosting,
    referralSummaryLabel,
  ].filter(Boolean) as string[]

  const estimateSummary = selectionLines.join(' · ')
  const estimateTotalLabel = money(estimate.firstYearTotal)

  const applyReferralCode = async (event: React.FormEvent) => {
    event.preventDefault()
    setCodeStatus('loading')
    const normalizedCode = code.trim().toUpperCase()
    try {
      const response = await fetch('/api/website-estimate/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: normalizedCode }),
      })
      const result = (await response.json()) as { valid?: boolean }
      if (response.ok && result.valid) {
        setCode(normalizedCode)
        setAppliedReferralCode(normalizedCode)
        setReferralApplied(true)
        setCodeStatus('idle')
      } else {
        setReferralApplied(false)
        setAppliedReferralCode('')
        setCodeStatus('invalid')
      }
    } catch {
      setReferralApplied(false)
      setAppliedReferralCode('')
      setCodeStatus('error')
    }
  }

  const removeReferral = () => {
    setReferralApplied(false)
    setAppliedReferralCode('')
    setCode('')
    setCodeStatus('idle')
  }

  const estimateGoal = `${french ? 'Estimation Web' : 'Website estimate'}: ${estimateTotalLabel} ${french ? 'TVH incluse' : 'including HST'}. ${estimateSummary}`

  const contactQuery = {
    intent: 'website',
    offer: 'estimate',
    from_page: '/website-estimate',
    goal: estimateGoal,
    estimate_total: estimateTotalLabel,
    estimate_summary: estimateSummary,
    ...(appliedReferralCode ? { estimate_referral_code: appliedReferralCode } : {}),
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 overflow-hidden pb-24 lg:pb-0">
      <header className="bg-slate-950 px-6 py-8 text-white sm:px-8 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-light">{t.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-serif font-bold text-white sm:text-4xl">{t.title}</h1>
        <p className="mt-4 max-w-3xl leading-7 text-white/95">{t.intro}</p>
        <p className="mt-4 inline-flex max-w-3xl items-start gap-2 rounded-xl border border-amber-300/40 bg-amber-400/15 px-3.5 py-2.5 text-sm leading-6 text-white">
          <Tag className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
          <span>
            {t.referralNote}{' '}
            <a href="#referral-code-section" className="font-semibold text-amber-200 underline underline-offset-4 hover:text-amber-100">
              {t.referralNoteLink}
            </a>
          </span>
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {[t.outcomeClarity, t.outcomeDiscovery, t.outcomeAction].map((outcome) => (
            <span key={outcome} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
              <CheckCircle className="h-3.5 w-3.5 text-primary-light" aria-hidden />
              {outcome}
            </span>
          ))}
        </div>
      </header>

      <div className="grid lg:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-8 p-6 sm:p-8 lg:p-10">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold uppercase tracking-[.16em] text-slate-950">{t.requiredSection}</h2>
              <div className="h-px flex-1 bg-slate-200" aria-hidden />
            </div>

            <fieldset>
              <legend className="flex w-full items-center justify-between gap-3 text-xl font-serif font-bold text-slate-950">
                {t.coreTitle}
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-dark">{t.required}</span>
              </legend>
              <div className="mt-4 space-y-3">
                {[
                  { label: t.website, what: t.websiteWhat, why: t.websiteWhy, price: WEBSITE_ESTIMATE_PRICES.website, icon: Globe2 },
                  { label: t.copyBooking, what: t.copyBookingWhat, why: t.copyBookingWhy, price: WEBSITE_ESTIMATE_PRICES.copyAndBooking, icon: PenLine },
                  { label: t.visibility, what: t.visibilityWhat, why: t.visibilityWhy, price: WEBSITE_ESTIMATE_PRICES.visibility, icon: SearchCheck },
                ].map(({ label, what, why, price, icon: Icon }) => (
                  <article key={label} className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${tileMotion}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif text-lg font-bold text-slate-950">{label}</h3>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800">{t.included}</span>
                          </div>
                        </div>
                      </div>
                      <p className="shrink-0 pt-2 font-bold tabular-nums text-primary-dark">{money(price)}</p>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{t.whatItIs}</p>
                        <p className="mt-1.5 text-sm leading-6 text-slate-800">{what}</p>
                      </div>
                      <div className="rounded-xl bg-primary/5 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-primary-dark">{t.whyItMatters}</p>
                        <p className="mt-1.5 text-sm leading-6 text-slate-800">{why}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="flex w-full items-center justify-between gap-3 text-xl font-serif font-bold text-slate-950">
                {t.domainTitle}
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-dark">{t.required}</span>
              </legend>
              <p className="mt-1 text-sm text-slate-700">{t.domainIntro}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {([
                  ['existing', t.domainExisting, t.domainExistingValue],
                  ['new', t.domainNew, t.domainNewValue],
                ] as Array<[DomainSource, string, string]>).map(([value, label, detail]) => (
                  <label key={value} className={`relative cursor-pointer rounded-xl border p-4 transition ${domainSource === value ? tileSelected : tileIdle}`}>
                    <input
                      className="sr-only"
                      type="radio"
                      name="domain-source"
                      value={value}
                      checked={domainSource === value}
                      onChange={() => setDomainSource(value)}
                    />
                    <span className="flex items-start justify-between gap-2">
                      <span className="block font-semibold text-slate-900">{label}</span>
                      {domainSource === value ? <CheckCircle className="h-5 w-5 shrink-0 text-primary-dark" aria-hidden /> : null}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-slate-700">{detail}</span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {domainSource === value ? <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                      {value === 'existing' ? (
                        <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                          {money(0)}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>

              {domainSource === 'new' ? (
                <div className={choicePanel}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-dark">{t.nextStep}</p>
                  <h3 className="mt-1 font-serif text-lg font-bold text-slate-950">{t.domainTermTitle}</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {([
                      ['one', t.oneYear],
                      ['two', t.twoYears],
                      ['three', t.threeYears],
                    ] as Array<[DomainTerm, string]>).map(([value, label]) => (
                      <label key={value} className={`relative cursor-pointer rounded-xl border p-4 transition ${domainTerm === value ? tileSelected : tileIdle}`}>
                        <input className="sr-only" type="radio" name="domain-term" value={value} checked={domainTerm === value} onChange={() => setDomainTerm(value)} />
                        <span className="flex items-start justify-between gap-2">
                          <span className="block font-semibold text-slate-900">{label}</span>
                          {domainTerm === value ? <CheckCircle className="h-5 w-5 shrink-0 text-primary-dark" aria-hidden /> : null}
                        </span>
                        <span className="mt-1 block text-lg font-bold text-primary-dark">{money(DOMAIN_PRICES[value])}</span>
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {domainTerm === value ? <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                          {value === 'three' ? <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">{t.bestValue}</span> : null}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
            </fieldset>
          </div>

          <div className="space-y-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-5 sm:p-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold uppercase tracking-[.16em] text-slate-950">{t.optionalSection}</h2>
                <div className="h-px flex-1 bg-slate-300" aria-hidden />
              </div>
              <p className="mt-2 text-sm text-slate-700">{t.optionalSectionIntro}</p>
            </div>

            <fieldset>
              <legend className="flex flex-wrap items-center gap-2 text-xl font-serif font-bold text-slate-950">
                <Mail className="h-5 w-5 text-primary" aria-hidden />
                {t.emailTitle}
              </legend>
              <p className="mt-2 text-sm leading-6 text-slate-700">{t.emailNeedIntro}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className={`cursor-pointer rounded-xl border p-4 transition ${!needsEmail ? tileSelected : tileIdle}`}>
                  <input className="sr-only" type="radio" name="needs-email" checked={!needsEmail} onChange={() => chooseEmailNeed(false)} />
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-slate-950">{t.emailNone}</span>
                    {!needsEmail ? <CheckCircle className="h-5 w-5 shrink-0 text-primary" aria-hidden /> : null}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-700">{t.emailNoneValue}</span>
                  {!needsEmail ? <span className="mt-3 inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                </label>
                <label className={`cursor-pointer rounded-xl border p-4 transition ${needsEmail ? tileSelected : tileIdle}`}>
                  <input className="sr-only" type="radio" name="needs-email" checked={needsEmail} onChange={() => chooseEmailNeed(true)} />
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-slate-950">{t.emailYes}</span>
                    {needsEmail ? <CheckCircle className="h-5 w-5 shrink-0 text-primary" aria-hidden /> : null}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-700">{t.emailYesValue}</span>
                  {needsEmail ? <span className="mt-3 inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                </label>
              </div>

              {needsEmail ? (
                <div className={choicePanel}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-dark">{t.nextStep}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-slate-950">{t.emailProviderTitle}</h3>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900">{t.emailPopular}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{t.emailIntro}</p>
                  <div className="mt-4 rounded-xl border border-primary/25 bg-primary/5 p-4">
                    <p className="font-bold text-primary-dark">{t.emailSetupValue}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{t.emailSetupIncludes}</p>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {emailOptions.map((option) => {
                      const selected = email === option.value
                      const priceLabel = option.annual === null
                        ? t.emailProviderFeesSeparate
                        : `${money(option.annual)}${t.emailPerUserYear}`

                      return (
                        <label key={option.value} className={`cursor-pointer rounded-xl border p-4 transition ${selected ? tileSelected : tileIdle}`}>
                          <input className="sr-only" type="radio" name="email-provider" value={option.value} checked={selected} onChange={() => setEmail(option.value)} />
                          <span className="flex items-start justify-between gap-3">
                            <span className="font-semibold text-slate-950">{t[option.label]}</span>
                            <span className="shrink-0 text-right text-sm font-bold text-primary-dark">{priceLabel}</span>
                          </span>
                          <span className="mt-2 flex flex-wrap gap-1.5">
                            {selected ? <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                            {option.recommended ? <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">{t.emailRecommended}</span> : null}
                          </span>
                          <span className="mt-2 block text-sm leading-6 text-slate-700">{t[option.description]}</span>
                          <span className="mt-3 block space-y-1.5 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-700">
                            {option.features.map((feature) => (
                              <span key={feature} className="flex gap-2">
                                <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                                <span>{t[feature]}</span>
                              </span>
                            ))}
                          </span>
                          <span className="mt-3 block border-t border-slate-200 pt-3 text-xs font-semibold leading-5 text-primary-dark">{t[option.bestFor]}</span>
                        </label>
                      )
                    })}
                  </div>

                  <label className="mt-4 block rounded-xl border border-slate-200 bg-white p-4">
                    <span className="text-sm font-semibold text-slate-900">{t.emailUsersLabel}</span>
                    <input className="mt-2 h-11 w-28 rounded-lg border border-slate-300 px-3 font-semibold text-slate-950 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" type="number" min={1} max={25} value={emailUsers} onChange={(event) => setEmailUsers(Math.min(25, Math.max(1, Number(event.target.value) || 1)))} />
                  </label>

                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                    <p className="font-bold">{t.emailPrivacyTitle}</p>
                    <p className="mt-1">{t.emailPrivacyNote}</p>
                    <p className="mt-2 font-medium">{t.emailSensitiveDataNote}</p>
                    <a href="https://www.priv.gc.ca/en/privacy-topics/employers-and-employees/outsourcing/02_05_d_57_os_01/" target="_blank" rel="noreferrer" className="mt-2 inline-flex font-bold text-primary-dark underline underline-offset-4">{t.emailPrivacyLink}</a>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-600">{t.emailPriceNote}</p>
                </div>
              ) : null}
            </fieldset>

            <fieldset>
              <legend className="flex flex-wrap items-center gap-2 text-xl font-serif font-bold text-slate-950">
                <Share2 className="h-5 w-5 text-primary" aria-hidden />
                {t.socialTitle}
              </legend>
              <p className="mt-2 text-sm leading-6 text-slate-700">{t.socialNeedIntro}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className={`cursor-pointer rounded-xl border p-4 transition ${!needsSocial ? tileSelected : tileIdle}`}>
                  <input className="sr-only" type="radio" name="needs-social" checked={!needsSocial} onChange={() => chooseSocialNeed(false)} />
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-slate-950">{t.socialNone}</span>
                    {!needsSocial ? <CheckCircle className="h-5 w-5 shrink-0 text-primary" aria-hidden /> : null}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-700">{t.socialNoneValue}</span>
                  {!needsSocial ? <span className="mt-3 inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                </label>
                <label className={`cursor-pointer rounded-xl border p-4 transition ${needsSocial ? tileSelected : tileIdle}`}>
                  <input className="sr-only" type="radio" name="needs-social" checked={needsSocial} onChange={() => chooseSocialNeed(true)} />
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-slate-950">{t.socialYes}</span>
                    {needsSocial ? <CheckCircle className="h-5 w-5 shrink-0 text-primary" aria-hidden /> : null}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-700">{t.socialYesValue}</span>
                  {needsSocial ? <span className="mt-3 inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                </label>
              </div>

              {needsSocial ? (
                <div className={choicePanel}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-dark">{t.nextStep}</p>
                  <h3 className="mt-1 font-serif text-lg font-bold text-slate-950">{t.socialChooseTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{t.socialValue}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {socialOptions.map(({ value, label }) => {
                      const price = value === 'bundle' ? WEBSITE_ESTIMATE_PRICES.socialBundle : WEBSITE_ESTIMATE_PRICES.socialSingle
                      return (
                        <label key={value} className={`cursor-pointer rounded-xl border p-4 transition ${social === value ? tileSelected : tileIdle}`}>
                          <input className="sr-only" type="radio" name="social" value={value} checked={social === value} onChange={() => setSocial(value)} />
                          <span className="flex items-start justify-between gap-3">
                            <span className="font-semibold text-slate-900">{t[label]}</span>
                            <span className="flex items-center gap-2">
                              <span className="font-bold text-primary-dark">{money(price)}</span>
                              {social === value ? <CheckCircle className="h-5 w-5 shrink-0 text-primary-dark" aria-hidden /> : null}
                            </span>
                          </span>
                          <span className="mt-2 flex flex-wrap gap-1.5">
                            {social === value ? <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                            {value === 'bundle' ? <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">{t.bundleSavings}</span> : null}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </fieldset>

            <fieldset>
              <legend className="flex flex-wrap items-center gap-2 text-xl font-serif font-bold text-slate-950">
                <Server className="h-5 w-5 text-primary" aria-hidden />
                {t.hostingTitle}
              </legend>
              <p className="mt-2 text-sm leading-6 text-slate-700">{t.hostingNeedIntro}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className={`cursor-pointer rounded-xl border p-4 transition ${!needsHosting ? tileSelected : tileIdle}`}>
                  <input className="sr-only" type="radio" name="needs-hosting" checked={!needsHosting} onChange={() => chooseHostingNeed(false)} />
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-slate-950">{t.hostingNone}</span>
                    {!needsHosting ? <CheckCircle className="h-5 w-5 shrink-0 text-primary" aria-hidden /> : null}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-700">{t.hostingNoneValue}</span>
                  {!needsHosting ? <span className="mt-3 inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                </label>
                <label className={`cursor-pointer rounded-xl border p-4 transition ${needsHosting ? tileSelected : tileIdle}`}>
                  <input className="sr-only" type="radio" name="needs-hosting" checked={needsHosting} onChange={() => chooseHostingNeed(true)} />
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-slate-950">{t.hostingYes}</span>
                    {needsHosting ? <CheckCircle className="h-5 w-5 shrink-0 text-primary" aria-hidden /> : null}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-700">{t.hostingYesValue}</span>
                  {needsHosting ? <span className="mt-3 inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                </label>
              </div>

              {needsHosting ? (
                <div className={choicePanel}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-dark">{t.nextStep}</p>
                  <h3 className="mt-1 font-serif text-lg font-bold text-slate-950">{t.hostingChooseTitle}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">{t.hostingIntro}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-primary-dark">
                      <Info className="h-3.5 w-3.5" aria-hidden />
                      {t.hostingDetailHint}
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary-dark transition hover:bg-primary/15"
                      aria-expanded={showHostingMatrix}
                      aria-controls="hosting-comparison-matrix"
                      onClick={() => setShowHostingMatrix((open) => !open)}
                    >
                      <Table2 className="h-3.5 w-3.5" aria-hidden />
                      {showHostingMatrix ? t.hostingCompareHide : t.hostingCompare}
                      {showHostingMatrix ? <ChevronUp className="h-3.5 w-3.5" aria-hidden /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden />}
                    </button>
                  </div>
                  {showHostingMatrix ? (
                    <div
                      id="hosting-comparison-matrix"
                      className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                      <table className="min-w-[40rem] w-full border-collapse text-left text-sm">
                        <caption className="sr-only">{t.hostingMatrixCaption}</caption>
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-950 text-white">
                            <th scope="col" className="px-3 py-3 font-semibold">{t.hostingMatrixFeature}</th>
                            <th scope="col" className="px-3 py-3 font-semibold">{t.ownHosting}</th>
                            <th scope="col" className="px-3 py-3 font-semibold">{t.launchHosting}</th>
                            <th scope="col" className="px-3 py-3 font-semibold">
                              {t.careLite}
                              <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-emerald-300">{t.recommended}</span>
                            </th>
                            <th scope="col" className="px-3 py-3 font-semibold">{t.care}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-800">
                          {(
                            [
                              [t.hostingMatrixHosting, t.hostingMatrixOwnHosting, t.hostingMatrixRoallaHosting, t.hostingMatrixRoallaHosting, t.hostingMatrixRoallaHosting],
                              [t.hostingMatrixBilling, t.hostingMatrixYouManage, t.hostingMatrixRoallaManages, t.hostingMatrixRoallaManages, t.hostingMatrixRoallaManages],
                              [t.hostingMatrixLaunch, t.hostingMatrixConfigured, t.hostingMatrixConfigured, t.hostingMatrixConfigured, t.hostingMatrixConfigured],
                              [t.hostingMatrixCare, t.hostingMatrixNotIncluded, t.hostingMatrixNotIncluded, t.hostingMatrixOccasional, t.hostingMatrixRegular],
                              [t.hostingMatrixUpdates, t.hostingMatrixNotIncluded, t.hostingMatrixNotIncluded, t.hostingMatrixMinor, t.hostingMatrixActive],
                              [t.hostingMatrixBestFor, t.ownHostingBestFor, t.launchHostingBestFor, t.careLiteBestFor, t.careBestFor],
                              [
                                t.hostingMatrixPrice,
                                t.hostingMatrixOwnPrice,
                                `$${WEBSITE_ESTIMATE_PRICES.launchHostingAnnual}${t.perYear}`,
                                `$${WEBSITE_ESTIMATE_PRICES.careLiteMonthly}${t.perMonth}`,
                                `$${WEBSITE_ESTIMATE_PRICES.careMonthly}${t.perMonth}`,
                              ],
                            ] as const
                          ).map(([feature, own, launch, careLite, care]) => (
                            <tr key={feature} className="align-top odd:bg-white even:bg-slate-50">
                              <th scope="row" className="px-3 py-3 font-semibold text-slate-950">
                                {feature}
                              </th>
                              <td className="px-3 py-3 leading-6">{own}</td>
                              <td className="px-3 py-3 leading-6">{launch}</td>
                              <td className="px-3 py-3 leading-6">{careLite}</td>
                              <td className="px-3 py-3 leading-6">{care}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {hostingOptions.map(({ value, label, description, bestFor, detail, price, recommended }) => {
                      const isExpanded = expandedHosting === value
                      return (
                        <div key={value} className={`rounded-xl border p-4 transition ${hosting === value ? tileSelected : tileIdle}`}>
                          <label className="cursor-pointer">
                            <input
                              className="sr-only"
                              type="radio"
                              name="hosting"
                              value={value}
                              checked={hosting === value}
                              aria-describedby={`hosting-${value}-description`}
                              onChange={() => setHosting(value)}
                            />
                            <span className="flex items-start justify-between gap-3">
                              <span className="font-semibold text-slate-900">{t[label]}</span>
                              <span className="flex items-center gap-2">
                                <span className="shrink-0 font-bold text-primary-dark">{price.replace('/year', t.perYear).replace('/month', t.perMonth)}</span>
                                {hosting === value ? <CheckCircle className="h-5 w-5 shrink-0 text-primary-dark" aria-hidden /> : null}
                              </span>
                            </span>
                            <span className="mt-2 flex flex-wrap gap-1.5">
                              {hosting === value ? <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                              {recommended ? <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">{t.recommended}</span> : null}
                            </span>
                            <span id={`hosting-${value}-description`} className="mt-2 block text-sm leading-6 text-slate-700">{t[description]}</span>
                            <span className="mt-3 block border-t border-slate-200 pt-3 text-xs font-semibold text-primary-dark">{t[bestFor]}</span>
                          </label>
                          <button
                            type="button"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary-dark underline-offset-2 hover:underline"
                            aria-expanded={isExpanded}
                            onClick={() => setExpandedHosting(isExpanded ? null : value)}
                          >
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" aria-hidden /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden />}
                            {isExpanded ? t.hostingHideDetail : t.hostingMoreDetail}
                          </button>
                          {isExpanded ? (
                            <p id={`hosting-${value}-detail`} className="mt-3 rounded-xl bg-slate-950 p-4 text-sm leading-6 text-white">
                              {t[detail]}
                            </p>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </fieldset>
          </div>

          <form id="referral-code-section" onSubmit={applyReferralCode} className="scroll-mt-28 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2"><Tag className="h-5 w-5 text-amber-700" aria-hidden /><h2 className="font-serif text-lg font-bold text-slate-950">{t.codeTitle}</h2></div>
            {referralApplied ? (
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2 text-sm font-medium leading-6 text-emerald-800"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{t.codeApplied}</p>
                <button type="button" onClick={removeReferral} className="text-left text-sm font-semibold text-amber-900 underline underline-offset-4">{t.remove}</button>
              </div>
            ) : (
              <>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <label className="sr-only" htmlFor="referral-code">{t.codePlaceholder}</label>
                  <input id="referral-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder={t.codePlaceholder} autoComplete="off" className="min-h-12 flex-1 rounded-lg border border-amber-300 bg-white px-4 text-sm uppercase tracking-wide text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  <button type="submit" disabled={!code.trim() || codeStatus === 'loading'} className="min-h-12 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">{codeStatus === 'loading' ? t.applying : t.apply}</button>
                </div>
                {codeStatus === 'invalid' ? <p className="mt-2 text-sm font-medium text-red-700" role="alert">{t.invalidCode}</p> : null}
                {codeStatus === 'error' ? <p className="mt-2 text-sm font-medium text-red-700" role="alert">{t.codeError}</p> : null}
              </>
            )}
          </form>
        </div>

        <aside className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <div className="lg:sticky lg:top-28">
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" aria-hidden /><h2 className="text-xl font-serif font-bold text-slate-950">{t.summaryTitle}</h2></div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-700">{t.coreServices}</dt><dd className="font-semibold tabular-nums text-slate-900">{money(WEBSITE_ESTIMATE_CORE_PRICE)}</dd></div>
              {estimate.referralDiscount > 0 ? (
                <div className="flex justify-between gap-4 text-emerald-700">
                  <dt className="flex min-w-0 flex-wrap items-center gap-2">
                    <span>{t.referralDiscount}</span>
                    {appliedReferralCode ? (
                      <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-900">
                        {appliedReferralCode}
                      </span>
                    ) : null}
                  </dt>
                  <dd className="font-semibold tabular-nums">–{money(estimate.referralDiscount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4"><dt className="text-slate-700">{domainSummaryLabel}</dt><dd className="font-semibold tabular-nums text-slate-900">{domainSource === 'existing' ? money(0) : money(estimate.domain)}</dd></div>
              {email !== 'none' ? (
                <>
                  <div className="flex justify-between gap-4"><dt className="text-slate-700">{t.emailSetup}</dt><dd className="font-semibold tabular-nums text-slate-900">{money(estimate.emailSetup)}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-slate-700">{emailSummaryLabel ?? t.emailAnnual}</dt><dd className="text-right font-semibold tabular-nums text-slate-900">{email === 'other' ? t.emailProviderFeesSeparate : money(estimate.emailAnnual)}</dd></div>
                </>
              ) : null}
              {socialSummaryLabel && estimate.socialSetup > 0 ? <div className="flex justify-between gap-4"><dt className="text-slate-700">{socialSummaryLabel}</dt><dd className="font-semibold tabular-nums text-slate-900">{money(estimate.socialSetup)}</dd></div> : null}
              {hostingSummaryLabel ? <div className="flex justify-between gap-4"><dt className="text-slate-700">{hostingSummaryLabel}</dt><dd className="font-semibold tabular-nums text-slate-900">{money(estimate.hostingFirstYear)}</dd></div> : <div className="flex gap-2 rounded-lg bg-white p-3 text-xs leading-5 text-slate-700"><Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{t.ownHostingNote}</div>}
            </dl>
            <div className="mt-6 space-y-3 border-t border-slate-300 pt-5">
              <div className="flex justify-between gap-4 text-sm"><span className="text-slate-700">{t.subtotal}</span><span className="font-semibold tabular-nums text-slate-900">{money(estimate.firstYearBeforeTax)}</span></div>
              <div className="flex justify-between gap-4 text-sm"><span className="text-slate-700">{t.hst}</span><span className="font-semibold tabular-nums text-slate-900">{money(estimate.hst)}</span></div>
              <div className="flex items-end justify-between gap-4 border-t border-slate-300 pt-4"><span className="font-bold text-slate-950">{t.total}</span><span className="text-2xl font-serif font-bold tabular-nums text-primary-dark">{estimateTotalLabel}</span></div>
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-600">{t.disclaimer}</p>
            <Link href={{ pathname: '/contact', query: contactQuery }} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-center font-bold text-white transition hover:bg-primary-dark">{t.cta}</Link>
            <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-700">
              <p className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <Link href="/visibility-improvement-estimate" className="font-semibold text-primary-dark underline-offset-4 hover:underline">
                  {t.crossLinkVisibility}
                </Link>
              </p>
              <p className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <Link href="/email-reach-estimate" className="font-semibold text-primary-dark underline-offset-4 hover:underline">
                  {t.crossLinkEmail}
                </Link>
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">{t.mobileSummaryLabel}</p>
            <p className="truncate text-lg font-serif font-bold tabular-nums text-primary-dark">{estimateTotalLabel}</p>
          </div>
          <Link href={{ pathname: '/contact', query: contactQuery }} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-primary-dark">{t.cta}</Link>
        </div>
      </div>
    </section>
  )
}
