import { useState } from 'react'
import { api } from '../services/api'
import { readPhone } from '../data/phone'
import { useLanguage } from '../context/LanguageContext'

/**
 * Delete your iN Empower account and data (owner, 2 Nov 2026). Google Play asks for a web page where
 * people can ask for deletion without the app; in the app it is Profile → Settings → "Delete my account".
 * The request reaches the team (Admin → Requests, "Account deletion"), who finish it within 7 days.
 */
const TXT = {
  en: {
    title: 'Delete your iN Empower account',
    lead: 'You can delete your account and the data we hold about you at any time.',
    inApp: 'In the app: Profile → Settings → "Delete my account".',
    here: 'Or ask here, without the app:',
    what: 'We delete your login, your requests and the details you gave us within 7 days, and confirm on WhatsApp or SMS. We keep only what the law requires (for example, invoices for tax records).',
    name: 'Your name', phone: 'Mobile number used with iN Empower', email: 'Email (if you signed in with one)',
    send: 'Ask to delete my account', sending: 'Sending…',
    needName: 'Please type your name.', needPhone: 'Please type the mobile number you used with us.',
    sent: 'Your request is in. We delete your account and data within 7 days and confirm on WhatsApp or SMS.',
    failed: 'Could not send. Please check your internet and try again.',
  },
  te: {
    title: 'మీ iN Empower ఖాతా తొలగించండి',
    lead: 'మీ ఖాతాను, మా దగ్గర ఉన్న మీ డేటాను ఎప్పుడైనా తొలగించవచ్చు.',
    inApp: 'యాప్‌లో: ప్రొఫైల్ → సెట్టింగ్స్ → "నా ఖాతా తొలగించండి".',
    here: 'లేదా యాప్ లేకుండా ఇక్కడ అడగండి:',
    what: 'మీ లాగిన్, అభ్యర్థనలు, మీరు ఇచ్చిన వివరాలు 7 రోజుల్లో తొలగించి వాట్సాప్ లేదా SMS ద్వారా తెలియజేస్తాము. చట్టం కోరినవి మాత్రమే (ఉదా. పన్ను రికార్డుల కోసం బిల్లులు) ఉంచుతాము.',
    name: 'మీ పేరు', phone: 'iN Empower తో వాడిన మొబైల్ నంబర్', email: 'ఇమెయిల్ (దానితో సైన్ ఇన్ చేసి ఉంటే)',
    send: 'నా ఖాతా తొలగించమని అడగండి', sending: 'పంపుతున్నాం…',
    needName: 'దయచేసి మీ పేరు టైప్ చేయండి.', needPhone: 'మాతో వాడిన మొబైల్ నంబర్ టైప్ చేయండి.',
    sent: 'మీ అభ్యర్థన అందింది. 7 రోజుల్లో మీ ఖాతా, డేటా తొలగించి వాట్సాప్ లేదా SMS ద్వారా తెలియజేస్తాము.',
    failed: 'పంపలేకపోయాం. ఇంటర్నెట్ చూసి మళ్ళీ ప్రయత్నించండి.',
  },
}

export default function DeleteAccount() {
  const { lang } = useLanguage()
  const t = TXT[lang === 'te' ? 'te' : 'en']
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState(null) // null | 'sending' | 'sent'
  const [error, setError] = useState('')

  const send = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError(t.needName)
    const ph = readPhone(phone)
    if (!ph.ok) return setError(t.needPhone)
    setState('sending')
    try {
      await api.submitContactForm({
        name: name.trim(), phone: ph.value, email: email.trim(),
        service: 'account-deletion', subService: 'Delete my account and data',
        message: `Please delete my iN Empower account and all my data (login, requests, details). Asked on the website.${email.trim() ? ` Email: ${email.trim()}` : ''}`,
        details: { kind: 'account-deletion' }, channel: 'page',
      })
      setState('sent')
    } catch {
      setState(null)
      setError(t.failed)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem', maxWidth: '640px' }}>
      <h1 style={{ marginBottom: '1rem' }}>{t.title}</h1>
      <p>{t.lead}</p>
      <p><strong>{t.inApp}</strong></p>
      <p>{t.what}</p>
      {state === 'sent' ? (
        <p role="status" style={{ padding: '1rem', borderRadius: 12, background: '#E0F3E8', color: '#1E7A46', fontWeight: 700 }}>{t.sent}</p>
      ) : (
        <form onSubmit={send} className="srf" style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
          <p style={{ margin: 0 }}>{t.here}</p>
          <div className="srf-field"><label htmlFor="del-name">{t.name} *</label><input id="del-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></div>
          <div className="srf-field"><label htmlFor="del-phone">{t.phone} *</label><input id="del-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" /></div>
          <div className="srf-field"><label htmlFor="del-email">{t.email}</label><input id="del-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
          {error && <p className="srf-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={state === 'sending'} style={{ justifyContent: 'center', background: '#B3261E', borderColor: '#B3261E' }}>
            {state === 'sending' ? t.sending : t.send}
          </button>
        </form>
      )}
    </div>
  )
}
