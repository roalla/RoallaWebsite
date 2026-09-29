type ComparisonRow = {
  feature: string
  searchConsole: string
  analytics: string
}

type Phase = {
  range: string
  title: string
  body: string
}

type ComparisonCopy = {
  title: string
  intro: string
  featureHeading: string
  searchConsoleHeading: string
  analyticsHeading: string
  rows: readonly ComparisonRow[]
  note: string
  cycleTitle: string
  cycleIntro: string
  phases: readonly Phase[]
  cycleNote: string
}

const COPY: Record<'en' | 'fr', ComparisonCopy> = {
  en: {
    title: 'Search Console and GA4 answer different questions',
    intro: 'Search Console measures how your pages perform in Google Search before a visit. Google Analytics 4 measures how people use the website after they arrive, across search and other traffic sources.',
    featureHeading: 'Feature',
    searchConsoleHeading: 'Google Search Console',
    analyticsHeading: 'Google Analytics 4',
    rows: [
      { feature: 'Primary question', searchConsole: 'Can Google find, understand and present the right pages—and do searchers choose them?', analytics: 'What do visitors do after arrival, and which journeys produce meaningful business actions?' },
      { feature: 'Timing', searchConsole: 'Before the click: discovery and performance in Google Search.', analytics: 'After the click: behaviour and outcomes on the website or app.' },
      { feature: 'Core measures', searchConsole: 'Impressions, clicks, click-through rate, average position, queries, pages, devices and countries.', analytics: 'Users, sessions, engaged sessions, landing pages, events, key events and acquisition channels.' },
      { feature: 'Technical value', searchConsole: 'Indexing status, submitted sitemaps, canonical-page signals and search-performance diagnostics.', analytics: 'Tag and event validation, journey measurement, channel attribution and conversion-path analysis.' },
      { feature: 'Business value', searchConsole: 'Find demand, content gaps, weak snippets and pages losing or gaining search visibility.', analytics: 'Understand whether traffic engages, completes forms, books, buys or reaches another defined outcome.' },
      { feature: 'Website foundation required', searchConsole: 'Crawlable pages, stable URLs, clear titles and content, intentional canonicals, a useful sitemap and sound technical SEO.', analytics: 'Correct tagging, consistent events and key events, working forms, campaign conventions, consent handling and privacy-aware governance.' },
    ],
    note: 'Clicks in Search Console and sessions in GA4 are calculated differently, so the totals will not match exactly. Use each tool as the source of truth for its own part of the journey and compare trends rather than forcing identical numbers.',
    cycleTitle: 'A practical 90-day review and adjustment cycle',
    cycleIntro: 'Installing the tools is the start of measurement, not optimization. A 90-day cycle gives the business time to validate collection, observe patterns and improve the site using evidence.',
    phases: [
      { range: 'Days 1–30', title: 'Establish trustworthy measurement', body: 'Verify Search Console ownership and sitemap coverage. Confirm GA4 tags, events, key events, forms, campaign links and consent behaviour. Record a baseline before changing several things at once.' },
      { range: 'Days 31–60', title: 'Diagnose the complete journey', body: 'Compare search queries and landing pages with engagement and business outcomes. Investigate low click-through rates, irrelevant visits, broken journeys and measurement gaps by page, device and audience.' },
      { range: 'Days 61–90', title: 'Adjust, compare and prioritize', body: 'Improve the highest-value pages, snippets, content, internal links, calls to action or forms. Compare with the baseline, document what changed and choose the next focused cycle.' },
    ],
    cycleNote: 'Ninety days is a practical operating cycle, not a Google ranking promise or a fixed waiting period. High-volume sites may learn faster; low-volume and seasonal businesses may need a longer comparison window.',
  },
  fr: {
    title: 'Search Console et GA4 répondent à des questions différentes',
    intro: 'Search Console mesure le rendement des pages dans la recherche Google avant une visite. Google Analytics 4 mesure l’utilisation du site après l’arrivée, depuis la recherche et les autres sources de trafic.',
    featureHeading: 'Caractéristique',
    searchConsoleHeading: 'Google Search Console',
    analyticsHeading: 'Google Analytics 4',
    rows: [
      { feature: 'Question principale', searchConsole: 'Google peut-il trouver, comprendre et présenter les bonnes pages, et les internautes les choisissent-ils?', analytics: 'Que font les visiteurs après leur arrivée et quels parcours produisent des actions d’affaires utiles?' },
      { feature: 'Moment', searchConsole: 'Avant le clic : découverte et rendement dans la recherche Google.', analytics: 'Après le clic : comportement et résultats sur le site ou l’application.' },
      { feature: 'Mesures principales', searchConsole: 'Impressions, clics, taux de clics, position moyenne, requêtes, pages, appareils et pays.', analytics: 'Utilisateurs, sessions, sessions avec engagement, pages d’entrée, événements, événements clés et canaux.' },
      { feature: 'Valeur technique', searchConsole: 'État de l’indexation, plans de site soumis, signaux de page canonique et diagnostics de recherche.', analytics: 'Validation des balises et événements, mesure des parcours, attribution des canaux et analyse des conversions.' },
      { feature: 'Valeur d’affaires', searchConsole: 'Repérer la demande, les lacunes de contenu, les extraits faibles et les pages qui gagnent ou perdent en visibilité.', analytics: 'Comprendre si le trafic s’engage, remplit un formulaire, réserve, achète ou atteint un autre résultat défini.' },
      { feature: 'Fondation Web requise', searchConsole: 'Pages explorables, URL stables, titres et contenu clairs, règles canoniques intentionnelles, plan de site utile et bon référencement technique.', analytics: 'Balises exactes, événements cohérents, formulaires fonctionnels, conventions de campagne, gestion du consentement et gouvernance respectueuse de la vie privée.' },
    ],
    note: 'Les clics de Search Console et les sessions de GA4 sont calculés différemment; les totaux ne correspondront donc pas exactement. Utilisez chaque outil comme référence pour sa partie du parcours et comparez les tendances plutôt que d’exiger des chiffres identiques.',
    cycleTitle: 'Un cycle pratique de révision et d’ajustement sur 90 jours',
    cycleIntro: 'Installer les outils lance la mesure, pas l’optimisation. Un cycle de 90 jours permet de valider la collecte, d’observer les tendances et d’améliorer le site à partir de preuves.',
    phases: [
      { range: 'Jours 1 à 30', title: 'Établir une mesure fiable', body: 'Vérifiez la propriété Search Console et la couverture du plan de site. Confirmez balises, événements, événements clés, formulaires, liens de campagne et consentement dans GA4. Notez une référence avant plusieurs changements.' },
      { range: 'Jours 31 à 60', title: 'Diagnostiquer tout le parcours', body: 'Comparez requêtes et pages d’entrée avec engagement et résultats d’affaires. Examinez les faibles taux de clics, visites non pertinentes, parcours brisés et écarts de mesure selon page, appareil et public.' },
      { range: 'Jours 61 à 90', title: 'Ajuster, comparer et prioriser', body: 'Améliorez les pages, extraits, contenus, liens internes, appels à l’action ou formulaires les plus importants. Comparez à la référence, documentez les changements et choisissez le prochain cycle.' },
    ],
    cycleNote: 'Les 90 jours représentent un cycle de gestion pratique, non une promesse de classement Google ni une période d’attente fixe. Un site à fort volume peut apprendre plus vite; une entreprise saisonnière ou à faible volume peut avoir besoin de plus de temps.',
  },
}

export default function SearchAnalyticsComparison({ locale }: { locale: string }) {
  const copy = COPY[locale === 'fr' ? 'fr' : 'en']

  return (
    <>
      <section className="mx-auto mt-14 max-w-6xl" aria-labelledby="search-analytics-comparison-title">
        <div className="mx-auto max-w-4xl">
          <h2 id="search-analytics-comparison-title" className="text-3xl font-serif font-bold text-slate-950">{copy.title}</h2>
          <p className="mt-4 text-lg leading-8 text-slate-700">{copy.intro}</p>
        </div>

        <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full min-w-[860px] border-collapse bg-white text-left">
            <caption className="sr-only">{copy.title}</caption>
            <thead className="bg-slate-950 text-white">
              <tr>
                {[copy.featureHeading, copy.searchConsoleHeading, copy.analyticsHeading].map((heading) => (
                  <th key={heading} scope="col" className="border-r border-slate-700 px-5 py-4 text-sm font-bold leading-6 text-white last:border-r-0">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {copy.rows.map((row, index) => (
                <tr key={row.feature} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <th scope="row" className="w-[20%] border-r border-t border-slate-200 px-5 py-5 align-top font-bold leading-7 text-slate-950">{row.feature}</th>
                  <td className="w-[40%] border-r border-t border-slate-200 px-5 py-5 align-top leading-7 text-slate-700">{row.searchConsole}</td>
                  <td className="w-[40%] border-t border-slate-200 px-5 py-5 align-top leading-7 text-slate-700">{row.analytics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-4 max-w-4xl text-sm leading-6 text-slate-600">{copy.note}</p>
      </section>

      <section className="mx-auto mt-14 max-w-5xl border-t border-slate-200 pt-12" aria-labelledby="ninety-day-cycle-title">
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="ninety-day-cycle-title" className="text-3xl font-serif font-bold text-slate-950">{copy.cycleTitle}</h2>
          <p className="mt-4 text-lg leading-8 text-slate-700">{copy.cycleIntro}</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {copy.phases.map((phase) => (
            <div key={phase.range} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <span className="inline-flex rounded-full bg-primary/[0.1] px-3 py-1 text-sm font-bold text-primary-dark">{phase.range}</span>
              <h3 className="mt-5 text-xl font-serif font-bold text-slate-950">{phase.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{phase.body}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-4xl text-sm leading-6 text-slate-600">{copy.cycleNote}</p>
      </section>
    </>
  )
}
