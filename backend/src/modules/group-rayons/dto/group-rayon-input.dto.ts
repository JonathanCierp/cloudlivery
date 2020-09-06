import { InputType, Field } from "@nestjs/graphql"
import { RayonInputDto } from "../../rayons/dto/rayon-input.dto"

@InputType()
export class GroupRayonInputDto {
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
	@Field(type => [RayonInputDto])
	rayons?: RayonInputDto[]
}
