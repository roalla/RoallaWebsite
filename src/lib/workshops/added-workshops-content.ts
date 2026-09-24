import type { CompanionWorkshopCopy, WorkshopSlide } from "@/lib/workshops/companion-workshops-content";

/** Workshop-specific copy. Shared chrome and practice are added in `withCommon`. */
type AddedWorkshopFields = Omit<
  CompanionWorkshopCopy,
  | "slides"
  | "practice"
  | "hostCta"
  | "workshopsLabel"
  | "notesLabel"
  | "viewerLabel"
  | "viewerHelp"
  | "readMode"
  | "presentMode"
  | "previous"
  | "next"
  | "fullscreen"
  | "exitFullscreen"
  | "slideOf"
  | "stages"
  | "practiceEyebrow"
  | "practiceQuestion"
  | "practiceNext"
  | "practiceRestart"
  | "practiceScore"
  | "planPlaceholder"
  | "planSaved"
  | "planPrint"
  | "planClear"
  | "facilitatorEyebrow"
  | "facilitatorTitle"
  | "facilitatorBody"
  | "faqTitle"
>;

const decisionEn = {
  id: "decision-hour",
  path: "/programs/workshops/decision-hour",
  metaTitle: "The Decision Hour Workshop | ROALLA",
  metaDescription: "A practical ROALLA workshop for ending meetings with one owner, one trade-off, and a written next step.",
  eyebrow: "Roalla workshop",
  title: "The Decision Hour",
  promise: "Leave the room with an owner, not another discussion.",
  intro: "A facilitated workshop for teams whose meetings collect updates, opinions, and open loops—and still adjourn without a decision anyone can repeat.",
  listingLede: "Give every meeting one question, separate updates from decisions, and leave with an owner, a date, and a record of who needs to know.",
  audienceLine: "Leaders, project teams, founders, and people who run recurring meetings",
  heroImage: "/workshops/decision-hour/hero.webp",
  heroAlt: "A navy cover with a gold clock and three decision bars.",
  storyEyebrow: "Why this workshop",
  storyTitle: "The meeting ends. The decision does not.",
  storyBody: "Status, debate, and decision often share one calendar block. People leave with notes and no owner. The Decision Hour gives the room one question, four honest ways a topic can leave, and a record someone who was not there can trust.",
  storyAside: "A meeting without an owner is still a discussion.",
  frameworkEyebrow: "The four moves",
  frameworkTitle: "From an open conversation to a closed decision",
  framework: [
    { name: "Prepare", title: "Name the decision before the room opens", body: "Write the question, the options already known, and what is out of scope." },
    { name: "Transform", title: "Separate the update from the choice", body: "Facts and status can be read. The live time is for the decision." },
    { name: "Emerge", title: "Close with an owner", body: "Name who decides, by when, and who must be told." },
    { name: "Soar", title: "Keep a decision rhythm", body: "Use a short record so the next meeting does not reopen a closed choice." },
  ],
  practiceTitle: "Can you close the room without closing the people out?",
  practiceIntro: "Work through three meetings that tend to sprawl. Choose the response that produces an owner without pretending every topic is a decision.",
  planEyebrow: "Your decision record",
  planTitle: "Leave with three lines",
  planIntro: "Name a real meeting you can change within seven days. Your answers stay on this device.",
  planFields: [
    { label: "One question", hint: "The decision this meeting exists to make." },
    { label: "One owner", hint: "Who decides, by when, and what they are deciding." },
    { label: "One record", hint: "What was chosen, what was deferred, and who needs to know." },
  ],
  toolsEyebrow: "Take-home tools",
  toolsTitle: "Keep the next meeting able to end",
  tools: [
    { title: "Decision card", body: "One question on the invitation, before the room opens.", points: ["The question", "The options already known", "What is out of scope", "Who must be in the room"] },
    { title: "Update versus decision", body: "Read status. Spend the live time on the choice.", points: ["Update: read ahead", "Decision: discuss live", "Parking lot: name it and move on", "Reopen only with new facts"] },
    { title: "Close script", body: "End with an owner, a date, and the people who were not there.", points: ["The decision is…", "The owner is…", "The date is…", "We will tell…"] },
    { title: "Decision record", body: "Three lines the next meeting can trust.", points: ["Chosen", "Deferred", "Informed"] },
  ],
  faqs: [
    { q: "Is this a meeting-facilitation certification?", a: "No. It is a practical session for teams that want meetings to end with an owner. It does not certify facilitators or replace your existing governance." },
    { q: "Can we use it on a leadership meeting and a project stand-up?", a: "Yes. The same card works when the question is smaller. A stand-up still needs to know which topics are updates and which need an owner." },
    { q: "What if the room does not have authority to decide?", a: "Then the decision is who will take the question to the person who does, and by when. The workshop treats missing authority as something to name, not something to talk around." },
    { q: "How long is a typical session?", a: "A focused session is a half day. It can sit inside a longer workshop series with The Workload Conversation or Digital Calm." },
  ],
} satisfies AddedWorkshopFields;

const decisionSlidesEn: WorkshopSlide[] = [
  { kicker: "Welcome", title: "End with an owner.", body: "A useful meeting leaves with a decision someone can repeat.", stage: "prepare", visual: "photo", statement: "Discussion is not a decision.", notes: "Ask the room to name a recent meeting that felt busy and still did not close." },
  { kicker: "The sprawl", title: "One meeting is doing five jobs.", body: "Status, debate, brainstorming, reassurance, and a decision are sharing one hour.", stage: "prepare", visual: "load", points: ["Update|What already happened", "Opinion|What people prefer", "Idea|What might be possible", "Decision|What must be chosen"], notes: "Ask which job is consuming the hour." },
  { kicker: "The path", title: "One question. One owner. One record.", body: "Four moves turn an open conversation into a choice the team can hold.", stage: "prepare", visual: "path", points: ["Prepare|Name the question", "Transform|Separate update from decision", "Emerge|Close with an owner", "Soar|Write the record"], notes: "Walk the four moves once." },
  { kicker: "Prepare", title: "Name the decision before the room opens.", body: "If the question is not on the invitation, the meeting will invent one.", stage: "prepare", visual: "map", points: ["Question|What must be chosen", "Options|What is already known", "Scope|What this hour will not settle", "Room|Who must be present to decide"], notes: "A missing question is the first thing to repair." },
  { kicker: "Transform", title: "Read the update. Discuss the choice.", body: "Status can travel in writing. Live time is scarce.", stage: "transform", visual: "separate", points: ["Update|Read ahead", "Decision|Discuss in the room", "Parking|Name it and move it", "Reopen|Only with new facts"], notes: "Do not shame people for bringing updates. Give updates a different place." },
  { kicker: "Transform", title: "A topic can leave in four ways.", body: "Chosen, deferred, parked, or sent to the person who has authority.", stage: "transform", visual: "choices", points: ["Choose|The room can decide now", "Defer|A fact is still missing", "Park|It is real and not this question", "Escalate|Authority sits outside the room"], statement: "An open topic needs a named exit.", notes: "Escalation is a decision: who takes it, and by when." },
  { kicker: "Emerge", title: "Close out loud.", body: "The last two minutes repeat the decision, the owner, the date, and who will be told.", stage: "emerge", visual: "script", points: ["Decision|What we chose", "Owner|Who carries it", "Date|When it is due", "Told|Who was not in the room"], notes: "Practise the close. The wording can be plain." },
  { kicker: "Practice", title: "Choose the steadier close.", body: "The steadier response names an owner without pretending every comment is a decision.", stage: "emerge", visual: "practice", points: ["The status hour|Updates fill the agenda", "The split room|Two options, no owner", "The missing authority|The room cannot decide"], notes: "Use the situations after the slides or live." },
  { kicker: "Soar", title: "Write three lines the next meeting can trust.", body: "Chosen, deferred, and informed. If it is not written, it will be reopened.", stage: "soar", visual: "rhythm", points: ["Chosen|The decision", "Deferred|What is waiting on a fact", "Informed|Who needs the record", "Next|What will not be reopened"], notes: "The record is for the people who were not there." },
  { kicker: "Your plan", title: "Change one meeting this week.", body: "Name the question, the owner, and the record.", stage: "soar", visual: "plan", points: ["Question|What is this meeting for?", "Owner|Who decides, by when?", "Record|What will be written?"], notes: "Leave time to write." },
  { kicker: "Take-home tools", title: "Keep the hour able to end.", body: "The card, the split, the close, and the record stay on this page.", stage: "soar", visual: "tools", points: ["Card|One question before the room", "Split|Update versus decision", "Close|Owner, date, and who is told", "Record|Chosen, deferred, informed"], notes: "Name the tools without reading every line." },
  { kicker: "Close", title: "A meeting ends when someone owns the outcome.", body: "More discussion is not more progress.", stage: "soar", visual: "close", statement: "Put one question on the next invitation.", notes: "Invite one commitment and close." },
];

const offerEn = {
  id: "offer-page",
  path: "/programs/workshops/offer-page",
  metaTitle: "The Offer on One Page Workshop | ROALLA",
  metaDescription: "A practical ROALLA workshop for saying the same offer in the sales conversation, on the website, and in the proposal.",
  eyebrow: "Roalla workshop",
  title: "The Offer on One Page",
  promise: "Say the same offer in every room.",
  intro: "A facilitated workshop for founders and small teams whose story changes between the sales call, the website, and the proposal.",
  listingLede: "Name who it is for, the problem they already feel, the proof that belongs on the page, and the single job of the next conversation or site.",
  audienceLine: "Founders, marketers, sales leads, and teams preparing a site or a proposal",
  heroImage: "/workshops/offer-page/hero.webp",
  heroAlt: "A navy cover with one pale page and a gold rule.",
  storyEyebrow: "Why this workshop",
  storyTitle: "The offer is true. It is not yet repeatable.",
  storyBody: "A strong service can still be described three different ways by three people. Buyers hear a different promise on the call, the site, and the proposal. This workshop writes one page the team can repeat, and names the single job of the next website or conversation.",
  storyAside: "If the team cannot repeat it, the page cannot say it.",
  frameworkEyebrow: "The four moves",
  frameworkTitle: "From a scattered story to one page",
  framework: [
    { name: "Prepare", title: "Name who it is for", body: "Choose the person who already feels the problem, and the people this page is not for." },
    { name: "Transform", title: "Separate proof from claim", body: "Keep the sentence that can be shown. Park the sentence that only sounds impressive." },
    { name: "Emerge", title: "Agree the sentence", body: "Practise the offer until two people can say it the same way." },
    { name: "Soar", title: "Give the next asset one job", body: "The site, deck, or conversation does one thing. Write what it will not do." },
  ],
  practiceTitle: "Can you hear the offer that will survive the next room?",
  practiceIntro: "Three versions of the same company walk in. Choose the line a buyer can repeat after the meeting.",
  planEyebrow: "Your one page",
  planTitle: "Leave with the page you will actually use",
  planIntro: "Write the offer you want the next conversation to carry. Your answers stay on this device.",
  planFields: [
    { label: "Who it is for", hint: "The person who already feels the problem, in their words." },
    { label: "The sentence", hint: "One line the team will repeat on the call, the site, and the proposal." },
    { label: "The job of the next page", hint: "What the site, deck, or conversation must do—and what it will not do." },
  ],
  toolsEyebrow: "Take-home tools",
  toolsTitle: "Keep the offer the same after the room",
  tools: [
    { title: "Audience line", body: "Who it is for, and who it is not for.", points: ["They already feel…", "They are trying to…", "They are not…", "They decide when…"] },
    { title: "Proof card", body: "A claim earns its place only if it can be shown.", points: ["Claim", "Proof", "Where it appears", "What we will not say"] },
    { title: "Repeat sentence", body: "One line, said the same way by two people.", points: ["Who", "Problem", "Outcome", "Next step"] },
    { title: "One-job brief", body: "The next asset does one job.", points: ["The job", "The reader", "The proof", "Out of scope"] },
  ],
  faqs: [
    { q: "Is this a brand-identity workshop?", a: "No. It produces the offer in language the team can repeat. Visual identity, voice guidelines, and a full brand system can follow. They are not this session." },
    { q: "Do we need a website already?", a: "No. The page is a brief. It can shape a sales conversation, a proposal, or the next site." },
    { q: "Can sales and marketing attend together?", a: "Yes. The workshop is strongest when the people who say the offer in different rooms are in the same room." },
    { q: "What happens after the session?", a: "You leave with a one-page brief. Many teams use it to scope a website or a Digital Enablement engagement. That is a separate conversation." },
  ],
} satisfies AddedWorkshopFields;

const offerSlidesEn: WorkshopSlide[] = [
  { kicker: "Welcome", title: "Say the same offer in every room.", body: "The call, the website, and the proposal should not tell three stories.", stage: "prepare", visual: "photo", statement: "If the team cannot repeat it, the page cannot say it.", notes: "Ask two people to describe the offer in one sentence. Notice where they diverge." },
  { kicker: "The drift", title: "The story changes at the doorway.", body: "Sales adds a promise. The site adds a feature. The proposal adds a different audience.", stage: "prepare", visual: "load", points: ["Call|A promise made live", "Site|A list of services", "Proposal|A different reader", "Team|Three versions of who it is for"], notes: "The drift is usually loyalty to every audience at once." },
  { kicker: "The path", title: "One person. One proof. One job.", body: "Four moves turn a scattered story into a page the team can use.", stage: "prepare", visual: "path", points: ["Prepare|Name who it is for", "Transform|Separate proof from claim", "Emerge|Agree the sentence", "Soar|Give the next asset one job"], notes: "Walk the four moves once." },
  { kicker: "Prepare", title: "Write who it is for in their words.", body: "A page for everyone is a page the right reader cannot see themselves in.", stage: "prepare", visual: "map", points: ["Person|Who already feels the problem", "Words|How they describe it", "Not for|Who this page will not chase", "Moment|When they are ready to act"], notes: "Push for a person, not a category." },
  { kicker: "Transform", title: "A claim needs proof, or it leaves the page.", body: "Impressive language that cannot be shown becomes a risk in the next conversation.", stage: "transform", visual: "separate", points: ["Claim|What we want to say", "Proof|What we can show", "Place|Where the proof appears", "Park|What we will not say yet"], notes: "Parked claims are not failures. They are waiting for evidence." },
  { kicker: "Transform", title: "The next page has one job.", body: "A site, a deck, and a proposal can share an offer and still do different work. This page names one job.", stage: "transform", visual: "choices", points: ["Start a conversation|The reader knows who to contact", "Explain the offer|The reader can repeat it", "Prove the fit|The reader sees themselves", "Out of scope|What this page will not do"], statement: "One job, written down, is a brief.", notes: "Choosing the job is the decision. The design comes later." },
  { kicker: "Emerge", title: "Say it until two people match.", body: "The sentence has a person, a problem, an outcome, and a next step.", stage: "emerge", visual: "script", points: ["Who|For teams that…", "Problem|When…", "Outcome|So they can…", "Next|The next step is…"], notes: "Practise out loud. Exact words matter less than a shared meaning." },
  { kicker: "Practice", title: "Choose the line a buyer can repeat.", body: "The steadier line is specific enough to remember and honest enough to defend.", stage: "emerge", visual: "practice", points: ["The feature list|Everything the company can do", "The broad promise|Helpful to any business", "The specific offer|One reader, one problem, one next step"], notes: "Use the situations after the slides." },
  { kicker: "Soar", title: "Hand the page to the next asset.", body: "The website, the deck, or the next call inherits the sentence. It does not invent a new one.", stage: "soar", visual: "rhythm", points: ["Reader|Who it is for", "Sentence|What we repeat", "Proof|What we can show", "Job|What this asset must do"], notes: "If a later asset needs a new audience, that is a new page, not a footnote." },
  { kicker: "Your plan", title: "Write the page you will use next.", body: "Who it is for, the sentence, and the job of the next asset.", stage: "soar", visual: "plan", points: ["Reader|Who already feels this?", "Sentence|What will we repeat?", "Job|What must the next page do?"], notes: "Leave time to write." },
  { kicker: "Take-home tools", title: "Keep the offer from drifting.", body: "The audience line, the proof card, the sentence, and the brief stay on this page.", stage: "soar", visual: "tools", points: ["Audience|Who it is for", "Proof|What we can show", "Sentence|What we repeat", "Brief|The job of the next asset"], notes: "Name the tools without reading every line." },
  { kicker: "Close", title: "One offer, said the same way.", body: "The next room should not have to invent the story again.", stage: "soar", visual: "close", statement: "Use the sentence in the next real conversation.", notes: "Invite one commitment and close." },
];

const decisionSlidesFr: Partial<WorkshopSlide>[] = [
  { kicker: "Accueil", title: "Finir avec un responsable.", body: "Une réunion utile laisse une décision que quelqu’un peut répéter.", statement: "Une discussion n’est pas une décision.", notes: "Demander une réunion récente qui a semblé occupée sans se clore." },
  { kicker: "L’éparpillement", title: "Une réunion fait cinq métiers.", body: "Le statut, le débat, les idées et la décision partagent la même heure.", points: ["Mise à jour|Ce qui s’est déjà passé", "Avis|Ce que les gens préfèrent", "Idée|Ce qui pourrait être possible", "Décision|Ce qui doit être choisi"], notes: "Demander quel métier occupe l’heure." },
  { kicker: "Le chemin", title: "Une question. Un responsable. Une trace.", body: "Quatre mouvements transforment une conversation ouverte en choix.", points: ["Préparer|Nommer la question", "Transformer|Séparer mise à jour et décision", "Émerger|Clore avec un responsable", "S’élever|Écrire la trace"], notes: "Parcourir les quatre mouvements une fois." },
  { kicker: "Préparer", title: "Nommer la décision avant d’ouvrir la salle.", body: "Si la question n’est pas sur l’invitation, la réunion en inventera une.", points: ["Question|Ce qui doit être choisi", "Options|Ce qui est déjà connu", "Périmètre|Ce que cette heure ne réglera pas", "Salle|Qui doit être présent"], notes: "Une question absente est la première réparation." },
  { kicker: "Transformer", title: "Lire la mise à jour. Discuter le choix.", body: "Le statut peut voyager par écrit. Le temps en direct est rare.", points: ["Mise à jour|Lue d’avance", "Décision|Discutée dans la salle", "Stationnement|La nommer et la déplacer", "Rouvrir|Seulement avec des faits nouveaux"], notes: "Donner aux mises à jour un autre endroit." },
  { kicker: "Transformer", title: "Un sujet peut sortir de quatre façons.", body: "Choisi, reporté, stationné, ou envoyé à la personne qui a l’autorité.", points: ["Choisir|La salle peut décider", "Reporter|Un fait manque encore", "Stationner|Réel, mais pas cette question", "Escalader|L’autorité est ailleurs"], statement: "Un sujet ouvert a besoin d’une sortie nommée.", notes: "L’escalade est une décision : qui la porte, et pour quand." },
  { kicker: "Émerger", title: "Clore à voix haute.", body: "Les deux dernières minutes répètent la décision, le responsable, la date et qui sera informé.", points: ["Décision|Ce que nous avons choisi", "Responsable|Qui le porte", "Date|Pour quand", "Informés|Qui n’était pas dans la salle"], notes: "Pratiquer la clôture. Les mots peuvent être simples." },
  { kicker: "Pratique", title: "Choisir la clôture la plus stable.", body: "La réponse stable nomme un responsable sans faire de chaque commentaire une décision.", points: ["L’heure de statut|Les mises à jour remplissent l’ordre du jour", "La salle divisée|Deux options, aucun responsable", "L’autorité absente|La salle ne peut pas décider"], notes: "Utiliser les situations après les diapositives." },
  { kicker: "S’élever", title: "Écrire trois lignes que la prochaine réunion peut croire.", body: "Choisi, reporté, informé. Sans écrit, le sujet sera rouvert.", points: ["Choisi|La décision", "Reporté|Ce qui attend un fait", "Informé|Qui a besoin de la trace", "Ensuite|Ce qui ne sera pas rouvert"], notes: "La trace sert aux personnes qui n’étaient pas là." },
  { kicker: "Votre plan", title: "Changer une réunion cette semaine.", body: "Nommer la question, le responsable et la trace.", points: ["Question|À quoi sert cette réunion?", "Responsable|Qui décide, pour quand?", "Trace|Qu’est-ce qui sera écrit?"], notes: "Laisser un temps d’écriture." },
  { kicker: "Outils", title: "Garder l’heure capable de finir.", body: "La carte, la séparation, la clôture et la trace restent sur cette page.", points: ["Carte|Une question avant la salle", "Séparation|Mise à jour ou décision", "Clôture|Responsable, date, informés", "Trace|Choisi, reporté, informé"], notes: "Nommer les outils sans tout lire." },
  { kicker: "Clôture", title: "Une réunion finit quand quelqu’un possède le résultat.", body: "Plus de discussion n’est pas plus de progrès.", statement: "Mettre une question sur la prochaine invitation.", notes: "Inviter un engagement et clore." },
];

const offerSlidesFr: Partial<WorkshopSlide>[] = [
  { kicker: "Accueil", title: "Dire la même offre dans chaque salle.", body: "L’appel, le site et la proposition ne devraient pas raconter trois histoires.", statement: "Si l’équipe ne peut pas la répéter, la page ne peut pas la dire.", notes: "Demander à deux personnes de décrire l’offre en une phrase." },
  { kicker: "La dérive", title: "L’histoire change au seuil de la porte.", body: "Les ventes ajoutent une promesse. Le site ajoute une fonction. La proposition change le lecteur.", points: ["Appel|Une promesse dite en direct", "Site|Une liste de services", "Proposition|Un autre lecteur", "Équipe|Trois versions du public"], notes: "La dérive vient souvent de vouloir parler à tout le monde." },
  { kicker: "Le chemin", title: "Une personne. Une preuve. Un rôle.", body: "Quatre mouvements transforment une histoire dispersée en page utilisable.", points: ["Préparer|Nommer pour qui", "Transformer|Séparer preuve et promesse", "Émerger|Convenir de la phrase", "S’élever|Donner un seul rôle au prochain support"], notes: "Parcourir les quatre mouvements une fois." },
  { kicker: "Préparer", title: "Écrire pour qui, dans leurs mots.", body: "Une page pour tout le monde est une page où le bon lecteur ne se reconnaît pas.", points: ["Personne|Qui sent déjà le problème", "Mots|Comment cette personne le dit", "Pas pour|Qui cette page ne poursuit pas", "Moment|Quand elle est prête à agir"], notes: "Demander une personne, pas une catégorie." },
  { kicker: "Transformer", title: "Une promesse a besoin d’une preuve, ou elle quitte la page.", body: "Un langage impressionnant qu’on ne peut pas montrer devient un risque.", points: ["Promesse|Ce que nous voulons dire", "Preuve|Ce que nous pouvons montrer", "Endroit|Où la preuve apparaît", "En attente|Ce que nous ne dirons pas encore"], notes: "Une promesse en attente n’est pas un échec." },
  { kicker: "Transformer", title: "La prochaine page a un seul rôle.", body: "Le site, le dossier et la proposition peuvent partager l’offre et faire un travail différent. Cette page nomme un rôle.", points: ["Ouvrir|Le lecteur sait qui joindre", "Expliquer|Le lecteur peut répéter l’offre", "Prouver|Le lecteur s’y reconnaît", "Hors périmètre|Ce que cette page ne fera pas"], statement: "Un rôle écrit est un cahier des charges.", notes: "Choisir le rôle est la décision. Le design vient après." },
  { kicker: "Émerger", title: "Le dire jusqu’à ce que deux personnes concordent.", body: "La phrase a une personne, un problème, un résultat et une prochaine étape.", points: ["Qui|Pour les équipes qui…", "Problème|Quand…", "Résultat|Afin qu’elles puissent…", "Suite|La prochaine étape est…"], notes: "Pratiquer à voix haute." },
  { kicker: "Pratique", title: "Choisir la ligne qu’un acheteur peut répéter.", body: "La ligne stable est assez précise pour être retenue et assez honnête pour être défendue.", points: ["La liste de fonctions|Tout ce que l’entreprise peut faire", "La promesse large|Utile à toute entreprise", "L’offre précise|Un lecteur, un problème, une suite"], notes: "Utiliser les situations après les diapositives." },
  { kicker: "S’élever", title: "Remettre la page au prochain support.", body: "Le site, le dossier ou le prochain appel hérite de la phrase. Il n’en invente pas une nouvelle.", points: ["Lecteur|Pour qui", "Phrase|Ce que nous répétons", "Preuve|Ce que nous pouvons montrer", "Rôle|Ce que ce support doit faire"], notes: "Un nouveau public demande une nouvelle page." },
  { kicker: "Votre plan", title: "Écrire la page que vous utiliserez.", body: "Pour qui, la phrase, et le rôle du prochain support.", points: ["Lecteur|Qui sent déjà cela?", "Phrase|Que répéterons-nous?", "Rôle|Que doit faire la prochaine page?"], notes: "Laisser un temps d’écriture." },
  { kicker: "Outils", title: "Empêcher l’offre de dériver.", body: "Le public, la preuve, la phrase et le cahier restent sur cette page.", points: ["Public|Pour qui", "Preuve|Ce que nous pouvons montrer", "Phrase|Ce que nous répétons", "Cahier|Le rôle du prochain support"], notes: "Nommer les outils sans tout lire." },
  { kicker: "Clôture", title: "Une offre, dite de la même façon.", body: "La prochaine salle ne devrait pas avoir à inventer l’histoire.", statement: "Utiliser la phrase dans la prochaine vraie conversation.", notes: "Inviter un engagement et clore." },
];

const decisionPracticeEn = [
  { title: "The status hour", prompt: "The agenda is full of updates and the decision is the last five minutes.", choices: ["Let the updates run and hope time remains", "Move updates to a note and start with the question", "Add another meeting next week"], correct: 1, response: "The hour can end when the question is first and the updates have another place." },
  { title: "The split room", prompt: "Two options are clear and the meeting is about to adjourn with both still open.", choices: ["Ask for more opinions", "Name the owner, the date, and which option they are choosing", "Schedule a workshop to discuss culture"], correct: 1, response: "A split room still needs an owner. More opinions are not a close." },
  { title: "The missing authority", prompt: "The room agrees and then remembers someone else must approve.", choices: ["Announce the decision anyway", "Name who will take the question to that person, and by when", "Reopen the whole discussion"], correct: 1, response: "Missing authority is a decision about the handoff, not a reason to keep talking." },
];

const offerPracticeEn = [
  { title: "The feature list", prompt: "The homepage lists every service the company can perform.", choices: ["Add two more services so nothing is missing", "Choose the reader and the one problem the page will name", "Replace the list with a slogan"], correct: 1, response: "A buyer can repeat a problem they recognize. They cannot repeat a catalogue." },
  { title: "The broad promise", prompt: "The sentence is “We help businesses grow.”", choices: ["Keep it, because it offends no one", "Name who, the problem they feel, and the outcome", "Add adjectives until it sounds premium"], correct: 1, response: "A sentence survives the next room when a specific person can see themselves in it." },
  { title: "The new audience", prompt: "Halfway through the proposal, the team adds a second industry.", choices: ["Mention both so the document feels larger", "Keep this page for one reader and note the other as a separate offer", "Let sales explain the difference on the call"], correct: 1, response: "A second audience is a second page. Folding it in is how the offer starts to drift." },
];

function withCommon(base: AddedWorkshopFields, slides: WorkshopSlide[], practice: CompanionWorkshopCopy["practice"], locale: "en" | "fr"): CompanionWorkshopCopy {
  const shared = locale === "fr"
    ? {
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
      }
    : {
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
  return { ...shared, ...base, slides, practice };
}

const decisionFrBase: AddedWorkshopFields = {
  ...decisionEn,
  metaTitle: "Atelier L’heure de la décision | ROALLA",
  metaDescription: "Un atelier ROALLA pour finir les réunions avec un responsable, un compromis et une prochaine étape écrite.",
  eyebrow: "Atelier Roalla",
  title: "L’heure de la décision",
  promise: "Quitter la salle avec un responsable, pas avec une autre discussion.",
  intro: "Un atelier pour les équipes dont les réunions accumulent des mises à jour et se terminent sans décision que quelqu’un peut répéter.",
  listingLede: "Donner à chaque réunion une question, séparer les mises à jour des décisions, et partir avec un responsable, une date et une trace.",
  audienceLine: "Dirigeants, équipes de projet, fondateurs et personnes qui tiennent des réunions récurrentes",
  heroAlt: "Une couverture marine avec une horloge dorée et trois barres de décision.",
  storyEyebrow: "Pourquoi cet atelier",
  storyTitle: "La réunion finit. La décision, non.",
  storyBody: "Le statut, le débat et la décision partagent souvent le même bloc. Les gens partent avec des notes et sans responsable. L’heure de la décision donne à la salle une question, quatre sorties honnêtes et une trace.",
  storyAside: "Une réunion sans responsable reste une discussion.",
  frameworkEyebrow: "Les quatre mouvements",
  frameworkTitle: "D’une conversation ouverte à une décision close",
  framework: [
    { name: "Préparer", title: "Nommer la décision avant d’ouvrir la salle", body: "Écrire la question, les options déjà connues et ce qui est hors périmètre." },
    { name: "Transformer", title: "Séparer la mise à jour du choix", body: "Les faits peuvent être lus. Le temps en direct sert à la décision." },
    { name: "Émerger", title: "Clore avec un responsable", body: "Nommer qui décide, pour quand, et qui doit être informé." },
    { name: "S’élever", title: "Tenir un rythme de décision", body: "Une courte trace empêche la prochaine réunion de rouvrir un choix clos." },
  ],
  practiceTitle: "Pouvez-vous clore la salle sans exclure les personnes?",
  practiceIntro: "Trois réunions qui ont tendance à s’étendre. Choisissez la réponse qui produit un responsable.",
  planEyebrow: "Votre trace de décision",
  planTitle: "Partir avec trois lignes",
  planIntro: "Nommez une vraie réunion à changer dans les sept jours. Vos réponses restent sur cet appareil.",
  planFields: [
    { label: "Une question", hint: "La décision pour laquelle cette réunion existe." },
    { label: "Un responsable", hint: "Qui décide, pour quand, et ce qu’il décide." },
    { label: "Une trace", hint: "Ce qui a été choisi, reporté, et qui doit le savoir." },
  ],
  toolsEyebrow: "Outils à emporter",
  toolsTitle: "Garder la prochaine réunion capable de finir",
  tools: [
    { title: "Carte de décision", body: "Une question sur l’invitation, avant d’ouvrir la salle.", points: ["La question", "Les options déjà connues", "Ce qui est hors périmètre", "Qui doit être dans la salle"] },
    { title: "Mise à jour ou décision", body: "Lire le statut. Garder le temps en direct pour le choix.", points: ["Mise à jour : lue d’avance", "Décision : discutée en direct", "Stationnement : la nommer et avancer", "Rouvrir seulement avec des faits nouveaux"] },
    { title: "Script de clôture", body: "Finir avec un responsable, une date et les personnes absentes.", points: ["La décision est…", "Le responsable est…", "La date est…", "Nous informerons…"] },
    { title: "Trace de décision", body: "Trois lignes que la prochaine réunion peut croire.", points: ["Choisi", "Reporté", "Informé"] },
  ],
  faqs: [
    { q: "Est-ce une certification en animation de réunions?", a: "Non. C’est une session pratique pour les équipes qui veulent qu’une réunion finisse avec un responsable." },
    { q: "Peut-on l’utiliser pour un comité de direction et une mêlée de projet?", a: "Oui. La même carte sert quand la question est plus petite." },
    { q: "Et si la salle n’a pas l’autorité de décider?", a: "Alors la décision est de nommer qui portera la question à la personne qui l’a, et pour quand." },
    { q: "Quelle est la durée habituelle?", a: "Une session ciblée dure une demi-journée. Elle peut suivre La conversation sur la charge de travail ou Calme numérique." },
  ],
};

const offerFrBase: AddedWorkshopFields = {
  ...offerEn,
  metaTitle: "Atelier L’offre sur une page | ROALLA",
  metaDescription: "Un atelier ROALLA pour dire la même offre dans la conversation de vente, sur le site et dans la proposition.",
  eyebrow: "Atelier Roalla",
  title: "L’offre sur une page",
  promise: "Dire la même offre dans chaque salle.",
  intro: "Un atelier pour les fondateurs et les petites équipes dont l’histoire change entre l’appel, le site et la proposition.",
  listingLede: "Nommer pour qui, le problème déjà ressenti, la preuve qui appartient à la page, et le seul rôle de la prochaine conversation ou du prochain site.",
  audienceLine: "Fondateurs, marketing, ventes et équipes qui préparent un site ou une proposition",
  heroAlt: "Une couverture marine avec une page pâle et un filet doré.",
  storyEyebrow: "Pourquoi cet atelier",
  storyTitle: "L’offre est vraie. Elle n’est pas encore répétable.",
  storyBody: "Un bon service peut encore être décrit de trois façons. L’acheteur entend une promesse différente à l’appel, sur le site et dans la proposition. Cet atelier écrit une page que l’équipe peut répéter.",
  storyAside: "Si l’équipe ne peut pas la répéter, la page ne peut pas la dire.",
  frameworkEyebrow: "Les quatre mouvements",
  frameworkTitle: "D’une histoire dispersée à une page",
  framework: [
    { name: "Préparer", title: "Nommer pour qui", body: "Choisir la personne qui sent déjà le problème, et celles pour qui cette page n’est pas." },
    { name: "Transformer", title: "Séparer la preuve de la promesse", body: "Garder la phrase qu’on peut montrer. Mettre de côté celle qui sonne seulement bien." },
    { name: "Émerger", title: "Convenir de la phrase", body: "La pratiquer jusqu’à ce que deux personnes la disent de la même façon." },
    { name: "S’élever", title: "Donner un seul rôle au prochain support", body: "Le site, le dossier ou la conversation fait une chose. Écrire ce qu’il ne fera pas." },
  ],
  practiceTitle: "Entendez-vous l’offre qui survivra à la prochaine salle?",
  practiceIntro: "Trois versions de la même entreprise. Choisissez la ligne qu’un acheteur peut répéter.",
  planEyebrow: "Votre page",
  planTitle: "Partir avec la page que vous utiliserez",
  planIntro: "Écrivez l’offre que la prochaine conversation doit porter. Vos réponses restent sur cet appareil.",
  planFields: [
    { label: "Pour qui", hint: "La personne qui sent déjà le problème, dans ses mots." },
    { label: "La phrase", hint: "Une ligne que l’équipe répétera à l’appel, sur le site et dans la proposition." },
    { label: "Le rôle de la prochaine page", hint: "Ce que le site, le dossier ou la conversation doit faire—et ce qu’il ne fera pas." },
  ],
  toolsEyebrow: "Outils à emporter",
  toolsTitle: "Garder la même offre après la salle",
  tools: [
    { title: "Ligne de public", body: "Pour qui, et pour qui ce n’est pas.", points: ["Cette personne sent déjà…", "Elle essaie de…", "Ce n’est pas pour…", "Elle décide quand…"] },
    { title: "Carte de preuve", body: "Une promesse reste seulement si on peut la montrer.", points: ["Promesse", "Preuve", "Où elle apparaît", "Ce que nous ne dirons pas"] },
    { title: "Phrase à répéter", body: "Une ligne, dite de la même façon par deux personnes.", points: ["Qui", "Problème", "Résultat", "Prochaine étape"] },
    { title: "Cahier à un rôle", body: "Le prochain support fait un seul travail.", points: ["Le rôle", "Le lecteur", "La preuve", "Hors périmètre"] },
  ],
  faqs: [
    { q: "Est-ce un atelier d’identité de marque?", a: "Non. Il produit l’offre dans une langue que l’équipe peut répéter. L’identité visuelle peut suivre. Ce n’est pas cette session." },
    { q: "Faut-il déjà un site?", a: "Non. La page est un cahier. Elle peut orienter une conversation, une proposition ou le prochain site." },
    { q: "Les ventes et le marketing peuvent-ils y être ensemble?", a: "Oui. L’atelier est plus fort quand les personnes qui disent l’offre dans des salles différentes sont dans la même." },
    { q: "Que se passe-t-il après la session?", a: "Vous partez avec un cahier d’une page. Plusieurs équipes s’en servent pour cadrer un site ou un accompagnement numérique. C’est une conversation distincte." },
  ],
};

export function decisionHourCopy(locale: string): CompanionWorkshopCopy {
  const slides = locale === "fr" ? decisionSlidesEn.map((slide, index) => ({ ...slide, ...(decisionSlidesFr[index] ?? {}) })) : decisionSlidesEn;
  const practice = locale === "fr"
    ? [
        { title: "L’heure de statut", prompt: "L’ordre du jour est plein de mises à jour et la décision est dans les cinq dernières minutes.", choices: ["Laisser courir les mises à jour", "Déplacer les mises à jour dans une note et commencer par la question", "Ajouter une autre réunion"], correct: 1, response: "L’heure peut finir quand la question est première." },
        { title: "La salle divisée", prompt: "Deux options sont claires et la réunion va se terminer avec les deux encore ouvertes.", choices: ["Demander d’autres avis", "Nommer le responsable, la date et l’option choisie", "Planifier un atelier sur la culture"], correct: 1, response: "Une salle divisée a encore besoin d’un responsable." },
        { title: "L’autorité absente", prompt: "La salle est d’accord, puis se rappelle qu’une autre personne doit approuver.", choices: ["Annoncer la décision quand même", "Nommer qui portera la question, et pour quand", "Rouvrir toute la discussion"], correct: 1, response: "L’autorité absente est une décision de transmission." },
      ]
    : decisionPracticeEn;
  return withCommon(locale === "fr" ? decisionFrBase : decisionEn, slides, practice, locale === "fr" ? "fr" : "en");
}

export function offerPageCopy(locale: string): CompanionWorkshopCopy {
  const slides = locale === "fr" ? offerSlidesEn.map((slide, index) => ({ ...slide, ...(offerSlidesFr[index] ?? {}) })) : offerSlidesEn;
  const practice = locale === "fr"
    ? [
        { title: "La liste de fonctions", prompt: "La page d’accueil liste chaque service que l’entreprise peut rendre.", choices: ["Ajouter deux services de plus", "Choisir le lecteur et le seul problème que la page nommera", "Remplacer la liste par un slogan"], correct: 1, response: "Un acheteur peut répéter un problème qu’il reconnaît." },
        { title: "La promesse large", prompt: "La phrase est « Nous aidons les entreprises à croître ».", choices: ["La garder, elle n’offense personne", "Nommer qui, le problème ressenti et le résultat", "Ajouter des adjectifs jusqu’à ce que cela sonne premium"], correct: 1, response: "Une phrase survit quand une personne précise s’y reconnaît." },
        { title: "Le second public", prompt: "Au milieu de la proposition, l’équipe ajoute une deuxième industrie.", choices: ["Mentionner les deux pour agrandir le document", "Garder cette page pour un lecteur et noter l’autre comme une offre distincte", "Laisser les ventes expliquer la différence à l’appel"], correct: 1, response: "Un second public est une seconde page." },
      ]
    : offerPracticeEn;
  return withCommon(locale === "fr" ? offerFrBase : offerEn, slides, practice, locale === "fr" ? "fr" : "en");
}
