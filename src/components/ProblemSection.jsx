import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'
import { useHomeText } from '../i18n/homeText'

export default function ProblemSection() {
  const H = useHomeText().problem
  const icons = ['🏙️', '🔗', '⚠️']
  const problems = H.items.map((p, i) => ({ ...p, icon: icons[i] }))

  return (
    <section className="section-compact" id="problem">
      <div className="container">
        <SectionHeader
          compact
          label={H.label}
          title={H.title}
          titleHighlight={H.hi}
          description={H.text}
        />
        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {problems.map((p, i) => (
            <ScrollReveal key={i} delay={i} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div className="card-icon" style={{ margin: '0 auto 1rem', width: '56px', height: '56px', fontSize: '1.5rem' }}>{p.icon}</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{p.title}</h3>
              <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
