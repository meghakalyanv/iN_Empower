import { useHomeText } from '../../i18n/homeText'

export default function TrustTicker() {
  const H = useHomeText()
  const icons = ['🛡️', '🤝', '✅', '📋', '⭐', '🏡', '💳', '🤝', '📞', '🏆']
  const items = H.ticker.map((text, i) => ({ icon: icons[i], text }))

  // Duplicate items for seamless infinite scroll
  const tickerItems = [...items, ...items]

  return (
    <div className="trust-ticker">
      <div className="trust-ticker__track">
        {tickerItems.map((item, i) => (
          <div className="trust-ticker__item" key={i}>
            <span className="trust-ticker__icon">{item.icon}</span>
            <span className="trust-ticker__text">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
