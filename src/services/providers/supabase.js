/**
 * Supabase API Provider — iN Empower Website
 *
 * REAL backend. Active when VITE_API_PROVIDER=supabase in .env
 * Needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (Supabase → Project Settings → API).
 *
 * Tables used (see supabase/schema.sql in the project folder):
 *   profiles   — customer accounts (auto-created on sign-up)
 *   enquiries  — every contact form / "Get started" / Chat Buddy request
 *   job_posts  — part-time jobs posted by local businesses
 */

import { createSupabaseLite } from '../supabaseLite'
import { toRequestFromEnquiry, toRequestFromJobPost, normalizeUser, friendlyAuthError, toTimelineEntry, withCity, withRef, cleanRef, cleanPhoneForSave, profilePhone, callUsLine } from './shared'
import { readPhone } from '../../data/phone'
import { currentCity } from '../../data/cities'

let client = null
function supabase() {
  if (client) return client
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
  }
  client = createSupabaseLite({ url, anonKey: key, storage: window.localStorage })
  return client
}

async function loadUser(authUser) {
  if (!authUser) return null
  let profile = null
  try {
    const rows = await supabase().from('profiles').select({ id: authUser.id }, { limit: 1 })
    profile = rows && rows[0]
    if (!profile) {
      // Safety net: create the profile from the sign-up details if it's missing
      const m = authUser.user_metadata || {}
      const row = {
        id: authUser.id,
        email: authUser.email,
        first_name: m.first_name || null,
        last_name: m.last_name || null,
        full_name: [m.first_name, m.last_name].filter(Boolean).join(' ') || null,
        phone: m.phone || null,
        dob: /^\d{4}-\d{2}-\d{2}$/.test(m.dob || '') ? m.dob : null,
        gender: m.gender || null,
      }
      await supabase().from('profiles').insert(row).catch(() => {})
      profile = row
    }
  } catch {
    /* profile is optional — fall back to sign-up metadata */
  }
  return normalizeUser(authUser, profile)
}

export const supabaseProvider = {
  // --- AUTHENTICATION (6-digit code sent by email) ---

  /**
   * @param {string} email
   * @param {{ createUser?: boolean, profile?: object }} options
   *   createUser=false → "Sign in" (only existing accounts)
   *   createUser=true + profile → "Create account"
   */
  async requestAuthCode(email, options = {}) {
    const { createUser = false, profile } = options
    try {
      await supabase().auth.sendEmailCode(email.trim().toLowerCase(), {
        createUser,
        // If the email contains a sign-in link instead of a code, it brings
        // the person back to the login page, which finishes signing them in.
        redirectTo: `${window.location.origin}/login${window.location.search || ''}`,
        data: profile
          ? {
              first_name: profile.firstName || '',
              last_name: profile.lastName || '',
              phone: profile.phone ? cleanPhoneForSave(profile.phone) : '',
              dob: profile.dob || '',
              gender: profile.gender || '',
            }
          : undefined,
      })
    } catch (err) {
      throw friendlyAuthError(err, 'Could not send the code. Please try again.')
    }
    return { success: true, message: 'Code sent to ' + email }
  },

  async verifyAuthCode(email, code) {
    let session
    try {
      session = await supabase().auth.verifyEmailCode(email.trim().toLowerCase(), String(code).trim())
    } catch (err) {
      throw friendlyAuthError(err, 'Could not verify the code.')
    }
    return { success: true, user: await loadUser(session.user) }
  },

  async getCurrentUser() {
    await supabase().auth.consumeSessionFromUrl()
    const authUser = await supabase().auth.getUser()
    return authUser ? loadUser(authUser) : null
  },

  async signOut() {
    await supabase().auth.signOut()
  },

  // --- CONTACT & ENQUIRIES ---

  // --- LIVE CATALOG (services / supplies / workshops changed in the admin portal) ---
  async listCatalog() {
    return (await supabase().from('catalog_items').select({}, { limit: 3000 })) || []
  },
  /** Seats already taken per workshop: { [workshopId]: count } */
  async workshopSeats() {
    try {
      const rows = await supabase().rpc('workshop_seats')
      return Object.fromEntries((rows || []).map((r) => [String(r.workshop_id), Number(r.taken) || 0]))
    } catch {
      return {}
    }
  },

  async submitContactForm(form) {
    if (!form.name || !form.phone) throw new Error('Name and phone number are required')
    const authUser = await supabase().auth.getUser()
    const row = {
      user_id: authUser?.id || null,
      name: form.name.trim(),
      phone: cleanPhoneForSave(form.phone),
      email: form.email?.trim() || null,
      service: form.service || null,
      sub_service: form.subService || null,
      message: form.message || null,
      source: 'website',
    }
    // Step-by-step requests (Chat Buddy, step pages) also send tidy fields for the team;
    // every request carries the customer's city
    const extra = { details: withRef(withCity(form.details)) }
    for (const k of ['item', 'area', 'urgency', 'channel']) if (form[k] != null && form[k] !== '') extra[k] = form[k]
    let ref = extra.details.ref
    try {
      try {
        await supabase().from('enquiries').insert({ ...row, ...extra })
      } catch (err) {
        // Database not upgraded yet (006 not run): save the plain request instead (it has no reference number)
        if (Object.keys(extra).length && /column|schema cache|PGRST204|42703/i.test(`${err.code} ${err.message}`)) {
          await supabase().from('enquiries').insert(row)
          ref = null
        } else throw err
      }
    } catch (err) {
      if (/Too many requests|many requests right now|workshop is full/i.test(err.message || '')) throw new Error(err.message)
      console.error('[iN Empower] enquiry failed:', err)
      throw new Error(callUsLine())
    }
    return { success: true, message: 'Message sent successfully', ref }
  },

  // --- JOB POSTS ---

  async postJob(job) {
    const authUser = await supabase().auth.getUser()
    if (!authUser) throw new Error('Please sign in to post a job.')
    try {
      await supabase().from('job_posts').insert({
        user_id: authUser.id,
        job_title: job.jobTitle,
        business_name: job.businessName,
        location: job.location,
        pay_per_hour: job.pay ? Number(job.pay) : null,
        description: job.desc || null,
      })
    } catch (err) {
      console.error('[iN Empower] job post failed:', err)
      throw new Error('Could not post the job. Please try again.')
    }
    return { success: true }
  },

  // --- PUBLIC: live job posts (approved by the team) ---
  async listPublicJobs() {
    try {
      return (await supabase().from('job_posts').select({ status: 'approved' }, { order: 'created_at.desc', limit: 50 })) || []
    } catch {
      return []
    }
  },

  // --- PUBLIC: property listings the team has made live ---
  async listPropertyListings() {
    try {
      return (await supabase().from('property_listings').select({ status: 'live' }, { order: 'sort_order.asc,created_at.desc', limit: 100 })) || []
    } catch {
      return []
    }
  },

  // --- "Become a Local Buddy" application ---
  async applyAsBuddy(form) {
    if (!form.name || !form.phone) throw new Error('Name and phone number are required')
    const authUser = await supabase().auth.getUser()
    const row = {
      name: form.name.trim(),
      phone: cleanPhoneForSave(form.phone),
      email: form.email?.trim() || null,
      town: form.town || null,
      areas: form.areas || null,
      services: form.services || [],
      experience: form.experience || null,
      languages: form.languages || null,
      status: 'pending',
      tier: 0,
      user_id: authUser?.id || null,
    }
    // Step-by-step answers + application number (needs supabase/007_buddy_application.sql)
    const extra = form.details ? { details: withCity(form.details), ref: form.ref || form.details.ref || null } : {}
    try {
      try {
        await supabase().from('buddies').insert({ ...row, ...extra })
      } catch (err) {
        // 007 not run yet: still send the application, with the answers written into experience
        if (!extra.details || !/details|ref|column/i.test(err?.message || '')) throw err
        const text = (form.details.answers || []).map((x) => `${x.q}: ${x.a}`).join('\n')
        await supabase().from('buddies').insert({ ...row, experience: [row.experience, text].filter(Boolean).join('\n\n').slice(0, 2000) })
      }
    } catch (err) {
      console.error('[iN Empower] buddy application failed:', err)
      if (/Too many requests|many requests right now|workshop is full/i.test(err?.message || '')) throw new Error(err.message)
      throw new Error(callUsLine('Sorry, we could not send your application.'))
    }
    return { success: true }
  },

  // --- Follow a request with its reference number + phone, no sign-in (needs supabase/014) ---
  async requestStatus(ref, phone) {
    const r = cleanRef(ref)
    const p = readPhone(phone)
    if (!r || !p.ok) return null
    try {
      const rows = await supabase().rpc('request_status', { p_ref: r, p_phone: p.value })
      const row = Array.isArray(rows) ? rows[0] : rows
      return row ? { ref: row.ref, title: row.title, status: row.status, date: row.created_at, updatedAt: row.updated_at } : null
    } catch (err) {
      if (/request_status|PGRST202|42883|404|schema cache/i.test(`${err.code} ${err.message}`)) {
        const e = new Error('unavailable'); e.code = 'unavailable'; throw e
      }
      throw err
    }
  },

  // --- "Join as a Business Partner": arrives as a pending partner in the admin (needs supabase/014) ---
  async applyAsPartner(form) {
    const args = {
      p_business: String(form.business || '').trim(),
      p_contact: String(form.contact || '').trim() || null,
      p_phone: cleanPhoneForSave(form.phone),
      p_whatsapp: form.whatsapp ? cleanPhoneForSave(form.whatsapp) : null,
      p_kind: form.kind || 'other',
      p_items: Array.isArray(form.items) ? form.items : [],
      p_town: form.town || null,
      p_areas: form.areas || null,
      p_gst: form.gst || null,
      p_note: form.note || null,
      p_city: currentCity().name,
      p_source: 'website',
    }
    try {
      const ref = await supabase().rpc('apply_as_partner', args)
      return { success: true, ref: typeof ref === 'string' ? ref : ref?.ref || null }
    } catch (err) {
      console.error('[iN Empower] partner application failed:', err)
      if (/already have your application|many applications/i.test(err?.message || '')) throw new Error(err.message)
      throw new Error(callUsLine('Sorry, we could not send your application.'))
    }
  },

  // --- "Not in your city yet? Tell us" (needs supabase/013_cities.sql) ---
  async addCityRequest({ cityName, name = '', phone = '', note = '' }) {
    const city = String(cityName || '').trim()
    if (city.length < 2) throw new Error('Please type the name of your city or town')
    const row = { city_name: city.slice(0, 80), name: name.trim() || null, phone: phone ? cleanPhoneForSave(phone) : null, note: note.trim() || null, source: 'website' }
    try {
      await supabase().from('city_requests').insert(row)
    } catch (err) {
      if (/already have your request|many requests/i.test(err.message || '')) throw new Error(err.message)
      // 013 not run yet: keep the request as an enquiry so it is not lost
      if (!row.phone) throw new Error(callUsLine('Sorry, we could not save that.'))
      await supabase().from('enquiries').insert({
        name: row.name || 'Visitor', phone: row.phone, service: 'other', sub_service: 'New city request',
        message: `Please start iN Empower in ${row.city_name}.${row.note ? `\n${row.note}` : ''}`, source: 'website',
      })
    }
    return { success: true }
  },

  // --- Customer: history of one of their requests ---
  /** Update the signed-in person's name, phone and area. */
  async updateProfile({ firstName = '', lastName = '', phone = '', area = '' }) {
    const authUser = await supabase().auth.getUser()
    if (!authUser) throw new Error('Please sign in first')
    const digits = profilePhone(phone)
    const first = firstName.trim()
    const last = lastName.trim()
    await supabase().from('profiles').update(
      {
        first_name: first || null,
        last_name: last || null,
        full_name: [first, last].filter(Boolean).join(' ') || null,
        phone: digits || null,
        updated_at: new Date().toISOString(),
      },
      { id: authUser.id }
    )
    const updated = await supabase().auth.updateUser({ area: area.trim(), first_name: first, last_name: last, phone: digits })
    return loadUser(updated || authUser)
  },

  async getRequestTimeline(enquiryId) {
    const authUser = await supabase().auth.getUser()
    if (!authUser) return []
    try {
      const rows = await supabase().from('enquiry_activity').select({ enquiry_id: enquiryId }, { order: 'created_at.asc' })
      return (rows || []).map(toTimelineEntry)
    } catch {
      return []
    }
  },

  // --- DASHBOARD ---

  async listMyRequests() {
    const authUser = await supabase().auth.getUser()
    if (!authUser) return []
    const [enquiries, jobs] = await Promise.all([
      supabase().from('enquiries').select({ user_id: authUser.id }, { order: 'created_at.desc' }),
      supabase().from('job_posts').select({ user_id: authUser.id }, { order: 'created_at.desc' }),
    ])
    return [
      ...(enquiries || []).map(toRequestFromEnquiry),
      ...(jobs || []).map(toRequestFromJobPost),
    ].sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  // --- MONITORING (anyone can add a row; only the team can read) ---
  async logVisit(row) {
    try { await supabase().from('site_visits').insert(row) } catch { /* never bother the visitor */ }
  },
  async logError(row) {
    try { await supabase().from('app_errors').insert(row) } catch { /* ignore */ }
  },

  // --- TEAM ADMIN PANEL (only works for people in the `staff` table) ---
  admin: {
    async isStaff() {
      const authUser = await supabase().auth.getUser()
      if (!authUser) return false
      try {
        return (await supabase().rpc('is_staff')) === true
      } catch {
        return false
      }
    },

    async listEnquiries({ limit = 1000 } = {}) {
      try {
        return await supabase().from('enquiries').select({}, {
          columns: '*,buddy:buddies(id,name,phone),partner:business_partners(id,business_name,contact_name,phone,whatsapp)',
          order: 'created_at.desc',
          limit,
        })
      } catch (err) {
        // Database not upgraded yet (009 not run): load without Business Partners
        if (!/business_partners|relationship|schema cache|PGRST200|42P01/i.test(`${err.code} ${err.message}`)) throw err
        return supabase().from('enquiries').select({}, {
          columns: '*,buddy:buddies(id,name,phone)',
          order: 'created_at.desc',
          limit,
        })
      }
    },

    /** First action / completed time / stages reached per ticket: { [enquiryId]: {...} } (needs 012) */
    async ticketTimings(since) {
      try {
        const rows = await supabase().rpc('admin_ticket_timings', since ? { since } : {})
        return Object.fromEntries((rows || []).map((r) => [r.enquiry_id, r]))
      } catch {
        return {}
      }
    },

    async listPartners() {
      return supabase().from('business_partners').select({}, { order: 'business_name.asc', limit: 2000 })
    },

    async savePartner(partner) {
      const { id, created_at, updated_at, ref, ...fields } = partner
      if (id) {
        const rows = await supabase().from('business_partners').update({ ...fields, updated_at: new Date().toISOString() }, { id })
        return rows && rows[0]
      }
      return supabase().from('business_partners').insert(fields, { returning: true })
    },

    async monitorStats(days = 30) {
      return supabase().rpc('admin_monitor_stats', { days })
    },

    /** How long the database takes to answer (for the Monitor page health check) */
    async pingDatabase() {
      const t = performance.now()
      await supabase().rpc('is_staff')
      return Math.round(performance.now() - t)
    },

    /**
     * A request taken on a PHONE CALL by the team (Admin → Requests → "New request from a call").
     * Saved like a website request (source website, channel 'phone', a reference number),
     * with a history note saying who took the call. whatsappOk false → the number goes on the
     * "no WhatsApp updates" list (supabase/016). Returns { id, ref }.
     */
    async createRequest(form, { whatsappOk = true } = {}) {
      const authUser = await supabase().auth.getUser()
      const me = await supabase().from('staff').select({ user_id: authUser.id }, { limit: 1 }).catch(() => [])
      const takenBy = me?.[0]?.name || authUser?.email || 'Team'
      const details = withRef({ ...(form.details || {}), takenBy, takenOnCall: true })
      const row = {
        user_id: null,
        name: String(form.name || '').trim(),
        phone: cleanPhoneForSave(form.phone),
        email: form.email?.trim() || null,
        service: form.service || null,
        sub_service: form.subService || null,
        item: form.item || null,
        area: form.area || null,
        urgency: form.urgency || null,
        message: form.message || null,
        source: 'website',
        channel: 'phone',
        details,
      }
      const rows = await supabase().from('enquiries').insert(row, { returning: true })
      const created = Array.isArray(rows) ? rows[0] : rows
      if (created?.id) {
        await supabase().from('enquiry_activity').insert({
          enquiry_id: created.id, actor_id: authUser.id, actor_name: takenBy, kind: 'note',
          detail: `Request taken on a phone call by ${takenBy}.${whatsappOk ? '' : ' The customer does not want WhatsApp updates.'}`,
        }).catch(() => {})
      }
      if (!whatsappOk) {
        const phone10 = String(row.phone).replace(/\D/g, '').slice(-10)
        if (phone10.length === 10) await supabase().from('whatsapp_optout').insert({ phone10, note: `Said on a call to ${takenBy}` }).catch(() => {})
      }
      return { id: created?.id || null, ref: details.ref }
    },

    async updateEnquiry(id, patch) {
      const rows = await supabase().from('enquiries').update(patch, { id })
      return rows && rows[0]
    },

    /** Customers who replied STOP (owner, 6 Nov 2026): no more WhatsApp updates to that number */
    async whatsappStopped(phone) {
      const phone10 = String(phone || '').replace(/\D/g, '').slice(-10)
      if (phone10.length !== 10) return false
      const rows = await supabase().from('whatsapp_optout').select({ phone10 })
      return Array.isArray(rows) && rows.length > 0
    },
    async stopWhatsApp(phone, note) {
      const phone10 = String(phone || '').replace(/\D/g, '').slice(-10)
      if (phone10.length !== 10) throw new Error('This request has no 10-digit mobile number')
      try {
        await supabase().from('whatsapp_optout').insert({ phone10, note: String(note || '').slice(0, 200) })
      } catch (err) {
        // Already on the list (primary key) = fine: PostgREST answers 409 / code 23505.
        const dup = err?.status === 409 || err?.code === '23505' || /duplicate|already exists/i.test(String(err?.message || err))
        if (!dup) throw err
      }
      return true
    },

    async listActivity(enquiryId) {
      return supabase().from('enquiry_activity').select({ enquiry_id: enquiryId }, { order: 'created_at.asc' })
    },

    async addNote(enquiryId, text, { visibleToCustomer = false } = {}) {
      const authUser = await supabase().auth.getUser()
      const me = await supabase().from('staff').select({ user_id: authUser.id }, { limit: 1 })
      return supabase().from('enquiry_activity').insert({
        enquiry_id: enquiryId,
        actor_id: authUser.id,
        actor_name: me?.[0]?.name || authUser.email,
        kind: visibleToCustomer ? 'update' : 'note',
        detail: text,
      }, { returning: true })
    },

    async listJobPosts() {
      return supabase().from('job_posts').select({}, { order: 'created_at.desc', limit: 500 })
    },

    async updateJobPost(id, patch) {
      const rows = await supabase().from('job_posts').update(patch, { id })
      return rows && rows[0]
    },

    async listPropertyListings() {
      return supabase().from('property_listings').select({}, { order: 'sort_order.asc,created_at.desc', limit: 1000 })
    },

    async saveProperty(listing) {
      const { id, created_at, updated_at, ...fields } = listing
      if (id) {
        const rows = await supabase().from('property_listings').update({ ...fields, updated_at: new Date().toISOString() }, { id })
        return rows && rows[0]
      }
      return supabase().from('property_listings').insert(fields, { returning: true })
    },

    async uploadPropertyPhoto(file) {
      const ext = (file.name || '').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      const path = `${new Date().toISOString().slice(0, 10)}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
      return supabase().storage.upload('property-photos', path, file)
    },

    async listCatalogRows() {
      return supabase().from('catalog_items').select({}, { order: 'updated_at.desc', limit: 3000 })
    },

    /** "Not in your city yet" requests — empty until supabase/013_cities.sql has been run */
    async listCityRequests() {
      try {
        return (await supabase().from('city_requests').select({}, { order: 'created_at.desc', limit: 1000 })) || []
      } catch {
        return null
      }
    },

    async deleteCityRequest(id) {
      return supabase().from('city_requests').delete({ id })
    },

    /* WhatsApp alerts (supabase/008): settings the team can change in Admin → Settings.
       The Meta token stays in Supabase Vault and is never read here. */
    async getWhatsAppSettings() {
      try {
        const rows = await supabase().from('whatsapp_settings').select({}, { limit: 1 })
        return (rows && rows[0]) || null
      } catch {
        return null
      }
    },
    async saveWhatsAppSettings(patch) {
      const rows = await supabase().from('whatsapp_settings').update({ ...patch, updated_at: new Date().toISOString() }, { id: true })
      return rows && rows[0]
    },
    /** Sends a test alert; returns true when it went to WhatsApp (false = off / not set up) */
    async testWhatsApp(target = 'requests') {
      const id = await supabase().rpc('wa_test', { target })
      return id !== null && id !== undefined
    },

    async saveCatalogItem({ kind, item_id, data, te = {}, status }) {
      return supabase().from('catalog_items').upsert({ kind, item_id: String(item_id), data, te, status }, { onConflict: 'kind,item_id' })
    },

    async deleteCatalogItem(kind, itemId) {
      return supabase().from('catalog_items').delete({ kind, item_id: String(itemId) })
    },

    async uploadCatalogPhoto(file) {
      const ext = (file.name || '').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      const path = `${new Date().toISOString().slice(0, 10)}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
      return supabase().storage.upload('catalog-photos', path, file)
    },

    async postJobAsTeam(job) {
      const authUser = await supabase().auth.getUser()
      return supabase().from('job_posts').insert({ ...job, user_id: authUser.id, status: 'approved', posted_by_team: true }, { returning: true })
    },

    async deleteJobPost(id) {
      return supabase().from('job_posts').delete({ id })
    },

    async listBuddies() {
      return supabase().from('buddies').select({}, { order: 'name.asc', limit: 1000 })
    },

    async saveBuddy(buddy) {
      const { id, created_at, updated_at, ...fields } = buddy
      if (id) {
        const rows = await supabase().from('buddies').update({ ...fields, updated_at: new Date().toISOString() }, { id })
        return rows && rows[0]
      }
      return supabase().from('buddies').insert(fields, { returning: true })
    },
  },
}
