/**
 * ============================================================================
 * SHARED UI PRIMITIVES
 * ============================================================================
 *
 * A small, consistent design system used across every screen:
 * surfaces, section headings, metric indicators, risk indicators, empty and
 * error states, and confirmation dialogs.
 *
 * All colour decisions route through the semantic token names, so risk
 * severity is never used as a decorative accent.
 */

import { useEffect, useRef, type ReactNode } from 'react'
import { useDialogFocus } from './useDialogFocus'
import { AlertTriangle, Inbox, Loader2, X } from 'lucide-react'
import { RISK_CATEGORIES } from '../../data/demoData'
import type { RiskCategory, Severity } from '../../types'
import { cn } from '../../utils/cn'
import { useLocale } from '../../app/LocaleContext'

/* -------------------------------------------------------------------------- */
/*  Surface                                                                    */
/* -------------------------------------------------------------------------- */

export function Surface({
  children,
  className,
  as: Tag = 'section',
  ...rest
}: {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'article' | 'aside'
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={cn(
        'surface-panel min-w-0 rounded-card border border-shell-border bg-navy-800 shadow-card',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */
/*  Section heading                                                            */
/* -------------------------------------------------------------------------- */

export function SectionHeading({
  title,
  description,
  action,
  eyebrow,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  eyebrow?: ReactNode
  className?: string
}) {
  const { ui } = useLocale()
  return (
    <div className={cn('atlas-section-heading mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2', className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="overline mb-1.5">{eyebrow}</p> : null}
        <h2 className="section-title text-shell-text">{typeof title === 'string' ? ui(title) : title}</h2>
        {description ? (
          <p className="mt-1.5 max-w-3xl text-[12.5px] leading-relaxed text-shell-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Metric indicator                                                           */
/* -------------------------------------------------------------------------- */

export type MetricAccent = 'cyan' | 'glacier' | 'teal' | 'amber' | 'coral' | 'neutral'

const METRIC_ACCENTS: Record<MetricAccent, { text: string; bg: string; border: string }> = {
  cyan: { text: 'text-cyan', bg: 'bg-cyan/10', border: 'border-cyan/25' },
  glacier: { text: 'text-glacier', bg: 'bg-glacier/10', border: 'border-glacier/25' },
  teal: { text: 'text-teal-bright', bg: 'bg-teal-bright/10', border: 'border-teal-bright/25' },
  amber: { text: 'text-risk-moderate', bg: 'bg-risk-moderate/10', border: 'border-risk-moderate/25' },
  coral: { text: 'text-risk-high', bg: 'bg-risk-high/10', border: 'border-risk-high/25' },
  neutral: { text: 'text-shell-muted', bg: 'bg-navy-700', border: 'border-shell-border' },
}

/**
 * A single headline measurement.
 *
 * `context` carries the provenance of the number (for example which sample
 * region it came from) so a value is never displayed without its context.
 */
export function MetricIndicator({
  label,
  value,
  unit,
  context,
  footnote,
  accent = 'neutral',
  icon,
  className,
}: {
  label: string
  value: ReactNode
  unit?: string
  context?: ReactNode
  footnote?: ReactNode
  accent?: MetricAccent
  icon?: ReactNode
  className?: string
}) {
  const { ui } = useLocale()
  const tone = METRIC_ACCENTS[accent]
  return (
    <div className={cn('metric-indicator group flex flex-col gap-2.5', className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="metric-label leading-tight">{ui(label)}</p>
        {icon ? (
          <span
            className={cn(
              'metric-symbol flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
              tone.text,
              tone.bg,
              tone.border,
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <div className="metric-value flex items-baseline gap-1.5">
        <span className="text-[26px] font-semibold leading-none tracking-tight text-shell-text tabular-nums sm:text-[30px]">
          {value}
        </span>
        {unit ? <span className="text-[12.5px] font-medium text-shell-muted">{unit}</span> : null}
      </div>
      {context ? (
        <p className="metric-context text-[12px] font-medium leading-snug text-shell-muted">{context}</p>
      ) : null}
      {footnote ? (
        <p className="metric-footnote text-[11px] leading-relaxed text-shell-faint">{footnote}</p>
      ) : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Risk severity indicator                                                    */
/* -------------------------------------------------------------------------- */

export function RiskBandIndicator({
  category,
  score,
  size = 'md',
  className,
}: {
  category: RiskCategory
  score?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const { ui } = useLocale()
  const meta = RISK_CATEGORIES[category]
  const sizes = {
    sm: 'px-2 py-0.5 text-[10.5px]',
    md: 'px-2.5 py-1 text-[11px]',
    lg: 'px-3 py-1.5 text-[12px]',
  }
  return (
    <span
      className={cn(
        'risk-band-badge inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border font-semibold',
        sizes[size],
        className,
      )}
      style={{
        color: meta.textColor,
        backgroundColor: `${meta.color}1F`,
        borderColor: `${meta.color}55`,
      }}
      data-band={category}
    >
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: meta.color }}
        aria-hidden="true"
      />
      {ui(meta.label)}
      {typeof score === 'number' ? (
        <span className="tabular-nums opacity-80">· {score}</span>
      ) : null}
    </span>
  )
}

const SEVERITY_STYLE: Record<Severity, { label: string; color: string; background: string }> = {
  info: { label: 'Info', color: 'var(--glacier)', background: 'var(--glacier)' },
  low: { label: 'Low', color: 'var(--risk-low)', background: 'var(--risk-low)' },
  moderate: { label: 'Moderate', color: 'var(--risk-moderate)', background: 'var(--risk-moderate)' },
  high: { label: 'High', color: 'var(--risk-high)', background: 'var(--risk-high)' },
  critical: { label: 'Critical', color: 'var(--risk-critical)', background: 'var(--risk-critical)' },
}

export function SeverityIndicator({
  severity,
  className,
}: {
  severity: Severity
  className?: string
}) {
  const { ui } = useLocale()
  const style = SEVERITY_STYLE[severity]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide',
        className,
      )}
      style={{
        color: `rgb(${style.color})`,
        backgroundColor: `rgb(${style.background} / 0.1)`,
        borderColor: `rgb(${style.color} / 0.35)`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: style.color }}
        aria-hidden="true"
      />
      {ui(style.label)}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*  States                                                                     */
/* -------------------------------------------------------------------------- */

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-card border border-dashed border-shell-border bg-navy-900/50 px-6 py-14 text-center',
        className,
      )}
    >
      {icon ? (
        <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-full border border-shell-border bg-navy-800 text-shell-muted">
          {icon}
        </div>
      ) : null}
      <h3 className="text-[15px] font-semibold text-shell-text">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-shell-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div
      className="flex items-center justify-center gap-2.5 py-16 text-shell-muted"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span className="text-[12.5px] font-medium">{label}</span>
    </div>
  )
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  action,
  className,
}: {
  title?: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center rounded-card border border-risk-high/35 bg-risk-high/[0.06] px-6 py-12 text-center',
        className,
      )}
    >
      <AlertTriangle className="mb-3 h-6 w-6 text-risk-high" aria-hidden="true" />
      <h3 className="text-[15px] font-semibold text-shell-text">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-shell-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Confirmation dialog                                                        */
/* -------------------------------------------------------------------------- */

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  tone = 'danger',
}: {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  tone?: 'danger' | 'default'
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useDialogFocus(dialogRef, open)
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/85 p-4 backdrop-blur-sm"
      role="alertdialog"
      ref={dialogRef}
      tabIndex={-1}
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <div className="w-full max-w-md rounded-panel border border-shell-border bg-navy-800 p-5 shadow-panel">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
              tone === 'danger'
                ? 'border-risk-high/40 bg-risk-high/10 text-risk-high'
                : 'border-glacier/35 bg-glacier/10 text-glacier',
            )}
          >
            <AlertTriangle className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-shell-text">{title}</h2>
            <div className="mt-1.5 text-[13px] leading-relaxed text-shell-muted">{description}</div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn-secondary btn-sm">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn('btn-sm', tone === 'danger' ? 'btn-danger' : 'btn-primary')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Misc                                                                       */
/* -------------------------------------------------------------------------- */

export function NoResults({ label = 'No results' }: { label?: string }) {
  return (
    <p className="flex items-center justify-center gap-2 py-10 text-[13px] text-shell-muted">
      <Inbox className="h-4 w-4" aria-hidden="true" />
      {label}
    </p>
  )
}

export function CloseButton({
  onClick,
  label = 'Close',
  className,
}: {
  onClick: () => void
  label?: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        '-mr-1 -mt-1 rounded-lg p-2 text-shell-muted transition-colors hover:bg-navy-700 hover:text-shell-text',
        className,
      )}
    >
      <X className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
