import { useState } from 'react'
import { ArrowDown, ArrowUpRight, Backpack, Check, RotateCcw, ShieldCheck } from 'lucide-react'
import { useApp } from '../app/AppContext'
import { CHECKLIST_SECTIONS, EMERGENCY_KIT_ITEMS } from '../data/demoData'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionHeading } from '../components/ui/primitives'
import { ContourArtwork } from '../components/ui/ContourArtwork'
import { Link } from 'react-router-dom'

export function PreparednessPage() {
  const { checklistState, toggleChecklistItem, resetChecklists, pushToast } = useApp()
  const [openPhase, setOpenPhase] = useState(CHECKLIST_SECTIONS[0].id)
  const ids = [...CHECKLIST_SECTIONS.flatMap(section => section.items.map(item => item.id)), ...EMERGENCY_KIT_ITEMS.map(item => item.id)]
  const complete = ids.filter(id => checklistState[id]).length
  const progress = Math.round(complete / ids.length * 100)
  const kitDone = EMERGENCY_KIT_ITEMS.filter(item => checklistState[item.id]).length
  return (
    <div className="atlas-page atlas-page--preparedness preparation-workspace">
      <div data-panel="intro"><PageHeader title="Safety & preparedness" description="A thoughtful plan starts with small steps. Explore generic preparation guidance and keep your checklist in this browser. Local emergency instructions always take precedence." eyebrow={<span>Generic guidance / browser-local progress</span>} actions={<button className="btn-secondary" onClick={() => { resetChecklists(); pushToast({ title: 'Checklist progress cleared', message: 'All checklist ticks were reset in this browser.', tone: 'info' }) }}><RotateCcw size={15} aria-hidden="true" />Reset progress</button>} /></div>
      <aside className="preparation-summary" data-panel="progress">
        <div className="preparation-progress-card">
          <ContourArtwork variant="river" />
          <span className="overline">Your preparedness journal</span>
          <ProgressDial progress={progress} />
          <h2>{complete} of {ids.length} done</h2>
          <p>Progress, one step at a time. Your checklist is saved in this browser.</p>
          <div className="preparation-phase-counts">{CHECKLIST_SECTIONS.map((section, index) => <div key={section.id}><span>0{index + 1}</span><p>{section.title}</p><strong>{section.items.filter(item => checklistState[item.id]).length}<small> / {section.items.length}</small></strong></div>)}</div>
        </div>
        <div className="preparation-guidance"><ShieldCheck size={24} aria-hidden="true" /><h3>A plan, with perspective.</h3><p>This is generic demonstration guidance. Checklist completion is not a guarantee of safety. Follow official local instructions during a real emergency.</p><Link to="/resources" className="text-link">Browse the reference collection <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
      </aside>
      <section className="preparation-phases" data-panel="phases">
        <SectionHeading title="Before, during, and after" description="Three chapters in a more considered plan." />
        {CHECKLIST_SECTIONS.map((section, index) => {
          const expanded = openPhase === section.id
          const done = section.items.filter(item => checklistState[item.id]).length
          return <article className={`preparation-phase ${expanded ? 'is-open' : ''}`} key={section.id}>
            <button className="preparation-phase-trigger" aria-expanded={expanded} aria-controls={`phase-${section.id}`} onClick={() => setOpenPhase(expanded ? '' : section.id)}>
              <span className="phase-index">0{index + 1}</span><span><strong>{section.title}</strong><small>{done} of {section.items.length} steps complete</small></span><span className="phase-progress-line"><span style={{ width: `${done / section.items.length * 100}%` }} /></span><ArrowDown size={18} aria-hidden="true" />
            </button>
            {expanded && <div id={`phase-${section.id}`} className="preparation-phase-body"><p>{section.summary}</p><ul>{section.items.map(item => <li key={item.id}><ChecklistItem checked={Boolean(checklistState[item.id])} onChange={() => toggleChecklistItem(item.id)} label={item.label} description={item.description} /></li>)}</ul></div>}
          </article>
        })}
      </section>
      <section data-panel="kit" className="preparation-kit">
        <SectionHeading eyebrow="The essentials" title="Pack a little peace of mind" description="A generic household emergency-kit checklist." action={<span className="kit-count"><Backpack size={16} aria-hidden="true" />{kitDone} / {EMERGENCY_KIT_ITEMS.length} items</span>} />
        <ul className="preparation-kit-grid">{EMERGENCY_KIT_ITEMS.map(item => <li key={item.id}><ChecklistItem checked={Boolean(checklistState[item.id])} onChange={() => toggleChecklistItem(item.id)} label={item.label} description={item.description} /></li>)}</ul>
      </section>
    </div>
  )
}

function ChecklistItem({ checked, onChange, label, description }: { checked: boolean; onChange: () => void; label: string; description: string }) {
  return <label className={`atlas-checklist-item ${checked ? 'is-complete' : ''}`}><span className="atlas-check"><input type="checkbox" checked={checked} onChange={onChange} />{checked && <Check size={13} aria-hidden="true" />}</span><span><strong>{label}</strong><small>{description}</small></span></label>
}

function ProgressDial({ progress }: { progress: number }) {
  const circumference = 2 * Math.PI * 54
  return <div className="preparation-dial" role="img" aria-label={`${progress}% complete`}><svg viewBox="0 0 140 140" fill="none" aria-hidden="true"><circle cx="70" cy="70" r="65" stroke="currentColor" strokeOpacity=".12" strokeDasharray="1 5" /><circle cx="70" cy="70" r="54" stroke="currentColor" strokeOpacity=".12" strokeWidth="5" /><circle cx="70" cy="70" r="54" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${circumference * progress / 100} ${circumference}`} transform="rotate(-90 70 70)" /></svg><div><strong>{progress}<span>%</span></strong><small>COMPLETE</small></div></div>
}
