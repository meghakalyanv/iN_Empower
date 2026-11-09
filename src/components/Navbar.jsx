import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { api } from '../services/api'
import { useLanguage, LanguageSwitch } from '../context/LanguageContext'
import CityChip from './CityChip'
import { isPathOn } from '../data/cities'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const { pathname } = useLocation()
  const { t } = useLanguage()

  useEffect(() => {
    api.getCurrentUser().then((u) => setSignedIn(!!u)).catch(() => setSignedIn(false))
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setMenuOpen(prev => !prev)
    document.body.style.overflow = !menuOpen ? 'hidden' : ''
  }

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  const navItems = [
    { to: '/', label: t('navHome') },
    { to: '/tutor', label: t('navTutor'), bold: true },
    { to: '/services', label: t('navServices') },
    { to: '/supplies', label: t('navSupplies'), bold: true },
    { to: '/property', label: t('navProperty'), bold: true },
    { to: '/youth-hub', label: t('navYouth'), bold: true },
    { to: '/travel', label: t('navTravel'), bold: true },
    signedIn ? { to: '/dashboard', label: t('navDashboard'), bold: true } : { to: '/login', label: t('navLogin'), bold: true },
  ].filter((item) => isPathOn(item.to)) // pages this city has switched off are left out

  return (
    <>
      <nav className={`navbar kalamkari-border-bottom${scrolled ? ' scrolled' : ''}`} id="navbar">
        <div className="container">
          {/* Logo, with the customer's city under it (📍 tap to change) */}
          <div className="nav-brand">
            <Link to="/" className="nav-logo">i<span>N</span> Empower</Link>
            <CityChip className="city-chip--mini" />
          </div>
          <div className="nav-links">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                style={item.bold ? { fontWeight: 600 } : undefined}
                className={({ isActive }) => isActive ? 'active' : ''}
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
            <LanguageSwitch />
            <Link to="/contact" className="btn btn-primary btn-sm">{t('getStarted')}</Link>
          </div>
          <button
            className={`hamburger${menuOpen ? ' active' : ''}`}
            aria-label="Menu"
            onClick={toggleMenu}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? ' active' : ''}`}>
        <button className="close-menu" aria-label="Close" onClick={closeMenu}>&times;</button>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={item.bold ? { fontWeight: 600 } : undefined}
            onClick={closeMenu}
            end={item.to === '/'}
          >
            {item.label}
          </NavLink>
        ))}
        <CityChip style={{ alignSelf: 'center' }} onOpen={closeMenu} />
        <LanguageSwitch style={{ alignSelf: 'center' }} />
        <Link to="/contact" className="btn btn-primary" onClick={closeMenu}>{t('getStarted')}</Link>
      </div>
    </>
  )
}

