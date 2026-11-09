import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userRequests } from '../../services/userRequests'
import { api } from '../../services/api'
import { useStrings } from '../../context/LanguageContext'
import { DASH_TEXT, statusText } from './dashText'
import { telHref, teamPhoneShown, isPageOn } from '../../data/cities'
import { TourTips } from '../Tutorial'

export default function MyRequestsTab() {
  const [requests, setRequests] = useState([])
  const [openId, setOpenId] = useState(null)
  const navigate = useNavigate()
  const { t, lang } = useStrings(DASH_TEXT)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    userRequests.getByType('service', 'apply-job', 'post-job').then((list) => {
      if (!active) return
      setRequests(list)
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  const getTypeBadge = (type) => {
    if (type === 'apply-job') return { label: t('bApplied'), bg: 'rgba(56, 182, 255, 0.12)', color: '#0077cc' }
    if (type === 'post-job') return { label: t('bPosted'), bg: 'rgba(19, 136, 8, 0.12)', color: '#138808' }
    if (type === 'service') return { label: t('bService'), bg: 'rgba(255, 153, 51, 0.12)', color: '#cc6600' }
    return { label: t('bRequest'), bg: 'var(--border)', color: 'var(--text-secondary)' }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Submitted': return { bg: 'rgba(255, 153, 51, 0.12)', color: '#cc6600' }
      case 'In Review': return { bg: 'rgba(56, 182, 255, 0.12)', color: '#0077cc' }
      case 'Confirmed': return { bg: 'rgba(19, 136, 8, 0.12)', color: '#138808' }
      default: return { bg: 'var(--border)', color: 'var(--text-secondary)' }
    }
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="dashboard-tab-content fade-in">
        <h2>{t('requests')}</h2>
        <div aria-busy="true" style={{ display: 'grid', gap: '0.75rem', marginTop: '2rem' }}>
          <span className="sr-only">{t('loadingReq')}</span>
          {[0, 1, 2].map((i) => <div key={i} className="kk-shimmer" style={{ height: 72 }} />)}
        </div>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="dashboard-tab-content fade-in">
        <h2>{t('requests')}</h2>
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
          marginTop: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{t('noReq')}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            {t('noReqText')}
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/services')}>
            {t('browseArrow')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-tab-content fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{t('requests')}</h2>
        {isPageOn('youth') && <button className="btn btn-outline btn-sm" onClick={() => navigate('/youth-hub?tab=jobs')}>{t('browseJobs')}</button>}
      </div>

      {/* Pointer (owner, 2 Nov 2026): each request and its stage */}
      <TourTips tips={[{ id: 'web-requests-card', target: '.my-req-card', place: 'below' }]} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {requests.map(req => {
          const typeBadge = getTypeBadge(req.type)
          const statusStyle = getStatusStyle(req.status)
          return (
            <div key={req.id} className="glass-card my-req-card" style={{ padding: '1.25rem 1.5rem' }}>
            <div
              role={req.type !== 'post-job' ? 'button' : undefined}
              tabIndex={req.type !== 'post-job' ? 0 : undefined}
              aria-expanded={req.type !== 'post-job' ? openId === req.id : undefined}
              onClick={() => req.type !== 'post-job' && setOpenId(openId === req.id ? null : req.id)}
              onKeyDown={(e) => e.key === 'Enter' && req.type !== 'post-job' && setOpenId(openId === req.id ? null : req.id)}
              style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '1rem', cursor: req.type !== 'post-job' ? 'pointer' : 'default'
            }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <h4 style={{ margin: 0 }}>{req.title}</h4>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    background: typeBadge.bg, color: typeBadge.color,
                    textTransform: 'uppercase', letterSpacing: '0.03em'
                  }}>{typeBadge.label}</span>
                </div>
                {req.details && (
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.details}</p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  fontSize: '0.78rem', fontWeight: 600, padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: statusStyle.bg, color: statusStyle.color
                }}>{statusText(t, req.status)}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatDate(req.date)}</span>
                {req.type !== 'post-job' && <span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>{openId === req.id ? '▲' : '▼'}</span>}
              </div>
            </div>
            {openId === req.id && <RequestTimeline request={req} formatDate={formatDate} t={t} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Full message + what has happened so far on one request. */
function RequestTimeline({ request, formatDate, t }) {
  const [entries, setEntries] = useState(null)
  useEffect(() => {
    let active = true
    api.getRequestTimeline(request.id).then((rows) => active && setEntries(rows || [])).catch(() => active && setEntries([]))
    return () => { active = false }
  }, [request.id])

  const all = [{ id: 'sent', kind: 'created', text: t('youSent'), date: request.date }, ...(entries || [])].reverse()
  const icon = (k) => (k === 'update' ? '💬' : k === 'assignment' ? '🤝' : k === 'status' ? '🔄' : '📨')

  return (
    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
      {request.message && (
        <p style={{ whiteSpace: 'pre-wrap', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', fontSize: '0.9rem', margin: '0 0 1rem' }}>{request.message}</p>
      )}
      <h5 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{t('progress')}</h5>
      {entries === null ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('loadingShort')}</p>
      ) : (
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {all.map((e) => (
            <li key={e.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0' }}>
              <span aria-hidden="true">{icon(e.kind)}</span>
              <div>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                  {e.kind === 'update' && <strong>{t('fromUs')}</strong>}{e.text}
                </p>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatDate(e.date)}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.75rem 0 0' }}>
        {t('questions')} <a href={telHref()}>{teamPhoneShown()}</a>.
      </p>
    </div>
  )
}
