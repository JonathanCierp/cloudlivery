import { ObjectType, Field } from "@nestjs/graphql"
import { AppResponseDto } from "../../../dto/app-response.dto"
import { ProvidersModel } from "../providers.model"

@ObjectType()
export class ProviderResponseDto extends AppResponseDto {

	@Field(type => ProvidersModel, { nullable: true })
	item?: ProvidersModel | undefined

	@Field(type => [ProvidersModel], { nullable: true })
	items?: ProvidersModel[] | undefined
}