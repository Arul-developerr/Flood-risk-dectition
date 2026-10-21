import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Layers3, RadioTower, MapPinned } from 'lucide-react'
import { useApp } from '../app/AppContext'
import { useLocale } from '../app/LocaleContext'
import { REGIONS, RISK_CATEGORIES, RISK_CATEGORY_ORDER } from '../data/demoData'
import { stationForRegion } from '../data/stations'
import type { RiskCategory } from '../types'
import { PageHeader } from '../components/ui/PageHeader'
import { Surface, SectionHeading } from '../components/ui/primitives'
import { ChipToggle, SearchField } from '../components/ui/Controls'
import { TerrainScene, type TerrainSceneHandle } from '../components/map/TerrainScene'
import { MapControls, MapLegend, type MapLayerState } from '../components/map/MapControls'
import { RegionDetailPanel, RegionDetailActions } from '../components/regions/RegionDetailPanel'
import { RegionTable } from '../components/regions/RegionTable'
import { StationSelector } from '../components/regions/StationSelector'

export function RiskMapPage() {
  const { selectedRegion, setSelectedRegionId, preferences } = useApp()
  const { t } = useLocale()
  const [query, setQuery] = useState('')
  const [bands, setBands] = useState<RiskCategory[]>([])
  const [mode, setMode] = useState<'regions' | 'stations'>('regions')
  const [layers, setLayers] = useState<MapLayerState>({ contours: true, water: true, grid: true })
  const scene = useRef<TerrainSceneHandle>(null)
  const filtered = useMemo(() => REGIONS.filter(region =>
    (!bands.length || bands.includes(region.riskCategory)) &&
    `${region.name} ${region.tamilName} ${region.district} ${stationForRegion(region.id).id}`.toLowerCase().includes(query.trim().toLowerCase())), [bands, query])
  const toggleBand = (band: RiskCategory) => setBands(previous => previous.includes(band) ? previous.filter(item => item !== band) : [...previous, band])
  const station = stationForRegion(selectedRegion.id)
  return (
    <div className="risk-workspace page-workspace space-y-5 atlas-page atlas-page--risk">
      <PageHeader data-panel="intro" eyebrow={<span className="workspace-kicker"><span />TAMIL NADU / MAP EXPLORER</span>}
        title="Explore Tamil Nadu" description="Real state outline with illustrative depth and sample district readings."
        actions={<Link className="btn-secondary" to="/prediction">{t('District analysis', 'மாவட்டப் பகுப்பாய்வு')} <ArrowUpRight className="h-4 w-4" /></Link>} />
      <div data-panel="search" className="explorer-search flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchField label={t('Search districts or sample stations', 'மாவட்டம் அல்லது மாதிரி நிலையத்தைத் தேடுங்கள்')} value={query} onChange={setQuery} placeholder={t('Find a district or gauge…', 'மாவட்டம் அல்லது நிலையம்…')} className="sm:max-w-sm" />
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('Map marker mode', 'வரைபடக் குறியீடு வகை')}>{(['regions', 'stations'] as const).map(value => <button key={value} className={`explorer-mode ${mode === value ? 'is-active' : ''}`} aria-pressed={mode === value} onClick={() => setMode(value)}>{value === 'regions' ? <MapPinned className="h-3.5 w-3.5" /> : <RadioTower className="h-3.5 w-3.5" />}{value === 'regions' ? t('Districts', 'மாவட்டங்கள்') : t('Sample stations', 'மாதிரி நிலையங்கள்')}</button>)}</div>
        <span className="text-xs text-shell-faint sm:ml-auto">{filtered.length} / {REGIONS.length} visible</span>
      </div>
      <div data-panel="filters" className="flex flex-wrap items-center gap-2" role="group" aria-label={t('Illustrative risk filters', 'மாதிரி இடர் வடிகட்டிகள்')}><span className="mr-1 text-xs text-shell-muted">{t('Risk bands', 'இடர் நிலைகள்')}</span>{RISK_CATEGORY_ORDER.map(band => <ChipToggle key={band} label={RISK_CATEGORIES[band].shortLabel} color={RISK_CATEGORIES[band].color} active={bands.includes(band)} onClick={() => toggleBand(band)} />)}{(bands.length > 0 || query) && <button className="text-link min-h-11" onClick={() => { setBands([]); setQuery('') }}>{t('Clear filters', 'வடிகட்டிகளை நீக்கு')}</button>}</div>
      <section data-panel="terrain" className="basin-workbench overflow-hidden rounded-panel border border-shell-border" aria-label="Interactive risk explorer">
        <div className="workbench-toolbar flex flex-wrap items-center justify-between gap-2 border-b border-shell-border px-4 py-3"><h2 className="flex items-center gap-2 text-sm font-medium"><Layers3 className="h-4 w-4 text-cyan" />{t('Tamil Nadu 3D map', 'தமிழ்நாடு 3D வரைபடம்')} <span className="technical-tag">{t('SAMPLE DATA', 'மாதிரித் தரவு')}</span></h2><span className="text-xs text-shell-muted">{t('Fixed snapshot · 12 Jun 2025', 'நிலையான பதிவு · 12 ஜூன் 2025')}</span></div>
        <div className="grid min-w-0 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="terrain-stage relative min-w-0">
            <TerrainScene ref={scene} height={610} visibleRegions={filtered} selectedRegionId={selectedRegion.id} onSelectRegion={region => setSelectedRegionId(region.id)} labelMode={mode} showContours={layers.contours} showWater={layers.water} showGrid={layers.grid} />
            <div className="scene-identity pointer-events-none absolute left-5 top-5"><p className="font-mono text-[10px] tracking-wider text-cyan">TAMIL NADU / 3D ATLAS</p><p className="mt-1 text-xs text-shell-muted">{mode === 'stations' ? t('Illustrative gauges', 'விளக்க மாதிரி நிலையங்கள்') : t('Approximate district markers', 'தோராயமான மாவட்டக் குறியீடுகள்')}</p></div>
            <MapControls layers={layers} onToggleLayer={key => setLayers(previous => ({ ...previous, [key]: !previous[key] }))} onZoom={factor => factor < 1 ? scene.current?.zoomIn() : scene.current?.zoomOut()} onReset={() => scene.current?.reset()} onRotate={() => scene.current?.rotate(0.35)} onTilt={() => scene.current?.tilt(0.1)} onPan={() => scene.current?.pan(5, 0)} />
            <div className="absolute bottom-12 left-4 hidden sm:block"><MapLegend /></div>
            {filtered.length === 0 && <div className="absolute left-4 top-20 rounded-lg border border-shell-border bg-navy-950 p-4 text-sm">No regions match. <button className="text-link" onClick={() => { setBands([]); setQuery('') }}>Reset filters</button></div>}
          </div>
          <aside className="basin-context border-t border-shell-border p-5 xl:border-l xl:border-t-0">
            {mode === 'stations' && <div className="mb-5 border-b border-shell-border pb-4"><StationSelector /><p className="mt-3 font-mono text-xs text-cyan">{station.id}</p><p className="mt-1 text-xs text-shell-muted">{station.type} · {station.status}</p></div>}
            <RegionDetailPanel region={selectedRegion} units={preferences.units} actions={<RegionDetailActions className="mt-4" />} />
            {!filtered.some(region => region.id === selectedRegion.id) && <p role="status" className="mt-4 rounded-lg border border-risk-moderate/30 p-3 text-xs text-risk-moderate">Selected region is outside the current filter. Its readings remain available here.</p>}
          </aside>
        </div>
      </section>
      <div data-panel="legend" className="sm:hidden"><MapLegend compact /></div>
      <section data-panel="regions"><SectionHeading title="Region reference" description="Select a row to update the shared region across the application." /><Surface className="overflow-hidden"><RegionTable regions={filtered} selectedRegionId={selectedRegion.id} onSelectRegion={setSelectedRegionId} /></Surface></section>
      <p data-panel="footnote" className="text-xs leading-relaxed text-shell-muted">{t('The state outline is from Natural Earth. 3D depth, marker positions, station IDs and all readings are illustrative. Sample stations are not connected instruments.', 'மாநில எல்லை Natural Earth தரவிலிருந்து பெறப்பட்டது. 3D ஆழம், மாவட்டக் குறியீடுகளின் இடங்கள், நிலைய அடையாளங்கள் மற்றும் அனைத்து அளவுகளும் விளக்க மாதிரிகள். நிலையங்கள் உண்மையான கருவிகளுடன் இணைக்கப்படவில்லை.')} <Link to="/methodology" className="text-link">{t('Read the data notes', 'தரவு விவரங்கள்')} <ArrowUpRight className="h-3 w-3" /></Link></p>
    </div>
  )
}
