/**
 * Kalamkari sun that turns gently while a page loads.
 * `full` fills the screen (first load); otherwise it sits in the page area.
 */
export default function PageLoader({ full = false }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <div className={`page-loader${full ? ' page-loader--full' : ''}`} role="status" aria-live="polite">
      <svg className="kk-sun" viewBox="0 0 100 100" width="64" height="64" aria-hidden="true">
        <g className="kk-sun__rays">
          {petals.map((a) => (
            <path key={a} d="M50 6 C54 16 54 22 50 28 C46 22 46 16 50 6 Z" fill="#FF9933" transform={`rotate(${a} 50 50)`} />
          ))}
        </g>
        <circle cx="50" cy="50" r="17" fill="#8B2127" />
        <circle cx="50" cy="50" r="11" fill="none" stroke="#F4E3C1" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="5" fill="#F4E3C1" />
      </svg>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
