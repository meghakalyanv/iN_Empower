import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, Check, X, Clock } from 'lucide-react'
import { useCity } from '../context/CityContext'
import { useStrings } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import { cityName, regionName, townLabel } from '../data/cities'
import { readPhone } from '../data/phone'
import { api } from '../services/api'

const TEXT = {
  en: {
    title: 'Where do you need help?', sub: "We'll show the services and the phone number for that city.",
    useLoc: 'Use my location', finding: 'Finding the nearest town…', privacy: 'Your location stays on this device. We only use it to find the nearest town.',
    denied: 'Location is off for this website. Please choose your city below.', failed: "We couldn't find your location. Please choose your city below.",
    near: 'You are near {town} — {city}.', inCity: 'You are in {city}.', soon: 'iN Empower is coming to {city} soon!',
    outside: "We don't work where you are yet (nearest: {city}, about {km} km). Choose the city where you need help — or tell us your city.",
    choose: 'Or choose a city', comingSoon: 'Coming soon', current: 'Selected',
    notYet: 'Not in your city yet? Tell us', tellTitle: 'Tell us your city', cityLabel: 'Your city or town *', cityHint: 'e.g. Nellore, Hyderabad, Dallas',
    nameLabel: 'Your name', phoneLabel: 'WhatsApp / phone number', phoneHint: 'We will message you when we start there',
    phoneBad: 'Please check the number (from abroad: start with + and the country code)', send: 'Tell me when you start', sending: 'Sending…',
    thanks: "Thank you! We'll let you know when iN Empower starts in {city}.", later: 'Just looking',
  },
  te: {
    title: 'మీకు ఎక్కడ సహాయం కావాలి?', sub: 'ఆ నగరంలోని సేవలు, ఫోన్ నంబర్ చూపిస్తాము.',
    useLoc: 'నా లొకేషన్ ఉపయోగించండి', finding: 'దగ్గర్లోని ఊరు వెతుకుతున్నాం…', privacy: 'మీ లొకేషన్ ఈ ఫోన్/కంప్యూటర్‌లోనే ఉంటుంది. దగ్గర్లోని ఊరు తెలుసుకోవడానికి మాత్రమే వాడతాము.',
    denied: 'ఈ వెబ్‌సైట్‌కు లొకేషన్ ఆఫ్‌లో ఉంది. దయచేసి కింద మీ నగరం ఎంచుకోండి.', failed: 'మీ లొకేషన్ దొరకలేదు. దయచేసి కింద మీ నగరం ఎంచుకోండి.',
    near: 'మీరు {town} దగ్గర ఉన్నారు — {city}.', inCity: 'మీరు {city}లో ఉన్నారు.', soon: 'iN Empower త్వరలో {city}కి వస్తోంది!',
    outside: 'మీరు ఉన్న చోట ఇంకా మా సేవలు లేవు (దగ్గర్లో: {city}, సుమారు {km} కి.మీ.). మీకు సహాయం కావలసిన నగరం ఎంచుకోండి — లేదా మీ నగరం పేరు చెప్పండి.',
    choose: 'లేదా నగరం ఎంచుకోండి', comingSoon: 'త్వరలో', current: 'ఎంచుకున్నది',
    notYet: 'మీ నగరం ఇంకా లేదా? మాకు చెప్పండి', tellTitle: 'మీ నగరం పేరు చెప్పండి', cityLabel: 'మీ నగరం / ఊరు *', cityHint: 'ఉదా: నెల్లూరు, హైదరాబాద్, డల్లాస్',
    nameLabel: 'మీ పేరు', phoneLabel: 'వాట్సాప్ / ఫోన్ నంబర్', phoneHint: 'అక్కడ ప్రారంభించినప్పుడు మీకు మెసేజ్ చేస్తాము',
    phoneBad: 'నంబర్ సరిచూడండి (విదేశాల నుంచి: + మరియు దేశ కోడ్‌తో మొదలుపెట్టండి)', send: 'ప్రారంభించినప్పుడు చెప్పండి', sending: 'పంపుతోంది…',
    thanks: 'ధన్యవాదాలు! {city}లో iN Empower ప్రారంభించినప్పుడు మీకు తెలియజేస్తాము.', later: 'చూస్తున్నాను',
  },
}

/** The "Where do you need help?" window (opened by CityContext and the 📍 city button). */
export default function CityPicker() {
  const { city, cities, chooseCity, detect, closePicker, saved } = useCity()
  const { t, lang } = useStrings(TEXT)
  const { addToast } = useToast()
  const [status, setStatus] = useState(null) // null | finding | { kind, text }
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ city: '', name: '', phone: '' })
  const [sending, setSending] = useState(false)
  const firstBtn = useRef(null)

  useEffect(() => {
    firstBtn.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') closePicker() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [closePicker])

  const useLocation = async () => {
    setStatus('finding')
    const { result, error } = await detect()
    if (error) { setStatus({ kind: 'warn', text: t(error === 'denied' ? 'denied' : 'failed') }); return }
    if (result.inside) {
      const name = cityName(result.city, lang)
      addToast(`📍 ${result.town ? t('near', { town: townLabel(result.town, lang, result.city), city: name }) : t('inCity', { city: name })}`)
      chooseCity(result.city.id, { town: result.town, how: 'gps' })
      return
    }
    if (result.soon) {
      setStatus({ kind: 'soon', text: t('soon', { city: cityName(result.soon, lang) }) })
      setForm((f) => ({ ...f, city: result.soon.name }))
      setShowForm(true)
      return
    }
    setStatus({ kind: 'warn', text: result.nearest ? t('outside', { city: cityName(result.nearest.city, lang), km: result.nearest.km }) : t('failed') })
  }

  const send = async (e) => {
    e.preventDefault()
    if (form.phone.trim() && !readPhone(form.phone).ok) { addToast(t('phoneBad'), 'error'); return }
    setSending(true)
    try {
      await api.addCityRequest({ cityName: form.city, name: form.name, phone: form.phone })
      addToast(t('thanks', { city: form.city.trim() }))
      setShowForm(false)
      setForm({ city: '', name: '', phone: '' })
    } catch (err) {
      addToast(err.message || 'Could not send', 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="city-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) closePicker() }}>
      <div className="city-dialog" role="dialog" aria-modal="true" aria-labelledby="city-title">
        <button type="button" className="city-close" onClick={closePicker} aria-label={t('later')}><X size={20} /></button>
        <h2 id="city-title"><MapPin size={22} aria-hidden="true" /> {t('title')}</h2>
        <p className="city-sub">{t('sub')}</p>

        <button ref={firstBtn} type="button" className="btn btn-primary city-locate" onClick={useLocation} disabled={status === 'finding'}>
          <Navigation size={18} aria-hidden="true" /> {status === 'finding' ? t('finding') : t('useLoc')}
        </button>
        <p className="city-small">{t('privacy')}</p>
        {status && status !== 'finding' && <p className={`city-status city-status--${status.kind}`} role="status">{status.text}</p>}

        <h3 className="city-h3">{t('choose')}</h3>
        <ul className="city-list">
          {cities.map((c) => {
            const live = c.status === 'live'
            // Only after the visitor has chosen (first visit: nothing is selected yet)
            const selected = live && !!saved && c.id === city?.id
            return (
              <li key={c.id}>
                <button
                  type="button"
                  className={`city-option${selected ? ' is-selected' : ''}${live ? '' : ' is-soon'}`}
                  onClick={() => (live ? chooseCity(c.id) : (setForm((f) => ({ ...f, city: c.name })), setShowForm(true)))}
                  aria-pressed={selected}
                >
                  <span className="city-option__name">{cityName(c, lang)}</span>
                  <span className="city-option__region">{regionName(c, lang)}</span>
                  {selected && <span className="city-tag"><Check size={14} aria-hidden="true" /> {t('current')}</span>}
                  {!live && <span className="city-tag city-tag--soon"><Clock size={14} aria-hidden="true" /> {t('comingSoon')}</span>}
                </button>
              </li>
            )
          })}
        </ul>

        {!showForm ? (
          <button type="button" className="city-link" onClick={() => setShowForm(true)}>{t('notYet')} →</button>
        ) : (
          <form className="city-form" onSubmit={send}>
            <h3 className="city-h3">{t('tellTitle')}</h3>
            <label>
              <span>{t('cityLabel')}</span>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder={t('cityHint')} required minLength={2} maxLength={80} autoComplete="address-level2" />
            </label>
            <div className="city-form__row">
              <label>
                <span>{t('nameLabel')}</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={120} autoComplete="name" />
              </label>
              <label>
                <span>{t('phoneLabel')}</span>
                <input type="tel" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" maxLength={20} autoComplete="tel" />
              </label>
            </div>
            <p className="city-small">{t('phoneHint')}</p>
            <button type="submit" className="btn btn-outline" disabled={sending || form.city.trim().length < 2}>{sending ? t('sending') : t('send')}</button>
          </form>
        )}

        <button type="button" className="city-later" onClick={closePicker}>{t('later')}</button>
      </div>
    </div>
  )
}
