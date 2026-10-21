/**
 * ============================================================================
 * ANALYTICAL CONTROLS
 * ============================================================================
 *
 * Shared controls for the analytical screens: a period selector, a region
 * readout, a filter bar and a searchable field.
 *
 * Every control here changes real application state — none of them are
 * decorative.
 */

import { useId, type ReactNode } from 'react'
import { Filter, Search, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { TimePeriod } from '../../data/demoData'
import { PERIOD_SHORT_LABELS } from '../../data/demoData'

/* -------------------------------------------------------------------------- */
/*  Period selector                                                            */
/* -------------------------------------------------------------------------- */

export function PeriodSelector({
  value,
  onChange,
  className,
  label = 'Sample period',
}: {
  value: TimePeriod
  onChange: (period: TimePeriod) => void
  className?: string
  label?: string
}) {
  const id = useId()
  const periods: TimePeriod[] = ['24h', '7d', '30d']

  return (
    <div className={cn('min-w-0', className)}>
      <span className="label" id={`${id}-label`}>
        {label}
      </span>
      <div
        className="inline-flex w-full rounded-xl border border-shell-border bg-navy-900/70 p-1"
        role="group"
        aria-labelledby={`${id}-label`}
      >
        {periods.map((period) => (
          <button
            key={period}
            type="button"
            onClick={() => onChange(period)}
            aria-pressed={value === period}
            className={cn(
              'min-h-9 flex-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-all duration-200',
              value === period
                ? 'bg-cyan text-navy-950 shadow-glow-cyan'
                : 'text-shell-muted hover:bg-navy-700 hover:text-shell-text',
            )}
          >
            {PERIOD_SHORT_LABELS[period]}
          </button>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Filter bar                                                                */
/* -------------------------------------------------------------------------- */

export function FilterBar({
  children,
  onClear,
  activeCount,
  className,
  label = 'Filters',
}: {
  children: ReactNode
  onClear?: () => void
  activeCount?: number
  className?: string
  label?: string
}) {
  return (
    <div
      className={cn(
        'atlas-filter-bar flex flex-wrap items-center gap-2 rounded-card border border-shell-border bg-navy-800 p-2.5',
        className,
      )}
      role="group"
      aria-label={label}
    >
      <span className="ml-1 mr-1 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.13em] text-shell-faint">
        <Filter className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </span>
      {children}
      {onClear && activeCount && activeCount > 0 ? (
        <button
          type="button"
          onClick={onClear}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-glacier transition-colors hover:bg-glacier/10"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Clear ({activeCount})
        </button>
      ) : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Chip toggle                                                               */
/* -------------------------------------------------------------------------- */

export function ChipToggle({
  label,
  active,
  onClick,
  count,
  color,
}: {
  label: string
  active: boolean
  onClick: () => void
  count?: number
  color?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all duration-200',
        active
          ? 'border-glacier/60 bg-glacier/12 text-shell-text'
          : 'border-shell-border bg-navy-900/60 text-shell-muted hover:border-shell-muted/50 hover:text-shell-text',
      )}
    >
      {color ? (
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      ) : null}
      {label}
      {typeof count === 'number' ? (
        <span
          className={cn(
            'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
            active ? 'bg-glacier/20 text-glacier' : 'bg-navy-700 text-shell-faint',
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Search field                                                              */
/* -------------------------------------------------------------------------- */

export function SearchField({
  label,
  value,
  onChange,
  placeholder,
  className,
  hideLabel = true,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  hideLabel?: boolean
}) {
  const id = useId()
  return (
    <div className={cn('search-field min-w-0 flex-1', className)}>
      <label className={cn('label', hideLabel && 'sr-only')} htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-shell-faint"
          aria-hidden="true"
        />
        <input
          id={id}
          type="search"
          className="input h-9 pl-9 text-[13px]"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Select field                                                              */
/* -------------------------------------------------------------------------- */

export function SelectField({
  label,
  value,
  onChange,
  options,
  className,
  hideLabel = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
  hideLabel?: boolean
}) {
  const id = useId()
  return (
    <div className={cn('min-w-0', className)}>
      <label className={cn('label', hideLabel && 'sr-only')} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="select h-9 text-[12.5px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
