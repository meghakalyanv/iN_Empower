import { useEffect, useRef } from 'react'
import ScrollReveal from './ScrollReveal'
import { useHomeText } from '../i18n/homeText'

function Counter({ count, suffix = '', prefix = '' }) {
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const duration = 2000
          const start = performance.now()

          function update(currentTime) {
            const elapsed = currentTime - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.floor(eased * count)
            el.textContent = prefix + current.toLocaleString() + suffix
            if (progress < 1) requestAnimationFrame(update)
          }
          requestAnimationFrame(update)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [count, suffix, prefix])

  return <h3 ref={ref}>0</h3>
}

export default function StatsBar() {
  const H = useHomeText()
  const stats = [
    { count: 90, suffix: '+', label: H.stats[0] },
    { count: 16, suffix: '', label: H.stats[1] },
    { count: 2, suffix: '', label: H.stats[2] },
    { count: 3, suffix: H.tierSuffix, label: H.stats[3] },
  ]

  return (
    <section className="stats-bar">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} delay={i} className="stat-item">
              <Counter count={stat.count} suffix={stat.suffix} prefix={stat.prefix || ''} />
              <p>{stat.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
