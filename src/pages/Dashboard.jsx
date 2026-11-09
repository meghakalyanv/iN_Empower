import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../services/api'
import OverviewTab from '../components/dashboard/OverviewTab'
import MyRequestsTab from '../components/dashboard/MyRequestsTab'
import MyWorkshopsTab from '../components/dashboard/MyWorkshopsTab'
import { useStrings } from '../context/LanguageContext'
import { DASH_TEXT } from '../components/dashboard/dashText'
import PageLoader from '../components/PageLoader'
import { isPageOn } from '../data/cities'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const { t } = useStrings(DASH_TEXT)

  // Only signed-in users can see the dashboard
  useEffect(() => {
    document.title = 'My Dashboard | iN Empower'
    let active = true
    api.getCurrentUser().then((u) => {
      if (!active) return
      if (u) setUser(u)
      else navigate('/login?redirect=/dashboard', { replace: true })
    })
    return () => { active = false }
  }, [navigate])

  const handleLogout = async () => {
    await api.signOut()
    navigate('/')
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab setActiveTab={setActiveTab} user={user} />
      case 'requests': return <MyRequestsTab />
      case 'workshops': return <MyWorkshopsTab />
      default: return <OverviewTab setActiveTab={setActiveTab} user={user} />
    }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <PageLoader />
        <span className="sr-only">{t('loading')}</span>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-surface)', paddingTop: '80px' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="dashboard-layout">
          {/* Sidebar */}
          <div className="dashboard-sidebar">
            <div className="dashboard-user-card">
              <div className="dashboard-avatar">
                {getInitials(user.name)}
              </div>
              <div className="dashboard-user-info">
                <h4>{user.name}</h4>
                <p>{user.email}</p>
              </div>
            </div>
            
            <nav className="dashboard-nav">
              <button 
                className={activeTab === 'overview' ? 'active' : ''} 
                onClick={() => setActiveTab('overview')}
              >
                <span className="nav-icon">📊</span> {t('overview')}
              </button>
              <button 
                className={activeTab === 'requests' ? 'active' : ''} 
                onClick={() => setActiveTab('requests')}
              >
                <span className="nav-icon">📋</span> {t('requests')}
              </button>
              <button 
                className={activeTab === 'workshops' ? 'active' : ''} 
                onClick={() => setActiveTab('workshops')}
              >
                <span className="nav-icon">🎓</span> {t('workshops')}
              </button>
              
              {/* Youth Hub links, when the customer's city has the Youth Hub on */}
              {isPageOn('youth') && <>
              <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }}></div>
              
              <button 
                onClick={() => navigate('/youth-hub?tab=jobs')}
                style={{ color: 'var(--accent-teal-dark)' }}
              >
                <span className="nav-icon">💼</span> {t('jobs')}
              </button>
              <button 
                onClick={() => navigate('/youth-hub?tab=workshops')}
                style={{ color: 'var(--accent-teal-dark)' }}
              >
                <span className="nav-icon">📚</span> {t('workshopsLink')}
              </button>
              <button 
                onClick={() => navigate('/post-job')}
                style={{ color: 'var(--accent-teal-dark)' }}
              >
                <span className="nav-icon">📢</span> {t('postJob')}
              </button>
              </>}
              <button 
                onClick={() => navigate('/services')}
                style={{ color: 'var(--accent-teal-dark)' }}
              >
                <span className="nav-icon">🔍</span> {t('browse')}
              </button>
            </nav>
            
            <button 
              className="dashboard-logout"
              onClick={handleLogout}
            >
              <span className="nav-icon">🚪</span> {t('logout')}
            </button>
          </div>

          {/* Main Content Area */}
          <div className="dashboard-content">
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  )
}
