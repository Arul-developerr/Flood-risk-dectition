import { forwardRef, useId, useImperativeHandle, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useApp } from '../../app/AppContext'
import { useLocale } from '../../app/LocaleContext'
import { REGIONS, RISK_CATEGORIES } from '../../data/demoData'
import { TAMIL_NADU_PATH } from '../../data/tamilNaduBoundary'
import { stationForRegion } from '../../data/stations'
import type { Region, RiskCategory } from '../../types'

export interface TerrainSceneProps {
  labelMode?: 'regions' | 'stations'
  className?: string
  visibleRegions?: Region[]
  selectedRegionId?: string
  onSelectRegion?: (region: Region) => void
  riskFilter?: RiskCategory[]
  showContours?: boolean
  showWater?: boolean
  showGrid?: boolean
  showLabels?: boolean
  height?: number
  compact?: boolean
  ariaLabel?: string
}
export interface TerrainSceneHandle {
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
  rotate: (delta: number) => void
  tilt: (delta: number) => void
  pan: (x: number, y: number) => void
}
const INIT = { rotation: -9, tilt: 24, zoom: 1, panX: 0, panY: 0 }
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const waves = Array.from({ length: 30 }, (_, index) => {
  const y = 70 + index * 18
  return `M40 ${y} C160 ${y-34} 235 ${y+35} 330 ${y-9} S500 ${y-18} 560 ${y+25}`
})

/** A real Natural Earth state silhouette extruded into interactive CSS 3D layers.
 * Contours, elevation depth, connectors and readings are decorative/synthetic.
 */
export const TerrainScene = forwardRef<TerrainSceneHandle, TerrainSceneProps>(function TerrainScene({
  className = '', labelMode = 'regions', visibleRegions, selectedRegionId, onSelectRegion,
  riskFilter, showContours = true, showWater = true, showGrid = false, showLabels = true,
  height = 520, compact = false, ariaLabel,
}, ref) {
  const { preferences } = useApp()
  const { t, regionName } = useLocale()
  const [camera, setCamera] = useState(INIT)
  const drag = useRef<{ x: number; y: number; rotation: number; tilt: number } | null>(null)
  const uid = useId().replace(/:/g, '')
  const clip = `tn-clip-${uid}`
  const fill = `tn-fill-${uid}`
  const regions = (visibleRegions ?? REGIONS).filter(region => !riskFilter?.length || riskFilter.includes(region.riskCategory))
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || event.pointerType === 'touch') return
    const dx = event.clientX - drag.current.x
    const dy = event.clientY - drag.current.y
    setCamera(old => ({ ...old, rotation: clamp(drag.current!.rotation + dx * .14, -34, 34), tilt: clamp(drag.current!.tilt - dy * .12, 0, 45) }))
  }
  const key = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Home') { setCamera(INIT); event.preventDefault() }
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { setCamera(old => ({ ...old, rotation: clamp(old.rotation + (event.key === 'ArrowRight' ? 6 : -6), -34, 34) })); event.preventDefault() }
    if (event.key === '+' || event.key === '=') { setCamera(old => ({ ...old, zoom: clamp(old.zoom * 1.12, .7, 1.55) })); event.preventDefault() }
    if (event.key === '-') { setCamera(old => ({ ...old, zoom: clamp(old.zoom / 1.12, .7, 1.55) })); event.preventDefault() }
  }
  useImperativeHandle(ref, () => ({
    zoomIn: () => setCamera(old => ({ ...old, zoom: clamp(old.zoom * 1.15, .7, 1.55) })),
    zoomOut: () => setCamera(old => ({ ...old, zoom: clamp(old.zoom / 1.15, .7, 1.55) })),
    reset: () => setCamera(INIT),
    rotate: delta => setCamera(old => ({ ...old, rotation: clamp(old.rotation + delta * 26, -34, 34) })),
    tilt: delta => setCamera(old => ({ ...old, tilt: clamp(old.tilt + delta * 85, 0, 45) })),
    pan: (x, y) => setCamera(old => ({ ...old, panX: clamp(old.panX + x * 30, -70, 70), panY: clamp(old.panY + y * 30, -70, 70) })),
  }), [])
  const objectTransform = `translate(calc(-50% + ${camera.panX}px), calc(-50% + ${camera.panY}px)) rotateX(${camera.tilt}deg) rotateZ(${camera.rotation}deg) scale(${camera.zoom})`
  return <div className={`terrain-frame tn-map-stage ${compact ? 'tn-map-compact' : ''} ${className}`} style={{ height }} data-ready="true" tabIndex={0} role="group" aria-label={ariaLabel ?? t('Interactive 3D Tamil Nadu map with approximate district markers', 'தமிழ்நாடு முப்பரிமாண வரைபடம்; தோராயமான மாவட்டக் குறியீடுகள்')} onKeyDown={key}
    onPointerDown={event => { if (event.pointerType === 'touch' || (event.target as HTMLElement).closest('button')) return; drag.current = { x: event.clientX, y: event.clientY, rotation: camera.rotation, tilt: camera.tilt }; event.currentTarget.setPointerCapture(event.pointerId) }}
    onPointerMove={move} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}>
    <div className="tn-map-grid" aria-hidden="true" />
    <div className="tn-map-compass" aria-hidden="true"><span>N</span><i /></div>
    <div className="tn-map-ocean" aria-hidden="true">BAY OF BENGAL <span>வங்காள விரிகுடா</span></div>
    <div className="tn-map-object" style={{ transform: objectTransform }}>
      {Array.from({ length: 9 }, (_, index) => <svg key={index} className="tn-map-depth" style={{ transform: `translateZ(${-32 + index * 4}px)` }} viewBox="0 0 560 640" aria-hidden="true"><path d={TAMIL_NADU_PATH} fill={preferences.appearance === 'light' ? '#B47786' : '#5D2C45'} stroke={preferences.appearance === 'light' ? '#965C75' : '#9A5A70'} strokeWidth="1.4" /></svg>)}
      <svg className="tn-map-face" viewBox="0 0 560 640" aria-hidden="true">
        <defs>
          <linearGradient id={fill} x1="0" y1="0" x2="1" y2="1"><stop stopColor={preferences.appearance === 'light' ? '#F9DCA2' : '#F5B544'} /><stop offset=".52" stopColor={preferences.appearance === 'light' ? '#E7A875' : '#B86D67'} /><stop offset="1" stopColor={preferences.appearance === 'light' ? '#F7E7C6' : '#763A55'} /></linearGradient>
          <clipPath id={clip}><path d={TAMIL_NADU_PATH} /></clipPath>
        </defs>
        <path d={TAMIL_NADU_PATH} fill={`url(#${fill})`} stroke={preferences.appearance === 'light' ? '#7A4058' : '#FFD996'} strokeWidth="2" />
        <g clipPath={`url(#${clip})`}>
          {showContours && waves.map((line, index) => <path key={index} d={line} fill="none" stroke={preferences.appearance === 'light' ? '#7A4058' : '#FFF1D6'} opacity={index % 4 === 0 ? .38 : .2} strokeWidth={index % 4 === 0 ? 1.4 : .8} />)}
          {showGrid && <g stroke="#FFF1D6" opacity=".28" strokeWidth="1">{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${70+i*60} 0V640`} />)}{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M0 ${55+i*70}H560`} />)}</g>}
          {showWater && regions.filter(r => r.id !== selectedRegionId).map(region => { const selected = REGIONS.find(r => r.id === selectedRegionId) ?? REGIONS[0]; return <path key={region.id} d={`M${90+selected.mapX*3.8},${40+selected.mapY*5.6} L${90+region.mapX*3.8},${40+region.mapY*5.6}`} stroke="#FF6B55" strokeWidth="1.8" opacity=".4" strokeDasharray="3 7" /> })}
        </g>
      </svg>
      <div className="tn-map-pins" role="group" aria-label={t('Sample district markers', 'மாதிரி மாவட்டக் குறியீடுகள்')}>
        {regions.map(region => <button key={region.id} type="button" className={`tn-map-pin ${selectedRegionId === region.id ? 'is-selected' : ''}`} style={{ left: `${(90+region.mapX*3.8)/560*100}%`, top: `${(40+region.mapY*5.6)/640*100}%`, ['--pin-color' as string]: RISK_CATEGORIES[region.riskCategory].color }} onClick={() => onSelectRegion?.(region)} aria-pressed={selectedRegionId === region.id} aria-label={`${t('Select', 'தேர்வு செய்')} ${regionName(region)}, ${RISK_CATEGORIES[region.riskCategory].label}`} title={regionName(region)}><i /><span>{showLabels ? labelMode === 'stations' ? stationForRegion(region.id).id : regionName(region) : ''}</span></button>)}
      </div>
    </div>
    <p className="tn-map-credit">{t('Natural Earth state outline · illustrative 3D depth & sample readings', 'Natural Earth மாநில எல்லை · விளக்க முப்பரிமாணத் தோற்றம் · மாதிரித் தரவு')}</p>
  </div>
})
