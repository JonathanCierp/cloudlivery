// Doc : https://www.aymen-loukil.com/blog/tutoriel-google-puppeteer/
// Classess
import Scraping from "./Scraping"
// Utils
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// Types
import { GetGen } from "nexus-plugin-prisma/dist/schema/typegen";
import { ProduitImage } from "../../types/scraping";
import prisma from "nexus-plugin-prisma";

puppeteer.use(StealthPlugin())

export default class ScrapingPuppeteerCarrefour extends Scraping {
	puppeteer: any
	browser: any
	page: any
	ctx: GetGen<any> | undefined
	start: number
	end: number
	rayons = [
		"https://www.carrefour.fr/r/bio-et-ecologie?noRedirect=1",
		"https://www.carrefour.fr/r/fruits-et-legumes?noRedirect=1",
		"https://www.carrefour.fr/r/viandes-et-poissons?noRedirect=1",
		"https://www.carrefour.fr/r/pains-et-patisseries?noRedirect=1",
		"https://www.carrefour.fr/r/cremerie?noRedirect=1",
		"https://www.carrefour.fr/r/fromage-et-charcuterie?noRedirect=1",
		"https://www.carrefour.fr/r/surgeles?noRedirect=1",
		"https://www.carrefour.fr/r/boissons-sans-alcool?noRedirect=1",
		"https://www.carrefour.fr/r/epicerie-salee?noRedirect=1",
		"https://www.carrefour.fr/r/epicerie-sucree?noRedirect=1",
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

		for (let i = this.start; i <= this.end; i++) {
			let rayon = this.rayons[i]

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

				await this.page.close()
				if (results[rayon].length % 60 !== 0) {
					break;
				}
			}

			total = [...total, {
				url: rayon,
				total: results[rayon].length
			}]

			console.log(`Rayon end in ${((new Date().getTime() - start_rayon_time) / 1000).toFixed(2)}s`)

			for(let result of results[rayon]) {
				await this.extractProduit(result)
			}
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

	async extractProduit(result) {
		let provider = await this.ctx.prisma.provider.findOne({
			where: {
				label: "CARREFOUR"
			}
		})
		let produit_images: Array<ProduitImage> = []
		let produit_rayons: Array<any> = []
		let produit_flags: Array<any> = []

		if(result?.attributes.images) {
			for(let images of result?.attributes.images){
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
		}

		if(result?.attributes.categories) {
			for(let rayon of result?.attributes.categories) {
				let exist = await this.ctx.prisma.rayon.findOne({
					where: {
						slug: rayon.slug
					}
				})
				if(!exist) {
					let rayonCreated = await this.ctx.prisma.rayon.create({
						data: {
							code: rayon.code,
							label: rayon.label,
							slug: rayon.slug,
							uri: rayon.uri,
							level: rayon.level,
							scraping: false,
							resultats: 0,
							provider: {
								connect: {
									label: provider.label
								}
							}
						}
					})

					produit_rayons = [...produit_rayons, {
						rayon:{
							connect: {
								id: rayonCreated.id
							}
						}
					}]
				}else {
					produit_rayons = [...produit_rayons, {
						rayon:{
							connect: {
								id: exist.id
							}
						}
					}]
				}
			}
		}

		if(result?.attributes.flag) {
			for(let flag of result?.attributes.flag) {
				produit_flags = [...produit_flags, {
					label: "https://www.carrefour.fr/" + flag.replace(".", "-") + ".svg",
				}]
			}
		}

		let produit = {
			label: result?.attributes.title,
			ean: result?.attributes.ean,
			brand: result?.attributes.brand,
			slug: `${result?.attributes.slug}-${result?.attributes.ean}-${result?.attributes.format.toLowerCase().replace(" ", "-")}`,
			uri: result?.attributes.uri,
			packaging: result?.attributes.packaging,
			origin: result?.attributes.origin,
			format: result?.attributes.format,
			price: result?.attributes.price.price.toString(),
			unit_of_measure: result?.attributes.price.unitOfMeasure,
			per_unit_label: result?.attributes.price.perUnitLabel,
			tax_message: result?.attributes.price.taxMessage,
			per_unit: result?.attributes.price.perUnit.toString(),
			provider: {
				connect: {
					label: provider.label
				}
			},
			marque: {
				connect: {
					label: await this.extractMarque(result?.attributes.title)
				}
			},
			produit_images: {
				create: produit_images
			},
			produit_rayons: {
				create: produit_rayons
			}
		}

		await this.saveProduit(produit)
	}

	async extractMarque(title): string {
		let marque: string = ""

		for(let titl of title.split(" ")){
			if(titl === titl.toUpperCase() && titl !== "&" && titl !== "-" && titl !== ":" && titl.indexOf(0) === -1 && titl.indexOf(1) === -1 && titl.indexOf(2) === -1 && titl.indexOf(3) === -1 && titl.indexOf(4) === -1 && titl.indexOf(5) === -1 && titl.indexOf(6) === -1 && titl.indexOf(7) === -1 && titl.indexOf(8) === -1 && titl.indexOf(9) === -1 && titl !== "/") {
				marque += titl + " "
			}
		}
		marque = marque.trim()

		if(marque === "") {
			marque = "SANS MARQUE"
		}

		await this.saveMarque(marque)

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

	async saveProduit(produit) {
		let existProduit = await this.ctx.prisma.produit.findOne({
			where: {
				slug: produit.slug
			}
		})

		if(!existProduit) {
			await this.ctx.prisma.produit.create({
				data: produit
			})
		}
	}
}