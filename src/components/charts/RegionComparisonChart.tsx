import { useMotionPreference } from '../../app/useMotionPreference'
import { useLocale } from '../../app/LocaleContext'
/**
 * ============================================================================
 * REGION COMPARISON CHART
 * ============================================================================
 *
 * Side-by-side comparison of the illustrative risk score of every sample
 * region. Bars are coloured by the sample risk band and can be clicked to
 * change the shared selected region.
 */

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { REGIONS, RISK_CATEGORIES } from '../../data/demoData'
import {
  AXIS_PROPS,
  GRID_PROPS,
  TOOLTIP_CURSOR,
  TOOLTIP_STYLE,
  TooltipCard,
  type TooltipRenderProps,
} from './chartTheme'

export function RegionComparisonChart({
  height = 300,
  onSelectRegion,
  highlightId,
}: {
  height?: number
  onSelectRegion?: (regionId: string) => void
  /** Highlights the currently selected region in the chart. */
  highlightId?: string
}) {
  const reducedMotion = useMotionPreference()

  const data = REGIONS.map((r) => ({
    id: r.id,
    name: r.name,
    score: r.illustrativeRiskScore,
    fill: RISK_CATEGORIES[r.riskCategory].color,
    band: RISK_CATEGORIES[r.riskCategory].label,
    selected: r.id === highlightId,
  }))

  const renderTooltip = ({ active, payload }: TooltipRenderProps) => {
    if (!active || !payload?.length) return null
    const entry = payload[0].payload as {
      id: string
      name: string
      score: number
      fill: string
      band: string
    }
    return (
      <TooltipCard
        title={entry.name}
        rows={[
          { label: 'Illustrative score', value: `${entry.score} / 100`, color: entry.fill },
          { label: 'Sample band', value: entry.band, color: entry.fill },
        ]}
      />
    )
  }

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid {...GRID_PROPS} />
          <XAxis
            type="number"
            {...AXIS_PROPS}
            domain={[0, 100]}
            tickMargin={8}
          />
          <YAxis {...AXIS_PROPS} type="category" dataKey="name" width={106} interval={0} tick={{ fontSize: 10 }} />
          <Tooltip
            {...TOOLTIP_STYLE}
            cursor={TOOLTIP_CURSOR}
            content={renderTooltip}
          />
          <Bar
            dataKey="score"
            radius={[6, 6, 0, 0]}
            maxBarSize={46}
            isAnimationActive={!reducedMotion}
            animationDuration={350}
            animationEasing="ease-out"
            onClick={(d: unknown) => {
              const payload = d as { id?: string }
              if (payload?.id) onSelectRegion?.(payload.id)
            }}
            cursor={onSelectRegion ? 'pointer' : 'default'}
          >
            {data.map((entry) => (
              <Cell
                key={entry.id}
                fill={entry.fill}
                fillOpacity={entry.selected ? 1 : 0.62}
                stroke={entry.selected ? '#F0F6FC' : 'none'}
                strokeWidth={entry.selected ? 1.2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * Horizontal band distribution.
 *
 * Shows how many sample regions fall into each illustrative risk band, and
 * lets a band be selected to filter the map.
 */
export function BandDistribution({
  counts,
  onSelectBand,
  activeBands,
}: {
  counts: Array<{ category: keyof typeof RISK_CATEGORIES; count: number; share: number }>
  onSelectBand?: (category: keyof typeof RISK_CATEGORIES) => void
  activeBands?: string[]
}) {
  const { ui } = useLocale()
  return (
    <ul className="space-y-3">
      {counts.map((entry) => {
        const meta = RISK_CATEGORIES[entry.category]
        const active = activeBands?.includes(entry.category) ?? false
        const interactive = Boolean(onSelectBand)
        return (
          <li key={entry.category}>
            <button
              type="button"
              onClick={() => onSelectBand?.(entry.category)}
              disabled={!interactive}
              aria-pressed={interactive ? active : undefined}
              className="block w-full text-left disabled:cursor-default"
            >
              <div className="flex items-center justify-between gap-2 text-[12.5px]">
                <span className="flex items-center gap-2 font-medium text-shell-text">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: meta.color }}
                    aria-hidden="true"
                  />
                  {ui(meta.label)}
                </span>
                <span className="font-semibold tabular-nums text-shell-muted">
                  {entry.count} · {Math.round(entry.share * 100)}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy-600">
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out-expo"
                  style={{
                    width: `${Math.max(2, entry.share * 100)}%`,
                    backgroundColor: meta.color,
                  }}
                />
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
