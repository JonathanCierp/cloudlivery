// Doc : https://www.aymen-loukil.com/blog/tutoriel-google-puppeteer/
// Classess
import Scraping from "./Scraping"
// Utils
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// Types
import { GetGen } from "nexus-plugin-prisma/dist/schema/typegen";
import { ProduitImage } from "../../types/scraping";

puppeteer.use(StealthPlugin())

export default class ScrapingPuppeteerCarrefour extends Scraping{
	puppeteer: any
	browser: any
	page: any
	ctx: GetGen<any> | undefined
	rayons = [
		"https://www.carrefour.fr/r/bio-et-ecologie?noRedirect=1"
	]

	ScrapingCarrefour() {
		puppeteer.use(StealthPlugin())

		this.puppeteer = puppeteer
	}

	async launchBrowser(): Promise<void> {
		this.browser = await puppeteer.launch({ headless: true })
	}

	async newPage(): Promise<void> {
		this.page = await this.browser.newPage()
	}

	async getPage(url: string): Promise<any> {
		return await this.page.goto(url)
	}

	async closeBrowser(): Promise<void> {
		await this.browser.close()
	}

	async startScrapingByProvider() {
		let provider = await this.ctx.prisma.provider.findOne({
			where: {
				label: "CARREFOUR"
			}
		})
		let start_provider_time = new Date().getTime();
		console.log("Start provider : " + provider.label)
		await this.startScrapingByRayon(provider)
		console.log(`provider end in ${((new Date().getTime() - start_provider_time) / 1000).toFixed(2)}s`)
	}

	async startScrapingByRayon(provider) {
		let results = []
		
		for(let rayon of this.rayons) {
			console.log("Start rayon : " + rayon)
			let start_rayon_time = new Date().getTime();

			for(let pageNumber = 1; pageNumber >= 1; pageNumber++){
				console.log("Scraping url : " + `${rayon}&page=${pageNumber}`)
				await this.getPage(`${rayon}&page=${pageNumber}`)

				if(results[rayon]) {
					results[rayon] = results[rayon].concat(await this.getPageData())
				}else {
					results[rayon] = await this.getPageData()
				}

				if(pageNumber % 10 === 0) {
					console.log("Start pause page")
					await this.sleep(30000)
					console.log("End pause")
				}
				if(results[rayon].length % 60 !== 0) {
					break;
				}
			}

			console.log(results[rayon].length)
		
			/*do {
				console.log("Scraping url : " + `${rayon}&page=${pageNumber}`)
				await this.getPage(`${rayon}&page=${pageNumber}`)
				if(results[rayon]) {
					results[rayon] = results[rayon].concat(await this.getPageData())
				}else {
					results[rayon] = await this.getPageData()
				}
				length += results[rayon].length
				pageNumber++
				if(pageNumber % 10 === 0) {
					console.log("Start pause page")
					await this.sleep(30000)
					console.log("End pause")
				}
			}while(results[rayon].length % 60 === 0)*/

			console.log(`Rayon end in ${((new Date().getTime() - start_rayon_time) / 1000).toFixed(2)}s`)
			//console.log("Start pause rayon")
			//await this.sleep(120000)
			//console.log("End pause")
		}
	}

	async getPageData(): Promise<void> {
		let products: any[] = []

		return await this.page.evaluate(() => {

			return products
		})
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}