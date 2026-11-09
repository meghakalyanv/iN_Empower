/**
 * Mock API Provider — iN Empower Website (for development only)
 *
 * Active when VITE_API_PROVIDER=mock (or not set).
 * Nothing leaves the browser: data is kept in this browser's localStorage
 * so you can click through every flow without a backend.
 * Any 6-digit code works for login.
 *
 * Same function signatures as providers/supabase.js.
 */

import { toRequestFromEnquiry, toRequestFromJobPost, toTimelineEntry, withCity, withRef, cleanRef, cleanPhoneForSave, profilePhone } from './shared'
import { readPhone } from '../../data/phone'
import { currentCity } from '../../data/cities'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const KEY_USER = 'inempower_mock_user'
const KEY_ENQ = 'inempower_mock_enquiries'
const KEY_JOBS = 'inempower_mock_job_posts'
const KEY_PENDING = 'inempower_mock_pending_signup'
const KEY_BUDDIES = 'inempower_mock_buddies'
const KEY_ACTIVITY = 'inempower_mock_activity'
const KEY_PROPS = 'inempower_mock_property_listings'
const KEY_PARTNERS = 'inempower_mock_partners'
const KEY_VISITS = 'inempower_mock_visits'
const KEY_ERRORS = 'inempower_mock_errors'
const KEY_CATALOG = 'inempower_mock_catalog'
const KEY_CITY_REQ = 'inempower_mock_city_requests'
const KEY_WA_STOP = 'inempower_mock_wa_optout'

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}
const newId = () => 'mock_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)

export const mockProvider = {
  // --- AUTHENTICATION ---

  async requestAuthCode(email, options = {}) {
    await delay(600)
    if (!email || !email.includes('@')) throw new Error('Invalid email format')
    write(KEY_PENDING, options.createUser ? { email, profile: options.profile || {} } : null)
    return { success: true, message: 'Code sent to ' + email + ' (dev mode: any 6 digits work)' }
  },

  async verifyAuthCode(email, code) {
    await delay(600)
    if (!/^\d{6}$/.test(String(code).trim())) throw new Error('Please enter the 6-digit code')
    const pending = read(KEY_PENDING, null)
    const existing = read(KEY_USER, null)
    const profile = pending && pending.email === email ? pending.profile : existing?.email === email ? existing : {}
    const firstName = profile.firstName || ''
    const lastName = profile.lastName || ''
    const user = {
      id: existing?.email === email ? existing.id : newId(),
      email,
      firstName,
      lastName,
      name: [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0],
      phone: profile.phone || '',
      dob: profile.dob || '',
      gender: profile.gender || '',
    }
    write(KEY_USER, user)
    write(KEY_PENDING, null)
    return { success: true, user }
  },

  async getCurrentUser() {
    return read(KEY_USER, null)
  },

  async signOut() {
    try {
      localStorage.removeItem(KEY_USER)
    } catch {
      /* ignore */
    }
  },

  // --- CONTACT & ENQUIRIES ---

  async submitContactForm(form) {
    await delay(600)
    if (!form.name || !form.phone) throw new Error('Name and phone number are required')
    const user = read(KEY_USER, null)
    const rows = read(KEY_ENQ, [])
    rows.unshift({
      id: newId(),
      user_id: user?.id || null,
      name: form.name,
      phone: cleanPhoneForSave(form.phone),
      email: form.email || null,
      service: form.service || null,
      sub_service: form.subService || null,
      message: form.message || null,
      item: form.item || null,
      area: form.area || null,
      urgency: form.urgency || null,
      details: withRef(withCity(form.details)),
      channel: form.channel || 'form',
      source: 'website',
      status: 'new',
      stage: 'new',
      due_at: new Date(Date.now() + ({ Today: 1, 'This week': 7, 'This month': 30, 'Just checking': 14 }[form.urgency] || 3) * 86400000).toISOString(),
      created_at: new Date().toISOString(),
    })
    write(KEY_ENQ, rows)
    return { success: true, message: 'Message sent successfully', ref: rows[0].details.ref }
  },

  async requestStatus(ref, phone) {
    await delay(300)
    const r = cleanRef(ref); const p = readPhone(phone)
    if (!r || !p.ok) return null
    const e = read(KEY_ENQ, []).find((x) => x.details?.ref === r && String(x.phone).slice(-10) === String(p.value).slice(-10))
    return e ? { ref: r, title: e.item || e.sub_service || e.service || 'Request', status: e.status, date: e.created_at, updatedAt: e.updated_at || e.created_at } : null
  },

  async applyAsPartner(form) {
    await delay(500)
    if (!String(form.business || '').trim() || !readPhone(form.phone).ok) throw new Error('Please add your business name and a valid phone number')
    const rows = read(KEY_PARTNERS, [])
    const created = {
      id: newId(), ref: `BP-${1001 + rows.length}`, status: 'pending',
      business_name: String(form.business).trim(), contact_name: form.contact || null,
      phone: cleanPhoneForSave(form.phone), whatsapp: form.whatsapp ? cleanPhoneForSave(form.whatsapp) : null,
      kind: form.kind || 'other', items: form.items || [], town: form.town || null, areas: form.areas || null,
      gst_number: form.gst || null, notes: [`Applied on the website (${currentCity().name}).`, form.note].filter(Boolean).join('\n'),
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
    rows.push(created)
    write(KEY_PARTNERS, rows)
    return { success: true, ref: created.ref }
  },

  // --- JOB POSTS ---

  async postJob(job) {
    await delay(600)
    const user = read(KEY_USER, null)
    if (!user) throw new Error('Please sign in to post a job.')
    const rows = read(KEY_JOBS, [])
    rows.unshift({
      id: newId(),
      user_id: user.id,
      job_title: job.jobTitle,
      business_name: job.businessName,
      location: job.location,
      pay_per_hour: job.pay ? Number(job.pay) : null,
      description: job.desc || null,
      status: 'pending',
      created_at: new Date().toISOString(),
    })
    write(KEY_JOBS, rows)
    return { success: true }
  },

  // --- PUBLIC: live job posts ---
  async listPublicJobs() {
    return read(KEY_JOBS, []).filter((j) => j.status === 'approved')
  },

  async listPropertyListings() {
    return read(KEY_PROPS, []).filter((l) => l.status === 'live')
  },

  // --- "Become a Local Buddy" application ---
  async applyAsBuddy(form) {
    await delay(500)
    if (!form.name || !form.phone) throw new Error('Name and phone number are required')
    const rows = read(KEY_BUDDIES, [])
    rows.push({ ...form, phone: cleanPhoneForSave(form.phone), details: withCity(form.details), id: newId(), status: 'pending', tier: 0, services: form.services || [], created_at: new Date().toISOString() })
    write(KEY_BUDDIES, rows)
    return { success: true }
  },

  // --- "Not in your city yet? Tell us" ---
  async addCityRequest({ cityName, name = '', phone = '', note = '' }) {
    await delay(300)
    const city = String(cityName || '').trim()
    if (city.length < 2) throw new Error('Please type the name of your city or town')
    const rows = read(KEY_CITY_REQ, [])
    rows.unshift({ id: newId(), city_name: city.slice(0, 80), name: name.trim() || null, phone: phone ? cleanPhoneForSave(phone) : null, note: note.trim() || null, source: 'website', created_at: new Date().toISOString() })
    write(KEY_CITY_REQ, rows)
    return { success: true }
  },

  // --- Customer: history of one of their requests ---
  async updateProfile({ firstName = '', lastName = '', phone = '', area = '' }) {
    const user = await read(KEY_USER, null)
    if (!user) throw new Error('Please sign in first')
    const digits = profilePhone(phone)
    const updated = {
      ...user,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') || user.email.split('@')[0],
      phone: digits,
      area: area.trim(),
    }
    await write(KEY_USER, updated)
    return updated
  },

  async getRequestTimeline(enquiryId) {
    return read(KEY_ACTIVITY, [])
      .filter((a) => a.enquiry_id === enquiryId && a.kind !== 'note')
      .map(toTimelineEntry)
  },

  // --- DASHBOARD ---

  async listMyRequests() {
    const user = read(KEY_USER, null)
    if (!user) return []
    const enq = read(KEY_ENQ, []).filter((r) => r.user_id === user.id).map(toRequestFromEnquiry)
    const jobs = read(KEY_JOBS, []).filter((r) => r.user_id === user.id).map(toRequestFromJobPost)
    return [...enq, ...jobs].sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  // --- LIVE CATALOG (dev mode: kept in this browser only) ---
  async listCatalog() {
    return read(KEY_CATALOG, [])
  },
  async workshopSeats() {
    const m = {}
    read(KEY_ENQ, []).forEach((e) => {
      const w = e.details?.workshopId
      if (e.service === 'workshop' && w && e.status !== 'cancelled') m[w] = (m[w] || 0) + 1
    })
    return m
  },

  // --- MONITORING (dev mode: kept in this browser only) ---
  async logVisit(row) {
    const rows = read(KEY_VISITS, [])
    rows.push({ ...row, created_at: new Date().toISOString() })
    write(KEY_VISITS, rows.slice(-2000))
  },
  async logError(row) {
    const rows = read(KEY_ERRORS, [])
    rows.push({ ...row, created_at: new Date().toISOString() })
    write(KEY_ERRORS, rows.slice(-200))
  },

  // --- TEAM ADMIN PANEL (dev mode: everyone signed in counts as staff) ---
  admin: {
    async isStaff() {
      return !!read(KEY_USER, null)
    },

    async listEnquiries() {
      const buddies = read(KEY_BUDDIES, [])
      const partners = read(KEY_PARTNERS, [])
      return read(KEY_ENQ, []).map((e) => {
        const b = buddies.find((x) => x.id === e.assigned_buddy_id)
        const p = partners.find((x) => x.id === e.assigned_partner_id)
        return {
          source: 'website', ...e,
          buddy: b ? { id: b.id, name: b.name, phone: b.phone } : null,
          partner: p ? { id: p.id, business_name: p.business_name, contact_name: p.contact_name, phone: p.phone, whatsapp: p.whatsapp } : null,
        }
      })
    },

    async ticketTimings() {
      const out = {}
      read(KEY_ACTIVITY, []).forEach((a) => {
        const t = (out[a.enquiry_id] = out[a.enquiry_id] || { first_action_at: null, completed_at: null, stages: [] })
        if (!/^Thank-you sent/.test(a.detail || '') && (!t.first_action_at || a.created_at < t.first_action_at)) t.first_action_at = a.created_at
        if (a.kind === 'stage') {
          const to = String(a.detail).split(' → ')[1]
          if (to && !t.stages.includes(to)) t.stages.push(to)
          if (to === 'completed') t.completed_at = a.created_at
        }
      })
      return out
    },

    async createRequest(form, { whatsappOk = true } = {}) {
      const user = read(KEY_USER, null)
      const takenBy = user?.name || user?.email || 'Team'
      const r = await mockProvider.submitContactForm({ ...form, channel: 'phone', details: { ...(form.details || {}), takenBy, takenOnCall: true } })
      const all = read(KEY_ENQ, [])
      const row = all.find((e) => e.details?.ref === r.ref)
      if (row) {
        row.user_id = null // the customer, not the team member who typed it
        write(KEY_ENQ, all)
        const act = read(KEY_ACTIVITY, [])
        act.push({ id: newId(), enquiry_id: row.id, actor_name: takenBy, kind: 'note', detail: `Request taken on a phone call by ${takenBy}.${whatsappOk ? '' : ' The customer does not want WhatsApp updates.'}`, created_at: new Date().toISOString() })
        write(KEY_ACTIVITY, act)
      }
      return { id: row?.id || null, ref: r.ref }
    },

    async listPartners() {
      return read(KEY_PARTNERS, []).sort((a, b) => a.business_name.localeCompare(b.business_name))
    },

    async savePartner(partner) {
      await delay(250)
      const rows = read(KEY_PARTNERS, [])
      if (partner.id) {
        const i = rows.findIndex((r) => r.id === partner.id)
        rows[i] = { ...rows[i], ...partner, updated_at: new Date().toISOString() }
        write(KEY_PARTNERS, rows)
        return rows[i]
      }
      const created = { status: 'active', kind: 'supply', items: [], ...partner, id: newId(), ref: `BP-${1001 + rows.length}`, created_at: new Date().toISOString() }
      rows.push(created)
      write(KEY_PARTNERS, rows)
      return created
    },

    async monitorStats(days = 30) {
      const since = Date.now() - days * 86400000
      const visits = read(KEY_VISITS, []).filter((v) => new Date(v.created_at) >= since)
      const errors = read(KEY_ERRORS, [])
      const byDay = (rows) => {
        const m = {}
        rows.forEach((r) => {
          const d = new Date(r.created_at).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
          m[d] = m[d] || { day: d, website: 0, app: 0 }
          m[d][r.source] = (m[d][r.source] || 0) + 1
        })
        return Object.values(m).sort((a, b) => a.day.localeCompare(b.day))
      }
      const countBy = (rows, f) => rows.reduce((m, r) => { const k = f(r); m[k] = (m[k] || 0) + 1; return m }, {})
      const top = (obj, key, n) => Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => ({ [key]: k, n: v }))
      const web = visits.filter((v) => v.source === 'website')
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
      return {
        visits_by_day: byDay(visits),
        top_pages: top(countBy(web, (v) => v.path || '/'), 'path', 8),
        referrers: top(countBy(web, (v) => v.referrer || 'Direct / WhatsApp'), 'referrer', 6),
        devices: countBy(visits, (v) => v.device || 'other'),
        app_versions: countBy(visits.filter((v) => v.source === 'app'), (v) => v.app_version || '?'),
        visits_today: visits.filter((v) => new Date(v.created_at).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) === today).length,
        last_visit: visits.reduce((m, v) => (v.created_at > m ? v.created_at : m), '') || null,
        errors_24h: errors.filter((x) => Date.now() - new Date(x.created_at) < 86400000).length,
        errors_by_day: byDay(errors.filter((x) => new Date(x.created_at) >= since)),
        recent_errors: [...errors].reverse().slice(0, 25),
        db_bytes: 12 * 1024 * 1024,
        whatsapp_enabled: false,
      }
    },

    async pingDatabase() {
      await delay(40)
      return 40
    },

    async whatsappStopped(phone) {
      const phone10 = String(phone || '').replace(/\D/g, '').slice(-10)
      return read(KEY_WA_STOP, []).includes(phone10)
    },
    async stopWhatsApp(phone) {
      const phone10 = String(phone || '').replace(/\D/g, '').slice(-10)
      if (phone10.length !== 10) throw new Error('This request has no 10-digit mobile number')
      write(KEY_WA_STOP, [...new Set([...read(KEY_WA_STOP, []), phone10])])
      return true
    },

    async updateEnquiry(id, patch) {
      await delay(250)
      const rows = read(KEY_ENQ, [])
      const row = rows.find((r) => r.id === id)
      if (!row) throw new Error('Request not found')
      const user = read(KEY_USER, null)
      const log = read(KEY_ACTIVITY, [])
      const who = user?.name || 'You'
      if (patch.status && patch.status !== row.status) {
        log.push({ id: newId(), enquiry_id: id, actor_name: who, kind: 'status', detail: `${row.status} → ${patch.status}`, created_at: new Date().toISOString() })
      }
      const STAGE_STATUS = { new: 'new', called: 'contacted', completed: 'completed', cancelled: 'cancelled' }
      if (patch.stage && patch.stage !== row.stage) {
        log.push({ id: newId(), enquiry_id: id, actor_name: who, kind: 'stage', detail: `${row.stage || 'new'} → ${patch.stage}`, created_at: new Date().toISOString() })
        const st = STAGE_STATUS[patch.stage] || 'in_progress'
        if (st !== row.status) log.push({ id: newId(), enquiry_id: id, actor_name: who, kind: 'status', detail: `${row.status} → ${st}`, created_at: new Date().toISOString() })
        patch = { ...patch, status: st }
      }
      if ('assigned_partner_id' in patch && patch.assigned_partner_id !== row.assigned_partner_id) {
        const p = read(KEY_PARTNERS, []).find((x) => x.id === patch.assigned_partner_id)
        log.push({ id: newId(), enquiry_id: id, actor_name: who, kind: 'partner', detail: p ? `Business Partner: ${p.business_name}` : 'Business Partner removed', created_at: new Date().toISOString() })
      }
      if ('due_at' in patch && patch.due_at !== row.due_at) {
        log.push({ id: newId(), enquiry_id: id, actor_name: who, kind: 'due', detail: `Finish by ${patch.due_at ? new Date(patch.due_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}`, created_at: new Date().toISOString() })
      }
      if ('assigned_buddy_id' in patch && patch.assigned_buddy_id !== row.assigned_buddy_id) {
        const b = read(KEY_BUDDIES, []).find((x) => x.id === patch.assigned_buddy_id)
        log.push({ id: newId(), enquiry_id: id, actor_name: who, kind: 'assignment', detail: b ? `Assigned to ${b.name}` : 'Unassigned', created_at: new Date().toISOString() })
      }
      Object.assign(row, patch, { updated_at: new Date().toISOString() })
      write(KEY_ENQ, rows)
      write(KEY_ACTIVITY, log)
      return row
    },

    async listActivity(enquiryId) {
      return read(KEY_ACTIVITY, []).filter((a) => a.enquiry_id === enquiryId)
    },

    async addNote(enquiryId, text, { visibleToCustomer = false } = {}) {
      const user = read(KEY_USER, null)
      const log = read(KEY_ACTIVITY, [])
      const note = { id: newId(), enquiry_id: enquiryId, actor_name: user?.name || 'You', kind: visibleToCustomer ? 'update' : 'note', detail: text, created_at: new Date().toISOString() }
      log.push(note)
      write(KEY_ACTIVITY, log)
      return note
    },

    async listJobPosts() {
      return read(KEY_JOBS, [])
    },

    async updateJobPost(id, patch) {
      const rows = read(KEY_JOBS, [])
      const row = rows.find((r) => r.id === id)
      if (!row) throw new Error('Job post not found')
      Object.assign(row, patch)
      write(KEY_JOBS, rows)
      return row
    },

    async listPropertyListings() {
      return read(KEY_PROPS, [])
    },

    async saveProperty(listing) {
      await delay(250)
      const rows = read(KEY_PROPS, [])
      if (listing.id) {
        const i = rows.findIndex((r) => r.id === listing.id)
        rows[i] = { ...rows[i], ...listing, updated_at: new Date().toISOString() }
        write(KEY_PROPS, rows)
        return rows[i]
      }
      const created = { status: 'hidden', highlights: [], photos: [], checks: [], sort_order: 0, ...listing, id: newId(), created_at: new Date().toISOString() }
      rows.unshift(created)
      write(KEY_PROPS, rows)
      return created
    },

    async uploadPropertyPhoto(file) {
      // Dev mode: keep the photo in the browser only
      return new Promise((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(r.result)
        r.onerror = () => reject(new Error('Could not read the photo'))
        r.readAsDataURL(file)
      })
    },

    async listCatalogRows() {
      return read(KEY_CATALOG, [])
    },

    async listCityRequests() {
      return read(KEY_CITY_REQ, [])
    },

    async deleteCityRequest(id) {
      write(KEY_CITY_REQ, read(KEY_CITY_REQ, []).filter((r) => r.id !== id))
    },

    async getWhatsAppSettings() {
      return read('inempower_mock_whatsapp', { id: true, enabled: false, api_version: 'v23.0', phone_number_id: null, requests_to: null, team_to: null, template_lang: 'en', thank_you_auto: false })
    },
    async saveWhatsAppSettings(patch) {
      const row = { ...(await this.getWhatsAppSettings()), ...patch, updated_at: new Date().toISOString() }
      write('inempower_mock_whatsapp', row)
      return row
    },
    async testWhatsApp() {
      await delay(300)
      const s = read('inempower_mock_whatsapp', {})
      return !!(s.enabled && s.phone_number_id)
    },

    async saveCatalogItem({ kind, item_id, data, te = {}, status }) {
      await delay(200)
      const rows = read(KEY_CATALOG, []).filter((r) => !(r.kind === kind && r.item_id === String(item_id)))
      const row = { kind, item_id: String(item_id), data, te, status, updated_at: new Date().toISOString() }
      rows.unshift(row)
      write(KEY_CATALOG, rows)
      return row
    },

    async deleteCatalogItem(kind, itemId) {
      write(KEY_CATALOG, read(KEY_CATALOG, []).filter((r) => !(r.kind === kind && r.item_id === String(itemId))))
    },

    async uploadCatalogPhoto(file) {
      return new Promise((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(r.result)
        r.onerror = () => reject(new Error('Could not read the photo'))
        r.readAsDataURL(file)
      })
    },

    async postJobAsTeam(job) {
      const rows = read(KEY_JOBS, [])
      const created = { ...job, id: newId(), status: 'approved', posted_by_team: true, created_at: new Date().toISOString() }
      rows.unshift(created)
      write(KEY_JOBS, rows)
      return created
    },

    async deleteJobPost(id) {
      write(KEY_JOBS, read(KEY_JOBS, []).filter((j) => j.id !== id))
    },

    async listBuddies() {
      return read(KEY_BUDDIES, []).sort((a, b) => a.name.localeCompare(b.name))
    },

    async saveBuddy(buddy) {
      await delay(250)
      const rows = read(KEY_BUDDIES, [])
      if (buddy.id) {
        const i = rows.findIndex((r) => r.id === buddy.id)
        rows[i] = { ...rows[i], ...buddy, updated_at: new Date().toISOString() }
        write(KEY_BUDDIES, rows)
        return rows[i]
      }
      const created = { tier: 0, status: 'active', services: [], ...buddy, id: newId(), created_at: new Date().toISOString() }
      rows.push(created)
      write(KEY_BUDDIES, rows)
      return created
    },
  },
}
