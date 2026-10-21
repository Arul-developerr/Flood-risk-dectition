/**
 * ============================================================================
 * SIDEBAR
 * ============================================================================
 *
 * A collapsible desktop rail that expands into a full navigation panel. All
 * twelve routes are always listed, grouped into four sections, so nothing is
 * hidden behind a disclosure.
 */

import { NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NAV_SECTIONS, type NavItem } from '../../app/navItems'
import { DEMO_CONFIG } from '../../data/demoData'
import { cn } from '../../utils/cn'
import { BrandMark, Wordmark } from './Brand'
import { useLocale } from '../../app/LocaleContext'
import { ContourArtwork } from '../ui/ContourArtwork'

export function Sidebar({
  className,
  collapsed = false,
  onToggle,
}: {
  className?: string
  collapsed?: boolean
  onToggle?: () => void
}) {
  const { t } = useLocale()
  return (
    <aside
      className={cn(
        'sidebar flex h-full flex-col border-r border-shell-border/70 bg-navy-950 transition-[width] duration-200 ease-out-expo',
        collapsed ? 'w-[78px]' : 'w-[228px]',
        className,
      )}
    >
      {/* Identity */}
      <div
        className={cn(
          'sidebar-identity flex min-h-[100px] items-center',
          collapsed ? 'justify-center px-3' : 'gap-3 px-4',
        )}
      >
        <BrandMark className="h-9 w-9 shrink-0" />
        <Wordmark collapsed={collapsed} />
      </div>

      {/* Collapse toggle */}
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          className={cn(
            'mx-3 mt-4 flex min-h-10 items-center gap-3 rounded-lg px-3 text-shell-muted transition-colors hover:bg-navy-800 hover:text-shell-text',
            collapsed && 'justify-center px-0',
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
              <span className="text-[11px] font-medium">{t('Your workspace', 'உங்கள் வரைபடம்')}</span>
            </>
          )}
        </button>
      ) : null}

      {/* Navigation */}
      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-4" aria-label="Primary">
        {NAV_SECTIONS.map((section) => (
          <div key={section.id} className="sidebar-group mb-5 last:mb-0">
            {!collapsed ? (
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-shell-faint">
                {t(section.label, ({ monitor: 'நிலை', analysis: 'பகுப்பாய்வு', community: 'மக்கள்', system: 'அமைப்பு' } as const)[section.id])}
              </p>
            ) : (
              <div className="mx-auto mb-2 h-px w-6 bg-shell-border" aria-hidden="true" />
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarLink key={item.to} item={item} collapsed={collapsed} />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Demonstration status */}
      {!collapsed ? (
        <div className="sidebar-edition-wrap p-3">
          <div className="sidebar-edition relative isolate overflow-hidden rounded-xl border border-cyan/20 bg-cyan/[0.05] p-3">
            <ContourArtwork />
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden="true" />
              {t('Demonstration only', 'விளக்க மாதிரி மட்டும்')}
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-shell-muted">
              {t('All readings are synthetic. Follow official advice in an emergency.', 'எல்லா அளவுகளும் செயற்கையானவை. அவசரநிலையில் அரசு அறிவுறுத்தலைப் பின்பற்றுங்கள்.')}
            </p>
            <p className="mt-2 border-t border-shell-border/70 pt-2 text-[10.5px] text-shell-faint">
              Snapshot {DEMO_CONFIG.referenceDateLabel} · 09:30
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center border-t border-shell-border/80 py-3">
          <span
            className="h-2 w-2 rounded-full bg-cyan"
            title="Demonstration data"
            aria-label="Demonstration data"
          />
        </div>
      )}
    </aside>
  )
}

function SidebarLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon
  const { t } = useLocale()
  return (
    <li>
      <NavLink
        to={item.to}
        end={item.to === '/'}
        title={collapsed ? t(item.label, item.tamilLabel) : item.description}
        aria-label={collapsed ? t(item.label, item.tamilLabel) : undefined}
        className={({ isActive }) =>
          cn(
            'group relative flex min-h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors duration-200',
            collapsed && 'justify-center px-0',
            isActive
              ? 'bg-cyan/10 text-shell-text'
              : 'text-shell-muted hover:bg-navy-800 hover:text-shell-text',
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive ? (
              <span
                className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-cyan"
                aria-hidden="true"
              />
            ) : null}
            <Icon
              className={cn(
                'h-[17px] w-[17px] shrink-0 transition-colors',
                isActive ? 'text-cyan' : 'text-shell-faint group-hover:text-glacier',
              )}
              aria-hidden="true"
            />
            {!collapsed ? <span className="truncate">{t(item.label, item.tamilLabel)}</span> : null}
          </>
        )}
      </NavLink>
    </li>
  )
}
