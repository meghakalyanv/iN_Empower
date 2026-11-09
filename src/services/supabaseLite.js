/**
 * supabaseLite — a tiny, dependency-free Supabase client for iN Empower.
 *
 * Talks directly to Supabase's standard HTTP APIs:
 *   Auth (GoTrue):   /auth/v1/otp, /auth/v1/verify, /auth/v1/token, /auth/v1/logout
 *   Database (REST): /rest/v1/<table>
 *
 * Works the same in the browser (website) and in React Native (app) because it
 * only uses `fetch`. The session is kept in a pluggable storage
 * (localStorage on the web, AsyncStorage in the app).
 *
 * The SAME file is used by the website and the app (the app copies it with
 * `npm run sync-data`), so keep it free of platform-specific imports.
 */

const SESSION_KEY = 'inempower_session'

export function createSupabaseLite({ url, anonKey, storage }) {
  if (!url || !anonKey) {
    throw new Error('Supabase is not configured (missing URL or anon key).')
  }
  const base = url.replace(/\/+$/, '')
  let cachedSession
  let refreshing = null

  // ---------- session storage ----------
  async function readSession() {
    if (cachedSession !== undefined) return cachedSession
    try {
      const raw = await storage.getItem(SESSION_KEY)
      cachedSession = raw ? JSON.parse(raw) : null
    } catch {
      cachedSession = null
    }
    return cachedSession
  }

  async function writeSession(session) {
    cachedSession = session
    try {
      if (session) await storage.setItem(SESSION_KEY, JSON.stringify(session))
      else await storage.removeItem(SESSION_KEY)
    } catch {
      /* storage unavailable — keep in memory only */
    }
  }

  function toSession(data) {
    if (!data || !data.access_token) return null
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at || Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
      user: data.user,
    }
  }

  // ---------- low-level request ----------
  async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
    let res
    try {
      res = await fetch(base + path, {
        method,
        headers: {
          apikey: anonKey,
          // Signed-in requests carry the user's token. Anonymous requests send
          // only the apikey — this works with both the classic "anon" JWT key
          // and the newer "sb_publishable_…" keys.
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      })
    } catch {
      throw new Error('No internet connection. Please check your network and try again.')
    }
    const text = await res.text()
    let data = null
    if (text) {
      try {
        data = JSON.parse(text)
      } catch {
        data = text
      }
    }
    if (!res.ok) {
      const message =
        (data && (data.msg || data.message || data.error_description || data.error)) ||
        `Request failed (${res.status})`
      const err = new Error(message)
      err.status = res.status
      err.code = data && (data.error_code || data.code)
      throw err
    }
    return data
  }

  // ---------- auth ----------
  async function getSession() {
    const session = await readSession()
    if (!session) return null
    const now = Math.floor(Date.now() / 1000)
    if (session.expires_at && session.expires_at - 60 > now) return session
    // expired (or about to) → refresh
    if (!session.refresh_token) {
      await writeSession(null)
      return null
    }
    if (!refreshing) {
      refreshing = request('/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        body: { refresh_token: session.refresh_token },
      })
        .then(async (data) => {
          const next = toSession(data)
          await writeSession(next)
          return next
        })
        .catch(async (err) => {
          // Only forget the session if the server rejected the refresh token
          if (err.status && err.status < 500) await writeSession(null)
          return err.status && err.status < 500 ? null : session
        })
        .finally(() => {
          refreshing = null
        })
    }
    return refreshing
  }

  const auth = {
    /** Email a one-time code. createUser=false only works for existing accounts. */
    async sendEmailCode(email, { createUser = false, data, redirectTo } = {}) {
      const qs = redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : ''
      await request(`/auth/v1/otp${qs}`, {
        method: 'POST',
        body: { email, create_user: createUser, ...(data ? { data } : {}) },
      })
    },

    /** Check the code; on success the user is signed in. */
    async verifyEmailCode(email, token) {
      const data = await request('/auth/v1/verify', {
        method: 'POST',
        body: { type: 'email', email, token },
      })
      const session = toSession(data)
      if (!session) throw new Error('Could not sign you in. Please try again.')
      await writeSession(session)
      return session
    },

    getSession,

    /**
     * Website only: if the person arrived by tapping the sign-in link in the
     * email, the session is in the URL (#access_token=…). Save it and clean
     * the URL. Returns { session } / { error } / null when there was no link.
     */
    async consumeSessionFromUrl() {
      if (typeof window === 'undefined' || !window.location) return null
      const hash = window.location.hash || ''
      if (!/access_token=|error_description=/.test(hash)) return null
      const p = new URLSearchParams(hash.replace(/^#/, ''))
      const clean = () => window.history.replaceState(null, '', window.location.pathname + window.location.search)
      if (p.get('error_description')) {
        clean()
        return { error: p.get('error_description').replace(/\+/g, ' ') }
      }
      try {
        const token = p.get('access_token')
        const user = await request('/auth/v1/user', { token })
        const session = toSession({
          access_token: token,
          refresh_token: p.get('refresh_token'),
          expires_at: Number(p.get('expires_at')) || undefined,
          expires_in: Number(p.get('expires_in')) || 3600,
          user,
        })
        await writeSession(session)
        clean()
        return { session }
      } catch (err) {
        clean()
        return { error: err.message }
      }
    },

    async getUser() {
      const session = await getSession()
      return session ? session.user : null
    },

    /** Save extra details on the signed-in account (user_metadata). Returns the updated user. */
    async updateUser(data) {
      const session = await getSession()
      if (!session) throw new Error('Please sign in first')
      const user = await request('/auth/v1/user', { method: 'PUT', body: { data }, token: session.access_token })
      await writeSession({ ...session, user })
      return user
    },

    async signOut() {
      const session = await readSession()
      await writeSession(null)
      if (session?.access_token) {
        try {
          await request('/auth/v1/logout', { method: 'POST', token: session.access_token })
        } catch {
          /* already signed out locally */
        }
      }
    },
  }

  // ---------- database (PostgREST) ----------
  function from(table) {
    return {
      /**
       * Insert one row. Returns nothing unless { returning: true },
       * in which case the inserted row comes back (needs read permission).
       */
      async insert(row, { returning = false } = {}) {
        const session = await getSession()
        const data = await request(`/rest/v1/${table}`, {
          method: 'POST',
          body: row,
          token: session?.access_token,
          headers: { Prefer: returning ? 'return=representation' : 'return=minimal' },
        })
        return returning && Array.isArray(data) ? data[0] : undefined
      },

      /**
       * Select rows.
       * filters: { column: value }            → column = value
       *          { column: { op, value } }    → any PostgREST operator, e.g.
       *            { status: { op: 'in', value: ['new', 'contacted'] } }
       * options: { columns, order: 'created_at.desc', limit }
       *   columns may embed related tables, e.g. '*,buddy:buddies(name,phone)'
       */
      async select(filters = {}, { columns = '*', order, limit } = {}) {
        const session = await getSession()
        const params = new URLSearchParams({ select: columns })
        appendFilters(params, filters)
        if (order) params.set('order', order)
        if (limit) params.set('limit', String(limit))
        return request(`/rest/v1/${table}?${params.toString()}`, {
          token: session?.access_token,
        })
      },

      /** Insert or replace one row (matched on the `onConflict` columns); returns the saved row. */
      async upsert(row, { onConflict } = {}) {
        const session = await getSession()
        const q = onConflict ? `?on_conflict=${encodeURIComponent(onConflict)}` : ''
        const data = await request(`/rest/v1/${table}${q}`, {
          method: 'POST',
          body: row,
          token: session?.access_token,
          headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        })
        return Array.isArray(data) ? data[0] : data
      },

      /** Delete the rows matching `filters`. */
      async delete(filters) {
        if (!filters || !Object.keys(filters).length) throw new Error('delete() needs a filter')
        const session = await getSession()
        const params = new URLSearchParams()
        appendFilters(params, filters)
        return request(`/rest/v1/${table}?${params.toString()}`, {
          method: 'DELETE',
          token: session?.access_token,
          headers: { Prefer: 'return=minimal' },
        })
      },

      /** Update the rows matching `filters`; returns the updated rows. */
      async update(values, filters) {
        if (!filters || !Object.keys(filters).length) throw new Error('update() needs a filter')
        const session = await getSession()
        const params = new URLSearchParams()
        appendFilters(params, filters)
        return request(`/rest/v1/${table}?${params.toString()}`, {
          method: 'PATCH',
          body: values,
          token: session?.access_token,
          headers: { Prefer: 'return=representation' },
        })
      },
    }
  }

  function appendFilters(params, filters) {
    Object.entries(filters).forEach(([col, val]) => {
      if (val && typeof val === 'object' && !Array.isArray(val) && val.op) {
        const v = Array.isArray(val.value) ? `(${val.value.map((x) => `"${String(x).replace(/"/g, '')}"`).join(',')})` : val.value
        params.append(col, `${val.op}.${v}`)
      } else {
        params.append(col, `eq.${val}`)
      }
    })
  }

  /** Call a database function, e.g. rpc('is_staff') */
  async function rpc(fn, args = {}) {
    const session = await getSession()
    return request(`/rest/v1/rpc/${fn}`, { method: 'POST', body: args, token: session?.access_token })
  }

  // ---------- storage (public photo buckets) ----------
  const files = {
    /** Upload a file (Blob/File) to a bucket; needs a signed-in user allowed by the bucket's policy. */
    async upload(bucket, path, file, contentType) {
      const session = await getSession()
      if (!session) throw new Error('Please sign in first')
      let res
      try {
        res = await fetch(`${base}/storage/v1/object/${bucket}/${path}`, {
          method: 'POST',
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': contentType || file.type || 'application/octet-stream',
          },
          body: file,
        })
      } catch {
        throw new Error('No internet connection. Please check your network and try again.')
      }
      if (!res.ok) {
        let msg = `Upload failed (${res.status})`
        try { const d = await res.json(); msg = d.message || d.error || msg } catch { /* keep default */ }
        throw new Error(msg)
      }
      return this.publicUrl(bucket, path)
    },
    publicUrl(bucket, path) {
      return `${base}/storage/v1/object/public/${bucket}/${path}`
    },
  }

  return { auth, from, rpc, storage: files }
}
