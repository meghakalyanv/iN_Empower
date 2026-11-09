/**
 * "Become a Local Buddy" — the step-by-step application.
 * Shared by the website (pages/BecomeBuddy.jsx) and the app (BecomeBuddyScreen); edit here only.
 *
 * Every option is [English, Telugu]. The screen shows the chosen language;
 * what reaches the team (and the database) is always the English value.
 * Please have a Telugu speaker review the Telugu lines before launch.
 */
import { BUDDY_SKILLS, BUDDY_SKILLS_TE } from './buddyData.js'
import { quickTowns, placeText, teamPhoneShown, COMPANY } from './cities.js'

export const NOT_SURE_BUDDY = ['Not sure', 'తెలియదు']

const YEARS = [['Under 1 year', '1 సంవత్సరం లోపు'], ['1–3 years', '1–3 సంవత్సరాలు'], ['3–5 years', '3–5 సంవత్సరాలు'], ['Over 5 years', '5 సంవత్సరాలకు పైగా']]
const yearsQ = (en, te) => ({ key: 'years', ask: [en, te], kind: 'one', options: YEARS })

/** 1–3 short questions for each skill (keys match BUDDY_SKILLS). */
export const SKILL_QUESTIONS = {
  identity: [
    { key: 'done', ask: ['Which certificates have you helped people get?', 'ఏ ధృవీకరణ పత్రాల్లో ప్రజలకు సహాయం చేశారు?'], kind: 'many', notSure: true, options: [
      ['Birth / death certificates', 'జనన / మరణ పత్రాలు'], ['Income & caste certificates', 'ఆదాయ & కుల పత్రాలు'], ['Aadhaar updates', 'ఆధార్ మార్పులు'],
      ['Ration / rice card', 'రేషన్ / రైస్ కార్డ్'], ['Passport applications', 'పాస్‌పోర్ట్ దరఖాస్తులు'], ['None yet — ready to learn', 'ఇంకా లేదు — నేర్చుకోవడానికి సిద్ధం']] },
    { key: 'office', ask: ['Do you know the Sachivalayam / MeeSeva process?', 'సచివాలయం / మీసేవ ప్రక్రియ మీకు తెలుసా?'], kind: 'one', options: [['Yes, well', 'అవును, బాగా తెలుసు'], ['A little', 'కొంచెం'], ['No', 'లేదు']] },
  ],
  mro: [
    { key: 'done', ask: ['Which revenue office work do you know?', 'ఏ రెవెన్యూ కార్యాలయ పనులు మీకు తెలుసు?'], kind: 'many', notSure: true, options: [
      ['Pahani / Adangal', 'పహాణీ / అడంగల్'], ['Mutation & pattadar passbook', 'మ్యుటేషన్ & పట్టాదారు పాస్‌బుక్'], ['Income / caste certificates', 'ఆదాయ / కుల పత్రాలు'],
      ['Meebhoomi land records', 'మీభూమి భూమి రికార్డులు'], ['None yet — ready to learn', 'ఇంకా లేదు — నేర్చుకోవడానికి సిద్ధం']] },
    yearsQ('How long have you done this work?', 'ఈ పని ఎంత కాలంగా చేస్తున్నారు?'),
  ],
  rto: [
    { key: 'done', ask: ['Which RTO work do you know?', 'ఏ RTO పనులు మీకు తెలుసు?'], kind: 'many', notSure: true, options: [
      ["Learner's licence", 'లెర్నర్స్ లైసెన్స్'], ['Driving licence & renewal', 'డ్రైవింగ్ లైసెన్స్ & రెన్యూవల్'], ['RC transfer & HP removal', 'RC బదిలీ & HP తొలగింపు'],
      ['Permits & fitness', 'పర్మిట్లు & ఫిట్‌నెస్'], ['None yet — ready to learn', 'ఇంకా లేదు — నేర్చుకోవడానికి సిద్ధం']] },
    yearsQ('How long have you done RTO work?', 'RTO పనులు ఎంత కాలంగా చేస్తున్నారు?'),
  ],
  municipal: [
    { key: 'done', ask: ['Which municipal work do you know?', 'ఏ మున్సిపల్ పనులు మీకు తెలుసు?'], kind: 'many', notSure: true, options: [
      ['Property tax', 'ఆస్తి పన్ను'], ['Trade licence', 'ట్రేడ్ లైసెన్స్'], ['Building approvals', 'భవన అనుమతులు'], ['Water / drainage connection', 'నీరు / డ్రైనేజీ కనెక్షన్'],
      ['None yet — ready to learn', 'ఇంకా లేదు — నేర్చుకోవడానికి సిద్ధం']] },
  ],
  property: [
    { key: 'done', ask: ['Which property work do you know?', 'ఏ ఆస్తి పనులు మీకు తెలుసు?'], kind: 'many', notSure: true, options: [
      ['Sale deed registration', 'సేల్ డీడ్ రిజిస్ట్రేషన్'], ['Encumbrance certificate (EC)', 'ఎన్‌కంబరెన్స్ సర్టిఫికేట్ (EC)'], ['Land mutation', 'భూమి మ్యుటేషన్'],
      ['Land survey & FMB', 'భూమి సర్వే & FMB'], ['None yet — ready to learn', 'ఇంకా లేదు — నేర్చుకోవడానికి సిద్ధం']] },
    yearsQ('How long have you done property work?', 'ఆస్తి పనులు ఎంత కాలంగా చేస్తున్నారు?'),
  ],
  startup: [
    { key: 'done', ask: ['Which business registrations do you know?', 'ఏ వ్యాపార నమోదులు మీకు తెలుసు?'], kind: 'many', notSure: true, options: [
      ['GST', 'GST'], ['Udyam', 'ఉద్యమ్'], ['Shop & trade licence', 'షాపు & ట్రేడ్ లైసెన్స్'], ['Company / LLP', 'కంపెనీ / LLP'], ['None yet — ready to learn', 'ఇంకా లేదు — నేర్చుకోవడానికి సిద్ధం']] },
  ],
  court: [
    { key: 'background', ask: ['What is your court background?', 'కోర్టు పనిలో మీ అనుభవం ఏమిటి?'], kind: 'one', options: [
      ['Advocate', 'న్యాయవాది'], ["Advocate's clerk", 'న్యాయవాది గుమాస్తా'], ['Have followed cases for people', 'ఇతరుల కేసులు ఫాలో చేశాను'], ['None yet — ready to learn', 'ఇంకా లేదు — నేర్చుకోవడానికి సిద్ధం']] },
  ],
  healthcare: [
    { key: 'done', ask: ['How can you help patients?', 'రోగులకు ఎలా సహాయం చేయగలరు?'], kind: 'many', notSure: true, options: [
      ['Go with patients to hospital', 'రోగులతో ఆసుపత్రికి వెళ్ళడం'], ['Elder care at home', 'ఇంట్లో వృద్ధుల సంరక్షణ'], ['Trained nurse / ANM', 'శిక్షణ పొందిన నర్స్ / ANM'],
      ['Medicine pickup & delivery', 'మందులు తెచ్చి ఇవ్వడం'], ['Ambulance coordination', 'అంబులెన్స్ ఏర్పాటు']] },
  ],
  drivers: [
    { key: 'licence', ask: ['Which driving licence do you have?', 'మీకు ఏ డ్రైవింగ్ లైసెన్స్ ఉంది?'], kind: 'one', options: [
      ['Car (LMV)', 'కారు (LMV)'], ['Commercial / transport', 'కమర్షియల్ / ట్రాన్స్‌పోర్ట్'], ['Two-wheeler only', 'టూ-వీలర్ మాత్రమే'], ['No licence yet', 'ఇంకా లైసెన్స్ లేదు']] },
    yearsQ('How many years have you been driving?', 'ఎన్ని సంవత్సరాలుగా డ్రైవింగ్ చేస్తున్నారు?'),
    { key: 'vehicles', ask: ['What can you drive?', 'మీరు ఏమి నడపగలరు?'], kind: 'many', options: [
      ['Manual car', 'మాన్యువల్ కారు'], ['Automatic car', 'ఆటోమేటిక్ కారు'], ['SUV / 7-seater', 'SUV / 7 సీట్లు'], ['Van / tempo', 'వ్యాన్ / టెంపో'], ['Lorry', 'లారీ']] },
  ],
  education: [
    { key: 'done', ask: ['Which admissions can you guide?', 'ఏ అడ్మిషన్లలో మార్గదర్శనం చేయగలరు?'], kind: 'many', notSure: true, options: [
      ['Intermediate', 'ఇంటర్మీడియట్'], ['Degree', 'డిగ్రీ'], ['Engineering / EAPCET', 'ఇంజనీరింగ్ / EAPCET'], ['Scholarship forms', 'స్కాలర్‌షిప్ ఫారాలు']] },
  ],
  'home-tuition': [
    { key: 'classes', ask: ['Which classes can you teach?', 'ఏ తరగతులకు బోధించగలరు?'], kind: 'many', options: [
      ['Classes 1–5', '1–5 తరగతులు'], ['Classes 6–10', '6–10 తరగతులు'], ['Intermediate', 'ఇంటర్మీడియట్'], ['Degree', 'డిగ్రీ']] },
    { key: 'subjects', ask: ['Which subjects?', 'ఏ సబ్జెక్టులు?'], kind: 'many', options: [
      ['Maths', 'గణితం'], ['Science', 'సైన్స్'], ['English', 'ఇంగ్లీష్'], ['Telugu', 'తెలుగు'], ['Hindi', 'హిందీ'], ['Social', 'సోషల్'], ['Computers', 'కంప్యూటర్లు']] },
    { key: 'medium', ask: ['Which medium?', 'ఏ మీడియం?'], kind: 'one', options: [['Telugu medium', 'తెలుగు మీడియం'], ['English medium', 'ఇంగ్లీష్ మీడియం'], ['Both', 'రెండూ']] },
  ],
  photography: [
    { key: 'done', ask: ['What do you shoot?', 'మీరు ఏ ఫోటోలు తీస్తారు?'], kind: 'many', options: [
      ['Weddings', 'పెళ్ళిళ్ళు'], ['Events & functions', 'ఫంక్షన్లు'], ['Portraits', 'పోర్ట్రెయిట్లు'], ['Products', 'ఉత్పత్తులు'], ['Video too', 'వీడియో కూడా']] },
    { key: 'kit', ask: ['What camera do you have?', 'మీ దగ్గర ఏ కెమెరా ఉంది?'], kind: 'one', options: [
      ['DSLR / mirrorless', 'DSLR / మిర్రర్‌లెస్'], ['DSLR + drone', 'DSLR + డ్రోన్'], ['Phone only', 'ఫోన్ మాత్రమే']] },
  ],
  electricity: [
    { key: 'done', ask: ['Which home repair work can you do?', 'ఏ ఇంటి మరమ్మతు పనులు చేయగలరు?'], kind: 'many', options: [
      ['Electrical wiring & fittings', 'ఎలక్ట్రికల్ వైరింగ్ & ఫిట్టింగులు'], ['Geyser', 'గీజర్'], ['Plumbing', 'ప్లంబింగ్'], ['Water motor', 'నీటి మోటార్'],
      ['Home appliances', 'ఇంటి ఉపకరణాలు'], ['Carpentry & small fixes', 'వడ్రంగి & చిన్న మరమ్మతులు']] },
    { key: 'qualification', ask: ['Your electrical qualification?', 'ఎలక్ట్రికల్ పనిలో మీ అర్హత?'], kind: 'one', options: [
      ['ITI electrician', 'ITI ఎలక్ట్రీషియన్'], ['Licensed electrician', 'లైసెన్స్ ఉన్న ఎలక్ట్రీషియన్'], ['Experienced, no certificate', 'అనుభవం ఉంది, సర్టిఫికేట్ లేదు']] },
    yearsQ('How long have you done electrical work?', 'ఎలక్ట్రికల్ పని ఎంత కాలంగా చేస్తున్నారు?'),
  ],
  ac: [
    { key: 'done', ask: ['Which AC work can you do?', 'ఏ AC పనులు చేయగలరు?'], kind: 'many', options: [
      ['Installation', 'అమర్చడం'], ['Servicing & cleaning', 'సర్వీసింగ్ & క్లీనింగ్'], ['Gas filling', 'గ్యాస్ ఫిల్లింగ్'], ['PCB / electronic repair', 'PCB / ఎలక్ట్రానిక్ రిపేర్']] },
    yearsQ('How long have you done AC work?', 'AC పని ఎంత కాలంగా చేస్తున్నారు?'),
  ],
  pujari: [
    { key: 'done', ask: ['Which rituals do you perform?', 'మీరు ఏ కార్యక్రమాలు జరిపిస్తారు?'], kind: 'many', options: [
      ['Marriages', 'వివాహాలు'], ['Gruhapravesam', 'గృహప్రవేశం'], ['Vratams & homams', 'వ్రతాలు & హోమాలు'], ['Naming & upanayanam', 'నామకరణం & ఉపనయనం'], ['Ancestral rites', 'పితృ కార్యక్రమాలు']] },
    yearsQ('How long have you been a pujari?', 'ఎంత కాలంగా పూజారిగా ఉన్నారు?'),
  ],
  supplies: [
    { key: 'done', ask: ['How can you help with supplies?', 'సామగ్రి విషయంలో ఎలా సహాయం చేయగలరు?'], kind: 'many', options: [
      ['I know local suppliers', 'స్థానిక సరఫరాదారులు తెలుసు'], ['I own a goods vehicle', 'నాకు సరుకు వాహనం ఉంది'], ['I can supervise deliveries', 'డెలివరీలను పర్యవేక్షించగలను']] },
  ],
  travel: [
    { key: 'done', ask: ['How can you help travellers?', 'ప్రయాణికులకు ఎలా సహాయం చేయగలరు?'], kind: 'many', options: [
      ['Local guide', 'స్థానిక గైడ్'], ['Temple visits', 'ఆలయ దర్శనాలు'], ['Bus / railway station pickup', 'బస్ / రైల్వే స్టేషన్ పికప్'], ['Hotel & stay bookings', 'హోటల్ & బస బుకింగ్']] },
  ],
}

// Towns of the applicant's city (Admin → Cities); their own town (from location) first
const townOptions = () => quickTowns().map((t) => [t.name, t.te || t.name])

/** Screen text around the steps. */
export const BUDDY_APPLY_TEXT = {
  en: {
    start: 'Apply now →', stepOf: 'Step {n} of {total}', next: 'Next', back: 'Back', skip: 'Skip', send: 'Send my application', sending: 'Sending…',
    pickAny: 'Pick all that apply', typeHere: 'Type here…', other: 'Other (type)', review: 'Check your application', change: 'Change',
    required: 'Please answer this to continue', badMobile: 'Please enter a valid 10-digit mobile number', badName: 'Please enter your name',
    thanks: 'Thank you, {name}!', yourRef: 'Your application number', calls: "Our team will call you on {phone} within 2 working days to arrange a meeting.",
    bringPapers: 'Please bring the papers you ticked when we meet.', home: 'Back to home', intro: 'About 3 minutes. Answer what you can — our team will ask the rest on the call.',
    skillHead: 'About your {skill} work', sendFail: 'Sorry, we could not send your application. Please call or WhatsApp us on +91 83285 55396.', agree: 'By sending, you agree that our team may call you and check your identity. We never share your details without your permission.',
  },
  te: {
    start: 'ఇప్పుడే దరఖాస్తు చేయండి →', stepOf: 'దశ {n} / {total}', next: 'తరువాత', back: 'వెనుకకు', skip: 'దాటవేయండి', send: 'నా దరఖాస్తు పంపండి', sending: 'పంపుతోంది…',
    pickAny: 'సరిపోయేవన్నీ ఎంచుకోండి', typeHere: 'ఇక్కడ రాయండి…', other: 'ఇతర (రాయండి)', review: 'మీ దరఖాస్తు ఒకసారి చూడండి', change: 'మార్చండి',
    required: 'ముందుకు వెళ్ళడానికి దీనికి సమాధానం ఇవ్వండి', badMobile: 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ ఇవ్వండి', badName: 'దయచేసి మీ పేరు ఇవ్వండి',
    thanks: 'ధన్యవాదాలు, {name}!', yourRef: 'మీ దరఖాస్తు నంబర్', calls: 'కలవడానికి 2 పని దినాల్లో మా బృందం {phone} కు ఫోన్ చేస్తుంది.',
    bringPapers: 'కలిసినప్పుడు మీరు టిక్ చేసిన పత్రాలు తీసుకురండి.', home: 'హోమ్‌కు వెళ్ళండి', intro: 'సుమారు 3 నిమిషాలు. తెలిసినవి చెప్పండి — మిగతావి ఫోన్‌లో మా బృందం అడుగుతుంది.',
    skillHead: 'మీ {skill} పని గురించి', sendFail: 'క్షమించండి, మీ దరఖాస్తు పంపలేకపోయాము. దయచేసి +91 83285 55396 కు ఫోన్ లేదా వాట్సాప్ చేయండి.', agree: 'పంపడం ద్వారా మా బృందం మీకు ఫోన్ చేసి మీ గుర్తింపు తనిఖీ చేయడానికి మీరు అంగీకరిస్తున్నారు. మీ అనుమతి లేకుండా మీ వివరాలు ఎవరికీ ఇవ్వము.',
  },
}

export const buddyText = (lang, key, vars) => {
  let s = (BUDDY_APPLY_TEXT[lang === 'te' ? 'te' : 'en'][key]) ?? BUDDY_APPLY_TEXT.en[key] ?? key
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(v)
  // The phone number of the applicant's city (Admin → Cities)
  return placeText(s.split(COMPANY.phone).join(teamPhoneShown()))
}

/**
 * The steps, given what is picked so far (skill questions follow the skills chosen).
 * Step: { key, group, ask:[en,te], kind: 'text'|'phone'|'long'|'one'|'many', options?:[[en,te]], optional?, notSure?, other?, field? }
 * `field` = the buddies table column it fills.
 */
export function buddySteps(skills = []) {
  const steps = [
    { key: 'name', group: 'about', ask: ['What is your full name?', 'మీ పూర్తి పేరు ఏమిటి?'], sub: ['As on your Aadhaar card', 'ఆధార్ కార్డ్‌లో ఉన్నట్లు'], kind: 'text', field: 'name' },
    { key: 'phone', group: 'about', ask: ['Your mobile number', 'మీ మొబైల్ నంబర్'], sub: ['We will call you on this number', 'ఈ నంబర్‌కే ఫోన్ చేస్తాము'], kind: 'phone', field: 'phone' },
    { key: 'age', group: 'about', ask: ['Your age group', 'మీ వయస్సు'], kind: 'one', options: [['18–25', '18–25'], ['26–35', '26–35'], ['36–45', '36–45'], ['46–60', '46–60'], ['Above 60', '60 పైన']] },
    { key: 'gender', group: 'about', ask: ['Gender', 'లింగం'], kind: 'one', optional: true, options: [['Female', 'స్త్రీ'], ['Male', 'పురుషుడు'], ['Prefer not to say', 'చెప్పకూడదనుకుంటున్నాను']] },
    { key: 'education', group: 'about', ask: ['Your education', 'మీ చదువు'], kind: 'one', options: [
      ['Below 10th', '10వ తరగతి లోపు'], ['10th', '10వ తరగతి'], ['Inter / 12th', 'ఇంటర్ / 12వ తరగతి'], ['ITI / Diploma', 'ITI / డిప్లొమా'], ['Degree', 'డిగ్రీ'], ['Post-graduate', 'పోస్ట్ గ్రాడ్యుయేట్']] },
    { key: 'address', group: 'where', ask: ['Your home address', 'మీ ఇంటి చిరునామా'], sub: ['Door no., street, village / area', 'డోర్ నంబర్, వీధి, గ్రామం / ప్రాంతం'], kind: 'long' },
    { key: 'town', group: 'where', ask: ['Which town or mandal do you live in?', 'మీరు ఏ ఊరు / మండలంలో ఉంటారు?'], kind: 'one', other: true, options: townOptions(), field: 'town' },
    { key: 'areas', group: 'where', ask: ['Which areas or villages can you cover?', 'మీరు ఏ ప్రాంతాలు / గ్రామాలు చూసుకోగలరు?'], sub: ['e.g. Gandhi Road, Santhapet, nearby villages', 'ఉదా. గాంధీ రోడ్, సంతపేట, దగ్గర్లోని గ్రామాలు'], kind: 'long', optional: true, field: 'areas' },
    { key: 'skills', group: 'skills', ask: ['What can you help people with?', 'మీరు ప్రజలకు ఏ పనుల్లో సహాయం చేయగలరు?'], kind: 'many',
      options: BUDDY_SKILLS.map(([k, en]) => [en, BUDDY_SKILLS_TE[k] || en, k]), field: 'services' },
  ]
  // Skill questions, in the order the skills appear in the list
  for (const [k, en] of BUDDY_SKILLS) {
    if (!skills.includes(k)) continue
    for (const q of SKILL_QUESTIONS[k] || []) {
      steps.push({ ...q, key: `${k}.${q.key}`, group: 'skill', skill: k, skillName: [en, BUDDY_SKILLS_TE[k] || en] })
    }
  }
  steps.push(
    { key: 'workType', group: 'time', ask: ['How do you want to work?', 'మీరు ఎలా పనిచేయాలనుకుంటున్నారు?'], kind: 'one', options: [
      ['Full-time', 'పూర్తి సమయం'], ['Part-time', 'పార్ట్-టైమ్'], ['Weekends only', 'వారాంతాల్లో మాత్రమే'], ['When you call me', 'మీరు పిలిచినప్పుడు']] },
    { key: 'days', group: 'time', ask: ['Which days are you free?', 'ఏ రోజులు మీకు ఖాళీ?'], kind: 'many', options: [
      ['Monday', 'సోమవారం'], ['Tuesday', 'మంగళవారం'], ['Wednesday', 'బుధవారం'], ['Thursday', 'గురువారం'], ['Friday', 'శుక్రవారం'], ['Saturday', 'శనివారం'], ['Sunday', 'ఆదివారం']] },
    { key: 'hours', group: 'time', ask: ['What time of day?', 'రోజులో ఏ సమయం?'], kind: 'many', options: [
      ['Morning (6–12)', 'ఉదయం (6–12)'], ['Afternoon (12–4)', 'మధ్యాహ్నం (12–4)'], ['Evening (4–9)', 'సాయంత్రం (4–9)'], ['Night', 'రాత్రి']] },
    { key: 'vehicle', group: 'travel', ask: ['How do you get around?', 'మీరు ఎలా తిరుగుతారు?'], kind: 'many', options: [
      ['Own two-wheeler', 'సొంత టూ-వీలర్'], ['Own car', 'సొంత కారు'], ['Own auto', 'సొంత ఆటో'], ['Bicycle', 'సైకిల్'], ['Bus / shared auto', 'బస్ / షేర్ ఆటో']] },
    { key: 'dl', group: 'travel', ask: ['Do you have a driving licence?', 'మీకు డ్రైవింగ్ లైసెన్స్ ఉందా?'], kind: 'one', options: [
      ['Yes — two-wheeler', 'ఉంది — టూ-వీలర్'], ['Yes — car', 'ఉంది — కారు'], ['Yes — both', 'ఉంది — రెండూ'], ['No', 'లేదు']] },
    { key: 'phoneType', group: 'travel', ask: ['What phone do you use?', 'మీరు ఏ ఫోన్ వాడతారు?'], kind: 'one', options: [
      ['Smartphone with WhatsApp', 'వాట్సాప్ ఉన్న స్మార్ట్‌ఫోన్'], ['Smartphone, no WhatsApp', 'స్మార్ట్‌ఫోన్, వాట్సాప్ లేదు'], ['Basic phone', 'సాధారణ ఫోన్']] },
    { key: 'languages', group: 'more', ask: ['Which languages can you speak?', 'మీరు ఏ భాషలు మాట్లాడగలరు?'], kind: 'many', other: true, options: [
      ['Telugu', 'తెలుగు'], ['English', 'ఇంగ్లీష్'], ['Hindi', 'హిందీ'], ['Tamil', 'తమిళం'], ['Urdu', 'ఉర్దూ']], field: 'languages' },
    { key: 'experience', group: 'more', ask: ['Tell us about your experience', 'మీ అనుభవం గురించి చెప్పండి'], sub: ['e.g. 5 years helping neighbours with MRO certificates', 'ఉదా. 5 సంవత్సరాలుగా ఇరుగుపొరుగువారికి MRO పత్రాల్లో సహాయం'], kind: 'long', optional: true, field: 'experience' },
    { key: 'papers', group: 'more', ask: ['Which papers can you show at the ID check?', 'గుర్తింపు తనిఖీలో ఏ పత్రాలు చూపగలరు?'], sub: ['Just tick — no upload needed', 'టిక్ చేయండి చాలు — అప్‌లోడ్ అవసరం లేదు'], kind: 'many', options: [
      ['Aadhaar card', 'ఆధార్ కార్డ్'], ['PAN card', 'PAN కార్డ్'], ['Voter ID', 'ఓటర్ ID'], ['Driving licence', 'డ్రైవింగ్ లైసెన్స్'], ['Bank passbook', 'బ్యాంక్ పాస్‌బుక్'],
      ['Education certificates', 'చదువు సర్టిఫికేట్లు'], ['Skill / trade certificate', 'నైపుణ్య / వృత్తి సర్టిఫికేట్']] },
    { key: 'email', group: 'more', ask: ['Email (optional)', 'ఇమెయిల్ (ఐచ్ఛికం)'], kind: 'text', optional: true, field: 'email', input: 'email' },
  )
  return steps
}

/** The value an option saves (skills save their key; everything else its English text). */
export const optValue = (o) => o[2] ?? o[0]

/** Text of a step / option in a language. */
export const say = (pair, lang) => (Array.isArray(pair) ? (lang === 'te' ? pair[1] || pair[0] : pair[0]) : pair)

/** Is this step answered well enough to move on? Returns an error key or null. */
export function checkStep(step, value) {
  const empty = value === undefined || value === null || (Array.isArray(value) ? value.length === 0 : String(value).trim() === '')
  if (step.key === 'name' && empty) return 'badName'
  if (step.kind === 'phone') {
    const d = String(value || '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
    return /^[6-9]\d{9}$/.test(d) ? null : 'badMobile'
  }
  if (step.optional) return null
  return empty ? 'required' : null
}

export const newBuddyRef = () => {
  const c = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 5; i++) s += c[Math.floor(Math.random() * c.length)]
  return `BD-${s}`
}

/**
 * What gets saved: the normal buddies columns + details { ref, answers:[{q, a, notSure}] } in English.
 * answers: { [step.key]: string | string[] } — values are English option texts or typed text.
 */
export function buildBuddyApplication(answers, ref = newBuddyRef()) {
  const skills = answers.skills || []
  const steps = buddySteps(skills)
  const list = []
  for (const s of steps) {
    if (['name', 'phone', 'email'].includes(s.key)) continue // saved in their own columns
    const v = answers[s.key]
    if (v === undefined || v === '' || (Array.isArray(v) && !v.length)) continue
    // Skills are saved by key; show their English names in the answer list
    const shown = s.key === 'skills' ? v.map((k) => (s.options.find((o) => o[2] === k) || [k])[0]) : v
    const a = Array.isArray(shown) ? shown.join(', ') : String(shown).trim()
    const q = s.group === 'skill' ? `${s.skillName[0]} — ${s.ask[0]}` : s.ask[0]
    list.push({ q, a, notSure: a === NOT_SURE_BUDDY[0] })
  }
  const skillKeys = skills.filter((k) => BUDDY_SKILLS.some(([kk]) => kk === k))
  return {
    name: String(answers.name || '').trim(),
    phone: String(answers.phone || '').replace(/\s+/g, ' ').trim(),
    email: String(answers.email || '').trim(),
    town: answers.town ? String(answers.town).toLowerCase() : 'other',
    areas: String(answers.areas || '').trim(),
    services: skillKeys,
    languages: Array.isArray(answers.languages) ? answers.languages.join(', ') : answers.languages || '',
    experience: String(answers.experience || '').trim(),
    details: { ref, answers: list, address: String(answers.address || '').trim() },
    ref,
  }
}
