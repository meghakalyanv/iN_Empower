import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { Phone, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, PlayCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useCity } from '../context/CityContext'
import { SLIDES, slideText, tipText, tutorialWords } from '../data/tutorial'
import { chatText, notSureFor } from '../data/chatSteps'
import { useTutorial, useTips, finishSlides, replayTutorial } from '../hooks/useTutorial'
import '../tutorial.css'

const TOY = (name) => `/images/toys/home/${name}.png`

/**
 * The tutorial (owner, 2 Nov 2026), the same as in the app: five short slides on the first visit
 * to Home (after the city is chosen) — Skip, Back, Next, swipe, arrow keys, Esc — and seen again
 * from "Show the tutorial again". The visitor can switch English / Telugu on the slides.
 */
export function TutorialSlides({ onDone }) {
  const { lang, setLang } = useLanguage()
  const [at, setAt] = useState(0)
  const card = useRef(null)
  const touch = useRef(null)
  const w = tutorialWords(lang)
  const total = SLIDES.length
  const last = at === total - 1
  const slide = SLIDES[at]
  const words = slideText(slide, lang, 'web')

  // Keyboard: ← → move, Esc closes; the window takes the focus and the page behind does not scroll
  useEffect(() => {
    const before = document.activeElement
    card.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const key = (e) => {
      if (e.key === 'Escape') onDone()
      else if (e.key === 'ArrowRight') setAt((i) => Math.min(i + 1, total - 1))
      else if (e.key === 'ArrowLeft') setAt((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      document.body.style.overflow = overflow
      before?.focus?.()
    }
  }, [onDone, total])

  const swipeStart = (e) => { touch.current = e.touches[0]?.clientX ?? null }
  const swipeEnd = (e) => {
    if (touch.current == null) return
    const dx = (e.changedTouches[0]?.clientX ?? touch.current) - touch.current
    touch.current = null
    if (dx < -50) setAt((i) => Math.min(i + 1, total - 1))
    else if (dx > 50) setAt((i) => Math.max(i - 1, 0))
  }

  return createPortal(
    <div className="tut-backdrop">
      <div className="tut-card" role="dialog" aria-modal="true" aria-labelledby="tut-title" aria-describedby="tut-body" tabIndex={-1} ref={card}
        onTouchStart={swipeStart} onTouchEnd={swipeEnd}>
        <div className="tut-top">
          <span className="tut-count" aria-live="polite">{w.of(at + 1, total)}</span>
          <button type="button" className="tut-lang" onClick={() => setLang(lang === 'te' ? 'en' : 'te')} aria-label={w.otherLabel}>{w.other}</button>
          {!last && <button type="button" className="tut-skip" onClick={onDone} aria-label={`${w.skip}. ${w.close}`}>{w.skip}</button>}
        </div>
        <div className="tut-slide" key={at}>
          <SlidePic kind={slide.pic} lang={lang} words={words} />
          <h2 id="tut-title">{words.title}</h2>
          <p id="tut-body">{words.body}</p>
        </div>
        <div className="tut-dots" aria-hidden="true">
          {SLIDES.map((x, i) => <span key={x.id} className={i === at ? 'on' : ''} />)}
        </div>
        <div className="tut-btns">
          {at > 0 && (
            <button type="button" className="btn btn-outline" onClick={() => setAt(at - 1)}><ArrowLeft size={18} aria-hidden="true" />{w.back}</button>
          )}
          <button type="button" className="btn btn-primary" onClick={() => (last ? onDone() : setAt(at + 1))}>
            {last ? w.start : w.next}<ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** Each slide's picture: the toys, the green "Not sure" box, the promise, a request card. */
function SlidePic({ kind, lang, words }) {
  if (kind === 'welcome') return <div className="tut-sun"><img src={TOY('buddy')} alt="" width="150" height="150" /></div>
  if (kind === 'pick') {
    return (
      <div className="tut-pick">
        <span className="tut-badge" style={{ background: '#E8ECFB' }}><img src={TOY('papers')} alt="" /></span>
        <span className="tut-badge big" style={{ background: '#E0F3E8' }}><img src={TOY('pros')} alt="" /></span>
        <span className="tut-badge" style={{ background: '#FDE6E3' }}><img src={TOY('supplies')} alt="" /></span>
      </div>
    )
  }
  if (kind === 'notsure') {
    return (
      <div className="tut-stack">
        <span className="tut-badge big" style={{ background: '#E0F3E8' }}><img src={TOY('pros')} alt="" /></span>
        <div className="tut-green" aria-hidden="true">
          <span className="srf-advise-ico"><Phone size={18} /></span>
          <span><b>{notSureFor('What is the problem?', lang)}</b><small>{chatText(lang).adviseLine}</small></span>
        </div>
      </div>
    )
  }
  if (kind === 'price') {
    return (
      <div className="tut-stack">
        <span className="tut-badge huge" style={{ background: '#FFE7CF' }}><img src={TOY('earn')} alt="" /></span>
        <span className="tut-promise"><ShieldCheck size={18} aria-hidden="true" />{words.promise}</span>
      </div>
    )
  }
  return (
    <div className="tut-stack">
      <img src={TOY('chat-elephant')} alt="" className="tut-elephant" />
      <div className="tut-req" aria-hidden="true">
        <div className="tut-req-top"><b>IN-7K3Q9</b><CheckCircle2 size={18} /></div>
        <div className="tut-req-title">{words.sample}</div>
        <div className="tut-stages"><i className="on" /><s className="on" /><i className="on" /><s /><i /><s /><i /></div>
      </div>
    </div>
  )
}

/**
 * Shows the slides: on the first visit to Home, once the city window is closed;
 * or straight away after "Show the tutorial again".
 */
export function TutorialHost() {
  const { pathname } = useLocation()
  const s = useTutorial()
  const { pickerOpen, saved } = useCity()
  const open = !s.slides && (s.replay || (pathname === '/' && !!saved && !pickerOpen))
  return open ? <TutorialSlides onDone={finishSlides} /> : null
}

/** "Show the tutorial again" (the footer; Home on phones). */
export function ReplayTutorial({ className = 'tut-again' }) {
  const { lang } = useLanguage()
  const navigate = useNavigate()
  return (
    <button type="button" className={className} onClick={() => { navigate('/'); replayTutorial() }}>
      <PlayCircle size={16} aria-hidden="true" />{tutorialWords(lang).again}
    </button>
  )
}

/** Where a pointer's part of the page is now (fixed position), or null when it is not on screen. */
function useTargetRect(selector) {
  const [rect, setRect] = useState(null)
  useEffect(() => {
    if (!selector) { setRect(null); return undefined }
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const el = document.querySelector(selector)
        const r = el?.getBoundingClientRect()
        const shown = el && r.width > 0 && r.height > 0 && r.bottom > 8 && r.top < window.innerHeight - 8
          && getComputedStyle(el).visibility !== 'hidden' && Number(getComputedStyle(el).opacity) > 0.2
        setRect((old) => {
          if (!shown) return null
          const next = { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), bottom: Math.round(r.bottom) }
          return old && old.top === next.top && old.left === next.left && old.width === next.width && old.bottom === next.bottom ? old : next
        })
      })
    }
    measure()
    // Parts that come later (pages load, windows open, animations end)
    const timer = setInterval(measure, 400)
    window.addEventListener('scroll', measure, true)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      clearInterval(timer)
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
  }, [selector])
  return rect
}

/**
 * One-time pointers: a speech bubble at a part of the page, with "Got it" and "Skip tips".
 * tips: [{ id, target: CSS selector, place: 'below' | 'above' }] — leave out (or pass false)
 * a pointer whose part is not on the page. ready: false holds them (e.g. under the slides).
 */
export function TourTips({ tips, ready = true }) {
  const { lang } = useLanguage()
  const s = useTutorial()
  const { pickerOpen } = useCity()
  const list = (tips || []).filter(Boolean)
  // Held while the city window is open, and Home's pointers until the slides are done
  const held = pickerOpen || (onHome(list) && !s.slides)
  const t = useTips(list.map((x) => x.id), ready && !held)
  const cur = list.find((x) => x.id === t.tip) || null
  const rect = useTargetRect(cur ? cur.target : null)
  const bubble = useRef(null)
  const [height, setHeight] = useState(0)
  useLayoutEffect(() => {
    if (bubble.current) setHeight(bubble.current.offsetHeight)
  }, [cur?.id, rect?.width, lang])
  if (!cur || !rect) return null

  const w = tutorialWords(lang)
  const vw = window.innerWidth
  const vh = window.innerHeight
  const width = Math.min(320, vw - 24)
  const left = Math.min(Math.max(rect.left + rect.width / 2 - width / 2, 12), vw - width - 12)
  let place = cur.place || 'below'
  if (place === 'below' && vh - rect.bottom < height + 24 && rect.top > vh - rect.bottom) place = 'above'
  else if (place === 'above' && rect.top < height + 24 && vh - rect.bottom > rect.top) place = 'below'
  const top = place === 'below' ? rect.bottom + 12 : rect.top - height - 12
  const arrow = Math.min(Math.max(rect.left + rect.width / 2 - left, 20), width - 20)

  return createPortal(
    <div ref={bubble} className={`tour-tip tour-tip--${place}`} role="status"
      style={{ top, left, width, visibility: height ? 'visible' : 'hidden', '--arrow': `${arrow}px` }}>
      <p>{tipText(cur.id, lang)}</p>
      <div className="tour-tip__row">
        {t.total > 1 && <span className="tour-tip__count">{t.step}/{t.total}</span>}
        <button type="button" className="tour-tip__skip" onClick={t.skip}>{w.skipTips}</button>
        <button type="button" className="tour-tip__ok" onClick={t.next}>{w.gotIt}</button>
      </div>
    </div>,
    document.body,
  )
}

// Home pointers wait for the slides; pointers elsewhere (a request window, the chat) do not
const onHome = (list) => list.some((x) => /^web-home-/.test(x.id))
