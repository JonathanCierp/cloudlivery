import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GroupsModel } from "./groups.model"
import { GroupsResolver } from "./groups.resolver"
import { GroupsService } from "./groups.service"
import { RayonsModel } from "../rayons/rayons.model";

@Module({
	imports: [TypeOrmModule.forFeature([GroupsModel, RayonsModel])],
	providers: [GroupsResolver, GroupsService]
})
export class GroupsModule {
}