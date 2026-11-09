import { useState } from 'react'
import ScrollReveal from '../ScrollReveal'
import SectionHeader from '../SectionHeader'
import { useHomeText } from '../../i18n/homeText'

const BOLD_COLOR = { travelers: 'var(--accent-teal)', businesses: 'var(--accent-gold)' }

export default function CustomerSegments() {
  const [activeSegment, setActiveSegment] = useState('travelers')
  const H = useHomeText().segments
  const [listCard, boldCard] = H[activeSegment]

  return (
    <section className="section-compact" style={{ paddingTop: 0 }}>
      <div className="container">
        <SectionHeader label={H.label} title={H.title} titleHighlight={H.hi} highlightClass="text-gradient" description={H.text} />

        <ScrollReveal className="segment-tabs-wrapper">
          <div className="segment-tabs">
            {Object.keys(H.tabs).map(seg => (
              <button
                key={seg}
                className={`segment-tab${activeSegment === seg ? ' active' : ''}`}
                onClick={() => setActiveSegment(seg)}
              >
                {H.tabs[seg]}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="segment-panel" key={activeSegment} style={{ animation: 'fadeIn 0.5s ease' }}>
          <div className="grid-2">
            <div className="glass-card">
              <h3>{listCard.title}</h3>
              <p>{listCard.intro}</p>
              <ul style={{ marginTop: '1rem' }}>
                {listCard.list.map((item, i) => (
                  <li key={i} style={{ padding: '0.4rem 0', color: 'var(--text-secondary)' }}>→ {item}</li>
                ))}
              </ul>
            </div>
            <div className="glass-card">
              <h3>{boldCard.title}</h3>
              <p>{boldCard.intro}</p>
              <ul style={{ marginTop: '1rem' }}>
                {boldCard.bold.map(([bold, rest], i) => (
                  <li key={i} style={{ padding: '0.4rem 0', color: 'var(--text-secondary)' }}>→ <strong style={{ color: BOLD_COLOR[activeSegment] }}>{bold}</strong>{rest}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
