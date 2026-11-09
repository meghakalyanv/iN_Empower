import { Link } from 'react-router-dom'
import { MapPin, Phone, MessageCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useCity } from '../context/CityContext'
import { cityName, pageForPath, teamPhoneShown, telHref, waHref } from '../data/cities'

/**
 * Shown instead of a page that the customer's city has switched off
 * (Admin → Cities → Pages, or a service such as Home Tuitions that is not ticked there).
 */
export default function NotInCity({ path }) {
  const { lang } = useLanguage()
  const { city, openPicker } = useCity()
  const te = lang === 'te'
  const name = cityName(city, lang)
  const page = pageForPath(path)
  const what = page ? (te ? page.te : page.name) : (te ? 'ఈ పేజీ' : 'This page')
  const hello = `Hello iN Empower, I am in ${city?.name || ''} and need help with ${page?.name || 'something'}.`

  return (
    <section className="not-in-city container" aria-labelledby="not-in-city-title">
      <span className="not-in-city__icon" aria-hidden="true"><MapPin size={34} /></span>
      <h1 id="not-in-city-title">
        {te ? `${what} ఇంకా ${name}లో అందుబాటులో లేదు` : `${what} ${page?.plural ? "aren't" : "isn't"} available in ${name} yet`}
      </h1>
      <p>
        {te
          ? `మేము ${name}లో కొన్ని సేవలతో మొదలుపెడుతున్నాం. మా బృందం ఇప్పటికీ సలహా ఇవ్వగలదు — ${teamPhoneShown()} కు కాల్ లేదా వాట్సాప్ చేయండి.`
          : `We're starting in ${name} with a smaller list. Our team can still advise — call or WhatsApp ${teamPhoneShown()}.`}
      </p>
      <div className="not-in-city__actions">
        <a className="btn btn-primary" href={waHref(hello)} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={18} aria-hidden="true" /> WhatsApp
        </a>
        <a className="btn btn-outline" href={telHref()}>
          <Phone size={18} aria-hidden="true" /> {te ? 'కాల్ చేయండి' : 'Call us'}
        </a>
        <Link className="btn btn-outline" to="/services">{te ? `${name}లో సేవలు` : `Services in ${name}`}</Link>
      </div>
      <button type="button" className="city-link" onClick={openPicker}>
        {te ? 'వేరే నగరం ఎంచుకోండి' : 'Choose another city'}
      </button>
    </section>
  )
}
