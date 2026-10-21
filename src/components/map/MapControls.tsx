/** Floating controls for the Tamil Nadu state scene. */

import { useEffect, useRef, useState } from 'react'
import { Compass, Grid3x3, Layers3, Minus, Plus, RotateCcw, Waves, RotateCw, Move, Mountain } from 'lucide-react'
import { RISK_CATEGORIES } from '../../data/demoData'
import type { RiskCategory } from '../../types'
import { cn } from '../../utils/cn'
import { useLocale } from '../../app/LocaleContext'

export interface MapLayerState {
  contours: boolean
  water: boolean
  grid: boolean
}

export interface MapControlsProps {
  layers: MapLayerState
  onToggleLayer: (layer: keyof MapLayerState) => void
  onReset: () => void
  onZoom: (factor: number) => void
  onRotate?: () => void
  onTilt?: () => void
  onPan?: () => void
  className?: string
}

export function MapControls({
  layers,
  onToggleLayer,
  onReset,
  onZoom,
  onRotate,
  onTilt,
  onPan,
  className,
}: MapControlsProps) {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className={cn('absolute right-3 top-3 z-10 flex flex-col items-end gap-2', className)}>
      <div className="flex flex-col overflow-hidden rounded-xl border border-shell-border bg-navy-950/88 backdrop-blur">
        <ControlButton label={t('Zoom in', 'பெரிதாக்கு')} onClick={() => onZoom(0.88)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
        </ControlButton>
        <ControlButton label={t('Zoom out', 'சிறிதாக்கு')} onClick={() => onZoom(1.14)} divider>
          <Minus className="h-4 w-4" aria-hidden="true" />
        </ControlButton>
        <ControlButton label={t('Reset map view', 'வரைபடத்தை மீட்டமை')} onClick={onReset} divider>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </ControlButton>
        {onRotate ? <ControlButton label={t('Rotate map', 'வரைபடத்தைச் சுழற்று')} onClick={onRotate} divider><RotateCw className="h-4 w-4" aria-hidden="true" /></ControlButton> : null}
        {onTilt ? <ControlButton label={t('Tilt map', 'வரைபடத்தைச் சாய்')} onClick={onTilt} divider><Mountain className="h-4 w-4" aria-hidden="true" /></ControlButton> : null}
        {onPan ? <ControlButton label={t('Pan map right', 'வரைபடத்தை வலப்புறம் நகர்த்து')} onClick={onPan} divider><Move className="h-4 w-4" aria-hidden="true" /></ControlButton> : null}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={t('Map layers', 'வரைபட அடுக்குகள்')}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-shell-border bg-navy-950/95 text-shell-muted transition-colors hover:border-glacier/50 hover:text-shell-text"
        >
          <Layers3 className="h-4 w-4" aria-hidden="true" />
        </button>
        {open ? (
          <div
            ref={panelRef}
            className="absolute right-0 top-11 w-52 overflow-hidden rounded-xl border border-shell-border bg-navy-900/96 shadow-panel backdrop-blur"
          >
            <p className="border-b border-shell-border px-3 py-2 text-[10.5px] font-bold uppercase tracking-[0.13em] text-shell-faint">
              {t('Visible layers', 'காணும் அடுக்குகள்')}
            </p>
            <div className="p-1.5">
              <LayerToggle
                active={layers.contours}
                onClick={() => onToggleLayer('contours')}
                icon={<Compass className="h-3.5 w-3.5" aria-hidden="true" />}
                label={t('Illustrative contours', 'விளக்க உயரக் கோடுகள்')}
              />
              <LayerToggle
                active={layers.water}
                onClick={() => onToggleLayer('water')}
                icon={<Waves className="h-3.5 w-3.5" aria-hidden="true" />}
                label={t('Sample district links', 'மாதிரி மாவட்ட இணைப்புகள்')}
              />
              <LayerToggle
                active={layers.grid}
                onClick={() => onToggleLayer('grid')}
                icon={<Grid3x3 className="h-3.5 w-3.5" aria-hidden="true" />}
                label={t('Reference grid', 'குறிப்புக் கட்டம்')}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ControlButton({
  label,
  onClick,
  children,
  divider = false,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  divider?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-11 w-11 items-center justify-center text-shell-muted transition-colors hover:bg-navy-700 hover:text-shell-text',
        divider && 'border-t border-shell-border/80',
      )}
    >
      {children}
    </button>
  )
}

function LayerToggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-medium transition-colors',
        active
          ? 'bg-glacier/12 text-shell-text'
          : 'text-shell-muted hover:bg-navy-700 hover:text-shell-text',
      )}
    >
      <span className={cn('shrink-0', active ? 'text-glacier' : 'text-shell-faint')}>{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      <span
        className={cn(
          'h-3.5 w-3.5 shrink-0 rounded-[5px] border transition-colors',
          active ? 'border-glacier bg-glacier/30' : 'border-shell-border',
        )}
        aria-hidden="true"
      />
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Legend                                                                     */
/* -------------------------------------------------------------------------- */

const LEGEND_ORDER: RiskCategory[] = ['low', 'moderate', 'high', 'very-high']

export function MapLegend({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const { t, ui } = useLocale()
  return (
    <div
      className={cn(
        'rounded-xl border border-shell-border bg-navy-950/80 p-2.5 backdrop-blur',
        className,
      )}
    >
      <p className="mb-2 px-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-shell-faint">
        {t('Illustrative risk band', 'விளக்க இடர் நிலை')}
      </p>
      <ul className="space-y-1.5">
        {LEGEND_ORDER.map((key) => {
          const meta = RISK_CATEGORIES[key]
          return (
            <li key={key} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: meta.color }}
                aria-hidden="true"
              />
              <span className="text-[11.5px] font-medium text-shell-muted">{ui(meta.label)}</span>
              {!compact ? (
                <span className="ml-auto text-[11px] tabular-nums text-shell-faint">
                  {meta.scoreRange}
                </span>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
