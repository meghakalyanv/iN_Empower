/**
 * Loads the live catalog (admin changes to services, supplies, workshops, holidays
 * and cities) before the website shows its first page.
 * 1. The customer's saved city is set first, so the right services show at once.
 * 2. The copy saved on this device last time is applied (fast).
 * 3. The latest copy is fetched; we wait at most ~1.5 s for it, otherwise the
 *    page opens with the saved / built-in lists and the latest copy is used
 *    from the next page load.
 */
import { api } from './api'
import { applyCatalog } from '../data/catalog'
import { setCurrentCity } from '../data/cities'

const KEY = 'inempower_catalog_v1'
export const CITY_KEY = 'inempower_city'

/** The city this browser chose before: { id, town, how, at } or null */
export function savedCity() {
  try {
    const v = JSON.parse(localStorage.getItem(CITY_KEY) || 'null')
    return v && typeof v.id === 'string' ? v : null
  } catch {
    return null
  }
}
export function saveCity(v) {
  try { localStorage.setItem(CITY_KEY, JSON.stringify(v)) } catch { /* private mode */ }
}

export async function loadCatalog({ waitMs = 1500 } = {}) {
  const city = savedCity()
  if (city) setCurrentCity(city.id, { town: city.town })
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (Array.isArray(saved?.rows)) applyCatalog(saved.rows)
  } catch { /* nothing saved */ }

  const fresh = (async () => {
    try {
      const rows = await api.listCatalog?.()
      if (!Array.isArray(rows)) return
      applyCatalog(rows)
      try { localStorage.setItem(KEY, JSON.stringify({ rows, at: Date.now() })) } catch { /* storage full or blocked */ }
    } catch { /* offline: keep what we have */ }
  })()
  await Promise.race([fresh, new Promise((r) => setTimeout(r, waitMs))])
}

/** After an admin save: apply right away and remember for the next load. */
export function applyAdminRows(rows) {
  applyCatalog(rows)
  try { localStorage.setItem(KEY, JSON.stringify({ rows, at: Date.now() })) } catch { /* ignore */ }
}
