import { REGIONS } from './regions'

/** One representative fictional gauge per region, not an inventory of connected hardware. */
export const SAMPLE_STATIONS = REGIONS.map((region, index) => ({
  id: `DEMO-G${String(index + 1).padStart(2, '0')}`,
  regionId: region.id,
  name: `${region.name} sample gauge`,
  type: 'Illustrative river gauge',
  status: 'Synthetic record',
}))

export function stationForRegion(regionId: string) {
  return SAMPLE_STATIONS.find(station => station.regionId === regionId) ?? SAMPLE_STATIONS[0]
}
