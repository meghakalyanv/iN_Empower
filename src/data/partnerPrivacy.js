/**
 * Business Partners (suppliers, vendors, caterers, photographers…) never get the customer's
 * name, phone, email or exact address. They get what to quote for and the town / village only.
 * The Local Buddy talks to the partner for the customer and is present at delivery or work.
 * Used by the admin panel's partner WhatsApp message (pages/admin/adminShared.js).
 */
import { allTowns } from './cities.js'

export const PRAKASAM_TOWNS = [
  'Ongole', 'Kandukur', 'Addanki', 'Chimakurthy', 'Darsi', 'Singarayakonda', 'Kothapatnam', 'Markapur', 'Markapuram',
  'Chirala', 'Kanigiri', 'Giddalur', 'Podili', 'Tangutur', 'Kondapi', 'Martur', 'Parchur', 'Cumbum', 'Yerragondapalem',
  'Ulavapadu', 'Naguluppalapadu', 'Maddipadu', 'Santhanuthalapadu', 'Inkollu', 'Chinaganjam', 'Zarugumilli', 'Bestavaripeta',
  'Tripuranthakam', 'Pamur', 'Lingasamudram', 'Gudlur', 'Voletivaripalem', 'Mundlamuru', 'Talluru', 'Janakavaram Panguluru',
]

export const HIDDEN = '(Buddy will share)'

/** "Ongole - Near Bus Stand", "12-3-4, Santhapet, Ongole" → "Ongole". Unknown or address-like → '' */
export function townOnly(place) {
  const s = String(place || '').trim()
  if (!s) return ''
  const lower = s.toLowerCase()
  // Towns of every city (Admin → Cities) and the Prakasam list
  const names = [...new Set([...allTowns().map((t) => t.name), ...PRAKASAM_TOWNS])].sort((a, b) => b.length - a.length)
  const known = names.find((t) => new RegExp(`\\b${t.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(lower))
  if (known) return known
  const first = s.split(/\s[-–]\s|,|\(|\n/)[0].trim()
  // A short word without numbers is probably a village name; anything else may be an address
  return first && first.length <= 25 && !/\d/.test(first) && first.split(/\s+/).length <= 3 ? first : ''
}

/** Hides phone numbers and email addresses inside free text. */
export function scrubContacts(text) {
  return String(text || '')
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '[hidden]')
    .replace(/(\+?91[\s-]?)?\d[\d\s-]{8,}\d/g, (m) => (m.replace(/\D/g, '').length >= 10 ? '[hidden]' : m))
}

const PRIVATE_Q = /phone|mobile|whats\s?app|\bname\b|e-?mail|address|deliver(y)?\s*(to|place|address)|house|door|street|landmark|pin\s?code|location|contact/i

/** Step answers safe to send to a partner (no contact questions; numbers / emails hidden). */
export function partnerAnswers(answers) {
  if (!Array.isArray(answers)) return []
  return answers
    .filter((a) => a && !PRIVATE_Q.test(String(a.q || '')))
    .map((a) => ({ ...a, a: scrubContacts(a.a) }))
}

/** The customer's free-text message, made safe for a partner. */
export function partnerDetails(message, max = 500) {
  return String(message || '')
    .split('\n')
    .filter((l) => !/^\s*-?\s*(name|full name|phone|mobile|whats\s?app|e-?mail|address|house|door no|street|landmark|pin\s?code)\s*:/i.test(l))
    .map((l) => {
      const m = l.match(/^(\s*-?\s*)(deliver to|delivery address|place|location|area|site address|venue)\s*:\s*(.*)$/i)
      if (m) return `${m[1]}${m[2]}: ${townOnly(m[3]) || HIDDEN}`
      return scrubContacts(l)
    })
    .join('\n')
    .trim()
    .slice(0, max)
}
