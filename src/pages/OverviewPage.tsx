import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BellRing, CloudRain, Droplets, Layers3, RadioTower, ArrowUpRight } from 'lucide-react'
import { useApp } from '../app/AppContext'
import { useLocale } from '../app/LocaleContext'
import { DEMO_CONFIG, REGIONS } from '../data/demoData'
import { getActiveAlerts, getBandDistribution, getBasinIndicators } from '../data/selectors'
import { formatDateTime } from '../utils/format'
import { levelUnit, levelValue, rainUnit, rainValue } from '../utils/measurements'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionHeading, Surface, RiskBandIndicator, SeverityIndicator } from '../components/ui/primitives'
import { TerrainScene, type TerrainSceneHandle } from '../components/map/TerrainScene'
import { MapControls, type MapLayerState } from '../components/map/MapControls'
import { ChartContainer } from '../components/charts/ChartContainer'
import { RainfallChart, WaterLevelChart } from '../components/charts/RainfallChart'
import { BandDistribution } from '../components/charts/RegionComparisonChart'
import { RegionRail } from '../components/regions/RegionRail'
import { BasinLens } from '../components/regions/BasinLens'
import { ScoreOrbit } from '../components/ui/ScoreOrbit'

export function OverviewPage() {
  const { selectedRegion: region, setSelectedRegionId, alertStatus, preferences, allReports } = useApp()
  const { t, regionName } = useLocale()
  const units = preferences.units
  const scene = useRef<TerrainSceneHandle>(null)
  const [layers, setLayers] = useState<MapLayerState>({ contours: true, water: true, grid: true })
  const indicators = useMemo(() => getBasinIndicators('7d'), [])
  const distribution = useMemo(() => getBandDistribution(), [])
  const alerts = useMemo(() => getActiveAlerts(alertStatus), [alertStatus])

  return (
    <div className="overview-workspace page-workspace space-y-6 atlas-page atlas-page--overview">
      <PageHeader data-panel="intro" eyebrow={<span className="workspace-kicker"><span />TAMIL NADU / FIELD ATLAS</span>}
        title="Tamil Nadu overview"
        description="Explore the terrain. Understand the signals. A Tamil Nadu, built for exploration."
        actions={<Link to="/risk" className="btn-secondary">{t('Open map', 'வரைபடத்தைத் திறக்கவும்')} <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>} />

      <RegionRail data-panel="region-rail" />

      <section data-panel="terrain" className="basin-workbench overflow-hidden rounded-panel border border-shell-border" aria-label="Tamil Nadu · 3D map and selected region">
        <div className="workbench-toolbar flex flex-wrap items-center justify-between gap-3 border-b border-shell-border px-4 py-3">
          <div className="flex items-center gap-2.5"><Layers3 className="h-4 w-4 text-cyan" aria-hidden="true" /><h2 className="text-sm font-medium">{t('Tamil Nadu · 3D map', 'தமிழ்நாடு · 3D வரைபடம்')}</h2><span className="technical-tag">3D MAP</span></div>
          <div className="flex items-center gap-4 text-xs text-shell-muted"><span>{REGIONS.length} {t('sample districts', 'மாதிரி மாவட்டங்கள்')}</span><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-teal-bright" />{t('Fixed sample', 'நிலையான மாதிரி')}</span></div>
        </div>
        <div className="basin-workbench-grid grid min-w-0 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_278px]">
          <div className="terrain-stage relative min-w-0">
            <TerrainScene ref={scene} height={510} selectedRegionId={region.id} onSelectRegion={r => setSelectedRegionId(r.id)} showContours={layers.contours} showWater={layers.water} showGrid={layers.grid} />
            <div className="scene-identity pointer-events-none absolute left-5 top-5">
              <p className="font-mono text-[10px] tracking-[0.12em] text-cyan">TAMIL NADU / 3D ATLAS</p>
              <p className="mt-1 text-xs text-shell-muted">{t('Real outline · illustrative 3D depth', 'உண்மையான எல்லை · விளக்க 3D ஆழம்')}</p>
            </div>
            <MapControls layers={layers} onToggleLayer={key => setLayers(previous => ({ ...previous, [key]: !previous[key] }))}
              onReset={() => scene.current?.reset()} onZoom={factor => factor < 1 ? scene.current?.zoomIn() : scene.current?.zoomOut()}
              onRotate={() => scene.current?.rotate(0.35)} onTilt={() => scene.current?.tilt(0.1)} />
            <div className="terrain-north pointer-events-none absolute bottom-14 left-5 font-mono text-[9px] tracking-wider text-shell-faint" aria-hidden="true">ILLUSTRATIVE DEPTH / NOT ELEVATION</div>
          </div>
          <aside className="basin-context min-w-0 border-t border-shell-border p-5 xl:border-l xl:border-t-0" aria-label="Selected region summary">
            <p className="overline">{t('Selected district', 'தேர்ந்தெடுத்த மாவட்டம்')}</p>
            <h3 className="mt-2 text-xl font-medium tracking-tight" data-testid="selected-region-name">{regionName(region)}</h3>
            <p className="mt-1 text-xs text-shell-muted">{t('Tamil Nadu · sample district', 'தமிழ்நாடு · மாதிரி மாவட்டம்')}</p>
            <div className="overview-score"><ScoreOrbit score={region.illustrativeRiskScore} category={region.riskCategory} /><RiskBandIndicator category={region.riskCategory} /></div>
            <dl className="region-readings mt-5 divide-y divide-shell-border/70">
              <Reading label={t('24h rainfall', '24 மணி மழை')} icon={<CloudRain className="h-4 w-4 text-cyan" />} value={`${rainValue(region.sampleRainfall, units)} ${rainUnit(units)}`} />
              <Reading label={t('Gauge level', 'நீர்மட்டம்')} icon={<Droplets className="h-4 w-4 text-teal-bright" />} value={`${levelValue(region.sampleWaterLevel, units)} ${levelUnit(units)}`} />
              <Reading label={t('Sample points', 'மாதிரி நிலையங்கள்')} icon={<RadioTower className="h-4 w-4 text-glacier" />} value={String(region.monitoringPointCount)} />
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-shell-muted">{region.description}</p>
            <Link to="/prediction" className="btn-secondary mt-5 w-full">{t('Inspect district', 'மாவட்ட விவரங்கள்')} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </aside>
        </div>
        <div className="basin-summary grid grid-cols-2 border-t border-shell-border lg:grid-cols-4">
          <Summary label="Elevated sample bands" value={`${indicators.elevatedRegions} / ${REGIONS.length}`} detail="High & very high" />
          <Summary label="Monitoring points" value={String(indicators.monitoringPoints)} detail="Illustrative network" />
          <Summary label="Sample alerts" value={String(alerts.length)} detail="Local review queue" />
          <Summary label="Reference snapshot" value="12 Jun 2025" detail="09:30 · fixed dataset" />
        </div>
      </section>

      <section data-panel="signals" aria-label="Selected region analytical series">
        <SectionHeading title="The signals behind the scene" description={`${region.name} · fixed seven-day sample window`} action={<Link className="text-link" to="/prediction">View analysis <ArrowRight className="h-3.5 w-3.5" /></Link>} />
        <div className="overview-signals-grid grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
          <ChartContainer title="Rainfall accumulation" subtitle="Synthetic daily rainfall" eyebrow={rainUnit(units)} action={<Link className="text-link" to="/rainfall">Explore <ArrowUpRight className="h-3.5 w-3.5" /></Link>}><RainfallChart region={region} period="7d" height={210} /></ChartContainer>
          <ChartContainer title="River-level movement" subtitle="Synthetic gauge series" eyebrow={levelUnit(units)} action={<Link className="text-link" to="/river">Explore <ArrowUpRight className="h-3.5 w-3.5" /></Link>}><WaterLevelChart region={region} period="7d" height={210} /></ChartContainer>
          <BasinLens />
        </div>
      </section>

      <div data-panel="activity" className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section aria-label="Recent demonstration alerts">
          <SectionHeading title="Sample alert activity" action={<Link className="text-link" to="/alerts">All alerts <ArrowRight className="h-3.5 w-3.5" /></Link>} />
          <Surface className="overflow-hidden"><ul className="divide-y divide-shell-border/70">{alerts.slice(0, 4).map(alert => <li key={alert.id}><Link to="/alerts" className="activity-row flex flex-wrap items-start gap-3 px-4 py-4 hover:bg-navy-700/60"><BellRing className="mt-1 h-4 w-4 shrink-0 text-shell-faint" aria-hidden="true" /><div className="min-w-0 flex-1"><p className="text-[13px] font-medium leading-relaxed">{alert.title}</p><p className="mt-1 text-[11px] text-shell-muted">{REGIONS.find(r => r.id === alert.regionId)?.name} · {formatDateTime(alert.timestamp)}</p></div><SeverityIndicator severity={alert.severity} /></Link></li>)}</ul>{alerts.length === 0 && <p className="p-6 text-sm text-shell-muted">All sample alerts have been reviewed. Open Alerts to manage their local status.</p>}</Surface>
        </section>
        <Surface className="p-5"><SectionHeading title="Regional risk profile" description="Authored demonstration bands" /><BandDistribution counts={distribution} /><p className="mt-5 text-[11px] leading-relaxed text-shell-muted">These bands describe the sample dataset. No model or live feed is connected.</p></Surface>
      </div>

      <section data-panel="observations" aria-label="Recent community observations"><SectionHeading title="From the sample community" description="Fictional observations and records saved in this browser" action={<Link className="text-link" to="/reports">View reports <ArrowRight className="h-3.5 w-3.5" /></Link>} /><div className="grid grid-cols-1 gap-3 md:grid-cols-3">{allReports.slice(0, 3).map(report => <Surface key={report.id} className="p-4"><p className="font-mono text-[10px] text-cyan">{report.id}</p><p className="my-3 line-clamp-3 text-sm leading-relaxed text-shell-muted">{report.description}</p><span className="text-[11px] text-shell-faint">{report.isUserSubmitted ? 'Local, unverified record' : 'Synthetic observation'}</span></Surface>)}</div></section>
      <div data-panel="footnote" className="flex flex-wrap items-center justify-between gap-3 border-t border-shell-border pt-4 text-xs text-shell-muted"><span>{DEMO_CONFIG.basinName} · a frontend visualization study</span><div className="flex gap-5"><Link to="/preparedness" className="text-link">Preparedness</Link><Link to="/methodology" className="text-link">Data & methodology <ArrowUpRight className="h-3.5 w-3.5" /></Link></div></div>
    </div>
  )
}

function Reading({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-2 py-3"><dt className="flex items-center gap-2 text-xs text-shell-muted">{icon}{label}</dt><dd className="font-mono text-sm">{value}</dd></div>
}
function Summary({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="summary-item min-w-0 border-shell-border px-5 py-4"><p className="text-[11px] text-shell-muted">{label}</p><p className="my-1 font-mono text-lg font-medium">{value}</p><p className="text-[10px] text-shell-faint">{detail}</p></div>
}
