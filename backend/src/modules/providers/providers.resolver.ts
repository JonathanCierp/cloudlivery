import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { Inject } from "@nestjs/common"
import { ProvidersService } from "./providers.service"
import { ProviderInputDto } from "./dto/provider-input.dto"
import { ProviderResponseDto } from "./dto/provider-response.dto";
import { ProvidersModel } from "./providers.model";
import { providers } from "../../sources"

@Resolver(of => ProvidersModel)
export class ProvidersResolver {
	constructor(@Inject(ProvidersService) private providersService: ProvidersService){ }

	/**
	 * Get all the providers
	 * @return Promise<ProviderResponseDto>
	 */
	@Query(() => ProviderResponseDto)
	async providers(): Promise<ProviderResponseDto>{
		return this.providersService.findAll()
	}
		/**
		 * @param id Number --> Get a provider by id
		 * Get one provider
		 * @return Promise<ProviderResponseDto>
		 */
		@Query(() => ProviderResponseDto)
		async provider(@Args("id") id: number): Promise<ProviderResponseDto>{
			return this.providersService.findOne(id)
		}

		/**
		 * @param input ProviderInputDto --> Payload send to create object
		 * Create one provider
		 * @return Promise<ProviderResponseDto>
		 */
		@Mutation(() => ProviderResponseDto)
		async createProvider(@Args("input") input: ProviderInputDto): Promise<ProviderResponseDto>{
			return await this.providersService.create(input)
		}

		/**
		 * Create all providers
		 * @return Promise<ProviderTypeDto[]>
		 */
		@Mutation(() => ProviderResponseDto)
		async createAllProvider(): Promise<ProviderResponseDto>{
			return this.providersService.createAll(providers)
		}

		/**
		 * @param id Number --> Delete a provider by id
		 * Delete a provider
		 * @return Promise<ProviderResponseDto>
		 */
		@Mutation(() => ProviderResponseDto)
		async deleteProvider(@Args("id") id: number): Promise<ProviderResponseDto>{
			return this.providersService.delete(id)
		}

		/**
		 * Delete all provider
		 * @return Promise<ProviderResponseDto>
		 */
		@Mutation(() => ProviderResponseDto)
		async deleteAllProvider(): Promise<ProviderResponseDto>{
			return this.providersService.deleteAll()
		}

		/**
		 * @param input ProviderInputDto --> Payload send to modify object
		 * Update a provider
		 * @return Promise<ProviderResponseDto>
		 */
		@Mutation(() => ProviderResponseDto)
		async updateProvider( @Args("input") input: ProviderInputDto): Promise<ProviderResponseDto>{
			return this.providersService.update(input)
		}
}