/**
 * ============================================================================
 * TOP BAR
 * ============================================================================
 *
 * The global command strip: current-section readout, search, the shared
 * sample region selector, the demonstration-data status, the appearance
 * toggle and the sample-alert inbox.
 *
 * The region selector writes to the shared application state, so a change
 * here propagates to every screen in the build.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, ChevronDown, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useApp } from '../../app/AppContext'
import { useLocale } from '../../app/LocaleContext'
import { NAV_SECTIONS, findNavItem } from '../../app/navItems'
import { DEMO_CONFIG, REGIONS } from '../../data/demoData'
import { getActiveAlerts } from '../../data/selectors'
import { cn } from '../../utils/cn'
import { RiskBandIndicator } from '../ui/primitives'
import { BrandMark } from './Brand'
import { useDialogFocus } from '../ui/useDialogFocus'

export function TopBar({
  onOpenDrawer,
  onOpenSearch,
}: {
  onOpenDrawer: () => void
  onOpenSearch: () => void
}) {
  const {
    preferences,
    updatePreferences,
    selectedRegionId,
    setSelectedRegionId,
    alertStatus,
    acknowledgedCount,
  } = useApp()
  const { locale, setLocale, t, regionName } = useLocale()

  const [regionOpen, setRegionOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const regionRef = useRef<HTMLDivElement | null>(null)
  const notifRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()

  const current = findNavItem(location.pathname)
  const section = NAV_SECTIONS.find((s) => s.items.some((i) => i.to === location.pathname))

  const activeAlerts = useMemo(() => getActiveAlerts(alertStatus).slice(0, 4), [alertStatus])
  const selected = REGIONS.find((r) => r.id === selectedRegionId) ?? REGIONS[0]

  // Close the popovers on an outside click or Escape.
  useEffect(() => {
    if (!regionOpen && !notifOpen) return
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (regionOpen && regionRef.current && !regionRef.current.contains(target)) {
        setRegionOpen(false)
      }
      if (notifOpen && notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false)
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setRegionOpen(false)
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [regionOpen, notifOpen])

  return (
    <header className="top-command-bar sticky top-0 z-30 border-b border-shell-border/70 bg-navy-950/95 backdrop-blur-sm">
      <div className="flex h-[72px] items-center gap-2 px-3 sm:gap-3 sm:px-5">
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open navigation menu"
          className="-ml-1 rounded-lg p-2.5 text-shell-muted transition-colors hover:bg-navy-800 hover:text-shell-text lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Current section */}
        <div className="hidden min-w-0 lg:block xl:min-w-[168px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-shell-faint">
            {t(section?.label ?? 'Tamil Nadu', 'தமிழ்நாடு')}
          </p>
          <p className="truncate text-[13.5px] font-semibold text-shell-text">
            {t(current?.label ?? 'Overview', current?.tamilLabel ?? 'முகப்பு')}
          </p>
        </div>

        <div className="mobile-atlas-brand lg:hidden">
          <BrandMark className="h-8 w-8" />
          <span>DEMO</span>
        </div>

        {/* Search */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="group ml-1 hidden min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-shell-border bg-navy-900/70 px-3 py-2 text-left text-[13px] text-shell-muted transition-colors hover:border-glacier/40 md:flex md:max-w-xs"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{t('Find a district', 'மாவட்டத்தைத் தேடுங்கள்')}</span>
          <kbd className="ml-auto hidden rounded border border-shell-border bg-navy-800 px-1.5 py-0.5 text-[10px] font-semibold text-shell-faint lg:inline">
            /
          </kbd>
        </button>

        <div className="flex-1 md:hidden" />

        {/* Demonstration data status */}
        <span className="hidden items-center gap-1.5 whitespace-nowrap rounded-lg border border-cyan/25 bg-cyan/[0.07] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-cyan xl:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden="true" />
          {t('Sample data', 'மாதிரித் தரவு')}
        </span>

        {/* Region selector */}
        <div className="relative" ref={regionRef}>
          <button
            type="button"
            onClick={() => setRegionOpen((o) => !o)}
            aria-expanded={regionOpen}
            aria-controls="sample-region-options"
            aria-label={`${t('Selected district', 'தேர்ந்தெடுத்த மாவட்டம்')}: ${regionName(selected)}. ${t('Change district', 'மாவட்டத்தை மாற்றுங்கள்')}`}
            className="flex items-center gap-2 rounded-xl border border-shell-border bg-navy-900/70 py-1.5 pl-2.5 pr-2 text-left transition-colors hover:border-glacier/40 sm:pl-3 sm:pr-2.5"
          >
            <span className="hidden min-w-0 sm:block">
              <span className="block text-[9.5px] font-semibold uppercase tracking-[0.13em] text-shell-faint">
                {t('District', 'மாவட்டம்')}
              </span>
              <span className="block max-w-[9rem] truncate text-[12.5px] font-semibold text-shell-text">
                {regionName(selected)}
              </span>
            </span>
            <span className="sm:hidden">
              <RiskBandIndicator category={selected.riskCategory} size="sm" />
            </span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 shrink-0 text-shell-faint transition-transform',
                regionOpen && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </button>

          {regionOpen ? (
            <div
              id="sample-region-options"
              role="group"
              aria-label="Select a sample region"
              className="absolute right-0 z-30 mt-2 max-h-80 w-[min(19rem,calc(100vw-1.5rem))] overflow-y-auto rounded-xl border border-shell-border bg-navy-900/97 p-1.5 shadow-panel backdrop-blur-xl"
            >
              <p className="px-2.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-shell-faint">
                {t('Choose a district', 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்')}
              </p>
              {REGIONS.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  aria-pressed={region.id === selectedRegionId}
                  onClick={() => {
                    setSelectedRegionId(region.id)
                    setRegionOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors',
                    region.id === selectedRegionId
                      ? 'bg-cyan/12 text-shell-text'
                      : 'text-shell-muted hover:bg-navy-800 hover:text-shell-text',
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold">{regionName(region)}</span>
                    <span className="block truncate text-[11px] text-shell-faint">
                      {region.district}
                    </span>
                  </span>
                  <RiskBandIndicator category={region.riskCategory} size="sm" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="tn-language-switch" role="group" aria-label="Language / மொழி">
          <button type="button" aria-pressed={locale === 'ta'} onClick={() => setLocale('ta')} lang="ta">தமிழ்</button>
          <button type="button" aria-pressed={locale === 'en'} onClick={() => setLocale('en')} lang="en">EN</button>
        </div>

        {/* Appearance toggle */}
        <button
          type="button"
          onClick={() =>
            updatePreferences({
              appearance: preferences.appearance === 'dark' ? 'light' : 'dark',
            })
          }
          aria-label={
            preferences.appearance === 'dark'
              ? 'Switch to light appearance'
              : 'Switch to dark appearance'
          }
          title={
            preferences.appearance === 'dark'
              ? 'Switch to light appearance'
              : 'Switch to dark appearance'
          }
          className="topbar-appearance flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-shell-muted transition-colors hover:bg-navy-800 hover:text-shell-text"
        >
          {preferences.appearance === 'dark' ? (
            <Sun className="h-4.5 w-4.5" aria-hidden="true" />
          ) : (
            <Moon className="h-4.5 w-4.5" aria-hidden="true" />
          )}
        </button>

        {/* Sample alert inbox */}
        <div className="topbar-alerts relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((o) => !o)}
            aria-label={`Sample alerts — ${activeAlerts.length} shown`}
            aria-expanded={notifOpen}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-shell-muted transition-colors hover:bg-navy-800 hover:text-shell-text"
          >
            <Bell className="h-4.5 w-4.5" aria-hidden="true" />
            {activeAlerts.length > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-risk-high px-1 text-[9px] font-bold text-[#07111B]">
                {activeAlerts.length}
              </span>
            ) : null}
          </button>

          {notifOpen ? (
            <div className="absolute right-0 z-30 mt-2 w-[min(21rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-shell-border bg-navy-900/97 shadow-panel backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-shell-border px-3.5 py-2.5">
                <p className="text-[12.5px] font-bold text-shell-text">Sample alerts</p>
                <Link
                  to="/alerts"
                  onClick={() => setNotifOpen(false)}
                  className="text-[11.5px] font-semibold text-glacier hover:underline"
                >
                  View all
                </Link>
              </div>
              <ul className="max-h-80 divide-y divide-shell-border/70 overflow-y-auto">
                {activeAlerts.length === 0 ? (
                  <li className="px-3.5 py-6 text-center text-[12px] text-shell-muted">
                    No active sample records.
                  </li>
                ) : (
                  activeAlerts.map((alert) => (
                    <li key={alert.id} className="px-3.5 py-2.5">
                      <p className="truncate text-[12.5px] font-semibold text-shell-text">
                        {alert.title}
                      </p>
                      <p className="truncate text-[11px] text-shell-faint">
                        {REGIONS.find((r) => r.id === alert.regionId)?.name} · {alert.id}
                      </p>
                    </li>
                  ))
                )}
              </ul>
              <div className="border-t border-shell-border bg-navy-950/60 px-3.5 py-2 text-[10.5px] leading-relaxed text-shell-faint">
                {DEMO_CONFIG.shortDisclaimer} · {acknowledgedCount} acknowledged locally
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

/** Compact search overlay used by the top bar and the "/" shortcut. */
export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const { setSelectedRegionId } = useApp()
  const searchRef = useRef<HTMLDivElement>(null)
  useDialogFocus(searchRef, open)

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return REGIONS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    )
  }, [query])

  if (!open) return null

  return (
    <div
      ref={searchRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search sample regions"
      tabIndex={-1}
      className="fixed inset-0 z-[60] flex items-start justify-center bg-navy-950/85 p-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-panel border border-shell-border bg-navy-900/97 shadow-panel backdrop-blur-xl">
        <div className="flex items-center gap-2.5 border-b border-shell-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-shell-faint" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sample regions"
            aria-label="Search sample regions"
            className="flex-1 bg-transparent text-[14px] text-shell-text placeholder:text-shell-faint focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded p-1 text-shell-muted transition-colors hover:bg-navy-800 hover:text-shell-text"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-[13px] text-shell-muted">
              {query.trim()
                ? 'No sample regions match that search.'
                : 'Type to search the sample region list.'}
            </p>
          ) : (
            <ul className="space-y-0.5">
              {results.map((region) => (
                <li key={region.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRegionId(region.id)
                      onClose()
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-navy-800"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold text-shell-text">
                        {region.name}
                      </span>
                      <span className="block truncate text-[11.5px] text-shell-faint">
                        {region.description}
                      </span>
                    </span>
                    <RiskBandIndicator
                      category={region.riskCategory}
                      score={region.illustrativeRiskScore}
                      size="sm"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
