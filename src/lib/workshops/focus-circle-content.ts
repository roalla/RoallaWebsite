export type FocusSlide = {
  kicker: string;
  title: string;
  body: string;
  points?: string[];
  statement?: string;
  notes: string;
};

export type FocusChapter = { id: string; label: string; slide: number };

export type FocusPractice = {
  title: string;
  prompt: string;
  choices: string[];
  correct: number;
  response: string;
};

export type FocusGuide = { title: string; body: string; points: string[] };

export type FocusCircleCopy = {
  metaTitle: string;
  metaDescription: string;
  breadcrumbWorkshops: string;
  eyebrow: string;
  title: string;
  promise: string;
  intro: string;
  hostCta: string;
  openCta: string;
  audienceLine: string;
  listingLede: string;
  viewerLabel: string;
  viewerHelp: string;
  viewModeAria: string;
  readMode: string;
  presentMode: string;
  previous: string;
  next: string;
  slideOf: string;
  orSwipe: string;
  fullscreen: string;
  exitFullscreen: string;
  fullscreenUnavailable: string;
  chaptersLabel: string;
  discussionLabel: string;
  discussionQuestion: string;
  notesLabel: string;
  storyEyebrow: string;
  storyTitle: string;
  storyBody: string;
  storyAside: string;
  welcomeEyebrow: string;
  welcomeTitle: string;
  welcomeBody: string;
  audiences: string[];
  pillarsEyebrow: string;
  pillarsTitle: string;
  pillars: { name: string; title: string; body: string }[];
  practiceEyebrow: string;
  practiceTitle: string;
  practiceIntro: string;
  practiceOf: string;
  practiceQuestion: string;
  practiceRealLife: string;
  practiceNext: string;
  practiceRestart: string;
  practiceScore: string;
  facilitatorEyebrow: string;
  facilitatorTitle: string;
  facilitatorName: string;
  facilitatorRole: string;
  facilitatorBody: string;
  facilitatorPhotoAlt: string;
  guidesEyebrow: string;
  guidesTitle: string;
  guides: FocusGuide[];
  planEyebrow: string;
  planTitle: string;
  planIntro: string;
  planStay: string;
  planFields: { label: string; hint: string }[];
  planPlaceholder: string;
  planSaved: string;
  planPrint: string;
  planClear: string;
  downloadsEyebrow: string;
  downloadsTitle: string;
  downloadsIntro: string;
  downloads: { id: "checklist" | "kanban" | "support" | "actionPlan" | "toolkit"; label: string }[];
  qrLabel: string;
  qrTitle: string;
  qrBody: string;
  qrAlt: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  chapters: FocusChapter[];
  slides: FocusSlide[];
  practice: FocusPractice[];
};

const chaptersEn: FocusChapter[] = [
  { id: "welcome", label: "Welcome", slide: 0 },
  { id: "circle", label: "The circle", slide: 3 },
  { id: "prepare", label: "Prepare", slide: 4 },
  { id: "transform", label: "Transform", slide: 6 },
  { id: "emerge", label: "Emerge", slide: 8 },
  { id: "soar", label: "Soar", slide: 10 },
  { id: "plan", label: "Your plan", slide: 13 },
  { id: "close", label: "Close", slide: 15 },
];

const chaptersFr: FocusChapter[] = [
  { id: "welcome", label: "Accueil", slide: 0 },
  { id: "circle", label: "Le cercle", slide: 3 },
  { id: "prepare", label: "Préparer", slide: 4 },
  { id: "transform", label: "Transformer", slide: 6 },
  { id: "emerge", label: "Émerger", slide: 8 },
  { id: "soar", label: "S’élever", slide: 10 },
  { id: "plan", label: "Votre plan", slide: 13 },
  { id: "close", label: "Clôture", slide: 15 },
];

const en: FocusCircleCopy = {
  metaTitle: "Focus Circle Workshop | ROALLA",
  metaDescription:
    "A Roalla workshop for people who struggle to focus and follow through. Priorities, a simple kanban, and support from the people around you. Hosts can inquire. No public tickets.",
  breadcrumbWorkshops: "Workshops",
  eyebrow: "Roalla workshop",
  title: "Focus Circle",
  promise: "See the work. Choose what matters. Let the people around you help.",
  intro:
    "A practical workshop for people who keep restarting. It joins a personal priority, a visible board, and a clear agreement with family, friends, or teammates.",
  hostCta: "Ask about hosting this workshop",
  openCta: "Open this workshop",
  audienceLine: "Individuals, families, friends, small teams, and hosts",
  listingLede:
    "For people who care about the work and still lose the thread. Tools, priorities, and the people around you, treated as one circle.",
  viewerLabel: "Workshop presentation",
  viewerHelp: "Use Previous or Next, swipe, or the left and right arrow keys.",
  viewModeAria: "Presentation view",
  readMode: "Read these slides",
  presentMode: "Present to a group",
  previous: "Previous",
  next: "Next",
  slideOf: "Slide {current} of {total}",
  orSwipe: "or swipe",
  fullscreen: "Full screen",
  exitFullscreen: "Exit full screen",
  fullscreenUnavailable: "Full screen is unavailable in this browser. Present mode is on.",
  chaptersLabel: "Presentation chapters",
  discussionLabel: "Discussion question",
  discussionQuestion: "What is one piece of work you keep restarting?",
  notesLabel: "Speaker notes",
  storyEyebrow: "About this workshop",
  storyTitle: "Focus fails in a circle, so the fix is a circle",
  storyBody:
    "A new app rarely repairs a scattered week. Priorities stay vague, the work stays invisible, and the people who want to help cannot tell the difference between support and taking over. Focus Circle closes that loop: choose what deserves attention, put it on a board you can see, and agree how the people around you can help.",
  storyAside: "You do not need to solve the whole week in the room. You need one honest priority and one next step.",
  welcomeEyebrow: "Start here",
  welcomeTitle: "One circle, four moves",
  welcomeBody:
    "The session uses the same path Roalla uses for a business. Prepare what matters. Transform it into a visible system. Emerge with people who can see the plan. Soar with a rhythm that lasts past the workshop.",
  audiences: ["Individuals", "Families and friends", "Small teams", "Hosts"],
  pillarsEyebrow: "The four moves",
  pillarsTitle: "From a crowded week to a circle you can keep",
  pillars: [
    {
      name: "Prepare",
      title: "Name what deserves attention",
      body: "Write the one outcome that would make this week feel honest. Everything else can wait until that sentence exists.",
    },
    {
      name: "Transform",
      title: "Put the work where you can see it",
      body: "A three-column kanban: Now, Next, and Later. Now holds one card. Add one protected block, one captured open loop, and one shutdown.",
    },
    {
      name: "Emerge",
      title: "Let the right people see the plan",
      body: "Family, friends, or teammates can help only if the plan is visible. Name the help you want, and name what taking over looks like.",
    },
    {
      name: "Soar",
      title: "Keep a rhythm after the room",
      body: "One conversation, one board review, and one next step inside seven days. The review is where the circle closes.",
    },
  ],
  practiceEyebrow: "Practice",
  practiceTitle: "Can you spot the steadier first step?",
  practiceIntro:
    "Try three realistic situations. Choose what you would do first, then compare it with a steadier response. This is practice. Nothing is saved.",
  practiceOf: "Situation {current} of {total}",
  practiceQuestion: "What is the steadier first step?",
  practiceRealLife: "If this happens in real life",
  practiceNext: "Next situation",
  practiceRestart: "Try again",
  practiceScore: "{score} of {total} steadier first steps",
  facilitatorEyebrow: "Facilitator",
  facilitatorTitle: "A practical session, led in the room",
  facilitatorName: "Steven Robin",
  facilitatorRole: "Founder & Principal Consultant",
  facilitatorBody:
    "Steven facilitates the workshop the way Roalla runs an engagement: name the real priority, make the work visible, and leave with a next step someone can keep. The session is educational. It is not therapy and it is not a productivity certification.",
  facilitatorPhotoAlt: "Portrait of Steven Robin, Founder and Principal Consultant of Roalla.",
  guidesEyebrow: "Short guides",
  guidesTitle: "Use these after the room goes quiet",
  guides: [
    {
      title: "A five-minute priority reset",
      body: "Before the board fills up, name the outcome that would make the week honest.",
      points: ["Write one outcome", "Cross out what is noise", "Leave the rest for Later"],
    },
    {
      title: "A kanban you can run on paper",
      body: "Three columns are enough. The rule matters more than the tool.",
      points: ["Now holds one card", "Next is the queue", "Later is allowed to wait"],
    },
    {
      title: "Ask for help without handing over the wheel",
      body: "Support works when the kind of help is named in advance.",
      points: ["Show the board", "Offer two kinds of help", "Keep the decision with you"],
    },
    {
      title: "A shutdown that protects tomorrow",
      body: "Stop on purpose so the next start is obvious.",
      points: ["Note where you stopped", "Park open loops on Next", "Name the first card for tomorrow"],
    },
  ],
  planEyebrow: "Your action plan",
  planTitle: "Leave with three clear commitments",
  planIntro: "Write them here. They stay on this device until you clear them.",
  planStay: "Your answers stay on this device",
  planFields: [
    { label: "One priority", hint: "The outcome that would make this week honest." },
    { label: "One board change", hint: "The card that belongs in Now, and what moves to Later." },
    { label: "One person to tell", hint: "Who should see the plan, and what help you want." },
  ],
  planPlaceholder: "My answer",
  planSaved: "Saved on this device",
  planPrint: "Print or save my plan as PDF",
  planClear: "Clear my answers",
  downloadsEyebrow: "Take them home",
  downloadsTitle: "Checklists, a board, and a support card",
  downloadsIntro:
    "Blank worksheets are files you can download. The plan above prints with the answers you typed.",
  downloads: [
    { id: "checklist", label: "Download the weekly focus checklist" },
    { id: "kanban", label: "Download the kanban starter" },
    { id: "support", label: "Download the support-circle card" },
    { id: "actionPlan", label: "Download the blank action plan" },
    { id: "toolkit", label: "Download the complete toolkit" },
  ],
  qrLabel: "Workshop QR code",
  qrTitle: "One page for the room and the week after",
  qrBody: "The closing slide points back to this page, so people can revisit the slides, download the tools, and send a hosting inquiry.",
  qrAlt: "QR code for the Focus Circle workshop page",
  faqTitle: "What hosts usually ask",
  faqs: [
    {
      q: "Who is Focus Circle for?",
      a: "People who have a hard time focusing and following through, plus the family, friends, or small teams around them. Hosts can book it for a household, a team, or a community group.",
    },
    {
      q: "Can a team, household, or community host this workshop?",
      a: "Yes. There are no public tickets. Send a short inquiry and we will follow up about the group, format, language, and timing.",
    },
    {
      q: "Is this therapy or a productivity certification?",
      a: "No. The workshop is educational and facilitative. It is not therapy, coaching as treatment, or a certificate.",
    },
    {
      q: "What happens after I inquire?",
      a: "We review the request and reply within one business day with format options and a short discovery conversation. The first conversation has no fee.",
    },
  ],
  chapters: chaptersEn,
  slides: [
    {
      kicker: "Welcome",
      title: "Focus Circle",
      body: "Planning and working for a clearer week.",
      statement: "See the work. Choose what matters. Let the people around you help.",
      notes: "Welcome the room. They do not need to fix the whole week today.",
    },
    {
      kicker: "The promise",
      title: "A full circle, not another app",
      body: "Focus slips when priorities are vague, work is invisible, and the people who care cannot tell how to help.",
      points: ["A personal priority", "A board you can see", "A support agreement"],
      notes: "Name the three parts before any tool.",
    },
    {
      kicker: "Who this is for",
      title: "If you keep restarting",
      body: "This workshop is for people who care about the work and still lose the thread.",
      points: ["Individuals", "Families and friends", "Small teams", "Hosts"],
      notes: "Hosts should picture the room, not a ticketed event.",
    },
    {
      kicker: "The circle",
      title: "Prepare, Transform, Emerge, Soar",
      body: "The same path Roalla uses for a business, applied to attention.",
      points: [
        "Prepare — name what deserves attention",
        "Transform — put work where you can see it",
        "Emerge — make the plan visible to people who help",
        "Soar — keep a rhythm after the room",
      ],
      notes: "Point at each word. Do not rush the diagram.",
    },
    {
      kicker: "Prepare",
      title: "Name what deserves attention",
      body: "Before the board fills up, write the one outcome that would make this week feel honest.",
      points: ["One outcome, not a list", "What can wait", "What is noise"],
      notes: "Give two quiet minutes. Sharing is optional.",
    },
    {
      kicker: "Prepare",
      title: "A question worth answering",
      body: "What is one piece of work you keep restarting?",
      statement: "Write the name of the work, not the reason it stalled.",
      notes: "Collect a few answers only if the room is willing.",
    },
    {
      kicker: "Transform",
      title: "A board with three columns",
      body: "Now, Next, and Later. If everything is Now, nothing is.",
      points: ["Now holds one active card", "Next holds the queue", "Later is allowed to wait"],
      notes: "Draw the columns. Move one card live if you can.",
    },
    {
      kicker: "Transform",
      title: "Three focus tools",
      body: "The board shows the work. These tools protect the hour.",
      points: ["One protected block", "One open loop captured", "One shutdown before you leave it"],
      notes: "A protected block is a calendar hold, not a heroic streak.",
    },
    {
      kicker: "Emerge",
      title: "Make the plan visible",
      body: "Family, friends, and teammates cannot support a plan they cannot see.",
      points: ["Show the board", "Name the kind of help you want", "Say what taking over looks like"],
      notes: "Support is not surveillance. They do not need passwords or a blow-by-blow.",
    },
    {
      kicker: "Emerge",
      title: "Ask without handing over the wheel",
      body: "Help that starts to take over is still a focus problem.",
      points: ["Thank them", "Offer two kinds of help", "Keep the decision with you"],
      notes: "One sentence: Please ask if I am stuck. Please do not reorder my board.",
    },
    {
      kicker: "Soar",
      title: "A rhythm that survives the week",
      body: "One conversation, one board review, one next step inside seven days.",
      points: ["A short weekly review", "One Now card at a time", "A person who knows the plan"],
      notes: "The review is where the circle closes.",
    },
    {
      kicker: "Discussion",
      title: "What would you restart less?",
      body: "What is one piece of work you keep restarting?",
      statement: "The answer can be personal or professional. Both belong in the circle.",
      notes: "Two minutes in pairs if the group is comfortable.",
    },
    {
      kicker: "Practice",
      title: "Choose the steadier first step",
      body: "You will try three situations after the slides. Nothing is saved. Nothing is graded.",
      points: ["A full board", "An urgent ping", "Help that starts to take over"],
      notes: "The practice sits on this same page, below the story.",
    },
    {
      kicker: "Your plan",
      title: "Leave with three commitments",
      body: "Write them on this page. They stay on this device.",
      points: ["One priority", "One change to the board", "One person to tell"],
      notes: "Point to the action plan and give the room time.",
    },
    {
      kicker: "What you take home",
      title: "Tools you can use on Monday",
      body: "A checklist, a kanban starter, a support-circle card, and this page.",
      statement: "roalla.com/programs/workshops/focus-circle",
      notes: "Show the QR. Hosts inquire from the same page.",
    },
    {
      kicker: "Close",
      title: "Start the circle",
      body: "You do not need a perfect system. You need one priority, one visible board, and one person who knows how to help.",
      statement: "Facilitated by Steven Robin",
      notes: "Thank the host. Invite questions. Do not add a new framework.",
    },
  ],
  practice: [
    {
      title: "The full board",
      prompt: "Your Now column has nine cards. Someone says you should just power through.",
      choices: [
        "Add a tenth card so nothing is forgotten",
        "Pick one Now card, move the rest to Later, and start",
        "Delete the board and begin again tomorrow",
      ],
      correct: 1,
      response:
        "A board with one active card is a focus system. The rest can wait in Later without being abandoned.",
    },
    {
      title: "The urgent ping",
      prompt: "Halfway through a protected block, someone messages that they need this now.",
      choices: [
        "Switch immediately so they are not waiting",
        "Capture it on Next, finish the block, then decide",
        "Ignore every message for the rest of the day",
      ],
      correct: 1,
      response:
        "Urgency is a claim, not a column. Capture it, protect the block you already chose, then look with a clear head.",
    },
    {
      title: "Help that takes over",
      prompt: "A family member reorganizes your board and assigns your week for you.",
      choices: [
        "Let them. They are only trying to help.",
        "Argue about every card in front of everyone.",
        "Thank them, name the help you want, and keep the decisions",
      ],
      correct: 2,
      response:
        "Support is welcome. Taking over is a different thing. Say what help looks like, and keep the right to choose.",
    },
  ],
};

const fr: FocusCircleCopy = {
  metaTitle: "Atelier Cercle de concentration | ROALLA",
  metaDescription:
    "Un atelier Roalla pour les personnes qui peinent à se concentrer et à aller au bout. Priorités, kanban simple et soutien des proches. Les hôtes peuvent demander une session. Pas de billets publics.",
  breadcrumbWorkshops: "Ateliers",
  eyebrow: "Atelier Roalla",
  title: "Cercle de concentration",
  promise: "Voir le travail. Choisir ce qui compte. Laisser les personnes autour de vous aider.",
  intro:
    "Un atelier pratique pour les personnes qui recommencent sans cesse. Il relie une priorité personnelle, un tableau visible et un accord clair avec la famille, les amis ou l’équipe.",
  hostCta: "Demander à accueillir cet atelier",
  openCta: "Ouvrir cet atelier",
  audienceLine: "Personnes, familles, amis, petites équipes et hôtes",
  listingLede:
    "Pour les personnes qui tiennent au travail et perdent tout de même le fil. Outils, priorités et entourage, traités comme un seul cercle.",
  viewerLabel: "Présentation de l’atelier",
  viewerHelp: "Utilisez Précédent ou Suivant, un glissement, ou les flèches gauche et droite.",
  viewModeAria: "Mode de présentation",
  readMode: "Lire ces diapositives",
  presentMode: "Présenter à un groupe",
  previous: "Précédent",
  next: "Suivant",
  slideOf: "Diapositive {current} sur {total}",
  orSwipe: "ou glisser",
  fullscreen: "Plein écran",
  exitFullscreen: "Quitter le plein écran",
  fullscreenUnavailable: "Le plein écran n’est pas disponible dans ce navigateur. Le mode présentation est activé.",
  chaptersLabel: "Chapitres de la présentation",
  discussionLabel: "Question de discussion",
  discussionQuestion: "Quel travail recommencez-vous sans cesse?",
  notesLabel: "Notes de l’animateur",
  storyEyebrow: "À propos de cet atelier",
  storyTitle: "La concentration se brise en cercle, alors la réponse est un cercle",
  storyBody:
    "Une nouvelle application répare rarement une semaine dispersée. Les priorités restent floues, le travail reste invisible, et les personnes qui veulent aider ne distinguent plus le soutien de la prise de contrôle. Le Cercle de concentration ferme cette boucle : choisir ce qui mérite l’attention, le placer sur un tableau visible, et convenir de l’aide des personnes autour de vous.",
  storyAside: "Inutile de régler toute la semaine dans la salle. Il faut une priorité honnête et une prochaine étape.",
  welcomeEyebrow: "Commencer ici",
  welcomeTitle: "Un cercle, quatre mouvements",
  welcomeBody:
    "La session suit le même chemin que Roalla pour une entreprise. Préparer ce qui compte. Transformer cela en système visible. Émerger avec des personnes qui voient le plan. S’élever avec un rythme qui dure après l’atelier.",
  audiences: ["Personnes", "Familles et amis", "Petites équipes", "Hôtes"],
  pillarsEyebrow: "Les quatre mouvements",
  pillarsTitle: "D’une semaine trop pleine à un cercle tenable",
  pillars: [
    {
      name: "Préparer",
      title: "Nommer ce qui mérite l’attention",
      body: "Écrire le résultat qui rendrait cette semaine honnête. Le reste peut attendre que cette phrase existe.",
    },
    {
      name: "Transformer",
      title: "Rendre le travail visible",
      body: "Un kanban à trois colonnes : Maintenant, Ensuite et Plus tard. Maintenant ne tient qu’une carte. Ajouter un bloc protégé, une boucle capturée et une clôture.",
    },
    {
      name: "Émerger",
      title: "Laisser les bonnes personnes voir le plan",
      body: "La famille, les amis ou l’équipe n’aident que si le plan est visible. Nommer l’aide voulue, et nommer ce que serait une prise de contrôle.",
    },
    {
      name: "S’élever",
      title: "Tenir un rythme après la salle",
      body: "Une conversation, une revue du tableau et une prochaine étape dans les sept jours. La revue ferme le cercle.",
    },
  ],
  practiceEyebrow: "Pratique",
  practiceTitle: "Pouvez-vous voir le premier pas le plus stable?",
  practiceIntro:
    "Trois situations réalistes. Choisissez ce que vous feriez d’abord, puis comparez avec une réponse plus stable. C’est un exercice. Rien n’est enregistré.",
  practiceOf: "Situation {current} sur {total}",
  practiceQuestion: "Quel est le premier pas le plus stable?",
  practiceRealLife: "Si cela arrive vraiment",
  practiceNext: "Situation suivante",
  practiceRestart: "Recommencer",
  practiceScore: "{score} sur {total} premiers pas plus stables",
  facilitatorEyebrow: "Animateur",
  facilitatorTitle: "Une session pratique, menée dans la salle",
  facilitatorName: "Steven Robin",
  facilitatorRole: "Fondateur et consultant principal",
  facilitatorBody:
    "Steven anime l’atelier comme Roalla mène un mandat : nommer la vraie priorité, rendre le travail visible et repartir avec une prochaine étape tenable. La session est éducative. Ce n’est ni une thérapie ni une certification en productivité.",
  facilitatorPhotoAlt: "Portrait de Steven Robin, fondateur et consultant principal de Roalla.",
  guidesEyebrow: "Guides courts",
  guidesTitle: "À utiliser quand la salle se tait",
  guides: [
    {
      title: "Une remise à zéro en cinq minutes",
      body: "Avant que le tableau se remplisse, nommer le résultat qui rendrait la semaine honnête.",
      points: ["Écrire un résultat", "Rayer le bruit", "Laisser le reste pour Plus tard"],
    },
    {
      title: "Un kanban sur papier",
      body: "Trois colonnes suffisent. La règle compte plus que l’outil.",
      points: ["Maintenant ne tient qu’une carte", "Ensuite est la file", "Plus tard a le droit d’attendre"],
    },
    {
      title: "Demander de l’aide sans lâcher le volant",
      body: "Le soutien fonctionne quand le type d’aide est nommé d’avance.",
      points: ["Montrer le tableau", "Offrir deux formes d’aide", "Garder la décision"],
    },
    {
      title: "Une clôture qui protège demain",
      body: "S’arrêter exprès pour que le prochain départ soit évident.",
      points: ["Noter où vous vous êtes arrêté", "Garer les boucles dans Ensuite", "Nommer la première carte de demain"],
    },
  ],
  planEyebrow: "Votre plan d’action",
  planTitle: "Repartir avec trois engagements clairs",
  planIntro: "Écrivez-les ici. Ils restent sur cet appareil jusqu’à ce que vous les effaciez.",
  planStay: "Vos réponses restent sur cet appareil",
  planFields: [
    { label: "Une priorité", hint: "Le résultat qui rendrait cette semaine honnête." },
    { label: "Un changement au tableau", hint: "La carte qui va dans Maintenant, et ce qui passe à Plus tard." },
    { label: "Une personne à prévenir", hint: "Qui doit voir le plan, et quelle aide vous voulez." },
  ],
  planPlaceholder: "Ma réponse",
  planSaved: "Enregistré sur cet appareil",
  planPrint: "Imprimer ou enregistrer mon plan en PDF",
  planClear: "Effacer mes réponses",
  downloadsEyebrow: "À emporter",
  downloadsTitle: "Listes, un tableau et une carte de soutien",
  downloadsIntro:
    "Les feuilles vierges se téléchargent. Le plan ci-dessus s’imprime avec les réponses que vous avez tapées.",
  downloads: [
    { id: "checklist", label: "Télécharger la liste de concentration hebdomadaire" },
    { id: "kanban", label: "Télécharger le kanban de départ" },
    { id: "support", label: "Télécharger la carte du cercle de soutien" },
    { id: "actionPlan", label: "Télécharger le plan d’action vierge" },
    { id: "toolkit", label: "Télécharger la trousse complète" },
  ],
  qrLabel: "Code QR de l’atelier",
  qrTitle: "Une page pour la salle et la semaine d’après",
  qrBody: "La dernière diapositive renvoie à cette page, pour revoir les diapositives, télécharger les outils et envoyer une demande d’accueil.",
  qrAlt: "Code QR de la page de l’atelier Cercle de concentration",
  faqTitle: "Ce que les hôtes demandent souvent",
  faqs: [
    {
      q: "À qui s’adresse le Cercle de concentration?",
      a: "Aux personnes qui peinent à se concentrer et à aller au bout, ainsi qu’à la famille, aux amis ou à la petite équipe autour d’elles. Un hôte peut le réserver pour un foyer, une équipe ou un groupe.",
    },
    {
      q: "Une équipe, un foyer ou une communauté peut-il accueillir cet atelier?",
      a: "Oui. Il n’y a pas de billets publics. Envoyez une courte demande et nous reviendrons vers vous au sujet du groupe, du format, de la langue et du moment.",
    },
    {
      q: "Est-ce une thérapie ou une certification en productivité?",
      a: "Non. L’atelier est éducatif et animé. Ce n’est ni une thérapie, ni un traitement, ni un certificat.",
    },
    {
      q: "Que se passe-t-il après une demande?",
      a: "Nous lisons la demande et répondons en un jour ouvrable avec des options de format et une courte conversation. Cette première conversation est sans frais.",
    },
  ],
  chapters: chaptersFr,
  slides: [
    {
      kicker: "Accueil",
      title: "Cercle de concentration",
      body: "Planifier et travailler pour une semaine plus claire.",
      statement: "Voir le travail. Choisir ce qui compte. Laisser les personnes autour de vous aider.",
      notes: "Accueillir la salle. Personne n’a à réparer toute la semaine aujourd’hui.",
    },
    {
      kicker: "La promesse",
      title: "Un cercle complet, pas une autre application",
      body: "La concentration lâche quand les priorités sont floues, le travail invisible, et que les proches ne savent pas comment aider.",
      points: ["Une priorité personnelle", "Un tableau visible", "Un accord de soutien"],
      notes: "Nommer les trois parties avant tout outil.",
    },
    {
      kicker: "Pour qui",
      title: "Si vous recommencez sans cesse",
      body: "Cet atelier est pour les personnes qui tiennent au travail et perdent tout de même le fil.",
      points: ["Personnes", "Familles et amis", "Petites équipes", "Hôtes"],
      notes: "Les hôtes imaginent la salle, pas un événement à billets.",
    },
    {
      kicker: "Le cercle",
      title: "Préparer, Transformer, Émerger, S’élever",
      body: "Le même chemin que Roalla pour une entreprise, appliqué à l’attention.",
      points: [
        "Préparer — nommer ce qui mérite l’attention",
        "Transformer — rendre le travail visible",
        "Émerger — montrer le plan aux personnes qui aident",
        "S’élever — tenir un rythme après la salle",
      ],
      notes: "Montrer chaque mot. Ne pas presser le schéma.",
    },
    {
      kicker: "Préparer",
      title: "Nommer ce qui mérite l’attention",
      body: "Avant que le tableau se remplisse, écrire le résultat qui rendrait cette semaine honnête.",
      points: ["Un résultat, pas une liste", "Ce qui peut attendre", "Ce qui est du bruit"],
      notes: "Deux minutes au calme. Le partage est facultatif.",
    },
    {
      kicker: "Préparer",
      title: "Une question qui vaut une réponse",
      body: "Quel travail recommencez-vous sans cesse?",
      statement: "Écrire le nom du travail, pas la raison de l’arrêt.",
      notes: "Recueillir quelques réponses seulement si la salle le veut.",
    },
    {
      kicker: "Transformer",
      title: "Un tableau à trois colonnes",
      body: "Maintenant, Ensuite et Plus tard. Si tout est Maintenant, rien ne l’est.",
      points: ["Maintenant ne tient qu’une carte active", "Ensuite tient la file", "Plus tard a le droit d’attendre"],
      notes: "Dessiner les colonnes. Déplacer une carte en direct si possible.",
    },
    {
      kicker: "Transformer",
      title: "Trois outils de concentration",
      body: "Le tableau montre le travail. Ces outils protègent l’heure.",
      points: ["Un bloc protégé", "Une boucle ouverte capturée", "Une clôture avant de quitter"],
      notes: "Un bloc protégé est un créneau au calendrier, pas une série héroïque.",
    },
    {
      kicker: "Émerger",
      title: "Rendre le plan visible",
      body: "La famille, les amis et l’équipe ne peuvent pas soutenir un plan qu’ils ne voient pas.",
      points: ["Montrer le tableau", "Nommer l’aide voulue", "Dire à quoi ressemble une prise de contrôle"],
      notes: "Le soutien n’est pas une surveillance. Pas de mots de passe ni de compte rendu minute par minute.",
    },
    {
      kicker: "Émerger",
      title: "Demander sans lâcher le volant",
      body: "L’aide qui devient une prise de contrôle reste un problème de concentration.",
      points: ["Les remercier", "Offrir deux formes d’aide", "Garder la décision"],
      notes: "Une phrase : Demandez si je suis bloqué. Ne réordonnez pas mon tableau.",
    },
    {
      kicker: "S’élever",
      title: "Un rythme qui tient la semaine",
      body: "Une conversation, une revue du tableau, une prochaine étape dans les sept jours.",
      points: ["Une courte revue hebdomadaire", "Une carte Maintenant à la fois", "Une personne qui connaît le plan"],
      notes: "La revue est l’endroit où le cercle se ferme.",
    },
    {
      kicker: "Discussion",
      title: "Que recommenceriez-vous moins?",
      body: "Quel travail recommencez-vous sans cesse?",
      statement: "La réponse peut être personnelle ou professionnelle. Les deux ont leur place.",
      notes: "Deux minutes en paires si le groupe est à l’aise.",
    },
    {
      kicker: "Pratique",
      title: "Choisir le premier pas le plus stable",
      body: "Trois situations après les diapositives. Rien n’est enregistré. Rien n’est noté.",
      points: ["Un tableau plein", "Un message urgent", "Une aide qui prend le contrôle"],
      notes: "L’exercice est sur cette même page, sous le récit.",
    },
    {
      kicker: "Votre plan",
      title: "Repartir avec trois engagements",
      body: "Écrivez-les sur cette page. Ils restent sur cet appareil.",
      points: ["Une priorité", "Un changement au tableau", "Une personne à prévenir"],
      notes: "Montrer le plan d’action et laisser du temps.",
    },
    {
      kicker: "À emporter",
      title: "Des outils pour lundi",
      body: "Une liste, un kanban de départ, une carte de soutien, et cette page.",
      statement: "roalla.com/programs/workshops/focus-circle",
      notes: "Montrer le QR. Les hôtes envoient leur demande depuis la même page.",
    },
    {
      kicker: "Clôture",
      title: "Ouvrir le cercle",
      body: "Pas besoin d’un système parfait. Une priorité, un tableau visible, et une personne qui sait comment aider.",
      statement: "Animé par Steven Robin",
      notes: "Remercier l’hôte. Inviter les questions. Ne pas ajouter un nouveau cadre.",
    },
  ],
  practice: [
    {
      title: "Le tableau plein",
      prompt: "Votre colonne Maintenant a neuf cartes. Quelqu’un dit de foncer.",
      choices: [
        "Ajouter une dixième carte pour ne rien oublier",
        "Choisir une carte Maintenant, déplacer le reste vers Plus tard, et commencer",
        "Effacer le tableau et recommencer demain",
      ],
      correct: 1,
      response:
        "Un tableau avec une seule carte active est un système de concentration. Le reste peut attendre dans Plus tard sans être abandonné.",
    },
    {
      title: "Le message urgent",
      prompt: "Au milieu d’un bloc protégé, quelqu’un écrit qu’il en a besoin maintenant.",
      choices: [
        "Changer tout de suite pour ne pas le faire attendre",
        "Le noter dans Ensuite, finir le bloc, puis décider",
        "Ignorer tous les messages pour le reste de la journée",
      ],
      correct: 1,
      response:
        "L’urgence est une affirmation, pas une colonne. Notez-la, protégez le bloc déjà choisi, puis regardez avec la tête claire.",
    },
    {
      title: "L’aide qui prend le contrôle",
      prompt: "Un proche réorganise votre tableau et assigne votre semaine à votre place.",
      choices: [
        "Le laisser faire. Il veut seulement aider.",
        "Discuter chaque carte devant tout le monde.",
        "Le remercier, nommer l’aide voulue et garder les décisions",
      ],
      correct: 2,
      response:
        "Le soutien est bienvenu. La prise de contrôle est autre chose. Dites à quoi ressemble l’aide, et gardez le droit de choisir.",
    },
  ],
};

export function focusCircleCopy(locale: string): FocusCircleCopy {
  return locale === "fr" ? fr : en;
}

export function formatFocusTemplate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}
