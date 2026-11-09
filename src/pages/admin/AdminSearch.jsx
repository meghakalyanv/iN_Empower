import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { searchMatch, matchesSearch, isJobApplication, stageInfo, serviceLabel, prettify, jobFor, whenIST, partnerKindLabel } from './adminShared'
import { showPhone } from '../../data/phone'

const MAX = 6

/**
 * One search box for the whole admin portal (Ctrl + K): requests, job applicants,
 * Local Buddies, Business Partners, part-time jobs and properties — by name, mobile
 * number (typed any way), reference (IN-…, BP-…, BD-…), item, town or message.
 */
export default function AdminSearch({ data }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const box = useRef(null)
  const input = useRef(null)

  // Ctrl + K (or /) from anywhere jumps to the box
  useEffect(() => {
    const onKey = (ev) => {
      const typing = /input|textarea|select/i.test(ev.target?.tagName || '') || ev.target?.isContentEditable
      if (((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k') || (ev.key === '/' && !typing)) {
        ev.preventDefault()
        input.current?.focus()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  // Click outside closes the list
  useEffect(() => {
    const onDown = (ev) => { if (box.current && !box.current.contains(ev.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const groups = useMemo(() => {
    const query = q.trim()
    if (query.length < 2) return []
    const { enquiries = [], jobs = [], buddies = [], partners = [], properties = [] } = data
    const hits = enquiries.filter((e) => matchesSearch(e, query))
    const requests = hits.filter((e) => !isJobApplication(e)).map((e) => ({
      key: `r${e.id}`, title: e.name, pill: stageInfo(e),
      sub: [showPhone(e.phone), e.details?.ref, e.item || prettify(e.sub_service) || serviceLabel(e.service), whenIST(e.created_at)].filter(Boolean).join(' · '),
      to: `/admin/requests?id=${e.id}&status=all`,
    }))
    const applicants = hits.filter(isJobApplication).map((e) => {
      const job = jobFor(e, jobs)
      return {
        key: `a${e.id}`, title: e.name, pill: stageInfo(e),
        sub: [showPhone(e.phone), e.details?.ref, job ? `${job.job_title}${job.business_name ? ` at ${job.business_name}` : ''}` : (e.item || prettify(e.sub_service))].filter(Boolean).join(' · '),
        to: `/admin/jobs?applicant=${e.id}`,
      }
    })
    const buddyHits = buddies.filter((b) => searchMatch(query, [b.name, b.ref, b.email, b.town, b.areas, b.notes], [b.phone])).map((b) => ({
      key: `b${b.id}`, title: b.name, sub: [showPhone(b.phone), b.ref, prettify(b.town), b.status].filter(Boolean).join(' · '), to: `/admin/buddies?id=${b.id}`,
    }))
    const partnerHits = partners.filter((p) => searchMatch(query, [p.business_name, p.contact_name, p.ref, p.town, p.areas, p.gst_number, ...(p.items || [])], [p.phone, p.whatsapp])).map((p) => ({
      key: `p${p.id}`, title: p.business_name, sub: [p.contact_name, showPhone(p.phone), p.ref, partnerKindLabel(p.kind), p.status === 'pending' ? 'waiting for your check' : p.status].filter(Boolean).join(' · '), to: `/admin/partners?id=${p.id}`,
    }))
    const jobHits = jobs.filter((j) => searchMatch(query, [j.job_title, j.business_name, j.location, j.description], [j.contact_phone])).map((j) => ({
      key: `j${j.id}`, title: j.job_title, sub: [j.business_name, j.location, j.status].filter(Boolean).join(' · '), to: `/admin/jobs?job=${j.id}`,
    }))
    const propertyHits = properties.filter((x) => searchMatch(query, [x.title, x.location, x.town, x.ref, x.owner_name, x.description], [x.owner_phone, x.contact_phone])).map((x) => ({
      key: `h${x.id}`, title: x.title || 'Property', sub: [x.location || x.town, x.purpose, x.status].filter(Boolean).join(' · '), to: '/admin/properties',
    }))
    return [
      ['Requests', requests], ['Job applicants', applicants], ['Local Buddies', buddyHits],
      ['Business Partners', partnerHits], ['Part-time jobs', jobHits], ['Properties', propertyHits],
    ].filter(([, list]) => list.length).map(([label, list]) => ({ label, list: list.slice(0, MAX), more: list.length - MAX }))
  }, [q, data])

  const flat = groups.flatMap((g) => g.list)
  useEffect(() => { setActive(0) }, [q])

  const go = (item) => {
    if (!item) return
    navigate(item.to)
    setOpen(false)
    input.current?.blur()
  }
  const onKeyDown = (ev) => {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); setActive((a) => Math.min(flat.length - 1, a + 1)) }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
    else if (ev.key === 'Enter') { ev.preventDefault(); go(flat[active]) }
    else if (ev.key === 'Escape') { setOpen(false); input.current?.blur() }
  }

  let n = -1
  return (
    <div className="adm-gsearch" ref={box}>
      <label className="adm-search">
        <Search size={16} />
        <input
          ref={input}
          type="search"
          value={q}
          onChange={(ev) => { setQ(ev.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search everything: name, mobile, IN- / BP- number, item, town…"
          aria-label="Search the admin portal"
          aria-expanded={open && q.trim().length >= 2}
          autoComplete="off"
        />
        {q && <button type="button" className="adm-icon-btn" onClick={() => { setQ(''); input.current?.focus() }} aria-label="Clear search"><X size={15} /></button>}
        <kbd className="adm-kbd" aria-hidden="true">Ctrl K</kbd>
      </label>
      {open && q.trim().length >= 2 && (
        <div className="adm-gsearch-results" role="listbox">
          {groups.length === 0 ? (
            <p className="adm-muted adm-gsearch-empty">Nothing found for “{q.trim()}”. Try part of the name, the last digits of the number, or the reference.</p>
          ) : groups.map((g) => (
            <div key={g.label} className="adm-gsearch-group">
              <h5>{g.label}</h5>
              {g.list.map((item) => {
                n += 1
                const i = n
                return (
                  <button key={item.key} type="button" role="option" aria-selected={i === active}
                    className={`adm-gsearch-item${i === active ? ' active' : ''}`}
                    onMouseEnter={() => setActive(i)} onClick={() => go(item)}>
                    <span>
                      <strong>{item.title}</strong>
                      <span className="adm-muted adm-small adm-block">{item.sub}</span>
                    </span>
                    {item.pill && <span className="adm-pill" style={{ color: item.pill.color, background: item.pill.bg }}>{item.pill.label}</span>}
                  </button>
                )
              })}
              {g.more > 0 && <p className="adm-muted adm-small adm-gsearch-more">+{g.more} more — type more of the name or number</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
