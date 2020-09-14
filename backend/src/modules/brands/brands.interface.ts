import { AppInterface } from "../../app.interface"
import { BrandResponseDto } from "./dto/brand-response.dto"
import { BrandInputDto } from "./dto/brand-input.dto"

export interface BrandsInterface extends AppInterface {

	formattedResponseBrands(): BrandResponseDto

	findAll(): Promise<BrandResponseDto>

	findOne(id: number): Promise<BrandResponseDto>

	create(brandInputDto: BrandInputDto): Promise<BrandResponseDto>

	createAll(brandInputDto: BrandInputDto[]): Promise<BrandResponseDto>

	delete(id: number): Promise<BrandResponseDto>

	deleteAll(): Promise<BrandResponseDto>

	update(brandInputDto: BrandInputDto): Promise<BrandResponseDto>
}