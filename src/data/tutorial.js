/**
 * The customer tutorial (owner, 2 Nov 2026: "Make sure the Application will have Tutorial for the Customer").
 * First open: five short slides — Skip, Back, Next; they can be seen again (app: Profile → Settings;
 * website: the footer). Then one-time pointers on Home, a service's questions, Chat Buddy and
 * My requests, each shown once, with "Got it" and "Skip tips".
 * Shared by the app and the website (scripts/syncData.js copies it to the app).
 */

/** The slides. `pic` is drawn by each side (toys, the green "Not sure" box, a request card). */
export const SLIDES = [
  {
    id: 'welcome', pic: 'welcome',
    en: { title: 'Welcome to iN Empower', body: 'Your Local Buddy for government papers, home services and supplies — right in your town.' },
    te: { title: 'iN Empower కు స్వాగతం', body: 'ప్రభుత్వ పత్రాలు, ఇంటి సేవలు, సామగ్రి — మీ ఊరిలోనే మీ లోకల్ బడ్డీ.' },
  },
  {
    id: 'pick', pic: 'pick',
    en: {
      title: 'Pick what you need',
      body: "Search, speak, or tap a choice. Answer a few quick questions — tap Skip for any you don't know.",
      web: "Search or tap a service, then answer a few quick questions — leave out any you don't know.",
    },
    te: {
      title: 'మీకు కావలసినది ఎంచుకోండి',
      body: 'వెతకండి, మాట్లాడండి, లేదా ఒక ఎంపిక నొక్కండి. కొన్ని చిన్న ప్రశ్నలకు జవాబు ఇవ్వండి — తెలియని వాటికి "దాటవేయండి" నొక్కండి.',
      web: 'వెతకండి లేదా ఒక సేవను నొక్కండి, తర్వాత కొన్ని చిన్న ప్రశ్నలకు జవాబు ఇవ్వండి — తెలియనివి వదిలేయండి.',
    },
  },
  {
    id: 'notsure', pic: 'notsure',
    en: { title: 'Not sure? We call you', body: 'For repairs, building work and loans, tap the green 📞 box — our expert calls you and advises, free.' },
    te: { title: 'తెలియదా? మేమే కాల్ చేస్తాం', body: 'రిపేర్లు, నిర్మాణ పనులు, లోన్ల కోసం ఆకుపచ్చ 📞 బాక్స్ నొక్కండి — మా నిపుణులు కాల్ చేసి ఉచితంగా సలహా ఇస్తారు.' },
  },
  {
    id: 'price', pic: 'price',
    en: { title: 'A clear price first', body: 'We tell you the full price before any work starts.', promise: 'Work Done or Money Back' },
    te: { title: 'ముందుగా స్పష్టమైన ధర', body: 'పని మొదలయ్యే ముందే పూర్తి ధర చెబుతాం.', promise: 'పని పూర్తి లేదా డబ్బు వాపస్' },
  },
  {
    id: 'track', pic: 'track',
    en: {
      title: 'Follow every request',
      body: 'Each request gets a reference number in My requests. Change it any time; cancel before work starts. Chat Buddy helps in Telugu and English.',
      web: 'Each request gets a reference number. Signed in, you see them all in My Dashboard. Chat Buddy helps in Telugu and English.',
      sample: 'Birth certificate',
    },
    te: {
      title: 'ప్రతి అభ్యర్థనను చూసుకోండి',
      body: 'ప్రతి అభ్యర్థనకు "నా అభ్యర్థనలు"లో రిఫరెన్స్ నంబర్ ఉంటుంది. ఎప్పుడైనా మార్చవచ్చు; పని మొదలయ్యే ముందు రద్దు చేయవచ్చు. చాట్ బడ్డీ తెలుగు, ఇంగ్లీష్‌లో సహాయం చేస్తుంది.',
      web: 'ప్రతి అభ్యర్థనకు రిఫరెన్స్ నంబర్ ఉంటుంది. సైన్ ఇన్ చేస్తే అన్నీ "నా డాష్‌బోర్డ్"లో చూడవచ్చు. చాట్ బడ్డీ తెలుగు, ఇంగ్లీష్‌లో సహాయం చేస్తుంది.',
      sample: 'జనన ధృవీకరణ పత్రం',
    },
  },
]

/** One slide's words for the app (where = 'app') or the website (where = 'web'). */
export function slideText(slide, lang = 'en', where = 'app') {
  const w = (slide && (slide[lang === 'te' ? 'te' : 'en'] || slide.en)) || {}
  return { ...w, body: where === 'web' && w.web ? w.web : w.body }
}

/** The pointers: one short line each, said once. */
export const TIPS = {
  // App
  'home-search': { en: 'Type or speak what you need — in Telugu or English.', te: 'మీకు ఏమి కావాలో టైప్ చేయండి లేదా మాట్లాడండి — తెలుగు లేదా ఇంగ్లీష్‌లో.' },
  'home-choices': { en: 'Or tap one of these to see its services.', te: 'లేదా వీటిలో ఒకటి నొక్కి దాని సేవలు చూడండి.' },
  'home-chat': { en: 'Questions? Chat Buddy answers any time — and can book for you.', te: 'ప్రశ్నలు ఉన్నాయా? చాట్ బడ్డీ ఎప్పుడైనా జవాబిస్తుంది — మీ కోసం బుక్ కూడా చేస్తుంది.' },
  'steps-notsure': { en: "Don't know this one? Tap the green box — our expert calls you and advises, free.", te: 'ఇది తెలియదా? ఆకుపచ్చ బాక్స్ నొక్కండి — మా నిపుణులు కాల్ చేసి ఉచితంగా సలహా ఇస్తారు.' },
  'steps-next': { en: 'Answer what you know, then Next. Skip moves on — you see everything again before sending.', te: 'తెలిసినవాటికి జవాబు ఇచ్చి "తదుపరి" నొక్కండి. "దాటవేయండి" ముందుకు వెళ్తుంది — పంపే ముందు అన్నీ మళ్ళీ చూస్తారు.' },
  'chat-input': { en: 'Tap a button, type here, or tap the mic and speak — Telugu or English.', te: 'ఒక బటన్ నొక్కండి, ఇక్కడ టైప్ చేయండి, లేదా మైక్ నొక్కి మాట్లాడండి — తెలుగు లేదా ఇంగ్లీష్.' },
  'requests-card': { en: 'Your reference number and the stage your request is at. Change or cancel it here.', te: 'ఇది మీ రిఫరెన్స్ నంబర్, మీ అభ్యర్థన ఉన్న దశ. ఇక్కడే మార్చవచ్చు లేదా రద్దు చేయవచ్చు.' },
  // Website
  'web-home-search': { en: 'Type what you need — for example "birth certificate" or "AC repair".', te: 'మీకు కావలసినది టైప్ చేయండి — ఉదా. "జనన ధృవీకరణ పత్రం" లేదా "AC రిపేర్".' },
  'web-home-grid': { en: 'Or tap one of these to see its services.', te: 'లేదా వీటిలో ఒకటి నొక్కి దాని సేవలు చూడండి.' },
  'web-home-explore': { en: 'Start here: see every service, then send a request in a minute.', te: 'ఇక్కడ మొదలుపెట్టండి: అన్ని సేవలు చూసి, ఒక్క నిమిషంలో అభ్యర్థన పంపండి.' },
  'web-chat-fab': { en: 'Questions? Chat Buddy answers any time — in Telugu or English.', te: 'ప్రశ్నలు ఉన్నాయా? చాట్ బడ్డీ ఎప్పుడైనా జవాబిస్తుంది — తెలుగు లేదా ఇంగ్లీష్‌లో.' },
  'web-chat-input': { en: 'Tap a button or type here — Telugu or English.', te: 'ఒక బటన్ నొక్కండి లేదా ఇక్కడ టైప్ చేయండి — తెలుగు లేదా ఇంగ్లీష్.' },
  'web-form-notsure': { en: "Don't know this one? Tap the green box — our expert calls you and advises, free.", te: 'ఇది తెలియదా? ఆకుపచ్చ బాక్స్ నొక్కండి — మా నిపుణులు కాల్ చేసి ఉచితంగా సలహా ఇస్తారు.' },
  'web-form-send': { en: 'Add your town, name and mobile, then send. We call you with a clear price before any work starts.', te: 'మీ ఊరు, పేరు, మొబైల్ ఇచ్చి పంపండి. పని మొదలయ్యే ముందే స్పష్టమైన ధరతో మేము కాల్ చేస్తాం.' },
  'web-requests-card': { en: 'Each request and its stage. Tap one to see what has happened so far.', te: 'ప్రతి అభ్యర్థన, దాని దశ. ఇప్పటి వరకు ఏమి జరిగిందో చూడటానికి ఒకదాన్ని నొక్కండి.' },
}

export const tipText = (id, lang = 'en') => (TIPS[id] ? TIPS[id][lang === 'te' ? 'te' : 'en'] : '')

/** Buttons and labels. */
const WORDS = {
  en: {
    skip: 'Skip', back: 'Back', next: 'Next', start: "Let's start",
    of: (n, total) => `${n} of ${total}`,
    gotIt: 'Got it', skipTips: 'Skip tips',
    again: 'Show the tutorial again', title: 'How to use iN Empower', close: 'Close the tutorial',
    other: 'తెలుగు', otherLabel: 'తెలుగులో చూడండి (Telugu)',
  },
  te: {
    skip: 'దాటవేయండి', back: 'వెనుకకు', next: 'తదుపరి', start: 'మొదలుపెడదాం',
    of: (n, total) => `${total} లో ${n}`,
    gotIt: 'సరే', skipTips: 'సూచనలు వద్దు',
    again: 'ఎలా వాడాలో మళ్ళీ చూడండి', title: 'iN Empower ఎలా వాడాలి', close: 'ట్యుటోరియల్ మూసివేయండి',
    other: 'English', otherLabel: 'See it in English',
  },
}
export const tutorialWords = (lang = 'en') => WORDS[lang === 'te' ? 'te' : 'en']

/** "Skip tips": no more pointers anywhere (until the tutorial is shown again). */
export const SKIP_ALL = '*'

/** The first pointer of `ids` not seen yet — null when all are seen or the tips were skipped. */
export function nextTip(seen, ids) {
  const list = Array.isArray(seen) ? seen : seen ? [...seen] : []
  if (list.includes(SKIP_ALL)) return null
  return (ids || []).filter(Boolean).find((id) => !list.includes(id)) || null
}

/** Remembered on the phone / in the browser */
export const APP_KEYS = { slides: '@inempower_tutorial_seen_v1', tips: '@inempower_tips_seen_v1' }
export const WEB_KEYS = { slides: 'inempower_tutorial_seen_v1', tips: 'inempower_tips_seen_v1' }
