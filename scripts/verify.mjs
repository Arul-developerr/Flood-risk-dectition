import { chromium } from 'playwright'
import { preview } from 'vite'
import { mkdirSync, writeFileSync } from 'node:fs'

const out = 'output/playwright'
mkdirSync(out, { recursive: true })
const checks = []
const errors = []
const check = (name, passed, detail = '') => {
  checks.push({ name, passed: Boolean(passed), detail })
  if (!passed) console.log('FAIL:', name, detail)
}
const routes = ['/', '/risk', '/prediction', '/rainfall', '/river', '/stations', '/alerts', '/reports', '/resources', '/preparedness', '/methodology', '/settings']
const server = await preview({ preview: { host: '127.0.0.1', port: 5191, strictPort: true } })
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 950 }, reducedMotion: 'reduce' })
const page = await context.newPage()
page.on('pageerror', error => errors.push(error.message))
page.on('console', message => { if (message.type() === 'error' && !message.text().includes('fonts.googleapis')) errors.push(message.text()) })
const base = 'http://127.0.0.1:5191'
const go = async route => {
  await page.goto(base + route)
  await page.locator('h1').waitFor()
  await page.evaluate(() => document.fonts.ready)
}

try {
  for (const width of [1440, 1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 950 })
    for (const route of routes) {
      await go(route)
      const heading = await page.locator('h1').innerText()
      check(`${width}px ${route}: heading`, heading.trim().length > 0)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      check(`${width}px ${route}: horizontal overflow`, overflow <= 1, `${overflow}px`)
      check(`${width}px ${route}: demo disclosure`, /மாதிரித் தரவு|sample data/i.test(await page.locator('body').innerText()))
      if (['/', '/risk', '/stations'].includes(route)) {
        const map = page.locator('.tn-map-stage[data-ready="true"]').first()
        check(`${width}px ${route}: real outline path`, await map.locator('svg.tn-map-face path').first().getAttribute('d').then(d => d.length > 500))
        check(`${width}px ${route}: district markers`, await map.locator('.tn-map-pin').count() === 10)
      }
      if (width === 1440 || width === 390) await page.screenshot({ path: `${out}/tn-${route === '/' ? 'overview' : route.slice(1)}-${width}.png`, fullPage: true })
    }
  }

  await page.setViewportSize({ width: 1440, height: 950 })
  await go('/')
  const palette = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement)
    return { dark: !document.documentElement.classList.contains('light-mode'), background: style.getPropertyValue('--navy-950').trim(), card: style.getPropertyValue('--navy-800').trim(), accent: style.getPropertyValue('--cyan').trim(), text: style.getPropertyValue('--shell-text').trim(), border: style.getPropertyValue('--shell-border').trim() }
  })
  check('Royal Burgundy is the default appearance', palette.dark && palette.background === '36 13 25' && palette.card === '64 22 41' && palette.accent === '245 181 68' && palette.text === '255 241 214' && palette.border === '118 82 101')
  const map = page.locator('.tn-map-stage').first()
  const object = map.locator('.tn-map-object')
  const initial = await object.evaluate(el => el.style.transform)
  await page.getByRole('button', { name: 'பெரிதாக்கு' }).first().click()
  check('zoom changes 3D scene', await object.evaluate(el => el.style.transform) !== initial)
  await page.getByRole('button', { name: 'வரைபடத்தைச் சுழற்று' }).click()
  check('rotation changes 3D scene', /rotateZ\(-?\d+(?:\.\d+)?deg\)/.test(await object.evaluate(el => el.style.transform)))
  await page.getByRole('button', { name: 'வரைபடத்தை மீட்டமை' }).click()
  check('reset restores 3D scene', await object.evaluate(el => el.style.transform) === initial)
  await map.focus()
  await page.keyboard.press('ArrowRight')
  check('keyboard rotates 3D scene', await object.evaluate(el => el.style.transform) !== initial)
  await page.keyboard.press('Home')
  const nilgiris = map.getByRole('button', { name: /நீலகிரி/ })
  await nilgiris.click()
  check('marker selects district', (await page.getByTestId('selected-region-name').innerText()).includes('நீலகிரி'))
  await page.getByRole('link', { name: /மாவட்ட விவரங்கள்/ }).first().click()
  await page.locator('h1').filter({ hasText: 'இடர் மதிப்பீடு' }).waitFor()
  check('district selection follows navigation', (await page.locator('body').innerText()).includes('நீலகிரி'))
  await go('/')
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  check('English language switch', await page.locator('html').getAttribute('lang') === 'en' && /See Tamil Nadu clearly/.test(await page.locator('h1').innerText()))
  await page.getByRole('button', { name: 'தமிழ்', exact: true }).click()
  check('Tamil language switch', await page.locator('html').getAttribute('lang') === 'ta' && /தமிழ்நாட்டை/.test(await page.locator('h1').innerText()))

  await go('/risk')
  const search = page.getByRole('searchbox', { name: /மாவட்டம் அல்லது மாதிரி/ })
  await search.fill('கோயம்புத்தூர்')
  check('Tamil district search', await page.locator('.tn-map-pin').count() === 1)
  await search.fill('')
  check('search clear restores markers', await page.locator('.tn-map-pin').count() === 10)
  await page.getByRole('button', { name: 'வரைபட அடுக்குகள்' }).click()
  const grid = page.getByRole('button', { name: 'குறிப்புக் கட்டம்' })
  const before = await grid.getAttribute('aria-pressed')
  await grid.click()
  check('map grid layer toggles', await grid.getAttribute('aria-pressed') !== before)
  await go('/settings')
  await page.getByRole('button', { name: /Ivory Daylight/ }).click()
  check('Ivory Daylight alternative works', await page.locator('html').evaluate(el => el.classList.contains('light-mode')))
  await page.getByRole('button', { name: /Royal Burgundy/ }).click()
  check('Royal Burgundy can be restored', await page.locator('html').evaluate(el => !el.classList.contains('light-mode')))
  check('no browser errors', errors.length === 0, errors.join(' | '))
} finally {
  await browser.close()
  await new Promise(resolve => server.httpServer.close(resolve))
}

const summary = { total: checks.length, passed: checks.filter(item => item.passed).length, failed: checks.filter(item => !item.passed), errors }
writeFileSync(`${out}/tn-results.json`, JSON.stringify({ checks, summary }, null, 2))
console.log(`${summary.passed}/${summary.total} checks passed`)
if (summary.failed.length || errors.length) process.exitCode = 1
