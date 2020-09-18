import { HttpStatus, Injectable, Logger } from "@nestjs/common"
import { AppService } from "../../app.service"
import { ScrapingResponseDto } from "./dto/scraping-response.dto";
import * as puppeteer from "puppeteer"
import { ProductInputDto } from "../products/dto/product-input.dto";
import { slugify } from "../../utils/functions";
import { brands, groups } from "../../sources";
import { ProductsService } from "../products/products.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductsModel } from "../products/models/products.model";
import { Repository } from "typeorm";
import { ProductsImagesModel } from "../products/models/products-images.model";
import { ProvidersModel } from "../providers/providers.model";
import { BrandsModel } from "../brands/brands.model";
import { ProductResponseDto } from "../products/dto/product-response.dto";

@Injectable()
export class ScrapingsService extends AppService {
	protected item?: ProductsModel | undefined
	protected items?: ProductsModel[] | undefined
	private logger = new Logger(ScrapingsService.name)

	constructor(
		@InjectRepository(ProductsModel) private productsModel: Repository<ProductsModel>,
		@InjectRepository(ProductsImagesModel) private productsImages: Repository<ProductsImagesModel>,
		@InjectRepository(ProvidersModel) private providersModel: Repository<ProvidersModel>,
		@InjectRepository(BrandsModel) private brandsModel: Repository<BrandsModel>
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
		let start_time = new Date().getTime();
		console.log("Start scraping ...")
		const browser = await puppeteer.launch({stealth: true, headless: true});
		const page = await browser.newPage()
		try {
			results = await this.startScrapingAuchan(browser, page)

			//await this.saveProducts(results)
		} catch (e) {

		}

		await browser.close()
		console.log(results.length + " products added...")
		console.log("End scraping : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))

		return results
	}

	/**
	 * Start scraping Auchan
	 * @return Promise<Array<any>>
	 */
	async startScrapingAuchan(browser, page): Promise<ProductInputDto[]> {

		return new Promise(async (resolve, reject) => {
			const fn = async () => {
				let results = []
				let start_time = new Date().getTime();
				console.log("Start scraping Auchan ...")

				await page.goto("https://www.auchan.fr/courses?storeReference=527&lark-b2cd=1&gclid=Cj0KCQjwg8n5BRCdARIsALxKb96rKyvvgqxQeqFUb5t4JQXV3T30PFNhn9-Su5TDZuT2CRlGRe23_ZIaAvh-EALw_wcB");
				for (let group of groups) {
					const pageGroup = await browser.newPage()
					let products: ProductsModel[] = []
					let i: number = 1
					let url: string = ""
					
					/*do {
						if (i > 1) {
							url = `${group.urlAuchan}?page=${i}`
						} else {
							url = group.urlAuchan
						}
						
						await pageGroup.goto(url)
						console.log(`Scrap auchan url : ${url}`)
						
						products = products.concat(await pageGroup.$eval(".main-wrapper", el => {
							let products: ProductInputDto[] = []

							for (let i in el?.querySelector(".list__container")?.children) {
								let children = el?.querySelector(".list__container")?.children
								if (children[i]?.innerText) {
									let label = children[i]?.querySelector(".product-thumbnail__description")?.innerText

									if (label) {
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
						}))
						i++
					} while (products.length % 30 === 0)
*/
					await pageGroup.goto(group.urlAuchan)
					const test = await pageGroup.$eval(".main-wrapper", el => {
						let products: ProductInputDto[] = []

						for (let i in el?.querySelector(".list__container")?.children) {
							let children = el?.querySelector(".list__container")?.children
							if (children[i]?.innerText) {
								let label = children[i]?.querySelector(".product-thumbnail__description")?.innerText

								if (label) {
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
					console.log(test.length)
					//results = results.concat(await this.treatScrapingAuchan(page, products))
					await pageGroup.close()
				}

				console.log(results.length + " auchan products added...")
				console.log("End scraping Auchan : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))

				return results
			}
			resolve(await fn())
		})
	}

	async treatScrapingAuchan(page, products: ProductInputDto[]): Promise<ProductInputDto[]> {
		const results: ProductInputDto[] = [...products]

		for (let result of results) {
			result.brand.label = await this.extractMarqueLabel(result.label)
			result.slug = slugify(result.label)
			await page.goto(result.uri)
			const refs = await page.$eval(".product-description .product-description__feature-wrapper:last-child .product-description__feature-values", el => el?.innerText?.split("/"))
			result.ean = refs[refs.length - 1]?.trim()
			result.productImages = [...result.productImages, {
				largest: await page.$eval(".product-gallery__picture", el => el?.getAttribute("src"))
			}]
		}

		return results
	}

	async extractMarqueLabel(label: string): Promise<string> {
		let marqueLabel = ""

		for (let brand of brands) {
			if (label?.toLowerCase()?.includes("auchan bio")) {
				marqueLabel = "AUCHAN BIO"
			} else if (label?.toLowerCase()?.includes("auchan")) {
				marqueLabel = "AUCHAN"
			} else if (label?.toLowerCase()?.includes(brand?.label?.toLowerCase())) {
				marqueLabel = brand?.label
			}
		}

		return marqueLabel
	}

	async saveProducts(results: ProductInputDto[]): Promise<ProductResponseDto> {
		const productsService = new ProductsService(this.productsModel, this.productsImages, this.providersModel, this.brandsModel)

		return await productsService.createAll(results)
	}
}
