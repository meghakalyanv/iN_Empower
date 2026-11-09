import { Link } from 'react-router-dom'
import { useHomeText } from '../i18n/homeText'

export default function NotFound() {
  const H = useHomeText().notFound
  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--accent-teal)', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ marginBottom: '1.5rem' }}>{H.title}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '500px' }}>
        {H.text}
      </p>
      <Link to="/" className="btn btn-primary">
        {H.btn}
      </Link>
    </div>
  )
}
