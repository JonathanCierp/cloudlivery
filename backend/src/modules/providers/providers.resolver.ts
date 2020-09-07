import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { Inject } from "@nestjs/common"
import { ProvidersService } from "./providers.service"
import { ProviderInputDto } from "./dto/provider-input.dto"
import { ProvidersModel } from "./providers.model"
import { providers } from "../../sources"

@Resolver(of => ProvidersModel)
export class ProvidersResolver {
	constructor(@Inject(ProvidersService) private providersService: ProvidersService){ }

	/**
	 * Get all the providers
	 * @return Promise<ProvidersModel[]>
	 */
	@Query(() => [ProvidersModel])
	async providers(): Promise<ProvidersModel[]>{
		return this.providersService.findAll()
	}
		/**
		 * @param id Number --> Get a provider by id
		 * Get one provider
		 * @return Promise<ProvidersModel>
		 */
		@Query(() => ProvidersModel)
		async provider(@Args("id") id: number): Promise<ProvidersModel>{
			return this.providersService.findOne(id)
		}

		/**
		 * @param input ProviderInputDto --> Payload send to create object
		 * Create one provider
		 * @return Promise<ProvidersModel>
		 */
		@Mutation(() => ProvidersModel)
		async createProvider(@Args("input") input: ProviderInputDto): Promise<ProvidersModel>{
			return await this.providersService.create(input)
		}

		/**
		 * Create all providers
		 * @return Promise<ProviderTypeDto[]>
		 */
		@Mutation(() => [ProvidersModel])
		async createAllProvider(): Promise<ProvidersModel[]>{
			return this.providersService.createAll(providers)
		}

		/**
		 * @param id Number --> Delete a provider by id
		 * Delete a provider
		 * @return Promise<ProvidersModel>
		 */
		@Mutation(() => ProvidersModel)
		async deleteProvider(@Args("id") id: number): Promise<ProvidersModel>{
			return this.providersService.delete(id)
		}

		/**
		 * Delete all provider
		 * @return Promise<ProvidersModel[]>
		 */
		@Mutation(() => [ProvidersModel])
		async deleteAllProvider(): Promise<ProvidersModel[]>{
			return this.providersService.deleteAll()
		}

		/**
		 * @param input ProviderInputDto --> Payload send to modify object
		 * Update a provider
		 * @return Promise<ProvidersModel>
		 */
		@Mutation(() => ProvidersModel)
		async updateProvider( @Args("input") input: ProviderInputDto): Promise<ProvidersModel>{
			return this.providersService.update(input)
		}
}