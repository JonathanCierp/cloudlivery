import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { RayonsModel } from "./rayons.model"
import { RayonsResolver } from "./rayons.resolver"
import { RayonsService } from "./rayons.service"

@Module({
	imports: [TypeOrmModule.forFeature([RayonsModel])],
	providers: [RayonsResolver, RayonsService]
})
export class RayonsModule {
}