import { useId } from 'react'
import { RISK_CATEGORIES } from '../../data/demoData'
import type { RiskCategory } from '../../types'

export function ScoreOrbit({ score, category }: { score: number; category: RiskCategory }) {
  const id = useId()
  const radius = 54
  const circumference = 2 * Math.PI * radius
  return (
    <div className="score-orbit" role="img" aria-labelledby={id}>
      <span id={id} className="sr-only">Illustrative score {score} out of 100. {RISK_CATEGORIES[category].label}. Synthetic data.</span>
      <svg viewBox="0 0 144 144" fill="none" aria-hidden="true">
        <circle cx="72" cy="72" r="67" stroke="currentColor" strokeOpacity=".08" strokeDasharray="1 5" />
        <circle cx="72" cy="72" r={radius} stroke="currentColor" strokeOpacity=".08" strokeWidth="5" />
        <circle cx="72" cy="72" r={radius} stroke={RISK_CATEGORIES[category].color} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${circumference * score / 100} ${circumference}`} transform="rotate(-90 72 72)" />
      </svg>
      <div><strong>{score}</strong><small>DEMO INDEX / 100</small></div>
    </div>
  )
}
