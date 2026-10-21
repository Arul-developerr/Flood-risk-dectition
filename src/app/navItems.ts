/**
 * ============================================================================
 * NAVIGATION MODEL
 * ============================================================================
 *
 * All twelve routes are grouped into four readable sections so that every
 * screen stays reachable without burying anything behind a hidden menu.
 *
 * The grouping is presentation only — the route list itself is unchanged.
 */

import {
  BellRing,
  ClipboardList,
  CloudRain,
  FileWarning,
  Gauge,
  LayoutDashboard,
  LifeBuoy,
  MapPinned,
  MessageSquareWarning,
  RadioTower,
  Settings2,
  Waves,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  tamilLabel: string
  shortLabel: string
  description: string
  icon: LucideIcon
}

export type NavSectionId = 'monitor' | 'analysis' | 'community' | 'system'

export interface NavSection {
  id: NavSectionId
  label: string
  description: string
  items: NavItem[]
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Overview',
    tamilLabel: 'முகப்பு',
    shortLabel: 'Overview',
    description: 'Basin-wide summary of the synthetic indicators',
    icon: LayoutDashboard,
  },
  {
    to: '/risk',
    label: 'Risk map',
    tamilLabel: 'இடர் வரைபடம்',
    shortLabel: 'Risk map',
    description: 'Interactive relief map of the sample regions',
    icon: MapPinned,
  },
  {
    to: '/prediction',
    label: 'Risk analysis',
    tamilLabel: 'இடர் பகுப்பாய்வு',
    shortLabel: 'Analysis',
    description: 'Illustrative risk score and sample trend analysis',
    icon: Gauge,
  },
  {
    to: '/rainfall',
    label: 'Rainfall',
    tamilLabel: 'மழைப்பொழிவு',
    shortLabel: 'Rainfall',
    description: 'Synthetic rainfall series and totals',
    icon: CloudRain,
  },
  {
    to: '/river',
    label: 'River levels',
    tamilLabel: 'நீர்மட்டம்',
    shortLabel: 'River',
    description: 'Synthetic gauge series',
    icon: Waves,
  },
  {
    to: '/stations',
    label: 'Monitoring',
    tamilLabel: 'கண்காணிப்பு',
    shortLabel: 'Monitoring',
    description: 'Conceptual monitoring locations',
    icon: RadioTower,
  },
  {
    to: '/alerts',
    label: 'Alerts',
    tamilLabel: 'எச்சரிக்கை மாதிரிகள்',
    shortLabel: 'Alerts',
    description: 'Sample alert records and acknowledgement workflow',
    icon: BellRing,
  },
  {
    to: '/reports',
    label: 'Reports',
    tamilLabel: 'மக்கள் குறிப்புகள்',
    shortLabel: 'Reports',
    description: 'Community observations and reporting form',
    icon: MessageSquareWarning,
  },
  {
    to: '/resources',
    label: 'Resources',
    tamilLabel: 'உதவி வளங்கள்',
    shortLabel: 'Resources',
    description: 'Conceptual directory of sample support services',
    icon: LifeBuoy,
  },
  {
    to: '/preparedness',
    label: 'Preparedness',
    tamilLabel: 'முன்னெச்சரிக்கை',
    shortLabel: 'Preparedness',
    description: 'Checklists, emergency kit and guidance',
    icon: ClipboardList,
  },
  {
    to: '/methodology',
    label: 'Methodology',
    tamilLabel: 'தரவுக் குறிப்பு',
    shortLabel: 'Methodology',
    description: 'How the illustrative scoring and disclosure work',
    icon: FileWarning,
  },
  {
    to: '/settings',
    label: 'Settings',
    tamilLabel: 'அமைப்புகள்',
    shortLabel: 'Settings',
    description: 'Appearance, units and demo data controls',
    icon: Settings2,
  },
]

/**
 * The four navigation groups. Every route appears exactly once.
 * `primary` marks the routes promoted into the top bar on wide screens.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'monitor',
    label: 'Monitor',
    description: 'Situation awareness across the sample basin',
    items: NAV_ITEMS.filter((item) => ['/', '/risk', '/alerts'].includes(item.to)),
  },
  {
    id: 'analysis',
    label: 'Analysis',
    description: 'Sample series, scores and monitoring locations',
    items: NAV_ITEMS.filter((item) =>
      ['/prediction', '/rainfall', '/river', '/stations'].includes(item.to),
    ),
  },
  {
    id: 'community',
    label: 'Community',
    description: 'Observations, support and preparedness',
    items: NAV_ITEMS.filter((item) =>
      ['/reports', '/resources', '/preparedness'].includes(item.to),
    ),
  },
  {
    id: 'system',
    label: 'System',
    description: 'How the demonstration works and how it is configured',
    items: NAV_ITEMS.filter((item) => ['/methodology', '/settings'].includes(item.to)),
  },
]

/** Routes highlighted in the top bar at large breakpoints. */
export const PRIMARY_ROUTES = ['/', '/risk', '/prediction', '/alerts', '/preparedness'] as const

export function findNavItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.to === pathname)
}
