import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import { RefreshCw, Download, X } from 'lucide-react'
import { api } from '../../services/api'
import { STAGES, SERVICE_LABELS, serviceLabel, prettify, timeAgo, stageInfo, isOverdue, dueText, whenIST } from './adminShared'
import { PERIODS, VIEWS, HOURS, FILTER_KEYS, readFilters, periodRange, applyFilters, describeFilters, computeStats, fmtMins, fmtDays, pctChange } from './monitorShared'
import { Kpi, Legend, StackedBars, HBars, Heatmap, Funnel, ScoreTable } from './monitorCharts'
import { addDays } from '../../data/workHours'

const FREE_DB_BYTES = 500 * 1024 * 1024 // Supabase free plan
const DAY = 86400000

export default function AdminMonitor() {
  const { enquiries, partners, buddies } = useOutletContext()
  const [params, setParams] = useSearchParams()
  const f = useMemo(() => readFilters(params), [params])
  const range = useMemo(() => periodRange(f), [f])
  const [stats, setStats] = useState(null)
  const [statsError, setStatsError] = useState('')
  const [timings, setTimings] = useState({})
  const [ping, setPing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [phones, setPhones] = useState(false)

  const set = (k, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v); else next.delete(k)
    if (k === 'period' && v !== 'custom') { next.delete('from'); next.delete('to') }
    setParams(next, { replace: true })
  }
  const applyView = (v) => setParams(new URLSearchParams(v.f), { replace: true })
  const clear = () => setParams(new URLSearchParams({ period: f.period }), { replace: true })
  const activeView = VIEWS.find((v) => Object.keys(v.f).length === FILTER_KEYS.filter((k) => f[k]).length && Object.entries(v.f).every(([k, val]) => f[k] === val))

  const load = useCallback(async () => {
    setBusy(true)
    try {
      setPing(await api.admin.pingDatabase().catch(() => -1))
      setTimings(await api.admin.ticketTimings?.(new Date(Date.now() - 400 * DAY).toISOString()).catch(() => ({})) || {})
      const s = await api.admin.monitorStats(Math.min(365, Math.max(7, range.days)))
      setStats(s); setStatsError('')
    } catch (err) {
      setStats(null)
      setStatsError(/admin_monitor_stats|PGRST202|42883|schema cache/i.test(`${err.code} ${err.message}`) ? 'setup' : (err.message || 'Could not load'))
    } finally {
      setBusy(false)
    }
  }, [range.days])
  useEffect(() => { load() }, [load])

  // Requests matching the filters, and the same filters for the period just before (for ▲ / ▼)
  const list = useMemo(() => applyFilters(enquiries, f), [enquiries, f])
  const prevList = useMemo(() => {
    if (f.stage === 'overdue') return []
    return applyFilters(enquiries, { ...f, period: 'custom', from: addDays(range.from, -range.days), to: addDays(range.from, -1) })
  }, [enquiries, f, range])
  const s = useMemo(() => computeStats(list, { all: enquiries, timings, range, prevList, buddies, partners }), [list, enquiries, timings, range, prevList, buddies, partners])

  const cats = useMemo(() => [...new Set(enquiries.map((e) => e.service).filter(Boolean))].sort((a, b) => serviceLabel(a).localeCompare(serviceLabel(b))), [enquiries])
  const items = useMemo(() => [...new Set(enquiries.filter((e) => !f.cat || e.service === f.cat).map((e) => e.item || prettify(e.sub_service)).filter(Boolean))].sort(), [enquiries, f.cat])
  const towns = useMemo(() => [...new Set(enquiries.map((e) => (e.area || '').split(/[—,-]/)[0].trim()).filter(Boolean))].sort(), [enquiries])
  const urgencies = useMemo(() => [...new Set(enquiries.map((e) => e.urgency || 'Not said'))], [enquiries])

  const reportHref = `/admin/report?${new URLSearchParams({ ...Object.fromEntries(FILTER_KEYS.filter((k) => f[k]).map((k) => [k, f[k]])), ...(phones ? { phones: '1' } : {}) }).toString()}`

  /* ── System health + visitors (website / app) ── */
  const visitsPerDay = useMemo(() => {
    const m = {}; (stats?.visits_by_day || []).forEach((r) => { m[r.day] = r })
    const out = []; const n = Math.min(range.days, 365)
    for (let i = 0; i < n; i++) { const d = addDays(range.from, i); out.push({ day: d, website: m[d]?.website || 0, app: m[d]?.app || 0 }) }
    return out
  }, [stats, range])
  const totalVisits = visitsPerDay.reduce((a, r) => a + r.website + r.app, 0)
  const appVisits = visitsPerDay.reduce((a, r) => a + r.app, 0)
  const devices = stats?.devices || {}
  const mobileShare = totalVisits ? Math.round(((devices.mobile || 0) + (devices.android || 0) + (devices.ios || 0) + (devices.tablet || 0)) / Math.max(1, Object.values(devices).reduce((a, b) => a + b, 0)) * 100) : null
  const dbPct = stats?.db_bytes ? Math.round((stats.db_bytes / FREE_DB_BYTES) * 100) : null
  const lastRequest = enquiries[0]?.created_at
  const health = [
    { label: 'Database (Supabase)', tone: ping == null ? '' : ping < 0 ? 'bad' : ping > 1500 ? 'warn' : 'ok', value: ping == null ? 'Checking…' : ping < 0 ? 'Not answering' : `Answering · ${ping} ms` },
    { label: 'Database space (free plan 500 MB)', tone: dbPct == null ? '' : dbPct > 80 ? 'bad' : dbPct > 60 ? 'warn' : 'ok', value: dbPct == null ? '—' : `${(stats.db_bytes / 1048576).toFixed(0)} MB used · ${dbPct}%` },
    { label: 'Errors seen by visitors (24 h)', tone: stats == null ? '' : stats.errors_24h > 20 ? 'bad' : stats.errors_24h > 0 ? 'warn' : 'ok', value: stats == null ? '—' : stats.errors_24h ? `${stats.errors_24h} error${stats.errors_24h > 1 ? 's' : ''}` : 'None' },
    { label: 'Last visit recorded', tone: !stats ? '' : !stats.last_visit ? 'warn' : Date.now() - new Date(stats.last_visit) > 2 * DAY ? 'warn' : 'ok', value: stats?.last_visit ? timeAgo(stats.last_visit) : 'None yet' },
    { label: 'Last customer request', tone: lastRequest ? (Date.now() - new Date(lastRequest) > 6 * DAY ? 'warn' : 'ok') : 'warn', value: lastRequest ? whenIST(lastRequest) : 'None yet' },
    { label: 'WhatsApp alerts to you', tone: stats?.whatsapp_enabled ? 'ok' : 'warn', value: stats == null ? '—' : stats.whatsapp_enabled == null ? 'Not set up' : stats.whatsapp_enabled ? 'On' : 'Off' },
  ]

  const anyFilter = FILTER_KEYS.some((k) => k !== 'period' && k !== 'from' && k !== 'to' && f[k])

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Monitor</h1>
          <p className="adm-muted">Filter by any situation, see how the work is going, and download it as a PDF. All times are India time.</p>
        </div>
        <div className="adm-row">
          <label className="adm-check adm-small" title="Phone numbers in the PDF are handy for calling, but take care if you forward it"><input type="checkbox" checked={phones} onChange={(e) => setPhones(e.target.checked)} /> Phones in PDF</label>
          <Link className="adm-btn adm-btn-sm" to={reportHref} target="_blank"><Download size={15} /> Download PDF</Link>
          <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={load} disabled={busy}><RefreshCw size={15} className={busy ? 'adm-spin' : ''} /> Check now</button>
        </div>
      </header>

      {/* Situations */}
      <div className="adm-chips adm-views" role="group" aria-label="Saved views">
        {VIEWS.map((v) => (
          <button key={v.key} className={`adm-chip${activeView?.key === v.key ? ' active' : ''}`} onClick={() => applyView(v)}>{v.label}</button>
        ))}
      </div>

      {/* Filters */}
      <div className="adm-filters adm-filterbar">
        <select value={f.period} onChange={(e) => set('period', e.target.value)} aria-label="Period">
          {PERIODS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
        </select>
        {f.period === 'custom' && (
          <>
            <input type="date" value={f.from || range.from} max={f.to || undefined} onChange={(e) => set('from', e.target.value)} aria-label="From" />
            <input type="date" value={f.to || addDays(range.to, -1)} min={f.from || undefined} onChange={(e) => set('to', e.target.value)} aria-label="To" />
          </>
        )}
        <select value={f.cat || ''} onChange={(e) => { set('cat', e.target.value) }} aria-label="Service">
          <option value="">All services</option>
          {cats.map((c) => <option key={c} value={c}>{SERVICE_LABELS[c] || serviceLabel(c)}</option>)}
        </select>
        <select value={f.item || ''} onChange={(e) => set('item', e.target.value)} aria-label="Item">
          <option value="">Any item</option>
          {items.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
        <select value={f.area || ''} onChange={(e) => set('area', e.target.value)} aria-label="Town">
          <option value="">All towns</option>
          {towns.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
        <select value={f.stage || ''} onChange={(e) => set('stage', e.target.value)} aria-label="Stage">
          <option value="">Any stage</option>
          <option value="open">Open (not finished)</option>
          <option value="overdue">Overdue now</option>
          {STAGES.map((st) => <option key={st.key} value={st.key}>{st.label}</option>)}
        </select>
        <select value={f.buddy || ''} onChange={(e) => set('buddy', e.target.value)} aria-label="Local Buddy">
          <option value="">Any buddy</option>
          <option value="none">No buddy yet</option>
          {buddies.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={f.partner || ''} onChange={(e) => set('partner', e.target.value)} aria-label="Business Partner">
          <option value="">Any partner</option>
          <option value="none">No partner yet</option>
          {partners.map((p) => <option key={p.id} value={p.id}>{p.business_name}</option>)}
        </select>
        <select value={f.source || ''} onChange={(e) => set('source', e.target.value)} aria-label="Website or app">
          <option value="">Website + app</option>
          <option value="website">Website</option>
          <option value="app">App</option>
        </select>
        <select value={f.channel || ''} onChange={(e) => set('channel', e.target.value)} aria-label="How it came in">
          <option value="">Chat, page or form</option>
          <option value="chat">Chat Buddy</option>
          <option value="page">Service page</option>
          <option value="form">Form</option>
          <option value="phone">Phone call</option>
        </select>
        <select value={f.urgency || ''} onChange={(e) => set('urgency', e.target.value)} aria-label="Customer's timing">
          <option value="">Any timing</option>
          {urgencies.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={f.hours || ''} onChange={(e) => set('hours', e.target.value)} aria-label="Hours">
          <option value="">Any time of day</option>
          {HOURS.map((h) => <option key={h.key} value={h.key}>{h.label}</option>)}
        </select>
        <label className="adm-check adm-small"><input type="checkbox" checked={!!f.emergency} onChange={(e) => set('emergency', e.target.checked ? '1' : '')} /> 🚑 Emergencies</label>
        {anyFilter && <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={clear}><X size={14} /> Clear</button>}
      </div>
      <p className="adm-muted adm-small" style={{ margin: '-0.25rem 0 1rem' }}>
        <strong>{s.received}</strong> request{s.received === 1 ? '' : 's'} · {f.stage === 'overdue' ? 'overdue right now' : range.label} · {describeFilters(f, { buddies, partners })}
      </p>

      {statsError === 'setup' && <div className="adm-alert">Visitor numbers start after <code>supabase/009</code> is run.</div>}

      {/* 1. The work */}
      <div className="adm-kpis">
        <Kpi value={s.received} label="Requests" sub={f.stage === 'overdue' ? '' : pctChange(s.received, s.prevReceived) && `${pctChange(s.received, s.prevReceived)} vs before`} />
        <Kpi value={s.completed} label="Completed" good={s.completed > 0} />
        <Kpi value={s.open} label="Still open" />
        <Kpi value={s.overdue} label="Overdue now" bad={s.overdue > 0} to="/admin/requests?status=overdue" />
        <Kpi value={s.cancelled} label="Cancelled" />
        <Kpi value={s.completionRate == null ? '—' : `${s.completionRate}%`} label="Completed (of closed)" />
        <Kpi value={s.within1hPct == null ? '—' : `${s.within1hPct}%`} label="Called within 1 office hour" good={s.within1hPct >= 80} bad={s.within1hPct != null && s.within1hPct < 50} />
        <Kpi value={fmtMins(s.firstMedian)} label="Typical time to first call" sub="office hours only" />
        <Kpi value={s.waiting} label="New, nobody called yet" bad={s.waiting > 0} />
        <Kpi value={fmtDays(s.finishMedianDays)} label="Typical time to finish" />
        <Kpi value={s.onTimePct == null ? '—' : `${s.onTimePct}%`} label="Finished on time" />
        <Kpi value={s.afterHours} label="Came after hours" sub={s.received ? `${Math.round((s.afterHours / s.received) * 100)}% of requests` : ''} />
        <Kpi value={s.emergencies} label="Emergencies" bad={s.emergencies > 0} />
        <Kpi value={s.repeat} label="Repeat customers" />
        <Kpi value={s.noBuddy} label="Open, no buddy" />
        <Kpi value={s.noPartner} label="Open, no partner" />
      </div>

      {f.stage !== 'overdue' && s.perDay.length > 1 && (
        <section className="adm-card">
          <div className="adm-card-head"><h3>Requests per day</h3></div>
          <Legend />
          <StackedBars rows={s.perDay} unit="request" />
        </section>
      )}

      <div className="adm-grid-2 adm-mt">
        <section className="adm-card"><div className="adm-card-head"><h3>Busiest days and times</h3></div><Heatmap heat={s.heat} slots={s.SLOTS} /></section>
        <section className="adm-card">
          <div className="adm-card-head"><h3>How far requests get</h3></div>
          <Funnel received={s.received} steps={s.funnel} />
          <h4 className="adm-subhead">Why requests were cancelled</h4>
          <HBars rows={s.cancelReasons} empty="No cancellations." />
        </section>
      </div>

      <h2 className="adm-section-title">Demand <span className="adm-muted adm-small">▲ / ▼ compared with the {range.days === 1 ? 'day' : `${range.days} days`} before</span></h2>
      <div className="adm-grid-3">
        <section className="adm-card"><div className="adm-card-head"><h3>By service</h3></div><HBars rows={s.byService} trend max={10} /></section>
        <section className="adm-card"><div className="adm-card-head"><h3>Top items</h3></div><HBars rows={s.byItem} trend /></section>
        <section className="adm-card"><div className="adm-card-head"><h3>By town</h3></div><HBars rows={s.byTown} trend empty="No town given yet." /></section>
      </div>
      <div className="adm-grid-3 adm-mt">
        <section className="adm-card"><div className="adm-card-head"><h3>Customer's timing</h3></div><HBars rows={s.byUrgency} /></section>
        <section className="adm-card"><div className="adm-card-head"><h3>Website or app</h3></div><HBars rows={s.bySource} /></section>
        <section className="adm-card"><div className="adm-card-head"><h3>How it came in</h3></div><HBars rows={s.byChannel} /></section>
      </div>

      <h2 className="adm-section-title">Scorecards</h2>
      <div className="adm-grid-2">
        <section className="adm-card"><div className="adm-card-head"><h3>Local Buddies</h3><Link to="/admin/buddies" className="adm-link">All →</Link></div><ScoreTable rows={s.buddyCards} linkKey="buddy" empty="No requests with a buddy in this view." /></section>
        <section className="adm-card"><div className="adm-card-head"><h3>Business Partners</h3><Link to="/admin/partners" className="adm-link">All →</Link></div><ScoreTable rows={s.partnerCards} linkKey="partner" empty="No requests with a partner in this view." /></section>
      </div>
      <p className="adm-hint">"First call" = typical office time from the request to the first action (stage change, buddy assigned or note). "On time" = finished before the finish-by date.</p>

      <h2 className="adm-section-title">The requests ({list.length})</h2>
      {list.length === 0 ? <div className="adm-card adm-empty">No requests match.</div> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Received</th><th>Customer</th><th>Service</th><th>Town</th><th>Stage</th><th>Buddy / Partner</th></tr></thead>
            <tbody>
              {list.slice(0, 150).map((e) => {
                const st = stageInfo(e)
                return (
                  <tr key={e.id}>
                    <td data-label="Received"><Link className="adm-link" to={`/admin/requests?id=${e.id}&status=all`}>{whenIST(e.created_at)}</Link>{e.details?.ref && <span className="adm-muted adm-block">{e.details.ref}</span>}</td>
                    <td data-label="Customer">{e.name}</td>
                    <td data-label="Service">{e.item || serviceLabel(e.service)}</td>
                    <td data-label="Town">{e.area || '—'}</td>
                    <td data-label="Stage"><span className="adm-pill" style={{ color: st.color, background: st.bg }}>{st.label}</span>{isOverdue(e) && <span className="adm-due late adm-block">{dueText(e)}</span>}</td>
                    <td data-label="Buddy / Partner">{e.buddy?.name || '—'}<span className="adm-muted adm-block">{e.partner?.business_name || ''}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {list.length > 150 && <p className="adm-hint" style={{ padding: '0.5rem 1rem' }}>Showing the first 150 — the PDF has them all.</p>}
        </div>
      )}

      {/* 2. Is everything working? */}
      <h2 className="adm-section-title">System health</h2>
      <div className="adm-grid-2">
        <section className="adm-card">
          <ul className="adm-health">
            {health.map((h) => (
              <li key={h.label}>
                <i className={`adm-dot ${h.tone}`} aria-hidden="true" />
                <span>{h.label}</span>
                <span>{h.tone === 'bad' ? '🔴 ' : h.tone === 'warn' ? '🟡 ' : h.tone === 'ok' ? '🟢 ' : ''}{h.value}</span>
              </li>
            ))}
          </ul>
          <p className="adm-hint">Free database plan: it pauses after 7 days with no activity. Customer requests and visits keep it awake once you are live.</p>
        </section>
        <section className="adm-card">
          <div className="adm-card-head"><h3>Errors on the website and app</h3></div>
          {(stats?.recent_errors || []).length === 0 ? <p className="adm-muted adm-small">No errors recorded.</p> : (
            <ul className="adm-err-list">
              {stats.recent_errors.slice(0, 8).map((r, i) => (
                <li key={i}>
                  <span className="adm-tag">{r.source === 'app' ? `App ${r.app_version || ''}` : 'Website'}</span>{' '}
                  <span className="adm-muted adm-small">{whenIST(r.created_at)}{r.path ? ` · ${r.path}` : ''}{r.device ? ` · ${r.device}` : ''}</span>
                  <div><code>{r.message}</code></div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* 3. Visitors */}
      <h2 className="adm-section-title">Visitors — website and app <span className="adm-muted adm-small">{range.label}</span></h2>
      <div className="adm-kpis">
        <Kpi value={stats?.visits_today ?? '—'} label="Visits today" />
        <Kpi value={stats ? totalVisits : '—'} label="Visits in this period" />
        <Kpi value={stats ? appVisits : '—'} label="App opens" />
        <Kpi value={mobileShare == null ? '—' : `${mobileShare}%`} label="On phones" />
        <Kpi value={stats && totalVisits && !anyFilter ? `${Math.round((list.length / totalVisits) * 100)}%` : '—'} label="Visits that became requests" />
      </div>
      {visitsPerDay.length > 1 && (
        <section className="adm-card">
          <div className="adm-card-head"><h3>Visits per day</h3></div>
          <Legend />
          <StackedBars rows={visitsPerDay} unit="visit" />
        </section>
      )}
      <div className="adm-grid-3 adm-mt">
        <section className="adm-card"><div className="adm-card-head"><h3>First page people open</h3></div><HBars rows={(stats?.top_pages || []).map((r) => [r.path, r.n])} /></section>
        <section className="adm-card"><div className="adm-card-head"><h3>Where they came from</h3></div><HBars rows={(stats?.referrers || []).map((r) => [r.referrer, r.n])} /></section>
        <section className="adm-card"><div className="adm-card-head"><h3>App versions in use</h3></div><HBars rows={Object.entries(stats?.app_versions || {}).sort((a, b) => b[1] - a[1])} empty="No app opens yet." /></section>
      </div>
    </div>
  )
}
