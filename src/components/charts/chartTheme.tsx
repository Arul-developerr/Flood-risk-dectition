/**
 * ============================================================================
 * CHART THEME
 * ============================================================================
 *
 * One visual language for every Recharts surface in the build: shared colour
 * tokens, axis and grid treatment, and a custom tooltip that matches the
 * application chrome.
 *
 * Rainfall and water level use the interface accents. Risk colours are
 * reserved for severity and are never used as generic chart decoration.
 */

import type { ReactNode, SVGProps } from 'react'
import type { TooltipProps } from 'recharts'
import type { NameType, Payload, ValueType } from 'recharts/types/component/DefaultTooltipContent'

/** The subset of Recharts tooltip props this project styles. */
type TooltipStyleProps = Pick<
  TooltipProps<ValueType, NameType>,
  'contentStyle' | 'labelStyle' | 'itemStyle' | 'wrapperStyle'
>

export const CHART_COLORS = {
  rainfall: 'rgb(var(--cyan))',
  waterLevel: 'rgb(var(--teal-bright))',
  risk: 'rgb(var(--risk-moderate))',
  high: 'rgb(var(--risk-high))',
  moderate: 'rgb(var(--risk-moderate))',
  low: 'rgb(var(--risk-low))',
  grid: 'rgb(var(--shell-border) / 0.55)',
  axis: 'rgb(var(--shell-faint))',
} as const

export const AXIS_PROPS = {
  stroke: CHART_COLORS.axis,
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const

export const GRID_PROPS = {
  stroke: CHART_COLORS.grid,
  strokeDasharray: '3 4',
  vertical: false,
} as const

export const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: 'rgb(var(--navy-800))',
    border: '1px solid rgb(var(--shell-border))',
    borderRadius: 12,
    fontSize: 12,
    color: 'rgb(var(--shell-text))',
    boxShadow: '0 18px 40px -20px rgba(2, 8, 16, 0.95)',
    padding: '10px 12px',
  },
  labelStyle: { color: 'rgb(var(--shell-text))', fontWeight: 600, marginBottom: 6 },
  itemStyle: { color: 'rgb(var(--shell-muted))', padding: '1px 0' },
} satisfies TooltipStyleProps

/** The highlight rectangle Recharts draws under the active chart point. */
export const TOOLTIP_CURSOR: SVGProps<SVGElement> = {
  fill: 'rgba(77, 225, 242, 0.07)',
}

/** Props Recharts hands to a custom tooltip renderer. */
export interface TooltipRenderProps {
  active?: boolean
  payload?: Array<Payload<ValueType, NameType>>
  label?: string | number
}

/** A short label used in tooltips and legends. */
export function seriesName(name: string, unit?: string): string {
  return unit ? `${name} (${unit})` : name
}

/**
 * Shared tooltip body.
 *
 * Keeps the "sample" provenance visible inside every tooltip so a value is
 * never presented as a live observation.
 */
export function TooltipCard({
  title,
  rows,
}: {
  title: string
  rows: Array<{ label: string; value: string; color?: string }>
}) {
  return (
    <div className="min-w-[9rem]">
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-shell-faint">{title}</p>
      <ul className="mt-1.5 space-y-1">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-4 text-[12px]">
            <span className="flex items-center gap-1.5 text-shell-muted">
              {row.color ? (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: row.color }}
                  aria-hidden="true"
                />
              ) : null}
              {row.label}
            </span>
            <span className="font-semibold tabular-nums text-shell-text">{row.value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 border-t border-shell-border/70 pt-1.5 text-[10px] text-shell-faint">
        Synthetic sample value
      </p>
    </div>
  )
}

/** Narrow helper so charts can read a payload entry without casting. */
export function payloadRecord(
  entry: Payload<ValueType, NameType> | undefined,
): Record<string, unknown> {
  return (entry?.payload ?? {}) as Record<string, unknown>
}

export type { ReactNode }
