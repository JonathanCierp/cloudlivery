import { ObjectType, Field } from "@nestjs/graphql"
import { AppResponseDto } from "../../../dto/app-response.dto"
import { UsersModel } from "../users.model"

@ObjectType()
export class UserResponseDto extends AppResponseDto {

	@Field(type => UsersModel, { nullable: true })
	item?: UsersModel | undefined

	@Field(type => [UsersModel], { nullable: true })
	items?: UsersModel[] | undefined
}