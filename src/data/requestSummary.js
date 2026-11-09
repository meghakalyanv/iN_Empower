/**
 * Turns the English request text that the step-by-step screens build
 * ("- Budget: ₹1–2 lakh", "Checklist Status:", "[Ready]", ...) into rows for the
 * "Confirm your request" card. The text itself is sent to the team unchanged.
 */
export function requestSummary(message) {
  return String(message || '')
    .split('\n')
    .map((raw) => ({ raw, t: raw.trim() }))
    .filter(({ t }) => t && !/^Hello,/i.test(t))
    .map(({ raw, t }) => {
      const indent = /^\s{2,}/.test(raw)
      const bullet = /^-\s+/.test(t)
      const body = t.replace(/^-\s+/, '')
      if (/^\[.+\]$/.test(t)) return { kind: 'head', text: t.slice(1, -1) }
      if (!bullet && /:$/.test(t)) return { kind: 'head', text: t.slice(0, -1) }
      const m = body.match(/^([^:]{2,60}):\s+(.+)$/)
      if (m) return { kind: 'pair', label: m[1].trim(), value: m[2].trim(), indent }
      return { kind: bullet ? 'item' : 'text', text: body, indent }
    })
}

/** The message sent to the team: the original answers plus the customer's optional note. */
export function withCustomerNote(message, note) {
  const n = String(note || '').trim()
  return n ? `${String(message || '').trim()}\n\nNote from customer: ${n}` : String(message || '').trim()
}
