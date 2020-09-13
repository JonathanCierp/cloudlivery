import { AppInterface } from "../../app.interface"
import { UserResponseDto } from "./dto/user-response.dto"
import { UserInputDto } from "./dto/user-input.dto"

export interface UsersInterface extends AppInterface {

	formattedResponseUsers(): UserResponseDto

	/*findAll(): Promise<UserResponseDto>

	findOne(id: number): Promise<UserResponseDto>

	create(userInputDto: UserInputDto): Promise<UserResponseDto>

	createAll(userInputDto: UserInputDto[]): Promise<UserResponseDto>

	delete(id: number): Promise<UserResponseDto>

	deleteAll(): Promise<UserResponseDto>

	update(userInputDto: UserInputDto): Promise<UserResponseDto>*/
}