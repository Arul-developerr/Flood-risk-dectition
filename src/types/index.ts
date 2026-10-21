/**
 * Central type definitions for the Smart Flood Risk Prediction & Alert System.
 *
 * Every value represented by these models is SYNTHETIC demonstration data.
 * Nothing in this file corresponds to a real observation, prediction or warning.
 */

export type RiskCategory = 'low' | 'moderate' | 'high' | 'very-high'

export type RiskLevel = 'low' | 'moderate' | 'high' | 'very-high'

export type TrendDirection = 'rising' | 'steady' | 'falling'

export type Severity = 'info' | 'low' | 'moderate' | 'high' | 'critical'

export type AlertCategory =
  | 'water-level'
  | 'rainfall'
  | 'drainage'
  | 'flash-flood'
  | 'infrastructure'

export type AlertStatus = 'demo' | 'acknowledged' | 'dismissed'

export type ReportCategory =
  | 'waterlogging'
  | 'blocked-drainage'
  | 'heavy-rainfall'
  | 'road-accumulation'
  | 'other'

export type ReportStatus = 'unreviewed' | 'reviewing' | 'resolved'

export interface Region {
  id: string
  name: string
  tamilName: string
  displayLabel: string
  district: string
  illustrativeRiskScore: number
  riskCategory: RiskCategory
  sampleRainfall: number
  sampleRainfallUnit: string
  sampleWaterLevel: number
  sampleWaterLevelUnit: string
  sampleTrend: TrendDirection
  sampleTrendDelta: number
  dataSourceLabel: string
  /** Illustrative position on the stylised SVG map (0-100 space). */
  mapX: number
  mapY: number
  monitoringPointCount: number
  populationBand: string
  description: string
  /** Multiplier applied to the shared synthetic rainfall series. */
  rainfallFactor: number
  /** Multiplier applied to the shared synthetic water-level series. */
  waterLevelFactor: number
}

export interface DemoAlert {
  id: string
  title: string
  regionId: string
  severity: Severity
  category: AlertCategory
  timestamp: string
  description: string
  status: AlertStatus
  isSynthetic: true
  sourceLabel: string
  rainfallMm: number
  waterLevelM: number
  guidance: string
}

export interface CommunityReport {
  id: string
  category: ReportCategory
  regionId: string
  description: string
  timestamp: string
  status: ReportStatus
  isSynthetic: boolean
  reporterLabel: string
  attachmentName?: string
  isUserSubmitted?: boolean
}

export interface RainfallSample {
  timestamp: string
  label: string
  value: number
  unit: string
  isSynthetic: true
}

export interface WaterLevelSample {
  timestamp: string
  label: string
  value: number
  unit: string
  isSynthetic: true
}

export interface RiskTrendSample {
  label: string
  score: number
  rainfall: number
  waterLevel: number
}

export interface ResourceItem {
  id: string
  name: string
  category: ResourceCategory
  regionId: string
  addressLabel: string
  description: string
  openingHoursLabel: string
  contactLabel: string
  capacityLabel: string
  availability: 'sample-available' | 'sample-unknown' | 'sample-closed'
  isSynthetic: true
  externalUrl?: string
  externalLabel?: string
}

export type ResourceCategory =
  | 'shelter'
  | 'supplies'
  | 'official-info'
  | 'health'
  | 'preparedness'
  | 'recovery'

export interface ChecklistItem {
  id: string
  label: string
  description: string
}

export interface ChecklistSection {
  id: string
  title: string
  summary: string
  items: ChecklistItem[]
}

export interface Preferences {
  appearance: 'dark' | 'light'
  defaultRegionId: string
  units: 'metric' | 'imperial'
  density: 'comfortable' | 'compact'
  reducedMotion: boolean
}

export interface ToastMessage {
  id: string
  title: string
  message: string
  tone: 'success' | 'info' | 'warning'
}
