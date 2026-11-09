/**
 * Working hours, holidays and India time — shared by the website, the app
 * (copied with `npm run sync-data`) and the admin portal.
 *
 * Office: Monday–Saturday, 9 am – 5 pm India time (IST, UTC+5:30, no daylight saving).
 * Holidays: the closed days ticked in Admin → Settings (stored in catalog_items,
 * kind 'settings', item 'holidays'); until then the defaults below.
 * Everything here uses a fixed +5:30 offset, so it is right whatever clock or
 * time zone the phone or computer is set to.
 */

import { teamPhoneShown, COMPANY } from './cities.js'

/*
 * Office hours (India time). Changed in Admin → Settings (catalog_items, settings 'hours');
 * the database (supabase/013) reads the same row for finish-by dates.
 *   start / end      — opening and closing hour (24-hour clock)
 *   closedWeekdays   — 0 = Sunday … 6 = Saturday
 *   todayCutoff      — a "Today" request after this hour is due the next working day
 *   nextDayAt        — …at this hour
 */
export const DEFAULT_WORK = Object.freeze({ start: 9, end: 17, closedWeekdays: [0], todayCutoff: 15, nextDayAt: 13 })
export const WORK = { ...DEFAULT_WORK, closedWeekdays: [...DEFAULT_WORK.closedWeekdays] }

const hourIn = (v, min, max, fallback) => { const n = Math.round(Number(v)); return Number.isFinite(n) && n >= min && n <= max ? n : fallback }
/** Use the hours saved in the admin portal (anything unusable keeps the default). */
export function setWorkHours(h) {
  const d = DEFAULT_WORK
  const start = hourIn(h?.start, 0, 23, d.start)
  let end = hourIn(h?.end, 1, 24, d.end)
  if (end <= start) end = d.end > start ? d.end : Math.min(24, start + 1)
  const closed = Array.isArray(h?.closedWeekdays) ? [...new Set(h.closedWeekdays.map(Number).filter((x) => Number.isInteger(x) && x >= 0 && x <= 6))] : [...d.closedWeekdays]
  Object.assign(WORK, {
    start, end,
    closedWeekdays: closed.length === 7 ? [...d.closedWeekdays] : closed,
    todayCutoff: Math.min(end, Math.max(start, hourIn(h?.todayCutoff, 0, 24, d.todayCutoff))),
    nextDayAt: Math.min(end, Math.max(start, hourIn(h?.nextDayAt, 0, 24, d.nextDayAt))),
  })
  return WORK
}

const DAY_SHORT = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], te: ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'] }
/** "9 am", "5 pm", "12 noon" — Telugu: "ఉదయం 9", "సాయంత్రం 5" */
export function hourText(h, lang = 'en') {
  const n = ((h + 11) % 12) + 1
  if (lang === 'te') return `${h < 12 ? 'ఉదయం' : h < 16 ? 'మధ్యాహ్నం' : h < 20 ? 'సాయంత్రం' : 'రాత్రి'} ${n}`
  if (h === 12) return '12 noon'
  return `${n} ${h < 12 || h === 24 ? 'am' : 'pm'}`
}
/** Open days: "Mon–Sat", "Mon–Fri", "every day", or a list */
export function daysText(lang = 'en') {
  const L = DAY_SHORT[lang === 'te' ? 'te' : 'en']
  const open = [1, 2, 3, 4, 5, 6, 0].filter((d) => !WORK.closedWeekdays.includes(d))
  if (open.length === 7) return lang === 'te' ? 'ప్రతి రోజు' : 'every day'
  // one unbroken run, in Monday-first order
  const order = [1, 2, 3, 4, 5, 6, 0]
  const idx = open.map((d) => order.indexOf(d))
  const run = idx.every((x, i) => i === 0 || x === idx[i - 1] + 1)
  if (run && open.length > 2) return `${L[open[0]]}–${L[open[open.length - 1]]}`
  return open.map((d) => L[d]).join(', ')
}
/** "Mon–Sat, 9 am – 5 pm" */
export const hoursText = (lang = 'en') => `${daysText(lang)}, ${hourText(WORK.start, lang)} – ${hourText(WORK.end, lang)}`
// The main office number; customers see their own city's number (Admin → Cities)
export const OFFICE_PHONE = COMPANY.phone

// Andhra Pradesh general holidays 2026 (G.O.). closed: true = our office is closed.
export const AP_HOLIDAYS = [
  { date: '2026-01-14', name: 'Bhogi', closed: true },
  { date: '2026-01-15', name: 'Makara Sankranti', closed: true },
  { date: '2026-01-16', name: 'Kanuma', closed: true },
  { date: '2026-01-26', name: 'Republic Day', closed: true },
  { date: '2026-02-15', name: 'Maha Sivaratri', closed: false },
  { date: '2026-03-03', name: 'Holi', closed: false },
  { date: '2026-03-19', name: 'Ugadi', closed: true },
  { date: '2026-03-20', name: 'Eid-ul-Fitr (Ramzan)', closed: false },
  { date: '2026-03-27', name: 'Sri Rama Navami', closed: false },
  { date: '2026-04-03', name: 'Good Friday', closed: false },
  { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti', closed: false },
  { date: '2026-05-27', name: 'Eid-ul-Adha (Bakrid)', closed: false },
  { date: '2026-06-25', name: 'Moharrum', closed: false },
  { date: '2026-08-15', name: 'Independence Day', closed: true },
  { date: '2026-08-21', name: 'Vara Lakshmi Vratham', closed: false },
  { date: '2026-08-25', name: 'Milad-un-Nabi', closed: false },
  { date: '2026-09-04', name: 'Sri Krishnashtami', closed: false },
  { date: '2026-09-14', name: 'Vinayaka Chavithi', closed: true },
  { date: '2026-10-02', name: 'Gandhi Jayanti', closed: true },
  { date: '2026-10-20', name: 'Vijaya Dasami', closed: true },
  { date: '2026-11-08', name: 'Deepavali', closed: true },
  { date: '2026-12-25', name: 'Christmas', closed: true },
]

let closedDays = new Set(AP_HOLIDAYS.filter((h) => h.closed).map((h) => h.date))
let holidayNames = Object.fromEntries(AP_HOLIDAYS.map((h) => [h.date, h.name]))

/** Use the holiday list saved in the admin portal: [{ date: 'YYYY-MM-DD', name, closed }] */
export function setHolidays(list) {
  if (!Array.isArray(list)) return
  closedDays = new Set(list.filter((h) => h && h.closed !== false && /^\d{4}-\d{2}-\d{2}$/.test(h.date)).map((h) => h.date))
  holidayNames = { ...Object.fromEntries(AP_HOLIDAYS.map((h) => [h.date, h.name])), ...Object.fromEntries(list.filter((h) => h && h.date).map((h) => [h.date, h.name])) }
}
export const holidayName = (ymd) => holidayNames[ymd] || ''

const OFFSET = 330 * 60000
const pad = (n) => String(n).padStart(2, '0')

/** Parts of a moment in India time */
export function ist(d = new Date()) {
  const t = new Date(new Date(d).getTime() + OFFSET)
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), wd: t.getUTCDay(), h: t.getUTCHours(), min: t.getUTCMinutes(), ymd: t.toISOString().slice(0, 10) }
}
/** A moment at a given India date and time */
export const istAt = (ymd, h = 0, min = 0) => new Date(`${ymd}T${pad(h)}:${pad(min)}:00+05:30`)
export const addDays = (ymd, n) => new Date(Date.parse(`${ymd}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10)
export const weekdayOf = (ymd) => new Date(`${ymd}T00:00:00Z`).getUTCDay()

export const isWorkDay = (ymd) => !WORK.closedWeekdays.includes(weekdayOf(ymd)) && !closedDays.has(ymd)
export function isWorkingTime(d = new Date()) {
  const p = ist(d)
  return isWorkDay(p.ymd) && p.h >= WORK.start && p.h < WORK.end
}
export function nextWorkDay(ymd) {
  let x = addDays(ymd, 1)
  for (let i = 0; i < 60 && !isWorkDay(x); i++) x = addDays(x, 1)
  return x
}
/** The next moment the office is open (now, if it is open now) */
export function nextOpening(d = new Date()) {
  if (isWorkingTime(d)) return new Date(d)
  const p = ist(d)
  if (isWorkDay(p.ymd) && p.h < WORK.start) return istAt(p.ymd, WORK.start)
  return istAt(nextWorkDay(p.ymd), WORK.start)
}

/** Minutes of office time between two moments (for "called within 1 working hour") */
export function workingMinutesBetween(a, b) {
  let from = new Date(a).getTime(); const to = new Date(b).getTime()
  if (!(to > from)) return 0
  let total = 0
  for (let i = 0; i < 400 && from < to; i++) {
    const p = ist(from)
    const open = istAt(p.ymd, WORK.start).getTime(); const close = istAt(p.ymd, WORK.end).getTime()
    if (isWorkDay(p.ymd)) total += Math.max(0, Math.min(to, close) - Math.max(from, open)) / 60000
    from = istAt(addDays(p.ymd, 1), 0).getTime()
  }
  return Math.round(total)
}

/**
 * Finish-by date from the customer's timing (same rules as the database, supabase/012):
 *   Today → 5 pm the same day; if it arrives after 3 pm or on a closed day → 1 pm the next working day
 *   This week → 3 days · This month → 15 days · Just checking → 7 days · not said → 2 days
 *   (counted in calendar days, ending 5 pm; a closed day moves to the next working day)
 */
export function dueFor(urgency, created = new Date()) {
  const p = ist(created)
  if (urgency === 'Today') {
    if (isWorkDay(p.ymd) && p.h < WORK.todayCutoff) return istAt(p.ymd, WORK.end)
    return istAt(nextWorkDay(p.ymd), WORK.nextDayAt)
  }
  const n = { 'This week': 3, 'This month': 15, 'Just checking': 7 }[urgency] ?? 2
  let day = addDays(p.ymd, n)
  if (!isWorkDay(day)) day = nextWorkDay(day)
  return istAt(day, WORK.end)
}

/* ── Words ── */
const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAYS_TE = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "today" / "tomorrow" / "on Wednesday, 21 Oct" (and Telugu) for an India date */
export function dayWords(ymd, lang = 'en', now = new Date()) {
  const today = ist(now).ymd
  const [, m, d] = ymd.split('-').map(Number)
  if (lang === 'te') {
    if (ymd === today) return 'ఈరోజు'
    if (ymd === addDays(today, 1)) return 'రేపు'
    return `${DAYS_TE[weekdayOf(ymd)]} (${d} ${MONTHS[m - 1]})`
  }
  if (ymd === today) return 'today'
  if (ymd === addDays(today, 1)) return 'tomorrow'
  return `on ${DAYS_EN[weekdayOf(ymd)]}, ${d} ${MONTHS[m - 1]}`
}

/** Greeting for the time of day in Andhra Pradesh */
export function greeting(d = new Date()) {
  const h = ist(d).h
  if (h >= 5 && h < 12) return { en: 'Good morning', te: 'శుభోదయం', night: false }
  if (h >= 12 && h < 16) return { en: 'Good afternoon', te: 'నమస్కారం', night: false }
  if (h >= 16 && h < 21) return { en: 'Good evening', te: 'శుభ సాయంత్రం', night: false }
  return { en: 'Namaste', te: 'నమస్తే', night: true }
}
/** Is it too late / early to message people? (before 8 am or from 9 pm) */
export const isQuietTime = (d = new Date()) => { const h = ist(d).h; return h < 8 || h >= 21 }

/** Ambulance and other medical emergencies are never told "we'll call tomorrow" */
export function isEmergency(req = {}) {
  const text = [req.item, req.subService, req.sub_service, req.service, req.message].filter(Boolean).join(' ')
  return /ambulance|emergency|అంబులెన్స్|అత్యవసర/i.test(text)
}

/**
 * Line to show after a request is sent. Inside office hours: null.
 * Outside: "we'll call you on Wednesday between 9 am and 5 pm". Emergencies: call 108 now.
 */
export function afterHoursNote(lang = 'en', { now = new Date(), emergency = false } = {}) {
  if (emergency) {
    const phone = teamPhoneShown()
    return lang === 'te'
      ? `🚑 అత్యవసరమైతే వెంటనే 108 కు కాల్ చేయండి. మా బృందానికి కూడా తెలియజేశాం — ${phone} కు కాల్ చేయవచ్చు.`
      : `🚑 For an emergency, call 108 now. We have also alerted our team — you can call us on ${phone}.`
  }
  if (isWorkingTime(now)) return null
  const open = ist(nextOpening(now)).ymd
  return lang === 'te'
    ? `🌙 ఇది మా పని వేళలు కాదు (${hoursText('te')}). మా బృందం ${dayWords(open, 'te', now)} ${hourText(WORK.start, 'te')} – ${hourText(WORK.end, 'te')} మధ్య మీకు కాల్ చేస్తుంది.`
    : `🌙 We're outside working hours (${hoursText('en')}). Our team will call you ${dayWords(open, 'en', now)} between ${hourText(WORK.start)} and ${hourText(WORK.end)}.`
}

/** When our team will call a customer: "today, before 5 pm" · "tomorrow, from 9 am" (and Telugu) */
export function callWhen(lang = 'en', now = new Date()) {
  if (isWorkingTime(now)) return lang === 'te' ? `ఈరోజు ${hourText(WORK.end, 'te')} లోపు` : `today, before ${hourText(WORK.end)}`
  const open = ist(nextOpening(now)).ymd
  return lang === 'te' ? `${dayWords(open, 'te', now)} ${hourText(WORK.start, 'te')} నుండి` : `${dayWords(open, 'en', now)}, from ${hourText(WORK.start)}`
}

/* ── India-time display (admin) ── */
const h12 = (h, min) => `${((h + 11) % 12) + 1}:${pad(min)} ${h < 12 ? 'am' : 'pm'}`
/** "Today, 9:15 pm" · "Yesterday, 4:02 pm" · "17 Oct, 11:30 am" · "17 Oct 2025, 11:30 am" */
export function istWhen(d, now = new Date()) {
  if (!d) return ''
  const p = ist(d); const today = ist(now).ymd
  const time = h12(p.h, p.min)
  if (p.ymd === today) return `Today, ${time}`
  if (p.ymd === addDays(today, -1)) return `Yesterday, ${time}`
  if (p.ymd === addDays(today, 1)) return `Tomorrow, ${time}`
  return `${p.d} ${MONTHS[p.m - 1]}${p.y !== ist(now).y ? ` ${p.y}` : ''}, ${time}`
}
export const istDate = (d) => { if (!d) return ''; const p = ist(d); return `${p.d} ${MONTHS[p.m - 1]} ${p.y}` }
export const istTime = (d) => { if (!d) return ''; const p = ist(d); return h12(p.h, p.min) }
export const istFull = (d) => (d ? `${istDate(d)}, ${istTime(d)}` : '')

/* ── "When should we call you?" (request screen, 25 Oct 2026) ──
 * Every choice is inside office hours and skips Sundays / holidays (Admin → Settings). */

/** Day name without "on": "Today" · "Tomorrow" · "Wed, 28 Oct" (Telugu: ఈరోజు · రేపు · బుధ (28 Oct)) */
export function dayShort(ymd, lang = 'en', now = new Date()) {
  const today = ist(now).ymd
  const [, m, d] = ymd.split('-').map(Number)
  const te = lang === 'te'
  if (ymd === today) return te ? 'ఈరోజు' : 'Today'
  if (ymd === addDays(today, 1)) return te ? 'రేపు' : 'Tomorrow'
  return te ? `${DAY_SHORT.te[weekdayOf(ymd)]} (${d} ${MONTHS[m - 1]})` : `${DAY_SHORT.en[weekdayOf(ymd)]}, ${d} ${MONTHS[m - 1]}`
}

/** The two call windows in a working day: morning (opening – 12 noon) and afternoon (2 pm – closing). */
export function callWindows() {
  const s = WORK.start, e = WORK.end
  const mid = Math.min(Math.max(s + 1, 12), e)
  const list = [{ id: 'morning', from: s, to: mid }]
  const aft = Math.min(Math.max(mid, 14), e - 1)
  if (aft > s && e - aft >= 1) list.push({ id: 'afternoon', from: aft, to: e })
  return list
}
/** "9 am – 12 noon" */
export const windowText = (w, lang = 'en') => `${hourText(w.from, lang)} – ${hourText(w.to, lang)}`

/** The next `n` working days, from today (when today still has a window left) */
export function callDays(n = 6, now = new Date()) {
  const p = ist(now)
  const days = []
  let x = p.ymd
  const lastTo = Math.max(...callWindows().map((w) => w.to))
  if (!(isWorkDay(x) && p.h + 1 < lastTo)) x = nextWorkDay(x)
  for (let i = 0; i < 60 && days.length < n; i++) {
    if (isWorkDay(x)) days.push(x)
    x = addDays(x, 1)
  }
  return days
}
/** Windows still open on a day (today: only those at least an hour away) */
export function windowsOn(ymd, now = new Date()) {
  const p = ist(now)
  return callWindows().filter((w) => ymd !== p.ymd || w.to > p.h + 1)
}

/** One call time as saved with the request: { slot, day, from, to, text } (text is English, for the team) */
const fromOpening = (lang, now) => {
  const day = ist(nextOpening(now)).ymd
  return lang === 'te' ? `${dayShort(day, 'te', now)} ${hourText(WORK.start, 'te')} నుండి` : `${dayShort(day, 'en', now)}, from ${hourText(WORK.start)}`
}
/** "Mon, 26 Oct" — a fixed date (the team reads it later, so never "tomorrow") */
const dayDate = (ymd) => { const [, m, d] = ymd.split('-').map(Number); return `${DAY_SHORT.en[weekdayOf(ymd)]}, ${d} ${MONTHS[m - 1]}` }
export function callAt(slot, day, w, now = new Date()) {
  if (slot === 'soon') {
    return { slot: 'soon', text: isWorkingTime(now) ? 'Within 1 hour' : `${dayDate(ist(nextOpening(now)).ymd)}, from ${hourText(WORK.start)}` }
  }
  return { slot, day, from: w.from, to: w.to, text: `${dayDate(day)}, ${windowText(w)}` }
}
/** The words for a saved call time in the customer's language */
export function callAtText(c, lang = 'en', now = new Date()) {
  if (!c) return ''
  if (c.slot === 'soon') return isWorkingTime(now) ? (lang === 'te' ? 'ఒక గంటలో' : 'Within 1 hour') : fromOpening(lang === 'te' ? 'te' : 'en', now)
  return `${dayShort(c.day, lang, now)}, ${windowText({ from: c.from, to: c.to }, lang)}`
}

/**
 * The quick choices on the request screen (3 + "Pick a time"):
 *   inside office hours  → Within 1 hour · Today 2 pm – 5 pm (if still ahead) · next day morning
 *   outside office hours → Tomorrow, from 9 am · that day's afternoon · the day after, morning
 * Each: { id, label, call } — call is what is saved (see callAt).
 */
export function callChoices(lang = 'en', now = new Date()) {
  const p = ist(now)
  const soon = callAt('soon', null, null, now)
  const out = [{ id: 'soon', label: callAtText(soon, lang, now), call: soon }]
  const openNow = isWorkingTime(now)
  const opening = ist(nextOpening(now))
  for (const day of callDays(3, now)) {
    for (const w of windowsOn(day, now)) {
      if (out.length >= 3) return out
      if (day === p.ymd && w.from <= p.h) continue // going on now: "Within 1 hour" covers it
      if (!openNow && day === opening.ymd && w.from <= opening.h) continue // "…from 9 am" covers it
      const c = callAt('window', day, w, now)
      out.push({ id: `${day}-${w.id}`, label: callAtText(c, lang, now), call: c })
    }
  }
  return out
}
