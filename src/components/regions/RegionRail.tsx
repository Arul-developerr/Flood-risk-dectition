import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useApp } from '../../app/AppContext'
import { useLocale } from '../../app/LocaleContext'
import { REGIONS, RISK_CATEGORIES } from '../../data/demoData'

export function RegionRail() {
  const { selectedRegionId, setSelectedRegionId } = useApp()
  const { t, regionName } = useLocale()
  return (
    <section className="region-rail" aria-label={t('Choose a district', 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்')}>
      <div className="region-rail-heading"><span>{t('Explore districts', 'மாவட்டங்களை ஆராயுங்கள்')}</span><Link to="/risk">{t('View map', 'வரைபடம்')} <ArrowUpRight size={13} aria-hidden="true" /></Link></div>
      <div className="region-rail-scroll">{REGIONS.map((region, index) => (
        <button key={region.id} className={`region-chip ${selectedRegionId === region.id ? 'is-selected' : ''}`} aria-pressed={selectedRegionId === region.id} onClick={() => setSelectedRegionId(region.id)}>
          <span className="region-chip-number">{String(index + 1).padStart(2, '0')}</span><span>{regionName(region)}</span><i style={{ background: RISK_CATEGORIES[region.riskCategory].color }} aria-hidden="true" />
        </button>
      ))}</div>
    </section>
  )
}
