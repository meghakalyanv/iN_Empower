import ScrollReveal from '../ScrollReveal'
import SectionHeader from '../SectionHeader'
import { useHomeText } from '../../i18n/homeText'

export default function AboutCoreValues() {
  const H = useHomeText().values
  const icons = ['🫂', '🏡', '🕊️', '🌳']
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <SectionHeader label={H.label} title={H.title} titleHighlight={H.hi} highlightClass="text-gradient" />
        <div className="grid-4">
          {H.items.map((it, i) => ({ ...it, icon: icons[i] })).map((v, i) => (
            <ScrollReveal key={i} delay={i} className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{v.icon}</div>
              <h4>{v.title}</h4>
              <p style={{ fontSize: '0.88rem' }}>{v.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
