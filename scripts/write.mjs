/**
 * Writes a file as UTF-8 without a BOM.
 *
 * PowerShell's Set-Content defaults to UTF-16/UTF-8-with-BOM depending on
 * the host, which breaks the TypeScript build. Every file written during
 * the redesign goes through this helper.
 *
 * Usage: node scripts/write.mjs <targetPath> <sourceFile>
 */
import { readFileSync, writeFileSync } from 'node:fs'

const [target, source] = process.argv.slice(2)
if (!target || !source) {
  console.error('usage: node scripts/write.mjs <target> <source>')
  process.exit(1)
}
const body = readFileSync(source, 'utf8').replace(/^\uFEFF/, '')
writeFileSync(target, body, 'utf8')
console.log('wrote ' + target)
