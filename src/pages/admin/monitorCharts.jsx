import { useState } from 'react'
import { Link } from 'react-router-dom'
import { fmtMins, fmtDays, pctChange } from './monitorShared'
import { hoursText } from '../../data/workHours'

// Validated pair (dataviz check: lightness, chroma, colour-blind separation, contrast)
export const WEB = '#3B5BDB'
export const APP = '#D97706'

export function Kpi({ value, label, bad, good, to, sub }) {
  const cls = `adm-kpi${bad ? ' bad' : ''}${good ? ' good' : ''}`
  const inner = (<><strong>{value}</strong><span>{label}</span>{sub && <em className="adm-kpi-sub">{sub}</em>}</>)
  return to ? <Link to={to} className={cls} style={{ color: 'inherit' }}>{inner}</Link> : <div className={cls}>{inner}</div>
}

export function Legend() {
  return (
    <div className="adm-legend">
      <span><i style={{ background: WEB }} />Website</span>
      <span><i style={{ background: APP }} />App</span>
    </div>
  )
}

const fmtDay = (d) => new Date(`${d}T12:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })

/** Stacked bars per day (website + app) with a hover / tap tooltip */
export function StackedBars({ rows, unit, height = 160 }) {
  const [hover, setHover] = useState(null)
  if (!rows.length) return null
  const W = 720, H = height, padL = 28, padB = 18, padT = 6
  const max = Math.max(1, ...rows.map((r) => r.website + r.app))
  const nice = max <= 4 ? max : Math.ceil(max / 4) * 4
  const slot = (W - padL) / rows.length
  const bw = Math.max(2, Math.min(22, slot - 2))
  const y = (v) => H - padB - (v / nice) * (H - padB - padT)
  const ticks = nice <= 4 ? [...Array(nice + 1).keys()] : [0, nice / 4, nice / 2, (3 * nice) / 4, nice]
  const every = Math.ceil(rows.length / 7)
  const total = rows.reduce((a, r) => a + r.website + r.app, 0)
  const h = hover != null ? rows[hover] : null
  return (
    <div style={{ position: 'relative' }}>
      <svg className="adm-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${total} ${unit}s in total`} onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W} y1={y(t)} y2={y(t)} stroke="#E2E8F0" strokeWidth="1" />
            <text x={padL - 6} y={y(t) + 4} textAnchor="end">{t}</text>
          </g>
        ))}
        {rows.map((r, i) => {
          const x = padL + i * slot + (slot - bw) / 2
          const wTop = y(r.website), aTop = y(r.website + r.app)
          return (
            <g key={r.day} onMouseEnter={() => setHover(i)} onClick={() => setHover(i)}>
              <rect x={padL + i * slot} y={padT} width={slot} height={H - padB - padT} fill="transparent" />
              {r.website > 0 && <rect x={x} y={wTop} width={bw} height={H - padB - wTop} rx={r.app ? 0 : 3} fill={WEB} />}
              {r.app > 0 && <rect x={x} y={aTop} width={bw} height={Math.max(1, wTop - aTop - (r.website ? 2 : 0))} rx="3" fill={APP} />}
              {hover === i && <rect x={x - 2} y={padT} width={bw + 4} height={H - padB - padT} fill="#0F172A" opacity="0.05" />}
              {i % every === 0 && <text x={padL + i * slot + slot / 2} y={H - 4} textAnchor="middle">{fmtDay(r.day)}</text>}
            </g>
          )
        })}
      </svg>
      {h && (
        <div className="adm-tip">
          <strong>{fmtDay(h.day)}</strong> · {h.website + h.app} {unit}{h.website + h.app === 1 ? '' : 's'}<br />
          <span><i style={{ background: WEB }} />Website {h.website} · <i style={{ background: APP }} />App {h.app}</span>
        </div>
      )}
    </div>
  )
}

/** Horizontal bars; rows: [label, n] or { k, n, prev } (shows ▲/▼ against the period before) */
export function HBars({ rows, empty = 'Nothing yet.', trend = false, max: maxRows }) {
  const list = (maxRows ? rows.slice(0, maxRows) : rows).map((r) => (Array.isArray(r) ? { k: r[0], n: r[1] } : r))
  if (!list.length) return <p className="adm-empty">{empty}</p>
  const max = Math.max(...list.map((r) => r.n))
  return (
    <ul className="adm-hbars">
      {list.map((r) => (
        <li key={r.k} title={`${r.k}: ${r.n}`}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.k}</span>
          <span className="n">{r.n}{trend && <em className={`adm-trend ${r.n >= r.prev ? 'up' : 'down'}`}>{pctChange(r.n, r.prev)}</em>}</span>
          <span className="bar"><i style={{ width: `${(r.n / max) * 100}%` }} /></span>
        </li>
      ))}
    </ul>
  )
}

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
/** Busy times: weekday × 2-hour slot, one colour getting darker with more requests */
export function Heatmap({ heat, slots }) {
  const max = Math.max(1, ...heat.flat())
  return (
    <div className="adm-heat-wrap">
      <table className="adm-heat" aria-label="Requests by day of week and time of day (India time)">
        <thead><tr><th />{slots.map((s) => <th key={s} scope="col">{s}</th>)}</tr></thead>
        <tbody>
          {heat.map((row, d) => (
            <tr key={d}>
              <th scope="row">{WEEK[d]}</th>
              {row.map((n, i) => {
                const a = n ? 0.12 + 0.88 * (n / max) : 0
                return <td key={i} title={`${WEEK[d]} ${slots[i]}: ${n}`} style={{ background: n ? `rgba(0, 0, 128, ${a.toFixed(2)})` : '#F8FAFC', color: a > 0.55 ? '#fff' : '#334155' }}>{n || ''}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="adm-hint">Office hours are {hoursText()}. Darker = more requests.</p>
    </div>
  )
}

/** How far tickets get */
export function Funnel({ received, steps }) {
  return (
    <ol className="adm-funnel">
      <li><span>Received</span><span className="bar"><i style={{ width: '100%' }} /></span><strong>{received}</strong></li>
      {steps.map((s) => (
        <li key={s.key}>
          <span>{s.label}</span>
          <span className="bar"><i style={{ width: `${received ? (s.n / received) * 100 : 0}%` }} /></span>
          <strong>{s.n}<em>{received ? ` · ${Math.round((s.n / received) * 100)}%` : ''}</em></strong>
        </li>
      ))}
    </ol>
  )
}

/** Buddy / partner scorecard */
export function ScoreTable({ rows, linkKey, empty }) {
  if (!rows.length) return <p className="adm-empty">{empty}</p>
  return (
    <div className="adm-table-scroll">
      <table className="adm-mini-table adm-score">
        <thead><tr><th style={{ textAlign: 'left' }}>Name</th><th className="adm-num">Jobs</th><th className="adm-num">Open</th><th className="adm-num">Done</th><th className="adm-num">Late</th><th className="adm-num">On time</th><th className="adm-num">First call</th><th className="adm-num">Avg finish</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{linkKey ? <Link className="adm-link" to={`/admin/requests?${linkKey}=${r.id}&status=all`}>{r.name}</Link> : r.name}</td>
              <td className="adm-num">{r.total}</td>
              <td className="adm-num">{r.open}</td>
              <td className="adm-num">{r.done}</td>
              <td className="adm-num" style={r.late ? { color: '#B91C1C', fontWeight: 700 } : undefined}>{r.late}</td>
              <td className="adm-num">{r.onTimePct == null ? '—' : `${r.onTimePct}%`}</td>
              <td className="adm-num">{fmtMins(r.firstMins)}</td>
              <td className="adm-num">{fmtDays(r.avgDays)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
