/**
 * A small celebration when something is sent: a green tick pops in and
 * saffron / green / madder confetti bursts out, then it all fades away (~1.8 s).
 * Phones and computers set to "reduce motion" get only the tick, without movement.
 */
const COLORS = ['#FF9933', '#138808', '#8B2127', '#D4A373', '#213361']

export function celebrate() {
  if (typeof document === 'undefined') return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const root = document.createElement('div')
  root.className = 'celebrate'
  root.setAttribute('aria-hidden', 'true')
  const tick = document.createElement('div')
  tick.className = 'celebrate__tick'
  tick.innerHTML = '<svg viewBox="0 0 52 52" width="72" height="72"><circle cx="26" cy="26" r="24" fill="#138808"/><path d="M15 27 l7 7 l15 -16" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  root.appendChild(tick)
  if (!reduce) {
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('i')
      const angle = (Math.PI * 2 * i) / 26 + Math.random() * 0.4
      const dist = 90 + Math.random() * 110
      p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`)
      p.style.setProperty('--dy', `${Math.sin(angle) * dist - 40}px`)
      p.style.setProperty('--rot', `${Math.round(Math.random() * 540 - 270)}deg`)
      p.style.background = COLORS[i % COLORS.length]
      p.style.animationDelay = `${Math.random() * 80}ms`
      root.appendChild(p)
    }
  }
  document.body.appendChild(root)
  setTimeout(() => root.remove(), 1900)
}
