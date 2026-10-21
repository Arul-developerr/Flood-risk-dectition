import { useId } from 'react'

/** Decorative atlas linework, independent of the fictional terrain and readings. */
export function ContourArtwork({ variant = 'basin', className = '' }: { variant?: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  const wave = variant === 'rain' || variant === 'river'
  return (
    <svg viewBox="0 0 640 320" fill="none" className={`contour-art ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="50" y1="0" x2="600" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity="0" />
          <stop offset=".45" stopColor="currentColor" stopOpacity=".7" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".1" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${id})`} strokeWidth=".8">
        {Array.from({ length: 17 }, (_, index) => wave ? (
          <path key={index} d={`M-30 ${62 + index * 12} C90 ${-20 + index * 10} 150 ${230 + index * 7} 280 ${115 + index * 8} S460 ${30 + index * 10} 690 ${120 + index * 10}`} />
        ) : (
          <path key={index} transform={`translate(${320 - index * 4} ${156 + index * 1.5}) rotate(-22) scale(${.38 + index * .055})`} d="M-190-34C-145-123-79-85-17-132C58-186 160-127 174-46C190 28 229 57 163 98C98 143 52 102-24 128C-116 160-109 81-180 68C-231 56-240 11-190-34Z" />
        ))}
      </g>
      <circle cx="342" cy="151" r="4" fill="currentColor" opacity=".7" />
      <circle cx="342" cy="151" r="12" stroke="currentColor" strokeOpacity=".25" />
      <path d="M342 132V116M342 186V170M323 151H307M377 151H361" stroke="currentColor" strokeOpacity=".3" />
    </svg>
  )
}
