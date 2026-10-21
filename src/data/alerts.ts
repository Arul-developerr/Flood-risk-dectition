/**
 * Synthetic demonstration alerts.
 *
 * ⚠️ These records are NOT warnings, advisories or notifications.
 * Nothing was issued, sent, broadcast or delivered to any person or service.
 * The title text is used only to exercise the interface's presentation states.
 */

import type { DemoAlert } from '../types'

export const DEMO_ALERTS: DemoAlert[] = [
  {
    id: 'DEMO-ALT-2041',
    title: 'Sample water-level rise above illustrative gauge band',
    regionId: 'r-riverside',
    severity: 'critical',
    category: 'water-level',
    timestamp: '2025-06-12T08:45',
    description:
      'Synthetic sample record showing the modelled water level for Cuddalore crossing the illustrative reference band used in this prototype. No real gauge was read.',
    status: 'demo',
    isSynthetic: true,
    sourceLabel: 'Synthetic sample record',
    rainfallMm: 118,
    waterLevelM: 3.3,
    guidance:
      'Demonstration guidance only: in a real deployment this sample record would be cross-checked with official local warnings before any action is taken.',
  },
  {
    id: 'DEMO-ALT-2038',
    title: 'Sample intense rainfall cell detected over the northern catchment',
    regionId: 'r-northgate',
    severity: 'high',
    category: 'rainfall',
    timestamp: '2025-06-12T07:20',
    description:
      'Synthetic 24-hour rainfall total for the Chennai sample district, generated for interface demonstration purposes only.',
    status: 'demo',
    isSynthetic: true,
    sourceLabel: 'Synthetic sample record',
    rainfallMm: 95,
    waterLevelM: 3.1,
    guidance:
      'Demonstration guidance only: this record does not represent a real rainfall observation or an issued warning.',
  },
  {
    id: 'DEMO-ALT-2035',
    title: 'Sample drainage capacity exceeded in the Coimbatore sample district',
    regionId: 'r-central',
    severity: 'high',
    category: 'drainage',
    timestamp: '2025-06-12T06:10',
    description:
      'Illustrative drainage-capacity scenario for the Coimbatore sample district. The threshold used here was authored by hand for the prototype.',
    status: 'demo',
    isSynthetic: true,
    sourceLabel: 'Synthetic sample record',
    rainfallMm: 86,
    waterLevelM: 2.95,
    guidance:
      'Demonstration guidance only: no drainage network was instrumented and no municipal system was consulted.',
  },
  {
    id: 'DEMO-ALT-2031',
    title: 'Sample flash-flood scenario for the historic quarter',
    regionId: 'r-oldmill',
    severity: 'high',
    category: 'flash-flood',
    timestamp: '2025-06-12T05:05',
    description:
      'A hand-authored sample scenario describing a rapid-onset flood event over the Madurai sample district.',
    status: 'acknowledged',
    isSynthetic: true,
    sourceLabel: 'Synthetic sample record',
    rainfallMm: 107,
    waterLevelM: 3.19,
    guidance:
      'Demonstration guidance only: this is an authored scenario, not a modelled or observed event.',
  },
  {
    id: 'DEMO-ALT-2027',
    title: 'Sample low-lying junction accumulation notice',
    regionId: 'r-creek',
    severity: 'moderate',
    category: 'infrastructure',
    timestamp: '2025-06-11T22:40',
    description:
      'Illustrative infrastructure scenario describing surface-water accumulation at a tributary junction in the sample dataset.',
    status: 'demo',
    isSynthetic: true,
    sourceLabel: 'Synthetic sample record',
    rainfallMm: 73,
    waterLevelM: 3.04,
    guidance:
      'Demonstration guidance only: no road network, sensor or inspection system produced this record.',
  },
  {
    id: 'DEMO-ALT-2022',
    title: 'Sample rainfall accumulation advisory for the eastern district',
    regionId: 'r-harbour',
    severity: 'moderate',
    category: 'rainfall',
    timestamp: '2025-06-11T19:15',
    description:
      'Synthetic advisory-style record for the Nagapattinam sample district, included to demonstrate the moderate severity presentation.',
    status: 'demo',
    isSynthetic: true,
    sourceLabel: 'Synthetic sample record',
    rainfallMm: 61,
    waterLevelM: 2.8,
    guidance:
      'Demonstration guidance only: this text is not an advisory and was not issued to anyone.',
  },
  {
    id: 'DEMO-ALT-2018',
    title: 'Sample riverbank erosion watch, southern plains',
    regionId: 'r-southgate',
    severity: 'moderate',
    category: 'water-level',
    timestamp: '2025-06-11T15:30',
    description:
      'Illustrative bank-stability watch record for the southern sample plains, authored to demonstrate a stable-trend scenario.',
    status: 'demo',
    isSynthetic: true,
    sourceLabel: 'Synthetic sample record',
    rainfallMm: 52,
    waterLevelM: 2.6,
    guidance:
      'Demonstration guidance only: no survey or imagery was analysed to produce this record.',
  },
  {
    id: 'DEMO-ALT-2014',
    title: 'Sample post-event waterlogging observation, terrace district',
    regionId: 'r-millford',
    severity: 'low',
    category: 'water-level',
    timestamp: '2025-06-11T11:00',
    description:
      'A sample observation record showing the low-severity state of the interface with a falling synthetic indicator.',
    status: 'demo',
    isSynthetic: true,
    sourceLabel: 'Synthetic sample record',
    rainfallMm: 44,
    waterLevelM: 2.69,
    guidance:
      'Demonstration guidance only: this observation was written by the project author for the demo.',
  },
  {
    id: 'DEMO-ALT-2011',
    title: 'Sample channel clearance completed, western brook',
    regionId: 'r-westbrook',
    severity: 'info',
    category: 'drainage',
    timestamp: '2025-06-11T08:20',
    description:
      'Informational sample record describing a completed clearance task in the low-risk sample district.',
    status: 'acknowledged',
    isSynthetic: true,
    sourceLabel: 'Synthetic sample record',
    rainfallMm: 27,
    waterLevelM: 2.3,
    guidance:
      'Demonstration guidance only: no clearance crew, work order or contractor is associated with this record.',
  },
  {
    id: 'DEMO-ALT-2007',
    title: 'Sample catchment stabilisation note, eastern hills',
    regionId: 'r-hillside',
    severity: 'info',
    category: 'infrastructure',
    timestamp: '2025-06-10T17:50',
    description:
      'Informational sample note describing stable synthetic indicators in the lowest-risk sample region of the dataset.',
    status: 'demo',
    isSynthetic: true,
    sourceLabel: 'Synthetic sample record',
    rainfallMm: 20,
    waterLevelM: 2.12,
    guidance:
      'Demonstration guidance only: purely an interface sample with no operational meaning.',
  },
]
