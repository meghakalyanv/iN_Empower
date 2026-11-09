import { useMemo, useState } from 'react'
import { useOutletContext, useSearchParams, Link } from 'react-router-dom'
import { Plus, Search, ArrowUp, ArrowDown, Eye, EyeOff, Pencil } from 'lucide-react'
import { api } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import CatalogEditor from './CatalogEditor'
import { adminList, builtInList, orderIds, statusBadge, slug } from './catalogShared'
import { SERVICE_LABELS, prettify, matchesSearch } from './adminShared'
import { allCities } from '../../data/cities'

/** Services & Supplies: edit, hide, add and re-order what customers see on the website and app. */
export default function AdminCatalog() {
  const { catalogRows, catalogReady, saveCatalogRow, removeCatalogRow } = useOutletContext()
  const [params, setParams] = useSearchParams()
  const kind = params.get('tab') === 'supplies' ? 'supply' : 'service'
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [show, setShow] = useState('all')
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(null)
  const { addToast } = useToast()

  const all = useMemo(() => adminList(kind, catalogRows), [kind, catalogRows])
  const categories = useMemo(() => [...new Set(builtInList('service').map((s) => s.category))], [])
  const icons = useMemo(() => [...new Set(builtInList(kind).map((s) => s.icon).filter(Boolean))].sort(), [kind])

  const list = all.filter((e) =>
    (kind !== 'service' || !category || e.item.category === category) &&
    (show === 'all' || (show === 'hidden' ? e.status === 'hidden' : show === 'edited' ? !!e.row : e.status === 'live')) &&
    matchesSearch({ name: e.item.title, message: [e.item.subtitle, e.item.tagline, e.id, ...(e.item.sections || []).map((s) => s.heading)].join(' ') }, query))

  // Which cities leave an item out (Admin → Cities)
  const cities = allCities().filter((c) => c.status !== 'hidden')
  const hideKey = kind === 'service' ? 'services' : 'supplies'
  const notIn = (id) => cities.filter((c) => (c.hide?.[hideKey] || []).includes(String(id))).map((c) => c.name)
  const counts = { all: all.length, live: all.filter((e) => e.status === 'live').length, hidden: all.filter((e) => e.status === 'hidden').length, edited: all.filter((e) => e.row).length }

  const save = async (entry, { data, te, status }) => {
    const id = entry.row || !entry.isNew ? entry.id : uniqueId(slug(data.title), all.map((x) => x.id))
    try {
      await saveCatalogRow({ kind, item_id: id, data: { ...data, id }, te, status })
      addToast(status === 'live' ? 'Saved — customers see it now' : 'Saved (hidden from customers)')
      setEditing(null)
    } catch (err) {
      addToast(err.message || 'Could not save', 'error')
    }
  }

  const toggle = async (e) => {
    setBusy(e.id)
    try {
      await saveCatalogRow({ kind, item_id: e.id, data: { ...e.item, id: e.id }, te: e.row?.te || {}, status: e.status === 'live' ? 'hidden' : 'live' })
      addToast(e.status === 'live' ? `${e.item.title} hidden` : `${e.item.title} is live`)
    } catch (err) {
      addToast(err.message || 'Could not save', 'error')
    } finally {
      setBusy(null)
    }
  }

  const move = async (e, dir) => {
    const ids = orderIds(kind, catalogRows)
    // Swap with the neighbour that is visible in this list
    const visible = list.map((x) => x.id)
    const neighbour = visible[visible.indexOf(e.id) + dir]
    if (!neighbour) return
    const a = ids.indexOf(e.id); const b = ids.indexOf(neighbour)
    if (a === -1 || b === -1) return
    ;[ids[a], ids[b]] = [ids[b], ids[a]]
    setBusy(e.id)
    try {
      await saveCatalogRow({ kind: 'order', item_id: kind, data: { ids }, te: {}, status: 'live' })
    } catch (err) {
      addToast(err.message || 'Could not save the order', 'error')
    } finally {
      setBusy(null)
    }
  }

  const reset = async (entry) => {
    const msg = entry.isNew ? `Delete "${entry.item.title}"? This can't be undone.` : `Undo all your changes to "${entry.item.title}" and go back to the original?`
    if (!window.confirm(msg)) return
    try {
      await removeCatalogRow(kind, entry.id)
      addToast(entry.isNew ? 'Deleted' : 'Back to the original')
      setEditing(null)
    } catch (err) {
      addToast(err.message || 'Could not do that', 'error')
    }
  }

  const addNew = () => setEditing({
    id: '', isNew: true, status: 'hidden', row: null,
    item: kind === 'service'
      ? { title: '', subtitle: '', category: category || '', icon: 'Briefcase', iconColor: '#213361', sections: [{ heading: 'What do you need?', items: [] }, { heading: 'Documents Required', items: [] }] }
      : { title: '', tagline: '', description: '', icon: 'Package', iconColor: '#8B2127', beneficiaries: [], highlights: [], ordering: { unit: 'pieces', start: 1, step: 1, options: [] } },
  })

  if (!catalogReady) {
    return (
      <div className="adm-page">
        <header className="adm-page-head"><div><h1>Services & Supplies</h1></div></header>
        <div className="adm-card">
          <h3 style={{ marginTop: 0 }}>One step needed in Supabase</h3>
          <p>Open Supabase → SQL Editor → New query, paste everything from <code>supabase/010_catalog_workshops_jobs.sql</code> and press <strong>Run</strong>. Then press Refresh here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Services & Supplies</h1>
          <p className="adm-muted">Changes show on the website and the app straight away. New items start hidden until you make them live. Which cities offer each item: <Link className="adm-link" to="/admin/cities">Cities</Link>.</p>
        </div>
        <button className="adm-btn" onClick={addNew}><Plus size={16} /> Add {kind === 'service' ? 'service' : 'supply'}</button>
      </header>

      <div className="adm-chips" role="tablist">
        <button role="tab" aria-selected={kind === 'service'} className={`adm-chip${kind === 'service' ? ' active' : ''}`} onClick={() => { setParams({}); setCategory('') }}>Services</button>
        <button role="tab" aria-selected={kind === 'supply'} className={`adm-chip${kind === 'supply' ? ' active' : ''}`} onClick={() => { setParams({ tab: 'supplies' }); setCategory('') }}>Supplies</button>
      </div>

      <div className="adm-filters">
        <label className="adm-search">
          <Search size={16} />
          <input type="search" placeholder={kind === 'service' ? 'Search services…' : 'Search supplies…'} value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        {kind === 'service' && (
          <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{SERVICE_LABELS[c] || prettify(c)}</option>)}
          </select>
        )}
        <select value={show} onChange={(e) => setShow(e.target.value)} aria-label="Show">
          <option value="all">All ({counts.all})</option>
          <option value="live">Live ({counts.live})</option>
          <option value="hidden">Hidden ({counts.hidden})</option>
          <option value="edited">Changed by you ({counts.edited})</option>
        </select>
      </div>

      {list.length === 0 ? <div className="adm-card adm-empty">Nothing matches.</div> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>{kind === 'service' ? 'Service' : 'Supply'}</th><th>{kind === 'service' ? 'Category' : 'Ordering'}</th><th>Status</th>{cities.length > 1 && <th>Cities</th>}<th>Order</th><th></th></tr></thead>
            <tbody>
              {list.map((e, i) => {
                const b = statusBadge(e)
                return (
                  <tr key={e.id} onClick={() => setEditing(e)} tabIndex={0} onKeyDown={(ev) => ev.key === 'Enter' && setEditing(e)}>
                    <td data-label={kind === 'service' ? 'Service' : 'Supply'}>
                      <strong>{e.item.title}</strong>
                      <span className="adm-muted adm-block">{e.item.subtitle || e.item.tagline || ''}</span>
                    </td>
                    <td data-label={kind === 'service' ? 'Category' : 'Ordering'}>
                      {kind === 'service'
                        ? <>{SERVICE_LABELS[e.item.category] || prettify(e.item.category)}<span className="adm-muted adm-block">{(e.item.sections || []).length} steps</span></>
                        : <>{(e.item.ordering?.options || []).length} questions<span className="adm-muted adm-block">in {e.item.ordering?.unit || '—'}</span></>}
                    </td>
                    <td data-label="Status"><span className="adm-pill" style={{ color: b.color, background: b.bg }}>{b.label}</span></td>
                    {cities.length > 1 && (
                      <td data-label="Cities">{notIn(e.id).length ? <span className="adm-muted adm-small">Not in {notIn(e.id).join(', ')}</span> : <span className="adm-small">All cities</span>}</td>
                    )}
                    <td data-label="Order" className="adm-actions" onClick={(ev) => ev.stopPropagation()}>
                      <button className="adm-icon-btn" disabled={busy === e.id || i === 0} onClick={() => move(e, -1)} aria-label="Move up"><ArrowUp size={16} /></button>
                      <button className="adm-icon-btn" disabled={busy === e.id || i === list.length - 1} onClick={() => move(e, 1)} aria-label="Move down"><ArrowDown size={16} /></button>
                    </td>
                    <td className="adm-actions" onClick={(ev) => ev.stopPropagation()}>
                      <button className="adm-icon-btn" disabled={busy === e.id} onClick={() => toggle(e)} aria-label={e.status === 'live' ? 'Hide' : 'Make live'} title={e.status === 'live' ? 'Hide from customers' : 'Make live'}>
                        {e.status === 'live' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button className="adm-icon-btn" onClick={() => setEditing(e)} aria-label="Edit"><Pencil size={16} /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <CatalogEditor
          key={editing.id || 'new'}
          kind={kind}
          entry={editing}
          categories={categories}
          icons={icons}
          onClose={() => setEditing(null)}
          onSave={(v) => save(editing, v)}
          onReset={() => reset(editing)}
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
