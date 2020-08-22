// Classes
import CustomError from "../error/CustomError"
// Types
import {GetGen} from "nexus-plugin-prisma/dist/schema/typegen"
import {
	Provider,
	Marque,
	Format,
	LabelsQualite,
	PreferencesAlimentaire,
	Promotion,
	SubstancesControversee,
	Rayon
} from "../../types/scraping"
// Utils
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const Apify = require('apify')


const slugify = (text) => {
	return text.toString().toLowerCase()
		.replace(/\s+/g, '-')           // Replace spaces with -
		.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
		.replace(/\-\-+/g, '-')         // Replace multiple - with single -
		.replace(/^-+/, '')             // Trim - from start of text
		.replace(/-+$/, '');            // Trim - from end of text
}

export default class Scraping {

	//region Protected parameters
	/**
	 * App context
	 * @type GetGen<any> | undefined
	 * @default undefined
	 */
	ctx: GetGen<any> | undefined

	/**
	 * Provider
	 * @type Provider | undefined
	 * @default provider
	 */
	provider: Provider | undefined

	/**
	 * Providers
	 * @type Array<string>
	 * @default providers
	 */
	providers: Array<Provider> = [
		{
			label: "CARREFOUR",
			prefix_url: "https://www.carrefour.fr"
		},
		{
			label: "AUCHAN",
			prefix_url: "https://www.auchan.com"
		}
	]

	/**
	 * Formats
	 * @type Array<string>
	 * @default formats by providers
	 */
	formats: Array<string> = [
		"1,115L",
		"1,25L",
		"1,5L",
		"1L",
		"2L et plus",
		"33cL et moins",
		"4x75cL",
		"50CL",
		"75cL",
		"3L",
		"1,75L",
		"33,5cL",
		"5x4,5g",
		"6x1,25L",
		"70cL",
		"60cL",
		"130cL",
		"100cL",
		"700mL"
	]

	/**
	 * labels Qualites
	 * @type Array<string>
	 * @default labelsQualites by providers
	 */
	labelsQualites: Array<string> = [
		"Bio",
		"Fabriqué en France",
		"Oeuf Plein Air",
		"Label Rouge",
		"Indication géographique protégée",
		"Filière qualité Carrefour",
		"Origine France",
		"Le porc français",
		"Sans sucres",
		"Viande bovine française",
		"Appellation d'origine protégée",
		"Forêt responsable",
		"Ecolabel"
	]

	/**
	 * Preferences Alimentaires
	 * @type Array<string>
	 * @default preferencesAlimentaires by providers
	 */
	preferencesAlimentaires: Array<string> = [
		"Sans gluten",
		"Sans lactose",
		"Sans sucre ajoutés",
		"Halal",
		"Végétarien",
		"Pur jus"
	]

	/**
	 * Promotions
	 * @type Array<string>
	 * @default promotions by providers
	 */
	promotions: Array<string> = [
		"Toutes les promotions",
		"Vue en catalogue",
		"Prime bio",
		"Remises immédiates",
		"A saisir"
	]

	/**
	 * Substances Controversees
	 * @type Array<string>
	 * @default substancesControversees by providers
	 */
	substancesControversees: Array<string> = [
		"Sans OGM",
		"Sans conservateur artificiel",
		"Sans colorant artificiel",
		"Sans arôme artificiel"
	]

	/**
	 * Instance puppeteer
	 */
	puppeteer: any

	/**
	 * Navigateur puppeteer
	 */
	browser: any

	/**
	 * Page du navigateur puppeteer
	 */
	page: any

	/**
	 * Contexte de l'applicaion
	 */
	ctx: GetGen<any> | undefined


	marques = [
		"LA MARQUE DU CONSOMMATEUR",
		"AGRILAIT",
		"BASKALIA",
		"BEARN LAIT",
		"C'EST QUI LE PATRON ?!",
		"CANDIA",
		"CARREFOUR BIO",
		"CARREFOUR",
		"ET ALDIA",
		"FAIREFRANCE",
		"GERENTE",
		"GRANDLAIT",
		"J'AIME LE LAIT D'ICI",
		"LACTEL",
		"LACTEL BIO",
		"LAITERIE LES FAYES",
		"LAITIK",
		"LE GALL",
		"LE LAIT DE MA REGION",
		"LE LAIT EQUITABLE SARTHOIS",
		"LE PETIT VENDEEN",
		"LES FAYES",
		"LES LAITIERS RESPONSABLES",
		"MONT LAIT",
		"ONETIK",
		"VERNEUIL"
	]

	groupeRayons = [
		{
			code: "R01",
			label: "Crémerie",
			slug: "cremerie",
			uri: "/r/cremerie",
			level: 1,
			resultats: 0,
			scraping: false
		},
		{
			code: "R01SR01",
			label: "Lait",
			slug: "cremerie/lait",
			uri: "/r/cremerie/lait",
			level: 2,
			resultats: 0,
			scraping: false
		},
		{
			code: "R01SR01SSR01",
			label: "Lait demi-écrémé",
			slug: "cremerie/lait/lait-demi-ecreme",
			uri: "/r/cremerie/lait/lait-demi-ecreme",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R01SR01SSR02",
			label: "Lait écrémé",
			slug: "cremerie/lait/lait-ecreme",
			uri: "/r/cremerie/lait/lait-ecreme",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R01SR01SSR03",
			label: "Lait entier",
			slug: "cremerie/lait/lait-entier",
			uri: "/r/cremerie/lait/lait-entier",
			level: 3,
			resultats: 0,
			scraping: false
		}
	]

	rayons = [
		/*{
			label: "lait",
			urlCarrefour: "https://www.carrefour.fr/r/cremerie/lait-boissons-lactees-et-vegetales/ecreme?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-ecreme/ca-n01010102",
			rayons: [
				{
					code: "R01",
					label: "Crémerie",
					slug: "cremerie",
					uri: "/r/cremerie",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R01SR01",
					label: "Lait",
					slug: "cremerie/lait",
					uri: "/r/cremerie/lait",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R01SR01SSR02",
					label: "Lait écrémé",
					slug: "cremerie/lait/lait-ecreme",
					uri: "/r/cremerie/lait/lait-ecreme",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},*/
		{
			label: "lait",
			urlCarrefour: "https://www.carrefour.fr/r/cremerie/lait-boissons-lactees-et-vegetales/entier?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-entier/ca-n01010103",
			rayons: [
				{
					code: "R01",
					label: "Crémerie",
					slug: "cremerie",
					uri: "/r/cremerie",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R01SR01",
					label: "Lait",
					slug: "cremerie/lait",
					uri: "/r/cremerie/lait",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R01SR01SSR03",
					label: "Lait entier",
					slug: "cremerie/lait/lait-entier",
					uri: "/r/cremerie/lait/lait-entier",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},
		/*{
			label: "lait",
			urlCarrefour: "https://www.carrefour.fr/r/cremerie/lait-boissons-lactees-et-vegetales/demi-ecreme?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-demi-ecreme/ca-n01010101",
			rayons: [
				{
					code: "R01",
					label: "Crémerie",
					slug: "cremerie",
					uri: "/r/cremerie",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R01SR01",
					label: "Lait",
					slug: "cremerie/lait",
					uri: "/r/cremerie/lait",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R01SR01SSR01",
					label: "Lait demi-écrémé",
					slug: "cremerie/lait/lait-demi-ecreme",
					uri: "/r/cremerie/lait/lait-demi-ecreme",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		}*/
	]
	//endregion

	//region public functions
	/**
	 * Create providers
	 * @return Promise<void>
	 */
	Scraping() {
		puppeteer.use(StealthPlugin())

		this.puppeteer = puppeteer
	}

	public async createPrismaProvider(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start provider...")
		for (let provider of this.providers) {
			const resProvider = await this.getPrismaProvider(provider.label)
			if (!resProvider) {
				try {
					await this.ctx.prisma.provider.create({
						data: {
							label: provider.label,
							prefix_url: provider.prefix_url
						}
					})
				} catch (e) {
					CustomError.error("Erreur lors de la création du provider.")
				}
			}
		}
		console.log("End provider in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create marques
	 * @return Promise<void>
	 */
	public async createPrismaMarques(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start marque...")
		for (let marque of this.marques) {
			const resMarque = await this.getPrismaMarque(marque)
			if (!resMarque) {
				try {
					await this.ctx.prisma.marque.create({
						data: {
							label: marque
						}
					})
				} catch (e) {
					CustomError.error("Erreur lors de la création de la marque.")
				}
			}
		}
		console.log("End marque in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create formats
	 * @return Promise<void>
	 */
	public async createPrismaFormats(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start format...")
		for (let format of this.formats) {
			const resFormat = await this.getPrismaFormat(format)
			if (!resFormat) {
				try {
					await this.ctx.prisma.format.create({
						data: {
							label: format
						}
					})
				} catch (e) {
					console.log(e)
					CustomError.error("Erreur lors de la création du format.")
				}
			}
		}
		console.log("End format in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create labels qualites
	 * @return Promise<void>
	 */
	public async createPrismaLabelsQualites(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start labels qualites...")
		for (let labelsQualite of this.labelsQualites) {
			const resLabelsQualite = await this.getPrismaLabelsQualite(labelsQualite)
			if (!resLabelsQualite) {
				try {
					await this.ctx.prisma.labelsQualite.create({
						data: {
							label: labelsQualite
						}
					})
				} catch (e) {
					CustomError.error("Erreur lors de la création du label qualité.")
				}
			}
		}
		console.log("End labels qualites in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create preferences alimentaires
	 * @return Promise<void>
	 */
	public async createPrismaPreferencesAlimentaires(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start preferences alimentaires...")
		for (let preferencesAlimentaire of this.preferencesAlimentaires) {
			const resPreferencesAlimentaire = await this.getPrismaPreferencesAlimentaire(preferencesAlimentaire)
			if (!resPreferencesAlimentaire) {
				try {
					await this.ctx.prisma.preferencesAlimentaire.create({
						data: {
							label: preferencesAlimentaire
						}
					})
				} catch (e) {
					CustomError.error("Erreur lors de la création des préférences alimentaires.")
				}
			}
		}
		console.log("End preferences alimentaires in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create promotions
	 * @return Promise<void>
	 */
	public async createPrismaPromotions(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start promotions...")
		for (let promotion of this.promotions) {
			const resPromotion = await this.getPrismaPromotion(promotion)
			if (!resPromotion) {
				try {
					await this.ctx.prisma.promotion.create({
						data: {
							label: promotion
						}
					})
				} catch (e) {
					console.log(e)
					CustomError.error("Erreur lors de la création des promotions.")
				}
			}
		}
		console.log("End promotions in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create substances controversees
	 * @return Promise<void>
	 */
	public async createPrismaSubstancesControversees(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start substances controversees...")
		for (let substancesControversee of this.substancesControversees) {
			const resSubstancesControversee = await this.getPrismaSubstancesControversee(substancesControversee)
			if (!resSubstancesControversee) {
				try {
					await this.ctx.prisma.substancesControverse.create({
						data: {
							label: substancesControversee
						}
					})
				} catch (e) {
					console.log(e)
					CustomError.error("Erreur lors de la création des substances controversées.")
				}
			}
		}
		console.log("End substances controversees in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create rayons
	 * @return Promise<void>
	 */
	public async createPrismaRayons(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start rayon...")
		for (let rayon of this.groupeRayons) {
			const resRayon = await this.getPrismaRayon(rayon.label)
			if (!resRayon) {
				try {
					await this.ctx.prisma.rayon.create({
						data: {
							label: rayon.label,
							code: rayon.code,
							slug: rayon.slug,
							uri: rayon.uri,
							level: rayon.level,
							resultats: rayon.resultats,
							scraping: rayon.scraping
						}
					})
				} catch (e) {
					console.log(e)
					CustomError.error("Erreur lors de la création des rayons.")
				}
			}
		}
		console.log("End rayon in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Get a provider
	 * @return Promise<Provider>
	 * @param provider
	 */
	public async getPrismaProvider(provider: string): Promise<Provider> {
		return this.ctx.prisma.provider.findOne({
			where: {
				label: provider
			}
		})
	}

	/**
	 * Get a marque
	 * @return Promise<Marque>
	 * @param marque
	 */
	public async getPrismaMarque(marque: string): Promise<Marque> {
		return this.ctx.prisma.marque.findOne({
			where: {
				label: marque
			}
		})
	}

	/**
	 * Get a format
	 * @return Promise<Format>
	 * @param format
	 */
	public async getPrismaFormat(format: string): Promise<Format> {
		return this.ctx.prisma.format.findOne({
			where: {
				label: format
			}
		})
	}

	/**
	 * Get a labels qualite
	 * @return Promise<LabelsQualite>
	 * @param labelsQualite
	 */
	public async getPrismaLabelsQualite(labelsQualite: string): Promise<LabelsQualite> {
		return this.ctx.prisma.labelsQualite.findOne({
			where: {
				label: labelsQualite
			}
		})
	}

	/**
	 * Get a preferences alimentaire
	 * @return Promise<PreferencesAlimentaire>
	 * @param preferencesAlimentaire
	 */
	public async getPrismaPreferencesAlimentaire(preferencesAlimentaire: string): Promise<PreferencesAlimentaire> {
		return this.ctx.prisma.preferencesAlimentaire.findOne({
			where: {
				label: preferencesAlimentaire
			}
		})
	}

	/**
	 * Get a promotion
	 * @return Promise<Promotion>
	 * @param promotion
	 */
	public async getPrismaPromotion(promotion: string): Promise<Promotion> {
		return this.ctx.prisma.promotion.findOne({
			where: {
				label: promotion
			}
		})
	}

	/**
	 * Get a substances controversee
	 * @return Promise<SubstancesControversee>
	 * @param substancesControversee
	 */
	public async getPrismaSubstancesControversee(substancesControversee: string): Promise<SubstancesControversee> {
		return this.ctx.prisma.substancesControverse.findOne({
			where: {
				label: substancesControversee
			}
		})
	}

	/**
	 * Get a rayon
	 * @return Promise<Rayon>
	 * @param rayon
	 */
	public async getPrismaRayon(rayon: string): Promise<Rayon> {
		return this.ctx.prisma.rayon.findOne({
			where: {
				label: rayon
			}
		})
	}

	public async getPrismaProduits() {
		return this.ctx.prisma.produit.findMany({
			where: {
				provider_id: this.provider?.id
			}
		})
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

	async startScrapingCarrefour() {
		/*let start_provider_time = new Date().getTime();
		console.log("Start provider : Carrefour")
		let rayon = this.rayons[2]
		console.log("Start rayon : " + rayon.label)
		let start_rayon_time = new Date().getTime();
		console.log(rayon.urlCarrefour)
		await this.newPage()
		await this.getPage(rayon.urlCarrefour)

		await this.page.screenshot({ path: "results.png" })
		console.log(await this.getPageData())

		console.log(`Rayon end ${rayon.label} in ${((new Date().getTime() - start_rayon_time) / 1000).toFixed(2)}s`)
		/!*for(let rayon of this.rayons) {

		}*!/
		console.log(`End provider Carrefour in ${((new Date().getTime() - start_provider_time) / 1000).toFixed(2)}s`)*/
		let extractMarque = this.extractMarque

		Apify.main(async () => {
			const browser = await Apify.launchPuppeteer({stealth: true});

			let results = []

			for (let rayon of this.rayons) {
				const page = await browser.newPage();

				await page.goto(`${rayon.urlCarrefour}&page=1`);
				let nbProduit = await page.$eval('.pagination__txt', el => {
					return el.innerText.split(" ")[4]
				})
				let nbPage = nbProduit >= 60 ? Math.ceil(nbProduit / 60) : 1

				let result = []

				for (let i = 1; i <= nbPage; i++) {
					await page.goto(`${rayon.urlCarrefour}&page=${i}`);
					let datas = await page.$eval('.product-list.product-list .pagination ~ .product-grid', el => {
						let products = []

						for (let i in el.children) {
							if (el.children[i].innerHTML && el.children[i].innerHTML.indexOf("<div class=\"ds-product-card--vertical-image\">") !== -1) {
								let marques = [
									"LA MARQUE DU CONSOMMATEUR",
									"AGRILAIT",
									"BASKALIA",
									"BEARN LAIT",
									"C'EST QUI LE PATRON ?!",
									"CANDIA",
									"CARREFOUR",
									"ET ALDIA",
									"FAIREFRANCE",
									"GERENTE",
									"GRANDLAIT",
									"J'AIME LE LAIT D'ICI",
									"LACTEL",
									"LACTEL BIO",
									"LAITERIE LES FAYES",
									"LAITIK",
									"LE GALL",
									"LE LAIT DE MA REGION",
									"LE LAIT EQUITABLE SARTHOIS",
									"LE PETIT VENDEEN",
									"LES FAYES",
									"LES LAITIERS RESPONSABLES",
									"MONT LAIT",
									"ONETIK",
									"VERNEUIL"
								]

								let label = el?.children[i].children[0].children[0].children[2].children[0].children[0].children[0].innerText
								let format = el?.children[i].children[0].children[0].children[3].children[1]
								let per_unit_label = el?.children[i].children[0].children[0].children[2].children[0].children[2].innerText
								let marqueLabel = ""

								for(let marque of marques) {
									if(label.includes("CARREFOUR BIO")) {
										marqueLabel = "CARREFOUR BIO"
									}else if(label.includes("CARREFOUR")) {
										marqueLabel = "CARREFOUR"
									}else if(label.includes(marque)) {
										marqueLabel = marque
									}
								}

								let image = el?.children[i].children[0].children[0].children[2].children[1].children[0].children[0].getAttribute("src")

								let produit_images = [{
									largest: "https://www.carrefour.fr" + image.replace("280x280", "1500x1500"),
									size_1500x1500: "https://www.carrefour.fr" + image.replace("280x280", "1500x1500"),
									size_540x540: "https://www.carrefour.fr" + image.replace("280x280", "540x540"),
									size_380x380: "https://www.carrefour.fr" + image.replace("280x280", "380x380"),
									size_340x340: "https://www.carrefour.fr" + image.replace("280x280", "340x340"),
									size_340x240: "https://www.carrefour.fr" + image.replace("280x280", "340x240"),
									size_280x280: "https://www.carrefour.fr" + image.replace("280x280", "280x280"),
									size_195x195: "https://www.carrefour.fr" + image.replace("280x280", "195x195"),
									size_150x150: "https://www.carrefour.fr" + image.replace("280x280", "150x150"),
									size_43x43: "https://www.carrefour.fr" + image.replace("280x280", "43x43")
								}]

								products.push({
									label,
									ean: el?.children[i].children[0].getAttribute("id"),
									brand: "",
									slug: slugify(label) + "-" + el?.children[i].children[0].getAttribute("id"),
									uri: "https://www.carrefour.fr" + el?.children[i].children[0].children[0].children[2].children[0].children[0].children[0].getAttribute("href"),
									packaging: el?.children[i].children[0].children[0].children[2].children[0].children[1].innerText,
									origin: "",
									format: format ? format.innerText : "",
									price: el?.children[i].children[0].children[1].children[1].children[0].innerText.replace("€", ""),
									unit_of_measure: per_unit_label.split("/")[1].trim(),
									per_unit_label,
									tax_message: "",
									per_unit: per_unit_label.split("/")[0].replace("€", "").trim(),
									provider: {
										connect: {
											label: "CARREFOUR"
										}
									},
									marque: {
										connect: {
											label: marqueLabel
										}
									},
									produit_images: {
										create: produit_images
									},
									produit_rayons: { }
								})
							}
						}

						return products
					})

					let produit_rayons = []

					for(let r of rayon.rayons) {
						produit_rayons = [...produit_rayons, {
							rayon:{
								connect: {
									slug: r.slug
								}
							}
						}]
					}

					let products = []
					for(let data of datas) {
						data.produit_rayons = {
							create: produit_rayons
						}
						products = [...products, data]
					}

					result = result.concat(products)
				}

				await page.close();

				results = results.concat(result)
			}

			await this.saveProduits(results)

			await browser.close();
		});
	}

	async saveProduits(products) {
		for(let product of products) {
			await this.ctx.prisma.produit.create({
				data: product
			})
		}
	}

	//endregion
}