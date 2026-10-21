/**
 * Replaces every occurrence of one literal with another in a file.
 * Usage: node scripts/replace.mjs <file> <findFile> <replaceFile>
 */
import { readFileSync, writeFileSync } from 'node:fs'

const [file, findFile, replaceFile] = process.argv.slice(2)
const norm = (v) => v.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')

let source = norm(readFileSync(file, 'utf8'))
const find = norm(readFileSync(findFile, 'utf8'))
const replace = norm(readFileSync(replaceFile, 'utf8'))

const parts = source.split(find)
if (parts.length === 1) {
  console.error('FIND NOT FOUND in ' + file)
  process.exit(2)
}
source = parts.join(replace)
writeFileSync(file, source, 'utf8')
console.log(`patched ${file} (${parts.length - 1} replacement(s))`)