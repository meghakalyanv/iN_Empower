/**
 * "Join as a Business Partner" — the step-by-step application.
 * Shared by the website (pages/BecomePartner.jsx) and the app (PartnerApplyScreen); edit here only.
 * Applications arrive in Admin → Partners → Applications (supabase/014_requests_and_partners.sql).
 *
 * Same shape as the Local Buddy application (buddyApply.js): every text is [English, Telugu];
 * what reaches the team is always the English value.
 * Please have a Telugu speaker review the Telugu lines before launch.
 */
import { supplyCategories, supplyOrdering } from './suppliesData.js'
import { quickTowns, placeText, teamPhoneShown, COMPANY } from './cities.js'

/** Kinds of business (the business_partners.kind values) */
export const PARTNER_KINDS = [
  ['Building supplies & goods', 'నిర్మాణ సామగ్రి & సరుకులు', 'supply'],
  ['Professional service', 'వృత్తి సేవ', 'professional'],
  ['Hospital, clinic or pharmacy', 'ఆసుపత్రి, క్లినిక్ లేదా ఫార్మసీ', 'medical'],
  ['Something else', 'ఇంకేదైనా', 'other'],
]
/** One line under each kind */
export const PARTNER_KIND_EXAMPLES = {
  supply: ['Cement, sand, steel, tiles, furniture, transport, catering', 'సిమెంట్, ఇసుక, స్టీల్, టైల్స్, ఫర్నిచర్, రవాణా, క్యాటరింగ్'],
  professional: ['Photographer, electrician, AC, pujari, architect, cook', 'ఫోటోగ్రాఫర్, ఎలక్ట్రీషియన్, AC, పూజారి, ఆర్కిటెక్ట్, వంటవారు'],
  medical: ['Treatment, medicine delivery, ambulance, physiotherapy', 'చికిత్స, మందుల డెలివరీ, అంబులెన్స్, ఫిజియోథెరపీ'],
  other: ['Tell us in your own words', 'మీ మాటల్లో చెప్పండి'],
}

const PROFESSIONAL_OFFERS = [
  ['Photography & video', 'ఫోటోగ్రఫీ & వీడియో'], ['Pujari / priest', 'పూజారి / పురోహితులు'], ['Electrical work', 'ఎలక్ట్రికల్ పనులు'],
  ['AC service & repair', 'AC సర్వీస్ & రిపేర్'], ['Plumbing', 'ప్లంబింగ్'], ['Interior design', 'ఇంటీరియర్ డిజైన్'],
  ['Architect / house plans', 'ఆర్కిటెక్ట్ / ఇంటి ప్లాన్లు'], ['Driver', 'డ్రైవర్'], ['Cook / chef', 'వంటవారు / చెఫ్'],
  ['Cleaning', 'శుభ్రత'], ['Tailoring', 'దర్జీ పని'], ['Makeup artist', 'మేకప్ ఆర్టిస్ట్'], ['Event decoration', 'వేడుకల అలంకరణ'],
  ['Banner & sign printing', 'బ్యానర్ & సైన్ బోర్డు ప్రింటింగ్'], ['Lawyer / legal', 'న్యాయవాది / న్యాయ సేవలు'],
  // New services since (owner, 2 Nov 2026)
  ['Pest control', 'పెస్ట్ కంట్రోల్'], ['Snake rescue', 'పాముల రక్షణ'], ['Driving school', 'డ్రైవింగ్ స్కూల్'],
  ['Painting & waterproofing', 'పెయింటింగ్ & వాటర్‌ప్రూఫింగ్'], ['Appliance & home repairs', 'ఉపకరణాలు & ఇంటి మరమ్మతులు'],
  ['Document writer', 'డాక్యుమెంట్ రైటర్'], ['Customs broker (export & import)', 'కస్టమ్స్ బ్రోకర్ (ఎగుమతి & దిగుమతి)'],
]
const MEDICAL_OFFERS = [
  ['Hospital', 'ఆసుపత్రి'], ['Clinic / doctor', 'క్లినిక్ / డాక్టర్'], ['Pharmacy / medicine delivery', 'ఫార్మసీ / మందుల డెలివరీ'],
  ['Diagnostic lab / scans', 'డయాగ్నస్టిక్ ల్యాబ్ / స్కానింగ్'], ['Ambulance', 'అంబులెన్స్'], ['Physiotherapy', 'ఫిజియోథెరపీ'],
  ['Stay for patients & attendants', 'రోగులు & సహాయకులకు బస'],
]

/** What a kind of business can offer (tick all that apply). Supplies follow the live supplies list. */
export function partnerOffers(kind) {
  if (kind === 'supply') return supplyCategories.map((s) => [s.title, supplyOrdering[s.id]?.te || s.title])
  if (kind === 'professional') return PROFESSIONAL_OFFERS
  if (kind === 'medical') return MEDICAL_OFFERS
  return []
}

/**
 * Work that needs a licence (owner, 2 Nov 2026 — legal report). The partner says whether they hold it;
 * the team sees it in person before giving a single job. No licence or ID numbers are typed here.
 * Keys: the offer as saved (English); supplies by their title.
 */
export const PARTNER_LICENCES = {
  'Electrical work': ['Electrical contractor licence or wireman permit', 'ఎలక్ట్రికల్ కాంట్రాక్టర్ లైసెన్స్ లేదా వైర్‌మన్ పర్మిట్'],
  'Pest control': ['Pest control licence (Form VI-C, Agriculture Department)', 'పెస్ట్ కంట్రోల్ లైసెన్స్ (ఫారం VI-C, వ్యవసాయ శాఖ)'],
  'Snake rescue': ['Authorised by the AP Forest Department', 'ఆంధ్రప్రదేశ్ అటవీ శాఖ అనుమతి'],
  'Driving school': ['Driving school licence (Transport Department)', 'డ్రైవింగ్ స్కూల్ లైసెన్స్ (రవాణా శాఖ)'],
  'Driver': ['Driving licence for the vehicles you drive', 'మీరు నడిపే వాహనాలకు డ్రైవింగ్ లైసెన్స్'],
  'Architect / house plans': ['Council of Architecture registration (or a licensed engineer) for approval drawings', 'అనుమతి డ్రాయింగ్‌లకు కౌన్సిల్ ఆఫ్ ఆర్కిటెక్చర్ నమోదు (లేదా లైసెన్స్ ఉన్న ఇంజనీర్)'],
  'Lawyer / legal': ['Enrolled with the Bar Council as an advocate', 'బార్ కౌన్సిల్‌లో న్యాయవాదిగా నమోదు'],
  'Document writer': ['Document writer licence (Registration Department)', 'డాక్యుమెంట్ రైటర్ లైసెన్స్ (రిజిస్ట్రేషన్ శాఖ)'],
  'Customs broker (export & import)': ['Customs broker licence (CBIC)', 'కస్టమ్స్ బ్రోకర్ లైసెన్స్ (CBIC)'],
  'Hospital': ['Hospital registered with the State', 'రాష్ట్ర ప్రభుత్వం వద్ద ఆసుపత్రి నమోదు'],
  'Clinic / doctor': ['Doctor registered with the Medical Council', 'మెడికల్ కౌన్సిల్‌లో నమోదైన డాక్టర్'],
  'Pharmacy / medicine delivery': ['Drug licence for the pharmacy', 'ఫార్మసీకి డ్రగ్ లైసెన్స్'],
  'Diagnostic lab / scans': ['Lab registration (and PCPNDT registration for scans)', 'ల్యాబ్ నమోదు (స్కానింగ్‌కు PCPNDT నమోదు)'],
  'Ambulance': ['Registered ambulance with trained staff', 'శిక్షణ పొందిన సిబ్బందితో నమోదైన అంబులెన్స్'],
  'Physiotherapy': ['Physiotherapy degree (BPT or MPT)', 'ఫిజియోథెరపీ డిగ్రీ (BPT లేదా MPT)'],
  'Catering': ['FSSAI licence or registration', 'FSSAI లైసెన్స్ లేదా నమోదు'],
  'Cold-Pressed Oils': ['FSSAI licence or registration', 'FSSAI లైసెన్స్ లేదా నమోదు'],
  'Transport': ['Goods-carriage permit for your vehicles', 'మీ వాహనాలకు గూడ్స్ క్యారేజ్ పర్మిట్'],
}
/** The licences the picked offers need: [[offer, [en, te]], …] */
export function licencesFor(items) {
  const picked = Array.isArray(items) ? items : items ? [items] : []
  return [...new Set(picked)].filter((x) => PARTNER_LICENCES[x]).map((x) => [x, PARTNER_LICENCES[x]])
}
const offerTe = (x) => [...PROFESSIONAL_OFFERS, ...MEDICAL_OFFERS, ...partnerOffers('supply')].find((o) => o[0] === x)?.[1] || x

/** "Do you hold the licence this work needs?" — only when a picked offer needs one */
export function licenceStep(items) {
  const needs = licencesFor(items)
  if (!needs.length) return null
  return {
    key: 'licence',
    ask: ['Do you hold the licence this work needs?', 'ఈ పనికి కావలసిన లైసెన్స్ మీ దగ్గర ఉందా?'],
    sub: [
      `${needs.map(([x, l]) => `${x}: ${l[0]}`).join(' · ')}. No numbers needed here — show it when our team visits.`,
      `${needs.map(([x, l]) => `${offerTe(x)}: ${l[1]}`).join(' · ')}. ఇక్కడ నంబర్లు అవసరం లేదు — మా బృందం వచ్చినప్పుడు చూపించండి.`,
    ],
    kind: 'one',
    options: [['Yes, I hold it', 'అవును, నా దగ్గర ఉంది', 'yes'], ['Not yet', 'ఇంకా లేదు', 'not-yet']],
  }
}

// Towns of the applicant's city (Admin → Cities)
const townOptions = () => quickTowns().map((t) => [t.name, t.te || t.name])
export const WHOLE_DISTRICT = ['Whole district', 'మొత్తం జిల్లా']

/**
 * The steps, given the kind of business picked so far.
 * Step: { key, ask:[en,te], sub?, kind: 'text'|'phone'|'long'|'one'|'many', options?, optional?, other? }
 */
export function partnerSteps(kind, items = []) {
  const offers = partnerOffers(kind)
  return [
    { key: 'kind', ask: ['What kind of business do you have?', 'మీది ఏ రకమైన వ్యాపారం?'], kind: 'one', options: PARTNER_KINDS },
    offers.length
      ? { key: 'items', ask: ['What can you offer our customers?', 'మా కస్టమర్లకు మీరు ఏమి అందించగలరు?'], kind: 'many', other: true, options: offers }
      : { key: 'items', ask: ['What does your business offer?', 'మీ వ్యాపారం ఏమి అందిస్తుంది?'], sub: ['A few words is enough', 'కొన్ని మాటలు చాలు'], kind: 'long' },
    // Work that needs a licence: do they hold it? (owner, 2 Nov 2026)
    offers.length ? licenceStep(items) : null,
    { key: 'business', ask: ['Name of your business', 'మీ వ్యాపారం పేరు'], sub: ['As on your shop board or bills', 'మీ షాపు బోర్డు లేదా బిల్లులపై ఉన్నట్లు'], kind: 'text' },
    { key: 'town', ask: ['Where is your business?', 'మీ వ్యాపారం ఎక్కడ ఉంది?'], kind: 'one', other: true, options: townOptions() },
    { key: 'areas', ask: ['Which towns can you serve?', 'ఏ ఊళ్లకు సేవ అందించగలరు?'], sub: ['Pick all that apply', 'సరిపోయేవన్నీ ఎంచుకోండి'], kind: 'many', other: true, optional: true, options: [...townOptions(), WHOLE_DISTRICT] },
    { key: 'contact', ask: ['Your name', 'మీ పేరు'], sub: ['The person we should talk to', 'మేము మాట్లాడవలసిన వ్యక్తి'], kind: 'text' },
    { key: 'phone', ask: ['Your mobile number', 'మీ మొబైల్ నంబర్'], sub: ['We will call you on this number', 'ఈ నంబర్‌కే ఫోన్ చేస్తాము'], kind: 'phone' },
    { key: 'whatsapp', ask: ['Is this number on WhatsApp?', 'ఈ నంబర్‌లో వాట్సాప్ ఉందా?'], kind: 'one', other: true, otherLabel: ['Another number (type it)', 'వేరే నంబర్ (రాయండి)'],
      options: [['Yes, same number', 'అవును, ఇదే నంబర్', 'same'], ['No WhatsApp', 'వాట్సాప్ లేదు', 'none']] },
    { key: 'gst', ask: ['GST number (if you have one)', 'GST నంబర్ (ఉంటే)'], kind: 'text', optional: true },
    { key: 'note', ask: ['Anything else we should know?', 'ఇంకా ఏమైనా చెప్పాలనుకుంటున్నారా?'], sub: ['Years in business, delivery times, minimum order…', 'ఎన్ని సంవత్సరాలుగా వ్యాపారం, డెలివరీ సమయం, కనీస ఆర్డర్…'], kind: 'long', optional: true },
  ].filter(Boolean)
}

/** How partnership works (shown before the questions) */
export const PARTNER_HOW = [
  ['We bring you orders in your town — iN Empower places every order.', 'మీ ఊరిలో ఆర్డర్లు మేము తెస్తాము — ప్రతి ఆర్డర్ iN Empower ఇస్తుంది.'],
  ['Our Local Buddy coordinates every order and is there at delivery.', 'ప్రతి ఆర్డర్‌ను మా లోకల్ బడ్డీ సమన్వయం చేస్తారు, డెలివరీ సమయంలో అక్కడే ఉంటారు.'],
  ['We pay you for each order, after our agreed commission. Our team explains the terms when we meet.', 'అంగీకరించిన కమిషన్ తర్వాత ప్రతి ఆర్డర్‌కు మీకు చెల్లిస్తాము. కలిసినప్పుడు మా బృందం నిబంధనలు వివరిస్తుంది.'],
  ['You deal only with iN Empower and our Local Buddy, who receives every order.', 'మీరు iN Empower, మా లోకల్ బడ్డీతో మాత్రమే వ్యవహరిస్తారు — ప్రతి ఆర్డర్‌ను బడ్డీ అందుకుంటారు.'],
]

/** Screen text around the steps */
export const PARTNER_APPLY_TEXT = {
  en: {
    title: 'Join as a Business Partner', who: 'Shops, suppliers, professionals, hospitals',
    how: 'How partnership works', intro: 'About 2 minutes. Answer what you can — our team will ask the rest on the call.',
    start: 'Apply as a partner', stepOf: 'Step {n} of {total}', next: 'Next', back: 'Back', send: 'Send my application', sending: 'Sending…',
    pickAny: 'Pick all that apply', typeHere: 'Type here…', other: 'Other (type)', review: 'Check your application', change: 'Change',
    required: 'Please answer this to continue', badMobile: 'Please enter a valid 10-digit mobile number', badName: 'Please write a name',
    badWhatsapp: 'Please type the WhatsApp number', sent: 'Application sent', thanks: 'Thank you, {name}!', yourRef: 'Your application number',
    next1: 'Our team calls you on {phone} within 2 working days.', next2: 'We meet you and explain how orders and payment work.',
    next3: 'Once we both agree, you start getting iN Empower orders in your town.', home: 'Back to home',
    sendFail: 'Sorry, we could not send your application. Please call or WhatsApp us on +91 83285 55396.',
    agree: 'By sending, you agree that our team may call you about working with iN Empower. We never share your details without your permission.',
    already: 'You have already applied. Your application number is the same — our team will call you.',
  },
  te: {
    title: 'బిజినెస్ పార్ట్‌నర్‌గా చేరండి', who: 'దుకాణాలు, సరఫరాదారులు, నిపుణులు, ఆసుపత్రులు',
    how: 'భాగస్వామ్యం ఎలా పనిచేస్తుంది', intro: 'సుమారు 2 నిమిషాలు. తెలిసినవి చెప్పండి — మిగతావి ఫోన్‌లో మా బృందం అడుగుతుంది.',
    start: 'పార్ట్‌నర్‌గా దరఖాస్తు చేయండి', stepOf: 'దశ {n} / {total}', next: 'తరువాత', back: 'వెనుకకు', send: 'నా దరఖాస్తు పంపండి', sending: 'పంపుతోంది…',
    pickAny: 'సరిపోయేవన్నీ ఎంచుకోండి', typeHere: 'ఇక్కడ రాయండి…', other: 'ఇతర (రాయండి)', review: 'మీ దరఖాస్తు ఒకసారి చూడండి', change: 'మార్చండి',
    required: 'ముందుకు వెళ్ళడానికి దీనికి సమాధానం ఇవ్వండి', badMobile: 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ ఇవ్వండి', badName: 'దయచేసి పేరు రాయండి',
    badWhatsapp: 'దయచేసి వాట్సాప్ నంబర్ రాయండి', sent: 'దరఖాస్తు పంపబడింది', thanks: 'ధన్యవాదాలు, {name}!', yourRef: 'మీ దరఖాస్తు నంబర్',
    next1: '2 పని దినాల్లో మా బృందం {phone} కు ఫోన్ చేస్తుంది.', next2: 'మిమ్మల్ని కలిసి, ఆర్డర్లు, చెల్లింపులు ఎలా ఉంటాయో వివరిస్తాము.',
    next3: 'ఇద్దరం అంగీకరించాక, మీ ఊరిలో iN Empower ఆర్డర్లు మొదలవుతాయి.', home: 'హోమ్‌కు వెళ్ళండి',
    sendFail: 'క్షమించండి, మీ దరఖాస్తు పంపలేకపోయాము. దయచేసి +91 83285 55396 కు ఫోన్ లేదా వాట్సాప్ చేయండి.',
    agree: 'పంపడం ద్వారా iN Empower తో కలిసి పనిచేయడం గురించి మా బృందం మీకు ఫోన్ చేయడానికి మీరు అంగీకరిస్తున్నారు. మీ అనుమతి లేకుండా మీ వివరాలు ఎవరికీ ఇవ్వము.',
    already: 'మీరు ఇప్పటికే దరఖాస్తు చేశారు. మీ దరఖాస్తు నంబర్ అదే — మా బృందం మీకు ఫోన్ చేస్తుంది.',
  },
}

export const partnerText = (lang, key, vars) => {
  let s = (PARTNER_APPLY_TEXT[lang === 'te' ? 'te' : 'en'][key]) ?? PARTNER_APPLY_TEXT.en[key] ?? key
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(v)
  // The phone number of the applicant's city (Admin → Cities)
  return placeText(s.split(COMPANY.phone).join(teamPhoneShown()))
}

/** The value an option saves (kinds save their id; everything else its English text). */
export const optValue = (o) => o[2] ?? o[0]
/** Text of a step / option in a language. */
export const say = (pair, lang) => (Array.isArray(pair) ? (lang === 'te' ? pair[1] || pair[0] : pair[0]) : pair)

const digitsOf = (v) => String(v || '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
export const isMobile = (v) => /^[6-9]\d{9}$/.test(digitsOf(v))

/**
 * Is this step answered well enough to move on? Returns an error key or null.
 * value = the chosen option(s) plus anything typed in "Other".
 */
export function checkPartnerStep(step, value) {
  const empty = value === undefined || value === null || (Array.isArray(value) ? value.length === 0 : String(value).trim() === '')
  if (step.kind === 'phone') return isMobile(value) ? null : 'badMobile'
  if (step.key === 'whatsapp') {
    if (value === 'same' || value === 'none') return null
    if (empty) return 'required'
    return isMobile(value) ? null : 'badWhatsapp'
  }
  if ((step.key === 'business' || step.key === 'contact') && String(value || '').trim().length < 2) return 'badName'
  if (step.optional) return null
  return empty ? 'required' : null
}

/**
 * What gets sent (api.applyAsPartner): answers are { [step.key]: string | string[] } in English.
 */
export function buildPartnerApplication(answers = {}) {
  const list = (v) => (Array.isArray(v) ? v : v ? [v] : []).map((x) => String(x).trim()).filter(Boolean)
  const phone = String(answers.phone || '').replace(/\s+/g, ' ').trim()
  const wa = answers.whatsapp === 'same' ? phone : answers.whatsapp === 'none' ? '' : String(answers.whatsapp || '').trim()
  const kind = PARTNER_KINDS.some((k) => k[2] === answers.kind) ? answers.kind : 'other'
  const items = list(answers.items).slice(0, 30)
  // The licence answer, for the team to check in person (owner, 2 Nov 2026)
  const needs = kind === 'other' ? [] : licencesFor(items)
  const said = answers.licence === 'yes' ? 'yes — will show it when we visit' : answers.licence === 'not-yet' ? 'not yet' : 'not answered'
  const licence = needs.length ? `Licence for ${needs.map(([x]) => x).join(', ')}: ${said} (check in person: ${[...new Set(needs.map(([, l]) => l[0]))].join('; ')})` : ''
  return {
    business: String(answers.business || '').trim().slice(0, 160),
    contact: String(answers.contact || '').trim().slice(0, 120),
    phone,
    whatsapp: wa,
    kind,
    items: items.map((x) => x.slice(0, 80)),
    // Lower case like the Local Buddy towns (the admin's town list: 'ongole', 'kandukur'…)
    town: String(answers.town || '').trim().toLowerCase().slice(0, 120),
    areas: list(answers.areas).join(', ').slice(0, 500),
    gst: String(answers.gst || '').trim().toUpperCase().slice(0, 30),
    // A "Something else" business describes what it offers in a sentence: keep the words for the team too
    note: [licence, kind === 'other' && items.length ? `Offers: ${items.join(', ')}` : '', String(answers.note || '').trim()].filter(Boolean).join('\n').slice(0, 1500),
  }
}
