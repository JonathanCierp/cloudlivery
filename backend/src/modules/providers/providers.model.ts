import { ObjectType, Field } from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToMany } from "typeorm"
import { ProductsModel } from "../products/models/products.model";

@ObjectType()
@Entity("providers")
export class ProvidersModel {
	@Field({ nullable: true })
	@PrimaryGeneratedColumn()
	id: number

	@OneToMany(type => ProductsModel, product => product.provider)
	products: ProductsModel[];

	@Field()
	@Column({ length: 255, unique: true })
	label: string

	@Field({ nullable: true })
	@Column({ length: 255, nullable: true })
	prefixUrl: string

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