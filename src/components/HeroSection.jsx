import { Link } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'
import { useHomeText } from '../i18n/homeText'

export default function HeroSection() {
  const H = useHomeText().hero
  return (
    <section className="hero" id="hero">
      <div className="hero-bg"></div>
      <div className="container">
        <div className="grid-2 flex-center">
          <div className="hero-content">
            <p className="label">{H.label}</p>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3.8vw, 3rem)' }}>
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>{H.line1a}<span className="text-gradient">{H.line1b}</span>{H.line1c}</span><br />
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>{H.line2}</span>
            </h1>
            <p>{H.text}</p>
            <div className="hero-buttons">
              <Link to="/services" className="btn btn-primary">{H.explore}</Link>
              <a href="#how-it-works" className="btn btn-outline">{H.how}</a>
            </div>
          </div>
          <ScrollReveal delay={2} className="hero-image-wrapper">
            <div className="theme-image-wrapper">
              <img fetchPriority="high" src="/images/kalamkari_hero_customer.webp" alt={H.alt} className="theme-image" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
