/**
 * ============================================================================
 * SUPPORT DIRECTORY
 * ============================================================================
 *
 * A conceptual directory of sample support services.
 *
 * Every entry is fictional. No shelter, address, opening hour, capacity,
 * stock figure or phone number here is real, and this prototype publishes
 * no emergency numbers.
 */

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Clock, LifeBuoy, MapPin, PackageSearch, Phone } from 'lucide-react'
import {
  REGIONS,
  RESOURCE_CATEGORY_LABELS,
  RESOURCE_CATEGORY_ORDER,
  SAMPLE_RESOURCES,
} from '../data/demoData'
import type { ResourceCategory } from '../types'
import { PageHeader } from '../components/ui/PageHeader'
import {
  EmptyState,
  MetricIndicator,
  SectionHeading,
  Surface,
} from '../components/ui/primitives'
import { ChipToggle, FilterBar, SearchField, SelectField } from '../components/ui/Controls'

const EASE = [0.16, 1, 0.3, 1] as const

const AVAILABILITY_STYLE: Record<
  'sample-available' | 'sample-unknown' | 'sample-closed',
  { cls: string; short: string }
> = {
  'sample-available': {
    cls: 'border-risk-low/35 bg-risk-low/10 text-risk-low',
    short: 'Shown as available',
  },
  'sample-unknown': {
    cls: 'border-shell-border bg-navy-700 text-shell-muted',
    short: 'Availability unknown',
  },
  'sample-closed': {
    cls: 'border-risk-moderate/35 bg-risk-moderate/10 text-risk-moderate',
    short: 'Shown as closed',
  },
}

export function ResourcesPage() {
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategory[]>([])
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SAMPLE_RESOURCES.filter((item) => {
      if (categoryFilter.length > 0 && !categoryFilter.includes(item.category)) return false
      if (regionFilter !== 'all' && item.regionId !== regionFilter) return false
      if (!q) return true
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.addressLabel.toLowerCase().includes(q)
      )
    })
  }, [categoryFilter, regionFilter, query])

  const activeFilterCount =
    categoryFilter.length + (regionFilter !== 'all' ? 1 : 0) + (query.trim() ? 1 : 0)

  const toggleCategory = (c: ResourceCategory) =>
    setCategoryFilter((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const clearFilters = () => {
    setCategoryFilter([])
    setRegionFilter('all')
    setQuery('')
  }

  const grouped = useMemo(
    () =>
      RESOURCE_CATEGORY_ORDER.map((category) => ({
        category,
        items: filtered.filter((item) => item.category === category),
      })).filter((group) => group.items.length > 0),
    [filtered],
  )

  return (
    <div className="page-workspace space-y-8 atlas-page atlas-page--resources">
      <motion.div data-panel="intro"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <PageHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/25 bg-cyan/[0.07] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-cyan">
              <LifeBuoy className="h-3 w-3" aria-hidden="true" />
              {SAMPLE_RESOURCES.length} conceptual entries
            </span>
          }
          title="Support directory"
          description="Every entry below is fictional and exists only to demonstrate the layout of a directory. No shelter, address, opening hour, capacity, stock figure or phone number here is real, and this prototype publishes no emergency numbers."
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
          <MetricIndicator label="Sample entries" value={SAMPLE_RESOURCES.length} accent="neutral" context="Conceptual records" />
        </MetricCell>
        <MetricCell>
          <MetricIndicator
            label="Categories"
            value={RESOURCE_CATEGORY_ORDER.length}
            accent="cyan"
            context="Types of support"
          />
        </MetricCell>
        <MetricCell>
          <MetricIndicator
            label="Shown as available"
            value={SAMPLE_RESOURCES.filter((r) => r.availability === 'sample-available').length}
            accent="teal"
            context="Illustrative state"
          />
        </MetricCell>
        <MetricCell>
          <MetricIndicator
            label="Availability unknown"
            value={SAMPLE_RESOURCES.filter((r) => r.availability === 'sample-unknown').length}
            accent="amber"
            context="Deliberately unconfigured"
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
        <FilterBar onClear={clearFilters} activeCount={activeFilterCount} label="Filter directory">
          {RESOURCE_CATEGORY_ORDER.map((c) => (
            <ChipToggle
              key={c}
              label={RESOURCE_CATEGORY_LABELS[c]}
              active={categoryFilter.includes(c)}
              onClick={() => toggleCategory(c)}
              count={SAMPLE_RESOURCES.filter((r) => r.category === c).length}
            />
          ))}
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
            label="Search sample resources"
            value={query}
            onChange={setQuery}
            placeholder="Search entries"
            className="max-w-[13rem]"
          />
        </FilterBar>
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/*  The directory                                                */}
      {/* ------------------------------------------------------------- */}
      <div data-panel="collection">{filtered.length === 0 ? (
        <EmptyState
          icon={<PackageSearch className="h-5 w-5" aria-hidden="true" />}
          title="No sample resources match your search"
          description="Try a different keyword, widen the category filter or clear the filters to see the full conceptual directory."
          action={
            <button type="button" onClick={clearFilters} className="btn-secondary">
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="resource-collection space-y-10">
          {grouped.map((group) => (
            <motion.section
              key={group.category}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="resource-chapter space-y-4"
            >
              <SectionHeading
                title={RESOURCE_CATEGORY_LABELS[group.category]}
                description={`${group.items.length} sample ${group.items.length === 1 ? 'entry' : 'entries'}`}
              />
              <div className="resource-chapter-grid grid grid-cols-1 gap-4 md:grid-cols-2">
                {group.items.map((item) => {
                  const region = REGIONS.find((r) => r.id === item.regionId)
                  const availability = AVAILABILITY_STYLE[item.availability]
                  return (
                    <Surface key={item.id} className="resource-card card-hover flex flex-col p-5">
                      <span className="resource-card-icon"><LifeBuoy size={22} aria-hidden="true" /></span>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[14px] font-semibold leading-snug text-shell-text">
                          {item.name}
                        </h3>
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${availability.cls}`}
                        >
                          {availability.short}
                        </span>
                      </div>

                      <p className="mt-2.5 text-[12.5px] leading-relaxed text-shell-muted">
                        {item.description}
                      </p>

                      <dl className="mt-4 space-y-2.5 border-t border-shell-border/60 pt-3.5 text-[12px] text-shell-muted">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-shell-faint" aria-hidden="true" />
                          <dd>
                            {item.addressLabel}
                            {region ? (
                              <span className="mt-0.5 block text-[11px] text-shell-faint">
                                {region.name} · {region.district}
                              </span>
                            ) : null}
                          </dd>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-shell-faint" aria-hidden="true" />
                          <dd>{item.openingHoursLabel}</dd>
                        </div>
                        <div className="flex items-start gap-2">
                          <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-shell-faint" aria-hidden="true" />
                          <dd>{item.contactLabel}</dd>
                        </div>
                      </dl>

                      <p className="mt-3.5 border-t border-shell-border/60 pt-3 text-[11.5px] text-shell-faint">
                        {item.capacityLabel}
                      </p>
                    </Surface>
                  )
                })}
              </div>
            </motion.section>
          ))}
        </div>
      )}</div>

      {/* ------------------------------------------------------------- */}
      {/*  Caveat                                                       */}
      {/* ------------------------------------------------------------- */}
      <Surface data-panel="notes" className="p-5">
        <SectionHeading
          eyebrow="Before you rely on any of this"
          title="This directory is a placeholder"
          description="A production resource service would be a different thing entirely."
        />
        <ul className="grid grid-cols-1 gap-2 text-[12.5px] leading-relaxed text-shell-muted sm:grid-cols-2">
          {[
            'A production build would connect to verified official directories for the deployed region, with live opening hours and occupancy.',
            'The "official information" entries are intentionally left unconfigured so that no unverified contact details are presented as real.',
            'Availability states here are authored strings, not a live feed from any facility.',
            'Always follow instructions issued by your official local emergency authority ahead of anything shown in this interface.',
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Surface>
    </div>
  )
}

function MetricCell({ children }: { children: React.ReactNode }) {
  return <div className="bg-navy-800 p-5">{children}</div>
}
