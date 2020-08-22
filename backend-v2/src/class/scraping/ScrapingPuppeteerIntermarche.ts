// Doc : https://www.aymen-loukil.com/blog/tutoriel-google-puppeteer/
// Classess
import Scraping from "./Scraping"
// Utils
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// Types
import {GetGen} from "nexus-plugin-prisma/dist/schema/typegen";
import {ProduitImage} from "../../types/scraping";
import prisma from "nexus-plugin-prisma";
// Utils
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())

export default class ScrapingPuppeteerCarrefour extends Scraping {
	puppeteer: any
	browser: any
	page: any
	ctx: GetGen<any> | undefined
	start: number
	end: number
	rayons = [
		{
			label: "lait",
			url: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-demi-ecreme/ca-n01010101",
		},
		{
			label: "lait",
			url: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-ecreme/ca-n01010102",
		},
		{
			label: "lait",
			url: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-entier/ca-n01010103",
		},
		{
			label: "lait",
			url: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-frais/ca-n01010104",
		},
		{
			label: "lait",
			url: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-aromatise/ca-n01010105",
		},
		{
			label: "lait",
			url: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-sans-lactose-lait-de-chevre-ou-brebis/ca-n01010106",
		},
		{
			label: "oeuf",
			url: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/oeufs/ca-n010103",
		},
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
				label: "AUCHAN"
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
			console.log("Start rayon : " + rayon.url)
			let start_rayon_time = new Date().getTime();

			await this.newPage()
			console.log("Scraping url : " + `${rayon.url}`)
			await this.page.goto("https://www.auchan.fr/courses?storeReference=527&lark-b2cd=1&gclid=Cj0KCQjwg8n5BRCdARIsALxKb96rKyvvgqxQeqFUb5t4JQXV3T30PFNhn9-Su5TDZuT2CRlGRe23_ZIaAvh-EALw_wcB");
			await this.getPage(`${rayon.url}`)

			if (results[rayon.label]) {
				results[rayon.label] = results[rayon.label].concat(await this.getPageData())
			} else {
				results[rayon.label] = await this.getPageData()
			}

			await this.page.close()
			console.log(results[rayon.label].length)
			if (results[rayon.label].length % 30 === 0) {
				break;
			}

			total = [...total, {
				url: rayon.label,
				total: results[rayon.label].length
			}]

			console.log(`Rayon end in ${((new Date().getTime() - start_rayon_time) / 1000).toFixed(2)}s`)
			//console.log(total)
			for (let result of results[rayon.label]) {
				let rayonLabel = rayon.label
				result.slug = result.slug?.toLowerCase().replace(" ", "-")
				result.fakeUri = result.fakeUri?.substring(65, 250)
				if (result.fakeUri) {
					for (let char of result.fakeUri) {
						if (char === "\"") {
							break
						}
						result.uri += char
					}
				}
				result.price = result.price?.replace("€", "").replace(",", ".")
				result.per_unit_label = result.per_unit_label?.split("\n")[1]
				result.unit_of_measure = result.per_unit_label?.split("/")[1].trim()
				result.per_unit = result.per_unit_label?.split("/")[0].trim().replace("€", "").replace(",", ".")
				delete result.fakeUri
				if (result.per_unit) {
					await this.extractProduit(result, rayonLabel)
				}
			}
		}
	}

	async getPageData(): Promise<void> {
		return await this.page.evaluate(() => {
			window.scrollTo(0, 5000)
			let products = []
			let productsSite = document.querySelectorAll(".product-thumbnail.list__item")

			if (productsSite.length) {
				for (let key in productsSite) {
					let label = document.querySelectorAll(".product-thumbnail__description")[key]?.innerText
					let fakeUri = document.querySelectorAll(".product-thumbnail__content-wrapper")[key]?.innerHTML
					products.push({
						fakeUri,
						label,
						ean: "",
						brand: "",
						slug: label,//.toLowerCase().replace(" ", "-")}`,
						uri: "",//https://www.auchan.fr" + productsSite[key].children[1].children[0].getAttribute("href"),//"https://www.auchan.fr" + document.querySelectorAll(".product-thumbnail__description")[key].innerText,
						packaging: document.querySelectorAll(".product-attribute")[key]?.innerText,
						origin: "",
						format: "",
						price: document.querySelectorAll(".product-price")[key]?.innerText,
						unit_of_measure: "",//product.children[1].children[0]?.children[1]?.children[1]?.children[1]?.innerText.split("/")[1],
						per_unit_label: document.querySelectorAll(".product-thumbnail__attributes")[key]?.innerText,//product.children[1].children[0].children[1].children[1].children[1]?.innerText,
						tax_message: "",
						per_unit: ""//product.children[1].children[0].children[1].children[1].children[1]?.innerText.split("/")[0]
					})
				}
			}

			return products
		})
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async extractProduit(result, rayonLabel) {
		let provider = await this.ctx.prisma.provider.findOne({
			where: {
				label: "CARREFOUR"
			}
		})
		let produit_images: Array<ProduitImage> = []
		let produit_rayons: Array<any> = []
		let produit_flags: Array<any> = []
		let rayon1 = {}
		let rayon2 = {}
		let rayon3 = {}
		if (rayonLabel === "lait") {
			if (result.label?.indexOf("bio") !== -1) {
				rayon1 = await this.ctx.prisma.rayon.findOne({
					where: {
						slug: "bio-et-ecologie"
					}
				})
				rayon2 = await this.ctx.prisma.rayon.findOne({
					where: {
						slug: "cremerie"
					}
				})
				rayon3 = await this.ctx.prisma.rayon.findOne({
					where: {
						slug: "lait-et-oeufs"
					}
				})
				produit_rayons = [
					{
						rayon: {
							connect: {
								id: rayon1.id
							}
						}
					},
					{
						rayon: {
							connect: {
								id: rayon2.id
							}
						}
					},
					{
						rayon: {
							connect: {
								id: rayon3.id
							}
						}
					}
				]
			} else {
				rayon1 = await this.ctx.prisma.rayon.findOne({
					where: {
						slug: "cremerie"
					}
				})
				rayon2 = await this.ctx.prisma.rayon.findOne({
					where: {
						slug: "lait-boissons-lactees-et-vegetales"
					}
				})
				produit_rayons = [
					{
						rayon: {
							connect: {
								id: rayon1.id
							}
						}
					},
					{
						rayon: {
							connect: {
								id: rayon2.id
							}
						}
					}
				]
			}
		}
		if (rayonLabel === "oeuf") {
			if (result.label?.indexOf("bio") !== -1) {
				rayon1 = await this.ctx.prisma.rayon.findOne({
					where: {
						slug: "bio-et-ecologie"
					}
				})
				rayon2 = await this.ctx.prisma.rayon.findOne({
					where: {
						slug: "cremerie"
					}
				})
				rayon3 = await this.ctx.prisma.rayon.findOne({
					where: {
						slug: "lait-et-oeufs"
					}
				})
				produit_rayons = [
					{
						rayon: {
							connect: {
								id: rayon1.id
							}
						}
					},
					{
						rayon: {
							connect: {
								id: rayon2.id
							}
						}
					},
					{
						rayon: {
							connect: {
								id: rayon3.id
							}
						}
					}
				]
			} else {
				rayon1 = await this.ctx.prisma.rayon.findOne({
					where: {
						slug: "cremerie"
					}
				})
				rayon2 = await this.ctx.prisma.rayon.findOne({
					where: {
						slug: "oeufs"
					}
				})
				produit_rayons = [
					{
						rayon: {
							connect: {
								id: rayon1.id
							}
						}
					},
					{
						rayon: {
							connect: {
								id: rayon2.id
							}
						}
					}
				]
			}
		}


		/*if (result?.attributes.images) {
			for (let images of result?.attributes.images) {
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

		if (result?.attributes.categories) {
			for (let rayon of result?.attributes.categories) {
				let exist = await this.ctx.prisma.rayon.findOne({
					where: {
						slug: rayon.slug
					}
				})
				if (!exist) {
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
						rayon: {
							connect: {
								id: rayonCreated.id
							}
						}
					}]
				} else {
					produit_rayons = [...produit_rayons, {
						rayon: {
							connect: {
								id: exist.id
							}
						}
					}]
				}
			}
		}

		if (result?.attributes.flag) {
			for (let flag of result?.attributes.flag) {
				produit_flags = [...produit_flags, {
					label: "https://www.carrefour.fr/" + flag.replace(".", "-") + ".svg",
				}]
			}
		}*/

		let produit = {
			label: result.label,
			ean: result.ean,
			brand: result.brand,
			slug: result.slug,
			uri: result.uri,
			packaging: result.packaging,
			origin: result.origin,
			format: result.format,
			price: result.price,
			unit_of_measure: result.unit_of_measure,
			per_unit_label: result.per_unit_label,
			tax_message: result.tax_message,
			per_unit: result.per_unit,
			provider: {
				connect: {
					label: "AUCHAN"//provider.label
				}
			},
			marque: {
				connect: {
					label: "LACTEL"//await this.extractMarque(result?.attributes.title)
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

		for (let titl of title.split(" ")) {
			if (titl === titl.toUpperCase() && titl !== "&" && titl !== "-" && titl !== ":" && titl.indexOf(0) === -1 && titl.indexOf(1) === -1 && titl.indexOf(2) === -1 && titl.indexOf(3) === -1 && titl.indexOf(4) === -1 && titl.indexOf(5) === -1 && titl.indexOf(6) === -1 && titl.indexOf(7) === -1 && titl.indexOf(8) === -1 && titl.indexOf(9) === -1 && titl !== "/") {
				marque += titl + " "
			}
		}
		marque = marque.trim()

		if (marque === "") {
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

		if (!existMarque) {
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
		if (produit.slug) {
			let existProduit = await this.ctx.prisma.produit.findOne({
				where: {
					slug: produit.slug
				}
			})

			if (!existProduit) {
				await this.ctx.prisma.produit.create({
					data: produit
				})
			}
		}
	}
}

