import { useMotionPreference } from '../../app/useMotionPreference'
/**
 * ============================================================================
 * RISK TREND CHART
 * ============================================================================
 *
 * Illustrative risk-score trend for a single sample region.
 *
 * The score is a purely synthetic composition of the sample rainfall and
 * water-level series. It is NOT a model output and NOT a forecast, and the
 * dashed reference lines are illustrative bands rather than thresholds.
 */

import {
  Area,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getRegionRiskTrend, type TimePeriod } from '../../data/demoData'
import type { Region } from '../../types'
import { useApp } from '../../app/AppContext'
import { rainValue, rainUnit, levelValue, levelUnit } from '../../utils/measurements'
import {
  AXIS_PROPS,
  CHART_COLORS,
  GRID_PROPS,
  TOOLTIP_CURSOR,
  TOOLTIP_STYLE,
  TooltipCard,
  type TooltipRenderProps,
} from './chartTheme'

export function RiskTrendChart({
  region,
  period,
  height = 280,
}: {
  region: Region
  period: TimePeriod
  height?: number
}) {
  const reducedMotion = useMotionPreference()
  const { preferences } = useApp()
  const data = getRegionRiskTrend(region, period)

  const renderTooltip = ({ active, payload, label }: TooltipRenderProps) => {
    if (!active || !payload?.length) return null
    const entry = payload[0].payload as {
      score: number
      rainfall: number
      waterLevel: number
    }
    return (
      <TooltipCard
        title={String(label ?? '')}
        rows={[
          {
            label: 'Synthetic blend index',
            value: `${entry.score} / 100`,
            color: CHART_COLORS.risk,
          },
          {
            label: 'Sample rainfall',
            value: `${rainValue(entry.rainfall, preferences.units)} ${rainUnit(preferences.units)}`,
            color: CHART_COLORS.rainfall,
          },
          {
            label: 'Sample level',
            value: `${levelValue(entry.waterLevel, preferences.units)} ${levelUnit(preferences.units)}`,
            color: CHART_COLORS.waterLevel,
          },
        ]}
      />
    )
  }

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="risk-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.risk} stopOpacity={0.34} />
              <stop offset="100%" stopColor={CHART_COLORS.risk} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis dataKey="label" {...AXIS_PROPS} minTickGap={28} tickMargin={8} />
          <YAxis {...AXIS_PROPS} width={44} domain={[0, 100]} />
          <Tooltip
            {...TOOLTIP_STYLE}
            cursor={TOOLTIP_CURSOR}
            content={renderTooltip}
          />
          {/* Illustrative band markers - NOT operational thresholds. */}
          <ReferenceLine
            y={35}
            stroke={CHART_COLORS.low}
            strokeDasharray="4 4"
            strokeOpacity={0.4}
          />
          <ReferenceLine
            y={60}
            stroke={CHART_COLORS.high}
            strokeDasharray="4 4"
            strokeOpacity={0.4}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke={CHART_COLORS.risk}
            strokeWidth={2.5}
            fill="url(#risk-fill)"
            animationDuration={350}
            animationEasing="ease-out"
            isAnimationActive={!reducedMotion}
            activeDot={{ r: 3.5, strokeWidth: 0, fill: CHART_COLORS.risk }}
          />
          <ReferenceLine y={80} stroke="rgb(var(--risk-critical))" strokeDasharray="4 4" strokeOpacity={0.35} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
