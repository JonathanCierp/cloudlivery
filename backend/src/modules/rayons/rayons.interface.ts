import { AppInterface } from "../../app.interface"
import { RayonResponseDto } from "./dto/rayon-response.dto"
import { RayonInputDto } from "./dto/rayon-input.dto"

export interface RayonsInterface extends AppInterface {

	formattedResponseRayons(): RayonResponseDto

	findAll(): Promise<RayonResponseDto>

	findOne(id: number): Promise<RayonResponseDto>

	create(rayonInputDto: RayonInputDto): Promise<RayonResponseDto>

	createAll(createRayonDto: RayonInputDto[]): Promise<RayonResponseDto>

	delete(id: number): Promise<RayonResponseDto>

	deleteAll(): Promise<RayonResponseDto>

	update(rayonInputDto: RayonInputDto): Promise<RayonResponseDto>
}