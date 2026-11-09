import { useLayoutEffect, useRef } from 'react'

/** A text box that starts small and grows with what is typed, up to maxHeight (then scrolls). */
export default function AutoGrowTextarea({ minHeight = 72, maxHeight = 240, style, value, ...props }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    const h = Math.min(maxHeight, Math.max(minHeight, el.scrollHeight + 2))
    el.style.height = `${h}px`
    el.style.overflowY = el.scrollHeight + 2 > maxHeight ? 'auto' : 'hidden'
  }, [value, minHeight, maxHeight])
  return <textarea ref={ref} rows={2} value={value} style={{ minHeight, resize: 'none', ...style }} {...props} />
}
