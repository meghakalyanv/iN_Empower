import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStrings } from '../context/LanguageContext'
import { svcText } from '../data/servicesTe'
import { requestSummary, withCustomerNote } from '../data/requestSummary'
import { api } from '../services/api'
import { useToast } from '../context/ToastContext'
import { celebrate } from '../utils/celebrate'
import { afterHoursNote, isEmergency } from '../data/workHours'
import AutoGrowTextarea from './AutoGrowTextarea'
import { readPhone } from '../data/phone'

const TEXT = {
  en: {
    title: 'Confirm your request', sub: 'Check your details and send. You get a clear price before any work starts.', yourReq: 'Your request',
    name: 'Your name *', phone: 'Phone number *', note: 'Anything else we should know?', optional: '(optional)', noteHint: 'e.g. Please call after 10 am',
    send: 'Send request', sending: 'Sending…', missing: 'Please fill in your name and a valid mobile number (from abroad: start with + and the country code)',
    promise: 'Clear quote before any work starts — no hidden charges.', consent: 'We use your details only for this request and send updates on WhatsApp.', privacy: 'Privacy Policy',
    doneTitle: 'Request sent!', doneText: 'Our team will call you soon on {phone}.', home: 'Back to Home', fail: 'Could not send. Please try again.',
  },
  te: {
    title: 'మీ అభ్యర్థనను నిర్ధారించండి', sub: 'మీ వివరాలు చూసి పంపండి. పని మొదలయ్యే ముందే స్పష్టమైన ధర చెబుతాము.', yourReq: 'మీ అభ్యర్థన',
    name: 'మీ పేరు *', phone: 'ఫోన్ నంబర్ *', note: 'ఇంకా ఏమైనా చెప్పాలా?', optional: '(ఐచ్ఛికం)', noteHint: 'ఉదా: ఉదయం 10 తర్వాత కాల్ చేయండి',
    send: 'అభ్యర్థన పంపండి', sending: 'పంపుతున్నాము…', missing: 'దయచేసి మీ పేరు, సరైన మొబైల్ నంబర్ ఇవ్వండి (విదేశాల నుంచి: + మరియు దేశ కోడ్‌తో)',
    promise: 'పని మొదలయ్యే ముందే స్పష్టమైన ధర — దాచిన ఛార్జీలు లేవు.', consent: 'మీ వివరాలను ఈ అభ్యర్థన కోసం మాత్రమే వాడతాము, అప్‌డేట్‌లు WhatsApp లో పంపుతాము.', privacy: 'గోప్యతా విధానం',
    doneTitle: 'అభ్యర్థన పంపబడింది!', doneText: 'మా బృందం త్వరలో {phone} కు కాల్ చేస్తుంది.', home: 'హోమ్‌కు వెళ్ళండి', fail: 'పంపలేకపోయాము. దయచేసి మళ్ళీ ప్రయత్నించండి.',
  },
}

/**
 * Short "Confirm your request" step shown on /contact when a page sends its answers
 * (Property, Travel, Youth Hub, Tutor, Chat Buddy "send to team", service checklists).
 * The team receives the English text unchanged, plus the customer's optional note.
 */
export default function ConfirmRequest({ service = '', subService = '', subLabel = '', message, name: name0 = '', phone: phone0 = '', jobId = '' }) {
  const { t, lang } = useStrings(TEXT)
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [name, setName] = useState(name0)
  const [phone, setPhone] = useState(phone0)
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const rows = useMemo(() => requestSummary(message), [message])
  const tt = (s) => {
    if (!s) return ''
    const whole = svcText(lang, s)
    if (whole !== s) return whole
    return s.split(', ').map((x) => svcText(lang, x)).join(', ')
  }

  // Signed-in customers: pre-fill (still editable)
  useEffect(() => {
    api.getCurrentUser?.().then((u) => {
      if (!u) return
      setName((v) => v || u.name || '')
      setPhone((v) => v || u.phone || '')
      setEmail(u.email || '')
    }).catch(() => {})
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (sending) return
    if (!name.trim() || !readPhone(phone).ok) { addToast(t('missing'), 'error'); return }
    setSending(true)
    const req = { name: name.trim(), phone: phone.trim(), email, service, subService: subLabel || subService, message: withCustomerNote(message, note), ...(jobId ? { details: { kind: 'job', jobId } } : {}) }
    try {
      await api.submitContactForm(req)
      celebrate()
      const after = afterHoursNote(lang === 'te' ? 'te' : 'en', { emergency: isEmergency(req) })
      if (after) addToast(after, 'info', 9000)
      setSent(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      addToast(lang === 'te' ? t('fail') : (err.message || t('fail')), 'error')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <section className="section-compact confirm-req" style={{ paddingTop: '120px' }}>
        <div className="container confirm-req__wrap glass-card confirm-req__done">
          <div className="confirm-req__tick" aria-hidden="true">✓</div>
          <h1 className="confirm-req__title">{t('doneTitle')}</h1>
          <p className="confirm-req__sub">{t('doneText', { phone: phone.trim() })}</p>
          <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/')}>{t('home')}</button>
        </div>
      </section>
    )
  }

  return (
    <section className="section-compact confirm-req" style={{ paddingTop: '120px' }}>
      <div className="container confirm-req__wrap">
        <h1 className="confirm-req__title">{t('title')}</h1>
        <p className="confirm-req__sub">{t('sub')}</p>

        <div className="confirm-req__card">
          <div className="confirm-req__label">{t('yourReq')}</div>
          {!!(subLabel || subService) && <div className="confirm-req__service">{tt(subLabel || subService)}</div>}
          {rows.map((r, i) => {
            if (r.kind === 'head') return <div key={i} className="confirm-req__head">{tt(r.text)}</div>
            if (r.kind === 'pair') {
              return (
                <div key={i} className={`confirm-req__pair${r.indent ? ' is-indent' : ''}`}>
                  <span>{tt(r.label)}</span><strong>{tt(r.value)}</strong>
                </div>
              )
            }
            return <div key={i} className={`confirm-req__item${r.indent ? ' is-indent' : ''}`}>{r.kind === 'item' ? '•  ' : ''}{tt(r.text)}</div>
          })}
        </div>

        <form className="glass-card" onSubmit={submit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cr-name">{t('name')}</label>
              <input id="cr-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="cr-phone">{t('phone')}</label>
              <input id="cr-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="cr-note">{t('note')} <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '0.85em' }}>{t('optional')}</span></label>
            <AutoGrowTextarea id="cr-note" minHeight={64} maxHeight={200} maxLength={500} placeholder={t('noteHint')} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={sending}>
            {sending ? t('sending') : t('send')}
          </button>
          <p className="confirm-req__small">{t('promise')}</p>
          <p className="confirm-req__small">{t('consent')} <Link to="/privacy">{t('privacy')}</Link></p>
        </form>
      </div>
    </section>
  )
}
