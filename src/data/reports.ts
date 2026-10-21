/**
 * Synthetic community report records.
 *
 * ⚠️ These observations were written by the project author to demonstrate the
 * reporting interface. They were not submitted by real residents and were not
 * received by any authority, agency or third-party service.
 */

import type { CommunityReport } from '../types'

export const SAMPLE_REPORTS: CommunityReport[] = [
  {
    id: 'RPT-SAMPLE-0142',
    category: 'waterlogging',
    regionId: 'r-central',
    description:
      'Sample observation of standing water across the lower approach roads in the Coimbatore sample district.',
    timestamp: '2025-06-12T08:20',
    status: 'unreviewed',
    isSynthetic: true,
    reporterLabel: 'Sample resident (demo)',
  },
  {
    id: 'RPT-SAMPLE-0139',
    category: 'blocked-drainage',
    regionId: 'r-riverside',
    description:
      'Sample observation of debris blocking a culvert grate along the illustrative main channel.',
    timestamp: '2025-06-12T07:05',
    status: 'reviewing',
    isSynthetic: true,
    reporterLabel: 'Sample resident (demo)',
  },
  {
    id: 'RPT-SAMPLE-0135',
    category: 'heavy-rainfall',
    regionId: 'r-northgate',
    description:
      'Sample observation of sustained heavy rainfall in the northern catchment with limited visibility.',
    timestamp: '2025-06-12T06:40',
    status: 'unreviewed',
    isSynthetic: true,
    reporterLabel: 'Sample resident (demo)',
  },
  {
    id: 'RPT-SAMPLE-0130',
    category: 'road-accumulation',
    regionId: 'r-oldmill',
    description:
      'Sample observation of a flooded underpass in the historic quarter preventing pedestrian access.',
    timestamp: '2025-06-11T19:55',
    status: 'resolved',
    isSynthetic: true,
    reporterLabel: 'Sample resident (demo)',
  },
  {
    id: 'RPT-SAMPLE-0126',
    category: 'waterlogging',
    regionId: 'r-harbour',
    description:
      'Sample observation of water collecting in a market square drainage point on the eastern bank.',
    timestamp: '2025-06-11T16:10',
    status: 'reviewing',
    isSynthetic: true,
    reporterLabel: 'Sample resident (demo)',
  },
  {
    id: 'RPT-SAMPLE-0121',
    category: 'other',
    regionId: 'r-hillside',
    description:
      'Sample observation of a washed-out walking path on the eastern hillside, with no access to homes.',
    timestamp: '2025-06-11T12:30',
    status: 'resolved',
    isSynthetic: true,
    reporterLabel: 'Sample resident (demo)',
  },
  {
    id: 'RPT-SAMPLE-0117',
    category: 'blocked-drainage',
    regionId: 'r-southgate',
    description:
      'Sample observation of a silted storm drain on the southern plains road network.',
    timestamp: '2025-06-10T14:25',
    status: 'unreviewed',
    isSynthetic: true,
    reporterLabel: 'Sample resident (demo)',
  },
  {
    id: 'RPT-SAMPLE-0112',
    category: 'heavy-rainfall',
    regionId: 'r-creek',
    description:
      'Sample observation of a short, intense rainfall burst over the tributary sample region.',
    timestamp: '2025-06-10T09:45',
    status: 'resolved',
    isSynthetic: true,
    reporterLabel: 'Sample resident (demo)',
  },
]
