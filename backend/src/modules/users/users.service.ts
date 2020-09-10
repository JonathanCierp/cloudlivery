import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UsersModel } from "./users.model"
import { UserInputDto } from "./dto/user-input.dto"

@Injectable()
export class UsersService {
	private logger = new Logger(UsersService.name);

	constructor(@InjectRepository(UsersModel) private usersModel: Repository<UsersModel>){
	}
	
	/**
	 * Get all the rayons
	 * @return Promise<RayonsModel[]>
	 */
	/*async findAll(): Promise<RayonsModel[]>{
		try {
			return await this.rayonsModel.find()
		} catch (e) {
			this.logger.error(`Erreur lors de la récupération des rayons`, "RAYON");
			throw new HttpException(`Erreur lors de la récupération des rayons`, HttpStatus.BAD_REQUEST)
		}
	}*/

	/**
	 * @param id Number --> Get a rayon by id
	 * Get one rayon
	 * @return Promise<RayonsModel>
	 */
	/*async findOne(id: number): Promise<RayonsModel>{
		try {
			return await this.rayonsModel.findOne(id)
		} catch (e) {
			this.logger.error(`Erreur lors de la récupération du rayon: ${id}`, "RAYON");
			throw new HttpException(`Erreur lors de la récupération du rayon: ${id}`, HttpStatus.BAD_REQUEST)
		}
	}*/

	/**
	 * @param createRayonDto RayonInputDto --> Payload send to create object
	 * Create one rayon
	 * @return Promise<RayonsModel>
	 */
	/*async create(createRayonDto: UserInputDto): Promise<RayonsModel>{
		try {
			const exist = await this.rayonsModel.findOne({where: {label: createRayonDto.label}})

			if (!exist) {
				return await this.rayonsModel.save(this.rayonsModel.create(createRayonDto))
			}

			throw new Error(`Erreur lors de la création du rayon: ${createRayonDto.label}`)
		} catch (e) {
			this.logger.error(e.message, "RAYON")
			throw new HttpException(`Erreur lors de la création du rayon: ${createRayonDto.label}`, HttpStatus.BAD_REQUEST)
		}
	}*/

	/**
	 * @param createRayonDto RayonInputDto[] --> Contain all rayons
	 * Create all rayons
	 * @return Promise<RayonsModel[]>
	 */
	/*async createAll(createRayonDto: UserInputDto[]): Promise<RayonsModel[]>{
		try {
			const rayons = await this.rayonsModel.save(this.rayonsModel.create(createRayonDto))

			if(rayons) {
				return rayons
			}

			throw new Error(`Erreur lors de la création des rayons`)
		} catch (e) {
			this.logger.error(e.message, "RAYON");
			throw new HttpException(`Erreur lors de la création des rayons`, HttpStatus.BAD_REQUEST)
		}
	}*/

	/**
	 * @param id Number --> Delete a rayon by id
	 * Delete a rayon
	 * @return Promise<RayonsModel>
	 */
	/*async delete(id: number): Promise<RayonsModel>{
		let rayon = await this.rayonsModel.findOne(id)
		try {
			if(await this.rayonsModel.remove(rayon)) {
				return rayon
			}

			throw new Error(`Erreur lors de la suppression du rayon: ${rayon.label || id}`)
		} catch (e) {
			this.logger.error(e.message, "RAYON");
			throw new HttpException(`Erreur lors de la suppression du rayon: ${rayon.label || id}`, HttpStatus.BAD_REQUEST)
		}
	}*/

	/**
	 * Delete all rayons
	 * @return Promise<RayonsModel[]>
	 */
	/*async deleteAll(): Promise<RayonsModel[]>{
		try {
			const rayons = await this.rayonsModel.find()

			if(await this.rayonsModel.remove(rayons)) {
				return rayons
			}

			throw new Error(`Erreur lors de la suppression des rayons`)
		} catch (e) {
			this.logger.error(e.message, "RAYON");
			throw new HttpException(`Erreur lors de la suppression des rayons`, HttpStatus.BAD_REQUEST)
		}
	}*/

	/**
	 * @param item RayonInputDto --> Payload send to modify object
	 * Update a rayon
	 * @return Promise<RayonsModel>
	 */
	/*async update(item: UserInputDto): Promise<RayonsModel>{
		const rayon = await this.rayonsModel.save(this.rayonsModel.create(item))
		try {
			if(rayon) {
				return rayon
			}

			throw new Error(`Erreur lors de la modification du rayon: ${rayon.label || rayon.id}`)
		} catch (e) {
			this.logger.error(e.message, "RAYON");
			throw new HttpException(`Erreur lors de la modification du rayon: ${rayon.label || rayon.id}`, HttpStatus.BAD_REQUEST)
		}
	}*/
}
