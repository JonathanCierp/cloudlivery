import { ObjectType, Field } from "@nestjs/graphql"
import { AppResponseDto } from "../../../dto/app-response.dto"
import { BrandsModel } from "../brands.model"

@ObjectType()
export class BrandResponseDto extends AppResponseDto {

	@Field(type => BrandsModel, { nullable: true })
	item?: BrandsModel | undefined

	@Field(type => [BrandsModel], { nullable: true })
	items?: BrandsModel[] | undefined
}