/**
 * ============================================================================
 * METHODOLOGY & LIMITATIONS
 * ============================================================================
 *
 * A transparent account of how the demonstration computes what it shows.
 *
 * The page deliberately presents clean diagrams and short sections rather
 * than a wall of text, and it separates "how the prototype is built" from
 * "how a real flood model works".
 */

import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Database,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react'
import { DEMO_CONFIG, METHODOLOGY_SECTIONS, MODEL_CAVEATS, RISK_CATEGORIES, RISK_CATEGORY_ORDER } from '../data/demoData'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionHeading, Surface } from '../components/ui/primitives'

const EASE = [0.16, 1, 0.3, 1] as const

const SECTION_ICONS = {
  database: Database,
  activity: Activity,
  shield: ShieldCheck,
  flask: FlaskConical,
} as const

export function MethodologyPage() {
  const [openId, setOpenId] = useState<string | null>(METHODOLOGY_SECTIONS[0]?.id ?? null)

  return (
    <div className="page-workspace space-y-8 atlas-page atlas-page--methodology">
      <motion.div data-panel="intro"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <PageHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/25 bg-cyan/[0.07] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-cyan">
              <BookOpen className="h-3 w-3" aria-hidden="true" />
              How this prototype works
            </span>
          }
          title="Methodology & data notes"
          description="This page explains how the prototype computes what it shows. Every number on every other screen comes from a small synthetic dataset that ships with the code — nothing is measured, forecast, ingested or transmitted."
        />
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/*  Lead warning                                                 */}
      {/* ------------------------------------------------------------- */}
      <motion.div data-panel="notice"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.06, ease: EASE }}
      >
        <Surface className="border-risk-moderate/30 bg-risk-moderate/[0.05] p-5">
          <div className="flex items-start gap-3.5">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-risk-moderate/35 bg-risk-moderate/10 text-risk-moderate">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[15px] font-bold text-shell-text">
                Read this before reading any other number
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-shell-muted">
                Tamil Nadu Flood Atlas uses a real state outline and real district names. District markers are approximate. Its 3D depth, rainfall series, risk scores, alerts, reports and resources are illustrative fixtures. It is not connected to sensors, forecast services or government systems. Treat every measurement as a placeholder.
              </p>
            </div>
          </div>
        </Surface>
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/*  How the score is computed (diagram)                            */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="lineage"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
        className="space-y-4"
      >
        <SectionHeading
          eyebrow="Section 01"
          title="How the illustrative score is computed"
          description="Authored scores and derived bands are separate from the synthetic rainfall and gauge series."
        />
        <Surface className="p-5">
          <ScoreDiagram />
        </Surface>
      </motion.section>

      {/* ------------------------------------------------------------- */}
      {/*  Risk bands                                                    */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="bands"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16, ease: EASE }}
        className="space-y-4"
      >
        <SectionHeading
          eyebrow="Section 02"
          title="Risk band interpretation"
          description="Reference bands authored for the prototype. They are not calibrated thresholds."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {RISK_CATEGORY_ORDER.map((key) => {
            const meta = RISK_CATEGORIES[key]
            return (
              <Surface key={key} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-shell-text">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: meta.color }}
                      aria-hidden="true"
                    />
                    {meta.label}
                  </span>
                  <span className="text-[12px] font-bold tabular-nums text-shell-faint">
                    {meta.scoreRange}
                  </span>
                </div>
                <p className="mt-2.5 text-[11.5px] leading-relaxed text-shell-muted">
                  {meta.description}
                </p>
              </Surface>
            )
          })}
        </div>
        <p className="text-[11.5px] leading-relaxed text-shell-faint">
          A region's band is derived from its illustrative score, so the map, the charts, the tables
          and the indicator tiles can never disagree with one another.
        </p>
      </motion.section>

      {/* ------------------------------------------------------------- */}
      {/*  Expandable detail                                             */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="details"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        className="space-y-4"
      >
        <SectionHeading
          eyebrow="Section 03"
          title="Where the numbers come from"
          description="Four aspects of the build, stated plainly."
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {METHODOLOGY_SECTIONS.map((section) => {
            const isOpen = openId === section.id
            const Icon = SECTION_ICONS[section.icon]
            return (
              <Surface key={section.id} className="p-0">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : section.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-3.5 p-5 text-left"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/[0.07] text-cyan">
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-bold text-shell-text">
                      {section.title}
                    </span>
                    <span className="mt-1 block text-[12.5px] leading-relaxed text-shell-muted">
                      {section.summary}
                    </span>
                  </span>
                  <span className="mt-1 shrink-0 rounded-lg border border-shell-border bg-navy-900/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-shell-faint">
                    {isOpen ? 'Hide' : 'Details'}
                  </span>
                </button>

                {isOpen ? (
                  <div className="border-t border-shell-border/70 px-5 py-4">
                    <ul className="space-y-2.5 text-[12.5px] leading-relaxed text-shell-muted">
                      {section.points.map((point) => (
                        <li key={point} className="flex gap-2.5">
                          <span
                            className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-cyan"
                            aria-hidden="true"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Surface>
            )
          })}
        </div>
      </motion.section>

      {/* ------------------------------------------------------------- */}
      {/*  Limitations                                                   */}
      {/* ------------------------------------------------------------- */}
      <motion.section data-panel="limits"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
        className="space-y-4"
      >
        <SectionHeading
          eyebrow="Section 04"
          title="Known limitations"
          description="Stated plainly so nothing here is mistaken for a validated system."
        />
        <Surface className="p-5">
          <ul className="grid grid-cols-1 gap-2.5 text-[12.5px] leading-relaxed text-shell-muted lg:grid-cols-2">
            {MODEL_CAVEATS.map((caveat) => (
              <li key={caveat} className="flex gap-2.5">
                <span
                  className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-risk-moderate"
                  aria-hidden="true"
                />
                <span>{caveat}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-shell-border/70 pt-4 text-[11.5px] leading-relaxed text-shell-faint">
            Reference snapshot: <strong className="font-semibold text-shell-muted">{DEMO_CONFIG.referenceDateLabel} at 09:30</strong>.{' '}
            {DEMO_CONFIG.disclaimer}
          </p>
        </Surface>
      </motion.section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Score diagram                                                              */
/* -------------------------------------------------------------------------- */

function ScoreDiagram() {
  const steps = [
    { number: '01', title: 'Authored region seeds', tag: 'Fixed values', description: 'Each selected district has an assigned score from 0 to 100. This value is authored in the sample data.' },
    { number: '02', title: 'A shared band mapping', tag: 'Display logic', description: 'The shared riskCategoryForScore function maps that score to low, moderate, high, or very high. No forecasting model is involved.' },
    { number: '03', title: 'Independent chart series', tag: 'Separate data', description: 'Rainfall and water-level charts use fixed synthetic series. They do not calculate the region score; the trend view separately blends normalized series at 55% / 45%.' },
  ]
  return (
    <div className="lineage-map">
      {steps.map(step => (
        <article key={step.number} className="lineage-step">
          <span className="lineage-number">{step.number}</span>
          <span className="overline">{step.tag}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </article>
      ))}
      <p className="lineage-caution">Every value is invented. Scores are illustrative, are not probabilities, and have no validated forecasting skill.</p>
    </div>
  )
}
