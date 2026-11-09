import ScrollReveal from './ScrollReveal'

export default function PageHero({ label, title, titleHighlight, description, children, style, className = '' }) {
  return (
    <section className={`page-hero ${className}`} style={style}>
      <div className="hero-bg"></div>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {label && <p className="label">{label}</p>}
        <h1>{title} <span className="text-gradient">{titleHighlight}</span></h1>
        {description && <p>{description}</p>}
        {children}
      </div>
    </section>
  )
}
