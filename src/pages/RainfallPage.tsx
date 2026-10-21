import { useMotionPreference } from '../app/useMotionPreference'
/**
 * ============================================================================
 * RAINFALL ANALYTICS
 * ============================================================================
 *
 * A detailed view of the synthetic rainfall series for the selected sample
 * region. Every period control changes the displayed data, and every
 * aggregate is computed from the same series the chart plots.
 */

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
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
import { ArrowRight, CloudRain, Droplets, TrendingUp, Waves } from 'lucide-react'
import { useApp } from '../app/AppContext'
import { DEMO_CONFIG, PERIOD_LABELS, REGIONS, type TimePeriod } from '../data/demoData'
import { getRainfallSeries, getRegionStatistics } from '../data/selectors'
import { rainUnit, rainValue } from '../utils/measurements'
import {
  AXIS_PROPS,
  CHART_COLORS,
  GRID_PROPS,
  TOOLTIP_CURSOR,
  TOOLTIP_STYLE,
  TooltipCard,
  type TooltipRenderProps,
} from '../components/charts/chartTheme'
import { PageHeader } from '../components/ui/PageHeader'
import { MetricIndicator, SectionHeading, Surface } from '../components/ui/primitives'
import { PeriodSelector } from '../components/ui/Controls'
import { ChartContainer } from '../components/charts/ChartContainer'
import { RainfallChart } from '../components/charts/RainfallChart'

const EASE = [0.16, 1, 0.3, 1] as const

export function RainfallPage() {
  const { selectedRegion, setSelectedRegionId, preferences } = useApp()
  const units = preferences.units
  const [period, setPeriod] = useState<TimePeriod>('7d')

  const stats = useMemo(
    () => getRegionStatistics(selectedRegion, period),
    [period, selectedRegion],
  )

  const series = useMemo(
    () => getRainfallSeries(period, selectedRegion.rainfallFactor),
    [period, selectedRegion],
  )

  // Daily contribution of each sample point, as a share of the total.
  const contributions = useMemo(() => {
    const total = series.reduce((sum, point) => sum + point.value, 0)
    if (total <= 0) return []
    return series
      .map((point) => ({ label: point.label, value: point.value, share: point.value / total }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [series])

  const wetterDays = series.filter(point => point.value > 0).length

  return (
    <div className="page-workspace space-y-8 atlas-page atlas-page--rainfall">
      <motion.div data-panel="intro"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <PageHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/25 bg-cyan/[0.07] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-cyan">
              <CloudRain className="h-3 w-3" aria-hidden="true" />
              Synthetic meteorology · {DEMO_CONFIG.referenceDateLabel}
            </span>
          }
          title="Rainfall analytics"
          description={`Authored demonstration series for ${selectedRegion.name}. No observed or forecast rainfall is shown, and the figures below are computed from exactly the points plotted in the chart.`}
          actions={
            <PeriodSelector
              value={period}
              onChange={setPeriod}
              className="w-full sm:w-[220px]"
            />
          }
        />
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/*  Aggregates                                                    */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="metrics"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.06, ease: EASE }}
        className="metric-grid grid grid-cols-2 gap-px overflow-hidden rounded-card border border-shell-border bg-shell-border xl:grid-cols-4"
      >
        <MetricCell>
          <MetricIndicator
            label="Cumulative rainfall"
            value={rainValue(stats.cumulativeRainfall, units)}
            unit={rainUnit(units)}
            accent="glacier"
            icon={<CloudRain className="h-3.5 w-3.5" aria-hidden="true" />}
            context="Sum of the displayed samples"
            footnote={`${PERIOD_LABELS[period]} of authored sample points.`}
          />
        </MetricCell>
        <MetricCell>
          <MetricIndicator
            label="Mean per sample"
            value={rainValue(stats.meanRainfall, units)}
            unit={rainUnit(units)}
            accent="teal"
            icon={<Waves className="h-3.5 w-3.5" aria-hidden="true" />}
            context="Arithmetic mean"
            footnote={`Across ${series.length} sample points.`}
          />
        </MetricCell>
        <MetricCell>
          <MetricIndicator
            label="Peak sample"
            value={rainValue(stats.peakRainfall, units)}
            unit={rainUnit(units)}
            accent="cyan"
            icon={<TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />}
            context="Highest displayed value"
            footnote="The maximum of the plotted series."
          />
        </MetricCell>
        <MetricCell>
          <MetricIndicator
            label="Wettest points"
            value={wetterDays}
            unit={`of ${series.length}`}
            accent="amber"
            icon={<Droplets className="h-3.5 w-3.5" aria-hidden="true" />}
            context="Samples carrying rainfall"
            footnote="Count of non-zero sample points in the period."
          />
        </MetricCell>
      </motion.section>

      {/* ------------------------------------------------------------- */}
      {/*  Intensity series                                              */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="plot"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
        className="space-y-4"
      >
        <SectionHeading
          eyebrow="Section 01"
          title="Rainfall intensity"
          description={`${PERIOD_LABELS[period]} · ${selectedRegion.name} · ${rainUnit(units)} per sample`}
        />
        <ChartContainer
          title="Sample rainfall series"
          subtitle={`${selectedRegion.name} · ${selectedRegion.district}`}
          eyebrow="Series"
          footnote="Values come from the fixed shared demonstration series, scaled by this sample district's factor. They describe no real weather."
        >
          <RainfallChart region={selectedRegion} period={period} height={320} />
        </ChartContainer>
      </motion.section>

      {/* ------------------------------------------------------------- */}
      {/*  Contribution + comparison                                     */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="comparison"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
        className="space-y-4"
      >
        <SectionHeading
          eyebrow="Section 02"
          title="Where the total comes from"
          description="The largest sample points and how this region compares with the rest of Tamil Nadu."
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Surface className="p-5">
            <p className="overline mb-1.5">Largest samples</p>
            <h3 className="text-[14.5px] font-semibold text-shell-text">
              Share of the period total
            </h3>
            {contributions.length === 0 ? (
              <p className="py-8 text-center text-[12.5px] text-shell-muted">
                No rainfall is recorded in this sample period.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {contributions.map((entry) => (
                  <li key={entry.label}>
                    <div className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="font-medium text-shell-text">{entry.label}</span>
                      <span className="font-semibold tabular-nums text-shell-muted">
                        {rainValue(entry.value, units)} {rainUnit(units)} ·{' '}
                        {Math.round(entry.share * 100)}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy-600">
                      <div
                        className="h-full rounded-full bg-cyan transition-[width] duration-500 ease-out-expo"
                        style={{ width: `${Math.max(2, entry.share * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 border-t border-shell-border/70 pt-3 text-[11px] leading-relaxed text-shell-faint">
              Shares are computed from the same sample points the chart plots.
            </p>
          </Surface>

          <ChartContainer
            title="Sample rainfall across Tamil Nadu"
            subtitle="Derived 24-hour totals for every sample region."
            action={
              <Link to="/rainfall" className="btn-ghost btn-sm">
                This region
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            }
            footnote="Select a bar to change the shared region. Bars compare synthetic 24-hour rainfall totals."
          >
            <RainfallRegionComparison
              onSelectRegion={setSelectedRegionId}
              highlightId={selectedRegion.id}
            />
          </ChartContainer>
        </div>
      </motion.section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Local building blocks                                                      */
/* -------------------------------------------------------------------------- */

function MetricCell({ children }: { children: React.ReactNode }) {
  return <div className="bg-navy-800 p-5">{children}</div>
}

/**
 * Bar chart of the derived 24-hour rainfall total for each sample region.
 * The data comes straight from the shared dataset.
 */
function RainfallRegionComparison({
  onSelectRegion,
  highlightId,
}: {
  onSelectRegion: (id: string) => void
  highlightId: string
}) {
  const reducedMotion = useMotionPreference()
  const { preferences } = useApp()
  const data = useMemo(
    () =>
      REGIONS.map((region) => ({
        id: region.id,
        name: region.name,
        value: rainValue(region.sampleRainfall, preferences.units),
        selected: region.id === highlightId,
      })),
    [preferences.units, highlightId],
  )

  return (
    <div className="w-full" style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid {...GRID_PROPS} />
          <XAxis
            type="number"
            {...AXIS_PROPS}
            tickMargin={8}
          />
          <YAxis {...AXIS_PROPS} type="category" dataKey="name" width={106} interval={0} tick={{ fontSize: 10 }} />
          <Tooltip
            {...TOOLTIP_STYLE}
            cursor={TOOLTIP_CURSOR}
            content={({ active, payload, label }: TooltipRenderProps) => {
              if (!active || !payload?.length) return null
              return (
                <TooltipCard
                  title={String(label ?? '')}
                  rows={[
                    {
                      label: 'Sample 24h rainfall',
                      value: `${payload[0].value} ${rainUnit(preferences.units)}`,
                      color: CHART_COLORS.rainfall,
                    },
                  ]}
                />
              )
            }}
          />
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            maxBarSize={46}
            isAnimationActive={!reducedMotion}
            onClick={(d: unknown) => {
              const payload = d as { id?: string }
              if (payload?.id) onSelectRegion(payload.id)
            }}
            cursor="pointer"
          >
            {data.map((entry) => (
              <Cell
                key={entry.id}
                fill={CHART_COLORS.rainfall}
                fillOpacity={entry.selected ? 1 : 0.55}
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
