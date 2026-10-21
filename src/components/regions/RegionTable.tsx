/**
 * ============================================================================
 * REGION TABLE
 * ============================================================================
 *
 * A tabular view of the sample regions, shared by the risk map and the
 * analysis screens so both always agree.
 */

import { RISK_CATEGORIES, TREND_LABELS } from '../../data/demoData'
import type { Region } from '../../types'
import { RiskBandIndicator } from '../ui/primitives'
import { useApp } from '../../app/AppContext'
import { useLocale } from '../../app/LocaleContext'
import { levelUnit, levelValue, rainUnit, rainValue } from '../../utils/measurements'
import { cn } from '../../utils/cn'

/**
 * Tabular view of the sample regions.
 *
 * On narrow screens the table becomes a stack of cards so no column is ever
 * cut off and no horizontal scroll is required.
 */
export function RegionTable({
  regions,
  selectedRegionId,
  onSelectRegion,
}: {
  regions: Region[]
  selectedRegionId: string
  onSelectRegion: (id: string) => void
}) {
  const { preferences } = useApp()
  const { t, ui, regionName } = useLocale()

  return (
    <>
      {/* ---------------------------------------------------------- */}
      {/*  Wide layout - a real table                                   */}
      {/* ---------------------------------------------------------- */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-shell-border text-[10.5px] uppercase tracking-[0.12em] text-shell-faint">
              <th scope="col" className="px-5 py-3 font-semibold">
                {t('District', 'மாவட்டம்')}
              </th>
              <th scope="col" className="px-3 py-3 font-semibold">
                {t('Band', 'இடர் நிலை')}
              </th>
              <th scope="col" className="px-3 py-3 text-right font-semibold">
                {t('Score', 'மதிப்பெண்')}
              </th>
              <th scope="col" className="px-3 py-3 text-right font-semibold">
                {t('24h rain', '24 மணி மழை')}
              </th>
              <th scope="col" className="px-3 py-3 text-right font-semibold">
                {t('Water level', 'நீர்மட்டம்')}
              </th>
              <th scope="col" className="px-3 py-3 font-semibold">
                {t('Trend', 'போக்கு')}
              </th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => {
              const isActive = region.id === selectedRegionId
              return (
                <tr
                  key={region.id}
                  className={cn(
                    'border-b border-shell-border/60 transition-colors last:border-0',
                    isActive ? 'bg-cyan/[0.07]' : 'hover:bg-navy-700/50',
                  )}
                >
                  <th scope="row" className="px-5 py-3 text-left font-normal">
                    <button
                      type="button"
                      onClick={() => onSelectRegion(region.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className="text-left text-[13px] font-semibold text-shell-text underline-offset-4 hover:text-cyan hover:underline"
                    >
                      {regionName(region)}
                    </button>
                    <span className="mt-0.5 block text-[11px] text-shell-faint">
                      {region.district}
                    </span>
                  </th>
                  <td className="px-3 py-3">
                    <RiskBandIndicator category={region.riskCategory} size="sm" />
                  </td>
                  <td className="px-3 py-3 text-right text-[13px] font-semibold tabular-nums text-shell-text">
                    {region.illustrativeRiskScore}
                  </td>
                  <td className="px-3 py-3 text-right text-[13px] tabular-nums text-shell-muted">
                    {rainValue(region.sampleRainfall, preferences.units)} {rainUnit(preferences.units)}
                  </td>
                  <td className="px-3 py-3 text-right text-[13px] tabular-nums text-shell-muted">
                    {levelValue(region.sampleWaterLevel, preferences.units)}{' '}
                    {levelUnit(preferences.units)}
                  </td>
                  <td className="px-3 py-3 text-[12.5px] text-shell-muted">
                    {ui(TREND_LABELS[region.sampleTrend])}{' '}
                    <span className="text-[11px] tabular-nums">
                      ({region.sampleTrendDelta > 0 ? '+' : ''}
                      {region.sampleTrendDelta})
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectRegion(region.id)}
                      className="btn-ghost btn-sm"
                    >
                      {t('Select', 'தேர்வு செய்')}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  Narrow layout - stacked cards                               */}
      {/* ---------------------------------------------------------- */}
      <ul className="divide-y divide-shell-border/60 md:hidden">
        {regions.map((region) => {
          const isActive = region.id === selectedRegionId
          return (
            <li key={region.id} className={cn(isActive && 'bg-cyan/[0.07]')}>
              <button
                type="button"
                onClick={() => onSelectRegion(region.id)}
                aria-current={isActive ? 'true' : undefined}
                className="w-full px-4 py-3.5 text-left"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-semibold text-shell-text">
                      {regionName(region)}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-shell-faint">
                      {region.district}
                    </span>
                  </span>
                  <RiskBandIndicator category={region.riskCategory} size="sm" />
                </span>
                <span className="mt-2.5 grid grid-cols-3 gap-2 text-[11.5px]">
                  <span className="block">
                    <span className="block text-[9.5px] uppercase tracking-[0.1em] text-shell-faint">
                      {t('Score', 'மதிப்பெண்')}
                    </span>
                    <span className="mt-0.5 block font-semibold tabular-nums text-shell-text">
                      {region.illustrativeRiskScore}
                    </span>
                  </span>
                  <span className="block">
                    <span className="block text-[9.5px] uppercase tracking-[0.1em] text-shell-faint">
                      {t('24h rain', '24 மணி மழை')}
                    </span>
                    <span className="mt-0.5 block font-semibold tabular-nums text-shell-text">
                      {rainValue(region.sampleRainfall, preferences.units)}{' '}
                      {rainUnit(preferences.units)}
                    </span>
                  </span>
                  <span className="block">
                    <span className="block text-[9.5px] uppercase tracking-[0.1em] text-shell-faint">
                      {t('Level', 'நிலை')}
                    </span>
                    <span className="mt-0.5 block font-semibold tabular-nums text-shell-text">
                      {levelValue(region.sampleWaterLevel, preferences.units)}{' '}
                      {levelUnit(preferences.units)}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

/** Compact reference card explaining the illustrative score bands. */
export function BandReference({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ul className="space-y-2">
        {(Object.keys(RISK_CATEGORIES) as (keyof typeof RISK_CATEGORIES)[]).map((band) => {
          const meta = RISK_CATEGORIES[band]
          return (
            <li
              key={band}
              className="flex items-start justify-between gap-3 rounded-xl border border-shell-border bg-navy-900/50 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[12.5px] font-semibold text-shell-text">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: meta.color }}
                    aria-hidden="true"
                  />
                  {meta.label}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-shell-muted">
                  {meta.description}
                </p>
              </div>
              <span className="shrink-0 text-[11.5px] font-bold tabular-nums text-shell-faint">
                {meta.scoreRange}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-shell-faint">
        These bands are not calibrated thresholds and are not comparable to any official
        flood-warning scale.
      </p>
    </div>
  )
}
