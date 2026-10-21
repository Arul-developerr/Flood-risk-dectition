import { useState } from 'react'
import { ArrowUpRight, ScanLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { useLocale } from '../../app/LocaleContext'
import { REGIONS } from '../../data/demoData'
import { rainUnit, rainValue, levelUnit, levelValue } from '../../utils/measurements'

export function BasinLens() {
  const { selectedRegion, preferences } = useApp()
  const { t, regionName } = useLocale()
  const [lens, setLens] = useState<'rain' | 'level'>('rain')
  const valueFor = (region: typeof selectedRegion) => lens === 'rain' ? region.sampleRainfall : region.sampleWaterLevel
  const mean = REGIONS.reduce((total, region) => total + valueFor(region), 0) / REGIONS.length
  const value = valueFor(selectedRegion)
  const maximum = Math.max(...REGIONS.map(valueFor))
  const format = (reading: number) => lens === 'rain' ? rainValue(reading, preferences.units) : levelValue(reading, preferences.units)
  const unit = lens === 'rain' ? rainUnit(preferences.units) : levelUnit(preferences.units)
  const difference = Math.round((value / mean - 1) * 100)
  return (
    <section className="basin-lens" aria-label={t('Compare selected district with the synthetic mean', 'தேர்ந்தெடுத்த மாவட்டத்தை மாதிரி சராசரியுடன் ஒப்பிடுங்கள்')}>
      <div className="lens-title"><span className="lens-icon"><ScanLine size={20} aria-hidden="true" /></span><div><span className="overline">{t('A closer look', 'ஒரு நெருக்கமான பார்வை')}</span><h2>{t('District lens', 'மாவட்ட ஒப்பீடு')}</h2></div></div>
      <div className="lens-switch" role="group" aria-label={t('Comparison measurement', 'ஒப்பீட்டு அளவீடு')}><button aria-pressed={lens === 'rain'} onClick={() => setLens('rain')}>{t('Rainfall', 'மழை')}</button><button aria-pressed={lens === 'level'} onClick={() => setLens('level')}>{t('Water level', 'நீர்மட்டம்')}</button></div>
      <div className="lens-comparison">
        {[{ label: regionName(selectedRegion), value, selected: true }, { label: t('Sample mean', 'மாதிரி சராசரி'), value: mean, selected: false }].map(row => <div key={row.label} className="lens-comparison-row"><div><span>{row.label}</span><strong>{format(row.value)} <small>{unit}</small></strong></div><div className="lens-track"><span style={{ width: `${row.value / maximum * 100}%` }} data-selected={row.selected} /></div></div>)}
      </div>
      <p className="lens-summary"><strong>{Math.abs(difference)}%</strong> {difference >= 0 ? t('above', 'அதிகம்') : t('below', 'குறைவு')} {t('the mean of the sample districts.', 'மாதிரி மாவட்டங்களின் சராசரியைவிட.')}</p>
      <Link to={lens === 'rain' ? '/rainfall' : '/river'} className="text-link">{t('Explore this sample series', 'மாதிரித் தொடரைப் பாருங்கள்')} <ArrowUpRight size={14} aria-hidden="true" /></Link>
    </section>
  )
}
