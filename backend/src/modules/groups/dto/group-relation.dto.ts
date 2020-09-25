import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class GroupRelationDto {
	@Field({ nullable: true })
	id?: number

	@Field()
	label: string

	@Field()
	slug: string

	@Field()
	type: string

	@Field()
	urlCarrefour: string

	@Field()
	urlAuchan: string
}
