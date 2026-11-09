import { svcText } from '../../data/servicesTe'
import { partnerAnswers, partnerDetails, townOnly } from '../../data/partnerPrivacy'
import { ist, istFull, istDate, istTime, istWhen, addDays, greeting, isWorkingTime, isEmergency, nextOpening, dayWords } from '../../data/workHours'
import { cityById, defaultCity, teamPhoneShown } from '../../data/cities'
import { phoneForLinks as linkDigits, showPhone } from '../../data/phone'

/** The city of a request (older requests have none: the main city). */
export const cityOfRequest = (e) => cityById(e?.details?.city) || defaultCity()
/** Phone number customers of that city call / WhatsApp. */
export const cityPhoneFor = (e) => teamPhoneShown(cityOfRequest(e))
// Shared labels, colours and helpers for the team admin panel.

export const STATUSES = [
  { key: 'new', label: 'New', color: '#C2410C', bg: '#FFF0E5' },
  { key: 'contacted', label: 'Contacted', color: '#1D4ED8', bg: '#E0EAFF' },
  { key: 'in_progress', label: 'In progress', color: '#000080', bg: '#E5E5F2' },
  { key: 'completed', label: 'Completed', color: '#0F6B06', bg: '#E7F3E6' },
  { key: 'cancelled', label: 'Cancelled', color: '#475569', bg: '#F1F5F9' },
]
export const OPEN_STATUSES = ['new', 'contacted', 'in_progress']
export const statusInfo = (key) => STATUSES.find((s) => s.key === key) || STATUSES[0]

/* ── Work stages (one ticket moves through these) ──
   Each stage also sets the simple status the customer sees. */
export const STAGES = [
  { key: 'new', label: 'New', supply: 'New', status: 'new', color: '#C2410C', bg: '#FFF0E5', hint: 'Not called yet' },
  { key: 'called', label: 'Called customer', supply: 'Called customer', status: 'contacted', color: '#1D4ED8', bg: '#E0EAFF', hint: 'Understood what they need' },
  { key: 'partner', label: 'Checking with partner', supply: 'Checking with partner', status: 'in_progress', color: '#6D28D9', bg: '#EDE9FE', hint: 'Asked the Business Partner for price / availability' },
  { key: 'quote', label: 'Quote shared', supply: 'Price shared', status: 'in_progress', color: '#9A3412', bg: '#FFEDD5', hint: 'Customer has the price, waiting for yes' },
  { key: 'confirmed', label: 'Customer confirmed', supply: 'Order confirmed', status: 'in_progress', color: '#0E7490', bg: '#CFFAFE', hint: 'Customer said yes' },
  { key: 'working', label: 'Work in progress', supply: 'Out for delivery', status: 'in_progress', color: '#000080', bg: '#E5E5F2', hint: 'Partner / buddy is doing it' },
  { key: 'completed', label: 'Completed', supply: 'Delivered', status: 'completed', color: '#0F6B06', bg: '#E7F3E6', hint: 'Done — customer happy' },
  { key: 'cancelled', label: 'Cancelled', supply: 'Cancelled', status: 'cancelled', color: '#475569', bg: '#F1F5F9', hint: 'Not going ahead' },
]
export const OPEN_STAGES = ['new', 'called', 'partner', 'quote', 'confirmed', 'working']
const STATUS_TO_STAGE = { new: 'new', contacted: 'called', in_progress: 'partner', completed: 'completed', cancelled: 'cancelled' }
export const stageKey = (e) => e.stage || STATUS_TO_STAGE[e.status] || 'new'
export const isSupply = (e) => e?.details?.kind === 'supply' || e?.service === 'supplies'
export function stageInfo(e) {
  if (isJobApplication(e)) return jobStepInfo(e)
  const s = STAGES.find((x) => x.key === stageKey(e)) || STAGES[0]
  return { ...s, label: isSupply(e) ? s.supply : s.label }
}

/* ── Part-time job applications (service 'part-time') ──
   They live under Part-time jobs, with hiring steps instead of the work stages.
   Steps are saved as stages, so the customer sees: Sent → Called → In progress → Done. */
export const isJobApplication = (e) => e?.service === 'part-time'
export const JOB_STEPS = [
  { key: 'new', label: 'Applied', status: 'new', color: '#C2410C', bg: '#FFF0E5', hint: 'Not called yet' },
  { key: 'called', label: 'Called applicant', status: 'contacted', color: '#1D4ED8', bg: '#E0EAFF', hint: 'Checked they suit the job' },
  { key: 'working', label: 'Sent to employer', status: 'in_progress', color: '#000080', bg: '#E5E5F2', hint: 'Name and number shared with the business' },
  { key: 'completed', label: 'Hired', status: 'completed', color: '#0F6B06', bg: '#E7F3E6', hint: 'Got the job' },
  { key: 'cancelled', label: 'Not selected', status: 'cancelled', color: '#475569', bg: '#F1F5F9', hint: 'Not going ahead' },
]
const JOB_STEP_OF_STAGE = { new: 'new', called: 'called', partner: 'working', quote: 'working', confirmed: 'working', working: 'working', completed: 'completed', cancelled: 'cancelled' }
export const jobStepKey = (e) => JOB_STEP_OF_STAGE[stageKey(e)] || 'new'
export const jobStepInfo = (e) => JOB_STEPS.find((x) => x.key === jobStepKey(e)) || JOB_STEPS[0]

const jobNorm = (t) => String(t || '').toLowerCase().replace(/\s+/g, ' ').trim()
/** The job post an application is for: by its id (new applications), else by the job title (older ones). */
export function jobFor(e, jobs = []) {
  const id = e?.details?.jobId
  if (id) {
    const j = jobs.find((x) => String(x.id) === String(id))
    if (j) return j
  }
  const title = jobNorm(e?.item || e?.sub_service)
  const same = jobs.filter((j) => jobNorm(j.job_title) === title)
  if (same.length <= 1) return same[0] || null
  const msg = jobNorm(e.message)
  return same.find((j) => j.business_name && msg.includes(jobNorm(j.business_name))) || same[0]
}
/** "Shop Assistant at Snooker (Ongole, ₹80/hr)" */
export const jobLine = (job) => (job ? `${job.job_title}${job.business_name ? ` at ${job.business_name}` : ''}${job.location || job.pay_per_hour != null ? ` (${[job.location, job.pay_per_hour != null ? `₹${job.pay_per_hour}/hr` : ''].filter(Boolean).join(', ')})` : ''}` : '')

/** Message to the employer with the applicant's details (only after we have called the applicant) */
export function employerMessage(e, job) {
  const ref = e.details?.ref || String(e.id).slice(0, 8).toUpperCase()
  return [
    `${hello('')} This is iN Empower.`,
    `An applicant for your part-time job${job ? ` "${job.job_title}"` : ''}:`,
    `Name: ${e.name}`,
    `Phone: ${showPhone(e.phone)}`,
    e.area ? `Area: ${e.area}` : '',
    `Ref: ${ref}`,
    `We have spoken to them. Please call them for an interview and tell us how it goes. Thank you! — Team iN Empower`,
  ].filter(Boolean).join('\n')
}
/** Messages to the applicant at each step (English + Telugu) */
export function applicantMessage(step, e, job) {
  const what = job ? `${job.job_title}${job.business_name ? ` (${job.business_name})` : ''}` : (e.item || prettify(e.sub_service) || 'part-time job')
  const ref = e.details?.ref ? ` (Ref ${e.details.ref})` : ''
  const M = {
    called: [`Thank you for applying for the ${what} job${ref}. We will share your details with the employer and let you know.`,
      `${what} ఉద్యోగానికి దరఖాస్తు చేసినందుకు ధన్యవాదాలు${ref}. మీ వివరాలు యజమానికి పంపి, మీకు తెలియజేస్తాము.`],
    working: [`We have shared your name and number with the employer for the ${what} job${ref}. They will call you for an interview. Please keep your phone with you.`,
      `${what} ఉద్యోగం కోసం మీ పేరు, నంబర్ యజమానికి పంపాము${ref}. ఇంటర్వ్యూ కోసం వారు మీకు ఫోన్ చేస్తారు. ఫోన్ దగ్గర ఉంచుకోండి.`],
    completed: [`Congratulations on getting the ${what} job${ref}! 🎉 All the best — tell us if you need anything.`,
      `${what} ఉద్యోగం వచ్చినందుకు అభినందనలు${ref}! 🎉 శుభాకాంక్షలు — ఏదైనా అవసరమైతే మాకు చెప్పండి.`],
    cancelled: [`Thank you for applying for the ${what} job${ref}. This time the employer chose someone else. We will tell you about new jobs near you.`,
      `${what} ఉద్యోగానికి దరఖాస్తు చేసినందుకు ధన్యవాదాలు${ref}. ఈసారి యజమాని వేరొకరిని ఎంచుకున్నారు. మీ దగ్గర కొత్త ఉద్యోగాలు వచ్చినప్పుడు తెలియజేస్తాము.`],
  }
  const [en, te] = M[step] || M.called
  return [hello(e.name), en, '— Team iN Empower', '', hello(e.name, 'te'), te, '— iN Empower బృందం'].join('\n')
}
export const stageLabel = (key, supply) => {
  const s = STAGES.find((x) => x.key === key) || STAGES[0]
  return supply ? s.supply : s.label
}
export const isOpen = (e) => OPEN_STATUSES.includes(e.status)
// Job applications have no finish-by date
export const isOverdue = (e, now = Date.now()) => isOpen(e) && !isJobApplication(e) && !!e.due_at && new Date(e.due_at).getTime() < now

/** Finish-by in calendar days, India time: "Due today by 5:00 pm", "Due tomorrow by 1:00 pm", "2 days late" */
export function dueText(e) {
  if (!e.due_at) return ''
  if (!isOpen(e)) return shortDate(e.due_at)
  const due = ist(e.due_at); const today = ist(new Date()).ymd
  const dayDiff = Math.round((Date.parse(`${due.ymd}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000)
  if (new Date(e.due_at).getTime() < Date.now()) {
    if (dayDiff >= 0) return `Late (was due ${istTime(e.due_at)})`
    return `${-dayDiff} day${dayDiff < -1 ? 's' : ''} late`
  }
  if (dayDiff === 0) return `Due today by ${istTime(e.due_at)}`
  if (dayDiff === 1) return `Due tomorrow by ${istTime(e.due_at)}`
  return `Due ${istWhen(e.due_at).replace(/, .*$/, '')} (${dayDiff} days)`
}
export const shortDate = (iso) => (iso ? istDate(iso).replace(/ \d{4}$/, '') : '')
/** Received outside office hours (Mon–Sat 9 am – 5 pm, holidays closed) */
export const isOutOfHours = (e) => !!e.created_at && !isWorkingTime(e.created_at)
export const isEmergencyTicket = (e) => isEmergency(e)
export const CANCEL_REASONS = [
  'Price too high', 'Customer not reachable', 'Customer changed mind', 'Found someone else',
  'No partner / buddy available', 'Outside our area', 'Duplicate request', 'Test / spam', 'Other',
]

/* ── Business Partners ── */
export const PARTNER_KINDS = [
  { key: 'supply', label: 'Supplies', hint: 'Granite, tiles, sand, cement… We charge the partner for bringing the order.' },
  { key: 'professional', label: 'Professional services', hint: 'Plumber, electrician, photographer… Small commission from both sides.' },
  { key: 'medical', label: 'Medical & healthcare', hint: 'Hospitals, ambulance, physio, pharmacy… Small commission from both sides.' },
  { key: 'government', label: 'Documents & government work', hint: 'Agents for certificates, registrations, RTO, MRO…' },
  { key: 'other', label: 'Other', hint: '' },
]
export const partnerKindLabel = (k) => (PARTNER_KINDS.find((x) => x.key === k) || PARTNER_KINDS[4]).label

const norm = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
/** Does this partner handle what the customer asked for? */
export function partnerFits(p, e) {
  const want = norm(e.item || e.sub_service)
  if (!want) return false
  return (p.items || []).some((i) => { const n = norm(i); return n && (n === want || want.includes(n) || n.includes(want)) })
}

/** WhatsApp message to the partner — no customer phone number, so the work comes through us */
export function partnerBrief(e) {
  // Partners never get the customer's name, phone, email or exact address — town only.
  // To the partner, the order is iN Empower's own: our Local Buddy talks to them, is there at
  // delivery / work, and iN Empower pays. No word about a customer.
  const answers = partnerAnswers(e.details?.answers).map((a) => `• ${a.q}: ${a.notSure ? 'Not sure' : a.a}`)
  const town = townOnly(e.area)
  const supply = isSupply(e)
  return [
    `${hello('')} New ${supply ? 'order' : 'request'} from iN Empower`,
    `Ref: ${e.details?.ref || String(e.id).slice(0, 8).toUpperCase()}`,
    `${supply ? 'Item' : 'Service'}: ${e.item || prettify(e.sub_service) || serviceLabel(e.service)}`,
    town ? `Town: ${town}` : '',
    e.urgency ? `When: ${e.urgency}` : '',
    ...answers,
    !answers.length && e.message ? `Details: ${partnerDetails(e.message)}` : '',
    supply ? 'Please share your best price and delivery time.' : 'Please share your charges and when you can do it.',
    // To the partner, iN Empower and its Local Buddy are the customer (owner's rule, 27 Oct 2026)
    supply
      ? 'Our Local Buddy will receive it at the delivery place. Please talk only to the Buddy or iN Empower. iN Empower pays you for this order.'
      : 'Our Local Buddy will be there for the work. Please talk only to the Buddy or iN Empower. iN Empower pays you for this job.',
  ].filter(Boolean).join('\n')
}

export const JOB_STATUSES = [
  { key: 'pending', label: 'Waiting for review', color: '#C2410C', bg: '#FFF0E5' },
  { key: 'approved', label: 'Live', color: '#0F6B06', bg: '#E7F3E6' },
  { key: 'rejected', label: 'Rejected', color: '#B91C1C', bg: '#FEE2E2' },
  { key: 'closed', label: 'Closed', color: '#475569', bg: '#F1F5F9' },
]
export const jobStatusInfo = (key) => JOB_STATUSES.find((s) => s.key === key) || JOB_STATUSES[0]

// Same values the Contact form uses
export const SERVICE_LABELS = {
  education: 'College Admissions',
  'home-tuition': 'Home Tuitions',
  identity: 'Identity & Vital Records',
  mro: 'MRO Services',
  rto: 'RTO Services',
  municipal: 'Municipal Corporation',
  collector: 'Collector Office',
  startup: 'Startup Registration',
  property: 'Property Services',
  court: 'Court Services',
  healthcare: 'Hospitals & Healthcare',
  drivers: 'Professional Services',
  electricity: 'Electrician & Home Repairs',
  painting: 'Painting & Waterproofing',
  'pest-control': 'Pest Control',
  'account-deletion': 'Account deletion (finish within 7 days)',
  ac: 'AC Services',
  pujari: 'Pujari Services',
  photography: 'Photography',
  logistics: 'Packers & Movers',
  supplies: 'Supplies',
  nri: 'NRI & Families Abroad',
  travel: 'Travel & Rentals',
  'real-estate': 'Property & Real Estate',
  invest: 'Property Investment (parked)',
  workshop: 'Workshops',
  'part-time': 'Part-time Jobs',
  other: 'Other / Partnership',
}
export const serviceLabel = (key) => SERVICE_LABELS[key] || prettify(key) || 'General enquiry'

export const TIERS = [
  { value: 0, label: 'Not verified yet' },
  { value: 1, label: 'Tier 1 — ID & legal checked' },
  { value: 2, label: 'Tier 2 — Skills assessed' },
  { value: 3, label: 'Tier 3 — Trust Seal' },
]

export function prettify(value) {
  if (!value) return ''
  // Capital at the start of each word only ("Learner's", not "Learner'S")
  return String(value).replace(/[-_]+/g, ' ').replace(/(^|\s)(\w)/g, (m, sp, c) => sp + c.toUpperCase())
}

export function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  return istDate(iso)
}

/** Always India time, whatever the computer's clock setting: "19 Oct 2026, 9:15 pm" */
export const fullDate = (iso) => istFull(iso)
/** "Today, 9:15 pm" / "Yesterday, 4:02 pm" / "17 Oct, 11:30 am" (India time) */
export const whenIST = (iso) => istWhen(iso)

/** 10-digit Indian numbers → 91XXXXXXXXXX for WhatsApp / tel links; numbers from abroad keep their country code */
export const phoneForLinks = (phone) => linkDigits(phone)

// The full api.whatsapp.com address (owner, 2 Nov 2026): the short wa.me link's redirect turned
// emojis such as 🙏 into "�" in the message
export const whatsappLink = (phone, text) =>
  `https://api.whatsapp.com/send?phone=${phoneForLinks(phone)}${text ? `&text=${encodeURIComponent(text)}` : ''}`

export const telLink = (phone) => `tel:+${phoneForLinks(phone)}`

/** First line of a message, with the right greeting for the time in Andhra Pradesh */
export function hello(name, lang = 'en', now = new Date()) {
  const g = greeting(now); const n = String(name || '').trim().split(/\s+/)[0] || ''
  if (lang === 'te') return n ? `${g.te} ${n} గారు 🙏` : `${g.te} 🙏`
  return n ? `${g.en} ${n} garu 🙏` : `${g.en} 🙏`
}

export function customerGreeting(e) {
  return `${hello(e.name)} This is iN Empower about your ${e.item || serviceLabel(e.service)} request${e.details?.ref ? ` (Ref ${e.details.ref})` : ''}. `
}

/**
 * Customer phone numbers stay with the iN Empower team (owner, 3 Nov 2026): no Local Buddy and no
 * Business Partner ever gets one. Any number typed into a message or a detail is taken out.
 */
export const NUMBER_KEPT = '(number kept by iN Empower)'
export const withoutPhones = (text) => String(text ?? '').replace(/(?:\+\d{1,3}[\s-]?)?(?:\d[\s-]?){9,13}\d/g, NUMBER_KEPT)
const PHONE_LABEL = /phone|mobile|whats ?app|contact (?:no|number)|ఫోన్|మొబైల్|వాట్సాప్/i

/**
 * The job for the Local Buddy (Admin → Requests → Send job on WhatsApp). The customer's name, town and
 * the details for the papers — never the customer's number: our team calls the customer, fixes the
 * time and place, and the Buddy meets them there (owner, 3 Nov 2026).
 */
export function buddyBrief(e) {
  const answers = Array.isArray(e.details?.answers) ? e.details.answers.map((a) => `• ${a.q}: ${a.notSure ? 'Not sure — please advise' : withoutPhones(a.a)}`) : []
  const info = (Array.isArray(e.details?.info) ? e.details.info : []).filter((d) => !PHONE_LABEL.test(String(d.label || '')))
  const visit = String(e.details?.visit || '').trim()
  return [
    `${hello('')} New iN Empower job for you`,
    `Ref: ${e.details?.ref || String(e.id).slice(0, 8).toUpperCase()}`,
    `Service: ${serviceLabel(e.service)}${e.item || e.sub_service ? ' — ' + (e.item || prettify(e.sub_service)) : ''}`,
    `Customer: ${String(e.name || '').trim() || 'Customer'}${e.area ? ` · ${withoutPhones(e.area)}` : ''}`,
    e.urgency ? `Customer wants it: ${e.urgency}` : '',
    e.due_at ? `Finish by: ${istFull(e.due_at)}` : '',
    ...answers,
    !answers.length && e.message ? `Details: ${withoutPhones(e.message.slice(0, 600))}` : '',
    // Details the customer filled in the app — for the Buddy (our team), never for a partner
    ...info.map((d) => `• ${d.label}: ${withoutPhones(d.value)}`),
    visit ? `Meet the customer: ${withoutPhones(visit)}` : 'Meet the customer: our team calls the customer and sends you the time and place.',
    `All calls to the customer go through iN Empower — please don't ask for or keep the customer's number. Update us at every step. Thank you!`,
    `If a Business Partner (supplier / vendor) is involved, you talk to them for the customer and are there at delivery. Never share the customer's name or address with the partner.`,
  ].filter(Boolean).join('\n')
}

/* ── Updates to the customer at each step (English + Telugu) ── */
export const UPDATE_STEPS = ['assigned', 'called', 'partner', 'quote', 'confirmed', 'working', 'completed', 'cancelled', 'late']
export function customerUpdate(step, e, { buddy } = {}) {
  const ref = e.details?.ref || String(e.id).slice(0, 8).toUpperCase()
  const en = e.item || prettify(e.sub_service) || serviceLabel(e.service)
  const te = svcText('te', en)
  const supply = isSupply(e)
  const b = String(buddy?.name || '').trim().split(/\s+/)[0]
  const nextDay = ist(nextOpening(new Date(Date.now() + 60000))).ymd
  const OFFICE_PHONE = cityPhoneFor(e) // the number of the customer's city
  const lines = {
    assigned: [
      `Our Local Buddy ${b || ''} is now looking after your ${en} request (Ref ${ref}). Our team will call you to fix a time. For any question, call or WhatsApp us on ${OFFICE_PHONE}.`,
      `మా లోకల్ బడ్డీ ${b || ''} ఇప్పుడు మీ ${te} అభ్యర్థన (Ref ${ref}) చూసుకుంటున్నారు. సమయం నిర్ణయించడానికి మా బృందం మీకు కాల్ చేస్తుంది. ఏదైనా సందేహం ఉంటే ${OFFICE_PHONE} కు కాల్ / WhatsApp చేయండి.`,
    ],
    called: [
      `Thank you for speaking with us about your ${en} request (Ref ${ref}). We are working on it and will update you at every step.`,
      `మీ ${te} అభ్యర్థన (Ref ${ref}) గురించి మాతో మాట్లాడినందుకు ధన్యవాదాలు. పని మొదలుపెట్టాం, ప్రతి దశలో మీకు తెలియజేస్తాం.`,
    ],
    partner: [
      `We are checking with our trusted partners for the best price and availability for your ${en} (Ref ${ref}). We will share the quote soon.`,
      `మీ ${te} (Ref ${ref}) కోసం మా నమ్మకమైన భాగస్వాములతో మంచి ధర, లభ్యత కనుక్కుంటున్నాం. త్వరలో కొటేషన్ పంపుతాం.`,
    ],
    quote: [
      `We have shared the quote for your ${en} (Ref ${ref}). Reply YES to go ahead, or ask us anything. No work starts before you agree.`,
      `మీ ${te} (Ref ${ref}) కొటేషన్ పంపాం. ముందుకు వెళ్ళాలంటే YES అని జవాబు ఇవ్వండి, లేదా ఏదైనా అడగండి. మీరు ఒప్పుకునే వరకు పని మొదలుపెట్టం.`,
    ],
    confirmed: [
      `Thank you for confirming your ${en} ${supply ? 'order' : 'request'} (Ref ${ref}). We will tell you when ${supply ? 'it is on the way' : 'the work starts'}.`,
      `మీ ${te} ${supply ? 'ఆర్డర్' : 'అభ్యర్థన'} (Ref ${ref}) నిర్ధారించినందుకు ధన్యవాదాలు. ${supply ? 'సరుకు బయలుదేరినప్పుడు' : 'పని మొదలైనప్పుడు'} మీకు తెలియజేస్తాం.`,
    ],
    working: supply ? [
      `Your ${en} is on the way 🚚 (Ref ${ref}). Our team will tell you the delivery time${b ? `, and ${b} will be there` : ''}. If anything is missing or not as ordered, we’ll pay you back for that part.`,
      `మీ ${te} బయలుదేరింది 🚚 (Ref ${ref}). డెలివరీ సమయం మా బృందం మీకు చెబుతుంది${b ? `, ${b} అక్కడ ఉంటారు` : ''}. ఏదైనా తక్కువగా లేదా ఆర్డర్ చేసినట్లు లేకపోతే, ఆ భాగానికి మీ డబ్బు వాపసు ఇస్తాము.`,
    ] : [
      `Work on your ${en} has started (Ref ${ref}).${b ? ` ${b} is looking after it.` : ''} If anything can’t be completed, we’ll pay you back for that part.`,
      `మీ ${te} పని మొదలైంది (Ref ${ref}).${b ? ` ${b} చూసుకుంటున్నారు.` : ''} ఏదైనా పూర్తి చేయలేకపోతే, ఆ భాగానికి మీ డబ్బు వాపసు ఇస్తాము.`,
    ],
    cancelled: [
      `Your ${en} request (Ref ${ref}) is now closed. If you still need help, just reply — we are happy to help.`,
      `మీ ${te} అభ్యర్థన (Ref ${ref}) ముగించాం. ఇంకా సహాయం కావాలంటే ఈ మెసేజ్‌కు జవాబు ఇవ్వండి — సంతోషంగా సహాయం చేస్తాం.`,
    ],
    late: [
      `Sorry for the delay with your ${en} (Ref ${ref}). We are on it and will update you ${dayWords(nextDay, 'en')}.`,
      `మీ ${te} (Ref ${ref}) ఆలస్యమైనందుకు క్షమించండి. పని జరుగుతోంది, ${dayWords(nextDay, 'te')} మీకు తెలియజేస్తాం.`,
    ],
  }
  if (step === 'completed') return thankYouMessage('customer', e)
  const [a, t] = lines[step] || lines.called
  return [hello(e.name), a, '— Team iN Empower', '', hello(e.name, 'te'), t, '— iN Empower బృందం'].join('\n')
}
/** Which step update fits the ticket now */
export function updateStepFor(e) {
  if (isOverdue(e)) return 'late'
  const s = stageKey(e)
  if (s === 'new') return e.assigned_buddy_id ? 'assigned' : null
  return s === 'called' && e.assigned_buddy_id ? 'assigned' : s
}
export const UPDATE_LABEL = { assigned: 'Buddy assigned', called: 'After the first call', partner: 'Checking with partner', quote: 'Quote shared', confirmed: 'Confirmed', working: 'Work started / on the way', completed: 'Completed', cancelled: 'Closed / cancelled', late: 'Sorry for the delay' }

const digitsOf = (v) => String(v || '').replace(/\D/g, '')
/**
 * Does a search match? words: everything to look in; phones: numbers to compare digit by digit,
 * so "96396 39639", "+91 96396-39639" and "9639639639" all find the same person.
 * References match with or without the dash ("IN-7K3Q9", "in7k3q9").
 */
export function searchMatch(q, words = [], phones = []) {
  const query = String(q || '').trim().toLowerCase()
  if (!query) return true
  const qDigits = digitsOf(query).replace(/^91(?=\d{10}$)/, '')
  if (qDigits.length >= 4 && /^[\d\s+()./-]+$/.test(query)) {
    return phones.some((p) => digitsOf(p).includes(qDigits)) || words.some((w) => digitsOf(w).includes(qDigits))
  }
  const hay = words.filter(Boolean).map((w) => String(w).toLowerCase()).join(' ')
  const hayRefs = hay.replace(/\b([a-z]{2})-([a-z0-9]{4,6})\b/g, '$1-$2 $1$2')
  return query.split(/\s+/).every((w) => hayRefs.includes(w))
}

export function matchesSearch(e, q) {
  return searchMatch(q,
    [e.name, e.phone, e.email, e.message, e.sub_service, e.item, e.area, e.urgency, e.details?.ref, e.details?.nearTown, serviceLabel(e.service), e.buddy?.name, e.partner?.business_name, stageInfo(e).label],
    [e.phone])
}

export function downloadCsv(filename, rows) {
  const cols = ['Received', 'Stage', 'Finish by', 'Name', 'Phone', 'Email', 'City', 'Service', 'Sub-service', 'Area', 'When', 'Ref', 'Buddy', 'Business Partner', 'Source', 'Message']
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const lines = [cols.join(',')].concat(rows.map((e) => [
    fullDate(e.created_at), stageInfo(e).label, e.due_at ? shortDate(e.due_at) : '', e.name, e.phone, e.email, cityOfRequest(e).name, serviceLabel(e.service),
    e.item || prettify(e.sub_service), e.area, e.urgency, e.details?.ref, e.buddy?.name, e.partner?.business_name, [e.source, e.channel].filter(Boolean).join(' / '), e.message,
  ].map(esc).join(',')))
  const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/* ── Thank-you messages when a ticket is completed (English + Telugu together) ──
   Megha sends them with one tap on WhatsApp; supabase/011 can send them
   automatically once WhatsApp Business (Meta) is set up. */
const firstName = (n) => String(n || '').trim().split(/\s+/)[0] || ''
const refOf = (e) => e.details?.ref || String(e.id).slice(0, 8).toUpperCase()
const itemEn = (e) => e.item || prettify(e.sub_service) || serviceLabel(e.service)
const itemTe = (e) => svcText('te', itemEn(e))

export const THANK_TARGETS = [
  { key: 'buddy', label: 'Local Buddy' },
  { key: 'partner', label: 'Business Partner' },
  { key: 'customer', label: 'Customer' },
]

export function thankYouMessage(target, e, who = {}) {
  const ref = refOf(e)
  if (target === 'buddy') {
    const n = firstName(who.name)
    return [
      hello(n),
      `Thank you for completing the ${itemEn(e)} work for ${firstName(e.name)} (Ref ${ref}). Your good work builds trust in iN Empower across Prakasam.`,
      '— Team iN Empower',
      '',
      hello(n, 'te'),
      `${firstName(e.name)} గారి ${itemTe(e)} పని పూర్తి చేసినందుకు ధన్యవాదాలు (Ref ${ref}). మీ మంచి పని ప్రకాశం జిల్లాలో iN Empower పై నమ్మకాన్ని పెంచుతుంది.`,
      '— iN Empower బృందం',
    ].join('\n')
  }
  if (target === 'partner') {
    const n = firstName(who.contact_name) || who.business_name || ''
    return [
      hello(n),
      `Thank you for ${isSupply(e) ? 'supplying' : 'providing'} ${itemEn(e)} for iN Empower order ${ref}. It was a pleasure working with you — we look forward to the next one.`,
      '— Team iN Empower',
      '',
      hello(n, 'te'),
      `iN Empower ఆర్డర్ ${ref} కోసం ${itemTe(e)} అందించినందుకు ధన్యవాదాలు. మీతో కలిసి పని చేయడం ఆనందంగా ఉంది — మళ్ళీ కలిసి పని చేయాలని ఎదురుచూస్తున్నాం.`,
      '— iN Empower బృందం',
    ].join('\n')
  }
  const n = firstName(e.name)
  return [
    hello(n),
    `Your ${itemEn(e)} request (Ref ${ref}) is complete. Thank you for choosing iN Empower! If anything is not right, just reply to this message. Please tell your family and friends about us.`,
    '— Team iN Empower',
    '',
    hello(n, 'te'),
    `మీ ${itemTe(e)} అభ్యర్థన (Ref ${ref}) పూర్తయింది. iN Empower ను ఎంచుకున్నందుకు ధన్యవాదాలు! ఏదైనా సరిగా లేకపోతే ఈ మెసేజ్‌కు జవాబు ఇవ్వండి. మా గురించి మీ కుటుంబం, స్నేహితులకు చెప్పండి.`,
    '— iN Empower బృందం',
  ].join('\n')
}

/** Which thank-yous are already sent, read from the ticket's history notes */
export const THANK_NOTE = (target, name) => `Thank-you sent to ${target}${name ? ` (${name})` : ''} on WhatsApp`
export function thanksSent(activity) {
  const sent = {}
  ;(activity || []).forEach((a) => {
    const m = /^Thank-you sent (?:to|automatically to) (buddy|partner|customer)/.exec(a.detail || '')
    if (m) sent[m[1]] = a.created_at
  })
  return sent
}

/**
 * Nothing answered — only "Not sure" or skipped questions (owner, 2 Nov 2026): the team calls to check
 * whether the customer is serious ("Advice call — check if serious"). Town, timing, notes and papers don't count.
 */
const ADVICE_TAIL = /^(town|when|notes|ready|needs help with|deliver to|call me)$/i
export function adviceOnly(e) {
  const answers = Array.isArray(e?.details?.answers) ? e.details.answers.filter((a) => !ADVICE_TAIL.test(String(a.q || '').trim())) : []
  if (answers.length) return answers.every((a) => a.notSure)
  // App requests carry "- Question: answer" lines in the message
  const lines = String(e?.message || '').split('\n').map((l) => l.match(/^-\s*([^:]+):\s*(.+)$/)).filter((m) => m && !ADVICE_TAIL.test(m[1].trim()))
  return lines.length > 0 && lines.every((m) => /^(Not sure|Skipped)\b/i.test(m[2].trim()))
}
