import { Module } from "@nestjs/common"
import { ScrapingsResolver } from "./scrapings.resolver"
import { ScrapingsService } from "./scrapings.service"
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProvidersModel } from "../providers/providers.model";
import { BrandsModel } from "../brands/brands.model";
import { ProductsModel } from "../products/models/products.model";
import { ProductsImagesModel } from "../products/models/products-images.model";
import { GroupsModel } from "../groups/groups.model";

@Module({
	imports: [TypeOrmModule.forFeature([ProductsModel, ProductsImagesModel, ProvidersModel, BrandsModel, GroupsModel])],
	providers: [ScrapingsResolver, ScrapingsService]
})
export class ScrapingsModule {
}