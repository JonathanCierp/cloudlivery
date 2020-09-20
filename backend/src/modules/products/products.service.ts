import { HttpStatus, Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { AppService } from "../../app.service"
import { ProductsModel } from "./models/products.model"
import { ProductResponseDto } from "./dto/product-response.dto"
import { ProductsInterface } from "./products.interface"
import { ProductInputDto } from "./dto/product-input.dto"
import { ProvidersModel } from "../providers/providers.model"
import { BrandsModel } from "../brands/brands.model"
import { ProductsImagesModel } from "./models/products-images.model"

@Injectable()
export class ProductsService extends AppService implements ProductsInterface {
	private logger = new Logger(ProductsService.name)
	protected item?: ProductsModel | undefined
	protected items?: ProductsModel[] | undefined

	constructor(@InjectRepository(ProductsModel) private productsModel: Repository<ProductsModel>,
							@InjectRepository(ProductsImagesModel) private productsImages: Repository<ProductsImagesModel>,
							@InjectRepository(ProvidersModel) private providersModel: Repository<ProvidersModel>,
							@InjectRepository(BrandsModel) private brandsModel: Repository<BrandsModel>) {
		super()
	}

	formattedResponseProducts(): ProductResponseDto {
		return {
			...this.formattedResponse(),
			items: this.items,
			item: this.item
		}
	}

	/**
	 * Get all the products
	 * @return Promise<ProductResponseDto>
	 */
	async findAll(): Promise<ProductResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null
			this.message = "Produits récupérés avec succès."
			this.items = await this.productsModel.find({ relations: ["provider", "brand", "productImages"] })
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PRODUCT")
			this.message = `Erreur lors de la récupération des produits.`
			this.items = null
		}

		return this.formattedResponseProducts()
	}

	/**
	 * @param id Number --> Get a product by id
	 * Get one product
	 * @return Promise<ProductResponseDto>
	 */
	async findOne(id: number): Promise<ProductResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null
			this.message = "Produit récupéré avec succès."
			this.item = await this.productsModel.findOne(id, { relations: ["provider", "brand", "productImages"] })
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PRODUCT")
			this.message = `Erreur lors de la récupération du produit.`
			this.item = null
		}

		return this.formattedResponseProducts()
	}

	/**
	 * @param productInputDto ProductInputDto --> Payload send to create object
	 * Create one product
	 * @return Promise<ProductResponseDto>
	 */
	async create(productInputDto: ProductInputDto): Promise<ProductResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null
			this.item = await this.createItem(productInputDto)
			this.message = "Produit créé avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PRODUCT")
			this.message = this.message || `Erreur lors de la création du produit: ${productInputDto.label}.`
			this.item = null
		}

		return this.formattedResponseProducts()
	}

	/**
	 * @param productInputDto ProductInputDto[] --> Contain all providers
	 * Create all products
	 * @return Promise<ProductResponseDto>
	 */
	async createAll(productInputDto: ProductInputDto[]): Promise<ProductResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			this.items = []

			for (let productInputDt of productInputDto) {
				this.items = [...this.items, await this.createItem(productInputDt)]
			}

			if (!this.items) {
				throw new Error(`Erreur lors de la création des produits.`)
			}

			this.message = "Produits créés avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PRODUCT")
			this.message = `Erreur lors de la création des produits.`
			this.items = null
		}

		return this.formattedResponseProducts()
	}

	/**
	 * @param id Number --> Delete a produit by id
	 * Delete a produit
	 * @return Promise<ProductResponseDto>
	 */
	async delete(id: number): Promise<ProductResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			if (!await this.productsModel.remove(await this.productsModel.findOne(id))) {
				throw new Error(`Erreur lors de la suppression du produit: ${id}.`)
			}

			this.message = "Produit supprimé avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PRODUCT")
			this.message = `Erreur lors de la suppression de ce produit.`
		}

		return this.formattedResponseProducts()
	}

	/**
	 * Delete all produits
	 * @return Promise<ProductResponseDto>
	 */
	async deleteAll(): Promise<ProductResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			if (!await this.productsModel.remove(await this.productsModel.find())) {
				throw new Error(`Erreur lors de la suppression des produits.`)
			}
			this.message = "Produits supprimés avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PRODUCT")
			this.message = `Erreur lors de la suppression des produits.`
		}

		return this.formattedResponseProducts()
	}

	/**
	 * @param productInputDto productsModel --> Payload send to modify object
	 * Update a produit
	 * @return Promise<ProductResponseDto>
	 */
	async update(productInputDto: ProductInputDto): Promise<ProductResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			const existById = await this.productsModel.findOne({ id: productInputDto.id })

			if (existById) {
				this.item = await this.productsModel.save(await this.createItem(productInputDto))
			}

			if (!this.item) {
				this.message = "Erreur ce produit n'existe pas."
				throw new Error(`Erreur lors de la modification du produit: ${productInputDto.label}.`)
			}

			this.message = "Produit modifié avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PRODUCT")
			this.message = this.message || `Erreur lors de la modification du produit.`
			this.item = null
		}

		return this.formattedResponseProducts()
	}

	/**
	 * @param productInputDto ProductInputDto[] --> Contain all providers
	 * Create all products for scraping
	 * @return Promise<ProductResponseDto>
	 */
	async createAllFromScraping(productInputDto: ProductInputDto[]): Promise<ProductsModel[]> {
		let items = []

		for (let productInputDt of productInputDto) {
			const exist = await this.productsModel.findOne({
				label: productInputDt.label,
				slug: productInputDt.slug
			})

			if (!exist) {
				let product = this.productsModel.create(productInputDt)

				if (productInputDt.provider) {
					product.provider = await this.providersModel.findOne({ label: productInputDt.provider.label })
				}

				if (productInputDt.brand) {
					product.brand = await this.brandsModel.findOne({ label: productInputDt.brand.label })
				}

				if (productInputDt.productImages) {
					product.productImages = this.productsImages.create(productInputDt.productImages)
				}

				try {
					items = [...items, await this.productsModel.save(product)]
				} catch (e) {
					//console.log(e)
				}
			}
		}

		return items
	}

	/**
	 * @param productInputDto ProductInputDto --> Payload send to create object
	 * Create one product
	 * @return Promise<ProductsModel | undefined>
	 */
	async createItem(productInputDto: ProductInputDto): Promise<ProductsModel | undefined> {
		const exist = await this.productsModel.findOne({ slug: productInputDto.slug })

		if (!exist) {
			let product = this.productsModel.create(productInputDto)

			if (productInputDto.provider) {
				product.provider = await this.providersModel.findOne({ label: productInputDto.provider.label })
			}

			if (productInputDto.brand) {
				product.brand = await this.brandsModel.findOne({ label: productInputDto.brand.label })
			}

			if (productInputDto.productImages) {
				product.productImages = this.productsImages.create(productInputDto.productImages)
			}

			return await this.productsModel.save(product)
		}
	}
}
