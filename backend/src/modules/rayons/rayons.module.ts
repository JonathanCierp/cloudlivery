import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { RayonsResolver } from "./rayons.resolver"
/*import { RayonsEntity } from "./rayons.schema"*/
import { RayonsService } from "./rayons.service"

@Module({
	/*imports: [MongooseModule.forFeature([{name: "Rayon", schema: RayonsEntity}])],*/
	providers: [RayonsResolver, RayonsService],
})
export class RayonsModule {
}