import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { RayonsModel } from "./rayons.model"
import { RayonInputDto } from "./dto/rayon-input.dto"
import { AppService } from "../../app.service";
import { RayonsInterface } from "./rayons.interface";
import { RayonResponseDto } from "./dto/rayon-response.dto";
import { ProviderResponseDto } from "../providers/dto/provider-response.dto";

@Injectable()
export class RayonsService extends AppService implements RayonsInterface {
	private logger = new Logger(RayonsService.name);
	protected item?: RayonsModel | undefined
	protected items?: RayonsModel[] | undefined

	constructor(@InjectRepository(RayonsModel) private rayonsModel: Repository<RayonsModel>){
		super()
	}

	formattedResponseRayons(): RayonResponseDto {
		return {
			...this.formattedResponse(),
			items: this.items,
			item: this.item
		}
	}

	/**
	 * Get all the rayons
	 * @return Promise<RayonResponseDto>
	 */
	async findAll(): Promise<RayonResponseDto>{
		try {
			this.code = HttpStatus.OK
			this.details = null
			this.message = "Rayons récupérés avec succès."
			this.items = await this.rayonsModel.find()
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = `Erreur lors de la récupération des rayons.`
			this.logger.error(this.details, "RAYON");
			this.message = `Erreur lors de la récupération des rayons.`
			this.items = null
		}

		return this.formattedResponseRayons()
	}

	/**
	 * @param id Number --> Get a rayon by id
	 * Get one rayon
	 * @return Promise<RayonResponseDto>
	 */
	async findOne(id: number): Promise<RayonResponseDto>{
		try {
			this.code = HttpStatus.OK
			this.details = null
			this.message = "Rayon récupéré avec succès."
			this.item = await this.rayonsModel.findOne(id)
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = `Erreur lors de la récupération du rayons: ${id}.`
			this.logger.error(this.details, "RAYON");
			this.message = `Erreur lors de la récupération du rayons.`
			this.item = null
		}

		return this.formattedResponseRayons()
	}

	/**
	 * @param rayonInputDto RayonInputDto --> Payload send to create object
	 * Create one rayon
	 * @return Promise<RayonResponseDto>
	 */
	async create(rayonInputDto: RayonInputDto): Promise<RayonResponseDto>{
		try {
			this.code = HttpStatus.OK
			this.details = null

			const exist = await this.rayonsModel.findOne({where: {label: rayonInputDto.label}})

			if(exist) {
				this.message = "Erreur un rayon existe déjà avec ce nom."
				throw new Error(`Erreur lors de la création du rayon: ${rayonInputDto.label}.`)
			}

			this.item = await this.rayonsModel.save(this.rayonsModel.create(rayonInputDto))
			this.message = "Rayon créé avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "RAYON");
			this.message = this.message || `Erreur lors de la création du rayon: ${rayonInputDto.label}.`
			this.item = null
		}

		return this.formattedResponseRayons()
	}

	/**
	 * @param rayonInputDto RayonInputDto[] --> Contain all rayons
	 * Create all rayons
	 * @return Promise<RayonResponseDto>
	 */
	async createAll(rayonInputDto: RayonInputDto[]): Promise<RayonResponseDto>{
		try {
			this.code = HttpStatus.OK
			this.details = null

			this.items = await this.rayonsModel.save(this.rayonsModel.create(rayonInputDto))

			if(!this.items) {
				throw new Error(`Erreur lors de la création des rayons.`)
			}

			this.message = "Rayons créés avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "RAYON");
			this.message = `Erreur lors de la création des rayons.`
			this.items = null
		}

		return this.formattedResponseRayons()
	}

	/**
	 * @param id Number --> Delete a rayon by id
	 * Delete a rayon
	 * @return Promise<RayonResponseDto>
	 */
	async delete(id: number): Promise<RayonResponseDto>{
		try {
			this.code = HttpStatus.OK
			this.details = null

			if(!await this.rayonsModel.remove(await this.rayonsModel.findOne(id))) {
				throw new Error(`Erreur lors de la suppression du rayon: ${id}.`)
			}

			this.message = "Rayon supprimé avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "RAYON");
			this.message = `Erreur lors de la suppression de ce rayon.`
		}

		return this.formattedResponseRayons()
	}

	/**
	 * Delete all rayons
	 * @return Promise<RayonResponseDto>
	 */
	async deleteAll(): Promise<RayonResponseDto>{
		try {
			this.code = HttpStatus.OK
			this.details = null

			if(!await this.rayonsModel.remove(await this.rayonsModel.find())) {
				throw new Error(`Erreur lors de la suppression des rayons.`)
			}
			this.message = "Rayons supprimés avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "RAYON");
			this.message = `Erreur lors de la suppression des rayons.`
		}

		return this.formattedResponseRayons()
	}

	/**
	 * @param rayonInputDto RayonInputDto --> Payload send to modify object
	 * Update a rayon
	 * @return Promise<RayonResponseDto>
	 */
	async update(rayonInputDto: RayonInputDto): Promise<RayonResponseDto>{
		try {
			this.code = HttpStatus.OK
			this.details = null

			const exist = await this.rayonsModel.findOne({where: {label: rayonInputDto.label}})

			if(exist) {
				if(exist.id !== rayonInputDto.id) {
					this.message = "Erreur un rayon existe déjà avec ce nom."
					throw new Error(`Erreur lors de la modification du rayon: ${rayonInputDto.label}.`)
				}
			}

			const existById = await this.rayonsModel.findOne({where: {id: rayonInputDto.id}})

			if(existById) {
				this.item = await this.rayonsModel.save(this.rayonsModel.create(rayonInputDto))
			}

			if(!this.item) {
				this.message = "Erreur ce rayon n'existe pas."
				throw new Error(`Erreur lors de la modification du rayon: ${rayonInputDto.label}.`)
			}

			this.message = "Rayon modifié avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "RAYON");
			this.message = this.message || `Erreur lors de la modification du rayon.`
			this.item = null
		}

		return this.formattedResponseRayons()
	}
}
