import { ObjectType, Field, ID } from "@nestjs/graphql"
/*import { RayonTypeDto } from "../../rayons/dto/rayon-type.dto"*/

@ObjectType()
export class GroupRayonTypeDto {
	@Field(() => ID)
	id: string
	@Field()
	label: string
	@Field()
	slug: string
	@Field({ nullable: true })
	type?: string
	@Field({ nullable: true })
	urlCarrefour?: string
	@Field({ nullable: true })
	urlAuchan?: string
	/*@Field(type => [RayonTypeDto])
	rayons?: RayonTypeDto[]*/
}
