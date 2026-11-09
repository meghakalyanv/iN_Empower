/**
 * Phone numbers — India and abroad. Shared by the website, the app (copied with
 * `npm run sync-data`) and the admin portal.
 *
 *   Indian mobile:  "98765 43210", "+91 98765 43210", "09876543210"  → kept as "9876543210"
 *   Abroad (NRIs):  must start with + and the country code, e.g. "+1 415 555 0100",
 *                   "+44 7700 900123", "+971 50 123 4567"            → kept as "+14155550100"
 *
 * Indian numbers stay as 10 digits (the format already in the database);
 * other countries keep their + and country code so WhatsApp and calls work.
 */

const digitsOf = (s) => String(s || '').replace(/\D/g, '')

/**
 * Read what someone typed. Returns
 * { ok, value, indian, display, digits }  — value is what we save.
 */
export function readPhone(input) {
  const raw = String(input || '').trim()
  const hasPlus = /^\s*(\+|00)/.test(raw)
  let d = digitsOf(raw)
  if (hasPlus && raw.trim().startsWith('00')) d = d.replace(/^00/, '')
  // Indian numbers (with or without +91 / 0)
  let indian = null
  if (!hasPlus && /^[6-9]\d{9}$/.test(d)) indian = d
  else if (!hasPlus && /^0[6-9]\d{9}$/.test(d)) indian = d.slice(1)
  else if (/^91[6-9]\d{9}$/.test(d)) indian = d.slice(2)
  if (indian) {
    return { ok: true, indian: true, value: indian, digits: '91' + indian, display: `+91 ${indian.slice(0, 5)} ${indian.slice(5)}` }
  }
  // Other countries: + and 8–15 digits (ITU E.164), not starting with 0
  if (hasPlus && /^[1-9]\d{7,14}$/.test(d) && !d.startsWith('91')) {
    return { ok: true, indian: false, value: `+${d}`, digits: d, display: `+${d}` }
  }
  return { ok: false, indian: false, value: raw, digits: d, display: raw }
}

/** true for an Indian mobile number or a full international number (+country code). */
export const isValidPhone = (input) => readPhone(input).ok

/** true only for an Indian mobile number (Local Buddies, partners). */
export const isIndianMobile = (input) => { const p = readPhone(input); return p.ok && p.indian }

/** The value to save for a phone number (falls back to what was typed). */
export const phoneToSave = (input) => readPhone(input).value

/** Digits for WhatsApp / tel: links — 10-digit Indian numbers get 91 in front. */
export function phoneForLinks(phone) {
  const raw = String(phone || '').trim()
  const p = readPhone(raw)
  if (p.ok) return p.digits
  const d = digitsOf(raw)
  if (d.length === 10) return '91' + d
  if (d.length === 11 && d.startsWith('0')) return '91' + d.slice(1)
  return d
}

/** Nicely spaced number to show people: "+91 98765 43210" / "+14155550100". */
export const showPhone = (phone) => { const p = readPhone(phone); return p.ok ? p.display : String(phone || '') }

/** Same person? Compares the last 10 digits (old rows may lack +91). */
export const samePhone = (a, b) => {
  const x = digitsOf(a).slice(-10); const y = digitsOf(b).slice(-10)
  return x.length >= 8 && x === y
}
