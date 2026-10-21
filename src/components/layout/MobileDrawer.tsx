/**
 * ============================================================================
 * MOBILE DRAWER
 * ============================================================================
 *
 * A slide-in navigation panel for small screens. The drawer locks body
 * scroll while open and closes on Escape or a backdrop tap.
 */

import { useEffect, useRef } from 'react'
import { useDialogFocus } from '../ui/useDialogFocus'
import { X } from 'lucide-react'
import { Sidebar } from './Sidebar'

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useDialogFocus(dialogRef, open)
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Navigation menu" tabIndex={-1} className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-navy-950/85 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-y-0 left-0 w-[min(19rem,calc(100vw-52px))]">
        <Sidebar className="w-full" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="absolute -right-12 top-3 rounded-xl border border-shell-border bg-navy-800 p-2.5 text-shell-text shadow-panel"
        >
          <X className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
