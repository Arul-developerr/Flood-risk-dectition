import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { useApp } from '../../app/AppContext'
import type { ToastMessage } from '../../types'
import { cn } from '../../utils/cn'

const TONE_STYLES: Record<ToastMessage['tone'], { icon: typeof Info; ring: string }> = {
  success: { icon: CheckCircle2, ring: 'border-risk-low/40 text-risk-low' },
  info: { icon: Info, ring: 'border-glacier/40 text-glacier' },
  warning: { icon: AlertTriangle, ring: 'border-risk-moderate/40 text-risk-moderate' },
}

export function ToastViewport() {
  const { toasts, dismissToast } = useApp()

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:top-0 sm:items-end sm:p-5"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const { icon: Icon, ring } = TONE_STYLES[toast.tone]
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-card border bg-navy-700 p-3.5 shadow-panel',
              ring,
            )}
            role="status"
          >
            <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-shell-text">{toast.title}</p>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-shell-muted">
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="rounded p-1 text-shell-muted transition-colors hover:bg-navy-600 hover:text-shell-text"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
