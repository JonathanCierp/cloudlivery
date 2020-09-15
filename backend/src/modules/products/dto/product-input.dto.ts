import { InputType, Field } from "@nestjs/graphql"
import { ProviderInputDto } from "../../providers/dto/provider-input.dto"
import { BrandInputDto } from "../../brands/dto/brand-input.dto"
import { ProductImageInputDto } from "./product-image-input.dto"

@InputType()
export class ProductInputDto {
	@Field({ nullable: true })
	id?: number

	@Field(type => ProviderInputDto)
	provider: ProviderInputDto;

	@Field(type => BrandInputDto)
	brand: BrandInputDto;

	@Field(type => [ProductImageInputDto], { nullable: true })
	productImages?: ProductImageInputDto[];

	@Field()
	label: string

	@Field()
	ean: string

	@Field()
	slug: string

	@Field({ nullable: true })
	uri?: string

	@Field({ nullable: true })
	packaging?: string

	@Field({ nullable: true })
	origin?: string

	@Field({ nullable: true })
	format?: string

	@Field({ nullable: true })
	price?: string

	@Field({ nullable: true })
	unitOfMeasure?: string

	@Field({ nullable: true })
	perUnitLabel?: string

	@Field({ nullable: true })
	taxMessage?: string

	@Field({ nullable: true })
	perUnit?: string
}