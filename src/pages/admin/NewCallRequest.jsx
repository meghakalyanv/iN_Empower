import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, PhoneIncoming, CheckCircle2 } from 'lucide-react'
import { api } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import servicesData from '../../data/servicesData'
import { supplyCategories } from '../../data/suppliesData'
import { allCities, cityById, defaultCity } from '../../data/cities'
import { readPhone, showPhone } from '../../data/phone'
import { serviceLabel, statusInfo, timeAgo } from './adminShared'

// "Just checking" removed (owner, 2 Nov 2026: no time-pass requests)
const WHEN = ['Today', 'This week', 'This month']
const OTHER = '__other'
const digits10 = (p) => String(p || '').replace(/\D/g, '').slice(-10)

/** Everything a customer can ask for, grouped like the app: services by office/trade, then supplies */
function useNeedOptions() {
  return useMemo(() => {
    const groups = new Map()
    for (const s of servicesData) {
      if (s.targetCategory) continue
      const label = serviceLabel(s.category)
      if (!groups.has(label)) groups.set(label, [])
      groups.get(label).push({ value: `s:${s.id}`, label: s.title, service: s.category, item: s.title })
    }
    const list = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([label, items]) => ({ label, items }))
    list.push({ label: 'Supplies', items: supplyCategories.map((c) => ({ value: `p:${c.id}`, label: c.title, service: 'supplies', item: c.title, supply: true })) })
    return list
  }, [])
}

/**
 * "New request from a call": whoever takes the customer's phone call (agent, admin, CEO)
 * types the request here while talking. It becomes a normal ticket with a reference number
 * (channel "Phone call", "taken by <name>" in its history), so it is followed, assigned and
 * updated like every other request — and the customer can track it in the app with the
 * reference and their number.
 */
export default function NewCallRequest({ enquiries, onClose, onCreated }) {
  const { addToast } = useToast()
  const groups = useNeedOptions()
  const cities = allCities()
  const [f, setF] = useState({ phone: '', name: '', city: defaultCity().id, town: '', area: '', need: '', other: '', when: 'This week', notes: '', whatsappOk: true })
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(null) // { id, ref }
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))
  const city = cityById(f.city) || defaultCity()
  const towns = (city.towns || []).map((t) => t.name)

  // Has this number asked before? (avoid duplicates; see what they asked)
  const earlier = useMemo(() => {
    const d = digits10(f.phone)
    if (d.length < 10) return []
    return enquiries.filter((e) => digits10(e.phone) === d).slice(0, 5)
  }, [f.phone, enquiries])
  const knownName = earlier.find((e) => e.name)?.name

  const pick = groups.flatMap((g) => g.items).find((i) => i.value === f.need)
  const phoneOk = readPhone(f.phone).ok
  const canSave = phoneOk && f.name.trim() && (pick || (f.need === OTHER && f.other.trim()))

  const save = async (ev) => {
    ev.preventDefault()
    if (!canSave || saving) return
    setSaving(true)
    const what = pick ? pick.item : f.other.trim()
    const lines = [
      `Taken on a phone call.`,
      `What they need: ${what}`,
      f.town ? `Town: ${f.town}` : '',
      f.area.trim() ? `Area / street: ${f.area.trim()}` : '',
      `When: ${f.when}`,
      f.notes.trim() ? `What the customer said: ${f.notes.trim()}` : '',
    ].filter(Boolean)
    try {
      const r = await api.admin.createRequest({
        name: f.name.trim(),
        phone: f.phone.trim(),
        service: pick ? pick.service : 'other',
        subService: what,
        item: what,
        area: f.area.trim() || f.town || null,
        urgency: f.when,
        message: lines.join('\n'),
        details: { city: city.id, cityName: city.name, ...(f.town ? { nearTown: f.town } : {}), ...(pick?.supply ? { kind: 'supply' } : {}) },
      }, { whatsappOk: f.whatsappOk })
      setDone(r)
      onCreated?.(r)
      addToast(`Request ${r.ref} created`, 'success')
    } catch (err) {
      addToast(err?.message || 'Could not save the request. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="adm-scrim" onClick={onClose} />
      <aside className="adm-detail" aria-label="New request from a phone call">
        <div className="adm-detail-head">
          <div>
            <h2><PhoneIncoming size={20} style={{ verticalAlign: '-3px' }} /> New request from a call</h2>
            <p className="adm-muted adm-small">Type it while you talk. It becomes a normal ticket with a reference number.</p>
          </div>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        {done ? (
          <section className="adm-detail-section" style={{ textAlign: 'center' }}>
            <CheckCircle2 size={40} color="#15803D" />
            <h3 style={{ margin: '0.5rem 0' }}>Request {done.ref} created</h3>
            <p>Read the reference to the customer: <strong style={{ fontSize: '1.3rem', letterSpacing: '0.05em' }}>{done.ref}</strong></p>
            <p className="adm-muted adm-small">They can follow it in the iN Empower app → Requests → “Check a reference number”, with this phone number.</p>
            <div className="adm-row" style={{ justifyContent: 'center' }}>
              {done.id && <Link className="adm-btn" to={`/admin/requests?id=${done.id}&status=all`} onClick={onClose}>Open the ticket</Link>}
              <button className="adm-btn adm-btn-ghost" onClick={() => { setDone(null); setF((x) => ({ ...x, phone: '', name: '', area: '', need: '', other: '', notes: '', whatsappOk: true })) }}>Take another call</button>
            </div>
          </section>
        ) : (
          <form className="adm-form" onSubmit={save}>
            <div className="adm-form-row">
              <label>Customer's mobile *
                <input type="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="98765 43210" autoFocus required />
                {f.phone && !phoneOk && <span className="adm-hint">Please check the number.</span>}
              </label>
              <label>Name *
                <input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Lakshmi" required />
                {knownName && !f.name && <button type="button" className="adm-link adm-small" style={{ textAlign: 'left' }} onClick={() => set('name', knownName)}>Use “{knownName}” (from an earlier request)</button>}
              </label>
            </div>

            {earlier.length > 0 && (
              <div className="adm-card" style={{ background: '#FFF7E6', padding: '0.7rem 0.9rem' }}>
                <strong className="adm-small">This number asked before ({earlier.length}):</strong>
                <ul className="adm-list" style={{ margin: '0.35rem 0 0' }}>
                  {earlier.map((e) => (
                    <li key={e.id} className="adm-small">
                      <Link className="adm-link" to={`/admin/requests?id=${e.id}&status=all`} onClick={onClose}>{e.details?.ref || 'Request'}</Link>
                      {' · '}{e.item || serviceLabel(e.service)} · {statusInfo(e.status).label} · {timeAgo(e.created_at)}
                    </li>
                  ))}
                </ul>
                <p className="adm-hint">If it is the same work, open that ticket and add a note instead of a new request.</p>
              </div>
            )}

            <label>What do they need? *
              <select value={f.need} onChange={(e) => set('need', e.target.value)} required>
                <option value="">Choose…</option>
                {groups.map((g) => (
                  <optgroup key={g.label} label={g.label}>
                    {g.items.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                  </optgroup>
                ))}
                <option value={OTHER}>Something else (write it)</option>
              </select>
            </label>
            {f.need === OTHER && (
              <label>Write what they need *<input value={f.other} onChange={(e) => set('other', e.target.value)} placeholder="e.g. Borewell repair" required /></label>
            )}

            <div className="adm-form-row">
              {cities.length > 1 && (
                <label>City
                  <select value={f.city} onChange={(e) => { set('city', e.target.value); set('town', '') }}>
                    {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
              )}
              <label>Town / village
                <select value={f.town} onChange={(e) => set('town', e.target.value)}>
                  <option value="">Choose…</option>
                  {towns.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label>Area / street (optional)<input value={f.area} onChange={(e) => set('area', e.target.value)} placeholder="e.g. Santhapet" /></label>
            </div>

            <fieldset>
              <legend>When do they need it?</legend>
              <div className="adm-row">
                {WHEN.map((w) => (
                  <label key={w} className="adm-check"><input type="radio" name="when" checked={f.when === w} onChange={() => set('when', w)} /> {w}</label>
                ))}
              </div>
            </fieldset>

            <label>What the customer said
              <textarea rows={4} value={f.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Details, papers they have, best time to call back, budget…" />
            </label>

            <label className="adm-check">
              <input type="checkbox" checked={f.whatsappOk} onChange={(e) => set('whatsappOk', e.target.checked)} />
              The customer is OK with WhatsApp updates on {phoneOk ? showPhone(f.phone) : 'this number'}
            </label>
            <p className="adm-hint">Ask: “We'll send updates about your request on WhatsApp — is that OK?” Untick if they say no.</p>

            <div className="adm-row">
              <button className="adm-btn" type="submit" disabled={!canSave || saving}>{saving ? 'Saving…' : 'Create request'}</button>
              <button className="adm-btn adm-btn-ghost" type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        )}
      </aside>
    </>
  )
}
