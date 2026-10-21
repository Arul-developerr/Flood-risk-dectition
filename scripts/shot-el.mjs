/**
 * Captures a single element by selector.
 * Usage: node scripts/shot-el.mjs <url> <selector> <out> [width] [height]
 */
import { chromium } from 'playwright'

const [url, selector, out, w = '1440', h = '960'] = process.argv.slice(2)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const el = page.locator(selector).first()
await el.scrollIntoViewIfNeeded()
await page.waitForTimeout(600)
await el.screenshot({ path: out })
console.log('saved ' + out)
if (errors.length) console.log('ERRORS: ' + errors.join(' | '))
await browser.close()