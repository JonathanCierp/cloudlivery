import { ObjectType, Field, Int } from "@nestjs/graphql"

@ObjectType()
export class UserPayloadDto {
	@Field(() => Int)
	userId: number

	@Field()
	type: string

	@Field(() => Int)
	iat: number

	@Field(() => Int)
	exp: number

	@Field()
	aud: string

	@Field()
	iss: string

	@Field()
	sub: string

	@Field()
	jti: string
}