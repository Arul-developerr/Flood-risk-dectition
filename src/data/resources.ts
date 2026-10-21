/**
 * Conceptual resource directory.
 *
 * ⚠️ Every entry below is FICTIONAL and exists only to demonstrate the layout.
 * No shelter, address, opening hour, capacity, stock figure or phone number
 * here is real. No emergency numbers are published in this prototype.
 */

import type { ResourceItem } from '../types'

export const SAMPLE_RESOURCES: ResourceItem[] = [
  {
    id: 'res-shelter-01',
    name: 'Sample Community Shelter — Nagapattinam Example Hall',
    category: 'shelter',
    regionId: 'r-harbour',
    addressLabel: '12 Example Lane, Nagapattinam (illustrative address)',
    description:
      'A fully fictional example shelter record used to demonstrate the directory layout. It is not a real facility.',
    openingHoursLabel: 'Illustrative: 24-hour (sample)',
    contactLabel: 'Sample desk number (not a real line)',
    capacityLabel: 'Illustrative capacity: 120 (sample)',
    availability: 'sample-available',
    isSynthetic: true,
  },
  {
    id: 'res-shelter-02',
    name: 'Sample Relief Centre — Cuddalore Example Complex',
    category: 'shelter',
    regionId: 'r-riverside',
    addressLabel: '4 Sample Road, Cuddalore (illustrative address)',
    description:
      'Another fictional sample entry so the shelter category can be demonstrated with more than one card.',
    openingHoursLabel: 'Illustrative: 06:00 – 22:00 (sample)',
    contactLabel: 'Sample desk number (not a real line)',
    capacityLabel: 'Illustrative capacity: 300 (sample)',
    availability: 'sample-unknown',
    isSynthetic: true,
  },
  {
    id: 'res-shelter-03',
    name: 'Sample Temporary Shelter — Chennai Example Hall',
    category: 'shelter',
    regionId: 'r-northgate',
    addressLabel: 'Sample Plot 7, Chennai (illustrative address)',
    description:
      'Fictional sample record. Availability is deliberately marked unknown to show the empty/unknown state.',
    openingHoursLabel: 'Illustrative: 08:00 – 20:00 (sample)',
    contactLabel: 'Sample desk number (not a real line)',
    capacityLabel: 'Illustrative capacity: 80 (sample)',
    availability: 'sample-unknown',
    isSynthetic: true,
  },
  {
    id: 'res-supplies-01',
    name: 'Sample Relief Supply Depot — Coimbatore Example Yard',
    category: 'supplies',
    regionId: 'r-central',
    addressLabel: 'Unit 3, Sample Industrial Way (illustrative address)',
    description:
      'Fictional sample depot illustrating where non-food relief supplies might be collected from in a real deployment.',
    openingHoursLabel: 'Illustrative: 09:00 – 18:00 (sample)',
    contactLabel: 'Sample desk number (not a real line)',
    capacityLabel: 'Illustrative stock: 5,000 kits (sample)',
    availability: 'sample-available',
    isSynthetic: true,
  },
  {
    id: 'res-supplies-02',
    name: 'Sample Drinking Water Point — Thanjavur Example Storehouse',
    category: 'supplies',
    regionId: 'r-southgate',
    addressLabel: '9 Sample Avenue, Thanjavur (illustrative address)',
    description:
      'Illustrative sample distribution point. No water quality testing or stock monitoring is performed.',
    openingHoursLabel: 'Illustrative: 07:00 – 19:00 (sample)',
    contactLabel: 'Sample desk number (not a real line)',
    capacityLabel: 'Illustrative stock: 1,200 cases (sample)',
    availability: 'sample-closed',
    isSynthetic: true,
  },
  {
    id: 'res-official-01',
    name: 'Local emergency authority — verified source required',
    category: 'official-info',
    regionId: 'r-central',
    addressLabel: 'Not configured in this prototype',
    description:
      'This prototype intentionally does not publish emergency numbers or authority contacts. Real, verified official channels must be configured before any operational use.',
    openingHoursLabel: 'Not configured',
    contactLabel: 'Not configured',
    capacityLabel: 'Not applicable',
    availability: 'sample-unknown',
    isSynthetic: true,
  },
  {
    id: 'res-official-02',
    name: 'Official weather and warning bulletins — verified source required',
    category: 'official-info',
    regionId: 'r-riverside',
    addressLabel: 'Not configured in this prototype',
    description:
      'No weather or warning feed is connected. A production build would link to the official national meteorological service for the deployed region.',
    openingHoursLabel: 'Not configured',
    contactLabel: 'Not configured',
    capacityLabel: 'Not applicable',
    availability: 'sample-unknown',
    isSynthetic: true,
  },
  {
    id: 'res-health-01',
    name: 'Sample Flood-Related Health Guidance',
    category: 'health',
    regionId: 'r-central',
    addressLabel: 'Guidance document (illustrative)',
    description:
      'A fictional guidance entry covering wound care, safe drinking water and sanitation after a flood. It is not medical advice.',
    openingHoursLabel: 'Always available (sample)',
    contactLabel: 'Refer to official health services (not configured)',
    capacityLabel: 'Not applicable',
    availability: 'sample-available',
    isSynthetic: true,
  },
  {
    id: 'res-prepared-01',
    name: 'Sample Household Emergency Kit Checklist',
    category: 'preparedness',
    regionId: 'r-millford',
    addressLabel: 'Preparedness module (illustrative)',
    description:
      'A sample preparedness resource mirrored from the in-app Safety & Preparedness checklists.',
    openingHoursLabel: 'Always available (sample)',
    contactLabel: 'Not applicable',
    capacityLabel: 'Not applicable',
    availability: 'sample-available',
    isSynthetic: true,
  },
  {
    id: 'res-recovery-01',
    name: 'Sample Post-Flood Recovery Support Desk',
    category: 'recovery',
    regionId: 'r-oldmill',
    addressLabel: 'Sample Recovery Centre, Madurai (illustrative)',
    description:
      'A fictional recovery-support entry used to demonstrate the recovery category in the directory.',
    openingHoursLabel: 'Illustrative: 10:00 – 17:00 (sample)',
    contactLabel: 'Sample desk number (not a real line)',
    capacityLabel: 'Not applicable',
    availability: 'sample-unknown',
    isSynthetic: true,
  },
]

export const RESOURCE_CATEGORY_LABELS: Record<ResourceItem['category'], string> = {
  shelter: 'Shelters & relief centres',
  supplies: 'Emergency supplies',
  'official-info': 'Local authority information',
  health: 'Health & sanitation',
  preparedness: 'Preparedness',
  recovery: 'Recovery assistance',
}

export const RESOURCE_CATEGORY_ORDER: ResourceItem['category'][] = [
  'shelter',
  'supplies',
  'official-info',
  'health',
  'preparedness',
  'recovery',
]

export const RESOURCE_AVAILABILITY_LABELS: Record<ResourceItem['availability'], string> = {
  'sample-available': 'Sample — shown as available',
  'sample-unknown': 'Sample — availability unknown',
  'sample-closed': 'Sample — shown as closed',
}
