import { useMemo, useState } from 'react'
import { Phone, Info, FileText, PenLine } from 'lucide-react'
import { isGovService, govNotice } from '../data/legalText'
import { serviceSteps, supplySteps, detailSteps, buildRequest, newRef, NOT_SURE, NOT_SURE_VALUE, TOWNS, SKIPPED_KEY, chatText, offersNotSure } from '../data/chatSteps'
import { svcText } from '../data/servicesTe'
import { splitPapers, papersFirst, detailsAfterPapers, readFromPapersLine, papersText } from '../data/serviceFields'
import { readPhone } from '../data/phone'
import { afterHoursNote, isEmergency } from '../data/workHours'
import { api } from '../services/api'
import { celebrate } from '../utils/celebrate'
import { TourTips } from './Tutorial'

/**
 * The request, right in the service window (owner, 31 Oct 2026): the service's own questions,
 * the customer's details (team only), a tick list of the papers they already have, town, when,
 * name and phone — then "Send request" sends it straight to the team. No Chat Buddy.
 * (The button was "Get Started" until 6 Nov 2026.)
 * Same questions and the same saved request as the app and the Chat Buddy (data/chatSteps.js).
 * "Not sure" (owner, 2 Nov 2026): first on every question, green with a phone, in words that fit the
 * question; it asks "Skip the other N questions?" — Yes hides them (town, when, name and phone stay).
 * "Not sure? Get free advice" at the top skips all the questions.
 */
const TXT = {
  en: {
    need: 'What do you need?', details: 'Your details', detailsSub: 'All optional — they help us tell you the price faster. Only the iN Empower team sees them. No Aadhaar or PAN numbers.',
    papers: 'Papers you already have', papersSub: 'Tick the ones you have. Missing some? We help you get them.',
    where: 'Where and when', town: 'Town or village', typeTown: 'Or type your town', when: 'When do you need it?', notes: 'Anything else we should know? (optional)',
    you: 'Your name and phone', name: 'Your name', phone: 'Mobile number', phoneHint: 'We call you with the price and send updates on WhatsApp. From abroad? Start with + and the country code.',
    other: 'Something else? Type it', notSure: 'Not sure', send: 'Send request →', sending: 'Sending…',
    needName: 'Please type your name.', needPhone: 'Please type a 10-digit mobile number (or + and country code).', failed: 'Could not send. Please check your internet and try again, or call us.',
    sentTitle: 'Request sent!', ref: 'Your reference', sentCall: (p) => `We'll call you on ${p} soon with the price.`, close: 'Done',
    pickJob: 'Which one do you need?',
  },
  te: {
    need: 'మీకు ఏమి కావాలి?', details: 'మీ వివరాలు', detailsSub: 'అన్నీ ఐచ్ఛికం — ధర త్వరగా చెప్పడానికి సహాయపడతాయి. iN Empower బృందం మాత్రమే చూస్తుంది. ఆధార్, PAN నంబర్లు అవసరం లేదు.',
    papers: 'మీ దగ్గర ఉన్న పత్రాలు', papersSub: 'ఉన్నవాటిని టిక్ చేయండి. కొన్ని లేవా? తీసుకోవడంలో మేము సహాయం చేస్తాం.',
    where: 'ఎక్కడ, ఎప్పుడు', town: 'ఊరు లేదా గ్రామం', typeTown: 'లేదా మీ ఊరి పేరు టైప్ చేయండి', when: 'ఎప్పుడు కావాలి?', notes: 'ఇంకేమైనా చెప్పాలా? (ఐచ్ఛికం)',
    you: 'మీ పేరు, ఫోన్', name: 'మీ పేరు', phone: 'మొబైల్ నంబర్', phoneHint: 'ధర చెప్పడానికి మీకు కాల్ చేస్తాం, అప్‌డేట్‌లు WhatsApp లో పంపుతాం. విదేశాల నుంచి అయితే + మరియు దేశ కోడ్‌తో.',
    other: 'ఇంకేదైనా? టైప్ చేయండి', notSure: 'తెలియదు', send: 'అభ్యర్థన పంపండి →', sending: 'పంపుతున్నాం…',
    needName: 'దయచేసి మీ పేరు టైప్ చేయండి.', needPhone: 'దయచేసి 10 అంకెల మొబైల్ నంబర్ టైప్ చేయండి (లేదా + దేశ కోడ్‌తో).', failed: 'పంపలేకపోయాం. ఇంటర్నెట్ చూసి మళ్ళీ ప్రయత్నించండి, లేదా మాకు కాల్ చేయండి.',
    sentTitle: 'అభ్యర్థన అందింది!', ref: 'మీ సూచన సంఖ్య', sentCall: (p) => `ధర చెప్పడానికి త్వరలో ${p}కు కాల్ చేస్తాం.`, close: 'సరే',
    pickJob: 'మీకు ఏది కావాలి?',
  },
}

const KEY = 'inempower_my_contact'
const readSaved = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} } }
const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch { /* private window */ } }
const plain = (label) => String(label || '').replace(/^(🤔|📞)\s*/u, '')

/**
 * Wide window layout (owner, 31 Oct 2026): the questions on the left; town, when, name, phone,
 * Send request and the `aside` (good to know, skip link) on the right, always in view.
 * kind 'supply' asks a supply's order questions (colour, size, quantity) instead.
 */
export default function ServiceRequestForm({ service, item, kind = 'service', lang = 'en', onDone, aside = null }) {
  service = item || service
  const L = lang === 'te' ? 'te' : 'en'
  const t = TXT[L]
  const c = chatText(L)
  const tx = (s) => svcText(L, s)

  // The same steps the Chat Buddy and the app use; the "fill details now?" gate is not needed here
  const steps = useMemo(() => (kind === 'supply' ? supplySteps(service, L) : serviceSteps(service, L)).filter((s) => s.role !== 'detailsGate'), [service, L, kind])
  const details = useMemo(() => (kind === 'supply' ? [] : detailSteps(service, L)), [service, L, kind])
  const questions = steps.filter((s) => !s.role || s.role === 'quantity')
  const townStep = steps.find((s) => s.role === 'area')
  const whenStep = steps.find((s) => s.role === 'urgency' && !questions.includes(s))
  const notesStep = steps.find((s) => s.role === 'notes')
  const papersStep = steps.find((s) => s.role === 'papers')
  // "Not sure? Get free advice" only where an expert question exists (owner, 2 Nov 2026)
  const freeAdvice = useMemo(() => offersNotSure(service, kind), [service, kind])

  const saved = readSaved()
  const [answers, setAnswers] = useState({})
  const [other, setOther] = useState({})     // typed "something else" per question
  const [ticks, setTicks] = useState({})     // paper → true
  const [name, setName] = useState(saved.name || '')
  const [phone, setPhone] = useState(saved.phone || '')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(null)     // { ref, note, phone }
  const [asking, setAsking] = useState(null) // the question showing "Skip the other questions?"
  const [skipAfter, setSkipAfter] = useState(null) // questions after this one are skipped (-1: all)

  const set = (k, v) => setAnswers((a) => ({ ...a, [k]: v }))
  const pickOne = (s, value) => set(s.key, answers[s.key] === value ? undefined : value)
  const pickMany = (s, value) => {
    const cur = Array.isArray(answers[s.key]) ? answers[s.key] : []
    if (value === NOT_SURE_VALUE) return set(s.key, cur.includes(NOT_SURE_VALUE) ? [] : [NOT_SURE_VALUE])
    const next = cur.filter((x) => x !== NOT_SURE_VALUE)
    set(s.key, next.includes(value) ? next.filter((x) => x !== value) : [...next, value])
  }
  const isOn = (s, value) => (s.multi ? (answers[s.key] || []).includes(value) : answers[s.key] === value)
  const skipped = skipAfter !== null

  // "Not sure" on question i: ask first whether to skip the questions after it
  const leftAfter = (i) => questions.length - i - 1 + (details.length ? 1 : 0) + (paperList.length ? 1 : 0)
  const markNotSure = (s) => set(s.key, s.multi ? [NOT_SURE_VALUE] : NOT_SURE_VALUE)
  const notSureTap = (s, i) => {
    setAsking(null)
    if (isOn(s, NOT_SURE_VALUE)) return s.multi ? pickMany(s, NOT_SURE_VALUE) : pickOne(s, NOT_SURE_VALUE)
    markNotSure(s)
    if (i >= 0 && !skipped && leftAfter(i) > 0) setAsking(s.key)
  }

  // A job (e.g. Learner's licence / Renewal) brings its own papers
  const jobStep = questions.find((s) => s.jobs)
  const job = jobStep && jobStep.jobs.find((j) => j.heading === answers[jobStep.key])
  // Forms and affidavits we prepare are named, not ticked (owner, 6 Nov 2026)
  const jobPapers = job ? splitPapers(job.items) : null
  const paperList = jobPapers ? jobPapers.tick : (papersStep?.all || [])
  const prepareList = jobPapers ? jobPapers.prepare : (papersStep?.prepare || [])
  // Government services: papers first, then only the details the ready papers don't show
  const gov = papersFirst(service) && kind !== 'supply'
  const after = detailsAfterPapers(service, details.map((d) => d.field), paperList.filter((p) => ticks[p]))
  const hiddenKeys = after.hidden.map((f) => f.key)
  const detailsShown = details.filter((d) => !hiddenKeys.includes(d.field.key))
  const readLine = readFromPapersLine(after, L, tx)
  const pt = papersText(L)

  const Chips = ({ s, i = -1 }) => (
    <div className="srf-chips">
      {s.options.filter((o) => o.value !== '' && !String(o.value).startsWith('__skip')).map((o) => {
        const on = isOn(s, o.value)
        if (o.advise) {
          return (
            <button type="button" key="advise" className={`srf-advise${on ? ' on' : ''}`} aria-pressed={on} onClick={() => notSureTap(s, i)}>
              <span className="srf-advise-ico" aria-hidden="true"><Phone size={16} /></span>
              <span className="srf-advise-txt"><b>{plain(o.label)}</b><small>{c.adviseLine}</small></span>
              {on && <span className="srf-advise-tick" aria-hidden="true">✓</span>}
            </button>
          )
        }
        return (
          <button type="button" key={String(o.value)} className={`srf-chip${on ? ' on' : ''}`} aria-pressed={on}
            onClick={() => (s.multi ? pickMany(s, o.value) : pickOne(s, o.value))}>
            {on && s.multi ? '✓ ' : ''}{o.value === NOT_SURE_VALUE ? t.notSure : plain(o.label)}
          </button>
        )
      })}
    </div>
  )

  const field = (s) => {
    const f = s.field
    const v = answers[s.key] ?? ''
    const hint = L === 'te' ? (f.hintTe || f.hint) : f.hint
    const common = { id: `srf-${f.key}`, value: v, onChange: (e) => set(s.key, e.target.value) }
    let input
    if (f.type === 'choice') input = <Chips s={{ ...s, multi: !!f.multi, options: s.options }} />
    else if (f.type === 'long') input = <textarea rows={3} {...common} />
    else if (f.type === 'date') input = <input type="date" {...common} />
    else if (f.type === 'number') input = <input type="number" inputMode="numeric" {...common} />
    else if (f.type === 'mandal') input = <><input list="srf-towns" {...common} /><datalist id="srf-towns">{TOWNS.map((x) => <option key={x} value={x} />)}</datalist></>
    else input = <input type="text" {...common} />
    return (
      <div key={s.key} className={`srf-field${f.half ? ' half' : ''}`}>
        <label htmlFor={`srf-${f.key}`}>{s.label}</label>
        {input}
        {hint && <small>{hint}</small>}
      </div>
    )
  }

  const submit = async () => {
    setError('')
    if (!name.trim()) return setError(t.needName)
    const ph = readPhone(phone)
    if (!ph.ok) return setError(t.needPhone)
    // The town or village is required: every customer knows where they are (owner, 2 Nov 2026)
    const townVal = townStep ? (answers[townStep.key] || other.town?.trim() || '') : ''
    if (townStep && !townVal) {
      document.getElementById('srf-town')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return setError(c.townNeed)
    }
    // Answers as the shared request builder expects them
    const out = {}
    for (const s of questions) {
      let a = answers[s.key]
      if (Array.isArray(a)) a = a.map((x) => (x === NOT_SURE_VALUE ? NOT_SURE : x))
      else if (a === NOT_SURE_VALUE) a = NOT_SURE
      if (other[s.key]?.trim()) a = Array.isArray(a) ? [...a, other[s.key].trim()] : other[s.key].trim()
      if (a !== undefined && !(Array.isArray(a) && !a.length)) out[s.key] = a
    }
    for (const s of details) if (answers[s.key]) out[s.key] = answers[s.key]
    if (skipped) out[SKIPPED_KEY] = true
    if (townStep) out[townStep.key] = townVal
    if (whenStep && answers[whenStep.key]) out[whenStep.key] = answers[whenStep.key] === NOT_SURE_VALUE ? NOT_SURE : answers[whenStep.key]
    if (notesStep && answers[notesStep.key]?.trim()) out[notesStep.key] = answers[notesStep.key].trim()
    const pStep = paperList.length ? { ...(papersStep || { key: 'Ready', role: 'papers' }), all: paperList, prepare: prepareList } : null
    if (pStep) out[pStep.key] = paperList.filter((p) => ticks[p])
    const allSteps = [...questions, ...details, ...(pStep && !skipped ? [pStep] : []), ...[townStep, whenStep, notesStep].filter(Boolean)]
    const ref = newRef()
    const req = { ...buildRequest({ kind, item: service, steps: allSteps, answers: out, user: { name: name.trim(), mobile: ph.value }, ref }), channel: 'page' }
    setSending(true)
    try {
      await api.submitContactForm(req)
      save({ name: name.trim(), phone: ph.value })
      try { celebrate() } catch { /* confetti is optional */ }
      setSent({ ref, phone: ph.display, note: afterHoursNote(L, { emergency: isEmergency(req) }) })
    } catch (e) {
      setError(e?.message && /Too many/i.test(e.message) ? e.message : t.failed)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="srf-sent rw-sent" role="status">
        <div className="srf-sent-tick">✓</div>
        <h3>{t.sentTitle}</h3>
        <p>{t.ref}: <b>{sent.ref}</b></p>
        <p>{sent.note || t.sentCall(sent.phone)}</p>
        <button type="button" className="btn btn-primary" onClick={onDone} style={{ width: '100%', justifyContent: 'center' }}>{t.close}</button>
      </div>
    )
  }

  let n = 0
  // Your details (team only); what a ready paper shows becomes one line (government services)
  const detailsSec = () => (details.length > 0 && !skipped && (detailsShown.length > 0 || readLine) ? (
    <section className="srf-sec">
      <h4><span>{++n}</span>{t.details}</h4>
      {detailsShown.length > 0 && <small className="srf-tip">{t.detailsSub}</small>}
      {detailsShown.length > 0 && <div className="srf-fields">{detailsShown.map(field)}</div>}
      {readLine && <p className="srf-readline"><FileText size={17} aria-hidden="true" /><span>{readLine}</span></p>}
    </section>
  ) : null)
  // The papers they have (ticks), and the forms we prepare for them
  const papersSec = () => ((paperList.length > 0 || prepareList.length > 0) && !skipped ? (
    <section className="srf-sec">
      <h4><span>{++n}</span>{t.papers}</h4>
      {paperList.length > 0 && <small className="srf-tip">{t.papersSub}</small>}
      {paperList.length > 0 && (
        <div className="srf-ticks">
          {paperList.map((p) => (
            <label key={p} className={`srf-tick${ticks[p] ? ' on' : ''}`}>
              <input type="checkbox" checked={!!ticks[p]} onChange={() => setTicks((x) => ({ ...x, [p]: !x[p] }))} />
              <span>{tx(p)}</span>
            </label>
          ))}
        </div>
      )}
      {prepareList.length > 0 && (
        <div className="srf-prepare">
          <p><PenLine size={16} aria-hidden="true" /><b>{pt.prepareH(prepareList.length)}</b></p>
          <ul>{prepareList.map((p) => <li key={p}>{tx(p)}</li>)}</ul>
          <small>{pt.prepareNote}</small>
        </div>
      )}
    </section>
  ) : null)
  return (
    <div className="rw-body">
    <div className="rw-main srf">
      {/* Government services: we are not a government office (owner, 2 Nov 2026 — legal report) */}
      {isGovService(service) && <p className="srf-govnote"><Info size={17} aria-hidden="true" />{govNotice(L)}</p>}
      {/* Not sure what to pick? Skip the questions — our expert calls (owner, 2 Nov 2026) */}
      {questions.length > 0 && !skipped && freeAdvice && (
        <button type="button" className="srf-free" onClick={() => { setAsking(null); setSkipAfter(-1) }}>
          <span className="srf-advise-ico" aria-hidden="true"><Phone size={18} /></span>
          <span className="srf-advise-txt"><b>{c.freeAdvice}</b><small>{c.freeAdviceSub}</small></span>
          <span aria-hidden="true">→</span>
        </button>
      )}

      {questions.length > 0 && (
        <section className="srf-sec">
          <h4><span>{++n}</span>{t.need}</h4>
          {questions.map((s, i) => (skipped && i > skipAfter ? null : (
            <div key={s.key} className="srf-q">
              {/* The section title already says "What do you need?" — don't repeat it */}
              {(s.jobs ? t.pickJob : (s.ask || tx(s.key))) !== t.need && <p className="srf-ask">{s.jobs ? t.pickJob : (s.ask || tx(s.key))}</p>}
              {s.tip && <small className="srf-tip">{s.tip}</small>}
              <Chips s={s} i={i} />
              {asking === s.key && (
                <div className="srf-skipask" role="group">
                  <p>{c.skipAsk(leftAfter(i))}</p>
                  <div>
                    <button type="button" className="srf-skip-no" onClick={() => setAsking(null)}>{c.skipNo}</button>
                    <button type="button" className="srf-skip-yes" onClick={() => { setAsking(null); setSkipAfter(i) }}>{c.skipYes} →</button>
                  </div>
                </div>
              )}
              {s.typed && s.role !== 'notes' && (
                <input className="srf-other" type="text" placeholder={t.other} value={other[s.key] || ''} onChange={(e) => setOther((o) => ({ ...o, [s.key]: e.target.value }))} />
              )}
            </div>
          )))}
          {skipped && (
            <p className="srf-skipped">
              <span className="srf-advise-ico" aria-hidden="true"><Phone size={14} /></span>
              <span>{skipAfter < 0 ? c.adviseLine : c.skippedNote}</span>
              <button type="button" onClick={() => setSkipAfter(null)}>{c.showAgain}</button>
            </p>
          )}
        </section>
      )}

      {/* Government services: the papers first, then the details (owner, 6 Nov 2026) */}
      {gov ? <>{papersSec()}{detailsSec()}</> : <>{detailsSec()}{papersSec()}</>}

      <section className="srf-sec">
        <h4><span>{++n}</span>{t.where}</h4>
        {townStep && (
          <div className="srf-q" id="srf-town">
            <p className="srf-ask">{t.town} *</p>
            <Chips s={townStep} />
            <input className="srf-other" type="text" placeholder={t.typeTown} value={other.town || ''}
              onChange={(e) => { setOther((o) => ({ ...o, town: e.target.value })); if (e.target.value) set(townStep.key, undefined) }} />
          </div>
        )}
        {whenStep && (
          <div className="srf-q">
            <p className="srf-ask">{whenStep.ask || t.when}</p>
            <Chips s={whenStep} />
          </div>
        )}
        {notesStep && (
          <div className="srf-field">
            <label htmlFor="srf-notes">{t.notes}</label>
            <textarea id="srf-notes" rows={2} value={answers[notesStep.key] || ''} onChange={(e) => set(notesStep.key, e.target.value)} />
          </div>
        )}
      </section>

    </div>
    <aside className="rw-side srf">
      <section className="srf-sec">
        <h4><span>{++n}</span>{t.you}</h4>
        <div className="srf-fields">
          <div className="srf-field half">
            <label htmlFor="srf-name">{t.name} *</label>
            <input id="srf-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="srf-field half">
            <label htmlFor="srf-phone">{t.phone} *</label>
            <input id="srf-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <small className="srf-tip">{t.phoneHint}</small>
      </section>

      {error && <p className="srf-error" role="alert">{error}</p>}
      <button type="button" className="btn btn-primary srf-send" style={{ width: '100%', justifyContent: 'center' }} disabled={sending} onClick={submit}>
        {sending ? t.sending : t.send}
      </button>
      {aside}
    </aside>
    {/* Pointers (owner, 2 Nov 2026): the green "Not sure" box, then Send */}
    <TourTips tips={[
      questions.some((s) => s.options?.some((o) => o.advise)) && !skipped && { id: 'web-form-notsure', target: '.rw-body .srf-advise', place: 'below' },
      { id: 'web-form-send', target: '.rw-body .srf-send', place: 'above' },
    ]} />
    </div>
  )
}
