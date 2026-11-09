import { Link } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'
import { useHomeText } from '../i18n/homeText'
import { isPageOn } from '../data/cities'

export default function SuppliesPreview() {
  const H = useHomeText().supplies
  if (!isPageOn('supplies')) return null // Supplies switched off for this city (Admin → Cities)
  const previewItems = [
    // Supply toys, the same as in the app (owner, 30 Oct 2026)
    { title: H.items[0], icon: 'Mountain', iconColor: '#8B2127', toy: '/images/toys/supplies/granite.png' },
    { title: H.items[1], icon: 'Box', iconColor: '#2F5233', toy: '/images/toys/supplies/sand.png' },
    { title: H.items[2], icon: 'Truck', iconColor: '#8B5A2B', toy: '/images/toys/supplies/transport.png' },
    { title: H.items[3], icon: 'Utensils', iconColor: '#2F5233', toy: '/images/toys/supplies/catering.png' }
  ]

  return (
    <section className="section-compact" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <SectionHeader
          compact
          label={H.label}
          title={H.title}
          titleHighlight={H.hi}
          description={H.text}
        />
        
        <ScrollReveal className="grid-4" style={{ marginTop: '2rem', marginBottom: '2.5rem' }}>
          {previewItems.map((item, idx) => (
            <div key={idx} className="glass-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <img loading="lazy" decoding="async" src={item.toy} alt="" width={80} height={80} style={{ width: 80, height: 80, objectFit: 'contain' }} />
              </div>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{item.title}</h4>
            </div>
          ))}
        </ScrollReveal>

        <div style={{ textAlign: 'center' }}>
          <Link to="/supplies" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            {H.btn}
          </Link>
        </div>
      </div>
    </section>
  )
}
