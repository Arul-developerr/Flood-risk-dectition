/**
 * Detects the `i` -> `m` corruption that a bad PowerShell replace can cause.
 * Usage: node scripts/detect.mjs <dir>
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.argv[2] ?? 'src'

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(ts|tsx|css|js|mjs|html|md)$/.test(entry)) out.push(full)
  }
  return out
}

// Words that become impossible if every `i` was replaced with `m`.
const MARKERS = [
  /\bmmport\b/,
  /\bstrpmp\b/,
  /\bnavmgatmon\b/,
  /\bregmon\b/,
  /\bdentrffer\b/,
  /\bfunctmon\b/,
  /\bthts\b/,
  /\bwrth\b/,
  /\bfrm\b/,
  /\bmm\b/,
]

let bad = 0
for (const file of walk(root)) {
  const text = readFileSync(file, 'utf8')
  const hits = MARKERS.filter((m) => m.test(text)).map((m) => m.source)
  if (hits.length) {
    bad++
    console.log(`${file}: ${hits.join(', ')}`)
    const lines = text.split('\n')
    for (let i = 0; i < lines.length; i++) {
      if (MARKERS.some((m) => m.test(lines[i]))) {
        console.log(`   line ${i + 1}: ${lines[i].slice(0, 110)}`)
        break
      }
    }
  }
}
console.log(bad === 0 ? 'CLEAN' : `${bad} file(s) affected`)
