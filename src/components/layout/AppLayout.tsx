/**
 * ============================================================================
 * APPLICATION SHELL
 * ============================================================================
 *
 * The frame every screen sits inside: a collapsible desktop sidebar, a
 * sticky top bar, a centred content column and a global footer that keeps
 * the demonstration disclaimer visible on every route.
 */

import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MobileDrawer } from './MobileDrawer'
import { SearchOverlay } from './TopBar'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { ToastViewport } from '../ui/Toast'
import { RouteErrorBoundary } from '../ui/RouteErrorBoundary'
import { useApp } from '../../app/AppContext'
import { useLocale } from '../../app/LocaleContext'
import { MotionConfig } from 'motion/react'

export function AppLayout() {
  const { t } = useLocale()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const { preferences } = useApp()

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  // "/" opens the search overlay, Escape closes it.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)

      if (event.key === '/' && !typing) {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <MotionConfig reducedMotion={preferences.reducedMotion ? 'always' : 'user'}>
    <div className="app-shell flex min-h-screen text-shell-text">
      <a href="#main-content" className="skip-link">Skip to content</a>
      {/* Desktop sidebar */}
      <div className="sidebar-dock sticky top-0 hidden h-screen shrink-0 lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((value) => !value)}
        />
      </div>

      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onOpenDrawer={() => setDrawerOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <main id="main-content" tabIndex={-1} className="app-content flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div key={location.pathname} className="route-content mx-auto w-full max-w-[1600px]" data-route={location.pathname}>
            <RouteErrorBoundary key={location.pathname}><Outlet /></RouteErrorBoundary>
          </div>
        </main>

        <footer className="border-t border-shell-border bg-navy-950/40 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-[11.5px] leading-relaxed text-shell-faint">
              <strong className="font-semibold text-shell-muted">{t('Tamil Nadu Flood Atlas', 'தமிழ்நாடு வெள்ள வரைபடம்')}</strong> — {t('Real state outline; all readings, scores, alerts and facilities are synthetic demonstrations. Follow official advice in an emergency.', 'மாநில எல்லை உண்மையானது; அளவுகள், மதிப்பெண்கள், எச்சரிக்கைகள், வளங்கள் அனைத்தும் விளக்க மாதிரிகள். அவசரநிலையில் அரசு அறிவுறுத்தலைப் பின்பற்றுங்கள்.')}
            </p>
            <p className="shrink-0 text-[11px] text-shell-faint">
              Reference snapshot · 12 Jun 2025, 09:30
            </p>
          </div>
        </footer>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ToastViewport />
    </div>
    </MotionConfig>
  )
}
