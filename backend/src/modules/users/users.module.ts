import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersModel } from "./users.model"
import { UsersResolver } from "./users.resolver"
import { UsersService } from "./users.service"

@Module({
	imports: [TypeOrmModule.forFeature([UsersModel])],
	providers: [UsersResolver, UsersService]
})
export class UsersModule {
}