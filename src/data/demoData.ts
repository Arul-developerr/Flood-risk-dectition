/**
 * ============================================================================
 * CENTRAL SYNTHETIC DEMONSTRATION DATASET
 * ============================================================================
 *
 * EVERY VALUE IN THIS FILE IS INVENTED FOR DEMONSTRATION PURPOSES.
 *
 * The Tamil Nadu state boundary and district names are real. The rainfall,
 * water-level, risk-score, alert, report and resource records are synthetic
 * samples. None of them were measured, observed, forecast, published or
 * transmitted by any sensor, authority or service.
 *
 * All data is FIXED / DETERMINISTIC so that every page, chart and table renders
 * identical values on every load. Nothing here is randomised at runtime.
 * ============================================================================
 */

import type {
  AlertCategory,
  CommunityReport,
  Preferences,
  Severity,
  TrendDirection,
} from '../types'

/* -------------------------------------------------------------------------- */
/*  DEMO CONFIGURATION                                                        */
/* -------------------------------------------------------------------------- */

export const DEMO_CONFIG = {
  projectName: 'Tamil Nadu Flood Atlas',
  descriptor: 'தமிழ்நாடு வெள்ளத் தகவல் வரைபடம்',
  basinName: 'Tamil Nadu',
  basinDescriptor: 'Real state outline with synthetic district examples',
  /** Fixed reference timestamp used across the demo so output never drifts. */
  referenceTimestamp: '2025-06-12T09:30:00',
  referenceDateLabel: '12 Jun 2025',
  disclaimer:
    'Conceptual prototype — all readings, scores, alerts and reports are simulated.',
  shortDisclaimer: 'Simulated data · Not an official warning',
} as const

/* -------------------------------------------------------------------------- */
/*  RISK CATEGORY DEFINITIONS                                                 */
/* -------------------------------------------------------------------------- */

export {
  RISK_CATEGORIES,
  RISK_CATEGORY_ORDER,
  riskCategoryForScore,
} from './riskCategories'
export type { RiskCategoryMeta } from './riskCategories'

export const SEVERITY_META: Record<
  Severity,
  { label: string; color: string; textColor: string; bgClass: string; borderClass: string }
> = {
  info: {
    label: 'Informational',
    color: '#38BDF8',
    textColor: '#7DD3FC',
    bgClass: 'bg-glacier/10',
    borderClass: 'border-glacier/35',
  },
  low: {
    label: 'Low severity',
    color: '#34D399',
    textColor: '#6EE7B7',
    bgClass: 'bg-risk-low/10',
    borderClass: 'border-risk-low/35',
  },
  moderate: {
    label: 'Moderate severity',
    color: '#F59E0B',
    textColor: '#FCD34D',
    bgClass: 'bg-risk-moderate/10',
    borderClass: 'border-risk-moderate/35',
  },
  high: {
    label: 'High severity',
    color: '#F87171',
    textColor: '#FCA5A5',
    bgClass: 'bg-risk-high/10',
    borderClass: 'border-risk-high/35',
  },
  critical: {
    label: 'Critical severity',
    color: '#F87171',
    textColor: '#FCA5A5',
    bgClass: 'bg-risk-high/15',
    borderClass: 'border-risk-high/55',
  },
}

export const SEVERITY_ORDER: Severity[] = ['info', 'low', 'moderate', 'high', 'critical']

export const ALERT_CATEGORY_LABELS: Record<AlertCategory, string> = {
  'water-level': 'Water level',
  rainfall: 'Rainfall',
  drainage: 'Drainage',
  'flash-flood': 'Flash flood',
  infrastructure: 'Infrastructure',
}

export const REPORT_CATEGORY_LABELS: Record<CommunityReport['category'], string> = {
  waterlogging: 'Waterlogging',
  'blocked-drainage': 'Blocked drainage',
  'heavy-rainfall': 'Heavy rainfall observation',
  'road-accumulation': 'Road water accumulation',
  other: 'Other flood-related observation',
}

/* -------------------------------------------------------------------------- */
/*  DEFAULT PREFERENCES & STORAGE KEYS                                        */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PREFERENCES: Preferences = {
  appearance: 'dark',
  defaultRegionId: 'r-northgate',
  units: 'metric',
  density: 'comfortable',
  reducedMotion: false,
}

export const STORAGE_KEYS = {
  preferences: 'sfr:preferences:v1',
  alertState: 'sfr:alert-state:v1',
  checklists: 'sfr:checklists:v1',
  userReports: 'sfr:user-reports:v1',
} as const

export const TREND_LABELS: Record<TrendDirection, string> = {
  rising: 'Rising',
  steady: 'Steady',
  falling: 'Falling',
}

/* -------------------------------------------------------------------------- */
/*  RE-EXPORTS — single entry point for the whole synthetic dataset            */
/* -------------------------------------------------------------------------- */

export { REGIONS, getRegion } from './regions'
export {
  PERIOD_LABELS,
  PERIOD_SHORT_LABELS,
  getRainfallSeries,
  getWaterLevelSeries,
  getCumulativeRainfall,
  getMeanRainfall,
  getPeakRainfall,
  getPeakWaterLevel,
  getMinWaterLevel,
  getMeanWaterLevel,
  getRegionRainfall24h,
  getRegionWaterLevel,
  getRegionRiskTrend,
  rawRainfall24h,
  rawWaterLevelNow,
} from './timeSeries'
export type { TimePeriod, RiskTrendPoint } from './timeSeries'
export { DEMO_ALERTS } from './alerts'
export { SAMPLE_REPORTS } from './reports'
export {
  SAMPLE_RESOURCES,
  RESOURCE_CATEGORY_LABELS,
  RESOURCE_CATEGORY_ORDER,
  RESOURCE_AVAILABILITY_LABELS,
} from './resources'
export { CHECKLIST_SECTIONS, EMERGENCY_KIT_ITEMS } from './checklists'
export { METHODOLOGY_SECTIONS, MODEL_CAVEATS } from './methodology'
export type { MethodologySection } from './methodology'
