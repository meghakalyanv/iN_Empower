import { useNavigate } from 'react-router-dom'
import ToyIcon from './ToyIcon'
import { toyUrl } from '../utils/toyArt'
import { useLanguage } from '../context/LanguageContext'
import { svcText } from '../data/servicesTe'

export default function ServiceCard({ service, onClick }) {
  const navigate = useNavigate()
  const { lang, t } = useLanguage()

  const handleClick = () => {
    if (service.customLink) {
      navigate(service.customLink)
    } else if (onClick) {
      onClick(service)
    }
  }

  return (
    <div className="service-card-clean" onClick={handleClick}>
      <div className="service-card-clean-header">
        {/* Its own Etikoppaka toy, the same as in the app (owner, 30 Oct 2026) */}
        <div className={`service-card-clean-icon${toyUrl(service) ? ' has-toy' : ''}`}>
          <ToyIcon item={service} size={toyUrl(service) ? 58 : 48} />
        </div>
        <h4 className="service-card-clean-title">{svcText(lang, service.title)}</h4>
      </div>
      <div className="service-card-clean-body">
        <p className="service-card-clean-subtitle" style={{ flexGrow: 1 }}>{svcText(lang, service.subtitle)}</p>
                <button 
          className="btn btn-service-action btn-sm" 
          style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
        >
          <span>{service.buttonText || (service.customLink ? t('svBtnDetails') : (service.sections ? (['identity', 'mro', 'rto', 'municipal', 'collector', 'startup', 'revenue'].includes(service.category) ? t('svBtnReq') : t('svBtnDetails')) : t('svBtnBook')))}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '4px'}}>
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  )
}


