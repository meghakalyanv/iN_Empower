import { Outlet, useLocation } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import ChatBuddy from './ChatBuddy'
import BottomNav from './BottomNav'
import PageLoader from './PageLoader'
import { placeText, isPathOn } from '../data/cities'
import NotInCity from './NotInCity'
import { TutorialHost } from './Tutorial'

// Titles for pages that don't set their own (the others set it themselves)
const TITLES = {
  '/services': 'Services | iN Empower — Government & Professional Services in Prakasam District',
  '/college-admissions': 'College Admissions | iN Empower',
  '/home-tuitions': 'Home Tuitions | iN Empower',
  '/travel': 'Travel, Tours & Rentals | iN Empower',
  '/youth-hub': 'Youth Hub — Part-time Jobs & Workshops | iN Empower',
  '/contact': 'Contact Us | iN Empower — Prakasam District',
  '/privacy': 'Privacy Policy | iN Empower',
  '/terms': 'Terms of Service | iN Empower',
}

// One search/social description per page
const DESCRIPTIONS = {
  '/': 'Your verified Local Buddy in Prakasam District — certificates, RTO, land records, property, supplies and trusted professionals, with a clear quote before any work starts.',
  '/services': 'Birth and caste certificates, MRO and RTO work, municipal approvals, company registration, court follow-up, healthcare help and professional services in Prakasam District.',
  '/supplies': 'Granite, tiles, sand, cement, TMT bars, bricks, UPVC sheets, furniture, events and catering from checked suppliers, delivered across Prakasam District.',
  '/property': 'Buy, sell or rent property in Prakasam District with every paper checked first — title check, video site visits, registration and Power of Attorney help.',
  '/tutor': 'Learn why each government document matters and what you need to get it — simple guides from iN Empower.',
  '/college-admissions': 'Guidance for college admissions — courses, colleges, documents and deadlines — from iN Empower in Prakasam District.',
  '/home-tuitions': 'Verified home tutors in Prakasam District for school and intermediate students.',
  '/youth-hub': 'Part-time jobs and life-skills workshops for students and young people in Prakasam District.',
  '/travel': 'Tours, vehicle rentals and trip help from Prakasam District — Tirupati, Srisailam, Vizag and more.',
  '/become-a-buddy': 'Join iN Empower as a verified Local Buddy and earn by helping people in your area.',
  '/contact': 'Tell iN Empower what you need — call, WhatsApp or send a request, and our team will get back to you.',
  '/privacy': 'How iN Empower collects, uses and protects your personal information.',
  '/terms': 'The terms for using iN Empower services, the website and the app.',
}

export default function Layout() {
  const { pathname, hash } = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
    if (TITLES[pathname]) document.title = placeText(TITLES[pathname])
    const desc = placeText(DESCRIPTIONS[pathname] || DESCRIPTIONS['/'])
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://inempower.inempower.workers.dev${pathname === '/' ? '/' : pathname}`)
  }, [pathname])

  // Links like /#how-it-works: scroll to that section once the page has drawn
  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350)
    return () => clearTimeout(t)
  }, [pathname, hash])

  return (
    <div className="kalamkari-page-theme" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="main-content" style={{ flex: 1 }}>
        {/* Each page fades in; pages load only when opened */}
        <Suspense fallback={<PageLoader />}>
          <div key={pathname} className="page-enter">
            {/* Pages this city has switched off (Admin → Cities → Pages) */}
            {isPathOn(pathname) ? <Outlet /> : <NotInCity path={pathname} />}
          </div>
        </Suspense>
      </main>
      <div className="desktop-footer-wrapper">
        <Footer />
      </div>
      <ChatBuddy />
      <BottomNav />
      {/* The tutorial slides: first visit to Home, or "Show the tutorial again" */}
      <TutorialHost />
    </div>
  )
}
