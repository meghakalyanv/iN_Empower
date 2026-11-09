import { useEffect, useMemo, useState } from 'react'
import { useOutletContext, Link, useSearchParams } from 'react-router-dom'
import { Plus, Search, Phone, MessageCircle, X, Download } from 'lucide-react'
import { api } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { prakasamLocations } from '../../data/prakasamLocations'
import { supplyCategories } from '../../data/suppliesData'
import servicesData from '../../data/servicesData'
import {
  PARTNER_KINDS, partnerKindLabel, SERVICE_LABELS, prettify, telLink, whatsappLink, matchesSearch,
  isOpen, isOverdue, stageInfo, timeAgo, serviceLabel,
} from './adminShared'

const EMPTY = {
  business_name: '', contact_name: '', phone: '', whatsapp: '', email: '', kind: 'supply', items: [],
  town: 'ongole', areas: '', address: '', gst_number: '', commission_terms: '', status: 'active', notes: '',
}

// Everything a partner can handle: every supply, then services grouped by category
const itemGroups = () => {
  const groups = [{ key: 'supplies', label: 'Supplies', items: supplyCategories.map((c) => c.title) }]
  const byCat = {}
  servicesData.forEach((s) => {
    if (s.category === 'supplies') return
    ;(byCat[s.category] = byCat[s.category] || []).push(s.title)
  })
  Object.entries(byCat).forEach(([cat, items]) => groups.push({ key: cat, label: SERVICE_LABELS[cat] || prettify(cat), items }))
  return groups
}
// Applications from "Join as a Business Partner" (website and app, supabase/014) start their notes like this
const appliedOnline = (p) => /^Applied (in the app|on the website)/.test(p?.notes || '')

const KIND_FIRST = { supply: ['supplies'], medical: ['healthcare'], professional: ['drivers', 'electricity', 'painting', 'pest-control', 'ac-services', 'photography', 'pujari', 'architecture', 'interior', 'loans', 'exim', 'logistics'], government: ['identity', 'mro', 'rto', 'municipal', 'collector', 'startup', 'revenue', 'court'] }

export default function AdminPartners() {
  const { partners, partnersReady, enquiries, patchLocal } = useOutletContext()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const [kindFilter, setKindFilter] = useState('')
  const [editing, setEditing] = useState(null)
  // Opened from the search box: /admin/partners?id=…
  const [params, setParams] = useSearchParams()
  const wanted = params.get('id')
  useEffect(() => {
    if (!wanted) return
    const found = partners.find((x) => String(x.id) === wanted)
    if (found) { setEditing(found); setParams({}, { replace: true }) }
  }, [wanted, partners])

  const load = useMemo(() => {
    const m = {}
    enquiries.forEach((e) => {
      if (!e.assigned_partner_id) return
      const x = (m[e.assigned_partner_id] = m[e.assigned_partner_id] || { open: 0, done: 0, late: 0 })
      if (isOpen(e)) x.open++
      if (e.status === 'completed') x.done++
      if (isOverdue(e)) x.late++
    })
    return m
  }, [enquiries])

  const pendingCount = partners.filter((p) => p.status === 'pending').length
  const list = partners.filter((p) =>
    (statusFilter === 'all' || p.status === statusFilter) &&
    (!kindFilter || p.kind === kindFilter) &&
    matchesSearch({ name: p.business_name, phone: p.phone, message: [p.ref, p.contact_name, p.town, p.areas, p.gst_number, ...(p.items || [])].join(' ') }, query))

  const exportCsv = () => {
    const cols = ['Ref', 'Business', 'Contact person', 'Phone', 'WhatsApp', 'Email', 'Type', 'Handles', 'Town', 'Areas', 'GST', 'Our charges', 'Status', 'Open tickets', 'Completed']
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const lines = [cols.join(',')].concat(list.map((p) => [p.ref, p.business_name, p.contact_name, p.phone, p.whatsapp, p.email, partnerKindLabel(p.kind), (p.items || []).join('; '), prettify(p.town), p.areas, p.gst_number, p.commission_terms, p.status, load[p.id]?.open || 0, load[p.id]?.done || 0].map(esc).join(',')))
    const url = URL.createObjectURL(new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a'); a.href = url; a.download = `inempower-partners-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  if (!partnersReady) {
    return (
      <div className="adm-page">
        <header className="adm-page-head"><div><h1>Business Partners</h1></div></header>
        <div className="adm-card">
          <h3 style={{ marginTop: 0 }}>One step needed in Supabase</h3>
          <p>Open Supabase → SQL Editor → New query, paste everything from <code>supabase/009_partners_workflow_monitoring.sql</code> and press <strong>Run</strong>. Then press Refresh here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Business Partners</h1>
          <p className="adm-muted">Suppliers, professionals and hospitals who fulfil your customers' requests. Link them to a ticket from the Requests page.</p>
        </div>
        <div className="adm-row">
          <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={exportCsv} disabled={!list.length}><Download size={15} /> Export</button>
          <button className="adm-btn" onClick={() => setEditing(EMPTY)}><Plus size={16} /> Add partner</button>
        </div>
      </header>

      {pendingCount > 0 && statusFilter !== 'pending' && (
        <button className="adm-card adm-row" style={{ width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: '1rem' }} onClick={() => setStatusFilter('pending')}>
          🕓 <strong>{pendingCount} waiting for your check</strong> — new partner applications and partners not approved yet. Tap to see, call them, then Approve or Decline.
        </button>
      )}

      <div className="adm-filters">
        <label className="adm-search">
          <Search size={16} />
          <input type="search" placeholder="Search business, person, phone, item (e.g. Granite), BP- number…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <select value={kindFilter} onChange={(e) => setKindFilter(e.target.value)} aria-label="Type">
          <option value="">All types</option>
          {PARTNER_KINDS.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Status">
          <option value="active">Active</option>
          <option value="pending">Being checked ({pendingCount})</option>
          <option value="inactive">Inactive</option>
          <option value="all">All</option>
        </select>
      </div>

      {list.length === 0 ? (
        <div className="adm-card adm-empty">
          {partners.length === 0 ? 'No Business Partners yet. Click “Add partner” to add your first supplier or service provider.' : 'No partners match.'}
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Business</th><th>Type</th><th>Handles</th><th>Area</th><th>Tickets</th><th></th></tr></thead>
            <tbody>
              {list.map((p) => {
                const l = load[p.id] || {}
                return (
                  <tr key={p.id} onClick={() => setEditing(p)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setEditing(p)}>
                    <td data-label="Business">
                      <strong>{p.business_name}</strong>
                      {p.status === 'pending' && appliedOnline(p) && <span className="adm-tag" style={{ marginLeft: 6 }}>Applied online</span>}
                      <span className="adm-muted adm-block">{[p.contact_name, p.phone, p.ref].filter(Boolean).join(' · ')}</span>
                    </td>
                    <td data-label="Type">{partnerKindLabel(p.kind)}</td>
                    <td data-label="Handles">
                      <div className="adm-tag-row">
                        {(p.items || []).slice(0, 4).map((s) => <span key={s} className="adm-tag">{s}</span>)}
                        {(p.items || []).length > 4 && <span className="adm-tag">+{p.items.length - 4}</span>}
                        {!(p.items || []).length && <span className="adm-muted">—</span>}
                      </div>
                    </td>
                    <td data-label="Area">{prettify(p.town) || '—'}{p.areas && <span className="adm-muted adm-block">{p.areas}</span>}</td>
                    <td data-label="Tickets">
                      {l.open || l.done ? (
                        <Link onClick={(e) => e.stopPropagation()} to={`/admin/requests?partner=${p.id}&status=all`} className="adm-link">
                          {l.open || 0} open · {l.done || 0} done{l.late ? ` · ${l.late} late` : ''}
                        </Link>
                      ) : <span className="adm-muted">None yet</span>}
                    </td>
                    <td className="adm-actions" onClick={(e) => e.stopPropagation()}>
                      <a className="adm-icon-btn" href={telLink(p.phone)} aria-label={`Call ${p.business_name}`}><Phone size={16} /></a>
                      <a className="adm-icon-btn" href={whatsappLink(p.whatsapp || p.phone)} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${p.business_name}`}><MessageCircle size={16} /></a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <PartnerForm
          key={editing.id || 'new'}
          partner={editing}
          tickets={editing.id ? enquiries.filter((e) => e.assigned_partner_id === editing.id) : []}
          onClose={() => setEditing(null)}
          onSaved={(row) => { patchLocal('partners', row); setEditing(null) }}
        />
      )}
    </div>
  )
}

function PartnerForm({ partner, tickets, onClose, onSaved }) {
  const { addToast } = useToast()
  const [form, setForm] = useState({ ...EMPTY, ...partner, items: partner.items || [] })
  const [extra, setExtra] = useState('')
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const toggleItem = (i) => set('items', form.items.includes(i) ? form.items.filter((x) => x !== i) : [...form.items, i])

  const ITEM_GROUPS = useMemo(() => itemGroups(), [])
  const known = useMemo(() => new Set(ITEM_GROUPS.flatMap((g) => g.items)), [ITEM_GROUPS])
  const custom = form.items.filter((i) => !known.has(i))
  const groups = useMemo(() => {
    const first = KIND_FIRST[form.kind] || []
    return [...ITEM_GROUPS].sort((a, b) => (first.includes(b.key) - first.includes(a.key)))
  }, [form.kind, ITEM_GROUPS])

  const addExtra = () => {
    const parts = extra.split(',').map((x) => x.trim()).filter(Boolean)
    if (!parts.length) return
    set('items', [...new Set([...form.items, ...parts])])
    setExtra('')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.business_name.trim() || form.phone.replace(/\D/g, '').length < 10) {
      addToast('Please enter the business name and a 10-digit phone number', 'error')
      return
    }
    setSaving(true)
    try {
      const clean = {}
      Object.keys(EMPTY).forEach((k) => { clean[k] = typeof form[k] === 'string' ? form[k].trim() || null : form[k] })
      clean.business_name = form.business_name.trim()
      clean.phone = form.phone.trim()
      if (partner.id) clean.id = partner.id
      const row = await api.admin.savePartner(clean)
      addToast(partner.id ? 'Partner updated' : 'Partner added')
      onSaved(row || { ...partner, ...clean })
    } catch (err) {
      addToast(err.message || 'Could not save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const kindHint = PARTNER_KINDS.find((k) => k.key === form.kind)?.hint
  const openTickets = tickets.filter(isOpen)

  // An application (or a partner being checked): approve or decline in one tap
  const decide = async (status) => {
    setSaving(true)
    try {
      const terms = (form.commission_terms || '').trim() || null
      const row = await api.admin.savePartner({ id: partner.id, status, commission_terms: terms })
      addToast(status === 'active' ? `${partner.business_name} approved — can take requests now` : `${partner.business_name} declined`)
      onSaved(row || { ...partner, status, commission_terms: terms })
    } catch (err) {
      addToast(err.message || 'Could not save', 'error')
    } finally {
      setSaving(false)
    }
  }
  const towns = prakasamLocations.map((t) => t.name)

  return (
    <>
      <div className="adm-scrim" onClick={onClose} />
      <aside className="adm-detail" aria-label={partner.id ? 'Edit partner' : 'Add partner'}>
        <div className="adm-detail-head">
          <div>
            {partner.ref && <span className="adm-muted adm-small">{partner.ref}</span>}
            <h2>{partner.id ? partner.business_name : 'Add a Business Partner'}</h2>
          </div>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        {partner.id && (
          <div className="adm-contact-actions">
            <a className="adm-btn" href={telLink(partner.phone)}><Phone size={16} /> Call {partner.phone}</a>
            <a className="adm-btn adm-btn-wa" href={whatsappLink(partner.whatsapp || partner.phone)} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp</a>
          </div>
        )}

        {partner.id && partner.status === 'pending' && (
          <section className="adm-detail-section" style={{ background: '#FFF7E6', borderRadius: 12, padding: '0.85rem' }}>
            <h4 style={{ marginTop: 0 }}>{appliedOnline(partner) ? 'Partner application' : 'Being checked'}</h4>
            {appliedOnline(partner) && <p className="adm-muted adm-small" style={{ whiteSpace: 'pre-line' }}>{partner.notes}</p>}
            <p className="adm-small">Call them, check the business and agree the terms (write them in “Our charges / agreement” below). Then:</p>
            <div className="adm-row">
              <button className="adm-btn" type="button" onClick={() => decide('active')} disabled={saving}>✓ Approve — can take requests</button>
              <button className="adm-btn adm-btn-ghost" type="button" onClick={() => decide('inactive')} disabled={saving}>Decline</button>
            </div>
            <p className="adm-hint">Approving does not message them — call or WhatsApp to welcome them.</p>
          </section>
        )}

        {partner.id && (
          <section className="adm-detail-section">
            <h4>Tickets with this partner</h4>
            {tickets.length === 0 ? <p className="adm-muted">None yet.</p> : (
              <>
                <p className="adm-muted adm-small">{openTickets.length} open · {tickets.filter((t) => t.status === 'completed').length} completed · {tickets.length} total</p>
                <ul className="adm-list">
                  {tickets.slice(0, 8).map((t) => {
                    const s = stageInfo(t)
                    return (
                      <li key={t.id}>
                        <Link to={`/admin/requests?id=${t.id}&status=all`} className="adm-list-row">
                          <div><strong>{t.name}</strong><span className="adm-muted">{t.item || serviceLabel(t.service)}</span></div>
                          <div className="adm-list-right">
                            <span className="adm-pill" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                            <span className="adm-muted adm-small">{timeAgo(t.created_at)}</span>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </section>
        )}

        <form className="adm-form" onSubmit={submit}>
          <label>Business name *<input value={form.business_name} onChange={(e) => set('business_name', e.target.value)} placeholder="e.g. Sri Sai Granites" required /></label>
          <div className="adm-form-row">
            <label>Contact person<input value={form.contact_name || ''} onChange={(e) => set('contact_name', e.target.value)} /></label>
            <label>Mobile *<input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="98765 43210" required /></label>
          </div>
          <div className="adm-form-row">
            <label>WhatsApp (if different)<input type="tel" value={form.whatsapp || ''} onChange={(e) => set('whatsapp', e.target.value)} /></label>
            <label>Email<input type="email" value={form.email || ''} onChange={(e) => set('email', e.target.value)} /></label>
          </div>
          <label>Type of partner
            <select value={form.kind} onChange={(e) => set('kind', e.target.value)}>
              {PARTNER_KINDS.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
            </select>
            {kindHint && <span className="adm-hint">{kindHint}</span>}
          </label>
          <fieldset>
            <legend>What they handle ({form.items.length} picked)</legend>
            <div className="adm-item-pick">
              {groups.map((g) => (
                <div key={g.key}>
                  <h5>{g.label}</h5>
                  <div className="adm-check-grid">
                    {g.items.map((i) => (
                      <label key={i} className="adm-check"><input type="checkbox" checked={form.items.includes(i)} onChange={() => toggleItem(i)} /> {i}</label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {custom.length > 0 && (
              <div className="adm-tag-row adm-mt">
                {custom.map((c) => <button type="button" key={c} className="adm-tag" onClick={() => toggleItem(c)} title="Remove">{c} ✕</button>)}
              </div>
            )}
            <div className="adm-inline-form adm-mt">
              <input value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Something else? e.g. Black Galaxy slabs, Wall putty" style={{ flex: 1, minWidth: 200 }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExtra() } }} />
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={addExtra}>Add</button>
            </div>
          </fieldset>
          <div className="adm-form-row">
            <label>Town
              <select value={form.town || ''} onChange={(e) => set('town', e.target.value)}>
                {prakasamLocations.map((t) => <option key={t.name} value={t.name}>{prettify(t.name)}</option>)}
                {/* A town typed in an application (or another city's town) */}
                {form.town && form.town !== 'other' && !towns.includes(form.town) && <option value={form.town}>{prettify(form.town)}</option>}
                <option value="other">Other</option>
              </select>
            </label>
            <label>Areas they serve<input value={form.areas || ''} onChange={(e) => set('areas', e.target.value)} placeholder="e.g. Ongole, Chimakurthy, Addanki" /></label>
          </div>
          <div className="adm-form-row">
            <label>Shop / office address<input value={form.address || ''} onChange={(e) => set('address', e.target.value)} /></label>
            <label>GST number<input value={form.gst_number || ''} onChange={(e) => set('gst_number', e.target.value.toUpperCase())} placeholder="Optional" /></label>
          </div>
          <label>Our charges / agreement
            <textarea rows={2} value={form.commission_terms || ''} onChange={(e) => set('commission_terms', e.target.value)}
              placeholder={form.kind === 'supply' ? 'e.g. Partner pays us ₹5 per sq.ft on every order we bring' : 'e.g. ₹200 from customer + 10% from partner per job'} />
            <span className="adm-hint">Only you see this. Customers and partners never see it here.</span>
          </label>
          <label>Status
            <select value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="active">Active — can take requests</option>
              <option value="pending">Being checked — not sending work yet</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label>Private notes<textarea rows={3} value={form.notes || ''} onChange={(e) => set('notes', e.target.value)} placeholder="Quality, rates, delivery time, documents checked on…" /></label>
          <div className="adm-row">
            <button className="adm-btn" type="submit" disabled={saving}>{saving ? 'Saving…' : partner.id ? 'Save changes' : 'Add partner'}</button>
            <button className="adm-btn adm-btn-ghost" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </aside>
    </>
  )
}
