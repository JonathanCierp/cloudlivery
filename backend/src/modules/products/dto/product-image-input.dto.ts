import { InputType, Field } from "@nestjs/graphql"

@InputType()
export class ProductImageInputDto {
	@Field({ nullable: true })
	id?: number

	@Field()
	largest: string

	@Field({ nullable: true })
	size_1500x1500?: string

	@Field({ nullable: true })
	size_540x540?: string

	@Field({ nullable: true })
	size_380x380?: string

	@Field({ nullable: true })
	size_340x340?: string

	@Field({ nullable: true })
	size_340x240?: string

	@Field({ nullable: true })
	size_280x280?: string

	@Field({ nullable: true })
	size_195x195?: string

	@Field({ nullable: true })
	size_150x150?: string

	@Field({ nullable: true })
	size_43x43?: string
}