import ScrollReveal from './ScrollReveal'

export default function SectionHeader({ label, title, titleHighlight, highlightClass = 'text-teal', description, style, titleStyle, compact = false }) {
  return (
    <ScrollReveal className={compact ? "section-header-compact" : "section-header"} style={style}>
      {label && <p className="label">{label}</p>}
      <h2 style={titleStyle}>
        {title}{' '}
        {titleHighlight && <span className={highlightClass}>{titleHighlight}</span>}
      </h2>
      {description && <p>{description}</p>}
    </ScrollReveal>
  )
}
