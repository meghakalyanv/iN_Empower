import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Inbox, Briefcase, Users, Home, LogOut, RefreshCw, ShieldAlert, Bell, BellOff, Handshake, Activity, LayoutList, GraduationCap, Settings, MapPin } from 'lucide-react'
import { applyAdminRows } from '../../services/catalogLoader'
import { istTime, isQuietTime, isEmergency } from '../../data/workHours'
import { setupAdminApp } from './installApp'
import { api } from '../../services/api'
import { OPEN_STATUSES, prettify, serviceLabel, isOverdue, isJobApplication } from './adminShared'
import AdminSearch from './AdminSearch'
import './admin.css'
import PageLoader from '../../components/PageLoader'

/**
 * Team admin panel shell.
 * - Only signed-in team members (rows in the `staff` table) can get in.
 * - Loads requests, job posts and buddies once and shares them with every
 *   admin screen through the Outlet context; refreshes every minute.
 */
export default function AdminLayout() {
  const navigate = useNavigate()
  const [state, setState] = useState('checking') // checking | denied | ready
  const [user, setUser] = useState(null)
  const [data, setData] = useState({ enquiries: [], jobs: [], buddies: [], properties: [], partners: [], partnersReady: true, catalogRows: [], catalogReady: true })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastLoaded, setLastLoaded] = useState(null)
  // New-request alerts: remember what we have seen; ping when something new arrives
  const seen = useRef(null)
  const [alertsOn, setAlertsOn] = useState(() => {
    try { return localStorage.getItem('inempower_admin_alerts') !== 'off' } catch { return true }
  })
  const [fresh, setFresh] = useState([])

  useEffect(() => {
    document.title = 'Team Admin | iN Empower'
    setupAdminApp()
    let active = true
    ;(async () => {
      const u = await api.getCurrentUser()
      if (!active) return
      if (!u) {
        navigate('/login?redirect=/admin', { replace: true })
        return
      }
      setUser(u)
      const ok = await api.admin.isStaff()
      if (active) setState(ok ? 'ready' : 'denied')
    })()
    return () => { active = false }
  }, [navigate])

  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      let partnersReady = true
      let catalogReady = true
      const [enquiries, jobs, buddies, properties, partners, catalogRows] = await Promise.all([
        api.admin.listEnquiries(),
        api.admin.listJobPosts(),
        api.admin.listBuddies(),
        // Empty until supabase/004_property_listings.sql has been run
        api.admin.listPropertyListings().catch(() => []),
        // Empty until supabase/009_partners_workflow_monitoring.sql has been run
        api.admin.listPartners().catch(() => { partnersReady = false; return [] }),
        // Empty until supabase/010_catalog_workshops_jobs.sql has been run
        api.admin.listCatalogRows().catch(() => { catalogReady = false; return [] }),
      ])
      if (catalogReady) applyAdminRows(catalogRows || [])
      setData({ enquiries: enquiries || [], jobs: jobs || [], buddies: buddies || [], properties: properties || [], partners: partners || [], partnersReady, catalogRows: catalogRows || [], catalogReady })
      const ids = new Set([...(enquiries || []).map((e) => 'e' + e.id), ...(jobs || []).map((j) => 'j' + j.id)])
      if (seen.current) {
        const newOnes = [
          ...(enquiries || []).filter((e) => !seen.current.has('e' + e.id)).map((e) => ({ id: e.id, emergency: isEmergency(e), text: `${isEmergency(e) ? '🚑 EMERGENCY — ' : ''}${e.name || 'Someone'} — ${e.item || (e.sub_service ? prettify(e.sub_service) : serviceLabel(e.service))}`, to: `/admin/requests?id=${e.id}` })),
          ...(jobs || []).filter((j) => !seen.current.has('j' + j.id)).map((j) => ({ id: j.id, text: `Job post: ${j.job_title}`, to: '/admin/jobs' })),
        ]
        if (newOnes.length) setFresh((f) => [...newOnes, ...f].slice(0, 5))
      }
      seen.current = ids
      setLastLoaded(new Date())
    } catch (err) {
      setError(err.message || 'Could not load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (state !== 'ready') return
    reload()
    const t = setInterval(reload, 30000)
    return () => clearInterval(t)
  }, [state, reload])

  // Update one row in memory after a save, so screens refresh instantly
  const patchLocal = useCallback((key, row) => {
    setData((d) => {
      const list = d[key]
      const i = list.findIndex((x) => x.id === row.id)
      const next = i === -1 ? [row, ...list] : list.map((x) => (x.id === row.id ? { ...x, ...row } : x))
      return { ...d, [key]: next }
    })
  }, [])

  // Services / supplies / workshops: save one row, then show it everywhere at once
  const saveCatalogRow = useCallback(async (row) => {
    const saved = await api.admin.saveCatalogItem(row)
    setData((d) => {
      const rows = [{ ...row, ...(saved || {}) }, ...d.catalogRows.filter((r) => !(r.kind === row.kind && r.item_id === String(row.item_id)))]
      applyAdminRows(rows)
      return { ...d, catalogRows: rows }
    })
  }, [])
  const removeCatalogRow = useCallback(async (kind, itemId) => {
    await api.admin.deleteCatalogItem(kind, itemId)
    setData((d) => {
      const rows = d.catalogRows.filter((r) => !(r.kind === kind && r.item_id === String(itemId)))
      applyAdminRows(rows)
      return { ...d, catalogRows: rows }
    })
  }, [])

  // Sound + desktop notification when new requests arrive
  useEffect(() => {
    if (!fresh.length || !alertsOn) return
    const latest = fresh[0]
    // Quiet at night (9 pm – 8 am, India time) — except emergencies, which always ring
    const quiet = isQuietTime() && !fresh.some((f) => f.emergency)
    try {
      if (quiet) throw new Error('quiet hours')
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      ;[0, 0.18].forEach((delay, i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain()
        o.frequency.value = i ? 880 : 660; o.connect(g); g.connect(ctx.destination)
        g.gain.setValueAtTime(0.15, ctx.currentTime + delay); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25)
        o.start(ctx.currentTime + delay); o.stop(ctx.currentTime + delay + 0.3)
      })
    } catch { /* sound not available */ }
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        const n = new Notification(latest.emergency ? '🚑 Emergency request' : 'New iN Empower request', { body: latest.text, tag: latest.id, silent: quiet })
        n.onclick = () => { window.focus(); navigate(latest.to) }
      }
    } catch { /* notifications not available */ }
  }, [fresh, alertsOn, navigate])

  const newCountForTitle = data.enquiries.filter((e) => e.status === 'new').length
  useEffect(() => {
    if (state === 'ready') document.title = `${newCountForTitle ? `(${newCountForTitle}) ` : ''}Team Admin | iN Empower`
  }, [newCountForTitle, state])

  const toggleAlerts = async () => {
    const next = !alertsOn
    setAlertsOn(next)
    try { localStorage.setItem('inempower_admin_alerts', next ? 'on' : 'off') } catch { /* ignore */ }
    if (next && 'Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission() } catch { /* ignore */ }
    }
  }

  const logout = async () => {
    await api.signOut()
    navigate('/')
  }

  if (state === 'checking') {
    return <div className="adm-center">Checking your access…</div>
  }

  if (state === 'denied') {
    return (
      <div className="adm-center">
        <div className="adm-card adm-denied">
          <ShieldAlert size={36} color="#C2410C" />
          <h2>This area is for the iN Empower team</h2>
          <p>You're signed in as <strong>{user?.email}</strong>, but this account isn't on the team list yet.</p>
          <p className="adm-muted">To add someone, run the “make yourself the owner” part of <code>supabase/002_admin_panel.sql</code> with their email in Supabase → SQL Editor.</p>
          <div className="adm-row">
            <Link to="/" className="adm-btn">Back to website</Link>
            <button className="adm-btn adm-btn-ghost" onClick={logout}>Sign out</button>
          </div>
        </div>
      </div>
    )
  }

  // Job applications are counted on Part-time jobs, not Requests
  const newCount = data.enquiries.filter((e) => e.status === 'new' && !isJobApplication(e)).length
  const pendingJobs = data.jobs.filter((j) => j.status === 'pending').length + data.enquiries.filter((e) => e.status === 'new' && isJobApplication(e)).length
  const pendingPartners = data.partners.filter((p) => p.status === 'pending').length
  const overdueCount = data.enquiries.filter((e) => isOverdue(e)).length
  const nav = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/requests', label: 'Requests', icon: Inbox, badge: newCount, alert: overdueCount },
    { to: '/admin/partners', label: 'Business Partners', short: 'Partners', icon: Handshake, badge: pendingPartners },
    { to: '/admin/buddies', label: 'Local Buddies', short: 'Buddies', icon: Users },
    { to: '/admin/catalog', label: 'Services & Supplies', short: 'Catalog', icon: LayoutList },
    { to: '/admin/cities', label: 'Cities', icon: MapPin },
    { to: '/admin/workshops', label: 'Workshops', icon: GraduationCap },
    { to: '/admin/jobs', label: 'Part-time jobs', short: 'Jobs', icon: Briefcase, badge: pendingJobs },
    { to: '/admin/properties', label: 'Properties', icon: Home },
    { to: '/admin/monitor', label: 'Monitor', icon: Activity },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <Link to="/admin" className="adm-brand">i<span>N</span> Empower <small>Team</small></Link>
        <nav className="adm-nav">
          {nav.map(({ to, label, icon: Icon, badge, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
              {badge > 0 && <em className="adm-badge">{badge}</em>}
            </NavLink>
          ))}
        </nav>
        {overdueCount > 0 && <Link to="/admin/requests?status=overdue" className="adm-overdue-note">⏰ {overdueCount} overdue</Link>}
        <div className="adm-sidebar-foot">
          <div className="adm-me">
            <div className="adm-avatar">{(user?.name || 'U').charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          <button className="adm-nav-item adm-logout" onClick={logout}><LogOut size={18} /> <span>Sign out</span></button>
        </div>
      </aside>

      <main className="adm-main">
        <div className="adm-topbar">
          <AdminSearch data={data} />
          <span className="adm-muted">
            {lastLoaded ? `Updated ${istTime(lastLoaded)}` : 'Loading…'}
          </span>
          <div className="adm-row">
            <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={toggleAlerts} aria-pressed={alertsOn} title="Sound and pop-up when a new request arrives">
              {alertsOn ? <Bell size={15} /> : <BellOff size={15} />} Alerts {alertsOn ? 'on' : 'off'}
            </button>
            <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={reload} disabled={loading}>
              <RefreshCw size={15} className={loading ? 'adm-spin' : ''} /> Refresh
            </button>
          </div>
        </div>
        {fresh.length > 0 && (
          <div className="adm-alert adm-fresh" role="status">
            🔔 <strong>{fresh.length === 1 ? 'New request' : `${fresh.length} new`}</strong>
            {fresh.slice(0, 3).map((f) => (
              <Link key={f.id} to={f.to} className="adm-link" onClick={() => setFresh((x) => x.filter((y) => y.id !== f.id))}>{f.text}</Link>
            ))}
            <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setFresh([])}>Dismiss</button>
          </div>
        )}
        {error && <div className="adm-alert">⚠️ {error}</div>}
        <Suspense fallback={<PageLoader />}>
          <Outlet context={{ ...data, reload, patchLocal, saveCatalogRow, removeCatalogRow, loading, user, openCount: data.enquiries.filter((e) => OPEN_STATUSES.includes(e.status)).length }} />
        </Suspense>
      </main>

      {/* Mobile bottom tabs */}
      <nav className="adm-tabs">
        {nav.map(({ to, label, icon: Icon, badge, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `adm-tab${isActive ? ' active' : ''}`}>
            <Icon size={20} />
            <span>{nav.find((n) => n.to === to)?.short || label}</span>
            {badge > 0 && <em className="adm-badge">{badge}</em>}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
