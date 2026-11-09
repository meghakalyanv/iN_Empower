import { useEffect, useMemo, useRef, useState } from 'react'
import { useOutletContext, useSearchParams, Link } from 'react-router-dom'
import { Printer, ArrowLeft } from 'lucide-react'
import { api } from '../../services/api'
import { serviceLabel, stageInfo, dueText, isOverdue } from './adminShared'
import { readFilters, periodRange, applyFilters, describeFilters, computeStats, fmtMins, fmtDays, pctChange, FILTER_KEYS } from './monitorShared'
import { Legend, StackedBars, HBars, Heatmap, Funnel, ScoreTable } from './monitorCharts'
import { addDays, istFull, istWhen, hoursText } from '../../data/workHours'

/**
 * Printable report of exactly what the Monitor filters show.
 * Opens the print window — choose "Save as PDF" as the printer.
 */
export default function AdminReport() {
  const { enquiries, partners, buddies, user, loading } = useOutletContext()
  const [params] = useSearchParams()
  const f = useMemo(() => readFilters(params), [params])
  const phones = params.get('phones') === '1'
  const range = useMemo(() => periodRange(f), [f])
  const [timings, setTimings] = useState(null)
  const printed = useRef(false)

  useEffect(() => {
    api.admin.ticketTimings?.(new Date(Date.now() - 400 * 86400000).toISOString()).then((t) => setTimings(t || {})).catch(() => setTimings({}))
    document.title = `iN Empower report — ${range.label}`
  }, [range.label])

  const list = useMemo(() => applyFilters(enquiries, f), [enquiries, f])
  const prevList = useMemo(() => (f.stage === 'overdue' ? [] : applyFilters(enquiries, { ...f, period: 'custom', from: addDays(range.from, -range.days), to: addDays(range.from, -1) })), [enquiries, f, range])
  const s = useMemo(() => computeStats(list, { all: enquiries, timings: timings || {}, range, prevList, buddies, partners }), [list, enquiries, timings, range, prevList, buddies, partners])

  // Open the print window once the numbers are ready
  const ready = timings !== null && !loading && enquiries.length >= 0
  useEffect(() => {
    if (!ready || printed.current) return
    printed.current = true
    const t = setTimeout(() => window.print(), 900)
    return () => clearTimeout(t)
  }, [ready])

  const backTo = `/admin/monitor?${new URLSearchParams(Object.fromEntries(FILTER_KEYS.filter((k) => f[k]).map((k) => [k, f[k]]))).toString()}`
  const kpis = [
    ['Requests', s.received, f.stage === 'overdue' ? '' : `${pctChange(s.received, s.prevReceived) || '—'} vs period before`],
    ['Completed', s.completed], ['Still open', s.open], ['Overdue now', s.overdue], ['Cancelled', s.cancelled],
    ['Completed (of closed)', s.completionRate == null ? '—' : `${s.completionRate}%`],
    ['Called within 1 office hour', s.within1hPct == null ? '—' : `${s.within1hPct}%`],
    ['Typical time to first call', fmtMins(s.firstMedian), 'office hours only'],
    ['New, nobody called yet', s.waiting], ['Typical time to finish', fmtDays(s.finishMedianDays)],
    ['Finished on time', s.onTimePct == null ? '—' : `${s.onTimePct}%`], ['Came after hours', s.afterHours],
    ['Emergencies', s.emergencies], ['Repeat customers', s.repeat], ['Open, no buddy', s.noBuddy], ['Open, no partner', s.noPartner],
  ]

  return (
    <div className="adm-report">
      <div className="adm-report-bar no-print">
        <Link to={backTo} className="adm-btn adm-btn-ghost adm-btn-sm"><ArrowLeft size={15} /> Back to Monitor</Link>
        <span className="adm-muted adm-small">In the print window, choose <strong>Save as PDF</strong> as the printer.</span>
        <button className="adm-btn adm-btn-sm" onClick={() => window.print()}><Printer size={15} /> Print / Save as PDF</button>
      </div>

      <header className="adm-report-head">
        <div className="adm-report-brand">i<span>N</span> Empower</div>
        <div>
          <h1>Requests report</h1>
          <p><strong>{f.stage === 'overdue' ? 'Overdue right now' : range.label}</strong> · {describeFilters(f, { buddies, partners })}</p>
          <p className="adm-muted">Made {istFull(new Date())} (India time){user?.name ? ` by ${user.name}` : ''} · Office hours {hoursText()}</p>
        </div>
      </header>

      {!ready ? <p className="adm-muted">Preparing the report…</p> : (
        <>
          <section className="adm-report-kpis">
            {kpis.map(([label, value, sub]) => (
              <div key={label}><strong>{value}</strong><span>{label}</span>{sub && <em>{sub}</em>}</div>
            ))}
          </section>

          {f.stage !== 'overdue' && s.perDay.length > 1 && (
            <section className="adm-report-block">
              <h2>Requests per day</h2>
              <Legend />
              <StackedBars rows={s.perDay} unit="request" height={150} />
            </section>
          )}

          <div className="adm-report-2">
            <section className="adm-report-block"><h2>Busiest days and times</h2><Heatmap heat={s.heat} slots={s.SLOTS} /></section>
            <section className="adm-report-block">
              <h2>How far requests get</h2>
              <Funnel received={s.received} steps={s.funnel} />
              <h3>Why requests were cancelled</h3>
              <HBars rows={s.cancelReasons} empty="No cancellations." />
            </section>
          </div>

          <div className="adm-report-3">
            <section className="adm-report-block"><h2>By service</h2><HBars rows={s.byService} trend max={10} /></section>
            <section className="adm-report-block"><h2>Top items</h2><HBars rows={s.byItem} trend max={10} /></section>
            <section className="adm-report-block"><h2>By town</h2><HBars rows={s.byTown} trend max={10} empty="No town given." /></section>
          </div>
          <div className="adm-report-3">
            <section className="adm-report-block"><h2>Customer's timing</h2><HBars rows={s.byUrgency} /></section>
            <section className="adm-report-block"><h2>Website or app</h2><HBars rows={s.bySource} /></section>
            <section className="adm-report-block"><h2>How it came in</h2><HBars rows={s.byChannel} /></section>
          </div>

          <section className="adm-report-block"><h2>Local Buddies</h2><ScoreTable rows={s.buddyCards} empty="No requests with a buddy." /></section>
          <section className="adm-report-block"><h2>Business Partners</h2><ScoreTable rows={s.partnerCards} empty="No requests with a partner." /></section>

          <section className="adm-report-block adm-report-list">
            <h2>The requests ({list.length})</h2>
            {list.length === 0 ? <p className="adm-muted">No requests match.</p> : (
              <table>
                <thead>
                  <tr><th>Received</th><th>Ref</th><th>Customer</th>{phones && <th>Phone</th>}<th>Service / item</th><th>Town</th><th>Stage</th><th>Buddy</th><th>Partner</th></tr>
                </thead>
                <tbody>
                  {list.map((e) => (
                    <tr key={e.id}>
                      <td>{istWhen(e.created_at)}</td>
                      <td>{e.details?.ref || '—'}</td>
                      <td>{e.name}</td>
                      {phones && <td>{e.phone}</td>}
                      <td>{e.item || serviceLabel(e.service)}</td>
                      <td>{e.area || '—'}</td>
                      <td>{stageInfo(e).label}{isOverdue(e) ? ` (${dueText(e)})` : ''}{e.status === 'cancelled' && e.cancel_reason ? ` — ${e.cancel_reason}` : ''}</td>
                      <td>{e.buddy?.name || '—'}</td>
                      <td>{e.partner?.business_name || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
          <p className="adm-report-foot">iN Empower · Ongole, Prakasam District · {phones ? 'Contains customer phone numbers — share with care.' : 'Customer phone numbers left out.'}</p>
        </>
      )}
    </div>
  )
}
