import { AppInterface } from "../../app.interface"
import { GroupResponseDto } from "./dto/group-response.dto"
import { GroupInputDto } from "./dto/group-input.dto"

export interface GroupsInterface extends AppInterface {

	formattedResponseGroups(): GroupResponseDto

	findAll(): Promise<GroupResponseDto>

	findOne(id: number): Promise<GroupResponseDto>

	create(groupInputDto: GroupInputDto): Promise<GroupResponseDto>

	createAll(groupInputDto: GroupInputDto[]): Promise<GroupResponseDto>

	delete(id: number): Promise<GroupResponseDto>

	deleteAll(): Promise<GroupResponseDto>

	update(groupInputDto: GroupInputDto): Promise<GroupResponseDto>
}