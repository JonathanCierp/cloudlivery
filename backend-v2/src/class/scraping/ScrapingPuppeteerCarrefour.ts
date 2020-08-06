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

export default class ScrapingPuppeteerCarrefour extends Scraping {
	puppeteer: any
	browser: any
	page: any
	ctx: GetGen<any> | undefined
	rayons = [
		"https://www.carrefour.fr/r/bio-et-ecologie?noRedirect=1",
		"https://www.carrefour.fr/r/fruits-et-legumes?noRedirect=1",
		"https://www.carrefour.fr/r/viandes-et-poissons?noRedirect=1",
		"https://www.carrefour.fr/r/pains-et-patisseries?noRedirect=1",
		"https://www.carrefour.fr/r/cremerie?noRedirect=1",
		"https://www.carrefour.fr/r/fromage-et-charcuterie?noRedirect=1",
		"https://www.carrefour.fr/r/surgeles?noRedirect=1",
		"https://www.carrefour.fr/r/epicerie-salee?noRedirect=1",
		"https://www.carrefour.fr/r/epicerie-sucree?noRedirect=1",
		"https://www.carrefour.fr/r/boissons-sans-alcool?noRedirect=1",
		"https://www.carrefour.fr/r/traiteur?noRedirect=1",
		"https://www.carrefour.fr/r/alcools-et-produits-aperitifs?noRedirect=1",

		//"https://www.carrefour.fr/r/produits-du-terroir?noRedirect=1",
		//"https://www.carrefour.fr/r/hygiene-et-beaute?noRedirect=1",
		//"https://www.carrefour.fr/r/le-monde-de-bebe?noRedirect=1",
		//"https://www.carrefour.fr/r/entretien-et-nettoyage?noRedirect=1",
		//"https://www.carrefour.fr/r/animaux?noRedirect=1",
		//"https://www.carrefour.fr/r/maison-loisir-textile?noRedirect=1",
		//"https://www.carrefour.fr/r/jardin-outdoor?noRedirect=1",
		//"https://www.carrefour.fr/r/maison-interieur?noRedirect=1",
		//"https://www.carrefour.fr/r/cuisine-et-arts-de-la-table?noRedirect=1",
		//"https://www.carrefour.fr/r/electromenager?noRedirect=1",
		//"https://www.carrefour.fr/r/bricolage-auto?noRedirect=1",
		//"https://www.carrefour.fr/r/beaute-entretien-et-proprete?noRedirect=1",
		//"https://www.carrefour.fr/r/bagagerie-sport-et-loisirs?noRedirect=1",
		//"https://www.carrefour.fr/r/telephonie-et-objets-connectes?noRedirect=1",
		//"https://www.carrefour.fr/r/image-et-son?noRedirect=1",
		//"https://www.carrefour.fr/r/informatique-bureau?noRedirect=1",
		//"https://www.carrefour.fr/r/culture-et-jeux-videos?noRedirect=1",
		//"https://www.carrefour.fr/r/jeux-et-jouets?noRedirect=1"
	]

	ScrapingCarrefour() {
		puppeteer.use(StealthPlugin())

		this.puppeteer = puppeteer
	}

	async launchBrowser(): Promise<void> {
		this.browser = await puppeteer.launch({headless: true})
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
		let total = []

		for (let rayon of this.rayons) {
			console.log("Start rayon : " + rayon)
			let start_rayon_time = new Date().getTime();

			for (let pageNumber = 1; pageNumber <= 7; pageNumber++) {
				await this.newPage()
				console.log("Scraping url : " + `${rayon}&page=${pageNumber}`)
				await this.getPage(`${rayon}&page=${pageNumber}`)

				if (results[rayon]) {
					results[rayon] = results[rayon].concat(await this.getPageData())
				} else {
					results[rayon] = await this.getPageData()
				}

				console.log("Start pause page")
				await this.sleep(5000)
				console.log("End pause page")

				await this.page.close()
				if (results[rayon].length % 60 !== 0) {
					break;
				}
			}

			console.log("Start pause rayon")
			await this.sleep(30000)
			console.log("End pause rayon")

			total = [...total, {
				url: rayon,
				total: results[rayon].length
			}]

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

		console.log(total)
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