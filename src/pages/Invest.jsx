import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import ScrollReveal from '../components/ScrollReveal'
import SectionHeader from '../components/SectionHeader'
import CTABanner from '../components/CTABanner'
import { properties, investSteps as steps, benefits, trustPoints, faqs } from '../data/investData'

/* ─── Sample Properties ─── */

/* ─── How It Works Steps ─── */

/* ─── Benefits ─── */

/* ─── Legal / Trust Points ─── */

/* ─── FAQs ─── */

/* ─── Format Currency ─── */
function formatINR(num) {
  return '₹' + num.toLocaleString('en-IN')
}

/* ═══════════════ PropertyCard Component ═══════════════ */
function PropertyCard({ property }) {
  const [shares, setShares] = useState(1)
  const available = property.totalShares - property.soldShares
  const soldPercent = (property.soldShares / property.totalShares) * 100

  const decrement = () => setShares(s => Math.max(1, s - 1))
  const increment = () => setShares(s => Math.min(available, s + 1))
  const totalCost = shares * property.pricePerShare

  return (
    <div className="invest-property-card">
      {/* Card Header with Gradient */}
      <div className="invest-property-header" style={{ background: property.gradientBg }}>
        <span className="invest-property-type-badge">{property.typeIcon} {property.type}</span>
        <h3 className="invest-property-name">{property.name}</h3>
        <p className="invest-property-location">📍 {property.location}</p>
      </div>

      {/* Card Body */}
      <div className="invest-property-body">
        {/* Key Stats Row */}
        <div className="invest-property-stats">
          <div className="invest-stat">
            <span className="invest-stat-label">Total Value</span>
            <span className="invest-stat-value">{formatINR(property.totalValue)}</span>
          </div>
          <div className="invest-stat">
            <span className="invest-stat-label">Per Share</span>
            <span className="invest-stat-value">{formatINR(property.pricePerShare)}</span>
          </div>
          <div className="invest-stat">
            <span className="invest-stat-label">Area</span>
            <span className="invest-stat-value">{property.area}</span>
          </div>
        </div>

        {/* Share Division Bar */}
        <div className="invest-share-bar-wrapper">
          <div className="invest-share-bar-labels">
            <span>{property.soldShares} Sold</span>
            <span>{available} Available</span>
          </div>
          <div className="invest-share-bar">
            <div
              className="invest-share-bar-fill"
              style={{ width: `${soldPercent}%`, background: property.gradientBg }}
            />
          </div>
          <p className="invest-share-bar-total">{property.totalShares} Total Shares</p>
        </div>

        {/* Highlights */}
        <ul className="invest-property-highlights">
          {property.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>

        {/* Share Selector & Calculator */}
        <div className="invest-calculator">
          <div className="invest-stepper-row">
            <label className="invest-stepper-label">Number of Shares</label>
            <div className="invest-stepper">
              <button className="invest-stepper-btn" onClick={decrement} disabled={shares <= 1} aria-label="Decrease shares">−</button>
              <span className="invest-stepper-value">{shares}</span>
              <button className="invest-stepper-btn" onClick={increment} disabled={shares >= available} aria-label="Increase shares">+</button>
            </div>
          </div>
          <div className="invest-total-row">
            <span>Your Investment</span>
            <span className="invest-total-amount">{formatINR(totalCost)}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/contact?service=invest&subService=${property.id}`}
          className="btn btn-primary invest-cta-btn"
        >
          Invest Now →
        </Link>
      </div>
    </div>
  )
}

/* ═══════════════ FAQ Item Component ═══════════════ */
function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`}>
      <button className="faq-question" onClick={onToggle}>
        <span>{faq.q}</span>
        <span className="faq-icon">+</span>
      </button>
      <div className="faq-answer" style={{ maxHeight: isOpen ? '300px' : '0' }}>
        <div className="faq-answer-inner">{faq.a}</div>
      </div>
    </div>
  )
}

/* ═══════════════ Main Invest Page ═══════════════ */
export default function Invest() {
  const [openFAQ, setOpenFAQ] = useState(null)

  useEffect(() => {
    document.title = "Invest | iN Empower — Fractional Property Ownership in Prakasam District"
  }, [])

  return (
    <>
      {/* ─── Hero ─── */}
      <PageHero
        label="Invest • Co-Own • Grow"
        title="Own a Piece of"
        titleHighlight="Prime Property"
      >
        <p style={{ maxWidth: '700px', margin: '0 auto', textWrap: 'balance', lineHeight: 1.7 }}>
          Fractional property ownership made simple. Co-own verified land and buildings in Prakasam district
          with investments starting from just <strong>₹50,000</strong>.
        </p>
      </PageHero>

      {/* ─── How It Works ─── */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <SectionHeader
            label="How It Works"
            title="4 Simple Steps to"
            titleHighlight="Property Ownership"
            highlightClass="text-gradient"
            description="From browsing to becoming a co-owner — the entire process is transparent, structured, and easy to follow."
          />

          <ScrollReveal>
            <div className="steps-row">
              {steps.map((step, i) => (
                <div className="step-card" key={i}>
                  <div className="step-number">{step.icon}</div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Featured Properties ─── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionHeader
            label="Featured Properties"
            title="Available Investment"
            titleHighlight="Opportunities"
            highlightClass="text-gradient"
            description="Explore verified properties in Prakasam district. Select your shares and start your investment journey today."
          />

          <div className="invest-properties-grid">
            {properties.map((prop, idx) => (
              <ScrollReveal key={prop.id} delay={idx * 0.08}>
                <PropertyCard property={prop} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Fractional Ownership ─── */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <SectionHeader
            label="Why Fractional Ownership"
            title="Benefits of"
            titleHighlight="Co-Owning Property"
            highlightClass="text-gradient"
            description="Fractional ownership makes real estate accessible, affordable, and less risky. Here's why it works."
          />

          <ScrollReveal>
            <div className="grid-4 invest-benefits-grid">
              {benefits.map((b, i) => (
                <div key={i} className="glass-card invest-benefit-card">
                  <div className="invest-benefit-icon">{b.icon}</div>
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Legal & Trust Section ─── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionHeader
            label="Trust & Transparency"
            title="Your Investment is"
            titleHighlight="Legally Protected"
            highlightClass="text-gradient"
            description="We believe in full transparency. Every investment is legally structured, documented, and digitally tracked."
          />

          <ScrollReveal>
            <div className="grid-2 invest-trust-grid">
              {trustPoints.map((tp, i) => (
                <div key={i} className="invest-trust-card">
                  <div className="invest-trust-icon">{tp.icon}</div>
                  <div>
                    <h4>{tp.title}</h4>
                    <p>{tp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <SectionHeader
            label="FAQ"
            title="Common"
            titleHighlight="Questions"
            highlightClass="text-gradient"
            description="Everything you need to know about fractional property ownership on iN Empower."
          />

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.03}>
                <FAQItem
                  faq={faq}
                  isOpen={openFAQ === i}
                  onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <CTABanner
        title="Ready to Start"
        titleHighlight="Investing"
        description="Take your first step towards property ownership. Our team will guide you through every step — from selecting your shares to signing the agreement."
        buttonText="Start Investing →"
        buttonLink="/contact?service=invest"
      />
    </>
  )
}
