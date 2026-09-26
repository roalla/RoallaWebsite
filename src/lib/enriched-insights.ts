import type { InsightSlug } from '@/lib/insights'

export type EnrichedInsightSlug = Exclude<InsightSlug, 'is-your-website-builder-limiting-growth'>

export type InsightStep = { title: string; body: string }

export type EnrichedInsightCopy = {
  category: string
  imageAlt: string
  plainAnswer: string
  intro: readonly string[]
  exampleTitle: string
  example: string
  signsTitle: string
  signs: readonly string[]
  stepsTitle: string
  steps: readonly InsightStep[]
  takeaway: string
  ctaTitle: string
  ctaText: string
}

type InsightEntry = {
  image: string
  en: EnrichedInsightCopy
  fr: EnrichedInsightCopy
}

export const ENRICHED_INSIGHTS: Record<EnrichedInsightSlug, InsightEntry> = {
  'fractional-coo': {
    image: '/images/insights/library/fractional-coo.webp',
    en: {
      category: 'Business Operations',
      imageAlt: 'A growing-business founder works with an experienced operations leader to organize priorities.',
      plainAnswer: 'A fractional COO gives you experienced operational leadership for part of the week—without adding a full-time executive salary.',
      intro: [
        'Growth often creates a strange problem: sales are increasing, but the founder is still approving every purchase, solving every handoff and answering every urgent question. The business is bigger, yet too much still depends on one person.',
        'A fractional chief operating officer steps into that gap. They help the team decide what matters, clarify who owns what and turn plans into a weekly operating rhythm. This is hands-on leadership, not a report that sits in a folder.',
      ],
      exampleTitle: 'What this can look like',
      example: 'A 25-person service firm is winning work but missing deadlines. The founder spends every Friday rebuilding the schedule. A fractional COO creates one planning meeting, names an owner for each delivery stage and introduces three simple measures. Within weeks, problems surface earlier and the founder gets Fridays back.',
      signsTitle: 'You may be ready when…',
      signs: ['Every important decision waits for the founder.', 'Teams are busy but priorities change every week.', 'Projects fall between sales and delivery.', 'You need senior leadership, but not yet five days a week.'],
      stepsTitle: 'What good support should deliver',
      steps: [
        { title: 'Clear priorities', body: 'A short list of outcomes everyone can repeat and use to make trade-offs.' },
        { title: 'Named ownership', body: 'One accountable person for each important result—not a vague group responsibility.' },
        { title: 'A working rhythm', body: 'Simple meetings, measures and follow-up that continue after the advisor leaves.' },
      ],
      takeaway: 'You do not need a fractional COO because the business is failing. You may need one because growth has made informal ways of working too expensive.',
      ctaTitle: 'Is the founder still the operating system?',
      ctaText: 'ROALLA can help you identify where leadership capacity, process clarity or digital tools will create the most relief.',
    },
    fr: {
      category: 'Opérations d’affaires',
      imageAlt: 'Une fondatrice travaille avec un leader des opérations expérimenté pour organiser les priorités.',
      plainAnswer: 'Un COO fractionnel offre un leadership opérationnel expérimenté quelques jours par semaine—sans le salaire d’un cadre à temps plein.',
      intro: [
        'La croissance crée souvent un drôle de problème : les ventes augmentent, mais la personne fondatrice approuve encore chaque achat, règle chaque transfert et répond à chaque urgence. L’entreprise est plus grande, mais dépend toujours trop d’une seule personne.',
        'Un chef des opérations fractionnel comble cet écart. Il aide l’équipe à choisir les vraies priorités, à préciser les responsabilités et à transformer les plans en habitudes hebdomadaires. C’est du leadership pratique, pas un rapport oublié dans un dossier.',
      ],
      exampleTitle: 'À quoi cela peut ressembler',
      example: 'Une entreprise de services de 25 personnes gagne des mandats, mais manque des échéances. Chaque vendredi, la fondatrice refait l’horaire. Un COO fractionnel crée une seule rencontre de planification, nomme un responsable à chaque étape et choisit trois mesures simples. Les problèmes apparaissent plus tôt et les vendredis redeviennent disponibles.',
      signsTitle: 'Le moment est peut-être venu lorsque…',
      signs: ['Chaque décision importante attend la personne fondatrice.', 'L’équipe est occupée, mais les priorités changent chaque semaine.', 'Les projets se perdent entre la vente et la livraison.', 'Vous avez besoin de leadership senior, mais pas encore cinq jours par semaine.'],
      stepsTitle: 'Ce qu’un bon soutien devrait livrer',
      steps: [
        { title: 'Des priorités claires', body: 'Une courte liste de résultats que tout le monde peut répéter et utiliser.' },
        { title: 'Des responsables nommés', body: 'Une personne responsable de chaque résultat important.' },
        { title: 'Un rythme de travail', body: 'Des rencontres, mesures et suivis simples qui durent après le mandat.' },
      ],
      takeaway: 'Un COO fractionnel n’est pas réservé aux entreprises en difficulté. Il devient utile quand la croissance rend les méthodes informelles trop coûteuses.',
      ctaTitle: 'La personne fondatrice est-elle encore le système d’exploitation?',
      ctaText: 'ROALLA peut déterminer où la capacité de leadership, la clarté des processus ou les outils numériques offriront le plus de soulagement.',
    },
  },
  'strategic-planning': {
    image: '/images/insights/library/strategic-planning.webp',
    en: {
      category: 'Business Strategy',
      imageAlt: 'A small leadership team turns business ideas into a clear 90-day action plan.',
      plainAnswer: 'A useful strategy is not a long presentation. It is a short set of choices your team can act on this week.',
      intro: [
        'Many plans fail after the planning session. The goals sound right, but there are too many priorities, nobody owns the next move and progress is reviewed only when something goes wrong.',
        'Good planning turns ambition into decisions. It says what the team will focus on, what it will stop doing, who owns each result and how everyone will know whether the plan is working.',
      ],
      exampleTitle: 'From a wish list to a working plan',
      example: 'A company wants to grow revenue, launch a new service, improve customer retention and replace its software—all this quarter. A practical plan ranks the work, chooses one growth goal, assigns owners and gives each month a clear finish line. The team finally knows what “important” means.',
      signsTitle: 'Your plan may be too vague if…',
      signs: ['Everything is described as a priority.', 'Projects have teams but no single owner.', 'Weekly work does not connect to company goals.', 'The plan changes whenever a new idea appears.'],
      stepsTitle: 'Build a plan people can run',
      steps: [
        { title: 'Choose', body: 'Name the few outcomes that matter most and the work you will deliberately postpone.' },
        { title: 'Assign', body: 'Give every outcome one owner, a date and the resources needed to move.' },
        { title: 'Review', body: 'Use a small set of measures in a regular meeting to decide what changes next.' },
      ],
      takeaway: 'The best plan makes the next decision easier. If it cannot guide a busy Tuesday morning, it is still only a document.',
      ctaTitle: 'Turn the next 90 days into clear choices',
      ctaText: 'ROALLA helps leadership teams pressure-test priorities and build roadmaps that connect strategy, operations and digital work.',
    },
    fr: {
      category: 'Stratégie d’affaires',
      imageAlt: 'Une petite équipe de direction transforme ses idées en plan d’action clair sur 90 jours.',
      plainAnswer: 'Une stratégie utile n’est pas une longue présentation. C’est un petit nombre de choix que l’équipe peut appliquer cette semaine.',
      intro: [
        'Beaucoup de plans échouent après la rencontre de planification. Les objectifs semblent bons, mais les priorités sont trop nombreuses, personne ne porte la prochaine étape et le progrès n’est vérifié qu’en cas de problème.',
        'Une bonne planification transforme l’ambition en décisions. Elle précise le travail prioritaire, ce que l’équipe cessera de faire, qui porte chaque résultat et comment le progrès sera visible.',
      ],
      exampleTitle: 'D’une liste de souhaits à un plan exécutable',
      example: 'Une entreprise veut augmenter les revenus, lancer un service, fidéliser les clients et remplacer son logiciel pendant le même trimestre. Un plan pratique classe le travail, choisit un objectif de croissance, nomme les responsables et donne une ligne d’arrivée claire à chaque mois.',
      signsTitle: 'Votre plan est peut-être trop vague si…',
      signs: ['Tout est décrit comme prioritaire.', 'Les projets ont des équipes, mais aucun responsable unique.', 'Le travail hebdomadaire ne rejoint pas les objectifs.', 'Le plan change chaque fois qu’une nouvelle idée apparaît.'],
      stepsTitle: 'Créer un plan que l’équipe peut exécuter',
      steps: [
        { title: 'Choisir', body: 'Nommer les quelques résultats essentiels et le travail qui attendra.' },
        { title: 'Attribuer', body: 'Donner à chaque résultat un responsable, une date et les moyens nécessaires.' },
        { title: 'Réviser', body: 'Utiliser quelques mesures dans une rencontre régulière pour décider de la suite.' },
      ],
      takeaway: 'Le meilleur plan facilite la prochaine décision. S’il ne guide pas un mardi matin chargé, ce n’est encore qu’un document.',
      ctaTitle: 'Transformer les 90 prochains jours en choix clairs',
      ctaText: 'ROALLA aide les équipes de direction à tester leurs priorités et à créer des feuilles de route reliant stratégie, opérations et numérique.',
    },
  },
  'process-optimization': {
    image: '/images/insights/library/process-optimization.webp',
    en: {
      category: 'Operational Efficiency',
      imageAlt: 'A small business team replaces messy handoffs with a clear connected workflow.',
      plainAnswer: 'Process improvement means removing the waiting, copying and confusion between steps—not making people work faster.',
      intro: [
        'Most frustrating processes were not designed. They grew one workaround at a time: a spreadsheet added after a missed email, a second approval after one mistake, or a weekly report built by copying numbers from three systems.',
        'The best improvements begin by following one piece of work from start to finish. Where does it wait? Where is information entered twice? Where does nobody know who acts next? Those moments usually hide the biggest gains.',
      ],
      exampleTitle: 'A simple example',
      example: 'A service company receives quote requests through its website. One person copies them into a spreadsheet, another creates a customer record and a manager checks the shared inbox for anything missed. Connecting the form to the customer system removes two handoffs and gives everyone the same status.',
      signsTitle: 'Look for friction like…',
      signs: ['The same information is typed more than once.', 'Customers ask for updates your team cannot see quickly.', 'Reports take hours to rebuild every week.', 'Work stops when one person is away.'],
      stepsTitle: 'Improve the process in the right order',
      steps: [
        { title: 'Watch the real work', body: 'Map what people actually do, including side spreadsheets and inboxes.' },
        { title: 'Remove before automating', body: 'Delete unnecessary approvals and duplicate steps before adding technology.' },
        { title: 'Connect the useful parts', body: 'Use integrations or a focused tool where information truly needs to move.' },
      ],
      takeaway: 'Automation makes a good process faster. It can also make a bad process fail faster. Simplify first.',
      ctaTitle: 'Find the work your team should not be doing',
      ctaText: 'ROALLA can map the workflow, identify the highest-value fixes and recommend process, integration or custom-tool options.',
    },
    fr: {
      category: 'Efficacité opérationnelle',
      imageAlt: 'Une petite équipe remplace des transferts confus par un flux de travail clair et connecté.',
      plainAnswer: 'Améliorer un processus, c’est retirer l’attente, la copie et la confusion entre les étapes—pas demander aux gens de travailler plus vite.',
      intro: [
        'La plupart des processus frustrants n’ont jamais été conçus. Ils ont grandi un contournement à la fois : une feuille ajoutée après un courriel manqué, une approbation après une erreur ou un rapport produit en recopiant trois systèmes.',
        'Les meilleures améliorations suivent un travail du début à la fin. Où attend-il? Où saisit-on deux fois la même information? Où personne ne sait qui agit ensuite? Ces moments cachent souvent les meilleurs gains.',
      ],
      exampleTitle: 'Un exemple simple',
      example: 'Une entreprise reçoit des demandes de soumission sur son site. Une personne les copie dans une feuille, une autre crée le dossier client et une gestionnaire vérifie la boîte partagée. Relier le formulaire au système client retire deux transferts et donne le même statut à tous.',
      signsTitle: 'Cherchez des frictions comme…',
      signs: ['La même information est saisie plusieurs fois.', 'Les clients demandent un statut difficile à trouver.', 'Les rapports prennent des heures chaque semaine.', 'Le travail s’arrête quand une personne est absente.'],
      stepsTitle: 'Améliorer le processus dans le bon ordre',
      steps: [
        { title: 'Observer le vrai travail', body: 'Cartographier ce que les gens font, y compris les feuilles et boîtes parallèles.' },
        { title: 'Retirer avant d’automatiser', body: 'Supprimer les approbations inutiles et les étapes en double.' },
        { title: 'Connecter ce qui compte', body: 'Utiliser une intégration ou un outil ciblé lorsque l’information doit circuler.' },
      ],
      takeaway: 'L’automatisation accélère un bon processus. Elle peut aussi accélérer l’échec d’un mauvais processus. Simplifiez d’abord.',
      ctaTitle: 'Trouvez le travail que votre équipe ne devrait plus faire',
      ctaText: 'ROALLA peut cartographier le flux, repérer les corrections les plus rentables et recommander un processus, une intégration ou un outil sur mesure.',
    },
  },
  'smb-digitization-benefits': {
    image: '/images/insights/library/smb-digitization-benefits.webp',
    en: {
      category: 'Digital Enablement',
      imageAlt: 'Small-business owners take a practical first step from paper and spreadsheets to connected tools.',
      plainAnswer: 'Digitization simply means using connected tools to make everyday work easier, faster and easier to see.',
      intro: [
        'For a small business, going digital does not mean replacing everything or buying an expensive enterprise system. It means fixing the few places where paper, spreadsheets and disconnected apps slow customers or staff down.',
        'A good first project may be a form that creates a customer record automatically, online booking that updates the real calendar, or one dashboard that replaces a weekly reporting spreadsheet.',
      ],
      exampleTitle: 'Start with one painful moment',
      example: 'A landscaping company receives requests by phone, email and social media. Details are copied into a notebook before someone creates a quote. One online request form with automatic routing gives the team complete information and customers a faster reply—without changing the entire business.',
      signsTitle: 'Digitization can help when…',
      signs: ['Customer information lives in several places.', 'People wait for answers only one person can find.', 'Simple updates require repeated emails.', 'Growth means adding admin work at the same pace.'],
      stepsTitle: 'Choose the right first move',
      steps: [
        { title: 'Find repeated friction', body: 'Look for a problem customers or staff experience every week.' },
        { title: 'Connect one journey', body: 'Improve one path, such as inquiry to quote or booking to payment.' },
        { title: 'Measure the change', body: 'Track time saved, errors avoided, response speed or customer completion.' },
      ],
      takeaway: 'The best digitization project is not the biggest. It is the smallest change that removes a real constraint and creates a foundation for the next one.',
      ctaTitle: 'Choose your highest-return digital move',
      ctaText: 'ROALLA helps SMBs identify, build and connect practical tools sized to their team, budget and next stage.',
    },
    fr: {
      category: 'Accompagnement numérique',
      imageAlt: 'Des propriétaires de PME passent concrètement du papier et des feuilles aux outils connectés.',
      plainAnswer: 'La numérisation consiste simplement à utiliser des outils connectés pour rendre le travail quotidien plus facile, plus rapide et plus visible.',
      intro: [
        'Pour une PME, passer au numérique ne signifie pas tout remplacer ni acheter un système coûteux. Il s’agit de corriger les quelques endroits où le papier, les feuilles et les applications isolées ralentissent les clients ou le personnel.',
        'Un bon premier projet peut être un formulaire qui crée automatiquement un dossier client, une réservation en ligne liée au vrai calendrier ou un tableau de bord remplaçant un rapport manuel.',
      ],
      exampleTitle: 'Commencez par un moment pénible',
      example: 'Une entreprise d’aménagement reçoit des demandes par téléphone, courriel et médias sociaux. Les détails sont copiés dans un carnet avant la soumission. Un seul formulaire avec routage automatique donne une information complète à l’équipe et une réponse plus rapide au client.',
      signsTitle: 'La numérisation peut aider lorsque…',
      signs: ['L’information client vit à plusieurs endroits.', 'Les réponses dépendent d’une seule personne.', 'Une simple mise à jour exige plusieurs courriels.', 'La croissance ajoute autant de travail administratif.'],
      stepsTitle: 'Choisir le bon premier geste',
      steps: [
        { title: 'Trouver une friction répétée', body: 'Choisir un problème vécu chaque semaine par les clients ou le personnel.' },
        { title: 'Relier un parcours', body: 'Améliorer un trajet, comme demande à soumission ou réservation à paiement.' },
        { title: 'Mesurer le changement', body: 'Suivre le temps gagné, les erreurs évitées ou la vitesse de réponse.' },
      ],
      takeaway: 'Le meilleur projet numérique n’est pas le plus grand. C’est le plus petit changement qui retire une vraie contrainte et prépare la prochaine étape.',
      ctaTitle: 'Choisissez votre geste numérique le plus rentable',
      ctaText: 'ROALLA aide les PME à choisir, bâtir et connecter des outils adaptés à leur équipe, leur budget et leur prochaine étape.',
    },
  },
  'smb-digital-efficiency': {
    image: '/images/insights/library/smb-digital-efficiency.webp',
    en: {
      category: 'Digital Efficiency',
      imageAlt: 'An employee focuses on customer work while a simple connected workflow handles repetitive data movement.',
      plainAnswer: 'The fastest digital savings usually come from stopping people from copying information between systems.',
      intro: [
        'Small tasks hide large costs. Ten minutes copying a form does not feel serious, but doing it 30 times a week becomes more than 250 hours a year. Add corrections, missed follow-ups and reporting, and the cost grows quickly.',
        'Useful automation handles predictable movement: putting a website inquiry into the customer system, sending a reminder, updating a job status or combining live numbers in one dashboard.',
      ],
      exampleTitle: 'Where the savings appear',
      example: 'A distributor spends half a day every Friday combining sales, inventory and delivery spreadsheets. A lightweight dashboard reads the same sources automatically. The report takes minutes, managers see current numbers and one employee can focus on customers instead of rebuilding files.',
      signsTitle: 'Good automation candidates include…',
      signs: ['The task follows the same rules every time.', 'Information is copied from one tool to another.', 'Delays happen because someone must remember the next step.', 'Errors are easy to spot but costly to repair.'],
      stepsTitle: 'Automate without creating new problems',
      steps: [
        { title: 'Count the real cost', body: 'Include time, rework, delays and customer frustration—not just software fees.' },
        { title: 'Keep a human decision', body: 'Automate routine movement while people handle judgment and exceptions.' },
        { title: 'Monitor the result', body: 'Make failures visible and give the team a clear recovery path.' },
      ],
      takeaway: 'The goal is not to remove people. It is to remove work that prevents people from serving customers, solving problems and growing the business.',
      ctaTitle: 'How many hours are hidden in repeated work?',
      ctaText: 'ROALLA can identify quick automation wins, integration opportunities and focused tools that protect time and margin.',
    },
    fr: {
      category: 'Efficacité numérique',
      imageAlt: 'Une employée se concentre sur les clients pendant qu’un flux connecté déplace les données répétitives.',
      plainAnswer: 'Les économies numériques les plus rapides viennent souvent de l’arrêt de la copie d’information entre les systèmes.',
      intro: [
        'Les petites tâches cachent de grands coûts. Dix minutes pour recopier un formulaire semblent peu, mais 30 fois par semaine dépassent 250 heures par année. Ajoutez les corrections, les relances manquées et les rapports, et le coût augmente vite.',
        'Une automatisation utile gère les mouvements prévisibles : placer une demande Web dans le système client, envoyer un rappel, mettre à jour un statut ou réunir des chiffres en direct.',
      ],
      exampleTitle: 'Où apparaissent les économies',
      example: 'Un distributeur passe une demi-journée chaque vendredi à réunir ventes, inventaire et livraisons. Un tableau léger lit automatiquement les mêmes sources. Le rapport prend quelques minutes, les chiffres sont actuels et une personne peut se concentrer sur les clients.',
      signsTitle: 'De bons candidats à l’automatisation…',
      signs: ['La tâche suit toujours les mêmes règles.', 'L’information est copiée d’un outil à l’autre.', 'Le délai dépend de la mémoire d’une personne.', 'Les erreurs sont faciles à voir, mais coûteuses à réparer.'],
      stepsTitle: 'Automatiser sans créer de nouveaux problèmes',
      steps: [
        { title: 'Calculer le vrai coût', body: 'Inclure le temps, les reprises, les délais et la frustration client.' },
        { title: 'Garder le jugement humain', body: 'Automatiser le mouvement courant et confier les exceptions aux personnes.' },
        { title: 'Surveiller le résultat', body: 'Rendre les échecs visibles et prévoir une méthode de reprise claire.' },
      ],
      takeaway: 'Le but n’est pas de retirer des personnes. Il est de retirer le travail qui les empêche de servir, de résoudre et de développer l’entreprise.',
      ctaTitle: 'Combien d’heures se cachent dans le travail répété?',
      ctaText: 'ROALLA peut repérer les automatisations rapides, les intégrations et les outils ciblés qui protègent le temps et la marge.',
    },
  },
  'smb-digital-growth': {
    image: '/images/insights/library/smb-digital-growth.webp',
    en: {
      category: 'Digital Growth',
      imageAlt: 'A small service business handles more customers smoothly with connected digital systems.',
      plainAnswer: 'Digital growth means serving more customers without adding the same amount of delay, admin work and stress.',
      intro: [
        'Small businesses rarely win by having the biggest team. They win by being easier to trust, faster to respond and better at a specific problem. The right digital tools strengthen those advantages.',
        'A clear website builds confidence before the first call. Online booking removes back-and-forth. Connected follow-up keeps a promising inquiry from sitting in a shared inbox. Simple systems let a small team feel much larger to the customer.',
      ],
      exampleTitle: 'Growth without the usual chaos',
      example: 'A salon adds online booking, deposits and automatic reminders. Customers book after hours, no-shows drop and staff stop spending their busiest time on the phone. The business can serve more people before hiring another coordinator.',
      signsTitle: 'Your growth system is working when…',
      signs: ['Customers can take the next step without waiting.', 'Every inquiry has an owner and visible status.', 'Repeat work happens consistently without reminders.', 'Leaders see demand, capacity and results in one place.'],
      stepsTitle: 'Digitize growth in sequence',
      steps: [
        { title: 'Be easy to discover', body: 'Create a clear, credible web presence built around real customer questions.' },
        { title: 'Connect sales to delivery', body: 'Carry customer information forward without repeated forms and handoffs.' },
        { title: 'Automate at volume', body: 'Add automation where repeated work starts limiting response or capacity.' },
      ],
      takeaway: 'Technology does not create a strong offer or good service. It helps more customers experience those strengths consistently.',
      ctaTitle: 'Build the capacity for your next stage',
      ctaText: 'ROALLA connects websites, workflows and practical tools so SMBs can grow without multiplying friction.',
    },
    fr: {
      category: 'Croissance numérique',
      imageAlt: 'Une petite entreprise de services accueille plus de clients grâce à des systèmes numériques connectés.',
      plainAnswer: 'La croissance numérique permet de servir plus de clients sans ajouter la même quantité de délais, d’administration et de stress.',
      intro: [
        'Les PME gagnent rarement parce qu’elles ont la plus grande équipe. Elles gagnent parce qu’elles inspirent confiance, répondent vite et excellent dans un problème précis. Les bons outils numériques renforcent ces avantages.',
        'Un site clair crée la confiance avant le premier appel. La réservation en ligne retire les allers-retours. Un suivi connecté empêche une bonne demande de dormir dans une boîte partagée. Une petite équipe paraît beaucoup plus grande au client.',
      ],
      exampleTitle: 'Grandir sans le chaos habituel',
      example: 'Un salon ajoute la réservation en ligne, les dépôts et les rappels automatiques. Les clients réservent après les heures, les absences diminuent et le personnel passe moins de temps au téléphone. L’entreprise sert plus de gens avant d’embaucher une autre personne.',
      signsTitle: 'Votre système de croissance fonctionne lorsque…',
      signs: ['Les clients avancent sans attendre.', 'Chaque demande a un responsable et un statut visible.', 'Le travail répété se fait sans rappels constants.', 'La direction voit la demande, la capacité et les résultats.'],
      stepsTitle: 'Numériser la croissance dans le bon ordre',
      steps: [
        { title: 'Être facile à découvrir', body: 'Créer une présence claire autour des vraies questions des clients.' },
        { title: 'Relier la vente à la livraison', body: 'Transporter l’information client sans formulaires et transferts répétés.' },
        { title: 'Automatiser avec le volume', body: 'Ajouter l’automatisation quand la répétition limite la réponse ou la capacité.' },
      ],
      takeaway: 'La technologie ne crée ni une bonne offre ni un bon service. Elle aide plus de clients à vivre ces forces de façon constante.',
      ctaTitle: 'Créez la capacité nécessaire à votre prochaine étape',
      ctaText: 'ROALLA relie sites, flux et outils pratiques pour aider les PME à croître sans multiplier la friction.',
    },
  },
  'search-and-ai-visibility': {
    image: '/images/insights/library/search-and-ai-visibility.webp',
    en: {
      category: 'Online Visibility',
      imageAlt: 'A customer discovers a suitable local business through search, maps and an AI assistant.',
      plainAnswer: 'Being visible online means giving the right customer a clear reason to find, understand and trust you wherever they search.',
      intro: [
        'Your next customer may use Google, a map, a recommendation link or an AI assistant. These tools work differently, but they all need clear information about what you offer, who you help, where you work and why you are credible.',
        'That is why one visibility checklist cannot fit every business. A local electrician needs strong location and service signals. A specialist consultant needs deep answers to specific problems. A software company needs clear product information and proof.',
      ],
      exampleTitle: 'Same goal, different path',
      example: 'A homeowner searching “emergency plumber near me” values location, availability and reviews. A manufacturer searching for a compliance advisor values expertise, examples and detailed answers. Copying the same keyword strategy would weaken both businesses.',
      signsTitle: 'Clarity improves when your site answers…',
      signs: ['What do you actually do?', 'Who is the service designed for?', 'Where and how do you provide it?', 'What proof helps a customer believe you?'],
      stepsTitle: 'Build visibility around the buyer',
      steps: [
        { title: 'Learn the real questions', body: 'Use sales calls, search data and customer language instead of guessing.' },
        { title: 'Create the clearest answer', body: 'Give each important need a useful page with specific proof.' },
        { title: 'Strengthen the signals', body: 'Support the content with fast pages, accessible structure and consistent profiles.' },
      ],
      takeaway: 'Search engines and AI systems cannot confidently recommend a business they cannot clearly understand. Specificity is a marketing advantage.',
      ctaTitle: 'See how your business appears before a customer calls',
      ctaText: 'ROALLA can assess search visibility, AI readability, content clarity and conversion paths as one connected system.',
    },
    fr: {
      category: 'Visibilité en ligne',
      imageAlt: 'Une cliente découvre une entreprise locale pertinente par la recherche, les cartes et un assistant IA.',
      plainAnswer: 'Être visible en ligne signifie donner au bon client une raison claire de vous trouver, de vous comprendre et de vous faire confiance.',
      intro: [
        'Votre prochain client peut utiliser Google, une carte, un lien recommandé ou un assistant IA. Ces outils diffèrent, mais ils ont tous besoin d’une information claire sur votre offre, votre clientèle, votre territoire et votre crédibilité.',
        'Une seule liste de visibilité ne convient donc pas à toutes les entreprises. Un électricien local a besoin de signaux de lieu et de service. Une consultante spécialisée a besoin de réponses approfondies. Un logiciel a besoin d’information produit et de preuves.',
      ],
      exampleTitle: 'Même objectif, parcours différent',
      example: 'Une personne qui cherche un plombier d’urgence valorise le lieu, la disponibilité et les avis. Un fabricant qui cherche une conseillère en conformité valorise l’expertise, les exemples et les réponses détaillées. Copier la même stratégie affaiblirait les deux.',
      signsTitle: 'La clarté augmente quand votre site répond…',
      signs: ['Que faites-vous réellement?', 'À qui le service est-il destiné?', 'Où et comment l’offrez-vous?', 'Quelles preuves donnent confiance?'],
      stepsTitle: 'Bâtir la visibilité autour de l’acheteur',
      steps: [
        { title: 'Connaître les vraies questions', body: 'Utiliser les appels de vente, les données de recherche et les mots des clients.' },
        { title: 'Créer la réponse la plus claire', body: 'Donner à chaque besoin important une page utile avec des preuves précises.' },
        { title: 'Renforcer les signaux', body: 'Soutenir le contenu avec des pages rapides, accessibles et des profils cohérents.' },
      ],
      takeaway: 'Les moteurs et les IA recommandent difficilement une entreprise qu’ils comprennent mal. La précision est un avantage marketing.',
      ctaTitle: 'Voyez comment votre entreprise apparaît avant l’appel',
      ctaText: 'ROALLA peut évaluer la recherche, la lecture par l’IA, la clarté du contenu et les parcours de conversion comme un seul système.',
    },
  },
  'how-ai-systems-understand-websites': {
    image: '/images/insights/library/how-ai-systems-understand-websites.webp',
    en: {
      category: 'AI Discoverability',
      imageAlt: 'Clear information about a business website is organized into relationships an AI system can interpret.',
      plainAnswer: 'AI tools understand your business by assembling facts from your website and other public sources—not by admiring the design.',
      intro: [
        'A customer can look at colours, photography and layout and quickly sense what a business is about. An AI system looks for more direct clues: the business name, services, audience, location, expertise, policies and proof.',
        'When those facts are hidden in images, spread across pages or described differently on every profile, the system has to guess. Clear text, useful headings and consistent public information reduce that guessing.',
      ],
      exampleTitle: 'Why clear facts matter',
      example: 'A consulting firm says it offers “transformative solutions” on the homepage, lists different service names on LinkedIn and never states the regions it serves. A person may call to ask. An AI assistant may simply choose a competitor whose offer is easier to explain.',
      signsTitle: 'Make these facts easy to find',
      signs: ['Your exact organization and service names.', 'The people and problems you are best equipped to help.', 'Locations, service areas and contact details.', 'Experience, examples, policies and trustworthy proof.'],
      stepsTitle: 'Help people and machines understand you',
      steps: [
        { title: 'Say it plainly', body: 'Use direct service explanations before slogans and clever language.' },
        { title: 'Structure the page', body: 'Use real headings, descriptive links and accessible text.' },
        { title: 'Stay consistent', body: 'Keep names, descriptions and details aligned across your public presence.' },
      ],
      takeaway: 'No one can guarantee an AI citation. You can make your public information accurate, useful and much easier to interpret.',
      ctaTitle: 'Reduce the guesswork around your business',
      ctaText: 'ROALLA can review how clearly your website communicates its services, expertise and trust signals to people, search engines and AI systems.',
    },
    fr: {
      category: 'Découvrabilité par l’IA',
      imageAlt: 'L’information claire d’un site d’entreprise forme des relations qu’un système d’IA peut interpréter.',
      plainAnswer: 'Les outils d’IA comprennent votre entreprise en assemblant des faits tirés du site et d’autres sources publiques—pas en admirant la conception.',
      intro: [
        'Un client regarde les couleurs, les photos et la mise en page pour sentir rapidement ce que fait une entreprise. Un système d’IA cherche des indices directs : nom, services, clientèle, lieu, expertise, politiques et preuves.',
        'Lorsque ces faits sont cachés dans des images, dispersés ou décrits différemment sur chaque profil, le système doit deviner. Du texte clair, des titres utiles et une information publique cohérente réduisent ces suppositions.',
      ],
      exampleTitle: 'Pourquoi les faits clairs comptent',
      example: 'Une firme parle de « solutions transformatrices » sur son accueil, utilise d’autres noms de services sur LinkedIn et n’indique jamais son territoire. Une personne peut appeler. Un assistant IA peut simplement choisir un concurrent plus facile à expliquer.',
      signsTitle: 'Rendez ces faits faciles à trouver',
      signs: ['Le nom exact de l’organisation et des services.', 'Les personnes et problèmes que vous aidez le mieux.', 'Les lieux, territoires et coordonnées.', 'L’expérience, les exemples, les politiques et les preuves.'],
      stepsTitle: 'Aider les personnes et les machines à comprendre',
      steps: [
        { title: 'Le dire simplement', body: 'Expliquer directement les services avant les slogans.' },
        { title: 'Structurer la page', body: 'Utiliser de vrais titres, des liens descriptifs et du texte accessible.' },
        { title: 'Rester cohérent', body: 'Aligner les noms, descriptions et détails dans toute la présence publique.' },
      ],
      takeaway: 'Personne ne peut garantir une citation par l’IA. Vous pouvez rendre votre information exacte, utile et beaucoup plus facile à interpréter.',
      ctaTitle: 'Réduisez les suppositions autour de votre entreprise',
      ctaText: 'ROALLA peut examiner la clarté avec laquelle votre site présente services, expertise et confiance aux personnes, moteurs et systèmes d’IA.',
    },
  },
  'structured-data-for-small-business': {
    image: '/images/insights/library/structured-data-for-small-business.webp',
    en: {
      category: 'Technical Visibility',
      imageAlt: 'A polished business website sits above an organized layer of connected information blocks.',
      plainAnswer: 'Structured data is a set of labels in the website code that tells machines what information on the page represents.',
      intro: [
        'People can see that a page describes a service, an article or a local business. A search engine sees text and code. Structured data adds clear labels that say, “this is the organization,” “this is the service” and “this person wrote the article.”',
        'Visitors usually do not see these labels, but search engines and other systems can use them to understand how the information fits together. The labels must always match what the visitor can actually see.',
      ],
      exampleTitle: 'A simple local-business example',
      example: 'A clinic page visibly shows its name, address, phone number, hours and services. Matching structured data identifies those same facts as a local business. It does not invent reviews or promise a ranking; it simply removes uncertainty about what each fact means.',
      signsTitle: 'Useful starting points include…',
      signs: ['Organization or LocalBusiness details.', 'Website navigation and breadcrumb paths.', 'Accurate service, product or software information.', 'Article information for genuine editorial content.'],
      stepsTitle: 'Use structured data responsibly',
      steps: [
        { title: 'Start with visible truth', body: 'Only label information that visitors can find and verify on the page.' },
        { title: 'Keep it focused', body: 'Use the types that match the real page instead of adding every possible label.' },
        { title: 'Test and maintain', body: 'Validate the code and update it when names, URLs, hours or offers change.' },
      ],
      takeaway: 'Structured data is helpful infrastructure, not a magic ranking switch. Its value is making accurate information less ambiguous.',
      ctaTitle: 'Give your website a clearer technical foundation',
      ctaText: 'ROALLA can audit visible content, metadata and structured data together so the technical labels support the real business story.',
    },
    fr: {
      category: 'Visibilité technique',
      imageAlt: 'Un site d’entreprise soigné repose sur une couche organisée de blocs d’information connectés.',
      plainAnswer: 'Les données structurées sont des étiquettes dans le code du site qui expliquent aux machines ce que représente l’information de la page.',
      intro: [
        'Une personne voit facilement qu’une page décrit un service, un article ou une entreprise locale. Un moteur voit du texte et du code. Les données structurées ajoutent des étiquettes claires : « voici l’organisation », « voici le service » et « cette personne a écrit l’article ».',
        'Les visiteurs ne voient généralement pas ces étiquettes, mais les systèmes les utilisent pour relier l’information. Elles doivent toujours correspondre à ce que la personne peut vraiment voir.',
      ],
      exampleTitle: 'Un exemple simple d’entreprise locale',
      example: 'La page d’une clinique affiche son nom, son adresse, son téléphone, ses heures et ses services. Des données structurées correspondantes identifient ces faits comme une entreprise locale. Elles n’inventent pas d’avis et ne promettent pas un classement.',
      signsTitle: 'De bons points de départ…',
      signs: ['Les détails Organization ou LocalBusiness.', 'La navigation et les fils d’Ariane.', 'L’information exacte sur services, produits ou logiciels.', 'Les données Article pour du vrai contenu éditorial.'],
      stepsTitle: 'Utiliser les données structurées avec soin',
      steps: [
        { title: 'Partir de la vérité visible', body: 'Étiqueter seulement l’information que les visiteurs peuvent vérifier.' },
        { title: 'Rester ciblé', body: 'Utiliser les types qui correspondent à la vraie page.' },
        { title: 'Tester et maintenir', body: 'Valider le code et le mettre à jour lorsque les détails changent.' },
      ],
      takeaway: 'Les données structurées sont une infrastructure utile, pas un bouton magique de classement. Elles rendent l’information exacte moins ambiguë.',
      ctaTitle: 'Donnez à votre site une fondation technique plus claire',
      ctaText: 'ROALLA peut vérifier ensemble le contenu visible, les métadonnées et les données structurées afin que la technique soutienne le vrai message.',
    },
  },
  'professional-email-avoid-spam-phishing': {
    image: '/images/insights/library/professional-email-avoid-spam-phishing.webp',
    en: {
      category: 'Email Trust & Security',
      imageAlt: 'A business owner sends authenticated professional email that reaches a trusted customer inbox.',
      plainAnswer: 'Professional email needs two kinds of trust: an address on your own domain and technical proof that your systems are allowed to send for it.',
      intro: [
        'Email is often the first place a customer sees your business. A message from name@yourcompany.com supports the same identity as your website. A free consumer address such as yourbusiness@gmail.com or yourbusiness@outlook.com can look temporary, be easier to imitate and make a payment request or sensitive attachment feel suspicious.',
        'That does not mean Gmail or Outlook technology is unprofessional. Google Workspace and Microsoft 365 are widely used business platforms. The important difference is using them with your own domain, then configuring SPF, DKIM and DMARC so receiving systems can verify that the message really belongs to your business.',
        'Microsoft 365 does not automatically send every message from gmail.com or outlook.com to Junk. Its protection systems evaluate the individual message using authentication, the reputation of the sending address, domain and IP, complaint history, list quality, content, links, attachments, sending patterns and the recipient organization’s rules. A legitimate consumer message can reach the inbox, while a poorly configured custom-domain message can still be filtered.',
        'This is where professional help becomes valuable. Email delivery crosses your domain settings, mailbox provider, website forms, CRM, accounting platform and marketing tools. A professional can identify every legitimate sender, correct records without disrupting real mail, introduce DMARC safely, interpret technical reports and investigate false positives. That replaces guesswork with a coordinated setup and ongoing monitoring as your tools change.',
      ],
      exampleTitle: 'A professional address is not enough by itself',
      example: 'A contractor switches from a free address to quotes@company.ca, but website forms, accounting software and a newsletter tool all send email without coordinated settings. Customers still find quotes in junk, and attackers can more easily pretend to use the domain. A professional review maps every sending source, consolidates the SPF record, enables DKIM where available and begins DMARC in monitoring mode before enforcement. This protects legitimate quotes while steadily reducing impersonation risk.',
      signsTitle: 'A trustworthy email setup should include…',
      signs: [
        'Addresses on a domain your business owns and controls.',
        'SPF listing every service allowed to send for that domain.',
        'DKIM signatures that prove messages were not altered in transit.',
        'DMARC instructions that check alignment and report suspicious use.',
        'Clear sender names, consistent addresses and replies that actually work.',
        'Permission-based lists, easy unsubscribing and removal of bad addresses.',
        'Specific handling for a false positive instead of broadly allowing all of gmail.com or outlook.com.',
        'A named owner who reviews reports, investigates problems and updates the setup when services change.',
      ],
      stepsTitle: 'Set up email in the right order',
      steps: [
        { title: 'Use your own domain', body: 'Choose a managed business email provider and send as name@yourcompany.com. Google Workspace or Microsoft 365 are professional when configured this way.' },
        { title: 'Get the whole system reviewed', body: 'Ask a qualified professional to inventory your mailbox, website, CRM, invoicing and marketing tools. They can configure SPF, enable DKIM and introduce DMARC with reporting before tightening enforcement—without accidentally excluding a legitimate sender.' },
        { title: 'Monitor with evidence', body: 'Protect your reputation with expected mail, steady volumes, clean lists and sensible separation of transactional and promotional traffic. A professional can read delivery headers and DMARC reports, trace failures and submit specific false positives instead of broadly allowlisting a consumer domain.' },
      ],
      takeaway: 'Your domain is a reputation asset. A branded address creates recognition; authentication and responsible sending prove that recognition deserves trust. Professional guidance is especially useful because one incomplete record or forgotten sending tool can affect the entire system, while the right fix must protect delivery and security at the same time.',
      ctaTitle: 'Would your next important email pass a professional trust check?',
      ctaText: 'ROALLA can map every service sending on your behalf, review SPF, DKIM and DMARC, investigate delivery evidence and provide a prioritized plan. You gain a safer configuration, clearer ownership and less risk of discovering a problem through a missed customer email.',
    },
    fr: {
      category: 'Confiance et sécurité du courriel',
      imageAlt: 'Une propriétaire envoie un courriel professionnel authentifié qui atteint une boîte de réception fiable.',
      plainAnswer: 'Un courriel professionnel exige deux formes de confiance : une adresse sur votre domaine et une preuve technique que vos systèmes peuvent l’utiliser.',
      intro: [
        'Le courriel est souvent le premier contact avec votre entreprise. Un message envoyé par nom@votreentreprise.ca renforce la même identité que votre site. Une adresse grand public comme votreentreprise@gmail.com ou votreentreprise@outlook.com peut sembler temporaire, être plus facile à imiter et rendre une demande de paiement ou une pièce jointe plus suspecte.',
        'Cela ne signifie pas que la technologie Gmail ou Outlook est non professionnelle. Google Workspace et Microsoft 365 sont des plateformes d’affaires reconnues. La différence est d’utiliser votre propre domaine, puis de configurer SPF, DKIM et DMARC afin que les systèmes destinataires puissent vérifier l’origine du message.',
        'Microsoft 365 n’envoie pas automatiquement tous les messages provenant de gmail.com ou outlook.com dans les indésirables. Ses systèmes évaluent chaque message selon l’authentification, la réputation de l’adresse, du domaine et de l’adresse IP, l’historique des plaintes, la qualité des listes, le contenu, les liens, les pièces jointes, les habitudes d’envoi et les règles de l’organisation destinataire. Un message grand public légitime peut atteindre la boîte de réception, tandis qu’un domaine personnalisé mal configuré peut être filtré.',
        'C’est ici que l’accompagnement professionnel devient précieux. La livraison dépend des réglages du domaine, du fournisseur de messagerie, des formulaires Web, du CRM, de la comptabilité et des outils marketing. Une personne qualifiée peut recenser chaque expéditeur légitime, corriger les enregistrements sans interrompre les vrais messages, introduire DMARC prudemment, interpréter les rapports techniques et analyser les faux positifs. Cette coordination remplace les essais au hasard et permet un suivi lorsque les outils changent.',
      ],
      exampleTitle: 'Une adresse professionnelle ne suffit pas à elle seule',
      example: 'Un entrepreneur passe à soumissions@entreprise.ca, mais les formulaires Web, le logiciel comptable et l’outil d’infolettre envoient sans réglages coordonnés. Les soumissions vont encore dans les indésirables et des fraudeurs peuvent plus facilement imiter le domaine. Une révision professionnelle recense chaque source d’envoi, consolide le SPF, active DKIM lorsque possible et commence DMARC en mode surveillance avant de l’appliquer. Les soumissions légitimes restent protégées pendant que le risque d’usurpation diminue.',
      signsTitle: 'Une configuration digne de confiance comprend…',
      signs: [
        'Des adresses sur un domaine que l’entreprise possède et contrôle.',
        'Un SPF qui nomme tous les services autorisés à envoyer.',
        'Des signatures DKIM prouvant que le message n’a pas été modifié.',
        'Des règles DMARC qui vérifient l’alignement et signalent les usages suspects.',
        'Des noms clairs, des adresses cohérentes et des réponses fonctionnelles.',
        'Des listes consenties, un désabonnement facile et le retrait des mauvaises adresses.',
        'Un traitement ciblé des faux positifs plutôt qu’une autorisation globale de gmail.com ou outlook.com.',
        'Une personne responsable qui examine les rapports, analyse les problèmes et met les réglages à jour lorsque les services changent.',
      ],
      stepsTitle: 'Configurer le courriel dans le bon ordre',
      steps: [
        { title: 'Utiliser votre domaine', body: 'Choisir un fournisseur géré et envoyer depuis nom@votreentreprise.ca. Google Workspace ou Microsoft 365 sont professionnels lorsqu’ils sont configurés ainsi.' },
        { title: 'Faire réviser tout le système', body: 'Demander à une personne qualifiée d’inventorier la boîte, le site, le CRM, la facturation et le marketing. Elle peut configurer SPF, activer DKIM et introduire DMARC avec des rapports avant de renforcer la politique—sans oublier un expéditeur légitime.' },
        { title: 'Surveiller avec des preuves', body: 'Protéger la réputation avec des messages attendus, un volume stable, des listes propres et une séparation pertinente des courriels transactionnels et promotionnels. Une personne qualifiée peut lire les en-têtes et rapports DMARC, retracer les échecs et signaler précisément les faux positifs sans autoriser globalement un domaine grand public.' },
      ],
      takeaway: 'Votre domaine est un actif de réputation. Une adresse de marque crée la reconnaissance; l’authentification et les bonnes pratiques prouvent qu’elle mérite la confiance. Un accompagnement professionnel est particulièrement utile, car un enregistrement incomplet ou un outil oublié peut toucher tout le système, alors que la bonne correction doit protéger à la fois la livraison et la sécurité.',
      ctaTitle: 'Votre prochain courriel important passerait-il un contrôle professionnel?',
      ctaText: 'ROALLA peut recenser chaque service qui envoie en votre nom, réviser SPF, DKIM et DMARC, analyser les preuves de livraison et proposer un plan priorisé. Vous obtenez une configuration plus sûre, des responsabilités claires et moins de risque de découvrir un problème à cause d’un courriel client manqué.',
    },
  },
}

export function getEnrichedInsight(slug: EnrichedInsightSlug, locale: string) {
  const entry = ENRICHED_INSIGHTS[slug]
  return { image: entry.image, copy: locale === 'fr' ? entry.fr : entry.en }
}
