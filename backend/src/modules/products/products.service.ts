import { HttpStatus, Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { AppService } from "../../app.service"
import { ProductsModel } from "./models/products.model"
import { ProductResponseDto } from "./dto/product-response.dto"
import { ProductsInterface } from "./products.interface"
import { ProductInputDto } from "./dto/product-input.dto"

@Injectable()
export class ProductsService extends AppService implements ProductsInterface {
	private logger = new Logger(ProductsService.name)
	protected item?: ProductsModel | undefined
	protected items?: ProductsModel[] | undefined

	constructor(@InjectRepository(ProductsModel) private productsModel: Repository<ProductsModel>) {
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
			this.items = await this.productsModel.find()
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
			this.item = await this.productsModel.findOne(id)
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

			const exist = await this.productsModel.findOne({ label: productInputDto.label })

			if (exist) {
				this.message = "Erreur un produit existe déjà avec ce nom."
				throw new Error(`Erreur lors de la création du produit: ${productInputDto.label}.`)
			}

			this.item = await this.productsModel.save(this.productsModel.create(productInputDto))
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

			this.items = await this.productsModel.save(this.productsModel.create(productInputDto))

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

			const exist = await this.productsModel.findOne({ label: productInputDto.label })

			if (exist) {
				if (exist.id !== productInputDto.id) {
					this.message = "Erreur un produit existe déjà avec ce nom."
					throw new Error(`Erreur lors de la modification du produit: ${productInputDto.label}.`)
				}

				this.item = await this.productsModel.save(this.productsModel.create(productInputDto))
			}

			const existById = await this.productsModel.findOne({ id: productInputDto.id })

			if (existById) {
				this.item = await this.productsModel.save(this.productsModel.create(productInputDto))
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
}
