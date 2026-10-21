/**
 * ============================================================================
 * RIVER & WATER LEVELS
 * ============================================================================
 *
 * A polished monitoring view for the illustrative gauge series of the
 * selected sample region.
 *
 * The page draws a clear line between a *sample observation* and an
 * *official safety threshold*: no official thresholds exist in this
 * prototype, and the only reference level shown is authored for the demo.
 */

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowDownRight, ArrowUpRight, Info, Minus, Waves } from 'lucide-react'
import { useApp } from '../app/AppContext'
import { DEMO_CONFIG, PERIOD_LABELS, type TimePeriod } from '../data/demoData'
import { getRegionStatistics, getWaterLevelSeries } from '../data/selectors'
import { levelUnit, levelValue } from '../utils/measurements'
import { PageHeader } from '../components/ui/PageHeader'
import { MetricIndicator, SectionHeading, Surface } from '../components/ui/primitives'
import { PeriodSelector } from '../components/ui/Controls'
import { ChartContainer } from '../components/charts/ChartContainer'
import { WaterLevelChart } from '../components/charts/RainfallChart'
import { StationSelector } from '../components/regions/StationSelector'
import { stationForRegion } from '../data/stations'

const EASE = [0.16, 1, 0.3, 1] as const

export function RiverPage() {
  const { selectedRegion, preferences } = useApp()
  const units = preferences.units
  const [period, setPeriod] = useState<TimePeriod>('7d')

  const stats = useMemo(
    () => getRegionStatistics(selectedRegion, period),
    [period, selectedRegion],
  )

  const series = useMemo(
    () => getWaterLevelSeries(period, selectedRegion.waterLevelFactor),
    [period, selectedRegion],
  )

  const change = stats.waterLevelChange
  const ChangeIcon = change > 0.005 ? ArrowUpRight : change < -0.005 ? ArrowDownRight : Minus

  return (
    <div className="page-workspace space-y-8 atlas-page atlas-page--river">
      <motion.div data-panel="intro"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <PageHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/25 bg-cyan/[0.07] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-cyan">
              <Waves className="h-3 w-3" aria-hidden="true" />
              Sample gauge · {DEMO_CONFIG.referenceDateLabel}
            </span>
          }
          title="River & water levels"
          description={`Illustrative gauge series for ${selectedRegion.name}. There is no connected sensor, no calibrated datum and no official danger threshold anywhere in this build.`}
          actions={
            <PeriodSelector
              value={period}
              onChange={setPeriod}
              className="w-full sm:w-[220px]"
            />
          }
        />
      </motion.div>

      <Surface data-panel="station" className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <StationSelector className="w-full sm:max-w-sm" />
        <p className="text-xs leading-relaxed text-shell-muted"><span className="font-mono text-cyan">{stationForRegion(selectedRegion.id).id}</span> · Representative fictional gauge<br />The selected region supplies the plotted sample readings.</p>
      </Surface>

      {/* ------------------------------------------------------------- */}
      {/*  Summary indicators                                            */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="metrics"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.06, ease: EASE }}
        className="metric-grid grid grid-cols-2 gap-px overflow-hidden rounded-card border border-shell-border bg-shell-border xl:grid-cols-4"
      >
        <MetricCell>
          <MetricIndicator
            label="Current sample level"
            value={levelValue(selectedRegion.sampleWaterLevel, units)}
            unit={levelUnit(units)}
            accent="teal"
            icon={<Waves className="h-3.5 w-3.5" aria-hidden="true" />}
            context={selectedRegion.name}
            footnote="09:30 reference reading. Daily chart samples are at 06:00."
          />
        </MetricCell>
        <MetricCell>
          <MetricIndicator
            label="Minimum level"
            value={levelValue(stats.minWaterLevel, units)}
            unit={levelUnit(units)}
            accent="glacier"
            context="Lowest displayed value"
            footnote={`Across the ${PERIOD_LABELS[period].toLowerCase()}.`}
          />
        </MetricCell>
        <MetricCell>
          <MetricIndicator
            label="Mean level"
            value={levelValue(stats.meanWaterLevel, units)}
            unit={levelUnit(units)}
            accent="cyan"
            context="Arithmetic mean"
            footnote={`Across ${series.length} sample points.`}
          />
        </MetricCell>
        <MetricCell>
          <MetricIndicator
            label="Peak level"
            value={levelValue(stats.peakWaterLevel, units)}
            unit={levelUnit(units)}
            accent="amber"
            context="Highest displayed value"
            footnote="The maximum of the plotted series."
          />
        </MetricCell>
      </motion.section>

      {/* ------------------------------------------------------------- */}
      {/*  The series                                                    */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="plot"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
        className="space-y-4"
      >
        <SectionHeading
          eyebrow="Section 01"
          title="Water-level trend"
          description={`${PERIOD_LABELS[period]} · ${selectedRegion.name} · ${levelUnit(units)} on the illustrative gauge`}
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <ChartContainer
            title="Sample water-level series"
            subtitle={`${selectedRegion.name} · ${selectedRegion.district}`}
            eyebrow="Series"
            footnote="The display has no calibrated datum and no official warning level. Every value is a fixed demonstration sample."
          >
            <WaterLevelChart region={selectedRegion} period={period} height={340} />
          </ChartContainer>

          <div className="space-y-4">
            <Surface className="p-5">
              <p className="overline mb-1.5">Period movement</p>
              <h3 className="text-[14.5px] font-semibold text-shell-text">
                Change across the window
              </h3>
              <p className="mt-4 flex items-baseline gap-2">
                <ChangeIcon
                  className={
                    change > 0.005
                      ? 'h-5 w-5 text-risk-moderate'
                      : change < -0.005
                        ? 'h-5 w-5 text-risk-low'
                        : 'h-5 w-5 text-shell-muted'
                  }
                  aria-hidden="true"
                />
                <span className="text-[30px] font-semibold leading-none tabular-nums text-shell-text">
                  {change > 0 ? '+' : ''}
                  {levelValue(change, units)}
                </span>
                <span className="text-[13px] font-medium text-shell-muted">
                  {levelUnit(units)}
                </span>
              </p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-shell-muted">
                Difference between the first and last sample point in the{' '}
                {PERIOD_LABELS[period].toLowerCase()}.
              </p>
              <p className="mt-4 border-t border-shell-border/70 pt-3.5 text-[11px] leading-relaxed text-shell-faint">
                This is the difference between two authored sample points. It is not a rate of
                change, a rise rate or a prediction.
              </p>
            </Surface>

            <Surface className="p-5">
              <p className="overline mb-1.5">Observations vs thresholds</p>
              <h3 className="text-[14.5px] font-semibold text-shell-text">
                What this display is not
              </h3>
              <ul className="mt-3 space-y-2.5 text-[12px] leading-relaxed text-shell-muted">
                {[
                  'The values are sample observations from a fixed series, not readings from an instrument.',
                  'No official flood warning level exists for this gauge, so none is drawn on the chart.',
                  'Nothing on this page is a statement about conditions in any real place.',
                  'Official local authorities always publish the thresholds that matter where you live.',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-risk-moderate"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-start gap-2 border-t border-shell-border/70 pt-3.5 text-[11px] leading-relaxed text-shell-faint">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                The dashed reference line in the risk analysis view marks an illustrative band, not a
                safety level.
              </p>
            </Surface>
          </div>
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
