var fs = require('fs');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const launch = async () => {
	const browser = await puppeteer.launch({ headless: true })
	const page = await browser.newPage()
	await page.setViewport({ width: 800, height: 600 })
	let products = []

	console.log(`Testing the stealth plugin..`)
	await page.goto('https://www.intermarche.com/rechercheproduits/10503/recherche/oeufs')

	const result = await page.evaluate(() => {

		return products
	})

	fs.writeFile('myjsonfile.json', JSON.stringify(result), 'utf8', () => {

	});

	console.log(`All done, check the screenshots. ✨`)
	await browser.close()
}

launch()