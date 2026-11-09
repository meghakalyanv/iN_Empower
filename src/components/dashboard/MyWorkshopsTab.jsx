import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userRequests } from '../../services/userRequests'
import { useStrings } from '../../context/LanguageContext'
import { DASH_TEXT, statusText } from './dashText'
import { isPageOn } from '../../data/cities'

export default function MyWorkshopsTab() {
  const [workshops, setWorkshops] = useState([])
  const navigate = useNavigate()
  const { t, lang } = useStrings(DASH_TEXT)

  useEffect(() => {
    let active = true
    userRequests.getByType('workshop').then((list) => { if (active) setWorkshops(list) })
    return () => { active = false }
  }, [])

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Submitted': return { bg: 'rgba(255, 153, 51, 0.12)', color: '#cc6600', label: t('wsSubmitted') }
      case 'In Review': return { bg: 'rgba(56, 182, 255, 0.12)', color: '#0077cc', label: t('wsReview') }
      case 'Confirmed': return { bg: 'rgba(19, 136, 8, 0.12)', color: '#138808', label: t('st:Confirmed') }
      default: return { bg: 'var(--border)', color: 'var(--text-secondary)', label: statusText(t, status) }
    }
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Map workshop names to icons
  const getWorkshopIcon = (title) => {
    const t = title.toLowerCase()
    if (t.includes('farming')) return '🌾'
    if (t.includes('electric')) return '⚡'
    if (t.includes('diet') || t.includes('nutrition')) return '🥗'
    if (t.includes('yoga') || t.includes('wellness')) return '🧘'
    if (t.includes('finance')) return '💰'
    return '🎓'
  }

  if (workshops.length === 0) {
    return (
      <div className="dashboard-tab-content fade-in">
        <h2>{t('workshops')}</h2>
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
          marginTop: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{t('noWs')}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            {t('noWsText')}
          </p>
          {isPageOn('youth') && <button className="btn btn-primary btn-sm" onClick={() => navigate('/youth-hub?tab=workshops')}>
            {t('exploreWs')}
          </button>}
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-tab-content fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{t('workshops')}</h2>
        {isPageOn('youth') && <button className="btn btn-outline btn-sm" onClick={() => navigate('/youth-hub?tab=workshops')}>{t('browseWs')}</button>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {workshops.map(ws => {
          const statusStyle = getStatusStyle(ws.status)
          return (
            <div key={ws.id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0
                }}>
                  {getWorkshopIcon(ws.title)}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{ws.title}</h4>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {t('registeredOn', { date: formatDate(ws.date) })}
                  </p>
                </div>
              </div>
              <span style={{
                fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: statusStyle.bg, color: statusStyle.color,
                display: 'inline-block'
              }}>
                {statusStyle.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
