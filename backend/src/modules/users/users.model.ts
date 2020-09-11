import { ObjectType, Field } from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from "typeorm"

@ObjectType()
@Entity("users")
export class UsersModel {
	@Field({nullable: true})
	@PrimaryGeneratedColumn()
	id: number

	@Field({nullable: true})
	@Column({length: 1000, unique: true, nullable: true})
	google_id: string

	@Field()
	@Column({length: 255, unique: true})
	email: string

	@Field()
	@Column({length: 255})
	civilite: string

	@Field()
	@Column({length: 255})
	firstname: string

	@Field()
	@Column({length: 255})
	lastname: string

	@Field({nullable: true})
	@Column("text", {nullable: true})
	password: string

	@Field({nullable: true})
	@Column()
	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
		onUpdate: "CURRENT_TIMESTAMP(6)",
		nullable: true
	})
	updatedAt?: Date

	@Field({nullable: true})
	@Column()
	@CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", nullable: true})
	createdAt?: Date
}