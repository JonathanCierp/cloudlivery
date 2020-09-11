import { AppInterface } from "../../app.interface";
import { ProviderResponseDto } from "./dto/provider-response.dto";
import { ProviderInputDto } from "./dto/provider-input.dto";

export interface ProvidersInterface extends AppInterface{

	formattedResponseProviders(): ProviderResponseDto

	findAll(): Promise<ProviderResponseDto>

	findOne(id: number): Promise<ProviderResponseDto>

	create(providerInputDto: ProviderInputDto): Promise<ProviderResponseDto>

	createAll(providerInputDtos: ProviderInputDto[]): Promise<ProviderResponseDto>

	delete(id: number): Promise<ProviderResponseDto>

	deleteAll(): Promise<ProviderResponseDto>

	update(item: ProviderInputDto): Promise<ProviderResponseDto>
}