import { useEffect, useMemo, useState } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import { MapPin, Plus, Pencil, Star, Trash2, Navigation, X, MessageCircle, Download, Search, CheckCircle2, Clock, EyeOff } from 'lucide-react'
import { api } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { indexRows } from '../../data/catalog'
import { BUILT_IN_CITIES, cleanCity, citySlug, parseLatLng, locate, EMPTY_HIDE, CITY_PAGES } from '../../data/cities'
import { readPhone, showPhone } from '../../data/phone'
import { adminList } from './catalogShared'
import { SERVICE_LABELS, prettify, whatsappLink, fullDate, OPEN_STATUSES } from './adminShared'

const STATUS = {
  live: { label: 'Live', color: '#0F6B06', bg: '#E7F3E6', Icon: CheckCircle2, hint: 'Customers can choose it' },
  soon: { label: 'Coming soon', color: '#B45309', bg: '#FEF3C7', Icon: Clock, hint: 'Listed as “coming soon”; visitors can ask to be told' },
  hidden: { label: 'Hidden', color: '#475569', bg: '#F1F5F9', Icon: EyeOff, hint: 'Not shown to customers' },
}
const posText = (p) => (p && Number.isFinite(p.lat) ? `${p.lat}, ${p.lng}` : '')

/**
 * Cities: where iN Empower works. Each city has its towns (with map positions for
 * the "use my location" button), phone / WhatsApp numbers and the services, supplies
 * and workshops it offers. Saved in catalog_items (settings → cities); the website and
 * app use it straight away. Also shows "Not in your city yet?" requests.
 */
export default function AdminCities() {
  const { catalogRows, catalogReady, saveCatalogRow, enquiries } = useOutletContext()
  const { addToast } = useToast()
  const row = indexRows(catalogRows).settings.cities
  const saved = row?.data
  const cities = useMemo(() => {
    const list = Array.isArray(saved?.cities) ? saved.cities.map(cleanCity).filter(Boolean) : []
    return list.length ? list : BUILT_IN_CITIES.map(cleanCity)
  }, [saved])
  const firstLive = cities.find((c) => c.status === 'live') || cities[0]
  const defaultId = cities.some((c) => c.id === saved?.defaultCity && c.status === 'live') ? saved.defaultCity : firstLive.id
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  const catalog = useMemo(() => ({
    services: adminList('service', catalogRows).filter((e) => e.status === 'live'),
    supplies: adminList('supply', catalogRows).filter((e) => e.status === 'live'),
    workshops: adminList('workshop', catalogRows).filter((e) => e.status === 'live'),
    // Whole pages (Supplies, Property, Travel, Youth Hub, Tutor)
    pages: CITY_PAGES.map((pg) => ({ id: pg.id, item: { title: pg.name, about: pg.about } })),
  }), [catalogRows])
  const totalItems = catalog.services.length + catalog.supplies.length + catalog.workshops.length

  const openCount = (c) => (enquiries || []).filter((e) => OPEN_STATUSES.includes(e.status) && (e.details?.city || defaultId) === c.id).length

  const persist = async (list, def = defaultId, msg = 'Saved — the website and app use it now') => {
    if (!list.some((c) => c.status === 'live')) { addToast('At least one city must be Live', 'error'); return false }
    const liveDefault = list.some((c) => c.id === def && c.status === 'live') ? def : list.find((c) => c.status === 'live').id
    setBusy(true)
    try {
      await saveCatalogRow({ kind: 'settings', item_id: 'cities', data: { cities: list, defaultCity: liveDefault }, te: {}, status: 'live' })
      addToast(msg)
      return true
    } catch (err) {
      addToast(/kind_check|check constraint/i.test(err.message || '') ? 'Run supabase/013_cities.sql first (Supabase → SQL Editor)' : (err.message || 'Could not save'), 'error')
      return false
    } finally {
      setBusy(false)
    }
  }

  const saveCity = async (city, isNew) => {
    const list = isNew ? [...cities, city] : cities.map((c) => (c.id === city.id ? city : c))
    if (await persist(list)) setEditing(null)
  }
  const makeDefault = (c) => persist(cities, c.id, `${c.name} is now the main city`)
  const remove = async (c) => {
    if (cities.length === 1) { addToast('Keep at least one city', 'error'); return }
    if (!window.confirm(`Delete ${c.name}? Its towns and settings are removed. Requests already sent keep their city name.`)) return
    await persist(cities.filter((x) => x.id !== c.id), defaultId === c.id ? null : defaultId, `${c.name} deleted`)
  }

  if (!catalogReady) {
    return (
      <div className="adm-page">
        <header className="adm-page-head"><div><h1>Cities</h1></div></header>
        <div className="adm-card"><p>Run <code>supabase/010</code> and <code>supabase/013_cities.sql</code> in Supabase → SQL Editor, then press Refresh.</p></div>
      </div>
    )
  }

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Cities</h1>
          <p className="adm-muted">Where iN Empower works. Add a city, its towns and numbers, and choose what it offers — the website and app change straight away.</p>
        </div>
        <button className="adm-btn" onClick={() => setEditing({ isNew: true, city: newCity() })}><Plus size={16} /> Add city</button>
      </header>

      {!row && <p className="adm-hint">Showing the built-in city. Your first save stores the list in the database.</p>}

      <div className="adm-cards">
        {cities.map((c) => {
          const st = STATUS[c.status]
          const hidden = (c.hide.services.length + c.hide.supplies.length + c.hide.workshops.length)
          const placed = c.towns.filter((t) => Number.isFinite(t.lat)).length
          return (
            <section key={c.id} className="adm-card adm-city-card">
              <div className="adm-card-head">
                <div>
                  <h3 style={{ margin: 0 }}><MapPin size={16} /> {c.name}{c.te ? <span className="adm-muted adm-small"> · {c.te}</span> : null}</h3>
                  <span className="adm-muted adm-small">{[c.region, c.state].filter(Boolean).join(', ')}</span>
                </div>
                <span className="adm-pill" style={{ color: st.color, background: st.bg }} title={st.hint}><st.Icon size={12} /> {st.label}</span>
              </div>
              <dl className="adm-dl">
                <dt>Towns</dt><dd>{c.towns.length} <span className="adm-muted adm-small">({placed} on the map)</span></dd>
                <dt>Offers</dt><dd>{totalItems - hidden} of {totalItems} <span className="adm-muted adm-small">services, supplies & workshops</span></dd>
                <dt>Pages</dt><dd>{c.hide.pages.length
                  ? <>Off: {CITY_PAGES.filter((pg) => c.hide.pages.includes(pg.id)).map((pg) => pg.name).join(', ')}</>
                  : <span className="adm-muted">all on</span>}</dd>
                <dt>Phone</dt><dd>{c.phone ? showPhone(c.phone) : <span className="adm-muted">main office number</span>}</dd>
                <dt>WhatsApp</dt><dd>{c.whatsapp ? showPhone(c.whatsapp) : <span className="adm-muted">same as phone</span>}</dd>
                <dt>Open work</dt><dd><Link className="adm-link" to={`/admin/requests?city=${c.id}`}>{openCount(c)} open requests</Link></dd>
              </dl>
              <div className="adm-row">
                <button className="adm-btn adm-btn-sm" onClick={() => setEditing({ isNew: false, city: c })}><Pencil size={14} /> Edit</button>
                {c.id === defaultId
                  ? <span className="adm-pill" style={{ color: '#000080', background: '#E5E5F2' }}><Star size={12} /> Main city</span>
                  : c.status === 'live' && <button className="adm-btn adm-btn-ghost adm-btn-sm" disabled={busy} onClick={() => makeDefault(c)} title="Shown first, and used when a visitor doesn't choose"><Star size={14} /> Make main city</button>}
                {c.id !== defaultId && <button className="adm-icon-btn" disabled={busy} onClick={() => remove(c)} aria-label={`Delete ${c.name}`}><Trash2 size={16} /></button>}
              </div>
            </section>
          )
        })}
      </div>

      <LocationTester cities={cities} />
      <CityRequests />

      {editing && (
        <CityEditor
          key={editing.city.id || 'new'}
          entry={editing}
          cities={cities}
          catalog={catalog}
          busy={busy}
          onClose={() => setEditing(null)}
          onSave={saveCity}
        />
      )}
    </div>
  )
}

function newCity() {
  // Starts "Coming soon" so nothing changes for customers until it is ready
  return { ...cleanCity({ id: 'new-city', name: 'New city', status: 'soon' }), id: '', name: '', region: '', regionShort: '', towns: [], hide: EMPTY_HIDE(), radiusKm: 40, townRadiusKm: 15 }
}

/* ─────────────── Add / edit one city ─────────────── */
function CityEditor({ entry, cities, catalog, busy, onClose, onSave }) {
  const { addToast } = useToast()
  const [c, setC] = useState(() => ({
    ...entry.city,
    centerText: posText(entry.city.center),
    towns: entry.city.towns.map((t, i) => ({ ...t, _k: i, pos: posText(t), areasText: (t.areas || []).join(', ') })),
  }))
  const [tab, setTab] = useState('services')
  const [query, setQuery] = useState('')
  const set = (k, v) => setC((x) => ({ ...x, [k]: v }))
  const setTown = (i, patch) => setC((x) => ({ ...x, towns: x.towns.map((t, j) => (j === i ? { ...t, ...patch } : t)) }))
  const center = parseLatLng(c.centerText)

  const hereToCenter = () => {
    if (!navigator.geolocation) { addToast('This browser cannot share its location', 'error'); return }
    navigator.geolocation.getCurrentPosition(
      (p) => set('centerText', `${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`),
      () => addToast('Location is blocked for this site — paste a Google Maps link instead', 'error'),
      { timeout: 15000 },
    )
  }

  const kindKey = { services: 'services', supplies: 'supplies', workshops: 'workshops', pages: 'pages' }[tab]
  const items = catalog[kindKey]
  const shown = items.filter((e) => !query || `${e.item.title} ${e.item.category || ''}`.toLowerCase().includes(query.toLowerCase()))
  const groups = useMemo(() => {
    const m = new Map()
    shown.forEach((e) => {
      const g = tab === 'services' ? (SERVICE_LABELS[e.item.category] || prettify(e.item.category)) : { supplies: 'Supplies', workshops: 'Workshops', pages: 'Whole pages' }[tab]
      if (!m.has(g)) m.set(g, [])
      m.get(g).push(e)
    })
    return [...m.entries()]
  }, [shown, tab])
  const isOn = (id) => !c.hide[kindKey].includes(String(id))
  const toggle = (id) => setC((x) => {
    const list = x.hide[kindKey]
    const next = list.includes(String(id)) ? list.filter((v) => v !== String(id)) : [...list, String(id)]
    return { ...x, hide: { ...x.hide, [kindKey]: next } }
  })
  const setAll = (on, ids) => setC((x) => {
    const keep = new Set(items.filter((e) => e.item.everywhere).map((e) => String(e.id)))
    const others = x.hide[kindKey].filter((v) => !ids.includes(v))
    return { ...x, hide: { ...x.hide, [kindKey]: on ? others : [...others, ...ids.filter((id) => !keep.has(id))] } }
  })
  const offered = (k) => catalog[k].filter((e) => !c.hide[k].includes(String(e.id))).length

  const save = (e) => {
    e.preventDefault()
    const name = c.name.trim()
    if (!name) { addToast('Please type the city name', 'error'); return }
    let id = entry.isNew ? citySlug(name) : c.id
    if (entry.isNew) { const base = id || 'city'; let n = 2; while (cities.some((x) => x.id === id)) id = `${base}-${n++}` }
    for (const [label, v] of [['Phone', c.phone], ['WhatsApp', c.whatsapp]]) {
      if (v && !readPhone(v).ok) { addToast(`${label}: please check the number`, 'error'); return }
    }
    if (c.centerText.trim() && !center) { addToast('Map centre: paste "15.5057, 80.0499" or a Google Maps link', 'error'); return }
    const towns = []
    for (const t of c.towns) {
      if (!t.name.trim()) continue
      const pos = t.pos.trim() ? parseLatLng(t.pos) : null
      if (t.pos.trim() && !pos) { addToast(`Town “${t.name}”: the map position is not readable`, 'error'); return }
      towns.push({ name: t.name.trim(), te: (t.te || '').trim(), ...(pos || {}), quick: !!t.quick, areas: t.areasText.split(',').map((a) => a.trim()).filter(Boolean) })
    }
    const city = cleanCity({
      ...c, id, name, towns, center,
      hide: { services: c.hide.services, supplies: c.hide.supplies, workshops: c.hide.workshops, pages: c.hide.pages || [] },
    })
    if (city.status === 'live' && !towns.length) { addToast('Add at least one town before making the city Live', 'error'); return }
    onSave(city, entry.isNew)
  }

  return (
    <>
      <div className="adm-scrim" onClick={onClose} />
      <aside className="adm-detail adm-detail-wide" aria-label="Edit city">
        <div className="adm-detail-head">
          <div>
            <span className="adm-muted adm-small">{entry.isNew ? 'New city' : `City · ${c.id}`}</span>
            <h2>{c.name || 'New city'}</h2>
          </div>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <form className="adm-form" onSubmit={save}>
          <div className="adm-seg-row">
            <span className="adm-small"><strong>Customers see it?</strong></span>
            <div className="adm-seg" role="group" aria-label="Status">
              {Object.entries(STATUS).map(([k, s]) => (
                <button key={k} type="button" className={c.status === k ? 'active' : ''} aria-pressed={c.status === k} onClick={() => set('status', k)} title={s.hint}><s.Icon size={14} /> {s.label}</button>
              ))}
            </div>
          </div>

          <fieldset>
            <legend>Name</legend>
            <div className="adm-form-row">
              <label>City name *<input value={c.name} onChange={(e) => set('name', e.target.value)} placeholder="Mysuru" required /></label>
              <label>In Telugu<input value={c.te} onChange={(e) => set('te', e.target.value)} placeholder="మైసూరు" /></label>
            </div>
            <div className="adm-form-row">
              <label>District / area<input value={c.region} onChange={(e) => set('region', e.target.value)} placeholder="Mysuru District" /></label>
              <label>In Telugu<input value={c.regionTe} onChange={(e) => set('regionTe', e.target.value)} placeholder="మైసూరు జిల్లా" /></label>
            </div>
            <div className="adm-form-row">
              <label>Short name of the area<input value={c.regionShort} onChange={(e) => set('regionShort', e.target.value)} placeholder="Mysuru" /></label>
              <label>State<input value={c.state} onChange={(e) => set('state', e.target.value)} placeholder="Karnataka" /></label>
            </div>
            <p className="adm-hint">The website text was written for “Ongole, Prakasam District”. For this city those words are shown as this city's names.</p>
          </fieldset>

          <fieldset>
            <legend>Phone numbers customers see</legend>
            <div className="adm-form-row">
              <label>Phone<input type="tel" value={c.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 83285 55396 (empty = main office)" /></label>
              <label>WhatsApp<input type="tel" value={c.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="empty = same as phone" /></label>
            </div>
            <label>Office address<input value={c.address} onChange={(e) => set('address', e.target.value)} placeholder="e.g. 2nd floor, Main Road, Mysuru" /></label>
          </fieldset>

          <fieldset>
            <legend>Where it is (for “use my location”)</legend>
            <label>Map centre — paste a Google Maps link or “lat, lng”
              <div className="adm-row">
                <input style={{ flex: 1 }} value={c.centerText} onChange={(e) => set('centerText', e.target.value)} placeholder="https://maps.google.com/…@12.2958,76.6394,13z" />
                <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={hereToCenter}><Navigation size={14} /> Use this computer's location</button>
              </div>
            </label>
            {c.centerText.trim() && <p className={center ? 'adm-hint adm-ok-text' : 'adm-hint adm-warn-text'}>{center ? `✓ ${center.lat}, ${center.lng}` : 'Not readable yet'}</p>}
            <div className="adm-form-row">
              <label>Distance from a town that counts as “here” (km)<input type="number" min="1" max="100" value={c.townRadiusKm} onChange={(e) => set('townRadiusKm', e.target.value)} /></label>
              <label>Distance from the centre, if no town has a position (km)<input type="number" min="1" max="300" value={c.radiusKm} onChange={(e) => set('radiusKm', e.target.value)} /></label>
            </div>
            <p className="adm-hint">On Google Maps: right-click a town → the first line (e.g. 12.2958, 76.6394) copies its position. Paste it in the town's “Position”.</p>
          </fieldset>

          <fieldset>
            <legend>Towns ({c.towns.filter((t) => t.name.trim()).length})</legend>
            <div className="adm-towns">
              <div className="adm-towns-head"><span>Town</span><span>Telugu</span><span>Position</span><span title="Shown as a button in the Chat Buddy and the Local Buddy application">Button</span><span>Areas (comma)</span><span /></div>
              {c.towns.map((t, i) => (
                <div key={t._k} className="adm-towns-row">
                  <input aria-label="Town" value={t.name} onChange={(e) => setTown(i, { name: e.target.value })} placeholder="Nanjangud" />
                  <input aria-label="Telugu" value={t.te || ''} onChange={(e) => setTown(i, { te: e.target.value })} />
                  <input aria-label="Position" value={t.pos} onChange={(e) => setTown(i, { pos: e.target.value })} placeholder="12.1196, 76.6804" className={t.pos.trim() && !parseLatLng(t.pos) ? 'adm-bad' : ''} />
                  <input aria-label="Show as a button" type="checkbox" checked={!!t.quick} onChange={(e) => setTown(i, { quick: e.target.checked })} />
                  <input aria-label="Areas" value={t.areasText} onChange={(e) => setTown(i, { areasText: e.target.value })} placeholder="Bus stand, Main road" />
                  <button type="button" className="adm-icon-btn" onClick={() => setC((x) => ({ ...x, towns: x.towns.filter((_, j) => j !== i) }))} aria-label={`Remove ${t.name || 'town'}`}><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setC((x) => ({ ...x, towns: [...x.towns, { _k: Date.now(), name: '', te: '', pos: '', quick: x.towns.filter((tt) => tt.quick).length < 10, areasText: '' }] }))}><Plus size={14} /> Add a town</button>
          </fieldset>

          <fieldset>
            <legend>What this city offers</legend>
            <div className="adm-chips" role="tablist">
              {[['services', 'Services'], ['supplies', 'Supplies'], ['workshops', 'Workshops'], ['pages', 'Pages']].map(([k, label]) => (
                <button key={k} type="button" role="tab" aria-selected={tab === k} className={`adm-chip${tab === k ? ' active' : ''}`} onClick={() => setTab(k)}>{label} ({offered(k)}/{catalog[k].length})</button>
              ))}
            </div>
            <div className="adm-offer-tools">
              <span className="adm-offer-search"><Search size={16} aria-hidden="true" /><input type="search" placeholder="Search…" aria-label="Search services" value={query} onChange={(e) => setQuery(e.target.value)} /></span>
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setAll(true, shown.map((e) => String(e.id)))}>Turn all on</button>
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setAll(false, shown.map((e) => String(e.id)))}>Turn all off</button>
            </div>
            {groups.map(([g, list]) => (
              <div key={g} className="adm-offer-group">
                <h4>{g} <span className="adm-muted adm-small">({list.filter((e) => isOn(e.id)).length}/{list.length})</span></h4>
                <div className="adm-check-grid">
                  {list.map((e) => (
                    <label key={e.id} className={`adm-check${e.item.about ? ' adm-check--about' : ''}`}>
                      <input type="checkbox" checked={isOn(e.id)} onChange={() => toggle(e.id)} />
                      <span>
                        {e.item.title}{e.item.everywhere && <span className="adm-tag" title="Meant for every city (e.g. NRI services)">every city</span>}
                        {e.item.about && <span className="adm-muted adm-small" style={{ display: 'block' }}>{e.item.about}</span>}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {tab === 'pages'
              ? <p className="adm-hint">Unticked = the page leaves the menus, the phone home page, the app and the Chat Buddy for this city, and anyone who opens it sees “Not in {c.name || 'this city'} yet” with this city's phone number. Property guides follow Andhra Pradesh rules and the tours start from Ongole — untick them for a city in another state until you have its own. College Admissions and Home Tuitions are under Services → Education.</p>
              : <p className="adm-hint">Ticked = customers in this city see it. New services you add later are on in every city until you untick them here. “Turn all off” keeps services marked “every city”.</p>}
          </fieldset>

          <div className="adm-sticky-actions adm-row">
            <button type="submit" className="adm-btn" disabled={busy}>{busy ? 'Saving…' : entry.isNew ? 'Add city' : 'Save city'}</button>
            <button type="button" className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </aside>
    </>
  )
}

/* ─────────────── Check where a place falls ─────────────── */
function LocationTester({ cities }) {
  const [text, setText] = useState('')
  const pos = parseLatLng(text)
  const r = pos ? locate(pos.lat, pos.lng, cities) : null
  return (
    <section className="adm-card adm-mt">
      <div className="adm-card-head"><h3><Navigation size={16} /> Check a location</h3></div>
      <p className="adm-muted adm-small" style={{ marginTop: 0 }}>Paste a Google Maps link or “lat, lng” to see which city and town a customer there would get.</p>
      <input className="adm-select" value={text} onChange={(e) => setText(e.target.value)} placeholder="15.2160, 79.9040" aria-label="Location to check" />
      {text.trim() && (
        <p className="adm-hint" role="status">
          {!pos ? 'Not readable yet' : r.inside ? `✓ ${r.city.name}${r.town ? ` — nearest town ${r.town}` : ''} (${r.km} km)` : r.soon ? `“${r.soon.name}” is coming soon here` : `Outside every live city${r.nearest ? ` — nearest: ${r.nearest.city.name}, about ${r.nearest.km} km` : ''}`}
        </p>
      )}
    </section>
  )
}

/* ─────────────── "Not in your city yet?" requests ─────────────── */
function CityRequests() {
  const { addToast } = useToast()
  const [rows, setRows] = useState(undefined)
  const load = () => api.admin.listCityRequests?.().then(setRows).catch(() => setRows(null))
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const groups = useMemo(() => {
    const m = new Map()
    ;(rows || []).forEach((r) => { const k = String(r.city_name || '').trim().toLowerCase(); if (!m.has(k)) m.set(k, { name: r.city_name, count: 0 }); m.get(k).count++ })
    return [...m.values()].sort((a, b) => b.count - a.count)
  }, [rows])

  const del = async (r) => {
    if (!window.confirm(`Delete the request from ${r.name || r.phone || 'this visitor'} (${r.city_name})?`)) return
    try { await api.admin.deleteCityRequest(r.id); setRows((x) => x.filter((y) => y.id !== r.id)) } catch (err) { addToast(err.message || 'Could not delete', 'error') }
  }
  const csv = () => {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const lines = [['When', 'City', 'Name', 'Phone', 'Note', 'From'].join(',')].concat((rows || []).map((r) => [fullDate(r.created_at), r.city_name, r.name, r.phone, r.note, r.source].map(esc).join(',')))
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' }))
    a.download = 'inempower-city-requests.csv'
    a.click()
  }

  return (
    <section className="adm-card adm-mt">
      <div className="adm-card-head">
        <h3><MessageCircle size={16} /> “Not in your city yet?” requests</h3>
        {rows?.length > 0 && <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={csv}><Download size={14} /> CSV</button>}
      </div>
      {rows === undefined ? <p className="adm-muted">Loading…</p> : rows === null ? (
        <p className="adm-hint adm-warn-text">Run <code>supabase/013_cities.sql</code> to keep these requests. (Until then they arrive as normal requests named “New city request”.)</p>
      ) : rows.length === 0 ? <p className="adm-muted">No requests yet. Visitors outside your cities can ask from the city window on the website and app.</p> : (
        <>
          <div className="adm-tag-row" style={{ marginBottom: '0.75rem' }}>
            {groups.map((g) => <span key={g.name} className="adm-tag">{g.name} · {g.count}</span>)}
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>When</th><th>City</th><th>Name</th><th>Phone</th><th /></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td data-label="When">{fullDate(r.created_at)}</td>
                    <td data-label="City"><strong>{r.city_name}</strong>{r.note && <span className="adm-muted adm-block adm-small">{r.note}</span>}</td>
                    <td data-label="Name">{r.name || <span className="adm-muted">—</span>}</td>
                    <td data-label="Phone">{r.phone ? (
                      <a className="adm-link" href={whatsappLink(r.phone, `Namaste${r.name ? ` ${r.name}` : ''} 🙏 You asked us to tell you when iN Empower starts in ${r.city_name}. — Team iN Empower`)} target="_blank" rel="noreferrer">{showPhone(r.phone)}</a>
                    ) : <span className="adm-muted">—</span>}</td>
                    <td className="adm-actions"><button className="adm-icon-btn" onClick={() => del(r)} aria-label="Delete"><Trash2 size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
