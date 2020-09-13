import { HttpStatus, Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { AppService } from "../../app.service"
import { ProvidersModel } from "./providers.model"
import { ProviderResponseDto } from "./dto/provider-response.dto"
import { ProvidersInterface } from "./providers.interface"
import { ProviderInputDto } from "./dto/provider-input.dto"

@Injectable()
export class ProvidersService extends AppService implements ProvidersInterface {
	private logger = new Logger(ProvidersService.name)
	protected item?: ProvidersModel | undefined
	protected items?: ProvidersModel[] | undefined

	constructor(@InjectRepository(ProvidersModel) private providersModel: Repository<ProvidersModel>) {
		super()
	}

	formattedResponseProviders(): ProviderResponseDto {
		return {
			...this.formattedResponse(),
			items: this.items,
			item: this.item
		}
	}

	/**
	 * Get all the providers
	 * @return Promise<ProviderResponseDto>
	 */
	async findAll(): Promise<ProviderResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null
			this.message = "Providers récupérés avec succès."
			this.items = await this.providersModel.find()
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PROVIDER")
			this.message = `Erreur lors de la récupération des providers.`
			this.items = null
		}

		return this.formattedResponseProviders()
	}

	/**
	 * @param id Number --> Get a provider by id
	 * Get one provider
	 * @return Promise<ProviderResponseDto>
	 */
	async findOne(id: number): Promise<ProviderResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null
			this.message = "Provider récupéré avec succès."
			this.item = await this.providersModel.findOne(id)
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PROVIDER")
			this.message = `Erreur lors de la récupération du provider.`
			this.item = null
		}

		return this.formattedResponseProviders()
	}

	/**
	 * @param providerInputDto ProviderInputDto --> Payload send to create object
	 * Create one provider
	 * @return Promise<ProviderResponseDto>
	 */
	async create(providerInputDto: ProviderInputDto): Promise<ProviderResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			const exist = await this.providersModel.findOne({ label: providerInputDto.label })

			if (exist) {
				this.message = "Erreur un provider existe déjà avec ce nom."
				throw new Error(`Erreur lors de la création du provider: ${providerInputDto.label}.`)
			}

			this.item = await this.providersModel.save(this.providersModel.create(providerInputDto))
			this.message = "Provider créé avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PROVIDER")
			this.message = this.message || `Erreur lors de la création du provider: ${providerInputDto.label}.`
			this.item = null
		}

		return this.formattedResponseProviders()
	}

	/**
	 * @param providerInputDto ProviderInputDto[] --> Contain all providers
	 * Create all providers
	 * @return Promise<ProviderResponseDto>
	 */
	async createAll(providerInputDto: ProviderInputDto[]): Promise<ProviderResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			this.items = await this.providersModel.save(this.providersModel.create(providerInputDto))

			if (!this.items) {
				throw new Error(`Erreur lors de la création des providers.`)
			}

			this.message = "Providers créés avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PROVIDER")
			this.message = `Erreur lors de la création des providers.`
			this.items = null
		}

		return this.formattedResponseProviders()
	}

	/**
	 * @param id Number --> Delete a provider by id
	 * Delete a provider
	 * @return Promise<ProviderResponseDto>
	 */
	async delete(id: number): Promise<ProviderResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			if (!await this.providersModel.remove(await this.providersModel.findOne(id))) {
				throw new Error(`Erreur lors de la suppression du provider: ${id}.`)
			}

			this.message = "Provider supprimé avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PROVIDER")
			this.message = `Erreur lors de la suppression de ce provider.`
		}

		return this.formattedResponseProviders()
	}

	/**
	 * Delete all provider
	 * @return Promise<ProviderResponseDto>
	 */
	async deleteAll(): Promise<ProviderResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			if (!await this.providersModel.remove(await this.providersModel.find())) {
				throw new Error(`Erreur lors de la suppression des providers.`)
			}
			this.message = "Providers supprimés avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PROVIDER")
			this.message = `Erreur lors de la suppression des providers.`
		}

		return this.formattedResponseProviders()
	}

	/**
	 * @param providerInputDto providersModel --> Payload send to modify object
	 * Update a provider
	 * @return Promise<ProviderResponseDto>
	 */
	async update(providerInputDto: ProviderInputDto): Promise<ProviderResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			const exist = await this.providersModel.findOne({ label: providerInputDto.label })

			if (exist) {
				if (exist.id !== providerInputDto.id) {
					this.message = "Erreur un provider existe déjà avec ce nom."
					throw new Error(`Erreur lors de la modification du provider: ${providerInputDto.label}.`)
				}

				this.item = await this.providersModel.save(this.providersModel.create(providerInputDto))
			}

			const existById = await this.providersModel.findOne({ id: providerInputDto.id })

			if (existById) {
				this.item = await this.providersModel.save(this.providersModel.create(providerInputDto))
			}

			if (!this.item) {
				this.message = "Erreur ce provider n'existe pas."
				throw new Error(`Erreur lors de la modification du provider: ${providerInputDto.label}.`)
			}

			this.message = "Provider modifié avec succès."
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "PROVIDER")
			this.message = this.message || `Erreur lors de la modification du provider.`
			this.item = null
		}

		return this.formattedResponseProviders()
	}
}
