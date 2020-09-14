import { InputType, Field } from "@nestjs/graphql"

@InputType()
export class BrandInputDto {
	@Field({ nullable: true })
	id?: number
	@Field()
	label: string
}