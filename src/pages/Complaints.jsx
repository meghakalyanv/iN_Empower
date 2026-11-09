import { Link } from 'react-router-dom'
import { Phone, MessageCircle, UserRound, Clock, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { complaintsText, REGISTERED } from '../data/legalText'
import { COMPANY, telHref, waHref, teamPhoneShown } from '../data/cities'

/**
 * Complaints (owner, 6 Nov 2026 — Consumer Protection (E-Commerce) Rules, 2020): how to complain,
 * the Grievance Officer, the 48-hour / one-month promise and "Work Done or Money Back".
 * The registered name and address show here once the company is registered (REGISTERED in legalText).
 */
export default function Complaints() {
  const { lang } = useLanguage()
  const c = complaintsText(lang)
  return (
    <div className="container complaints" style={{ paddingTop: '120px', paddingBottom: '4rem', maxWidth: '720px' }}>
      <h1>{c.title}</h1>
      <p className="complaints__lead">{c.lead}</p>

      <section className="complaints__card">
        <p>{c.how}</p>
        <div className="complaints__btns">
          <a className="btn btn-primary" href={telHref()}><Phone size={18} aria-hidden="true" />{c.call}</a>
          <a className="btn btn-outline" href={waHref(lang === 'te' ? 'నమస్తే, నాకు ఒక ఫిర్యాదు ఉంది. Ref: ' : 'Hello, I have a complaint. Ref: ')} target="_blank" rel="noreferrer">
            <MessageCircle size={18} aria-hidden="true" />{c.whatsapp}
          </a>
        </div>
      </section>

      <section className="complaints__card">
        <h2><UserRound size={20} aria-hidden="true" />{c.officerH}</h2>
        <p><strong>{c.officer}</strong></p>
        <p>📞 {teamPhoneShown()}</p>
        <p>{c.office}: {REGISTERED.address || COMPANY.address}</p>
        {REGISTERED.name && <p>{c.registered}: {REGISTERED.name}</p>}
        <p className="complaints__promise"><Clock size={18} aria-hidden="true" />{c.times}</p>
      </section>

      <section className="complaints__card">
        <h2><ShieldCheck size={20} aria-hidden="true" />{c.moneyH}</h2>
        <p>{c.money}</p>
        <Link to="/terms">{c.terms} →</Link>
      </section>
      <p className="complaints__rules">{c.rules}</p>
    </div>
  )
}
