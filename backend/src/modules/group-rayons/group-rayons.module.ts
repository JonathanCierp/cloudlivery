import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { GroupRayonsResolver } from "./group-rayons.resolver"
import { GroupRayonsSchema } from "./group-rayons.schema"
import { GroupRayonsService } from "./group-rayons.service"

@Module({
	imports: [MongooseModule.forFeature([{name: "GroupRayon", schema: GroupRayonsSchema}])],
	providers: [GroupRayonsResolver, GroupRayonsService],
})
export class GroupRayonsModule {
}