import { ObjectType, Field, Int } from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from "typeorm"

@ObjectType()
@Entity("rayons")
export class RayonsModel {
	@Field({nullable: true})
	@PrimaryGeneratedColumn()
	id: number

	@Field()
	@Column({length: 255, unique: true})
	label: string

	@Field()
	@Column({length: 255, unique: true})
	slug: string

	@Field()
	@Column({length: 255})
	uri: string

	@Field()
	@Column({length: 255})
	code: string

	@Field(type => Int)
	@Column()
	level: number

	@Field({nullable: true})
	@Column()
	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
		onUpdate: "CURRENT_TIMESTAMP(6)",
		nullable: true
	})
	public updatedAt?: Date

	@Field({nullable: true})
	@Column()
	@CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", nullable: true})
	public createdAt?: Date
}