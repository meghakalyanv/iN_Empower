import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { teamPhoneShown, telHref, waHref, isPathOn } from '../data/cities'
import servicesData from '../data/servicesData'
import { ReplayTutorial } from './Tutorial'

// Service groups the customer's city offers (Admin → Cities)
const hasGroup = (cat) => servicesData.some((s) => s.category === cat)

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">i<span>N</span> Empower</div>
            <p>{t('ftAbout')}</p>
          </div>
          <div className="footer-col">
            <h4>{t('ftLinks')}</h4>
            <Link to="/">{t('navHome')}</Link>
            <Link to="/services">{t('navServices')}</Link>
            {isPathOn('/supplies') && <Link to="/supplies">{t('navSupplies')}</Link>}
            {isPathOn('/property') && <Link to="/property">{t('navProperty')}</Link>}
            <Link to="/contact">{t('ctTitle')}</Link>
            <Link to="/become-a-buddy">{t('mhEarn')}</Link>
            <Link to="/become-a-partner">{t('ftPartner')}</Link>
            <Link to="/privacy">{t('ftPrivacy')}</Link>
            <Link to="/terms">{t('ftTerms')}</Link>
            <Link to="/complaints">{t('ftComplaints')}</Link>
            <ReplayTutorial />
          </div>
          <div className="footer-col">
            <h4>{t('ftTop')}</h4>
            {[['identity', 'ftIdentity'], ['revenue', 'ftPropertySvc'], ['rto', 'ftRto'], ['startup', 'ftStartup'], ['drivers', 'ftPro']]
              .filter(([cat]) => hasGroup(cat))
              .map(([cat, key]) => <Link key={cat} to={`/services#${cat}`}>{t(key)}</Link>)}
          </div>
          <div className="footer-col">
            <h4>{t('ctTitle')}</h4>
            {/* The number of the customer's city (Admin → Cities) */}
            <a href={waHref()} target="_blank" rel="noreferrer">{t('ftWhatsApp')}</a>
            <a href={telHref()}>{teamPhoneShown()}</a>
            <a>{t('ftPlace')}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 iN Empower. {t('ftRights')}</p>
        </div>
      </div>
    </footer>
  )
}
