import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { Inject } from "@nestjs/common"
import { RayonsService } from "./rayons.service"
import { RayonInputDto } from "./dto/rayon-input.dto"
import { RayonsModel } from "./rayons.model";
import { rayons } from "../../sources"
import { RayonResponseDto } from "./dto/rayon-response.dto";

@Resolver(of => RayonsModel)
export class RayonsResolver {
	constructor(@Inject(RayonsService) private rayonsService: RayonsService){ }

	/**
	 * Get all the rayons
	 * @return Promise<RayonResponseDto>
	 */
	@Query(() => RayonResponseDto)
	async rayons(): Promise<RayonResponseDto>{
		return this.rayonsService.findAll()
	}

	/**
	 * @param id Number --> Get a rayon by id
	 * Get one rayon
	 * @return Promise<RayonResponseDto>
	 */
	@Query(() => RayonResponseDto)
	async rayon(@Args("id") id: number): Promise<RayonResponseDto>{
		return this.rayonsService.findOne(id)
	}

	/**
	 * @param input RayonInputDto --> Payload send to create object
	 * Create one rayon
	 * @return Promise<RayonResponseDto>
	 */
	@Mutation(() => RayonResponseDto)
	async createRayon(@Args("input") input: RayonInputDto): Promise<RayonResponseDto>{
		return this.rayonsService.create(input)
	}

	/**
	 * Create all rayons
	 * @return Promise<RayonResponseDto>
	 */
	@Mutation(() => RayonResponseDto)
	async createAllRayon(): Promise<RayonResponseDto>{
		return this.rayonsService.createAll(rayons)
	}

	/**
	 * @param id Number --> Delete a rayon by id
	 * Delete a rayon
	 * @return Promise<RayonResponseDto>
	 */
	@Mutation(() => RayonResponseDto)
	async deleteRayon(@Args("id") id: number): Promise<RayonResponseDto>{
		return this.rayonsService.delete(id)
	}

	/**
	 * Delete all rayons
	 * @return Promise<RayonResponseDto>
	 */
	@Mutation(() => RayonResponseDto)
	async deleteAllRayon(): Promise<RayonResponseDto>{
		return this.rayonsService.deleteAll()
	}

	/**
	 * @param input RayonInputDto --> Payload send to modify object
	 * Update a rayon
	 * @return Promise<RayonResponseDto>
	 */
	@Mutation(() => RayonResponseDto)
	async updateRayon(@Args("input") input: RayonInputDto): Promise<RayonResponseDto>{
		return this.rayonsService.update(input)
	}
}