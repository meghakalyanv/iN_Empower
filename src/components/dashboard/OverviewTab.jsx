import { useState, useEffect } from 'react'
import { userRequests } from '../../services/userRequests'
import { useStrings } from '../../context/LanguageContext'
import { DASH_TEXT, statusText } from './dashText'

export default function OverviewTab({ setActiveTab, user }) {
  const [counts, setCounts] = useState({ serviceRequests: 0, jobApplications: 0, jobPostings: 0, workshops: 0 })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const { t, lang } = useStrings(DASH_TEXT)

  useEffect(() => {
    let active = true
    userRequests.getAll().then((all) => {
      if (!active) return
      setCounts(userRequests.countRequests(all))
      setRecentActivity(all.slice(0, 5))
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  const formatDate = (iso) => {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now - d
    const diffMins = Math.floor(diffMs / 60000)
    const diffHrs = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return t('justNow')
    if (diffMins < 60) return t('minAgo', { n: diffMins })
    if (diffHrs < 24) return t('hrAgo', { n: diffHrs })
    if (diffDays < 7) return t(diffDays > 1 ? 'daysAgo' : 'dayAgo', { n: diffDays })
    return d.toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'short' })
  }

  const getActivityIcon = (type) => {
    if (type === 'apply-job') return '📄'
    if (type === 'post-job') return '📢'
    if (type === 'workshop') return '🎓'
    return '📋'
  }

  const getActivityLabel = (type) => {
    if (type === 'apply-job') return t('actApply')
    if (type === 'post-job') return t('actPost')
    if (type === 'workshop') return t('actWorkshop')
    return t('actService')
  }

  const statCards = [
    { key: 'serviceRequests', label: t('stService'), icon: '📋', tab: 'requests', bg: 'var(--accent-teal-light)', color: 'var(--accent-teal-dark)' },
    { key: 'jobApplications', label: t('stApply'), icon: '📄', tab: 'requests', bg: 'var(--accent-blue-light)', color: 'var(--accent-blue)' },
    { key: 'workshops', label: t('stWorkshop'), icon: '🎓', tab: 'workshops', bg: 'var(--accent-gold-light)', color: 'var(--accent-gold)' },
    { key: 'jobPostings', label: t('stPost'), icon: '📢', tab: 'requests', bg: 'var(--accent-teal-light)', color: 'var(--accent-teal-dark)' },
  ]

  return (
    <div className="dashboard-tab-content fade-in">
      <h2>{t('welcome', { name: user?.name ? user.name.split(' ')[0] : t('you') })}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t('summary')}</p>

      <div className="dashboard-grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
        {statCards.map((card) => (
          <div
            key={card.key}
            className="dashboard-stat-card"
            onClick={() => setActiveTab && setActiveTab(card.tab)}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-icon" style={{ background: card.bg, color: card.color }}>{card.icon}</div>
            <div className="stat-details">
              <h3>{loading ? '–' : counts[card.key]}</h3>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>{t('recent')}</h3>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>{t('loadingShort')}</p>
        ) : recentActivity.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '3rem 2rem',
            background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)'
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t('noActivity')}
            </p>
          </div>
        ) : (
          <div className="activity-list">
            {recentActivity.map(item => (
              <div className="activity-item" key={item.id}>
                <div className="activity-icon">{getActivityIcon(item.type)}</div>
                <div className="activity-text">
                  <h4>{item.title}</h4>
                  <p>{getActivityLabel(item.type)} • {t('status')}: <strong>{statusText(t, item.status)}</strong></p>
                </div>
                <div className="activity-time">{formatDate(item.date)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
