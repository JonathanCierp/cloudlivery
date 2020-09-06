import { InputType, Field } from "@nestjs/graphql"

@InputType()
export class ProviderInputDto {
	@Field({ nullable: true })
	id?: number
	@Field()
	label: string
	@Field({ nullable: true })
	prefix_url?: string
}