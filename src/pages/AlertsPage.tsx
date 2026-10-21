/**
 * ============================================================================
 * ALERT CENTRE
 * ============================================================================
 *
 * A professional alert-management surface over the authored sample records.
 *
 * The acknowledgement and dismissal workflow is unchanged from the original
 * build: it writes to this browser's LocalStorage and notifies nobody.
 */

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { BellRing, Check, Info, RotateCcw, Search, X } from 'lucide-react'
import { useApp } from '../app/AppContext'
import {
  ALERT_CATEGORY_LABELS,
  DEMO_ALERTS,
  DEMO_CONFIG,
  REGIONS,
  SEVERITY_META,
  SEVERITY_ORDER,
} from '../data/demoData'
import { getAlertSummary } from '../data/selectors'
import type { AlertCategory, AlertStatus, DemoAlert, Severity } from '../types'
import { formatDateTime } from '../utils/format'
import { levelUnit, levelValue, rainUnit, rainValue } from '../utils/measurements'
import { PageHeader } from '../components/ui/PageHeader'
import {
  EmptyState,
  MetricIndicator,
  RiskBandIndicator,
  SectionHeading,
  SeverityIndicator,
  Surface,
} from '../components/ui/primitives'
import { ChipToggle, FilterBar, SearchField, SelectField } from '../components/ui/Controls'

const EASE = [0.16, 1, 0.3, 1] as const

type StatusFilter = 'all' | AlertStatus

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: 'All statuses',
  demo: 'Unreviewed',
  acknowledged: 'Acknowledged',
  dismissed: 'Dismissed',
}

export function AlertsPage() {
  const {
    alertStatus,
    setAlertStatus,
    resetAlertStatus,
    acknowledgedCount,
    dismissedCount,
    pushToast,
  } = useApp()

  const [severityFilter, setSeverityFilter] = useState<Severity[]>([])
  const [categoryFilter, setCategoryFilter] = useState<AlertCategory[]>([])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const statusOf = (id: string, fallback: AlertStatus): AlertStatus => alertStatus[id] ?? fallback

  const summary = useMemo(() => getAlertSummary(alertStatus), [alertStatus])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DEMO_ALERTS.filter((alert) => {
      if (severityFilter.length > 0 && !severityFilter.includes(alert.severity)) return false
      if (categoryFilter.length > 0 && !categoryFilter.includes(alert.category)) return false
      if (regionFilter !== 'all' && alert.regionId !== regionFilter) return false
      if (statusFilter !== 'all' && statusOf(alert.id, alert.status) !== statusFilter) return false
      if (q) {
        const region = REGIONS.find((r) => r.id === alert.regionId)
        const haystack = `${alert.title} ${alert.description} ${alert.id} ${region?.name ?? ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [severityFilter, categoryFilter, regionFilter, statusFilter, query, alertStatus])

  // Keep a valid selection as the filters change.
  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedId(null)
      return
    }
    if (!selectedId || !filtered.some((alert) => alert.id === selectedId)) {
      setSelectedId(filtered[0].id)
    }
  }, [filtered, selectedId])

  const selected = filtered.find((alert) => alert.id === selectedId) ?? null

  const activeFilterCount =
    severityFilter.length +
    categoryFilter.length +
    (statusFilter !== 'all' ? 1 : 0) +
    (regionFilter !== 'all' ? 1 : 0) +
    (query.trim() ? 1 : 0)

  const toggleSeverity = (s: Severity) =>
    setSeverityFilter((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  const toggleCategory = (c: AlertCategory) =>
    setCategoryFilter((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const clearFilters = () => {
    setSeverityFilter([])
    setCategoryFilter([])
    setStatusFilter('all')
    setRegionFilter('all')
    setQuery('')
  }

  const handleStatus = (id: string, next: AlertStatus) => {
    setAlertStatus(id, next)
    pushToast({
      title: next === 'acknowledged' ? 'Sample alert acknowledged' : 'Sample alert dismissed',
      message:
        next === 'acknowledged'
          ? 'Stored in this browser only — no notification was sent to anyone.'
          : 'Hidden from the active list. Stored in this browser only.',
      tone: next === 'acknowledged' ? 'success' : 'info',
    })
  }

  return (
    <div className="page-workspace space-y-8 atlas-page atlas-page--alerts">
      <motion.div data-panel="intro"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <PageHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/25 bg-cyan/[0.07] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-cyan">
              <BellRing className="h-3 w-3" aria-hidden="true" />
              {DEMO_ALERTS.length} authored sample records
            </span>
          }
          title="Alert centre"
          description="These are hand-authored demonstration records written to exercise the alert interface. Nothing here was issued, sent or broadcast to any person, service or authority, and no real sensor produced any of these values."
          actions={
            <button
              type="button"
              onClick={() => {
                resetAlertStatus()
                pushToast({
                  title: 'Alert states reset',
                  message: 'All locally stored acknowledgements and dismissals were cleared.',
                  tone: 'info',
                })
              }}
              className="btn-secondary"
              disabled={acknowledgedCount + dismissedCount === 0}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset states
            </button>
          }
        />
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/*  Summary                                                      */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="metrics"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.06, ease: EASE }}
        className="metric-grid grid grid-cols-2 gap-px overflow-hidden rounded-card border border-shell-border bg-shell-border xl:grid-cols-4"
      >
        <MetricCell>
          <MetricIndicator
            label="Total sample records"
            value={summary.total}
            accent="neutral"
            context="Authored for this prototype"
          />
        </MetricCell>
        <MetricCell>
          <MetricIndicator
            label="Unreviewed"
            value={summary.total - acknowledgedCount - dismissedCount}
            accent="cyan"
            context="Awaiting a local decision"
          />
        </MetricCell>
        <MetricCell>
          <MetricIndicator
            label="Acknowledged"
            value={acknowledgedCount}
            accent="teal"
            context="Marked in this browser"
          />
        </MetricCell>
        <MetricCell>
          <MetricIndicator
            label="Dismissed"
            value={dismissedCount}
            accent="amber"
            context="Hidden in this browser"
          />
        </MetricCell>
      </motion.section>

      {/* ------------------------------------------------------------- */}
      {/*  Filters                                                      */}
      {/* ------------------------------------------------------------- */}
      <motion.div data-panel="filters"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
      >
        <FilterBar onClear={clearFilters} activeCount={activeFilterCount} label="Filter records">
          {SEVERITY_ORDER.map((s) => (
            <ChipToggle
              key={s}
              label={SEVERITY_META[s].label}
              color={SEVERITY_META[s].color}
              active={severityFilter.includes(s)}
              onClick={() => toggleSeverity(s)}
              count={summary.bySeverity[s] ?? 0}
            />
          ))}
          <span className="mx-1 hidden h-5 w-px bg-shell-border sm:block" />
          {(Object.keys(ALERT_CATEGORY_LABELS) as AlertCategory[]).map((c) => (
            <ChipToggle
              key={c}
              label={ALERT_CATEGORY_LABELS[c]}
              active={categoryFilter.includes(c)}
              onClick={() => toggleCategory(c)}
              count={DEMO_ALERTS.filter((a) => a.category === c).length}
            />
          ))}
          <SelectField
            label="Filter by status"
            hideLabel
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
            options={(Object.keys(STATUS_LABELS) as StatusFilter[]).map((s) => ({
              value: s,
              label: STATUS_LABELS[s],
            }))}
            className="w-auto"
          />
          <SelectField
            label="Filter by region"
            hideLabel
            value={regionFilter}
            onChange={setRegionFilter}
            options={[
              { value: 'all', label: 'All sample regions' },
              ...REGIONS.map((r) => ({ value: r.id, label: r.name })),
            ]}
            className="w-auto"
          />
          <SearchField
            label="Search sample alerts"
            value={query}
            onChange={setQuery}
            placeholder="Search records"
            className="max-w-[13rem]"
          />
        </FilterBar>
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/*  Master / detail                                              */}
      {/* ------------------------------------------------------------- */}
      <motion.div data-panel="desk"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16, ease: EASE }}
        className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
      >
        {/* The list */}
        <Surface className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-shell-border px-5 py-3.5">
            <h2 className="text-[13.5px] font-semibold text-shell-text">Records</h2>
            <span className="text-[11.5px] tabular-nums text-shell-faint">
              {filtered.length} shown
            </span>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search className="h-5 w-5" aria-hidden="true" />}
              title="No sample alerts match these filters"
              description="Adjust or clear the filters above to see the full set of authored demonstration records."
              action={
                <button type="button" onClick={clearFilters} className="btn-secondary">
                  Clear filters
                </button>
              }
            />
          ) : (
            <ul className="max-h-[36rem] divide-y divide-shell-border/60 overflow-y-auto">
              {filtered.map((alert) => {
                const region = REGIONS.find((r) => r.id === alert.regionId)
                const status = statusOf(alert.id, alert.status)
                const isSelected = alert.id === selectedId
                return (
                  <li key={alert.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(alert.id)}
                      aria-current={isSelected ? 'true' : undefined}
                      className={
                        'w-full px-5 py-3.5 text-left transition-colors ' +
                        (isSelected ? 'bg-cyan/[0.07]' : 'hover:bg-navy-700/40')
                      }
                    >
                      <span className="flex flex-wrap items-center gap-2">
                        <SeverityIndicator severity={alert.severity} />
                        <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-shell-faint">
                          {ALERT_CATEGORY_LABELS[alert.category]}
                        </span>
                        {status === 'acknowledged' ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-risk-low/35 bg-risk-low/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-risk-low">
                            <Check className="h-2.5 w-2.5" aria-hidden="true" />
                            Acknowledged
                          </span>
                        ) : null}
                        {status === 'dismissed' ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-shell-border bg-navy-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-shell-faint">
                            <X className="h-2.5 w-2.5" aria-hidden="true" />
                            Dismissed
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-2 block text-[13px] font-semibold leading-snug text-shell-text">
                        {alert.title}
                      </span>
                      <span className="mt-1 block text-[11px] text-shell-faint">
                        {region?.name} · {formatDateTime(alert.timestamp)} · {alert.id}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </Surface>

        {/* The detail */}
        {selected ? (
          <AlertDetail
            alert={selected}
            status={statusOf(selected.id, selected.status)}
            onStatus={handleStatus}
          />
        ) : (
          <Surface className="flex items-center justify-center p-5">
            <EmptyState
              icon={<BellRing className="h-5 w-5" aria-hidden="true" />}
              title="Select a record"
              description="Choose a sample alert from the list to see its full detail."
            />
          </Surface>
        )}
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/*  About the dataset                                            */}
      {/* ------------------------------------------------------------- */}
      <Surface data-panel="notes" className="p-5">
        <SectionHeading
          eyebrow="Reference"
          title="About this dataset"
          description="How the sample alert records relate to the rest of the demonstration build."
        />
        <ul className="grid grid-cols-1 gap-2 text-[12.5px] leading-relaxed text-shell-muted sm:grid-cols-2">
          {[
            `${DEMO_ALERTS.length} records were written by the project author for interface demonstration.`,
            `The reference timestamp is fixed at ${DEMO_CONFIG.referenceDateLabel} 09:30 so output never drifts.`,
            'Acknowledgement and dismissal are stored in this browser’s LocalStorage only.',
            DEMO_CONFIG.disclaimer,
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span
                className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cyan"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Surface>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Detail panel                                                              */
/* -------------------------------------------------------------------------- */

function AlertDetail({
  alert,
  status,
  onStatus,
}: {
  alert: DemoAlert
  status: AlertStatus
  onStatus: (id: string, next: AlertStatus) => void
}) {
  const { preferences } = useApp()
  const region = REGIONS.find((r) => r.id === alert.regionId)

  return (
    <Surface className="flex flex-col p-5">
      <div className="flex flex-wrap items-center gap-2">
        <SeverityIndicator severity={alert.severity} />
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-shell-faint">
          {ALERT_CATEGORY_LABELS[alert.category]}
        </span>
        {region ? <RiskBandIndicator category={region.riskCategory} size="sm" /> : null}
      </div>

      <h2 className="mt-3 text-[17px] font-bold leading-snug tracking-tight text-shell-text">
        {alert.title}
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-shell-muted">{alert.description}</p>

      <dl className="mt-5 grid grid-cols-2 gap-2">
        <DetailStat label="Sample rainfall" value={rainValue(alert.rainfallMm, preferences.units)} unit={rainUnit(preferences.units)} />
        <DetailStat label="Sample water level" value={levelValue(alert.waterLevelM, preferences.units)} unit={levelUnit(preferences.units)} />
        <DetailStat label="Region" value={region?.name ?? alert.regionId} />
        <DetailStat label="Recorded" value={formatDateTime(alert.timestamp)} />
      </dl>

      <p className="mt-4 text-[11px] leading-relaxed text-shell-faint">
        Record <strong className="font-semibold text-shell-muted">{alert.id}</strong> · source:{' '}
        {alert.sourceLabel}
      </p>

      <p className="mt-4 flex items-start gap-2 rounded-xl border border-cyan/20 bg-cyan/[0.05] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-shell-muted">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan" aria-hidden="true" />
        <span>{alert.guidance}</span>
      </p>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-shell-border/70 pt-4">
        <button
          type="button"
          onClick={() => onStatus(alert.id, 'acknowledged')}
          disabled={status === 'acknowledged'}
          className="btn-primary btn-sm flex-1"
        >
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Acknowledge
        </button>
        <button
          type="button"
          onClick={() => onStatus(alert.id, 'dismissed')}
          disabled={status === 'dismissed'}
          className="btn-secondary btn-sm flex-1"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Dismiss
        </button>
        <button
          type="button"
          onClick={() => onStatus(alert.id, 'demo')}
          disabled={status === 'demo'}
          className="btn-ghost btn-sm"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>
    </Surface>
  )
}

function DetailStat({
  label,
  value,
  unit,
}: {
  label: string
  value: string | number
  unit?: string
}) {
  return (
    <div className="rounded-xl border border-shell-border bg-navy-900/60 px-3 py-2">
      <dt className="text-[9.5px] font-semibold uppercase tracking-[0.11em] text-shell-faint">
        {label}
      </dt>
      <dd className="mt-1 text-[13px] font-semibold tabular-nums text-shell-text">
        {value}
        {unit ? <span className="ml-1 text-[11px] font-medium text-shell-muted">{unit}</span> : null}
      </dd>
    </div>
  )
}

function MetricCell({ children }: { children: React.ReactNode }) {
  return <div className="bg-navy-800 p-5">{children}</div>
}