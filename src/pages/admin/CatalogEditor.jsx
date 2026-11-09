import { useMemo, useRef, useState } from 'react'
import { X, Plus, ArrowUp, ArrowDown, Trash2, Upload, ImageOff, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { api } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { textLines, builtInTe } from '../../data/catalog'
import { JOB_SERVICES } from '../../data/serviceLayout'
import { KIND_LABEL, SECTION_TYPES, lines, sectionType } from './catalogShared'
import { SERVICE_LABELS, prettify } from './adminShared'
import KalamkariIcon from '../../components/KalamkariIcon'

/**
 * Drawer to edit one service, supply or workshop.
 * entry: { id, item, row, isNew, status } (from adminList) — or { isNew: true, item: {...} } for a new one.
 * onSave({ data, te, status }) and onReset() are given by the page.
 */
export default function CatalogEditor({ kind, entry, categories = [], icons = [], onClose, onSave, onReset, extra }) {
  const { addToast } = useToast()
  const [draft, setDraft] = useState(() => toDraft(kind, entry.item))
  const [status, setStatus] = useState(entry.status || 'hidden')
  const [te, setTe] = useState(() => ({ ...(entry.row?.te || {}) }))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }))

  const isJobs = kind === 'service' && JOB_SERVICES.includes(entry.id)
  const data = useMemo(() => fromDraft(kind, draft, entry.item), [kind, draft, entry.item])
  const teLines = useMemo(() => textLines(kind, data), [kind, data])
  const teValue = (line) => te[line] ?? builtInTe(line) ?? ''
  const missingTe = teLines.filter((l) => !teValue(l)).length

  const upload = async (file) => {
    if (!file) return
    if (!/^image\//.test(file.type)) { addToast('Please choose a photo (JPG or PNG)', 'error'); return }
    if (file.size > 5 * 1024 * 1024) { addToast('Photo is too big — please use one under 5 MB', 'error'); return }
    setUploading(true)
    try {
      set('photo', await api.admin.uploadCatalogPhoto(file))
    } catch (err) {
      addToast(err.message || 'Could not upload the photo', 'error')
    } finally {
      setUploading(false)
    }
  }

  const save = async (e) => {
    e.preventDefault()
    if (!draft.title?.trim()) { addToast('Please give it a title', 'error'); return }
    if (kind === 'service' && !draft.category) { addToast('Please choose a category', 'error'); return }
    // Keep only Telugu that differs from the built-in Telugu, for lines still in use
    const cleanTe = {}
    teLines.forEach((l) => { const v = (te[l] || '').trim(); if (v && v !== builtInTe(l)) cleanTe[l] = v })
    setSaving(true)
    try {
      await onSave({ data, te: cleanTe, status })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="adm-scrim" onClick={onClose} />
      <aside className="adm-detail adm-detail-wide" aria-label={`Edit ${KIND_LABEL[kind]}`}>
        <div className="adm-detail-head">
          <div>
            <span className="adm-muted adm-small">{entry.isNew && !entry.row ? `New ${KIND_LABEL[kind].toLowerCase()}` : `${KIND_LABEL[kind]} · ${entry.id}`}</span>
            <h2>{draft.title || `New ${KIND_LABEL[kind].toLowerCase()}`}</h2>
          </div>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        {extra}

        <form className="adm-form" onSubmit={save}>
          <div className="adm-seg-row">
            <span className="adm-small"><strong>Customers see it?</strong></span>
            <div className="adm-seg" role="group" aria-label="Status">
              <button type="button" className={status === 'live' ? 'active' : ''} aria-pressed={status === 'live'} onClick={() => setStatus('live')}><Eye size={14} /> Live</button>
              <button type="button" className={status === 'hidden' ? 'active' : ''} aria-pressed={status === 'hidden'} onClick={() => setStatus('hidden')}><EyeOff size={14} /> Hidden</button>
            </div>
          </div>

          <label>Title *<input value={draft.title || ''} onChange={(e) => set('title', e.target.value)} required /></label>

          {kind === 'service' && (
            <>
              <label>Short line under the title<input value={draft.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} /></label>
              <label>Category
                <select value={draft.category || ''} onChange={(e) => set('category', e.target.value)}>
                  <option value="">Choose…</option>
                  {categories.map((c) => <option key={c} value={c}>{SERVICE_LABELS[c] || prettify(c)}</option>)}
                </select>
              </label>
              <IconPicker value={draft.icon} icons={icons} color={draft.iconColor} onChange={(v) => set('icon', v)} />
            </>
          )}

          {kind === 'supply' && (
            <>
              <IconPicker value={draft.icon} icons={icons} color={draft.iconColor} onChange={(v) => set('icon', v)} note="Shown on the website. The app shows the supply's picture (or the photo below)." />
              <label>Short line under the title<input value={draft.tagline || ''} onChange={(e) => set('tagline', e.target.value)} /></label>
              <label>Description<textarea rows={4} value={draft.description || ''} onChange={(e) => set('description', e.target.value)} /></label>
              <div className="adm-form-row">
                <label>Who it's for (one per line)<textarea rows={4} value={draft.beneficiaries} onChange={(e) => set('beneficiaries', e.target.value)} /></label>
                <label>Highlights (one per line)<textarea rows={4} value={draft.highlights} onChange={(e) => set('highlights', e.target.value)} /></label>
              </div>
            </>
          )}

          {kind === 'workshop' && (
            <>
              <div className="adm-form-row">
                <label>Icon (emoji)<input value={draft.icon || ''} onChange={(e) => set('icon', e.target.value)} placeholder="🌱" maxLength={4} /></label>
                <label>Short line<input value={draft.tagline || ''} onChange={(e) => set('tagline', e.target.value)} placeholder="Yield more with less" /></label>
              </div>
              <div className="adm-form-row">
                <label>Date & time (as customers see it)<input value={draft.date || ''} onChange={(e) => set('date', e.target.value)} placeholder="Sat 15 Nov, 10 am – 1 pm" /></label>
                <label>Venue<input value={draft.location || ''} onChange={(e) => set('location', e.target.value)} placeholder="Ongole — community hall" /></label>
              </div>
              <div className="adm-form-row">
                <label>Seats (empty = no limit)<input type="number" min="0" value={draft.seats ?? ''} onChange={(e) => set('seats', e.target.value)} placeholder="e.g. 30" /></label>
                <label>Fee in ₹ (0 = Free)<input type="number" min="0" value={draft.fee ?? ''} onChange={(e) => set('fee', e.target.value)} placeholder="0" /></label>
              </div>
              <label>Description<textarea rows={3} value={draft.description || ''} onChange={(e) => set('description', e.target.value)} /></label>
              <label>What they will learn (one per line)<textarea rows={4} value={draft.points} onChange={(e) => set('points', e.target.value)} /></label>
            </>
          )}

          <fieldset>
            <legend>Photo</legend>
            {draft.photo ? (
              <div className="adm-photo">
                <img loading="lazy" decoding="async" src={draft.photo} alt="" />
                <div className="adm-row">
                  <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}><Upload size={14} /> Change</button>
                  <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => set('photo', '')}><ImageOff size={14} /> Remove</button>
                </div>
              </div>
            ) : (
              <button type="button" className="adm-dropzone" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <Upload size={18} /> {uploading ? 'Uploading…' : 'Add a photo (optional)'}
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files?.[0]); e.target.value = '' }} />
            {kind === 'supply' && !draft.photo && <p className="adm-hint">Without a photo the app shows its drawn picture (new supplies show a general picture).</p>}
          </fieldset>

          {kind === 'service' && (
            <fieldset>
              <legend>Steps & details the customer sees ({draft.sections.length})</legend>
              {isJobs && <p className="adm-hint">In this service each section is a separate job (the customer picks one job, then sees its papers).</p>}
              {draft.sections.map((sec, i) => (
                <div key={sec._k} className="adm-block-edit">
                  <div className="adm-form-row">
                    <label>Heading<input value={sec.heading} onChange={(e) => updateList(setDraft, 'sections', i, { heading: e.target.value })} /></label>
                    {!isJobs && (
                      <label>Type
                        <select value={sec.type} onChange={(e) => updateList(setDraft, 'sections', i, { type: e.target.value })}>
                          {SECTION_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                        </select>
                      </label>
                    )}
                  </div>
                  <label>{sec.type === 'ask' ? 'Answers' : 'Lines'} (one per line)<textarea rows={Math.min(8, Math.max(3, lines(sec.items).length + 1))} value={sec.items} onChange={(e) => updateList(setDraft, 'sections', i, { items: e.target.value })} /></label>
                  <BlockTools onUp={() => moveList(setDraft, 'sections', i, -1)} onDown={() => moveList(setDraft, 'sections', i, 1)} onRemove={() => removeList(setDraft, 'sections', i)} first={i === 0} last={i === draft.sections.length - 1} />
                </div>
              ))}
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => addList(setDraft, 'sections', { heading: '', type: 'ask', items: '' })}><Plus size={14} /> Add a step</button>
              <p className="adm-hint">Questions also get “Not sure — please advise” automatically. Town, timing and notes are always asked at the end.</p>
            </fieldset>
          )}

          {kind === 'supply' && (
            <fieldset>
              <legend>Ordering</legend>
              <div className="adm-form-row">
                <label>Main unit<input value={draft.unit} onChange={(e) => set('unit', e.target.value)} placeholder="sq.ft / bags / loads" /></label>
                <label>Other units (comma)<input value={draft.units} onChange={(e) => set('units', e.target.value)} placeholder="sq.ft, sq.m" /></label>
              </div>
              <div className="adm-form-row">
                <label>Starting quantity<input type="number" min="0" value={draft.start} onChange={(e) => set('start', e.target.value)} /></label>
                <label>Step (+/−)<input type="number" min="0" value={draft.step} onChange={(e) => set('step', e.target.value)} /></label>
              </div>
              {draft.options.map((o, i) => (
                <div key={o._k} className="adm-block-edit">
                  <label>Question<input value={o.label} onChange={(e) => updateList(setDraft, 'options', i, { label: e.target.value })} placeholder="Colour" /></label>
                  <label>Choices (one per line)<textarea rows={Math.min(8, Math.max(3, lines(o.choices).length + 1))} value={o.choices} onChange={(e) => updateList(setDraft, 'options', i, { choices: e.target.value })} /></label>
                  <label className="adm-check"><input type="checkbox" checked={!!o.multi} onChange={(e) => updateList(setDraft, 'options', i, { multi: e.target.checked })} /> Customer can pick several</label>
                  <BlockTools onUp={() => moveList(setDraft, 'options', i, -1)} onDown={() => moveList(setDraft, 'options', i, 1)} onRemove={() => removeList(setDraft, 'options', i)} first={i === 0} last={i === draft.options.length - 1} />
                </div>
              ))}
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => addList(setDraft, 'options', { label: '', choices: '', multi: false })}><Plus size={14} /> Add a question</button>
            </fieldset>
          )}

          <details className="adm-te">
            <summary><strong>Telugu wording</strong> — {missingTe ? <span className="adm-warn-text">{missingTe} line{missingTe > 1 ? 's' : ''} without Telugu (they show in English)</span> : 'every line has Telugu ✓'}</summary>
            {kind === 'supply' && (
              <label>Name in Telugu<input value={draft.teName || ''} onChange={(e) => set('teName', e.target.value)} /></label>
            )}
            <ul>
              {teLines.map((l) => (
                <li key={l}>
                  <span>{l}</span>
                  <input value={teValue(l)} onChange={(e) => setTe((t) => ({ ...t, [l]: e.target.value }))} placeholder="Telugu (optional)" lang="te" />
                </li>
              ))}
            </ul>
          </details>

          <div className="adm-row adm-sticky-actions">
            <button className="adm-btn" type="submit" disabled={saving || uploading}>{saving ? 'Saving…' : 'Save'}</button>
            <button className="adm-btn adm-btn-ghost" type="button" onClick={onClose}>Cancel</button>
            {entry.row && onReset && (
              <button className="adm-btn adm-btn-danger" type="button" style={{ marginLeft: 'auto' }} onClick={onReset}>
                {entry.isNew ? <><Trash2 size={15} /> Delete</> : <><RotateCcw size={15} /> Undo all my changes</>}
              </button>
            )}
          </div>
        </form>
      </aside>
    </>
  )
}

const isEmoji = (s) => typeof s === 'string' && /\p{Extended_Pictographic}/u.test(s)
const EMOJIS = ['☀️', '🔧', '🔌', '💡', '🚰', '🧹', '🧺', '🚗', '🚚', '🏠', '🏗️', '🧱', '🪵', '🪟', '🎨', '📷', '🎉', '🍲', '🌾', '🌱', '🩺', '🚑', '💊', '🦷', '📄', '🪪', '🏛️', '⚖️', '🏦', '💰', '📚', '🎓', '🙏', '🪔', '✂️', '💄', '🧵', '📦', '🛵', '⭐']

/** Icon: a drawn icon from the list, or any emoji */
function IconPicker({ value, icons, color, onChange, note }) {
  const [mode, setMode] = useState(isEmoji(value) ? 'emoji' : 'icon')
  return (
    <fieldset>
      <legend>Icon</legend>
      <div className="adm-icon-pick">
        <span className="adm-icon-preview"><KalamkariIcon iconName={value} iconColor={color} size={48} /></span>
        <div className="adm-seg" role="group" aria-label="Icon type">
          <button type="button" className={mode === 'icon' ? 'active' : ''} aria-pressed={mode === 'icon'} onClick={() => { setMode('icon'); if (isEmoji(value)) onChange(icons[0] || 'Briefcase') }}>Drawn icon</button>
          <button type="button" className={mode === 'emoji' ? 'active' : ''} aria-pressed={mode === 'emoji'} onClick={() => { setMode('emoji'); if (!isEmoji(value)) onChange('⭐') }}>Emoji</button>
        </div>
      </div>
      {mode === 'icon' ? (
        <select className="adm-select adm-mt" value={value || ''} onChange={(e) => onChange(e.target.value)} aria-label="Drawn icon">
          {[...new Set([value, ...icons].filter((x) => x && !isEmoji(x)))].map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      ) : (
        <>
          <div className="adm-emoji-grid adm-mt">
            {EMOJIS.map((em) => (
              <button type="button" key={em} className={value === em ? 'active' : ''} onClick={() => onChange(em)} aria-label={`Use ${em}`}>{em}</button>
            ))}
          </div>
          <label className="adm-mt">Or type / paste any emoji (Windows: press Win + . to open the emoji panel)
            <input value={isEmoji(value) ? value : ''} onChange={(e) => onChange(e.target.value.trim().slice(0, 8))} placeholder="☀️" style={{ maxWidth: 160, fontSize: '1.4rem' }} />
          </label>
        </>
      )}
      {note && <p className="adm-hint">{note}</p>}
    </fieldset>
  )
}

function BlockTools({ onUp, onDown, onRemove, first, last }) {
  return (
    <div className="adm-row adm-block-tools">
      <button type="button" className="adm-icon-btn" onClick={onUp} disabled={first} aria-label="Move up"><ArrowUp size={15} /></button>
      <button type="button" className="adm-icon-btn" onClick={onDown} disabled={last} aria-label="Move down"><ArrowDown size={15} /></button>
      <button type="button" className="adm-icon-btn" onClick={onRemove} aria-label="Remove"><Trash2 size={15} /></button>
    </div>
  )
}

let keySeq = 0
const k = () => `k${++keySeq}`
const updateList = (setDraft, key, i, patch) => setDraft((d) => ({ ...d, [key]: d[key].map((x, j) => (j === i ? { ...x, ...patch } : x)) }))
const removeList = (setDraft, key, i) => setDraft((d) => ({ ...d, [key]: d[key].filter((_, j) => j !== i) }))
const addList = (setDraft, key, item) => setDraft((d) => ({ ...d, [key]: [...d[key], { ...item, _k: k() }] }))
const moveList = (setDraft, key, i, dir) => setDraft((d) => {
  const a = [...d[key]]; const j = i + dir
  if (j < 0 || j >= a.length) return d
  ;[a[i], a[j]] = [a[j], a[i]]
  return { ...d, [key]: a }
})

/** Item → form fields (lists become one-per-line text) */
function toDraft(kind, item = {}) {
  if (kind === 'service') {
    return {
      ...item,
      sections: (item.sections || []).map((s) => ({ _k: k(), heading: s.heading || '', type: sectionType(item, s), items: (s.items || []).join('\n'), _orig: s })),
    }
  }
  if (kind === 'supply') {
    const o = item.ordering || {}
    return {
      ...item,
      beneficiaries: (item.beneficiaries || []).join('\n'),
      highlights: (item.highlights || []).join('\n'),
      unit: o.unit || '', units: (o.units || []).join(', '), start: o.start ?? 1, step: o.step ?? 1, teName: o.te || '',
      options: (o.options || []).map((x) => ({ _k: k(), label: x.label || '', choices: (x.choices || []).join('\n'), multi: !!x.multi })),
    }
  }
  return { ...item, points: (item.points || []).join('\n'), seats: item.seats ?? '', fee: item.fee ?? '' }
}

/** Form fields → item to save */
function fromDraft(kind, d, orig = {}) {
  if (kind === 'service') {
    const { sections, ...rest } = d
    return {
      ...rest,
      title: (d.title || '').trim(),
      sections: sections.filter((s) => s.heading.trim() || lines(s.items).length).map((s) => {
        const out = { heading: s.heading.trim(), items: lines(s.items) }
        // Keep the old shape when the type didn't change, so built-in services behave exactly as before
        if (s._orig && sectionType(orig, s._orig) === s.type) { if (s._orig.pick) out.pick = s._orig.pick; if (s._orig.kind) out.kind = s._orig.kind; return out }
        out.kind = s.type
        if (s.type === 'ask') out.pick = 'one'
        return out
      }),
    }
  }
  if (kind === 'supply') {
    const { beneficiaries, highlights, unit, units, start, step, teName, options, ordering, ...rest } = d
    return {
      ...rest,
      title: (d.title || '').trim(),
      beneficiaries: lines(beneficiaries),
      highlights: lines(highlights),
      ordering: {
        ...(orig.ordering || {}),
        te: (teName || '').trim() || undefined,
        unit: unit.trim() || 'pieces',
        units: units.split(',').map((x) => x.trim()).filter(Boolean),
        start: Number(start) || 1,
        step: Number(step) || 1,
        options: options.filter((o) => o.label.trim()).map((o) => ({ label: o.label.trim(), choices: lines(o.choices), ...(o.multi ? { multi: true } : {}) })),
      },
    }
  }
  const { points, seats, fee, ...rest } = d
  return {
    ...rest,
    title: (d.title || '').trim(),
    points: lines(points),
    seats: seats === '' || seats == null ? null : Math.max(0, Number(seats) || 0),
    fee: fee === '' || fee == null ? 0 : Math.max(0, Number(fee) || 0),
  }
}
