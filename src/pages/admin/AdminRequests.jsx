import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import { Search, Download, X, PhoneIncoming, Phone, MessageCircle, Mail, Send, UserCheck, Clock, StickyNote, ArrowLeftRight, Handshake, CalendarClock, Layers, Heart, CheckCircle2, Moon, Siren, MessageSquareText } from 'lucide-react'
import { api } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import {
  STATUSES, OPEN_STATUSES, statusInfo, serviceLabel, prettify, timeAgo, fullDate,
  telLink, whatsappLink, customerGreeting, buddyBrief, matchesSearch, downloadCsv, TIERS,
  STAGES, stageInfo, stageKey, stageLabel, isSupply, isOverdue, dueText, partnerFits, partnerBrief, partnerKindLabel,
  THANK_TARGETS, thankYouMessage, THANK_NOTE, thanksSent,
  whenIST, isOutOfHours, isEmergencyTicket, isOpen, CANCEL_REASONS, customerUpdate, updateStepFor, UPDATE_LABEL, UPDATE_STEPS,
  cityOfRequest, isJobApplication, JOB_STEPS, jobStepKey, jobFor, jobLine, employerMessage, applicantMessage, adviceOnly,
} from './adminShared'
import { isQuietTime, istTime, hoursText, WORK } from '../../data/workHours'
import { allCities } from '../../data/cities'
import { showPhone } from '../../data/phone'
import NewCallRequest from './NewCallRequest'

const STATUS_FILTERS = [
  { key: 'open', label: 'Open' },
  { key: 'overdue', label: '⏰ Overdue' },
  ...STATUSES.map((s) => ({ key: s.key, label: s.label })),
  { key: 'all', label: 'All' },
]
const STAGE_STATUS = Object.fromEntries(STAGES.map((s) => [s.key, s.status]))

/** The customer's papers checklist from the app (details.papers): Have / Don't have */
const papersHave = (e) => (Array.isArray(e?.details?.papers?.have) ? e.details.papers.have : [])
const papersMissing = (e) => (Array.isArray(e?.details?.papers?.missing) ? e.details.papers.missing : [])
// Forms we prepare, and the details to read from the ready papers (owner, 6 Nov 2026)
const papersPrepare = (e) => (Array.isArray(e?.details?.papers?.prepare) ? e.details.papers.prepare : [])
const fromPapers = (e) => (Array.isArray(e?.details?.fromPapers) ? e.details.fromPapers : [])

export default function AdminRequests() {
  const { enquiries: allEnquiries, buddies, partners, reload } = useOutletContext()
  const [callOpen, setCallOpen] = useState(false) // "New request from a call"
  // Part-time job applications are on the Part-time jobs page, under their job
  const enquiries = useMemo(() => allEnquiries.filter((e) => !isJobApplication(e)), [allEnquiries])
  const jobApps = allEnquiries.length - enquiries.length
  const newJobApps = useMemo(() => allEnquiries.filter((e) => isJobApplication(e) && e.status === 'new').length, [allEnquiries])
  const [params, setParams] = useSearchParams()
  const status = params.get('status') || 'open'
  const service = params.get('service') || ''
  const buddy = params.get('buddy') || ''
  const item = params.get('item') || ''
  const area = params.get('area') || ''
  const partner = params.get('partner') || ''
  const stage = params.get('stage') || ''
  const city = params.get('city') || ''
  const selectedId = params.get('id')
  // Cities (Admin → Cities): the filter shows only when there is more than one
  const cities = allCities()
  const [query, setQuery] = useState('')

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: key !== 'id' })
  }

  const counts = useMemo(() => {
    const c = { all: enquiries.length, open: 0, overdue: 0 }
    STATUSES.forEach((s) => { c[s.key] = 0 })
    const now = Date.now()
    enquiries.forEach((e) => {
      c[e.status] = (c[e.status] || 0) + 1
      if (OPEN_STATUSES.includes(e.status)) c.open++
      if (isOverdue(e, now)) c.overdue++
    })
    return c
  }, [enquiries])

  const filtered = useMemo(() => enquiries.filter((e) => {
    if (status === 'open' && !OPEN_STATUSES.includes(e.status)) return false
    if (status === 'overdue' && !isOverdue(e)) return false
    if (!['open', 'all', 'overdue'].includes(status) && e.status !== status) return false
    if (stage && stageKey(e) !== stage) return false
    if (partner === 'none' && e.assigned_partner_id) return false
    if (partner && partner !== 'none' && e.assigned_partner_id !== partner) return false
    if (service && e.service !== service) return false
    if (buddy === 'none' && e.assigned_buddy_id) return false
    if (buddy && buddy !== 'none' && e.assigned_buddy_id !== buddy) return false
    if (item && itemOf(e) !== item) return false
    if (area && areaOf(e) !== area) return false
    if (city && cityOfRequest(e).id !== city) return false
    return matchesSearch(e, query)
  })
  // Open requests: most urgent first, then newest
  .sort((a, b) => ((isEmergencyTicket(b) && isOpen(b)) - (isEmergencyTicket(a) && isOpen(a))) || (isOverdue(b) - isOverdue(a)) || (urgencyRank(a) - urgencyRank(b)) || (new Date(b.created_at) - new Date(a.created_at))),
  [enquiries, status, service, buddy, item, area, partner, stage, city, query])

  const usedItems = useMemo(() => [...new Set(enquiries.map(itemOf).filter(Boolean))].sort(), [enquiries])
  const usedAreas = useMemo(() => [...new Set(enquiries.map(areaOf).filter(Boolean))].sort(), [enquiries])

  const usedServices = useMemo(
    () => [...new Set(enquiries.map((e) => e.service).filter(Boolean))].sort((a, b) => serviceLabel(a).localeCompare(serviceLabel(b))),
    [enquiries]
  )

  // Any ticket can be opened by its id (also job applications, from the search box)
  const selected = allEnquiries.find((e) => e.id === selectedId)

  return (
    <div className={`adm-page adm-requests${selected ? ' has-detail' : ''}`}>
      <header className="adm-page-head">
        <div>
          <h1>Requests</h1>
          <p className="adm-muted">Every enquiry from the website, the app, the Chat Buddy and phone calls.{jobApps > 0 && <> Job applications are on <Link className="adm-link" to="/admin/jobs">Part-time jobs</Link>{newJobApps ? ` (${newJobApps} new)` : ''}.</>}</p>
        </div>
        <div className="adm-row">
        <button className="adm-btn adm-btn-sm" onClick={() => setCallOpen(true)}>
          <PhoneIncoming size={15} /> New request from a call
        </button>
        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => downloadCsv(`inempower-requests-${new Date().toISOString().slice(0, 10)}.csv`, filtered)} disabled={!filtered.length}>
          <Download size={15} /> Export CSV
        </button>
        </div>
      </header>
      {callOpen && <NewCallRequest enquiries={allEnquiries} onClose={() => setCallOpen(false)} onCreated={() => reload?.()} />}

      <div className="adm-chips" role="tablist">
        {STATUS_FILTERS.map((f) => (
          <button key={f.key} role="tab" aria-selected={status === f.key} className={`adm-chip${status === f.key ? ' active' : ''}`} onClick={() => setParam('status', f.key === 'open' ? '' : f.key)}>
            {f.label} <em>{counts[f.key] || 0}</em>
          </button>
        ))}
      </div>

      <div className="adm-filters">
        <label className="adm-search">
          <Search size={16} />
          <input type="search" placeholder="Search name, phone, message…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        {(cities.length > 1 || city) && (
          <select value={city} onChange={(e) => setParam('city', e.target.value)} aria-label="City">
            <option value="">All cities</option>
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
        <select value={service} onChange={(e) => setParam('service', e.target.value)} aria-label="Service">
          <option value="">All services</option>
          {usedServices.map((s) => <option key={s} value={s}>{serviceLabel(s)}</option>)}
        </select>
        <select value={buddy} onChange={(e) => setParam('buddy', e.target.value)} aria-label="Local Buddy">
          <option value="">Any buddy</option>
          <option value="none">Not assigned</option>
          {buddies.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={stage} onChange={(e) => setParam('stage', e.target.value)} aria-label="Stage">
          <option value="">Any stage</option>
          {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <select value={partner} onChange={(e) => setParam('partner', e.target.value)} aria-label="Business Partner">
          <option value="">Any partner</option>
          <option value="none">No partner yet</option>
          {partners.map((p) => <option key={p.id} value={p.id}>{p.business_name}</option>)}
        </select>
        <select value={item} onChange={(e) => setParam('item', e.target.value)} aria-label="Item">
          <option value="">Any item</option>
          {usedItems.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
        <select value={area} onChange={(e) => setParam('area', e.target.value)} aria-label="Area">
          <option value="">Any area</option>
          {usedAreas.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="adm-card adm-empty">No requests match these filters.</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Received</th><th>Customer</th><th>Service</th><th>Stage</th><th>Buddy</th><th>Partner</th></tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const s = stageInfo(e)
                const late = isOverdue(e)
                return (
                  <tr key={e.id} className={e.id === selectedId ? 'selected' : ''} onClick={() => setParam('id', e.id)} tabIndex={0} onKeyDown={(ev) => ev.key === 'Enter' && setParam('id', e.id)}>
                    <td data-label="Received">
                      <span title={timeAgo(e.created_at)}>{whenIST(e.created_at)}</span>
                      <span className="adm-tag-row">
                        {isEmergencyTicket(e) && <span className="adm-tag adm-tag-sos">🚑 Emergency</span>}
                        {isOutOfHours(e) && <span className="adm-tag adm-tag-night" title={`Received outside ${hoursText()}`}>🌙 After hours</span>}
                        <span className="adm-tag">{sourceLabel(e)}</span>
                        {cities.length > 1 && <span className="adm-tag" title="Customer's city">📍 {cityOfRequest(e).name}</span>}
                        {e.urgency && <span className="adm-tag" style={urgencyStyle(e.urgency)}>{e.urgency}</span>}
                        {e.details?.callAt?.text && <span className="adm-tag adm-tag-call" title="When the customer asked us to call">📞 {e.details.callAt.text}</span>}
                        {adviceOnly(e) && <span className="adm-tag adm-tag-advice" title="The customer answered nothing — only Not sure / skipped. Call and check if they are serious.">❓ Advice call — check if serious</span>}
                        {papersMissing(e).length > 0 && <span className="adm-tag adm-tag-papers" title={papersMissing(e).join(', ')}>Needs {papersMissing(e).length} paper{papersMissing(e).length > 1 ? 's' : ''}</span>}
                      </span>
                    </td>
                    <td data-label="Customer"><strong>{e.name}</strong><span className="adm-muted adm-block">{showPhone(e.phone)}</span></td>
                    <td data-label="Service">{serviceLabel(e.service)}{(e.item || e.sub_service) && <span className="adm-muted adm-block">{e.item || prettify(e.sub_service)}{areaOf(e) ? ` · ${areaOf(e)}` : ''}</span>}</td>
                    <td data-label="Stage">
                      <span className="adm-pill" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                      {e.due_at && OPEN_STATUSES.includes(e.status) && <span className={`adm-due adm-block${late ? ' late' : ''}`}>{late ? '⏰ ' : ''}{dueText(e)}</span>}
                    </td>
                    <td data-label="Buddy">{e.buddy?.name || <span className="adm-muted">—</span>}</td>
                    <td data-label="Partner">{e.partner?.business_name || <span className="adm-muted">—</span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && <RequestDetail key={selected.id} enquiry={selected} onClose={() => setParam('id', '')} />}
      {selectedId && !selected && allEnquiries.length > 0 && (
        <div className="adm-alert">That request wasn't found. It may have been removed.</div>
      )}
    </div>
  )
}

export function RequestDetail({ enquiry: e, onClose }) {
  const { buddies, partners, partnersReady, patchLocal, jobs = [] } = useOutletContext()
  // A part-time job application: hiring steps, the job and its employer, no partner / buddy / finish-by
  const isJob = isJobApplication(e)
  const job = isJob ? jobFor(e, jobs) : null
  const ref = e.details?.ref || ''
  const { addToast } = useToast()
  const [activity, setActivity] = useState([])
  const [note, setNote] = useState('')
  const [shareWithCustomer, setShareWithCustomer] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadActivity = () => api.admin.listActivity(e.id).then((a) => setActivity(a || [])).catch(() => {})
  useEffect(() => { loadActivity() }, [e.id])

  // The customer replied STOP on WhatsApp (owner, 6 Nov 2026): the team puts the number on the stop list;
  // automatic updates already skip it, and the WhatsApp buttons to the customer go away.
  const [waStop, setWaStop] = useState(false)
  const [askStop, setAskStop] = useState(false)
  useEffect(() => {
    let alive = true
    setWaStop(false); setAskStop(false)
    Promise.resolve(api.admin.whatsappStopped?.(e.phone)).then((v) => alive && setWaStop(!!v)).catch(() => {})
    return () => { alive = false }
  }, [e.id, e.phone])
  const stopWhatsApp = async () => {
    try {
      await api.admin.stopWhatsApp(e.phone, `Replied STOP · ${new Date().toLocaleDateString('en-IN')}`)
      await api.admin.addNote(e.id, 'The customer replied STOP: no more WhatsApp updates to this number. Call instead.').catch(() => {})
      setWaStop(true); setAskStop(false); loadActivity()
      addToast('No more WhatsApp to this customer', 'success')
    } catch (err) {
      addToast(err?.message || 'Could not save — please try again', 'error')
    }
  }

  // Close with Escape
  useEffect(() => {
    const onKey = (ev) => ev.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const save = async (patch, message) => {
    setSaving(true)
    try {
      let row
      try {
        row = await api.admin.updateEnquiry(e.id, patch)
      } catch (err) {
        // Database not upgraded yet (012 not run): save without the cancel reason
        if (!('cancel_reason' in patch) || !/cancel_reason|column|schema cache|PGRST204/i.test(`${err.code} ${err.message}`)) throw err
        const { cancel_reason: _r, ...rest } = patch
        patch = rest
        row = await api.admin.updateEnquiry(e.id, patch)
      }
      const b = 'assigned_buddy_id' in patch ? buddies.find((x) => x.id === patch.assigned_buddy_id) : e.buddy
      const p = 'assigned_partner_id' in patch ? partners.find((x) => x.id === patch.assigned_partner_id) : e.partner
      const statusFromStage = patch.stage ? { status: STAGE_STATUS[patch.stage] } : {}
      patchLocal('enquiries', {
        ...e, ...statusFromStage, ...row, ...patch,
        buddy: b ? { id: b.id, name: b.name, phone: b.phone } : null,
        partner: p ? { id: p.id, business_name: p.business_name, contact_name: p.contact_name, phone: p.phone, whatsapp: p.whatsapp } : null,
      })
      addToast(message)
      loadActivity()
      if (patch.stage === 'completed' || patch.status === 'completed') {
        setTimeout(() => thanksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250)
      }
    } catch (err) {
      addToast(err.message || 'Could not save', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Thank-you messages once the work is completed (one tap on WhatsApp)
  const thanksRef = useRef(null)
  const sent = thanksSent(activity)
  const markThanked = async (target, name) => {
    try {
      await api.admin.addNote(e.id, THANK_NOTE(target, name))
      loadActivity()
    } catch { /* the message itself was still opened */ }
  }

  const addNote = async () => {
    const text = note.trim()
    if (!text) return
    setSaving(true)
    try {
      await api.admin.addNote(e.id, text, { visibleToCustomer: shareWithCustomer })
      setNote('')
      if (shareWithCustomer) addToast('Update shared with the customer')
      setShareWithCustomer(false)
      loadActivity()
    } catch (err) {
      addToast(err.message || 'Could not add note', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Suggest buddies who offer this service first
  const sortedBuddies = useMemo(() => {
    const active = buddies.filter((b) => b.status !== 'inactive' || b.id === e.assigned_buddy_id)
    const fits = (b) => (b.services || []).includes(e.service)
    return [...active].sort((a, b) => (fits(b) - fits(a)) || (b.tier - a.tier) || a.name.localeCompare(b.name))
  }, [buddies, e.service, e.assigned_buddy_id])

  const assigned = buddies.find((b) => b.id === e.assigned_buddy_id)

  // Suggest partners who handle this item first
  const sortedPartners = useMemo(() => {
    const usable = partners.filter((p) => p.status === 'active' || p.id === e.assigned_partner_id)
    return [...usable].sort((a, b) => (partnerFits(b, e) - partnerFits(a, e)) || a.business_name.localeCompare(b.business_name))
  }, [partners, e])
  const fitCount = sortedPartners.filter((p) => partnerFits(p, e)).length
  const assignedPartner = partners.find((p) => p.id === e.assigned_partner_id) || e.partner
  const currentStage = stageKey(e)
  const stageIndex = STAGES.findIndex((s) => s.key === currentStage)
  const supply = isSupply(e)
  const late = isOverdue(e)
  const dueValue = e.due_at ? new Date(new Date(e.due_at).getTime() + 5.5 * 3600000).toISOString().slice(0, 10) : ''
  const setDue = (v) => {
    if (!v) return save({ due_at: null }, 'Finish-by date removed')
    // Closing time that day, India time
    save({ due_at: new Date(`${v}T${String(WORK.end % 24).padStart(2, '0')}:00:00+05:30`).toISOString() }, 'Finish-by date saved')
  }
  // Cancelling asks why (shown on the Monitor page)
  const [cancelling, setCancelling] = useState(false)
  const [reason, setReason] = useState(CANCEL_REASONS[0])
  // Updates to the customer at each step
  const suggestedStep = updateStepFor(e)
  const [updStep, setUpdStep] = useState(null)
  const step = updStep || suggestedStep
  const sentUpdates = activity.filter((a) => /^Update sent to customer: /.test(a.detail || '')).map((a) => ({ label: a.detail.replace(/^Update sent to customer: /, ''), at: a.created_at }))
  const markUpdate = async (label) => {
    try { await api.admin.addNote(e.id, `Update sent to customer: ${label}`); loadActivity() } catch { /* message was still opened */ }
  }
  const hasWorkflow = partnersReady !== false

  const timeline = [
    { id: 'created', kind: 'created', detail: `Request received via ${sourceLabel(e)}`, created_at: e.created_at },
    // A stage change also changes the status; show it once
    ...activity.filter((a) => !(a.kind === 'status' && activity.some((b) => b.kind === 'stage' && Math.abs(new Date(b.created_at) - new Date(a.created_at)) < 3000))),
  ]

  return (
    <>
      <div className="adm-scrim" onClick={onClose} />
      <aside className="adm-detail" aria-label="Request details">
        <div className="adm-detail-head">
          <div>
            <span className="adm-muted adm-small">{isJob ? 'Part-time job application' : serviceLabel(e.service)}{ref && <> · <strong className="adm-ref" title="Reference number the customer has">{ref}</strong></>}</span>
            <h2>{e.name}</h2>
            <span className="adm-muted adm-small">Received {whenIST(e.created_at)} · {timeAgo(e.created_at)}{isOutOfHours(e) ? ' · 🌙 after hours' : ''}</span>
            {isEmergencyTicket(e) && <span className="adm-tag adm-tag-sos adm-block" style={{ marginTop: 4 }}>🚑 Emergency — call now (customer was told to call 108)</span>}
          </div>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <div className="adm-contact-actions">
          <a className="adm-btn" href={telLink(e.phone)}><Phone size={16} /> Call {showPhone(e.phone)}</a>
          {!waStop && <a className="adm-btn adm-btn-wa" href={whatsappLink(e.phone, customerGreeting(e))} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp</a>}
          {e.email && <a className="adm-btn adm-btn-ghost" href={`mailto:${e.email}`}><Mail size={16} /> Email</a>}
        </div>

        <section className="adm-detail-section">
          <h4>Request</h4>
          <dl className="adm-dl">
            {isJob ? (
              <>
                <dt>Job</dt><dd>{job ? <Link className="adm-link" to={`/admin/jobs?job=${job.id}`}>{job.job_title}</Link> : (e.item || prettify(e.sub_service) || '—')}</dd>
                <dt>Employer</dt><dd>{job ? [job.business_name, job.location, job.pay_per_hour != null ? `₹${job.pay_per_hour}/hr` : ''].filter(Boolean).join(' · ') : <span className="adm-muted">The job post was removed or renamed</span>}</dd>
              </>
            ) : (
              <>
                <dt>Service</dt><dd>{serviceLabel(e.service)}</dd>
                {e.sub_service && (<><dt>Details</dt><dd>{e.item || prettify(e.sub_service)}</dd></>)}
              </>
            )}
            <dt>City</dt><dd>{cityOfRequest(e).name}{e.details?.nearTown ? <span className="adm-muted adm-small"> · {e.details.takenOnCall ? `town: ${e.details.nearTown} (said on the call)` : `near ${e.details.nearTown} (from location)`}</span> : ''}{/^\+/.test(e.phone || '') && !/^\+91/.test(e.phone) ? <span className="adm-tag">🌍 Number from abroad</span> : null}</dd>
            {e.area && (<><dt>Area</dt><dd>{e.area}</dd></>)}
            {e.urgency && (<><dt>When</dt><dd><span className="adm-tag" style={urgencyStyle(e.urgency)}>{e.urgency}</span></dd></>)}
            {e.details?.callAt?.text && (<><dt>Call them</dt><dd><span className="adm-tag adm-tag-call">📞 {e.details.callAt.text}</span><span className="adm-muted adm-small"> — the time the customer picked</span></dd></>)}
            {(papersMissing(e).length > 0 || papersHave(e).length > 0 || papersPrepare(e).length > 0) && (
              <>
                <dt>Papers</dt>
                <dd className="adm-papers">
                  {papersMissing(e).length > 0 && <div><strong className="adm-papers-missing">✗ Needs help with ({papersMissing(e).length}):</strong> {papersMissing(e).join(', ')}</div>}
                  {papersHave(e).length > 0 && <div><span className="adm-papers-have">✓ Has ({papersHave(e).length}):</span> {papersHave(e).join(', ')}</div>}
                  {papersPrepare(e).length > 0 && <div><span className="adm-papers-prepare">📝 We prepare ({papersPrepare(e).length}):</span> {papersPrepare(e).join(', ')}</div>}
                </dd>
              </>
            )}
            {fromPapers(e).length > 0 && (
              <>
                <dt>Read from papers</dt>
                <dd>{fromPapers(e).map((r) => <div key={r.paper}>📄 <strong>{r.paper}</strong> — {(r.labels || []).join(', ')}</div>)}<span className="adm-muted adm-small">Not asked in the app: the Buddy reads these from the papers.</span></dd>
              </>
            )}
            {adviceOnly(e) && (<><dt>Check first</dt><dd><span className="adm-tag adm-tag-advice">❓ Advice call — check if serious</span><span className="adm-muted adm-small"> — the customer answered nothing, only "Not sure"</span></dd></>)}
            <dt>Came from</dt><dd>{sourceLabel(e)}{e.details?.ref ? ` · Ref ${e.details.ref}` : ''}</dd>
            {e.email && (<><dt>Email</dt><dd>{e.email}</dd></>)}
            <dt>Account</dt><dd>{e.user_id ? 'Signed-in customer (sees updates on their dashboard)' : 'Guest (not signed in)'}</dd>
          </dl>
          {Array.isArray(e.details?.answers) && e.details.answers.length > 0 ? (
            <dl className="adm-dl adm-answers">
              {e.details.answers.map((a, i) => (
                <div key={i} className={a.notSure ? 'adm-notsure' : ''} style={{ display: 'contents' }}>
                  <dt>{a.q}</dt>
                  <dd>{a.notSure ? <strong>🤔 Not sure — please advise</strong> : a.a}</dd>
                </div>
              ))}
            </dl>
          ) : (e.message && <p className="adm-message">{e.message}</p>)}
          {/* Details the customer filled in the app (30 Oct 2026) — for the team only */}
          {Array.isArray(e.details?.info) && e.details.info.length > 0 && (
            <div className="adm-details-info">
              <h4 style={{ margin: '0.9rem 0 0.4rem' }}>Customer's details <span className="adm-muted adm-small">(filled in the app · team only — never send these to a Business Partner)</span></h4>
              <dl className="adm-dl adm-answers">
                {e.details.info.map((d, i) => (
                  <div key={i} style={{ display: 'contents' }}>
                    <dt>{d.label}</dt>
                    <dd style={{ whiteSpace: 'pre-line' }}>{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </section>

        {hasWorkflow && isJob ? (
          <section className="adm-detail-section">
            <h4>Hiring steps</h4>
            <div className="adm-stage-picker">
              {JOB_STEPS.map((st, i) => {
                const now = jobStepKey(e)
                const current = st.key === now
                const nowIndex = JOB_STEPS.findIndex((x) => x.key === now)
                const done = !current && i < nowIndex && now !== 'cancelled' && st.key !== 'cancelled'
                return (
                  <button key={st.key} disabled={saving || current} title={st.hint}
                    className={`adm-stage-btn${current ? ' current' : ''}${done ? ' done' : ''}`}
                    style={current ? { color: st.color, background: st.bg, borderColor: st.color } : undefined}
                    onClick={() => save({ stage: st.key, ...(st.key === 'cancelled' ? { cancel_reason: 'Not selected' } : {}) }, `Step: ${st.label}`)}>
                    <span className="adm-step-no"><span>{done ? '✓' : st.key === 'cancelled' ? '✕' : i + 1}</span></span>
                    {st.label}
                  </button>
                )
              })}
            </div>
            <p className="adm-hint">Applicant sees: <strong>{statusInfo(e.status).label}</strong> in My requests.</p>
            <div className="adm-row adm-mt">
              {job?.contact_phone ? (
                <a className="adm-btn adm-btn-wa adm-btn-sm" href={whatsappLink(job.contact_phone, employerMessage(e, job))} target="_blank" rel="noreferrer"
                  onClick={() => { if (['new', 'called'].includes(jobStepKey(e))) save({ stage: 'working' }, 'Step: Sent to employer') }}>
                  <Send size={14} /> Send to {job.business_name || 'employer'} on WhatsApp
                </a>
              ) : (
                <span className="adm-hint" style={{ margin: 0 }}>{job ? 'Add the business phone to this job (Part-time jobs) to send the applicant in one tap.' : ''}</span>
              )}
              {job?.contact_phone && <a className="adm-btn adm-btn-ghost adm-btn-sm" href={telLink(job.contact_phone)}><Phone size={14} /> Call employer</a>}
            </div>
            {['called', 'working', 'completed', 'cancelled'].includes(jobStepKey(e)) && (
              <div className="adm-row adm-mt">
                <a className="adm-btn adm-btn-wa adm-btn-sm" href={whatsappLink(e.phone, applicantMessage(jobStepKey(e), e, job))} target="_blank" rel="noreferrer"
                  onClick={() => markUpdate(`Job: ${JOB_STEPS.find((x) => x.key === jobStepKey(e)).label}`)}>
                  <MessageSquareText size={14} /> Tell the applicant ({JOB_STEPS.find((x) => x.key === jobStepKey(e)).label})
                </a>
              </div>
            )}
          </section>
        ) : hasWorkflow ? (
          <section className="adm-detail-section">
            <h4>Stage {late && <span className="adm-due late" style={{ marginLeft: '0.5rem' }}>⏰ {dueText(e)}</span>}</h4>
            <div className="adm-stage-picker">
              {STAGES.map((st, i) => {
                const current = st.key === currentStage
                const done = !current && i < stageIndex && currentStage !== 'cancelled' && st.key !== 'cancelled'
                return (
                  <button key={st.key} disabled={saving || current} title={st.hint}
                    className={`adm-stage-btn${current ? ' current' : ''}${done ? ' done' : ''}`}
                    style={current ? { color: st.color, background: st.bg, borderColor: st.color } : undefined}
                    onClick={() => (st.key === 'cancelled' ? setCancelling(true) : save({ stage: st.key }, `Stage: ${stageLabel(st.key, supply)}`))}>
                    <span className="adm-step-no"><span>{done ? '✓' : st.key === 'cancelled' ? '✕' : i + 1}</span></span>
                    {stageLabel(st.key, supply)}
                  </button>
                )
              })}
            </div>
            {cancelling && (
              <div className="adm-cancel-box adm-mt">
                <label className="adm-small"><strong>Why is it cancelled?</strong>
                  <select className="adm-select" value={reason} onChange={(ev) => setReason(ev.target.value)}>
                    {CANCEL_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </label>
                <div className="adm-row adm-mt">
                  <button className="adm-btn adm-btn-sm adm-btn-danger" disabled={saving} onClick={() => { save({ stage: 'cancelled', cancel_reason: reason }, 'Cancelled'); setCancelling(false) }}>Cancel the ticket</button>
                  <button className="adm-btn adm-btn-sm adm-btn-ghost" onClick={() => setCancelling(false)}>Keep it open</button>
                </div>
              </div>
            )}
            {e.status === 'cancelled' && e.cancel_reason && <p className="adm-hint">Cancelled because: <strong>{e.cancel_reason}</strong></p>}
            <p className="adm-hint">Customer sees: <strong>{statusInfo(e.status).label}</strong>. Partner names and these steps stay private.</p>
            <div className="adm-inline-form adm-mt">
              <label className="adm-small" htmlFor={`due-${e.id}`}><strong>Finish by</strong></label>
              <input id={`due-${e.id}`} type="date" value={dueValue} disabled={saving} onChange={(ev) => setDue(ev.target.value)} />
              {e.due_at && <span className={`adm-due${late ? ' late' : ''}`}>{dueText(e)}</span>}
            </div>
          </section>
        ) : (
          <section className="adm-detail-section">
            <h4>Status</h4>
            <div className="adm-status-picker">
              {STATUSES.map((s) => (
                <button key={s.key} disabled={saving || e.status === s.key}
                  className={`adm-status-btn${e.status === s.key ? ' current' : ''}`}
                  style={e.status === s.key ? { color: s.color, background: s.bg, borderColor: s.color } : undefined}
                  onClick={() => save({ status: s.key }, `Marked as ${s.label}`)}>
                  {s.label}
                </button>
              ))}
            </div>
            <p className="adm-hint">Run <code>supabase/009_partners_workflow_monitoring.sql</code> to switch on stages, finish-by dates and Business Partners.</p>
          </section>
        )}

        {hasWorkflow && !isJob && stageKey(e) !== 'completed' && (step || sentUpdates.length > 0) && (
          <section className="adm-detail-section adm-update">
            <h4><MessageSquareText size={14} /> Update the customer</h4>
            <div className="adm-inline-form">
              <select className="adm-select" style={{ maxWidth: 260 }} value={step || ''} onChange={(ev) => setUpdStep(ev.target.value)} aria-label="Which update">
                {!step && <option value="">Choose an update…</option>}
                {UPDATE_STEPS.filter((k) => k !== 'completed').map((k) => <option key={k} value={k}>{UPDATE_LABEL[k]}{k === suggestedStep ? ' (now)' : ''}</option>)}
              </select>
              {step && !waStop && (
                <a className="adm-btn adm-btn-wa adm-btn-sm" href={whatsappLink(e.phone, customerUpdate(step, e, { buddy: assigned }))} target="_blank" rel="noreferrer"
                  onClick={() => markUpdate(UPDATE_LABEL[step])}>
                  <Send size={14} /> Send on WhatsApp
                </a>
              )}
            </div>
            {waStop ? (
              <p className="adm-hint adm-warn-text">🚫 This customer replied STOP — no WhatsApp. Call them instead.</p>
            ) : askStop ? (
              <div className="adm-row adm-mt">
                <span className="adm-small">No more WhatsApp to {showPhone(e.phone)}?</span>
                <button type="button" className="adm-btn adm-btn-sm" onClick={stopWhatsApp}>Yes, stop</button>
                <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setAskStop(false)}>No</button>
              </div>
            ) : (
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm adm-mt" onClick={() => setAskStop(true)}>Customer replied STOP</button>
            )}
            {isQuietTime() && <p className="adm-hint adm-warn-text"><Moon size={13} /> It's {istTime(new Date())} in Andhra — people may be resting. Better to send after 8 am.</p>}
            {step && (
              <details className="adm-preview">
                <summary className="adm-small">See the message</summary>
                <pre>{customerUpdate(step, e, { buddy: assigned })}</pre>
              </details>
            )}
            {sentUpdates.length > 0 && (
              <ul className="adm-sent-list">
                {sentUpdates.map((u, i) => <li key={i}><CheckCircle2 size={13} /> {u.label} <span className="adm-muted">· {whenIST(u.at)}</span></li>)}
              </ul>
            )}
          </section>
        )}

        {stageKey(e) === 'completed' && !isJob && (
          <section className="adm-detail-section adm-thanks" ref={thanksRef}>
            <h4><Heart size={14} /> Say thank you</h4>
            <p className="adm-hint" style={{ marginTop: 0 }}>Work completed 🎉 Send each person a thank-you on WhatsApp (English + Telugu). Tap, check the message, press send.</p>
            <ul className="adm-thanks-list">
              {THANK_TARGETS.map((t) => {
                const who = t.key === 'buddy' ? assigned : t.key === 'partner' ? assignedPartner : { name: e.name, phone: e.phone }
                const phone = t.key === 'partner' ? (who?.whatsapp || who?.phone) : who?.phone
                const name = t.key === 'partner' ? who?.business_name : who?.name
                return (
                  <li key={t.key}>
                    <div>
                      <strong>{t.label}</strong>
                      <span className="adm-muted adm-small adm-block">{name || (t.key === 'customer' ? '' : `No ${t.label.toLowerCase()} on this ticket`)}</span>
                    </div>
                    {sent[t.key] ? (
                      <span className="adm-sent"><CheckCircle2 size={15} /> Sent {timeAgo(sent[t.key])}</span>
                    ) : phone ? (
                      <a className="adm-btn adm-btn-wa adm-btn-sm" href={whatsappLink(phone, thankYouMessage(t.key, e, who))} target="_blank" rel="noreferrer"
                        onClick={() => markThanked(t.key, name)}>
                        <Send size={14} /> Send thank-you
                      </a>
                    ) : <span className="adm-muted adm-small">—</span>}
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {hasWorkflow && !isJob && (
          <section className="adm-detail-section">
            <h4>Business Partner</h4>
            {partners.length === 0 ? (
              <p className="adm-muted">No partners yet — add them on the <Link className="adm-link" to="/admin/partners">Business Partners</Link> page.</p>
            ) : (
              <select className="adm-select" value={e.assigned_partner_id || ''} disabled={saving}
                onChange={(ev) => save({ assigned_partner_id: ev.target.value || null }, ev.target.value ? 'Partner linked' : 'Partner removed')}>
                <option value="">No partner yet</option>
                {sortedPartners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {partnerFits(p, e) ? '★ ' : ''}{p.business_name}{p.town ? ` — ${prettify(p.town)}` : ''} · {partnerKindLabel(p.kind)}
                  </option>
                ))}
              </select>
            )}
            {assignedPartner && (
              <div className="adm-row adm-mt">
                <a className="adm-btn adm-btn-wa adm-btn-sm" href={whatsappLink(assignedPartner.whatsapp || assignedPartner.phone, partnerBrief(e))} target="_blank" rel="noreferrer">
                  <Send size={14} /> Ask {assignedPartner.business_name.split(' ').slice(0, 3).join(' ')} on WhatsApp
                </a>
                <a className="adm-btn adm-btn-ghost adm-btn-sm" href={telLink(assignedPartner.phone)}><Phone size={14} /> Call partner</a>
              </div>
            )}
            {partners.length > 0 && (
              <p className="adm-hint">{fitCount ? `★ = handles ${e.item || 'this'} (${fitCount})` : `No partner is marked for “${e.item || prettify(e.sub_service) || serviceLabel(e.service)}” yet.`} To the partner this is iN Empower's own order: the message never includes the customer's name, phone, email or address — only the town. The Local Buddy deals with the partner and receives it at the place; iN Empower pays the partner.</p>
            )}
          </section>
        )}

        {!isJob && <section className="adm-detail-section">
          <h4>Local Buddy</h4>
          {buddies.length === 0 ? (
            <p className="adm-muted">No buddies yet — add your team on the Local Buddies page.</p>
          ) : (
            <select className="adm-select" value={e.assigned_buddy_id || ''} disabled={saving}
              onChange={(ev) => save({ assigned_buddy_id: ev.target.value || null }, ev.target.value ? 'Buddy assigned' : 'Buddy removed')}>
              <option value="">Not assigned</option>
              {sortedBuddies.map((b) => (
                <option key={b.id} value={b.id}>
                  {(b.services || []).includes(e.service) ? '★ ' : ''}{b.name}{b.town ? ` — ${prettify(b.town)}` : ''} · {TIERS[b.tier]?.label.split(' —')[0]}
                </option>
              ))}
            </select>
          )}
          {assigned && <VisitPlan e={e} saving={saving} onSave={(visit) => save({ details: { ...(e.details || {}), visit } }, visit ? 'Meeting time & place saved' : 'Meeting time & place cleared')} />}
          {assigned && (
            <div className="adm-row adm-mt">
              <a className="adm-btn adm-btn-wa adm-btn-sm" href={whatsappLink(assigned.phone, buddyBrief(e))} target="_blank" rel="noreferrer">
                <Send size={14} /> Send job to {assigned.name.split(' ')[0]} on WhatsApp
              </a>
              <a className="adm-btn adm-btn-ghost adm-btn-sm" href={telLink(assigned.phone)}><Phone size={14} /> Call buddy</a>
            </div>
          )}
          {buddies.length > 0 && <p className="adm-muted adm-small adm-mt">★ = offers this service</p>}
          {/* Owner, 3 Nov 2026: customer numbers stay with the team */}
          {assigned && <p className="adm-hint">The Buddy never gets the customer's number. Call the customer, agree the time and place, save it above, then send the job.</p>}
        </section>}

        <section className="adm-detail-section">
          <h4>Notes & history</h4>
          <div className="adm-note-box">
            <textarea rows={2}
              placeholder={shareWithCustomer ? 'Write an update for the customer (they will see this on their dashboard)…' : "Add a private note for the team (customer can't see this)…"}
              value={note} onChange={(ev) => setNote(ev.target.value)}
              onKeyDown={(ev) => { if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) addNote() }} />
            <div className="adm-note-actions">
              <label className={`adm-share${e.user_id ? '' : ' disabled'}`} title={e.user_id ? '' : 'Only signed-in customers can see updates'}>
                <input type="checkbox" checked={shareWithCustomer} disabled={!e.user_id} onChange={(ev) => setShareWithCustomer(ev.target.checked)} />
                Show to customer
              </label>
              <button className="adm-btn adm-btn-sm" onClick={addNote} disabled={saving || !note.trim()}>{shareWithCustomer ? 'Send update' : 'Add note'}</button>
            </div>
          </div>
          <ol className="adm-timeline">
            {[...timeline].reverse().map((a) => (
              <li key={a.id} className={`kind-${a.kind}`}>
                <span className="adm-tl-icon">
                  {a.kind === 'note' ? <StickyNote size={14} /> : a.kind === 'update' ? <Send size={14} /> : a.kind === 'assignment' ? <UserCheck size={14} /> : a.kind === 'status' ? <ArrowLeftRight size={14} /> : a.kind === 'stage' ? <Layers size={14} /> : a.kind === 'partner' ? <Handshake size={14} /> : a.kind === 'due' ? <CalendarClock size={14} /> : <Clock size={14} />}
                </span>
                <div>
                  <p>{a.kind === 'update' && <span className="adm-tag adm-tag-share">Shared with customer</span>}{a.kind === 'status' ? formatStatusChange(a.detail) : a.kind === 'stage' ? formatStageChange(a.detail, supply, isJob) : a.detail}</p>
                  <span className="adm-muted adm-small" title={timeAgo(a.created_at)}>{a.actor_name ? `${a.actor_name} · ` : ''}{whenIST(a.created_at)}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </aside>
    </>
  )
}

function formatStageChange(detail, supply, isJob) {
  const [from, to] = String(detail).split(' → ')
  if (to && isJob) {
    const job = (k) => (JOB_STEPS.find((x) => x.key === jobStepKey({ stage: k })) || JOB_STEPS[0]).label
    return `Step: ${job(from)} → ${job(to)}`
  }
  return to ? `Stage: ${stageLabel(from, supply)} → ${stageLabel(to, supply)}` : detail
}

function formatStatusChange(detail) {
  const [from, to] = String(detail).split(' → ')
  return to ? `Status: ${statusInfo(from).label} → ${statusInfo(to).label}` : detail
}


/* ── Helpers for tidy step-by-step requests ── */
const URGENCY_ORDER = ['Today', 'This week', 'This month', 'Just checking']
function urgencyRank(e) {
  const i = URGENCY_ORDER.indexOf(e.urgency)
  return i === -1 ? 2.5 : i // unknown sits between "This month" and "Just checking"
}
function urgencyStyle(u) {
  if (u === 'Today') return { color: '#B91C1C', background: '#FEE2E2' }
  if (u === 'This week') return { color: '#C2410C', background: '#FFF0E5' }
  return undefined
}
function itemOf(e) { return e.item || prettify(e.sub_service) || '' }
function areaOf(e) { return e.area || '' }
function sourceLabel(e) {
  const where = e.source === 'app' ? 'App' : 'Website'
  if (e.channel === 'phone') return `Phone call${e.details?.takenBy ? ` · taken by ${e.details.takenBy}` : ''}`
  const how = e.channel === 'chat' ? 'Chat Buddy' : e.channel === 'page' ? 'service page' : 'form'
  return `${where} · ${how}`
}

/** "Meeting with the customer": the team calls the customer, agrees a time and place, and the Buddy gets it in the job message. */
function VisitPlan({ e, saving, onSave }) {
  const [text, setText] = useState(e.details?.visit || '')
  useEffect(() => { setText(e.details?.visit || '') }, [e.id, e.details?.visit])
  const changed = text.trim() !== String(e.details?.visit || '').trim()
  return (
    <div className="adm-mt">
      <label className="adm-small" htmlFor={`visit-${e.id}`}><b>Meeting with the customer (time & place)</b></label>
      <div className="adm-row">
        <input id={`visit-${e.id}`} className="adm-select" style={{ flex: 1, minWidth: 0 }} value={text} maxLength={200}
          placeholder="e.g. Tue 4 Nov, 11 am at the MRO office, Chimakurthy" onChange={(ev) => setText(ev.target.value)} />
        <button type="button" className="adm-btn adm-btn-sm" disabled={saving || !changed} onClick={() => onSave(text.trim())}>Save</button>
      </div>
    </div>
  )
}
