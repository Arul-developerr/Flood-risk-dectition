/**
 * ============================================================================
 * PREDICTION / RISK ASSESSMENT
 * ============================================================================
 *
 * A scientific analysis workspace for the selected sample region.
 *
 * The page presents the illustrative score, the sample series behind it and
 * an explicit account of what the number is and is not. It never describes
 * a forecast, a probability or a validated model.
 */

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowRight,
  CloudRain,
  Droplets,
  FileWarning,
  Gauge,
  Info,
  TrendingUp,
} from 'lucide-react'
import { useApp } from '../app/AppContext'
import {
  DEMO_CONFIG,
  PERIOD_LABELS,
  RISK_CATEGORIES,
  TREND_LABELS,
  type TimePeriod,
} from '../data/demoData'
import { getRegionStatistics } from '../data/selectors'
import { levelUnit, levelValue, rainUnit, rainValue } from '../utils/measurements'
import { PageHeader } from '../components/ui/PageHeader'
import { MetricIndicator, RiskBandIndicator, SectionHeading, Surface } from '../components/ui/primitives'
import { PeriodSelector } from '../components/ui/Controls'
import { ChartContainer } from '../components/charts/ChartContainer'
import { RainfallChart, WaterLevelChart } from '../components/charts/RainfallChart'
import { RiskTrendChart } from '../components/charts/RiskTrendChart'
import { RegionComparisonChart } from '../components/charts/RegionComparisonChart'
import { ScoreOrbit } from '../components/ui/ScoreOrbit'
import { RegionRail } from '../components/regions/RegionRail'

const EASE = [0.16, 1, 0.3, 1] as const


export function PredictionPage() {
  const { selectedRegion, setSelectedRegionId, preferences } = useApp()
  const units = preferences.units
  const [period, setPeriod] = useState<TimePeriod>('7d')

  const stats = useMemo(
    () => getRegionStatistics(selectedRegion, period),
    [period, selectedRegion],
  )

  const bandMeta = RISK_CATEGORIES[selectedRegion.riskCategory]

  return (
    <div className="page-workspace space-y-8 atlas-page atlas-page--prediction">
      <motion.div data-panel="intro"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <PageHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/25 bg-cyan/[0.07] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-cyan">
              <Gauge className="h-3 w-3" aria-hidden="true" />
              Illustrative series · not a forecast
            </span>
          }
          title="Risk assessment"
          description={`Every chart on this page replays a fixed synthetic series scaled to ${selectedRegion.name}. These lines were authored to demonstrate the interface. They are not predictions, projections or observations, and no future value is implied.`}
          actions={
            <PeriodSelector
              value={period}
              onChange={setPeriod}
              className="w-full sm:w-[220px]"
            />
          }
        />
      </motion.div>

      <RegionRail data-panel="region-rail" />

      {/* ------------------------------------------------------------- */}
      {/*  Active region                                                 */}
      {/* ------------------------------------------------------------- */}
      <motion.div data-panel="summary"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.06, ease: EASE }}
        className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-shell-border bg-shell-border lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
      >
        <div className="assessment-identity bg-navy-800 p-5">
          <ScoreOrbit score={selectedRegion.illustrativeRiskScore} category={selectedRegion.riskCategory} />
          <p className="overline">Active sample region</p>
          <h2 className="mt-1.5 text-[18px] font-bold leading-tight tracking-tight text-shell-text">
            {selectedRegion.name}
          </h2>
          <p className="mt-0.5 text-[11.5px] text-shell-muted">{selectedRegion.district}</p>
          <div className="mt-3">
            <RiskBandIndicator
              category={selectedRegion.riskCategory}
              score={selectedRegion.illustrativeRiskScore}
            />
          </div>
          <p className="mt-3.5 text-[12px] leading-relaxed text-shell-muted">
            {PERIOD_LABELS[period]} · {selectedRegion.monitoringPointCount} illustrative monitoring
            points
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px bg-shell-border lg:grid-cols-4">
          <MetricCell>
            <MetricIndicator
              label="Cumulative rain"
              value={rainValue(stats.cumulativeRainfall, units)}
              unit={rainUnit(units)}
              accent="glacier"
              context="Sum of the displayed samples"
            />
          </MetricCell>
          <MetricCell>
            <MetricIndicator
              label="Mean level"
              value={levelValue(stats.meanWaterLevel, units)}
              unit={levelUnit(units)}
              accent="teal"
              context="Arithmetic mean of the series"
            />
          </MetricCell>
          <MetricCell>
            <MetricIndicator
              label="Peak rain"
              value={rainValue(stats.peakRainfall, units)}
              unit={rainUnit(units)}
              accent="glacier"
              context="Highest displayed value"
            />
          </MetricCell>
          <MetricCell>
            <MetricIndicator
              label="Peak level"
              value={levelValue(stats.peakWaterLevel, units)}
              unit={levelUnit(units)}
              accent="teal"
              context="Highest displayed value"
            />
          </MetricCell>
        </div>
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/*  Sample series                                                 */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="series"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
        className="space-y-4"
      >
        <SectionHeading
          eyebrow="Section 01"
          title="The sample series"
          description={`Authored sample points for ${selectedRegion.name}, scaled by this region's factor.`}
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartContainer
            title="Sample rainfall"
            subtitle={`${PERIOD_LABELS[period]} · ${rainUnit(units)} per sample`}
            eyebrow="Rainfall"
          >
            <RainfallChart region={selectedRegion} period={period} height={280} />
          </ChartContainer>
          <ChartContainer
            title="Sample water level"
            subtitle={`${PERIOD_LABELS[period]} · ${levelUnit(units)} on the illustrative gauge`}
            eyebrow="Water level"
          >
            <WaterLevelChart region={selectedRegion} period={period} height={280} />
          </ChartContainer>
        </div>
      </motion.section>

      {/* ------------------------------------------------------------- */}
      {/*  Score composition                                             */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="blend"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
        className="space-y-4"
      >
        <SectionHeading
          eyebrow="Section 02"
          title="An illustrative trend comparison"
          description="This curve blends the two sample series. It is separate from the authored regional score shown above. Dashed lines are demonstration bands."
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <ChartContainer
            title="Synthetic blend index"
            subtitle={`${selectedRegion.name} · ${PERIOD_LABELS[period]}`}
            footnote="The score is a fixed 55/45 blend of the scaled sample rainfall and water-level series. It is a presentation device for the prototype — not a hydrological model, not calibrated against any observed event, and never to be read as a forecast."
          >
            <RiskTrendChart region={selectedRegion} period={period} height={320} />
          </ChartContainer>

          <div className="space-y-4">
            <Surface className="p-5">
              <p className="overline mb-1.5">Contributing factors</p>
              <h3 className="text-[14.5px] font-semibold text-shell-text">
                What shapes this curve
              </h3>
              <ul className="mt-4 space-y-3">
                <Factor
                  icon={<CloudRain className="h-4 w-4" aria-hidden="true" />}
                  title="Sample rainfall"
                  weight="55% of the blend"
                  value={`${rainValue(stats.meanRainfall, units)} ${rainUnit(units)} mean`}
                  accent="glacier"
                />
                <Factor
                  icon={<Droplets className="h-4 w-4" aria-hidden="true" />}
                  title="Sample water level"
                  weight="45% of the blend"
                  value={`${levelValue(stats.meanWaterLevel, units)} ${levelUnit(units)} mean`}
                  accent="teal"
                />
                <Factor
                  icon={<TrendingUp className="h-4 w-4" aria-hidden="true" />}
                  title="Sample trend"
                  weight="Authored label"
                  value={`${TREND_LABELS[selectedRegion.sampleTrend]} (${selectedRegion.sampleTrendDelta > 0 ? '+' : ''}${selectedRegion.sampleTrendDelta})`}
                  accent="amber"
                />
              </ul>
              <p className="mt-4 flex items-start gap-2 border-t border-shell-border/70 pt-3.5 text-[11px] leading-relaxed text-shell-faint">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                The band label follows the illustrative score directly:{' '}
                {bandMeta.scoreRange} is {bandMeta.label.toLowerCase()}.
              </p>
            </Surface>

            <Surface className="p-5">
              <p className="overline mb-1.5">Uncertainty</p>
              <h3 className="text-[14.5px] font-semibold text-shell-text">
                What this number cannot tell you
              </h3>
              <ul className="mt-3 space-y-2.5 text-[12px] leading-relaxed text-shell-muted">
                {[
                  'It is not a probability of flooding, and it carries no lead time.',
                  'It has never been validated, back-tested or scored against an observed event.',
                  'The inputs are invented, so the output has no forecasting skill.',
                  'It cannot be compared to any official warning scale.',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-risk-moderate" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/methodology" className="btn-secondary btn-sm mt-4 w-full">
                <FileWarning className="h-3.5 w-3.5" aria-hidden="true" />
                Full methodology & limitations
              </Link>
            </Surface>
          </div>
        </div>
      </motion.section>

      {/* ------------------------------------------------------------- */}
      {/*  Cross-region comparison                                       */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="regions"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
        className="space-y-4"
      >
        <SectionHeading
          eyebrow="Section 03"
          title="Cross-region comparison"
          description="The illustrative score for every sample region. Select a bar to change the active region."
          action={
            <Link to="/risk" className="btn-ghost btn-sm">
              Open risk map
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          }
        />
        <ChartContainer
          title="Sample risk score by region"
          subtitle="Illustrative composite score (0–100) for each sample region, coloured by band."
          footnote={`Reference ${DEMO_CONFIG.referenceDateLabel} · ${DEMO_CONFIG.shortDisclaimer}`}
        >
          <RegionComparisonChart
            onSelectRegion={setSelectedRegionId}
            highlightId={selectedRegion.id}
            height={320}
          />
        </ChartContainer>
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

function Factor({
  icon,
  title,
  weight,
  value,
  accent,
}: {
  icon: React.ReactNode
  title: string
  weight: string
  value: string
  accent: 'glacier' | 'teal' | 'amber'
}) {
  const tones = {
    glacier: 'border-glacier/25 bg-glacier/10 text-glacier',
    teal: 'border-teal-bright/25 bg-teal-bright/10 text-teal-bright',
    amber: 'border-risk-moderate/25 bg-risk-moderate/10 text-risk-moderate',
  }
  return (
    <li className="flex items-start gap-3">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${tones[accent]}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-semibold text-shell-text">{title}</span>
        <span className="mt-0.5 block text-[11px] uppercase tracking-[0.1em] text-shell-faint">
          {weight}
        </span>
        <span className="mt-1 block text-[12.5px] font-semibold tabular-nums text-shell-text">
          {value}
        </span>
      </span>
    </li>
  )
}
