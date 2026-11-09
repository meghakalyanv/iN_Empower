import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, X, Eye, EyeOff, Trash2, CheckCircle2, MapPin, Upload, ImageOff } from 'lucide-react'
import { api } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { timeAgo } from './adminShared'
import {
  LISTING_PURPOSES, LISTING_TYPES, LISTING_STATUSES, LISTING_CHECKS, propertyTowns, listingTypeLabel, listingPurposeLabel,
} from '../../data/propertyData'

const STATUS_STYLE = {
  live: { color: '#0F6B06', bg: '#E7F3E6' },
  hidden: { color: '#C2410C', bg: '#FFF0E5' },
  sold: { color: '#1D4ED8', bg: '#E0EAFF' },
  removed: { color: '#475569', bg: '#F1F5F9' },
}
const EMPTY = {
  title: '', purpose: 'sale', type: 'plot', location: '', area: '', price: '', facing: '',
  description: '', highlights: [], photos: [], checks: [], status: 'hidden', sort_order: 0,
}

/**
 * Property listings shown in Explore → Property & Real Estate (website + app).
 * The team adds a listing (it starts Hidden), checks it, then makes it Live.
 * "Remove" keeps the row for our records but takes it off the website and app.
 */
export default function AdminProperties() {
  const { properties = [], patchLocal } = useOutletContext()
  const { addToast } = useToast()
  const [tab, setTab] = useState('live')
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(null)

  const counts = useMemo(() => {
    const c = {}
    properties.forEach((p) => { c[p.status] = (c[p.status] || 0) + 1 })
    return c
  }, [properties])
  const list = properties.filter((p) => p.status === tab)

  const setStatus = async (p, status, msg) => {
    if (status === 'live' && !(p.checks || []).includes('title')) {
      if (!window.confirm('The title check is not ticked for this property. Make it live anyway?')) return
    }
    setBusy(p.id)
    try {
      const row = await api.admin.saveProperty({ id: p.id, status })
      patchLocal('properties', { ...p, ...row, status })
      addToast(msg)
    } catch (err) {
      addToast(err.message || 'Could not save', 'error')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Properties</h1>
          <p className="adm-muted">Listings in Explore → Property &amp; Real Estate on the website and app. New ones start Hidden — check them, then make them Live.</p>
        </div>
        <button className="adm-btn" onClick={() => setEditing({ ...EMPTY })}><Plus size={16} /> Add property</button>
      </header>

      <div className="adm-chips" role="tablist">
        {LISTING_STATUSES.map((s) => (
          <button key={s.key} role="tab" aria-selected={tab === s.key} className={`adm-chip${tab === s.key ? ' active' : ''}`} onClick={() => setTab(s.key)}>
            {s.label} <em>{counts[s.key] || 0}</em>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="adm-card adm-empty">
          {tab === 'live' ? 'No live properties. Customers see a “Tell us what you want” card instead.' : 'Nothing here.'}
        </div>
      ) : (
        <div className="adm-cards">
          {list.map((p) => {
            const st = STATUS_STYLE[p.status] || STATUS_STYLE.hidden
            return (
              <article key={p.id} className="adm-card adm-job">
                <div className="adm-card-head">
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {p.photos?.[0]
                      ? <img loading="lazy" decoding="async" src={p.photos[0]} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 10 }} />
                      : <div style={{ width: 64, height: 64, borderRadius: 10, background: '#F1F5F9', display: 'grid', placeItems: 'center' }}><ImageOff size={20} color="#94A3B8" /></div>}
                    <div>
                      <h3>{p.title}</h3>
                      <span className="adm-muted">{listingPurposeLabel(p.purpose)} · {listingTypeLabel(p.type)}</span>
                    </div>
                  </div>
                  <span className="adm-pill" style={{ color: st.color, background: st.bg }}>{LISTING_STATUSES.find((s) => s.key === p.status)?.label}</span>
                </div>
                <div className="adm-job-meta">
                  {p.location && <span><MapPin size={14} /> {p.location}</span>}
                  {p.area && <span>{p.area}</span>}
                  {p.price && <span><strong>{p.price}</strong></span>}
                  <span className="adm-muted">Added {timeAgo(p.created_at)}</span>
                </div>
                <div className="adm-tag-row">
                  {LISTING_CHECKS.map((c) => (
                    <span key={c.key} className="adm-tag" style={{ opacity: (p.checks || []).includes(c.key) ? 1 : 0.45 }}>
                      {(p.checks || []).includes(c.key) ? '✓ ' : '✗ '}{c.label}
                    </span>
                  ))}
                </div>
                <div className="adm-row">
                  <button className="adm-btn adm-btn-sm adm-btn-ghost" onClick={() => setEditing(p)}>Edit</button>
                  {p.status !== 'live' && p.status !== 'removed' && (
                    <button className="adm-btn adm-btn-sm adm-btn-green" disabled={busy === p.id} onClick={() => setStatus(p, 'live', 'Now live on the website and app')}>
                      <Eye size={15} /> Make live
                    </button>
                  )}
                  {p.status === 'live' && (
                    <>
                      <button className="adm-btn adm-btn-sm adm-btn-ghost" disabled={busy === p.id} onClick={() => setStatus(p, 'hidden', 'Hidden')}>
                        <EyeOff size={15} /> Hide
                      </button>
                      <button className="adm-btn adm-btn-sm adm-btn-ghost" disabled={busy === p.id} onClick={() => setStatus(p, 'sold', 'Marked sold / rented')}>
                        <CheckCircle2 size={15} /> {p.purpose === 'rent' ? 'Rented' : 'Sold'}
                      </button>
                    </>
                  )}
                  {p.status === 'removed' ? (
                    <button className="adm-btn adm-btn-sm adm-btn-ghost" disabled={busy === p.id} onClick={() => setStatus(p, 'hidden', 'Restored as hidden')}>Restore</button>
                  ) : (
                    <button className="adm-btn adm-btn-sm adm-btn-danger" disabled={busy === p.id} onClick={() => setStatus(p, 'removed', 'Removed from website and app')}>
                      <Trash2 size={15} /> Remove
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {editing && (
        <PropertyForm
          listing={editing}
          onClose={() => setEditing(null)}
          onSaved={(row) => { patchLocal('properties', row); setEditing(null); setTab(row.status) }}
        />
      )}
    </div>
  )
}

function PropertyForm({ listing, onClose, onSaved }) {
  const { addToast } = useToast()
  const [form, setForm] = useState({ ...EMPTY, ...listing, highlights: listing.highlights || [], photos: listing.photos || [], checks: listing.checks || [] })
  const [highlightsText, setHighlightsText] = useState((listing.highlights || []).join('\n'))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const toggleCheck = (k) => set('checks', form.checks.includes(k) ? form.checks.filter((x) => x !== k) : [...form.checks, k])

  const addPhotos = async (files) => {
    const list = [...files].filter((f) => f.type.startsWith('image/'))
    if (!list.length) return
    if (list.some((f) => f.size > 5 * 1024 * 1024)) {
      addToast('Each photo must be under 5 MB', 'error')
      return
    }
    setUploading(true)
    try {
      const urls = []
      for (const f of list) urls.push(await api.admin.uploadPropertyPhoto(f))
      setForm((f) => ({ ...f, photos: [...f.photos, ...urls].slice(0, 10) }))
    } catch (err) {
      addToast(err.message || 'Could not upload the photo', 'error')
    } finally {
      setUploading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      addToast('Please give the property a title', 'error')
      return
    }
    setSaving(true)
    try {
      const highlights = highlightsText.split('\n').map((x) => x.trim()).filter(Boolean)
      const row = await api.admin.saveProperty({ ...form, title: form.title.trim(), highlights, sort_order: Number(form.sort_order) || 0 })
      addToast(listing.id ? 'Property updated' : 'Property added (hidden until you make it live)')
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
      <aside className="adm-detail" aria-label={listing.id ? 'Edit property' : 'Add property'}>
        <div className="adm-detail-head">
          <h2>{listing.id ? 'Edit property' : 'Add a property'}</h2>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <form className="adm-form" onSubmit={submit}>
          <label>Title *<input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. East-facing plot near Mangamoor Road" required /></label>
          <div className="adm-form-row">
            <label>For
              <select value={form.purpose} onChange={(e) => set('purpose', e.target.value)}>
                {LISTING_PURPOSES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </label>
            <label>Type
              <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                {LISTING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
          </div>
          <div className="adm-form-row">
            <label>Location
              <input list="prop-towns" value={form.location || ''} onChange={(e) => set('location', e.target.value)} placeholder="Town — area" />
              <datalist id="prop-towns">{propertyTowns.map((t) => <option key={t} value={t} />)}</datalist>
            </label>
            <label>Size<input value={form.area || ''} onChange={(e) => set('area', e.target.value)} placeholder="200 sq.yds / 2.5 acres / 3 BHK · 1,450 sq.ft" /></label>
          </div>
          <div className="adm-form-row">
            <label>Price (as customers should see it)<input value={form.price || ''} onChange={(e) => set('price', e.target.value)} placeholder="₹32 lakh / ₹12,000 a month / Ask us" /></label>
            <label>Facing<input value={form.facing || ''} onChange={(e) => set('facing', e.target.value)} placeholder="East" /></label>
          </div>
          <label>Description<textarea rows={3} value={form.description || ''} onChange={(e) => set('description', e.target.value)} placeholder="Road width, nearby places, water, approvals…" /></label>
          <label>Highlights (one per line)<textarea rows={3} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} placeholder={'30 ft road\nOUDA approved layout\n2 km from bus stand'} /></label>

          <fieldset>
            <legend>Photos ({form.photos.length}/10)</legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {form.photos.map((url, i) => (
                <div key={url + i} style={{ position: 'relative' }}>
                  <img loading="lazy" decoding="async" src={url} alt="" style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 10 }} />
                  <button type="button" className="adm-icon-btn" style={{ position: 'absolute', top: 2, right: 2, background: '#fff' }} aria-label="Remove photo"
                    onClick={() => set('photos', form.photos.filter((_, j) => j !== i))}><X size={14} /></button>
                </div>
              ))}
              {form.photos.length < 10 && (
                <label className="adm-btn adm-btn-ghost" style={{ width: 84, height: 84, flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}>
                  <Upload size={18} />{uploading ? '…' : 'Add'}
                  <input type="file" accept="image/*" multiple hidden onChange={(e) => { addPhotos(e.target.files); e.target.value = '' }} />
                </label>
              )}
            </div>
            <p className="adm-muted adm-small">The first photo is the cover. Under 5 MB each.</p>
          </fieldset>

          <fieldset>
            <legend>Checks done by our team (shown to customers)</legend>
            <div className="adm-check-grid">
              {LISTING_CHECKS.map((c) => (
                <label key={c.key} className="adm-check">
                  <input type="checkbox" checked={form.checks.includes(c.key)} onChange={() => toggleCheck(c.key)} /> {c.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="adm-form-row">
            <label>Status
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                {LISTING_STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </label>
            <label>Order (smaller shows first)<input type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} /></label>
          </div>
          <div className="adm-row">
            <button className="adm-btn" type="submit" disabled={saving || uploading}>{saving ? 'Saving…' : listing.id ? 'Save changes' : 'Add property'}</button>
            <button className="adm-btn adm-btn-ghost" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </aside>
    </>
  )
}
