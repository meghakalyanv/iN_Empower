import ScrollReveal from '../ScrollReveal'
import SectionHeader from '../SectionHeader'
import { useHomeText } from '../../i18n/homeText'

const CHALLENGE_STYLE = [
  { icon: '❤️', bg: 'rgba(255,153,51,0.15)', border: 'rgba(255,153,51,0.2)' },
  { icon: '🌱', bg: 'rgba(255,209,102,0.15)', border: 'rgba(255,209,102,0.2)' },
  { icon: '🤝', bg: 'rgba(0,0,128,0.15)', border: 'rgba(0,0,128,0.2)' },
]
const PROMISE_ICONS = ['☀️', '🏡', '🌟']

export default function AboutVisionMission() {
  const H = useHomeText().vision
  return (
    <>
      {/* Vision & Mission */}
      <section className="section-compact">
        <div className="container">
          <ScrollReveal className="about-hero-grid">
            <div className="theme-image-wrapper">
              <img loading="lazy" decoding="async" src="/images/kalamkari_trusted_buddy.webp" alt={H.alt} className="theme-image" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }} />
            </div>
            <div className="about-cards-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-card" style={{ borderLeft: '3px solid var(--accent-teal)', padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div className="card-icon" style={{ width: '40px', height: '40px', fontSize: '1.2rem', margin: 0, flexShrink: 0, background: 'rgba(56, 182, 255, 0.1)', borderColor: 'rgba(56, 182, 255, 0.2)' }}>🎯</div>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem' }}>{H.visionTitle}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-light)' }}>{H.vision}</p>
                </div>
              </div>

              <div className="glass-card" style={{ borderLeft: '3px solid var(--accent-gold)', padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div className="card-icon" style={{ width: '40px', height: '40px', fontSize: '1.2rem', margin: 0, flexShrink: 0, background: 'rgba(255, 209, 102, 0.1)', borderColor: 'rgba(255, 209, 102, 0.2)' }}>💡</div>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem' }}>{H.missionTitle}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-light)' }}>{H.mission}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* The Challenge */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHeader label={H.chLabel} title={H.chTitle} titleHighlight={H.chHi} description={H.chText} />
          <div className="grid-3">
            {H.challenges.map((c, i) => ({ ...c, ...CHALLENGE_STYLE[i] })).map((item, i) => (
              <ScrollReveal key={i} delay={i} className="glass-card">
                <div className="card-icon" style={{ background: `linear-gradient(135deg, ${item.bg}, ${item.bg.replace('0.15', '0.08')})`, borderColor: item.border }}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHeader label={H.prLabel} title={H.prTitle} titleHighlight={H.prHi} highlightClass="text-gradient" description={H.prText} />
          <div className="grid-3">
            {H.promises.map((item, i) => (
              <ScrollReveal key={i} delay={i} className="glass-card" style={{ textAlign: 'center' }}>
                <div className="card-icon" style={{ margin: '0 auto 1.25rem', width: '72px', height: '72px', fontSize: '2rem' }}>{PROMISE_ICONS[i]}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9-Step Operational Flow */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHeader label={H.jLabel} title={H.jTitle} titleHighlight={H.jHi} description={H.jText} />
          <ScrollReveal className="timeline">
            {H.journey.map((step, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-dot"></div>
                <h4><span className="text-teal">{String(i + 1).padStart(2, '0')}.</span> {step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
