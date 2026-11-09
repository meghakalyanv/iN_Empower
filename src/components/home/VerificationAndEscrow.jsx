import ScrollReveal from '../ScrollReveal'
import SectionHeader from '../SectionHeader'
import { useHomeText } from '../../i18n/homeText'

const PAY_STYLE = [
  { icon: '📝', borderColor: undefined },
  { icon: '💬', borderColor: 'var(--accent-gold)' },
  { icon: '💰', borderColor: 'var(--accent-blue)' },
  { icon: '✅', borderColor: 'var(--accent-gold)' },
]

export default function VerificationAndEscrow() {
  const H = useHomeText().verify
  return (
    <>
      {/* 3-Tier Verification */}
      <section className="section-compact" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHeader label={H.label} title={H.title} titleHighlight={H.hi} description={H.text} />
          <div className="grid-3">
            {H.tiers.map((t, i) => (
              <ScrollReveal key={i} delay={i} className={`tier-card tier-${i + 1}`}>
                <span className="tier-badge">{t.badge}</span>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <ul style={{ marginTop: '1rem' }}>
                  {t.items.map((item, j) => (
                    <li key={j} style={{ padding: '0.3rem 0', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>✓ {item}</li>
                  ))}
                </ul>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How payment works (escrow is not live yet) */}
      <section className="section-compact" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHeader label={H.payLabel} title={H.payTitle} titleHighlight={H.payHi} highlightClass="text-gold" description={H.payText} />
          <ScrollReveal className="escrow-flow">
            {H.pay.map((s, i) => ({ ...s, ...PAY_STYLE[i] })).map((step, i, arr) => (
              <span key={i} style={{ display: 'contents' }}>
                <div className="escrow-step">
                  <div className="es-icon" style={step.borderColor ? { borderColor: step.borderColor } : undefined}>{step.icon}</div>
                  <h4>{step.title}</h4>
                  <p style={{ fontSize: '0.88rem' }}>{step.desc}</p>
                </div>
                {i < arr.length - 1 && <div className="escrow-arrow">→</div>}
              </span>
            ))}
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
