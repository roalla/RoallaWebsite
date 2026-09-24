import { decisionHourCopy, ideationCopy, offerPageCopy } from "@/lib/workshops/added-workshops-content";

export type CompanionWorkshopId = "workload-conversation" | "digital-calm" | "decision-hour" | "offer-page" | "ideation";
export type WorkshopStage = "prepare" | "transform" | "emerge" | "soar";

export type WorkshopSlide = {
  kicker: string;
  title: string;
  body: string;
  stage: WorkshopStage;
  visual: "photo" | "load" | "path" | "map" | "separate" | "choices" | "script" | "practice" | "rhythm" | "plan" | "tools" | "close";
  points?: string[];
  statement?: string;
  notes: string;
};

export type WorkshopPractice = {
  title: string;
  prompt: string;
  choices: string[];
  correct: number;
  response: string;
};

export type CompanionWorkshopCopy = {
  id: CompanionWorkshopId;
  path: `/programs/workshops/${CompanionWorkshopId}`;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  promise: string;
  intro: string;
  listingLede: string;
  audienceLine: string;
  heroImage: string;
  heroAlt: string;
  hostCta: string;
  workshopsLabel: string;
  notesLabel: string;
  viewerLabel: string;
  viewerHelp: string;
  readMode: string;
  presentMode: string;
  previous: string;
  next: string;
  fullscreen: string;
  exitFullscreen: string;
  slideOf: string;
  stages: string[];
  storyEyebrow: string;
  storyTitle: string;
  storyBody: string;
  storyAside: string;
  frameworkEyebrow: string;
  frameworkTitle: string;
  framework: { name: string; title: string; body: string }[];
  practiceEyebrow: string;
  practiceTitle: string;
  practiceIntro: string;
  practiceQuestion: string;
  practiceNext: string;
  practiceRestart: string;
  practiceScore: string;
  planEyebrow: string;
  planTitle: string;
  planIntro: string;
  planFields: { label: string; hint: string }[];
  planPlaceholder: string;
  planSaved: string;
  planPrint: string;
  planClear: string;
  toolsEyebrow: string;
  toolsTitle: string;
  tools: { title: string; body: string; points: string[] }[];
  facilitatorEyebrow: string;
  facilitatorTitle: string;
  facilitatorBody: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  slides: WorkshopSlide[];
  practice: WorkshopPractice[];
};

const commonEn = {
  hostCta: "Ask about hosting this workshop",
  workshopsLabel: "Workshops",
  notesLabel: "Speaker notes",
  viewerLabel: "Workshop presentation",
  viewerHelp: "Use Previous or Next, swipe, or the left and right arrow keys.",
  readMode: "Read these slides",
  presentMode: "Present to a group",
  previous: "Previous",
  next: "Next",
  fullscreen: "Full screen",
  exitFullscreen: "Exit full screen",
  slideOf: "Slide {current} of {total}",
  stages: ["Prepare", "Transform", "Emerge", "Soar"],
  practiceEyebrow: "Practice",
  practiceQuestion: "What is the steadier first step?",
  practiceNext: "Next situation",
  practiceRestart: "Try again",
  practiceScore: "{score} of {total} steadier first steps",
  planPlaceholder: "My answer",
  planSaved: "Saved on this device",
  planPrint: "Print or save my plan as PDF",
  planClear: "Clear my answers",
  facilitatorEyebrow: "Facilitator",
  facilitatorTitle: "A practical session, led in the room",
  facilitatorBody: "Steven Robin facilitates the workshop through teaching, private reflection, paired practice, and concrete commitments. The session is educational—not therapy, medical advice, or an employment assessment.",
  faqTitle: "What hosts usually ask",
};

const commonFr = {
  hostCta: "Demander à accueillir cet atelier",
  workshopsLabel: "Ateliers",
  notesLabel: "Notes de l’animateur",
  viewerLabel: "Présentation de l’atelier",
  viewerHelp: "Utilisez Précédent ou Suivant, un glissement, ou les flèches gauche et droite.",
  readMode: "Lire ces diapositives",
  presentMode: "Présenter à un groupe",
  previous: "Précédent",
  next: "Suivant",
  fullscreen: "Plein écran",
  exitFullscreen: "Quitter le plein écran",
  slideOf: "Diapositive {current} sur {total}",
  stages: ["Préparer", "Transformer", "Émerger", "S’élever"],
  practiceEyebrow: "Pratique",
  practiceQuestion: "Quel est le premier pas le plus stable?",
  practiceNext: "Situation suivante",
  practiceRestart: "Recommencer",
  practiceScore: "{score} sur {total} premiers pas plus stables",
  planPlaceholder: "Ma réponse",
  planSaved: "Enregistré sur cet appareil",
  planPrint: "Imprimer ou enregistrer mon plan en PDF",
  planClear: "Effacer mes réponses",
  facilitatorEyebrow: "Animateur",
  facilitatorTitle: "Une session pratique, menée dans la salle",
  facilitatorBody: "Steven Robin anime l’atelier par l’enseignement, la réflexion privée, la pratique en duo et des engagements concrets. La session est éducative—ce n’est ni une thérapie, ni un avis médical, ni une évaluation d’emploi.",
  faqTitle: "Ce que les hôtes demandent souvent",
};

const workloadEn: CompanionWorkshopCopy = {
  ...commonEn,
  id: "workload-conversation",
  path: "/programs/workshops/workload-conversation",
  metaTitle: "The Workload Conversation Workshop | ROALLA",
  metaDescription: "A practical ROALLA workshop for making workload visible, discussing capacity early, and agreeing honest trade-offs before overload becomes burnout.",
  eyebrow: "Roalla workshop",
  title: "The Workload Conversation",
  promise: "Talk about capacity before someone reaches the breaking point.",
  intro: "A facilitated workshop for teams that need a safer, clearer way to discuss workload, constraints, priorities, and trade-offs—without blame or silent endurance.",
  listingLede: "Make invisible work visible, replace vague pressure with concrete capacity choices, and leave with a shared language for early workload conversations.",
  audienceLine: "Leaders, managers, employees, project teams, and people partners",
  heroImage: "/workshops/workload-conversation/hero.webp",
  heroAlt: "Two colleagues having a calm workload conversation over a simple capacity map.",
  storyEyebrow: "Why this workshop",
  storyTitle: "Overload is often visible only after the damage",
  storyBody: "People rarely carry only assigned tasks. Coordination, interruptions, emotional labour, unfinished work, and unclear ownership consume capacity too. When that work remains invisible, every new request sounds individually reasonable—even when the whole load is not.",
  storyAside: "Adding work requires a decision about existing work.",
  frameworkEyebrow: "The four moves",
  frameworkTitle: "From silent overload to shared commitments",
  framework: [
    { name: "Prepare", title: "Make the full load visible", body: "Map assigned work, coordination, interruptions, and hidden maintenance before discussing performance." },
    { name: "Transform", title: "Turn pressure into choices", body: "Separate facts from interpretations, then decide what stays, moves, stops, or needs support." },
    { name: "Emerge", title: "Hold the conversation", body: "Use direct, non-accusatory language and keep trade-off authority with the person who can make it." },
    { name: "Soar", title: "Check capacity early", body: "Use a short recurring signal so the conversation happens before missed work or exhaustion." },
  ],
  practiceTitle: "Can you hear the useful conversation underneath the pressure?",
  practiceIntro: "Work through three realistic capacity moments. Choose the response that creates clarity without minimizing the person or promising the impossible.",
  planEyebrow: "Your capacity agreement",
  planTitle: "Leave with three decisions",
  planIntro: "Record a real workload conversation you can begin within seven days. Your answers stay on this device.",
  planFields: [
    { label: "One load to make visible", hint: "The assigned or invisible work that needs to be named." },
    { label: "One trade-off to request", hint: "What should stay, move, stop, or receive support?" },
    { label: "One capacity check-in", hint: "Who needs to talk, when, and what signal will you use?" },
  ],
  toolsEyebrow: "Take-home tools",
  toolsTitle: "Use the language when the room gets busy again",
  tools: [
    { title: "Capacity map", body: "See the whole load before evaluating any one task.", points: ["Assigned work", "Invisible coordination", "Interruptions", "Recovery margin"] },
    { title: "Stop / Move / Support card", body: "Turn a new request into an explicit trade-off.", points: ["What stays?", "What moves?", "What stops?", "What support changes the answer?"] },
    { title: "Conversation script", body: "Keep facts, impact, and the requested decision separate.", points: ["Here is the current load", "Here is the impact", "Here is the choice we need"] },
    { title: "Weekly capacity signal", body: "Raise the flag while choices still exist.", points: ["Green: stable", "Amber: trade-off needed", "Red: commitment at risk"] },
  ],
  faqs: [
    { q: "Is this a performance-management workshop?", a: "No. It teaches a shared capacity language and decision process. It does not assess employees or replace HR policies." },
    { q: "Can managers and employees attend together?", a: "Yes. The workshop is strongest when people with different decision rights can practise how workload information moves upward and choices move back clearly." },
    { q: "Does the workshop address burnout?", a: "It addresses preventable workload ambiguity and early conversations. It is educational and not medical or therapeutic care." },
    { q: "Can it be adapted for project or client-service teams?", a: "Yes. Scenarios and capacity maps can be tailored to delivery teams, operations, professional services, or leadership groups." },
  ],
  slides: [
    { kicker: "Welcome", title: "Say it before the breaking point.", body: "A better workload conversation starts before the missed deadline, the resignation, or the crisis.", stage: "prepare", visual: "photo", statement: "Capacity is information—not a confession.", notes: "Open with recognition, not diagnosis. Invite participants to think of a recent moment when capacity became visible too late." },
    { kicker: "The hidden load", title: "The calendar is not the whole workload.", body: "Assigned tasks sit beside coordination, interruptions, emotional labour, and unfinished work.", stage: "prepare", visual: "load", points: ["Assigned|Visible commitments", "Coordinate|Updates, handoffs, follow-up", "Interrupt|Urgent claims and context switching", "Carry|Open loops and emotional load"], notes: "Ask which category is least visible in the group’s current planning." },
    { kicker: "The path", title: "Visible load. Honest choices. Shared commitments.", body: "Four moves turn pressure into a decision the team can hold.", stage: "prepare", visual: "path", points: ["Prepare|See the full load", "Transform|Name the trade-off", "Emerge|Hold the conversation", "Soar|Check capacity early"], notes: "Walk the four moves once. Keep returning to them throughout the session." },
    { kicker: "Prepare", title: "Map what the person is actually carrying.", body: "Start with facts: commitments, deadlines, dependencies, interruptions, and available margin.", stage: "prepare", visual: "map", points: ["Work|What must be delivered", "Time|What is already committed", "Dependencies|Who or what controls progress", "Margin|What absorbs change"], notes: "Do not use the map to prove someone should handle more. Use it to see the system." },
    { kicker: "Transform", title: "Separate the facts from the story.", body: "Clarity improves when observation, impact, and interpretation stop masquerading as one sentence.", stage: "transform", visual: "separate", points: ["Fact|Seven active commitments; two share a deadline", "Impact|The client review and payroll change cannot both finish Friday", "Story|Nobody respects my time"], notes: "Stories may contain truth, but decisions need observable facts and a specific impact." },
    { kicker: "Transform", title: "A new request needs a trade-off.", body: "There are four honest choices—not an invisible fifth called ‘just fit it in.’", stage: "transform", visual: "choices", points: ["Stay|Protect the current commitment", "Move|Change sequence or deadline", "Stop|Remove work that no longer earns its place", "Support|Add skill, time, authority, or capacity"], statement: "Adding work requires a decision about existing work.", notes: "Let the person with authority own the trade-off rather than pushing it back as personal time management." },
    { kicker: "Emerge", title: "Use a script that invites a decision.", body: "Keep the load, the impact, and the request distinct.", stage: "emerge", visual: "script", points: ["Load|Here is what I am currently carrying…", "Impact|If this is added, this commitment changes…", "Decision|Which outcome should we protect?", "Agreement|Let us record what moves and who knows"], notes: "Practise the script out loud. Natural language matters more than exact wording." },
    { kicker: "Practice", title: "Choose the steadier response.", body: "The best response neither dismisses the concern nor promises impossible capacity.", stage: "emerge", visual: "practice", points: ["The Friday request|A manager adds urgent work", "The quiet teammate|Deadlines slip without warning", "The client escalation|Everything is suddenly priority one"], notes: "Use the interactive scenarios after the presentation or facilitate them live." },
    { kicker: "Soar", title: "Use a signal before the emergency.", body: "A ten-minute capacity check can prevent a week of recovery.", stage: "soar", visual: "rhythm", points: ["Green|Commitments are stable", "Amber|A trade-off is needed", "Red|A commitment is already at risk", "Decision|Record what changes"], notes: "The signal is an opening to a decision, not a rating of resilience or commitment." },
    { kicker: "Your plan", title: "Make three decisions.", body: "Name one load, one trade-off, and one capacity check-in.", stage: "soar", visual: "plan", points: ["Make visible|What is currently hidden?", "Request|Which trade-off needs authority?", "Schedule|When will capacity be checked again?"], notes: "Direct participants to the action plan on the page and allow quiet writing time." },
    { kicker: "Take-home tools", title: "Keep the conversation usable.", body: "A capacity map, decision card, conversation script, and weekly signal remain on this page.", stage: "soar", visual: "tools", points: ["Map|See the whole load", "Card|Choose stay, move, stop, or support", "Script|Ask for the decision", "Signal|Raise capacity early"], notes: "Name the tools without reading every line." },
    { kicker: "Close", title: "Capacity spoken early becomes choice.", body: "Capacity hidden too long becomes consequence.", stage: "soar", visual: "close", statement: "Start one workload conversation this week.", notes: "Invite one commitment, thank the host, and close without adding a new framework." },
  ],
  practice: [
    { title: "The Friday request", prompt: "A manager adds urgent work to a week that is already full.", choices: ["Say yes and work later", "Show the current load and ask which outcome should move", "Refuse without explaining the impact"], correct: 1, response: "Capacity becomes actionable when the current load and the requested trade-off are visible together." },
    { title: "The quiet teammate", prompt: "A teammate has missed two internal dates and says everything is fine.", choices: ["Wait for the client deadline", "Take the work away without discussion", "Ask them to map the full load and identify the first commitment at risk"], correct: 2, response: "A concrete map opens a safer conversation than reassurance or accusation." },
    { title: "The client escalation", prompt: "A client marks three requests urgent at once.", choices: ["Treat all three as equal", "Clarify consequence and sequence, then confirm the first priority", "Forward every message to the team"], correct: 1, response: "Urgency becomes manageable when consequence, order, and ownership are explicit." },
  ],
};

const digitalEn: CompanionWorkshopCopy = {
  ...commonEn,
  id: "digital-calm",
  path: "/programs/workshops/digital-calm",
  metaTitle: "Digital Calm Workshop | ROALLA",
  metaDescription: "A practical ROALLA workshop for reducing digital noise, clarifying communication channels, and protecting attention without disconnecting from the team.",
  eyebrow: "Roalla workshop",
  title: "Digital Calm",
  promise: "Make technology serve your attention again.",
  intro: "A practical workshop for people and teams whose notifications, inboxes, chats, and unclear response expectations continually rearrange the day.",
  listingLede: "Audit digital noise, give every channel a clear job, agree what urgent means, and build a communication rhythm that protects focused work.",
  audienceLine: "Individuals, hybrid teams, managers, founders, and operations leaders",
  heroImage: "/workshops/digital-calm/hero.webp",
  heroAlt: "A person working calmly in a notebook with their phone face down and laptop closed.",
  storyEyebrow: "Why this workshop",
  storyTitle: "Every notification asks you to reconsider your priority",
  storyBody: "The problem is rarely one tool. It is the accumulation of alerts, duplicate channels, vague urgency, after-hours habits, and messages that arrive without a clear expected response. Digital Calm makes those expectations visible and negotiable.",
  storyAside: "Reachability is not the same as responsiveness.",
  frameworkEyebrow: "The four moves",
  frameworkTitle: "From digital noise to intentional communication",
  framework: [
    { name: "Prepare", title: "See the noise", body: "Audit notifications, channels, duplicate requests, response expectations, and after-hours habits." },
    { name: "Transform", title: "Give every channel a job", body: "Separate urgent coordination, same-day work, planned work, reference, and optional conversation." },
    { name: "Emerge", title: "Agree on team norms", body: "Define what urgent means, how to escalate, and when a response is genuinely expected." },
    { name: "Soar", title: "Protect a digital rhythm", body: "Use communication windows, focus blocks, shutdown cues, and a weekly cleanup." },
  ],
  practiceTitle: "Can you route the signal without creating more noise?",
  practiceIntro: "Sort three realistic messages by urgency, channel, and expected response. The aim is not silence—it is trustworthy communication.",
  planEyebrow: "Your calm experiment",
  planTitle: "Design a seven-day reset",
  planIntro: "Choose one notification change, one channel agreement, and one protected rhythm. Your answers stay on this device.",
  planFields: [
    { label: "One notification to remove", hint: "Which alert does not deserve an interruption?" },
    { label: "One channel rule", hint: "What belongs where, and what response does it imply?" },
    { label: "One protected rhythm", hint: "A focus window, communication window, shutdown, or cleanup." },
  ],
  toolsEyebrow: "Take-home tools",
  toolsTitle: "Make the agreement visible",
  tools: [
    { title: "Notification audit", body: "Judge alerts by consequence, not habit.", points: ["Must interrupt", "Can batch", "Can remove", "Needs a new owner"] },
    { title: "Channel-purpose map", body: "Give each place one dependable job.", points: ["Urgent", "Today", "Planned", "Reference", "Optional"] },
    { title: "Communication agreement", body: "Define response expectations before the message arrives.", points: ["Purpose", "Expected response", "Escalation path", "Quiet hours"] },
    { title: "Digital shutdown", body: "Stop deliberately so tomorrow starts clearly.", points: ["Capture open loops", "Set the first task", "Close channels", "Leave a return cue"] },
  ],
  faqs: [
    { q: "Is Digital Calm a digital-detox workshop?", a: "No. It does not treat technology as the enemy. It helps teams use digital tools deliberately and make response expectations trustworthy." },
    { q: "Do participants have to change their software?", a: "No. The workshop works with the tools already in use. A tool change is considered only when purpose and norms cannot solve the problem." },
    { q: "Can this be customized for Microsoft Teams, Slack, or email-heavy workplaces?", a: "Yes. Scenarios and channel maps can reflect the organization’s actual communication stack." },
    { q: "Will this prevent urgent communication?", a: "No. It makes the urgent path clearer so genuinely important signals are easier to recognize and act on." },
  ],
  slides: [
    { kicker: "Welcome", title: "Quiet the noise. Keep the connection.", body: "Digital Calm protects attention without disappearing from the people who depend on you.", stage: "prepare", visual: "photo", statement: "Technology should carry the signal—not become the signal.", notes: "Open with recognition. Ask how many channels participants checked before arriving." },
    { kicker: "The noise", title: "One message can arrive five different ways.", body: "Email, chat, task board, text, and meeting—each with a different implied urgency.", stage: "prepare", visual: "load", points: ["Alerts|Every sound asks for attention", "Duplicates|The same request crosses tools", "Ambiguity|Response expectations stay unstated", "After-hours|Reachability quietly becomes availability"], notes: "The issue is not personal discipline alone. It is a communication system with unclear rules." },
    { kicker: "The path", title: "See the noise. Route the signal. Protect the rhythm.", body: "Four moves make digital communication more trustworthy.", stage: "prepare", visual: "path", points: ["Prepare|Audit the noise", "Transform|Give channels a job", "Emerge|Agree on norms", "Soar|Protect a rhythm"], notes: "Walk the four moves once and keep the language consistent." },
    { kicker: "Prepare", title: "Audit interruptions by consequence.", body: "An alert earns interruption only when waiting creates a meaningful consequence.", stage: "prepare", visual: "map", points: ["Interrupt|A time-sensitive consequence exists", "Batch|Important, but safe to review later", "Remove|Information without required action", "Reassign|Useful signal, wrong recipient"], notes: "Participants can audit one device or one channel rather than fixing everything in the room." },
    { kicker: "Transform", title: "Give every channel one dependable job.", body: "If everything can happen everywhere, no channel can be trusted.", stage: "transform", visual: "separate", points: ["Urgent|Use the agreed escalation path", "Today|Use the coordination channel", "Planned|Put work on the task board", "Reference|Store it where it can be found", "Optional|Conversation that may wait"], notes: "The labels matter less than shared meaning and consistent use." },
    { kicker: "Transform", title: "Urgent needs a definition.", body: "Urgency is consequence plus time—not punctuation, seniority, or anxiety.", stage: "transform", visual: "choices", points: ["Consequence|What changes if nobody acts?", "Time|When does that consequence become real?", "Owner|Who can act?", "Path|How will they be reached?"], statement: "A trustworthy urgent path should be used rarely and answered reliably.", notes: "Ask the room to distinguish an urgent issue from an important same-day request." },
    { kicker: "Emerge", title: "Write the communication agreement.", body: "People can protect attention only when they trust how messages will move.", stage: "emerge", visual: "script", points: ["Purpose|What belongs in this channel?", "Response|When is an answer expected?", "Escalation|What happens when waiting is unsafe?", "Quiet hours|When is no response expected?"], notes: "Make norms behavioural and observable. Avoid vague words like promptly." },
    { kicker: "Practice", title: "Route the signal.", body: "Choose the channel and expected response before touching the message.", stage: "emerge", visual: "practice", points: ["The client outage|Immediate operational consequence", "The status question|Useful today, safe to batch", "The idea at 9 p.m.|Worth keeping, not worth interrupting"], notes: "Use the interactive scenarios or facilitate a live sort with the room." },
    { kicker: "Soar", title: "Build a rhythm, not a perfect streak.", body: "Focus windows, communication windows, shutdown, and cleanup make calm recoverable.", stage: "soar", visual: "rhythm", points: ["Focus|Channels closed for chosen work", "Communicate|Batch replies and coordination", "Shutdown|Capture loops and leave a return cue", "Clean up|Review channels and rules weekly"], notes: "A missed rhythm is a cue to restart, not evidence the system failed." },
    { kicker: "Your plan", title: "Run a seven-day calm experiment.", body: "Remove one alert, clarify one channel, and protect one recurring rhythm.", stage: "soar", visual: "plan", points: ["Remove|One interruption that can disappear", "Clarify|One channel rule the team can test", "Protect|One focus or shutdown window"], notes: "Direct participants to the action plan. Make the experiment small enough to evaluate in one week." },
    { kicker: "Take-home tools", title: "Keep the system trustworthy.", body: "The notification audit, channel map, communication agreement, and shutdown checklist remain on this page.", stage: "soar", visual: "tools", points: ["Audit|Judge alerts by consequence", "Map|Give channels a job", "Agreement|Set expectations", "Shutdown|Protect tomorrow"], notes: "Name the tools without reading every item." },
    { kicker: "Close", title: "Protect attention. Preserve connection.", body: "Make the urgent path clear—and let everything else wait where it belongs.", stage: "soar", visual: "close", statement: "Change one digital rule this week.", notes: "Invite one commitment, thank the host, and close without adding a new framework." },
  ],
  practice: [
    { title: "The client outage", prompt: "A client cannot access the service and revenue is being affected.", choices: ["Post in a general chat channel", "Use the agreed urgent path and name the owner and consequence", "Send three emails marked important"], correct: 1, response: "A real consequence, a time boundary, and an actionable owner belong on the trusted urgent path." },
    { title: "The status question", prompt: "A colleague asks for a project update while you are in a protected focus block.", choices: ["Switch immediately", "Capture it for the next communication window unless a stated consequence makes it urgent", "Ignore it for the week"], correct: 1, response: "Important coordination can be reliable without becoming an interruption." },
    { title: "The 9 p.m. idea", prompt: "A manager sends a useful idea after hours with no stated expectation.", choices: ["Reply so they know you care", "Treat it as urgent because it came from a manager", "Capture it in the planned-work channel and respond during working hours"], correct: 2, response: "A good idea can be preserved without creating an after-hours response norm." },
  ],
};

// French content keeps the same facilitation architecture while localizing the language and examples.
const workloadFr: CompanionWorkshopCopy = {
  ...workloadEn,
  ...commonFr,
  metaTitle: "Atelier La conversation sur la charge de travail | ROALLA",
  metaDescription: "Un atelier pratique de ROALLA pour rendre la charge visible, parler tôt de la capacité et convenir de compromis honnêtes avant l’épuisement.",
  eyebrow: "Atelier Roalla",
  title: "La conversation sur la charge de travail",
  promise: "Parler de capacité avant d’atteindre le point de rupture.",
  intro: "Un atelier animé pour les équipes qui veulent parler plus clairement de la charge, des contraintes, des priorités et des compromis—sans blâme ni endurance silencieuse.",
  listingLede: "Rendre le travail invisible visible, remplacer la pression vague par des choix concrets et repartir avec un langage commun pour parler tôt de capacité.",
  audienceLine: "Direction, gestionnaires, employés, équipes projet et partenaires RH",
  heroAlt: "Deux collègues discutent calmement de la charge de travail autour d’une carte de capacité simple.",
  storyEyebrow: "Pourquoi cet atelier",
  storyTitle: "La surcharge devient souvent visible après les dommages",
  storyBody: "Les tâches assignées ne représentent qu’une partie de la charge. La coordination, les interruptions, le travail émotionnel et les boucles ouvertes consomment aussi la capacité. Tant que ce travail reste invisible, chaque nouvelle demande semble raisonnable, même quand l’ensemble ne l’est plus.",
  storyAside: "Ajouter du travail exige une décision sur le travail existant.",
  frameworkEyebrow: "Les quatre mouvements",
  frameworkTitle: "De la surcharge silencieuse aux engagements partagés",
  framework: [
    { name: "Préparer", title: "Rendre toute la charge visible", body: "Cartographier le travail assigné, la coordination, les interruptions et l’entretien invisible." },
    { name: "Transformer", title: "Transformer la pression en choix", body: "Séparer les faits des interprétations, puis décider ce qui reste, bouge, cesse ou reçoit du soutien." },
    { name: "Émerger", title: "Tenir la conversation", body: "Employer un langage direct sans accusation et remettre le compromis à la personne qui peut le décider." },
    { name: "S’élever", title: "Vérifier la capacité tôt", body: "Utiliser un signal court et récurrent avant les retards ou l’épuisement." },
  ],
  practiceTitle: "Pouvez-vous entendre la conversation utile sous la pression?",
  practiceIntro: "Travaillez trois situations réalistes. Choisissez la réponse qui crée de la clarté sans minimiser la personne ni promettre l’impossible.",
  planEyebrow: "Votre accord de capacité",
  planTitle: "Repartir avec trois décisions",
  planIntro: "Notez une conversation réelle à commencer dans les sept jours. Vos réponses restent sur cet appareil.",
  planFields: [
    { label: "Une charge à rendre visible", hint: "Le travail assigné ou invisible qui doit être nommé." },
    { label: "Un compromis à demander", hint: "Qu’est-ce qui reste, bouge, cesse ou reçoit du soutien?" },
    { label: "Une vérification de capacité", hint: "Qui doit parler, quand et avec quel signal?" },
  ],
  toolsEyebrow: "Outils à emporter",
  toolsTitle: "Utiliser le langage quand la salle s’agite de nouveau",
  tools: [
    { title: "Carte de capacité", body: "Voir toute la charge avant d’évaluer une seule tâche.", points: ["Travail assigné", "Coordination invisible", "Interruptions", "Marge de récupération"] },
    { title: "Carte Cesser / Bouger / Soutenir", body: "Transformer une nouvelle demande en compromis explicite.", points: ["Qu’est-ce qui reste?", "Qu’est-ce qui bouge?", "Qu’est-ce qui cesse?", "Quel soutien change la réponse?"] },
    { title: "Script de conversation", body: "Séparer les faits, l’impact et la décision demandée.", points: ["Voici la charge actuelle", "Voici l’impact", "Voici le choix nécessaire"] },
    { title: "Signal hebdomadaire", body: "Lever le drapeau pendant que des choix existent encore.", points: ["Vert : stable", "Ambre : compromis requis", "Rouge : engagement à risque"] },
  ],
  faqs: [
    { q: "Est-ce un atelier de gestion du rendement?", a: "Non. Il enseigne un langage de capacité et un processus de décision. Il n’évalue pas les employés et ne remplace pas les politiques RH." },
    { q: "Gestionnaires et employés peuvent-ils participer ensemble?", a: "Oui. L’atelier est plus fort lorsque des personnes ayant des droits de décision différents pratiquent ensemble." },
    { q: "L’atelier traite-t-il de l’épuisement professionnel?", a: "Il traite de l’ambiguïté évitable et des conversations précoces. Il est éducatif et ne constitue pas un soin médical ou thérapeutique." },
    { q: "Peut-il être adapté aux équipes projet ou de services?", a: "Oui. Les scénarios et cartes peuvent refléter la livraison, les opérations, les services professionnels ou la direction." },
  ],
  slides: workloadEn.slides,
  practice: [
    { title: "La demande du vendredi", prompt: "Un gestionnaire ajoute du travail urgent à une semaine déjà pleine.", choices: ["Dire oui et travailler plus tard", "Montrer la charge actuelle et demander quel résultat doit bouger", "Refuser sans expliquer l’impact"], correct: 1, response: "La capacité devient actionnable quand la charge actuelle et le compromis demandé sont visibles ensemble." },
    { title: "Le collègue silencieux", prompt: "Un collègue a manqué deux dates internes et dit que tout va bien.", choices: ["Attendre la date client", "Retirer le travail sans discussion", "Cartographier toute la charge et nommer le premier engagement à risque"], correct: 2, response: "Une carte concrète ouvre une conversation plus sûre que le réconfort ou l’accusation." },
    { title: "L’escalade client", prompt: "Un client marque trois demandes urgentes à la fois.", choices: ["Traiter les trois comme égales", "Clarifier la conséquence et l’ordre, puis confirmer la première priorité", "Transférer tous les messages à l’équipe"], correct: 1, response: "L’urgence devient gérable lorsque la conséquence, l’ordre et la responsabilité sont explicites." },
  ],
};

const digitalFr: CompanionWorkshopCopy = {
  ...digitalEn,
  ...commonFr,
  metaTitle: "Atelier Calme numérique | ROALLA",
  metaDescription: "Un atelier pratique de ROALLA pour réduire le bruit numérique, clarifier les canaux et protéger l’attention sans se déconnecter de l’équipe.",
  eyebrow: "Atelier Roalla",
  title: "Calme numérique",
  promise: "Remettre la technologie au service de votre attention.",
  intro: "Un atelier pratique pour les personnes et les équipes dont les notifications, boîtes de réception, clavardages et attentes floues réorganisent constamment la journée.",
  listingLede: "Auditer le bruit numérique, donner un rôle clair à chaque canal, définir l’urgence et bâtir un rythme de communication qui protège le travail concentré.",
  audienceLine: "Personnes, équipes hybrides, gestionnaires, fondateurs et responsables des opérations",
  heroAlt: "Une personne travaille calmement dans un cahier, téléphone retourné et ordinateur fermé.",
  storyEyebrow: "Pourquoi cet atelier",
  storyTitle: "Chaque notification demande de reconsidérer votre priorité",
  storyBody: "Le problème est rarement un seul outil. Il vient de l’accumulation des alertes, des canaux en double, de l’urgence floue, des habitudes après les heures et des messages sans attente de réponse claire. Calme numérique rend ces attentes visibles et négociables.",
  storyAside: "Être joignable n’est pas être constamment disponible.",
  frameworkEyebrow: "Les quatre mouvements",
  frameworkTitle: "Du bruit numérique à une communication intentionnelle",
  framework: [
    { name: "Préparer", title: "Voir le bruit", body: "Auditer les notifications, les canaux, les demandes en double et les attentes de réponse." },
    { name: "Transformer", title: "Donner un rôle à chaque canal", body: "Séparer l’urgence, le travail du jour, le travail planifié, la référence et la conversation facultative." },
    { name: "Émerger", title: "Convenir des normes", body: "Définir l’urgence, l’escalade et le moment où une réponse est réellement attendue." },
    { name: "S’élever", title: "Protéger un rythme numérique", body: "Utiliser des fenêtres de communication, des blocs de concentration, une clôture et un nettoyage hebdomadaire." },
  ],
  practiceTitle: "Pouvez-vous acheminer le signal sans créer plus de bruit?",
  practiceIntro: "Classez trois messages réalistes selon l’urgence, le canal et la réponse attendue. Le but n’est pas le silence, mais une communication fiable.",
  planEyebrow: "Votre expérience de calme",
  planTitle: "Concevoir une remise à zéro de sept jours",
  planIntro: "Choisissez une notification, une règle de canal et un rythme protégé. Vos réponses restent sur cet appareil.",
  planFields: [
    { label: "Une notification à retirer", hint: "Quelle alerte ne mérite pas une interruption?" },
    { label: "Une règle de canal", hint: "Qu’est-ce qui va où, et quelle réponse cela implique-t-il?" },
    { label: "Un rythme protégé", hint: "Une fenêtre de concentration, de communication, de clôture ou de nettoyage." },
  ],
  toolsEyebrow: "Outils à emporter",
  toolsTitle: "Rendre l’accord visible",
  tools: [
    { title: "Audit des notifications", body: "Juger les alertes selon la conséquence, pas l’habitude.", points: ["Doit interrompre", "Peut être regroupée", "Peut disparaître", "Besoin d’un autre responsable"] },
    { title: "Carte des canaux", body: "Donner à chaque endroit un rôle fiable.", points: ["Urgent", "Aujourd’hui", "Planifié", "Référence", "Facultatif"] },
    { title: "Accord de communication", body: "Définir les attentes avant l’arrivée du message.", points: ["Rôle", "Réponse attendue", "Escalade", "Heures calmes"] },
    { title: "Clôture numérique", body: "S’arrêter délibérément pour mieux recommencer.", points: ["Capturer les boucles", "Définir la première tâche", "Fermer les canaux", "Laisser un repère"] },
  ],
  faqs: [
    { q: "Est-ce un atelier de désintoxication numérique?", a: "Non. La technologie n’est pas l’ennemie. L’atelier aide à utiliser les outils intentionnellement et à rendre les attentes fiables." },
    { q: "Faut-il changer de logiciels?", a: "Non. L’atelier fonctionne avec les outils existants. Un changement n’est envisagé que si le rôle et les normes ne suffisent pas." },
    { q: "Peut-il être adapté à Teams, Slack ou un milieu très axé sur le courriel?", a: "Oui. Les scénarios et les cartes peuvent refléter la pile de communication réelle." },
    { q: "Cela empêchera-t-il les communications urgentes?", a: "Non. Le chemin urgent devient plus clair, donc les vrais signaux importants sont plus faciles à reconnaître et à traiter." },
  ],
  slides: digitalEn.slides,
  practice: [
    { title: "La panne client", prompt: "Un client ne peut plus accéder au service et les revenus sont touchés.", choices: ["Publier dans le canal général", "Utiliser le chemin urgent convenu et nommer le responsable et la conséquence", "Envoyer trois courriels importants"], correct: 1, response: "Une conséquence réelle, une limite de temps et un responsable actionnable appartiennent au chemin urgent fiable." },
    { title: "La question de statut", prompt: "Un collègue demande une mise à jour pendant votre bloc de concentration.", choices: ["Changer immédiatement", "La garder pour la prochaine fenêtre de communication sauf conséquence urgente", "L’ignorer toute la semaine"], correct: 1, response: "La coordination importante peut rester fiable sans devenir une interruption." },
    { title: "L’idée de 21 h", prompt: "Un gestionnaire envoie une bonne idée après les heures, sans attente précisée.", choices: ["Répondre pour montrer votre intérêt", "La traiter comme urgente parce qu’elle vient d’un gestionnaire", "La placer dans le canal planifié et répondre pendant les heures de travail"], correct: 2, response: "Une bonne idée peut être conservée sans créer une norme de réponse après les heures." },
  ],
};

const workloadSlidesFr: Partial<WorkshopSlide>[] = [
  { kicker: "Accueil", title: "Le dire avant le point de rupture.", body: "Une meilleure conversation commence avant le retard, le départ ou la crise.", statement: "La capacité est une information, pas un aveu.", notes: "Commencer par la reconnaissance, pas le diagnostic." },
  { kicker: "La charge cachée", title: "Le calendrier n’est pas toute la charge.", body: "Les tâches côtoient la coordination, les interruptions, le travail émotionnel et les boucles ouvertes.", points: ["Assigné|Engagements visibles", "Coordonner|Mises à jour, transferts, suivi", "Interrompre|Urgences et changement de contexte", "Porter|Boucles ouvertes et charge émotionnelle"], notes: "Demander quelle catégorie est la moins visible." },
  { kicker: "Le chemin", title: "Charge visible. Choix honnêtes. Engagements partagés.", body: "Quatre mouvements transforment la pression en décision tenable.", points: ["Préparer|Voir toute la charge", "Transformer|Nommer le compromis", "Émerger|Tenir la conversation", "S’élever|Vérifier tôt"], notes: "Parcourir les quatre mouvements une fois." },
  { kicker: "Préparer", title: "Cartographier ce que la personne porte réellement.", body: "Commencer par les faits : engagements, dates, dépendances, interruptions et marge.", points: ["Travail|Ce qui doit être livré", "Temps|Ce qui est déjà engagé", "Dépendances|Qui ou quoi contrôle le progrès", "Marge|Ce qui absorbe le changement"], notes: "Voir le système, pas prouver qu’une personne peut en porter plus." },
  { kicker: "Transformer", title: "Séparer les faits du récit.", body: "La clarté augmente quand observation, impact et interprétation cessent d’être une seule phrase.", points: ["Fait|Sept engagements actifs; deux partagent une date", "Impact|Deux résultats ne peuvent finir vendredi", "Récit|Personne ne respecte mon temps"], notes: "Les décisions ont besoin de faits observables et d’un impact précis." },
  { kicker: "Transformer", title: "Une nouvelle demande exige un compromis.", body: "Quatre choix honnêtes—pas un cinquième appelé « trouvez une place ».", points: ["Rester|Protéger l’engagement actuel", "Bouger|Changer l’ordre ou la date", "Cesser|Retirer le travail qui ne mérite plus sa place", "Soutenir|Ajouter compétence, temps, autorité ou capacité"], statement: "Ajouter du travail exige une décision sur le travail existant.", notes: "La personne ayant l’autorité assume le compromis." },
  { kicker: "Émerger", title: "Utiliser un script qui invite une décision.", body: "Garder la charge, l’impact et la demande distincts.", points: ["Charge|Voici ce que je porte…", "Impact|Si ceci s’ajoute, cet engagement change…", "Décision|Quel résultat devons-nous protéger?", "Accord|Notons ce qui bouge et qui doit le savoir"], notes: "Pratiquer le script à voix haute." },
  { kicker: "Pratique", title: "Choisir la réponse la plus stable.", body: "La meilleure réponse ne minimise pas et ne promet pas l’impossible.", points: ["La demande du vendredi|Travail urgent ajouté", "Le collègue silencieux|Retards sans signal", "L’escalade client|Tout devient priorité un"], notes: "Utiliser les situations interactives." },
  { kicker: "S’élever", title: "Utiliser un signal avant l’urgence.", body: "Dix minutes de capacité peuvent éviter une semaine de récupération.", points: ["Vert|Engagements stables", "Ambre|Compromis requis", "Rouge|Engagement à risque", "Décision|Noter ce qui change"], notes: "Le signal ouvre une décision; ce n’est pas une note de résilience." },
  { kicker: "Votre plan", title: "Prendre trois décisions.", body: "Nommer une charge, un compromis et une vérification.", points: ["Rendre visible|Qu’est-ce qui est caché?", "Demander|Quel compromis a besoin d’autorité?", "Planifier|Quand vérifier de nouveau?"], notes: "Laisser un temps d’écriture." },
  { kicker: "Outils", title: "Garder la conversation utilisable.", body: "La carte, la décision, le script et le signal restent sur cette page.", points: ["Carte|Voir toute la charge", "Choix|Rester, bouger, cesser ou soutenir", "Script|Demander la décision", "Signal|Lever la capacité tôt"], notes: "Nommer les outils sans tout lire." },
  { kicker: "Clôture", title: "La capacité exprimée tôt devient un choix.", body: "La capacité cachée trop longtemps devient une conséquence.", statement: "Commencer une conversation cette semaine.", notes: "Inviter un engagement et clore." },
];

const digitalSlidesFr: Partial<WorkshopSlide>[] = [
  { kicker: "Accueil", title: "Calmer le bruit. Garder le lien.", body: "Calme numérique protège l’attention sans disparaître des personnes qui comptent sur vous.", statement: "La technologie doit porter le signal, pas devenir le signal.", notes: "Demander combien de canaux ont été consultés avant l’arrivée." },
  { kicker: "Le bruit", title: "Un message peut arriver de cinq façons.", body: "Courriel, clavardage, tableau, texto et réunion—avec une urgence implicite différente.", points: ["Alertes|Chaque son réclame l’attention", "Doublons|La même demande traverse les outils", "Ambiguïté|Les attentes restent floues", "Après les heures|Être joignable devient disponible"], notes: "Le problème est aussi systémique, pas seulement personnel." },
  { kicker: "Le chemin", title: "Voir le bruit. Acheminer le signal. Protéger le rythme.", body: "Quatre mouvements rendent la communication plus fiable.", points: ["Préparer|Auditer le bruit", "Transformer|Donner un rôle aux canaux", "Émerger|Convenir des normes", "S’élever|Protéger un rythme"], notes: "Parcourir les quatre mouvements une fois." },
  { kicker: "Préparer", title: "Auditer les interruptions selon la conséquence.", body: "Une alerte mérite d’interrompre seulement si attendre entraîne une conséquence réelle.", points: ["Interrompre|Conséquence sensible au temps", "Regrouper|Important, mais peut attendre", "Retirer|Information sans action", "Réassigner|Bon signal, mauvais destinataire"], notes: "Auditer un appareil ou un canal, pas tout l’écosystème." },
  { kicker: "Transformer", title: "Donner à chaque canal un rôle fiable.", body: "Si tout peut arriver partout, aucun canal n’est digne de confiance.", points: ["Urgent|Chemin d’escalade convenu", "Aujourd’hui|Canal de coordination", "Planifié|Tableau de travail", "Référence|Endroit consultable", "Facultatif|Conversation qui peut attendre"], notes: "Le sens partagé compte plus que les étiquettes." },
  { kicker: "Transformer", title: "L’urgence a besoin d’une définition.", body: "L’urgence est une conséquence plus une limite de temps, pas de la ponctuation ou de l’anxiété.", points: ["Conséquence|Que change l’inaction?", "Temps|Quand la conséquence devient-elle réelle?", "Responsable|Qui peut agir?", "Chemin|Comment le joindre?"], statement: "Un chemin urgent fiable est rare et reçoit une réponse fiable.", notes: "Distinguer urgence et demande importante du jour." },
  { kicker: "Émerger", title: "Écrire l’accord de communication.", body: "On protège l’attention quand on fait confiance au mouvement des messages.", points: ["Rôle|Qu’est-ce qui appartient ici?", "Réponse|Quand attend-on une réponse?", "Escalade|Que faire si attendre est risqué?", "Heures calmes|Quand aucune réponse n’est attendue?"], notes: "Rendre les normes observables." },
  { kicker: "Pratique", title: "Acheminer le signal.", body: "Choisir le canal et la réponse avant de toucher au message.", points: ["La panne client|Conséquence opérationnelle immédiate", "La question de statut|Utile aujourd’hui, peut être regroupée", "L’idée de 21 h|À garder, pas à interrompre"], notes: "Utiliser les situations interactives." },
  { kicker: "S’élever", title: "Bâtir un rythme, pas une série parfaite.", body: "Concentration, communication, clôture et nettoyage rendent le calme récupérable.", points: ["Concentration|Canaux fermés pour le travail choisi", "Communication|Réponses regroupées", "Clôture|Capturer et laisser un repère", "Nettoyage|Réviser les canaux chaque semaine"], notes: "Un rythme manqué est une invitation à recommencer." },
  { kicker: "Votre plan", title: "Tester sept jours de calme.", body: "Retirer une alerte, clarifier un canal et protéger un rythme.", points: ["Retirer|Une interruption qui peut disparaître", "Clarifier|Une règle de canal à tester", "Protéger|Une fenêtre de concentration ou de clôture"], notes: "Rendre l’expérience assez petite pour l’évaluer en une semaine." },
  { kicker: "Outils", title: "Garder le système fiable.", body: "L’audit, la carte, l’accord et la clôture restent sur cette page.", points: ["Audit|Juger selon la conséquence", "Carte|Donner un rôle aux canaux", "Accord|Définir les attentes", "Clôture|Protéger demain"], notes: "Nommer les outils sans tout lire." },
  { kicker: "Clôture", title: "Protéger l’attention. Préserver le lien.", body: "Clarifier le chemin urgent et laisser le reste attendre à sa place.", statement: "Changer une règle numérique cette semaine.", notes: "Inviter un engagement et clore." },
];

workloadFr.slides = workloadEn.slides.map((slide, index) => ({ ...slide, ...(workloadSlidesFr[index] ?? {}) }));
digitalFr.slides = digitalEn.slides.map((slide, index) => ({ ...slide, ...(digitalSlidesFr[index] ?? {}) }));

export function companionWorkshopCopy(id: CompanionWorkshopId, locale: string): CompanionWorkshopCopy {
  if (id === "workload-conversation") return locale === "fr" ? workloadFr : workloadEn;
  if (id === "digital-calm") return locale === "fr" ? digitalFr : digitalEn;
  if (id === "decision-hour") return decisionHourCopy(locale);
  if (id === "offer-page") return offerPageCopy(locale);
  return ideationCopy(locale);
}

export const companionWorkshopIds: CompanionWorkshopId[] = ["workload-conversation", "digital-calm", "decision-hour", "offer-page", "ideation"];
