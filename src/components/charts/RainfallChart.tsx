import { useMotionPreference } from '../../app/useMotionPreference'
import { formatDateTime } from '../../utils/format'
/**
 * ============================================================================
 * TIME-SERIES CHARTS
 * ============================================================================
 *
 * Rainfall and water-level charts, both driven by the shared synthetic
 * series in `src/data/timeSeries.ts`. The selected sample region scales the
 * series, and the display honours the unit preference.
 */

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useApp } from '../../app/AppContext'
import { getRainfallSeries, getWaterLevelSeries, type TimePeriod } from '../../data/demoData'
import type { Region } from '../../types'
import { levelUnit, levelValue, rainUnit, rainValue } from '../../utils/measurements'
import {
  AXIS_PROPS,
  CHART_COLORS,
  GRID_PROPS,
  TOOLTIP_CURSOR,
  TOOLTIP_STYLE,
  TooltipCard,
  type TooltipRenderProps,
} from './chartTheme'

export function RainfallChart({
  region,
  period,
  height = 260,
}: {
  region: Region
  period: TimePeriod
  height?: number
}) {
  const reducedMotion = useMotionPreference()
  const { preferences } = useApp()
  const unit = rainUnit(preferences.units)
  const data = getRainfallSeries(period, region.rainfallFactor).map((point) => ({
    ...point,
    value: rainValue(point.value, preferences.units),
  }))

  const renderTooltip = ({ active, payload, label }: TooltipRenderProps) => {
    if (!active || !payload?.length) return null
    return (
      <TooltipCard
        title={formatDateTime(String(payload[0].payload?.timestamp ?? label ?? ''))}
        rows={[
          {
            label: 'Sample rainfall',
            value: `${payload[0].value} ${unit}`,
            color: CHART_COLORS.rainfall,
          },
        ]}
      />
    )
  }

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 10, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="rainfall-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.rainfall} stopOpacity={0.4} />
              <stop offset="100%" stopColor={CHART_COLORS.rainfall} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis dataKey="label" {...AXIS_PROPS} minTickGap={26} tickMargin={8} />
          <YAxis {...AXIS_PROPS} width={44} tickFormatter={(value: number) => `${Number(value.toFixed(2))}`} />
          <Tooltip
            {...TOOLTIP_STYLE}
            cursor={TOOLTIP_CURSOR}
            content={renderTooltip}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS.rainfall}
            strokeWidth={2}
            fill="url(#rainfall-fill)"
            animationDuration={350}
            animationEasing="ease-out"
            isAnimationActive={!reducedMotion}
            activeDot={{ r: 3.5, strokeWidth: 0, fill: CHART_COLORS.rainfall }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function WaterLevelChart({
  region,
  period,
  height = 260,
  /** Optional illustrative reference level (metres). Not a safety threshold. */
  referenceLevel,
  referenceLabel,
}: {
  region: Region
  period: TimePeriod
  height?: number
  referenceLevel?: number
  referenceLabel?: string
}) {
  const reducedMotion = useMotionPreference()
  const { preferences } = useApp()
  const unit = levelUnit(preferences.units)
  const data = getWaterLevelSeries(period, region.waterLevelFactor).map((point) => ({
    ...point,
    value: levelValue(point.value, preferences.units),
  }))

  const reference =
    referenceLevel === undefined ? undefined : levelValue(referenceLevel, preferences.units)

  const renderTooltip = ({ active, payload, label }: TooltipRenderProps) => {
    if (!active || !payload?.length) return null
    return (
      <TooltipCard
        title={formatDateTime(String(payload[0].payload?.timestamp ?? label ?? ''))}
        rows={[
          {
            label: 'Sample water level',
            value: `${payload[0].value} ${unit}`,
            color: CHART_COLORS.waterLevel,
          },
        ]}
      />
    )
  }

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 10, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="waterlevel-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.waterLevel} stopOpacity={0.28} />
              <stop offset="100%" stopColor={CHART_COLORS.waterLevel} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis dataKey="label" {...AXIS_PROPS} minTickGap={26} tickMargin={8} />
          <YAxis
            {...AXIS_PROPS}
            width={44}
            tickFormatter={(value: number) => `${Number(value.toFixed(2))}`}
            domain={['dataMin - 0.4', 'dataMax + 0.4']}
          />
          {reference !== undefined ? (
            <ReferenceLine
              y={reference}
              stroke={CHART_COLORS.risk}
              strokeDasharray="5 4"
              strokeOpacity={0.55}
              label={{
                value: referenceLabel ?? 'Illustrative reference',
                position: 'insideTopRight',
                fill: CHART_COLORS.axis,
                fontSize: 10,
              }}
            />
          ) : null}
          <Tooltip
            {...TOOLTIP_STYLE}
            cursor={TOOLTIP_CURSOR}
            content={renderTooltip}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill="url(#waterlevel-fill)"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS.waterLevel}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 3.5, strokeWidth: 0, fill: CHART_COLORS.waterLevel }}
            animationDuration={350}
            animationEasing="ease-out"
            isAnimationActive={!reducedMotion}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
