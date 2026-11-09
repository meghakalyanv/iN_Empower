import { Link } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'

export default function CTABanner({ title, titleHighlight, highlightClass = 'text-teal', description, buttonText, buttonLink = '/contact', style }) {
  return (
    <section className="section kalamkari-border-bottom" style={{ background: 'var(--bg-secondary)', textAlign: 'center' }}>
      <div className="container">
        <ScrollReveal className="cta-banner" style={style}>
          <h2>{title} <span className={highlightClass}>{titleHighlight}</span>?</h2>
          <p>{description}</p>
          <Link to={buttonLink} className="btn btn-primary">{buttonText}</Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
