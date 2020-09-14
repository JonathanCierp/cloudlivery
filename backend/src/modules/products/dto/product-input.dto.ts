import { InputType, Field } from "@nestjs/graphql"

@InputType()
export class ProductInputDto {
	@Field({ nullable: true })
	id?: number
	@Field()
	label: string
	@Field({ nullable: true })
	prefixUrl?: string
}