import { HttpStatus, Injectable, Logger } from "@nestjs/common"
import { AppService } from "../../app.service"
import { ScrapingResponseDto } from "./dto/scraping-response.dto"
import { ProductInputDto } from "../products/dto/product-input.dto"
import { slugify } from "../../utils/functions"
import { brands, groups } from "../../sources"
import { ProductsService } from "../products/products.service"
import { InjectRepository } from "@nestjs/typeorm"
import { ProductsModel } from "../products/models/products.model"
import { Repository } from "typeorm"
import { ProductsImagesModel } from "../products/models/products-images.model"
import { ProvidersModel } from "../providers/providers.model"
import { BrandsModel } from "../brands/brands.model"
import { BrandInputDto } from "../brands/dto/brand-input.dto"
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
import algoliasearch from "algoliasearch"
import { GroupsModel } from "../groups/groups.model";

@Injectable()
export class ScrapingsService extends AppService {
	protected item?: ProductsModel | undefined
	protected items?: ProductsModel[] | undefined
	private logger = new Logger(ScrapingsService.name)

	constructor(
		@InjectRepository(ProductsModel) private productsModel: Repository<ProductsModel>,
		@InjectRepository(ProductsImagesModel) private productsImages: Repository<ProductsImagesModel>,
		@InjectRepository(ProvidersModel) private providersModel: Repository<ProvidersModel>,
		@InjectRepository(BrandsModel) private brandsModel: Repository<BrandsModel>,
		@InjectRepository(GroupsModel) private groupModel: Repository<GroupsModel>
	) {
		super()
	}

	formattedResponseScrapings(): ScrapingResponseDto {
		return {
			...this.formattedResponse(),
			items: this.items,
			item: this.item
		}
	}

	/**
	 * Scraping
	 * @return Promise<ScrapingResponseDto>
	 */
	async scraping(): Promise<ScrapingResponseDto> {
		try {
			this.items = await this.start()
			this.code = HttpStatus.OK
			this.details = null
			this.message = "Scraping effectué avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "SCRAPING")
			this.message = `Erreur lors du scraping.`
		}

		return this.formattedResponseScrapings()
	}

	/**
	 * Start scraping
	 * @return Promise<void>
	 */
	async start(): Promise<ProductsModel[]> {
		let results = []
		let products: ProductsModel[]
		let start_time = new Date().getTime()
		console.log("Start scraping ...")
		const browser = await puppeteer.launch({ headless: true })
		const page = await browser.newPage()
		try {
			results = await this.startScrapingAuchan(browser, page)
			results = results.concat(await this.startScrapingCarrefour(browser))

			products = await this.saveProducts(results)
		} catch (e) {

		}

		await browser.close()
		console.log("End scraping : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))

		return products
	}

	/**
	 * Start scraping Auchan
	 * @return Promise<Array<any>>
	 */
	async startScrapingAuchan(browser, page): Promise<ProductInputDto[]> {
		return new Promise(async (resolve, reject) => {
			const fn = async () => {
				let start_time = new Date().getTime()
				console.log("Start scraping Auchan ...")
				await page.goto("https://www.auchan.fr/courses?storeReference=527&lark-b2cd=1&gclid=Cj0KCQjwg8n5BRCdARIsALxKb96rKyvvgqxQeqFUb5t4JQXV3T30PFNhn9-Su5TDZuT2CRlGRe23_ZIaAvh-EALw_wcB")
				let products: ProductsModel[] = []

				for (let group of groups) {
					const pageGroup = await browser.newPage()

					await pageGroup.goto(group.urlAuchan)
					console.log(`Scrap auchan url : ${group.urlAuchan}`)
					let p = await pageGroup.$eval(".main-wrapper", el => {
						let products: ProductInputDto[] = []

						for (let i in el?.querySelector(".list__container")?.children) {
							let children = el?.querySelector(".list__container")?.children
							if (children[i]?.innerText) {
								let label = children[i]?.querySelector(".product-thumbnail__description")?.innerText

								if (label) {
									//@ts-ignore
									products = [...products, {
										provider: {
											label: "AUCHAN"
										},
										brand: {
											label: ""
										},
										label,
										ean: "",
										slug: "",
										uri: "https://www.auchan.fr" + children[i]?.querySelector(".product-thumbnail__details-wrapper")?.getAttribute("href"),
										packaging: children[i]?.querySelector(".product-attribute")?.innerText,
										price: children[i]?.querySelector(".product-price")?.innerText,
										perUnitLabel: children[i]?.querySelector(".product-thumbnail__attributes [data-seller-type='GROCERY']")?.innerText,
										perUnit: children[i]?.querySelector(".product-thumbnail__attributes [data-seller-type='GROCERY']")?.innerText?.split("/")[0].trim(),
										unitOfMeasure: children[i]?.querySelector(".product-thumbnail__attributes [data-seller-type='GROCERY']")?.innerText?.split("/")[1].trim(),
										productImages: []
									}]
								}
							}
						}

						return products
					})
					for (let v of p) {
						v.group = group
					}

					products = products.concat(p)

					await pageGroup.close()
				}

				//@ts-ignore
				let results = await this.treatScrapingAuchan(browser, products)
				console.log("End scraping Auchan : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))

				return results
			}
			resolve(await fn())
		})
	}

	async treatScrapingAuchan(browser, products: ProductInputDto[]): Promise<ProductInputDto[]> {
		const results: ProductInputDto[] = [...products]
		const page = await browser.newPage()
		for (let result of results) {
			result.brand.label = await this.extractMarqueLabel(result.label)
			console.log(result.uri)
			await page.goto(result.uri)
			const refs = await page.$eval(".product-description .product-description__feature-wrapper:last-child .product-description__feature-values", el => el?.innerText?.split("/"))
			result.ean = refs?.length ? refs[refs.length - 1]?.trim() : ""
			result.productImages = [...result.productImages, {
				largest: await page.$eval(".product-gallery__picture", el => el?.getAttribute("src"))
			}]
			result.slug = slugify(result.label) + "-" + result.ean
		}
		await page.close()

		return results
	}

	/**
	 * Start scraping Carrefour
	 * @return Promise<Array<any>>
	 */
	async startScrapingCarrefour(browser): Promise<ProductInputDto[]> {
		return new Promise(async (resolve, reject) => {
			const fn = async () => {
				let start_time = new Date().getTime()
				console.log("Start scraping Carrefour ...")
				let products: ProductsModel[] = []

				for (let group of groups) {
					const pageGroup = await browser.newPage()
					let i: number = 1

					await pageGroup.goto(group.urlCarrefour + "?noRedirect=1&page=" + i)
					console.log(`Scrap carrefour url : ${group.urlCarrefour + "?noRedirect=1&page=" + i}`)
					let p = await pageGroup.$eval(".side-template__section", el => {
						let products: ProductInputDto[] = []
						let elem = el?.children[2].querySelector(".pagination ~ul#data-plp_produits.product-grid").children

						for (let i in elem) {
							let label = i <= "60" ? elem[i]?.querySelector(".ds-title.ds-title--medium.ds-title--s")?.innerText : ""

							if (label) {
								let ean = i <= "60" ? elem[i]?.querySelector(".ds-product-card--vertical.ds-product-card")?.getAttribute("id") : ""
								let marqueLabel = ""

								const brandss: BrandInputDto[] = [
									{
										label: "SANS MARQUE"
									},
									{
										label: "LA MARQUE DU CONSOMMATEUR"
									},
									{
										label: "AGRILAIT"
									},
									{
										label: "BASKALIA"
									},
									{
										label: "BEARN LAIT"
									},
									{
										label: "C'EST QUI LE PATRON ?!"
									},
									{
										label: "CANDIA"
									},
									{
										label: "CARREFOUR BIO"
									},
									{
										label: "CARREFOUR"
									},
									{
										label: "ET ALDIA"
									},
									{
										label: "FAIREFRANCE"
									},
									{
										label: "GERENTE"
									},
									{
										label: "GRANDLAIT"
									},
									{
										label: "J'AIME LE LAIT D'ICI"
									},
									{
										label: "LACTEL"
									},
									{
										label: "LACTEL BIO"
									},
									{
										label: "LAITERIE LES FAYES"
									},
									{
										label: "LAITIK"
									},
									{
										label: "LE GALL"
									},
									{
										label: "LE LAIT DE MA REGION"
									},
									{
										label: "LE LAIT EQUITABLE SARTHOIS"
									},
									{
										label: "LE PETIT VENDEEN"
									},
									{
										label: "LES FAYES"
									},
									{
										label: "LES LAITIERS RESPONSABLES"
									},
									{
										label: "MONT LAIT"
									},
									{
										label: "ONETIK"
									},
									{
										label: "VERNEUIL"
									},
									{
										label: "CHARAL"
									},
									{
										label: "SOCOPA"
									},
									{
										label: "TENDRE ET PLUS"
									},
									{
										label: "MAITRE JACQUES"
									},
									{
										label: "TENDRIADE"
									},
									{
										label: "JEMANGEFRANÇAIS.COM"
									},
									{
										label: "BIGARD"
									},
									{
										label: "HENAFF"
									},
									{
										label: "METRAS TRIPIER EN PROVENCE"
									},
									{
										label: "LE MARCHE"
									},
									{
										label: "PAILLARD"
									},
									{
										label: "LES BONS MORCEAUX"
									},
									{
										label: "LES BRASERADES"
									},
									{
										label: "JOHNSONVILLE"
									},
									{
										label: "LA BRESSE"
									},
									{
										label: "NOBLES"
									},
									{
										label: "ALDELIS"
									},
									{
										label: "DOUCE FRANCE"
									},
									{
										label: "MADRANCE"
									},
									{
										label: "MORITZ"
									},
									{
										label: "PEGASE"
									},
									{
										label: "DABIA"
									},
									{
										label: "DELICADEZAS IBERICAS"
									},
									{
										label: "GRAND CARACTERE"
									},
									{
										label: "KLEIN KAROO"
									},
									{
										label: "LES OCCITANES"
									},
									{
										label: "LIONOR"
									},
									{
										label: "SOURIRES DE CAMPAGNE"
									},
									{
										label: "CLERMONT"
									},
									{
										label: "COOPERL"
									},
									{
										label: "DE FAUX FILET"
									},
									{
										label: "ELIVIA"
									},
									{
										label: "HIRUAK"
									},
									{
										label: "INDIANA JERKY"
									},
									{
										label: "LE GAULOIS"
									},
									{
										label: "LES ELEVEURS DE CHEZ NOUS"
									},
									{
										label: "ROYAL HALAL"
									},
									{
										label: "TRIPES PAILLARD"
									},
									{
										label: "VIAZUR"
									},
									{
										label: "refuge_de_marie_louise"
									},
									{
										label: "REFS.SANS MARQUE"
									},
									{
										label: "BABY COQUE"
									},
									{
										label: "COQUY"
									},
									{
										label: "L'OEUFS DE NOS VILLA"
									},
									{
										label: "COQUEN'OR"
									},
									{
										label: "LOUE"
									},
									{
										label: "COCORETTE"
									},
									{
										label: "LUSTUCRU"
									},
									{
										label: "MIELS VILLENEUVE"
									},
									{
										label: "OEUF ARRADOY"
									},
									{
										label: "COTEAUX PEYRIGNAC"
									},
									{
										label: "AVIBRESSE"
									},
									{
										label: "BISCUITERIE COMTOISE"
									},
									{
										label: "C'EST QUI LE PATRON"
									},
									{
										label: "L'OEUF GASCON"
									},
									{
										label: "LA NOUVELLE AGRICULTURE"
									},
									{
										label: "MATINES"
									},
									{
										label: "OEUFS TRADITION"
									},
									{
										label: "OVALIS"
									},
									{
										label: "PP BLANC"
									},
									{
										label: "PP NO NAME"
									},
									{
										label: "CRF CDM"
									},
									{
										label: "L'OEUF RIESTAHL"
									},
									{
										label: "LE CLOS ST JACQUES"
									},
									{
										label: "LES CAMPAGNES"
									},
									{
										label: "OEUF CHAMPAG.ARDENNE"
									},
									{
										label: "OEUF VIEUX PRESSOIR"
									},
									{
										label: "POULE HOUSE"
									},
									{
										label: "SARL ROUSSILLON OEUF"
									},
									{
										label: "SAINT AMAND"
									},
									{
										label: "VITTEL"
									},
									{
										label: "CRISTALINE"
									},
									{
										label: "EVIAN"
									},
									{
										label: "ABATILLES"
									},
									{
										label: "COURMAYEUR"
									},
									{
										label: "HEPAR"
									},
									{
										label: "PLANCOET"
									},
									{
										label: "VOLVIC"
									},
									{
										label: "planet_drinks"
									},
									{
										label: "CONTREX"
									},
									{
										label: "MONT BLANC"
									},
									{
										label: "MONT ROUCOUS"
									},
									{
										label: "OGEU"
									},
									{
										label: "PIERVAL"
									},
									{
										label: "ST GEORGES"
									},
									{
										label: "STE ALIX"
									},
									{
										label: "THONON"
									},
									{
										label: "WATTWILLER"
									},
									{
										label: "AURELE"
									},
									{
										label: "JOLIVAL"
									},
									{
										label: "PERRIER"
									},
									{
										label: "SAN PELLEGRINO"
									},
									{
										label: "BABOIT"
									},
									{
										label: "ROZANA"
									},
									{
										label: "VALS"
									},
									{
										label: "VICHY CELESTINS"
									},
									{
										label: "ARCENS"
									},
									{
										label: "QUEZAC"
									},
									{
										label: "ST-YORRE"
									},
									{
										label: "HIGHTLAND SPRING"
									},
									{
										label: "OREZZA"
									},
									{
										label: "PAROT"
									},
									{
										label: "SALVETAT"
									},
									{
										label: "ST ALBAN"
									},
									{
										label: "ST YORRE"
									},
									{
										label: "VERNIERE"
									},
									{
										label: "BADOIT"
									},
									{
										label: "CONTREX GREEN"
									},
									{
										label: "VOLVICJUICY"
									},
									{
										label: "PERRIER & JUICE"
									},
									{
										label: "VITTEL UP"
									},
									{
										label: "VOLVIC JUICY"
									},
									{
										label: "COCA-COLA"
									},
									{
										label: "COCA-COLA ZERO"
									},
									{
										label: "BREIZH COLA"
									},
									{
										label: "MEUH COLA"
									},
									{
										label: "COCA COLA"
									},
									{
										label: "CORSICA COLA"
									},
									{
										label: "GALVANINA"
									},
									{
										label: "HAMOUD BOUALEM"
									},
									{
										label: "PEPSI"
									},
									{
										label: "PEPSI MAX"
									},
									{
										label: "QUEBEC"
									},
									{
										label: "TETES BRULEES MIX & KIFF"
									},
									{
										label: "LORINA"
									},
									{
										label: "SCHWEPPES"
									},
									{
										label: "7UP"
									},
									{
										label: "BOX"
									},
									{
										label: "FEVER TREE"
									},
									{
										label: "SPRITE"
									},
									{
										label: "BREIZH"
									},
									{
										label: "BREIZH-LIMO"
									},
									{
										label: "LA GOSSE"
									},
									{
										label: "LEMONAID"
									},
									{
										label: "LIMONETTE"
									},
									{
										label: "MARIE DOLIN"
									},
									{
										label: "ORIGINAL TONIC"
									},
									{
										label: "VOSS"
									},
									{
										label: "MONSTER ENERGY"
									},
									{
										label: "RED BULL"
									},
									{
										label: "CRAZY TIGER"
									},
									{
										label: "MME GREEN"
									},
									{
										label: "PSYCHIK"
									},
									{
										label: "PUMA"
									},
									{
										label: "DIUKE"
									},
									{
										label: "HEROIC PLUS"
									},
									{
										label: "MONSTER"
									},
									{
										label: "POWERADE"
									},
									{
										label: "AUCHAN"
									},
									{
										label: "AUCHAN BIO"
									},
									{
										label: "C'EST QUI LE PATRON?"
									},
									{
										label: "POUCE"
									},
									{
										label: "AUCHAN GOURMET"
									},
									{
										label: "MADRANGE"
									},
									{
										label: "MMM!"
									},
									{
										label: "BROCELIANDE"
									},
									{
										label: "NATURE DE FRANCE"
									},
									{
										label: "POULEHOUSE"
									},
									{
										label: "NESTLE"
									},
									{
										label: "ST AMAND"
									},
									{
										label: "VICHY ST YORRE"
									},
									{
										label: "OASIS"
									},
									{
										label: "TEISSEIRE"
									},
									{
										label: "DR PEPPER"
									},
									{
										label: "CANADA DRY"
									},
									{
										label: "GINI"
									},
									{
										label: "MEGA FORCE"
									}
								]

								for (let brand of brandss) {
									if (label?.toLowerCase()?.includes("auchan bio")) {
										marqueLabel = "AUCHAN BIO"
									} else if (label?.toLowerCase()?.includes("auchan")) {
										marqueLabel = "AUCHAN"
									}else if (label?.toLowerCase()?.includes("carrefour bio")) {
										marqueLabel = "CARREFOUR BIO"
									} else if (label?.toLowerCase()?.includes("carrefour")) {
										marqueLabel = "CARREFOUR"
									} else if (label?.toLowerCase()?.includes("c'est qui le patron ?!")) {
										marqueLabel = "C'EST QUI LE PATRON ?!"
									} else if (label?.toLowerCase()?.includes("c'est qui le patron")) {
										marqueLabel = "C'EST QUI LE PATRON"
									} else if (label?.toLowerCase()?.includes(brand?.label?.toLowerCase())) {
										marqueLabel = brand?.label
									}
								}

								let slug = label?.toString()
									.normalize('NFD')
									.replace(/[\u0300-\u036f]/g, '')
									.toLowerCase()
									.trim()
									.replace(/\s+/g, '-')
									.replace(/[^\w-]+/g, '')
									.replace(/--+/g, '-')

								//@ts-ignore
								products = [...products, {
									provider: {
										label: "CARREFOUR"
									},
									brand: {
										label: marqueLabel
									},
									label,
									ean,
									slug: slug + "-" + ean,
									uri: i <= "60" ? "https://www.carrefour.fr" + elem[i]?.querySelector(".product-card-title.product-card-title__reduced-line-clamp")?.getAttribute("href") : "",
									packaging: i <= "60" ? elem[i]?.querySelector(".ds-body-text.ds-product-card__packaging.ds-body-text--size-s.ds-body-text--color-standard-3")?.innerText : "",
									price: i <= "60" ? elem[i]?.querySelector(".ds-title.product-card-price__price--final.ds-title--m")?.innerText : "",
									perUnitLabel: i <= "60" ? elem[i]?.querySelector(".ds-body-text.ds-product-card__perunitlabel.ds-body-text--size-s.ds-body-text--color-standard-3")?.innerText : "",
									perUnit: i <= "60" ? elem[i]?.querySelector(".ds-body-text.ds-product-card__perunitlabel.ds-body-text--size-s.ds-body-text--color-standard-3")?.innerText?.split("/")[0].trim() : "",
									unitOfMeasure: i <= "60" ? elem[i]?.querySelector(".ds-body-text.ds-product-card__perunitlabel.ds-body-text--size-s.ds-body-text--color-standard-3")?.innerText?.split("/")[1].trim() : "",
									productImages: [
										{
											largest: i <= "60" ? "https://www.carrefour.fr" + elem[i]?.querySelector(".image.product-card-image__image")?.getAttribute("src") : ""
										}
									]
								}]
							}
						}

						return products
					})
					for (let v of p) {
						v.group = group
					}
					products = products.concat(p)
					await this.sleep(20000)

					await pageGroup.close()
				}

				let results = products
				console.log("End scraping Carrefour : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))

				return results
			}
			//@ts-ignore
			resolve(await fn())
		})
	}

	async sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async extractMarqueLabel(label: string): Promise<string> {
		let marqueLabel = ""

		for (let brand of brands) {
			if (label?.toLowerCase()?.includes("auchan bio")) {
				marqueLabel = "AUCHAN BIO"
			} else if (label?.toLowerCase()?.includes("auchan")) {
				marqueLabel = "AUCHAN"
			}else if (label?.toLowerCase()?.includes("carrefour bio")) {
				marqueLabel = "CARREFOUR BIO"
			} else if (label?.toLowerCase()?.includes("carrefour")) {
				marqueLabel = "CARREFOUR"
			} else if (label?.toLowerCase()?.includes("c'est qui le patron ?!")) {
				marqueLabel = "C'EST QUI LE PATRON ?!"
			} else if (label?.toLowerCase()?.includes("c'est qui le patron")) {
				marqueLabel = "C'EST QUI LE PATRON"
			} else if (label?.toLowerCase()?.includes(brand?.label?.toLowerCase())) {
				marqueLabel = brand?.label
			}
		}

		return marqueLabel
	}

	async saveProducts(results: ProductInputDto[]): Promise<ProductsModel[]> {
		const productsService = new ProductsService(this.productsModel, this.productsImages, this.providersModel, this.brandsModel, this.groupModel)

		return await productsService.createAllFromScraping(results)
	}

	async algoliaIndexing(type?: string): Promise<ScrapingResponseDto> {
		try {
			this.items = await this.productsModel.find({ relations: ["provider", "brand", "productImages", "group"] })
			const client = algoliasearch("2O4QB4BTXT", "2854ce3f66efd5fb73631322653ee44b");
			let index
			
			if(type === "CARREFOUR" || type === "AUCHAN") {
				this.items = this.items.filter(item => item.provider.label === type)
				index = client.initIndex(type);
			}

			if(type === "ALL") {
				index = client.initIndex("ALL");
			}

			if(type === "COMPARATEUR") {
				index = client.initIndex("COMPARATEUR");
				let array1 = []
				let products = []
				for(let item of this.items) {
					if(this.items.filter(itemF => itemF.ean === item.ean).length > 1) {
						let exist = array1.find(product => product.ean === item.ean)

						if(!exist) {
							array1 = [...array1, item]
						}else {
							if(item.provider.label === "CARREFOUR" && exist.provider.label === "AUCHAN") {
								//@ts-ignore
								item.price_carrefour = item.price
								//@ts-ignore
								item.price_auchan = exist.price
								//@ts-ignore
								item.url_carrefour = item.uri
								//@ts-ignore
								item.url_auchan = exist.uri
								//@ts-ignore
								item.price = ((parseFloat(item.price.split("€")[0].replace(",", ".")) + parseFloat(exist.price.split("€")[0].replace(",", "."))) / 2).toFixed(2) + "€"
							}else {
								//@ts-ignore
								item.price_carrefour = exist.price
								//@ts-ignore
								item.price_auchan = item.price
								//@ts-ignore
								item.url_carrefour = exist.uri
								//@ts-ignore
								item.url_auchan = item.uri
								//@ts-ignore
								item.price = ((parseFloat(item.price.split("€")[0].replace(",", ".")) + parseFloat(exist.price.split("€")[0].replace(",", "."))) / 2).toFixed(2) + "€"
							}

							if(item.price.split("€")[0].replace(",", ".") < exist.price.split("€")[0].replace(",", ".")) {
								products = [...products, item]
							}else {
								products = [...products, exist]
							}
						}
					}
				}
				this.items = products
			}

			index.clearObjects().then(() => {
				index.saveObjects(this.items, {autoGenerateObjectIDIfNotExist: true})
			})
			this.code = HttpStatus.OK
			this.details = null
			this.message = "Scraping effectué avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "SCRAPING")
			this.message = `Erreur lors du scraping.`
		}

		return this.formattedResponseScrapings()
	}
}
