import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_PREFERENCES,
  DEMO_ALERTS,
  SAMPLE_REPORTS,
  STORAGE_KEYS,
  getRegion,
  REGIONS,
  CHECKLIST_SECTIONS,
  EMERGENCY_KIT_ITEMS,
} from '../data/demoData'
import type {
  AlertStatus,
  CommunityReport,
  Preferences,
  ToastMessage,
} from '../types'
import { readJson, removeKey, writeJson } from '../utils/storage'

interface AppContextValue {
  preferences: Preferences
  updatePreferences: (patch: Partial<Preferences>) => void
  resetPreferences: () => void

  /** Currently selected sample region id. */
  selectedRegionId: string
  setSelectedRegionId: (id: string) => void
  selectedRegion: ReturnType<typeof getRegion>

  /** Locally stored status overrides for the sample alerts. */
  alertStatus: Record<string, AlertStatus>
  setAlertStatus: (id: string, status: AlertStatus) => void
  resetAlertStatus: () => void
  acknowledgedCount: number
  dismissedCount: number

  /** User-created sample reports held locally. */
  userReports: CommunityReport[]
  addUserReport: (report: CommunityReport) => void
  removeUserReport: (id: string) => void
  clearUserReports: () => void
  allReports: CommunityReport[]

  /** Preparedness checklist state. */
  checklistState: Record<string, boolean>
  toggleChecklistItem: (id: string) => void
  resetChecklists: () => void

  toasts: ToastMessage[]
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void
  dismissToast: (id: string) => void

  /** Removes every locally persisted demo artefact. */
  resetAllDemoData: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

function isPreferences(value: unknown): value is Preferences {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Partial<Preferences>
  return (
    (v.appearance === 'dark' || v.appearance === 'light') &&
    REGIONS.some(region => region.id === v.defaultRegionId) &&
    (v.units === 'metric' || v.units === 'imperial') &&
    (v.density === 'comfortable' || v.density === 'compact') &&
    typeof v.reducedMotion === 'boolean'
  )
}

function isRecord(value: unknown): value is Record<string, boolean> {
  const ids = new Set([...CHECKLIST_SECTIONS.flatMap(section => section.items.map(item => item.id)), ...EMERGENCY_KIT_ITEMS.map(item => item.id)])
  return typeof value === 'object' && value !== null && !Array.isArray(value) &&
    Object.entries(value).every(([id, entry]) => ids.has(id) && typeof entry === 'boolean')
}

const ALERT_STATUSES: AlertStatus[] = ['demo', 'acknowledged', 'dismissed']

function isAlertStatusRecord(value: unknown): value is Record<string, AlertStatus> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  return Object.entries(value).every(
    ([id, entry]) => DEMO_ALERTS.some(alert => alert.id === id) && typeof entry === 'string' && ALERT_STATUSES.includes(entry as AlertStatus),
  )
}

function isReportArray(value: unknown): value is CommunityReport[] {
  return Array.isArray(value) && value.every(entry => {
    if (typeof entry !== 'object' || entry === null) return false
    const report = entry as Partial<CommunityReport>
    return typeof report.id === 'string' && report.id.startsWith('RPT-LOCAL-') &&
      typeof report.description === 'string' && report.description.trim().length >= 12 &&
      typeof report.timestamp === 'string' && !Number.isNaN(Date.parse(report.timestamp)) &&
      REGIONS.some(region => region.id === report.regionId) &&
      ['waterlogging', 'blocked-drainage', 'heavy-rainfall', 'road-accumulation', 'other'].includes(report.category ?? '') &&
      ['unreviewed', 'reviewing', 'resolved'].includes(report.status ?? '') &&
      report.isSynthetic === true && report.isUserSubmitted === true &&
      typeof report.reporterLabel === 'string' &&
      (report.attachmentName === undefined || typeof report.attachmentName === 'string')
  })
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const stored = readJson<unknown>(STORAGE_KEYS.preferences, DEFAULT_PREFERENCES)
    const value = isPreferences(stored) ? stored : DEFAULT_PREFERENCES
    try {
      if (window.localStorage.getItem('tn-flood-atlas:royal-burgundy:v1') !== 'applied') return { ...value, appearance: 'dark' }
    } catch { /* storage may be unavailable */ }
    return value
  })

  const [selectedRegionId, setSelectedRegionId] = useState<string>(
    () => preferences.defaultRegionId,
  )

  const [alertStatus, setAlertStatusState] = useState<Record<string, AlertStatus>>(() => {
    const stored = readJson<unknown>(STORAGE_KEYS.alertState, {})
    return isAlertStatusRecord(stored) ? stored : {}
  })

  const [userReports, setUserReports] = useState<CommunityReport[]>(() => {
    const stored = readJson<unknown>(STORAGE_KEYS.userReports, [])
    return isReportArray(stored) ? stored : []
  })

  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(() => {
    const stored = readJson<unknown>(STORAGE_KEYS.checklists, {})
    return isRecord(stored) ? stored : {}
  })

  const [toasts, setToasts] = useState<ToastMessage[]>([])

  /* --------------------------- persistence --------------------------- */

  useEffect(() => {
    writeJson(STORAGE_KEYS.preferences, preferences)
    try { window.localStorage.setItem('tn-flood-atlas:royal-burgundy:v1', 'applied') } catch { /* storage may be unavailable */ }
  }, [preferences])

  useEffect(() => {
    writeJson(STORAGE_KEYS.alertState, alertStatus)
  }, [alertStatus])

  useEffect(() => {
    writeJson(STORAGE_KEYS.userReports, userReports)
  }, [userReports])

  useEffect(() => {
    writeJson(STORAGE_KEYS.checklists, checklistState)
  }, [checklistState])

  /* ----------------------------- actions ----------------------------- */

  const updatePreferences = useCallback((patch: Partial<Preferences>) => {
    setPreferences((prev) => ({ ...prev, ...patch }))
  }, [])

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES)
    setSelectedRegionId(DEFAULT_PREFERENCES.defaultRegionId)
  }, [])

  const setAlertStatus = useCallback((id: string, status: AlertStatus) => {
    setAlertStatusState((prev) => ({ ...prev, [id]: status }))
  }, [])

  const resetAlertStatus = useCallback(() => {
    setAlertStatusState({})
  }, [])

  const addUserReport = useCallback((report: CommunityReport) => {
    setUserReports((prev) => [report, ...prev])
  }, [])

  const removeUserReport = useCallback((id: string) => {
    setUserReports((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const clearUserReports = useCallback(() => {
    setUserReports([])
  }, [])

  const toggleChecklistItem = useCallback((id: string) => {
    setChecklistState((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const resetChecklists = useCallback(() => {
    setChecklistState({})
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const pushToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts((prev) => [...prev, { ...toast, id }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 6000)
  }, [])

  const resetAllDemoData = useCallback(() => {
    removeKey(STORAGE_KEYS.alertState)
    removeKey(STORAGE_KEYS.checklists)
    removeKey(STORAGE_KEYS.userReports)
    removeKey(STORAGE_KEYS.preferences)
    setAlertStatusState({})
    setChecklistState({})
    setUserReports([])
    setPreferences(DEFAULT_PREFERENCES)
    setSelectedRegionId(DEFAULT_PREFERENCES.defaultRegionId)
  }, [])

  /* ---------------------------- derived ------------------------------ */

  const selectedRegion = useMemo(() => getRegion(selectedRegionId), [selectedRegionId])

  const allReports = useMemo(() => [...userReports, ...SAMPLE_REPORTS], [userReports])

  const acknowledgedCount = useMemo(
    () => DEMO_ALERTS.filter((a) => (alertStatus[a.id] ?? a.status) === 'acknowledged').length,
    [alertStatus],
  )

  const dismissedCount = useMemo(
    () => DEMO_ALERTS.filter((a) => (alertStatus[a.id] ?? a.status) === 'dismissed').length,
    [alertStatus],
  )

  const value: AppContextValue = {
    preferences,
    updatePreferences,
    resetPreferences,
    selectedRegionId,
    setSelectedRegionId,
    selectedRegion,
    alertStatus,
    setAlertStatus,
    resetAlertStatus,
    acknowledgedCount,
    dismissedCount,
    userReports,
    addUserReport,
    removeUserReport,
    clearUserReports,
    allReports,
    checklistState,
    toggleChecklistItem,
    resetChecklists,
    toasts,
    pushToast,
    dismissToast,
    resetAllDemoData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp must be used inside <AppProvider>')
  }
  return ctx
}
