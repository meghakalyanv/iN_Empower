import { MapPin, ChevronDown } from 'lucide-react'
import { useCity } from '../context/CityContext'
import { useLanguage } from '../context/LanguageContext'
import { cityName } from '../data/cities'

/** 📍 Ongole ▾ — shows the customer's city; tap to change it. */
export default function CityChip({ className = '', style, onOpen }) {
  const { city, openPicker } = useCity()
  const { lang } = useLanguage()
  if (!city) return null
  const name = cityName(city, lang)
  return (
    <button
      type="button"
      className={`city-chip ${className}`}
      style={style}
      onClick={() => { onOpen?.(); openPicker() }}
      aria-label={lang === 'te' ? `నగరం: ${name}. మార్చడానికి నొక్కండి` : `City: ${name}. Tap to change`}
    >
      <MapPin size={16} aria-hidden="true" />
      <span>{name}</span>
      <ChevronDown size={14} aria-hidden="true" />
    </button>
  )
}
