import { useEffect, useMemo, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { Check, X, Archive, MapPin, IndianRupee, Plus, Trash2, CalendarClock, Phone, MessageCircle, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { api } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { prakasamLocations } from '../../data/prakasamLocations'
import { JOB_STATUSES, jobStatusInfo, timeAgo, fullDate, prettify, telLink, whatsappLink, isJobApplication, jobFor, jobStepInfo, whenIST } from './adminShared'
import { showPhone } from '../../data/phone'
import { RequestDetail } from './AdminRequests'

const todayIST = () => new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10)
const isPastClose = (j) => j.closes_on && j.closes_on < todayIST()
const EMPTY = { job_title: '', business_name: '', location: 'Ongole', pay_per_hour: '', description: '', closes_on: '', contact_phone: '' }

export default function AdminJobs() {
  const { jobs, enquiries, patchLocal, reload } = useOutletContext()
  const { addToast } = useToast()
  const [params, setParams] = useSearchParams()
  const [tab, setTab] = useState(params.get('job') ? null : 'approved')
  const [openJobs, setOpenJobs] = useState(() => new Set(params.get('job') ? [params.get('job')] : []))

  // Applications for part-time jobs (they come in as requests with service "part-time")
  const applicants = useMemo(() => enquiries.filter(isJobApplication).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), [enquiries])
  const byJob = useMemo(() => {
    const m = {}
    applicants.forEach((e) => { const j = jobFor(e, jobs); const k = j ? j.id : 'none'; (m[k] = m[k] || []).push(e) })
    return m
  }, [applicants, jobs])
  const newApplicants = applicants.filter((e) => e.status === 'new').length
  const openApplicant = applicants.find((e) => e.id === params.get('applicant'))
  const showApplicant = (id) => { const n = new URLSearchParams(params); if (id) n.set('applicant', id); else n.delete('applicant'); setParams(n) }
  const toggleJob = (id) => setOpenJobs((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  // Opened from the search box: show that job's tab and its applicants
  useEffect(() => {
    const id = params.get('job') || (openApplicant && jobFor(openApplicant, jobs)?.id)
    const j = jobs.find((x) => String(x.id) === String(id))
    if (j) { setTab(j.status === 'approved' && isPastClose(j) ? 'closed' : j.status); setOpenJobs((s) => new Set([...s, j.id])) }
    else if (openApplicant) setTab('applicants')
  }, [params.get('job'), params.get('applicant'), jobs.length])
  const [busy, setBusy] = useState(null)
  const [posting, setPosting] = useState(false)

  // A live job past its closing date counts as closed
  const shown = (j) => (j.status === 'approved' && isPastClose(j) ? 'closed' : j.status)
  const counts = useMemo(() => {
    const c = {}
    jobs.forEach((j) => { const s = shown(j); c[s] = (c[s] || 0) + 1 })
    return c
  }, [jobs])
  const list = jobs.filter((j) => shown(j) === tab)
  const tabs = [JOB_STATUSES[1], JOB_STATUSES[0], JOB_STATUSES[3], JOB_STATUSES[2]] // Live, Waiting, Closed, Rejected
  counts.applicants = applicants.length

  const update = async (job, patch, msg) => {
    setBusy(job.id)
    try {
      const row = await api.admin.updateJobPost(job.id, patch)
      patchLocal('jobs', { ...job, ...row, ...patch })
      addToast(msg)
    } catch (err) {
      addToast(err.message || 'Could not save', 'error')
    } finally {
      setBusy(null)
    }
  }
  const remove = async (job) => {
    if (!window.confirm(`Delete "${job.job_title}" completely?`)) return
    setBusy(job.id)
    try {
      await api.admin.deleteJobPost(job.id)
      addToast('Job deleted')
      reload()
    } catch (err) {
      addToast(err.message || 'Could not delete', 'error')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Part-time jobs</h1>
          <p className="adm-muted">Post jobs yourself, or check jobs posted by local businesses before they go live. Applicants are listed under each job. Jobs close on their closing date.</p>
        </div>
        <button className="adm-btn" onClick={() => setPosting(true)}><Plus size={16} /> Post a job</button>
      </header>

      <div className="adm-chips" role="tablist">
        {tabs.map((s) => (
          <button key={s.key} role="tab" aria-selected={tab === s.key} className={`adm-chip${tab === s.key ? ' active' : ''}`} onClick={() => setTab(s.key)}>
            {s.label} <em>{counts[s.key] || 0}</em>
          </button>
        ))}
        <button role="tab" aria-selected={tab === 'applicants'} className={`adm-chip${tab === 'applicants' ? ' active' : ''}`} onClick={() => setTab('applicants')}>
          <Users size={14} /> All applicants <em>{applicants.length}</em>{newApplicants > 0 && <em className="adm-badge" style={{ marginLeft: 4 }}>{newApplicants} new</em>}
        </button>
      </div>

      {tab === 'applicants' ? (
        applicants.length === 0
          ? <div className="adm-card adm-empty">No applications yet.</div>
          : <div className="adm-card"><ApplicantList list={applicants} jobs={jobs} showJob onOpen={showApplicant} /></div>
      ) : list.length === 0 ? (
        <div className="adm-card adm-empty">{tab === 'pending' ? 'Nothing waiting for review. 🎉' : tab === 'approved' ? 'No live jobs. Click “Post a job” to add one.' : 'No jobs here.'}</div>
      ) : (
        <div className="adm-cards">
          {list.map((j) => {
            const s = jobStatusInfo(shown(j))
            return (
              <article key={j.id} className="adm-card adm-job">
                <div className="adm-card-head">
                  <div>
                    <h3>{j.job_title}</h3>
                    <span className="adm-muted">{j.business_name}{j.posted_by_team ? ' · posted by you' : ''}</span>
                  </div>
                  <span className="adm-pill" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                </div>
                <div className="adm-job-meta">
                  <span><MapPin size={14} /> {j.location}</span>
                  {j.pay_per_hour != null && <span><IndianRupee size={14} /> {j.pay_per_hour}/hr</span>}
                  {j.contact_phone && <a href={telLink(j.contact_phone)} className="adm-link"><Phone size={14} /> {j.contact_phone}</a>}
                  <span className="adm-muted" title={fullDate(j.created_at)}>Posted {timeAgo(j.created_at)}</span>
                </div>
                {j.description && <p className="adm-message">{j.description}</p>}
                {(() => {
                  const apps = byJob[j.id] || []
                  const fresh = apps.filter((e) => e.status === 'new').length
                  const open = openJobs.has(j.id)
                  return (
                    <div className="adm-applicants">
                      <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => toggleJob(j.id)} disabled={!apps.length} aria-expanded={open}>
                        <Users size={15} /> {apps.length ? `${apps.length} applicant${apps.length > 1 ? 's' : ''}` : 'No applicants yet'}
                        {fresh > 0 && <em className="adm-badge" style={{ marginLeft: 4 }}>{fresh} new</em>}
                        {apps.length > 0 && (open ? <ChevronUp size={15} /> : <ChevronDown size={15} />)}
                      </button>
                      {open && apps.length > 0 && <ApplicantList list={apps} jobs={jobs} onOpen={showApplicant} />}
                    </div>
                  )
                })()}
                <div className="adm-inline-form">
                  <label className="adm-small" htmlFor={`close-${j.id}`}><CalendarClock size={14} /> Closes on</label>
                  <input id={`close-${j.id}`} type="date" value={j.closes_on || ''} disabled={busy === j.id}
                    onChange={(e) => update(j, { closes_on: e.target.value || null }, e.target.value ? 'Closing date saved' : 'Closing date removed')} />
                </div>
                <div className="adm-row adm-mt">
                  {j.status !== 'approved' && (
                    <button className="adm-btn adm-btn-sm adm-btn-green" disabled={busy === j.id} onClick={() => update(j, { status: 'approved' }, 'Job is live')}>
                      <Check size={15} /> {j.status === 'pending' ? 'Approve' : 'Make live again'}
                    </button>
                  )}
                  {j.status === 'pending' && (
                    <button className="adm-btn adm-btn-sm adm-btn-danger" disabled={busy === j.id} onClick={() => update(j, { status: 'rejected' }, 'Job rejected')}>
                      <X size={15} /> Reject
                    </button>
                  )}
                  {j.status === 'approved' && !isPastClose(j) && (
                    <button className="adm-btn adm-btn-sm adm-btn-ghost" disabled={busy === j.id} onClick={() => update(j, { status: 'closed' }, 'Job closed')}>
                      <Archive size={15} /> Close (position filled)
                    </button>
                  )}
                  <button className="adm-btn adm-btn-sm adm-btn-ghost" disabled={busy === j.id} onClick={() => remove(j)} style={{ marginLeft: 'auto' }}>
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {openApplicant && <RequestDetail key={openApplicant.id} enquiry={openApplicant} onClose={() => showApplicant('')} />}

      {posting && <PostJob onClose={() => setPosting(false)} onPosted={(row) => { patchLocal('jobs', row); setPosting(false); setTab('approved') }} />}
    </div>
  )
}

/** Applicants: name, number, step — tap one to open it (steps, send to employer, notes) */
function ApplicantList({ list, jobs, onOpen, showJob = false }) {
  return (
    <ul className="adm-list adm-applicant-list">
      {list.map((e) => {
        const s = jobStepInfo(e)
        const job = showJob ? jobFor(e, jobs) : null
        return (
          <li key={e.id}>
            <div className="adm-list-row" role="button" tabIndex={0} onClick={() => onOpen(e.id)} onKeyDown={(ev) => ev.key === 'Enter' && onOpen(e.id)}>
              <div>
                <strong>{e.name}</strong>
                <span className="adm-muted">{showPhone(e.phone)}{e.details?.ref ? ` · ${e.details.ref}` : ''}{showJob ? ` · ${job ? job.job_title : (e.item || prettify(e.sub_service) || 'Job')}` : ''}</span>
              </div>
              <div className="adm-list-right">
                <span className="adm-pill" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                <span className="adm-muted adm-small" title={whenIST(e.created_at)}>{timeAgo(e.created_at)}</span>
                <a className="adm-icon-btn" href={telLink(e.phone)} onClick={(ev) => ev.stopPropagation()} aria-label={`Call ${e.name}`}><Phone size={15} /></a>
                <a className="adm-icon-btn" href={whatsappLink(e.phone)} target="_blank" rel="noreferrer" onClick={(ev) => ev.stopPropagation()} aria-label={`WhatsApp ${e.name}`}><MessageCircle size={15} /></a>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function PostJob({ onClose, onPosted }) {
  const { addToast } = useToast()
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const submit = async (e) => {
    e.preventDefault()
    if (!form.job_title.trim() || !form.business_name.trim() || !form.location.trim()) {
      addToast('Please fill the job title, business and place', 'error')
      return
    }
    setSaving(true)
    try {
      const row = await api.admin.postJobAsTeam({
        job_title: form.job_title.trim(),
        business_name: form.business_name.trim(),
        location: form.location.trim(),
        pay_per_hour: form.pay_per_hour === '' ? null : Number(form.pay_per_hour),
        description: form.description.trim() || null,
        closes_on: form.closes_on || null,
        contact_phone: form.contact_phone.trim() || null,
      })
      addToast('Job posted — it is live now')
      onPosted(row || { ...form, id: Math.random().toString(36), status: 'approved', created_at: new Date().toISOString() })
    } catch (err) {
      addToast(err.message || 'Could not post the job', 'error')
    } finally {
      setSaving(false)
    }
  }
  return (
    <>
      <div className="adm-scrim" onClick={onClose} />
      <aside className="adm-detail" aria-label="Post a job">
        <div className="adm-detail-head">
          <h2>Post a part-time job</h2>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <form className="adm-form" onSubmit={submit}>
          <label>Job title *<input value={form.job_title} onChange={(e) => set('job_title', e.target.value)} placeholder="e.g. Shop assistant (evenings)" required /></label>
          <label>Business *<input value={form.business_name} onChange={(e) => set('business_name', e.target.value)} placeholder="e.g. Sri Lakshmi Textiles" required /></label>
          <div className="adm-form-row">
            <label>Place *
              <input list="job-towns" value={form.location} onChange={(e) => set('location', e.target.value)} required />
              <datalist id="job-towns">{prakasamLocations.map((t) => <option key={t.name} value={prettify(t.name)} />)}</datalist>
            </label>
            <label>Pay (₹ per hour)<input type="number" min="0" value={form.pay_per_hour} onChange={(e) => set('pay_per_hour', e.target.value)} /></label>
          </div>
          <label>What the work is<textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Timings, who can apply, what they will do…" /></label>
          <div className="adm-form-row">
            <label>Closes on<input type="date" min={todayIST()} value={form.closes_on} onChange={(e) => set('closes_on', e.target.value)} /></label>
            <label>Business phone (not shown to customers)<input type="tel" value={form.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} /></label>
          </div>
          <p className="adm-hint">Applications come to you here, under this job. After you call an applicant, send their name and number to the business in one tap — add the business phone above for that.</p>
          <div className="adm-row">
            <button className="adm-btn" type="submit" disabled={saving}>{saving ? 'Posting…' : 'Post job'}</button>
            <button className="adm-btn adm-btn-ghost" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </aside>
    </>
  )
}
