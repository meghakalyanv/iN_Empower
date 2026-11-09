import { useEffect, useMemo, useState } from 'react'
import { useOutletContext, Link, useSearchParams } from 'react-router-dom'
import { Plus, Search, Phone, MessageCircle, X } from 'lucide-react'
import { api } from '../../services/api'
import { istFull } from '../../data/workHours'
import { useToast } from '../../context/ToastContext'
import { prakasamLocations } from '../../data/prakasamLocations'
import { SERVICE_LABELS, TIERS, OPEN_STATUSES, prettify, telLink, whatsappLink, matchesSearch } from './adminShared'

const EMPTY = { name: '', phone: '', email: '', town: 'ongole', areas: '', services: [], tier: 0, status: 'active', notes: '' }

export default function AdminBuddies() {
  const { buddies, enquiries, patchLocal } = useOutletContext()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const [editing, setEditing] = useState(null)
  // Opened from the search box: /admin/buddies?id=…
  const [params, setParams] = useSearchParams()
  const wanted = params.get('id')
  useEffect(() => {
    if (!wanted) return
    const found = buddies.find((x) => String(x.id) === wanted)
    if (found) { setEditing(found); setParams({}, { replace: true }) }
  }, [wanted, buddies])

  const openLoad = useMemo(() => {
    const m = {}
    enquiries.forEach((e) => {
      if (e.assigned_buddy_id && OPEN_STATUSES.includes(e.status)) m[e.assigned_buddy_id] = (m[e.assigned_buddy_id] || 0) + 1
    })
    return m
  }, [enquiries])

  const pendingCount = buddies.filter((b) => b.status === 'pending').length
  const list = buddies.filter((b) => (statusFilter === 'all' || b.status === statusFilter) &&
    matchesSearch({ name: b.name, phone: b.phone, message: [b.ref, b.town, b.areas, ...(b.services || []).map((s) => SERVICE_LABELS[s] || s)].join(' ') }, query))

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Local Buddies</h1>
          <p className="adm-muted">Your verified field team. Assign them to requests from the Requests page.</p>
        </div>
        <button className="adm-btn" onClick={() => setEditing(EMPTY)}><Plus size={16} /> Add buddy</button>
      </header>

      {pendingCount > 0 && statusFilter !== 'pending' && (
        <button className="adm-card adm-row" style={{ width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: '1rem' }} onClick={() => setStatusFilter('pending')}>
          🆕 <strong>{pendingCount} new Local Buddy application{pendingCount > 1 ? 's' : ''}</strong> — tap to review and call them.
        </button>
      )}

      <div className="adm-filters">
        <label className="adm-search">
          <Search size={16} />
          <input type="search" placeholder="Search name, phone, town, skill, BD- number…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Status">
          <option value="active">Active</option>
          <option value="pending">New applications / pending ({pendingCount})</option>
          <option value="inactive">Inactive</option>
          <option value="all">All</option>
        </select>
      </div>

      {list.length === 0 ? (
        <div className="adm-card adm-empty">
          {buddies.length === 0 ? 'No Local Buddies yet. Click “Add buddy” to add your first team member.' : 'No buddies match.'}
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Area</th><th>Services</th><th>Verification</th><th>Open jobs</th><th></th></tr></thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id} onClick={() => setEditing(b)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setEditing(b)}>
                  <td data-label="Name"><strong>{b.name}</strong><span className="adm-muted adm-block">{b.phone}{b.ref ? ` · ${b.ref}` : ''}</span></td>
                  <td data-label="Area">{prettify(b.town) || '—'}{b.areas && <span className="adm-muted adm-block">{b.areas}</span>}</td>
                  <td data-label="Services">
                    <div className="adm-tag-row">
                      {(b.services || []).slice(0, 4).map((s) => <span key={s} className="adm-tag">{SERVICE_LABELS[s] || s}</span>)}
                      {(b.services || []).length > 4 && <span className="adm-tag">+{b.services.length - 4}</span>}
                    </div>
                  </td>
                  <td data-label="Verification"><span className={`adm-tier tier-${b.tier}`}>{b.tier ? `Tier ${b.tier}` : 'Not verified'}</span></td>
                  <td data-label="Open jobs">
                    {openLoad[b.id] ? <Link onClick={(e) => e.stopPropagation()} to={`/admin/requests?buddy=${b.id}`} className="adm-link">{openLoad[b.id]}</Link> : <span className="adm-muted">0</span>}
                  </td>
                  <td className="adm-actions" onClick={(e) => e.stopPropagation()}>
                    <a className="adm-icon-btn" href={telLink(b.phone)} aria-label={`Call ${b.name}`}><Phone size={16} /></a>
                    <a className="adm-icon-btn" href={whatsappLink(b.phone)} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${b.name}`}><MessageCircle size={16} /></a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && <BuddyForm buddy={editing} onClose={() => setEditing(null)} onSaved={(row) => { patchLocal('buddies', row); setEditing(null) }} />}
    </div>
  )
}

function BuddyForm({ buddy, onClose, onSaved }) {
  const { addToast } = useToast()
  const [form, setForm] = useState({ ...EMPTY, ...buddy, services: buddy.services || [] })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const toggleService = (s) => set('services', form.services.includes(s) ? form.services.filter((x) => x !== s) : [...form.services, s])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || form.phone.replace(/\D/g, '').length < 10) {
      addToast('Please enter a name and a 10-digit phone number', 'error')
      return
    }
    setSaving(true)
    try {
      const { buddy: _ignored, ...clean } = form
      const row = await api.admin.saveBuddy({ ...clean, name: clean.name.trim(), phone: clean.phone.trim(), tier: Number(clean.tier), email: clean.email || null })
      addToast(buddy.id ? 'Buddy updated' : 'Buddy added')
      onSaved(row)
    } catch (err) {
      addToast(err.message || 'Could not save', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="adm-scrim" onClick={onClose} />
      <aside className="adm-detail" aria-label={buddy.id ? 'Edit buddy' : 'Add buddy'}>
        <div className="adm-detail-head">
          <h2>{buddy.id ? `Edit ${buddy.name}` : 'Add a Local Buddy'}</h2>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        {Array.isArray(buddy.details?.answers) && buddy.details.answers.length > 0 && (
          <section className="adm-card" style={{ margin: '0 0 1rem' }}>
            <h3 style={{ margin: '0 0 0.25rem' }}>Application{buddy.ref ? ` · ${buddy.ref}` : ''}</h3>
            <p className="adm-muted" style={{ margin: 0 }}>Applied {buddy.created_at ? istFull(buddy.created_at) : ''}. Call them, meet them, check ID (Tier 1), then set Verification and Status below.</p>
            {buddy.details.address && <p style={{ margin: '0.5rem 0 0' }}><strong>Address:</strong> {buddy.details.address}</p>}
            <dl className="adm-dl adm-answers">
              {buddy.details.answers.filter((a) => a.q !== 'Your home address').map((a, i) => (
                <div key={i} className={a.notSure ? 'adm-notsure' : ''} style={{ display: 'contents' }}>
                  <dt>{a.q}</dt>
                  <dd>{a.notSure ? <strong>🤔 Not sure</strong> : a.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        <form className="adm-form" onSubmit={submit}>
          <label>Full name *<input value={form.name} onChange={(e) => set('name', e.target.value)} required /></label>
          <div className="adm-form-row">
            <label>Mobile *<input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="98765 43210" required /></label>
            <label>Email<input type="email" value={form.email || ''} onChange={(e) => set('email', e.target.value)} /></label>
          </div>
          <div className="adm-form-row">
            <label>Town
              <select value={form.town || ''} onChange={(e) => set('town', e.target.value)}>
                {prakasamLocations.map((t) => <option key={t.name} value={t.name}>{prettify(t.name)}</option>)}
                <option value="other">Other</option>
              </select>
            </label>
            <label>Areas covered<input value={form.areas || ''} onChange={(e) => set('areas', e.target.value)} placeholder="e.g. Gandhi Road, Santhapet" /></label>
          </div>
          <fieldset>
            <legend>Services they can handle</legend>
            <div className="adm-check-grid">
              {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                <label key={key} className="adm-check">
                  <input type="checkbox" checked={form.services.includes(key)} onChange={() => toggleService(key)} /> {label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="adm-form-row">
            <label>Verification
              <select value={form.tier} onChange={(e) => set('tier', Number(e.target.value))}>
                {TIERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
            <label>Status
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="active">Active — can take requests</option>
                <option value="pending">Pending — still onboarding</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
          <label>Private notes<textarea rows={3} value={form.notes || ''} onChange={(e) => set('notes', e.target.value)} placeholder="ID checked on…, languages, vehicle, availability…" /></label>
          <div className="adm-row">
            <button className="adm-btn" type="submit" disabled={saving}>{saving ? 'Saving…' : buddy.id ? 'Save changes' : 'Add buddy'}</button>
            <button className="adm-btn adm-btn-ghost" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </aside>
    </>
  )
}
