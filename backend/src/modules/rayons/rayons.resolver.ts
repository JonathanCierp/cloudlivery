import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { Inject } from "@nestjs/common"
import { RayonsService } from "./rayons.service"
import { RayonInputDto } from "./dto/rayon-input.dto"
import { RayonsModel } from "./rayons.model"
import { rayons } from "../../sources"

@Resolver(of => RayonsModel)
export class RayonsResolver {
	constructor(@Inject(RayonsService) private rayonsService: RayonsService){ }

	/**
	 * Get all the rayons
	 * @return Promise<RayonsModel[]>
	 */
	@Query(() => [RayonsModel])
	async rayons(): Promise<RayonsModel[]>{
		return this.rayonsService.findAll()
	}

	/**
	 * @param id Number --> Get a rayon by id
	 * Get one rayon
	 * @return Promise<RayonsModel>
	 */
	@Query(() => RayonsModel)
	async rayon(@Args("id") id: number): Promise<RayonsModel>{
		return this.rayonsService.findOne(id)
	}

	/**
	 * @param input RayonInputDto --> Payload send to create object
	 * Create one rayon
	 * @return Promise<RayonsModel>
	 */
	@Mutation(() => RayonsModel)
	async createRayon(@Args("input") input: RayonInputDto): Promise<RayonsModel>{
		return this.rayonsService.create(input)
	}

	/**
	 * Create all rayons
	 * @return Promise<RayonsModel[]>
	 */
	@Mutation(() => [RayonsModel])
	async createAllRayon(): Promise<RayonsModel[]>{
		return this.rayonsService.createAll(rayons)
	}

	/**
	 * @param id Number --> Delete a rayon by id
	 * Delete a rayon
	 * @return Promise<RayonTypeDto>
	 */
	@Mutation(() => RayonsModel)
	async deleteRayon(@Args("id") id: number): Promise<RayonsModel>{
		return this.rayonsService.delete(id)
	}

	/**
	 * Delete all rayons
	 * @return Promise<RayonsModel[]>
	 */
	@Mutation(() => [RayonsModel])
	async deleteAllRayon(): Promise<RayonsModel[]>{
		return this.rayonsService.deleteAll()
	}

	/**
	 * @param input RayonInputDto --> Payload send to modify object
	 * Update a rayon
	 * @return Promise<RayonsModel>
	 */
	@Mutation(() => RayonsModel)
	async updateRayon(@Args("input") input: RayonInputDto): Promise<RayonsModel>{
		return this.rayonsService.update(input)
	}
}