import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProvidersModel } from "./providers.model"
import { ProvidersResolver } from "./providers.resolver"
import { ProvidersService } from "./providers.service"

@Module({
	imports: [TypeOrmModule.forFeature([ProvidersModel])],
	providers: [ProvidersResolver, ProvidersService]
})
export class ProvidersModule {
}