/**
 * Real Tamil Nadu district names with synthetic demonstration readings.
 *
 * ⚠️ District names are real; marker locations are approximate. Scores and readings are invented.
 * `rainfallFactor` / `waterLevelFactor` scale the shared synthetic time series
 * so that every chart, table and map marker stays consistent with one another.
 *
 * The per-region rainfall and water-level readings are DERIVED from the shared
 * synthetic series in `timeSeries.ts` (never hand-typed), and the risk band is
 * derived from the illustrative score, so the map, charts and tables always
 * agree with one another.
 */

import type { Region } from '../types'
import { riskCategoryForScore } from './riskCategories'
import { rawRainfall24h, rawWaterLevelNow } from './timeSeries'

/**
 * Authoring shape for a sample region.
 *
 * The risk band and the rainfall / water-level readings are DERIVED from the
 * illustrative score and the shared synthetic series, so they are never typed
 * in by hand and can never drift out of sync.
 */
type RegionSeed = Omit<
  Region,
  'riskCategory' | 'sampleRainfall' | 'sampleWaterLevel' | 'displayLabel' | 'dataSourceLabel'
>

const REGION_SEEDS: RegionSeed[] = [
  { id: 'r-northgate', name: 'Chennai', tamilName: 'சென்னை', district: 'Chennai district', illustrativeRiskScore: 72, sampleRainfallUnit: 'mm / 24h', sampleWaterLevelUnit: 'm (sample gauge)', sampleTrend: 'rising', sampleTrendDelta: 18, mapX: 98.110, mapY: 8.349, monitoringPointCount: 6, populationBand: 'Demonstration sample', description: 'Coastal metropolitan sample. The readings and score are invented for this demonstration.', rainfallFactor: 2.1, waterLevelFactor: 1.05 },
  { id: 'r-riverside', name: 'Cuddalore', tamilName: 'கடலூர்', district: 'Cuddalore district', illustrativeRiskScore: 88, sampleRainfallUnit: 'mm / 24h', sampleWaterLevelUnit: 'm (sample gauge)', sampleTrend: 'rising', sampleTrendDelta: 26, mapX: 85.966, mapY: 32.709, monitoringPointCount: 9, populationBand: 'Demonstration sample', description: 'Coastal district sample with a high authored demonstration score.', rainfallFactor: 2.6, waterLevelFactor: 1.12 },
  { id: 'r-harbour', name: 'Nagapattinam', tamilName: 'நாகப்பட்டினம்', district: 'Nagapattinam district', illustrativeRiskScore: 54, sampleRainfallUnit: 'mm / 24h', sampleWaterLevelUnit: 'm (sample gauge)', sampleTrend: 'steady', sampleTrendDelta: 4, mapX: 87.666, mapY: 50.658, monitoringPointCount: 4, populationBand: 'Demonstration sample', description: 'Delta coast sample. No live rain gauge or flood model is connected.', rainfallFactor: 1.35, waterLevelFactor: 0.95 },
  { id: 'r-hillside', name: 'Nilgiris', tamilName: 'நீலகிரி', district: 'Nilgiris district', illustrativeRiskScore: 21, sampleRainfallUnit: 'mm / 24h', sampleWaterLevelUnit: 'm (sample gauge)', sampleTrend: 'falling', sampleTrendDelta: 9, mapX: 11.403, mapY: 38.936, monitoringPointCount: 3, populationBand: 'Demonstration sample', description: 'Hill district sample with a low authored demonstration score.', rainfallFactor: 0.45, waterLevelFactor: 0.72 },
  { id: 'r-central', name: 'Coimbatore', tamilName: 'கோயம்புத்தூர்', district: 'Coimbatore district', illustrativeRiskScore: 77, sampleRainfallUnit: 'mm / 24h', sampleWaterLevelUnit: 'm (sample gauge)', sampleTrend: 'rising', sampleTrendDelta: 12, mapX: 17.717, mapY: 46.079, monitoringPointCount: 11, populationBand: 'Demonstration sample', description: 'Western Tamil Nadu sample with fictional monitoring readings.', rainfallFactor: 1.9, waterLevelFactor: 1.0 },
  { id: 'r-southgate', name: 'Thanjavur', tamilName: 'தஞ்சாவூர்', district: 'Thanjavur district', illustrativeRiskScore: 46, sampleRainfallUnit: 'mm / 24h', sampleWaterLevelUnit: 'm (sample gauge)', sampleTrend: 'steady', sampleTrendDelta: 2, mapX: 70.665, mapY: 50.475, monitoringPointCount: 5, populationBand: 'Demonstration sample', description: 'Cauvery delta district sample. The chart values are synthetic.', rainfallFactor: 1.15, waterLevelFactor: 0.88 },
  { id: 'r-westbrook', name: 'Tiruchirappalli', tamilName: 'திருச்சிராப்பள்ளி', district: 'Tiruchirappalli district', illustrativeRiskScore: 29, sampleRainfallUnit: 'mm / 24h', sampleWaterLevelUnit: 'm (sample gauge)', sampleTrend: 'falling', sampleTrendDelta: 6, mapX: 59.978, mapY: 50.292, monitoringPointCount: 3, populationBand: 'Demonstration sample', description: 'Central Tamil Nadu sample with invented indicator values.', rainfallFactor: 0.6, waterLevelFactor: 0.78 },
  { id: 'r-oldmill', name: 'Madurai', tamilName: 'மதுரை', district: 'Madurai district', illustrativeRiskScore: 83, sampleRainfallUnit: 'mm / 24h', sampleWaterLevelUnit: 'm (sample gauge)', sampleTrend: 'rising', sampleTrendDelta: 21, mapX: 45.891, mapY: 66.226, monitoringPointCount: 7, populationBand: 'Demonstration sample', description: 'Southern urban sample with a high authored demonstration score.', rainfallFactor: 2.35, waterLevelFactor: 1.08 },
  { id: 'r-creek', name: 'Tirunelveli', tamilName: 'திருநெல்வேலி', district: 'Tirunelveli district', illustrativeRiskScore: 63, sampleRainfallUnit: 'mm / 24h', sampleWaterLevelUnit: 'm (sample gauge)', sampleTrend: 'rising', sampleTrendDelta: 11, mapX: 35.690, mapY: 88.022, monitoringPointCount: 4, populationBand: 'Demonstration sample', description: 'Southern district sample with fictional rainfall and river readings.', rainfallFactor: 1.6, waterLevelFactor: 1.02 },
  { id: 'r-millford', name: 'Kanniyakumari', tamilName: 'கன்னியாகுமரி', district: 'Kanniyakumari district', illustrativeRiskScore: 38, sampleRainfallUnit: 'mm / 24h', sampleWaterLevelUnit: 'm (sample gauge)', sampleTrend: 'steady', sampleTrendDelta: 3, mapX: 31.804, mapY: 99.927, monitoringPointCount: 5, populationBand: 'Demonstration sample', description: 'Southern tip sample. Its marker is approximate; all readings are synthetic.', rainfallFactor: 1.05, waterLevelFactor: 0.91 },
]

function round1(n: number): number { return Math.round(n * 10) / 10 }
function round2(n: number): number { return Math.round(n * 100) / 100 }
export const REGIONS: Region[] = REGION_SEEDS.map((seed) => ({
  ...seed,
  displayLabel: seed.name,
  riskCategory: riskCategoryForScore(seed.illustrativeRiskScore),
  sampleRainfall: round1(rawRainfall24h() * seed.rainfallFactor),
  sampleWaterLevel: round2(rawWaterLevelNow() * seed.waterLevelFactor),
  dataSourceLabel: 'Synthetic district sample',
}))
export function getRegion(regionId: string): Region { return REGIONS.find(r => r.id === regionId) ?? REGIONS[0] }
