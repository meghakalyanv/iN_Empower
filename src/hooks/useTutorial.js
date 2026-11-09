import { useEffect, useState } from 'react'
import { WEB_KEYS, SKIP_ALL, nextTip } from '../data/tutorial'

/**
 * Has this browser seen the tutorial slides, and which pointers? (owner, 2 Nov 2026)
 * Remembered in this browser only. When the browser keeps nothing (private window),
 * the tutorial is not shown again and again.
 */
function read() {
  try {
    const slides = localStorage.getItem(WEB_KEYS.slides)
    const tips = JSON.parse(localStorage.getItem(WEB_KEYS.tips) || '[]')
    return { slides: !!slides, tips: Array.isArray(tips) ? tips : [] }
  } catch {
    return { slides: true, tips: [SKIP_ALL] }
  }
}
const write = (key, value) => {
  try {
    if (value == null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch { /* the browser keeps nothing: fine */ }
}

let state = null
const listeners = new Set()
const current = () => state || (state = read())
const set = (next) => { state = next; listeners.forEach((f) => f(state)) }

/** The slides were finished or skipped. */
export function finishSlides() {
  set({ ...current(), slides: true, replay: false })
  write(WEB_KEYS.slides, '1')
}

/** One pointer is done ("Got it"). */
export function markTip(id) {
  if (!id) return
  const tips = [...new Set([...current().tips, id])]
  set({ ...current(), tips })
  write(WEB_KEYS.tips, JSON.stringify(tips))
}

/** "Skip tips": no more pointers anywhere. */
export const skipTips = () => markTip(SKIP_ALL)

/** "Show the tutorial again": the slides now, then every pointer once more. */
export function replayTutorial() {
  write(WEB_KEYS.slides, null)
  write(WEB_KEYS.tips, null)
  set({ slides: false, tips: [], replay: true })
}

/** { slides, tips, replay } */
export function useTutorial() {
  const [s, setS] = useState(current)
  useEffect(() => {
    listeners.add(setS)
    setS(current())
    return () => { listeners.delete(setS) }
  }, [])
  return s
}

/** The pointer to show now: the first of `ids` not seen yet (when `ready`). */
export function useTips(ids, ready = true) {
  const s = useTutorial()
  const list = (ids || []).filter(Boolean)
  const tip = ready ? nextTip(s.tips, list) : null
  return {
    tip,
    step: tip ? list.indexOf(tip) + 1 : 0,
    total: list.length,
    next: () => markTip(tip),
    skip: skipTips,
  }
}
