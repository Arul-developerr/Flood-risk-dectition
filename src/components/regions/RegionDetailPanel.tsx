/**
 * ============================================================================
 * REGION DETAIL PANEL
 * ============================================================================
 *
 * A compact panel that presents the shared demonstration indicators for the
 * currently selected sample region, and links onward to the detailed
 * analysis screens.
 *
 * The values come straight from the shared dataset — nothing is recomputed
 * or invented here.
 */

import { Link } from 'react-router-dom'
import { ArrowRight, CloudRain, Droplets, RadioTower, TrendingDown, TrendingUp, Users, Waves } from 'lucide-react'
import type { ReactNode } from 'react'
import { RISK_CATEGORIES, TREND_LABELS } from '../../data/demoData'
import { getRegionStatistics } from '../../data/selectors'
import type { Region, TrendDirection } from '../../types'
import { levelUnit, levelValue, rainUnit, rainValue } from '../../utils/measurements'
import { cn } from '../../utils/cn'
import { useLocale } from '../../app/LocaleContext'
import { RiskBandIndicator } from '../ui/primitives'

const TREND_ICONS: Record<TrendDirection, typeof TrendingUp> = {
  rising: TrendingUp,
  steady: Waves,
  falling: TrendingDown,
}

export function RegionDetailPanel({
  region,
  units,
  actions,
  className,
  compact = false,
}: {
  region: Region
  units: 'metric' | 'imperial'
  actions?: ReactNode
  className?: string
  compact?: boolean
}) {
  const { t, regionName } = useLocale()
  const meta = RISK_CATEGORIES[region.riskCategory]
  const stats = getRegionStatistics(region, '7d')
  const TrendIcon = TREND_ICONS[region.sampleTrend]

  const rows = [
    {
      label: 'Sample 24h rainfall',
      value: `${rainValue(region.sampleRainfall, units)} ${rainUnit(units)}`,
      icon: <CloudRain className="h-3.5 w-3.5" aria-hidden="true" />,
    },
    {
      label: 'Sample water level',
      value: `${levelValue(region.sampleWaterLevel, units)} ${levelUnit(units)}`,
      icon: <Droplets className="h-3.5 w-3.5" aria-hidden="true" />,
    },
    {
      label: 'Illustrative score',
      value: `${region.illustrativeRiskScore} / 100`,
      icon: <RadioTower className="h-3.5 w-3.5" aria-hidden="true" />,
    },
    {
      label: 'Sample trend',
      value: `${TREND_LABELS[region.sampleTrend]} (${region.sampleTrendDelta > 0 ? '+' : ''}${region.sampleTrendDelta})`,
      icon: <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />,
    },
  ]

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="overline">{t('Selected district', 'தேர்ந்தெடுத்த மாவட்டம்')}</p>
          <h3 className="mt-1.5 truncate text-[17px] font-bold leading-tight tracking-tight text-shell-text">
            {regionName(region)}
          </h3>
          <p className="mt-0.5 text-[11.5px] text-shell-muted">{region.district}</p>
        </div>
        <RiskBandIndicator category={region.riskCategory} size="sm" />
      </div>

      <p className="mt-3 text-[12.5px] leading-relaxed text-shell-muted">{region.description}</p>

      {/* Score bar */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-shell-faint">
            Illustrative score
          </span>
          <span className="text-[13px] font-bold tabular-nums text-shell-text">
            {region.illustrativeRiskScore}
            <span className="text-[11px] font-medium text-shell-faint"> / 100</span>
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy-600">
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out-expo"
            style={{ width: `${region.illustrativeRiskScore}%`, backgroundColor: meta.color }}
          />
        </div>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-shell-faint">{meta.description}</p>
      </div>

      {/* Indicator rows */}
      <dl className="mt-4 grid grid-cols-2 gap-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-xl border border-shell-border bg-navy-900/60 px-2.5 py-2"
          >
            <dt className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.11em] text-shell-faint">
              {row.icon}
              <span className="leading-relaxed">{row.label}</span>
            </dt>
            <dd className="mt-1 text-[13px] font-semibold tabular-nums text-shell-text">{row.value}</dd>
          </div>
        ))}
      </dl>

      {!compact ? (
        <div className="mt-4 space-y-2 border-t border-shell-border/70 pt-4">
          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-shell-faint">
            <Users className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
            <span>
              {region.monitoringPointCount} illustrative monitoring points · {region.populationBand}
            </span>
          </p>
          <p className="text-[11px] leading-relaxed text-shell-faint">
            7-day sample accumulation {rainValue(stats.cumulativeRainfall, units)} {rainUnit(units)} ·
            peak sample level {levelValue(stats.peakWaterLevel, units)} {levelUnit(units)}
          </p>
        </div>
      ) : null}

      {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

/** Standard set of onward links used beneath the region detail panel. */
export function RegionDetailActions({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Link to="/prediction" className="btn-primary btn-sm">
        Analyse this region
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
      <Link to="/methodology" className="btn-ghost btn-sm">
        How scoring works
      </Link>
    </div>
  )
}
