export type FocusSlide = {
  kicker: string;
  title: string;
  body: string;
  /** "Label|Supporting line" pairs. Columns use one pair per column. */
  points?: string[];
  statement?: string;
  layout?: "standard" | "columns" | "close";
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
  deckFooter: string;
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
  deckFooter: "Prepare  →  Transform  →  Emerge  →  Soar",
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
      body: "Attention, priority, and the people who help you hold both.",
      statement: "See the work. Choose what matters. Let the people around you help.",
      notes: "Open the room. One honest priority is the aim of the session, not a rebuilt life.",
    },
    {
      kicker: "The session",
      title: "Three parts. One circle.",
      body: "Focus holds when the priority, the board, and the support agreement stay together.",
      points: [
        "Priority|One outcome that would make this week honest.",
        "Board|Work you can see, with one card in motion.",
        "Support|A named person, and a named kind of help.",
      ],
      notes: "State the three parts before any tool is introduced.",
    },
    {
      kicker: "The room",
      title: "Who this session is for",
      body: "A hosted workshop. There are no public tickets.",
      points: [
        "Individuals|The work is yours. The decision stays yours.",
        "Households|Family and friends who help without taking over.",
        "Teams|A shared board and a shared definition of help.",
        "Hosts|The people who convene the room.",
      ],
      notes: "Ask hosts to picture their own group, not a public event.",
    },
    {
      kicker: "The path",
      title: "Prepare. Transform. Emerge. Soar.",
      body: "The sequence Roalla uses to move from intent to a rhythm that holds.",
      points: [
        "Prepare|Name what deserves attention before the board fills.",
        "Transform|Place the work where it can be seen.",
        "Emerge|Make the plan visible to the people who help.",
        "Soar|Keep one review after the room is gone.",
      ],
      notes: "Move through the four words in order. Do not add a fifth.",
    },
    {
      kicker: "Prepare",
      title: "One outcome. Then the board.",
      body: "A list is not a priority. Write the sentence first.",
      points: [
        "The outcome|What would make this week honest.",
        "The wait|What can sit in Later without being abandoned.",
        "The noise|What does not belong on the board at all.",
      ],
      notes: "Two quiet minutes. Sharing is invited, not required.",
    },
    {
      kicker: "Prepare",
      title: "Write the name of the work.",
      body: "What is one piece of work you keep restarting?",
      statement: "The name is enough. The explanation can wait.",
      notes: "Private writing. Collect answers only if the room offers them.",
    },
    {
      kicker: "Transform",
      title: "Now. Next. Later.",
      body: "If every card is Now, nothing is in motion.",
      layout: "columns",
      points: [
        "Now|One active card.",
        "Next|The queue, in order.",
        "Later|Allowed to wait.",
      ],
      notes: "Draw the three columns. Move one real card if the room has one.",
    },
    {
      kicker: "Transform",
      title: "Three tools that protect the hour",
      body: "The board shows the work. These tools protect the time.",
      points: [
        "Protected block|A hold on the calendar, kept for the Now card.",
        "Open loop|Captured before it becomes an interruption.",
        "Shutdown|A note of where the work stopped.",
      ],
      notes: "A protected block is a calendar hold, not a streak to defend.",
    },
    {
      kicker: "Emerge",
      title: "A plan no one can see cannot be supported",
      body: "Family, friends, and teammates can help only what they can see.",
      points: [
        "Show the board|The plan, not every private detail.",
        "Name the help|The specific support you want.",
        "Name the limit|What taking over would look like.",
      ],
      notes: "Support is not access to passwords or a running commentary.",
    },
    {
      kicker: "Emerge",
      title: "Help, without handing over the decision",
      body: "Support is welcome. Taking over is a different agreement.",
      points: [
        "Acknowledge|Thank them for stepping in.",
        "Offer two choices|Two kinds of help, both acceptable.",
        "Keep the decision|The board stays yours to order.",
      ],
      notes: "Offer one sentence the room can reuse: ask if I am stuck; do not reorder the board.",
    },
    {
      kicker: "Soar",
      title: "A rhythm that outlasts the room",
      body: "Three commitments, inside seven days.",
      points: [
        "One conversation|With the person who should see the plan.",
        "One review|Of the board, placed on the calendar.",
        "One next step|Small enough to finish.",
      ],
      notes: "The review is where the circle closes. Do not add another framework.",
    },
    {
      kicker: "Discussion",
      title: "Two minutes. One answer.",
      body: "What is one piece of work you keep restarting?",
      statement: "Personal or professional. Both belong in the circle.",
      notes: "Pairs, if the group is willing. One person speaks. The other only asks what the work is called.",
    },
    {
      kicker: "Practice",
      title: "Choose the steadier first step",
      body: "Three situations follow the slides. Nothing is recorded.",
      points: [
        "A full board|Nine cards sitting in Now.",
        "An urgent message|A claim on the protected block.",
        "Help that takes over|A board reordered by someone else.",
      ],
      notes: "The practice is on this page, below the story. It is not a score.",
    },
    {
      kicker: "Your plan",
      title: "Leave with three commitments",
      body: "Record them on this page. They remain on this device.",
      points: [
        "One priority|The outcome for this week.",
        "One board change|What moves to Now, and what moves to Later.",
        "One person|Who will see the plan, and how they will help.",
      ],
      notes: "Direct the room to the action plan and leave time to write.",
    },
    {
      kicker: "What you take",
      title: "Use these on Monday",
      body: "The worksheets live on this page. The closing slide returns the room here.",
      points: [
        "Checklist|A weekly reset, in order.",
        "Kanban starter|Now, Next, and Later.",
        "Support card|The help you want, and the help you do not.",
      ],
      notes: "Name the three files. Do not walk through every line.",
    },
    {
      kicker: "Close",
      title: "Begin with one circle.",
      body: "One priority. One visible board. One person who knows how to help.",
      statement: "Facilitated by Steven Robin",
      layout: "close",
      notes: "Show the code. Thank the host. Take questions. Do not open a new model.",
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
  deckFooter: "Préparer  →  Transformer  →  Émerger  →  S’élever",
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
      body: "L’attention, la priorité, et les personnes qui aident à tenir les deux.",
      statement: "Voir le travail. Choisir ce qui compte. Laisser les personnes autour de vous aider.",
      notes: "Ouvrir la salle. L’objectif est une priorité honnête, pas une vie reconstruite.",
    },
    {
      kicker: "La session",
      title: "Trois parties. Un cercle.",
      body: "La concentration tient quand la priorité, le tableau et l’accord de soutien restent ensemble.",
      points: [
        "Priorité|Un résultat qui rendrait cette semaine honnête.",
        "Tableau|Un travail visible, avec une carte en mouvement.",
        "Soutien|Une personne nommée, et une forme d’aide nommée.",
      ],
      notes: "Énoncer les trois parties avant tout outil.",
    },
    {
      kicker: "La salle",
      title: "À qui s’adresse cette session",
      body: "Un atelier accueilli. Il n’y a pas de billets publics.",
      points: [
        "Personnes|Le travail vous appartient. La décision aussi.",
        "Foyers|Famille et amis qui aident sans prendre le contrôle.",
        "Équipes|Un tableau commun et une définition commune de l’aide.",
        "Hôtes|Les personnes qui réunissent la salle.",
      ],
      notes: "Demander aux hôtes d’imaginer leur groupe, pas un événement public.",
    },
    {
      kicker: "Le chemin",
      title: "Préparer. Transformer. Émerger. S’élever.",
      body: "La séquence que Roalla utilise pour passer de l’intention à un rythme qui tient.",
      points: [
        "Préparer|Nommer ce qui mérite l’attention avant que le tableau se remplisse.",
        "Transformer|Placer le travail là où on peut le voir.",
        "Émerger|Rendre le plan visible aux personnes qui aident.",
        "S’élever|Tenir une revue après que la salle s’est tue.",
      ],
      notes: "Suivre les quatre mots dans l’ordre. Ne pas en ajouter un cinquième.",
    },
    {
      kicker: "Préparer",
      title: "Un résultat. Puis le tableau.",
      body: "Une liste n’est pas une priorité. Écrire la phrase d’abord.",
      points: [
        "Le résultat|Ce qui rendrait cette semaine honnête.",
        "L’attente|Ce qui peut rester dans Plus tard sans être abandonné.",
        "Le bruit|Ce qui n’a pas sa place sur le tableau.",
      ],
      notes: "Deux minutes au calme. Le partage est proposé, pas exigé.",
    },
    {
      kicker: "Préparer",
      title: "Écrire le nom du travail.",
      body: "Quel travail recommencez-vous sans cesse?",
      statement: "Le nom suffit. L’explication peut attendre.",
      notes: "Écriture privée. Recueillir des réponses seulement si la salle les offre.",
    },
    {
      kicker: "Transformer",
      title: "Maintenant. Ensuite. Plus tard.",
      body: "Si chaque carte est Maintenant, rien n’est en mouvement.",
      layout: "columns",
      points: [
        "Maintenant|Une carte active.",
        "Ensuite|La file, dans l’ordre.",
        "Plus tard|Le droit d’attendre.",
      ],
      notes: "Dessiner les trois colonnes. Déplacer une carte réelle si la salle en a une.",
    },
    {
      kicker: "Transformer",
      title: "Trois outils qui protègent l’heure",
      body: "Le tableau montre le travail. Ces outils protègent le temps.",
      points: [
        "Bloc protégé|Un créneau au calendrier, réservé à la carte Maintenant.",
        "Boucle ouverte|Notée avant qu’elle devienne une interruption.",
        "Clôture|Une note de l’endroit où le travail s’est arrêté.",
      ],
      notes: "Un bloc protégé est un créneau, pas une série à défendre.",
    },
    {
      kicker: "Émerger",
      title: "Un plan invisible ne peut pas être soutenu",
      body: "La famille, les amis et l’équipe n’aident que ce qu’ils peuvent voir.",
      points: [
        "Montrer le tableau|Le plan, pas chaque détail privé.",
        "Nommer l’aide|Le soutien précis que vous voulez.",
        "Nommer la limite|À quoi ressemblerait une prise de contrôle.",
      ],
      notes: "Le soutien n’est pas l’accès aux mots de passe ni un commentaire continu.",
    },
    {
      kicker: "Émerger",
      title: "Aider, sans céder la décision",
      body: "Le soutien est bienvenu. La prise de contrôle est un autre accord.",
      points: [
        "Reconnaître|Les remercier d’être intervenus.",
        "Offrir deux choix|Deux formes d’aide, toutes deux acceptables.",
        "Garder la décision|Le tableau reste le vôtre à ordonner.",
      ],
      notes: "Proposer une phrase : demandez si je suis bloqué ; ne réordonnez pas le tableau.",
    },
    {
      kicker: "S’élever",
      title: "Un rythme qui dure après la salle",
      body: "Trois engagements, dans les sept jours.",
      points: [
        "Une conversation|Avec la personne qui doit voir le plan.",
        "Une revue|Du tableau, inscrite au calendrier.",
        "Une prochaine étape|Assez petite pour être terminée.",
      ],
      notes: "La revue ferme le cercle. Ne pas ouvrir un nouveau cadre.",
    },
    {
      kicker: "Discussion",
      title: "Deux minutes. Une réponse.",
      body: "Quel travail recommencez-vous sans cesse?",
      statement: "Personnel ou professionnel. Les deux ont leur place.",
      notes: "En paires, si le groupe le veut. Une personne parle. L’autre demande seulement comment le travail s’appelle.",
    },
    {
      kicker: "Pratique",
      title: "Choisir le premier pas le plus stable",
      body: "Trois situations suivent les diapositives. Rien n’est enregistré.",
      points: [
        "Un tableau plein|Neuf cartes dans Maintenant.",
        "Un message urgent|Une prétention sur le bloc protégé.",
        "Une aide qui prend le contrôle|Un tableau réordonné par quelqu’un d’autre.",
      ],
      notes: "L’exercice est sur cette page, sous le récit. Ce n’est pas une note.",
    },
    {
      kicker: "Votre plan",
      title: "Repartir avec trois engagements",
      body: "Notez-les sur cette page. Ils restent sur cet appareil.",
      points: [
        "Une priorité|Le résultat de cette semaine.",
        "Un changement au tableau|Ce qui passe à Maintenant, et ce qui passe à Plus tard.",
        "Une personne|Qui verra le plan, et comment elle aidera.",
      ],
      notes: "Diriger la salle vers le plan d’action et laisser le temps d’écrire.",
    },
    {
      kicker: "À emporter",
      title: "À utiliser dès lundi",
      body: "Les feuilles sont sur cette page. La diapositive de clôture y ramène la salle.",
      points: [
        "Liste|Une remise à zéro hebdomadaire, dans l’ordre.",
        "Kanban de départ|Maintenant, Ensuite et Plus tard.",
        "Carte de soutien|L’aide voulue, et l’aide refusée.",
      ],
      notes: "Nommer les trois fichiers. Ne pas lire chaque ligne.",
    },
    {
      kicker: "Clôture",
      title: "Commencer par un cercle.",
      body: "Une priorité. Un tableau visible. Une personne qui sait comment aider.",
      statement: "Animé par Steven Robin",
      layout: "close",
      notes: "Montrer le code. Remercier l’hôte. Prendre les questions. Ne pas ouvrir un nouveau modèle.",
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
