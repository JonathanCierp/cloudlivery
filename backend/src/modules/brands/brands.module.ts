import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { BrandsModel } from "./brands.model"
import { BrandsResolver } from "./brands.resolver"
import { BrandsService } from "./brands.service"

@Module({
	imports: [TypeOrmModule.forFeature([BrandsModel])],
	providers: [BrandsResolver, BrandsService]
})
export class BrandsModule {
}