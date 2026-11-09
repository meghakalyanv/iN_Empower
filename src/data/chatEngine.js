/**
 * Chat Buddy engine — shared by the website and the mobile app.
 *
 * EDIT THIS FILE IN website1.4/src/data/ ONLY. `npm run sync-data` in the app
 * copies it to iNEmpowerApp/src/data/ so both always behave the same.
 * It has no web- or phone-specific code: each side passes `navigateTo(route)`
 * and draws the messages itself.
 */
import { useState, useEffect, useRef } from 'react'
import servicesData from './servicesData.js'
import { prakasamLocations } from './prakasamLocations.js'
import { chatLocales } from './chatLocales.js'
import {
  chatText, chatServices, chatSupplies, findItem, itemSteps, supplyPicker, propertyPicker,
  papersStep, buildRequest, newRef, answerText, NOT_SURE, NOT_SURE_VALUE, DONE_VALUE, TOWNS, URGENCY,
  detailSteps, detailsGate, DETAILS_YES, DETAILS_SKIP, SKIP_VALUE, SKIP_REST_VALUE, SKIPPED_KEY, SKIPPED_A, SKIP_YES, SKIP_NO,
} from './chatSteps.js'
import { fieldsFor, papersFirst, detailsAfterPapers, readFromPapersLine } from './serviceFields.js'
import { supplyOrdering as _so } from './suppliesData.js'
import { svcText } from './servicesTe.js'
import { afterHoursNote, isEmergency } from './workHours.js'
import { placeText, chatPlaces, quickTowns, currentCity, townLabel, DEFAULT_CITY_ID, teamPhoneShown, isPageOn, isPathOn, pageForPath } from './cities.js'
import { readPhone } from './phone.js'

/** Towns and areas the chat recognises in typed text: the customer's city (+ Prakasam nicknames). */
function knownPlaces() {
  const c = currentCity()
  const base = chatPlaces(c)
  return c.id === DEFAULT_CITY_ID ? [...base, ...prakasamLocations.filter((p) => !base.some((b) => b.name === p.name))] : base
}
/** A few town buttons for the older question flows, in the customer's city. */
const townQuickReplies = (n = 4) => quickTowns().slice(0, n).map((t) => ({ label: `📍 ${t.name}`, value: t.name }))

/* Small URLSearchParams stand-in (React Native's built-in one cannot get/set). */
export class Params {
  constructor(init) {
    this.map = new Map()
    if (typeof init === 'string') {
      init.replace(/^\?/, '').split('&').filter(Boolean).forEach((pair) => {
        const [k, v = ''] = pair.split('=')
        const dec = (s) => decodeURIComponent(s.replace(/\+/g, ' '))
        this.map.set(dec(k), dec(v))
      })
    } else if (init) {
      Object.entries(init).forEach(([k, v]) => { if (v !== undefined && v !== null) this.map.set(k, String(v)) })
    }
  }
  get(k) { return this.map.has(k) ? this.map.get(k) : null }
  set(k, v) { this.map.set(k, String(v)) }
  toString() {
    const enc = (s) => encodeURIComponent(s).replace(/%20/g, '+')
    return [...this.map].map(([k, v]) => `${enc(k)}=${enc(v)}`).join('&')
  }
}

/* ═══════════════════════════════════════════════════════════════
   KEYWORD → FLOW MAPPING (keywords that trigger guided flows)
   ═══════════════════════════════════════════════════════════════ */
export const FLOW_KEYWORDS = [
  { keywords: ['tuition', 'tutor', 'home tuition', 'coaching', 'home tutor', 'tution', 'tutoring'], flowId: 'home-tuitions' },
  { keywords: ['college', 'admission', 'engineering', 'btech', 'b.tech', 'mba', 'mca', 'university'], flowId: 'college-admissions' },
  { keywords: ['driving licence', 'learner', 'dl renewal', 'driving'], flowId: 'driving-license' },
  { keywords: ['birth certificate', 'birth'], flowId: 'birth-certificate' },
  { keywords: ['property registration', 'sale deed', 'register my property', 'registration of property'], flowId: 'property-registration' },
  { keywords: ['startup', 'company registration', 'register company', 'business registration', 'pvt ltd', 'llp'], flowId: 'startup' },
  { keywords: ['driver', 'chef', 'cook', 'makeup artist', 'beautician', 'makeup', 'professional services', 'flex printing', 'tailor', 'stitching', 'dry cleaning', 'laundry'], flowId: 'professional-services' },
  { keywords: ['interior design', 'interior designer', 'interior decoration', 'modular kitchen', 'home interior', 'office interior', 'space planning', '3d visualization'], flowId: 'interior-design' },
  { keywords: ['architecture', 'architect', 'blueprint', 'building plan', 'structural design', 'house plan', 'floor plan', 'elevation design'], flowId: 'architecture' },
  { keywords: ['granite', 'stone', 'marble', 'tiles', 'ceramic', 'vitrified', 'floor', 'sand', 'construction sand', 'transport', 'truck', 'furniture', 'sofa', 'chair', 'event', 'events', 'tent', 'decoration', 'catering', 'food', 'caterer', 'oil', 'oils', 'cold pressed', 'deep clean', 'house cleaning', 'supply', 'supplies', 'cement', 'bricks', 'brick', 'tmt', 'tmt bars', 'steel', 'rods', 'invitation cards', 'wedding cards', 'upvc', 'pvc', 'roofing sheet', 'roofing sheets', 'pvc marble', 'marble sheet', 'wall panel', 'ceiling panel', 'rubber stamp', 'rubber stamps', 'self inking stamp', 'company seal', 'round seal', 'common seal', 'signature stamp', 'date stamp', 'రబ్బరు స్టాంప్', 'స్టాంప్', 'సీల్'], flowId: 'supplies' },
  { keywords: ['property', 'real estate', 'buy property', 'buy land', 'buy a plot', 'buy plot', 'plot for sale', 'house for sale', 'flat for sale', 'villa', 'sell property', 'sell land', 'sell my land', 'sell my house', 'rent a house', 'house for rent', 'for rent', 'tenant', 'lease', 'agricultural land', 'farm land', 'nri property', 'title check', 'land investment', 'property investment', 'ఆస్తి', 'స్థలం', 'ప్లాట్'], flowId: 'property' },
  { keywords: ['medical', 'advising', 'specialist', 'treatment', 'doctor', 'ambulance', 'transport', 'wheelchair', 'hospitality', 'accommodation', 'bed', 'attendant', 'care', 'health', 'healthcare', 'hospital', 'ortho', 'bone', 'heart', 'cardio', 'physician', 'surgery', 'clinic'], flowId: 'healthcare' },
  { keywords: ['photography', 'photographer', 'photo shoot', 'wedding photography', 'corporate photography', 'advertising photography', 'candid photography', 'photoshoot'], flowId: 'photography' },
  { keywords: ['police', 'crime', 'cyber crime', 'fraud', 'scam', 'fir', 'stolen', 'missing', 'emergency', '100', '112', '1930', 'disha', 'complaint'], flowId: 'police-services' },
  { keywords: ['legal', 'lawyer', 'advocate', 'case', 'court', 'lawsuit', 'litigation', 'legal notice', 'vetting', 'drafting', 'agreement', 'dispute'], flowId: 'court-services' },
  { keywords: ['pujari', 'pooja', 'pandit', 'priest', 'homam', 'vratam', 'wedding priest', 'marriage priest', 'housewarming puja', 'griha pravesh', 'purohit', 'astrology'], flowId: 'pujari' }
]

/* ═══════════════════════════════════════════════════════════════
   PEST CONTROL (owner, 2 Nov 2026) — checked before supplies and the older keyword flows,
   which would read "termite treatment" or "bed bugs" as hospital help and "termites in the
   floor" as tiles. "Mosquito mesh" stays a small fix; "snake bite" is an emergency (108).
   ═══════════════════════════════════════════════════════════════ */
export const PEST_KEYWORDS = [
  { keywords: ['termite', 'termites', 'white ant', 'white ants', 'anti termite', 'anti-termite', 'termite treatment', 'termite control', 'pre construction treatment', 'pre-construction treatment', 'చెదలు', 'చెద పురుగులు', 'చెదపురుగులు'], id: 'pest-termite' },
  { keywords: ['mosquito', 'mosquitoes', 'mosquitos', 'mosquito control', 'fogging', 'mosquito fogging', 'దోమలు', 'దోమల', 'ఫాగింగ్'], id: 'pest-mosquito' },
  { keywords: ['rat', 'rats', 'mice', 'rodent', 'rodents', 'bandicoot', 'bandicoots', 'rat control', 'ఎలుక', 'ఎలుకలు', 'పందికొక్కు', 'పందికొక్కులు'], id: 'pest-rodent' },
  { keywords: ['cockroach', 'cockroaches', 'roach', 'roaches', 'cockroach control', 'బొద్దింక', 'బొద్దింకలు'], id: 'pest-cockroach' },
  { keywords: ['flies', 'house flies', 'housefly', 'houseflies', 'house fly', 'fly control', 'flies control', 'ఈగలు', 'ఈగల'], id: 'pest-flies' },
  { keywords: ['bed bug', 'bed bugs', 'bedbug', 'bedbugs', 'bed bug control', 'నల్లులు', 'నల్లుల'], id: 'pest-bedbug' },
  { keywords: ['spider', 'spiders', 'cobweb', 'cobwebs', 'spider web', 'spider control', 'సాలెపురుగు', 'సాలెపురుగులు', 'సాలీడు', 'సాలీళ్లు'], id: 'pest-spider' },
  { keywords: ['snake', 'snakes', 'cobra', 'snake catcher', 'snake rescue', 'snake control', 'పాము', 'పాములు', 'నాగుపాము'], id: 'pest-snake' },
  { keywords: ['weed', 'weeds', 'weed control', 'weed removal', 'weed spraying', 'parthenium', 'congress grass', 'vayyari bhama', 'కలుపు మొక్కలు', 'కలుపు మందు', 'పిచ్చి మొక్కలు', 'వయ్యారి భామ'], id: 'pest-weed' },
]
export const PEST_GROUP_WORDS = ['pest', 'pests', 'pest control', 'pest service', 'insect', 'insects', 'bugs', 'ants', 'పెస్ట్', 'పెస్ట్ కంట్రోల్', 'పురుగులు', 'క్రిములు']
const NOT_PEST = /\bmosquito (mesh|net|nets|screen|screens|door|doors)\b|\bsnake ?bites?\b|\bbitten\b|\bflies (to|from|back|out|home|abroad)\b|దోమ తెర|పాము కాటు|పాము కరిచ/i
/** "snake bite", "bitten by a snake", "పాము కాటు" — an emergency: 108 first. */
export const isSnakeBite = (text) => /\bsnake ?bites?\b|\bbitten by (a )?snake\b|\bsnake (bit|has bitten)\b|పాము కాటు|పాము కరిచ/i.test(String(text || ''))
/** { service } for a pest word, { category: 'pest-control' } for "pest control" / "insects", or null. */
export function findPest(text) {
  const q = String(text || '').toLowerCase()
  if (NOT_PEST.test(q)) return null
  let best = null, len = 0
  for (const e of PEST_KEYWORDS) for (const kw of e.keywords) if (kwMatch(q, kw) && kw.length > len) { best = e.id; len = kw.length }
  if (best) return { service: best }
  if (PEST_GROUP_WORDS.some((kw) => kwMatch(q, kw))) return { category: 'pest-control' }
  return null
}

/* ═══════════════════════════════════════════════════════════════
   BASIC SERVICE KEYWORD MAP (for services without guided flows)
   ═══════════════════════════════════════════════════════════════ */
export const SERVICE_KEYWORDS = [
  // Pest control (2 Nov 2026) and a snake bite (an emergency, the ambulance)
  ...PEST_KEYWORDS,
  { keywords: ['snake bite', 'snakebite', 'bitten by a snake', 'పాము కాటు'], id: 'ambulance-services' },
  // Logistics, Packers & Movers (Hire a professional, 26 Oct)
  { keywords: ['house shifting', 'home shifting', 'shift house', 'shifting house', 'house moving', 'moving house', 'house relocation', 'home relocation', 'household shifting', 'ఇల్లు మార్చ', 'ఇల్లు షిఫ్ట', 'ఇంటి సామాను'], id: 'house-shifting' },
  { keywords: ['office shifting', 'office relocation', 'office moving', 'shop shifting', 'shop relocation', 'godown shifting', 'ఆఫీస్ మార్చ', 'షాప్ మార్చ', 'దుకాణం మార్చ'], id: 'office-shifting' },
  { keywords: ['bike transport', 'car transport', 'vehicle transport', 'car carrier', 'bike parcel', 'bike shifting', 'car shifting', 'బైక్ రవాణా', 'కారు రవాణా'], id: 'vehicle-transport' },
  { keywords: ['driving classes', 'driving lessons', 'driving school', 'learn driving', 'car driving classes', 'డ్రైవింగ్ క్లాసులు'], id: 'driving-classes' },
  // NRI: care visits, property watch, bills & paperwork (31 Oct 2026)
  { keywords: ['parents care', 'parent care', 'elder care', 'elderly care', 'care visit', 'care visits', 'visit my parents', 'check on my parents', 'look after my parents', 'old parents', 'తల్లిదండ్రుల సంరక్షణ', 'అమ్మానాన్నలను చూడ'], id: 'nri-care-visits' },
  { keywords: ['property watch', 'property management', 'property caretaker', 'house caretaker', 'check my plot', 'check my house', 'watch my house', 'encroachment', 'boundary stones', 'ఆస్తి పర్యవేక్షణ', 'ఆక్రమణ'], id: 'nri-property-watch' },
  { keywords: ['life certificate', 'jeevan pramaan', 'jeevan praman', 'pension certificate', 'electricity bill', 'current bill', 'pay my bills', 'nri bills', 'nri tax', 'లైఫ్ సర్టిఫికేట్', 'జీవన్ ప్రమాణ్', 'కరెంటు బిల్లు'], id: 'nri-bills-paperwork' },
  // Visa, study abroad, tourism (30 Oct 2026)
  { keywords: ['visa', 'visas', 'tourist visa', 'visit visa', 'student visa', 'us visa', 'uk visa', 'visa appointment', 'visa interview', 'వీసా'], id: 'visa-services' },
  { keywords: ['study abroad', 'studies abroad', 'abroad studies', 'abroad education', 'foreign university', 'foreign studies', 'ms in usa', 'masters abroad', 'ielts', 'toefl', 'gre', 'duolingo english', 'study in usa', 'study in uk', 'study in canada', 'విదేశీ చదువు', 'విదేశాల్లో చదువు', 'విదేశీ విద్య'], id: 'study-abroad' },
  { keywords: ['tour', 'tours', 'tour package', 'tourism', 'holiday', 'holidays', 'trip', 'day trip', 'sightseeing', 'honeymoon', 'goa trip', 'dubai trip', 'టూర్', 'విహార యాత్ర', 'యాత్ర', 'టూరిజం'], id: 'tourism-tours' },
  // Painting & waterproofing (30 Oct 2026)
  { keywords: ['house painting', 'home painting', 'wall painting', 'room painting', 'interior painting', 'inside painting', 'repainting', 'full house painting', 'emulsion', 'ఇంటి పెయింటింగ్', 'గోడలకు రంగులు', 'ఇంటికి రంగులు'], id: 'painting-interior' },
  { keywords: ['exterior painting', 'outside painting', 'outer wall painting', 'compound wall painting', 'building painting', 'బయటి పెయింటింగ్', 'ప్రహరీ గోడ పెయింటింగ్'], id: 'painting-exterior' },
  { keywords: ['waterproofing', 'water proofing', 'seepage', 'damp wall', 'damp patch', 'terrace leak', 'roof leak', 'wall crack', 'wall cracks', 'crack filling', 'వాటర్‌ప్రూఫింగ్', 'గోడ తేమ', 'డాబా లీక్', 'గోడ పగుళ్లు'], id: 'painting-waterproofing' },
  { keywords: ['grill painting', 'gate painting', 'door painting', 'window painting', 'wood polish', 'door polish', 'furniture polish', 'railing painting', 'rust paint', 'గ్రిల్ పెయింటింగ్', 'గేటు పెయింటింగ్', 'పాలిష్'], id: 'painting-doors-grills' },
  { keywords: ['texture', 'texture paint', 'texture painting', 'accent wall', 'stencil', 'feature wall', 'wall design', 'టెక్స్చర్', 'గోడ డిజైన్'], id: 'painting-texture' },
  // Electrician & home repairs (30 Oct 2026)
  { keywords: ['geyser', 'geysers', 'water heater', 'hot water', 'solar water heater', 'గీజర్', 'వేడి నీళ్లు', 'వాటర్ హీటర్'], id: 'home-geyser' },
  { keywords: ['plumber', 'plumbing', 'tap leak', 'leaking tap', 'pipe leak', 'blocked toilet', 'toilet block', 'washbasin', 'ప్లంబర్', 'ప్లంబింగ్', 'కుళాయి', 'పైపు లీక్'], id: 'plumbing-services' },
  { keywords: ['water motor', 'motor repair', 'motor rewinding', 'borewell motor', 'submersible motor', 'sump motor', 'tank overflow', 'tank auto switch', 'water level switch', 'నీటి మోటార్', 'బోరు మోటార్', 'మోటార్ రిపేర్', 'ట్యాంక్ పొంగ'], id: 'home-water-motor' },
  { keywords: ['washing machine', 'fridge', 'refrigerator', 'tv repair', 'ro purifier', 'water purifier', 'mixer', 'grinder repair', 'iron box', 'microwave', 'appliance', 'appliances', 'వాషింగ్ మెషిన్', 'ఫ్రిజ్', 'మిక్సీ', 'టీవీ రిపేర్', 'ఉపకరణాలు'], id: 'home-appliance-repair' },
  { keywords: ['handyman', 'carpenter', 'carpentry', 'door lock', 'lock repair', 'hinges', 'curtain rod', 'curtain rods', 'drilling', 'tv mount', 'wall mount', 'mosquito mesh', 'వడ్రంగి', 'కార్పెంటర్', 'తాళం రిపేర్', 'దోమ తెర', 'చిన్న మరమ్మతు'], id: 'home-handyman' },
  { keywords: ['something not working', 'nothing is working', 'power gone', 'no power at home', 'short circuit', 'burning smell', 'sparks from', 'electric shock', 'కరెంట్ పోయింది', 'షార్ట్ సర్క్యూట్', 'కాలిన వాసన'], id: 'home-help-not-sure' },
  { keywords: ['fridge shifting', 'sofa shifting', 'few items', 'single item', 'mini truck', 'tata ace', 'loading helpers', 'hamali'], id: 'item-moving' },
  { keywords: ['death', 'death certificate'], id: 'death-certificate' },
  { keywords: ['marriage', 'marriage certificate'], id: 'marriage-certificate' },
  { keywords: ['income certificate', 'income proof'], id: 'income-certificate' },
  { keywords: ['caste', 'community', 'obc', 'sc', 'st', 'ews', 'caste certificate'], id: 'caste-community-certificate' },
  { keywords: ['nativity', 'residence', 'domicile', 'residence certificate'], id: 'nativity-residence-certificate' },
  { keywords: ['passport', 'passport application'], id: 'passport-application' },
  { keywords: ['family member', 'survivorship', 'heir'], id: 'family-member-survivorship-certificate' },
  { keywords: ['pahani', 'adangal', 'land record'], id: 'pahani-adangal' },
  { keywords: ['pattadar', 'passbook', 'mutation'], id: 'pattadar-passbook' },
  { keywords: ['land possession'], id: 'land-possession-certificate' },
  { keywords: ['ews certificate', 'obc certificate'], id: 'ews-obc-certificates' },
  { keywords: ['income asset', 'asset certificate'], id: 'income-asset-certificate' },
  { keywords: ['vehicle registration', 'rc', 'registration certificate'], id: 'vehicle-registration-rc' },
  { keywords: ['permit', 'fitness'], id: 'permits-fitness' },
  { keywords: ['duplicate rc', 'smart card'], id: 'duplicate-rc-smart-card' },
  { keywords: ['road tax', 'green tax'], id: 'road-tax-green-tax' },
  { keywords: ['property tax'], id: 'property-tax' },
  { keywords: ['trade licence', 'trade'], id: 'trade-license' },
  { keywords: ['building approval', 'building plan', 'construction'], id: 'building-approvals' },
  { keywords: ['utility', 'water connection', 'drainage'], id: 'utility-connections' },
  { keywords: ['vacant land', 'vlt'], id: 'vacant-land-tax-vlt' },
  { keywords: ['spandana', 'prajavani', 'grievance'], id: 'spandana-prajavani-grievances' },
  { keywords: ['ngo', 'society registration'], id: 'society-ngo-registration' },
  { keywords: ['land noc'], id: 'land-nocs' },
  { keywords: ['land acquisition'], id: 'land-acquisition-appeals' },
  { keywords: ['sole proprietorship', 'sole'], id: 'sole-proprietorship' },
  { keywords: ['partnership', 'partner firm'], id: 'partnership-firm' },
  { keywords: ['opc', 'one person company'], id: 'one-person-company-opc' },
  { keywords: ['limited liability'], id: 'limited-liability-partnership-llp' },
  { keywords: ['private limited'], id: 'private-limited-company' },
  { keywords: ['land survey', 'fmb', 'survey'], id: 'land-survey-records-fmb-adangal' },
  { keywords: ['encumbrance', 'ec certificate', 'encumbrance certificate'], id: 'encumbrance-certificate' },
  { keywords: ['patta transfer', 'land mutation'], id: 'land-mutation-patta-transfer' },
  { keywords: ['surprise', 'surprise party', 'birthday party', 'birthday surprise', 'anniversary', 'proposal', 'baby shower', 'seemantham', 'farewell party', 'welcome home', 'సర్‌ప్రైజ్', 'పుట్టినరోజు', 'పెళ్ళి రోజు', 'సీమంతం'], id: 'surprise-party' },
  { keywords: ['voter id', 'voter card', 'epic', 'e-epic', 'voter', 'vote', 'form 6', 'ఓటర్', 'ఓటరు', 'ఓటు'], id: 'voter-id' },
  // NRI & families abroad (logistics)
  { keywords: ['send abroad', 'send to usa', 'send to america', 'send to uk', 'send to dubai', 'courier abroad', 'courier to usa', 'international courier', 'parcel abroad', 'pickles abroad', 'send pickles', 'nri courier', 'విదేశాలకు పంప'], id: 'nri-send-abroad' },
  { keywords: ['receive parcel', 'collect parcel', 'collect my parcel', 'parcel for parents', 'parcel for my parents', 'courier from abroad', 'parcel from abroad', 'parcel from usa', 'పార్సిల్'], id: 'nri-receive-parcels' },
  // Professional Services Exact Matches
  { keywords: ['verified driver', 'driver services'], id: 'verified-driver-services' },
  { keywords: ['professional chef', 'chef services', 'cook services'], id: 'professional-chef-services' },
  { keywords: ['makeup artist', 'beautician services'], id: 'professional-makeup-artist' },
  { keywords: ['flex printing', 'banner printing', 'hoarding'], id: 'flex-printing-services' },
  { keywords: ['tailor services', 'home tailor', 'stitching'], id: 'tailor-services' },
  { keywords: ['dry cleaning', 'laundry', 'ironing', 'wash and fold'], id: 'dry-cleaning-services' },
  // General pages
  { keywords: ['workshop', 'life skills', 'financial literacy'], route: '/youth-hub?tab=workshops' },
  { keywords: ['part time', 'part-time', 'job', 'jobs', 'youth', 'part-time jobs', 'youth hub'], route: '/youth-hub?tab=jobs' },
  { keywords: ['about', 'about us', 'who are you'], route: '/about' },
  { keywords: ['how it works', 'process'], route: '/how-it-works' },
  { keywords: ['contact', 'support'], route: '/contact' },
]


export const CATEGORY_KEYWORDS = [
  { keywords: ['education', 'school'], category: 'education' },
  { keywords: ['identity', 'certificate', 'certificates'], category: 'identity' },
  { keywords: ['mro', 'land'], category: 'mro' },
  { keywords: ['rto', 'vehicle'], category: 'rto' },
  { keywords: ['municipal'], category: 'municipal' },
  { keywords: ['collector', 'grievance'], category: 'collector' },
  { keywords: ['court', 'legal'], category: 'court' },
  { keywords: ['health', 'healthcare', 'hospital', 'medical'], category: 'healthcare' },
  { keywords: ['photography', 'photo', 'camera', 'photographer'], category: 'photography' },
  { keywords: ['loan', 'loans', 'bank loan', 'home loan', 'mudra', 'kcc', 'kisan credit', 'education loan', 'gold loan', 'mortgage', 'లోన్', 'రుణం'], category: 'loans' },
  { keywords: ['export', 'import', 'exim', 'iec', 'import export code', 'shipping', 'container', 'customs', 'rcmc', 'ఎగుమతి', 'దిగుమతి'], category: 'exim' },
  { keywords: ['nri', 'abroad', 'overseas', 'family abroad', 'parents in india', 'ఎన్ఆర్ఐ', 'విదేశం', 'విదేశాల్లో'], category: 'nri' },
  { keywords: ['painting', 'painter', 'painters', 'paint', 'paints', 'colours for the house', 'పెయింటింగ్', 'పెయింటర్', 'రంగులు వేయడం', 'రంగులు'], category: 'painting' },
  { keywords: ['electrician', 'electricity', 'electrical', 'wiring', 'house wiring', 'switch board', 'home repair', 'home repairs', 'house repair', 'repair at home', 'ఎలక్ట్రీషియన్', 'కరెంట్ పని', 'ఇంటి మరమ్మతు', 'ఇంటి రిపేర్'], category: 'electricity' },
  { keywords: ['ac repair', 'ac service', 'ac servicing', 'air conditioner', 'ac mechanic', 'ac gas', 'ac installation', 'ఏసీ', 'ac సర్వీస్'], category: 'ac-services' },
  { keywords: PEST_GROUP_WORDS, category: 'pest-control' },
  { keywords: ['logistics', 'packers', 'movers', 'packers and movers', 'packers & movers', 'shifting', 'relocation', 'ప్యాకర్స్', 'మూవర్స్', 'షిఫ్టింగ్'], category: 'logistics' },
]

export function detectIntent(query, name, language) {
  const responses = chatLocales[language || 'en'].intents
  const q = query.toLowerCase().trim().replace(/[!.,?]+/g, '')
  const patterns = {
    NEGATIVE: ['no', 'nope', 'never', 'cancel', 'stop', 'nothing', 'na', 'no thanks', 'no thank you', 'dont want', 'do not want', 'not needed', 'none', 'n', 'వద్దు', 'కాదు', 'లేదు'],
    GREETING: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening', 'hiya', 'howdy', 'heya', 'నమస్తే', 'హలో'],
    GRATITUDE: ['thanks', 'thank you', 'tq', 'thank u', 'thx', 'thanks a lot', 'thankyou', 'dhanyavadalu', 'ధన్యవాదాలు', 'కృతజ్ఞతలు'],
    FAREWELL: ['bye', 'goodbye', 'see ya', 'see you', 'catch you later', 'take care', 'cya', 'వెళ్లొస్తా', 'బై'],
    AFFIRMATIVE: ['yes', 'yeah', 'yep', 'yup', 'sure', 'ok', 'okay', 'alright', 'fine', 'do it', 'go ahead', 'ha', 'avunu', 'అవును', 'సరే'],
    CONFUSED: ['help', 'what', 'how', 'confused', 'dont know', 'not sure', 'what to do', 'options', 'list', 'menu', 'సహాయం', 'ఏమిటి', 'ఎలా']
  }
  for (const [key, patts] of Object.entries(patterns)) {
    for (const p of patts) {
      const match = p.length <= 3 ? (q === p || q.split(/\s+/).includes(p)) : (q === p || q.includes(p))
      if (match) {
        const rArr = responses[key]
        if (!rArr) continue
        const r = rArr[Math.floor(Math.random() * rArr.length)]
        return { intent: key, response: r.replace(/\{name\}/g, name || 'friend') }
      }
    }
  }
  return null
}

/**
 * Small talk ("hi", "thanks", "help", "ok") — but only when the message asks for nothing we
 * offer or answer: "Hello, I need a caste certificate" or "help me get a birth certificate" go
 * straight to the request, and "what is iN Empower?" gets its answer, instead of a greeting or
 * the "how can I help" reply.
 */
export function smallTalkIntent(query, name, language) {
  const asksForSomething = !!findGuidedFlow(query, language) || ['service', 'category', 'route'].includes(findBasicMatch(query)?.type) ||
    !!advisoryMatch(query, language) // "what is iN Empower?" has its own answer
  return asksForSomething ? null : detectIntent(query, name, language)
}

/* "propertyType" → "Property type" for summaries and messages */
export function answerLabel(key) {
  const words = String(key).replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/* ─── Word-boundary keyword match ─── */
export function kwMatch(query, keyword) {
  // Phrases, and Telugu words (\b does not work outside a–z), match as plain text
  if (keyword.includes(' ') || /[^\x00-\x7F]/.test(keyword)) return query.includes(keyword)
  return new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(query)
}

/* ─── Find a guided flow for the query ─── */
export function findGuidedFlow(query, language) {
  const q = query.toLowerCase().trim()
  let best = null, bestLen = 0
  for (const entry of FLOW_KEYWORDS) {
    for (const kw of entry.keywords) {
      if (kwMatch(q, kw) && kw.length > bestLen) {
        best = entry.flowId
        bestLen = kw.length
      }
    }
  }
  if (best) {
    const flow = JSON.parse(JSON.stringify(chatLocales[language || 'en'].guidedFlows[best]));
    const initialAnswers = {};
    if (flow.questions && flow.questions.length > 0) {
      const q1 = flow.questions[0];
      if (q1.options) {
        for (const opt of q1.options) {
          const optValue = typeof opt === 'string' ? opt : (opt.value || opt.label);
          if (optValue && q.includes(optValue.toLowerCase())) {
            initialAnswers[q1.key] = typeof opt === 'string' ? opt : opt.value;
            break;
          }
        }
      }
    }
    flow.initialAnswers = initialAnswers;
    return flow;
  }
  return null;
}

/* ─── Find a basic service match (no guided flow) ─── */
export function findBasicMatch(query) {
  const q = query.toLowerCase().trim()
  if (q.length < 3) return null
  let best = null, bestLen = 0
  for (const entry of SERVICE_KEYWORDS) {
    for (const kw of entry.keywords) {
      if (kwMatch(q, kw) && kw.length > bestLen) { best = entry; bestLen = kw.length }
    }
  }
  if (best) {
    if (best.route) return { type: 'route', route: best.route, label: best.route.replace(/^\//, '').replace(/-/g, ' ') }
    const svc = servicesData.find(s => s.id === best.id)
    if (svc) return { type: 'service', service: svc }
  }
  // category
  let bestCat = null, bestCatLen = 0
  for (const entry of CATEGORY_KEYWORDS) {
    for (const kw of entry.keywords) {
      if (kwMatch(q, kw) && kw.length > bestCatLen) { bestCat = entry.category; bestCatLen = kw.length }
    }
  }
  if (bestCat) return { type: 'category', category: bestCat, services: servicesData.filter(s => s.category === bestCat) }
  // fuzzy
  const stopWords = ['services', 'service', 'online', 'booking', 'the', 'and', 'for', 'a', 'an']
  const queryWords = q.split(' ').filter(w => w.length > 3 && !stopWords.includes(w))
  
  // Match whole words only, so "cement" does not match "replacement"
  const wordsOf = (t) => (t || '').toLowerCase().split(/[^a-z0-9\u0C00-\u0C7F]+/).filter(Boolean)
  const fuzzy = servicesData.filter(s => {
    if (queryWords.length === 0) return false;
    const words = [...wordsOf(s.title), ...wordsOf(s.subtitle)]
    return queryWords.some(w => words.some(x => x === w || (w.length >= 4 && x.startsWith(w))));
  })
  if (fuzzy.length > 0) return { type: 'fuzzyList', services: fuzzy.slice(0, 5) }
  return null
}

/* ─── Advisory Match — proactive business guidance ─── */
export function advisoryMatch(query, language) {
  const q = query.toLowerCase().trim()
  if (q.length < 3) return null
  const advisoryData = chatLocales[language || 'en'].advisoryResponses
  if (!advisoryData) return null
  let bestEntry = null, bestLen = 0
  for (const [key, entry] of Object.entries(advisoryData)) {
    for (const kw of entry.keywords) {
      if (kwMatch(q, kw) && kw.length > bestLen) {
        bestEntry = entry
        bestLen = kw.length
      }
    }
  }
  return bestEntry
}

/* ═══════════════════════════════════════════════════════════════
   SMART OPTION MATCHING — Indian-English aliases & synonyms
   Maps colloquial/short terms → formal option values
   ═══════════════════════════════════════════════════════════════ */
export const OPTION_ALIASES = {
  // ── Subjects ──
  'maths':        'Mathematics',
  'math':         'Mathematics',
  'mathematics':  'Mathematics',
  'ganit':        'Mathematics',
  'science':      'Science',
  'vigyan':       'Science',
  'english':      'English',
  'angrezi':      'English',
  'hindi':        'Hindi',
  'regional':     'Hindi',
  'physics':      'Physics',
  'phy':          'Physics',
  'physical science': 'Physical Science',
  'ps':           'Physical Science',
  'chemistry':    'Chemistry',
  'chem':         'Chemistry',
  'rasayan':      'Chemistry',
  'biology':      'Biology',
  'bio':          'Biology',
  'biological':   'Biology',
  'zoology':      'Botany',
  'zoo':          'Botany',
  'botany':       'Botany',
  'social':       'Social Studies',
  'social studies': 'Social Studies',
  'ss':           'Social Studies',
  'history':      'Social Studies',
  'civics':       'Civics',
  'economics':    'Economics',
  'eco':          'Economics',
  'accounts':     'Accounts',
  'accounting':   'Accounts',
  'commerce':     'Accounts',
  'cec':          'Accounts',
  'mec':          'Economics',
  'computer':     'Computer Science',
  'computers':    'Computer Science',
  'cs':           'Computer Science',
  'cse':          'Computer Science',
  'programming':  'Computer Science',
  'coding':       'Computer Science',
  'java':         'Computer Science',
  'python':       'Computer Science',
  'c++':          'Computer Science',
  'stats':        'Business Statistics',
  'statistics':   'Business Statistics',
  'financial':    'Financial Accounting',
  'fa':           'Financial Accounting',

  // ── Education levels ──
  'primary':      'Primary',
  '1st':          'Primary',
  '2nd':          'Primary',
  '3rd':          'Primary',
  '4th':          'Primary',
  '5th':          'Primary',
  'secondary':    'Secondary',
  '6th':          'Secondary',
  '7th':          'Secondary',
  '8th':          'Secondary',
  '9th':          'Secondary',
  '10th':         'Secondary',
  'ssc':          'Secondary',
  'high school':  'Secondary',
  'intermediate': 'Intermediate',
  'inter':        'Intermediate',
  '11th':         'Intermediate',
  '12th':         'Intermediate',
  'jr college':   'Intermediate',
  'junior college': 'Intermediate',
  'mpc':          'Intermediate',
  'bipc':         'Intermediate',
  'graduation':   'Graduation',
  'degree':       'Graduation',
  'btech':        'Graduation',
  'b.tech':       'Graduation',
  'engineering':  'Graduation',
  'ug':           'Graduation',

  // ── Timings ──
  'morning':      'Morning',
  'subah':        'Morning',
  'afternoon':    'Afternoon',
  'dopahar':      'Afternoon',
  'evening':      'Evening',
  'sham':         'Evening',
  'shaam':        'Evening',
  'night':        'Night',
  'raat':         'Night',

  // ── Frequency ──
  'daily':        'Daily',
  'everyday':     'Daily',
  'roz':          'Daily',
  'twice':        '2 days',
  'thrice':       '3 days',

  // ── Vehicle types ──
  'bike':         'Two Wheeler',
  'scooter':      'Two Wheeler',
  'scooty':       'Two Wheeler',
  'two wheeler':  'Two Wheeler',
  '2 wheeler':    'Two Wheeler',
  '2w':           'Two Wheeler',
  'car':          'Four Wheeler',
  'four wheeler': 'Four Wheeler',
  '4 wheeler':    'Four Wheeler',
  '4w':           'Four Wheeler',
  'auto':         'Light Motor',
  'truck':        'Heavy',
  'bus':          'Heavy',
  'lorry':        'Heavy',
  'heavy':        'Heavy',
  'both':         'Two Wheeler + Four Wheeler',

  // ── DL types ──
  'new':          'New',
  'renewal':      'Renewal',
  'renew':        'Renewal',
  'address':      'Address Change',
  'duplicate':    'Duplicate',
  'lost':         'Duplicate',

  // ── Professional services ──
  'driver':       'Driver',
  'drivers':      'Driver',
  'chauffeur':    'Driver',
  'chef':         'Chef/Cook',
  'cook':         'Chef/Cook',
  'cooking':      'Chef/Cook',
  'makeup':       'Makeup',
  'mua':          'Makeup',
  'beautician':   'Makeup',
  'electrician':  'Electrician',
  'electricity':  'Electrician',
  'electrical':   'Electrician',
  'wiring':       'Electrician',
  'ac':           'AC Technician',
  'air conditioner': 'AC Technician',
  'ac repair':    'AC Technician',
  'ac service':   'AC Technician',

  // ── Startup ──
  'sole':         'Sole Proprietorship',
  'proprietorship': 'Sole Proprietorship',
  'partnership':  'Partnership',
  'partner':      'Partnership',
  'opc':          'One Person Company',
  'llp':          'LLP',
  'pvt':          'Private Limited',
  'pvt ltd':      'Private Limited',
  'private':      'Private Limited',
  'not sure':     'Need Guidance',
  'dont know':    'Need Guidance',
  "don't know":   'Need Guidance',
  'guide':        'Need Guidance',

  // ── Property ──
  'sale':         'Sale Deed',
  'sale deed':    'Sale Deed',
  'transfer':     'Transfer',
  'gift':         'Gift Deed',
  'purchase':     'Purchase',
  'agricultural': 'Agricultural',
  'agri':         'Agricultural',
  'farm':         'Agricultural',
  'residential':  'Residential',
  'house':        'Residential',
  'plot':         'Residential',
  'flat':         'Residential',
  'apartment':    'Residential',
  'commercial':   'Commercial',
  'shop':         'Commercial',
  'office':       'Commercial',

  // ── Property (buy / sell / rent) ──
  'agricultural land':  'Agricultural land',
  'agri land':          'Agricultural land',
  'farm land':          'Agricultural land',
  'buy':                'Buy',
  'sell':               'Sell',
  'rent':               'Rent',
  'lease':              'Lease',
  'nri':                'Abroad',
  '1':                  '1',
  '2':                  '2',
  '3':                  '3',
  '5':                  '5',
  '10':                 '10',

  // ── Birth certificate ──
  'delayed':      'Delayed',
  'name change':  'Name Inclusion',
  'name correction': 'Name Inclusion',
  'correction':   'Name Inclusion',

  // ── Duration ──
  'one time':     'One-time',
  'once':         'One-time',
  'event':        'One-time',
  'wedding':      'One-time',
  'ongoing':      'Daily',
  'regular':      'Daily',
  'weekly':       'Weekly',
  'monthly':      'Monthly',
}

export function smartMatchOption(typed, options) {
  const input = typed.toLowerCase().trim()

  // 1. Direct substring match (existing logic)
  const direct = options.find(o =>
    o.label.toLowerCase().includes(input) ||
    o.value.toLowerCase().includes(input) ||
    input.includes(o.label.toLowerCase().replace(/[^\w\s]/g, '').trim())
  )
  if (direct) return direct

  // 2. Alias match — check if the typed input maps to any alias
  const aliasValue = OPTION_ALIASES[input]
  if (aliasValue) {
    const aliasMatch = options.find(o =>
      o.value.toLowerCase().includes(aliasValue.toLowerCase()) ||
      o.label.toLowerCase().includes(aliasValue.toLowerCase())
    )
    if (aliasMatch) return aliasMatch
  }

  // 3. Try each word of the input against aliases
  const words = input.split(/\s+/)
  for (const word of words) {
    const wAlias = OPTION_ALIASES[word]
    if (wAlias) {
      const wMatch = options.find(o =>
        o.value.toLowerCase().includes(wAlias.toLowerCase()) ||
        o.label.toLowerCase().includes(wAlias.toLowerCase())
      )
      if (wMatch) return wMatch
    }
  }

  // 4. Fuzzy — check if any word of input starts with the same letters as option label
  for (const word of words) {
    if (word.length >= 3) {
      const fuzzy = options.find(o => {
        const labelWords = o.label.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
        return labelWords.some(lw => lw.startsWith(word) || word.startsWith(lw))
      })
      if (fuzzy) return fuzzy
    }
  }

  // 5. Number matching — "1", "2" etc. to match option index
  const num = parseInt(input)
  if (!isNaN(num) && num >= 1 && num <= options.length) {
    return options[num - 1]
  }

  return null
}

/* ═══════════════════════════════════════════════════════════════
   UNIFIED CATEGORY QUICK REPLIES (single source of truth)
   ═══════════════════════════════════════════════════════════════ */
// Category buttons → the service group they open ('page:…' = a whole page, e.g. Property)
const CATEGORY_BUTTONS = [
  ['education', '🎓 Education', '🎓 విద్య', 'Education'],
  ['identity', '📋 Identity & Records', '📋 గుర్తింపు & రికార్డులు', 'Identity & Records'],
  ['mro', '🏢 MRO', '🏢 MRO', 'MRO'],
  ['rto', '🚗 RTO', '🚗 RTO', 'RTO'],
  ['municipal', '🏛️ Municipal', '🏛️ మున్సిపల్ సేవలు', 'Municipal'],
  ['collector', '🏢 Collector Office', '🏢 కలెక్టర్ కార్యాలయం', 'Collector Office'],
  ['startup', '🚀 Startup', '🚀 స్టార్టప్', 'Startup'],
  ['page:property', '🏠 Property', '🏠 ఆస్తి', 'Property'],
  ['court', '⚖️ Court', '⚖️ కోర్టు సేవలు', 'Court'],
  ['drivers', '👨‍🍳 Professional services', '👨‍🍳 వృత్తిపరమైన సేవలు', 'Professional services'],
  ['photography', '📸 Photography', '📸 ఫోటోగ్రఫీ', 'Photography'],
  ['painting', '🎨 Painting & waterproofing', '🎨 పెయింటింగ్ & వాటర్‌ప్రూఫింగ్', 'Painting & waterproofing'],
  ['interior', '🪴 Interior Design', '🪴 ఇంటీరియర్ డిజైన్', 'Interior Design'],
  ['architecture', '🏛️ Architecture', '🏛️ ఆర్కిటెక్చర్', 'Architecture'],
  ['pujari', '🙏 Pujari', '🙏 పూజారి సేవలు', 'Pujari'],
  ['logistics', '🚚 Packers & Movers', '🚚 ప్యాకర్స్ & మూవర్స్', 'Packers & Movers'],
  ['pest-control', '🐜 Pest control', '🐜 పెస్ట్ కంట్రోల్', 'Pest control'],
  ['nri', '✈️ NRI & families abroad', '✈️ NRI & విదేశాల్లోని కుటుంబాలు', 'NRI'],
]

/** Is this group (or page) offered in the customer's city? (Admin → Cities) */
const groupOffered = (key) => (key.startsWith('page:') ? isPageOn(key.slice(5)) : chatServices.some((s) => s.category === key))

export function getCategoryQuickReplies(language) {
  const isTe = language === 'te'
  return [
    ...CATEGORY_BUTTONS.filter(([key]) => groupOffered(key)).map(([, en, te, value]) => ({ label: isTe ? te : en, value })),
    { label: isTe ? '❓ ఇతర' : '❓ Other', value: 'Other' },
  ]
}

/* ═══════════════════════════════════════════════════════════════
   STEP-BY-STEP REQUESTS (data from chatSteps.js)
   ═══════════════════════════════════════════════════════════════ */
/** A typed supply name → that supply (longest title that appears as whole words). */
// Other words people use for a supply (owner, 2 Nov 2026). "stamp duty" / "stamp paper" stay with property registration.
const SUPPLY_WORDS = {
  'rubber-stamps': ['stamp', 'stamps', 'seal', 'seals', 'company seal', 'round seal', 'common seal', 'self inking', 'self inking stamp', 'స్టాంప్', 'స్టాంపు', 'సీల్'],
}

export function findSupplyByText(text) {
  const q = ` ${String(text).toLowerCase().replace(/[^a-z0-9\u0C00-\u0C7F]+/g, ' ').trim()} `
  if (/ stamp (duty|paper)/.test(q)) return null
  let best = null
  for (const s of chatSupplies) {
    const names = [s.title, s.id.replace(/-/g, ' '), _so[s.id]?.te, ...(SUPPLY_WORDS[s.id] || [])].filter(Boolean).map((n) => n.toLowerCase())
    for (const n of names) {
      const singular = n.replace(/s$/, '')
      for (const cand of [n, singular]) {
        if (cand.length >= 3 && q.includes(` ${cand} `) && (!best || cand.length > best.len)) best = { supply: s, len: cand.length }
      }
    }
  }
  return best?.supply || null
}

/**
 * NRIs and families abroad: "send pickles to my son in the USA", "collect a parcel for my
 * parents" → the right NRI request (checked before the older keyword flows, which would
 * read "food" as a local supply). We do not move whole households abroad (owner, 26 Oct):
 * "moving to Dubai, send my things" is offered as Send Items Abroad.
 */
const ABROAD = /\b(abroad|overseas|international|nri|usa|america|uk|london|canada|australia|new zealand|dubai|uae|gulf|saudi|qatar|kuwait|oman|bahrain|singapore|malaysia|germany|europe)\b|విదేశ/i
const MOVING = /\b(move|moving|shift|shifting|relocat\w*|household)\b|సామాను|తరలి/i
const RECEIVE = /\b(receive|collect|arrived|coming from|from abroad|from usa|from the usa|from uk|from dubai)\b|అందుకో/i
const SENDING = /\b(send|sending|courier|parcel|ship|shipping|post|cargo|pickles?|sweets|logistics)\b|పంప|పార్సిల్/i
export function findNriService(text) {
  const q = String(text || '')
  if (!ABROAD.test(q)) return null
  if (RECEIVE.test(q)) return 'nri-receive-parcels'
  if (MOVING.test(q)) return 'nri-send-abroad'
  if (SENDING.test(q)) return 'nri-send-abroad'
  return null
}

/**
 * Packers & Movers: "shifting our house to Hyderabad", "bike transport to Chennai",
 * "need a mini truck for a fridge" → the right moving request (checked before the older
 * keyword flows, which would read "sofa" or "truck" as buying a supply). Papers about a move
 * ("address change on my ration card", "RC transfer", "move my home loan") are left to the
 * normal search, and so is AC shifting (an AC service).
 */
const MOVE_WORD = /\b(shift|shifts|shifting|shifted|move|moving|relocat\w*|packers?|movers?|transport\w*|carrier)\b|షిఫ్ట|మార్చాలి|మారుతున్న|మారాలి|తరలి|రవాణా|పంపాలి/i
const HOME_WORD = /\b(house|home|flat|room|bhk|household|luggage|belongings)\b|ఇల్లు|ఇంటి|సామాను/i
const OFFICE_WORD = /\b(office|shop|showroom|clinic|hospital|school|college|godown|warehouse)\b|ఆఫీస్|షాప్|దుకాణ|గోడౌన్/i
const VEHICLE_WORD = /\b(bike|bikes|scooter|scooty|motorcycle|motorbike|car|cars|vehicle|tractor)\b|బైక్|స్కూటర్|కారు|వాహన/i
const ITEM_WORD = /\b(fridge|refrigerator|sofa|cot|bed|almirah|bureau|beeruva|washing machine|tv|furniture|few items|single item|mini truck|tata ace|helpers)\b|ఫ్రిజ్|సోఫా|మంచం|బీరువా|ఫర్నిచర్/i
// Papers about a move, people transport, and goods loads are not a household move
const NOT_A_MOVE = /\b(certificate|card|aadhaar|ration|voter|licen[cs]e|rc transfer|ownership|registration|passport|address change|noc|loan|connection|tax|meter|permit|fitness|challan|bus|van|auto|cab|taxi|ambulance|patient)\b|సర్టిఫికెట్|కార్డు|రిజిస్ట్రేషన్|లోన్/i
const GOODS_LOAD = /\b(goods|material|materials|cargo|load|loads|lorry|sand|cement|granite|bricks|steel|produce|grain|tobacco|chilli|chillies|cotton)\b|సరుకు|లారీ|ఇసుక/i
export function findMovingService(text) {
  const q = String(text || '')
  if (!MOVE_WORD.test(q) || NOT_A_MOVE.test(q)) return null
  const home = HOME_WORD.test(q)
  const office = OFFICE_WORD.test(q)
  if (!home && !office && /\b(ac|air ?condition\w*)\b|ఏసీ/i.test(q)) return null // AC shifting is an AC service
  if (!home && GOODS_LOAD.test(q)) return null // a lorry for goods: Goods Transport (Supplies)
  if (VEHICLE_WORD.test(q) && !home && !office) return 'vehicle-transport'
  if (office) return 'office-shifting'
  if (ITEM_WORD.test(q) && !/\b(house|home|flat|bhk|household)\b|ఇల్లు/i.test(q)) return 'item-moving'
  if (home || /\b(shift\w*|moving|relocat\w*)\s+(from|to)\b/i.test(q) || /\bpackers?\b.*\b\d\s?bhk\b/i.test(q)) return 'house-shifting'
  return null
}

/**
 * One vague word that can mean different services ("driving" = classes, licence or a driver).
 * Only when the customer typed just that word (and filler like "I need", "help", "service");
 * "driving classes" or "licence renewal" go straight to their service as before.
 * Returns { word, ids } or null. Keep this list up to date when services are added.
 */
export const AMBIGUOUS = [
  { words: ['driving', 'drive', 'డ్రైవింగ్'], ids: ['driving-classes', 'learners-driving-license', 'verified-driver-services'] },
  { words: ['licence', 'license', 'licenses', 'licences', 'లైసెన్స్'], ids: ['learners-driving-license', 'trade-license', 'exim-iec'] }, // arms licence paused (legal report, 2 Nov 2026)
  { words: ['tax', 'taxes', 'పన్ను'], ids: ['property-tax', 'road-tax-green-tax', 'vacant-land-tax-vlt'] },
  { words: ['registration', 'register', 'రిజిస్ట్రేషన్'], ids: ['property-registration-sale-deed', 'vehicle-registration-rc', 'society-ngo-registration', 'sole-proprietorship'] },
  { words: ['cleaning', 'clean', 'శుభ్రత', 'క్లీనింగ్'], ids: ['cleaning', 'dry-cleaning-services', 'ac-jet-cleaning'] },
  { words: ['transport', 'రవాణా'], ids: ['goods-transport', 'vehicle-transport', 'patient-logistics'] },
  { words: ['loan', 'loans', 'లోన్', 'రుణం'], category: 'loans' },
  // "repair" alone: which repair? (home appliances, plumbing, small fixes, renovation, not sure — "AC repair" has its own words);
  // "leak": a pipe, a geyser or AC gas
  { words: ['repair', 'repairs', 'రిపేర్', 'మరమ్మతు', 'మరమ్మతులు'], ids: ['home-appliance-repair', 'plumbing-services', 'home-handyman', 'arch-renovation', 'home-help-not-sure'] },
  { words: ['leak', 'leaking', 'leakage', 'లీక్', 'లీకేజీ'], ids: ['plumbing-services', 'painting-waterproofing', 'home-geyser', 'ac-gas-leak-refilling'] },
]
const FILLER = new Set(['i', 'want', 'need', 'needed', 'a', 'an', 'the', 'for', 'help', 'with', 'about', 'service', 'services', 'please', 'me', 'my', 'some', 'get', 'looking', 'to', 'do', 'nenu', 'naaku', 'kavali', 'నాకు', 'కావాలి', 'సహాయం', 'సేవ', 'సేవలు', 'కోసం'])
export function findAmbiguous(text) {
  const words = String(text || '').toLowerCase().replace(/[!?.,;:'"()]+/g, ' ').split(/\s+/).filter((w) => w && !FILLER.has(w))
  if (words.length !== 1) return null
  const hit = AMBIGUOUS.find((a) => a.words.includes(words[0]))
  return hit ? { word: words[0], ...hit } : null
}

/**
 * The customer typed (or pasted) a service's own name, e.g. "Property Tax", "Vehicle Loan":
 * that service, before any keyword guess. The longest matching name wins.
 */
const normTitle = (t) => String(t || '').toLowerCase().replace(/&/g, ' and ').replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9\u0C00-\u0C7F]+/g, ' ').trim()
export function findExactService(text) {
  const q = ` ${normTitle(text)} `
  if (q.trim().length < 6) return null
  let best = null, bestLen = 0
  for (const s of servicesData) {
    if (s.targetCategory || s.customLink) continue
    // English name, and the Telugu name the customer sees in the app
    for (const name of [s.title, svcText('te', s.title)]) {
      const t = normTitle(name)
      const long = /[\u0C00-\u0C7F]/.test(t) || t.split(' ').length >= 2
      if (t.length >= 6 && long && q.includes(` ${t} `) && t.length > bestLen) { best = s; bestLen = t.length }
    }
  }
  return best ? best.id : null
}

/**
 * Telugu words from the services' Telugu names ("పహాణీ", "జనన", "పాస్‌బుక్కు"): the services with
 * the most matching words (one = open it; a few = ask which). Tried when nothing else matched.
 */
export function findTeluguWord(text) {
  const words = normTitle(text).split(' ').filter((w) => /[\u0C00-\u0C7F]/.test(w) && w.length >= 3 && !FILLER.has(w))
  if (!words.length) return []
  const scored = []
  for (const s of servicesData) {
    if (s.targetCategory || s.customLink || s.category === 'supplies') continue
    const te = normTitle(svcText('te', s.title)).split(' ').filter((w) => w.length >= 3 && /[\u0C00-\u0C7F]/.test(w))
    const n = words.filter((w) => te.some((t) => w === t || (t.length >= 4 && w.startsWith(t)) || (w.length >= 4 && t.startsWith(w)))).length
    if (n) scored.push({ id: s.id, n })
  }
  const best = Math.max(0, ...scored.map((x) => x.n))
  return scored.filter((x) => x.n === best).map((x) => x.id)
}

/** "learn car driving", "driving classes", "driving school" → Car Driving Classes (not the licence) */
export function findDrivingClasses(text) {
  const q = String(text || '')
  return /\b(learn\w*|classes?|lessons?|school|trainer|training|coaching|teach\w*)\b|నేర్చు|క్లాస్/i.test(q) && /\bdriv\w*|డ్రైవింగ్/i.test(q) && !/\b(licen[cs]e|llr|dl|renew\w*)\b|లైసెన్స్/i.test(q)
}

/** A service as a chat button value: its group, its supply ("/supplies?item=transport"), its page, or its steps. */
const SUPPLY_LINK = /^\/supplies\?item=([\w-]+)$/
export function itemValue(s) {
  if (s.targetCategory) return `__cat:${s.targetCategory}`
  const supply = s.customLink && String(s.customLink).match(SUPPLY_LINK)
  if (supply) return `__supply:${supply[1]}`
  if (s.customLink) return `__link:${s.customLink}`
  return `__svc:${s.id}`
}

/* Old hand-written chat flows → the step-by-step request they should open now. */
export const FLOW_TARGETS = {
  supplies: { picker: 'supply' },
  property: { picker: 'property' },
  'birth-certificate': { service: 'birth-certificate' },
  'driving-license': { service: 'learners-driving-license' },
  'property-registration': { service: 'property-registration-sale-deed' },
  startup: { category: 'startup' },
  'professional-services': { category: 'drivers' },
  healthcare: { category: 'healthcare' },
  pujari: { category: 'pujari' },
  photography: { category: 'photography' },
  'interior-design': { category: 'interior' },
  painting: { category: 'painting' },
  architecture: { category: 'architecture' },
  'court-services': { category: 'court' },
}

/* ═══════════════════════════════════════════════════════════════
   CHAT BUDDY COMPONENT
   ═══════════════════════════════════════════════════════════════ */
// When "Not sure" skips the other questions, these are still asked (owner, 2 Nov 2026)
const KEPT_WHEN_SKIPPING = ['area', 'urgency']
export const STEPS = { ASK_LANGUAGE: 0, GREETING: 1, ASK_NAME: 2, ASK_MOBILE: 3, ASK_PURPOSE: 4, GUIDED_FLOW: 5, RESULT: 6, CHECK_DOCS: 7, WIZARD: 8 }

export function useChatBuddyEngine({ navigateTo, submitRequest, initialLanguage = null, initialName = '', initialMobile = '' } = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(STEPS.ASK_LANGUAGE)
  const [language, setLanguage] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userData, setUserData] = useState({ name: initialName || '', mobile: initialMobile || '', purpose: '' })
  const [pulse, setPulse] = useState(true)
  useEffect(() => { const t = setTimeout(() => setPulse(false), 8000); return () => clearTimeout(t) }, [])

  // Guided flow state
  const [activeFlow, setActiveFlow] = useState(null)       // the flow definition
  const [flowStep, setFlowStep] = useState(0)              // current question index
  const [flowAnswers, setFlowAnswers] = useState({})        // collected answers
  const [quickReplies, setQuickRepliesRaw] = useState([])   // current quick-reply buttons
  // Button labels show the place names of the customer's city
  const setQuickReplies = (opts) => setQuickRepliesRaw((opts || []).map((o) => (o && typeof o.label === 'string' ? { ...o, label: placeText(o.label) } : o)))
  const [pendingAction, setPendingAction] = useState(null)



  // extra: more about the message, e.g. { serviceId } so the app can show that service's toy
  const addBot = (text, delay = 600, extra = null) => {
    setIsTyping(true)
    return new Promise(resolve => {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: placeText(text), ...(extra || {}) }])
        setIsTyping(false)
        resolve()
      }, delay)
    })
  }
  const addUser = (text) => setMessages(prev => [...prev, { sender: 'user', text }])
  const addAction = (route, label) => setMessages(prev => [...prev, { sender: 'bot', text: '', action: { type: 'navigate', route, label } }])

  /* ─── Step-by-step request (wizard) ───
     wiz = { kind, item, steps, idx, answers, picks, editing, review } — kept in a ref so
     async handlers always see the latest answers. */
  const wizRef = useRef(null)
  const pendingItemRef = useRef(null) // a request asked for from a Services/Supplies page
  const lang = () => (language === 'te' ? 'te' : 'en')

  const wizOptions = (s) => {
    const w = wizRef.current
    const t = chatText(lang())
    if (!s.multi) return s.options
    const picked = w.picks || []
    const n = picked.filter(v => v !== NOT_SURE_VALUE).length
    return [
      ...s.options.map(o => (o.value !== NOT_SURE_VALUE && picked.includes(o.value) ? { ...o, label: `✅ ${o.label}` } : o)),
      // "Next" shows only after something is picked, as one clear filled button
      ...(n ? [{ label: t.next ? t.next(n) : t.done, value: DONE_VALUE, primary: true }] : []),
    ]
  }

  const askWizardStep = async () => {
    const w = wizRef.current
    const s = w.steps[w.idx]
    const t = chatText(lang())
    const main = (x) => !x.picker && x.role !== 'detail'
    const total = w.steps.filter(main).length || w.steps.length
    const pos = w.steps.slice(0, w.idx + 1).filter(main).length
    const details = w.steps.filter(x => x.role === 'detail')
    const head = s.picker ? s.ask
      : s.role === 'detail' ? `**📝 ${details.indexOf(s) + 1} / ${details.length}** — ${s.ask}`
      : `**${t.step ? t.step(pos, total) : `Step ${pos} of ${total}`}** — ${s.ask}`
    const extra = [s.multi ? t.multiHint : '', s.tip ? `💡 ${s.tip}` : ''].filter(Boolean).join('\n')
    await addBot(extra ? `${head}\n${extra}` : head, 500)
    setQuickReplies(wizOptions(s))
  }

  /** "Not offered in <city> yet" + the city's number, then the service groups the city has. */
  const notInCity = async ({ en = 'This service', te = 'ఈ సేవ', many = false } = {}) => {
    const L = lang()
    const c = currentCity()
    await addBot(L === 'te'
      ? `${te} ఇంకా ${c.te || c.name}లో అందుబాటులో ${many ? 'లేవు' : 'లేదు'}. మా బృందం సలహా ఇవ్వగలదు — ${teamPhoneShown()} కు కాల్ / వాట్సాప్ చేయండి.`
      : `${en} ${many ? "aren't" : "isn't"} offered in ${c.name} yet. Our team can still advise — call or WhatsApp ${teamPhoneShown()}.`, 600)
    setQuickReplies(getCategoryQuickReplies(L))
  }
  const pageNotice = (path) => { const pg = pageForPath(path); return pg ? { en: pg.name, te: pg.te, many: pg.plural } : {} }

  /** Start a step-by-step request. Returns false when the customer's city has that part switched off. */
  const startWizard = async ({ kind, item, picker }) => {
    const L = lang()
    const t = chatText(L)
    if ((picker === 'supply' || kind === 'supply') && !isPageOn('supplies')) { await notInCity(pageNotice('/supplies')); return false }
    if ((picker === 'property' || kind === 'property') && !isPageOn('property')) { await notInCity(pageNotice('/property')); return false }
    setActiveFlow(null)
    setStep(STEPS.WIZARD)
    if (picker) {
      wizRef.current = { kind: picker, item: null, steps: [picker === 'supply' ? supplyPicker(L) : propertyPicker(L)], idx: 0, answers: {}, picks: [] }
      await askWizardStep()
      return true
    }
    const steps = itemSteps(kind, item, L)
    wizRef.current = { kind, item, steps, idx: 0, answers: {}, picks: [] }
    // The green "Not sure" button is mentioned only where it is offered (expert questions)
    const advise = steps.some((x) => (x.options || []).some((o) => o.advise))
    await addBot(L === 'te'
      ? `సరే — **${svcText('te', item.title)}** కోసం అభ్యర్థన. ${steps.length} చిన్న ప్రశ్నలు.${advise ? ' తెలియకపోతే ఆకుపచ్చ 📞 బటన్ నొక్కండి — మా నిపుణులు కాల్ చేసి సలహా ఇస్తారు.' : ''}`
      : `Great — let's request **${item.title}**. ${steps.length} quick questions.${advise ? ' Not sure? Tap the green 📞 button — our expert will call and advise.' : ''}`, 500,
      kind === 'service' && item.id ? { serviceId: item.id } : null)
    if (item.subtitle || item.tagline) await addBot(`📋 ${svcText(L, item.subtitle || item.tagline)}`, 300)
    await askWizardStep()
    return true
  }

  const nextWizardStep = async () => {
    const w = wizRef.current
    w.picks = []
    if (w.editing) { w.editing = false; await showWizardReview(); return }
    w.idx += 1
    // "Not sure" → skip the other questions: only the town and the timing are still asked
    if (w.skipping) while (w.idx < w.steps.length && !KEPT_WHEN_SKIPPING.includes(w.steps[w.idx].role)) w.idx += 1
    if (w.reviewAfter != null && w.idx > w.reviewAfter) { w.reviewAfter = null; await showWizardReview(); return }
    if (w.idx < w.steps.length) await askWizardStep()
    else await showWizardReview()
  }

  const recordWizardAnswer = async (s, value, shown) => {
    const w = wizRef.current
    addUser(shown)
    w.answers[s.key] = value
    // Government services: papers first, then only the details the ready papers don't show (owner, 6 Nov 2026)
    let readLine = ''
    if (s.role === 'papers' && w.kind === 'service' && papersFirst(w.item)) {
      const L = lang()
      const have = Array.isArray(value) ? value.filter(x => (s.all || []).includes(x)) : []
      const after = detailsAfterPapers(w.item, fieldsFor(w.item), have)
      w.hiddenDetails = after.hidden.map(f => f.key)
      readLine = readFromPapersLine(after, L, (x) => svcText(L, x))
      const left = detailSteps(w.item, L).filter(x => !w.hiddenDetails.includes(x.field.key)).length
      // Detail questions already added that a paper now answers go away
      w.steps = w.steps.filter(x => !(x.fromDetails && w.hiddenDetails.includes(x.field?.key)))
      const gi = w.steps.findIndex(x => x.role === 'detailsGate')
      if (gi >= 0 && !left) { w.gateGone = true; w.steps.splice(gi, 1) }
      else if (gi >= 0) w.steps[gi] = { ...detailsGate(left, L) }
      else if (left && w.gateGone) { w.gateGone = false; w.steps.splice(w.steps.indexOf(s) + 1, 0, detailsGate(left, L)) }
    }
    // "Fill your details now?" — Yes puts the detail questions right after it
    if (s.role === 'detailsGate') {
      w.steps = w.steps.filter(x => !x.fromDetails)
      if (value === DETAILS_YES) {
        const ds = detailSteps(w.item, lang()).filter(x => !(w.hiddenDetails || []).includes(x.field.key)).map(x => ({ ...x, fromDetails: true }))
        w.steps.splice(w.idx + 1, 0, ...ds)
        // Opened again from the review: walk the details, then back to the review
        if (w.editing) { w.editing = false; w.reviewAfter = w.idx + ds.length }
      }
    }
    // RTO-style services: the chosen job decides which papers to ask about
    if (s.jobs) {
      w.steps = w.steps.filter(x => !x.fromJob)
      const job = s.jobs.find(j => j.heading === value)
      const jp = job && job.items.length ? papersStep(job.items, lang()) : null
      if (jp) {
        const ps = { ...jp, fromJob: true }
        w.steps.splice(w.idx + 1, 0, ps)
      }
    }
    setQuickReplies([])
    if (readLine) await addBot(`📄 ${readLine}`, 300)
    await nextWizardStep()
  }

  /** How many questions come after this one (town and timing are kept when skipping). */
  const questionsLeft = (w) => w.steps.slice(w.idx + 1).filter(x => !x.picker && x.role !== 'detail' && !KEPT_WHEN_SKIPPING.includes(x.role) && x.role !== 'notes').length

  /** "Not sure" tapped: ask once whether to skip the other questions (owner, 2 Nov 2026). */
  const notSureTapped = async (s, shown) => {
    const w = wizRef.current
    const t = chatText(lang())
    const n = w.editing || KEPT_WHEN_SKIPPING.includes(s.role) ? 0 : questionsLeft(w)
    if (!n) return recordWizardAnswer(s, NOT_SURE, shown)
    addUser(shown)
    w.confirmSkip = true
    await addBot(`📞 ${t.skipAsk(n)}`, 300)
    setQuickReplies([{ label: `✅ ${t.skipYes}`, value: SKIP_YES, advise: true }, { label: `✍️ ${t.skipNo}`, value: SKIP_NO }])
  }

  const wizardAnswer = async (option, typed) => {
    const w = wizRef.current
    if (!w) return
    const t = chatText(lang())
    if (w.review) return wizardReviewAction(option, typed)
    const s = w.steps[w.idx]

    // "Skip the other questions?" — Yes: town and timing next; No: carry on with the next question
    if (w.confirmSkip) {
      w.confirmSkip = false
      const yes = option ? option.value === SKIP_YES : /^(y|yes|ok|okay|skip|sure|అవును|సరే|వదిలేయండి)/i.test(String(typed || '').trim())
      if (!yes) return recordWizardAnswer(s, NOT_SURE, option?.label || typed)
      w.skipping = true
      w.answers[SKIPPED_KEY] = true
      return recordWizardAnswer(s, NOT_SURE, option?.label || typed)
    }

    // "Fill your details now?"
    if (s.role === 'detailsGate') {
      const yes = option ? option.value === DETAILS_YES : /^(y|yes|ok|okay|sure|fill|అవును|సరే|ఇస్తాను)/i.test(String(typed || '').trim())
      return recordWizardAnswer(s, yes ? DETAILS_YES : DETAILS_SKIP, option?.label || typed)
    }
    // A detail question: every one can be skipped, or all the rest at once
    if (s.role === 'detail') {
      if (option?.value === SKIP_REST_VALUE) {
        addUser(option.label)
        setQuickReplies([])
        w.picks = []
        while (w.idx + 1 < w.steps.length && w.steps[w.idx + 1].role === 'detail') w.idx += 1
        return nextWizardStep()
      }
      if (option?.value === SKIP_VALUE || (typed && /^(skip|no|-|వదిలేయండి|లేదు)$/i.test(typed.trim()))) {
        return recordWizardAnswer(s, '', option?.label || typed)
      }
      if (typed && !s.multi) {
        // A typed answer; for a choice, the matching button's value if it clearly matches
        const real = s.options.filter(o => !String(o.value).startsWith('__'))
        const m = real.length ? smartMatchOption(typed, real) : null
        return recordWizardAnswer(s, m && m.label.toLowerCase() === typed.toLowerCase() ? m.value : typed.trim(), typed)
      }
    }

    // Choosing which supply / property help
    if (s.picker) {
      if (option && typeof option.value === 'string' && option.value.startsWith('__item:')) {
        const [, kind, id] = option.value.split(':')
        const item = findItem(kind, id)
        addUser(option.label)
        if (item) return startWizard({ kind, item })
      }
      const typedSupply = typed ? findSupplyByText(typed) : null
      if (typedSupply) { addUser(typed); return startWizard({ kind: 'supply', item: typedSupply }) }
      // Not sure / something else → a general request the team will call about
      addUser(typed || option?.label || t.notSure)
      const general = { id: 'general', title: w.kind === 'property' ? 'Property help (not sure yet)' : 'Supplies (not sure yet)', sections: [] }
      return startWizard({ kind: 'service', item: { ...general, category: w.kind === 'property' ? 'real-estate' : 'supplies' } })
    }

    if (s.multi) {
      if (option?.value === NOT_SURE_VALUE) return notSureTapped(s, option.label)
      if (option?.value === DONE_VALUE || typed) {
        const picks = [...(w.picks || []), ...(typed ? [typed] : [])]
        if (!picks.length) {
          const ns = s.options.some((o) => o.advise)
          await addBot(lang() === 'te' ? `కనీసం ఒకటి ఎంచుకోండి${ns ? ', లేదా "తెలియదు" నొక్కండి' : ''}.` : `Pick at least one${ns ? ', or tap "Not sure"' : ''}.`, 300)
          setQuickReplies(wizOptions(s)); return
        }
        return recordWizardAnswer(s, picks, picks.map(v => s.options.find(o => o.value === v)?.label || v).join(', '))
      }
      // toggle
      w.picks = (w.picks || []).includes(option.value) ? w.picks.filter(x => x !== option.value) : [...(w.picks || []), option.value]
      setQuickReplies(wizOptions(s))
      return
    }

    if (typed) {
      const m = smartMatchOption(typed, s.options.filter(o => o.value !== NOT_SURE_VALUE))
      const exact = m && m.label.toLowerCase() === typed.toLowerCase()
      return recordWizardAnswer(s, exact ? m.value : typed, typed)
    }
    if (option.value === NOT_SURE_VALUE) return notSureTapped(s, option.label)
    return recordWizardAnswer(s, option.value, option.label)
  }

  /** A detail answer as the customer reads it: the Telugu choice or place name (saved in English). */
  const detailShown = (s, a, L) => {
    if (L !== 'te') return a
    const opt = (s.field.options || []).find(o => o[0] === a)
    if (opt) return opt[1]
    if (s.field.type === 'district') { const c = currentCity(); return a === c?.regionShort ? (c.regionShortTe || a) : a }
    if (s.field.type === 'mandal') return townLabel(a, 'te')
    return a
  }

  const showWizardReview = async () => {
    const w = wizRef.current
    w.review = true
    const L = lang()
    const empty = (v) => v === undefined || v === '' || (Array.isArray(v) && !v.length)
    const lines = w.steps.filter(s => !s.picker && s.role !== 'detailsGate' && !empty(w.answers[s.key]) && !(s.role === 'notes' && !w.answers[s.key]))
      .map(s => s.role === 'detail'
        ? `• 📝 **${s.label}**: ${answerText([].concat(w.answers[s.key]).map(a => detailShown(s, a, L)))}`
        : `• **${s.role === 'papers' ? (L === 'te' ? 'సిద్ధంగా ఉన్నవి' : 'Ready') : svcText(L, s.key)}**: ${answerText(Array.isArray(w.answers[s.key]) ? w.answers[s.key].map(a => svcText(L, a)) : svcText(L, w.answers[s.key]))}`)
    // "Not sure" skipped the other questions: say who asks them (owner, 2 Nov 2026)
    if (w.answers[SKIPPED_KEY]) lines.push(`• 📞 **${svcText(L, 'Other questions')}**: ${svcText(L, SKIPPED_A)}`)
    await addBot(`${L === 'te' ? 'మీ అభ్యర్థన — ఒకసారి చూడండి:' : "Here's your request — please check:"}\n**${svcText(L, w.item.title)}**\n${lines.join('\n')}\n📱 ${userData.name} — ${userData.mobile}`, 600)
    setQuickReplies([
      { label: L === 'te' ? '✅ అభ్యర్థన పంపండి' : '✅ Submit request', value: '__submit' },
      { label: L === 'te' ? '✏️ ఒక సమాధానం మార్చండి' : '✏️ Change an answer', value: '__edit' },
      { label: L === 'te' ? '✖ రద్దు చేయండి' : '✖ Cancel', value: '__cancel' },
    ])
  }

  const wizardReviewAction = async (option, typed) => {
    const w = wizRef.current
    const L = lang()
    const v = option?.value || (typed && /^(y|yes|ok|submit|send|అవును|సరే)/i.test(typed) ? '__submit' : null)
    if (option?.value?.startsWith('__editstep:')) {
      const i = Number(option.value.split(':')[1])
      addUser(option.label)
      w.review = false; w.editing = true; w.skipping = false; w.idx = i
      const s = w.steps[i]
      w.picks = s.multi && Array.isArray(w.answers[s.key]) ? [...w.answers[s.key]] : []
      await askWizardStep()
      return
    }
    if (v === '__edit') {
      addUser(option?.label || typed)
      await addBot(L === 'te' ? 'ఏది మార్చాలి?' : 'Which answer would you like to change?', 300)
      const hasDetails = w.steps.some(s => s.role === 'detail')
      setQuickReplies(w.steps.map((s, i) => ({ s, i })).filter(({ s }) => !s.picker && !(s.role === 'detailsGate' && hasDetails))
        .map(({ s, i }) => ({ label: s.role === 'papers' ? (L === 'te' ? 'సిద్ధంగా ఉన్నవి' : 'Ready documents') : s.role === 'detailsGate' ? `📝 ${s.key}` : s.role === 'detail' ? `📝 ${s.label}` : s.key, value: `__editstep:${i}` })))
      return
    }
    if (v === '__cancel') {
      addUser(option?.label || typed)
      wizRef.current = null
      await addBot(L === 'te' ? 'సరే, రద్దు చేశాను. ఇంకేమైనా సహాయం కావాలా?' : 'Okay, cancelled. Can I help with anything else?', 400)
      setStep(STEPS.RESULT)
      setQuickReplies(mainMenu(L))
      return
    }
    if (v !== '__submit') { addUser(typed || option?.label || ''); await showWizardReview(); return }

    addUser(option?.label || typed)
    setQuickReplies([])
    const ref = newRef()
    const req = buildRequest({ kind: w.kind, item: w.item, steps: w.steps, answers: w.answers, user: userData, ref })
    if (submitRequest) {
      try {
        setIsTyping(true)
        await submitRequest(req)
        setIsTyping(false)
        wizRef.current = null
        // Outside office hours: say exactly when we will call (emergencies: call 108 now)
        const note = afterHoursNote(L === 'te' ? 'te' : 'en', { emergency: isEmergency(req) })
        await addBot(L === 'te'
          ? `✅ మీ అభ్యర్థన అందింది! సూచన సంఖ్య: **${ref}**\n${note || `ధర చెప్పడానికి మా బృందం త్వరలో ${userData.mobile}కు కాల్ చేస్తుంది.`}`
          : `✅ Request sent! Your reference: **${ref}**\n${note || `We'll call you on ${userData.mobile} soon with the price.`}`, 300)
        setStep(STEPS.RESULT)
        setQuickReplies(mainMenu(L))
        return
      } catch (err) {
        setIsTyping(false)
        await addBot((err && err.message) || (L === 'te' ? 'పంపడం కుదరలేదు.' : 'Sorry, that did not go through.'), 300)
      }
    }
    // No direct submit available (or it failed): open the filled contact form instead
    const p = new Params({ service: req.service, subService: req.subService, name: req.name, phone: req.phone, message: req.message })
    addAction(`/contact?${p.toString()}`, L === 'te' ? 'నా అభ్యర్థనను సమర్పించండి ✅' : 'Submit My Request ✅')
    wizRef.current = null
    setStep(STEPS.RESULT)
  }

  /** Show every service in a category as buttons. */
  const listCategory = async (cat) => {
    const L = lang()
    const items = chatServices.filter(s => s.category === cat)
    if (!items.length) return false
    const label = (chatLocales[L].categoryLabels || {})[cat] || cat
    await addBot(L === 'te' ? `**${label}** — ఒకటి ఎంచుకోండి:` : `**${label}** — pick one and I'll take you step by step:`, 500)
    setQuickReplies(items.map(s => ({ label: svcText(L, s.title), value: itemValue(s) })))
    return true
  }

  const mainMenu = (L) => [
    { label: L === 'te' ? 'సేవలు' : 'Services', value: 'Services' },
    isPageOn('supplies') && { label: L === 'te' ? 'సామగ్రి' : 'Supplies', value: 'Supplies' },
    isPageOn('property') && { label: L === 'te' ? 'ఆస్తి' : 'Property', value: 'Property' },
  ].filter(Boolean)

  /** Buttons that open a request directly; returns true when handled. */
  const handleItemValue = async (value, label) => {
    if (typeof value !== 'string') return false
    if (value.startsWith('__svc:')) {
      const item = findItem('service', value.slice(6))
      if (item) { addUser(label); await startWizard({ kind: 'service', item }); return true }
    }
    if (value.startsWith('__cat:')) { addUser(label); await listCategory(value.slice(6)); return true }
    if (value.startsWith('__supply:')) {
      const item = findItem('supply', value.slice(9))
      if (item) { addUser(label); await startWizard({ kind: 'supply', item }); return true }
    }
    if (value.startsWith('__link:')) {
      addUser(label)
      addAction(value.slice(7), lang() === 'te' ? 'ఈ పేజీ తెరవండి →' : 'Open this page →')
      return true
    }
    return false
  }

  /* ─── Start the guided flow ─── */
  const startFlow = async (flow, name, initialAnswers = null) => {
    setActiveFlow(flow)
    setFlowStep(0)
    setFlowAnswers(initialAnswers || {})
    setStep(STEPS.GUIDED_FLOW)
    await addBot(flow.greeting.replace(/\{name\}/g, name || 'Friend'))
    
    if (initialAnswers && Object.keys(initialAnswers).length > 0) {
      // If we have initial answers, simulate answering the first question
      const q = flow.questions[0]
      if (initialAnswers[q.key]) {
        addUser(initialAnswers[q.key])
        const nextIdx = 1
        setFlowStep(nextIdx)
        await askFlowQuestion(flow, nextIdx, initialAnswers)
        return
      }
    }
    
    await askFlowQuestion(flow, 0, {})
  }

  /* ─── Start a guided flow from outside the chat (Services page, app screens) ─── */
  const triggerFlow = async (flowId, initialAnswers) => {
    if (!flowId) return
    setIsOpen(true)
    const lang = language || initialLanguage || 'en'
    if (!language) setLanguage(lang)
    const flowDef = chatLocales[lang].guidedFlows[flowId]
    if (flowDef) {
      setMessages([])
      setQuickReplies([])
      await startFlow(flowDef, userData.name, initialAnswers)
    }
  }

  /* ─── Ask a guided flow question ─── */
  const askFlowQuestion = async (flow, qIndex, answers) => {
    const q = flow.questions[qIndex]
    
    // Support dynamic question text
    let askText = q.ask
    if (q.askByPrevKey && q.askByPrev) {
      const prevAns = answers[q.askByPrevKey] || ''
      askText = q.askByPrev[prevAns] || q.askByPrev['default'] || q.ask
    }
    
    await addBot(askText, 700)
    
    // Determine options (may depend on previous answer)
    let opts = q.options || []
    if (q.optionsByPrev) {
      let prevAns = ''
      if (q.optionsByPrevKey) {
        prevAns = answers[q.optionsByPrevKey] || ''
      } else {
        const prevQ = flow.questions[qIndex - 1]
        prevAns = prevQ ? answers[prevQ.key] : ''
      }
      opts = q.optionsByPrev[prevAns] || q.optionsByPrev['default'] || Object.values(q.optionsByPrev)[0] || []
    }
    
    // Older flows list Prakasam towns; other cities get their own towns
    if (q.key === 'location' && opts.length > 0 && currentCity().id !== DEFAULT_CITY_ID && activeFlowIsTownList(opts)) {
      opts = [...townQuickReplies(), { label: '🌍 Other', value: 'Other' }]
    }
    if (opts.length > 0) {
      setQuickReplies(opts)
    } else {
      setQuickReplies([])
    }
  }
  function activeFlowIsTownList(opts) {
    return opts.some((o) => /Ongole|Chirala|Markapur|Prakasam/.test(String(o.value)))
  }

  /* ─── Handle a quick-reply tap ─── */
  const handleQuickReply = async (option) => {
    if (step === STEPS.WIZARD && wizRef.current) { await wizardAnswer(option); return }
    setQuickReplies([])
    if (await handleItemValue(option.value, option.label)) return
    addUser(option.label)
    
    if (step === STEPS.CHECK_DOCS) {
       const isTe = language === 'te'
       let finalRoute = pendingAction.route
       if (option.value === 'yes') {
          await addBot(isTe ? 'అద్భుతం! మీ అభ్యర్థనను కొనసాగిద్దాం.' : 'Great! Let\'s proceed with your request.', 700)
       } else {
          await addBot(isTe ? 'పర్వాలేదు! మా బృందం మీకు తప్పిపోయిన పత్రాలను ఏర్పాటు చేయడంలో సహాయపడుతుంది. అభ్యర్థనను సమర్పిద్దాం.' : 'No worries! Our team can assist you in arranging the missing documents. Let\'s submit your request.', 700)
          
          const [path, search] = pendingAction.route.split('?')
          const p = new Params(search || '')
          const oldMsg = p.get('message') || ''
          const suffix = isTe ? '\n\nగమనిక: నా వద్ద కొన్ని పత్రాలు లేవు, వాటిని సిద్ధం చేయడానికి నాకు సహాయం కావాలి.' : '\n\nNote: I am missing some required documents and need assistance with them.'
          p.set('message', oldMsg + suffix)
          finalRoute = `${path}?${p.toString()}`
       }
       addAction(finalRoute, pendingAction.label)
       setStep(STEPS.RESULT)
       return
    }

    if (step === STEPS.ASK_LANGUAGE) {
       const lang = option.value === 'te' ? 'te' : 'en'
       setLanguage(lang)
       await addBot(chatLocales[lang].askName, 700)
       setStep(STEPS.ASK_NAME)
       return
    }
    
    if (step === STEPS.ASK_PURPOSE || step === STEPS.RESULT) {
       setUserData(prev => ({ ...prev, purpose: option.value }))
       const result = await handleQuery(option.value)
       
       if (result === 'CONFUSED' || result === 'SHOW_CATEGORIES') {
           setQuickReplies(getCategoryQuickReplies(language))
       }
       
       if (result !== 'stay' && result !== 'flow' && result !== 'check_docs') {
         setStep(STEPS.RESULT)
       }
       return
    }

    if (typeof option.value === 'string' && option.value.startsWith('__OTHER_AREA__')) {
       const townName = option.value.split('__OTHER_AREA__')[1]
       await addBot(chatLocales[language || 'en'].typeArea.replace('{town}', townName), 700)
       setFlowAnswers({ ...flowAnswers, pendingTownForArea: townName })
       return
    }

    const q = activeFlow.questions[flowStep]
    
    // Handle clicks on initial location town buttons
    if (q.key === 'location' && !option.value.startsWith('__OTHER_AREA__') && !option.value.includes(' - ')) {
       if (option.value === 'Other') {
           if (activeFlow.serviceCategory === 'supplies') {
               await addBot(chatLocales[language || 'en'].typeSpecificArea, 700)
           } else {
               await addBot(chatLocales[language || 'en'].typeSpecificTown, 700)
           }
           return
       }
       if (option.value === 'Prakasam District') {
           await addBot(chatLocales[language || 'en'].typeSpecificTown, 700)
           return
       }
       
       const inputLower = option.value.toLowerCase()
       const foundLocation = knownPlaces().find(loc => inputLower.includes(loc.name))
       
       if (foundLocation) {
         const formattedLoc = foundLocation.name.charAt(0).toUpperCase() + foundLocation.name.slice(1)
         let areas = foundLocation.areas || []
         if (areas.length === 0) areas = [`${formattedLoc} Center`, 'Near Bus Stand', 'Surrounding Villages']
         const quickReplyOptions = areas.map(a => ({ label: a, value: `${formattedLoc} - ${a}` }))
         quickReplyOptions.push({ label: 'Other', value: `__OTHER_AREA__${formattedLoc}` })
         
         await addBot(chatLocales[language || 'en'].selectSpecificArea.replace('{loc}', formattedLoc), 700)
         setQuickReplies(quickReplyOptions)
         return
       }
    }

    const newAnswers = { ...flowAnswers, [q.key]: option.value }
    setFlowAnswers(newAnswers)
    await advanceFlow(newAnswers)
  }

  /* ─── Advance to next question or finish ─── */
  const advanceFlow = async (answers) => {
    const nextIdx = flowStep + 1
    if (nextIdx < activeFlow.questions.length) {
      setFlowStep(nextIdx)
      await askFlowQuestion(activeFlow, nextIdx, answers)
    } else {
      // Flow complete → show summary
      await showFlowSummary(answers)
    }
  }

  /* ─── Show the summary and submit button ─── */
  const showFlowSummary = async (answers) => {
    setQuickReplies([])
    await addBot(activeFlow.summary)
    const lines = Object.entries(answers).map(([k, v]) => `• **${answerLabel(k)}**: ${v}`).join('\n')
    await addBot(lines, 700)
    await addBot(`📱 **Contact**: ${userData.name} — ${userData.mobile}`, 500)
    
    // Determine subService dynamically
    let subServiceStr = activeFlow.serviceId
    if (activeFlow.serviceId === 'home-tuitions') {
      const levelShort = answers.level ? answers.level.split('(')[0].trim() : ''
      subServiceStr = `Home Tuition - ${levelShort} - ${answers.subject || ''}`.trim()
    } else if (activeFlow.serviceCategory === 'drivers' && answers.type) {
      if (answers.type === 'Chef/Cook' || answers.type === 'Professional Chef') subServiceStr = 'professional-chef-services'
      else if (answers.type === 'Professional Makeup Artist') subServiceStr = 'professional-makeup-artist'
      else if (answers.type === 'Flex Printing Services') subServiceStr = 'flex-printing-services'
      else if (answers.type === 'Tailor Services') subServiceStr = 'tailor-services'
      else if (answers.type === 'Dry Cleaning & Laundry') subServiceStr = 'dry-cleaning-services'
      else if (answers.type === 'Electrician') {
        if (answers.requirement === 'Switches & Sockets') subServiceStr = 'electricity-switches-sockets'
        else if (answers.requirement === 'Fans & Ventilation') subServiceStr = 'electricity-fans-ventilation'
        else if (answers.requirement === 'Lighting & Fixtures') subServiceStr = 'electricity-lighting'
        else if (answers.requirement === 'Wiring') subServiceStr = 'electricity-wiring'
        else subServiceStr = 'electricity-category'
      }
      else if (answers.type === 'AC Technician') {
        if (answers.requirement === 'Jet Cleaning') subServiceStr = 'ac-jet-cleaning'
        else if (answers.requirement === 'Gas Refilling') subServiceStr = 'ac-gas-leak-refilling'
        else if (answers.requirement === 'Repair') subServiceStr = 'ac-repair-components'
        else if (answers.requirement === 'Installation') subServiceStr = 'ac-installation'
        else subServiceStr = 'ac-jet-cleaning'
      }
      else if (answers.type === 'Cleaning Services') subServiceStr = 'cleaning'
      else if (answers.type === 'Car Wash Service') subServiceStr = 'car-wash'
      else if (answers.type === 'Plumbing Services') subServiceStr = 'plumbing-services'
      else subServiceStr = 'verified-driver-services'
    } else if (activeFlow.serviceId === 'supplies' && answers.category) {
      if (answers.category === 'Cold-Pressed Oils') subServiceStr = 'cold-pressed-oils'
      else if (answers.category === 'Interior Design') subServiceStr = 'interior-design'
      else if (answers.category === 'Cleaning Services') subServiceStr = 'cleaning'
      else if (answers.category === 'Furniture') subServiceStr = 'furniture-manufacturing'
      else subServiceStr = answers.category.toLowerCase().replace(/\s+/g, '-')
    } else if (activeFlow.serviceId === 'property') {
      // Same names as the step-by-step pages (data/propertyData.js) and the contact form
      const intentMap = { Buy: 'Buy a Property', Sell: 'Sell a Property', 'Rent / Lease': 'Rent & Lease', Paperwork: 'Property Paperwork' }
      subServiceStr = intentMap[answers.intent] || 'Buy a Property'
    } else if (activeFlow.serviceCategory === 'healthcare') {
      if (answers.healthcareType === 'Patient Logistics') subServiceStr = 'patient-logistics'
      else if (answers.healthcareType === 'Patient Hospitality') subServiceStr = 'patient-hospitality'
      else if (answers.healthcareType === 'Physiotherapy') subServiceStr = 'physiotherapy'
      else subServiceStr = 'medical-advising'
    } else if (activeFlow.serviceCategory === 'pujari' && answers.type) {
      if (answers.type === 'Life Milestones') subServiceStr = 'pujari-life-milestones'
      else if (answers.type === 'Property & New Beginnings') subServiceStr = 'pujari-property-beginnings'
      else if (answers.type === 'Vedic Rituals & Pujas') subServiceStr = 'pujari-vedic-rituals'
      else if (answers.type === 'Ancestral Rites') subServiceStr = 'pujari-ancestral-rites'
      else subServiceStr = 'pujari-life-milestones'
    } else if (activeFlow.serviceCategory === 'photography' && answers.type) {
      if (answers.type === 'Wedding Photography') subServiceStr = 'wedding-photography'
      else if (answers.type === 'Corporate Photography') subServiceStr = 'corporate-photography'
      else if (answers.type === 'Advertising Photography') subServiceStr = 'advertising-photography'
      else if (answers.type === 'Event Photography') subServiceStr = 'event-photography'
      else if (answers.type === 'Portrait Photography') subServiceStr = 'portrait-photography'
      else if (answers.type === 'Product Photography') subServiceStr = 'product-photography'
      else if (answers.type === 'Real Estate Photography') subServiceStr = 'real-estate-photography'
      else subServiceStr = 'wedding-photography'
    }

    // Build URL with all params
    const params = new Params({
      service: activeFlow.serviceCategory,
      subService: subServiceStr,
      name: userData.name,
      phone: userData.mobile
    })
    
    // Construct professional message
    const categoryLabel = (chatLocales[language || 'en'].categoryLabels)?.[activeFlow.serviceCategory] || activeFlow.serviceCategory
    const msgLines = [`Hello, I am interested in ${categoryLabel}. Here are my details:`]
    for (const [k, v] of Object.entries(answers)) {
      msgLines.push(`${answerLabel(k)}: ${v}`)
    }
    // If checklist data was passed (e.g. from Services modal), add it to the message
    if (answers.checklist && Object.keys(answers.checklist).length > 0) {
      const cl = answers.checklist
      const ready = Object.keys(cl).filter(k => cl[k])
      const missing = Object.keys(cl).filter(k => !cl[k])
      
      msgLines.push('\nChecklist Status:')
      if (ready.length > 0) msgLines.push(`[Ready]\n- ${ready.join('\n- ')}`)
      if (missing.length > 0) msgLines.push(`[Need Help With]\n- ${missing.join('\n- ')}`)
      
      // Remove checklist from answers so it doesn't print as a regular key-value pair
      delete answers.checklist
    }

    params.set('message', msgLines.join('\n'))

    const route = `/contact?${params.toString()}`
    const actionLabel = language === 'te' ? 'నా అభ్యర్థనను సమర్పించండి ✅' : 'Submit My Request ✅'

    // Dynamically look up the correct service for checklist requirements using subServiceStr
    const svc = servicesData.find(s => s.id === subServiceStr) || servicesData.find(s => s.id === activeFlow.serviceId)
    if (svc && svc.sections && svc.sections.length > 0) {
      const isTe = language === 'te'
      const reqText = svc.sections.map(sec => {
        let translatedHeading = sec.heading
        if (isTe) {
           if (sec.heading.includes('Data')) translatedHeading = 'కావలసిన సమాచారం'
           else if (sec.heading.includes('Documents')) translatedHeading = 'కావలసిన పత్రాలు'
           else if (sec.heading.includes('ASSISTANCE')) translatedHeading = 'మా సహాయం'
           else if (sec.heading.includes('SERVICES')) translatedHeading = 'అందించే సేవలు'
           else if (sec.heading.includes('SUPPORT')) translatedHeading = 'మద్దతు'
        }
        return `**${translatedHeading}:**\n` + sec.items.map(item => `• ${item}`).join('\n')
      }).join('\n\n')
      
      const docHeavyCategories = ['identity', 'mro', 'rto', 'municipal', 'collector', 'startup', 'revenue']
      if (!docHeavyCategories.includes(svc.category)) {
        let introText = isTe ? 'మీరు అభ్యర్థించిన సేవల వివరాలు ఇక్కడ ఉన్నాయి:' : 'Here are the details for your requested services:'
        if (svc.category === 'healthcare') {
          introText = isTe ? 'iN Empower మీ ఆరోగ్య ప్రయాణంలో ప్రతి అడుగులో మీకు సహాయం చేయడానికి ఇక్కడ ఉంది. మేము మీకు ఎలా సహాయపడగలమో ఇక్కడ చూడండి 💛:' : 'iN Empower is here to help you in every aspect of your healthcare journey. Here is how we can assist you 💛:'
        } else if (svc.category === 'drivers' || svc.category === 'electricity' || svc.category === 'painting' || svc.category === 'pest-control' || svc.category === 'ac') {
          introText = isTe ? 'మా వృత్తిపరమైన సేవల వివరాలు ఇక్కడ ఉన్నాయి:' : 'Here are the details for our professional services:'
        }
        
        await addBot(introText, 800)
        await addBot(reqText, 1500)
        await addBot(isTe ? 'మీకు ఏవైనా ప్రత్యేక ఏర్పాట్లు కావాలంటే, సమర్పించడానికి కింద క్లిక్ చేయండి మరియు మా బృందం మీకు మార్గనిర్దేశం చేస్తుంది.' : 'If you need special arrangements, just get started below and our team will guide you.', 800)
        
        addAction(route, actionLabel)
        setActiveFlow(null)
        setStep(STEPS.RESULT)
      } else {
        await addBot(isTe ? 'దయచేసి సమర్పించే ముందు ఈ క్రింది సమాచారం మరియు పత్రాలను సిద్ధంగా ఉంచుకోండి:' : 'Before submitting, please keep the following information and documents ready:', 800)
        await addBot(reqText, 1500)
        await addBot(isTe ? 'మీ వద్ద ఈ పత్రాలన్నీ సిద్ధంగా ఉన్నాయా?' : 'Do you have all the required data and documents ready?', 800)
        
        setPendingAction({ route, label: actionLabel })
        setStep(STEPS.CHECK_DOCS)
        setQuickReplies([
          { label: isTe ? 'అవును, అన్నీ ఉన్నాయి' : 'Yes, I have everything', value: 'yes' },
          { label: isTe ? 'లేదు, కొన్ని లేవు' : 'No, some are missing', value: 'no' }
        ])
      }
    } else {
      await addBot(language === 'te' ? 'అన్నీ సరిగ్గా ఉన్నాయా? సమర్పించడానికి కింద క్లిక్ చేయండి.' : 'Everything look good? Click below to submit.', 800)
      addAction(route, actionLabel)
      await addBot(language === 'te' ? '\nమార్చాలనుకుంటున్నారా? దయచేసి చెప్పండి.' : '\nWant to change anything? Just let me know!', 900)
      setActiveFlow(null)
      setStep(STEPS.RESULT)
    }
  }

  /* ─── Handle user query (for purpose and result steps) ─── */
  const handleQuery = async (value, isRepeat = false) => {
    const valLower = value.toLowerCase().trim()
    if (valLower === 'services' || valLower === 'service' || valLower === 'all services') {
      const isTe = language === 'te'
      await addBot(isTe ? `మేము అందించే సేవల వర్గాలు ఇక్కడ ఉన్నాయి. దయచేసి ఒక వర్గాన్ని ఎంచుకోండి:` : `Here are our service categories. Please choose one:`)
      return 'SHOW_CATEGORIES'
    }
    
    // A snake bite is an emergency: 108 first, then the ambulance or a snake rescuer (owner, 2 Nov 2026)
    if (isSnakeBite(value)) {
      const L = lang()
      await addBot(L === 'te'
        ? '🚑 పాము కాటు అత్యవసరం. వెంటనే **108**కు కాల్ చేసి, దగ్గరి ప్రభుత్వ ఆసుపత్రికి తీసుకెళ్లండి — అక్కడ పాము విషానికి మందు ఉంటుంది. వ్యక్తిని ప్రశాంతంగా, కదలకుండా ఉంచండి. గాయాన్ని కోయవద్దు, నోటితో పీల్చవద్దు, గట్టిగా కట్టవద్దు.'
        : '🚑 A snake bite is an emergency. Call **108** now and take the person to the nearest government hospital — they keep anti-snake venom. Keep the person calm and still. Do not cut, suck or tightly tie the bite.', 300)
      const picks = ['ambulance-services', 'pest-snake'].map((id) => findItem('service', id)).filter(Boolean)
      setQuickReplies(picks.map((s) => ({ label: svcText(L, s.title), value: itemValue(s) })))
      return 'stay'
    }

    // 00. One vague word ("driving") → ask which one, with buttons
    const amb = findAmbiguous(value)
    if (amb) {
      const L = lang()
      if (amb.category && (await listCategory(amb.category))) return 'stay'
      const items = (amb.ids || []).map((id) => findItem('service', id)).filter(Boolean)
      if (items.length === 1) { await startWizard({ kind: 'service', item: items[0] }); return 'flow' }
      if (items.length > 1) {
        await addBot(L === 'te' ? `“${value.trim()}” — మీకు వీటిలో ఏది కావాలి?` : `“${value.trim()}” can mean a few things. Which one do you need?`, 400)
        setQuickReplies(items.map((s) => ({ label: svcText(L, s.title), value: itemValue(s) })))
        return 'stay'
      }
    }
    // 000. The exact name of a service ("Property Tax", "Vehicle Loan")
    const exactId = findExactService(value)
    const exactItem = exactId && findItem('service', exactId)
    if (exactItem) { await startWizard({ kind: 'service', item: exactItem }); return 'flow' }

    // 0. NRI logistics (before supplies: "send homemade food to the USA" is not catering)
    const nriId = findNriService(value)
    const nriItem = nriId && findItem('service', nriId)
    if (nriItem) { await startWizard({ kind: 'service', item: nriItem }); return 'flow' }
    // 0b. Packers & Movers (before supplies: "sofa shifting" is not buying a sofa)
    const moveId = findMovingService(value)
    const moveItem = moveId && findItem('service', moveId)
    if (moveItem) { await startWizard({ kind: 'service', item: moveItem }); return 'flow' }
    // 0c. Driving classes ("learn car driving") — before the driving-licence flow
    const classItem = findDrivingClasses(value) && findItem('service', 'driving-classes')
    if (classItem) { await startWizard({ kind: 'service', item: classItem }); return 'flow' }
    // 0d. Pest control ("termite treatment", "bed bugs", "rats in the godown") — before supplies
    //     and the older flows, which read "floor" as tiles and "treatment" / "bed" as hospital help
    const pest = findPest(value)
    const pestItem = pest?.service && findItem('service', pest.service)
    if (pestItem) { await startWizard({ kind: 'service', item: pestItem }); return 'flow' }
    if (pest?.category && (await listCategory('pest-control'))) return 'stay'

    // Supplies and Property go step by step
    if (/^(supplies|supply|సామగ్రి)$/i.test(value.trim())) return (await startWizard({ picker: 'supply' })) ? 'flow' : 'stay'
    if (/^(property|real estate|ఆస్తి)$/i.test(value.trim())) return (await startWizard({ picker: 'property' })) ? 'flow' : 'stay'
    const typedSupply = findSupplyByText(value)
    if (typedSupply) return (await startWizard({ kind: 'supply', item: typedSupply })) ? 'flow' : 'stay'

    // 1. Small talk ("hi", "thanks", "help") — only when the message asks for nothing we offer
    const intent = smallTalkIntent(value, userData.name, language)
    if (intent) {
      await addBot(intent.response)
      if (intent.intent === 'CONFUSED') return 'CONFUSED'
      if (intent.intent === 'AFFIRMATIVE' || intent.intent === 'GREETING') return 'stay'
      return 'done'
    }
    // 1.5 Check advisory (business guidance) responses
    const advisory = advisoryMatch(value, language)
    if (advisory) {
      await addBot(advisory.response.replace(/\{name\}/g, userData.name || 'Friend'))
      if (advisory.followUp && advisory.followUp.length > 0) {
        setQuickReplies(advisory.followUp)
      }
      return 'stay'
    }
    // 2. Check for guided flow
    const flow = findGuidedFlow(value, language)
    if (flow) {
      const flowId = Object.keys(chatLocales[language || 'en'].guidedFlows).find(k => chatLocales[language || 'en'].guidedFlows[k].serviceId === flow.serviceId && chatLocales[language || 'en'].guidedFlows[k].greeting === flow.greeting)
      const target = FLOW_TARGETS[flowId]
      if (target?.picker) return (await startWizard({ picker: target.picker })) ? 'flow' : 'stay'
      if (target?.service) {
        const item = findItem('service', target.service)
        if (item) { await startWizard({ kind: 'service', item }); return 'flow' }
        // Not offered in the customer's city (Admin → Cities)
        await notInCity()
        return 'stay'
      }
      if (target?.category && !chatServices.some((s) => s.category === target.category)) {
        await notInCity({ en: 'These services', te: 'ఈ సేవలు', many: true })
        return 'stay'
      }
      if (target?.category) { await listCategory(target.category); return 'stay' }
      await startFlow(flow, userData.name, flow.initialAnswers)
      return 'flow'
    }
    // 3. Basic service match
    const match = findBasicMatch(value)
    if (match) {
      const supplyMatch = (match.type === 'service' && match.service.category === 'supplies') || (match.type === 'category' && match.category === 'supplies')
      if (supplyMatch && !isPageOn('supplies')) { await notInCity(pageNotice('/supplies')); return 'stay' }
      if (match.type === 'route' && !isPathOn(match.route)) {
        // A page the customer's city has switched off (Admin → Cities → Pages)
        await notInCity(pageNotice(match.route))
        return 'stay'
      }
      if (match.type === 'route') {
        const isTe = language === 'te'
        await addBot(isTe ? `అద్భుతం, ${userData.name}! ఎక్కడికి తీసుకెళ్లాలో నాకు తెలుసు. 😊` : `Wonderful, ${userData.name}! I know exactly where to take you. 😊`)
        addAction(match.route, match.label.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
      } else if (match.type === 'service' && !match.service.customLink && match.service.category !== 'supplies' && !match.service.targetCategory) {
        await startWizard({ kind: 'service', item: match.service })
        return 'flow'
      } else if (match.type === 'service') {
        const svc = match.service
        const isTe = language === 'te'
        const title = isTe ? svcText('te', svc.title) : svc.title
        const subtitle = isTe ? svcText('te', svc.subtitle) : svc.subtitle
        await addBot(isTe ? `శుభవార్త, ${userData.name}! మీకు కావాల్సింది నాకు దొరికింది! 🎯` : `Great news, ${userData.name}! I found exactly what you need! 🎯`)
        await addBot(`📋 **${title}** — ${subtitle}`, 700)
        
        let route = svc.customLink
        if (!route) {
          const p = new Params({ service: svc.category, subService: svc.id })
          if (userData.name) p.set('name', userData.name)
          if (userData.mobile) p.set('phone', userData.mobile)
          p.set('message', isTe ? `నమస్కారం, నేను ${title} తో సహాయం కోసం చూస్తున్నాను.` : `Hello, I am looking for assistance with ${svc.title}.`)
          route = `/contact?${p.toString()}`
        }
        
        const actionLabel = isTe ? `${title} తో ప్రారంభించండి` : `Get Started with ${svc.title}`

        if (svc.sections && svc.sections.length > 0) {
          const reqText = svc.sections.map(sec => {
            let translatedHeading = sec.heading
            if (isTe) {
               if (sec.heading.includes('Data')) translatedHeading = 'కావలసిన సమాచారం'
               else if (sec.heading.includes('Documents')) translatedHeading = 'కావలసిన పత్రాలు'
               else if (sec.heading.includes('ASSISTANCE')) translatedHeading = 'మా సహాయం'
               else if (sec.heading.includes('SERVICES')) translatedHeading = 'అందించే సేవలు'
               else if (sec.heading.includes('SUPPORT')) translatedHeading = 'మద్దతు'
            }
            return `**${translatedHeading}:**\n` + sec.items.map(item => `• ${item}`).join('\n')
          }).join('\n\n')
          
          const docHeavyCategories = ['identity', 'mro', 'rto', 'municipal', 'collector', 'startup', 'revenue']
          if (!docHeavyCategories.includes(svc.category)) {
            let introText = isTe ? 'మీరు అభ్యర్థించిన సేవల వివరాలు ఇక్కడ ఉన్నాయి:' : 'Here are the details for your requested services:'
            if (svc.category === 'healthcare') {
              introText = isTe ? 'iN Empower మీ ఆరోగ్య ప్రయాణంలో ప్రతి అడుగులో మీకు సహాయం చేయడానికి ఇక్కడ ఉంది. మేము మీకు ఎలా సహాయపడగలమో ఇక్కడ చూడండి 💛:' : 'iN Empower is here to help you in every aspect of your healthcare journey. Here is how we can assist you 💛:'
            } else if (svc.category === 'drivers' || svc.category === 'electricity' || svc.category === 'painting' || svc.category === 'pest-control' || svc.category === 'ac') {
              introText = isTe ? 'మా వృత్తిపరమైన సేవల వివరాలు ఇక్కడ ఉన్నాయి:' : 'Here are the details for our professional services:'
            }
            
            await addBot(introText, 800)
            await addBot(reqText, 1500)
            await addBot(isTe ? 'మీకు ఏవైనా ప్రత్యేక ఏర్పాట్లు కావాలంటే, సమర్పించడానికి కింద క్లిక్ చేయండి మరియు మా బృందం మీకు మార్గనిర్దేశం చేస్తుంది.' : 'If you need special arrangements, just get started below and our team will guide you.', 800)
            
            addAction(route, actionLabel)
          } else {
            await addBot(isTe ? 'దయచేసి సమర్పించే ముందు ఈ క్రింది సమాచారం మరియు పత్రాలను సిద్ధంగా ఉంచుకోండి:' : 'Before submitting, please keep the following information and documents ready:', 800)
            await addBot(reqText, 1500)
            await addBot(isTe ? 'మీ వద్ద ఈ పత్రాలన్నీ సిద్ధంగా ఉన్నాయా?' : 'Do you have all the required data and documents ready?', 800)
            
            setPendingAction({ route, label: actionLabel })
            setStep(STEPS.CHECK_DOCS)
            setQuickReplies([
              { label: isTe ? 'అవును, అన్నీ ఉన్నాయి' : 'Yes, I have everything', value: 'yes' },
              { label: isTe ? 'లేదు, కొన్ని లేవు' : 'No, some are missing', value: 'no' }
            ])
            return 'check_docs'
          }
        } else {
          addAction(route, actionLabel)
        }
      } else if (match.type === 'category') {
        const label = (chatLocales[language || 'en'].categoryLabels)[match.category] || match.category
        const isTe = language === 'te'
        await addBot(isTe ? `నేను **${label}** కింద సేవలను కనుగొన్నాను, ${userData.name}:` : `I found services under **${label}**, ${userData.name}:`)
        const getTitle = (s) => svcText(isTe ? 'te' : 'en', s.title)
        if (await listCategory(match.category)) return 'stay'
        await addBot(match.services.slice(0, 5).map(s => `• ${getTitle(s)}`).join('\n'), 700)
        addAction(`/services#${match.category}`, isTe ? `అన్ని ${label} బ్రౌజ్ చేయండి` : `Browse All ${label}`)
      } else if (match.type === 'fuzzyList') {
        const isTe = language === 'te'
        await addBot(isTe ? `మీ కోసం నేను కనుగొన్నది ఇక్కడ ఉంది, ${userData.name}:` : `Here's what I found for you, ${userData.name}:`)
        const getTitle = (s) => svcText(isTe ? 'te' : 'en', s.title)
        const picks = match.services.filter(s => s.category !== 'supplies').slice(0, 6)
        setQuickReplies(picks.map(s => ({ label: getTitle(s), value: itemValue(s) })))
        await addBot(isTe ? 'ఒకటి నొక్కండి — దశలవారీగా తీసుకెళ్తాను.' : 'Tap one and I\'ll take you step by step.', 500)
        return 'stay'
      }
      const isTe = language === 'te'
      await addBot(isTe ? `నేను ఇంకా ఏమైనా సహాయం చేయగలనా, ${userData.name}? 😊` : `Is there anything else I can help with, ${userData.name}? 😊`, 900)
      return 'done'
    }
    // 3b. Telugu words from the services' Telugu names ("పహాణీ") — one service: its steps; a few: which one?
    const teItems = findTeluguWord(value).map((id) => findItem('service', id)).filter(Boolean)
    if (teItems.length === 1) { await startWizard({ kind: 'service', item: teItems[0] }); return 'flow' }
    if (teItems.length > 1 && teItems.length <= 8) {
      const L = lang()
      await addBot(L === 'te' ? `“${value.trim()}” — మీకు వీటిలో ఏది కావాలి?` : `“${value.trim()}” — which one do you need?`, 400)
      setQuickReplies(teItems.map((s) => ({ label: svcText(L, s.title), value: itemValue(s) })))
      return 'stay'
    }
    // 4. No match
    const isTe = language === 'te'
    await addBot(isTe ? `మీరు ఆ సమాచారాన్ని పంచుకున్నందుకు ధన్యవాదాలు, ${userData.name}. నాకు ఖచ్చితమైన మ్యాచ్ దొరకలేదు — కానీ పర్వాలేదు! 😊` : `I appreciate you sharing that, ${userData.name}. I wasn't able to find an exact match — but that's completely okay! 😊`)
    await addBot(isTe ? "మా నిపుణుల బృందం మీకు వ్యక్తిగతంగా సహాయం చేయగలదు. మిమ్మల్ని కనెక్ట్ చేస్తాను:" : "Our team of experts can personally assist you. Let me connect you:", 700)
    
    const fbParams = new Params()
    if (userData.name) fbParams.set('name', userData.name)
    if (userData.mobile) fbParams.set('phone', userData.mobile)
    
    const fallbackMsg = userData.purpose || value
    if (fallbackMsg) fbParams.set('message', `Hello, I need help with: ${fallbackMsg}`)
    
    addAction(`/contact${fbParams.toString() ? '?' + fbParams.toString() : ''}`, 'Talk to Our Team →')
    await addBot(`Or feel free to describe what you need differently — I'll do my best! 😊`, 900)
    return 'done'
  }

  // Indian mobile, or a number from abroad with + and the country code (NRIs)
  const validateMobile = (num) => readPhone(num).ok

  /* ─── Open the chat straight into one item's step-by-step request ─── */
  const openItem = async (kind, id) => {
    setIsOpen(true)
    pendingItemRef.current = { kind, id }
    const known = userData.name && validateMobile(String(userData.mobile || ''))
    if (known && step !== STEPS.ASK_LANGUAGE && step !== STEPS.ASK_NAME && step !== STEPS.ASK_MOBILE) {
      await startPendingItem()
    } else if (messages.length === 0) {
      await handleOpen()
    }
  }
  const startPendingItem = async () => {
    const p = pendingItemRef.current
    pendingItemRef.current = null
    if (!p) return false
    if (p.kind === 'picker') return startWizard({ picker: p.id })
    const item = findItem(p.kind, p.id)
    if (!item) return false
    return startWizard({ kind: p.kind, item })
  }

  /* ─── The main menu shown once we know who we are talking to ─── */
  const showPurposeMenu = async (lang, name) => {
    if (pendingItemRef.current && await startPendingItem()) return
    const isTe = lang === 'te'
    await addBot(isTe ? `ఇప్పుడు ${name}, నేను మీకు ఈ రోజు ఎలా సహాయం చేయగలను? దయచేసి క్రింద ఉన్న ఎంపికను ఎంచుకోండి లేదా మీకు ఏమి కావాలో టైప్ చేయండి:` : `Now ${name}, how can I help you today? Please choose an option below or type what you need:`, 700)
    // Only what the customer's city offers (Admin → Cities → Pages)
    setQuickReplies([
      { label: isTe ? '🏛️ సేవలు' : '🏛️ Services', value: 'Services' },
      isPageOn('supplies') && { label: isTe ? '📦 సామగ్రి' : '📦 Supplies', value: 'Supplies' },
      isPageOn('property') && { label: isTe ? '🏠 ఆస్తి' : '🏠 Property', value: 'Property' },
      { label: isTe ? '✈️ NRI / విదేశాల్లో' : '✈️ NRI / abroad', value: 'NRI' },
      isPageOn('youth') && { label: isTe ? '💼 పార్ట్-టైమ్' : '💼 Part-time Jobs', value: 'Part-time Jobs' },
      isPageOn('youth') && { label: isTe ? '🎓 వర్క్‌షాప్' : '🎓 Workshop', value: 'Workshop' },
      { label: isTe ? '❓ ఇతర' : '❓ Other', value: 'Other' }
    ].filter(Boolean))
    setStep(STEPS.ASK_PURPOSE)
  }

  /* ─── Open the Chat Buddy ───
     The website asks language, name and phone. The app already knows some of
     these (language from first open, name/phone when signed in) and skips them. */
  const handleOpen = async () => {
    setIsOpen(true)
    if (messages.length > 0) return
    if (!initialLanguage) {
      setStep(STEPS.ASK_LANGUAGE)
      setMessages([{ sender: 'bot', text: chatLocales['en'].selectLanguagePrompt + " / " + chatLocales['te'].selectLanguagePrompt }])
      setQuickReplies([{ label: 'English', value: 'en' }, { label: 'తెలుగు', value: 'te' }])
      return
    }
    const lang = initialLanguage === 'te' ? 'te' : 'en'
    const isTe = lang === 'te'
    setLanguage(lang)
    const name = (initialName || '').trim()
    const known = readPhone(initialMobile)
    const mobile = known.ok ? known.value : ''
    if (name && validateMobile(mobile)) {
      setUserData(prev => ({ ...prev, name, mobile }))
      await addBot(isTe ? `నమస్తే ${name}! 🙏 నేను మీ చాట్ బడ్డీని.` : `Namaste ${name}! 🙏 I'm your Chat Buddy.`, 400)
      await showPurposeMenu(lang, name)
    } else if (name) {
      setUserData(prev => ({ ...prev, name }))
      await addBot((chatLocales[lang].askMobile || '').replace('{name}', name), 400)
      setStep(STEPS.ASK_MOBILE)
    } else {
      await addBot(chatLocales[lang].askName, 400)
      setStep(STEPS.ASK_NAME)
    }
  }

  /* ═══ Main send handler ═══ */
  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return
    const value = inputValue.trim()
    setInputValue('')

    switch (step) {
      case STEPS.ASK_LANGUAGE: {
        addUser(value)
        const lang = value.toLowerCase().includes('te') || value.includes('తెలుగు') ? 'te' : 'en'
        setLanguage(lang)
        await addBot(chatLocales[lang].askName, 700)
        setStep(STEPS.ASK_NAME)
        break
      }
      case STEPS.GREETING: {
        addUser(value)
        const result = await handleQuery(value)
        if (result === 'stay') {
          // If greeting matched, ask for name
          await addBot("To get started, may I know your good name? 😊", 700)
          setStep(STEPS.ASK_NAME)
        } else if (result === 'flow' || result === 'check_docs') {
          // They jumped straight to a service or doc check
        } else {
          setStep(STEPS.RESULT)
        }
        break
      }
      case STEPS.ASK_NAME: {
        addUser(value)
        // --- Name validation ---
        const nameVal = value.trim()
        // Must only contain letters, spaces, and dots (for initials like "K. Megha")
        if (!/^[A-Za-z][A-Za-z.\s'-]{1,40}$/.test(nameVal)) {
          await addBot(language === 'te' ? 'దయచేసి మీ నిజమైన పేరు చెప్పండి.' : 'Please share your real name.')
          return
        }
        // Must be at least 2 characters
        if (nameVal.replace(/\s/g, '').length < 2) {
          await addBot(language === 'te' ? 'దయచేసి మీ పూర్తి పేరు చెప్పండి.' : 'Please share your full name.')
          return
        }
        // Reject common service-related words used as names
        const bannedNames = [
          'education', 'birth', 'certificate', 'marriage', 'income', 'caste', 'passport',
          'licence', 'driving', 'vehicle', 'property', 'tax', 'trade', 'building',
          'startup', 'company', 'court', 'legal', 'lawyer', 'driver', 'chef', 'makeup',
          'tuition', 'tutor', 'college', 'admission', 'school', 'help', 'service',
          'services', 'contact', 'about', 'workshop', 'job', 'jobs', 'registration',
          'hello', 'hi', 'hey', 'yes', 'no', 'ok', 'okay', 'bye', 'thanks',
          'test', 'asdf', 'qwerty', 'abc', 'xyz', 'aaa', 'bbb', 'name'
        ]
        if (bannedNames.includes(nameVal.toLowerCase())) {
          await addBot(`"${nameVal}" looks like a service or keyword, not a name! 😄 I'd love to know your real name so I can assist you personally. What should I call you?`)
          return
        }
        // --- Name is valid ---
        const displayName = nameVal.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
        setUserData(prev => ({ ...prev, name: displayName }))
        await addBot((chatLocales[language || 'en'].askMobile || '').replace('{name}', displayName))
        // Removed double prompt
        setStep(STEPS.ASK_MOBILE)
        break
      }
      case STEPS.ASK_MOBILE: {
        addUser(value)
        if (!validateMobile(value)) {
          await addBot(chatLocales[language || 'en'].invalidMobile)
          return
        }
        setUserData(prev => ({ ...prev, mobile: readPhone(value).value }))
        
        const isTe = language === 'te'
        await addBot(isTe ? 'అద్భుతం, ధన్యవాదాలు! ✅ మీ వివరాలు నమోదు చేయబడ్డాయి.' : 'Perfect, thank you! ✅ Your details are noted.')
        await showPurposeMenu(language, userData.name)
        break
      }
      case STEPS.ASK_PURPOSE: {
        setQuickReplies([])
        addUser(value)
        setUserData(prev => ({ ...prev, purpose: value }))
        const result = await handleQuery(value)
        if (result === 'CONFUSED' || result === 'SHOW_CATEGORIES') {
           setQuickReplies(getCategoryQuickReplies(language))
        }
        else if (result === 'stay') { /* stay on ASK_PURPOSE */ }
        else if (result === 'flow' || result === 'check_docs') { /* already handled */ }
        else { setStep(STEPS.RESULT) }
        break
      }
      case STEPS.GUIDED_FLOW: {
        // User typed a free-text answer during a guided flow
        const q = activeFlow?.questions[flowStep]
        if (!q) break
        if (q.freeText || q.options?.length === 0 || (!q.options && !q.optionsByPrev)) {
          let validatedValue = value
          
          if (q.key === 'location') {
            if (flowAnswers.pendingTownForArea) {
                const town = flowAnswers.pendingTownForArea
                validatedValue = `${town} - ${value}`
                
                const newAnswers = { ...flowAnswers, [q.key]: validatedValue }
                delete newAnswers.pendingTownForArea
                
                addUser(value)
                setQuickReplies([])
                setFlowAnswers(newAnswers)
                await advanceFlow(newAnswers)
                return
            }

            const inputLower = value.toLowerCase()
            
            const matchedOption = quickReplies?.find(opt => opt.label.toLowerCase() === inputLower || opt.value.toLowerCase() === inputLower)
            const isAskingForArea = quickReplies?.some(opt => typeof opt.value === 'string' && opt.value.startsWith('__OTHER_AREA__'))
            
            if (matchedOption) {
              if (matchedOption.value.startsWith('__OTHER_AREA__')) {
                 // Trigger the quick reply logic manually if they typed "other" instead of clicking it
                 await handleQuickReply(matchedOption)
                 return
              }
              validatedValue = matchedOption.value
              if (validatedValue.includes('Outside Prakasam')) {
                 addUser(value)
                 await addBot(`Understood! We'll do our absolute best to assist you outside our primary network. 😊`, 700)
              } else {
                 addUser(matchedOption.label)
              }
            } else if (isAskingForArea) {
              // User typed a custom area directly instead of clicking 'Other'
              const townName = quickReplies.find(opt => opt.value.startsWith('__OTHER_AREA__')).value.split('__OTHER_AREA__')[1]
              validatedValue = `${townName} - ${value}`
              
              addUser(value)
              setQuickReplies([])
              const newAnswers = { ...flowAnswers, [q.key]: validatedValue }
              setFlowAnswers(newAnswers)
              await advanceFlow(newAnswers)
              return
            } else {
              addUser(value)
              
              const foundLocation = knownPlaces().find(loc => inputLower.includes(loc.name))
              
              if (foundLocation) {
                const formattedLoc = foundLocation.name.charAt(0).toUpperCase() + foundLocation.name.slice(1)
                
                // If the user already provided specific details (like 'Ward X', 'Nagar', 'Road', etc.)
                const extraText = inputLower.replace(foundLocation.name, '').trim()
                const hasSpecifics = extraText.includes('ward') || extraText.includes('nagar') || extraText.includes('pet') || extraText.includes('road') || extraText.includes('colony') || extraText.includes('village') || extraText.includes('mandal') || extraText.length >= 3;
                
                if (hasSpecifics) {
                   validatedValue = value; // Keep exactly what they typed
                } else {
                    let areas = foundLocation.areas || []
                    if (areas.length === 0) {
                       areas = [`${formattedLoc} Center`, 'Near Bus Stand', 'Surrounding Villages']
                    }
                    
                    const quickReplyOptions = areas.map(a => ({ label: a, value: `${formattedLoc} - ${a}` }))
                    quickReplyOptions.push({ label: 'Other / Specific Ward', value: `__OTHER_AREA__${formattedLoc}` })
                    
                    await addBot(chatLocales[language || 'en'].selectSpecificArea.replace('{loc}', formattedLoc), 700)
                    setQuickReplies(quickReplyOptions)
                    return // Force area selection
                }
              } else {
                 if (inputLower.includes('outside prakasam') || activeFlow.serviceCategory === 'supplies') {
                   if (activeFlow.serviceCategory === 'supplies') {
                     await addBot(`Got it! We mainly deliver within Prakasam District — our team will confirm if we can reach you. 😊`, 700)
                   } else {
                     await addBot(`Understood! We'll do our absolute best to assist you outside our primary network. 😊`, 700)
                   }
                 } else if (inputLower === 'no') {
                   await addBot(`Okay, could you please specify your exact Mandal or Town in Prakasam District? 🗺️`, 700)
                   setQuickReplies(townQuickReplies().map((o) => ({ ...o, label: o.value })))
                   return // Force town entry
                 } else {
                   await addBot(`"${value}" appears to be outside our primary network (Prakasam District). Would you like to proceed anyway?`, 700)
                   setQuickReplies([
                     { label: '✅ Yes, proceed', value: value + ' (Outside Prakasam)' },
                     { label: '❌ No, re-enter location', value: 'No' }
                   ])
                   return // Wait for Yes/No
                 }
              }
            }
          } else {
             addUser(value)
          }

          setQuickReplies([])
          const newAnswers = { ...flowAnswers, [q.key]: validatedValue }
          setFlowAnswers(newAnswers)
          await advanceFlow(newAnswers)
        } else {
          // User typed instead of tapping a button — smart match with aliases
          const matchedOption = smartMatchOption(value, quickReplies || [])
          if (matchedOption) {
            await handleQuickReply(matchedOption)
          } else {
            addUser(value)
            await addBot(`I didn't quite catch that, ${userData.name}. Could you please select one of the options above, or try a different word? 😊`)
          }
        }
        break
      }
      case STEPS.WIZARD: {
        await wizardAnswer(null, value)
        break
      }
      case STEPS.CHECK_DOCS: {
        addUser(value)
        const isTe = language === 'te'
        const isYes = value.toLowerCase().match(/yes|yeah|yup|ok|sure|have|అవును|ఉన్నాయి/)
        let finalRoute = pendingAction.route
        if (isYes) {
          await addBot(isTe ? 'అద్భుతం! మీ అభ్యర్థనను కొనసాగిద్దాం.' : 'Great! Let\'s proceed with your request.', 700)
        } else {
          await addBot(isTe ? 'పర్వాలేదు! మా బృందం మీకు తప్పిపోయిన పత్రాలను ఏర్పాటు చేయడంలో సహాయపడుతుంది. అభ్యర్థనను సమర్పిద్దాం.' : 'No worries! Our team can assist you in arranging the missing documents. Let\'s submit your request.', 700)
          
          const [path, search] = pendingAction.route.split('?')
          const p = new Params(search || '')
          const oldMsg = p.get('message') || ''
          const suffix = isTe ? '\n\nగమనిక: నా వద్ద కొన్ని పత్రాలు లేవు, వాటిని సిద్ధం చేయడానికి నాకు సహాయం కావాలి.' : '\n\nNote: I am missing some required documents and need assistance with them.'
          p.set('message', oldMsg + suffix)
          finalRoute = `${path}?${p.toString()}`
        }
        addAction(finalRoute, pendingAction.label)
        setStep(STEPS.RESULT)
        break
      }
      case STEPS.RESULT: {
        setQuickReplies([])
        addUser(value)
        const result = await handleQuery(value, true)
        if (result === 'CONFUSED' || result === 'SHOW_CATEGORIES') {
           setQuickReplies(getCategoryQuickReplies(language))
        }
        // stays in RESULT step for further queries
        break
      }
      default:
        break
    }
  }

  const handleNavigate = (route) => { navigateTo && navigateTo(route); setIsOpen(false) }


  const getPlaceholder = () => {
    if (step === STEPS.GUIDED_FLOW) {
      const q = activeFlow?.questions[flowStep]
      if (q?.freeText) return q.placeholder || 'Type your answer...'
      if (quickReplies.length > 0) return 'Tap an option above or type...'
      return 'Type your answer...'
    }
    if (step === STEPS.WIZARD) return language === 'te' ? 'ఎంచుకోండి లేదా టైప్ చేయండి...' : 'Tap an option or type your answer...'
    switch (step) {
      case STEPS.ASK_NAME: return 'Type your name...'
      case STEPS.ASK_MOBILE: return 'e.g. 9876543210 or +1 415 555 0100'
      case STEPS.ASK_PURPOSE: return 'e.g. birth certificate, home tuition...'
      case STEPS.CHECK_DOCS: return language === 'te' ? 'అవును లేదా లేదు అని టైప్ చేయండి...' : 'Type yes or no...'
      case STEPS.RESULT: return 'Ask me anything else...'
      default: return 'Type a message...'
    }
  }

  return {
    STEPS, step, language, messages, inputValue, setInputValue, isTyping, quickReplies, userData,
    isOpen, setIsOpen, pulse, activeFlow, flowStep,
    handleOpen, handleSend, handleQuickReply, handleNavigate, triggerFlow, getPlaceholder, openItem,
  }
}
