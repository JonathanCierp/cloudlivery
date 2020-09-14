import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { Inject, UseGuards } from "@nestjs/common"
import { BrandsService } from "./brands.service"
import { BrandInputDto } from "./dto/brand-input.dto"
import { BrandResponseDto } from "./dto/brand-response.dto"
import { BrandsModel } from "./brands.model"
import { brands, providers } from "../../sources"
import { AuthGuard } from "../../guards/auth.guard"

@Resolver(of => BrandsModel)
export class BrandsResolver {
	constructor(@Inject(BrandsService) private brandsService: BrandsService) {
	}

	/**
	 * Get all the brands
	 * @return Promise<BrandResponseDto>
	 */
	@Query(() => BrandResponseDto)
	async brands(): Promise<BrandResponseDto> {
		return this.brandsService.findAll()
	}

	/**
	 * @param id Number --> Get a brand by id
	 * Get one brand
	 * @return Promise<BrandResponseDto>
	 */
	@Query(() => BrandResponseDto)
	async brand(@Args("id") id: number): Promise<BrandResponseDto> {
		return this.brandsService.findOne(id)
	}

	/**
	 * @param input BrandInputDto --> Payload send to create object
	 * Create one brand
	 * @return Promise<BrandResponseDto>
	 */
	@Mutation(() => BrandResponseDto)
	async createBrand(@Args("input") input: BrandInputDto): Promise<BrandResponseDto> {
		return await this.brandsService.create(input)
	}

	/**
	 * Create all brands
	 * @return Promise<BrandResponseDto>
	 */
	@Mutation(() => BrandResponseDto)
	async createAllBrand(): Promise<BrandResponseDto> {
		return this.brandsService.createAll(brands)
	}

	/**
	 * @param id Number --> Delete a brand by id
	 * Delete a brand
	 * @return Promise<BrandResponseDto>
	 */
	@Mutation(() => BrandResponseDto)
	async deleteBrand(@Args("id") id: number): Promise<BrandResponseDto> {
		return this.brandsService.delete(id)
	}

	/**
	 * Delete all brands
	 * @return Promise<BrandResponseDto>
	 */
	@Mutation(() => BrandResponseDto)
	async deleteAllBrand(): Promise<BrandResponseDto> {
		return this.brandsService.deleteAll()
	}

	/**
	 * @param input BrandInputDto --> Payload send to modify object
	 * Update a brand
	 * @return Promise<BrandResponseDto>
	 */
	@Mutation(() => BrandResponseDto)
	async updateBrand(@Args("input") input: BrandInputDto): Promise<BrandResponseDto> {
		return this.brandsService.update(input)
	}
}
