import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Region } from '../types'

type Locale = 'ta' | 'en'
type LocaleState = { locale: Locale; setLocale: (value: Locale) => void; t: (english: string, tamil: string) => string; ui: (english: string) => string; regionName: (region: Region) => string }
const Context = createContext<LocaleState | null>(null)
const KEY = 'tn-flood-atlas:locale:v1'
const UI: Record<string,string> = {
  'The signals behind the scene':'மாதிரித் தரவு நிலை', 'Rainfall accumulation':'மழைப்பொழிவு அளவு', 'River-level movement':'நீர்மட்ட மாற்றம்',
  'Sample alert activity':'மாதிரி எச்சரிக்கைகள்', 'Regional risk profile':'மாவட்ட இடர் நிலைகள்', 'From the sample community':'மக்கள் மாதிரிக் குறிப்புகள்',
  'Risk assessment':'இடர் மதிப்பீடு', 'The sample series':'மாதிரித் தரவுத் தொடர்', 'Sample rainfall':'மாதிரி மழை', 'Sample water level':'மாதிரி நீர்மட்டம்',
  'An illustrative trend comparison':'விளக்கப் போக்கு ஒப்பீடு', 'Cross-region comparison':'மாவட்ட ஒப்பீடு', 'Rainfall intensity':'மழைத் தீவிரம்',
  'Where the total comes from':'மொத்தத்தின் விவரம்', 'Water-level trend':'நீர்மட்டப் போக்கு', 'Sample locations':'மாதிரி இடங்கள்',
  'Observation records':'பதிவான குறிப்புகள்', 'About this dataset':'இந்தத் தரவு பற்றி', 'Select a record':'ஒரு பதிவைத் தேர்ந்தெடுக்கவும்',
  'Before, during, and after':'முன் · போது · பின்', 'Pack a little peace of mind':'அவசரப் பொருட்கள்',
  'How the illustrative score is computed':'விளக்க மதிப்பெண் எவ்வாறு உருவாகிறது', 'Risk band interpretation':'இடர் நிலைகளின் விளக்கம்',
  'Where the numbers come from':'எண்கள் எங்கிருந்து வருகின்றன', 'Known limitations':'தெரிந்த வரம்புகள்',
  'Appearance':'தோற்றம்', 'Measurement system':'அளவீட்டு முறை', 'Default sample region':'இயல்புநிலை மாவட்டம்', 'Local demo data':'உள்ளூர் மாதிரித் தரவு',
  'Total records':'மொத்தப் பதிவுகள்', 'Unreviewed':'பார்க்காதவை', 'Reviewing':'பரிசீலனையில்',
  'Cumulative rainfall':'மொத்த மழை', 'Mean per sample':'மாதிரி சராசரி', 'Peak sample':'அதிகபட்ச மாதிரி',
  'Low risk':'குறைந்த இடர்', 'Moderate risk':'மிதமான இடர்', 'High risk':'அதிக இடர்', 'Very high risk':'மிக அதிக இடர்',
  'Info':'தகவல்', 'Low':'குறைவு', 'Moderate':'மிதம்', 'High':'அதிகம்', 'Critical':'மிக அவசரம்',
  'Rising':'உயர்கிறது', 'Falling':'குறைகிறது', 'Steady':'நிலையானது',
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    try { return window.localStorage.getItem(KEY) === 'en' ? 'en' : 'ta' } catch { return 'ta' }
  })
  useEffect(() => {
    document.documentElement.lang = locale
    try { window.localStorage.setItem(KEY, locale) } catch { /* private browsing can restrict storage */ }
  }, [locale])
  return <Context.Provider value={{ locale, setLocale, t: (en, ta) => locale === 'ta' ? ta : en, ui: en => locale === 'ta' ? UI[en] ?? en : en, regionName: region => locale === 'ta' ? region.tamilName : region.name }}>{children}</Context.Provider>
}

export function useLocale() {
  const value = useContext(Context)
  if (!value) throw new Error('useLocale requires LocaleProvider')
  return value
}
