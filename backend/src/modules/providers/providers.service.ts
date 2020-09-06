import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ProvidersModel } from "./providers.model"
import { ProviderInputDto } from "./dto/provider-input.dto"

/*import { CreateUserDto } from './dto/create-user.dto';*/

@Injectable()
export class ProvidersService {
	private logger = new Logger(ProvidersService.name)

	constructor(@InjectRepository(ProvidersModel) private providersModel: Repository<ProvidersModel>){
	}

	/**
	 * Get all the providers
	 * @return Promise<ProvidersModel[]>
	 */
	async findAll(): Promise<ProvidersModel[]>{
		try {
			const providers = await this.providersModel.find()

			return await this.providersModel.find()
		} catch (e) {
			this.logger.error(`Erreur lors de la récupération des providers`, "PROVIDER")
			throw new HttpException(`Erreur lors de la récupération des providers`, HttpStatus.BAD_REQUEST)
		}
	}


	/**
	 * @param id String --> Get a provider by id
	 * @param label String --> Get a provider by label
	 * Get one provider
	 * @return Promise<ProvidersModel>
	 */
	async findOne(id: string, label?: string): Promise<ProvidersModel>{
		try {
			let provider = await this.providersModel.findOne(id)

			if (label) {
				provider = await this.providersModel.findOne({label})
			}

			return provider
		} catch (e) {
			this.logger.error(`Erreur lors de la récupération du provider: ${label || id}`, "PROVIDER")
			throw new HttpException(`Erreur lors de la récupération du provider: ${label || id}`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param createProviderDto ProviderInputDto --> Payload send to create object
	 * Create one provider
	 * @return Promise<ProvidersModel>
	 */
	async create(createProviderDto: ProviderInputDto): Promise<ProvidersModel>{
		try {
			const exist = await this.providersModel.findOne({where: {label: createProviderDto.label}})

			if (!exist) {
				return await this.providersModel.save(this.providersModel.create(createProviderDto))
			}

			throw new Error(`Erreur lors de la création du provider: ${createProviderDto.label}`)
		} catch (e) {
			this.logger.error(e.message, "PROVIDER")
			throw new HttpException(`Erreur lors de la création du provider: ${createProviderDto.label}`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param createProviderDto ProviderInputDto[] --> Contain all providers
	 * Create all providers
	 * @return Promise<ProvidersModel[]>
	 */
	async createAll(createProviderDto: ProviderInputDto[]): Promise<ProvidersModel[]>{
		try {
			const providers = await this.providersModel.save(this.providersModel.create(createProviderDto))

			if(providers) {
				return providers
			}

			throw new Error(`Erreur lors de la création des providers`)
		} catch (e) {
			this.logger.error(e.message, "PROVIDER")
			throw new HttpException(`Erreur lors de la création des providers`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param id String --> Delete a provider by id
	 * Delete a provider
	 * @return Promise<ProvidersModel>
	 */
	async delete(id: number): Promise<ProvidersModel>{
		let provider = await this.providersModel.findOne(id)
		try {
			if(await this.providersModel.remove(provider)) {
				return provider
			}

			throw new Error(`Erreur lors de la suppression du provider: ${provider.label || id}`)
		} catch (e) {
			this.logger.error(e.message, "PROVIDER")
			throw new HttpException(`Erreur lors de la suppression du provider: ${provider.label || id}`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * Delete all provider
	 * @return Promise<ProvidersModel[]>
	 */
	async deleteAll(): Promise<ProvidersModel[]>{
		try {
			const providers = await this.providersModel.find()

			if(await this.providersModel.remove(providers)) {
				return providers
			}

			throw new Error(`Erreur lors de la suppression des providers`)
		} catch (e) {
			this.logger.error(e.message, "PROVIDER")
			throw new HttpException(`Erreur lors de la suppression des providers`, HttpStatus.BAD_REQUEST)
		}
	}

	/**
	 * @param id String --> Mofify a provider by id
	 * @param item providersModel --> Payload send to modify object
	 * @param label String --> Mofify a provider by label
	 * Update a provider
	 * @return Promise<ProvidersModel>
	 */
	async update(item: ProviderInputDto): Promise<ProvidersModel>{
		const provider = await this.providersModel.save(this.providersModel.create(item))
		try {
			if(provider) {
				return provider
			}

			throw new Error(`Erreur lors de la modification du provider: ${provider.label || provider.id}`)
		} catch (e) {
			this.logger.error(e.message, "PROVIDER");
			throw new HttpException(`Erreur lors de la modification du provider: ${provider.label || provider.id}`, HttpStatus.BAD_REQUEST)
		}
	}
}
