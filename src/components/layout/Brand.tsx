export function BrandMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" className={className} role="img" aria-label="Tamil Nadu Flood Atlas">
      <rect x="1" y="1" width="42" height="42" rx="14" fill="currentColor" className="brand-mark-bg" />
      <path d="M11 28 19 13l5 10 4-7 6 12M15 28h8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="brand-mark-line" />
      <path d="M25 26c-9 3 8 5-1 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="brand-mark-line" />
      <circle cx="33" cy="12" r="2" fill="currentColor" className="brand-mark-line" />
    </svg>
  )
}

export function Wordmark({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) return null
  return <div className="atlas-wordmark"><p>தமிழ்நாடு</p><small>FLOOD ATLAS · வெள்ள வரைபடம்</small></div>
}
