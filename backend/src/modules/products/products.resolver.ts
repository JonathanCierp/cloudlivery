import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { Inject, UseGuards } from "@nestjs/common"
import { ProductsService } from "./products.service"
import { ProductInputDto } from "./dto/product-input.dto"
import { ProductResponseDto } from "./dto/product-response.dto"
import { ProductsModel } from "./models/products.model"
import { providers } from "../../sources"
import { AuthGuard } from "../../guards/auth.guard"

@Resolver(of => ProductsModel)
export class ProductsResolver {
	constructor(@Inject(ProductsService) private productsService: ProductsService) {
	}

	/**
	 * Get all the products
	 * @return Promise<ProductResponseDto>
	 */
	@Query(() => ProductResponseDto)
	async products(): Promise<ProductResponseDto> {
		return this.productsService.findAll()
	}

	/**
	 * @param id Number --> Get a product by id
	 * Get one product
	 * @return Promise<ProductResponseDto>
	 */
	@Query(() => ProductResponseDto)
	async product(@Args("id") id: number): Promise<ProductResponseDto> {
		return this.productsService.findOne(id)
	}

	/**
	 * @param input ProviderInputDto --> Payload send to create object
	 * Create one product
	 * @return Promise<ProductResponseDto>
	 */
	@Mutation(() => ProductResponseDto)
	async createProduct(@Args("input") input: ProductInputDto): Promise<ProductResponseDto> {
		return await this.productsService.create(input)
	}

	/**
	 * Create all products
	 * @return Promise<ProductResponseDto>
	 */
	@Mutation(() => ProductResponseDto)
	async createAllProduct(): Promise<ProductResponseDto> {
		return this.productsService.createAll(providers)
	}

	/**
	 * @param id Number --> Delete a product by id
	 * Delete a product
	 * @return Promise<ProductResponseDto>
	 */
	@Mutation(() => ProductResponseDto)
	async deleteProduct(@Args("id") id: number): Promise<ProductResponseDto> {
		return this.productsService.delete(id)
	}

	/**
	 * Delete all products
	 * @return Promise<ProductResponseDto>
	 */
	@Mutation(() => ProductResponseDto)
	async deleteAllProduct(): Promise<ProductResponseDto> {
		return this.productsService.deleteAll()
	}

	/**
	 * @param input ProviderInputDto --> Payload send to modify object
	 * Update a product
	 * @return Promise<ProductResponseDto>
	 */
	@Mutation(() => ProductResponseDto)
	async updateProduct(@Args("input") input: ProductInputDto): Promise<ProductResponseDto> {
		return this.productsService.update(input)
	}
}
