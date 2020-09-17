import { Module } from "@nestjs/common"
import { ScrapingsResolver } from "./scrapings.resolver"
import { ScrapingsService } from "./scrapings.service"

@Module({
	providers: [ScrapingsResolver, ScrapingsService]
})
export class ScrapingsModule {
}