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
    { name: "Emerge", title: "Agree the sentence", body: "Practise the offer until two people can say it the same way, then rehearse the delivery on PitchHotshot." },
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
    { title: "Repeat sentence", body: "One line, said the same way by two people. Rehearse it on PitchHotshot: an AI score, and notes from one teammate on the same take.", points: ["Who", "Problem", "Outcome", "Next step"], href: "https://www.pitchhotshot.com/" },
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
  { kicker: "Emerge", title: "Say it until two people match.", body: "The sentence has a person, a problem, an outcome, and a next step. Once it is written, PitchHotshot can score the delivery.", stage: "emerge", visual: "script", points: ["Who|For teams that…", "Problem|When…", "Outcome|So they can…", "Next|The next step is…"], notes: "Practise out loud. Exact words matter less than a shared meaning. Open PitchHotshot only after the sentence exists." },
  { kicker: "Practice", title: "Choose the line a buyer can repeat.", body: "The steadier line is specific enough to remember and honest enough to defend.", stage: "emerge", visual: "practice", points: ["The feature list|Everything the company can do", "The broad promise|Helpful to any business", "The specific offer|One reader, one problem, one next step"], notes: "Use the situations after the slides." },
  { kicker: "Soar", title: "Hand the page to the next asset.", body: "The website, the deck, or the next call inherits the sentence. It does not invent a new one.", stage: "soar", visual: "rhythm", points: ["Reader|Who it is for", "Sentence|What we repeat", "Proof|What we can show", "Job|What this asset must do"], notes: "If a later asset needs a new audience, that is a new page, not a footnote." },
  { kicker: "Your plan", title: "Write the page you will use next.", body: "Who it is for, the sentence, and the job of the next asset.", stage: "soar", visual: "plan", points: ["Reader|Who already feels this?", "Sentence|What will we repeat?", "Job|What must the next page do?"], notes: "Leave time to write." },
  { kicker: "Take-home tools", title: "Keep the offer from drifting.", body: "The audience line, the proof card, the sentence, and the brief stay on this page. The sentence card opens PitchHotshot.", stage: "soar", visual: "tools", points: ["Audience|Who it is for", "Proof|What we can show", "Sentence|What we repeat", "Brief|The job of the next asset"], notes: "Name the tools without reading every line. The sentence card links to PitchHotshot." },
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
  { kicker: "Émerger", title: "Le dire jusqu’à ce que deux personnes concordent.", body: "La phrase a une personne, un problème, un résultat et une prochaine étape. Une fois écrite, PitchHotshot peut noter la prestation.", points: ["Qui|Pour les équipes qui…", "Problème|Quand…", "Résultat|Afin qu’elles puissent…", "Suite|La prochaine étape est…"], notes: "Pratiquer à voix haute. Ouvrir PitchHotshot seulement quand la phrase existe." },
  { kicker: "Pratique", title: "Choisir la ligne qu’un acheteur peut répéter.", body: "La ligne stable est assez précise pour être retenue et assez honnête pour être défendue.", points: ["La liste de fonctions|Tout ce que l’entreprise peut faire", "La promesse large|Utile à toute entreprise", "L’offre précise|Un lecteur, un problème, une suite"], notes: "Utiliser les situations après les diapositives." },
  { kicker: "S’élever", title: "Remettre la page au prochain support.", body: "Le site, le dossier ou le prochain appel hérite de la phrase. Il n’en invente pas une nouvelle.", points: ["Lecteur|Pour qui", "Phrase|Ce que nous répétons", "Preuve|Ce que nous pouvons montrer", "Rôle|Ce que ce support doit faire"], notes: "Un nouveau public demande une nouvelle page." },
  { kicker: "Votre plan", title: "Écrire la page que vous utiliserez.", body: "Pour qui, la phrase, et le rôle du prochain support.", points: ["Lecteur|Qui sent déjà cela?", "Phrase|Que répéterons-nous?", "Rôle|Que doit faire la prochaine page?"], notes: "Laisser un temps d’écriture." },
  { kicker: "Outils", title: "Empêcher l’offre de dériver.", body: "Le public, la preuve, la phrase et le cahier restent sur cette page. La carte de la phrase ouvre PitchHotshot.", points: ["Public|Pour qui", "Preuve|Ce que nous pouvons montrer", "Phrase|Ce que nous répétons", "Cahier|Le rôle du prochain support"], notes: "Nommer les outils sans tout lire. La carte de la phrase ouvre PitchHotshot." },
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
    { name: "Émerger", title: "Convenir de la phrase", body: "La pratiquer jusqu’à ce que deux personnes la disent de la même façon, puis répéter la prestation sur PitchHotshot." },
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
    { title: "Phrase à répéter", body: "Une ligne, dite de la même façon par deux personnes. La répéter sur PitchHotshot : une note d’IA, et les notes d’un coéquipier sur la même prise.", points: ["Qui", "Problème", "Résultat", "Prochaine étape"], href: "https://www.pitchhotshot.com/" },
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

const ideationEn = {
  id: "ideation",
  path: "/programs/workshops/ideation",
  metaTitle: "The Shortlist Workshop | ROALLA",
  metaDescription: "A practical ROALLA workshop for generating ideas inside a constraint, scoring them, and leaving with one experiment that can earn a budget.",
  eyebrow: "Roalla workshop",
  title: "The Shortlist",
  promise: "Leave with ideas that can earn a budget.",
  intro: "A facilitated workshop for teams that need fresh options and keep leaving brainstorms with a wall of sticky notes and no owner.",
  listingLede: "Frame the constraint, separate a wish from an idea that can be tried, and leave with a shortlist, a score, and one experiment.",
  audienceLine: "Founders, product teams, operators, and leaders who must choose before they spend",
  heroImage: "/workshops/ideation/hero.webp",
  heroAlt: "A navy cover with a short pale list and one line marked to try.",
  storyEyebrow: "Why this workshop",
  storyTitle: "The room is full of ideas. None of them can be tried.",
  storyBody: "An open brainstorm protects every suggestion and decides none of them. The Shortlist starts with the constraint the idea must survive, keeps only the options someone can try, and ends with one experiment that has an owner and a way to know if it worked.",
  storyAside: "An idea without a constraint is still a wish.",
  frameworkEyebrow: "The four moves",
  frameworkTitle: "From a wall of notes to one experiment",
  framework: [
    { name: "Prepare", title: "Name the constraint first", body: "Write who it is for, what must not change, and the decision the ideas are meant to inform." },
    { name: "Transform", title: "Turn wishes into options", body: "An option names the person, the change, and how you would know." },
    { name: "Emerge", title: "Score in the open", body: "Use a few shared criteria. The score is a conversation, not a vote that hides disagreement." },
    { name: "Soar", title: "Fund one experiment", body: "The winner leaves with an owner, a small test, and a date to look at the result." },
  ],
  practiceTitle: "Can you hear the idea that can be tried?",
  practiceIntro: "Three familiar brainstorms. Choose the move that produces an option, not another round of suggestions.",
  planEyebrow: "Your shortlist",
  planTitle: "Leave with three lines",
  planIntro: "Name a real decision you can inform within seven days. Your answers stay on this device.",
  planFields: [
    { label: "The constraint", hint: "Who it is for, what must not change, and the decision this list informs." },
    { label: "The shortlist", hint: "Two or three options that name a person, a change, and a way to know." },
    { label: "The experiment", hint: "Who will try the first option, by when, and what result would earn the next step." },
  ],
  toolsEyebrow: "Take-home tools",
  toolsTitle: "Keep the next session from becoming a wall of notes",
  tools: [
    { title: "Constraint card", body: "The idea has to survive something specific.", points: ["Who it is for", "What must not change", "The decision it informs", "What is out of scope"] },
    { title: "Option line", body: "A wish becomes an option only when it can be tried.", points: ["The person", "The change", "How we would know", "What we will not do"] },
    { title: "Score in the open", body: "A few criteria, said aloud.", points: ["Fit for the person", "Possible inside the constraint", "Evidence we could get", "Where we disagree"] },
    { title: "Experiment card", body: "One test, one owner, one date.", points: ["What we will try", "Who owns it", "The date we look", "What would earn the next step"] },
  ],
  faqs: [
    { q: "Is this a design-thinking certification?", a: "No. It is a practical session for choosing among ideas. It does not certify facilitators or replace a product strategy engagement." },
    { q: "Do we need to arrive with ideas?", a: "No. The room can generate them. The session still starts with the constraint, so new ideas have somewhere to land." },
    { q: "What if the group cannot agree?", a: "Disagreement is written on the score. The experiment tests the option, it does not pretend the room was unanimous." },
    { q: "How long is a typical session?", a: "A focused session is a half day. It can follow The Offer on One Page or sit before a decision about budget." },
  ],
} satisfies AddedWorkshopFields;

const ideationSlidesEn: WorkshopSlide[] = [
  { kicker: "Welcome", title: "Leave with an idea you can try.", body: "A useful session ends with a shortlist, not a wall of notes.", stage: "prepare", visual: "photo", statement: "An idea without a constraint is still a wish.", notes: "Ask the room to name a brainstorm that felt energetic and still did not change a decision." },
  { kicker: "The wall", title: "Every suggestion is protected. None is chosen.", body: "Quantity feels like progress when the decision is still unnamed.", stage: "prepare", visual: "load", points: ["Wish|What we hope", "Opinion|What we prefer", "Constraint|What must survive", "Option|What someone can try"], notes: "Ask which of the four the last session actually produced." },
  { kicker: "The path", title: "One constraint. A short list. One experiment.", body: "Four moves turn an open brainstorm into a choice that can earn a budget.", stage: "prepare", visual: "path", points: ["Prepare|Name the constraint", "Transform|Turn wishes into options", "Emerge|Score in the open", "Soar|Fund one experiment"], notes: "Walk the four moves once." },
  { kicker: "Prepare", title: "Write the constraint before the ideas.", body: "If the room does not know what the idea must survive, every note will look equally good.", stage: "prepare", visual: "map", points: ["Person|Who it is for", "Fixed|What must not change", "Decision|What this list will inform", "Out|What this session will not solve"], notes: "A missing constraint is the first thing to repair." },
  { kicker: "Transform", title: "A wish names a hope. An option names a try.", body: "Keep the line that says who changes, what changes, and how you would know.", stage: "transform", visual: "separate", points: ["Wish|We should be more innovative", "Option|This person tries this change", "Know|The signal we will watch", "Park|Interesting, and not this decision"], notes: "Parked ideas are not insults. They are waiting for a different constraint." },
  { kicker: "Transform", title: "Three options are a shortlist. Thirty are a backlog.", body: "The room chooses which ideas are allowed to be scored.", stage: "transform", visual: "choices", points: ["Keep|It fits the person and the constraint", "Combine|Two notes are one option", "Park|Real, and not this decision", "Drop|It cannot be tried"], statement: "A shortlist is a decision about attention.", notes: "Do not score a list the room cannot hold." },
  { kicker: "Emerge", title: "Score where people can hear the disagreement.", body: "A private vote hides the criterion that actually matters.", stage: "emerge", visual: "script", points: ["Fit|Does it serve the person?", "Possible|Can it live inside the constraint?", "Evidence|What could we learn quickly?", "Disagree|Where do we not match?"], notes: "The score starts a conversation. It does not replace one." },
  { kicker: "Practice", title: "Choose the move that produces an option.", body: "The steadier response names a try, not another round of suggestions.", stage: "emerge", visual: "practice", points: ["The sticky wall|Many notes, no constraint", "The favourite|One idea, no way to know", "The tie|Two options, no experiment"], notes: "Use the situations after the slides." },
  { kicker: "Soar", title: "Fund one experiment, not the whole list.", body: "The other options wait. The first one gets an owner and a date.", stage: "soar", visual: "rhythm", points: ["Try|The smallest honest test", "Owner|Who carries it", "Date|When we look at the result", "Next|What result would earn another step"], notes: "An experiment is allowed to fail. A vague pilot is not." },
  { kicker: "Your plan", title: "Write the list you will use.", body: "The constraint, the shortlist, and the experiment.", stage: "soar", visual: "plan", points: ["Constraint|What must the idea survive?", "Shortlist|Which options remain?", "Experiment|Who tries the first one?"], notes: "Leave time to write." },
  { kicker: "Take-home tools", title: "Keep the next session able to choose.", body: "The card, the option line, the score, and the experiment stay on this page.", stage: "soar", visual: "tools", points: ["Card|The constraint first", "Option|A person, a change, a signal", "Score|Said in the open", "Experiment|One owner and a date"], notes: "Name the tools without reading every line." },
  { kicker: "Close", title: "An idea earns its place by being tried.", body: "More notes are not more progress.", stage: "soar", visual: "close", statement: "Put one experiment on a real calendar.", notes: "Invite one commitment and close." },
];

const ideationSlidesFr: Partial<WorkshopSlide>[] = [
  { kicker: "Accueil", title: "Partir avec une idée qu’on peut essayer.", body: "Une session utile finit avec une liste courte, pas un mur de notes.", statement: "Une idée sans contrainte reste un souhait.", notes: "Demander une séance qui a semblé énergique sans changer une décision." },
  { kicker: "Le mur", title: "Chaque suggestion est protégée. Aucune n’est choisie.", body: "La quantité ressemble à du progrès quand la décision n’est pas nommée.", points: ["Souhait|Ce que nous espérons", "Avis|Ce que nous préférons", "Contrainte|Ce qui doit survivre", "Option|Ce que quelqu’un peut essayer"], notes: "Demander lequel des quatre la dernière séance a produit." },
  { kicker: "Le chemin", title: "Une contrainte. Une liste courte. Une expérience.", body: "Quatre mouvements transforment un remue-méninges en choix qui peut mériter un budget.", points: ["Préparer|Nommer la contrainte", "Transformer|Faire des options", "Émerger|Noter à voix haute", "S’élever|Financer une expérience"], notes: "Parcourir les quatre mouvements une fois." },
  { kicker: "Préparer", title: "Écrire la contrainte avant les idées.", body: "Sans ce que l’idée doit survivre, chaque note semble également bonne.", points: ["Personne|Pour qui", "Fixe|Ce qui ne doit pas changer", "Décision|Ce que cette liste éclaire", "Hors|Ce que cette session ne réglera pas"], notes: "Une contrainte absente est la première réparation." },
  { kicker: "Transformer", title: "Un souhait nomme un espoir. Une option nomme un essai.", body: "Garder la ligne qui dit qui change, ce qui change, et comment on le saurait.", points: ["Souhait|Nous devrions être plus innovants", "Option|Cette personne essaie ce changement", "Savoir|Le signal que nous regarderons", "En attente|Intéressant, pas cette décision"], notes: "Une idée en attente n’est pas une insulte." },
  { kicker: "Transformer", title: "Trois options font une liste courte. Trente font un carnet.", body: "La salle choisit quelles idées ont le droit d’être notées.", points: ["Garder|Cela sert la personne et la contrainte", "Combiner|Deux notes sont une option", "Stationner|Réel, mais pas cette décision", "Retirer|Cela ne peut pas être essayé"], statement: "Une liste courte est une décision sur l’attention.", notes: "Ne pas noter une liste que la salle ne peut pas tenir." },
  { kicker: "Émerger", title: "Noter là où l’on entend le désaccord.", body: "Un vote privé cache le critère qui compte vraiment.", points: ["Justesse|Est-ce que cela sert la personne?", "Possible|Peut-il vivre dans la contrainte?", "Preuve|Qu’apprendrions-nous vite?", "Désaccord|Où ne concordons-nous pas?"], notes: "La note ouvre une conversation. Elle ne la remplace pas." },
  { kicker: "Pratique", title: "Choisir le geste qui produit une option.", body: "La réponse stable nomme un essai, pas une autre ronde de suggestions.", points: ["Le mur de notes|Beaucoup de notes, aucune contrainte", "Le favori|Une idée, aucun moyen de savoir", "L’égalité|Deux options, aucune expérience"], notes: "Utiliser les situations après les diapositives." },
  { kicker: "S’élever", title: "Financer une expérience, pas toute la liste.", body: "Les autres options attendent. La première a un responsable et une date.", points: ["Essai|Le plus petit test honnête", "Responsable|Qui le porte", "Date|Quand nous regardons le résultat", "Suite|Quel résultat mériterait une autre étape"], notes: "Une expérience a le droit d’échouer. Un pilote vague, non." },
  { kicker: "Votre plan", title: "Écrire la liste que vous utiliserez.", body: "La contrainte, la liste courte et l’expérience.", points: ["Contrainte|Que doit survivre l’idée?", "Liste|Quelles options restent?", "Expérience|Qui essaie la première?"], notes: "Laisser un temps d’écriture." },
  { kicker: "Outils", title: "Garder la prochaine session capable de choisir.", body: "La carte, la ligne, la note et l’expérience restent sur cette page.", points: ["Carte|La contrainte d’abord", "Option|Une personne, un changement, un signal", "Note|Dite à voix haute", "Expérience|Un responsable et une date"], notes: "Nommer les outils sans tout lire." },
  { kicker: "Clôture", title: "Une idée mérite sa place en étant essayée.", body: "Plus de notes n’est pas plus de progrès.", statement: "Mettre une expérience sur un vrai calendrier.", notes: "Inviter un engagement et clore." },
];

const ideationPracticeEn = [
  { title: "The sticky wall", prompt: "The board is full and nobody has named what the idea must survive.", choices: ["Add another round so quieter people can contribute", "Stop and write the person, the constraint, and the decision", "Pick the idea the senior person likes"], correct: 1, response: "More notes do not help until the room knows what an idea has to survive." },
  { title: "The favourite", prompt: "The group loves one idea and cannot say how they would know it worked.", choices: ["Protect it because the energy is high", "Rewrite it as a person, a change, and a signal", "Schedule a longer innovation offsite"], correct: 1, response: "Affection is not evidence. An option can be tried and watched." },
  { title: "The tie", prompt: "Two options score the same and the meeting is about to adjourn.", choices: ["Vote again until someone wins", "Choose one experiment and write what result would earn the next step", "Keep both in a pilot with no owner"], correct: 1, response: "A tie still needs one try. The other option can wait for the result." },
];

const ideationFrBase: AddedWorkshopFields = {
  ...ideationEn,
  metaTitle: "Atelier La liste courte | ROALLA",
  metaDescription: "Un atelier ROALLA pour générer des idées dans une contrainte, les noter, et partir avec une expérience qui peut mériter un budget.",
  eyebrow: "Atelier Roalla",
  title: "La liste courte",
  promise: "Partir avec des idées qui peuvent mériter un budget.",
  intro: "Un atelier pour les équipes qui ont besoin d’options nouvelles et qui quittent les remue-méninges avec un mur de notes et sans responsable.",
  listingLede: "Poser la contrainte, séparer un souhait d’une idée qu’on peut essayer, et partir avec une liste courte, une note et une expérience.",
  audienceLine: "Fondateurs, équipes produit, opérations et dirigeants qui doivent choisir avant de dépenser",
  heroAlt: "Une couverture marine avec une courte liste pâle et une ligne marquée pour l’essai.",
  storyEyebrow: "Pourquoi cet atelier",
  storyTitle: "La salle est pleine d’idées. Aucune ne peut être essayée.",
  storyBody: "Un remue-méninges ouvert protège chaque suggestion et n’en décide aucune. La liste courte commence par la contrainte, ne garde que les options qu’on peut essayer, et finit avec une expérience, un responsable et un moyen de savoir.",
  storyAside: "Une idée sans contrainte reste un souhait.",
  frameworkEyebrow: "Les quatre mouvements",
  frameworkTitle: "D’un mur de notes à une expérience",
  framework: [
    { name: "Préparer", title: "Nommer d’abord la contrainte", body: "Écrire pour qui, ce qui ne doit pas changer, et la décision que les idées doivent éclairer." },
    { name: "Transformer", title: "Transformer les souhaits en options", body: "Une option nomme la personne, le changement et comment on saurait." },
    { name: "Émerger", title: "Noter à voix haute", body: "Quelques critères partagés. La note est une conversation, pas un vote qui cache le désaccord." },
    { name: "S’élever", title: "Financer une expérience", body: "La première option part avec un responsable, un petit essai et une date pour regarder le résultat." },
  ],
  practiceTitle: "Entendez-vous l’idée qui peut être essayée?",
  practiceIntro: "Trois remue-méninges familiers. Choisissez le geste qui produit une option.",
  planEyebrow: "Votre liste courte",
  planTitle: "Partir avec trois lignes",
  planIntro: "Nommez une vraie décision à éclairer dans les sept jours. Vos réponses restent sur cet appareil.",
  planFields: [
    { label: "La contrainte", hint: "Pour qui, ce qui ne doit pas changer, et la décision que cette liste éclaire." },
    { label: "La liste courte", hint: "Deux ou trois options qui nomment une personne, un changement et un moyen de savoir." },
    { label: "L’expérience", hint: "Qui essaiera la première option, pour quand, et quel résultat mériterait la suite." },
  ],
  toolsEyebrow: "Outils à emporter",
  toolsTitle: "Empêcher la prochaine session de devenir un mur de notes",
  tools: [
    { title: "Carte de contrainte", body: "L’idée doit survivre à quelque chose de précis.", points: ["Pour qui", "Ce qui ne doit pas changer", "La décision éclairée", "Ce qui est hors périmètre"] },
    { title: "Ligne d’option", body: "Un souhait devient une option seulement s’il peut être essayé.", points: ["La personne", "Le changement", "Comment nous saurions", "Ce que nous ne ferons pas"] },
    { title: "Note à voix haute", body: "Quelques critères, dits dans la salle.", points: ["Justesse pour la personne", "Possible dans la contrainte", "Preuve qu’on peut obtenir", "Là où nous ne concordons pas"] },
    { title: "Carte d’expérience", body: "Un essai, un responsable, une date.", points: ["Ce que nous essaierons", "Qui le porte", "La date où nous regardons", "Ce qui mériterait la suite"] },
  ],
  faqs: [
    { q: "Est-ce une certification en design thinking?", a: "Non. C’est une session pratique pour choisir parmi des idées. Elle ne certifie pas les animateurs et ne remplace pas une stratégie de produit." },
    { q: "Faut-il arriver avec des idées?", a: "Non. La salle peut les produire. La session commence quand même par la contrainte, pour que les idées aient un endroit où atterrir." },
    { q: "Et si le groupe n’est pas d’accord?", a: "Le désaccord s’écrit sur la note. L’expérience teste l’option. Elle ne prétend pas que la salle était unanime." },
    { q: "Quelle est la durée habituelle?", a: "Une session ciblée dure une demi-journée. Elle peut suivre L’offre sur une page ou précéder une décision de budget." },
  ],
};

export function ideationCopy(locale: string): CompanionWorkshopCopy {
  const slides = locale === "fr" ? ideationSlidesEn.map((slide, index) => ({ ...slide, ...(ideationSlidesFr[index] ?? {}) })) : ideationSlidesEn;
  const practice = locale === "fr"
    ? [
        { title: "Le mur de notes", prompt: "Le tableau est plein et personne n’a nommé ce que l’idée doit survivre.", choices: ["Ajouter une ronde pour les personnes plus silencieuses", "S’arrêter et écrire la personne, la contrainte et la décision", "Choisir l’idée que préfère la personne la plus senior"], correct: 1, response: "Plus de notes n’aident pas tant que la salle ne sait pas ce qu’une idée doit survivre." },
        { title: "Le favori", prompt: "Le groupe aime une idée et ne peut pas dire comment il saurait qu’elle a fonctionné.", choices: ["La protéger parce que l’énergie est haute", "La réécrire comme une personne, un changement et un signal", "Planifier une plus longue retraite d’innovation"], correct: 1, response: "L’affection n’est pas une preuve. Une option peut être essayée et observée." },
        { title: "L’égalité", prompt: "Deux options ont la même note et la réunion va se terminer.", choices: ["Voter encore jusqu’à ce que quelqu’un gagne", "Choisir une expérience et écrire quel résultat mériterait la suite", "Garder les deux dans un pilote sans responsable"], correct: 1, response: "Une égalité a encore besoin d’un essai. L’autre option peut attendre le résultat." },
      ]
    : ideationPracticeEn;
  return withCommon(locale === "fr" ? ideationFrBase : ideationEn, slides, practice, locale === "fr" ? "fr" : "en");
}

const firstOfferEn = {
  id: "first-offer",
  path: "/programs/workshops/first-offer",
  metaTitle: "The First Offer Workshop | ROALLA",
  metaDescription: "A practical ROALLA workshop for young founders and high school teams who need one person, one sentence, and one proof before a website, an app, or a pitch deck.",
  eyebrow: "Roalla workshop",
  title: "The First Offer",
  promise: "Leave with one person, one sentence, and one proof you can show.",
  intro: "A facilitated workshop for young entrepreneurs and high school teams whose idea is still “an app for everyone” and whose pitch changes every time they say it.",
  listingLede: "Name one person who already feels the problem, write a sentence two people can repeat, and rehearse it with an AI score and one person’s notes.",
  audienceLine: "High school entrepreneurship classes, CEGEP clubs, and young founders before a first page or a first pitch",
  heroImage: "/workshops/first-offer/hero.webp",
  heroAlt: "A navy cover with one pale page, a gold line, and a small rehearsal mark.",
  storyEyebrow: "Why this workshop",
  storyTitle: "The idea is exciting. It is not yet an offer.",
  storyBody: "A first venture usually collects a logo, a deck, and a wish to build an app. Buyers, teachers, and judges still cannot repeat who it is for. The First Offer writes that sentence, parks the claims that cannot be shown, and sends the sentence into PitchHotshot so an AI score and a real person can both hear it.",
  storyAside: "If two people cannot say it, the page cannot say it.",
  frameworkEyebrow: "The four moves",
  frameworkTitle: "From a wish to a sentence that can be rehearsed",
  framework: [
    { name: "Prepare", title: "Name one person", body: "Choose someone who already feels the problem. A category such as “everyone” or “Gen Z” does not count." },
    { name: "Transform", title: "Separate the wish from the offer", body: "An app, a logo, and a slogan can wait. The sentence names a person, a problem, and a next step." },
    { name: "Emerge", title: "Say it until two people match", body: "In a bilingual room, the sentence has to survive English and French." },
    { name: "Soar", title: "Rehearse it with a person and a score", body: "PitchHotshot scores the delivery. One teammate, teacher, or mentor leaves notes on the same take." },
  ],
  practiceTitle: "Can you hear the offer a stranger could repeat?",
  practiceIntro: "Three first pitches. Choose the line that names a person and something that can be shown.",
  planEyebrow: "Your first offer",
  planTitle: "Leave with three lines",
  planIntro: "Write the offer you will say this week. Your answers stay on this device.",
  planFields: [
    { label: "One person", hint: "Who already feels this, in their words, and who this is not for." },
    { label: "One sentence", hint: "The line two people can repeat. Add the French or English line if the room needs both." },
    { label: "One proof and one rehearsal", hint: "What you can show, and who will listen on PitchHotshot besides the score." },
  ],
  toolsEyebrow: "Take-home tools",
  toolsTitle: "Keep the first offer sayable after the room",
  tools: [
    { title: "Audience line", body: "One person who already feels the problem, and who this is not for.", points: ["They already feel…", "They are trying to…", "They are not…", "They can act when…"] },
    { title: "Repeat sentence", body: "One line, said the same way by two people. Both languages if the room needs both.", points: ["Who", "Problem", "Outcome", "Next step"] },
    { title: "Proof card", body: "A claim stays only if it can be shown this month.", points: ["Claim", "Proof you have", "Proof you still need", "What you will not say yet"] },
    { title: "PitchHotshot", body: "Rehearse the sentence with an AI score and a person. A teammate, teacher, or mentor can leave notes on the same take.", points: ["Record or paste the sentence", "Read the delivery score", "Send a guest link to one person", "Revise once from both"], href: "https://www.pitchhotshot.com/" },
  ],
  faqs: [
    { q: "Is this a course on how to start a company?", a: "No. It produces the first offer in language two people can repeat. Registration, pricing, and a full business plan can follow. They are not this session." },
    { q: "Do we need a website or an app already?", a: "No. The sentence comes first. The next page, if there is one, gets one job and a list of what it will not do." },
    { q: "Can a high school class and a young founder use the same workshop?", a: "Yes. The examples change. A class may work a club, a team, or a school event. A young founder works a first customer." },
    { q: "What is PitchHotshot doing in the session?", a: "It is Roalla’s rehearsal tool. The AI scores delivery. A person you invite can comment on the same take. The workshop still writes the offer before anyone records it." },
  ],
} satisfies AddedWorkshopFields;

const firstOfferSlidesEn: WorkshopSlide[] = [
  { kicker: "Welcome", title: "One person. One sentence. One proof.", body: "A first venture needs an offer someone else can repeat.", stage: "prepare", visual: "photo", statement: "If two people cannot say it, the page cannot say it.", notes: "Ask two people to describe the idea in one sentence. Notice where they diverge." },
  { kicker: "The wish", title: "An app, a logo, and a deck arrived early.", body: "The exciting parts showed up before the person who already feels the problem.", stage: "prepare", visual: "load", points: ["Wish|An app for everyone", "Slogan|A line that offends no one", "Deck|Slides before a sentence", "Offer|A person, a problem, a next step"], notes: "The wish is usually loyalty to every possible user at once." },
  { kicker: "The path", title: "Name them. Say it. Show it. Rehearse it.", body: "Four moves turn a wish into a sentence that can be heard.", stage: "prepare", visual: "path", points: ["Prepare|Name one person", "Transform|Separate the wish from the offer", "Emerge|Say it until two people match", "Soar|Rehearse with a score and a person"], notes: "Walk the four moves once." },
  { kicker: "Prepare", title: "Write one person in their words.", body: "A classmate, a coach, a local shop, or a first customer. “Everyone” is not a person.", stage: "prepare", visual: "map", points: ["Person|Who already feels this", "Words|How they describe it", "Not for|Who this offer will not chase", "Moment|When they can act"], notes: "Push for a person, not a generation or a market." },
  { kicker: "Transform", title: "A claim needs proof, or it leaves the sentence.", body: "Impressive language that cannot be shown becomes a risk in the next conversation.", stage: "transform", visual: "separate", points: ["Claim|What we want to say", "Proof|What we can show this month", "Missing|What we still need", "Park|The app, the logo, the extra audience"], notes: "Parked pieces are not failures. They are waiting." },
  { kicker: "Transform", title: "The next page has one job.", body: "A site, a booth, or a school event can share the offer and still do one thing.", stage: "transform", visual: "choices", points: ["Start a conversation|They know who to talk to", "Explain the offer|They can repeat it", "Show one proof|They see a real thing", "Out of scope|Usually: it is not an app yet"], statement: "One job, written down, is a brief.", notes: "Choosing the job is the decision. The build comes later." },
  { kicker: "Emerge", title: "Say it until two people match.", body: "The sentence has a person, a problem, an outcome, and a next step. Both languages if the room needs both.", stage: "emerge", visual: "script", points: ["Who|For people who…", "Problem|When…", "Outcome|So they can…", "Next|The next step is…"], notes: "Practise out loud. A bilingual room does not get to skip a language." },
  { kicker: "Practice", title: "Choose the line a stranger can repeat.", body: "The steadier line is specific enough to remember and honest enough to defend.", stage: "emerge", visual: "practice", points: ["The app for everyone|No person, no proof", "The slogan|Sounds large, says little", "The first offer|One person, one problem, one next step"], notes: "Use the situations after the slides." },
  { kicker: "Soar", title: "Rehearse with a score and a person.", body: "PitchHotshot scores the delivery. One teammate, teacher, or mentor comments on the same take.", stage: "soar", visual: "rhythm", points: ["Sentence|What we repeat", "Score|What the delivery shows", "Person|Who else will listen", "Revise|One change from both"], notes: "The tool does not invent the offer. The room already wrote it." },
  { kicker: "Your plan", title: "Write the offer you will use this week.", body: "One person, one sentence, and the rehearsal.", stage: "soar", visual: "plan", points: ["Person|Who already feels this?", "Sentence|What will we repeat?", "Rehearsal|Who listens besides the score?"], notes: "Leave time to write." },
  { kicker: "Take-home tools", title: "Keep the offer from drifting.", body: "The audience line, the sentence, the proof, and PitchHotshot stay on this page.", stage: "soar", visual: "tools", points: ["Audience|One person", "Sentence|What we repeat", "Proof|What we can show", "PitchHotshot|AI score plus one person’s notes"], notes: "Name the tools without reading every line. Open PitchHotshot when the sentence exists." },
  { kicker: "Close", title: "Say it once to a real person.", body: "The next room should not have to invent the story.", stage: "soar", visual: "close", statement: "Use the sentence in one real conversation this week.", notes: "Invite one commitment and close." },
];

const firstOfferSlidesFr: Partial<WorkshopSlide>[] = [
  { kicker: "Accueil", title: "Une personne. Une phrase. Une preuve.", body: "Un premier projet a besoin d’une offre que quelqu’un d’autre peut répéter.", statement: "Si deux personnes ne peuvent pas la dire, la page ne peut pas la dire.", notes: "Demander à deux personnes de décrire l’idée en une phrase." },
  { kicker: "Le souhait", title: "Une appli, un logo et un dossier sont arrivés trop tôt.", body: "Les parties excitantes sont arrivées avant la personne qui sent déjà le problème.", points: ["Souhait|Une appli pour tout le monde", "Slogan|Une ligne qui n’offense personne", "Dossier|Des diapositives avant une phrase", "Offre|Une personne, un problème, une suite"], notes: "Le souhait vient souvent de vouloir servir tout le monde." },
  { kicker: "Le chemin", title: "La nommer. La dire. La montrer. La répéter.", body: "Quatre mouvements transforment un souhait en phrase qu’on peut entendre.", points: ["Préparer|Nommer une personne", "Transformer|Séparer le souhait de l’offre", "Émerger|La dire jusqu’à concordance", "S’élever|Répéter avec une note et une personne"], notes: "Parcourir les quatre mouvements une fois." },
  { kicker: "Préparer", title: "Écrire une personne dans ses mots.", body: "Un camarade, un entraîneur, un commerce local ou un premier client. « Tout le monde » n’est pas une personne.", points: ["Personne|Qui sent déjà cela", "Mots|Comment cette personne le dit", "Pas pour|Qui cette offre ne poursuit pas", "Moment|Quand elle peut agir"], notes: "Demander une personne, pas une génération." },
  { kicker: "Transformer", title: "Une promesse a besoin d’une preuve, ou elle quitte la phrase.", body: "Un langage impressionnant qu’on ne peut pas montrer devient un risque.", points: ["Promesse|Ce que nous voulons dire", "Preuve|Ce que nous pouvons montrer ce mois-ci", "Manque|Ce qu’il nous faut encore", "En attente|L’appli, le logo, le second public"], notes: "Une pièce en attente n’est pas un échec." },
  { kicker: "Transformer", title: "La prochaine page a un seul rôle.", body: "Un site, un kiosque ou un événement d’école peut partager l’offre et faire une seule chose.", points: ["Ouvrir|La personne sait à qui parler", "Expliquer|Elle peut répéter l’offre", "Montrer|Elle voit une chose réelle", "Hors périmètre|Souvent : ce n’est pas encore une appli"], statement: "Un rôle écrit est un cahier.", notes: "Choisir le rôle est la décision." },
  { kicker: "Émerger", title: "La dire jusqu’à ce que deux personnes concordent.", body: "La phrase a une personne, un problème, un résultat et une suite. Les deux langues si la salle en a besoin.", points: ["Qui|Pour les personnes qui…", "Problème|Quand…", "Résultat|Afin qu’elles puissent…", "Suite|La prochaine étape est…"], notes: "Pratiquer à voix haute. Une salle bilingue ne saute pas une langue." },
  { kicker: "Pratique", title: "Choisir la ligne qu’un inconnu peut répéter.", body: "La ligne stable est assez précise pour être retenue et assez honnête pour être défendue.", points: ["L’appli pour tous|Aucune personne, aucune preuve", "Le slogan|Cela sonne grand et dit peu", "La première offre|Une personne, un problème, une suite"], notes: "Utiliser les situations après les diapositives." },
  { kicker: "S’élever", title: "Répéter avec une note et une personne.", body: "PitchHotshot note la prestation. Un coéquipier, un enseignant ou un mentor commente la même prise.", points: ["Phrase|Ce que nous répétons", "Note|Ce que la prestation montre", "Personne|Qui d’autre écoutera", "Révision|Un changement à partir des deux"], notes: "L’outil n’invente pas l’offre. La salle l’a déjà écrite." },
  { kicker: "Votre plan", title: "Écrire l’offre que vous utiliserez cette semaine.", body: "Une personne, une phrase, et la répétition.", points: ["Personne|Qui sent déjà cela?", "Phrase|Que répéterons-nous?", "Répétition|Qui écoute en plus de la note?"], notes: "Laisser un temps d’écriture." },
  { kicker: "Outils", title: "Empêcher l’offre de dériver.", body: "Le public, la phrase, la preuve et PitchHotshot restent sur cette page.", points: ["Public|Une personne", "Phrase|Ce que nous répétons", "Preuve|Ce que nous pouvons montrer", "PitchHotshot|Note de l’IA et notes d’une personne"], notes: "Ouvrir PitchHotshot quand la phrase existe." },
  { kicker: "Clôture", title: "La dire une fois à une vraie personne.", body: "La prochaine salle ne devrait pas avoir à inventer l’histoire.", statement: "Utiliser la phrase dans une vraie conversation cette semaine.", notes: "Inviter un engagement et clore." },
];

const firstOfferPracticeEn = [
  { title: "The app for everyone", prompt: "The pitch is “an app that helps anyone be more productive.”", choices: ["Add more features so every user is covered", "Name one person who already feels the problem, and what this is not", "Design the logo while the idea is fresh"], correct: 1, response: "A stranger can repeat a person they recognize. They cannot repeat everyone." },
  { title: "The slogan", prompt: "The sentence is “We help young people win.”", choices: ["Keep it, because it sounds confident", "Name who, the problem they feel, and the next step", "Translate it into a second language without changing it"], correct: 1, response: "A large line still needs a person and a problem. Translation does not create either." },
  { title: "The proof that is still a plan", prompt: "The deck says the team has “hundreds of users” and the room has talked to three classmates.", choices: ["Leave the number in, because the pitch needs scale", "Say the three conversations, and park the number until it is true", "Skip proof and record the pitch now"], correct: 1, response: "Proof you can show belongs in the sentence. Proof you hope for waits." },
];

const firstOfferFrBase: AddedWorkshopFields = {
  ...firstOfferEn,
  metaTitle: "Atelier La première offre | ROALLA",
  metaDescription: "Un atelier ROALLA pour les jeunes entrepreneurs et les équipes du secondaire qui ont besoin d’une personne, d’une phrase et d’une preuve avant un site, une appli ou un dossier.",
  eyebrow: "Atelier Roalla",
  title: "La première offre",
  promise: "Partir avec une personne, une phrase et une preuve qu’on peut montrer.",
  intro: "Un atelier pour les jeunes entrepreneurs et les équipes du secondaire dont l’idée est encore « une appli pour tout le monde » et dont le discours change à chaque fois.",
  listingLede: "Nommer une personne qui sent déjà le problème, écrire une phrase que deux personnes peuvent répéter, puis la répéter avec une note d’IA et les notes d’une personne.",
  audienceLine: "Classes d’entrepreneuriat au secondaire, clubs de cégep et jeunes fondateurs avant une première page ou un premier discours",
  heroAlt: "Une couverture marine avec une page pâle, un filet doré et une petite marque de répétition.",
  storyEyebrow: "Pourquoi cet atelier",
  storyTitle: "L’idée est excitante. Ce n’est pas encore une offre.",
  storyBody: "Un premier projet collectionne souvent un logo, un dossier et le souhait de bâtir une appli. Personne ne peut encore répéter pour qui c’est. La première offre écrit cette phrase, met de côté ce qu’on ne peut pas montrer, et l’envoie dans PitchHotshot pour qu’une note d’IA et une vraie personne l’entendent.",
  storyAside: "Si deux personnes ne peuvent pas la dire, la page ne peut pas la dire.",
  frameworkEyebrow: "Les quatre mouvements",
  frameworkTitle: "D’un souhait à une phrase qu’on peut répéter",
  framework: [
    { name: "Préparer", title: "Nommer une personne", body: "Choisir quelqu’un qui sent déjà le problème. « Tout le monde » ou « la génération Z » ne compte pas." },
    { name: "Transformer", title: "Séparer le souhait de l’offre", body: "L’appli, le logo et le slogan peuvent attendre. La phrase nomme une personne, un problème et une suite." },
    { name: "Émerger", title: "La dire jusqu’à ce que deux personnes concordent", body: "Dans une salle bilingue, la phrase doit survivre en français et en anglais." },
    { name: "S’élever", title: "La répéter avec une personne et une note", body: "PitchHotshot note la prestation. Un coéquipier, un enseignant ou un mentor laisse des notes sur la même prise." },
  ],
  practiceTitle: "Entendez-vous l’offre qu’un inconnu pourrait répéter?",
  practiceIntro: "Trois premiers discours. Choisissez la ligne qui nomme une personne et quelque chose qu’on peut montrer.",
  planEyebrow: "Votre première offre",
  planTitle: "Partir avec trois lignes",
  planIntro: "Écrivez l’offre que vous direz cette semaine. Vos réponses restent sur cet appareil.",
  planFields: [
    { label: "Une personne", hint: "Qui sent déjà cela, dans ses mots, et pour qui ce n’est pas." },
    { label: "Une phrase", hint: "La ligne que deux personnes peuvent répéter. Ajoutez l’autre langue si la salle en a besoin." },
    { label: "Une preuve et une répétition", hint: "Ce que vous pouvez montrer, et qui écoutera sur PitchHotshot en plus de la note." },
  ],
  toolsEyebrow: "Outils à emporter",
  toolsTitle: "Garder la première offre dicible après la salle",
  tools: [
    { title: "Ligne de public", body: "Une personne qui sent déjà le problème, et pour qui ce n’est pas.", points: ["Cette personne sent déjà…", "Elle essaie de…", "Ce n’est pas pour…", "Elle peut agir quand…"] },
    { title: "Phrase à répéter", body: "Une ligne, dite de la même façon par deux personnes. Les deux langues si la salle en a besoin.", points: ["Qui", "Problème", "Résultat", "Prochaine étape"] },
    { title: "Carte de preuve", body: "Une promesse reste seulement si on peut la montrer ce mois-ci.", points: ["Promesse", "Preuve que vous avez", "Preuve qu’il vous faut encore", "Ce que vous ne direz pas encore"] },
    { title: "PitchHotshot", body: "Répéter la phrase avec une note d’IA et une personne. Un coéquipier, un enseignant ou un mentor peut laisser des notes sur la même prise.", points: ["Enregistrer ou coller la phrase", "Lire la note de prestation", "Envoyer un lien invité à une personne", "Réviser une fois à partir des deux"], href: "https://www.pitchhotshot.com/" },
  ],
  faqs: [
    { q: "Est-ce un cours pour fonder une entreprise?", a: "Non. Il produit la première offre dans une langue que deux personnes peuvent répéter. L’enregistrement, le prix et un plan d’affaires complet peuvent suivre. Ce n’est pas cette session." },
    { q: "Faut-il déjà un site ou une appli?", a: "Non. La phrase vient d’abord. La prochaine page, s’il y en a une, a un seul rôle et une liste de ce qu’elle ne fera pas." },
    { q: "Une classe du secondaire et un jeune fondateur peuvent-ils suivre le même atelier?", a: "Oui. Les exemples changent. Une classe peut travailler un club, une équipe ou un événement d’école. Un jeune fondateur travaille un premier client." },
    { q: "Que fait PitchHotshot dans la session?", a: "C’est l’outil de répétition de Roalla. L’IA note la prestation. Une personne invitée peut commenter la même prise. L’atelier écrit quand même l’offre avant tout enregistrement." },
  ],
};

export function firstOfferCopy(locale: string): CompanionWorkshopCopy {
  const slides = locale === "fr" ? firstOfferSlidesEn.map((slide, index) => ({ ...slide, ...(firstOfferSlidesFr[index] ?? {}) })) : firstOfferSlidesEn;
  const practice = locale === "fr"
    ? [
        { title: "L’appli pour tout le monde", prompt: "Le discours est « une appli qui aide n’importe qui à être plus productif ».", choices: ["Ajouter des fonctions pour couvrir chaque utilisateur", "Nommer une personne qui sent déjà le problème, et pour qui ce n’est pas", "Dessiner le logo pendant que l’idée est fraîche"], correct: 1, response: "Un inconnu peut répéter une personne qu’il reconnaît. Il ne peut pas répéter tout le monde." },
        { title: "Le slogan", prompt: "La phrase est « Nous aidons les jeunes à gagner ».", choices: ["La garder, elle sonne confiante", "Nommer qui, le problème ressenti et la prochaine étape", "La traduire sans la changer"], correct: 1, response: "Une grande ligne a encore besoin d’une personne et d’un problème." },
        { title: "La preuve qui est encore un plan", prompt: "Le dossier dit « des centaines d’utilisateurs » et la salle a parlé à trois camarades.", choices: ["Laisser le chiffre, le discours a besoin d’échelle", "Dire les trois conversations, et mettre le chiffre de côté jusqu’à ce qu’il soit vrai", "Passer la preuve et enregistrer maintenant"], correct: 1, response: "La preuve qu’on peut montrer appartient à la phrase. Celle qu’on espère attend." },
      ]
    : firstOfferPracticeEn;
  return withCommon(locale === "fr" ? firstOfferFrBase : firstOfferEn, slides, practice, locale === "fr" ? "fr" : "en");
}
