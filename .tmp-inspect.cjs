const { chromium } = require('C:/Users/Sharah/AppData/Local/Temp/pw-check/node_modules/playwright')
async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
  await page.click('header button:has-text("Login")')
  await page.waitForTimeout(200)
  await page.click('button:has-text("Craver")')
  await page.waitForSelector('input[placeholder*="Search"]')
  await page.click('button:has-text("ar")')
  await page.waitForTimeout(300)
  await page.click('text=أهلاً, زبون >> xpath=.. ')
  await page.waitForTimeout(300)
  const info = await page.evaluate(() => {
    const input = document.querySelector('input[value="Nour Ezzat"]') || [...document.querySelectorAll('input')].find(i => i.value === 'Nour Ezzat')
    const root = document.querySelector('body > div, #root > div') || document.body
    return {
      rootClass: document.querySelector('#root > div')?.className,
      rootTextAlign: getComputedStyle(document.querySelector('#root > div')).textAlign,
      inputTextAlign: input ? getComputedStyle(input).textAlign : 'NOT FOUND',
      bodyTextAlign: getComputedStyle(document.body).textAlign,
      htmlTextAlign: getComputedStyle(document.documentElement).textAlign,
    }
  })
  console.log(JSON.stringify(info, null, 2))
  await browser.close()
}
main().catch(e => { console.error(e); process.exit(1) })
