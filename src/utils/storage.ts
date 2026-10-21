/**
 * Safe LocalStorage helpers.
 *
 * Every access is wrapped in try/catch because LocalStorage throws in private
 * browsing modes, when storage is disabled, and when the quota is exceeded.
 * The app degrades gracefully to in-memory state when persistence is blocked.
 */

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed = JSON.parse(raw) as T
    if (parsed === null || parsed === undefined) return fallback
    return parsed
  } catch {
    return fallback
  }
}

export function writeJson(key: string, value: unknown): boolean {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* Storage unavailable — nothing to clean up. */
  }
}
