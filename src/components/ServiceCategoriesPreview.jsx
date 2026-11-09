import { Link } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'
import { useHomeText } from '../i18n/homeText'

export default function ServiceCategoriesPreview() {
  const H = useHomeText().catalog
  return (
    <section className="section-compact" id="services-preview">
      <div className="container" style={{ textAlign: 'center' }}>
        <SectionHeader
          compact
          label={H.label}
          title={H.title}
          titleHighlight={H.hi}
          description={H.text}
        />
        <div style={{ marginTop: '2rem' }}>
          <Link to="/services" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            {H.btn}
          </Link>
        </div>
      </div>
    </section>
  )
}
