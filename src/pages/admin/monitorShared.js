// Filters, saved views and numbers for the Monitor page and its PDF report.
// Everything is counted in India time (IST).
import { ist, istAt, addDays, isWorkingTime, workingMinutesBetween, istDate } from '../../data/workHours'
import { STAGES, OPEN_STATUSES, stageKey, isOverdue, isOpen, serviceLabel, prettify, isEmergencyTicket, isOutOfHours } from './adminShared'

export const PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: '7d', label: 'Last 7 days' },
  { key: 'month', label: 'This month' },
  { key: 'lastmonth', label: 'Last month' },
  { key: '90d', label: 'Last 90 days' },
  { key: 'year', label: 'Last 12 months' },
  { key: 'custom', label: 'Pick dates…' },
]

/** [from, to) for a period, plus the same-length period just before it (for "up / down") */
export function periodRange(f, now = new Date()) {
  const today = ist(now).ymd
  const monthStart = today.slice(0, 8) + '01'
  let from, to
  switch (f.period) {
    case 'today': from = today; to = addDays(today, 1); break
    case 'yesterday': from = addDays(today, -1); to = today; break
    case 'month': from = monthStart; to = addDays(today, 1); break
    case 'lastmonth': {
      const prev = addDays(monthStart, -1)
      from = prev.slice(0, 8) + '01'; to = monthStart; break
    }
    case '90d': from = addDays(today, -89); to = addDays(today, 1); break
    case 'year': from = addDays(today, -364); to = addDays(today, 1); break
    case 'custom': from = f.from || addDays(today, -6); to = addDays(f.to || today, 1); break
    default: from = addDays(today, -6); to = addDays(today, 1)
  }
  const days = Math.max(1, Math.round((Date.parse(to) - Date.parse(from)) / 86400000))
  return { from, to, days, start: istAt(from), end: istAt(to), prevStart: istAt(addDays(from, -days)), label: rangeLabel(from, addDays(to, -1)) }
}
const rangeLabel = (a, b) => (a === b ? istDate(istAt(a, 12)) : `${istDate(istAt(a, 12))} – ${istDate(istAt(b, 12))}`)

export const HOURS = [
  { key: 'in', label: 'In working hours' },
  { key: 'out', label: 'After hours / holidays' },
]

/** One-tap situations */
export const VIEWS = [
  { key: 'not-called', label: '🆕 New today, not called', f: { period: 'today', stage: 'new' } },
  { key: 'overdue', label: '⏰ Overdue now', f: { period: '90d', stage: 'overdue' } },
  { key: 'night', label: '🌙 After-hours to call', f: { period: '7d', stage: 'new', hours: 'out' } },
  { key: 'partner', label: '🤝 Waiting for partner', f: { period: '90d', stage: 'partner' } },
  { key: 'emergency', label: '🚑 Emergencies', f: { period: 'month', emergency: '1' } },
  { key: 'done-month', label: '✅ Completed this month', f: { period: 'month', stage: 'completed' } },
  { key: 'cancel-month', label: '✕ Cancelled this month', f: { period: 'month', stage: 'cancelled' } },
  { key: 'daily', label: '📋 Yesterday (daily summary)', f: { period: 'yesterday' } },
]

export const FILTER_KEYS = ['period', 'from', 'to', 'cat', 'item', 'area', 'stage', 'buddy', 'partner', 'source', 'channel', 'urgency', 'hours', 'emergency']
export function readFilters(params) {
  const f = {}
  FILTER_KEYS.forEach((k) => { const v = params.get(k); if (v) f[k] = v })
  if (!f.period) f.period = '7d'
  return f
}

const itemOf = (e) => e.item || prettify(e.sub_service) || ''
const townOf = (e) => (e.area || '').split(/[—,-]/)[0].trim()

/** Tickets that match the filters (received in the period, unless the view is "overdue now") */
export function applyFilters(enquiries, f, now = new Date()) {
  const r = periodRange(f, now)
  return enquiries.filter((e) => {
    const t = new Date(e.created_at)
    if (f.stage !== 'overdue' && (t < r.start || t >= r.end)) return false
    if (f.cat && e.service !== f.cat) return false
    if (f.item && itemOf(e) !== f.item) return false
    if (f.area && townOf(e) !== f.area) return false
    if (f.buddy && (f.buddy === 'none' ? !!e.assigned_buddy_id : e.assigned_buddy_id !== f.buddy)) return false
    if (f.partner && (f.partner === 'none' ? !!e.assigned_partner_id : e.assigned_partner_id !== f.partner)) return false
    if (f.source && (e.source || 'website') !== f.source) return false
    if (f.channel && (e.channel || 'form') !== f.channel) return false
    if (f.urgency && (e.urgency || 'Not said') !== f.urgency) return false
    if (f.hours === 'in' && isOutOfHours(e)) return false
    if (f.hours === 'out' && !isOutOfHours(e)) return false
    if (f.emergency && !isEmergencyTicket(e)) return false
    if (f.stage) {
      if (f.stage === 'open') { if (!isOpen(e)) return false }
      else if (f.stage === 'overdue') { if (!isOverdue(e, now.getTime())) return false }
      else if (stageKey(e) !== f.stage) return false
    }
    return true
  })
}

/** Words for the filters, for the report header */
export function describeFilters(f, { buddies = [], partners = [] } = {}) {
  const parts = []
  if (f.cat) parts.push(serviceLabel(f.cat))
  if (f.item) parts.push(f.item)
  if (f.area) parts.push(f.area)
  if (f.stage) parts.push({ open: 'Open', overdue: 'Overdue now' }[f.stage] || (STAGES.find((s) => s.key === f.stage)?.label ?? f.stage))
  if (f.buddy) parts.push(f.buddy === 'none' ? 'No buddy' : `Buddy: ${buddies.find((b) => b.id === f.buddy)?.name || '?'}`)
  if (f.partner) parts.push(f.partner === 'none' ? 'No partner' : `Partner: ${partners.find((p) => p.id === f.partner)?.business_name || '?'}`)
  if (f.source) parts.push(f.source === 'app' ? 'App' : 'Website')
  if (f.channel) parts.push({ chat: 'Chat Buddy', page: 'Service page', form: 'Form', phone: 'Phone call' }[f.channel])
  if (f.urgency) parts.push(`Timing: ${f.urgency}`)
  if (f.hours) parts.push(f.hours === 'out' ? 'After hours' : 'In working hours')
  if (f.emergency) parts.push('Emergencies')
  return parts.length ? parts.join(' · ') : 'All requests'
}

const median = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2 }
const countBy = (rows, fn) => Object.entries(rows.reduce((m, r) => { const k = fn(r); if (k) m[k] = (m[k] || 0) + 1; return m }, {})).sort((a, b) => b[1] - a[1])
const ORDER = STAGES.map((s) => s.key)
/** Did the ticket get as far as this stage? */
function reached(e, key, timing) {
  const cur = stageKey(e)
  if (cur === key) return true
  if (cur !== 'cancelled' && ORDER.indexOf(cur) > ORDER.indexOf(key)) return true
  return !!timing?.stages?.includes(key)
}

/** All the numbers for a filtered list */
export function computeStats(list, { all = [], timings = {}, range, prevList = [], buddies = [], partners = [], now = new Date() } = {}) {
  const completed = list.filter((e) => e.status === 'completed')
  const cancelled = list.filter((e) => e.status === 'cancelled')
  const closed = completed.length + cancelled.length

  // Speed: first action, in office minutes (a night request answered at 9:30 am counts 30 minutes)
  const firsts = []; let waiting = 0
  list.forEach((e) => {
    const t = timings[e.id]
    if (t?.first_action_at) firsts.push(workingMinutesBetween(e.created_at, t.first_action_at))
    else if (e.status === 'new') waiting++
  })
  const within1h = firsts.filter((m) => m <= 60).length
  const finishDays = completed.map((e) => {
    const end = timings[e.id]?.completed_at || e.updated_at
    return end ? (new Date(end) - new Date(e.created_at)) / 86400000 : null
  }).filter((x) => x != null && x >= 0)
  const onTime = completed.filter((e) => { const end = timings[e.id]?.completed_at || e.updated_at; return e.due_at && end && new Date(end) <= new Date(e.due_at) }).length

  // Requests per day (website / app)
  const perDay = []
  if (range) for (let i = 0; i < Math.min(range.days, 400); i++) perDay.push({ day: addDays(range.from, i), website: 0, app: 0 })
  const dayIdx = Object.fromEntries(perDay.map((d, i) => [d.day, i]))
  list.forEach((e) => { const i = dayIdx[ist(e.created_at).ymd]; if (i != null) perDay[i][e.source === 'app' ? 'app' : 'website']++ })

  // Busy times: weekday × 2-hour slot (India time); night = 10 pm – 6 am
  const SLOTS = ['6–8 am', '8–10', '10–12', '12–2 pm', '2–4', '4–6', '6–8 pm', '8–10 pm', 'Night']
  const heat = Array.from({ length: 7 }, () => Array(SLOTS.length).fill(0))
  list.forEach((e) => {
    const p = ist(e.created_at)
    const slot = p.h >= 6 && p.h < 22 ? Math.floor((p.h - 6) / 2) : 8
    heat[(p.wd + 6) % 7][slot]++ // Monday first
  })

  // How far tickets get (funnel) and why they stop
  const funnel = ['called', 'partner', 'quote', 'confirmed', 'working', 'completed'].map((k) => ({ key: k, label: STAGES.find((s) => s.key === k).label, n: list.filter((e) => reached(e, k, timings[e.id])).length }))

  // Demand, with change against the period before
  const trend = (fn) => {
    const prev = Object.fromEntries(countBy(prevList, fn))
    return countBy(list, fn).map(([k, n]) => ({ k, n, prev: prev[k] || 0 }))
  }

  // Repeat customers: the same phone asked before (any time) or more than once in this period
  const firstSeen = {}
  ;[...all].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).forEach((e) => { const p = String(e.phone || '').replace(/\D/g, '').slice(-10); if (p && !firstSeen[p]) firstSeen[p] = e.id })
  const repeat = list.filter((e) => { const p = String(e.phone || '').replace(/\D/g, '').slice(-10); return p && firstSeen[p] !== e.id }).length

  // Scorecards
  const card = (people, key, nameKey) => people.map((x) => {
    const t = list.filter((e) => e[key] === x.id)
    if (!t.length) return null
    const done = t.filter((e) => e.status === 'completed')
    const fr = t.map((e) => timings[e.id]?.first_action_at && workingMinutesBetween(e.created_at, timings[e.id].first_action_at)).filter((m) => m != null && m !== false)
    const ot = done.filter((e) => { const end = timings[e.id]?.completed_at || e.updated_at; return e.due_at && end && new Date(end) <= new Date(e.due_at) }).length
    const fd = done.map((e) => { const end = timings[e.id]?.completed_at || e.updated_at; return end ? (new Date(end) - new Date(e.created_at)) / 86400000 : null }).filter((v) => v != null)
    return { id: x.id, name: x[nameKey], total: t.length, open: t.filter(isOpen).length, done: done.length, late: t.filter((e) => isOverdue(e, now.getTime())).length, cancelled: t.filter((e) => e.status === 'cancelled').length, onTimePct: done.length ? Math.round((ot / done.length) * 100) : null, firstMins: median(fr), avgDays: fd.length ? fd.reduce((a, b) => a + b, 0) / fd.length : null }
  }).filter(Boolean).sort((a, b) => b.total - a.total)

  return {
    received: list.length,
    prevReceived: prevList.length,
    completed: completed.length,
    cancelled: cancelled.length,
    open: list.filter(isOpen).length,
    overdue: list.filter((e) => isOverdue(e, now.getTime())).length,
    noBuddy: list.filter((e) => isOpen(e) && !e.assigned_buddy_id).length,
    noPartner: list.filter((e) => isOpen(e) && !e.assigned_partner_id).length,
    completionRate: closed ? Math.round((completed.length / closed) * 100) : null,
    emergencies: list.filter(isEmergencyTicket).length,
    afterHours: list.filter(isOutOfHours).length,
    firstMedian: median(firsts),
    within1hPct: firsts.length ? Math.round((within1h / firsts.length) * 100) : null,
    waiting,
    finishMedianDays: median(finishDays),
    onTimePct: completed.length ? Math.round((onTime / completed.length) * 100) : null,
    repeat,
    perDay, heat, SLOTS, funnel,
    cancelReasons: countBy(cancelled, (e) => e.cancel_reason || 'No reason given'),
    byService: trend((e) => serviceLabel(e.service)),
    byItem: trend(itemOf).slice(0, 12),
    byTown: trend(townOf).slice(0, 12),
    byUrgency: countBy(list, (e) => e.urgency || 'Not said'),
    bySource: countBy(list, (e) => (e.source === 'app' ? 'App' : 'Website')),
    byChannel: countBy(list, (e) => ({ chat: 'Chat Buddy', page: 'Service page', phone: 'Phone call' }[e.channel] || 'Form')),
    buddyCards: card(buddies, 'assigned_buddy_id', 'name'),
    partnerCards: card(partners, 'assigned_partner_id', 'business_name'),
  }
}

/** "35 min" / "3.5 hrs" (office time) */
export const fmtMins = (m) => (m == null ? '—' : m < 60 ? `${Math.round(m)} min` : `${(m / 60).toFixed(m < 600 ? 1 : 0)} hrs`)
export const fmtDays = (d) => (d == null ? '—' : d < 1 ? '< 1 day' : `${d.toFixed(1)} days`)
export const pctChange = (n, prev) => (!prev ? (n ? 'new' : '') : `${n >= prev ? '▲' : '▼'} ${Math.abs(Math.round(((n - prev) / prev) * 100))}%`)
export { OPEN_STATUSES, isWorkingTime }
