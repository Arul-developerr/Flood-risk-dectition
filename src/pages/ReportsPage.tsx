/**
 * ============================================================================
 * COMMUNITY REPORTS
 * ============================================================================
 *
 * A demonstration reporting workflow. The submission behaviour is unchanged
 * from the original build: a report is written into this browser's
 * LocalStorage and is never transmitted to anyone.
 */

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  AlertCircle,
  Check,
  FileText,
  MessageSquareWarning,
  Paperclip,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import { useApp } from '../app/AppContext'
import { DEMO_CONFIG, REGIONS, REPORT_CATEGORY_LABELS } from '../data/demoData'
import type { CommunityReport, ReportCategory, ReportStatus } from '../types'
import { formatDateTime } from '../utils/format'
import { PageHeader } from '../components/ui/PageHeader'
import {
  EmptyState,
  MetricIndicator,
  SectionHeading,
  Surface,
} from '../components/ui/primitives'
import { ChipToggle, FilterBar, SelectField, SearchField } from '../components/ui/Controls'
import { Modal } from '../components/ui/Modal'

const EASE = [0.16, 1, 0.3, 1] as const

const REPORT_CATEGORY_ORDER: ReportCategory[] = [
  'waterlogging',
  'blocked-drainage',
  'heavy-rainfall',
  'road-accumulation',
  'other',
]

const STATUS_LABELS: Record<ReportStatus, string> = {
  unreviewed: 'Unreviewed',
  reviewing: 'Reviewing',
  resolved: 'Resolved',
}

const STATUS_STYLE: Record<ReportStatus, string> = {
  unreviewed: 'border-shell-border bg-navy-700 text-shell-muted',
  reviewing: 'border-glacier/35 bg-glacier/10 text-glacier',
  resolved: 'border-risk-low/35 bg-risk-low/10 text-risk-low',
}

export function ReportsPage() {
  const { allReports, userReports, addUserReport, removeUserReport, clearUserReports, pushToast } =
    useApp()

  const [categoryFilter, setCategoryFilter] = useState<ReportCategory[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('all')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [query, setQuery] = useState('')

  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ReportCategory>('waterlogging')
  const [regionId, setRegionId] = useState<string>('r-central')
  const [attachmentName, setAttachmentName] = useState<string>('')
  const [formError, setFormError] = useState<string>('')

  const counts = useMemo(() => {
    const byStatus: Record<ReportStatus, number> = {
      unreviewed: 0,
      reviewing: 0,
      resolved: 0,
    }
    allReports.forEach((report) => {
      byStatus[report.status] += 1
    })
    return byStatus
  }, [allReports])

  const filtered = useMemo(
    () =>
      allReports.filter((report) => {
        if (query.trim() && !`${report.id} ${report.description} ${report.reporterLabel}`.toLowerCase().includes(query.trim().toLowerCase())) return false
        if (categoryFilter.length > 0 && !categoryFilter.includes(report.category)) return false
        if (regionFilter !== 'all' && report.regionId !== regionFilter) return false
        if (statusFilter !== 'all' && report.status !== statusFilter) return false
        return true
      }),
    [allReports, categoryFilter, regionFilter, statusFilter, query],
  )

  const activeFilterCount =
    categoryFilter.length + (statusFilter !== 'all' ? 1 : 0) + (regionFilter !== 'all' ? 1 : 0) + (query.trim() ? 1 : 0)

  const toggleCategory = (c: ReportCategory) =>
    setCategoryFilter((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const clearFilters = () => {
    setQuery('')
    setCategoryFilter([])
    setStatusFilter('all')
    setRegionFilter('all')
  }

  const handleSubmit = () => {
    if (description.trim().length < 12) {
      setFormError('Please describe the observation in at least 12 characters.')
      document.getElementById('report-description')?.focus()
      return
    }
    const report: CommunityReport = {
      id: `RPT-LOCAL-${crypto.randomUUID()}`,
      category,
      regionId,
      description: description.trim(),
      timestamp: DEMO_CONFIG.referenceTimestamp.slice(0, 16),
      status: 'unreviewed',
      isSynthetic: true,
      reporterLabel: 'You (this browser · sample record)',
      attachmentName: attachmentName || undefined,
      isUserSubmitted: true,
    }
    addUserReport(report)
    setDescription('')
    setAttachmentName('')
    setFormError('')
    setFormOpen(false)
    pushToast({
      title: 'Sample report saved locally',
      message:
        'The record was written to this browser only. Nothing was sent to any authority, agency or third-party service.',
      tone: 'success',
    })
  }

  return (
    <div className="page-workspace space-y-8 atlas-page atlas-page--reports">
      <motion.div data-panel="intro"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <PageHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/25 bg-cyan/[0.07] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-cyan">
              <MessageSquareWarning className="h-3 w-3" aria-hidden="true" />
              {allReports.length} sample records
            </span>
          }
          title="Community reports"
          description="This page demonstrates a reporting workflow. The seeded observations were written by the project author, and anything you submit is stored in this browser only. No report is delivered to any authority, agency, service or third party, and no dispatcher reviews them."
          actions={
            <button type="button" onClick={() => setFormOpen(true)} className="btn-primary">
              <Plus className="h-4 w-4" aria-hidden="true" />
              New sample report
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
          <MetricIndicator label="Total records" value={allReports.length} accent="neutral" context="Authored and local" />
        </MetricCell>
        <MetricCell>
          <MetricIndicator label="Unreviewed" value={counts.unreviewed} accent="cyan" context="Awaiting review" />
        </MetricCell>
        <MetricCell>
          <MetricIndicator label="Reviewing" value={counts.reviewing} accent="glacier" context="Under review" />
        </MetricCell>
        <MetricCell>
          <MetricIndicator
            label="Saved in this browser"
            value={userReports.length}
            accent="teal"
            context="Created by you"
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
          {REPORT_CATEGORY_ORDER.map((c) => (
            <ChipToggle
              key={c}
              label={REPORT_CATEGORY_LABELS[c]}
              active={categoryFilter.includes(c)}
              onClick={() => toggleCategory(c)}
              count={allReports.filter((r) => r.category === c).length}
            />
          ))}
          <SelectField
            label="Filter by status"
            hideLabel
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as 'all' | ReportStatus)}
            options={[
              { value: 'all', label: 'All statuses' },
              ...(Object.keys(STATUS_LABELS) as ReportStatus[]).map((s) => ({
                value: s,
                label: STATUS_LABELS[s],
              })),
            ]}
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
        </FilterBar>
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/*  The record list                                              */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="records"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16, ease: EASE }}
        className="space-y-4"
      >
        <SectionHeading
          eyebrow="Section 01"
          title="Observation records"
          action={<SearchField label="Search community reports" value={query} onChange={setQuery} placeholder="Search observations…" className="w-full sm:w-64" />}
          description="Authored demonstration observations alongside anything you have saved locally."
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-5 w-5" aria-hidden="true" />}
            title="No sample reports match these filters"
            description="Clear the filters to see every authored and locally saved demonstration record."
            action={
              <button type="button" onClick={clearFilters} className="btn-secondary">
                Clear filters
              </button>
            }
          />
        ) : (
          <Surface className="observation-board overflow-hidden p-0">
            <ul className="observation-grid">
              {filtered.map((report, reportIndex) => {
                const region = REGIONS.find((r) => r.id === report.regionId)
                return (
                  <li
                    key={report.id}
                    className="observation-card"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="observation-card-heading"><span className="observation-number">FIELD NOTE / {String(reportIndex + 1).padStart(2, '0')}</span><MessageSquareWarning size={19} aria-hidden="true" /></div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-glacier/35 bg-glacier/10 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-glacier">
                          {REPORT_CATEGORY_LABELS[report.category]}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${STATUS_STYLE[report.status]}`}
                        >
                          {STATUS_LABELS[report.status]}
                        </span>
                        <span
                          className={
                            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ' +
                            (report.isUserSubmitted
                              ? 'border-teal-bright/35 bg-teal-bright/10 text-teal-bright'
                              : 'border-shell-border bg-navy-700 text-shell-faint')
                          }
                        >
                          {report.isUserSubmitted ? (
                            <>
                              <Check className="h-3 w-3" aria-hidden="true" />
                              Saved in this browser
                            </>
                          ) : (
                            'Authored sample'
                          )}
                        </span>
                      </div>

                      <p className="mt-2.5 text-[13.5px] leading-relaxed text-shell-text">
                        {report.description}
                      </p>

                      <p className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-shell-faint">
                        <span className="font-semibold text-shell-muted">{report.id}</span>
                        <span>{region?.name ?? report.regionId}</span>
                        <span>{formatDateTime(report.timestamp)}</span>
                        <span>Reporter: {report.reporterLabel}</span>
                        {report.attachmentName ? (
                          <span className="inline-flex items-center gap-1">
                            <Paperclip className="h-3 w-3" aria-hidden="true" />
                            {report.attachmentName}
                          </span>
                        ) : null}
                      </p>
                    </div>

                    {report.isUserSubmitted ? (
                      <button
                        type="button"
                        onClick={() => {
                          removeUserReport(report.id)
                          pushToast({
                            title: 'Local sample report removed',
                            message: 'The record was deleted from this browser.',
                            tone: 'info',
                          })
                        }}
                        className="btn-ghost btn-sm shrink-0 self-start"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Remove
                      </button>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </Surface>
        )}

        {userReports.length > 0 ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                clearUserReports()
                pushToast({
                  title: 'Local sample reports cleared',
                  message: 'Every record you created in this browser was deleted.',
                  tone: 'info',
                })
              }}
              className="btn-ghost btn-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Clear {userReports.length} local record{userReports.length === 1 ? '' : 's'}
            </button>
          </div>
        ) : null}
      </motion.section>

      {/* ------------------------------------------------------------- */}
      {/*  Submission form                                              */}
      {/* ------------------------------------------------------------- */}
      <Modal data-panel="modal"
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setFormError('')
        }}
        title="New sample report"
        description="This form is a demonstration only. Submitting writes a record into this browser's LocalStorage — it does not contact anyone."
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setFormOpen(false)
                setFormError('')
              }}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button type="button" onClick={handleSubmit} className="btn-primary">
              Save sample report
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <SelectField
            label="Observation type"
            value={category}
            onChange={(value) => setCategory(value as ReportCategory)}
            options={REPORT_CATEGORY_ORDER.map((c) => ({
              value: c,
              label: REPORT_CATEGORY_LABELS[c],
            }))}
          />

          <SelectField
            label="Sample region"
            value={regionId}
            onChange={setRegionId}
            options={REGIONS.map((r) => ({
              value: r.id,
              label: `${r.name} — ${r.district}`,
            }))}
          />

          <div>
            <label className="label" htmlFor="report-description">
              What did you observe?
            </label>
            <textarea
              id="report-description"
              className="input min-h-[120px] resize-y text-[13px]"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (formError) setFormError('')
              }}
              placeholder="Describe the waterlogging, blocked drain or rainfall you can see…"
              aria-invalid={Boolean(formError)}
              aria-describedby={formError ? 'report-error' : undefined}
            />
            {formError ? (
              <p
                id="report-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-[12px] font-medium text-risk-high"
              >
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                {formError}
              </p>
            ) : null}
          </div>

          <div>
            <label className="label" htmlFor="report-attachment">
              Attachment name (optional, sample)
            </label>
            <input
              id="report-attachment"
              className="input h-10 text-[13px]"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
              placeholder="e.g. sample-photo-01.png"
            />
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-shell-faint">
              Only the file name is stored. No file is uploaded, read or transmitted.
            </p>
          </div>

          <p className="flex items-start gap-2 rounded-xl border border-cyan/20 bg-cyan/[0.05] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-shell-muted">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan" aria-hidden="true" />
            <span>
              Do not use this form to report an emergency. In a real deployment you would contact
              your official local emergency authority. This prototype deliberately publishes no
              emergency numbers.
            </span>
          </p>
        </div>
      </Modal>
    </div>
  )
}

function MetricCell({ children }: { children: React.ReactNode }) {
  return <div className="bg-navy-800 p-5">{children}</div>
}
