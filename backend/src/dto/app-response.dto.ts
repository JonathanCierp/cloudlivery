import { ObjectType, Field } from "@nestjs/graphql"
import { HttpStatus } from "@nestjs/common";

@ObjectType()
export class AppResponseDto {
	@Field({ defaultValue: null, nullable: true })
	message?: string

	@Field({ defaultValue: null, nullable: true })
	details?: string

	@Field({ defaultValue: HttpStatus.OK, nullable: true })
	code?: number
}