/**
 * ============================================================================
 * TAMIL NADU SAMPLE DATA — SELECTORS
 * ============================================================================
 *
 * Pure derivations over the shared demonstration dataset.
 *
 * Every metric the interface shows is computed here so that no business
 * calculation leaks into a visual component, and so the map, tables,
 * charts and indicator tiles can never disagree with one another.
 *
 * ⚠️ All inputs are SYNTHETIC sample records.
 */

import {
  DEMO_ALERTS,
  REGIONS,
  RISK_CATEGORY_ORDER,
  getCumulativeRainfall,
  getMeanRainfall,
  getMeanWaterLevel,
  getPeakRainfall,
  getPeakWaterLevel,
  getWaterLevelSeries,
  type TimePeriod,
} from '../data/demoData'
import type { AlertStatus, Region, RiskCategory } from '../types'

/**
 * Re-exported so analytical screens can pull the raw series and the derived
 * helpers from a single module.
 */
export { getRainfallSeries, getWaterLevelSeries } from './timeSeries'

/* -------------------------------------------------------------------------- */
/*  Basin-level indicators                                                     */
/* -------------------------------------------------------------------------- */

export interface BasinIndicators {
  /** Number of sample regions in the elevated (high / very-high) bands. */
  elevatedRegions: number
  /** Number of sample regions in the low band. */
  lowRiskRegions: number
  /** Sum of the derived per-region sample 24-hour rainfall totals. */
  totalRainfall: number
  /** Region with the highest derived sample rainfall total. */
  wettestRegion: Region
  /** Region with the highest derived sample water level. */
  highestLevelRegion: Region
  /** Highest derived sample water level across the basin, in metres. */
  highestWaterLevel: number
  /** Total number of illustrative monitoring points. */
  monitoringPoints: number
  /** Number of sample alert records. */
  alertCount: number
  /** Mean of the sample rainfall series, in millimetres. */
  meanRainfall: number
  /** Peak of the sample rainfall series, in millimetres. */
  peakRainfall: number
  /** Mean of the sample water-level series, in metres. */
  meanWaterLevel: number
  /** Peak of the sample water-level series, in metres. */
  peakWaterLevel: number
}

export function getBasinIndicators(period: TimePeriod = '7d'): BasinIndicators {
  const totalRainfall = REGIONS.reduce((sum, region) => sum + region.sampleRainfall, 0)
  const wettestRegion = REGIONS.reduce((max, region) =>
    region.sampleRainfall > max.sampleRainfall ? region : max,
  )
  const highestLevelRegion = REGIONS.reduce((max, region) =>
    region.sampleWaterLevel > max.sampleWaterLevel ? region : max,
  )
  const monitoringPoints = REGIONS.reduce(
    (sum, region) => sum + region.monitoringPointCount,
    0,
  )

  return {
    elevatedRegions: REGIONS.filter(
      (region) => region.riskCategory === 'high' || region.riskCategory === 'very-high',
    ).length,
    lowRiskRegions: REGIONS.filter((region) => region.riskCategory === 'low').length,
    totalRainfall: Math.round(totalRainfall),
    wettestRegion,
    highestLevelRegion,
    highestWaterLevel: highestLevelRegion.sampleWaterLevel,
    monitoringPoints,
    alertCount: DEMO_ALERTS.length,
    meanRainfall: getMeanRainfall(period),
    peakRainfall: getPeakRainfall(period),
    meanWaterLevel: getMeanWaterLevel(period),
    peakWaterLevel: getPeakWaterLevel(period),
  }
}

/* -------------------------------------------------------------------------- */
/*  Region statistics                                                          */
/* -------------------------------------------------------------------------- */

export interface RegionStatistics {
  /** Cumulative sample rainfall over the period, in millimetres. */
  cumulativeRainfall: number
  /** Mean sample rainfall over the period, in millimetres. */
  meanRainfall: number
  /** Peak sample rainfall over the period, in millimetres. */
  peakRainfall: number
  /** Cumulative sample water-level change over the period, in metres. */
  waterLevelChange: number
  /** Minimum sample water level over the period, in metres. */
  minWaterLevel: number
  /** Mean sample water level over the period, in metres. */
  meanWaterLevel: number
  /** Peak sample water level over the period, in metres. */
  peakWaterLevel: number
  /** First sample point in the period. */
  firstTimestamp: string
  /** Last sample point in the period. */
  lastTimestamp: string
}

export function getRegionStatistics(region: Region, period: TimePeriod): RegionStatistics {
  const levelSeries = getWaterLevelSeries(period, region.waterLevelFactor)
  const first = levelSeries[0]?.value ?? 0
  const last = levelSeries[levelSeries.length - 1]?.value ?? 0

  return {
    cumulativeRainfall: getCumulativeRainfall(period, region.rainfallFactor),
    meanRainfall: getMeanRainfall(period, region.rainfallFactor),
    peakRainfall: getPeakRainfall(period, region.rainfallFactor),
    waterLevelChange: Math.round((last - first) * 100) / 100,
    minWaterLevel: Math.min(...levelSeries.map((point) => point.value)),
    meanWaterLevel: getMeanWaterLevel(period, region.waterLevelFactor),
    peakWaterLevel: getPeakWaterLevel(period, region.waterLevelFactor),
    firstTimestamp: levelSeries[0]?.timestamp ?? '',
    lastTimestamp: levelSeries[levelSeries.length - 1]?.timestamp ?? '',
  }
}

/* -------------------------------------------------------------------------- */
/*  Risk band distribution                                                     */
/* -------------------------------------------------------------------------- */

export interface BandShare {
  category: RiskCategory
  count: number
  share: number
  regions: Region[]
}

export function getBandDistribution(regions: Region[] = REGIONS): BandShare[] {
  return RISK_CATEGORY_ORDER.map((category) => {
    const matching = regions.filter((region) => region.riskCategory === category)
    return {
      category,
      count: matching.length,
      share: regions.length > 0 ? matching.length / regions.length : 0,
      regions: matching,
    }
  })
}

/* -------------------------------------------------------------------------- */
/*  Alerts                                                                     */
/* -------------------------------------------------------------------------- */

export interface AlertSummary {
  total: number
  acknowledged: number
  dismissed: number
  active: number
  bySeverity: Record<string, number>
}

export function getAlertSummary(
  statuses: Record<string, AlertStatus>,
): AlertSummary {
  const bySeverity: Record<string, number> = {}
  let acknowledged = 0
  let dismissed = 0

  for (const alert of DEMO_ALERTS) {
    bySeverity[alert.severity] = (bySeverity[alert.severity] ?? 0) + 1
    const status = statuses[alert.id] ?? alert.status
    if (status === 'acknowledged') acknowledged += 1
    if (status === 'dismissed') dismissed += 1
  }

  return {
    total: DEMO_ALERTS.length,
    acknowledged,
    dismissed,
    active: DEMO_ALERTS.length - dismissed,
    bySeverity,
  }
}

/** Sample alerts that have not been dismissed locally, newest first. */
export function getActiveAlerts(statuses: Record<string, AlertStatus>) {
  return DEMO_ALERTS.filter((alert) => (statuses[alert.id] ?? alert.status) !== 'dismissed').sort(
    (a, b) => b.timestamp.localeCompare(a.timestamp),
  )
}
