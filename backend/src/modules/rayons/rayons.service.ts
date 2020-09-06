import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { RayonsInterface } from "./rayons.interface"
import { RayonTypeDto } from "./dto/rayon-type.dto"
import { RayonInputDto } from "./dto/rayon-input.dto"

@Injectable()
export class RayonsService {
	private logger = new Logger(RayonsService.name);

	constructor(@InjectModel("Rayon") private rayonsInterface: Model<RayonsInterface>){ }

	/**
	 * Get all the rayons
	 * @return Promise<RayonTypeDto[]>
	 */
	async findAll(): Promise<RayonTypeDto[]>{
		try {
			return await this.rayonsInterface.find().exec()
		} catch (e) {
			this.logger.error(`Erreur lors de la récupération des rayons`, "RAYON");
			throw new HttpException(`Erreur lors de la récupération des rayons`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param id String --> Get a rayon by id
	 * @param label String --> Get a rayon by label
	 * Get one rayon
	 * @return Promise<RayonTypeDto>
	 */
	async findOne(id: string, label?: string): Promise<RayonTypeDto>{
		try {
			if(label) {
				return await this.rayonsInterface.findOne({ label })
			}

			return await this.rayonsInterface.findOne({ _id: id })
		} catch (e) {
			this.logger.error(`Erreur lors de la récupération du rayon: ${label || id}`, "RAYON");
			throw new HttpException(`Erreur lors de la récupération du rayon: ${label || id}`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param createRayonDto RayonInputDto --> Payload send to create object
	 * Create one rayon
	 * @return Promise<RayonTypeDto>
	 */
	async create(createRayonDto: RayonInputDto): Promise<RayonTypeDto>{
		try {
			const exist = await this.rayonsInterface.findOne({label: createRayonDto.label})
			if(!exist) {
				const createdRayon = new this.rayonsInterface(createRayonDto)
				return await createdRayon.save()
			}
		} catch (e) {
			this.logger.error(`Erreur lors de la création du rayon: ${createRayonDto.label}`, "RAYON");
			throw new HttpException(`Erreur lors de la création du rayon: ${createRayonDto.label}`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param createRayonDto RayonInputDto[] --> Contain all rayons
	 * Create all rayons
	 * @return Promise<RayonTypeDto[]>
	 */
	async createAll(createRayonDto: RayonInputDto[]): Promise<RayonTypeDto[]>{
		try {
			let createRayonDtos = []
			for (const createRayonDt of createRayonDto) {
				const exist = await this.rayonsInterface.findOne({label: createRayonDt.label})
				if(!exist) {
					const createdRayon = new this.rayonsInterface(createRayonDt)
					createRayonDtos = [...createRayonDtos, await createdRayon.save()]
				}
			}

			return createRayonDtos
		} catch (e) {
			this.logger.error(`Erreur lors de la création des rayons`, "RAYON");
			throw new HttpException(`Erreur lors de la création des rayons`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param id String --> Delete a rayon by id
	 * @param label String --> Delete a rayon by label
	 * Delete a rayon
	 * @return Promise<RayonTypeDto>
	 */
	async delete(id: string, label?: string): Promise<RayonTypeDto>{
		try {
			if(label) {
				return await this.rayonsInterface.findOneAndDelete({ label })
			}

			return await this.rayonsInterface.findOneAndDelete({ _id: id })
		} catch (e) {
			this.logger.error(`Erreur lors de la suppression du rayon: ${label || id}`, "RAYON");
			throw new HttpException(`Erreur lors de la suppression du rayon: ${label || id}`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * Delete all rayons
	 * @return Promise<RayonTypeDto[]>
	 */
	async deleteAll(): Promise<RayonTypeDto[]>{
		try {
			let deleteRayonDtos = []
			const rayons = await this.findAll()
			for (let rayon of rayons) {
				/*deleteRayonDtos = [...deleteRayonDtos, await this.rayonsInterface.findOneAndDelete(rayon.id)]*/
			}

			return deleteRayonDtos
		} catch (e) {
			this.logger.error(`Erreur lors de la suppression des rayons`, "RAYON");
			throw new HttpException(`Erreur lors de la suppression des rayons`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param id String --> Mofify a rayon by id
	 * @param item RayonInputDto --> Payload send to modify object
	 * @param label String --> Mofify a rayon by label
	 * Update a rayon
	 * @return Promise<RayonTypeDto>
	 */
	async update(id: string, item: RayonInputDto, label?: string): Promise<RayonTypeDto>{
		try {
			if(label) {
				return await this.rayonsInterface.findOneAndUpdate({ label }, item, {new: true})
			}

			return await this.rayonsInterface.findByIdAndUpdate(id, item, {new: true})
		} catch (e) {
			this.logger.error(`Erreur lors de la modification du rayon: ${label || id}`, "RAYON");
			throw new HttpException(`Erreur lors de la modification du rayon: ${label || id}`, HttpStatus.BAD_REQUEST)
		}
	}
}
