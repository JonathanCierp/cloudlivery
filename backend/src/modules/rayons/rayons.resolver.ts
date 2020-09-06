import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { RayonsService } from "./rayons.service"
import { RayonTypeDto } from "./dto/rayon-type.dto"
import { RayonInputDto } from "./dto/rayon-input.dto"
/*import { rayons } from "../../sources"*/

@Resolver()
export class RayonsResolver {
	constructor(private rayonsService: RayonsService){ }
/*
	/!**
	 * Get all the rayons
	 * @return Promise<RayonTypeDto[]>
	 *!/
	@Query(() => [RayonTypeDto])
	async rayons(): Promise<RayonTypeDto[]>{
		return this.rayonsService.findAll()
	}

	/!**
	 * @param id String --> Get a rayon by id
	 * @param label String --> Get a rayon by label
	 * Get one rayon
	 * @return Promise<RayonTypeDto>
	 *!/
	@Query(() => RayonTypeDto)
	async rayon(@Args("id") id: string, @Args("label", { nullable: true }) label?: string): Promise<RayonTypeDto>{
		return this.rayonsService.findOne(id, label)
	}

	/!**
	 * @param input RayonInputDto --> Payload send to create object
	 * Create one rayon
	 * @return Promise<RayonTypeDto>
	 *!/
	@Mutation(() => RayonTypeDto)
	async createRayon(@Args("input") input: RayonInputDto): Promise<RayonTypeDto>{
		return this.rayonsService.create(input)
	}

	/!**
	 * Create all rayons
	 * @return Promise<RayonTypeDto[]>
	 *!/
	@Mutation(() => [RayonTypeDto])
	async createAllRayon(): Promise<RayonTypeDto[]>{
		return this.rayonsService.createAll(rayons)
	}

	/!**
	 * @param id String --> Delete a rayon by id
	 * @param label String --> Delete a rayon by label
	 * Delete a rayon
	 * @return Promise<RayonTypeDto>
	 *!/
	@Mutation(() => RayonTypeDto)
	async deleteRayon(@Args("id") id: string, @Args("label", { nullable: true }) label?: string): Promise<RayonTypeDto>{
		return this.rayonsService.delete(id, label)
	}

	/!**
	 * Delete all rayons
	 * @return Promise<RayonTypeDto[]>
	 *!/
	@Mutation(() => [RayonTypeDto])
	async deleteAllRayon(): Promise<RayonTypeDto[]>{
		return this.rayonsService.deleteAll()
	}

	/!**
	 * @param id String --> Mofify a rayon by id
	 * @param input RayonInputDto --> Payload send to modify object
	 * @param label String --> Mofify a rayon by label
	 * Update a rayon
	 * @return Promise<RayonTypeDto>
	 *!/
	@Mutation(() => RayonTypeDto)
	async updateRayon(@Args("id") id: string, @Args("input") input: RayonInputDto, @Args("label", { nullable: true }) label?: string): Promise<RayonTypeDto>{
		return this.rayonsService.update(id, input, label)
	}*/
}