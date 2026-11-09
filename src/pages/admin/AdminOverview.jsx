import { useMemo } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { AlertTriangle, ArrowRight, Download, Sun } from 'lucide-react'
import { greeting, ist, istAt, addDays, isWorkingTime, isWorkDay, holidayName, istTime } from '../../data/workHours'
import { OPEN_STATUSES, serviceLabel, stageInfo, timeAgo, prettify, isOverdue, isOutOfHours, isEmergencyTicket, isOpen } from './adminShared'

const DAY = 24 * 60 * 60 * 1000

export default function AdminOverview() {
  const { enquiries, jobs, buddies, partners, user } = useOutletContext()

  const stats = useMemo(() => {
    const now = Date.now()
    const open = enquiries.filter((e) => OPEN_STATUSES.includes(e.status))
    return {
      newCount: enquiries.filter((e) => e.status === 'new').length,
      inProgress: enquiries.filter((e) => e.status === 'contacted' || e.status === 'in_progress').length,
      unassigned: open.filter((e) => !e.assigned_buddy_id).length,
      overdue: open.filter((e) => isOverdue(e, now)).length,
      noPartner: open.filter((e) => !e.assigned_partner_id).length,
      activePartners: partners.filter((p) => p.status === 'active').length,
      completed30: enquiries.filter((e) => e.status === 'completed' && now - new Date(e.updated_at || e.created_at) < 30 * DAY).length,
      today: enquiries.filter((e) => now - new Date(e.created_at) < DAY).length,
      waitingLong: enquiries.filter((e) => e.status === 'new' && now - new Date(e.created_at) > DAY),
      pendingJobs: jobs.filter((j) => j.status === 'pending').length,
      activeBuddies: buddies.filter((b) => b.status === 'active').length,
    }
  }, [enquiries, jobs, buddies, partners])

  const byService = useMemo(() => {
    const counts = {}
    enquiries.forEach((e) => { counts[e.service || 'other'] = (counts[e.service || 'other'] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [enquiries])

  const latest = enquiries.slice(0, 6)

  const tiles = [
    { label: 'New — not yet contacted', value: stats.newCount, to: '/admin/requests?status=new', tone: 'saffron' },
    { label: 'In progress', value: stats.inProgress, to: '/admin/requests?status=open', tone: 'navy' },
    { label: 'Overdue — past finish-by date', value: stats.overdue, to: '/admin/requests?status=overdue', tone: stats.overdue ? 'saffron' : 'plain' },
    { label: 'Completed (last 30 days)', value: stats.completed30, to: '/admin/requests?status=completed', tone: 'green' },
  ]

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>{greeting().en}, {(user?.name || '').split(' ')[0] || 'team'} 🙏</h1>
          <p className="adm-muted">{stats.today} new request{stats.today === 1 ? '' : 's'} in the last 24 hours.</p>
        </div>
      </header>

      <DailySummary enquiries={enquiries} buddies={buddies} partners={partners} />

      <div className="adm-tiles">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to} className={`adm-tile adm-tile-${t.tone}`}>
            <strong>{t.value}</strong>
            <span>{t.label}</span>
          </Link>
        ))}
      </div>

      {stats.waitingLong.length > 0 && (
        <Link to="/admin/requests?status=new" className="adm-attention">
          <AlertTriangle size={18} />
          <span><strong>{stats.waitingLong.length}</strong> new request{stats.waitingLong.length === 1 ? ' has' : 's have'} been waiting more than a day — call them first.</span>
          <ArrowRight size={16} />
        </Link>
      )}

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card-head">
            <h3>Latest requests</h3>
            <Link to="/admin/requests" className="adm-link">See all →</Link>
          </div>
          {latest.length === 0 ? (
            <p className="adm-empty">No requests yet. They'll appear here as soon as customers use the website or app.</p>
          ) : (
            <ul className="adm-list">
              {latest.map((e) => {
                const s = stageInfo(e)
                return (
                  <li key={e.id}>
                    <Link to={`/admin/requests?id=${e.id}`} className="adm-list-row">
                      <div>
                        <strong>{e.name}</strong>
                        <span className="adm-muted">{serviceLabel(e.service)}{e.sub_service ? ` · ${prettify(e.sub_service)}` : ''}</span>
                      </div>
                      <div className="adm-list-right">
                        <span className="adm-pill" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                        <span className="adm-muted adm-small">{timeAgo(e.created_at)}</span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="adm-card">
          <div className="adm-card-head"><h3>Most requested services</h3></div>
          {byService.length === 0 ? (
            <p className="adm-empty">Nothing yet.</p>
          ) : (
            <table className="adm-mini-table">
              <tbody>
                {byService.map(([key, n]) => (
                  <tr key={key}>
                    <td>{serviceLabel(key)}</td>
                    <td className="adm-num">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="adm-card-foot">
            <Link to="/admin/jobs" className="adm-link">{stats.pendingJobs} job post{stats.pendingJobs === 1 ? '' : 's'} waiting for review →</Link>
            <Link to="/admin/buddies" className="adm-link">{stats.activeBuddies} active Local Buddies →</Link>
            <Link to="/admin/partners" className="adm-link">{stats.activePartners} active Business Partners →</Link>
            <Link to="/admin/requests?partner=none" className="adm-link">{stats.noPartner} open request{stats.noPartner === 1 ? '' : 's'} without a partner →</Link>
            <Link to="/admin/monitor" className="adm-link">Website & app monitor →</Link>
          </div>
        </section>
      </div>
    </div>
  )
}

/** Today's summary (India time): what happened yesterday and what needs doing today */
function DailySummary({ enquiries, buddies, partners }) {
  const d = useMemo(() => {
    const today = ist().ymd
    const yStart = istAt(addDays(today, -1)); const tStart = istAt(today); const tEnd = istAt(addDays(today, 1))
    const inY = (x) => { const t = new Date(x); return t >= yStart && t < tStart }
    const y = enquiries.filter((e) => inY(e.created_at))
    return {
      today,
      yNew: y.length,
      yDone: enquiries.filter((e) => e.status === 'completed' && e.updated_at && inY(e.updated_at)).length,
      yCancel: enquiries.filter((e) => e.status === 'cancelled' && e.updated_at && inY(e.updated_at)).length,
      dueToday: enquiries.filter((e) => isOpen(e) && e.due_at && new Date(e.due_at) >= tStart && new Date(e.due_at) < tEnd).length,
      overdue: enquiries.filter((e) => isOverdue(e)).length,
      nightToCall: enquiries.filter((e) => e.status === 'new' && isOutOfHours(e)).length,
      emergencies: enquiries.filter((e) => isOpen(e) && isEmergencyTicket(e)).length,
      workshops: y.filter((e) => e.service === 'workshop').length,
      buddyApps: buddies.filter((b) => b.status === 'pending').length,
      partnerChecks: partners.filter((p) => p.status === 'pending').length,
    }
  }, [enquiries, buddies, partners])
  const closedToday = !isWorkDay(d.today)
  const items = [
    d.emergencies > 0 && { n: d.emergencies, t: 'open emergencies — call now', to: '/admin/monitor?period=month&emergency=1&stage=open', bad: true },
    { n: d.nightToCall, t: 'after-hours requests to call', to: '/admin/monitor?period=7d&stage=new&hours=out', bad: d.nightToCall > 0 },
    { n: d.dueToday, t: 'due today', to: '/admin/requests?status=open' },
    { n: d.overdue, t: 'overdue', to: '/admin/requests?status=overdue', bad: d.overdue > 0 },
    { n: d.buddyApps, t: 'buddy applications to review', to: '/admin/buddies' },
    { n: d.partnerChecks, t: 'partners being checked', to: '/admin/partners' },
  ].filter(Boolean)
  return (
    <section className="adm-card adm-daily">
      <div className="adm-card-head">
        <h3><Sun size={16} /> Today's summary</h3>
        <span className="adm-muted adm-small">{istTime(new Date())} · {isWorkingTime() ? 'office open' : closedToday ? `closed today${holidayName(d.today) ? ` (${holidayName(d.today)})` : ' (Sunday)'}` : 'office closed now'}</span>
      </div>
      <p className="adm-daily-y"><strong>Yesterday:</strong> {d.yNew} new · {d.yDone} completed · {d.yCancel} cancelled{d.workshops ? ` · ${d.workshops} workshop sign-ups` : ''}</p>
      <ul className="adm-daily-list">
        {items.map((i) => (
          <li key={i.t}><Link to={i.to} className={i.bad ? 'bad' : ''}><strong>{i.n}</strong> {i.t} →</Link></li>
        ))}
      </ul>
      <div className="adm-row adm-mt">
        <Link className="adm-btn adm-btn-ghost adm-btn-sm" to="/admin/report?period=yesterday" target="_blank"><Download size={14} /> Yesterday's report (PDF)</Link>
        <Link className="adm-btn adm-btn-ghost adm-btn-sm" to="/admin/report?period=90d&stage=open" target="_blank"><Download size={14} /> All open work (PDF)</Link>
      </div>
    </section>
  )
}
