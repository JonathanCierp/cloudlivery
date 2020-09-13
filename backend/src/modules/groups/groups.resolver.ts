import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { Inject } from "@nestjs/common"
import { GroupsService } from "./groups.service"
import { GroupInputDto } from "./dto/group-input.dto"
import { GroupsModel } from "./groups.model"
import { GroupResponseDto } from "./dto/group-response.dto"
import { groups } from "../../sources"

@Resolver(of => GroupsModel)
export class GroupsResolver {
	constructor(@Inject(GroupsService) private groupsService: GroupsService) {
	}

	/**
	 * Get all the groups
	 * @return Promise<GroupResponseDto[]>
	 */
	@Query(() => GroupResponseDto)
	async groups(): Promise<GroupResponseDto> {
		return this.groupsService.findAll()
	}

	/**
	 * @param id Number --> Get a group by id
	 * Get one group
	 * @return Promise<GroupResponseDto>
	 */
	@Query(() => GroupResponseDto)
	async group(@Args("id") id: number): Promise<GroupResponseDto> {
		return this.groupsService.findOne(id)
	}

	/**
	 * @param input RayonInputDto --> Payload send to create object
	 * Create one group
	 * @return Promise<GroupResponseDto>
	 */
	@Mutation(() => GroupResponseDto)
	async createGroup(@Args("input") input: GroupInputDto): Promise<GroupResponseDto> {
		return this.groupsService.create(input)
	}

	/**
	 * Create all groups
	 * @return Promise<GroupResponseDto>
	 */
	@Mutation(() => GroupResponseDto)
	async createAllGroup(): Promise<GroupResponseDto> {
		return this.groupsService.createAll(groups)
	}

	/**
	 * @param id Number --> Delete a group by id
	 * Delete a group
	 * @return Promise<GroupResponseDto>
	 */
	@Mutation(() => GroupResponseDto)
	async deleteGroup(@Args("id") id: number): Promise<GroupResponseDto> {
		return this.groupsService.delete(id)
	}

	/**
	 * Delete all groups
	 * @return Promise<GroupResponseDto>
	 */
	@Mutation(() => GroupResponseDto)
	async deleteAllGroup(): Promise<GroupResponseDto> {
		return this.groupsService.deleteAll()
	}

	/**
	 * @param input RayonInputDto --> Payload send to modify object
	 * Update a groupe
	 * @return Promise<GroupResponseDto>
	 */
	@Mutation(() => GroupResponseDto)
	async updateGroup(@Args("input") input: GroupInputDto): Promise<GroupResponseDto> {
		return this.groupsService.update(input)
	}
}