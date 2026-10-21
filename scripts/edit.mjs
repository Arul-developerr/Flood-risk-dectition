/**
 * Small text-editing helper used during the redesign.
 * Keeps multi-line string surgery out of shell quoting.
 *
 * Normalises BOM and line endings on both sides so a match succeeds
 * regardless of how the fragment was authored.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const [file, ...rest] = process.argv.slice(2)
if (!file) {
  console.error('usage: node scripts/edit.mjs <file> <findFile> <replaceFile>')
  process.exit(1)
}

const normalise = (value) => value.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')

const source = normalise(readFileSync(file, 'utf8'))
const find = normalise(readFileSync(rest[0], 'utf8'))
const replace = rest[1] ? normalise(readFileSync(rest[1], 'utf8')) : ''

if (!source.includes(find)) {
  console.error('FIND NOT FOUND in ' + file)
  console.error('--- looking for ---')
  console.error(JSON.stringify(find.slice(0, 200)))
  process.exit(2)
}

const next = source.replace(find, replace)
writeFileSync(file, next, 'utf8')
console.log('patched ' + file)
