import { useApp } from '../../app/AppContext'
import { SAMPLE_STATIONS } from '../../data/stations'
import { SelectField } from '../ui/Controls'

export function StationSelector({ className }: { className?: string }) {
  const { selectedRegionId, setSelectedRegionId } = useApp()
  return <SelectField label="Sample station" value={selectedRegionId} onChange={setSelectedRegionId} options={SAMPLE_STATIONS.map(station => ({ value: station.regionId, label: `${station.id} · ${station.name}` }))} className={className} />
}
