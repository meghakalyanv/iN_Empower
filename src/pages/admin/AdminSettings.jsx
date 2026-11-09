import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Smartphone, CalendarX, Clock, Plus, Trash2, Download, MessageCircle, Send } from 'lucide-react'
import { api } from '../../services/api'
import { readPhone, showPhone } from '../../data/phone'
import { useToast } from '../../context/ToastContext'
import { AP_HOLIDAYS, WORK, DEFAULT_WORK, isWorkingTime, nextOpening, istFull, istDate, istAt, ist, dayWords, holidayName, hoursText, hourText } from '../../data/workHours'
import { indexRows } from '../../data/catalog'
import { canInstall, installNow, isInstalled, onInstallChange } from './installApp'
import { downloadCsv } from './adminShared'

/** Working hours & holidays, and installing the admin as a phone app */
export default function AdminSettings() {
  const { catalogRows, catalogReady, saveCatalogRow, enquiries } = useOutletContext()
  const { addToast } = useToast()
  const saved = indexRows(catalogRows).settings.holidays?.data?.days
  const [days, setDays] = useState(() => (saved || AP_HOLIDAYS).map((d) => ({ ...d })))
  const [newDate, setNewDate] = useState('')
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const [installable, setInstallable] = useState(canInstall())
  useEffect(() => onInstallChange(setInstallable), [])
  // Office hours (saved as settings → hours; the website, app and finish-by dates use them)
  const savedHours = indexRows(catalogRows).settings.hours?.data
  const pickHours = (h) => ({ start: h.start, end: h.end, closedWeekdays: [...h.closedWeekdays].sort(), todayCutoff: h.todayCutoff, nextDayAt: h.nextDayAt })
  const [hours, setHours] = useState(() => pickHours(WORK))
  const [savingHours, setSavingHours] = useState(false)
  const hoursDirty = JSON.stringify(pickHours(hours)) !== JSON.stringify(pickHours({ ...DEFAULT_WORK, ...(savedHours || {}) }))
  const setH = (k, v) => setHours((h) => ({ ...h, [k]: v }))
  const toggleDay = (d) => setHours((h) => ({ ...h, closedWeekdays: h.closedWeekdays.includes(d) ? h.closedWeekdays.filter((x) => x !== d) : [...h.closedWeekdays, d] }))
  const saveHours = async () => {
    if (hours.end <= hours.start) { addToast('Closing time must be after opening time', 'error'); return }
    if (hours.closedWeekdays.length === 7) { addToast('Keep at least one working day', 'error'); return }
    setSavingHours(true)
    try {
      await saveCatalogRow({ kind: 'settings', item_id: 'hours', data: pickHours(hours), te: {}, status: 'live' })
      addToast('Office hours saved — the website, app and finish-by dates use them now')
    } catch (err) {
      addToast(/kind_check|check constraint/i.test(err.message || '') ? 'Run supabase/012 and 013 first' : (err.message || 'Could not save'), 'error')
    } finally {
      setSavingHours(false)
    }
  }

  const dirty = JSON.stringify(days) !== JSON.stringify(saved || AP_HOLIDAYS)
  const sorted = useMemo(() => [...days].sort((a, b) => a.date.localeCompare(b.date)), [days])
  const today = ist().ymd
  const upcoming = sorted.filter((d) => d.date >= today)
  const past = sorted.filter((d) => d.date < today)

  const toggle = (date) => setDays((ds) => ds.map((d) => (d.date === date ? { ...d, closed: !d.closed } : d)))
  const remove = (date) => setDays((ds) => ds.filter((d) => d.date !== date))
  const add = () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate) || !newName.trim()) { addToast('Pick a date and type the holiday name', 'error'); return }
    setDays((ds) => [...ds.filter((d) => d.date !== newDate), { date: newDate, name: newName.trim(), closed: true }])
    setNewDate(''); setNewName('')
  }
  const save = async () => {
    setSaving(true)
    try {
      await saveCatalogRow({ kind: 'settings', item_id: 'holidays', data: { days: sorted }, te: {}, status: 'live' })
      addToast('Holidays saved — the website, app and finish-by dates use them now')
    } catch (err) {
      addToast(/kind_check|check constraint/i.test(err.message || '') ? 'Run supabase/012_working_hours_monitor.sql first' : (err.message || 'Could not save'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const open = isWorkingTime()
  const next = nextOpening()

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Settings</h1>
          <p className="adm-muted">Office hours, holidays, and the admin on your phone.</p>
        </div>
      </header>

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card-head">
            <h3><Clock size={16} /> Office hours</h3>
            <button className="adm-btn adm-btn-sm" onClick={saveHours} disabled={savingHours || !hoursDirty || !catalogReady}>{savingHours ? 'Saving…' : hoursDirty ? 'Save hours' : 'Saved'}</button>
          </div>
          <p style={{ margin: '0 0 0.5rem' }}><strong>{hoursText()}</strong> (India time). Closed days and the ticked holidays are closed.</p>
          <p className={open ? 'adm-ok-text' : 'adm-warn-text'} style={{ margin: 0 }}>
            {open ? '🟢 Open now' : `🌙 Closed now — opens ${dayWords(ist(next).ymd)} at ${hourText(WORK.start)}`}
          </p>
          <div className="adm-form adm-mt">
            <div className="adm-form-row">
              <label>Opens at
                <select value={hours.start} onChange={(e) => setH('start', Number(e.target.value))}>
                  {Array.from({ length: 9 }, (_, i) => i + 5).map((h) => <option key={h} value={h}>{hourText(h)}</option>)}
                </select>
              </label>
              <label>Closes at
                <select value={hours.end} onChange={(e) => setH('end', Number(e.target.value))}>
                  {Array.from({ length: 11 }, (_, i) => i + 13).map((h) => <option key={h} value={h}>{hourText(h)}</option>)}
                </select>
              </label>
            </div>
            <fieldset>
              <legend>Closed every week on</legend>
              <div className="adm-row" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                  <label key={d} className="adm-check"><input type="checkbox" checked={hours.closedWeekdays.includes(i)} onChange={() => toggleDay(i)} /> {d}</label>
                ))}
              </div>
            </fieldset>
            <div className="adm-form-row">
              <label>“Today” requests after
                <select value={hours.todayCutoff} onChange={(e) => setH('todayCutoff', Number(e.target.value))}>
                  {Array.from({ length: hours.end - hours.start + 1 }, (_, i) => i + hours.start).map((h) => <option key={h} value={h}>{hourText(h)}</option>)}
                </select>
              </label>
              <label>…are due the next working day at
                <select value={hours.nextDayAt} onChange={(e) => setH('nextDayAt', Number(e.target.value))}>
                  {Array.from({ length: hours.end - hours.start + 1 }, (_, i) => i + hours.start).map((h) => <option key={h} value={h}>{hourText(h)}</option>)}
                </select>
              </label>
            </div>
          </div>
          <ul className="adm-plain-list">
            <li>Requests that arrive when closed are told: “Our team will call you {dayWords(ist(next).ymd)} between {hourText(WORK.start)} and {hourText(WORK.end)}.”</li>
            <li>🚑 Ambulance / emergency requests are always told to call 108 at once, and your alert rings even at night.</li>
            <li>Finish-by dates skip closed days and holidays{savedHours ? '' : ' (the database follows saved hours after supabase/013 is run)'}.</li>
          </ul>
        </section>

        <section className="adm-card">
          <div className="adm-card-head"><h3><Smartphone size={16} /> Admin on your phone</h3></div>
          {isInstalled() ? <p>✅ You are using the installed app.</p> : (
            <>
              <p style={{ marginTop: 0 }}>Install the admin like an app — it opens straight to your requests with the iN Empower icon.</p>
              {installable
                ? <button className="adm-btn" onClick={() => installNow()}><Download size={16} /> Install “iN Team” app</button>
                : (
                  <ol className="adm-plain-list">
                    <li>Open the admin on your phone in <strong>Chrome</strong> (after the website is live on your domain).</li>
                    <li>Tap the <strong>⋮</strong> menu → <strong>Add to Home screen</strong> → <strong>Install</strong>.</li>
                    <li>iPhone: open in Safari → Share → <strong>Add to Home Screen</strong>.</li>
                  </ol>
                )}
              <p className="adm-hint">New-request alerts on the phone come through WhatsApp once WhatsApp Business is set up (supabase/008). While the admin is open, it chimes for new requests (quiet 9 pm – 8 am, except emergencies).</p>
            </>
          )}
        </section>
      </div>

      <section className="adm-card adm-mt">
        <div className="adm-card-head">
          <h3><CalendarX size={16} /> Holidays (office closed)</h3>
          <div className="adm-row">
            <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => downloadCsv(`inempower-all-requests-${today}.csv`, enquiries)} title="Keep a copy of every request on your computer">
              <Download size={14} /> Back up all requests (CSV)
            </button>
            <button className="adm-btn adm-btn-sm" onClick={save} disabled={saving || !dirty || !catalogReady}>{saving ? 'Saving…' : dirty ? 'Save holidays' : 'Saved'}</button>
          </div>
        </div>
        <p className="adm-muted adm-small" style={{ marginTop: 0 }}>Andhra Pradesh 2026 general holidays are listed. Tick the days your office is closed. Add 2027 dates when the government list comes out (usually in December).</p>
        <ul className="adm-holidays">
          {upcoming.map((d) => (
            <li key={d.date} className={d.closed ? 'closed' : ''}>
              <label className="adm-check"><input type="checkbox" checked={!!d.closed} onChange={() => toggle(d.date)} /> <strong>{istDate(istAt(d.date, 12))}</strong> <span className="adm-muted">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(`${d.date}T00:00:00Z`).getUTCDay()]}</span> · {d.name || holidayName(d.date)}</label>
              <button className="adm-icon-btn" onClick={() => remove(d.date)} aria-label={`Remove ${d.name}`}><Trash2 size={15} /></button>
            </li>
          ))}
        </ul>
        <div className="adm-inline-form adm-mt">
          <input type="date" value={newDate} min={today} onChange={(e) => setNewDate(e.target.value)} aria-label="Holiday date" />
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Holiday name, e.g. Bhogi 2027" style={{ flex: 1, minWidth: 180 }} />
          <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={add}><Plus size={14} /> Add holiday</button>
        </div>
        {past.length > 0 && <p className="adm-hint">{past.length} past holiday{past.length > 1 ? 's' : ''} this year are hidden.</p>}
        {!catalogReady && <p className="adm-hint adm-warn-text">Run supabase/010 and 012 to save holidays.</p>}
        <p className="adm-hint">Last changed: {indexRows(catalogRows).settings.holidays?.updated_at ? istFull(indexRows(catalogRows).settings.holidays.updated_at) : 'not yet (using the built-in list)'}</p>
      </section>

      <WhatsAppCard />
    </div>
  )
}

/**
 * WhatsApp alerts (supabase/008): the numbers that get new-request alerts, on / off,
 * automatic thank-you (011) and a test button — no SQL needed after the first setup.
 */
function WhatsAppCard() {
  const { addToast } = useToast()
  const [row, setRow] = useState(undefined) // undefined = loading, null = not set up
  const [form, setForm] = useState(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    api.admin.getWhatsAppSettings?.().then((r) => {
      setRow(r || null)
      if (r) setForm({ enabled: !!r.enabled, phone_number_id: r.phone_number_id || '', requests_to: r.requests_to || '', team_to: r.team_to || '', thank_you_auto: !!r.thank_you_auto })
    }).catch(() => setRow(null))
  }, [])
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  // WhatsApp wants the number with the country code and no "+": 918328555396
  const toWa = (v) => {
    const raw = String(v || '').trim()
    if (!raw) return { ok: true, value: null }
    const p = readPhone(raw)
    if (p.ok) return { ok: true, value: p.digits }
    const q = readPhone(`+${raw.replace(/^\+/, '')}`)
    return q.ok ? { ok: true, value: q.digits } : { ok: false }
  }

  const save = async () => {
    const req = toWa(form.requests_to); const team = toWa(form.team_to)
    if (!req.ok) { addToast('Customer requests number: please check it', 'error'); return }
    if (!team.ok) { addToast('Team number: please check it', 'error'); return }
    if (form.enabled && (!form.phone_number_id.trim() || !req.value)) { addToast('To switch alerts on, fill in the Phone number ID and the customer requests number', 'error'); return }
    const patch = {
      enabled: !!form.enabled,
      phone_number_id: form.phone_number_id.trim() || null,
      requests_to: req.value,
      team_to: team.value,
    }
    if ('thank_you_auto' in (row || {})) patch.thank_you_auto = !!form.thank_you_auto
    setBusy(true)
    try {
      const saved = await api.admin.saveWhatsAppSettings(patch)
      setRow({ ...row, ...patch, ...(saved || {}) })
      addToast(patch.enabled ? 'Saved — WhatsApp alerts are on' : 'Saved — WhatsApp alerts are off')
    } catch (err) {
      addToast(err.message || 'Could not save', 'error')
    } finally {
      setBusy(false)
    }
  }
  const test = async (target) => {
    setBusy(true)
    try {
      const ok = await api.admin.testWhatsApp(target)
      addToast(ok ? `Test sent — check the ${target === 'team' ? 'team' : 'requests'} phone in a minute` : 'Not sent: alerts are off, or the Phone number ID / token is missing', ok ? 'success' : 'error')
    } catch (err) {
      addToast(/template|wa_test|function/i.test(err.message || '') ? 'Not sent — check the Meta setup (supabase/whatsapp-setup.md)' : (err.message || 'Could not send'), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="adm-card adm-mt">
      <div className="adm-card-head">
        <h3><MessageCircle size={16} /> WhatsApp alerts</h3>
        {form && <button className="adm-btn adm-btn-sm" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>}
      </div>
      {row === undefined ? <p className="adm-muted">Loading…</p> : row === null ? (
        <p className="adm-hint">Not set up yet. Follow <code>supabase/whatsapp-setup.md</code> (Meta account, new SIM, templates, token in Vault) and run <code>supabase/008_whatsapp_alerts.sql</code>. Then the numbers can be changed here.</p>
      ) : (
        <div className="adm-form">
          <label className="adm-check"><input type="checkbox" checked={form.enabled} onChange={(e) => set('enabled', e.target.checked)} /> <strong>Send an alert on WhatsApp for every new request</strong></label>
          <label>Phone number ID (from Meta → WhatsApp → API Setup)<input value={form.phone_number_id} onChange={(e) => set('phone_number_id', e.target.value)} placeholder="e.g. 123456789012345" inputMode="numeric" /></label>
          <div className="adm-form-row">
            <label>Customer requests go to<input type="tel" value={form.requests_to} onChange={(e) => set('requests_to', e.target.value)} placeholder="+91 83285 55396" /></label>
            <label>Local Buddy applications & job posts go to<input type="tel" value={form.team_to} onChange={(e) => set('team_to', e.target.value)} placeholder="+91 …" /></label>
          </div>
          {'thank_you_auto' in row && (
            <label className="adm-check"><input type="checkbox" checked={form.thank_you_auto} onChange={(e) => set('thank_you_auto', e.target.checked)} /> Send the thank-you messages automatically when a ticket is completed (needs the 3 thank-you templates approved by Meta)</label>
          )}
          <div className="adm-row">
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => test('requests')} disabled={busy || !row.enabled}><Send size={14} /> Test: requests number</button>
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => test('team')} disabled={busy || !row.enabled}><Send size={14} /> Test: team number</button>
          </div>
          <p className="adm-hint">Now sending to {row.requests_to ? showPhone(`+${row.requests_to}`) : '—'} (requests) and {row.team_to ? showPhone(`+${row.team_to}`) : '—'} (team). The Meta access token is kept in Supabase Vault and is never shown or changed here.</p>
        </div>
      )}
    </section>
  )
}
