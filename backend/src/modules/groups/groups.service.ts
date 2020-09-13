import { HttpStatus, Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { GroupInputDto } from "./dto/group-input.dto"
import { GroupsModel } from "./groups.model"
import { RayonsModel } from "../rayons/rayons.model"
import { AppService } from "../../app.service"
import { GroupResponseDto } from "./dto/group-response.dto"
import { GroupsInterface } from "./groups.interface"

@Injectable()
export class GroupsService extends AppService implements GroupsInterface {
	private logger = new Logger(GroupsService.name)
	protected item?: GroupsModel | undefined
	protected items?: GroupsModel[] | undefined

	constructor(@InjectRepository(GroupsModel) private groupsModel: Repository<GroupsModel>, @InjectRepository(RayonsModel) private rayonsModel: Repository<RayonsModel>) {
		super()
	}

	formattedResponseGroups(): GroupResponseDto {
		return {
			...this.formattedResponse(),
			items: this.items,
			item: this.item
		}
	}

	/**
	 * Get all the groupes
	 * @return Promise<GroupResponseDto[]>
	 */
	async findAll(): Promise<GroupResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null
			this.message = "Groupes récupérés avec succès."
			this.items = await this.groupsModel.find({ relations: ["rayons"] })
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "GROUP")
			this.message = `Erreur lors de la récupération des groupes.`
			this.items = null
		}

		return this.formattedResponseGroups()
	}

	/**
	 * @param id Number --> Get a groupe by id
	 * Get one groupe
	 * @return Promise<GroupResponseDto>
	 */
	async findOne(id: number): Promise<GroupResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null
			this.message = "Groupe récupéré avec succès."
			this.item = await this.groupsModel.findOne(id, { relations: ["rayons"] })
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "GROUP")
			this.message = `Erreur lors de la récupération du groupe: ${id}.`
			this.item = null
		}

		return this.formattedResponseGroups()
	}

	/**
	 * @param groupInputDto GroupInputDto --> Payload send to create object
	 * Create one groupe
	 * @return Promise<GroupResponseDto>
	 */
	async create(groupInputDto: GroupInputDto): Promise<GroupResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			this.item = await this.createItem(groupInputDto)

			if (!this.item) {
				this.message = "Erreur un groupe existe déjà avec ce nom."
				throw new Error(`Erreur lors de la création du groupe: ${groupInputDto.label}.`)
			}

			this.message = "Groupe créé avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "GROUP")
			this.message = this.message || `Erreur lors de la création du groupe: ${groupInputDto.label}.`
			this.item = null
		}

		return this.formattedResponseGroups()
	}

	/**
	 * @param groupInputDto GroupInputDto[] --> Contain all groupes
	 * Create all groupes
	 * @return Promise<GroupResponseDto>
	 */
	async createAll(groupInputDto: GroupInputDto[]): Promise<GroupResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			let groups = []

			for (let groupInputDt of groupInputDto) {
				let group = await this.createItem(groupInputDt)

				if (group) {
					groups = [...groups, group]
				}
			}

			if (!groups.length) {
				throw new Error(`Erreur lors de la création des groupes.`)
			}

			this.message = "Groupes créés avec succès."
			this.items = groups
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "GROUP")
			this.message = `Erreur lors de la création des groupes.`
			this.items = null
		}

		return this.formattedResponseGroups()
	}

	/**
	 * @param id Number --> Delete a groupe by id
	 * Delete a groupe
	 * @return Promise<GroupResponseDto>
	 */
	async delete(id: number): Promise<GroupResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			if (!await this.groupsModel.remove(await this.groupsModel.findOne(id))) {
				throw new Error(`Erreur lors de la suppression du group: ${id}.`)
			}

			this.message = "Groupe supprimé avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "GROUP")
			this.message = `Erreur lors de la suppression de ce groupe.`
		}

		return this.formattedResponseGroups()
	}

	/**
	 * Delete all groupes
	 * @return Promise<GroupResponseDto>
	 */
	async deleteAll(): Promise<GroupResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			if (!await this.groupsModel.remove(await this.groupsModel.find())) {
				throw new Error(`Erreur lors de la suppression des groupes.`)
			}

			this.message = "Groupes supprimés avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "GROUP")
			this.message = `Erreur lors de la suppression des groupes.`
		}

		return this.formattedResponseGroups()
	}

	/**
	 * @param groupInputDto RayonInputDto --> Payload send to modify object
	 * Update a groupe
	 * @return Promise<GroupResponseDto>
	 */
	async update(groupInputDto: GroupInputDto): Promise<GroupResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			const exist = await this.groupsModel.findOne({ label: groupInputDto.label })

			if (exist) {
				if (exist.id !== groupInputDto.id) {
					this.message = "Erreur un groupe existe déjà avec ce nom."
					throw new Error(`Erreur lors de la modification du groupe: ${groupInputDto.label}.`)
				}

				this.item = await this.createItem(groupInputDto)
			}

			const existById = await this.groupsModel.findOne({ id: groupInputDto.id })

			if (existById) {
				this.item = await this.createItem(groupInputDto)
			}

			if (!this.item) {
				this.message = "Erreur ce groupe n'existe pas."
				throw new Error(`Erreur lors de la modification du groupe: ${groupInputDto.label}.`)
			}

			this.message = "Groupe modifié avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "GROUP")
			this.message = this.message || `Erreur lors de la modification du groupe.`
			this.item = null
		}

		return this.formattedResponseGroups()
	}

	/**
	 * @param groupInputDto GroupInputDto --> Payload send to create object
	 * Create one group
	 * @return Promise<GroupsModel | undefined>
	 */
	async createItem(groupInputDto: GroupInputDto): Promise<GroupsModel | undefined> {
		const exist = await this.groupsModel.findOne({ label: groupInputDto.label })

		if (!exist) {
			let group = this.groupsModel.create(groupInputDto)

			if (group.rayons) {
				group.rayons = await this.rayonsModel.find({ where: groupInputDto.rayons })
			}

			return await this.groupsModel.save(group)
		}
	}
}
