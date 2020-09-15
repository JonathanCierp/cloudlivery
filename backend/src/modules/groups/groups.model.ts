import { ObjectType, Field } from "@nestjs/graphql"
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	CreateDateColumn,
	ManyToMany,
	JoinTable
} from "typeorm"
import { RayonsModel } from "../rayons/rayons.model"

@ObjectType()
@Entity("groups")
export class GroupsModel {
	@Field({ nullable: true })
	@PrimaryGeneratedColumn()
	id: number

	@Field(type => [RayonsModel], { nullable: true })
	@ManyToMany(type => RayonsModel, { nullable: true, cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
	@JoinTable()
	rayons?: RayonsModel[]

	@Field()
	@Column({ length: 255, unique: true })
	label: string

	@Field()
	@Column({ length: 255, unique: true })
	slug: string

	@Field()
	@Column({ length: 255 })
	type: string

	@Field()
	@Column({ length: 255 })
	urlCarrefour: string

	@Field()
	@Column({ length: 255 })
	urlAuchan: string

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