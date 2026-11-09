import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Phone, MessageCircle, Download, ArrowUp, ArrowDown, Eye, EyeOff, Users, XCircle } from 'lucide-react'
import { api } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import CatalogEditor from './CatalogEditor'
import { adminList, orderIds, statusBadge, slug } from './catalogShared'
import { workshopFee, workshopSeatsInfo } from '../../data/catalog'
import { telLink, whatsappLink, timeAgo, fullDate, stageInfo } from './adminShared'

/** Registrations for one workshop (enquiries with service 'workshop'). */
const registrationsFor = (enquiries, w) => enquiries.filter((e) => e.service === 'workshop' && (
  e.details?.workshopId != null ? String(e.details.workshopId) === String(w.id) : (e.item || e.sub_service) === w.item.title
))

export default function AdminWorkshops() {
  const { catalogRows, catalogReady, saveCatalogRow, removeCatalogRow, enquiries, patchLocal } = useOutletContext()
  const { addToast } = useToast()
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(null)

  const all = useMemo(() => adminList('workshop', catalogRows), [catalogRows])
  const regs = useMemo(() => Object.fromEntries(all.map((w) => [w.id, registrationsFor(enquiries, w)])), [all, enquiries])
  const active = (list) => list.filter((e) => e.status !== 'cancelled')

  const save = async (entry, { data, te, status }) => {
    const id = entry.row || !entry.isNew ? entry.id : uniqueId(slug(data.title), all.map((x) => x.id))
    try {
      await saveCatalogRow({ kind: 'workshop', item_id: id, data: { ...data, id }, te, status })
      addToast(status === 'live' ? 'Saved — customers see it now' : 'Saved (hidden from customers)')
      setEditing(null)
    } catch (err) {
      addToast(err.message || 'Could not save', 'error')
    }
  }
  const toggle = async (e) => {
    setBusy(e.id)
    try {
      await saveCatalogRow({ kind: 'workshop', item_id: e.id, data: { ...e.item, id: e.id }, te: e.row?.te || {}, status: e.status === 'live' ? 'hidden' : 'live' })
    } catch (err) {
      addToast(err.message || 'Could not save', 'error')
    } finally {
      setBusy(null)
    }
  }
  const move = async (e, dir) => {
    const ids = orderIds('workshop', catalogRows)
    const a = ids.indexOf(e.id); const b = a + dir
    if (a === -1 || b < 0 || b >= ids.length) return
    ;[ids[a], ids[b]] = [ids[b], ids[a]]
    try { await saveCatalogRow({ kind: 'order', item_id: 'workshop', data: { ids }, te: {}, status: 'live' }) } catch (err) { addToast(err.message || 'Could not save the order', 'error') }
  }
  const reset = async (entry) => {
    if (!window.confirm(entry.isNew ? `Delete "${entry.item.title}"? Registrations stay in Requests.` : `Undo all your changes to "${entry.item.title}"?`)) return
    try { await removeCatalogRow('workshop', entry.id); setEditing(null); addToast('Done') } catch (err) { addToast(err.message || 'Could not do that', 'error') }
  }
  const cancelReg = async (r) => {
    if (!window.confirm(`Cancel ${r.name}'s registration? Their seat becomes free.`)) return
    try {
      const row = await api.admin.updateEnquiry(r.id, { stage: 'cancelled' })
      patchLocal('enquiries', { ...r, ...row, stage: 'cancelled', status: 'cancelled' })
      addToast('Registration cancelled')
    } catch (err) {
      addToast(err.message || 'Could not cancel', 'error')
    }
  }
  const exportCsv = (w) => {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const rows = [['Registered', 'Name', 'Phone', 'Email', 'Status'].join(',')].concat(regs[w.id].map((r) => [fullDate(r.created_at), r.name, r.phone, r.email, stageInfo(r).label].map(esc).join(',')))
    const url = URL.createObjectURL(new Blob(['﻿' + rows.join('\n')], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a'); a.href = url; a.download = `workshop-${w.id}-registrations.csv`; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  if (!catalogReady) {
    return (
      <div className="adm-page">
        <header className="adm-page-head"><div><h1>Workshops</h1></div></header>
        <div className="adm-card"><p>Run <code>supabase/010_catalog_workshops_jobs.sql</code> in Supabase → SQL Editor first, then press Refresh.</p></div>
      </div>
    )
  }

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Workshops</h1>
          <p className="adm-muted">Dates, venue, seats and fee. Registration closes automatically when the seats are full.</p>
        </div>
        <button className="adm-btn" onClick={() => setEditing({ id: '', isNew: true, status: 'hidden', row: null, item: { title: '', icon: '🎓', tagline: '', date: '', location: '', seats: 30, fee: 0, description: '', points: [] } })}>
          <Plus size={16} /> Add workshop
        </button>
      </header>

      {all.length === 0 ? <div className="adm-card adm-empty">No workshops yet.</div> : (
        <div className="adm-cards">
          {all.map((w, i) => {
            const taken = active(regs[w.id] || []).length
            const seat = workshopSeatsInfo(w.item, taken)
            const b = statusBadge(w)
            return (
              <article key={w.id} className="adm-card adm-job" onClick={() => setEditing(w)} style={{ cursor: 'pointer' }}>
                {w.item.photo && <img loading="lazy" decoding="async" src={w.item.photo} alt="" className="adm-card-photo" />}
                <div className="adm-card-head">
                  <div>
                    <h3>{w.item.icon} {w.item.title}</h3>
                    <span className="adm-muted">{[w.item.date, w.item.location].filter(Boolean).join(' · ')}</span>
                  </div>
                  <span className="adm-pill" style={{ color: b.color, background: b.bg }}>{b.label}</span>
                </div>
                <div className="adm-job-meta">
                  <span><Users size={14} /> {taken} registered{seat.limited ? ` of ${w.item.seats}` : ''}</span>
                  <span>{workshopFee(w.item)}</span>
                  {seat.limited && <span style={{ color: seat.full ? '#B91C1C' : '#0F6B06', fontWeight: 600 }}>{seat.text}</span>}
                </div>
                <div className="adm-row" onClick={(ev) => ev.stopPropagation()}>
                  <button className="adm-btn adm-btn-sm" onClick={() => setEditing(w)}>Edit & registrations</button>
                  <button className="adm-icon-btn" disabled={busy === w.id} onClick={() => toggle(w)} title={w.status === 'live' ? 'Hide' : 'Make live'} aria-label={w.status === 'live' ? 'Hide' : 'Make live'}>{w.status === 'live' ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  <button className="adm-icon-btn" disabled={i === 0} onClick={() => move(w, -1)} aria-label="Move up"><ArrowUp size={16} /></button>
                  <button className="adm-icon-btn" disabled={i === all.length - 1} onClick={() => move(w, 1)} aria-label="Move down"><ArrowDown size={16} /></button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {editing && (
        <CatalogEditor
          key={editing.id || 'new'}
          kind="workshop"
          entry={editing}
          onClose={() => setEditing(null)}
          onSave={(v) => save(editing, v)}
          onReset={() => reset(editing)}
          extra={editing.id && (
            <section className="adm-detail-section">
              <div className="adm-card-head">
                <h4 style={{ margin: 0 }}>Registrations ({active(regs[editing.id] || []).length}{editing.item.seats ? ` of ${editing.item.seats}` : ''})</h4>
                {(regs[editing.id] || []).length > 0 && <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => exportCsv(editing)}><Download size={14} /> Export</button>}
              </div>
              {(regs[editing.id] || []).length === 0 ? <p className="adm-muted">No one has registered yet.</p> : (
                <ul className="adm-reg-list">
                  {regs[editing.id].map((r) => {
                    const cancelled = r.status === 'cancelled'
                    return (
                      <li key={r.id} className={cancelled ? 'cancelled' : ''}>
                        <div>
                          <strong>{r.name}</strong> <span className="adm-muted">{r.phone}</span>
                          <span className="adm-muted adm-small adm-block" title={fullDate(r.created_at)}>{cancelled ? 'Cancelled · ' : ''}registered {timeAgo(r.created_at)}</span>
                        </div>
                        <div className="adm-row">
                          <a className="adm-icon-btn" href={telLink(r.phone)} aria-label={`Call ${r.name}`}><Phone size={16} /></a>
                          <a className="adm-icon-btn" href={whatsappLink(r.phone, `Namaste ${(r.name || '').split(' ')[0]}, this is iN Empower about the ${editing.item.title} workshop${editing.item.date ? ` on ${editing.item.date}` : ''}${editing.item.location ? ` at ${editing.item.location}` : ''}. `)} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${r.name}`}><MessageCircle size={16} /></a>
                          {!cancelled && <button className="adm-icon-btn" onClick={() => cancelReg(r)} aria-label="Cancel registration" title="Cancel registration"><XCircle size={16} /></button>}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          )}
        />
      )}
    </div>
  )
}

function uniqueId(base, taken) {
  let id = base; let n = 2
  while (taken.includes(id)) id = `${base}-${n++}`
  return id
}
