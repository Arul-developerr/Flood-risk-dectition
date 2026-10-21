/**
 * Quick visual capture of the homepage terrain scene.
 * Usage: node scripts/shoot.mjs <url> <outfile> [width] [height] [fullPage]
 */
import { chromium } from 'playwright'

const [url, out, w = '1440', h = '960', full = 'true'] = process.argv.slice(2)

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 1,
})
const errors = []
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))

await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1800)
await page.screenshot({ path: out, fullPage: full === 'true' })
console.log('saved ' + out)
if (errors.length) console.log('CONSOLE ERRORS:\n' + errors.join('\n'))
else console.log('no console errors')
await browser.close()