import { AppInterface } from "../../app.interface"
import { ProductResponseDto } from "./dto/product-response.dto"
import { ProductInputDto } from "./dto/product-input.dto"

export interface ProductsInterface extends AppInterface {

	formattedResponseProducts(): ProductResponseDto

	findAll(): Promise<ProductResponseDto>

	findOne(id: number): Promise<ProductResponseDto>

	create(productInputDto: ProductInputDto): Promise<ProductResponseDto>

	createAll(productInputDto: ProductInputDto[]): Promise<ProductResponseDto>

	delete(id: number): Promise<ProductResponseDto>

	deleteAll(): Promise<ProductResponseDto>

	update(productInputDto: ProductInputDto): Promise<ProductResponseDto>
}