import { HttpStatus, Injectable, Logger } from "@nestjs/common"
import { AppService } from "../../app.service"
import { ScrapingResponseDto } from "./dto/scraping-response.dto";
import * as puppeteer from "puppeteer"
import { ProductInputDto } from "../products/dto/product-input.dto";
import { slugify } from "../../utils/functions";

@Injectable()
export class ScrapingsService extends AppService {
	private logger = new Logger(ScrapingsService.name)

	constructor() {
		super()
	}

	formattedResponseScrapings(): ScrapingResponseDto {
		return this.formattedResponse()
	}

	/**
	 * Scraping
	 * @return Promise<ScrapingResponseDto>
	 */
	async scraping(): Promise<ScrapingResponseDto> {
		try {
			await this.start()
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
	async start(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start scraping ...")
		const browser = await puppeteer.launch({stealth: true, headless: true});
		const page = await browser.newPage()
		try {
			let results = await this.startScrapingAuchan(browser, page)
			
			//console.log(results)
		} catch (e) {
			
		}
		//await page.close()
		await browser.close()
		console.log("End scraping : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Start scraping Auchan
	 * @return Promise<Array<any>>
	 */
	async startScrapingAuchan(browser, page): Promise<ProductInputDto[]> {
		let start_time = new Date().getTime();
		console.log("Start scraping Auchan ...")

		await page.goto("https://www.auchan.fr/courses?storeReference=527&lark-b2cd=1&gclid=Cj0KCQjwg8n5BRCdARIsALxKb96rKyvvgqxQeqFUb5t4JQXV3T30PFNhn9-Su5TDZuT2CRlGRe23_ZIaAvh-EALw_wcB");
		await page.goto("https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-demi-ecreme/ca-n01010101")

		const products = await page.$eval(".list__container", el => {
			let products: ProductInputDto[] = []

			for(let i in el.children) {
				if (el?.children[i]?.innerText) {
					products = [...products, {
						provider: {
							label: "AUCHAN"
						},
						brand: {
							label: ""
						},
						label: el.children[i].querySelector(".product-thumbnail__description").innerText,
						ean: "",
						slug: "",
						uri: "https://www.auchan.fr" + el.children[i].querySelector(".product-thumbnail__details-wrapper").getAttribute("href"),
						packaging: el.children[i].querySelector(".product-attribute").innerText,
						price: el.children[i].querySelector(".product-price").innerText,
						perUnitLabel: el.children[i].querySelector("[data-seller-type='GROCERY']").innerText,
						perUnit: el.children[i].querySelector(".product-attribute").innerText.split("/")[0],
						unitOfMeasure: el.children[i].querySelector(".product-attribute").innerText.split("/")[1],
					}]
				}
				break
			}

			return products
		})
		const result = await this.treatScrapingAuchan(page, products)

		console.log("End scraping Auchan : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))

		return result
	}

	async treatScrapingAuchan(page, products: ProductInputDto[]): Promise<ProductInputDto[]> {
		const results: ProductInputDto[] = [...products]

		for(let result of results) {
			result.slug = slugify(result.label)
			await page.goto(result.uri)
			console.log(result.uri)
			console.log(await page.$eval(".product-description", el => el.children[0].innerText))
			result.ean = await page.$eval(".product-description__feature-values", el => el.innerText)
			break
		}

		return results
	}
}
