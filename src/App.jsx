import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import PageLoader from './components/PageLoader'
import NotInCity from './components/NotInCity'
import { isPathOn } from './data/cities'

// Pages outside the main layout that a city can switch off (Admin → Cities → Pages)
const CityGate = ({ path, children }) => (isPathOn(path) ? children : <NotInCity path={path} />)

// Every other page loads only when it is opened (smaller first download).
// Customers never download the team's admin pages.
const Tutor = lazy(() => import('./pages/Tutor'))
const Services = lazy(() => import('./pages/Services'))
const CollegeAdmissions = lazy(() => import('./pages/CollegeAdmissions'))
const HomeTuitions = lazy(() => import('./pages/HomeTuitions'))
const Travel = lazy(() => import('./pages/Travel'))
const YouthHub = lazy(() => import('./pages/YouthHub'))
const Supplies = lazy(() => import('./pages/Supplies'))
const Property = lazy(() => import('./pages/Property'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const PostJob = lazy(() => import('./pages/PostJob'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const DeleteAccount = lazy(() => import('./pages/DeleteAccount'))
const Complaints = lazy(() => import('./pages/Complaints'))
const NotFound = lazy(() => import('./pages/NotFound'))
const BecomeBuddy = lazy(() => import('./pages/BecomeBuddy'))
const BecomePartner = lazy(() => import('./pages/BecomePartner'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'))
const AdminRequests = lazy(() => import('./pages/admin/AdminRequests'))
const AdminJobs = lazy(() => import('./pages/admin/AdminJobs'))
const AdminBuddies = lazy(() => import('./pages/admin/AdminBuddies'))
const AdminProperties = lazy(() => import('./pages/admin/AdminProperties'))
const AdminPartners = lazy(() => import('./pages/admin/AdminPartners'))
const AdminMonitor = lazy(() => import('./pages/admin/AdminMonitor'))
const AdminReport = lazy(() => import('./pages/admin/AdminReport'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminCatalog = lazy(() => import('./pages/admin/AdminCatalog'))
const AdminWorkshops = lazy(() => import('./pages/admin/AdminWorkshops'))
const AdminCities = lazy(() => import('./pages/admin/AdminCities'))

export default function App() {
  return (
    <Suspense fallback={<PageLoader full />}>
    <Routes>
      {/* Handle legacy path */}
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route path="/youth-jobs" element={<Navigate to="/youth-hub?tab=jobs" replace />} />
      <Route path="/workshop" element={<Navigate to="/youth-hub?tab=workshops" replace />} />
      <Route path="/workshops" element={<Navigate to="/youth-hub?tab=workshops" replace />} />
      {/* Chat Buddy links */}
      <Route path="/about" element={<Navigate to="/#how-it-works" replace />} />
      <Route path="/how-it-works" element={<Navigate to="/#how-it-works" replace />} />

      {/* Pages with shared Navbar + Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/services" element={<Services />} />
        <Route path="/college-admissions" element={<CollegeAdmissions />} />
        <Route path="/home-tuitions" element={<HomeTuitions />} />
        <Route path="/supplies" element={<Supplies />} />
        <Route path="/property" element={<Property />} />
        {/* Property Investment is parked (pages/Invest.jsx kept for later) */}
        <Route path="/invest" element={<Navigate to="/property" replace />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/youth-hub" element={<YouthHub />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/become-a-buddy" element={<BecomeBuddy />} />
        <Route path="/become-a-partner" element={<BecomePartner />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        {/* Google Play: a web page to ask for account deletion without the app (owner, 2 Nov 2026) */}
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/complaints" element={<Complaints />} />
        
        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Standalone pages (no shared Navbar/Footer) */}
      <Route path="/login" element={<Login />} />
      <Route path="/post-job" element={<CityGate path="/post-job"><PostJob /></CityGate>} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Team admin panel (staff only) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="buddies" element={<AdminBuddies />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="partners" element={<AdminPartners />} />
        <Route path="monitor" element={<AdminMonitor />} />
        <Route path="report" element={<AdminReport />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="catalog" element={<AdminCatalog />} />
        <Route path="workshops" element={<AdminWorkshops />} />
        <Route path="cities" element={<AdminCities />} />
      </Route>
    </Routes>
    </Suspense>
  )
}

