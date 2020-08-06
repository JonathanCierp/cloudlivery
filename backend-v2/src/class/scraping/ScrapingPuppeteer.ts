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

export default class ScrapingPuppeteer extends Scraping{
	puppeteer: any
	browser: any
	page: any
	ctx: GetGen<any> | undefined
	result: object | undefined
	// @ts-ignore
	provider: string | undefined
	marque: string | undefined

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

	async getPageData(): Promise<void> {
		let products: any[] = []

		return await this.page.evaluate(() => {

			return products
		})
	}

	async startScrapingByProvider() {
		let providers = await this.ctx.prisma.provider.findMany()
		let start_provider_time = new Date().getTime();
		for(let provider of providers) {
			this.provider = provider.label
			console.log("Start provider : " + provider.label)
			await this.startScrapingByRayon(provider)
			console.log(`provider end in ${((new Date().getTime() - start_provider_time) / 1000).toFixed(2)}s`)
		}
	}

	async startScrapingByRayon(provider) {
		let rayons = await this.ctx.prisma.rayon.findMany({
			where: {
				scraping: true
			},
			orderBy: {
				id: "desc"
			}
		})
		let results = []
		let i = 0
		for(let rayon of rayons) {
			/*if(i >= 0 && i < 5) {*/
				console.log("Start rayon : " + rayon.label)
				let start_rayon_time = new Date().getTime();
				let pageNumber = 1
				do {
					console.log("Scraping url : " + `${provider?.prefix_url}/r${rayon.uri}?noRedirect=1&page=${pageNumber}`)
					await this.getPage(`${provider?.prefix_url}/r${rayon.uri}?noRedirect=1&page=${pageNumber}`)
					if(results[rayon.id]) {
						results[rayon.id] = results[rayon.id].concat(await this.getPageData())
					}else {
						results[rayon.id] = await this.getPageData()
					}
					pageNumber++
					await this.page.close()
				}while(results[rayon.id].length % 60 === 0)
				await this.treatScrapedData(results[rayon.id])
				console.log(`Rayon end in ${((new Date().getTime() - start_rayon_time) / 1000).toFixed(2)}s`)
			/*}*/

			i++
		}
	}

	async treatScrapedData(results: Array<any>) {
		for(let result of results) {
			this.result = result
			await this.saveScrapeddata()
		}
	}

	async saveScrapeddata() {
		let marque: string = await this.extractMarque()

		await this.saveMarque(marque)
		await this.saveProduit()
	}

	async extractMarque(): string {
		let marque: string = ""

		for(let titl of this.result?.attributes.title.split(" ")){
			if(titl === titl.toUpperCase() && titl !== "&" && titl !== "-" && titl !== ":" && titl.indexOf(0) === -1 && titl.indexOf(1) === -1 && titl.indexOf(2) === -1 && titl.indexOf(3) === -1 && titl.indexOf(4) === -1 && titl.indexOf(5) === -1 && titl.indexOf(6) === -1 && titl.indexOf(7) === -1 && titl.indexOf(8) === -1 && titl.indexOf(9) === -1) {
				marque += titl + " "
			}
		}
		marque = marque.trim()

		if(marque === "") {
			marque = "SANS MARQUE"
		}

		return marque
	}

	async saveMarque(marque: string): Promise<void> {
		let existMarque = await this.ctx.prisma.marque.findOne({
			where: {
				label: marque
			}
		})

		if(!existMarque) {
			await this.ctx.prisma.marque.create({
				data: {
					label: marque
				}
			})
			console.log("Erreur, la marque n'existe pas, création de : " + marque)
		}

		this.marque = marque
	}

	async extractProduit() {
		let produit_images: Array<ProduitImage> = []

		for(let images of this.result?.attributes.images){
			produit_images = [...produit_images, {
				largest: "https://www.carrefour.fr" + images.largest,
				size_1500x1500: "https://www.carrefour.fr" + images["1500x1500"],
				size_540x540: "https://www.carrefour.fr" + images["540x540"],
				size_380x380: "https://www.carrefour.fr" + images["380x380"],
				size_340x340: "https://www.carrefour.fr" + images["340x340"],
				size_340x240: "https://www.carrefour.fr" + images["340x240"],
				size_280x280: "https://www.carrefour.fr" + images["280x280"],
				size_195x195: "https://www.carrefour.fr" + images["195x195"],
				size_150x150: "https://www.carrefour.fr" + images["150x150"],
				size_43x43: "https://www.carrefour.fr" + images["43x43"]
			}]
		}

		let produit_rayons: any[] = []
		let rayon = {}

		for(let categorie of this.result?.attributes.categories) {
			if(categorie.slug === "ecreme") {
				categorie.slug = "ecreme"
			}

			rayon = await this.ctx.prisma.rayon.findOne({
				where: {
					slug: categorie.slug
				}
			})

			if(rayon) {
				produit_rayons = [...produit_rayons, {
					rayon:{
						connect: {
							id: rayon.id
						}
					}
				}]
			}else {
				if(categorie.slug !== "mon-boucher" && categorie.slug !== "mon-poissonnier") {
					console.log("Le rayon n'existe pas : " + categorie.slug + " produit : " + this.result?.attributes.title)
				}
			}
		}

		return {
			label: this.result?.attributes.title,
			ean: this.result?.attributes.ean,
			brand: this.result?.attributes.brand,
			slug: `${this.result?.attributes.slug}-${this.result?.attributes.ean}`,
			uri: rayon ? `${rayon.uri}/${this.result?.attributes.slug}-${this.result?.attributes.ean}` : "/",
			packaging: this.result?.attributes.packaging,
			origin: this.result?.attributes.origin,
			format: this.result?.attributes.format,
			price: this.result?.attributes.price.price,
			unit_of_measure: this.result?.attributes.price.unitOfMeasure,
			per_unit_label: this.result?.attributes.price.perUnitLabel,
			tax_message: this.result?.attributes.price.taxMessage,
			per_unit: this.result?.attributes.price.perUnit,
			provider: {
				connect: {
					label: this.provider
				}
			},
			marque: {
				connect: {
					label: this.marque?.trim()
				}
			},
			produit_images: {
				create: produit_images
			},
			produit_rayons: {
				create: produit_rayons
			}
			/*produit_labels_qualites: {
				create: [
					{
						labels_qualite:{
							connect: {
								id: 1
							}
						}
					},
					{
						labels_qualite:{
							connect: {
								id: 3
							}
						}
					},
				]
			}*/
		}
	}

	async saveProduit() {
		let slug = `${this.result?.attributes.slug}-${this.result?.attributes.ean}`
		
		let existProduit = await this.ctx.prisma.produit.findOne({
			where: {
				slug
			}
		})


		if (!existProduit) {
			let produits = await this.extractProduit()
			if(this.result?.attributes.categories.slug !== "mon-boucher" && this.result?.attributes.categories.slug !== "mon-poissonnier") {
				await this.ctx.prisma.produit.create({
					// @ts-ignore
					data: await this.extractProduit()
				})
			}
		}
	}
}