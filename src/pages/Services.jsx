import { useState, useEffect, useRef } from 'react'
import { useLocation, Link, useNavigate, useNavigationType } from 'react-router-dom'
import { CheckCheck, RotateCcw } from 'lucide-react'
import PageHero from '../components/PageHero'
import { useLanguage } from '../context/LanguageContext'
import ScrollReveal from '../components/ScrollReveal'
import ServiceCard from '../components/ServiceCard'
import ToyIcon from '../components/ToyIcon'
import ServiceRequestForm from '../components/ServiceRequestForm'
import { sectionKind } from '../data/serviceLayout'
import CTABanner from '../components/CTABanner'
import servicesData from '../data/servicesData'
import { svcText, SERVICE_CATEGORIES_TE } from '../data/servicesTe'

// Kalamkari art kept in public/images for these groups (icon_kalamkari_<group>.webp).
// Groups without art (NRI, healthcare, …) simply show no picture instead of asking for a missing file.
const CATEGORY_ART = new Set(['collector', 'court', 'drivers', 'education', 'identity', 'mro', 'municipal', 'property', 'rto', 'sand', 'startup', 'supplies'])
const categoryArt = (category) => {
  const key = String(category || '').replace(/[^a-zA-Z0-9]/g, '')
  return CATEGORY_ART.has(key) ? `/images/icon_kalamkari_${key}.webp` : null
}

const filterCategories = [
  { key: 'all', label: 'All Services' },
  { key: 'education', label: 'Education' },
  // Five offices in one folder, as in the app (owner, 31 Oct 2026)
  { key: 'land', label: 'Certificates & land papers', te: 'సర్టిఫికెట్లు & భూమి పత్రాలు', categories: ['identity', 'mro', 'revenue', 'municipal', 'collector'] },
  { key: 'rto', label: 'RTO' },
  { key: 'startup', label: 'Startup' },
  { key: 'court', label: 'Court' },
  { key: 'healthcare', label: 'Hospitals & Healthcare' },
  { key: 'drivers', label: 'Professional services' },
  { key: 'nri', label: 'NRI & Families Abroad' },
]

// "Certificates & land papers": inside, one heading per office (same names as the app)
const LAND_OFFICES = [
  { key: 'identity', en: 'Certificates & IDs', te: 'సర్టిఫికెట్లు & గుర్తింపు కార్డులు' },
  { key: 'mro', en: 'Mandal office (MRO)', te: 'మండల రెవెన్యూ కార్యాలయం (MRO)' },
  { key: 'revenue', en: 'Property papers', te: 'ఆస్తి పత్రాలు' },
  { key: 'municipal', en: 'House & municipal', te: 'ఇల్లు & మున్సిపాలిటీ' },
  { key: 'collector', en: 'Collector office', te: 'కలెక్టర్ కార్యాలయం' },
]
const LAND = LAND_OFFICES.map((o) => o.key)
// An old link to one office (/services#mro) opens the folder
const tabOf = (c) => (LAND.includes(c) ? 'land' : c)

// Groups inside "Professional services" (each opens from its card there)
const SUB_CATEGORIES = ['photography', 'pujari', 'electricity', 'painting', 'ac-services', 'architecture', 'interior', 'loans', 'exim', 'logistics', 'pest-control']

export default function Services() {
  const { t, lang } = useLanguage()
  const tx = (s) => svcText(lang, s)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const navType = useNavigationType()

  /* Opening a group or a filter (owner, 31 Oct 2026): the new list starts at the filter buttons,
     not at the end of the page. Each choice is a browser step, so Back returns to the list
     you came from at the place you left it. */
  const tabsRef = useRef(null)
  const savedY = useRef({})            // filter → where the page was when you left it
  const pendingTop = useRef(false)
  const openFilter = (key) => {
    savedY.current[activeFilter] = window.scrollY
    setSearchQuery('')
    setActiveFilter(key)
    pendingTop.current = true
    navigate({ hash: key === 'all' ? '' : key }, { state: { filter: key } })
  }
  useEffect(() => {
    if (!pendingTop.current) return
    pendingTop.current = false
    const el = tabsRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 90 // below the menu bar
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' })
  }, [activeFilter])
  const [selectedService, setSelectedService] = useState(null)
  const [checkedItems, setCheckedItems] = useState({})
  const hasDocuments = selectedService?.sections?.some(s => s.heading.toLowerCase().includes('document'))

  const toggleCheck = (item) => {
    setCheckedItems(prev => {
      const next = { ...prev, [item]: !prev[item] }
      localStorage.setItem('service_checked_items', JSON.stringify(next))
      window.serviceChecklist = next
      return next
    })
  }

  const checkAll = (items) => {
    const newChecked = { ...checkedItems }
    items.forEach(i => newChecked[i] = true)
    setCheckedItems(newChecked)
    localStorage.setItem('service_checked_items', JSON.stringify(newChecked))
    window.serviceChecklist = newChecked
  }

  const resetAll = () => {
    setCheckedItems({})
    localStorage.removeItem('service_checked_items')
    window.serviceChecklist = {}
  }

  const closeModal = () => {
    setSelectedService(null)
    setCheckedItems({})
    localStorage.removeItem('service_checked_items')
    window.serviceChecklist = {}
  }

  // Handle hash-based category linking
  useEffect(() => {
    const hash = location.hash.replace('#', '')
    // Back / Forward: show that list again, at the place it was left
    if (navType === 'POP') {
      const f = hash ? tabOf(hash) : 'all'
      setActiveFilter(f)
      const y = savedY.current[f]
      if (y !== undefined) setTimeout(() => window.scrollTo({ top: y }), 30)
      return
    }
    if (hash) {
      // A main tab, or a group inside "Professional services" (/services#logistics)
      const validCategory = filterCategories.find(c => c.key === hash) || SUB_CATEGORIES.includes(hash)
      if (validCategory || LAND.includes(hash)) {
        setActiveFilter(tabOf(hash))
      }
    }
  }, [location.hash, navType])

  // Handle query parameter service linking
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q')
    if (q) { setSearchQuery(q); setActiveFilter('all') }
    const serviceId = params.get('service')
    if (serviceId) {
      const found = servicesData.find(s => s.id === serviceId)
      if (found) {
        setSelectedService(found)
        if (found.category) setActiveFilter(tabOf(found.category))
      }
    }
  }, [location.search])

  const filteredServices = servicesData.filter(service => {
    // Exclude 'supplies' category since they have their own dedicated page
    if (service.category === 'supplies') return false
    
    const matchesCategory = activeFilter === 'all' || service.category === activeFilter || (activeFilter === 'land' && LAND.includes(service.category))
    const q = searchQuery.toLowerCase()
    const has = (s) => typeof s === 'string' && (s.toLowerCase().includes(q) || tx(s).toLowerCase().includes(q))
    const matchesSearch = searchQuery === '' ||
      has(service.title) || has(service.subtitle) ||
      (service.sections && service.sections.some(s => s.items && s.items.some(has)))
    return matchesCategory && matchesSearch
  })

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.length > 0) {
      setActiveFilter('all')
    }
  }

  return (
    <>
      <PageHero
        label={t('svLabel')}
        title={t('svTitle')}
        titleHighlight={t('svTitleHi')}
        description={t('svHeroText')}
      >
        {/* Natural Ongole Bull Flavor / Toppings */}
        <img loading="lazy" decoding="async" 
          src="/images/ongole_bull_natural.webp" 
          alt="Ongole Bull Decorative Left" 
          style={{ position: 'absolute', left: '-15%', top: '50%', transform: 'translateY(-50%)', height: '300px', opacity: 0.15, mixBlendMode: 'multiply', zIndex: -1, pointerEvents: 'none' }} 
        />
        <img loading="lazy" decoding="async" 
          src="/images/ongole_bull_natural.webp" 
          alt="Ongole Bull Decorative Right" 
          style={{ position: 'absolute', right: '-15%', top: '50%', transform: 'translateY(-50%) scaleX(-1)', height: '300px', opacity: 0.15, mixBlendMode: 'multiply', zIndex: -1, pointerEvents: 'none' }} 
        />
        
        {/* Search Bar placed in top right */}
        <div style={{
          position: 'absolute',
          top: '0',
          right: '12%',
          width: '100%',
          maxWidth: '260px',
          zIndex: 10
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              id="serviceSearchInput"
              aria-label={t('svSearchLabel')}
              placeholder=""
              value={searchQuery}
              onChange={handleSearch}
              style={{
                width: '100%',
                padding: '0.8rem 3rem 0.8rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                border: '2px solid var(--border)',
                fontSize: '0.95rem',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                transition: 'all var(--transition-fast)'
              }}
            />
            {!searchQuery && (
              <div style={{
                position: 'absolute',
                left: '1.5rem',
                right: '3rem',
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'var(--text-muted)',
                fontSize: '0.95rem'
              }}>
                <span style={{ 
                  display: 'inline-block',
                  animation: 'placeholderScroll 12s linear infinite'
                }}>
                  {t('svSearchHint')}
                </span>
              </div>
            )}
            <span style={{
              position: 'absolute',
              right: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}>🔍</span>
          </div>
        </div>
      </PageHero>

      <section className="section-compact" style={{ paddingTop: '2rem' }}>
        <div className="container">
          {/* Filter Tabs */}
          <div ref={tabsRef} />
          <ScrollReveal className="filter-tabs">
            {/* Only the groups this city offers (Admin → Cities) */}
            {filterCategories.filter(cat => cat.key === 'all' || servicesData.some(s => (cat.categories || [cat.key]).includes(s.category))).map(cat => (
              <button
                key={cat.key}
                className={`filter-tab${(activeFilter === cat.key || (cat.key === 'drivers' && SUB_CATEGORIES.includes(activeFilter))) ? ' active' : ''}`}
                onClick={() => openFilter(cat.key)}
              >
                {lang === 'te' ? cat.te || SERVICE_CATEGORIES_TE[cat.key] || cat.label : cat.label}
              </button>
            ))}
          </ScrollReveal>

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              {t('svNone')}
            </div>
          ) : (
            (activeFilter === 'land' ? LAND_OFFICES : [null]).map((office) => {
              const list = office ? filteredServices.filter(s => s.category === office.key) : filteredServices
              if (!list.length) return null
              return (
            <div key={office ? office.key : 'all'}>
              {office && (
                <h3 className="services-office-head">
                  {lang === 'te' ? office.te : office.en} <span>{list.length}</span>
                </h3>
              )}
            <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem', marginTop: office ? '0.75rem' : '2rem' }}>
              {list.map((service, idx) => (
                <ScrollReveal key={service.id} delay={idx * 0.05} style={{ height: '100%' }}>
                  <ServiceCard 
                    service={service} 
                    onClick={(srv) => {
                      if (srv.targetCategory) {
                        openFilter(srv.targetCategory);
                      } else if (srv.customLink && !(srv.sections || []).length) {
                        // A link card (e.g. Goods Transport → Supplies): open its page
                        navigate(srv.customLink);
                      } else {
                        setSelectedService(srv);
                      }
                    }} 
                  />
                </ScrollReveal>
              ))}
            </div>
            </div>
              )
            })
          )}
        </div>
      </section>

      <CTABanner
        title={t('svCtaTitle')}
        titleHighlight={t('svCtaHi')}
        description={t('svCtaText')}
        buttonText={t('svCtaBtn')}
      />

      {/* The request window (owner, 31 Oct 2026): wide, two columns, a slim header */}
      {selectedService && !selectedService.customLink && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content rw" role="dialog" aria-modal="true" aria-labelledby="rw-title" onClick={e => e.stopPropagation()}>
            <div className="rw-head">
              <div className="rw-toy"><ToyIcon item={selectedService} size={56} alt="" /></div>
              <div className="rw-titles">
                <h3 id="rw-title">{tx(selectedService.title)}</h3>
                {selectedService.subtitle && <p>{tx(selectedService.subtitle)}</p>}
              </div>
              <button className="rw-close" onClick={closeModal} aria-label={lang === 'te' ? 'మూసివేయండి' : 'Close'}>&times;</button>
            </div>
            <ServiceRequestForm
              key={selectedService.id}
              service={selectedService}
              lang={lang}
              onDone={closeModal}
              aside={(
                <>
                  {(selectedService.sections || []).filter(s => sectionKind(selectedService, s) === 'info').map((section, i) => (
                    <div key={i} className="rw-info">
                      <h5>{tx(section.heading)}</h5>
                      <ul>{section.items.map((item, j) => <li key={j}>{tx(item)}</li>)}</ul>
                    </div>
                  ))}
                  <button
                    className="rw-skip"
                    onClick={() => {
                      if (selectedService.category === 'startup') {
                        closeModal();
                        window.dispatchEvent(new CustomEvent('triggerChatFlow', { detail: { flowId: 'startup', initialAnswers: { type: selectedService.title } } }));
                      } else {
                        window.location.href = `/contact?service=${selectedService.category}&subService=${selectedService.id}`;
                      }
                    }}
                  >
                    {t('svSkip')}
                  </button>
                </>
              )}
            />
          </div>
        </div>
      )}

      {/* Link cards (e.g. Goods Transport → Supplies) keep the older window */}
      {selectedService && !!selectedService.customLink && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="modal-header" style={{ position: 'relative' }}>
              <div className="modal-header-hero">
                <div className="modal-icon" style={{ zIndex: 2, position: 'relative' }}>
                  {/* A photo, its own toy, or its line icon (never the icon's name as a word) */}
                  <ToyIcon item={selectedService} size={72} alt={tx(selectedService.title)} />
                </div>
                <div style={{ zIndex: 2, position: 'relative', flex: 1, paddingRight: '4rem' }}>
                  <h3 className="modal-title">{tx(selectedService.title)}</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{tx(selectedService.subtitle)}</p>
                </div>
                
                {/* Decorative Kalamkari Category Art in Top Right */}
                {categoryArt(selectedService.category) && <div style={{
                  position: 'absolute',
                  top: '-1.5rem',
                  right: '-1rem',
                  opacity: 0.25,
                  pointerEvents: 'none',
                  zIndex: 0
                }}>
                  <img loading="lazy" decoding="async" 
                    src={categoryArt(selectedService.category)}
                    alt="" aria-hidden="true"
                    style={{ width: '160px', height: '160px', objectFit: 'contain', transform: 'rotate(10deg)' }} 
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>}
              </div>
            </div>
            
            <div className="modal-body">
              {selectedService.photo && (
                <img src={selectedService.photo} alt={tx(selectedService.title)} loading="lazy"
                  style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 12, marginBottom: '1rem', display: 'block' }} />
              )}
              {selectedService.sections && (() => {
                // Sections edited in the admin portal say what they are (kind); older ones are read from the heading
                const isReq = (s) => s.kind ? s.kind !== 'info' : /require|document|data|eligib|prerequisite|service|model|offer|option|select/i.test(s.heading)
                const reqSections = selectedService.sections.filter(isReq);
                // With the request form, only plain information shows here; the form asks the rest
                const infoSections = selectedService.customLink
                  ? selectedService.sections.filter(s => !isReq(s))
                  : selectedService.sections.filter(s => sectionKind(selectedService, s) === 'info');
                const hasDocuments = reqSections.some(s => /document/i.test(s.heading));
                
                const allItems = reqSections.flatMap(s => s.items);
                const totalItems = allItems.length;
                const checkedCount = allItems.filter(i => checkedItems[i]).length;
                const progress = totalItems === 0 ? 0 : Math.round((checkedCount / totalItems) * 100);

                return (
                  <>
                    {/* Information Sections (No checkboxes) */}
                    {infoSections.map((section, i) => (
                      <div key={'info-'+i} className="modal-section" style={{ marginBottom: '1rem' }}>
                        <h5 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', marginBottom: '0.25rem', color: 'var(--text-color)', textTransform: 'uppercase' }}>{tx(section.heading)}</h5>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.1rem', color: 'var(--text-secondary)' }}>
                          {section.items.map((item, j) => (
                            <li key={j} style={{ fontSize: '0.95rem', padding: '0.1rem 0' }}>
                              {tx(item)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Requirements Sections (Checkboxes) */}
                    {/* The request form below asks these (owner, 31 Oct 2026); the old tick list stays only for link cards */}
                    {!!selectedService.customLink && reqSections.length > 0 && (
                      <div style={{ marginTop: infoSections.length > 0 ? '1.5rem' : '0' }}>
                        <div style={{ marginBottom: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-color)', margin: 0 }}>
                              {t('svOptions')}
                            </h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                onClick={() => checkAll(allItems)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', background: 'transparent', color: '#16a34a', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}
                              >
                                <CheckCheck size={14} /> {t('svCheckAll')}
                              </button>
                              <button 
                                onClick={resetAll}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}
                              >
                                <RotateCcw size={14} /> {t('svReset')}
                              </button>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', backgroundColor: '#16a34a', width: `${progress}%`, transition: 'width 0.3s ease-in-out' }} />
                            </div>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                              {checkedCount} / {totalItems} {t('svReady')}
                            </span>
                          </div>
                        </div>

                        {reqSections.map((section, i) => (
                          <div key={'req-'+i} className="modal-section" style={{ marginBottom: '0.75rem' }}>
                            <h5 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>{tx(section.heading)}</h5>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                              {section.items.map((item, j) => (
                                <li key={j}>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-sm)', background: checkedItems[item] ? 'rgba(0,180,216,0.05)' : 'transparent', transition: 'background 0.2s' }}>
                                    <input 
                                      type="checkbox" 
                                      checked={!!checkedItems[item]} 
                                      onChange={() => toggleCheck(item)}
                                      style={{ marginTop: '0.1rem', width: '1.25rem', height: '1.25rem', accentColor: 'var(--accent-teal)' }}
                                    />
                                    <span style={{ flex: 1, fontSize: '0.95rem', color: checkedItems[item] ? 'var(--text-color)' : 'var(--text-secondary)', textDecoration: checkedItems[item] ? 'line-through' : 'none' }}>
                                      {tx(item)}
                                    </span>
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        {hasDocuments && checkedCount < totalItems && (
                          <div style={{
                            background: 'var(--accent-teal-light)',
                            border: '1px solid var(--accent-teal)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem',
                            marginTop: '1.5rem',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'flex-start'
                          }}>
                            <span style={{ fontSize: '1.25rem' }}>&#129309;</span>
                            <div>
                              <h5 style={{ margin: 0, color: 'var(--accent-teal-dark)', fontSize: '0.95rem' }}>{t('svMissing')}</h5>
                              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                {t('svMissingText')}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* The request right here: questions, details, papers ticked, then Send request sends it (owner, 31 Oct 2026) */}
                {!selectedService.customLink && (
                  <ServiceRequestForm key={selectedService.id} service={selectedService} lang={lang} onDone={closeModal} />
                )}
                {!!selectedService.customLink && <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    const svc = selectedService
                    closeModal();
                    if (svc.customLink) { navigate(svc.customLink); return }
                    window.dispatchEvent(new CustomEvent('openChatItem', { detail: { kind: 'service', id: svc.id } }));
                  }}
                >
                  {t('svStart')}
                </button>}
                <div style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => {
                      if (selectedService.category === 'startup') {
                        closeModal();
                        window.dispatchEvent(
                          new CustomEvent('triggerChatFlow', {
                            detail: {
                              flowId: 'startup',
                              initialAnswers: { type: selectedService.title }
                            }
                          })
                        );
                      } else {
                        // For regular services, navigate to contact without checklist data
                        window.location.href = `/contact?service=${selectedService.category}&subService=${selectedService.id}`;
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    {t('svSkip')}
                  </button>
                </div>
              </div>
</div>
          </div>
        </div>
      )}
    </>
  )
}
