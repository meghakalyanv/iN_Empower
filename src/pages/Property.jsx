import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, KeyRound, FileText, HandCoins, LandPlot, Building2, Sprout, Store, Video, FileSearch, UserCheck,
  ListChecks, FilePen, ShieldCheck, Tag, X, ChevronDown, ArrowRight, ArrowLeft, Check, MapPin, Lightbulb, CircleCheck,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import { api } from '../services/api'
import { inCurrentCity, placeText } from '../data/cities'
import { sectionKind } from '../data/serviceLayout'
import { NOT_SURE, notSureAllowed } from '../data/chatSteps'
import {
  propertyIntro, propertyIntents, propertyTypes, trustPromises,
  LISTING_CHECKS, listingTypeLabel, listingEnquiry, PROPERTY_CATEGORY,
} from '../data/propertyData'
import { useLanguage } from '../context/LanguageContext'
import './property.css'

const INTENT_ICON = { 'property-buy': Search, 'property-sell': HandCoins, 'property-rent': KeyRound, 'property-paperwork': FileText }
const TYPE_ICON = { 'prop-plots': LandPlot, 'prop-houses': Building2, 'prop-agri': Sprout, 'prop-commercial': Store }
const TRUST_ICON = { video: Video, title: FileSearch, poa: UserCheck, updates: ListChecks, paperwork: FilePen }
const TYPE_Q = { 'property-buy': 'What kind of property?', 'property-sell': 'What are you selling?' }

const contactUrl = (subService, message) => {
  const p = new URLSearchParams({ service: PROPERTY_CATEGORY, subService, message })
  return `/contact?${p.toString()}`
}

/**
 * Property & Real Estate — same content as the app (data/propertyData.js).
 * Buy / Sell / Rent / Paperwork open a step-by-step flow; listings come from
 * the admin panel (/admin/properties); each property type has a deep guide.
 */
export default function Property() {
  const [flow, setFlow] = useState(null) // { intent, preset }
  const [listings, setListings] = useState(null)
  const [typeId, setTypeId] = useState(propertyTypes[0].id)
  const { t, lang } = useLanguage()
  const te = (x, field = 'title') => (lang === 'te' && x.te) || x[field]

  useEffect(() => {
    document.title = placeText('Property & Real Estate | iN Empower — Buy, Sell, Rent in Prakasam District')
    let alive = true
    Promise.resolve(api.listPropertyListings ? api.listPropertyListings() : [])
      // Only listings in the customer's city (by the town in the listing's place)
      .then((rows) => { if (alive) setListings((rows || []).filter((l) => inCurrentCity(l.location))) })
      .catch(() => { if (alive) setListings([]) })
    return () => { alive = false }
  }, [])

  const open = (intentId, preset) => setFlow({ intent: propertyIntents.find((i) => i.id === intentId), preset })
  const type = propertyTypes.find((p) => p.id === typeId)

  return (
    <>
      <PageHero label="Buy • Sell • Rent — papers checked first" title="Property &" titleHighlight="Real Estate">
        <p style={{ maxWidth: 820, margin: '0 auto', textWrap: 'balance', lineHeight: 1.6 }}>{propertyIntro.promise}</p>
      </PageHero>

      {/* Buy / Sell / Rent / Paperwork */}
      <section className="section-compact pr-section">
        <div className="container">
          <h2 className="pr-h2">{t('prWhat')}</h2>
          <div className="pr-intents">
            {propertyIntents.map((it) => {
              const Icon = INTENT_ICON[it.id] || Search
              return (
                <button key={it.id} className="pr-intent" onClick={() => open(it.id)}>
                  <span className="pr-icon"><Icon size={26} /></span>
                  <strong>{te(it)}</strong>
                  <span>{it.subtitle}</span>
                  <em>{t('prStart')} <ArrowRight size={15} /></em>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="section-compact pr-section">
        <div className="container">
          <h2 className="pr-h2">{t('prListings')}</h2>
          {listings === null ? (
            <div aria-busy="true" style={{ display: 'grid', gap: '0.75rem' }}>
              <span className="sr-only">{t('prLoading')}</span>
              {[0, 1, 2].map((i) => <div key={i} className="kk-shimmer" style={{ height: 96 }} />)}
            </div>
          ) : listings.length === 0 ? (
            <div className="pr-empty">
              <Search size={32} />
              <h3>{t('prNone')}</h3>
              <p>{t('prNoneText')}</p>
              <div className="pr-row">
                <button className="btn btn-primary" onClick={() => open('property-buy')}>{t('prTellUs')}</button>
                <button className="btn btn-outline" onClick={() => open('property-sell')}>{t('prListMine')}</button>
              </div>
            </div>
          ) : (
            <div className="pr-listings">{listings.map((l) => <ListingCard key={l.id} l={l} />)}</div>
          )}
        </div>
      </section>

      {/* Deep guides */}
      <section className="section-compact pr-section">
        <div className="container">
          <h2 className="pr-h2">{t('prKnow')}</h2>
          <p className="pr-muted">{t('prKnowSub')}</p>
          <div className="pr-tabs" role="tablist">
            {propertyTypes.map((pt) => {
              const Icon = TYPE_ICON[pt.id] || LandPlot
              return (
                <button key={pt.id} role="tab" aria-selected={pt.id === typeId} className={`pr-tab${pt.id === typeId ? ' active' : ''}`} onClick={() => setTypeId(pt.id)}>
                  <Icon size={18} /> {te(pt)}
                </button>
              )
            })}
          </div>
          <div className="pr-guide">
            <div className="pr-good"><Lightbulb size={20} /><p>{type.intro}</p></div>
            {type.guide.map((sec, i) => (
              <details key={type.id + sec.heading} className="pr-fold" open={i === 0}>
                <summary>{sec.heading}<ChevronDown size={18} /></summary>
                <ul>{sec.items.map((x) => <li key={x}>{x}</li>)}</ul>
              </details>
            ))}
            <div className="pr-row">
              <button className="btn btn-primary" onClick={() => open('property-buy', { [TYPE_Q['property-buy']]: type.choice })}>{t('prHelpBuy')}</button>
              <button className="btn btn-outline" onClick={() => open('property-sell', { [TYPE_Q['property-sell']]: type.choice })}>{t('prHelpSell')}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="section-compact pr-section">
        <div className="container">
          <h2 className="pr-h2">{t('prTrust')}</h2>
          <div className="pr-trust">
            {trustPromises.map((p) => {
              const Icon = TRUST_ICON[p.id] || ShieldCheck
              return (
                <div key={p.id} className="pr-trust-card">
                  <span className="pr-icon pr-icon-navy"><Icon size={22} /></span>
                  <div><strong>{p.title}</strong><p>{p.text}</p></div>
                </div>
              )
            })}
          </div>
          <div className="pr-charges"><Tag size={20} /><p><strong>{t('prCharges')}</strong> {propertyIntro.quote}</p></div>
        </div>
      </section>

      {flow && <StepFlow intent={flow.intent} preset={flow.preset} onClose={() => setFlow(null)} />}
    </>
  )
}

function ListingCard({ l }) {
  const { t } = useLanguage()
  const checks = LISTING_CHECKS.filter((c) => (l.checks || []).includes(c.key))
  const sub = l.purpose === 'rent' ? 'Rent & Lease' : 'Buy a Property'
  return (
    <article className="pr-listing">
      {l.photos?.length > 0 && (
        <div className="pr-photos">{l.photos.map((u, i) => <img key={u + i} src={u} alt={`${l.title} photo ${i + 1}`} loading="lazy" />)}</div>
      )}
      <div className="pr-listing-body">
        <div className="pr-row pr-small">
          <span className={`pr-badge${l.purpose === 'rent' ? ' rent' : ''}`}>{l.purpose === 'rent' ? t('prForRent') : t('prForSale')}</span>
          <span className="pr-muted">{listingTypeLabel(l.type)}</span>
        </div>
        <h3>{l.title}</h3>
        <p className="pr-muted"><MapPin size={14} /> {[l.location, l.area, l.facing && `${l.facing} facing`].filter(Boolean).join(' · ')}</p>
        {l.price && <p className="pr-price">{l.price}</p>}
        {l.description && <p>{l.description}</p>}
        {l.highlights?.length > 0 && <ul>{l.highlights.map((h) => <li key={h}>{h}</li>)}</ul>}
        {checks.length > 0 && (
          <div className="pr-checks">{checks.map((c) => <span key={c.key}><CircleCheck size={14} /> {c.label}</span>)}</div>
        )}
        <Link className="btn btn-primary" to={contactUrl(sub, listingEnquiry(l))}>{t('prAsk')}</Link>
      </div>
    </article>
  )
}

/** Step-by-step, the same steps as the app: questions in data order → papers → review → contact form. */
function StepFlow({ intent, preset, onClose }) {
  const navigate = useNavigate()
  const steps = useMemo(() => {
    const list = []
    for (const sec of intent.sections) {
      const kind = sectionKind(intent, sec)
      if (kind === 'choose') list.push({ type: 'many', sec })
      else if (kind === 'ask') list.push({ type: 'one', sec })
    }
    const papers = intent.sections.filter((s) => sectionKind(intent, s) === 'papers').flatMap((s) => s.items)
    if (papers.length) list.push({ type: 'papers', items: papers })
    list.push({ type: 'review' })
    return list
  }, [intent])
  const info = intent.sections.filter((s) => sectionKind(intent, s) === 'info')
  const good = info.filter((s) => /good to know/i.test(s.heading))
  const notes = info.filter((s) => /note/i.test(s.heading))

  const [step, setStep] = useState(-1)
  const [picked, setPicked] = useState({ ...(preset || {}) })
  const [other, setOther] = useState({})
  const [ticked, setTicked] = useState({})

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  const answerOf = (h) => {
    const v = picked[h]
    const list = (Array.isArray(v) ? v : v ? [v] : []).filter(Boolean)
    const typed = (other[h] || '').trim()
    return (typed ? [...list, typed] : list).join(', ')
  }
  const toggle = (sec, c, many) => setPicked((p) => {
    const cur = p[sec.heading]
    if (many) {
      if (c === NOT_SURE) return { ...p, [sec.heading]: (cur || []).includes(NOT_SURE) ? [] : [NOT_SURE] }
      const l = (cur || []).filter((x) => x !== NOT_SURE)
      return { ...p, [sec.heading]: l.includes(c) ? l.filter((x) => x !== c) : [...l, c] }
    }
    return { ...p, [sec.heading]: cur === c ? undefined : c }
  })
  const isOn = (sec, c, many) => (many ? (picked[sec.heading] || []).includes(c) : picked[sec.heading] === c)

  const finish = () => {
    const lines = [`Hello, I need help with ${intent.title}.`]
    const answered = steps.filter((s) => s.sec && answerOf(s.sec.heading))
    if (answered.length) lines.push('', ...answered.map((s) => `- ${s.sec.heading.replace(/\?$/, '')}: ${answerOf(s.sec.heading)}`))
    const papers = steps.find((s) => s.type === 'papers')?.items || []
    if (papers.length) {
      const ready = papers.filter((i) => ticked[i])
      const missing = papers.filter((i) => !ticked[i])
      lines.push('', 'Checklist Status:')
      if (ready.length) lines.push('[Ready]', ...ready.map((i) => `- ${i}`))
      if (missing.length) lines.push('[Need Help With]', ...missing.map((i) => `- ${i}`))
    }
    onClose()
    navigate(contactUrl(intent.title, lines.join('\n')))
  }

  const cur = steps[step]
  const many = cur?.type === 'many'

  return (
    <div className="pr-modal-wrap" role="dialog" aria-modal="true" aria-label={intent.title}>
      <div className="pr-scrim" onClick={onClose} />
      <div className="pr-modal">
        <div className="pr-modal-head">
          <div>
            <strong>{intent.title}</strong>
            {step >= 0 && <span className="pr-muted"> · Step {step + 1} of {steps.length}</span>}
          </div>
          <button className="pr-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        {step >= 0 && <div className="pr-track"><div style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>}

        <div className="pr-modal-body">
          {step === -1 && (
            <>
              <p>{intent.subtitle}</p>
              {good.map((g) => (
                <div key={g.heading} className="pr-good"><Lightbulb size={20} /><ul>{g.items.map((x) => <li key={x}>{x}</li>)}</ul></div>
              ))}
              <p className="pr-muted">{steps.length - 1} short steps. Skip anything you are not sure about.</p>
            </>
          )}

          {cur?.sec && (
            <>
              <h3>{cur.sec.heading}</h3>
              {many && <p className="pr-muted">Pick any that apply.</p>}
              <div className="pr-choices">
                {/* "Not sure" only where an expert is needed — here, size and budget (owner, 2 Nov 2026) */}
                {[...(notSureAllowed(intent, cur.sec.heading) ? [NOT_SURE] : []), ...cur.sec.items.filter((c) => !/^not sure\b/i.test(c))].map((c) => {
                  const on = isOn(cur.sec, c, many)
                  return (
                    <button key={c} className={`pr-choice${on ? ' on' : ''}`} role={many ? 'checkbox' : 'radio'} aria-checked={on} onClick={() => toggle(cur.sec, c, many)}>
                      <span className={many ? 'pr-box' : 'pr-radio'}>{on && <Check size={14} />}</span>{c}
                    </button>
                  )
                })}
                <input className="pr-other" placeholder="Other — type here" value={other[cur.sec.heading] || ''}
                  onChange={(e) => setOther((o) => ({ ...o, [cur.sec.heading]: e.target.value }))} aria-label={`${cur.sec.heading}: other`} />
              </div>
            </>
          )}

          {cur?.type === 'papers' && (
            <>
              <h3>Documents to keep ready</h3>
              <p className="pr-muted">Tick what you already have. We help with the rest.</p>
              <div className="pr-choices">
                {cur.items.map((i) => (
                  <button key={i} className={`pr-choice${ticked[i] ? ' on' : ''}`} role="checkbox" aria-checked={!!ticked[i]} onClick={() => setTicked((p) => ({ ...p, [i]: !p[i] }))}>
                    <span className="pr-box">{ticked[i] && <Check size={14} />}</span>{i}
                  </button>
                ))}
              </div>
            </>
          )}

          {cur?.type === 'review' && (
            <>
              <h3>Is this right?</h3>
              <dl className="pr-review">
                {steps.slice(0, -1).map((s, i) => (
                  <div key={i}>
                    <dt>{s.sec ? s.sec.heading : 'Documents'}</dt>
                    <dd>
                      {s.sec ? (answerOf(s.sec.heading) || <span className="pr-muted">Not chosen</span>) : `${s.items.filter((x) => ticked[x]).length} of ${s.items.length} ready`}
                      <button className="pr-link" onClick={() => setStep(i)}>Change</button>
                    </dd>
                  </div>
                ))}
              </dl>
              {notes.map((n) => <ul key={n.heading} className="pr-notes">{n.items.map((x) => <li key={x}>{x}</li>)}</ul>)}
            </>
          )}
        </div>

        <div className="pr-modal-foot">
          {step === -1 ? (
            <button className="btn btn-primary" onClick={() => setStep(0)}>Start <ArrowRight size={16} /></button>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Back</button>
              {cur.type === 'review'
                ? <button className="btn btn-primary" onClick={finish}>Get started <ArrowRight size={16} /></button>
                : <button className="btn btn-primary" onClick={() => setStep(step + 1)}>{cur.sec && !answerOf(cur.sec.heading) ? 'Skip' : 'Next'} <ArrowRight size={16} /></button>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
