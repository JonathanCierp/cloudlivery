import { InputType, Field } from "@nestjs/graphql"

@InputType()
export class UserInputDto {
	@Field({ nullable: true })
	id?: number

	@Field({nullable: true})
	googleId: string

	@Field()
	email: string

	@Field()
	civilite: string

	@Field()
	firstname: string

	@Field()
	lastname: string

	@Field({nullable: true})
	password: string
}