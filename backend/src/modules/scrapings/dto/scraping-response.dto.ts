import { ObjectType } from "@nestjs/graphql"
import { AppResponseDto } from "../../../dto/app-response.dto"

@ObjectType()
export class ScrapingResponseDto extends AppResponseDto {

}