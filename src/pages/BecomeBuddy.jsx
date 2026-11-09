import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import ScrollReveal from '../components/ScrollReveal'
import { api } from '../services/api'
import { useToast } from '../context/ToastContext'
import { BUDDY_STEPS, BUDDY_STEPS_TE } from '../data/buddyData'
import { buddySteps, buddyText, say, optValue, checkStep, buildBuddyApplication, NOT_SURE_BUDDY } from '../data/buddyApply'
import { useLanguage } from '../context/LanguageContext'
import { celebrate } from '../utils/celebrate'

const HERO = {
  en: { title: 'Become a Local Buddy | iN Empower', label: 'Earn from your hometown', heroTitle: 'Become a', heroHi: 'Local Buddy',
    heroText: 'Help people from your own town with documents, offices and everyday services — and earn with dignity, without leaving home.' },
  te: { title: 'లోకల్ బడ్డీ అవ్వండి | iN Empower', label: 'సొంత ఊరిలోనే సంపాదించండి', heroTitle: '', heroHi: 'లోకల్ బడ్డీ అవ్వండి',
    heroText: 'మీ ఊరి ప్రజలకు పత్రాలు, కార్యాలయ పనులు, రోజువారీ సేవల్లో సహాయం చేయండి — ఇల్లు వదలకుండా గౌరవంగా సంపాదించండి.' },
}

export default function BecomeBuddy() {
  const { addToast } = useToast()
  const { lang } = useLanguage()
  const H = HERO[lang] || HERO.en
  const T = (k, v) => buddyText(lang, k, v)
  const JOIN = lang === 'te' ? BUDDY_STEPS_TE : BUDDY_STEPS

  const [started, setStarted] = useState(false)
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [other, setOther] = useState({}) // typed "Other" text per step
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(null) // { ref, name, phone }
  const cardRef = useRef(null)

  const steps = useMemo(() => buddySteps(answers.skills || []), [answers.skills])
  const reviewing = idx >= steps.length
  const step = steps[Math.min(idx, steps.length - 1)]

  useEffect(() => { document.title = H.title }, [H.title])
  useEffect(() => {
    api.getCurrentUser().then((u) => {
      if (u) setAnswers((a) => ({ ...a, name: a.name || u.name || '', phone: a.phone || u.phone || '', email: a.email || u.email || '' }))
    }).catch(() => {})
  }, [])
  // Keep the question in view on phones
  useEffect(() => { if (started) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [idx, started])

  // The value used for checks: chosen options + typed "Other"
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
        const cur = a[s.key] || []
        if (value === NOT_SURE_BUDDY[0]) return { ...a, [s.key]: cur.includes(value) ? [] : [value] }
        const list = cur.filter((x) => x !== NOT_SURE_BUDDY[0])
        return { ...a, [s.key]: list.includes(value) ? list.filter((x) => x !== value) : [...list, value] }
      })
    } else {
      setAnswers((a) => ({ ...a, [s.key]: a[s.key] === value ? undefined : value }))
    }
  }

  const next = () => {
    const err = checkStep(step, valueOf(step))
    if (err) { setError(T(err)); return }
    setError('')
    setIdx((i) => i + 1)
  }
  const back = () => { setError(''); setIdx((i) => Math.max(0, i - 1)) }

  const finalAnswers = () => {
    const out = {}
    for (const s of steps) out[s.key] = valueOf(s)
    return out
  }

  const send = async () => {
    setSending(true)
    try {
      const app = buildBuddyApplication(finalAnswers())
      await api.applyAsBuddy(app)
      setDone({ ref: app.ref, name: app.name.split(' ')[0], phone: app.phone })
      celebrate()
      window.scrollTo(0, 0)
    } catch (err) {
      addToast(lang === 'te' ? T('sendFail') : err.message, 'error')
    } finally {
      setSending(false)
    }
  }

  const shown = (s) => {
    const v = valueOf(s)
    const label = (x) => { const o = (s.options || []).find((op) => optValue(op) === x); return o ? say(o, lang) : x === NOT_SURE_BUDDY[0] ? say(NOT_SURE_BUDDY, lang) : x }
    if (Array.isArray(v)) return v.map(label).join(', ')
    return v ? label(v) : ''
  }

  const options = step && step.options ? [...step.options, ...(step.notSure ? [NOT_SURE_BUDDY] : [])] : []

  return (
    <>
      <PageHero label={H.label} title={H.heroTitle} titleHighlight={H.heroHi} description={H.heroText} />

      <section className="section-compact" style={{ paddingTop: 0, paddingBottom: '6rem' }}>
        <div className="container">
          <div className="buddy-steps">
            {JOIN.map((s, i) => (
              <ScrollReveal key={s.n} delay={i} className="glass-card buddy-step">
                <span className="buddy-step-num">{s.n}</span>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </ScrollReveal>
            ))}
          </div>

          {done ? (
            <div className="glass-card buddy-done">
              <div style={{ fontSize: '2.5rem' }}>🙏</div>
              <h2>{T('thanks', { name: done.name })}</h2>
              <p>{T('yourRef')}: <strong>{done.ref}</strong></p>
              <p>{T('calls', { phone: done.phone })}</p>
              <p className="buddy-muted">{T('bringPapers')}</p>
              <Link to="/" className="btn btn-primary">{T('home')}</Link>
            </div>
          ) : !started ? (
            <div className="glass-card buddy-done">
              <p style={{ maxWidth: 520 }}>{T('intro')}</p>
              <button type="button" className="btn btn-primary" onClick={() => setStarted(true)}>{T('start')}</button>
              <Link to="/become-a-partner" className="buddy-muted" style={{ marginTop: '0.5rem' }}>
                {lang === 'te' ? 'దుకాణం లేదా వ్యాపారం ఉందా? బిజినెస్ పార్ట్‌నర్‌గా చేరండి →' : 'Have a shop or business? Join as a Business Partner →'}
              </Link>
            </div>
          ) : (
            <div className="glass-card buddy-wizard" ref={cardRef}>
              <div className="buddy-progress-row">
                <span>{reviewing ? T('review') : T('stepOf', { n: idx + 1, total: steps.length })}</span>
              </div>
              <div className="buddy-track"><div className="buddy-fill" style={{ width: `${Math.min(100, ((idx + 1) / (steps.length + 1)) * 100)}%` }} /></div>

              {!reviewing ? (
                <div className="buddy-q">
                  {step.group === 'skill' && <p className="buddy-skill-head">{T('skillHead', { skill: say(step.skillName, lang) })}</p>}
                  <h2>{say(step.ask, lang)}</h2>
                  {step.sub && <p className="buddy-muted">{say(step.sub, lang)}</p>}
                  {step.kind === 'many' && <p className="buddy-muted">{T('pickAny')}</p>}

                  {(step.kind === 'text' || step.kind === 'phone') && (
                    <input
                      className="buddy-input"
                      autoFocus
                      type={step.kind === 'phone' ? 'tel' : step.input || 'text'}
                      inputMode={step.kind === 'phone' ? 'tel' : undefined}
                      value={answers[step.key] || ''}
                      placeholder={step.kind === 'phone' ? '98765 43210' : T('typeHere')}
                      onChange={(e) => { setError(''); setAnswers((a) => ({ ...a, [step.key]: e.target.value })) }}
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
                      placeholder={T('typeHere')}
                      onChange={(e) => { setError(''); setAnswers((a) => ({ ...a, [step.key]: e.target.value })) }}
                      aria-label={say(step.ask, lang)}
                    />
                  )}
                  {(step.kind === 'one' || step.kind === 'many') && (
                    <div className="buddy-options" role={step.kind === 'one' ? 'radiogroup' : 'group'} aria-label={say(step.ask, lang)}>
                      {options.map((o) => {
                        const v = optValue(o)
                        const on = step.kind === 'many' ? (answers[step.key] || []).includes(v) : answers[step.key] === v
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
                            <span>{say(o, lang)}</span>
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
                          <span>{T('other')}</span>
                        </button>
                      )}
                    </div>
                  )}
                  {step.other && (step.kind === 'many' || answers[step.key] === '__other') && (
                    <input
                      className="buddy-input"
                      value={other[step.key] || ''}
                      placeholder={T('other')}
                      onChange={(e) => { setError(''); setOther((o) => ({ ...o, [step.key]: e.target.value })) }}
                      aria-label={T('other')}
                    />
                  )}

                  {error && <p className="buddy-error" role="alert">{error}</p>}

                  <div className="buddy-nav">
                    {idx > 0 ? <button type="button" className="btn btn-ghost" onClick={back}>← {T('back')}</button> : <span />}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {step.optional && !valueOf(step)?.length && <button type="button" className="btn btn-ghost" onClick={() => { setError(''); setIdx((i) => i + 1) }}>{T('skip')}</button>}
                      <button type="button" className="btn btn-primary" onClick={next}>{T('next')} →</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="buddy-q">
                  <h2>{T('review')}</h2>
                  <div className="buddy-review">
                    {steps.map((s, i) => {
                      const v = shown(s)
                      if (!v) return null
                      return (
                        <div key={s.key} className="buddy-review-row">
                          <div>
                            <span className="buddy-muted">{s.group === 'skill' ? `${say(s.skillName, lang)} — ` : ''}{say(s.ask, lang)}</span>
                            <strong>{v}</strong>
                          </div>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIdx(i)}>{T('change')}</button>
                        </div>
                      )
                    })}
                  </div>
                  <p className="buddy-muted" style={{ fontSize: '0.85rem' }}>{T('agree')}</p>
                  <div className="buddy-nav">
                    <button type="button" className="btn btn-ghost" onClick={back}>← {T('back')}</button>
                    <button type="button" className="btn btn-primary" onClick={send} disabled={sending}>{sending ? T('sending') : `${T('send')} →`}</button>
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
