/**
 * Step-by-step requests for the Chat Buddy — shared by the website and the app.
 * Edit here only; the app copies it with `npm run sync-data`.
 *
 * The questions come from the same data the Services and Supplies pages use
 * (servicesData + serviceLayout, suppliesData.supplyOrdering, propertyData), so
 * the chat, the website and the app always ask the same things.
 * Every question has a "Not sure — please advise" choice — first, in a green box, in words that
 * fit the question (owner, 2 Nov 2026: customers close the app when they see too many questions).
 */
import servicesData from './servicesData.js'
import { sectionKind } from './serviceLayout.js'
import { supplyCategories, supplyOrdering } from './suppliesData.js'
import { svcText } from './servicesTe.js'
import { propertyIntents } from './propertyData.js'
import { quickTowns, currentTown, currentCity } from './cities.js'
import { fieldsFor, detailsForTeam, splitPapers, papersText, papersFirst, detailsAfterPapers, readFromPapersForTeam, readFromPapersText } from './serviceFields.js'

export const NOT_SURE = 'Not sure — please advise'
export const NOT_SURE_VALUE = '__notsure__'
export const DONE_VALUE = '__done__'
// Details asked in the chat (owner, 30 Oct 2026: details are collected in the app, all optional)
export const DETAILS_YES = '__details_yes__'
export const DETAILS_SKIP = '__details_skip__'
export const SKIP_VALUE = '__skip__'
export const SKIP_REST_VALUE = '__skip_rest__'
// "Not sure" → skip the other questions (owner, 2 Nov 2026): the answers given so far are kept,
// town and timing are still asked, and the team sees "Other questions: … (please advise)".
export const SKIPPED_KEY = '__skipped__'
export const SKIP_YES = '__skip_yes__'
export const SKIP_NO = '__skip_no__'
export const SKIPPED_A = 'Skipped — our expert will ask on the call'

const T = {
  en: {
    notSure: NOT_SURE,
    done: '✔ Done',
    // Multi-pick steps: one big "Next" button once something is picked (owner: "Done" was confusing)
    next: (n) => `Next → (${n} picked)`,
    multiHint: 'You can pick **more than one**. Then tap **Next**.',
    papersAsk: 'Which papers do you have? Tap the ones you have.',
    papersNone: 'None of these yet',
    papersTip: 'Missing one? We help you get it.',
    chooseAsk: 'What do you need?',
    qtyAsk: (unit) => `How much do you need? (in ${unit})`,
    qtyTip: 'Type any amount, e.g. "120" — or pick one.',
    townAsk: 'Which town or village is this for?',
    townTip: 'Not in the list? Just type the name.',
    whenAsk: 'When do you need it?',
    notesAsk: 'Anything else we should know? (optional)',
    notesNo: 'No, that\'s all',
    jobAsk: 'Which one do you need?',
    pickSupply: 'Which supply do you need?',
    pickProperty: 'What would you like to do?',
    other: 'Something else',
    step: (n, of) => `Step ${n} of ${of}`,
    detailsKey: 'Your details',
    detailsAsk: 'Your details help us send the price faster. All are optional — fill them now?',
    detailsTip: 'Only the iN Empower team sees these. No Aadhaar or PAN numbers needed.',
    detailsYes: (n) => `✍️ Yes, fill now (${n} short questions)`,
    detailsSkip: '⏭️ Skip for now',
    skip: '⏭️ Skip',
    skipRest: '⏩ Skip the rest',
    dateTip: 'Type the date like 12-03-2015.',
    adviseLine: 'Our expert will call and advise',
    skipAsk: (n) => (n === 1 ? 'Skip the other question? Our expert will ask it on the call.' : `Skip the other ${n} questions? Our expert will ask them on the call.`),
    skipYes: 'Yes, skip',
    skipNo: 'No, I\'ll answer',
    freeAdvice: 'Not sure? Get free advice',
    freeAdviceSub: 'Skip the questions — our expert will call and advise',
    skippedNote: 'Our expert will ask the rest on the call.',
    showAgain: 'Show the questions again',
    townType: 'Or type your town or village',
    townNeed: 'Please pick your town or village, or type it.',
  },
  te: {
    notSure: 'తెలియదు — సలహా ఇవ్వండి',
    done: '✔ అయిపోయింది',
    next: (n) => `తర్వాత → (${n} ఎంచుకున్నారు)`,
    multiHint: 'మీరు **ఒకటి కంటే ఎక్కువ** ఎంచుకోవచ్చు. ఆపై **తర్వాత →** నొక్కండి.',
    papersAsk: 'మీ దగ్గర ఏ పత్రాలు ఉన్నాయి? ఉన్నవాటిని నొక్కండి.',
    papersNone: 'ఇంకా ఏమీ లేవు',
    papersTip: 'ఏదైనా లేకపోతే, తెచ్చుకోవడంలో మేము సహాయం చేస్తాము.',
    chooseAsk: 'మీకు ఏమి కావాలి?',
    qtyAsk: (unit) => `ఎంత కావాలి? (${unit}లో)`,
    qtyTip: 'ఏ సంఖ్య అయినా టైప్ చేయండి, ఉదా. "120" — లేదా ఒకటి ఎంచుకోండి.',
    townAsk: 'ఇది ఏ ఊరు లేదా గ్రామం కోసం?',
    townTip: 'జాబితాలో లేకపోతే పేరు టైప్ చేయండి.',
    whenAsk: 'ఎప్పుడు కావాలి?',
    notesAsk: 'ఇంకా ఏమైనా చెప్పాలనుకుంటున్నారా? (ఐచ్ఛికం)',
    notesNo: 'లేదు, అంతే',
    jobAsk: 'మీకు ఏది కావాలి?',
    pickSupply: 'మీకు ఏ సామగ్రి కావాలి?',
    pickProperty: 'మీరు ఏమి చేయాలనుకుంటున్నారు?',
    other: 'ఇంకేదైనా',
    step: (n, of) => `దశ ${n} / ${of}`,
    detailsKey: 'మీ వివరాలు',
    detailsAsk: 'మీ వివరాలు ఇస్తే ధర త్వరగా చెప్పగలము. అన్నీ ఐచ్ఛికం — ఇప్పుడే ఇస్తారా?',
    detailsTip: 'ఇవి iN Empower బృందం మాత్రమే చూస్తుంది. ఆధార్, పాన్ నంబర్లు అవసరం లేదు.',
    detailsYes: (n) => `✍️ సరే, ఇప్పుడే ఇస్తాను (${n} చిన్న ప్రశ్నలు)`,
    detailsSkip: '⏭️ ఇప్పుడు వద్దు',
    skip: '⏭️ వదిలేయండి',
    skipRest: '⏩ మిగతావి వదిలేయండి',
    dateTip: 'తేదీని ఇలా టైప్ చేయండి: 12-03-2015.',
    adviseLine: 'మా నిపుణులు కాల్ చేసి సలహా ఇస్తారు',
    skipAsk: (n) => (n === 1 ? 'మిగతా ప్రశ్న వదిలేయాలా? మా నిపుణులు కాల్‌లో అడుగుతారు.' : `మిగతా ${n} ప్రశ్నలు వదిలేయాలా? మా నిపుణులు కాల్‌లో అడుగుతారు.`),
    skipYes: 'అవును, వదిలేయండి',
    skipNo: 'వద్దు, నేను చెబుతాను',
    freeAdvice: 'తెలియదా? ఉచిత సలహా తీసుకోండి',
    freeAdviceSub: 'ప్రశ్నలు వదిలేయండి — మా నిపుణులు కాల్ చేసి సలహా ఇస్తారు',
    skippedNote: 'మిగతావి మా నిపుణులు కాల్‌లో అడుగుతారు.',
    showAgain: 'ప్రశ్నలు మళ్ళీ చూపించండి',
    townType: 'లేదా మీ ఊరు / గ్రామం పేరు టైప్ చేయండి',
    townNeed: 'దయచేసి మీ ఊరు లేదా గ్రామం ఎంచుకోండి, లేదా టైప్ చేయండి.',
  },
}
export const chatText = (lang) => T[lang === 'te' ? 'te' : 'en']

/* ─────────────── "Not sure" in words that fit the question (owner, 2 Nov 2026) ───────────────
   Shown first, in a green box with a phone icon. What the team receives stays NOT_SURE. */
const NOT_SURE_WORDS = {
  advise: [NOT_SURE, 'తెలియదు — సలహా ఇవ్వండి'],
  when: ['Not decided yet — call me', 'ఇంకా నిర్ణయించలేదు — కాల్ చేయండి'],
  budget: ['Not sure — please suggest', 'తెలియదు — సూచించండి'],
  weight: ["Don't know the weight — please check", 'బరువు తెలియదు — చూసి చెప్పండి'],
  count: ['Not sure how many — please advise', 'ఎన్ని అనేది తెలియదు — సలహా ఇవ్వండి'],
  size: ["Don't know the size — please check", 'కొలత తెలియదు — చూసి చెప్పండి'],
  much: ['Not sure how much — please advise', 'ఎంత కావాలో తెలియదు — సలహా ఇవ్వండి'],
  choose: ['Not sure — help me choose', 'తెలియదు — ఎంచుకోవడంలో సహాయం చేయండి'],
}
/** Which "Not sure" words fit a question (pass the English question or heading). */
export function notSureKind(question) {
  const q = String(question || '').toLowerCase()
  if (/budget|loan amount|price|cost/.test(q)) return 'budget'
  if (/^when\b|\bwhen (do|is|are|should|will)\b|\bstart\b|timeline|\bdate\b|time of day|preferred time|plan to travel/.test(q)) return 'when'
  if (/weight|heavy/.test(q)) return 'weight'
  if (/how many|guests|pieces|people|group size/.test(q)) return 'count'
  if (/how big|size|^area$|area\?|sq\.? ?(ft|feet|yards?)|length|thickness|diameter|measure/.test(q)) return 'size'
  if (/how much/.test(q)) return 'much'
  if (/colou?r|brand|style|design|finish|material|paint|wood|which kind|shape|profile|grade|bank|^type$|fitting|fixing|serving|^oil$|^pack$|^food$|which car|vehicle|\bport\b/.test(q)) return 'choose'
  return 'advise'
}
/* ─────────────── Where "Not sure" is offered (owner, 2 Nov 2026) ───────────────
   Only where a normal customer needs an expert to answer ("my fan is not working — I am not an
   electrician"). Never on the customer's own plan — the place, the people, how many, when, simple
   facts about themselves: a customer who is "not sure" of those is time pass. */
// Groups where the customer needs an expert to say what is needed (repairs & pest control,
// building & design, money & abroad): "Not sure" stays on their service and technical questions.
const EXPERT_GROUPS = ['electricity', 'ac-services', 'pest-control', 'painting', 'architecture', 'interior', 'loans', 'exim']
const EXPERT_ITEMS = ['visa-services', 'study-abroad', 'granite', 'tiles', 'sand', 'cement', 'tmt-bars', 'bricks', 'cement-bricks', 'upvc-sheets', 'upvc-marble-sheets']
// The customer knows every answer here: no "Not sure" at all
const KNOWS_ALL_GROUPS = ['drivers', 'photography', 'pujari', 'logistics', 'travel', 'nri']
const KNOWS_ALL_ITEMS = ['events', 'catering', 'invitation-cards', 'furniture']
// The customer's own plan or facts about themselves (even in the expert groups)
const OWN_PLAN = new Set([
  'stage of the building', 'what kind of place?', 'where is it?', 'how bad is it?', 'is anyone living there?', 'which room?',
  'which way does the site face?', 'age of the building', 'what are you building?', 'home size', 'how big is the home?',
  'new or existing home?', 'kitchen shape', 'what kind?', 'what kind of space?', 'loan for', 'how do you earn?',
  'do you know your cibil score?', 'preferred bank', 'property', 'land you farm', 'your group', 'your business',
  'where will you study?', 'vehicle', 'new or used?', 'what is it for?', 'what do you export or import?', 'your business type',
  'have you exported before?', 'which stage are you at?', 'which level?', 'which appliance?', 'use', 'where',
])
const OWN_PLAN_OF = { 'visa-services': ['which country?'] } // where you travel is yours; where to study, we help choose
const SUPPLY_OWN_PLAN = new Set(['use', 'where'])

/** May this question offer "Not sure"? item: the service or supply; question: its English heading. */
export function notSureAllowed(item, question) {
  const q = String(question || '').trim().toLowerCase()
  const id = item?.id
  const cat = item?.category
  const expert = EXPERT_GROUPS.includes(cat) || EXPERT_ITEMS.includes(id)
  if (!expert && (KNOWS_ALL_GROUPS.includes(cat) || KNOWS_ALL_ITEMS.includes(id))) return false
  const kind = notSureKind(question)
  if (kind === 'when' || kind === 'count') return false
  if (OWN_PLAN.has(q) || SUPPLY_OWN_PLAN.has(q) || (OWN_PLAN_OF[id] || []).includes(q)) return false
  if (kind === 'size' || kind === 'weight' || kind === 'budget') return true
  return expert
}

/** The "Not sure" words for a question, in the customer's language. */
export const notSureFor = (question, lang) => NOT_SURE_WORDS[notSureKind(question)][lang === 'te' ? 1 : 0]
/** The "Not sure" answer button: first, green (advise), with a phone. */
export const adviseOption = (question, lang) => ({ label: `📞 ${notSureFor(question, lang)}`, value: NOT_SURE_VALUE, advise: true })

// Town buttons now come from the customer's city (data/cities.js, Admin → Cities).
// Kept for older imports: the Ongole list.
export const TOWNS = ['Ongole', 'Kandukur', 'Addanki', 'Chimakurthy', 'Darsi', 'Singarayakonda', 'Kothapatnam', 'Markapur', 'Chirala']

// "Just checking prices" was removed (owner, 2 Nov 2026: no time-pass requests)
export const URGENCY = [
  { label: '⚡ Today / urgent', value: 'Today' },
  { label: '📅 This week', value: 'This week' },
  { label: '🗓️ This month', value: 'This month' },
]
const URGENCY_TE = ['⚡ ఈరోజే / అత్యవసరం', '📅 ఈ వారం', '🗓️ ఈ నెల']

/** Town buttons for the customer's city; the town found from their location comes first with 📍. */
export function townButtons(lang) {
  const near = currentTown()
  return quickTowns().map((x) => ({ label: `${x.name === near ? '📍 ' : ''}${(lang === 'te' && x.te) || x.name}`, value: x.name }))
}

/* Short, practical tips shown under supply questions. */
export const SUPPLY_TIPS = {
  // Rubber stamps (2 Nov 2026): the exact words are typed; a proof comes on WhatsApp
  'rubber-stamps': {
    'Kind of stamp': 'Self-inking is the most used for offices and shops; round seals are for companies and societies.',
    'What should the stamp say?': 'Type the exact words in "Something else". We send a design proof on WhatsApp before making it.',
  },
  granite: {
    Colour: 'Black Galaxy and Absolute Black are local favourites for kitchens and steps.',
    Finish: 'Polished shines; flamed or leather finish is less slippery for outdoor steps.',
    Thickness: '18–20 mm is usual for floors and counters; 30 mm for heavy-use steps.',
  },
  tiles: {
    Type: 'Vitrified tiles are strong and easy to clean — the common choice for floors.',
    Size: '2×2 ft suits most rooms; bigger tiles mean fewer joints.',
  },
  sand: {
    Type: 'River and plastering sand are free from the government: we book them, and you pay only the official charges and the lorry. M-Sand comes from a crusher unit, with a bill.',
    Vehicle: 'A tractor load suits small repairs; lorries for house construction.',
  },
  cement: {
    Grade: 'OPC 53 is common for slabs, beams and columns; PPC is good for plastering and brickwork.',
    Brand: 'All listed brands are reliable — "Any good brand" lets us get you the best price.',
  },
  'tmt-bars': {
    Grade: 'Fe 500D bends better without cracking — often preferred for houses.',
    Diameter: '8–10 mm for slabs, 12–16 mm for beams and columns. Your engineer\'s drawing will say.',
  },
  bricks: { Type: 'Wire-cut bricks are more even in size, so walls need less plaster.' },
  'cement-bricks': {
    Type: 'Solid blocks for load-bearing walls; hollow or AAC blocks are lighter and keep rooms cooler.',
    Thickness: '6 inch for outer walls, 4 inch for inside partition walls is common.',
  },
  transport: { Vehicle: 'Tata Ace for small loads; tractor or lorry for building material.' },
  furniture: { Wood: 'Teak lasts the longest; engineered wood is lighter on budget.' },
  catering: { Serving: 'Banana-leaf meals are traditional for functions; buffet suits bigger crowds.' },
  'cold-pressed-oils': { Pack: '5 litre cans are the best value for a family.' },
  'upvc-sheets': {
    'Roofing profile': 'Trapezoidal sheets are stronger; corrugated is the classic wave look.',
    Thickness: '2.5–3 mm is common for homes; thicker for big spans.',
  },
  'upvc-marble-sheets': { Thickness: '3 mm is the usual choice for walls.' },
}

/* The same tips in Telugu (same keys). */
export const SUPPLY_TIPS_TE = {
  'rubber-stamps': {
    'Kind of stamp': 'ఆఫీసులు, షాపులకు సెల్ఫ్-ఇంకింగ్ స్టాంప్ ఎక్కువగా వాడతారు; కంపెనీలు, సొసైటీలకు గుండ్రటి సీల్.',
    'What should the stamp say?': 'స్టాంప్ మీద రావలసిన మాటలు "ఇంకేదైనా"లో టైప్ చేయండి. తయారు చేసే ముందు డిజైన్ ప్రూఫ్ వాట్సాప్‌లో పంపుతాం.',
  },
  granite: {
    Colour: 'వంటగది, మెట్లకు బ్లాక్ గెలాక్సీ, అబ్సల్యూట్ బ్లాక్ ఇక్కడ ఎక్కువ ఇష్టపడతారు.',
    Finish: 'పాలిష్డ్ మెరుస్తుంది; బయటి మెట్లకు ఫ్లేమ్డ్ లేదా లెదర్ ఫినిష్ తక్కువ జారుతుంది.',
    Thickness: 'నేల, కౌంటర్లకు సాధారణంగా 18–20 mm; ఎక్కువ వాడే మెట్లకు 30 mm.',
  },
  tiles: {
    Type: 'విట్రిఫైడ్ టైల్స్ గట్టిగా ఉంటాయి, శుభ్రం చేయడం సులభం — నేలకు సాధారణ ఎంపిక.',
    Size: 'చాలా గదులకు 2×2 అడుగులు సరిపోతాయి; పెద్ద టైల్స్ అంటే తక్కువ జాయింట్లు.',
  },
  sand: {
    Type: 'నది ఇసుక, ప్లాస్టరింగ్ ఇసుకను ప్రభుత్వం ఉచితంగా ఇస్తుంది: మేము బుక్ చేస్తాం, మీరు అధికారిక ఛార్జీలు, లారీ ఖర్చు మాత్రమే చెల్లిస్తారు. M-సాండ్ క్రషర్ నుంచి బిల్లుతో వస్తుంది.',
    Vehicle: 'చిన్న మరమ్మతులకు ట్రాక్టర్ లోడ్; ఇల్లు కట్టడానికి లారీలు.',
  },
  cement: {
    Grade: 'స్లాబ్‌లు, బీమ్‌లు, కాలమ్స్‌కు OPC 53 సాధారణం; ప్లాస్టరింగ్, ఇటుక పనికి PPC మంచిది.',
    Brand: 'ఇచ్చిన బ్రాండ్లన్నీ నమ్మకమైనవే — "ఏదైనా మంచి బ్రాండ్" ఎంచుకుంటే మంచి ధర తెస్తాము.',
  },
  'tmt-bars': {
    Grade: 'Fe 500D పగలకుండా బాగా వంగుతుంది — ఇళ్ళకు ఎక్కువగా ఇదే ఇష్టపడతారు.',
    Diameter: 'స్లాబ్‌లకు 8–10 mm, బీమ్‌లు, కాలమ్స్‌కు 12–16 mm. మీ ఇంజనీర్ డ్రాయింగ్‌లో ఉంటుంది.',
  },
  bricks: { Type: 'వైర్-కట్ ఇటుకలు సమాన సైజులో ఉంటాయి, అందుకే గోడలకు తక్కువ ప్లాస్టర్ చాలు.' },
  'cement-bricks': {
    Type: 'బరువు మోసే గోడలకు సాలిడ్ బ్లాకులు; హాలో లేదా AAC బ్లాకులు తేలికగా ఉండి గదులను చల్లగా ఉంచుతాయి.',
    Thickness: 'బయటి గోడలకు 6 అంగుళాలు, లోపలి గోడలకు 4 అంగుళాలు సాధారణం.',
  },
  transport: { Vehicle: 'చిన్న లోడ్లకు టాటా ఏస్; నిర్మాణ సామగ్రికి ట్రాక్టర్ లేదా లారీ.' },
  furniture: { Wood: 'టేకు ఎక్కువ కాలం మన్నుతుంది; ఇంజనీర్డ్ వుడ్ బడ్జెట్‌కు తేలిక.' },
  catering: { Serving: 'శుభకార్యాలకు అరిటాకు భోజనం సంప్రదాయం; ఎక్కువ మందికి బఫే సరిపోతుంది.' },
  'cold-pressed-oils': { Pack: 'కుటుంబానికి 5 లీటర్ క్యాన్లు మంచి విలువ.' },
  'upvc-sheets': {
    'Roofing profile': 'ట్రాపెజాయిడల్ షీట్లు బలంగా ఉంటాయి; కొరుగేటెడ్ పాత అలల ఆకారం.',
    Thickness: 'ఇళ్ళకు 2.5–3 mm సాధారణం; పెద్ద స్పాన్‌లకు మందమైనవి.',
  },
  'upvc-marble-sheets': { Thickness: 'గోడలకు సాధారణంగా 3 mm.' },
}

const withNotSure = (choices, lang, question, item) => {
  // Buttons show the chosen language; the value sent to the team stays English.
  // "Not sure" comes first where it is offered (owner, 2 Nov 2026); the data's own "Not sure" items are left out.
  const list = choices.filter((c) => !/^not sure\b/i.test(c)).map((c) => ({ label: svcText(lang, c), value: c }))
  return notSureAllowed(item, question) ? [adviseOption(question, lang), ...list] : list
}

/** Does any question of this service or supply offer "Not sure"? ("Not sure? Get free advice" shows only then) */
export function offersNotSure(item, kind = 'service') {
  return itemSteps(kind, item, 'en').some((s) => (s.options || []).some((o) => o.advise))
}

const isWhenHeading = (h) => /^when\b|when do you|timeline|start date/i.test(h || '')

/** Common last steps: town, timing (unless the item already asked), notes. */
function tailSteps(lang, { askWhen = true } = {}) {
  const t = chatText(lang)
  const steps = [
    // Every customer knows their own town or village: no "Not sure", and it is required (owner, 2 Nov 2026)
    { key: lang === 'te' ? 'ఊరు' : 'Town', en: 'Town', ask: t.townAsk, tip: t.townTip, options: townButtons(lang), typed: true, role: 'area', required: true },
  ]
  if (askWhen) steps.push({ key: lang === 'te' ? 'ఎప్పుడు' : 'When', en: 'When', ask: t.whenAsk, options: URGENCY.map((u, i) => (lang === 'te' ? { ...u, label: URGENCY_TE[i] } : u)), role: 'urgency' })
  steps.push({ key: lang === 'te' ? 'ఇతర వివరాలు' : 'Notes', en: 'Notes', ask: t.notesAsk, options: [{ label: t.notesNo, value: '' }], typed: true, optional: true, role: 'notes' })
  return steps
}

/* ─────────────── Services (servicesData) ─────────────── */
export const chatServices = servicesData.filter((s) => s.category !== 'supplies')

export function serviceSteps(service, lang) {
  const t = chatText(lang)
  const steps = []
  let papers = []
  let askedWhen = false
  const jobs = []
  for (const sec of service.sections || []) {
    const kind = sectionKind(service, sec)
    if (kind === 'jobs') jobs.push(sec)
    else if (kind === 'choose') {
      steps.push({ key: sec.heading, heading: sec.heading, options: withNotSure(sec.items, lang, sec.heading, service), multi: true, choose: true })
    } else if (kind === 'ask') {
      if (isWhenHeading(sec.heading)) askedWhen = true
      // typeHint: what to type instead of a button (e.g. "Ongole → Hyderabad")
      steps.push({ key: sec.heading, ask: svcText(lang, sec.heading), ...(sec.typeHint ? { tip: svcText(lang, sec.typeHint) } : {}), options: withNotSure(sec.items, lang, sec.heading, service), typed: true, role: isWhenHeading(sec.heading) ? 'urgency' : undefined })
    } else if (kind === 'papers') {
      // "Data required" lists (names, dates, survey no.) are asked as details instead — like the app
      if (!(/data/i.test(sec.heading) && fieldsFor(service).length)) papers = [...papers, ...sec.items]
    }
  }
  // Question text for "pick what you need" sections: a real question if the data has one,
  // otherwise "What do you need?" (with the section name when there are several)
  const chooses = steps.filter((x) => x.choose)
  for (const c of chooses) {
    const h = c.heading
    const hT = svcText(lang, h)
    c.ask = /\?$/.test(h) ? hT : chooses.length > 1 ? `${t.chooseAsk} — ${lang === 'te' ? hT : h.charAt(0) + h.slice(1).toLowerCase()}` : t.chooseAsk
  }
  if (jobs.length) {
    // Pick the job first; that job's papers follow (see jobPapers below)
    steps.unshift({ key: 'Job', ask: t.jobAsk, options: withNotSure(jobs.map((j) => j.heading), lang, 'Which one', service), jobs: jobs.map((j) => ({ heading: j.heading, items: j.items })) })
  }
  // The service's details (serviceFields.js): one "fill them now?" step; the questions follow only on "Yes"
  const details = detailSteps(service, lang)
  // (as before: the papers alone don't count as questions — then "Tell us briefly what you need" is asked)
  const hasQuestions = steps.length > 0 || details.length > 0
  const pStep = papers.length ? papersStep(papers, lang) : null
  // Government services: the papers first, then only the details the papers don't show (owner, 6 Nov 2026)
  if (papersFirst(service)) {
    if (pStep) steps.push(pStep)
    if (details.length) steps.push(detailsGate(details.length, lang))
  } else {
    if (details.length) steps.push(detailsGate(details.length, lang))
    if (pStep) steps.push(pStep)
  }
  const tail = tailSteps(lang, { askWhen: !askedWhen })
  if (!hasQuestions) {
    // Nothing to choose from in the data: ask in their own words instead (required)
    const notes = tail.find((x) => x.role === 'notes')
    notes.ask = lang === 'te' ? 'మీకు ఏమి కావాలో క్లుప్తంగా చెప్పండి.' : 'Tell us briefly what you need.'
    notes.optional = false
    notes.options = notSureAllowed(service, 'What do you need?') ? [adviseOption('What do you need?', lang)] : []
    tail.splice(tail.indexOf(notes), 1)
    steps.unshift(notes)
  }
  return [...steps, ...tail]
}

/**
 * The details a service asks (serviceFields.js) as chat questions, one by one.
 * Every one can be skipped ("Skip" / "Skip the rest"). Choices are buttons; the rest are typed.
 * The village is not asked here: the Town step at the end answers it (see buildRequest).
 */
export function detailSteps(service, lang) {
  const t = chatText(lang)
  const te = lang === 'te'
  const skips = [{ label: t.skip, value: SKIP_VALUE }, { label: t.skipRest, value: SKIP_REST_VALUE }]
  const addTip = (s, line) => { if (s && line) s.tip = s.tip ? `${s.tip}\n💡 ${line}` : line }
  const steps = []
  let first = '' // a help line before any question goes with the first question
  for (const f of fieldsFor(service)) {
    if (f.type === 'note') {
      // A help line belongs to the question before it (to the first of a side-by-side pair)
      const last = steps[steps.length - 1]
      const before = steps[steps.length - 2]
      if (!last) { first = first ? `${first}\n💡 ${te ? f.te : f.en}` : (te ? f.te : f.en); continue }
      addTip(last.field.half && before?.field.half ? before : last, te ? f.te : f.en)
      continue
    }
    if (f.type === 'village') continue
    const label = te ? f.te : f.en
    const s = { key: `detail:${f.key}`, label, ask: label, field: f, role: 'detail', typed: true, optional: true, options: skips }
    if (first && !steps.length) addTip(s, first)
    addTip(s, te ? (f.hintTe || f.hint) : f.hint)
    if (f.type === 'choice') {
      s.options = [...f.options.map(([en, teLabel]) => ({ label: te ? teLabel : en, value: en })), ...skips]
      if (f.multi) s.multi = true
    } else if (f.type === 'district') {
      const c = currentCity()
      if (c?.regionShort) s.options = [{ label: (te && c.regionShortTe) || c.regionShort, value: c.regionShort }, ...skips]
    } else if (f.type === 'mandal') {
      s.options = [...townButtons(lang), ...skips]
    } else if (f.type === 'date') {
      addTip(s, t.dateTip)
    }
    steps.push(s)
  }
  return steps
}

/** "Fill your details now?" — Yes adds the detail questions right after it (chatEngine). */
export function detailsGate(n, lang) {
  const t = chatText(lang)
  return {
    key: t.detailsKey, ask: t.detailsAsk, tip: t.detailsTip, role: 'detailsGate', count: n,
    options: [{ label: t.detailsSkip, value: DETAILS_SKIP }, { label: t.detailsYes(n), value: DETAILS_YES, primary: true }],
  }
}

/** A typed date: "12-03-2015", "12/3/2015" or "12.03.2015" → "2015-03-12"; anything else stays as typed. */
export function chatDate(text) {
  const s = String(text || '').trim()
  const m = s.match(/^(\d{1,2})\s*[-/.]\s*(\d{1,2})\s*[-/.]\s*(\d{4})$/)
  if (!m) return s
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const dt = new Date(Date.UTC(y, mo - 1, d))
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return s
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

const blank = (v) => v == null || v === '' || v === SKIP_VALUE || (Array.isArray(v) && !v.length)

export function papersStep(items, lang) {
  const t = chatText(lang)
  // Forms and affidavits we prepare are not ticked: they are named in the tip (owner, 6 Nov 2026)
  const { tick, prepare } = splitPapers(items)
  if (!tick.length) return null
  const pt = papersText(lang)
  const tip = prepare.length
    ? `${t.papersTip}\n📝 ${pt.prepareH(prepare.length)}: ${prepare.map((p) => svcText(lang, p)).join(', ')}. ${pt.prepareNote}`
    : t.papersTip
  return { key: 'Ready', ask: t.papersAsk, tip, options: [...tick.map((i) => ({ label: svcText(lang, i), value: i })), { label: t.papersNone, value: t.papersNone }], multi: true, role: 'papers', all: tick, prepare }
}

/* ─────────────── Supplies (suppliesData) ─────────────── */
export const chatSupplies = supplyCategories

export function supplySteps(supply, lang) {
  const t = chatText(lang)
  const o = supplyOrdering[supply.id] || {}
  const tips = SUPPLY_TIPS[supply.id] || {}
  const steps = (o.options || []).map((op) => ({
    // Same wording as the app's supply pages
    key: op.label, ask: op.multi || /\?$/.test(op.label) ? svcText(lang, op.label) : (lang === 'te' ? `ఏ ${svcText(lang, op.label)}?` : `Which ${op.label.toLowerCase()}?`), tip: (lang === 'te' && SUPPLY_TIPS_TE[supply.id]?.[op.label]) || tips[op.label], options: withNotSure(op.choices, lang, op.label, supply), multi: !!op.multi, typed: true,
  }))
  if (o.unit) {
    const sizes = [o.start, o.start * 2, o.start * 5, o.start * 10].filter(Boolean)
    steps.push({
      key: 'Quantity', ask: t.qtyAsk(svcText(lang, o.unit)), tip: t.qtyTip, typed: true, role: 'quantity',
      options: [...(EXPERT_ITEMS.includes(supply.id) ? [adviseOption('How much do you need?', lang)] : []), ...sizes.map((n) => ({ label: `${n.toLocaleString('en-IN')} ${svcText(lang, o.unit)}`, value: `${n} ${o.unit}` }))],
    })
  }
  return [...steps, ...tailSteps(lang)]
}

/* ─────────────── Pickers ─────────────── */
export function supplyPicker(lang) {
  const t = chatText(lang)
  return {
    key: 'Supply', ask: t.pickSupply, picker: true,
    options: chatSupplies.map((s) => ({ label: (lang === 'te' && supplyOrdering[s.id]?.te) || s.title, value: `__item:supply:${s.id}` })),
  }
}
export function propertyPicker(lang) {
  const t = chatText(lang)
  return {
    key: 'Property', ask: t.pickProperty, picker: true,
    options: propertyIntents.map((p) => ({ label: (lang === 'te' && p.te) || p.title, value: `__item:property:${p.id}` })),
  }
}

/** Find what an item id points to. */
export function findItem(kind, id) {
  if (kind === 'supply') return chatSupplies.find((s) => s.id === id)
  if (kind === 'property') return propertyIntents.find((p) => p.id === id)
  return chatServices.find((s) => s.id === id)
}

/** Steps for an item of a given kind. */
export function itemSteps(kind, item, lang) {
  return kind === 'supply' ? supplySteps(item, lang) : serviceSteps(item, lang)
}

/** Category key used by the contact form / admin for an item. */
export function itemCategory(kind, item) {
  if (kind === 'supply') return 'supplies'
  if (kind === 'property') return 'real-estate'
  return item.category
}

/* ─────────────── The finished request ─────────────── */
/**
 * answers: { [step.key]: string | string[] } — NOT_SURE_VALUE already turned into NOT_SURE.
 * Returns what the backend saves: the usual contact fields plus item/area/urgency/details.
 */
export function buildRequest({ kind, item, steps, answers, user, ref }) {
  const details = []
  let area = null
  let urgency = null
  const papersStepDef = steps.find((s) => s.role === 'papers')
  const filled = {} // the customer's details (team only — never in the message, so never to a Business Partner)
  // "Not sure" → the other questions were skipped: say so before town / timing / notes
  let skipLine = !!answers[SKIPPED_KEY]
  const addSkipped = () => {
    if (!skipLine) return
    skipLine = false
    details.push({ q: details.length ? 'Other questions' : 'Questions', a: SKIPPED_A, notSure: true })
  }
  for (const s of steps) {
    if (s.role === 'area') addSkipped()
    if (s.picker || s.role === 'detailsGate') continue
    if (s.role === 'detail') {
      const raw = answers[s.key]
      if (!blank(raw)) filled[s.field.key] = s.field.type === 'date' ? chatDate(raw) : raw
      continue
    }
    const raw = answers[s.key]
    if (s.role === 'notes' && !raw) continue
    if (raw === undefined) continue
    const a = Array.isArray(raw) ? raw.join(', ') : String(raw)
    if (s.role === 'area') area = a
    if (s.role === 'urgency') urgency = a
    if (s.role === 'papers') {
      const have = Array.isArray(raw) ? raw.filter((x) => (s.all || []).includes(x)) : []
      const missing = (s.all || []).filter((x) => !have.includes(x))
      details.push({ q: 'Ready', a: have.length ? have.join(', ') : 'None yet', notSure: false })
      if (missing.length) details.push({ q: 'Needs help with', a: missing.join(', '), notSure: false })
      if (s.prepare?.length) details.push({ q: 'We prepare', a: s.prepare.join(', '), notSure: false })
      // Details the ready papers show: the Buddy reads them from the papers (owner, 6 Nov 2026)
      if (kind !== 'supply') {
        const read = readFromPapersText(readFromPapersForTeam(detailsAfterPapers(item, fieldsFor(item), have)))
        if (read) details.push({ q: 'Read from their papers', a: read, notSure: false })
      }
      continue
    }
    details.push({ q: s.en || s.key, a, notSure: a === NOT_SURE })
  }
  addSkipped()
  // The Town answer is also the village of the details (asked once)
  const fields = kind === 'supply' ? [] : fieldsFor(item)
  if (Object.keys(filled).length && area && area !== NOT_SURE) {
    for (const f of fields) if (f.type === 'village' && blank(filled[f.key])) filled[f.key] = area
  }
  const info = detailsForTeam(fields, filled)
  const title = item.title
  const lines = [`Hello, I'd like to request: ${title}.`, '']
  for (const d of details) lines.push(`- ${d.q}: ${d.a}${d.notSure ? ' (please advise)' : ''}`)
  if (papersStepDef) { /* already listed above */ }
  return {
    name: user.name,
    phone: user.mobile,
    service: itemCategory(kind, item),
    subService: title,
    message: lines.join('\n').slice(0, 4900),
    item: title,
    area,
    urgency,
    details: { ref, kind, itemId: item.id, answers: details, ...(info.length ? { info } : {}) },
    channel: 'chat',
  }
}

/** A short reference people can quote on the phone, e.g. IN-7K3Q9. */
export function newRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `IN-${s}`
}

/** Short answer text for the review card. */
export function answerText(v) {
  if (Array.isArray(v)) return v.join(', ')
  return v || '—'
}
