/**
 * Light monitoring for the team's Monitor page (/admin/monitor).
 * - One "visit" row per browser tab session: first page, where they came from, phone or computer.
 * - Page errors (max 5 per session) so the team sees when something breaks.
 * No names, phone numbers, cookies or tracking IDs are stored.
 * Team pages (/admin) and local development are never counted.
 */
import { api } from './api'

const SESSION_KEY = 'inempower_visit_logged'
let errorsSent = 0
const seenErrors = new Set()

function device() {
  const ua = navigator.userAgent || ''
  if (/iPad|Tablet/i.test(ua)) return 'tablet'
  if (/Mobi|Android|iPhone/i.test(ua) || window.innerWidth < 768) return 'mobile'
  return 'desktop'
}

function referrerHost() {
  try {
    if (!document.referrer) return null
    const host = new URL(document.referrer).hostname.replace(/^www\./, '')
    if (host === window.location.hostname.replace(/^www\./, '')) return null
    if (/google\./.test(host)) return 'Google'
    if (/facebook\.|fb\./.test(host)) return 'Facebook'
    if (/instagram\./.test(host)) return 'Instagram'
    if (/whatsapp\./.test(host) || host === 'wa.me') return 'WhatsApp'
    if (/youtube\./.test(host)) return 'YouTube'
    return host.slice(0, 120)
  } catch {
    return null
  }
}

const isTeamPage = () => window.location.pathname.startsWith('/admin') || /redirect=%2Fadmin|redirect=\/admin/.test(window.location.search)

export function startMonitoring() {
  if (import.meta.env.DEV || typeof window === 'undefined') return
  try {
    if (!isTeamPage() && !sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, '1')
      let lang = null
      try { lang = (localStorage.getItem('inempower_lang') || navigator.language || '').slice(0, 10) || null } catch { /* ignore */ }
      api.logVisit?.({
        source: 'website',
        path: window.location.pathname.slice(0, 200),
        referrer: referrerHost(),
        device: device(),
        lang,
      })
    }
  } catch { /* storage blocked: skip */ }

  const report = (message, path) => {
    if (isTeamPage() || errorsSent >= 5) return
    const msg = String(message || 'Unknown error').replace(/\s+/g, ' ').slice(0, 500)
    if (seenErrors.has(msg)) return
    seenErrors.add(msg)
    errorsSent++
    api.logError?.({ source: 'website', message: msg, path: (path || window.location.pathname).slice(0, 200), device: device() })
  }
  window.addEventListener('error', (ev) => {
    // Ignore errors from browser extensions and other sites' scripts
    if (ev.filename && !ev.filename.startsWith(window.location.origin)) return
    report(ev.message || ev.error?.message)
  })
  window.addEventListener('unhandledrejection', (ev) => {
    const m = ev.reason?.message || String(ev.reason || '')
    if (/Failed to fetch|NetworkError|Load failed|No internet/i.test(m)) return // visitor's network, not our bug
    report(m)
  })
}
