import { InputType, Field } from "@nestjs/graphql"
import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProvidersModel } from "../../providers/providers.model";
import { BrandsModel } from "../../brands/brands.model";
import { ProductsImagesModel } from "../models/products-images.model";

@InputType()
export class ProductInputDto {
	@Field({ nullable: true })
	id?: number

	@Field(type => ProvidersModel)
	provider: ProvidersModel;

	@Field(type => BrandsModel)
	brand: BrandsModel;

	@Field(type => [ProductsImagesModel], { nullable: true })
	productImages: ProductsImagesModel[];

	@Field()
	label: string

	@Field()
	ean: string

	@Field()
	slug: string

	@Field({ nullable: true })
	uri?: string

	@Field({ nullable: true })
	packaging?: string

	@Field({ nullable: true })
	origin?: string

	@Field({ nullable: true })
	format?: string

	@Field({ nullable: true })
	price?: string

	@Field({ nullable: true })
	unitOfMeasure?: string

	@Field({ nullable: true })
	perUnitLabel?: string

	@Field({ nullable: true })
	taxMessage?: string

	@Field({ nullable: true })
	perUnit?: string
}