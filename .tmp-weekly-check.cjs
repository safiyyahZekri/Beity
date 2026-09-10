const { chromium } = require('C:/Users/Sharah/AppData/Local/Temp/pw-check/node_modules/playwright')

const URL = 'http://localhost:5174/'

async function openOrderModal(page) {
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.click('header button:has-text("Login")')
  await page.waitForTimeout(200)
  await page.click('button:has-text("Craver")')
  await page.waitForSelector('input[placeholder*="Search"]')
  await page.waitForTimeout(400)
  // click first meal card to open the order flow
  await page.click('article')
  await page.waitForSelector('[role="dialog"]')
  await page.waitForTimeout(300)
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1400, height: 950 } })

  // --- EN: toggle off ---
  await openOrderModal(page)
  await page.screenshot({ path: '.tmp-shots/weekly-off-en.png' })

  // --- EN: toggle on -> day picker ---
  await page.click('[role="dialog"] input[type="checkbox"]', { force: true })
  await page.waitForTimeout(350)
  await page.screenshot({ path: '.tmp-shots/weekly-on-en.png' })

  const dayChips = await page.$$eval('[role="dialog"] button[aria-pressed]', (els) =>
    els.map((e) => ({ text: e.textContent.trim(), pressed: e.getAttribute('aria-pressed') })),
  )
  console.log('EN day chips:', JSON.stringify(dayChips))

  // pick a specific day (Monday), confirm, and look at the success badge
  await page.click('[role="dialog"] button[aria-pressed]:has-text("Mon")')
  await page.waitForTimeout(200)
  await page.click('button:has-text("Confirm order")')
  await page.waitForTimeout(500)
  await page.screenshot({ path: '.tmp-shots/weekly-placed-en.png' })
  const badge = await page.$eval('[role="dialog"] span[title]', (e) => ({
    text: e.textContent.trim(),
    title: e.getAttribute('title'),
  })).catch(() => null)
  console.log('Success badge:', JSON.stringify(badge))

  // --- craver profile: the order row badge ---
  await page.click('button:has-text("View My Orders"), a:has-text("View My Orders")')
  await page.waitForTimeout(700)
  await page.screenshot({ path: '.tmp-shots/weekly-orders-en.png', fullPage: false })
  const rowBadges = await page.$$eval('span[title]', (els) =>
    els
      .filter((e) => /Weekly/i.test(e.textContent))
      .map((e) => ({ text: e.textContent.trim(), title: e.getAttribute('title') })),
  )
  console.log('Order row badges:', JSON.stringify(rowBadges))

  // --- AR run ---
  await openOrderModal(page)
  await page.click('button:has-text("ar")')
  await page.waitForTimeout(300)
  await page.click('[role="dialog"] input[type="checkbox"]', { force: true })
  await page.waitForTimeout(350)
  await page.screenshot({ path: '.tmp-shots/weekly-on-ar.png' })
  const arChips = await page.$$eval('[role="dialog"] button[aria-pressed]', (els) =>
    els.map((e) => e.textContent.trim()),
  )
  console.log('AR day chips:', JSON.stringify(arChips))

  await browser.close()
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
