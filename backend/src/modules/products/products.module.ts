import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProductsModel } from "./models/products.model"
import { ProductsResolver } from "./products.resolver"
import { ProductsService } from "./products.service"
import { ProductsImagesModel } from "./models/products-images.model";
import { ProvidersModel } from "../providers/providers.model";
import { BrandsModel } from "../brands/brands.model";
import { GroupsModel } from "../groups/groups.model";

@Module({
	imports: [TypeOrmModule.forFeature([ProvidersModel, BrandsModel, ProductsModel, ProductsImagesModel, GroupsModel])],
	providers: [ProductsResolver, ProductsService]
})
export class ProductsModule {
}