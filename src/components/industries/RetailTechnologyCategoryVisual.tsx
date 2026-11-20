const CATEGORY_COPY = {
  en: {
    eyebrow: 'Connected retail technology',
    title: 'One retail experience, five connected technology outcomes',
    lead: 'ROALLA connects the customer journey, store operations, fulfilment, communications, and protection around the way your retail business actually runs.',
    imageAlt: 'ROALLA at the centre of five connected retail technology categories: Attract and Convert, Capture and Respond, Sell and Fulfill, Connect Teams and Locations, and Protect and Improve.',
    categories: [
      ['Attract & Convert', 'Visibility, campaigns, commerce experiences, and conversion paths.'],
      ['Capture & Respond', 'Calls, messages, inquiries, bookings, and customer follow-up.'],
      ['Sell & Fulfill', 'Point of sale, inventory, orders, payments, and delivery workflows.'],
      ['Connect Teams & Locations', 'Calling, collaboration, store connectivity, and shared operating information.'],
      ['Protect & Improve', 'Security, continuity, analytics, governance, and continuous improvement.'],
    ],
  },
  fr: {
    eyebrow: 'Technologie de détail connectée',
    title: 'Une expérience de détail, cinq résultats technologiques connectés',
    lead: 'ROALLA relie le parcours client, les opérations en magasin, l’exécution, les communications et la protection à la façon dont votre commerce fonctionne réellement.',
    imageAlt: 'ROALLA au centre de cinq catégories technologiques pour le détail : Attirer et convertir, Saisir et répondre, Vendre et exécuter, Relier équipes et établissements, et Protéger et améliorer.',
    categories: [
      ['Attirer et convertir', 'Visibilité, campagnes, expériences commerciales et parcours de conversion.'],
      ['Saisir et répondre', 'Appels, messages, demandes, réservations et suivi client.'],
      ['Vendre et exécuter', 'Point de vente, inventaire, commandes, paiements et livraison.'],
      ['Relier équipes et établissements', 'Appels, collaboration, connectivité et information opérationnelle partagée.'],
      ['Protéger et améliorer', 'Sécurité, continuité, analytique, gouvernance et amélioration continue.'],
    ],
  },
} as const

export default function RetailTechnologyCategoryVisual({ locale }: { locale: string }) {
  const french = locale === 'fr'
  const copy = CATEGORY_COPY[french ? 'fr' : 'en']
  const visualBase = `/images/industries/retail-technology-categories${french ? '.fr' : ''}`

  return (
    <section
      aria-labelledby="retail-technology-categories-title"
      className="border-b border-slate-200 bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">{copy.eyebrow}</p>
          <h2 id="retail-technology-categories-title" className="mt-3 font-serif text-3xl font-bold !text-white sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">{copy.lead}</p>
        </div>

        <picture className="mx-auto mt-10 hidden max-w-6xl md:block">
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet={`${visualBase}.webp`}
            type="image/webp"
          />
          <source srcSet={`${visualBase}.svg`} type="image/svg+xml" />
          <img
            src={`${visualBase}.webp`}
            alt={copy.imageAlt}
            width="1440"
            height="900"
            loading="lazy"
            decoding="async"
            className="h-auto w-full"
          />
        </picture>

        <ul className="mt-10 grid gap-4 md:hidden">
          {copy.categories.map(([title, description], index) => (
            <li key={title} className="rounded-2xl border border-cyan-300/20 bg-white/[0.06] p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-sm font-bold text-cyan-200">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
