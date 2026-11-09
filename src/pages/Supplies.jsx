import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { useLanguage } from '../context/LanguageContext'
import ScrollReveal from '../components/ScrollReveal'
import SectionHeader from '../components/SectionHeader'
import CTABanner from '../components/CTABanner'
import ToyIcon from '../components/ToyIcon'
import ServiceRequestForm from '../components/ServiceRequestForm'
import { toyUrl } from '../utils/toyArt'

import { supplyCategories, whySupplies } from '../data/suppliesData'
import { svcText } from '../data/servicesTe'
import { placeText } from '../data/cities'


export default function Supplies() {
  const { t, lang } = useLanguage()
  const tx = (s) => svcText(lang, s)
  const [selectedSupply, setSelectedSupply] = useState(null)
  const location = useLocation()

  // /supplies?item=transport opens that supply (e.g. from Packers & Movers → Goods Transport)
  useEffect(() => {
    const id = new URLSearchParams(location.search).get('item')
    const found = id && supplyCategories.find(c => c.id === id)
    if (found) setSelectedSupply(found)
  }, [location.search])

  useEffect(() => {
    document.title = placeText("Supplies | iN Empower — Verified Suppliers in Prakasam District")
  }, [])

  const closeModal = () => setSelectedSupply(null)

  return (
    <>
      <PageHero
        label={t('spLabel')}
        title={t('spTitle')}
        titleHighlight={t('spTitleHi')}
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
        <p style={{ maxWidth: '1000px', margin: '0 auto', textWrap: 'balance', lineHeight: 1.6 }}>
          {t('spIntro')}
        </p>
      </PageHero>

      {/* Supply Categories — Compact Grid */}
      <section className="section-compact" style={{ paddingTop: '2rem' }}>
        <div className="container">

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginTop: '2rem'
          }}>
            {supplyCategories.map((cat, idx) => (
              <ScrollReveal key={cat.id} delay={idx * 0.04} style={{ height: '100%' }}>
                <div
                  className="service-card-clean"
                  onClick={() => setSelectedSupply(cat)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="service-card-clean-header">
                    <div className={`service-card-clean-icon${toyUrl(cat, 'supply') ? ' has-toy' : ''}`}>
                      <ToyIcon item={cat} kind="supply" size={toyUrl(cat, 'supply') ? 58 : 48} />
                    </div>
                    <h4 className="service-card-clean-title">{tx(cat.title)}</h4>
                  </div>
                  <div className="service-card-clean-body">
                    <p className="service-card-clean-subtitle" style={{ flexGrow: 1 }}>{tx(cat.tagline)}</p>
                    {/* The same button as the service cards: coloured border and arrow (owner, 9 Nov 2026) */}
                    <button
                      className="btn btn-service-action btn-sm"
                      style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                    >
                      <span>{t('svBtnDetails')}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }} aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why iN Empower Supplies — AT THE BOTTOM */}
      <section className="section-compact">
        <div className="container">
          <SectionHeader
            label={t('spWhy')}
            title={t('spWhyTitle')}
            titleHighlight={t('spWhyHi')}
            highlightClass="text-gradient"
            description={t('spWhyText')}
          />

          <ScrollReveal className="grid-3" style={{ marginBottom: '2rem' }}>
            {whySupplies.map((point, i) => (
              <div key={i} className="glass-card" style={{
                textAlign: 'center',
                padding: '1.5rem',
                border: '1px solid rgba(255,153,51,0.12)'
              }}>
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '0.75rem',
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                  background: 'var(--accent-teal-light)'
                }}>{point.icon}</div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{tx(point.title)}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{tx(point.desc)}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <CTABanner
        title={t('spCtaTitle')}
        titleHighlight={t('spCtaHi')}
        description={t('spCtaText')}
        buttonText={t('svCtaBtn')}
      />

      {/* Supply request window (owner, 31 Oct 2026): the same wide two-column window as Services —
          the supply's order questions on the left; town, when, name, phone and Send request on the right */}
      {selectedSupply && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content rw" role="dialog" aria-modal="true" aria-labelledby="rw-title" onClick={e => e.stopPropagation()}>
            <div className="rw-head">
              <div className="rw-toy"><ToyIcon item={selectedSupply} kind="supply" size={56} /></div>
              <div className="rw-titles">
                <h3 id="rw-title">{tx(selectedSupply.title)}</h3>
                {selectedSupply.tagline && <p>{tx(selectedSupply.tagline)}</p>}
              </div>
              <button className="rw-close" onClick={closeModal} aria-label={lang === 'te' ? 'మూసివేయండి' : 'Close'}>&times;</button>
            </div>
            <ServiceRequestForm
              key={selectedSupply.id}
              kind="supply"
              item={selectedSupply}
              lang={lang}
              onDone={closeModal}
              aside={(
                <>
                  {(selectedSupply.photo || selectedSupply.image) && (
                    <img loading="lazy" decoding="async" src={selectedSupply.photo || selectedSupply.image} alt={tx(selectedSupply.title)}
                      style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 12 }} />
                  )}
                  {(selectedSupply.highlights || []).length > 0 && (
                    <div className="rw-info">
                      <h5>{t('spOffer')}</h5>
                      <ul>{selectedSupply.highlights.map((h, i) => <li key={i}>{tx(h)}</li>)}</ul>
                    </div>
                  )}
                  <div className="rw-info">
                    <h5>{t('spNotSure')}</h5>
                    <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{t('spNotSureText')}</p>
                  </div>
                </>
              )}
            />
          </div>
        </div>
      )}
    </>
  )
}
