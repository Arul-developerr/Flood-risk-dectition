/**
 * Removes files listed in a manifest.
 * Usage: node scripts/remove.mjs <manifestFile>
 */
import { readFileSync, rmSync, existsSync, rmdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const manifest = readFileSync(process.argv[2], 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)

for (const rel of manifest) {
  const full = resolve(rel)
  if (!existsSync(full)) {
    console.log('skip (missing) ' + rel)
    continue
  }
  rmSync(full, { force: true })
  console.log('removed ' + rel)

  // Remove the parent directory if it is now empty.
  let dir = dirname(full)
  while (dir.endsWith('src') === false) {
    try {
      rmdirSync(dir)
      console.log('removed empty dir ' + dir)
      dir = dirname(dir)
    } catch {
      break
    }
  }
}