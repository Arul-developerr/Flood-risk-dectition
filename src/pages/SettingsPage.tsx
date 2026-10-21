/**
 * ============================================================================
 * SETTINGS
 * ============================================================================
 *
 * Display, unit and demonstration preferences.
 *
 * Every control here has a working effect and persists to this browser's
 * LocalStorage. Nothing is transmitted and there is no account.
 */

import { useState } from 'react'
import { motion } from 'motion/react'
import {
  BellRing,
  ClipboardList,
  Eraser,
  MessageSquareWarning,
  Monitor,
  Moon,
  Ruler,
  Settings2,
  Sun,
  Zap,
  ZapOff,
} from 'lucide-react'
import { useApp } from '../app/AppContext'
import { DEFAULT_PREFERENCES, REGIONS, STORAGE_KEYS } from '../data/demoData'
import { PageHeader } from '../components/ui/PageHeader'
import { ConfirmDialog, SectionHeading, Surface } from '../components/ui/primitives'
import { SelectField } from '../components/ui/Controls'
import { cn } from '../utils/cn'
import { PreferencePreview } from '../components/ui/PreferencePreview'

const EASE = [0.16, 1, 0.3, 1] as const

type Choice<T extends string> = {
  value: T
  label: string
  description: string
  icon: typeof Sun
}

const APPEARANCE_CHOICES: Choice<'dark' | 'light'>[] = [
  { value: 'dark', label: 'Royal Burgundy', description: 'Midnight burgundy, royal wine and saffron gold. The default.', icon: Moon },
  {
    value: 'light',
    label: 'Ivory Daylight',
    description: 'Warm ivory alternative with burgundy text and borders.',
    icon: Sun,
  },
]

const UNIT_CHOICES: Choice<'metric' | 'imperial'>[] = [
  { value: 'metric', label: 'Metric', description: 'Millimetres and metres.', icon: Ruler },
  { value: 'imperial', label: 'Imperial', description: 'Inches and feet.', icon: Ruler },
]

const DENSITY_CHOICES: Choice<'comfortable' | 'compact'>[] = [
  { value: 'comfortable', label: 'Comfortable', description: 'Roomy cards and spacing.', icon: Monitor },
  { value: 'compact', label: 'Compact', description: 'Denser tables and lists.', icon: Monitor },
]

export function SettingsPage() {
  const {
    preferences,
    updatePreferences,
    resetPreferences,
    selectedRegionId,
    setSelectedRegionId,
    alertStatus,
    acknowledgedCount,
    dismissedCount,
    userReports,
    checklistState,
    resetAlertStatus,
    clearUserReports,
    resetChecklists,
    resetAllDemoData,
    pushToast,
  } = useApp()

  const [confirmReset, setConfirmReset] = useState(false)

  const checklistCount = Object.values(checklistState).filter(Boolean).length

  const handleResetAll = () => {
    resetAllDemoData()
    setConfirmReset(false)
    pushToast({
      title: 'All local demo data cleared',
      message:
        'Preferences, alert statuses, checklist ticks and locally created reports were removed from this browser.',
      tone: 'success',
    })
  }

  const choiceRow = <T extends string>(
    label: string,
    description: string,
    choices: Choice<T>[],
    current: T,
    onSelect: (value: T) => void,
  ) => (
    <div>
      <p className="text-[13.5px] font-semibold text-shell-text">{label}</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-shell-muted">{description}</p>
      <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {choices.map((choice) => {
          const Icon = choice.icon
          const active = choice.value === current
          return (
            <button
              key={choice.value}
              type="button"
              onClick={() => onSelect(choice.value)}
              aria-pressed={active}
              className={cn(
                'flex items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-200',
                active
                  ? 'border-cyan/50 bg-cyan/[0.08]'
                  : 'border-shell-border bg-navy-900/60 hover:border-shell-muted/50',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border',
                  active
                    ? 'border-cyan/35 bg-cyan/12 text-cyan'
                    : 'border-shell-border bg-navy-800 text-shell-faint',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-shell-text">
                  {choice.label}
                </span>
                <span className="mt-1 block text-[11.5px] leading-relaxed text-shell-muted">
                  {choice.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="page-workspace space-y-8 atlas-page atlas-page--settings">
      <motion.div data-panel="intro"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <PageHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/25 bg-cyan/[0.07] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-cyan">
              <Settings2 className="h-3 w-3" aria-hidden="true" />
              Local preferences
            </span>
          }
          title="Settings"
          description="Everything on this page is stored in this browser's LocalStorage. There is no account, no server and no sync, so changing a setting here affects only this device."
          actions={
            <button
              type="button"
              onClick={() => {
                resetPreferences()
                pushToast({
                  title: 'Preferences reset',
                  message: 'Appearance, units, density and motion settings returned to their defaults.',
                  tone: 'info',
                })
              }}
              className="btn-secondary"
            >
              <Eraser className="h-4 w-4" aria-hidden="true" />
              Reset preferences
            </button>
          }
        />
      </motion.div>

      <PreferencePreview data-panel="preview" />

      {/* ------------------------------------------------------------- */}
      {/*  Appearance + units                                            */}
      {/* ------------------------------------------------------------- */}
      <motion.div data-panel="preferences"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.06, ease: EASE }}
        className="grid grid-cols-1 gap-4 xl:grid-cols-2"
      >
        <Surface id="display-settings" className="p-5">
          <SectionHeading
            eyebrow="Display"
            title="Appearance"
            description="Theme and motion preferences for this browser."
          />
          <div className="space-y-7">
            {choiceRow(
              'Theme',
              'The palette is applied to the document root, so every page updates at once.',
              APPEARANCE_CHOICES,
              preferences.appearance,
              (value) => updatePreferences({ appearance: value }),
            )}

            <div className="border-t border-shell-border/70 pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-shell-text">Reduced motion</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-shell-muted">
                    Removes transitions, animated rings and chart draw-in effects. Your operating
                    system preference is respected automatically regardless of this switch.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences.reducedMotion}
                  onClick={() => updatePreferences({ reducedMotion: !preferences.reducedMotion })}
                  className={cn(
                    'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
                    preferences.reducedMotion ? 'bg-cyan' : 'bg-navy-600',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-200',
                      preferences.reducedMotion ? 'left-[22px]' : 'left-0.5',
                    )}
                  />
                  <span className="sr-only">Toggle reduced motion</span>
                </button>
              </div>
              <p className="mt-2.5 inline-flex items-center gap-1.5 text-[11.5px] text-shell-muted">
                {preferences.reducedMotion ? (
                  <>
                    <ZapOff className="h-3.5 w-3.5" aria-hidden="true" />
                    Animations are suppressed.
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                    Animations are enabled.
                  </>
                )}
              </p>
            </div>

            {choiceRow(
              'Information density',
              'Controls how tightly tables and panels are packed in this browser.',
              DENSITY_CHOICES,
              preferences.density,
              (value) => updatePreferences({ density: value }),
            )}
          </div>
        </Surface>

        <div className="space-y-4">
          <Surface id="measurement-settings" className="p-5">
            <SectionHeading
              eyebrow="Units"
              title="Measurement system"
              description="Display conversion for the shared demonstration measurements."
            />
            {choiceRow(
              'System',
              'The demonstration dataset remains metric internally; displayed rainfall and level values convert to the selected units.',
              UNIT_CHOICES,
              preferences.units,
              (value) => updatePreferences({ units: value }),
            )}
          </Surface>

          <Surface className="p-5">
            <SectionHeading
              eyebrow="Map"
              title="Default sample region"
              description="The region highlighted when the app loads."
            />
            <SelectField
              label="Region"
              value={selectedRegionId}
              onChange={(value) => {
                setSelectedRegionId(value)
                updatePreferences({ defaultRegionId: value })
              }}
              options={REGIONS.map((r) => ({
                value: r.id,
                label: `${r.name} — ${r.district}`,
              }))}
            />
            <p className="mt-3 text-[11.5px] leading-relaxed text-shell-faint">
              The factory default is{' '}
              <strong className="font-semibold text-shell-muted">
                {REGIONS.find(region => region.id === DEFAULT_PREFERENCES.defaultRegionId)?.name ?? 'Chennai'}
              </strong>
              , one of the sample districts. The state map, the charts and the indicator
              tiles all follow this selection.
            </p>
          </Surface>
        </div>
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/*  Local demo data                                               */}
      {/* ------------------------------------------------------------- */}
      <motion.div data-panel="storage"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
        className="space-y-4"
      >
        <SectionHeading
          eyebrow="Data"
          title="Local demo data"
          description="Everything this browser has stored for the demonstration build."
        />
        <Surface id="local-data-settings" className="p-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <DataTile icon={<BellRing className="h-3 w-3" aria-hidden="true" />} label="Acknowledged" value={acknowledgedCount} />
            <DataTile icon={<BellRing className="h-3 w-3" aria-hidden="true" />} label="Dismissed" value={dismissedCount} />
            <DataTile icon={<MessageSquareWarning className="h-3 w-3" aria-hidden="true" />} label="Local reports" value={userReports.length} />
            <DataTile icon={<ClipboardList className="h-3 w-3" aria-hidden="true" />} label="Checklist ticks" value={checklistCount} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                resetAlertStatus()
                pushToast({
                  title: 'Alert statuses reset',
                  message: 'All sample alerts returned to their authored status in this browser.',
                  tone: 'info',
                })
              }}
              className="btn-secondary btn-sm"
              disabled={Object.keys(alertStatus).length === 0}
            >
              <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
              Reset alert statuses
            </button>
            <button
              type="button"
              onClick={() => {
                resetChecklists()
                pushToast({
                  title: 'Checklist cleared',
                  message: 'Every preparedness tick was reset in this browser.',
                  tone: 'info',
                })
              }}
              className="btn-secondary btn-sm"
              disabled={checklistCount === 0}
            >
              <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
              Reset checklist
            </button>
            <button
              type="button"
              onClick={() => {
                clearUserReports()
                pushToast({
                  title: 'Local reports cleared',
                  message: 'Every report you created in this browser was deleted.',
                  tone: 'info',
                })
              }}
              className="btn-secondary btn-sm"
              disabled={userReports.length === 0}
            >
              <MessageSquareWarning className="h-3.5 w-3.5" aria-hidden="true" />
              Clear local reports
            </button>
          </div>

          <div className="mt-6 border-t border-shell-border/70 pt-5">
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="btn-danger btn-sm"
            >
              <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
              Clear all local demo data…
            </button>
            <p className="mt-3 text-[11.5px] leading-relaxed text-shell-muted">
              This removes the preferences, alert statuses, checklist ticks and locally created
              reports listed above, then restores the factory defaults. The authored sample dataset
              is unaffected because it is part of the source code.
            </p>
          </div>

          <p className="mt-5 border-t border-shell-border/70 pt-4 text-[11.5px] leading-relaxed text-shell-faint">
            Storage keys used by this build:{' '}
            {Object.values(STORAGE_KEYS).map((key) => (
              <code
                key={key}
                className="mx-0.5 rounded bg-navy-800 px-1.5 py-0.5 font-mono text-[10.5px] text-cyan"
              >
                {key}
              </code>
            ))}
          </p>
        </Surface>
      </motion.div>

      <ConfirmDialog data-panel="confirm"
        open={confirmReset}
        title="Clear every locally stored demo artefact?"
        description="This removes the preferences, alert statuses, checklist ticks and locally created reports, then restores the factory defaults. The authored sample dataset is unaffected because it is part of the source code. This cannot be undone."
        confirmLabel="Yes, clear everything"
        onConfirm={handleResetAll}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  )
}

function DataTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl border border-shell-border bg-navy-900/60 px-3.5 py-3">
      <p className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.11em] text-shell-faint">
        {icon}
        {label}
      </p>
      <p className="mt-1.5 text-[20px] font-bold leading-none tabular-nums text-shell-text">{value}</p>
    </div>
  )
}
