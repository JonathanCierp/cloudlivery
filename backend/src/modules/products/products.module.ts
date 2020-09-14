import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProductsModel } from "./models/products.model"
import { ProductsResolver } from "./products.resolver"
import { ProductsService } from "./products.service"
import { ProductsImagesModel } from "./models/products-images.model";

@Module({
	imports: [TypeOrmModule.forFeature([ProductsModel, ProductsImagesModel])],
	providers: [ProductsResolver, ProductsService]
})
export class ProductsModule {
}