import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { GroupRayonsService } from "./group-rayons.service"
import { GroupRayonTypeDto } from "./dto/group-rayon-type.dto"
import { GroupRayonInputDto } from "./dto/group-rayon-input.dto"
/*import { groupRayons } from "../../sources"*/

@Resolver()
export class GroupRayonsResolver {
	constructor(private groupRayonsService: GroupRayonsService){ }
/*
	/!**
	 * Get all the group rayons
	 * @return Promise<GroupRayonTypeDto[]>
	 *!/
	@Query(() => [GroupRayonTypeDto])
	async groupRayons(): Promise<GroupRayonTypeDto[]>{
		return this.groupRayonsService.findAll()
	}

	/!**
	 * @param id String --> Get a group rayon by id
	 * @param label String --> Get a group rayon by label
	 * Get one group rayon
	 * @return Promise<GroupRayonTypeDto>
	 *!/
	@Query(() => GroupRayonTypeDto)
	async groupRayon(@Args("id") id: string, @Args("label", { nullable: true }) label?: string): Promise<GroupRayonTypeDto>{
		return this.groupRayonsService.findOne(id, label)
	}

	/!**
	 * @param input GroupRayonTypeDto --> Payload send to create object
	 * Create one group rayon
	 * @return Promise<GroupRayonTypeDto>
	 *!/
	@Mutation(() => GroupRayonTypeDto)
	async createGroupRayon(@Args("input") input: GroupRayonInputDto): Promise<GroupRayonTypeDto>{
		return this.groupRayonsService.create(input)
	}

	/!**
	 * Create all group rayons
	 * @return Promise<GroupRayonTypeDto[]>
	 *!/
	@Mutation(() => [GroupRayonTypeDto])
	async createAllGroupRayon(): Promise<GroupRayonTypeDto[]>{
		return this.groupRayonsService.createAll(groupRayons)
	}

	/!**
	 * @param id String --> Delete a group rayon by id
	 * @param label String --> Delete a group rayon by label
	 * Delete a group rayon
	 * @return Promise<GroupRayonTypeDto>
	 *!/
	@Mutation(() => GroupRayonTypeDto)
	async deleteGroupRayon(@Args("id") id: string, @Args("label", { nullable: true }) label?: string): Promise<GroupRayonTypeDto>{
		return this.groupRayonsService.delete(id, label)
	}

	/!**
	 * Delete all group rayons
	 * @return Promise<GroupRayonTypeDto[]>
	 *!/
	@Mutation(() => [GroupRayonTypeDto])
	async deleteAllGroupRayon(): Promise<GroupRayonTypeDto[]>{
		return this.groupRayonsService.deleteAll()
	}

	/!**
	 * @param id String --> Mofify a group rayon by id
	 * @param input RayonInputDto --> Payload send to modify object
	 * @param label String --> Mofify a group rayon by label
	 * Update a group rayon
	 * @return Promise<GroupRayonTypeDto>
	 *!/
	@Mutation(() => GroupRayonTypeDto)
	async updateRayon(@Args("id") id: string, @Args("input") input: GroupRayonInputDto, @Args("label", { nullable: true }) label?: string): Promise<GroupRayonTypeDto>{
		return this.groupRayonsService.update(id, input, label)
	}*/
}