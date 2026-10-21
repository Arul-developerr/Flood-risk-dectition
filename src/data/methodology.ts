/**
 * Explanatory content for the Methodology page.
 *
 * ⚠️ This describes how the prototype is BUILT, not how a real flood model
 * works. Nothing here documents a validated, calibrated or operational model.
 */

export interface MethodologySection {
  id: string
  title: string
  summary: string
  icon: 'database' | 'activity' | 'shield' | 'flask'
  points: string[]
}

export const METHODOLOGY_SECTIONS: MethodologySection[] = [
  {
    id: 'dataset',
    title: 'Where the numbers come from',
    summary:
      'Every figure is read from a hand-written fixture file that ships with the source code.',
    icon: 'database',
    points: [
      'All rainfall, water-level, risk-score, alert, report and resource records live in the src/data folder as plain TypeScript constants.',
      'Tamil Nadu and the selected district names are real. The state outline comes from Natural Earth admin-1 public-domain data; markers are approximate. All scores, readings, alerts, reports, facilities and monitoring counts are invented.',
      'The dataset is completely fixed: no value is randomised, sampled or fetched at runtime, so every reload renders identical output.',
      'A single reference timestamp (12 Jun 2025, 09:30) anchors every date shown, so screenshots and reviews stay comparable over time.',
    ],
  },
  {
    id: 'scoring',
    title: 'How the illustrative risk score is derived',
    summary:
      'Scores are authored constants. A shared function assigns each score to a demonstration band.',
    icon: 'activity',
    points: [
      'Each region is seeded with a single illustrative score, and the on-screen risk band (low, moderate, high, very high) is derived from that score rather than typed in separately.',
      'The separate trend curve on the risk assessment page is a 55/45 blend of the normalized synthetic rainfall and water-level series. It does not determine the authored regional score.',
      'The rainfall and water-level readings for each region are computed from one shared synthetic series, scaled by a per-region factor, so charts, tables and map markers can never disagree.',
      'Because the inputs are invented, the score carries no forecasting skill, no skill score, no lead time and no probability of an event.',
      'Trend arrows and deltas are likewise hand-written sample values that illustrate the interface, not a signal derived from a forecast.',
    ],
  },
  {
    id: 'storage',
    title: 'What is stored, and where',
    summary:
      'Your preferences, alert statuses, checklist ticks and any report you create stay in this browser.',
    icon: 'shield',
    points: [
      'LocalStorage keys are namespaced under "sfr:" and hold only appearance preferences, per-alert status, checklist tick state and locally created sample reports.',
      'There is no account system, no server, no analytics and no third-party script. Nothing you enter is transmitted anywhere.',
      'Everything you create can be deleted at any time from the Settings page, which clears the stored keys and restores the defaults.',
      'If the browser blocks storage (private mode, disabled cookies), the app degrades to in-memory state and keeps working.',
    ],
  },
  {
    id: 'limits',
    title: 'What this prototype deliberately does not do',
    summary:
      'The boundaries of the build are as important as its features.',
    icon: 'flask',
    points: [
      'It does not ingest rainfall, river-gauge, weather or satellite data, and it has no live or scheduled updates of any kind.',
      'The state outline is geographic, but its CSS 3D extrusion, contours, sample connectors and district marker positions are illustrative. The component is not a surveyed elevation model or flood-extent map.',
      'It does not issue warnings, contact anyone, dispatch a response or provide an emergency service of any type.',
      'It publishes no emergency numbers, shelter addresses, helplines or facility details, because no verified operational source was configured.',
      'It must not be used for real safety decisions. Official local emergency authorities always take precedence over anything shown here.',
    ],
  },
]

export const MODEL_CAVEATS: string[] = [
  'The "risk score" is an authored constant for each sample district. It is not a probability, not a forecast and not calibrated against any observed event.',
  'The prediction charts replay a fixed synthetic series. They do not extrapolate, learn or update, and they will never change between sessions.',
  'No model validation, cross-checking, back-testing or accuracy figures exist for this build, because no real observations were available to validate against.',
  'The Tamil Nadu outline is from Natural Earth at 1:10m. District boundaries are not drawn. Approximate district markers, monitoring counts and depth styling are illustrative.',
  'Alerts are authored sample records rather than rule-driven events. Acknowledging one does not notify any system, and dismissing one hides it only in your own browser.',
  'Community reports are never forwarded, verified, triaged or answered. A production build would need a moderation and response workflow before use.',
  'Resource entries carry deliberately unconfigured contact details for the official-information category, so no unverified details can be mistaken for real ones.',
  'Treat every screen in this build as a user-interface study of a flood dashboard, not as a description of conditions anywhere in the world.',
]
