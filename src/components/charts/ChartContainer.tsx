/**
 * ============================================================================
 * CHART CONTAINER
 * ============================================================================
 *
 * A consistent frame for every analytical surface: title, context line,
 * actions, and an optional provenance note beneath the plot.
 */

import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Surface } from '../ui/primitives'
import { useLocale } from '../../app/LocaleContext'

export function ChartContainer({
  title,
  subtitle,
  eyebrow,
  action,
  footnote,
  children,
  className,
  bodyClassName,
}: {
  title: string
  subtitle?: ReactNode
  eyebrow?: ReactNode
  action?: ReactNode
  footnote?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  const { ui } = useLocale()
  return (
    <Surface className={cn('chart-panel p-5', className)}>
      <div className="chart-panel-heading mb-5 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          {eyebrow ? <p className="overline mb-1.5">{eyebrow}</p> : null}
          <h3 className="text-[16px] font-medium leading-snug tracking-tight text-shell-text">{ui(title)}</h3>
          {subtitle ? (
            <p className="mt-1 text-[12px] leading-relaxed text-shell-muted">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={cn('chart-panel-plot min-w-0', bodyClassName)}>{children}</div>
      {footnote ? (
        <p className="mt-3.5 border-t border-shell-border/70 pt-3 text-[11px] leading-relaxed text-shell-faint">
          {footnote}
        </p>
      ) : null}
    </Surface>
  )
}
