/**
 * Live catalog — shared by the website and the mobile app (the app copies this
 * file with `npm run sync-data`).
 *
 * The built-in lists (servicesData, suppliesData, workshopsData and the Telugu
 * files) are the starting point. Changes made in the team admin portal are saved
 * in the `catalog_items` table; applyCatalog(rows) puts them on top, in place,
 * so every page and screen that imports those lists sees the changes:
 *   • edit an item (row.data replaces the built-in item with the same id)
 *   • hide an item (status 'hidden')
 *   • add a new item (a new id)
 *   • change the order (kind 'order', data.ids)
 *   • Telugu wording (row.te: { "English line": "తెలుగు" })
 * If the rows can't be loaded (offline), the built-in lists are used as they are.
 */
import servicesData from './servicesData.js'
import { supplyCategories, supplyOrdering } from './suppliesData.js'
import { workshops } from './workshopsData.js'
import { SERVICES_TE } from './servicesTe.js'
import { SUPPLIES_TE } from './suppliesTe.js'
import { chatServices } from './chatSteps.js'
import { setHolidays, AP_HOLIDAYS, setWorkHours } from './workHours.js'
import { setCities, currentCity, isOffered } from './cities.js'

const clone = (x) => JSON.parse(JSON.stringify(x))

// Untouched copies of the built-in lists, so applying twice gives the same result
const BUILT_IN = {
  services: clone(servicesData),
  supplies: clone(supplyCategories),
  ordering: clone(supplyOrdering),
  workshops: clone(workshops),
  servicesTe: { ...SERVICES_TE },
  suppliesTe: { ...SUPPLIES_TE },
}

export const builtInCatalog = () => clone({ services: BUILT_IN.services, supplies: BUILT_IN.supplies, ordering: BUILT_IN.ordering, workshops: BUILT_IN.workshops })

let applied = { count: 0, at: null }

// Services this platform does not show (owner, 2 Nov 2026 — legal report). The app hides Personal Loan
// and Gold Loan: Google Play accepts personal-loan apps in India only when a bank has listed the app
// with RBI. The website keeps them. Set once at start (the app's catalogLoader) and kept on every apply.
let hiddenHere = new Set()
const dropHidden = (list) => {
  for (let i = list.length - 1; i >= 0; i--) if (hiddenHere.has(list[i]?.id)) list.splice(i, 1)
}
export function hideOnThisPlatform(ids) {
  hiddenHere = new Set(ids || [])
  dropHidden(servicesData)
  dropHidden(chatServices)
}
export const hiddenOnThisPlatform = () => [...hiddenHere]
export const catalogInfo = () => applied

function replaceArray(target, items) {
  target.splice(0, target.length, ...items)
}
function replaceObject(target, obj) {
  Object.keys(target).forEach((k) => { delete target[k] })
  Object.assign(target, obj)
}

/** Order `list` by `ids`; anything not listed keeps its place after the listed ones. */
function orderBy(list, ids) {
  if (!Array.isArray(ids) || !ids.length) return list
  const pos = new Map(ids.map((id, i) => [String(id), i]))
  return list
    .map((x, i) => ({ x, i }))
    .sort((a, b) => {
      const pa = pos.has(String(a.x.id)) ? pos.get(String(a.x.id)) : 1e6 + a.i
      const pb = pos.has(String(b.x.id)) ? pos.get(String(b.x.id)) : 1e6 + b.i
      return pa - pb
    })
    .map((o) => o.x)
}

/** Merge admin rows into one { kind: { id: row } } map (pure; used by admin screens too). */
export function indexRows(rows) {
  const by = { service: {}, supply: {}, workshop: {}, order: {}, settings: {} }
  ;(rows || []).forEach((r) => { if (r && by[r.kind]) by[r.kind][String(r.item_id)] = r })
  return by
}

/**
 * Build the catalog the customers should see, without changing anything (pure).
 * With { city }, items that city does not offer (Admin → Cities) are left out.
 */
// Services the owner moved to another group in the code: an admin save made before the move
// (it stored the old group) must not move them back. { id: [old group, new group] }
const MOVED = { 'plumbing-services': ['drivers', 'electricity'] }

export function buildCatalog(rows, { city = null } = {}) {
  const by = indexRows(rows)
  const base = builtInCatalog()
  const te = {}

  // ── Services ──
  let services = base.services.map((s) => {
    const r = by.service[s.id]
    if (!r) return s
    Object.assign(te, r.te || {})
    if (r.status !== 'live') return null
    const moved = MOVED[s.id] && r.data?.category === MOVED[s.id][0] ? { category: MOVED[s.id][1] } : {}
    return { ...s, ...(r.data || {}), id: s.id, ...moved }
  }).filter(Boolean)
  Object.values(by.service).forEach((r) => {
    Object.assign(te, r.te || {})
    if (r.status === 'live' && !base.services.some((s) => s.id === r.item_id) && r.data?.title) {
      services.push({ sections: [], icon: 'Briefcase', iconColor: '#213361', ...r.data, id: r.item_id })
    }
  })

  // ── Supplies (page cards + ordering options) ──
  const ordering = base.ordering
  let supplies = base.supplies.map((s) => {
    const r = by.supply[s.id]
    if (!r) return s
    Object.assign(te, r.te || {})
    if (r.status !== 'live') { delete ordering[s.id]; return null }
    const { ordering: o, ...card } = r.data || {}
    if (o) ordering[s.id] = { ...(ordering[s.id] || {}), ...o }
    return { ...s, ...card, id: s.id }
  }).filter(Boolean)
  Object.values(by.supply).forEach((r) => {
    Object.assign(te, r.te || {})
    if (r.status === 'live' && !base.supplies.some((s) => s.id === r.item_id) && r.data?.title) {
      const { ordering: o, ...card } = r.data
      supplies.push({ icon: 'Package', iconColor: '#8B2127', beneficiaries: [], highlights: [], ...card, id: r.item_id })
      ordering[r.item_id] = { unit: 'pieces', start: 1, step: 1, options: [], ...(o || {}) }
    }
  })
  supplies = orderBy(supplies, by.order.supply?.data?.ids)
  if (city) supplies = supplies.filter((s) => isOffered('supplies', s.id, city))

  // Supplies also appear in servicesData (category 'supplies') for the chat and contact form
  const supplyIds = new Set(supplies.map((s) => s.id))
  services = services.filter((s) => s.category !== 'supplies' || supplyIds.has(s.id))
  supplies.forEach((s) => {
    const i = services.findIndex((x) => x.id === s.id && x.category === 'supplies')
    const isBuiltIn = base.supplies.some((b) => b.id === s.id)
    if (i === -1) { if (!isBuiltIn) services.push({ id: s.id, category: 'supplies', icon: s.icon, iconColor: s.iconColor, title: s.title, subtitle: s.tagline || '', sections: [] }) }
    else if (by.supply[s.id]) services[i] = { ...services[i], title: s.title, subtitle: s.tagline || services[i].subtitle, icon: s.icon || services[i].icon }
  })
  services = orderBy(services, by.order.service?.data?.ids)
  services = services.filter((s) => !hiddenHere.has(s.id))
  if (city) {
    services = services.filter((s) => s.category === 'supplies' || isOffered('services', s.id, city))
    // A category card (e.g. "Photography Services") goes when nothing in it is offered
    services = services.filter((s) => !s.isCategoryCard || !s.targetCategory || services.some((x) => x.category === s.targetCategory && !x.isCategoryCard))
  }

  // ── Workshops ──
  let list = base.workshops.map((w) => {
    const r = by.workshop[String(w.id)]
    if (!r) return w
    Object.assign(te, r.te || {})
    if (r.status !== 'live') return null
    return { ...w, ...(r.data || {}), id: w.id }
  }).filter(Boolean)
  Object.values(by.workshop).forEach((r) => {
    Object.assign(te, r.te || {})
    if (r.status === 'live' && !base.workshops.some((w) => String(w.id) === r.item_id) && r.data?.title) {
      list.push({ icon: '🎓', points: [], ...r.data, id: r.item_id })
    }
  })
  list = orderBy(list, by.order.workshop?.data?.ids)
  if (city) list = list.filter((w) => isOffered('workshops', w.id, city))

  return { services, supplies, ordering, workshops: list, te }
}

let lastRows = []

/**
 * Apply admin rows to the shared lists in place (call before the first screen renders).
 * Also sets the cities (Admin → Cities) and keeps only what the customer's city offers.
 */
export function applyCatalog(rows) {
  lastRows = Array.isArray(rows) ? rows : []
  const cityRow = indexRows(lastRows).settings.cities
  setCities(cityRow?.data?.cities, { defaultCity: cityRow?.data?.defaultCity })
  const c = buildCatalog(lastRows, { city: currentCity() })
  replaceArray(servicesData, c.services)
  replaceArray(supplyCategories, c.supplies)
  replaceObject(supplyOrdering, c.ordering)
  replaceArray(workshops, c.workshops)
  replaceArray(chatServices, c.services.filter((s) => s.category !== 'supplies'))
  replaceObject(SERVICES_TE, { ...BUILT_IN.servicesTe, ...c.te })
  replaceObject(SUPPLIES_TE, { ...BUILT_IN.suppliesTe, ...c.te })
  // Working days: the holiday list saved in Admin → Settings (defaults until then)
  setHolidays(indexRows(rows).settings.holidays?.data?.days || AP_HOLIDAYS)
  // Office hours (Admin → Settings; defaults until saved)
  setWorkHours(indexRows(rows).settings.hours?.data)
  applied = { count: (rows || []).length, at: new Date().toISOString() }
  return c
}

/** After the customer changes city: apply the same rows again for the new city. */
export const reapplyCatalog = () => applyCatalog(lastRows)
/** The rows applied last (the admin's saved changes). */
export const appliedRows = () => lastRows

/** Every English line in an item that customers can see — for the Telugu checklist. */
export function textLines(kind, item) {
  const out = []
  const add = (t) => { if (typeof t === 'string' && t.trim() && !out.includes(t)) out.push(t) }
  if (!item) return out
  if (kind === 'service') {
    add(item.title); add(item.subtitle)
    ;(item.sections || []).forEach((s) => { add(s.heading); (s.items || []).forEach(add) })
  } else if (kind === 'supply') {
    add(item.title); add(item.tagline); add(item.description)
    ;(item.beneficiaries || []).forEach(add); (item.highlights || []).forEach(add)
    ;(item.ordering?.options || []).forEach((o) => { add(o.label); (o.choices || []).forEach(add) })
  } else if (kind === 'workshop') {
    add(item.title); add(item.tagline); add(item.description); add(item.location); add(item.date)
    ;(item.points || []).forEach(add)
  }
  return out
}

/** Telugu for a line: admin wording first, then the built-in Telugu files. */
export const builtInTe = (line) => BUILT_IN.servicesTe[line] ?? BUILT_IN.suppliesTe[line] ?? null

/* ── Workshops: fee and seats, worded the same on the website and app ── */
export const workshopFee = (w) => (Number(w?.fee) > 0 ? `₹${Number(w.fee).toLocaleString('en-IN')}` : 'Free')
export function workshopSeatsInfo(w, taken = 0) {
  const seats = Number(w?.seats) || 0
  if (!seats) return { limited: false, full: false, left: null, text: '' }
  const left = Math.max(0, seats - (Number(taken) || 0))
  return { limited: true, full: left === 0, left, text: left === 0 ? 'Full' : `${left} seat${left === 1 ? '' : 's'} left` }
}
