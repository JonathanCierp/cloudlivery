import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { GroupRayonsInterface } from "./group-rayons.interface"
import { GroupRayonTypeDto } from "./dto/group-rayon-type.dto"
import { GroupRayonInputDto } from "./dto/group-rayon-input.dto"

@Injectable()
export class GroupRayonsService {
	private logger = new Logger(GroupRayonsService.name);

	constructor(@InjectModel("GroupRayon") private groupRayonsInterface: Model<GroupRayonsInterface>){ }

	/**
	 * Get all the group rayons
	 * @return Promise<GroupRayonTypeDto[]>
	 */
	async findAll(): Promise<GroupRayonTypeDto[]>{
		try {
			return await this.groupRayonsInterface.find().exec()
		} catch (e) {
			this.logger.error(`Erreur lors de la récupération des group rayons`, "RAYON");
			throw new HttpException(`Erreur lors de la récupération des group rayons`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param id String --> Get a group rayon by id
	 * @param label String --> Get a group rayon by label
	 * Get one group rayon
	 * @return Promise<GroupRayonTypeDto>
	 */
	async findOne(id: string, label?: string): Promise<GroupRayonTypeDto>{
		try {
			if(label) {
				return await this.groupRayonsInterface.findOne({ label })
			}

			return await this.groupRayonsInterface.findOne({ _id: id })
		} catch (e) {
			this.logger.error(`Erreur lors de la récupération du group rayon: ${label || id}`, "RAYON");
			throw new HttpException(`Erreur lors de la récupération du group rayon: ${label || id}`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param createGroupRayonDto RayonInputDto --> Payload send to create object
	 * Create one group rayon
	 * @return Promise<GroupRayonTypeDto>
	 */
	async create(createGroupRayonDto: GroupRayonInputDto): Promise<GroupRayonTypeDto>{
		try {
			const exist = await this.groupRayonsInterface.findOne({label: createGroupRayonDto.label})
			if(!exist) {
				const createdGroupRayon = new this.groupRayonsInterface(createGroupRayonDto)
				return await createdGroupRayon.save()
			}
		} catch (e) {
			this.logger.error(`Erreur lors de la création du group rayon: ${createGroupRayonDto.label}`, "RAYON");
			throw new HttpException(`Erreur lors de la création du group rayon: ${createGroupRayonDto.label}`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param createGroupRayonDto RayonInputDto[] --> Contain all group rayons
	 * Create all group rayons
	 * @return Promise<GroupRayonTypeDto[]>
	 */
	async createAll(createGroupRayonDto: GroupRayonInputDto[]): Promise<GroupRayonTypeDto[]>{
		try {
			let createGroupRayonDtos = []
			for (const createGroupRayonDt of createGroupRayonDto) {
				const exist = await this.groupRayonsInterface.findOne({label: createGroupRayonDt.label})
				if(!exist) {
					const createdGroupRayon = new this.groupRayonsInterface(createGroupRayonDt)
					createGroupRayonDtos = [...createGroupRayonDtos, await createdGroupRayon.save(err => {
						if (err) return err
						createdGroupRayon.rayons = createGroupRayonDt.rayons
						createdGroupRayon.save();
					})]
				}
			}

			return createGroupRayonDtos
		} catch (e) {
			this.logger.error(`Erreur lors de la création des group rayons`, "RAYON");
			throw new HttpException(`Erreur lors de la création des group rayons`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param id String --> Delete a group rayon by id
	 * @param label String --> Delete agroup rayon by label
	 * Delete a group rayon
	 * @return Promise<GroupRayonTypeDto>
	 */
	async delete(id: string, label?: string): Promise<GroupRayonTypeDto>{
		try {
			if(label) {
				return await this.groupRayonsInterface.findOneAndDelete({ label })
			}

			return await this.groupRayonsInterface.findOneAndDelete({ _id: id })
		} catch (e) {
			this.logger.error(`Erreur lors de la suppression du group rayon: ${label || id}`, "RAYON");
			throw new HttpException(`Erreur lors de la suppression du group rayon: ${label || id}`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * Delete all group rayons
	 * @return Promise<GroupRayonTypeDto[]>
	 */
	async deleteAll(): Promise<GroupRayonTypeDto[]>{
		try {
			let deleteGroupRayonDtos = []
			const groupRayons = await this.findAll()
			for (let groupRayon of groupRayons) {
				deleteGroupRayonDtos = [...deleteGroupRayonDtos, await this.groupRayonsInterface.findOneAndDelete(groupRayon.id)]
			}

			return deleteGroupRayonDtos
		} catch (e) {
			this.logger.error(`Erreur lors de la suppression des group rayons`, "RAYON");
			throw new HttpException(`Erreur lors de la suppression des group rayons`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param id String --> Mofify a group rayon by id
	 * @param item RayonInputDto --> Payload send to modify object
	 * @param label String --> Mofify a group rayon by label
	 * Update a group rayon
	 * @return Promise<GroupRayonTypeDto>
	 */
	async update(id: string, item: GroupRayonInputDto, label?: string): Promise<GroupRayonTypeDto>{
		try {
			if(label) {
				return await this.groupRayonsInterface.findOneAndUpdate({ label }, item, {new: true})
			}

			return await this.groupRayonsInterface.findByIdAndUpdate(id, item, {new: true})
		} catch (e) {
			this.logger.error(`Erreur lors de la modification du group rayon: ${label || id}`, "RAYON");
			throw new HttpException(`Erreur lors de la modification du group rayon: ${label || id}`, HttpStatus.BAD_REQUEST)
		}
	}
}
