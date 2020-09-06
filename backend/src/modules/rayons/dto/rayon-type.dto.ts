import { ObjectType, Field, ID, Int } from "@nestjs/graphql"

@ObjectType()
export class RayonTypeDto {
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