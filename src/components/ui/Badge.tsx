import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'teal'

const TONES: Record<Tone, string> = {
  neutral: 'border-shell-border bg-navy-600 text-shell-muted',
  info: 'border-glacier/35 bg-glacier/10 text-glacier-soft',
  success: 'border-risk-low/35 bg-risk-low/10 text-risk-low',
  warning: 'border-risk-moderate/35 bg-risk-moderate/10 text-risk-moderate',
  danger: 'border-risk-high/40 bg-risk-high/10 text-risk-high',
  teal: 'border-teal-bright/35 bg-teal-brand/15 text-teal-bright',
}

export function Badge({
  children,
  tone = 'neutral',
  icon,
  className,
}: {
  children: ReactNode
  tone?: Tone
  icon?: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}

export function Dot({
  className,
  pulse,
}: {
  className?: string
  pulse?: boolean
}) {
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      {pulse ? (
        <span
          className={cn('absolute inline-flex h-full w-full animate-pulse-ring rounded-full', className)}
          aria-hidden="true"
        />
      ) : null}
      <span
        className={cn('relative inline-flex h-2 w-2 rounded-full', className)}
        aria-hidden="true"
      />
    </span>
  )
}
