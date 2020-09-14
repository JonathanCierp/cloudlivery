import { ObjectType, Field } from "@nestjs/graphql"
import { AppResponseDto } from "../../../dto/app-response.dto"
import { ProductsModel } from "../models/products.model"

@ObjectType()
export class ProductResponseDto extends AppResponseDto {

	@Field(type => ProductsModel, { nullable: true })
	item?: ProductsModel | undefined

	@Field(type => [ProductsModel], { nullable: true })
	items?: ProductsModel[] | undefined
}