import { InputType, Field } from "@nestjs/graphql"
import { RayonRelationDto } from "../../rayons/dto/rayon-relation.dto";

@InputType()
export class GroupInputDto {
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

	@Field(type => [RayonRelationDto], { nullable: true })
	rayons?: RayonRelationDto[];
}