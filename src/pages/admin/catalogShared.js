// Shared helpers for the Services, Supplies and Workshops admin screens.
import { builtInCatalog, indexRows, buildCatalog } from '../../data/catalog'
import { sectionKind } from '../../data/serviceLayout'

export const KIND_LABEL = { service: 'Service', supply: 'Supply', workshop: 'Workshop' }

export const SECTION_TYPES = [
  { key: 'choose', label: 'Options — customer can pick several' },
  { key: 'ask', label: 'Question — customer picks one answer' },
  { key: 'papers', label: 'Documents / details to keep ready' },
  { key: 'info', label: 'Information only (how it works, notes)' },
]

export const slug = (t) => String(t || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'item'
export const lines = (text) => String(text || '').split('\n').map((x) => x.trim()).filter(Boolean)

/** Built-in items for a kind (services exclude supplies and the category cards). */
export function builtInList(kind) {
  const b = builtInCatalog()
  if (kind === 'service') return b.services.filter((s) => s.category !== 'supplies' && !s.isCategoryCard)
  if (kind === 'supply') return b.supplies.map((s) => ({ ...s, ordering: b.ordering[s.id] || null }))
  return b.workshops.map((w) => ({ ...w, id: String(w.id) }))
}

/**
 * Every item of a kind as the admin should see it: built-in ones (changed or not),
 * then new ones, in the saved order. Each entry: { id, item, row, isNew, status }.
 */
export function adminList(kind, rows) {
  const by = indexRows(rows)
  const builtIn = builtInList(kind)
  const out = builtIn.map((b) => {
    const row = by[kind][String(b.id)]
    return { id: String(b.id), item: row ? { ...b, ...row.data, id: String(b.id) } : b, row, isNew: false, status: row ? row.status : 'live' }
  })
  Object.values(by[kind]).forEach((row) => {
    if (!builtIn.some((b) => String(b.id) === row.item_id)) out.push({ id: row.item_id, item: { ...row.data, id: row.item_id }, row, isNew: true, status: row.status })
  })
  const ids = by.order[kind]?.data?.ids
  if (Array.isArray(ids) && ids.length) {
    const pos = new Map(ids.map((id, i) => [String(id), i]))
    out.sort((a, b) => (pos.has(a.id) ? pos.get(a.id) : 1e6) - (pos.has(b.id) ? pos.get(b.id) : 1e6))
  }
  return out
}

/** Full ordered id list for a kind (what the "order" row stores). */
export function orderIds(kind, rows) {
  if (kind === 'service') {
    // Services order covers every service id, including supplies and category cards
    const all = buildCatalog(rows).services.map((s) => String(s.id))
    const listed = adminList('service', rows).map((x) => x.id)
    return [...new Set([...all, ...listed])]
  }
  return adminList(kind, rows).map((x) => x.id)
}

/** The type of a service section (explicit, or worked out from its heading). */
export const sectionType = (service, sec) => (sec.kind && SECTION_TYPES.some((t) => t.key === sec.kind) ? sec.kind : sectionKind(service, sec))

export function statusBadge(entry) {
  if (entry.status === 'hidden') return { label: entry.isNew ? 'New · Hidden' : 'Hidden', color: '#475569', bg: '#F1F5F9' }
  if (entry.isNew) return { label: 'New · Live', color: '#0F6B06', bg: '#E7F3E6' }
  if (entry.row) return { label: 'Live · edited', color: '#1D4ED8', bg: '#E0EAFF' }
  return { label: 'Live', color: '#0F6B06', bg: '#E7F3E6' }
}
