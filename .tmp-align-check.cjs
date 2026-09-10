const { chromium } = require('C:/Users/Sharah/AppData/Local/Temp/pw-check/node_modules/playwright')

async function shot(page, name) {
  const path = `C:/Users/Sharah/Desktop/hackathon/Beity/.tmp-shots/${name}.png`
  await page.screenshot({ path, fullPage: true })
  console.log('SHOT', name)
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  const errors = []
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()) })

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
  await page.click('button:has-text("ar")')
  await page.waitForTimeout(300)
  await shot(page, 'align-landing-ar')
  await page.click('button:has-text("en")')

  await page.click('header button:has-text("Login")')
  await page.waitForTimeout(200)
  await page.click('button:has-text("Craver")')
  await page.waitForSelector('input[placeholder*="Search"]')
  await page.click('button:has-text("ar")')
  await page.waitForTimeout(300)
  await shot(page, 'align-craver-home-ar')

  await page.click('text=أهلاً, زبون >> xpath=.. ')
  await page.waitForTimeout(300)
  await shot(page, 'align-craver-profile-ar')

  console.log('ERRORS:', errors.length ? errors.join('\n') : 'none')
  await browser.close()
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })
