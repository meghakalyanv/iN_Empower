import { useState } from 'react'
import ScrollReveal from '../ScrollReveal'
import SectionHeader from '../SectionHeader'
import { useHomeText } from '../../i18n/homeText'

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(null)
  const H = useHomeText().faq

  const toggleFaq = (index) => {
    setOpenFaq(prev => (prev === index ? null : index))
  }

  return (
    <section className="section-compact" style={{ paddingTop: 0 }}>
      <div className="container">
        <SectionHeader label={H.label} title={H.title} titleHighlight={H.hi} />
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {H.items.map((faq, i) => (
            <ScrollReveal key={i} delay={i % 4} className={`faq-item${openFaq === i ? ' open' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(i)}>
                {faq.q}
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer" style={{ maxHeight: openFaq === i ? '300px' : '0' }}>
                <div className="faq-answer-inner">{faq.a}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
