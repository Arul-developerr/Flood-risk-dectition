import { useEffect, useState } from 'react'
import { useApp } from './AppContext'

export function useMotionPreference() {
  const { preferences } = useApp()
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSystemReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return preferences.reducedMotion || systemReduced
}
