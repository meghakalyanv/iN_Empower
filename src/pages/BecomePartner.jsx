import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import ScrollReveal from '../components/ScrollReveal'
import { api } from '../services/api'
import { useToast } from '../context/ToastContext'
import { useLanguage } from '../context/LanguageContext'
import {
  partnerSteps, partnerText, say, optValue, checkPartnerStep, buildPartnerApplication, PARTNER_HOW, PARTNER_KIND_EXAMPLES,
} from '../data/partnerApply'
import { celebrate } from '../utils/celebrate'

const HERO = {
  en: { title: 'Join as a Business Partner | iN Empower', label: 'Shops, suppliers, professionals, hospitals', heroTitle: 'Join as a', heroHi: 'Business Partner',
    heroText: 'More orders, no extra selling. We bring the orders. You supply. Our Local Buddy coordinates every order.' },
  te: { title: 'బిజినెస్ పార్ట్‌నర్‌గా చేరండి | iN Empower', label: 'దుకాణాలు, సరఫరాదారులు, నిపుణులు, ఆసుపత్రులు', heroTitle: '', heroHi: 'బిజినెస్ పార్ట్‌నర్‌గా చేరండి',
    heroText: 'అదనపు అమ్మకపు శ్రమ లేకుండా ఎక్కువ ఆర్డర్లు. ఆర్డర్లు మేము తెస్తాము. మీరు సరఫరా చేయండి. ప్రతి ఆర్డర్‌ను మా లోకల్ బడ్డీ సమన్వయం చేస్తారు.' },
}

/**
 * /become-a-partner — the same questions as the app (data/partnerApply.js):
 * how partnership works → one question at a time → check → send.
 * Arrives in Admin → Partners as a pending application (supabase/014).
 */
export default function BecomePartner() {
  const { addToast } = useToast()
  const { lang } = useLanguage()
  const H = HERO[lang] || HERO.en
  const P = (k, v) => partnerText(lang, k, v)

  const [started, setStarted] = useState(false)
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [other, setOther] = useState({})
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(null) // { ref, name, phone }
  const cardRef = useRef(null)

  const steps = useMemo(() => partnerSteps(answers.kind, answers.items), [answers.kind, answers.items])
  const reviewing = idx >= steps.length
  const step = steps[Math.min(idx, steps.length - 1)]

  useEffect(() => { document.title = H.title }, [H.title])
  useEffect(() => {
    api.getCurrentUser().then((u) => {
      if (u) setAnswers((a) => ({ ...a, contact: a.contact || u.name || '', phone: a.phone || u.phone || '' }))
    }).catch(() => {})
  }, [])
  useEffect(() => { if (started) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [idx, started])

  const valueOf = (s) => {
    const v = answers[s.key]
    const typed = (other[s.key] || '').trim()
    if (s.kind === 'many') return [...(v || []), ...(typed ? [typed] : [])]
    if (s.kind === 'one') return v === '__other' ? typed : v
    return v
  }
  const pick = (s, value) => {
    setError('')
    if (s.kind === 'many') {
      setAnswers((a) => {
        const list = a[s.key] || []
        return { ...a, [s.key]: list.includes(value) ? list.filter((x) => x !== value) : [...list, value] }
      })
    } else {
      // Another kind of business offers other things: start that list again
      setAnswers((a) => ({ ...a, [s.key]: a[s.key] === value ? undefined : value, ...(s.key === 'kind' && a.kind !== value ? { items: undefined } : {}) }))
      if (s.key === 'kind') setOther((o) => ({ ...o, items: '' }))
    }
  }
  const setText = (key, v) => { setError(''); setAnswers((a) => ({ ...a, [key]: v })) }

  const next = () => {
    const err = checkPartnerStep(step, valueOf(step))
    if (err) { setError(P(err)); return }
    setError('')
    setIdx((i) => i + 1)
  }
  const back = () => { setError(''); setIdx((i) => Math.max(0, i - 1)) }

  const send = async () => {
    if (sending) return
    setSending(true)
    try {
      const out = {}
      for (const s of steps) out[s.key] = valueOf(s)
      const app = buildPartnerApplication(out)
      const r = await api.applyAsPartner(app)
      setDone({ ref: r?.ref || null, name: app.contact.split(' ')[0], phone: app.phone })
      celebrate()
      window.scrollTo(0, 0)
    } catch (err) {
      addToast(lang === 'te' ? P('sendFail') : err.message || P('sendFail'), 'error')
    } finally {
      setSending(false)
    }
  }

  const shown = (s) => {
    if (s.key === 'whatsapp') {
      if (answers.whatsapp === 'same') return say(s.options[0], lang)
      if (answers.whatsapp === 'none') return say(s.options[1], lang)
    }
    const v = valueOf(s)
    const label = (x) => { const o = (s.options || []).find((op) => optValue(op) === x); return o ? say(o, lang) : x }
    if (Array.isArray(v)) return v.map(label).join(', ')
    return v ? label(v) : ''
  }

  return (
    <>
      <PageHero label={H.label} title={H.heroTitle} titleHighlight={H.heroHi} description={H.heroText} />

      <section className="section-compact" style={{ paddingTop: 0, paddingBottom: '6rem' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>{P('how')}</h2>
          <div className="buddy-steps">
            {PARTNER_HOW.map((line, i) => (
              <ScrollReveal key={i} delay={i} className="glass-card buddy-step">
                <span className="buddy-step-num">{i + 1}</span>
                <p>{say(line, lang)}</p>
              </ScrollReveal>
            ))}
          </div>

          {done ? (
            <div className="glass-card buddy-done" role="status">
              <div style={{ fontSize: '2.5rem' }}>🤝</div>
              <h2>{P('thanks', { name: done.name })}</h2>
              {done.ref && <p>{P('yourRef')}: <strong>{done.ref}</strong></p>}
              <ol style={{ textAlign: 'left', maxWidth: 520, lineHeight: 1.6 }}>
                <li>{P('next1', { phone: done.phone })}</li>
                <li>{P('next2')}</li>
                <li>{P('next3')}</li>
              </ol>
              <Link to="/" className="btn btn-primary">{P('home')}</Link>
            </div>
          ) : !started ? (
            <div className="glass-card buddy-done">
              <p style={{ maxWidth: 520 }}>{P('intro')}</p>
              <button type="button" className="btn btn-primary" onClick={() => setStarted(true)}>{P('start')} →</button>
            </div>
          ) : (
            <div className="glass-card buddy-wizard" ref={cardRef}>
              <div className="buddy-progress-row">
                <span>{reviewing ? P('review') : P('stepOf', { n: idx + 1, total: steps.length })}</span>
              </div>
              <div className="buddy-track"><div className="buddy-fill" style={{ width: `${Math.min(100, ((idx + 1) / (steps.length + 1)) * 100)}%` }} /></div>

              {!reviewing ? (
                <div className="buddy-q">
                  <h2>{say(step.ask, lang)}</h2>
                  {step.sub && <p className="buddy-muted">{say(step.sub, lang)}</p>}
                  {step.kind === 'many' && <p className="buddy-muted">{P('pickAny')}</p>}

                  {(step.kind === 'text' || step.kind === 'phone') && (
                    <input
                      className="buddy-input"
                      autoFocus
                      type={step.kind === 'phone' ? 'tel' : 'text'}
                      inputMode={step.kind === 'phone' ? 'tel' : undefined}
                      value={answers[step.key] || ''}
                      placeholder={step.kind === 'phone' ? '98765 43210' : P('typeHere')}
                      onChange={(e) => setText(step.key, step.key === 'gst' ? e.target.value.toUpperCase() : e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && next()}
                      aria-label={say(step.ask, lang)}
                    />
                  )}
                  {step.kind === 'long' && (
                    <textarea
                      className="buddy-input"
                      rows={3}
                      autoFocus
                      value={answers[step.key] || ''}
                      placeholder={P('typeHere')}
                      onChange={(e) => setText(step.key, e.target.value)}
                      aria-label={say(step.ask, lang)}
                    />
                  )}
                  {(step.kind === 'one' || step.kind === 'many') && (
                    <div className="buddy-options" role={step.kind === 'one' ? 'radiogroup' : 'group'} aria-label={say(step.ask, lang)}>
                      {(step.options || []).map((o) => {
                        const v = optValue(o)
                        const on = step.kind === 'many' ? (answers[step.key] || []).includes(v) : answers[step.key] === v
                        const example = step.key === 'kind' ? PARTNER_KIND_EXAMPLES[v] : null
                        return (
                          <button
                            type="button"
                            key={v}
                            className={`buddy-option${on ? ' on' : ''}`}
                            role={step.kind === 'one' ? 'radio' : 'checkbox'}
                            aria-checked={on}
                            onClick={() => pick(step, v)}
                          >
                            <span className="buddy-tick" aria-hidden="true">{on ? '✓' : ''}</span>
                            <span>
                              {say(o, lang)}
                              {example && <span className="buddy-muted" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 400 }}>{say(example, lang)}</span>}
                            </span>
                          </button>
                        )
                      })}
                      {step.other && step.kind === 'one' && (
                        <button
                          type="button"
                          className={`buddy-option${answers[step.key] === '__other' ? ' on' : ''}`}
                          role="radio"
                          aria-checked={answers[step.key] === '__other'}
                          onClick={() => pick(step, '__other')}
                        >
                          <span className="buddy-tick" aria-hidden="true">{answers[step.key] === '__other' ? '✓' : ''}</span>
                          <span>{step.otherLabel ? say(step.otherLabel, lang) : P('other')}</span>
                        </button>
                      )}
                    </div>
                  )}
                  {step.other && (step.kind === 'many' || answers[step.key] === '__other') && (
                    <input
                      className="buddy-input"
                      value={other[step.key] || ''}
                      type={step.key === 'whatsapp' ? 'tel' : 'text'}
                      placeholder={step.key === 'whatsapp' ? '98765 43210' : P('other')}
                      onChange={(e) => { setError(''); setOther((o) => ({ ...o, [step.key]: e.target.value })) }}
                      aria-label={step.otherLabel ? say(step.otherLabel, lang) : P('other')}
                    />
                  )}

                  {error && <p className="buddy-error" role="alert">{error}</p>}

                  <div className="buddy-nav">
                    {idx > 0 ? <button type="button" className="btn btn-ghost" onClick={back}>← {P('back')}</button> : <span />}
                    <button type="button" className="btn btn-primary" onClick={next}>{P('next')} →</button>
                  </div>
                </div>
              ) : (
                <div className="buddy-q">
                  <h2>{P('review')}</h2>
                  <div className="buddy-review">
                    {steps.map((s, i) => {
                      const v = shown(s)
                      if (!v) return null
                      return (
                        <div key={s.key} className="buddy-review-row">
                          <div>
                            <span className="buddy-muted">{say(s.ask, lang)}</span>
                            <strong>{v}</strong>
                          </div>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIdx(i)}>{P('change')}</button>
                        </div>
                      )
                    })}
                  </div>
                  <p className="buddy-muted" style={{ fontSize: '0.85rem' }}>{P('agree')}</p>
                  <div className="buddy-nav">
                    <button type="button" className="btn btn-ghost" onClick={back}>← {P('back')}</button>
                    <button type="button" className="btn btn-primary" onClick={send} disabled={sending}>{sending ? P('sending') : `${P('send')} →`}</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
