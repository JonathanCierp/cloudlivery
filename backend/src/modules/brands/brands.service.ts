import { HttpStatus, Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { AppService } from "../../app.service"
import { BrandsModel } from "./brands.model"
import { BrandResponseDto } from "./dto/brand-response.dto"
import { BrandsInterface } from "./brands.interface"
import { BrandInputDto } from "./dto/brand-input.dto"

@Injectable()
export class BrandsService extends AppService implements BrandsInterface {
	private logger = new Logger(BrandsService.name)
	protected item?: BrandsModel | undefined
	protected items?: BrandsModel[] | undefined

	constructor(@InjectRepository(BrandsModel) private brandsModel: Repository<BrandsModel>) {
		super()
	}

	formattedResponseBrands(): BrandResponseDto {
		return {
			...this.formattedResponse(),
			items: this.items,
			item: this.item
		}
	}

	/**
	 * Get all the brands
	 * @return Promise<BrandResponseDto>
	 */
	async findAll(): Promise<BrandResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null
			this.message = "Marques récupérées avec succès."
			this.items = await this.brandsModel.find()
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "BRAND")
			this.message = `Erreur lors de la récupération des marques.`
			this.items = null
		}

		return this.formattedResponseBrands()
	}

	/**
	 * @param id Number --> Get a brand by id
	 * Get one brand
	 * @return Promise<BrandResponseDto>
	 */
	async findOne(id: number): Promise<BrandResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null
			this.message = "Marque récupérée avec succès."
			this.item = await this.brandsModel.findOne(id)
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "BRAND")
			this.message = `Erreur lors de la récupération de la marque.`
			this.item = null
		}

		return this.formattedResponseBrands()
	}

	/**
	 * @param brandInputDto BrandInputDto --> Payload send to create object
	 * Create one brand
	 * @return Promise<BrandResponseDto>
	 */
	async create(brandInputDto: BrandInputDto): Promise<BrandResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			const exist = await this.brandsModel.findOne({ label: brandInputDto.label })

			if (exist) {
				this.message = "Erreur une marque existe déjà avec ce nom."
				throw new Error(`Erreur lors de la création de la marque: ${brandInputDto.label}.`)
			}

			this.item = await this.brandsModel.save(this.brandsModel.create(brandInputDto))
			this.message = "Marque créée avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "BRAND")
			this.message = this.message || `Erreur lors de la création de la marque: ${brandInputDto.label}.`
			this.item = null
		}

		return this.formattedResponseBrands()
	}

	/**
	 * @param brandInputDto BrandInputDto[] --> Contain all providers
	 * Create all brands
	 * @return Promise<BrandResponseDto>
	 */
	async createAll(brandInputDto: BrandInputDto[]): Promise<BrandResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			this.items = await this.brandsModel.save(this.brandsModel.create(brandInputDto))

			if (!this.items) {
				throw new Error(`Erreur lors de la création des marques.`)
			}

			this.message = "Marques créés avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "BRAND")
			this.message = `Erreur lors de la création des marques.`
			this.items = null
		}

		return this.formattedResponseBrands()
	}

	/**
	 * @param id Number --> Delete a brand by id
	 * Delete a brand
	 * @return Promise<BrandResponseDto>
	 */
	async delete(id: number): Promise<BrandResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			if (!await this.brandsModel.remove(await this.brandsModel.findOne(id))) {
				throw new Error(`Erreur lors de la suppression du marque: ${id}.`)
			}

			this.message = "Marque supprimé avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "BRAND")
			this.message = `Erreur lors de la suppression de ce marque.`
		}

		return this.formattedResponseBrands()
	}

	/**
	 * Delete all brand
	 * @return Promise<BrandResponseDto>
	 */
	async deleteAll(): Promise<BrandResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			if (!await this.brandsModel.remove(await this.brandsModel.find())) {
				throw new Error(`Erreur lors de la suppression des marques.`)
			}
			this.message = "Marques supprimées avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "BRAND")
			this.message = `Erreur lors de la suppression des marques.`
		}

		return this.formattedResponseBrands()
	}

	/**
	 * @param brandInputDto brandsModel --> Payload send to modify object
	 * Update a brand
	 * @return Promise<BrandResponseDto>
	 */
	async update(brandInputDto: BrandInputDto): Promise<BrandResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			const exist = await this.brandsModel.findOne({ label: brandInputDto.label })

			if (exist) {
				if (exist.id !== brandInputDto.id) {
					this.message = "Erreur une marque existe déjà avec ce nom."
					throw new Error(`Erreur lors de la modification de la marque: ${brandInputDto.label}.`)
				}

				this.item = await this.brandsModel.save(this.brandsModel.create(brandInputDto))
			}

			const existById = await this.brandsModel.findOne({ id: brandInputDto.id })

			if (existById) {
				this.item = await this.brandsModel.save(this.brandsModel.create(brandInputDto))
			}

			if (!this.item) {
				this.message = "Erreur cette marque n'existe pas."
				throw new Error(`Erreur lors de la modification de la marque: ${brandInputDto.label}.`)
			}

			this.message = "Marque modifié avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "BRAND")
			this.message = this.message || `Erreur lors de la modification de la marque.`
			this.item = null
		}

		return this.formattedResponseBrands()
	}
}
