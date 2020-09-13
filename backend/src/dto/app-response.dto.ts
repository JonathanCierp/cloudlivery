import { ObjectType, Field } from "@nestjs/graphql"
import { HttpStatus } from "@nestjs/common"

@ObjectType()
export class AppResponseDto {
	@Field({ nullable: true })
	token?: string

	@Field({ defaultValue: HttpStatus.OK, nullable: true })
	code?: number

	@Field({ defaultValue: null, nullable: true })
	details?: string

	@Field({ defaultValue: null, nullable: true })
	message?: string


}