import { ObjectType, Field } from "@nestjs/graphql"
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	CreateDateColumn,
	OneToMany,
	ManyToOne
} from "typeorm"
import { ProductsImagesModel } from "./products-images.model";
import { ProvidersModel } from "../../providers/providers.model";
import { BrandsModel } from "../../brands/brands.model";

@ObjectType()
@Entity("products")
export class ProductsModel {
	@Field({ nullable: true })
	@PrimaryGeneratedColumn()
	id: number

	@Field(type => ProvidersModel)
	@ManyToOne(type => ProvidersModel, provider => provider.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
	provider: ProvidersModel;

	@Field(type => BrandsModel)
	@ManyToOne(type => BrandsModel, brand => brand.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
	brand: BrandsModel;

	@Field(type => [ProductsImagesModel], { nullable: true })
	@OneToMany(type => ProductsImagesModel, productImage => productImage.product, { cascade: true })
	productImages: ProductsImagesModel[];

	@Field()
	@Column({ length: 255 })
	label: string

	@Field()
	@Column({ length: 255 })
	ean: string

	@Field()
	@Column({ length: 255, unique: true })
	slug: string

	@Field({ nullable: true })
	@Column({ length: 255, nullable: true })
	uri?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	packaging?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	origin?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	format?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	price?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	unitOfMeasure?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	perUnitLabel?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	taxMessage?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	perUnit?: string

	@Field({ nullable: true })
	@Column()
	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
		onUpdate: "CURRENT_TIMESTAMP(6)",
		nullable: true
	})
	public updatedAt?: Date

	@Field({ nullable: true })
	@Column()
	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", nullable: true })
	public createdAt?: Date
}