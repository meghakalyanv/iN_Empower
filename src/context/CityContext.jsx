import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { currentCity, currentTown, setCurrentCity, listedCities, locate, isLiveCity, defaultCity } from '../data/cities'
import { reapplyCatalog } from '../data/catalog'
import { savedCity, saveCity } from '../services/catalogLoader'
import CityPicker from '../components/CityPicker'

/**
 * The customer's city (BookMyShow-style):
 * - First visit: a small window asks "Where do you need help?" — use my location
 *   (with permission; the location stays in the browser) or pick a city.
 * - The choice is remembered in this browser; the 📍 city button changes it.
 * - Changing city redraws the site with that city's services, towns and phone numbers.
 */
const CityContext = createContext({ city: null, cities: [], openPicker: () => {}, chooseCity: () => {}, detect: async () => ({}) })

// Pages where the window would get in the way (team pages, sign-in, legal text)
const QUIET = /^\/(admin|login|dashboard|privacy|terms|post-job)/

export function CityProvider({ children }) {
  const [saved, setSaved] = useState(() => savedCity())
  const [pickerOpen, setPickerOpen] = useState(false)
  const [version, setVersion] = useState(0)

  // First visit (or the saved city has closed): ask once, after the page has drawn
  useEffect(() => {
    if ((saved && isLiveCity(saved.id)) || QUIET.test(window.location.pathname)) return undefined
    const t = setTimeout(() => setPickerOpen(true), 900)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const chooseCity = useCallback((id, { town = null, how = 'picked' } = {}) => {
    const before = currentCity().id
    setCurrentCity(id, { town })
    const now = currentCity()
    const s = { id: now.id, town: currentTown(), how, at: Date.now() }
    saveCity(s)
    setSaved(s)
    setPickerOpen(false)
    reapplyCatalog()
    // Redraw every page so lists, towns and phone numbers follow the new city
    if (now.id !== before || how === 'gps') setVersion((v) => v + 1)
  }, [])

  /** Ask the browser for the location (it asks the customer). Resolves { result } or { error }. */
  const detect = useCallback(() => new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) { resolve({ error: 'unsupported' }); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ result: locate(pos.coords.latitude, pos.coords.longitude) }),
      (err) => resolve({ error: err && err.code === 1 ? 'denied' : 'failed' }),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10 * 60 * 1000 },
    )
  }), [])

  const openPicker = useCallback(() => setPickerOpen(true), [])
  const closePicker = useCallback(() => {
    setPickerOpen(false)
    // Closed without choosing: stay with the main city and don't ask on every page
    if (!saved || !isLiveCity(saved.id)) {
      const s = { id: defaultCity().id, town: null, how: 'default', at: Date.now() }
      saveCity(s)
      setSaved(s)
    }
  }, [saved])

  const value = useMemo(() => ({
    city: currentCity(), town: currentTown(), cities: listedCities(), saved,
    chooseCity, detect, openPicker, closePicker, pickerOpen,
  }), [saved, version, chooseCity, detect, openPicker, closePicker, pickerOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CityContext.Provider value={value}>
      <Fragment key={version}>{children}</Fragment>
      {pickerOpen && <CityPicker />}
    </CityContext.Provider>
  )
}

export const useCity = () => useContext(CityContext)
