import { HttpStatus, Injectable } from "@nestjs/common"
import { AppResponseDto } from "./dto/app-response.dto"

@Injectable()
export class AppService {
	protected token: string = null
	protected code: number = HttpStatus.OK
	protected details: string = null
	protected message: string = null

	formattedResponse(): AppResponseDto {
		return {
			token: this.token,
			code: this.code,
			details: this.details,
			message: this.message
		}
	}
}
