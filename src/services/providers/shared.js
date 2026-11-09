/**
 * Helpers shared by the mock and Supabase providers so both return
 * exactly the same shapes to the pages.
 */
import { currentCity, currentTown, teamPhoneShown } from '../../data/cities.js'
import { phoneToSave, readPhone } from '../../data/phone.js'

/**
 * Every request remembers the customer's city (Admin → Cities) — and the town
 * found from their location, if they allowed it — so the right team handles it.
 */
export function withCity(details) {
  const c = currentCity()
  const town = currentTown()
  return { ...(details || {}), city: c.id, cityName: c.name, ...(town && !details?.nearTown ? { nearTown: town } : {}) }
}

/** A short reference people can quote on the phone, e.g. IN-7K3Q9 (same as the Chat Buddy's). */
export function newRequestRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `IN-${s}`
}

/** Every request carries a reference number (kept if the Chat Buddy already made one). */
export const withRef = (details) => (details?.ref ? details : { ...(details || {}), ref: newRequestRef() })

/** References look like IN-7K3Q9: tidy what people type ("in 7k3q9" → "IN-7K3Q9"). */
export function cleanRef(text) {
  const s = String(text || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  const core = s.startsWith('IN') ? s.slice(2) : s
  return core.length === 5 ? `IN-${core}` : ''
}

/** Phone numbers are saved one way: Indian mobiles as 10 digits, others as +country code. */
export const cleanPhoneForSave = (phone) => phoneToSave(String(phone || '').trim())

/** For the profile form: '' is allowed; anything else must be a real number. */
export function profilePhone(phone) {
  const raw = String(phone || '').trim()
  if (!raw) return ''
  const p = readPhone(raw)
  if (!p.ok) throw new Error('Please enter a valid mobile number (from abroad: start with + and the country code)')
  return p.value
}

/** "Please call or WhatsApp us on …" with the number of the customer's city. */
export const callUsLine = (start = 'Sorry, we could not send your message.') => `${start} Please call or WhatsApp us on ${teamPhoneShown()}.`

const ENQUIRY_STATUS = {
  new: 'Submitted',
  contacted: 'In Review',
  in_progress: 'In Review',
  completed: 'Confirmed',
  cancelled: 'Cancelled',
}

const JOB_STATUS = {
  pending: 'In Review',
  approved: 'Confirmed',
  rejected: 'Rejected',
  closed: 'Closed',
}

function enquiryType(service) {
  if (service === 'part-time') return 'apply-job'
  if (service === 'workshop') return 'workshop'
  return 'service'
}

function prettify(value) {
  if (!value) return ''
  // Capital at the start of each word only ("Learner's", not "Learner'S")
  return String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/(^|\s)(\w)/g, (m, sp, c) => sp + c.toUpperCase())
}

export function toRequestFromEnquiry(row) {
  const firstLine = (row.message || '').split('\n').find((l) => l.trim()) || ''
  return {
    id: row.id,
    type: enquiryType(row.service),
    service: row.service || null,
    title: prettify(row.sub_service) || prettify(row.service) || 'General enquiry',
    details: firstLine.length > 140 ? firstLine.slice(0, 137) + '…' : firstLine,
    message: row.message || '',
    rawStatus: row.status,
    ref: row.details?.ref || null,
    status: ENQUIRY_STATUS[row.status] || 'Submitted',
    date: row.created_at,
    updatedAt: row.updated_at || row.created_at,
  }
}

/** Customer-facing wording for the request history. */
export function toTimelineEntry(a) {
  const LABELS = { new: 'Submitted', contacted: 'Our team contacted you', in_progress: 'Work in progress', completed: 'Completed', cancelled: 'Cancelled' }
  let text = a.detail
  if (a.kind === 'status') {
    const to = String(a.detail).split(' → ')[1]
    text = LABELS[to] || a.detail
  }
  return { id: a.id, kind: a.kind, text, date: a.created_at }
}

export function toRequestFromJobPost(row) {
  const pay = row.pay_per_hour != null ? ` • ₹${row.pay_per_hour}/hr` : ''
  return {
    id: row.id,
    type: 'post-job',
    title: row.job_title,
    details: `${row.business_name} • ${row.location}${pay}`,
    status: JOB_STATUS[row.status] || 'In Review',
    date: row.created_at,
  }
}

export function normalizeUser(authUser, profile) {
  const meta = authUser?.user_metadata || {}
  const firstName = profile?.first_name || meta.first_name || ''
  const lastName = profile?.last_name || meta.last_name || ''
  const email = authUser?.email || profile?.email || ''
  const name = profile?.full_name || [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0] || 'User'
  return {
    id: authUser?.id,
    email,
    name,
    firstName,
    lastName,
    phone: profile?.phone || meta.phone || '',
    dob: profile?.dob || meta.dob || '',
    gender: profile?.gender || meta.gender || '',
    area: meta.area || '',
  }
}

/** Turns Supabase auth errors into messages a customer understands. */
export function friendlyAuthError(error, fallback) {
  const msg = (error && error.message) || ''
  const code = (error && error.code) || ''
  if (/otp_disabled|signups? not allowed|user not found/i.test(msg + ' ' + code)) {
    return new Error('No account found for this email. Please tap "Create account" first.')
  }
  if (/otp_expired|token has expired|token.*invalid|invalid.*token/i.test(msg + ' ' + code)) {
    return new Error('That code is wrong or has expired. Please check it or request a new code.')
  }
  if (/email_address_invalid|invalid.*email|email.*invalid/i.test(msg + ' ' + code)) {
    return new Error('Please enter a valid email address.')
  }
  if (/rate.?limit|too many|security purposes/i.test(msg + ' ' + code)) {
    return new Error('Too many attempts. Please wait a minute and try again.')
  }
  if (/internet|network/i.test(msg)) return new Error(msg)
  return new Error(fallback)
}

/** Counts used on the dashboard overview. */
export function countRequests(requests) {
  return {
    serviceRequests: requests.filter((r) => r.type === 'service').length,
    jobApplications: requests.filter((r) => r.type === 'apply-job').length,
    jobPostings: requests.filter((r) => r.type === 'post-job').length,
    workshops: requests.filter((r) => r.type === 'workshop').length,
    total: requests.length,
  }
}
