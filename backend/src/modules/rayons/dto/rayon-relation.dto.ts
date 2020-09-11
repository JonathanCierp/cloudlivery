import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RayonRelationDto {
	@Field({ nullable: true })
	id?: number

	@Field({ nullable: true })
	label?: string
}
