import { InputType, Field, Int } from "@nestjs/graphql"

@InputType()
export class RayonInputDto {
	@Field({ nullable: true })
	id?: number
	@Field()
	label: string
	@Field()
	slug: string
	@Field({ nullable: true })
	uri?: string
	@Field({ nullable: true })
	code?: string
	@Field(type => Int, { nullable: true })
	level?: number
}