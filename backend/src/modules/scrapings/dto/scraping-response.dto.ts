import { Field, ObjectType } from "@nestjs/graphql"
import { AppResponseDto } from "../../../dto/app-response.dto"
import { ProductsModel } from "../../products/models/products.model";

@ObjectType()
export class ScrapingResponseDto extends AppResponseDto {
	@Field(type => ProductsModel, { nullable: true })
	item?: ProductsModel | undefined

	@Field(type => [ProductsModel], { nullable: true })
	items?: ProductsModel[] | undefined
}