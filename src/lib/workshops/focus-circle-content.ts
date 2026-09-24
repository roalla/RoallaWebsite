export type FocusStage = "overwhelm" | "prepare" | "transform" | "emerge" | "soar";

export type FocusSlideVisual =
  | "photo"
  | "overwhelm"
  | "before-after"
  | "circle"
  | "journey"
  | "priority"
  | "prompt"
  | "kanban"
  | "protect"
  | "support"
  | "support-compare"
  | "rhythm"
  | "discussion"
  | "practice"
  | "commitments"
  | "facilitator"
  | "close";

export type FocusSlide = {
  kicker: string;
  title: string;
  body: string;
  /** "Label|Supporting line" pairs. Columns use one pair per column. */
  points?: string[];
  statement?: string;
  layout?: "standard" | "columns" | "close";
  stage: FocusStage;
  visual: FocusSlideVisual;
  imageSrc?: string;
  imageAlt?: string;
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
  { id: "circle", label: "The circle", slide: 2 },
  { id: "prepare", label: "Prepare", slide: 5 },
  { id: "transform", label: "Transform", slide: 6 },
  { id: "emerge", label: "Emerge", slide: 8 },
  { id: "soar", label: "Soar", slide: 10 },
  { id: "plan", label: "Your plan", slide: 13 },
  { id: "close", label: "Close", slide: 15 },
];

const chaptersFr: FocusChapter[] = [
  { id: "welcome", label: "Accueil", slide: 0 },
  { id: "circle", label: "Le cercle", slide: 2 },
  { id: "prepare", label: "Préparer", slide: 5 },
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
      title: "Stop restarting.",
      body: "Focus Circle turns a crowded week into one clear commitment.",
      statement: "See the work. Choose what matters. Let people help.",
      stage: "overwhelm",
      visual: "photo",
      imageSrc: "/workshops/focus-circle/images/overwhelm.webp",
      imageAlt: "A person at a home workspace looking overwhelmed by competing tasks.",
      notes: "Let the image land before introducing the workshop. Ask for a show of hands: who has restarted the same piece of work this week?",
    },
    {
      kicker: "Overwhelm",
      title: "Does your week look like this?",
      body: "Nine active priorities. Constant switching. Nothing quite finished.",
      points: ["Reply", "Plan", "Fix", "Call", "Review", "Start", "Chase", "Book", "Finish"],
      statement: "When everything is Now, nothing moves.",
      stage: "overwhelm",
      visual: "overwhelm",
      notes: "Name the pattern without blaming the person. The problem is not effort; it is too many simultaneous claims on attention.",
    },
    {
      kicker: "Clarity",
      title: "Nine cards become one.",
      body: "Choosing one active card does not abandon the other eight.",
      points: [
        "Before|Nine cards compete for the same hour.",
        "After|One card moves; eight are safely parked.",
      ],
      stage: "overwhelm",
      visual: "before-after",
      notes: "This is the first emotional turn: less pressure, without losing anything. Emphasize that Later is a trusted place, not a discard pile.",
    },
    {
      kicker: "The circle",
      title: "Focus is a support system.",
      body: "Priority, visibility, and people work together.",
      points: [
        "Priority|One honest outcome.",
        "Board|One visible card in motion.",
        "People|One clear support agreement.",
      ],
      stage: "prepare",
      visual: "circle",
      notes: "Introduce Focus Circle as a system, not a productivity trick. If one part is missing, the circle opens again.",
    },
    {
      kicker: "The path",
      title: "From overwhelm to control.",
      body: "Four moves. One repeatable path.",
      points: [
        "Prepare|Choose what matters.",
        "Transform|Make the work visible.",
        "Emerge|Agree how people can help.",
        "Soar|Keep a weekly rhythm.",
      ],
      stage: "prepare",
      visual: "journey",
      notes: "Walk left to right once. The stage motif will remain on every slide so the room always knows where it is.",
    },
    {
      kicker: "Prepare",
      title: "One outcome. Then the board.",
      body: "Complete one sentence: This week will feel honest if…",
      points: [
        "Outcome|Something you can recognize as done.",
        "Wait|Work that can sit safely in Later.",
        "Noise|Anything that does not belong on the board.",
      ],
      statement: "A list is not a priority.",
      stage: "prepare",
      visual: "priority",
      notes: "Give the room two quiet minutes. Sharing is invited, not required. Help participants make the outcome observable rather than aspirational.",
    },
    {
      kicker: "Transform",
      title: "Now. Next. Later.",
      body: "A simple board gives every commitment a place.",
      layout: "columns",
      points: [
        "Now|One active card.",
        "Next|The queue, in order.",
        "Later|Allowed to wait.",
      ],
      stage: "transform",
      visual: "kanban",
      notes: "Draw the three columns. Move one real card if the room has one.",
    },
    {
      kicker: "Transform",
      title: "Protect the hour.",
      body: "The board shows the work. A small routine protects the time.",
      points: [
        "Protected block|A hold on the calendar, kept for the Now card.",
        "Open loop|Captured before it becomes an interruption.",
        "Shutdown|A note of where the work stopped.",
      ],
      stage: "transform",
      visual: "protect",
      notes: "A protected block is a calendar hold, not a streak to defend.",
    },
    {
      kicker: "Emerge",
      title: "Let the right person see the plan.",
      body: "Support starts with shared visibility—not shared control.",
      points: [
        "Show the board|The plan, not every private detail.",
        "Name the help|The specific support you want.",
        "Name the limit|What taking over would look like.",
      ],
      stage: "emerge",
      visual: "support",
      imageSrc: "/workshops/focus-circle/images/support.webp",
      imageAlt: "Two people calmly reviewing a simple paper task board together.",
      notes: "Support is not access to passwords or a running commentary.",
    },
    {
      kicker: "Emerge",
      title: "Support is not taking over.",
      body: "Make the boundary visible before anyone crosses it.",
      points: [
        "Support|Ask if I am stuck. Protect the block. Celebrate progress.",
        "Taking over|Reorder the board. Add surprise work. Make the decision for me.",
      ],
      statement: "The board stays yours to order.",
      stage: "emerge",
      visual: "support-compare",
      notes: "Offer one sentence the room can reuse: ask if I am stuck; do not reorder the board.",
    },
    {
      kicker: "Soar",
      title: "Close the circle every week.",
      body: "A light rhythm prevents another full restart.",
      points: [
        "Choose|Name the outcome.",
        "Focus|Move one card.",
        "Share|Ask for the right help.",
        "Review|Close the loop and choose again.",
      ],
      stage: "soar",
      visual: "rhythm",
      imageSrc: "/workshops/focus-circle/images/rhythm.webp",
      imageAlt: "A person calmly closing a notebook beside a simple task board and calendar.",
      notes: "The review is where the circle closes. Do not add another framework.",
    },
    {
      kicker: "Discussion",
      title: "What do you keep restarting?",
      body: "Two minutes. One honest answer.",
      statement: "The name is enough. The explanation can wait.",
      stage: "soar",
      visual: "discussion",
      notes: "Pairs, if the group is willing. One person speaks. The other only asks what the work is called.",
    },
    {
      kicker: "Practice",
      title: "Choose the steadier first step.",
      body: "Try three real situations on this page. Nothing is recorded.",
      points: [
        "A full board|Nine cards sitting in Now.",
        "An urgent message|A claim on the protected block.",
        "Help that takes over|A board reordered by someone else.",
      ],
      stage: "soar",
      visual: "practice",
      notes: "The practice is on this page, below the story. It is not a score.",
    },
    {
      kicker: "Your plan",
      title: "Make three commitments.",
      body: "Record them on this page. They stay on this device.",
      points: [
        "One priority|What will make this week honest?",
        "One board change|What moves to Now?",
        "One person|Who will see the plan—and how will they help?",
      ],
      stage: "soar",
      visual: "commitments",
      notes: "Direct the room to the action plan and leave time to write.",
    },
    {
      kicker: "Facilitated in the room",
      title: "Practical. Human. Yours to keep.",
      body: "Steven Robin guides the room from a crowded week to one sustainable next step.",
      points: [
        "Facilitated|Space to think, choose, and practice.",
        "Educational|Not therapy or a productivity certification.",
        "Take-home tools|The board, checklist, support card, and action plan stay on this page.",
      ],
      stage: "soar",
      visual: "facilitator",
      imageSrc: "/images/team/steven-robin.webp",
      imageAlt: "Steven Robin, Founder and Principal Consultant at Roalla.",
      notes: "Keep the facilitator introduction brief and return the attention to the participant's plan.",
    },
    {
      kicker: "Close",
      title: "One priority. One board. One person.",
      body: "Choose the work. Make it visible. Ask for the help you want.",
      statement: "Start before the week fills up again.",
      layout: "close",
      stage: "soar",
      visual: "close",
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
      title: "Cesser de recommencer.",
      body: "Le Cercle de concentration transforme une semaine trop pleine en un engagement clair.",
      statement: "Voir le travail. Choisir ce qui compte. Laisser les autres aider.",
      stage: "overwhelm",
      visual: "photo",
      imageSrc: "/workshops/focus-circle/images/overwhelm.webp",
      imageAlt: "Une personne à son espace de travail, dépassée par des tâches concurrentes.",
      notes: "Laisser l’image parler avant de présenter l’atelier. Demander qui a recommencé le même travail cette semaine.",
    },
    {
      kicker: "Surcharge",
      title: "Votre semaine ressemble-t-elle à ceci?",
      body: "Neuf priorités actives. Des changements constants. Rien de tout à fait terminé.",
      points: ["Répondre", "Planifier", "Réparer", "Appeler", "Réviser", "Commencer", "Relancer", "Réserver", "Finir"],
      statement: "Quand tout est Maintenant, rien n’avance.",
      stage: "overwhelm",
      visual: "overwhelm",
      notes: "Nommer la dynamique sans blâmer la personne. Le problème n’est pas l’effort, mais les demandes simultanées sur l’attention.",
    },
    {
      kicker: "Clarté",
      title: "Neuf cartes deviennent une.",
      body: "Choisir une carte active n’abandonne pas les huit autres.",
      points: [
        "Avant|Neuf cartes se disputent la même heure.",
        "Après|Une carte avance; huit sont mises à l’abri.",
      ],
      stage: "overwhelm",
      visual: "before-after",
      notes: "Premier tournant émotionnel : moins de pression sans rien perdre. Plus tard est un endroit fiable, pas une poubelle.",
    },
    {
      kicker: "Le cercle",
      title: "La concentration est un système de soutien.",
      body: "Priorité, visibilité et personnes agissent ensemble.",
      points: [
        "Priorité|Un résultat honnête.",
        "Tableau|Une carte visible en mouvement.",
        "Personnes|Un accord de soutien clair.",
      ],
      stage: "prepare",
      visual: "circle",
      notes: "Présenter le Cercle comme un système, pas une astuce de productivité. Si une partie manque, le cercle s’ouvre de nouveau.",
    },
    {
      kicker: "Le chemin",
      title: "De la surcharge au contrôle.",
      body: "Quatre mouvements. Un chemin répétable.",
      points: [
        "Préparer|Choisir ce qui compte.",
        "Transformer|Rendre le travail visible.",
        "Émerger|Convenir de l’aide souhaitée.",
        "S’élever|Garder un rythme hebdomadaire.",
      ],
      stage: "prepare",
      visual: "journey",
      notes: "Parcourir le chemin de gauche à droite. Le motif reste visible sur chaque diapositive pour situer la salle.",
    },
    {
      kicker: "Préparer",
      title: "Un résultat. Puis le tableau.",
      body: "Compléter une phrase : cette semaine sera honnête si…",
      points: [
        "Résultat|Quelque chose que vous reconnaîtrez comme terminé.",
        "Attente|Le travail qui peut rester en sécurité dans Plus tard.",
        "Bruit|Ce qui n’a pas sa place sur le tableau.",
      ],
      statement: "Une liste n’est pas une priorité.",
      stage: "prepare",
      visual: "priority",
      notes: "Accorder deux minutes de calme. Le partage est proposé, pas exigé. Rendre le résultat observable plutôt qu’aspirationnel.",
    },
    {
      kicker: "Transformer",
      title: "Maintenant. Ensuite. Plus tard.",
      body: "Un tableau simple donne une place à chaque engagement.",
      layout: "columns",
      points: [
        "Maintenant|Une carte active.",
        "Ensuite|La file, dans l’ordre.",
        "Plus tard|Le droit d’attendre.",
      ],
      stage: "transform",
      visual: "kanban",
      notes: "Dessiner les trois colonnes. Déplacer une carte réelle si la salle en a une.",
    },
    {
      kicker: "Transformer",
      title: "Protéger l’heure.",
      body: "Le tableau montre le travail. Une petite routine protège le temps.",
      points: [
        "Bloc protégé|Un créneau au calendrier, réservé à la carte Maintenant.",
        "Boucle ouverte|Notée avant qu’elle devienne une interruption.",
        "Clôture|Une note de l’endroit où le travail s’est arrêté.",
      ],
      stage: "transform",
      visual: "protect",
      notes: "Un bloc protégé est un créneau, pas une série à défendre.",
    },
    {
      kicker: "Émerger",
      title: "Montrer le plan à la bonne personne.",
      body: "Le soutien commence par une visibilité partagée, pas un contrôle partagé.",
      points: [
        "Montrer le tableau|Le plan, pas chaque détail privé.",
        "Nommer l’aide|Le soutien précis que vous voulez.",
        "Nommer la limite|À quoi ressemblerait une prise de contrôle.",
      ],
      stage: "emerge",
      visual: "support",
      imageSrc: "/workshops/focus-circle/images/support.webp",
      imageAlt: "Deux personnes examinent calmement ensemble un tableau de tâches sur papier.",
      notes: "Le soutien n’est pas l’accès aux mots de passe ni un commentaire continu.",
    },
    {
      kicker: "Émerger",
      title: "Soutenir n’est pas prendre le contrôle.",
      body: "Rendre la limite visible avant qu’elle soit franchie.",
      points: [
        "Soutenir|Demander si je bloque. Protéger le créneau. Souligner le progrès.",
        "Prendre le contrôle|Réordonner le tableau. Ajouter du travail surprise. Décider à ma place.",
      ],
      statement: "Le tableau reste le vôtre à ordonner.",
      stage: "emerge",
      visual: "support-compare",
      notes: "Proposer une phrase : demandez si je suis bloqué ; ne réordonnez pas le tableau.",
    },
    {
      kicker: "S’élever",
      title: "Refermer le cercle chaque semaine.",
      body: "Un rythme léger évite un nouveau redémarrage complet.",
      points: [
        "Choisir|Nommer le résultat.",
        "Se concentrer|Faire avancer une carte.",
        "Partager|Demander la bonne aide.",
        "Réviser|Fermer la boucle et choisir de nouveau.",
      ],
      stage: "soar",
      visual: "rhythm",
      imageSrc: "/workshops/focus-circle/images/rhythm.webp",
      imageAlt: "Une personne ferme calmement un cahier près d’un tableau de tâches et d’un calendrier simples.",
      notes: "La revue ferme le cercle. Ne pas ouvrir un nouveau cadre.",
    },
    {
      kicker: "Discussion",
      title: "Que recommencez-vous sans cesse?",
      body: "Deux minutes. Une réponse honnête.",
      statement: "Le nom suffit. L’explication peut attendre.",
      stage: "soar",
      visual: "discussion",
      notes: "En paires, si le groupe le veut. Une personne parle. L’autre demande seulement comment le travail s’appelle.",
    },
    {
      kicker: "Pratique",
      title: "Choisir le premier pas le plus stable.",
      body: "Essayer trois situations réelles sur cette page. Rien n’est enregistré.",
      points: [
        "Un tableau plein|Neuf cartes dans Maintenant.",
        "Un message urgent|Une prétention sur le bloc protégé.",
        "Une aide qui prend le contrôle|Un tableau réordonné par quelqu’un d’autre.",
      ],
      stage: "soar",
      visual: "practice",
      notes: "L’exercice est sur cette page, sous le récit. Ce n’est pas une note.",
    },
    {
      kicker: "Votre plan",
      title: "Prendre trois engagements.",
      body: "Les noter sur cette page. Ils restent sur cet appareil.",
      points: [
        "Une priorité|Qu’est-ce qui rendra cette semaine honnête?",
        "Un changement au tableau|Qu’est-ce qui passe à Maintenant?",
        "Une personne|Qui verra le plan, et comment aidera-t-elle?",
      ],
      stage: "soar",
      visual: "commitments",
      notes: "Diriger la salle vers le plan d’action et laisser le temps d’écrire.",
    },
    {
      kicker: "Animé dans la salle",
      title: "Pratique. Humain. À vous de le garder.",
      body: "Steven Robin guide la salle d’une semaine trop pleine vers une prochaine étape tenable.",
      points: [
        "Animé|Un espace pour réfléchir, choisir et pratiquer.",
        "Éducatif|Ni thérapie ni certification en productivité.",
        "Outils à emporter|Le tableau, la liste, la carte de soutien et le plan restent sur cette page.",
      ],
      stage: "soar",
      visual: "facilitator",
      imageSrc: "/images/team/steven-robin.webp",
      imageAlt: "Steven Robin, fondateur et consultant principal de Roalla.",
      notes: "Garder la présentation de l’animateur brève et ramener l’attention au plan de chaque personne.",
    },
    {
      kicker: "Clôture",
      title: "Une priorité. Un tableau. Une personne.",
      body: "Choisir le travail. Le rendre visible. Demander l’aide voulue.",
      statement: "Commencer avant que la semaine se remplisse de nouveau.",
      layout: "close",
      stage: "soar",
      visual: "close",
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
