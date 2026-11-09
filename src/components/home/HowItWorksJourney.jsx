import ScrollReveal from '../ScrollReveal'
import { useHomeText } from '../../i18n/homeText'

export default function HowItWorksJourney() {
  const H = useHomeText().how
  return (
    <section className="section-compact" id="how-it-works">
      <div className="container">
        <div className="grid-2 flex-center" style={{ marginBottom: '2rem' }}>
          <ScrollReveal className="section-header" style={{ textAlign: 'left', margin: 0 }}>
            <p className="label">{H.label}</p>
            <h2>{H.titleA}<span className="text-teal">{H.titleHi}</span>{H.titleB}</h2>
            <p>{H.text}</p>
          </ScrollReveal>
          <ScrollReveal delay={2} className="theme-image-wrapper">
            <img loading="lazy" decoding="async" src="/images/kalamkari_gov_office.webp" alt={H.alt} className="theme-image" style={{ maxHeight: '250px' }} />
          </ScrollReveal>
        </div>
        <div className="steps-row">
          {H.steps.map((step, i) => (
            <ScrollReveal key={i} delay={i} className="step-card">
              <div className="step-number">{String(i + 1).padStart(2, '0')}</div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
