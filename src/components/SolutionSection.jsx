import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'
import { useHomeText } from '../i18n/homeText'

export default function SolutionSection() {
  const H = useHomeText().solution
  const icons = ['🛡️', '🧠', '🤝', '🌐']
  const solutions = H.items.map((s, i) => ({ ...s, icon: icons[i] }))

  return (
    <section className="section-compact">
      <div className="container">
        <SectionHeader
          compact
          label={H.label}
          title={H.title}
          titleHighlight={H.hi}
          highlightClass="text-gradient"
          description={H.text}
        />
        <div className="grid-2" style={{ gap: '1rem' }}>
          {solutions.map((s, i) => (
            <ScrollReveal key={i} delay={i} className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="card-icon" style={{ marginBottom: 0, width: '48px', height: '48px', flexShrink: 0, fontSize: '1.25rem' }}>{s.icon}</div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
