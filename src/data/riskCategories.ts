/**
 * Risk-band definitions for the demonstration dataset.
 *
 * ⚠️ The score bands below are ILLUSTRATIVE ONLY. They are not calibrated
 * thresholds, not derived from any hydrological model and not comparable to
 * any official flood-warning scale.
 */

import type { RiskCategory } from '../types'

export interface RiskCategoryMeta {
  id: RiskCategory
  label: string
  shortLabel: string
  color: string
  textColor: string
  bgClass: string
  borderClass: string
  dotClass: string
  /** Illustrative only — NOT a validated operational threshold. */
  scoreRange: string
  description: string
  /** Inclusive lower bound of the illustrative band. */
  minScore: number
}

export const RISK_CATEGORIES: Record<RiskCategory, RiskCategoryMeta> = {
  low: {
    id: 'low',
    label: 'Low risk',
    shortLabel: 'Low',
    color: '#BBA1AA',
    textColor: '#E2C9D2',
    bgClass: 'bg-risk-low/10',
    borderClass: 'border-risk-low/35',
    dotClass: 'bg-risk-low',
    scoreRange: '0 – 34',
    minScore: 0,
    description:
      'Sample regions where the synthetic indicators sit well below the illustrative reference band.',
  },
  moderate: {
    id: 'moderate',
    label: 'Moderate risk',
    shortLabel: 'Moderate',
    color: '#F5B544',
    textColor: '#F5B544',
    bgClass: 'bg-risk-moderate/10',
    borderClass: 'border-risk-moderate/35',
    dotClass: 'bg-risk-moderate',
    scoreRange: '35 – 59',
    minScore: 35,
    description:
      'Sample regions with elevated synthetic indicators that warrant closer observation in the demo.',
  },
  high: {
    id: 'high',
    label: 'High risk',
    shortLabel: 'High',
    color: '#FF9160',
    textColor: '#FFB48B',
    bgClass: 'bg-risk-high/10',
    borderClass: 'border-risk-high/35',
    dotClass: 'bg-risk-high',
    scoreRange: '60 – 79',
    minScore: 60,
    description:
      'Sample regions where synthetic indicators exceed the illustrative elevated reference band.',
  },
  'very-high': {
    id: 'very-high',
    label: 'Very high risk',
    shortLabel: 'Very high',
    color: '#FF6B55',
    textColor: '#FF9B86',
    bgClass: 'bg-risk-critical/15',
    borderClass: 'border-risk-critical/50',
    dotClass: 'bg-risk-critical',
    scoreRange: '80 – 100',
    minScore: 80,
    description:
      'Sample regions with the strongest synthetic indicators in the demonstration dataset.',
  },
}

export const RISK_CATEGORY_ORDER: RiskCategory[] = ['low', 'moderate', 'high', 'very-high']

/**
 * Map an illustrative score (0-100) onto its risk band.
 * Keeps every region, chart and table consistent with a single source of truth.
 */
export function riskCategoryForScore(score: number): RiskCategory {
  if (score >= RISK_CATEGORIES['very-high'].minScore) return 'very-high'
  if (score >= RISK_CATEGORIES.high.minScore) return 'high'
  if (score >= RISK_CATEGORIES.moderate.minScore) return 'moderate'
  return 'low'
}
