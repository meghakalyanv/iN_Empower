import { Link } from 'react-router-dom'
import ScrollReveal from '../ScrollReveal'
import { useHomeText } from '../../i18n/homeText'
import { isPathOn } from '../../data/cities'

export default function PromoBanner() {
  const H = useHomeText()
  const promos = [
    {
      icon: '🪨',
      ...H.promos[0],
      link: '/supplies',
      gradient: 'linear-gradient(135deg, #FF9933 0%, #FFB366 100%)',
      glow: 'rgba(255, 153, 51, 0.3)',
    },
    {
      icon: '💼',
      ...H.promos[1],
      link: '/youth-hub?tab=jobs',
      gradient: 'linear-gradient(135deg, #000080 0%, #3333B2 100%)',
      glow: 'rgba(0, 0, 128, 0.3)',
    },
    {
      icon: '🎓',
      ...H.promos[2],
      link: '/youth-hub?tab=workshops',
      gradient: 'linear-gradient(135deg, #138808 0%, #2DB82D 100%)',
      glow: 'rgba(19, 136, 8, 0.3)',
    },
  ].filter((promo) => isPathOn(promo.link)) // only pages the customer's city has on

  if (!promos.length) return null
  return (
    <section className="section-compact promo-banner-section">
      <div className="container">
        <div className="promo-banner__grid" style={promos.length < 3 ? { gridTemplateColumns: `repeat(${promos.length}, minmax(0, 420px))`, justifyContent: 'center' } : undefined}>
          {promos.map((promo, i) => (
            <ScrollReveal key={i} delay={i}>
              <Link to={promo.link} className="promo-card" style={{ '--promo-gradient': promo.gradient, '--promo-glow': promo.glow }}>
                <div className="promo-card__icon-wrap">
                  <span className="promo-card__icon">{promo.icon}</span>
                </div>
                <h3 className="promo-card__title">{promo.title}</h3>
                <p className="promo-card__desc">{promo.desc}</p>
                <span className="promo-card__cta">{promo.cta}</span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
