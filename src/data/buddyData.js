/**
 * Local Buddy skills and joining steps — shared by the website and the mobile app (same business, same data).
 * Edit here only; the app copies it with `npm run sync-data`.
 */
export const BUDDY_SKILLS = [
  ['identity', 'Certificates & ID documents'],
  ['mro', 'MRO / revenue office work'],
  ['rto', 'RTO — licence, RC, permits'],
  ['municipal', 'Municipal office work'],
  ['property', 'Property registration & land records'],
  ['startup', 'Business / startup registration'],
  ['court', 'Court & legal follow-up'],
  ['healthcare', 'Hospital help & patient care'],
  ['drivers', 'Driving'],
  ['education', 'College admissions guidance'],
  ['home-tuition', 'Home tuition / teaching'],
  ['photography', 'Photography'],
  ['electricity', 'Electrical & home repair work'],
  ['ac', 'AC service & repair'],
  ['pujari', 'Pujari / priest services'],
  ['supplies', 'Building supplies & logistics'],
  ['travel', 'Travel & local guide'],
]

export const BUDDY_STEPS = [
  { n: '1', title: 'Apply', text: 'Tell us about yourself, your area and what you are good at. It takes 3 minutes.' },
  { n: '2', title: 'Meet our team', text: 'We call you, meet you in person and check your ID (Tier 1).' },
  { n: '3', title: 'Show your skills', text: 'A short practical check of the work you want to do (Tier 2).' },
  { n: '4', title: 'Start earning', text: 'Get your iN Empower Trust Seal and start receiving requests near you (Tier 3).' },
]


/** Telugu labels (same keys / order as above). */
export const BUDDY_SKILLS_TE = {
  identity: 'సర్టిఫికేట్లు & గుర్తింపు పత్రాలు',
  mro: 'MRO / రెవెన్యూ కార్యాలయ పనులు',
  rto: 'RTO — లైసెన్స్, RC, పర్మిట్లు',
  municipal: 'మున్సిపల్ కార్యాలయ పనులు',
  property: 'ఆస్తి రిజిస్ట్రేషన్ & భూమి రికార్డులు',
  startup: 'వ్యాపారం / స్టార్టప్ రిజిస్ట్రేషన్',
  court: 'కోర్టు & న్యాయ పనుల ఫాలో-అప్',
  healthcare: 'ఆసుపత్రి సహాయం & రోగి సంరక్షణ',
  drivers: 'డ్రైవింగ్',
  education: 'కాలేజీ అడ్మిషన్ల మార్గదర్శనం',
  'home-tuition': 'హోమ్ ట్యూషన్ / బోధన',
  photography: 'ఫోటోగ్రఫీ',
  electricity: 'ఎలక్ట్రికల్ & ఇంటి మరమ్మతు పనులు',
  ac: 'AC సర్వీస్ & రిపేర్',
  pujari: 'పూజారి సేవలు',
  supplies: 'నిర్మాణ సామగ్రి & రవాణా',
  travel: 'ప్రయాణం & స్థానిక గైడ్',
}

export const BUDDY_STEPS_TE = [
  { n: '1', title: 'దరఖాస్తు', text: 'మీ గురించి, మీ ప్రాంతం, మీరు బాగా చేయగల పనుల గురించి చెప్పండి. 3 నిమిషాలు చాలు.' },
  { n: '2', title: 'మా బృందాన్ని కలవండి', text: 'మేము ఫోన్ చేసి, నేరుగా కలిసి, మీ గుర్తింపు తనిఖీ చేస్తాము (దశ 1).' },
  { n: '3', title: 'మీ నైపుణ్యం చూపండి', text: 'మీరు చేయాలనుకునే పనిపై చిన్న ప్రాక్టికల్ పరీక్ష (దశ 2).' },
  { n: '4', title: 'సంపాదన ప్రారంభించండి', text: 'iN Empower ట్రస్ట్ సీల్ పొంది, మీ దగ్గర్లోని అభ్యర్థనలు అందుకోండి (దశ 3).' },
]
