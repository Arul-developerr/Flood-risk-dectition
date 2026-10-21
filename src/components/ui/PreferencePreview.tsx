import { useApp } from '../../app/AppContext'
import { useLocale } from '../../app/LocaleContext'
import { BrandMark } from '../layout/Brand'
import { ContourArtwork } from './ContourArtwork'
import { Check, SlidersHorizontal } from 'lucide-react'

export function PreferencePreview() {
  const { preferences, selectedRegion } = useApp()
  const { t, regionName } = useLocale()
  return <aside className="preference-preview">
    <div className="preference-preview-label"><SlidersHorizontal size={16} aria-hidden="true" /><span>{t('Your workspace, reflected.', 'உங்கள் விருப்பத் தோற்றம்')}</span></div>
    <div className="preference-miniature"><ContourArtwork /><div className="preference-miniature-brand"><BrandMark /><span>தமிழ்நாடு</span></div><p>{regionName(selectedRegion)}</p><div className="preference-miniature-tiles"><span>{t('Rainfall', 'மழை')}<i /></span><span>{t('River level', 'நீர்மட்டம்')}<i /></span></div><div className="preference-miniature-footer"><Check size={13} aria-hidden="true" />{t('Preferences saved locally', 'விருப்பங்கள் இந்த உலாவியில் சேமிக்கப்பட்டன')}</div></div>
    <dl><div><dt>Appearance</dt><dd>{preferences.appearance}</dd></div><div><dt>Measurements</dt><dd>{preferences.units}</dd></div><div><dt>Density</dt><dd>{preferences.density}</dd></div><div><dt>Motion</dt><dd>{preferences.reducedMotion ? 'Reduced' : 'System aware'}</dd></div></dl>
    <nav aria-label="Settings sections"><a href="#display-settings">01 <span>Appearance & motion</span></a><a href="#measurement-settings">02 <span>Units & region</span></a><a href="#local-data-settings">03 <span>Local data</span></a></nav>
  </aside>
}
