import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams, useLocation } from 'react-router-dom'
import PageHero from '../components/PageHero'
import ScrollReveal from '../components/ScrollReveal'
import { subServices } from '../data/jobsData'
import { useLanguage } from '../context/LanguageContext'
import servicesData from '../data/servicesData'
import { SERVICE_OPTIONS } from '../data/contactData'
import { api } from '../services/api'
import { useToast } from '../context/ToastContext'
import { celebrate } from '../utils/celebrate'
import { afterHoursNote, isEmergency } from '../data/workHours'
import ConfirmRequest from '../components/ConfirmRequest'
import AutoGrowTextarea from '../components/AutoGrowTextarea'
import { currentCity, defaultCity, teamPhoneShown, teamWhatsApp, telHref, waHref, cityAddress } from '../data/cities'
import { readPhone, showPhone } from '../data/phone'

export default function Contact() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  
  // Try to load checklist from state first, then fallback to global/localStorage
  const checklistData = location.state?.checklist || window.serviceChecklist || JSON.parse(localStorage.getItem('service_checked_items') || '{}')
  const serviceName = location.state?.serviceName || 'a service'
  
  let initialMessage = ''
  if (Object.keys(checklistData).length > 0) {
    const readyItems = Object.keys(checklistData).filter(k => checklistData[k])
    const missingItems = Object.keys(checklistData).filter(k => !checklistData[k])
    
    initialMessage = `I would like to get started with ${serviceName}.\n\nChecklist Status:\n`
    if (readyItems.length > 0) {
      initialMessage += `\n[Ready]\n- ${readyItems.join('\n- ')}\n`
    }
    if (missingItems.length > 0) {
      initialMessage += `\n[Need Help With]\n- ${missingItems.join('\n- ')}\n`
    }
  }

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', service: '', subService: '', message: initialMessage
  })
  const [subOptions, setSubOptions] = useState([])
  const { t, lang } = useLanguage()
  const [showSubService, setShowSubService] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addToast } = useToast()

  // Auto-populate from URL params
  useEffect(() => {
    const serviceParam = searchParams.get('service')
    const subServiceParam = searchParams.get('subService')
    const nameParam = searchParams.get('name')
    const phoneParam = searchParams.get('phone')
    const messageParam = searchParams.get('message')

    setFormData(prev => ({
      ...prev,
      name: nameParam || prev.name,
      phone: phoneParam || prev.phone,
      message: messageParam || prev.message
    }))

    if (serviceParam) {
      setFormData(prev => ({ ...prev, service: serviceParam }))
      const options = subServices[serviceParam] ? [...subServices[serviceParam]] : []
      
      // If the subServiceParam isn't in the standard list, add it dynamically
      // This is necessary for highly specific options like "Home Tuition - Secondary - Math"
      if (subServiceParam) {
        const standardOptionExists = options.some(opt => {
          const val = typeof opt === 'string' ? opt.toLowerCase().replace(/[\s\/&()]+/g, '-') : opt.value;
          return val === subServiceParam || opt === subServiceParam;
        })
        if (!standardOptionExists) {
          const svc = servicesData.find(s => s.id === subServiceParam)
          options.push({ value: subServiceParam, label: svc ? svc.title : subServiceParam })
        }
      }

      if (options.length > 0) {
        setSubOptions(options)
        setShowSubService(true)
        if (subServiceParam) {
          setTimeout(() => {
            setFormData(prev => ({ ...prev, subService: subServiceParam.toLowerCase().replace(/[\s\/&()]+/g, '-') === subServiceParam ? subServiceParam : subServiceParam.toLowerCase().replace(/[\s\/&()]+/g, '-') }))
          }, 50)
        }
      }
    }
  }, [searchParams])

  // Signed-in customers: pre-fill their details
  useEffect(() => {
    api.getCurrentUser().then((u) => {
      if (!u) return
      setFormData(prev => ({
        ...prev,
        name: prev.name || u.name || '',
        phone: prev.phone || u.phone || '',
        email: prev.email || u.email || '',
      }))
    }).catch(() => {})
  }, [])

  const handleServiceChange = (e) => {
    const category = e.target.value
    setFormData(prev => ({ ...prev, service: category, subService: '' }))
    const options = subServices[category]
    if (options && options.length > 0) {
      setSubOptions(options)
      setShowSubService(true)
    } else {
      setSubOptions([])
      setShowSubService(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!readPhone(formData.phone).ok) {
      addToast(lang === 'te' ? 'దయచేసి సరైన మొబైల్ నంబర్ ఇవ్వండి (విదేశాల నుంచి: + మరియు దేశ కోడ్‌తో)' : 'Please enter a valid mobile number (from abroad: start with + and the country code)', 'error')
      return
    }
    setIsSubmitting(true)
    try {
      // Save the readable name (e.g. "Vehicle Registration (RC)"), not the internal option value
      const slug = (o) => (typeof o === 'string' ? o.toLowerCase().replace(/[\s\/&()]+/g, '-') : o.value)
      const chosen = subOptions.find((o) => slug(o) === formData.subService)
      const subServiceLabel = chosen ? (typeof chosen === 'string' ? chosen : chosen.label) : formData.subService
      await api.submitContactForm({ ...formData, subService: subServiceLabel })
      addToast(t('ctSent'))
      celebrate()
      // Outside office hours (or an emergency): say when we will call
      const note = afterHoursNote(lang === 'te' ? 'te' : 'en', { emergency: isEmergency({ ...formData, subService: subServiceLabel }) })
      if (note) addToast(note, 'info', 9000)
      setFormData({ name: '', phone: '', email: '', service: '', subService: '', message: '' })
      setShowSubService(false)
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Arriving with answers from another page (Property, Travel, Tutor, Chat Buddy, checklists):
  // show the short "Confirm your request" step instead of the long form.
  const flowMessage = searchParams.get('message') || (location.state?.checklist ? initialMessage : '')
  if (flowMessage) {
    const sub = searchParams.get('subService') || ''
    const svc = servicesData.find(s => s.id === sub)
    return (
      <ConfirmRequest
        key={flowMessage}
        service={searchParams.get('service') || ''}
        subService={sub}
        subLabel={svc ? svc.title : (location.state?.serviceName || sub)}
        message={flowMessage}
        name={searchParams.get('name') || ''}
        phone={searchParams.get('phone') || ''}
        jobId={searchParams.get('jobId') || ''}
      />
    )
  }

  return (
    <>
      <PageHero
        label={t('ctLabel')}
        title={t('ctTitle')}
        titleHighlight="iN Empower"
        description={t('ctHeroDesc')}
      />

      <section className="section-compact" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact-grid" style={{ gap: '2rem' }}>
            {/* Contact Info */}
            <ScrollReveal className="contact-info">
              <h2>{t('ctHelp1')} <span className="text-teal">{t('ctHelp2')}</span></h2>
              <p style={{ marginBottom: '2rem' }}>{t('ctIntro')}</p>
              <div className="contact-info-cards">
                <div className="contact-info-card">
                  <div className="ci-icon">📞</div>
                  <div>
                    <h4>{t('ctPhone')}</h4>
                    <p><a href={telHref()} style={{ color: 'inherit' }}>{teamPhoneShown()}</a></p>
                  </div>
                </div>
                <div className="contact-info-card">
                  <div className="ci-icon">💬</div>
                  <div>
                    <h4>WhatsApp</h4>
                    <p><a href={waHref()} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{showPhone(teamWhatsApp())}</a></p>
                  </div>
                </div>
                <div className="contact-info-card">
                  <div className="ci-icon">📍</div>
                  <div>
                    <h4>{currentCity().id === defaultCity().id ? t('ctHq') : (lang === 'te' ? 'కార్యాలయం' : 'Office')}</h4>
                    <p>{cityAddress()}<br />India<br /><span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>{t('ctServing')}</span></p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal delay={1} className="contact-form-container">
              <form className="glass-card" onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: '1.5rem' }}>{t('ctSend')}</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">{t('ctName')}</label>
                    <input type="text" id="name" required placeholder="John Doe"
                      value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">{t('ctPhoneNo')}</label>
                    <input type="tel" id="phone" required placeholder="+91 12345 67890"
                      value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t('ctEmailAddr')} <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '0.85em' }}>{t('ctOptional')}</span></label>
                  <input type="email" id="email" placeholder="john@example.com"
                    value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} />
                </div>

                <div className="form-group">
                  <label htmlFor="service">{t('ctService')}</label>
                  <select id="service" required value={formData.service} onChange={handleServiceChange}>
                    <option value="" disabled>{t('ctPickService')}</option>
                    {SERVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{(lang === 'te' && o.te) || o.label}</option>)}
                  </select>
                </div>

                <div className={`form-group sub-service-group${showSubService ? ' visible' : ''}`}>
                  <label htmlFor="subService">{t('ctSub')}</label>
                  <select id="subService" value={formData.subService}
                    onChange={e => setFormData(prev => ({ ...prev, subService: e.target.value }))}>
                    <option value="" disabled>{t('ctPickSub')}</option>
                    {subOptions.map((opt, i) => {
                      const val = typeof opt === 'string' ? opt.toLowerCase().replace(/[\s\/&()]+/g, '-') : opt.value;
                      const label = typeof opt === 'string' ? opt : opt.label;
                      return <option key={i} value={val}>{label}</option>
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">{t('ctMessage')}</label>
                  <AutoGrowTextarea id="message" required placeholder={t('ctMessageHint')} minHeight={80} maxHeight={260}
                    value={formData.message} onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isSubmitting}>
                  {isSubmitting ? t('ctSending') : t('ctSubmit')}
                </button>
                <p className="contact-complaints"><Link to="/complaints">{lang === 'te' ? 'ఫిర్యాదు చేయాలా? ఫిర్యాదులు పేజీ →' : 'A complaint? See Complaints →'}</Link></p>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}
