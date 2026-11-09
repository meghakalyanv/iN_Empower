import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Search, Building2, MapPin, Briefcase, GraduationCap, CheckCircle2, Home as HomeIcon, Package } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { useLanguage, LanguageSwitch } from '../context/LanguageContext'
import CityChip from '../components/CityChip'
import { isPathOn } from '../data/cities'
import { TourTips, ReplayTutorial } from '../components/Tutorial'

const QUICK = [
  { to: '/services', key: 'mhGov', Icon: Building2, bg: 'var(--accent-teal-light)', fg: 'var(--accent-teal-dark)' },
  { to: '/property', key: 'mhProperty', Icon: HomeIcon, bg: 'var(--accent-blue-light)', fg: 'var(--accent-blue)' },
  { to: '/supplies', key: 'mhSupplies', Icon: Package, bg: 'var(--accent-gold-light)', fg: '#B45309' },
  { to: '/travel', key: 'mhTravel', Icon: MapPin, bg: 'var(--accent-blue-light)', fg: 'var(--accent-blue)' },
  { to: '/home-tuitions', key: 'mhTuition', Icon: GraduationCap, bg: 'var(--accent-gold-light)', fg: '#B45309' },
  { to: '/youth-hub', key: 'mhYouth', Icon: Briefcase, bg: 'var(--accent-purple-light)', fg: 'var(--accent-purple)' },
]

export default function MobileHome() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  // Hide global navbar/footer on mobile home
  useEffect(() => {
    document.body.classList.add('mobile-home-active')
    return () => {
      document.body.classList.remove('mobile-home-active')
    }
  }, [])

  return (
    <div className="mobile-home">
      {/* Pointers (owner, 2 Nov 2026): search, the choices, Chat Buddy */}
      <TourTips tips={[
        { id: 'web-home-search', target: '.mobile-home .search-bar-glass', place: 'below' },
        { id: 'web-home-grid', target: '.mobile-home .mobile-grid', place: 'above' },
        { id: 'web-chat-fab', target: '#chatbuddy-fab', place: 'above' },
      ]} />
      {/* 1. Hero & Trust Setup */}
      <div className="mobile-hero">
        <div className="mobile-hero-bg"></div>
        <div className="mobile-hero-content">
          {/* City (📍 tap to change) and language, like the city picker in ticket apps */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <CityChip />
            <LanguageSwitch />
          </div>
          <div className="trust-badge-mobile">
            <ShieldCheck size={16} className="text-teal" />
            <span>{t('mhBadge')}</span>
          </div>
          <h1>{t('mhTitle1')}<br/><span className="text-gradient">{t('mhTitle2')}</span></h1>

          <form
            className="search-bar-glass"
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              const q = new FormData(e.currentTarget).get('q')?.toString().trim()
              navigate(q ? `/services?q=${encodeURIComponent(q)}` : '/services')
            }}
          >
            <Search size={22} className="text-muted" />
            <input type="search" name="q" enterKeyHint="search" placeholder={t('mhSearch')} aria-label={t('mhSearch')} />
          </form>
        </div>
      </div>

      {/* 2. Action Grid */}
      <div className="mobile-section">
        <h2 className="mobile-section-title">{t('mhQuick')}</h2>
        <div className="mobile-grid">
          {QUICK.filter(({ to }) => isPathOn(to)).map(({ to, key, Icon, bg, fg }) => (
            <Link key={to} to={to} className="mobile-action-card">
              <div className="mac-icon" style={{ background: bg, color: fg }}>
                <Icon size={28} />
              </div>
              <span>{t(key)}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Trust Card */}
      <div className="mobile-section">
        <ScrollReveal className="trust-card-glass">
          <div className="tc-header">
            <ShieldCheck size={32} className="text-gold" />
            <h3>{t('mhPeace')}</h3>
          </div>
          <p>{t('mhPeaceText')}</p>
          <ul className="trust-list">
            <li><CheckCircle2 size={18} className="text-teal" /> {t('mhT1')}</li>
            <li><CheckCircle2 size={18} className="text-teal" /> {t('mhT2')}</li>
            <li><CheckCircle2 size={18} className="text-teal" /> {t('mhT3')}</li>
          </ul>
        </ScrollReveal>
      </div>

      {/* 4. How It Works (Horizontal Scroll) */}
      <div className="mobile-section">
        <h2 className="mobile-section-title">{t('mhHow')}</h2>
        <div className="mobile-scroller" tabIndex={0} role="region" aria-label={t('mhHow')}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="step-glass-card">
              <div className="sgc-num">{n}</div>
              <h4>{t(`mhS${n}`)}</h4>
              <p>{t(`mhS${n}t`)}</p>
            </div>
          ))}
        </div>
        {/* The tutorial again (phones have no footer) */}
        <ReplayTutorial className="tut-again-home" />
      </div>

      {/* Become a buddy */}
      <div className="mobile-section">
        <Link to="/become-a-buddy" className="trust-card-glass" style={{ display: 'block', color: 'inherit' }}>
          <div className="tc-header"><Briefcase size={28} className="text-gold" /><h3>{t('mhEarn')}</h3></div>
          <p>{t('mhEarnText')} <strong>{t('mhApply')}</strong></p>
        </Link>
      </div>

      {/* 5. Our Promise (real reviews will go here after launch) */}
      <div className="mobile-section">
        <h2 className="mobile-section-title">{t('mhPromise')}</h2>
        <div className="mobile-reviews" tabIndex={0} role="region" aria-label={t('mhPromise')}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="review-card-mobile">
              <p><strong>{t(`mhP${n}`)}</strong> {t(`mhP${n}t`)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
