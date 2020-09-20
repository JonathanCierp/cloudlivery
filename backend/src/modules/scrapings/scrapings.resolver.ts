import { Args, Mutation } from "@nestjs/graphql"
import { Inject } from "@nestjs/common"
import { ScrapingsService } from "./scrapings.service"
import { ScrapingResponseDto } from "./dto/scraping-response.dto";

export class ScrapingsResolver {
	constructor(@Inject(ScrapingsService) private scrapingsService: ScrapingsService) {
	}

	/**
	 * Scraping
	 * @return Promise<ScrapingResponseDto>
	 */
	@Mutation(() => ScrapingResponseDto)
	async scraping(): Promise<ScrapingResponseDto> {
		return this.scrapingsService.scraping()
	}

	@Mutation(() => ScrapingResponseDto)
	async algoliaIndexing(@Args("type") type?: string): Promise<ScrapingResponseDto> {
		return this.scrapingsService.algoliaIndexing(type)
	}
}
