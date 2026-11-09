/**
 * Cities — where iN Empower works. Shared by the website, the app (copied with
 * `npm run sync-data`) and the admin portal.
 *
 * Built in: Ongole (Prakasam District). In Admin → Cities the team adds a city
 * (for example Mysuru), its towns, phone / WhatsApp numbers and which services,
 * supplies and workshops it offers. That list is saved in catalog_items
 * (kind 'settings', item 'cities'); applyCatalog() passes it to setCities()
 * before the first page or screen is drawn.
 *
 * The customer's city is chosen on the first visit — by hand, or found from the
 * phone's location with permission (the location is used on the device only to
 * find the nearest city and town; it is never sent or saved).
 */
import { phoneForLinks, showPhone } from './phone.js'

const clone = (x) => JSON.parse(JSON.stringify(x))

/** The company's main office (used when a city has no number of its own). */
export const COMPANY = {
  phone: '+91 83285 55396',
  whatsapp: '+91 83285 55396',
  address: 'Ongole, Prakasam District, Andhra Pradesh',
}

/*
 * Prakasam towns. lat / lng = approximate town centre (good to ~2 km), used only to
 * find the town nearest to a customer. quick = shown as a button in the Chat Buddy
 * and the Local Buddy application. areas = localities the Chat Buddy offers.
 */
const PRAKASAM_TOWNS = [
  { name: 'Ongole', te: 'ఒంగోలు', lat: 15.5057, lng: 80.0499, quick: true, areas: ['Mangamoor Road', 'Gandhi Road', 'Lawyer Pet', 'Bhagya Nagar', 'Santhapet', 'Kurnool Road'] },
  { name: 'Kandukur', te: 'కందుకూరు', lat: 15.216, lng: 79.904, quick: true, areas: ['Prakasam Road', 'RTC Bus Stand Area', 'TRR Township', 'Revenue Colony'] },
  { name: 'Addanki', te: 'అద్దంకి', lat: 15.8112, lng: 79.9726, quick: true, areas: ['Bhavani Center', 'Singarakonda Road', 'RTC Bus Stand'] },
  { name: 'Chimakurthy', te: 'చీమకుర్తి', lat: 15.5822, lng: 79.8681, quick: true, areas: ['Granite Hub Area', 'Main Road', 'Bypass Road'] },
  { name: 'Darsi', te: 'దర్శి', lat: 15.769, lng: 79.6797, quick: true },
  { name: 'Singarayakonda', te: 'సింగరాయకొండ', lat: 15.247, lng: 80.028, quick: true },
  { name: 'Kothapatnam', te: 'కొత్తపట్నం', lat: 15.44, lng: 80.15, quick: true, areas: ['Beach Road', 'Pallipalem', 'Gundamala', 'Ethamukkala', 'Madanur'] },
  { name: 'Markapur', te: 'మార్కాపురం', lat: 15.7356, lng: 79.2697, quick: true, areas: ['Chenna Kesava Swamy Temple Area', 'Railway Station Area', 'College Road', 'RTC Bus Stand'] },
  { name: 'Chirala', te: 'చీరాల', lat: 15.8237, lng: 80.3522, quick: true, areas: ['Clock Tower Center', 'Vodarevu', 'Perala', 'Epurupalem', 'Pandaripuram'] },
  { name: 'Podili', te: 'పొదిలి', lat: 15.6046, lng: 79.608, quick: true },
  { name: 'Kanigiri', te: 'కనిగిరి', lat: 15.4061, lng: 79.5084, quick: true },
  { name: 'Giddalur', te: 'గిద్దలూరు', lat: 15.378, lng: 78.9256, quick: true },
  { name: 'Tangutur', te: 'టంగుటూరు', lat: 15.341, lng: 80.039 },
  { name: 'Kondapi', te: 'కొండపి', lat: 15.43, lng: 79.73 },
  { name: 'Martur', te: 'మార్టూరు', lat: 15.9893, lng: 80.1063 },
  { name: 'Parchur', te: 'పర్చూరు', lat: 15.9667, lng: 80.2733 },
  { name: 'Cumbum', te: 'కంభం', lat: 15.58, lng: 79.11 },
  { name: 'Yerragondapalem', te: 'యర్రగొండపాలెం', lat: 16.0397, lng: 79.3065 },
  { name: 'Ulavapadu', te: 'ఉలవపాడు', lat: 15.17, lng: 80.01 },
  { name: 'Naguluppalapadu', te: 'నాగులుప్పలపాడు', lat: 15.61, lng: 80.14 },
  { name: 'Maddipadu', te: 'మద్దిపాడు', lat: 15.63, lng: 80.04 },
  { name: 'Santhanuthalapadu', te: 'సంతనూతలపాడు', lat: 15.545, lng: 79.975 },
  { name: 'Inkollu', te: 'ఇంకొల్లు', lat: 15.83, lng: 80.19 },
  { name: 'Chinaganjam', te: 'చినగంజాం', lat: 15.697, lng: 80.242 },
  { name: 'Pamur', te: 'పామూరు', lat: 15.095, lng: 79.411 },
  { name: 'Tripuranthakam', te: 'త్రిపురాంతకం', lat: 16.0, lng: 79.455 },
  { name: 'Korisapadu', te: 'కొరిశపాడు' },
  { name: 'Zarugumilli', te: 'జరుగుమిల్లి' },
  { name: 'Marripudi', te: 'మర్రిపూడి' },
  { name: 'Ardhaveedu', te: 'అర్ధవీడు' },
  { name: 'Konakanamitla', te: 'కొనకనమిట్ల' },
  { name: 'Peda Araveedu', te: 'పెద్దారవీడు' },
  { name: 'Dornala', te: 'దోర్నాల' },
  { name: 'Pullalacheruvu', te: 'పుల్లలచెరువు' },
  { name: 'Kurichedu', te: 'కురిచేడు' },
  { name: 'Donakonda', te: 'దొనకొండ' },
  { name: 'Tarlupadu', te: 'తర్లుపాడు' },
  { name: 'Thallur', te: 'తాళ్ళూరు' },
  { name: 'Bestavaripeta', te: 'బేస్తవారిపేట' },
  { name: 'Komarolu', te: 'కొమరోలు' },
  { name: 'Voletivaripalem', te: 'వోలేటివారిపాలెం' },
  { name: 'Gudluru', te: 'గుడ్లూరు' },
  { name: 'Lingasamudram', te: 'లింగసముద్రం' },
]

export const EMPTY_HIDE = () => ({ services: [], supplies: [], workshops: [], pages: [] })

export const BUILT_IN_CITIES = [
  {
    id: 'ongole',
    status: 'live',
    name: 'Ongole', te: 'ఒంగోలు',
    region: 'Prakasam District', regionTe: 'ప్రకాశం జిల్లా',
    regionShort: 'Prakasam', regionShortTe: 'ప్రకాశం',
    state: 'Andhra Pradesh',
    center: { lat: 15.5057, lng: 80.0499 },
    radiusKm: 110,      // used only for towns without a map position
    townRadiusKm: 25,   // within this distance of one of our towns = inside this city
    phone: COMPANY.phone,
    whatsapp: COMPANY.whatsapp,
    address: COMPANY.address,
    towns: PRAKASAM_TOWNS,
    hide: EMPTY_HIDE(),
  },
]

/** The city whose names are written in the built-in text ("Prakasam District", "Ongole"). */
const TEXT_CITY = BUILT_IN_CITIES[0]
export const DEFAULT_CITY_ID = TEXT_CITY.id
export const CITY_STATUSES = ['live', 'soon', 'hidden']

/* ─────────────── Cleaning what the admin saved ─────────────── */
const str = (v, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const num = (v) => { const n = typeof v === 'string' ? parseFloat(v) : v; return Number.isFinite(n) ? n : null }
export const citySlug = (t) => String(t || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
const okLat = (v) => v !== null && v >= -90 && v <= 90
const okLng = (v) => v !== null && v >= -180 && v <= 180

function cleanTown(t) {
  if (!t) return null
  const name = str(typeof t === 'string' ? t : t.name, 60)
  if (!name) return null
  const lat = num(t.lat); const lng = num(t.lng)
  const out = { name }
  if (str(t.te, 60)) out.te = str(t.te, 60)
  if (okLat(lat) && okLng(lng)) { out.lat = lat; out.lng = lng }
  if (t.quick) out.quick = true
  const areas = Array.isArray(t.areas) ? t.areas.map((a) => str(a, 60)).filter(Boolean).slice(0, 20) : []
  if (areas.length) out.areas = areas
  return out
}

/** One city, tidied up (missing fields filled with safe values). */
export function cleanCity(c) {
  if (!c || typeof c !== 'object') return null
  const id = citySlug(c.id || c.name)
  const name = str(c.name, 60)
  if (!id || !name) return null
  const lat = num(c.center?.lat); const lng = num(c.center?.lng)
  const seen = new Set()
  const towns = (Array.isArray(c.towns) ? c.towns : []).map(cleanTown).filter((t) => t && !seen.has(t.name.toLowerCase()) && seen.add(t.name.toLowerCase()))
  const hide = EMPTY_HIDE()
  for (const k of Object.keys(hide)) hide[k] = Array.isArray(c.hide?.[k]) ? [...new Set(c.hide[k].map(String))] : []
  return {
    id,
    status: CITY_STATUSES.includes(c.status) ? c.status : 'live',
    name,
    te: str(c.te, 60),
    region: str(c.region, 80) || name,
    regionTe: str(c.regionTe, 80),
    regionShort: str(c.regionShort, 60) || str(c.region, 80).replace(/\s+district$/i, '') || name,
    regionShortTe: str(c.regionShortTe, 60),
    state: str(c.state, 60),
    center: okLat(lat) && okLng(lng) ? { lat, lng } : null,
    radiusKm: Math.min(300, Math.max(1, num(c.radiusKm) ?? 40)),
    townRadiusKm: Math.min(100, Math.max(1, num(c.townRadiusKm) ?? 20)),
    phone: str(c.phone, 20),
    whatsapp: str(c.whatsapp, 20),
    address: str(c.address, 160),
    towns,
    hide,
  }
}

/* ─────────────── The current list and the customer's city ─────────────── */
let state = { cities: clone(BUILT_IN_CITIES), defaultId: DEFAULT_CITY_ID, currentId: null, town: null }

/**
 * Use the list saved in Admin → Cities. Anything unusable keeps the built-in list,
 * so the website and app always have at least one working city.
 */
export function setCities(list, { defaultCity } = {}) {
  const cleaned = Array.isArray(list) ? list.map(cleanCity).filter(Boolean) : []
  const unique = cleaned.filter((c, i) => cleaned.findIndex((x) => x.id === c.id) === i)
  const cities = unique.some((c) => c.status === 'live') ? unique : clone(BUILT_IN_CITIES)
  const live = cities.filter((c) => c.status === 'live')
  const defaultId = live.some((c) => c.id === defaultCity) ? defaultCity : live[0].id
  state = { ...state, cities, defaultId }
  return cities
}

export const allCities = () => state.cities
export const liveCities = () => state.cities.filter((c) => c.status === 'live')
/** Cities shown in the city list: live ones, then "coming soon" ones. */
export const listedCities = () => [...liveCities(), ...state.cities.filter((c) => c.status === 'soon')]
export const cityById = (id) => state.cities.find((c) => c.id === id) || null
export const defaultCity = () => cityById(state.defaultId) || liveCities()[0] || BUILT_IN_CITIES[0]

/** The customer's city (the main city until they pick a live one). */
export function currentCity() {
  const c = cityById(state.currentId)
  return c && c.status === 'live' ? c : defaultCity()
}
/** Has the customer's saved city (still) got a live city behind it? */
export const isLiveCity = (id) => cityById(id)?.status === 'live'
/** The town found from the customer's location (or picked), if any. */
export function currentTown() {
  const c = currentCity()
  return state.town && (c.towns || []).some((t) => t.name === state.town) ? state.town : null
}

/**
 * Remember the customer's city (and nearest town). The id is kept even before the
 * admin's city list has loaded, so a saved "Mysuru" works from the first screen.
 * Returns the city in use.
 */
export function setCurrentCity(id, { town = null } = {}) {
  state.currentId = id ? String(id) : null
  state.town = town ? String(town) : null
  return currentCity()
}

/** More than one city to choose from? (decides whether to show the city chip) */
export const hasManyCities = () => listedCities().length > 1

/* ─────────────── Names in the customer's language ─────────────── */
export const cityName = (c = currentCity(), lang = 'en') => (lang === 'te' && c?.te) || c?.name || ''
export const regionName = (c = currentCity(), lang = 'en') => (lang === 'te' && c?.regionTe) || c?.region || ''
const STATE_TE = {
  'andhra pradesh': 'ఆంధ్రప్రదేశ్', telangana: 'తెలంగాణ', karnataka: 'కర్ణాటక', 'tamil nadu': 'తమిళనాడు',
  kerala: 'కేరళ', maharashtra: 'మహారాష్ట్ర', odisha: 'ఒడిశా',
}
export const stateName = (c = currentCity(), lang = 'en') => (lang === 'te' && STATE_TE[String(c?.state || '').toLowerCase()]) || c?.state || ''
export function townLabel(name, lang = 'en', c = currentCity()) {
  if (lang !== 'te') return name
  const t = (c?.towns || []).find((x) => x.name === name) || allTowns().find((x) => x.name === name)
  return t?.te || name
}

/** Quick town buttons for the current city, the customer's own town first. */
export function quickTowns(c = currentCity()) {
  const towns = c?.towns || []
  let quick = towns.filter((t) => t.quick)
  if (!quick.length) quick = towns.slice(0, 10)
  const mine = state.town && towns.find((t) => t.name === state.town)
  if (mine) quick = [mine, ...quick.filter((t) => t.name !== mine.name)]
  return quick
}

/** Every town of every city (for recognising a place someone typed). */
export const allTowns = () => state.cities.flatMap((c) => c.towns || [])

/** Places the Chat Buddy recognises when typed: { name (lower case), areas } */
export function chatPlaces(c = currentCity()) {
  return (c?.towns || []).map((t) => ({ name: t.name.toLowerCase(), areas: t.areas || [] }))
}

/**
 * Which city a place belongs to, from a town name inside the text
 * ("Ongole - Gandhi Road", "Kandukur", "Shop 4, Nanjangud") → city id, or null.
 */
export function cityOfPlace(text) {
  const s = String(text || '').toLowerCase()
  if (!s.trim()) return null
  let best = null
  for (const c of state.cities) {
    for (const t of c.towns || []) {
      const n = t.name.toLowerCase()
      const at = s.search(new RegExp(`(^|[^a-z])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z])`))
      if (at !== -1 && (!best || n.length > best.len)) best = { id: c.id, len: n.length }
    }
  }
  return best ? best.id : null
}

/** Is this place in the customer's city? Places we can't place count for the main city. */
export function inCurrentCity(text, c = currentCity()) {
  const id = cityOfPlace(text)
  return id ? id === c.id : c.id === defaultCity().id
}

/* ─────────────── Location → nearest city and town ─────────────── */
const R = 6371
const rad = (d) => (d * Math.PI) / 180
/** Distance in km between two { lat, lng } points. */
export function distanceKm(a, b) {
  if (!a || !b) return Infinity
  const dLat = rad(b.lat - a.lat); const dLng = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

/**
 * Where is the customer? Uses only the cities' own town positions — no map service.
 * Returns { inside, city, town, km, nearest: { city, km }, soon }:
 *   inside — true when they are in (or near one of the towns of) a live city
 *   soon   — a "coming soon" city they are in, if any
 */
/** Roughly inside India? (a box around the country — used only to say "Living abroad?") */
export function inIndia(lat, lng) {
  const la = num(lat); const ln = num(lng)
  if (!okLat(la) || !okLng(ln)) return true
  return la >= 6.5 && la <= 35.7 && ln >= 68 && ln <= 97.5
}

export function locate(lat, lng, cities = state.cities) {
  const here = { lat: num(lat), lng: num(lng) }
  const empty = { inside: false, city: null, town: null, km: null, nearest: null, soon: null }
  if (!okLat(here.lat) || !okLng(here.lng)) return empty
  let best = null
  let nearest = null
  for (const c of cities) {
    if (c.status === 'hidden') continue
    const placed = (c.towns || []).filter((t) => okLat(num(t.lat)) && okLng(num(t.lng)))
    let town = null; let km = Infinity
    for (const t of placed) {
      const d = distanceKm(here, t)
      if (d < km) { km = d; town = t.name }
    }
    const centreKm = c.center ? distanceKm(here, c.center) : Infinity
    const inside = km <= c.townRadiusKm || (!placed.length && centreKm <= c.radiusKm)
    const dist = Math.min(km, centreKm)
    if (c.status === 'live' && (!nearest || dist < nearest.km)) nearest = { city: c, km: Math.round(dist) }
    if (inside && (!best || dist < best.dist)) best = { city: c, town: km <= c.townRadiusKm ? town : null, dist }
  }
  if (!best) return { ...empty, nearest }
  if (best.city.status === 'soon') return { ...empty, nearest, soon: best.city }
  return { inside: true, city: best.city, town: best.town, km: Math.round(best.dist), nearest, soon: null }
}

/** "15.5057, 80.0499" or a Google Maps link → { lat, lng } (or null). For the admin portal. */
export function parseLatLng(text) {
  const s = String(text || '')
  const pats = [
    /@(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)/, // …/@15.5057,80.0499,14z
    /!3d(-?\d{1,2}\.\d+)!4d(-?\d{1,3}\.\d+)/, // …!3d15.50!4d80.04
    /[?&](?:q|query|ll|center|destination)=(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)/, // ?q=15.5,80.0
    /^\s*(-?\d{1,2}(?:\.\d+)?)\s*[,\s]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/, // 15.5057, 80.0499
  ]
  for (const p of pats) {
    const m = s.match(p)
    if (m) {
      const lat = parseFloat(m[1]); const lng = parseFloat(m[2])
      if (okLat(lat) && okLng(lng)) return { lat: Math.round(lat * 1e5) / 1e5, lng: Math.round(lng * 1e5) / 1e5 }
    }
  }
  return null
}

/* ─────────────── Services, supplies and workshops offered in a city ─────────────── */
/** kind: 'services' | 'supplies' | 'workshops' | 'pages' */
export function isOffered(kind, id, c = currentCity()) {
  const list = c?.hide?.[kind]
  return !(Array.isArray(list) && list.includes(String(id)))
}

/* ─────────────── Whole pages a city can switch off (Admin → Cities → Pages) ─────────────── */
/*
 * Some pages were written for Ongole and Andhra Pradesh (property rules, tours from
 * Ongole). A new city can switch them off until it has its own; customers there see
 * "not in your city yet" with the city's phone number, and the menus leave them out.
 * College Admissions and Home Tuitions follow their own service tick.
 */
export const CITY_PAGES = [
  { id: 'supplies', name: 'Supplies', te: 'సామగ్రి', plural: true, about: 'Building materials, events and catering from local suppliers', paths: ['/supplies'] },
  { id: 'property', name: 'Property', te: 'ఆస్తి', about: 'Buy, sell, rent — the guides follow Andhra Pradesh rules (IGRS, Meebhoomi)', paths: ['/property', '/invest'] },
  { id: 'travel', name: 'Travel', te: 'ప్రయాణం', about: 'Tours from Ongole (Tirupati, Srisailam, Vizag…) and vehicle rentals', paths: ['/travel'] },
  { id: 'youth', name: 'Youth Hub', te: 'యూత్ హబ్', about: 'Part-time jobs, workshops and “Post a job”', paths: ['/youth-hub', '/youth-jobs', '/workshop', '/workshops', '/post-job'] },
  { id: 'tutor', name: 'Tutor', te: 'ట్యూటర్', about: 'Why each government document matters', paths: ['/tutor'] },
]
const SERVICE_PAGES = {
  '/college-admissions': { id: 'college-admissions', name: 'College Admissions', te: 'కాలేజీ అడ్మిషన్లు' },
  '/home-tuitions': { id: 'home-tuitions', name: 'Home Tuitions', te: 'హోమ్ ట్యూషన్లు' },
}
const cleanPath = (path) => String(path || '').split(/[?#]/)[0].replace(/\/+$/, '') || '/'

/** Is this whole page on in the city? id: 'supplies' | 'property' | 'travel' | 'youth' | 'tutor' */
export const isPageOn = (id, c = currentCity()) => isOffered('pages', id, c)

/** The switchable page behind a link: { kind: 'pages' | 'services', id, name, te }, or null. */
export function pageForPath(path) {
  const p = cleanPath(path)
  const page = CITY_PAGES.find((x) => x.paths.includes(p))
  if (page) return { kind: 'pages', id: page.id, name: page.name, te: page.te, plural: !!page.plural }
  return SERVICE_PAGES[p] ? { kind: 'services', ...SERVICE_PAGES[p] } : null
}

/** Is the page behind a link (website path or Chat Buddy link, e.g. "/youth-hub?tab=jobs") open in the city? */
export function isPathOn(path, c = currentCity()) {
  const page = pageForPath(path)
  return !page || isOffered(page.kind, page.id, c)
}

/* ─────────────── Phone numbers of the customer's city ─────────────── */
export const teamPhone = (c = currentCity()) => c?.phone || COMPANY.phone
export const teamWhatsApp = (c = currentCity()) => c?.whatsapp || c?.phone || COMPANY.whatsapp
export const teamPhoneShown = (c = currentCity()) => showPhone(teamPhone(c))
export const telHref = (c = currentCity()) => `tel:+${phoneForLinks(teamPhone(c))}`
// The full api.whatsapp.com address: the short wa.me link breaks emojis (🙏 → "�") on its redirect
export const waHref = (text, c = currentCity()) =>
  `https://api.whatsapp.com/send?phone=${phoneForLinks(teamWhatsApp(c))}${text ? `&text=${encodeURIComponent(text)}` : ''}`
export const cityAddress = (c = currentCity()) => c?.address || [c?.name, c?.region, c?.state].filter(Boolean).join(', ')

/* ─────────────── Place names inside the built-in text ─────────────── */
/*
 * The built-in English and Telugu text was written for Ongole / Prakasam District.
 * For another city the place names are swapped when the text is shown
 * ("across Prakasam District" → "across Mysuru District"). Nothing changes for Ongole.
 */
let swapFor = null
let swapRe = null
let swapMap = null
function buildSwap(c) {
  const join = (...parts) => parts.filter(Boolean).join(', ')
  const pairs = [
    // "Ongole, Andhra Pradesh" (footer) → "Mysuru, Karnataka"
    ['Ongole, Andhra Pradesh', join(c.name, stateName(c))],
    ['Prakasam District, Andhra Pradesh', join(c.region, stateName(c))],
    ['ఒంగోలు, ఆంధ్రప్రదేశ్', join(c.te || c.name, stateName(c, 'te'))],
    ['Ongole, Prakasam District', `${c.name}, ${c.region}`],
    ['Ongole, Prakasam', c.name === c.regionShort ? c.name : `${c.name}, ${c.regionShort}`],
    ['ఒంగోలు, ప్రకాశం', (c.te || c.name) === (c.regionShortTe || c.regionShort) ? (c.te || c.name) : `${c.te || c.name}, ${c.regionShortTe || c.regionShort}`],
    ['Prakasam District', c.region], ['Prakasam district', c.region], ['Prakasam Dt.', c.region],
    ['ప్రకాశం జిల్లా', c.regionTe || c.region],
    ['Prakasam', c.regionShort], ['ప్రకాశం', c.regionShortTe || c.regionShort],
    ['Ongole', c.name], ['ఒంగోలు', c.te || c.name],
  ].filter(([from, to]) => from && to && from !== to)
  swapMap = new Map(pairs)
  swapRe = pairs.length ? new RegExp(pairs.map(([f]) => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g') : null
  swapFor = c
}

/** Text shown to customers, with the place names of their city. */
export function placeText(s) {
  if (typeof s !== 'string' || !s) return s
  const c = currentCity()
  if (!c || c.id === TEXT_CITY.id) return s
  if (swapFor !== c) buildSwap(c)
  return swapRe ? s.replace(swapRe, (m) => swapMap.get(m) ?? m) : s
}

/** placeText for every string inside an object / array (page text bundles). */
export function placeDeep(v) {
  if (typeof v === 'string') return placeText(v)
  if (Array.isArray(v)) return v.map(placeDeep)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, placeDeep(x)]))
  return v
}
