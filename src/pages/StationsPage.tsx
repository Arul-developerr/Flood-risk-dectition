/**
 * ============================================================================
 * MONITORING LOCATIONS
 * ============================================================================
 *
 * A searchable directory of the fictional sample locations, paired with the
 * state map so a location can be inspected spatially.
 *
 * These are NOT connected physical sensors. The page states that plainly.
 */

import { useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { RadioTower, MapPinned, Search } from 'lucide-react'
import { useApp } from '../app/AppContext'
import { useLocale } from '../app/LocaleContext'
import { DEMO_CONFIG, REGIONS, RISK_CATEGORIES, RISK_CATEGORY_ORDER } from '../data/demoData'
import type { RiskCategory } from '../types'
import { levelUnit, levelValue, rainUnit, rainValue } from '../utils/measurements'
import { PageHeader } from '../components/ui/PageHeader'
import { RiskBandIndicator, SectionHeading, Surface } from '../components/ui/primitives'
import { ChipToggle, SearchField } from '../components/ui/Controls'
import { TerrainScene, type TerrainSceneHandle } from '../components/map/TerrainScene'
import { MapLegend } from '../components/map/MapControls'
import { MapControls, type MapLayerState } from '../components/map/MapControls'
import { stationForRegion } from '../data/stations'
import { ChartContainer } from '../components/charts/ChartContainer'
import { WaterLevelChart } from '../components/charts/RainfallChart'

const EASE = [0.16, 1, 0.3, 1] as const

export function StationsPage() {
  const { selectedRegion, setSelectedRegionId, preferences } = useApp()
  const { t } = useLocale()
  const [query, setQuery] = useState('')
  const [band, setBand] = useState<RiskCategory | 'all'>('all')
  const sceneRef = useRef<TerrainSceneHandle>(null)
  const [layers, setLayers] = useState<MapLayerState>({ contours: true, water: true, grid: false })

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    return REGIONS.filter((region) => {
      const matchesText =
        !q ||
        region.name.toLowerCase().includes(q) || region.tamilName.includes(q) ||
        region.district.toLowerCase().includes(q) ||
        region.description.toLowerCase().includes(q) || stationForRegion(region.id).id.toLowerCase().includes(q)
      const matchesBand = band === 'all' || region.riskCategory === band
      return matchesText && matchesBand
    })
  }, [query, band])

  return (
    <div className="page-workspace space-y-8 atlas-page atlas-page--stations">
      <motion.div data-panel="intro"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <PageHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/25 bg-cyan/[0.07] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-cyan">
              <RadioTower className="h-3 w-3" aria-hidden="true" />
              Conceptual network · {DEMO_CONFIG.referenceDateLabel}
            </span>
          }
          title="Monitoring locations"
          description="Fictional locations and illustrative point counts for interface demonstration. No physical stations, gauges or sensor identifiers are connected, and no reading in this build originates from an instrument."
        />
      </motion.div>

      <motion.div data-panel="network"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
        className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,1fr)]"
      >
        {/* ------------------------------------------------------- */}
        {/*  The relief                                                */}
        {/* ------------------------------------------------------- */}
        <div className="relative self-start">
          <TerrainScene
            ref={sceneRef}
            height={520}
            visibleRegions={matches}
            labelMode="stations"
            showContours={layers.contours}
            showWater={layers.water}
            showGrid={layers.grid}
            selectedRegionId={selectedRegion.id}
            onSelectRegion={(region) => setSelectedRegionId(region.id)}
            ariaLabel={t('Tamil Nadu state outline with sample station markers', 'தமிழ்நாடு மாநில வரைபடத்தில் மாதிரி நிலையக் குறியீடுகள்')}
          />
          <MapControls layers={layers} onToggleLayer={key => setLayers(previous => ({ ...previous, [key]: !previous[key] }))} onReset={() => sceneRef.current?.reset()} onZoom={factor => factor < 1 ? sceneRef.current?.zoomIn() : sceneRef.current?.zoomOut()} />
          <div className="pointer-events-none absolute left-3 top-3">
            <div className="rounded-xl border border-shell-border bg-navy-950/85 px-3 py-2 backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan">
                {DEMO_CONFIG.basinName}
              </p>
              <p className="mt-0.5 text-[10.5px] text-shell-faint">
                {t('Approximate markers · synthetic readings', 'தோராயமான குறியீடுகள் · செயற்கை அளவுகள்')}
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-12 right-3 hidden sm:block">
            <MapLegend className="pointer-events-auto" compact />
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/*  The directory                                             */}
        {/* ------------------------------------------------------- */}
        <Surface className="flex min-w-0 flex-col p-5">
          <SectionHeading
            eyebrow="Directory"
            title="Sample locations"
            description={`${matches.length} of ${REGIONS.length} fictional locations`}
          />

          <SearchField
            label="Find a sample location"
            value={query}
            onChange={setQuery}
            placeholder="Search region or district"
            className="mb-3"
          />

          <div className="mb-4 flex flex-wrap gap-2">
            <ChipToggle
              label="All bands"
              active={band === 'all'}
              onClick={() => setBand('all')}
              count={REGIONS.length}
            />
            {RISK_CATEGORY_ORDER.map((key) => (
              <ChipToggle
                key={key}
                label={RISK_CATEGORIES[key].shortLabel}
                color={RISK_CATEGORIES[key].color}
                active={band === key}
                onClick={() => setBand(key)}
                count={REGIONS.filter((r) => r.riskCategory === key).length}
              />
            ))}
          </div>

          {matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-shell-border bg-navy-900/50 px-6 py-12 text-center">
              <Search className="mb-3 h-5 w-5 text-shell-faint" aria-hidden="true" />
              <p className="text-[13.5px] font-semibold text-shell-text">
                No matching sample locations
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-shell-muted">
                Try a different search term or widen the band filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setBand('all')
                }}
                className="btn-secondary btn-sm mt-4"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <ul className="no-scrollbar max-h-[26rem] space-y-2 overflow-y-auto pr-1">
              {matches.map((region) => {
                const isActive = region.id === selectedRegion.id
                return (
                  <li key={region.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedRegionId(region.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={
                        'w-full rounded-xl border p-3.5 text-left transition-all duration-200 ' +
                        (isActive
                          ? 'border-cyan/50 bg-cyan/[0.08]'
                          : 'border-shell-border bg-navy-900/50 hover:border-shell-muted/50')
                      }
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="min-w-0">
                          <span className="block truncate text-[13.5px] font-semibold text-shell-text">
                            {region.name}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-shell-faint">
                            {stationForRegion(region.id).id} · Synthetic gauge
                          </span>
                        </span>
                        <RiskBandIndicator category={region.riskCategory} size="sm" />
                      </span>
                      <span className="mt-2.5 grid grid-cols-3 gap-2 text-[11px]">
                        <span className="block">
                          <span className="block text-[9.5px] uppercase tracking-[0.1em] text-shell-faint">
                            Points
                          </span>
                          <span className="mt-0.5 block font-semibold tabular-nums text-shell-text">
                            {region.monitoringPointCount}
                          </span>
                        </span>
                        <span className="block">
                          <span className="block text-[9.5px] uppercase tracking-[0.1em] text-shell-faint">
                            24h rain
                          </span>
                          <span className="mt-0.5 block font-semibold tabular-nums text-shell-text">
                            {rainValue(region.sampleRainfall, preferences.units)}{' '}
                            {rainUnit(preferences.units)}
                          </span>
                        </span>
                        <span className="block">
                          <span className="block text-[9.5px] uppercase tracking-[0.1em] text-shell-faint">
                            Level
                          </span>
                          <span className="mt-0.5 block font-semibold tabular-nums text-shell-text">
                            {levelValue(region.sampleWaterLevel, preferences.units)}{' '}
                            {levelUnit(preferences.units)}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          <p className="mt-4 flex items-start gap-2 border-t border-shell-border/70 pt-3.5 text-[11px] leading-relaxed text-shell-faint">
            <MapPinned className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Marker positions are authored for the illustration. They are not real coordinates, and the
            counts are placeholders rather than an inventory of hardware.
          </p>
        </Surface>
      </motion.div>
      <ChartContainer data-panel="history" title={`${stationForRegion(selectedRegion.id).name} · recent readings`} subtitle="Representative fictional gauge · fixed seven-day series" footnote="Each region has one representative sample gauge. The illustrative point counts are separate conceptual metadata, not connected hardware.">
        <WaterLevelChart region={selectedRegion} period="7d" height={240} />
      </ChartContainer>
    </div>
  )
}
