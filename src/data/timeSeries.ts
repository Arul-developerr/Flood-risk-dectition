/**
 * Synthetic time-series generators.
 *
 * ⚠️ Every number produced here is INVENTED. The values are fixed constants so
 * that all pages render identical charts on every load — nothing is randomised
 * at runtime and no live feed is queried.
 */

import type { RainfallSample, Region, WaterLevelSample } from '../types'

export type TimePeriod = '24h' | '7d' | '30d'

export const PERIOD_LABELS: Record<TimePeriod, string> = {
  '24h': 'Last 24 hours',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
}

export const PERIOD_SHORT_LABELS: Record<TimePeriod, string> = {
  '24h': '24h',
  '7d': '7d',
  '30d': '30d',
}

/** 30 sample daily rainfall totals in mm. */
const BASE_DAILY_RAINFALL = [
  12, 18, 8, 5, 22, 34, 41, 28, 16, 9, 14, 26, 38, 52, 47, 31, 19, 12, 8, 15, 27, 44, 61, 73, 58, 39,
  25, 17, 11, 24,
]

/** 24 sample hourly rainfall values in mm (sums to 45.3 mm). */
const BASE_HOURLY_RAINFALL = [
  0, 0, 0, 0, 0.2, 0.6, 1.4, 2.8, 3.2, 2.1, 0.9, 0.4, 0.2, 0, 0, 0.3, 1.1, 3.6, 6.2, 8.4, 7.1,
  4.2, 2.0, 0.6,
]

/** 30 sample daily water-level readings in metres on the illustrative gauge. */
const BASE_DAILY_WATER_LEVEL = [
  1.1, 1.2, 1.15, 1.3, 1.45, 1.7, 1.9, 1.75, 1.6, 1.5, 1.55, 1.75, 2.0, 2.35, 2.5, 2.3, 2.1, 1.95,
  1.85, 1.9, 2.05, 2.4, 2.75, 3.1, 3.0, 2.8, 2.55, 2.3, 2.1, 2.35,
]

/** 24 sample hourly water-level readings in metres on the illustrative gauge. */
const BASE_HOURLY_WATER_LEVEL = [
  2.1, 2.06, 2.02, 2.0, 2.04, 2.12, 2.24, 2.42, 2.58, 2.7, 2.78, 2.84, 2.88, 2.9, 2.92, 2.95, 2.99,
  3.04, 3.09, 3.12, 3.08, 3.02, 2.98, 2.95,
]

// Twenty-four hourly sample endpoints ending at the fixed 12 Jun, 09:30 snapshot.
const HOUR_LABELS = Array.from({ length: 24 }, (_, index) => `${String((index + 10) % 24).padStart(2, '0')}:30`)
const hourlyTimestamp = (index: number) => `2025-06-${index < 14 ? '11' : '12'}T${HOUR_LABELS[index]}:00`

const DAY_LABELS_30 = [
  '14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May', '21 May', '22 May', '23 May',
  '24 May', '25 May', '26 May', '27 May', '28 May', '29 May', '30 May', '31 May', '01 Jun', '02 Jun',
  '03 Jun', '04 Jun', '05 Jun', '06 Jun', '07 Jun', '08 Jun', '09 Jun', '10 Jun', '11 Jun', '12 Jun',
]

const DAY_LABELS_7 = ['06 Jun', '07 Jun', '08 Jun', '09 Jun', '10 Jun', '11 Jun', '12 Jun']

const DAY_NUM_30 = [
  '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
  '31', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
]

const MONTH_NUM_30 = [
  '05', '05', '05', '05', '05', '05', '05', '05', '05', '05', '05', '05', '05', '05', '05', '05', '05',
  '05', '06', '06', '06', '06', '06', '06', '06', '06', '06', '06', '06', '06',
]

export function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/** Unscaled 24-hour rainfall total in mm (the shared sample baseline). */
export function rawRainfall24h(): number {
  return BASE_HOURLY_RAINFALL.reduce((a, b) => a + b, 0)
}

/** Unscaled latest water-level reading in metres (the shared sample baseline). */
export function rawWaterLevelNow(): number {
  return BASE_HOURLY_WATER_LEVEL[BASE_HOURLY_WATER_LEVEL.length - 1]
}

/** Region-specific 24h rainfall total in mm, derived from the shared hourly series. */
export function getRegionRainfall24h(region: Region): number {
  return round1(rawRainfall24h() * region.rainfallFactor)
}

/** Region-specific current water level in m, derived from the shared hourly series. */
export function getRegionWaterLevel(region: Region): number {
  return round2(rawWaterLevelNow() * region.waterLevelFactor)
}

/** Basins-wide rainfall series for the selected period (millimetres). */
export function getRainfallSeries(period: TimePeriod, factor = 1): RainfallSample[] {
  if (period === '24h') {
    return BASE_HOURLY_RAINFALL.map((value, i) => ({
      timestamp: hourlyTimestamp(i),
      label: HOUR_LABELS[i],
      value: round1(value * factor),
      unit: 'mm',
      isSynthetic: true,
    }))
  }
  if (period === '7d') {
    const slice = BASE_DAILY_RAINFALL.slice(-7)
    return slice.map((value, i) => ({
      timestamp: `2025-06-${DAY_NUM_30[23 + i]}T06:00`,
      label: DAY_LABELS_7[i],
      value: round1(value * factor),
      unit: 'mm',
      isSynthetic: true,
    }))
  }
  return BASE_DAILY_RAINFALL.map((value, i) => ({
    timestamp: `2025-${MONTH_NUM_30[i]}-${DAY_NUM_30[i]}T06:00`,
    label: DAY_LABELS_30[i],
    value: round1(value * factor),
    unit: 'mm',
    isSynthetic: true,
  }))
}

/** Basins-wide water-level series for the selected period (metres). */
export function getWaterLevelSeries(period: TimePeriod, factor = 1): WaterLevelSample[] {
  if (period === '24h') {
    return BASE_HOURLY_WATER_LEVEL.map((value, i) => ({
      timestamp: hourlyTimestamp(i),
      label: HOUR_LABELS[i],
      value: round2(value * factor),
      unit: 'm',
      isSynthetic: true,
    }))
  }
  if (period === '7d') {
    const slice = BASE_DAILY_WATER_LEVEL.slice(-7)
    return slice.map((value, i) => ({
      timestamp: `2025-06-${DAY_NUM_30[23 + i]}T06:00`,
      label: DAY_LABELS_7[i],
      value: round2(value * factor),
      unit: 'm',
      isSynthetic: true,
    }))
  }
  return BASE_DAILY_WATER_LEVEL.map((value, i) => ({
    timestamp: `2025-${MONTH_NUM_30[i]}-${DAY_NUM_30[i]}T06:00`,
    label: DAY_LABELS_30[i],
    value: round2(value * factor),
    unit: 'm',
    isSynthetic: true,
  }))
}

/** Cumulative sample rainfall for a period, in mm. */
export function getCumulativeRainfall(period: TimePeriod, factor = 1): number {
  return round1(getRainfallSeries(period, factor).reduce((sum, s) => sum + s.value, 0))
}

/** Mean sample rainfall per point, in mm. */
export function getMeanRainfall(period: TimePeriod, factor = 1): number {
  const series = getRainfallSeries(period, factor)
  return round1(series.reduce((sum, s) => sum + s.value, 0) / series.length)
}

/** Peak sample rainfall within a period, in mm. */
export function getPeakRainfall(period: TimePeriod, factor = 1): number {
  return round1(Math.max(...getRainfallSeries(period, factor).map((s) => s.value)))
}

/** Maximum sample water level within a period, in metres. */
export function getPeakWaterLevel(period: TimePeriod, factor = 1): number {
  return round2(Math.max(...getWaterLevelSeries(period, factor).map((s) => s.value)))
}

/** Minimum sample water level within a period, in metres. */
export function getMinWaterLevel(period: TimePeriod, factor = 1): number {
  return round2(Math.min(...getWaterLevelSeries(period, factor).map((s) => s.value)))
}

/** Mean sample water level within a period, in metres. */
export function getMeanWaterLevel(period: TimePeriod, factor = 1): number {
  const series = getWaterLevelSeries(period, factor)
  return round2(series.reduce((sum, s) => sum + s.value, 0) / series.length)
}

export interface RiskTrendPoint {
  label: string
  score: number
  rainfall: number
  waterLevel: number
}

/**
 * Illustrative risk trend across the selected period.
 * The score is a simple illustrative blend of the two synthetic series —
 * it is NOT a validated model and NOT a prediction.
 */
export function getRegionRiskTrend(region: Region, period: TimePeriod): RiskTrendPoint[] {
  const rain = getRainfallSeries(period, region.rainfallFactor)
  const water = getWaterLevelSeries(period, region.waterLevelFactor)
  const count = Math.min(rain.length, water.length)
  const step = count > 20 ? Math.ceil(count / 12) : 1
  const out: RiskTrendPoint[] = []
  for (let i = 0; i < count; i += step) {
    const r = rain[i].value
    const w = water[i].value
    const score = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          0.55 * Math.min((r / 165) * 100, 100) + 0.45 * Math.min(((w - 1) / 2.4) * 100, 100),
        ),
      ),
    )
    out.push({ label: rain[i].label, score, rainfall: r, waterLevel: w })
  }
  return out
}
