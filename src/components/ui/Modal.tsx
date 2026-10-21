import { useEffect, useRef, type ReactNode } from 'react'
import { useDialogFocus } from './useDialogFocus'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  useDialogFocus(panelRef, open)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const widths = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-navy-950/80 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
      role="dialog"
      ref={panelRef}
      tabIndex={-1}
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={cn(
          'relative w-full animate-scale-in rounded-t-panel border border-shell-border bg-navy-700 shadow-panel sm:rounded-panel',
          widths[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-shell-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-shell-text">{title}</h2>
            {description ? (
              <p className="mt-1 text-[13px] leading-relaxed text-shell-muted">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mr-1 -mt-1 rounded-lg p-2 text-shell-muted transition-colors hover:bg-navy-600 hover:text-shell-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glacier"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-shell-border px-5 py-3.5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
