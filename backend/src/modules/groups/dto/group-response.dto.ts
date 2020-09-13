import { ObjectType, Field } from "@nestjs/graphql"
import { AppResponseDto } from "../../../dto/app-response.dto"
import { GroupsModel } from "../groups.model"

@ObjectType()
export class GroupResponseDto extends AppResponseDto {

	@Field(type => GroupsModel, { nullable: true })
	item?: GroupsModel | undefined

	@Field(type => [GroupsModel], { nullable: true })
	items?: GroupsModel[] | undefined
}