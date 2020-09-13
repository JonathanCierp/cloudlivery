import { ObjectType, Field } from "@nestjs/graphql"
import { AppResponseDto } from "../../../dto/app-response.dto"
import { RayonsModel } from "../rayons.model"

@ObjectType()
export class RayonResponseDto extends AppResponseDto {

	@Field(type => RayonsModel, { nullable: true })
	item?: RayonsModel | undefined

	@Field(type => [RayonsModel], { nullable: true })
	items?: RayonsModel[] | undefined
}