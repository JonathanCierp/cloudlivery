import { ObjectType, Field } from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, ManyToOne } from "typeorm"
import { ProductsModel } from "./products.model";

@ObjectType()
@Entity("products_images")
export class ProductsImagesModel {
	@Field({ nullable: true })
	@PrimaryGeneratedColumn()
	id: number

	@Field()
	@Column({ length: 255 })
	largest: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	size_1500x1500?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	size_540x540?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	size_380x380?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	size_340x340?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	size_340x240?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	size_280x280?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	size_195x195?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	size_150x150?: string

	@Field({ nullable: true })
	@Column({ length: 255 , nullable: true})
	size_43x43?: string

	@ManyToOne(type => ProductsModel, product => product.productImages)
	product: ProductsModel;

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