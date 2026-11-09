/**
 * The details each service asks for IN THE APP (owner, 30 Oct 2026): the team does not
 * call the customer to collect details any more — it calls only with the price.
 * Shared by the website and the mobile app (the app copies it with `npm run sync-data`).
 *
 * Rules (owner's answers):
 *   · every detail is OPTIONAL — the customer fills what they know
 *   · never ask for Aadhaar, PAN or other ID NUMBERS (papers are ticked, not typed;
 *     the Local Buddy collects the papers in person)
 *   · no photo uploads for now (photos go on WhatsApp after the request)
 *   · what is filled is for the iN Empower team only — never sent to a Business Partner
 *
 * A field: { key, type, en, te, hint?, hintTe?, half?, options?, multi?, when? }
 *   type: 'text' | 'long' (several lines) | 'number' | 'date' | 'choice'
 *         | 'district' (filled from the customer's city) | 'mandal' | 'village' (town suggestions)
 *         | 'note' (a line of help, not a box)
 *   options: [[english, telugu], …] for 'choice' (multi: true = pick several)
 *   when: 'past' | 'future' for dates (birth dates vs. booking dates)
 *   half: true = two boxes side by side
 */
import { currentCity, currentTown } from './cities.js'
import { isGovService } from './legalText.js'

// Common details, written once (English, Telugu)
export const P = {
  name: { key: 'name', type: 'text', en: 'Full name (as in Aadhaar)', te: 'పూర్తి పేరు (ఆధార్‌లో ఉన్నట్లు)' },
  fatherName: { key: 'fatherName', type: 'text', en: "Father's name", te: 'తండ్రి పేరు' },
  motherName: { key: 'motherName', type: 'text', en: "Mother's name", te: 'తల్లి పేరు' },
  parentName: { key: 'parentName', type: 'text', en: "Father's / husband's name", te: 'తండ్రి / భర్త పేరు' },
  dob: { key: 'dob', type: 'date', when: 'past', en: 'Date of birth', te: 'పుట్టిన తేదీ' },
  gender: { key: 'gender', type: 'choice', en: 'Gender', te: 'లింగం', options: [['Male', 'పురుషుడు'], ['Female', 'స్త్రీ'], ['Other', 'ఇతరులు']] },
  address: { key: 'address', type: 'long', en: 'Full address (door no., street, town)', te: 'పూర్తి చిరునామా (ఇంటి నం., వీధి, ఊరు)' },
  district: { key: 'district', type: 'district', en: 'District', te: 'జిల్లా' },
  mandal: { key: 'mandal', type: 'mandal', en: 'Mandal', te: 'మండలం' },
  village: { key: 'village', type: 'village', en: 'Village / town', te: 'గ్రామం / పట్టణం' },
  surveyNo: { key: 'surveyNo', type: 'text', en: 'Survey number', te: 'సర్వే నంబర్', hint: 'e.g. 123/4A', hintTe: 'ఉదా: 123/4A', half: true },
  khataNo: { key: 'khataNo', type: 'text', en: 'Account (Khata) no.', te: 'ఖాతా నంబర్', hint: 'e.g. 1045', hintTe: 'ఉదా: 1045', half: true },
  plotNo: { key: 'plotNo', type: 'text', en: 'Plot / door number', te: 'ప్లాట్ / ఇంటి నంబర్', half: true },
  doorNo: { key: 'doorNo', type: 'text', en: 'House / door number', te: 'ఇంటి / డోర్ నంబర్', half: true },
  purpose: { key: 'purpose', type: 'text', en: 'Why do you need it?', te: 'ఇది ఎందుకు కావాలి?', hint: 'e.g. scholarship, school admission, job', hintTe: 'ఉదా: స్కాలర్‌షిప్, స్కూల్ అడ్మిషన్, ఉద్యోగం' },
  relation: { key: 'relation', type: 'text', en: 'Your relation to them', te: 'వారితో మీ సంబంధం', hint: 'e.g. son, wife', hintTe: 'ఉదా: కుమారుడు, భార్య' },
  eitherNo: { key: 'eitherNote', type: 'note', en: 'Survey number or account number — either one is enough.', te: 'సర్వే నంబర్ లేదా ఖాతా నంబర్ — ఏదో ఒకటి ఉన్నా చాలు.' },
  // Bookings (photography and the like)
  shootDate: { key: 'date', type: 'date', when: 'future', en: 'Date of the shoot', te: 'షూట్ తేదీ', half: true },
  dayTime: { key: 'time', type: 'choice', en: 'What time of day?', te: 'రోజులో ఏ సమయం?', options: [['Morning', 'ఉదయం'], ['Afternoon', 'మధ్యాహ్నం'], ['Evening', 'సాయంత్రం'], ['Full day', 'రోజంతా']] },
  venueTown: { key: 'village', type: 'village', en: 'Town / village', te: 'ఊరు / గ్రామం' },
  venue: { key: 'venue', type: 'text', en: 'Venue (hall or place name)', te: 'వేదిక (హాల్ లేదా స్థలం పేరు)' },
  duration: { key: 'duration', type: 'text', en: 'How long?', te: 'ఎంతసేపు?', hint: 'e.g. 6 hours, 2 days', hintTe: 'ఉదా: 6 గంటలు, 2 రోజులు' },
  refs: { key: 'refs', type: 'long', en: 'Photos you like (links)', te: 'మీకు నచ్చిన ఫోటోలు (లింకులు)', hint: 'Or send them on WhatsApp after your request', hintTe: 'లేదా అభ్యర్థన తర్వాత వాట్సాప్‌లో పంపండి' },
  // A site (architecture, interiors)
  siteTown: { key: 'village', type: 'village', en: 'Site town / village', te: 'స్థలం ఉన్న ఊరు / గ్రామం' },
  siteArea: { key: 'area', type: 'text', en: 'Area / street', te: 'ఏరియా / వీధి' },
  photosLater: { key: 'photosNote', type: 'note', en: 'Send photos of the place on WhatsApp after your request.', te: 'అభ్యర్థన తర్వాత స్థలం ఫోటోలను వాట్సాప్‌లో పంపండి.' },
}
export const as = (preset, changes) => ({ ...preset, ...changes })

const PHOTO_SHOOT = [P.shootDate, as(P.dayTime, { half: true }), P.venueTown, P.venue, P.duration, P.refs]
const ARCH = [P.siteTown, P.siteArea,
  { key: 'measure', type: 'text', en: 'Site measurements, if you have them', te: 'స్థలం కొలతలు, ఉంటే', hint: 'e.g. 30 × 40 ft', hintTe: 'ఉదా: 30 × 40 అడుగులు' },
  { key: 'designs', type: 'long', en: 'House designs you like (links)', te: 'మీకు నచ్చిన ఇంటి డిజైన్లు (లింకులు)', hint: 'Or send photos on WhatsApp later', hintTe: 'లేదా తర్వాత వాట్సాప్‌లో ఫోటోలు పంపండి' },
  P.photosLater]
const INTERIOR = [P.siteTown, as(P.siteArea, { en: 'Your area / street', te: 'మీ ఏరియా / వీధి' }),
  { key: 'rooms', type: 'text', en: 'Room measurements, if you have them', te: 'గదుల కొలతలు, ఉంటే', hint: 'e.g. kitchen 10 × 8 ft', hintTe: 'ఉదా: వంటగది 10 × 8 అడుగులు' },
  { key: 'designs', type: 'long', en: 'Designs you like (links)', te: 'మీకు నచ్చిన డిజైన్లు (లింకులు)', hint: 'Or send photos on WhatsApp later', hintTe: 'లేదా తర్వాత వాట్సాప్‌లో ఫోటోలు పంపండి' },
  P.photosLater]

export const SERVICE_FIELDS = {
  // ── Certificates & IDs ──
  'birth-certificate': [
    { key: 'childName', type: 'text', en: "Child's name (if named)", te: 'బిడ్డ పేరు (పెట్టి ఉంటే)' },
    as(P.dob, { en: "Child's date of birth", te: 'బిడ్డ పుట్టిన తేదీ' }),
    P.gender,
    { key: 'birthPlace', type: 'text', en: 'Place of birth (hospital or home, town)', te: 'పుట్టిన స్థలం (ఆసుపత్రి లేదా ఇల్లు, ఊరు)' },
    P.fatherName, P.motherName,
    as(P.address, { en: "Parents' address", te: 'తల్లిదండ్రుల చిరునామా' }),
    { key: 'oldRef', type: 'text', en: 'For late registration: hospital or old application number', te: 'ఆలస్య నమోదు అయితే: ఆసుపత్రి లేదా పాత దరఖాస్తు నంబర్' },
  ],
  'marriage-certificate': [
    { key: 'groomName', type: 'text', en: "Groom's full name", te: 'వరుడి పూర్తి పేరు' },
    { key: 'groomDob', type: 'date', when: 'past', en: "Groom's date of birth", te: 'వరుడి పుట్టిన తేదీ' },
    { key: 'brideName', type: 'text', en: "Bride's full name", te: 'వధువు పూర్తి పేరు' },
    { key: 'brideDob', type: 'date', when: 'past', en: "Bride's date of birth", te: 'వధువు పుట్టిన తేదీ' },
    { key: 'marriageDate', type: 'date', when: 'past', en: 'Marriage date', te: 'పెళ్ళి తేదీ' },
    { key: 'marriagePlace', type: 'text', en: 'Marriage place (venue, town)', te: 'పెళ్ళి జరిగిన స్థలం (వేదిక, ఊరు)' },
    { key: 'religion', type: 'text', en: 'Religion', te: 'మతం', half: true },
    { key: 'caste', type: 'text', en: 'Caste of both', te: 'ఇద్దరి కులం', half: true },
    { key: 'professions', type: 'text', en: 'Professions of both', te: 'ఇద్దరి వృత్తులు' },
    { key: 'parents', type: 'long', en: "Parents' names (both families)", te: 'తల్లిదండ్రుల పేర్లు (రెండు కుటుంబాలు)' },
    as(P.address, { en: 'Permanent address', te: 'శాశ్వత చిరునామా' }),
    { key: 'witnesses', type: 'long', en: 'Witnesses: names and addresses (2 or 3 adults)', te: 'సాక్షులు: పేర్లు, చిరునామాలు (2 లేదా 3 పెద్దవారు)' },
  ],
  'income-certificate': [
    P.name, P.parentName, P.gender, P.dob, P.address,
    { key: 'incomeFrom', type: 'choice', en: 'Income from', te: 'ఆదాయం దేని నుంచి', multi: true, options: [['Salary', 'జీతం'], ['Business', 'వ్యాపారం'], ['Farming', 'వ్యవసాయం'], ['Daily wages', 'రోజు కూలీ'], ['Other', 'ఇతర']] },
    { key: 'income', type: 'number', en: 'Family income per year (₹)', te: 'కుటుంబ సంవత్సర ఆదాయం (₹)' },
    P.purpose,
  ],
  'caste-community-certificate': [
    P.name, P.fatherName, P.motherName, P.dob, P.address,
    { key: 'caste', type: 'text', en: 'Caste and sub-caste', te: 'కులం, ఉప కులం' },
    { key: 'householdNo', type: 'text', en: 'Household survey number (if you have it)', te: 'హౌస్‌హోల్డ్ సర్వే నంబర్ (ఉంటే)' },
    P.purpose,
  ],
  'nativity-residence-certificate': [
    P.name, P.fatherName, P.dob, P.address,
    { key: 'years', type: 'number', en: 'Years living at this address', te: 'ఈ చిరునామాలో ఎన్ని సంవత్సరాలుగా ఉంటున్నారు' },
    { key: 'family', type: 'long', en: 'Family members (name, relation)', te: 'కుటుంబ సభ్యులు (పేరు, సంబంధం)' },
    P.purpose,
  ],
  'passport-application': [
    { key: 'kind', type: 'choice', en: 'What do you need?', te: 'మీకు ఏమి కావాలి?', options: [['New passport', 'కొత్త పాస్‌పోర్ట్'], ['Renewal', 'రెన్యూవల్'], ['Not sure', 'తెలియదు']] },
    P.name, P.dob,
    { key: 'birthPlace', type: 'text', en: 'Place of birth', te: 'పుట్టిన స్థలం' },
    P.fatherName, P.motherName,
    { key: 'spouse', type: 'text', en: 'Husband / wife name (if married)', te: 'భర్త / భార్య పేరు (పెళ్ళైతే)' },
    as(P.address, { en: 'Present address', te: 'ప్రస్తుత చిరునామా' }),
    { key: 'pastAddresses', type: 'long', en: 'Other addresses in the last one year', te: 'గత ఒక సంవత్సరంలో ఉన్న ఇతర చిరునామాలు' },
  ],
  'death-certificate': [
    { key: 'deceased', type: 'text', en: 'Full name of the person who passed away', te: 'మరణించిన వారి పూర్తి పేరు' },
    { key: 'deathDate', type: 'date', when: 'past', en: 'Date of death', te: 'మరణించిన తేదీ', half: true },
    { key: 'deathTime', type: 'text', en: 'Time', te: 'సమయం', hint: 'e.g. 6:30 am', hintTe: 'ఉదా: ఉదయం 6:30', half: true },
    { key: 'deathPlace', type: 'text', en: 'Place of death (hospital or home, town)', te: 'మరణించిన స్థలం (ఆసుపత్రి లేదా ఇల్లు, ఊరు)' },
    { key: 'cause', type: 'text', en: 'Cause of death (as known)', te: 'మరణానికి కారణం (తెలిసినంత వరకు)' },
    P.relation,
    as(P.address, { en: 'Their address', te: 'వారి చిరునామా' }),
  ],

  // ── Mandal office (MRO) ──
  'family-member-survivorship-certificate': [
    { key: 'deceased', type: 'text', en: 'Full name of the person who passed away', te: 'మరణించిన వారి పూర్తి పేరు' },
    { key: 'deathDate', type: 'date', when: 'past', en: 'Date of death', te: 'మరణించిన తేదీ' },
    { key: 'applicant', type: 'text', en: 'Your full name', te: 'మీ పూర్తి పేరు' },
    P.relation,
    as(P.address, { en: 'Your address', te: 'మీ చిరునామా' }),
    { key: 'family', type: 'long', en: 'Living family members (name, relation, age)', te: 'జీవించి ఉన్న కుటుంబ సభ్యులు (పేరు, సంబంధం, వయస్సు)' },
    P.purpose,
  ],
  'pahani-adangal': [P.district, P.mandal, P.village, P.surveyNo, P.khataNo, P.eitherNo],
  'pattadar-passbook': [
    { key: 'need', type: 'choice', en: 'What do you need?', te: 'మీకు ఏమి కావాలి?', options: [['New passbook', 'కొత్త పాస్‌బుక్'], ['Name change after sale or inheritance', 'అమ్మకం / వారసత్వం తర్వాత పేరు మార్పు'], ['Correction', 'తప్పుల సవరణ'], ['Not sure', 'తెలియదు']] },
    P.name, P.parentName, P.district, P.mandal, P.village, P.surveyNo, P.khataNo,
    { key: 'extent', type: 'text', en: 'Land extent', te: 'భూమి విస్తీర్ణం', hint: 'e.g. 2 acres 30 cents', hintTe: 'ఉదా: 2 ఎకరాలు 30 సెంట్లు' },
  ],
  'land-possession-certificate': [
    P.doorNo,
    { key: 'extent', type: 'text', en: 'Extent', te: 'విస్తీర్ణం', hint: 'e.g. 150 sq. yards', hintTe: 'ఉదా: 150 చ. గజాలు', half: true },
    as(P.address, { en: 'Property address', te: 'ఆస్తి చిరునామా' }),
    { key: 'boundaries', type: 'long', en: 'Boundaries: what is on the East, West, North and South', te: 'హద్దులు: తూర్పు, పడమర, ఉత్తరం, దక్షిణం వైపు ఏమి ఉన్నాయి' },
  ],

  // ── House & municipal ──
  'property-tax': [
    as(P.address, { en: 'Property address', te: 'ఆస్తి చిరునామా' }),
    P.doorNo,
    { key: 'assessmentNo', type: 'text', en: 'Tax (assessment) no.', te: 'పన్ను (అసెస్‌మెంట్) నంబర్', hint: 'If you have it', hintTe: 'ఉంటే', half: true },
    { key: 'plotArea', type: 'text', en: 'Plot area', te: 'స్థలం విస్తీర్ణం', hint: 'e.g. 200 sq. yards', hintTe: 'ఉదా: 200 చ. గజాలు', half: true },
    { key: 'builtArea', type: 'text', en: 'Built-up area', te: 'నిర్మాణ విస్తీర్ణం', hint: 'e.g. 1200 sq. ft', hintTe: 'ఉదా: 1200 చ. అడుగులు', half: true },
    { key: 'yearBuilt', type: 'number', en: 'Year of construction', te: 'నిర్మించిన సంవత్సరం', hint: 'e.g. 2015', hintTe: 'ఉదా: 2015' },
    { key: 'use', type: 'choice', en: 'Used for', te: 'దేనికి ఉపయోగం', options: [['Living (residential)', 'నివాసం'], ['Shop / business (commercial)', 'దుకాణం / వ్యాపారం'], ['Both', 'రెండూ']] },
  ],

  // ── Property papers ──
  'property-registration-sale-deed': [
    { key: 'seller', type: 'text', en: 'Seller full name(s)', te: 'అమ్మేవారి పూర్తి పేరు(లు)' },
    { key: 'buyer', type: 'text', en: 'Buyer full name(s)', te: 'కొనేవారి పూర్తి పేరు(లు)' },
    P.district, P.mandal, as(P.village, { en: 'Village / ward', te: 'గ్రామం / వార్డు' }),
    P.surveyNo, P.plotNo,
    { key: 'extent', type: 'text', en: 'Total extent', te: 'మొత్తం విస్తీర్ణం', hint: 'e.g. 200 sq. yards or 1.5 acres', hintTe: 'ఉదా: 200 చ. గజాలు లేదా 1.5 ఎకరాలు' },
    { key: 'price', type: 'number', en: 'Sale price agreed (₹)', te: 'ఒప్పుకున్న అమ్మకం ధర (₹)' },
  ],
  'encumbrance-certificate': [
    as(P.address, { en: 'Property address', te: 'ఆస్తి చిరునామా' }),
    P.district, P.mandal, P.village, P.surveyNo, P.plotNo,
    { key: 'sro', type: 'text', en: 'Sub-registrar office (if you know)', te: 'సబ్-రిజిస్ట్రార్ కార్యాలయం (తెలిస్తే)' },
    { key: 'years', type: 'choice', en: 'For how many years?', te: 'ఎన్ని సంవత్సరాలకు?', options: [['Last 13 years', 'గత 13 సంవత్సరాలు'], ['Last 30 years', 'గత 30 సంవత్సరాలు'], ['Not sure', 'తెలియదు']] },
    { key: 'owners', type: 'long', en: 'Current and earlier owners (names)', te: 'ప్రస్తుత, గత యజమానుల పేర్లు' },
  ],

  // ── Photography ──
  'wedding-photography': PHOTO_SHOOT,
  'corporate-photography': PHOTO_SHOOT,
  'advertising-photography': PHOTO_SHOOT,
  'event-photography': PHOTO_SHOOT,
  'portrait-photography': PHOTO_SHOOT,
  'product-photography': [
    { key: 'count', type: 'number', en: 'How many products?', te: 'ఎన్ని ఉత్పత్తులు?' },
    { key: 'usage', type: 'choice', multi: true, en: 'Where will the photos be used?', te: 'ఫోటోలు ఎక్కడ ఉపయోగిస్తారు?', options: [['Website', 'వెబ్‌సైట్'], ['Amazon / Flipkart', 'అమెజాన్ / ఫ్లిప్‌కార్ట్'], ['Print', 'ప్రింట్'], ['Social media', 'సోషల్ మీడియా']] },
    P.refs,
  ],
  'real-estate-photography': [
    as(P.address, { en: 'Property address (town / area)', te: 'ఆస్తి చిరునామా (ఊరు / ఏరియా)' }),
    { key: 'size', type: 'text', en: 'Size of the property', te: 'ఆస్తి పరిమాణం', hint: 'e.g. 1500 sq. ft or 2 acres', hintTe: 'ఉదా: 1500 చ. అడుగులు లేదా 2 ఎకరాలు' },
    as(P.shootDate, { en: 'Preferred date', te: 'అనుకూలమైన తేదీ' }), as(P.dayTime, { half: true }),
  ],

  // ── Architecture & interiors ──
  'arch-house-plan': ARCH,
  'arch-3d-elevation': ARCH,
  'arch-renovation': ARCH,
  'arch-commercial': ARCH,
  'interior-full-home': INTERIOR,
  'interior-kitchen': INTERIOR,
  'interior-bedroom': INTERIOR,
  'interior-living': INTERIOR,
  'interior-pooja': INTERIOR,
  'interior-commercial': INTERIOR,
}

/** The detail fields of one service ([] when it has none yet). */
export function fieldsFor(service) {
  return (service && SERVICE_FIELDS[service.id]) || []
}

/** Fields that take an answer (not the little help notes). */
export const inputFields = (fields) => (fields || []).filter((f) => f.type !== 'note')

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTHS_TE = ['జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జులై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్']
/** '2015-03-12' → '12 Mar 2015' (dates are kept as YYYY-MM-DD) */
export function showDate(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : String(iso || '')
}

/** A date as the customer sees it: "12 Mar 2015" / "12 మార్చి 2015" */
export function dateText(iso, lang) {
  if (lang !== 'te') return showDate(iso)
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return m ? `${Number(m[3])} ${MONTHS_TE[Number(m[2]) - 1]} ${m[1]}` : String(iso || '')
}

/** Boxes filled before the customer types: the district of their city, their town. */
export function prefill(fields) {
  const out = {}
  const city = currentCity()
  for (const f of fields || []) {
    if (f.type === 'district' && city?.regionShort) out[f.key] = city.regionShort
    if (f.type === 'village' && f.key === 'village' && currentTown()) out[f.key] = currentTown()
  }
  return out
}

/** How many boxes have something in them */
export function filledCount(fields, values) {
  return inputFields(fields).filter((f) => {
    const v = values?.[f.key]
    return Array.isArray(v) ? v.length > 0 : !!String(v ?? '').trim()
  }).length
}

/** Papers ticked → { have, missing }. Nothing ticked → both empty (we don't know yet). */
export function papersFromTicks(papers, marks) {
  const have = (papers || []).filter((p) => marks?.[p])
  if (!have.length) return { have: [], missing: [] }
  return { have, missing: papers.filter((p) => !marks[p]) }
}

/**
 * What the customer filled, for the team: [{ key, label, value }] in English
 * (choices are saved by their English name; dates as "12 Mar 2015").
 */
export function detailsForTeam(fields, values) {
  const out = []
  for (const f of inputFields(fields)) {
    const v = values?.[f.key]
    if (v == null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length)) continue
    const value = (f.type === 'date' ? showDate(v) : Array.isArray(v) ? v.join(', ') : String(v).trim()).slice(0, 600)
    out.push({ key: f.key, label: f.en, value })
  }
  return out
}

/* ─────────────── Government services: papers first (owner, 6 Nov 2026) ─────────────── */

/**
 * Government services ask for the papers first, then only the details the papers don't show.
 * A paper the customer has ready shows some details already: the Local Buddy reads them from it
 * when collecting it, so they are not asked. Keys: the paper exactly as written in servicesData
 * (English); values: the detail keys (SERVICE_FIELDS) it shows. When unsure, a detail stays asked.
 */
export const PAPER_SHOWS = {
  'birth-certificate': {
    'Hospital discharge slip or Form 2 (home birth)': ['dob', 'gender', 'birthPlace', 'motherName'],
    'For delayed: Original birth certificate, Aadhaar cards of both parents': ['fatherName', 'motherName', 'address'],
  },
  'marriage-certificate': {
    'Age proof (Birth certificate / SSC marks memo)': ['groomDob', 'brideDob'],
    'Identity & Address proofs (Aadhaar, PAN, Passport)': ['groomName', 'brideName', 'address'],
    'Passport-size photographs, wedding invitation, ceremony photos': ['marriageDate', 'marriagePlace'],
    'Witness Aadhaar cards and photographs': ['witnesses'],
  },
  'income-certificate': {
    'Aadhaar card': ['name', 'gender', 'dob', 'address'],
    'Residential proof': ['address'],
    'Income tax return or salary payslip': ['incomeFrom', 'income'],
  },
  'caste-community-certificate': {
    'Aadhaar card': ['name', 'dob', 'address'],
    'Address proof (Electricity / Water bill)': ['address'],
    'School leaving certificate / Transfer Certificate': ['name', 'fatherName', 'dob', 'caste'],
    "Parent's Caste Certificate (if available)": ['caste'],
  },
  'nativity-residence-certificate': {
    'Identity proof (Aadhaar, PAN, Driving Licence, Voter Card, Passport)': ['name', 'dob'],
    'Address proof (land deed, rent agreement, property tax receipts)': ['address'],
    'Birth Certificate or School Certificate': ['name', 'fatherName', 'dob'],
    'Ration Card': ['family'],
  },
  'passport-application': {
    'Identity proof (Aadhaar, Voter ID, PAN, DL)': ['name', 'dob'],
    'Address proof (Utility bill, Aadhaar, Rent Agreement)': ['address'],
    'DOB proof (Birth certificate, 10th marksheet)': ['dob', 'fatherName', 'motherName'],
    'Marriage certificate / previous passport (if applicable)': ['spouse'],
  },
  'family-member-survivorship-certificate': {
    'Death Certificate of the deceased': ['deceased', 'deathDate'],
    'Aadhaar cards of applicant and all family members': ['applicant', 'address'],
    'Address proof (Ration Card / Voter ID)': ['address'],
  },
  'pattadar-passbook': {
    'Aadhaar / Voter ID, Ration card, passport photo': ['name'],
    'Sale Deed copy, old Pattadar Passbook / Title deed': ['surveyNo', 'khataNo', 'extent'],
  },
  'land-possession-certificate': {
    'Proof of ownership (Sale Deed / Lease Agreement)': ['doorNo', 'extent', 'boundaries'],
  },
  'property-tax': {
    'New: Sale Deed, Building Plan approval, Occupancy certificate': ['plotArea', 'builtArea'],
    'Mutation: Sale Deed/Gift Deed/Will, tax receipts, Death certificate (if inheritance)': ['assessmentNo', 'doorNo'],
  },
  'property-registration-sale-deed': {
    'Original Sale Deed / Title Deed + chain of title': ['seller', 'mandal', 'surveyNo', 'plotNo', 'extent'],
  },
  'encumbrance-certificate': {
    'Certified copy of Sale Deed / Title Deed': ['address', 'mandal', 'surveyNo', 'plotNo', 'sro', 'owners'],
    'Property Tax paid receipts (latest)': ['address'],
    'Survey Number details and village/mandal information': ['surveyNo', 'mandal'],
  },
  'death-certificate': {
    'For medico-legal: FIR, Form-2, Post Mortem Report': ['cause'],
  },
}

/**
 * Papers iN Empower prepares (application forms, affidavits, declarations, deeds we draft): the
 * customer doesn't tick these — they show under "We prepare this for you" (the customer signs).
 * Exactly as written in servicesData.
 */
export const WE_PREPARE = new Set([
  "Notarized affidavit stating child's name",
  'Application Form A signed by bride, groom & 3 witnesses',
  'Notarized affidavit on stamp paper',
  'Application form with Rs. 10 non-judicial paper',
  'EWS: Property declaration + notary affidavit',
  'EWS: Property declaration + notarized affidavit',
  'Formal affidavit mentioning place and time of death',
  'Notarized affidavit listing all surviving members',
  'Form 6A application',
  'Form 29 & Form 30 with wet signatures',
  'Form 35 with owner signature + bank seal',
  'Form 26 application',
  'Notarized affidavit declaring loss',
  'Fee calculation based on vehicle age & weight',
  'Memorandum of Association (MOA) signed by 7+ members',
  'Rules & Regulations document',
  'Notarized affidavit from President/Secretary',
  'Partnership Deed signed by all partners',
  'Forms: INC-3 (Nominee), DIR-2 (Director), INC-9 (Declaration)',
  'MoA and AoA',
  'LLP Agreement (filed within 30 days)',
  'Form 9 consent for designated partners',
  'SPICe+ form, MoA, AoA, INC-9, DIR-2',
  'Application Form (Form 22 for AP)',
  'Fee challan (₹200 per year of search period)',
])
export const isWePrepare = (paper) => WE_PREPARE.has(String(paper || '').trim())

/** A service's papers → the ones the customer ticks, and the ones we prepare. */
export function splitPapers(papers) {
  const list = [...new Set(papers || [])]
  return { tick: list.filter((p) => !isWePrepare(p)), prepare: list.filter(isWePrepare) }
}

/** Government services ask for the papers before the details. */
export const papersFirst = (service) => isGovService(service)

export const PAPERS_TEXT = {
  en: {
    prepareH: (n) => (n > 1 ? 'We prepare these for you' : 'We prepare this for you'),
    prepareNote: 'Stamp paper and notary charges, if any, are shown in your quote.',
    allFromPapers: 'No more details needed — your Buddy reads them from your papers.',
  },
  te: {
    prepareH: (n) => (n > 1 ? 'ఇవి మేము మీ కోసం తయారు చేస్తాము' : 'ఇది మేము మీ కోసం తయారు చేస్తాము'),
    prepareNote: 'స్టాంప్ పేపర్, నోటరీ ఛార్జీలు ఉంటే, మీ కొటేషన్‌లో చూపిస్తాము.',
    allFromPapers: 'ఇంకా వివరాలు అవసరం లేదు — మీ బడ్డీ వాటిని మీ పత్రాల నుంచి తీసుకుంటారు.',
  },
}
export const papersText = (lang) => PAPERS_TEXT[lang === 'te' ? 'te' : 'en']

/**
 * The details after the papers: ask = still asked; hidden = shown by a ready paper;
 * from = the ready papers that show them; shownBy = { detailKey: [papers] }.
 * Not a government service, or nothing ticked → everything is asked.
 */
export function detailsAfterPapers(service, fields, have) {
  const list = fields || []
  const map = papersFirst(service) ? PAPER_SHOWS[service?.id] : null
  const ready = new Set((have || []).map((p) => String(p).trim()))
  if (!map || !ready.size) return { ask: list, hidden: [], from: [], shownBy: {} }
  const shownBy = {}
  for (const [paper, keys] of Object.entries(map)) {
    if (ready.has(paper)) for (const k of keys) (shownBy[k] ||= []).push(paper)
  }
  const hidden = list.filter((f) => f.type !== 'note' && shownBy[f.key])
  let ask = list.filter((f) => !hidden.includes(f))
  // A help note with nothing left to help with goes too
  if (!inputFields(ask).length) ask = []
  const from = [...new Set(hidden.flatMap((f) => shownBy[f.key]))]
  return { ask, hidden, from, shownBy }
}

// "Full name (as in Aadhaar)" → "full name"; "Family income per year (₹)" → "family income per year"
const plainLabel = (s) => String(s || '').replace(/\s*\([^)]*\)/g, '').replace(/[*?]/g, '').trim()
const lowerFirst = (s) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s)
const upperFirst = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s)
const joinWords = (xs, lang) => (xs.length < 2 ? xs.join('') : lang === 'te' ? xs.join(', ') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`)

/**
 * One line instead of the questions a ready paper answers (owner: "one line, no boxes"):
 * "Full name, gender and date of birth: your Buddy reads them from your Aadhaar card."
 * tx: the paper's name in the customer's language (svcText).
 */
export function readFromPapersLine({ hidden, from }, lang, tx = (s) => s) {
  if (!hidden?.length) return ''
  const te = lang === 'te'
  const labels = hidden.map((f) => (te ? plainLabel(f.te || f.en) : lowerFirst(plainLabel(f.en))))
  const papers = from.map((p) => plainLabel(tx(p)))
  if (te) return `${joinWords(labels, 'te')} — ${hidden.length > 1 ? 'వీటిని' : 'దీనిని'} మీ బడ్డీ మీ ${joinWords(papers, 'te')} నుంచి తీసుకుంటారు.`
  return `${upperFirst(joinWords(labels, 'en'))}: your Buddy reads ${hidden.length > 1 ? 'them' : 'it'} from your ${joinWords(papers, 'en')}.`
}

/** For the team: which details to read from which ready paper — [{ paper, labels }] in English. */
export function readFromPapersForTeam(after) {
  if (!after?.hidden?.length) return []
  return after.from.map((paper) => ({
    paper,
    labels: after.hidden.filter((f) => after.shownBy[f.key]?.includes(paper)).map((f) => plainLabel(f.en)),
  }))
}
/** "Aadhaar card — Full name, Gender; Residential proof — Full address" */
export const readFromPapersText = (rows) => (rows || []).map((r) => `${r.paper} — ${r.labels.join(', ')}`).join('; ')
