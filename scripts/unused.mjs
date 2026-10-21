/**
 * Reports legacy source files that no longer have any importer.
 * Usage: node scripts/unused.mjs <dir>
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const root = resolve(process.argv[2] ?? 'src')

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full)
  }
  return out
}

const files = walk(root)
const sources = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]))

const ENTRY = new Set(['main.tsx', 'App.tsx', 'vite-env.d.ts', 'index.ts'])

// Map every module to the set of modules that import it.
const importers = new Map(files.map((f) => [f, new Set()]))

for (const [file, content] of sources) {
  const re = /from\s+['"]([^'"]+)['"]/g
  let match
  while ((match = re.exec(content)) !== null) {
    const spec = match[1]
    if (!spec.startsWith('.')) continue
    const base = resolve(dirname(file), spec)
    for (const candidate of [base + '.ts', base + '.tsx', join(base, 'index.ts'), join(base, 'index.tsx')]) {
      if (importers.has(candidate)) {
        importers.get(candidate).add(file)
        break
      }
    }
  }
}

const unused = []
for (const file of files) {
  const name = file.split(/[\\/]/).pop()
  if (ENTRY.has(name)) continue
  if (importers.get(file).size === 0) {
    unused.push(relative(root, file).split('\\').join('/'))
  }
}

console.log(unused.length ? unused.join('\n') : 'none')
console.log(`\n${unused.length} unused file(s)`)