import { useEffect, type RefObject } from 'react'

/** Keep keyboard focus inside a modal and restore its opener on close. */
export function useDialogFocus(ref: RefObject<HTMLElement>, open: boolean) {
  useEffect(() => {
    if (!open || !ref.current) return
    const panel = ref.current
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const selector = 'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
    const items = () => Array.from(panel.querySelectorAll<HTMLElement>(selector)).filter(el => el.getClientRects().length > 0)
    document.body.style.overflow = 'hidden'
    const frame = requestAnimationFrame(() => (items()[0] ?? panel).focus())
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const controls = items()
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (!first) { event.preventDefault(); panel.focus(); return }
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault(); last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault(); first.focus()
      }
    }
    panel.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      panel.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      if (opener?.isConnected) opener.focus()
    }
  }, [ref, open])
}
