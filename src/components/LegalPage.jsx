import React from 'react'
import { LEGAL_UPDATED } from '../data/legalText'

/** Renders the shared Privacy Policy / Terms text (data/legalText.js). */
export default function LegalPage({ doc }) {
  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '1rem' }}>{doc.title}</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Last updated: {LEGAL_UPDATED}</p>
      <div style={{ marginTop: '2rem', lineHeight: 1.8 }}>
        {doc.intro.map((t, i) => <p key={i}>{t}</p>)}
        {doc.sections.map((s) => (
          <section key={s.h}>
            <h2 style={{ marginTop: '2rem' }}>{s.h}</h2>
            {(s.p || []).filter(() => !s.list).map((t, i) => <p key={i}>{t}</p>)}
            {s.list && <ul>{s.list.map((t, i) => <li key={i}>{t}</li>)}</ul>}
            {s.list && (s.p || []).map((t, i) => <p key={i}>{t}</p>)}
          </section>
        ))}
      </div>
    </div>
  )
}
