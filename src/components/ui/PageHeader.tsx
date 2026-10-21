import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { useLocation } from 'react-router-dom'
import { findNavItem, NAV_ITEMS } from '../../app/navItems'
import { useApp } from '../../app/AppContext'
import { ArrowUpRight } from 'lucide-react'
import { useLocale } from '../../app/LocaleContext'
import { TAMIL_NADU_PATH } from '../../data/tamilNaduBoundary'

const PAGES: Record<string, { ta: string; en: string; taDescription: string; enDescription: string; kicker: string }> = {
  '/': { ta: 'தமிழ்நாட்டை அறிந்துகொள்ளுங்கள்.', en: 'See Tamil Nadu clearly.', taDescription: 'உங்கள் மாவட்டத்தைத் தேர்ந்தெடுத்து விளக்க மழை, நீர்மட்டம் மற்றும் இடர் மாதிரிகளை ஒரே இடத்தில் பாருங்கள்.', enDescription: 'Choose a district to explore illustrative rainfall, river readings and risk patterns across Tamil Nadu.', kicker: 'THE STATE AT A GLANCE' },
  '/risk': { ta: 'மாவட்ட இடர் வரைபடம்', en: 'Explore the state map', taDescription: 'தமிழ்நாட்டின் உண்மையான மாநில எல்லையில் மாதிரி மாவட்டக் குறியீடுகளை ஆராயுங்கள்.', enDescription: 'Explore sample districts on the real Tamil Nadu state outline.', kicker: 'SPATIAL EXPLORER' },
  '/prediction': { ta: 'இடர் மதிப்பீடு', en: 'Risk assessment', taDescription: 'தேர்ந்தெடுத்த மாவட்டத்தின் விளக்க மதிப்பெண் மற்றும் மாதிரித் தரவுத் தொடரைக் காணுங்கள்.', enDescription: 'Examine an authored district score and independent synthetic trend series.', kicker: 'SAMPLE ANALYSIS' },
  '/rainfall': { ta: 'மழைப்பொழிவு', en: 'Rainfall analysis', taDescription: 'தேர்ந்தெடுத்த மாவட்டத்தின் செயற்கை மழைப்பொழிவுத் தொடரை ஒப்பிடுங்கள்.', enDescription: 'Compare synthetic rainfall series for the selected district.', kicker: 'RAIN JOURNAL' },
  '/river': { ta: 'நீர்மட்டம்', en: 'River levels', taDescription: 'மாதிரி நீர்மட்ட அளவுகளையும் காலத் தொடரையும் பாருங்கள்.', enDescription: 'Read the synthetic gauge values and their sample timeline.', kicker: 'WATER JOURNAL' },
  '/stations': { ta: 'கண்காணிப்பு இடங்கள்', en: 'Monitoring locations', taDescription: 'மாவட்டங்களோடு இணைக்கப்பட்ட கற்பனை மாதிரி அளவிடும் இடங்களை ஆராயுங்கள்.', enDescription: 'Explore fictional sample gauges associated with real districts.', kicker: 'SAMPLE NETWORK' },
  '/alerts': { ta: 'எச்சரிக்கை மாதிரிகள்', en: 'Sample alerts', taDescription: 'பயிற்சிக்காக உருவாக்கப்பட்ட பதிவுகளைப் பாருங்கள். இவை உண்மையான எச்சரிக்கைகள் அல்ல.', enDescription: 'Review invented alert records. These are not official warnings.', kicker: 'DEMONSTRATION DESK' },
  '/reports': { ta: 'மக்கள் குறிப்புகள்', en: 'Community notes', taDescription: 'மாதிரிக் குறிப்புகளைப் பாருங்கள்; உங்கள் பயிற்சிக் குறிப்பை இந்த உலாவியில் சேமியுங்கள்.', enDescription: 'Browse sample notes and save your own practice record in this browser.', kicker: 'LOCAL NOTEBOOK' },
  '/resources': { ta: 'உதவி வளங்கள்', en: 'Support resources', taDescription: 'உதவி அமைப்பைப் புரிந்துகொள்ள கற்பனை வளங்களின் பட்டியலைப் பாருங்கள்.', enDescription: 'Browse a fictional support directory designed for interface demonstration.', kicker: 'REFERENCE COLLECTION' },
  '/preparedness': { ta: 'முன்னெச்சரிக்கை', en: 'Preparedness', taDescription: 'மழைக்காலத் தயாரிப்புக்கான பொதுவான படிகளைச் சரிபார்த்து உங்கள் முன்னேற்றத்தைச் சேமியுங்கள்.', enDescription: 'Work through general preparation steps and save progress locally.', kicker: 'YOUR PLAN' },
  '/methodology': { ta: 'தரவுக் குறிப்பு', en: 'Data & methodology', taDescription: 'வரைபட எல்லை, மாதிரித் தரவு மற்றும் விளக்க இடர் மதிப்பெண் எப்படி உருவாக்கப்பட்டன என்பதை அறியுங்கள்.', enDescription: 'Understand the state boundary, synthetic data and authored risk scores.', kicker: 'BEHIND THE MAP' },
  '/settings': { ta: 'அமைப்புகள்', en: 'Settings', taDescription: 'மொழி, தோற்றம் மற்றும் அளவீட்டு விருப்பங்களை உங்கள் உலாவியில் அமைத்துக் கொள்ளுங்கள்.', enDescription: 'Choose your language, appearance and measurement preferences.', kicker: 'YOUR VIEW' },
}

export function PageHeader({ actions, className }: {
  eyebrow?: ReactNode; title: string; description?: ReactNode; actions?: ReactNode; className?: string
}) {
  const { pathname } = useLocation()
  const { selectedRegion } = useApp()
  const { t, regionName } = useLocale()
  const page = PAGES[pathname] ?? PAGES['/']
  const nav = findNavItem(pathname)
  const number = String(NAV_ITEMS.findIndex(item => item.to === pathname) + 1).padStart(2, '0')
  return <header className={cn('page-header atlas-hero tn-page-hero', className)}>
    <div className="atlas-hero-copy">
      <div className="atlas-chapter"><span>{number} / {t(nav?.label ?? 'Atlas', nav?.tamilLabel ?? 'வரைபடம்')}</span><span>{page.kicker}</span></div>
      <h1 className="display-title text-shell-text">{t(page.en, page.ta)}</h1>
      <p className="atlas-description">{t(page.enDescription, page.taDescription)}</p>
      <p className="tn-hero-english" lang="en">{page.en}</p>
    </div>
    <div className="atlas-hero-visual tn-hero-map" aria-hidden="true"><svg viewBox="0 0 560 640"><path d={TAMIL_NADU_PATH} fill="currentColor" /></svg></div>
    <div className="atlas-hero-side">
      <span className="atlas-demo-stamp"><span />{t('SAMPLE DATA', 'மாதிரித் தரவு')}</span>
      <div className="atlas-reference"><span>{t('Selected district', 'தேர்ந்தெடுத்த மாவட்டம்')}</span><strong>{regionName(selectedRegion)}</strong><small>12 JUN 2025 · 09:30</small></div>
      {actions ? <div className="atlas-hero-actions">{actions}</div> : <p className="atlas-side-note">{t('Explore the sample', 'மாதிரியை ஆராயுங்கள்')}<ArrowUpRight size={18} aria-hidden="true" /></p>}
    </div>
  </header>
}

export function SectionHeading({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-3 flex flex-wrap items-end justify-between gap-3', className)}>
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold text-shell-text">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-shell-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
