import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider, useApp } from './app/AppContext'
import { LocaleProvider } from './app/LocaleContext'
import { AppLayout } from './components/layout/AppLayout'
const OverviewPage = lazy(() => import('./pages/OverviewPage').then(m => ({ default: m.OverviewPage })))
const RiskMapPage = lazy(() => import('./pages/RiskMapPage').then(m => ({ default: m.RiskMapPage })))
const PredictionPage = lazy(() => import('./pages/PredictionPage').then(m => ({ default: m.PredictionPage })))
const AlertsPage = lazy(() => import('./pages/AlertsPage').then(m => ({ default: m.AlertsPage })))
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage').then(m => ({ default: m.ResourcesPage })))
const PreparednessPage = lazy(() => import('./pages/PreparednessPage').then(m => ({ default: m.PreparednessPage })))
const MethodologyPage = lazy(() => import('./pages/MethodologyPage').then(m => ({ default: m.MethodologyPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })))
const RainfallPage = lazy(() => import('./pages/RainfallPage').then(m => ({ default: m.RainfallPage })))
const RiverPage = lazy(() => import('./pages/RiverPage').then(m => ({ default: m.RiverPage })))
const StationsPage = lazy(() => import('./pages/StationsPage').then(m => ({ default: m.StationsPage })))

/**
 * Applies the persisted appearance / reduced-motion preferences to the
 * document root so the CSS variables and animation overrides take effect.
 */
function ThemeBridge() {
  const { preferences } = useApp()

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('light-mode', preferences.appearance === 'light')
    root.classList.toggle('reduce-motion', preferences.reducedMotion)
    root.classList.toggle('compact-mode', preferences.density === 'compact')
  }, [preferences.appearance, preferences.reducedMotion, preferences.density])

  return null
}
export default function App() {
  return (
    <BrowserRouter>
      <LocaleProvider><AppProvider>
        <ThemeBridge />
        <Suspense fallback={<div className="mx-auto max-w-[1400px] px-6 py-12 text-sm text-shell-muted" role="status">Loading view…</div>}><Routes>
          <Route element={<AppLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="risk" element={<RiskMapPage />} />
            <Route path="prediction" element={<PredictionPage />} />
            <Route path="rainfall" element={<RainfallPage />} />
            <Route path="river" element={<RiverPage />} />
            <Route path="stations" element={<StationsPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="preparedness" element={<PreparednessPage />} />
            <Route path="methodology" element={<MethodologyPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes></Suspense>
      </AppProvider></LocaleProvider>
    </BrowserRouter>
  )
}
