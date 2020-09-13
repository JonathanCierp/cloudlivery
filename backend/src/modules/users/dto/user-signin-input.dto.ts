import { InputType, Field } from "@nestjs/graphql"

@InputType()
export class UserSigninInputDto {
	@Field()
	email: string

	@Field()
	password: string
}